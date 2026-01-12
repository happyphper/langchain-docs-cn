---
title: 使用 LangGraph 构建自定义 RAG 代理
sidebarTitle: Custom RAG agent
---
## 概述

在本教程中，我们将使用 LangGraph 构建一个[检索](/oss/javascript/langchain/retrieval)智能体。

LangChain 提供了内置的[智能体](/oss/javascript/langchain/agents)实现，这些实现使用了 [LangGraph](/oss/javascript/langgraph/overview) 原语。如果需要更深度的定制，可以直接在 LangGraph 中实现智能体。本指南演示了一个检索智能体的示例实现。当你希望 LLM 决定是从向量存储中检索上下文还是直接响应用户时，[检索](/oss/javascript/langchain/retrieval)智能体非常有用。

在本教程结束时，我们将完成以下工作：

1.  获取并预处理将用于检索的文档。
2.  为这些文档建立语义搜索索引，并为智能体创建一个检索器工具。
3.  构建一个能够决定何时使用检索器工具的智能 RAG 系统。

![混合 RAG](/images/langgraph-hybrid-rag-tutorial.png)

### 概念

我们将涵盖以下概念：

-   使用[文档加载器](/oss/javascript/integrations/document_loaders)、[文本分割器](/oss/javascript/integrations/splitters)、[嵌入模型](/oss/javascript/integrations/text_embedding)和[向量存储](/oss/javascript/integrations/vectorstores)进行[检索](/oss/javascript/langchain/retrieval)
-   LangGraph 的[图 API](/oss/javascript/langgraph/graph-api)，包括状态、节点、边和条件边。

## 设置

让我们下载所需的包并设置 API 密钥：

::: code-group

```bash [npm]
npm install @langchain/langgraph @langchain/openai @langchain/community @langchain/textsplitters
```

```bash [pnpm]
pnpm install @langchain/langgraph @langchain/openai @langchain/community @langchain/textsplitters
```

```bash [yarn]
yarn add @langchain/langgraph @langchain/openai @langchain/community @langchain/textsplitters
```

```bash [bun]
bun add @langchain/langgraph @langchain/openai @langchain/community @langchain/textsplitters
```

:::

<Tip>

注册 LangSmith 以快速发现问题并提升你的 LangGraph 项目性能。[LangSmith](https://docs.smith.langchain.com) 让你能够使用追踪数据来调试、测试和监控你使用 LangGraph 构建的 LLM 应用。

</Tip>

## 1. 预处理文档

1.  获取用于我们 RAG 系统的文档。我们将使用 [Lilian Weng 的优秀博客](https://lilianweng.github.io/) 中最近的三篇文章。我们将首先使用 `CheerioWebBaseLoader` 获取页面内容：
```typescript
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const urls = [
  "https://lilianweng.github.io/posts/2023-06-23-agent/",
  "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
  "https://lilianweng.github.io/posts/2023-10-25-adv-attack-llm/",
];

const docs = await Promise.all(
  urls.map((url) => new CheerioWebBaseLoader(url).load()),
);
```
2.  将获取的文档分割成更小的块，以便索引到我们的向量存储中：
```typescript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const docsList = docs.flat();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});
const docSplits = await textSplitter.splitDocuments(docsList);
```

## 2. 创建检索器工具

现在我们有了分割后的文档，可以将它们索引到一个用于语义搜索的向量存储中。

1.  使用内存向量存储和 OpenAI 嵌入模型：
```typescript
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const vectorStore = await MemoryVectorStore.fromDocuments(
  docSplits,
  new OpenAIEmbeddings(),
);

const retriever = vectorStore.asRetriever();
```
2.  使用 LangChain 预置的 `createRetrieverTool` 创建检索器工具：
```typescript
import { createRetrieverTool } from "@langchain/classic/tools/retriever";

const tool = createRetrieverTool(
  retriever,
  {
    name: "retrieve_blog_posts",
    description:
      "搜索并返回关于 Lilian Weng 在 LLM 智能体、提示工程和 LLM 对抗攻击方面的博客文章信息。",
  },
);
const tools = [tool];
```

## 3. 生成查询

现在我们将开始为我们的智能 RAG 图构建组件（[节点](/oss/javascript/langgraph/graph-api#nodes) 和 [边](/oss/javascript/langgraph/graph-api#edges)）。

1.  构建 `generateQueryOrRespond` 节点。它将调用一个 LLM，根据当前的图状态（消息列表）生成响应。根据输入消息，它将决定是使用检索器工具进行检索，还是直接响应用户。注意，我们通过 `.bindTools` 让聊天模型能够访问我们之前创建的 `tools`：
```typescript
import { ChatOpenAI } from "@langchain/openai";

async function generateQueryOrRespond(state) {
  const { messages } = state;
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  }).bindTools(tools);  // [!code highlight]

  const response = await model.invoke(messages);
  return {
    messages: [response],
  };
}
```
2.  在一个随机输入上尝试：
```typescript
import { HumanMessage } from "@langchain/core/messages";

const input = { messages: [new HumanMessage("hello!")] };
const result = await generateQueryOrRespond(input);
console.log(result.messages[0]);
```
  **输出：**
```
AIMessage {
  content: "Hello! How can I help you today?",
  tool_calls: []
}
```
3.  询问一个需要语义搜索的问题：
```typescript
const input = {
  messages: [
    new HumanMessage("What does Lilian Weng say about types of reward hacking?")
  ]
};
const result = await generateQueryOrRespond(input);
console.log(result.messages[0]);
```
  **输出：**
```
AIMessage {
  content: "",
  tool_calls: [
    {
      name: "retrieve_blog_posts",
      args: { query: "types of reward hacking" },
      id: "call_...",
      type: "tool_call"
    }
  ]
}
```

## 4. 评估文档

:::js
1.  添加一个节点——`gradeDocuments`——用于确定检索到的文档是否与问题相关。我们将使用一个带有 Zod 结构化输出的模型进行文档评估。我们还将添加一个[条件边](/oss/javascript/langgraph/graph-api#conditional-edges)——`checkRelevance`——它检查评估结果并返回要前往的节点名称（`generate` 或 `rewrite`）：
```typescript
import * as z from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage } from "@langchain/core/messages";

const prompt = ChatPromptTemplate.fromTemplate(
  `You are a grader assessing relevance of retrieved docs to a user question.
  Here are the retrieved docs:
  \n ------- \n
  {context}
  \n ------- \n
  Here is the user question: {question}
  If the content of the docs are relevant to the users question, score them as relevant.
  Give a binary score 'yes' or 'no' score to indicate whether the docs are relevant to the question.
  Yes: The docs are relevant to the question.
  No: The docs are not relevant to the question.`,
);

const gradeDocumentsSchema = z.object({
  binaryScore: z.string().describe("Relevance score 'yes' or 'no'"),  // [!code highlight]
})

async function gradeDocuments(state) {
  const { messages } = state;

  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  }).withStructuredOutput(gradeDocumentsSchema);

  const score = await prompt.pipe(model).invoke({
    question: messages.at(0)?.content,
    context: messages.at(-1)?.content,
  });

  if (score.binaryScore === "yes") {
    return "generate";
  }
  return "rewrite";
}
```
2.  在工具响应包含不相关文档的情况下运行此函数：
```typescript

  const input = {
messages: [
new HumanMessage("What does Lilian Weng say about types of reward hacking?"),
new AIMessage({
tool_calls: [
{
type: "tool_call",
name: "retrieve_blog_posts",
args: { query: "types of reward hacking" },
id: "1",
}
]
}),
new ToolMessage({
content: "meow",
tool_call_id: "1",
})
]
  }
  const result
