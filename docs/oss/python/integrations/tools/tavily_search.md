---
title: Tavily 搜索
---
[Tavily](https://tavily.com/) 是一个专为 AI 智能体（LLMs）构建的搜索引擎，能够快速提供实时、准确且基于事实的结果。Tavily 提供两个关键端点，其中之一是搜索（Search）端点，该端点提供专为 LLMs 和 RAG 定制的搜索结果。

本指南提供了快速入门 Tavily [工具](/oss/integrations/tools/) 的概述。关于 Tavily 工具的完整说明，您可以在 [API 参考](https://v03.api.js.langchain.com/modules/_langchain_tavily.html) 中找到更详细的文档。

## 概述

### 集成详情

| 类 | 包 | [PY 支持](https://python.langchain.com/docs/integrations/tools/tavily_search/) | 版本 |
| :--- | :--- | :---: | :---: |
| [TavilySearch](https://api.js.langchain.com/classes/_langchain_tavily.TavilySearch.html) | [`@langchain/tavily`](https://www.npmjs.com/package/@langchain/tavily) | ✅ |  ![NPM - Version](https://img.shields.io/npm/v/@langchain/tavily?style=flat-square&label=%20&) |

## 设置

该集成位于 `@langchain/tavily` 包中，您可以按如下所示安装：

::: code-group

```bash [npm]
npm install @langchain/tavily @langchain/core
```

```bash [yarn]
yarn add @langchain/tavily @langchain/core
```

```bash [pnpm]
pnpm add @langchain/tavily @langchain/core
```

:::

### 凭证

请在此处 [设置 API 密钥](https://app.tavily.com) 并将其设置为名为 `TAVILY_API_KEY` 的环境变量。

```typescript
process.env.TAVILY_API_KEY = "YOUR_API_KEY"
```

为了获得最佳的观测性，设置 [LangSmith](https://smith.langchain.com/) 也很有帮助（但不是必需的）：

```typescript
process.env.LANGSMITH_TRACING="true"
process.env.LANGSMITH_API_KEY="your-api-key"
```

## 实例化

您可以像这样导入并实例化 `TavilySearch` 工具：

```typescript
import { TavilySearch } from "@langchain/tavily";

const tool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  // includeAnswer: false,
  // includeRawContent: false,
  // includeImages: false,
  // includeImageDescriptions: false,
  // searchDepth: "basic",
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});
```

## 调用

### [使用参数直接调用](/oss/langchain/tools)

Tavily 搜索工具在调用时接受以下参数：

* `query` (必需)：一个自然语言搜索查询

* 以下参数也可以在调用时设置：`includeImages`、`searchDepth`、`timeRange`、`includeDomains`、`excludeDomains`、`includeImages`。

* 出于可靠性和性能原因，某些影响响应大小的参数无法在调用时修改：`includeAnswer` 和 `includeRawContent`。这些限制可以防止意外的上下文窗口问题并确保结果的一致性。

```typescript
await tool.invoke({
  query: "what is the current weather in SF?"
});
```

### [使用 ToolCall 调用](/oss/langchain/tools)

我们也可以使用模型生成的 `ToolCall` 来调用该工具，在这种情况下，将返回一个 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>：

```typescript
// 这通常由模型生成，但为了演示目的，我们将直接创建一个工具调用。
const modelGeneratedToolCall = {
  args: {
    query: "what is the current weather in SF?"
  },
  id: "1",
  name: tool.name,
  type: "tool_call",
}

await tool.invoke(modelGeneratedToolCall)
```

## 链式调用

我们可以通过首先将工具绑定到一个 [工具调用模型](/oss/langchain/tools/)，然后在链中使用它：

```typescript
// @lc-docs-hide-cell

import { ChatOpenAI } from "@langchain/openai"

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
})
```

```typescript
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";

const prompt = ChatPromptTemplate.fromMessages(
  [
    ["system", "You are a helpful assistant."],
    ["placeholder", "{messages}"],
  ]
)

const llmWithTools = llm.bindTools([tool]);

const chain = prompt.pipe(llmWithTools);

const toolChain = RunnableLambda.from(
  async (userInput: string, config) => {
    const humanMessage = new HumanMessage(userInput,);
    const aiMsg = await chain.invoke({
      messages: [new HumanMessage(userInput)],
    }, config);
    const toolMsgs = await tool.batch(aiMsg.tool_calls, config);
    return chain.invoke({
      messages: [humanMessage, aiMsg, ...toolMsgs],
    }, config);
  }
);

const toolChainResult = await toolChain.invoke("what is the current weather in sf?");
```

```typescript
const { tool_calls, content } = toolChainResult;

console.log("AIMessage", JSON.stringify({
  tool_calls,
  content,
}, null, 2));
```

## 智能体

有关如何在智能体中使用 LangChain 工具的指南，请参阅 [LangGraph.js](https://langchain-ai.github.io/langgraphjs/how-tos/#tool-calling) 文档。

---

## API 参考

有关所有 Tavily Search API 功能和配置的详细文档，请前往 API 参考：

[docs.tavily.com/documentation/api-reference/endpoint/search](https://docs.tavily.com/documentation/api-reference/endpoint/search)

## 相关

[工具文档](/oss/langchain/tools)
