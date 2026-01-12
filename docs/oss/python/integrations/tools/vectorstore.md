---
title: VectorStoreToolkit
---
这将帮助您开始使用 [VectorStoreToolkit](/oss/python/langchain/tools#toolkits)。如需了解 VectorStoreToolkit 所有功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain.agents.VectorStoreToolkit.html)。

`VectorStoreToolkit` 是一个工具包，它接收一个向量存储（vector store），并将其转换为一个工具，然后可以被调用、传递给 LLM、智能体（agent）等。

## 设置

如果您希望从单个工具的运行中获得自动化追踪，您也可以通过取消下面的注释来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```typescript
process.env.LANGSMITH_TRACING="true"
process.env.LANGSMITH_API_KEY="your-api-key"
```

### 安装

此工具包位于 `langchain` 包中：

::: code-group

```bash [npm]
npm install langchain @langchain/core
```

```bash [yarn]
yarn add langchain @langchain/core
```

```bash [pnpm]
pnpm add langchain @langchain/core
```

:::

## 实例化

现在我们可以实例化我们的工具包。首先，我们需要定义将在工具包中使用的 LLM。

```typescript
// @lc-docs-hide-cell

import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
})
```

```typescript
import { VectorStoreToolkit, VectorStoreInfo } from "@langchain/classic/agents/toolkits"
import { OpenAIEmbeddings } from "@langchain/openai"
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";

// 加载一个文本文件作为我们的数据源。
const text = fs.readFileSync("../../../../../examples/state_of_the_union.txt", "utf8");

// 在插入到我们的存储之前，将文本分割成块
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);

const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());

const vectorStoreInfo: VectorStoreInfo = {
  name: "state_of_union_address",
  description: "the most recent state of the Union address",
  vectorStore,
};

const toolkit = new VectorStoreToolkit(vectorStoreInfo, llm);
```

## 工具

在这里，我们可以看到它将我们的向量存储转换成了一个工具：

```typescript
const tools = toolkit.getTools();

console.log(tools.map((tool) => ({
  name: tool.name,
  description: tool.description,
})))
```

```text
[
  {
    name: 'state_of_union_address',
    description: 'Useful for when you need to answer questions about state_of_union_address. Whenever you need information about the most recent state of the Union address you should ALWAYS use this. Input should be a fully formed question.'
  }
]
```

## 在智能体中使用

首先，确保已安装 LangGraph：

::: code-group

```bash [npm]
npm install @langchain/langgraph
```

```bash [yarn]
yarn add @langchain/langgraph
```

```bash [pnpm]
pnpm add @langchain/langgraph
```

:::

然后，实例化智能体：

```typescript
import { createAgent } from "@langchain/classic"

const agentExecutor = createAgent({ llm, tools });
```

```typescript
const exampleQuery = "What did biden say about Ketanji Brown Jackson is the state of the union address?"

const events = await agentExecutor.stream(
  { messages: [["user", exampleQuery]]},
  { streamMode: "values", }
)

for await (const event of events) {
  const lastMsg = event.messages[event.messages.length - 1];
  if (lastMsg.tool_calls?.length) {
    console.dir(lastMsg.tool_calls, { depth: null });
  } else if (lastMsg.content) {
    console.log(lastMsg.content);
  }
}
```

```text
[
  {
    name: 'state_of_union_address',
    args: {
      input: 'What did Biden say about Ketanji Brown Jackson in the State of the Union address?'
    },
    type: 'tool_call',
    id: 'call_glJSWLNrftKHa92A6j8x4jhd'
  }
]
In the State of the Union address, Biden mentioned that he nominated Circuit Court of Appeals Judge Ketanji Brown Jackson, describing her as one of the nation’s top legal minds who will continue Justice Breyer’s legacy of excellence. He highlighted her background as a former top litigator in private practice, a former federal public defender, and noted that she comes from a family of public school educators and police officers. He also pointed out that she has received a broad range of support since her nomination.
In the State of the Union address, President Biden spoke about Ketanji Brown Jackson, stating that he nominated her as one of the nation’s top legal minds who will continue Justice Breyer’s legacy of excellence. He highlighted her experience as a former top litigator in private practice and a federal public defender, as well as her background coming from a family of public school educators and police officers. Biden also noted that she has received a broad range of support since her nomination.
```

---

## API 参考

如需了解 VectorStoreToolkit 所有功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain.agents.VectorStoreToolkit.html)。
