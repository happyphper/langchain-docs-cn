---
title: TavilyCrawl
---
[Tavily](https://tavily.com/) 是一个专为 AI 智能体（LLMs）构建的搜索引擎，能够快速提供实时、准确且基于事实的结果。Tavily 提供四个关键端点，其中之一是 Crawl（爬取）端点，它提供了一个基于图的网站遍历工具，可以并行探索数百条路径，并内置了提取和智能发现功能。

本指南提供了快速入门 Tavily [工具](/oss/integrations/tools/) 的概述。关于 Tavily 工具的完整解析，您可以在 [API 参考](https://v03.api.js.langchain.com/modules/_langchain_tavily.html) 中找到更详细的文档。

## 概述

### 集成详情

| 类 | 包 | [PY 支持](https://python.langchain.com/docs/integrations/tools/tavily_search/) | 版本 |
| :--- | :--- | :---: | :---: |
| [TavilyMap](https://api.js.langchain.com/classes/_langchain_tavily.TavilyCrawl.html) | [`@langchain/tavily`](https://www.npmjs.com/package/@langchain/tavily) | ✅ |  ![NPM - Version](https://img.shields.io/npm/v/@langchain/tavily?style=flat-square&label=%20&) |

## 设置

该集成位于 `@langchain/tavily` 包中，您可以按如下方式安装：

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

请在此处[设置](https://app.tavily.com)一个 API 密钥，并将其设置为名为 `TAVILY_API_KEY` 的环境变量。

```typescript
process.env.TAVILY_API_KEY = "YOUR_API_KEY"
```

为了获得最佳的观测性，设置 [LangSmith](https://smith.langchain.com/) 也很有帮助（但不是必需的）：

```typescript
process.env.LANGSMITH_TRACING="true"
process.env.LANGSMITH_API_KEY="your-api-key"
```

## 实例化

您可以像这样导入并实例化 `TavilyCrawl` 工具：

```typescript
import { TavilyCrawl } from "@langchain/tavily";

const tool = new TavilyCrawl({
  maxDepth: 3,
  maxBreadth: 50,
  // extractDepth: "basic",
  // format: "markdown",
  // limit: 100,
  // includeImages: false,
  // allowExternal: false,
});
```

## 调用

### [使用参数直接调用](/oss/langchain/tools)

Tavily 爬取工具在调用时接受以下参数：

* `url`（必需）：一个自然语言搜索查询

* 以下参数也可以在调用时设置：`instructions`、`selectPaths`、`selectDomains`、`excludePaths`、`excludeDomains`、`allowExternal`、`categories`。

```typescript
await tool.invoke({
  url: "https://docs.tavily.com"
});
```

### [使用 ToolCall 调用](/oss/langchain/tools)

我们也可以使用模型生成的 `ToolCall` 来调用该工具，在这种情况下，将返回一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>：

```typescript
// 这通常由模型生成，但为了演示目的，我们将直接创建一个工具调用。
const modelGeneratedToolCall = {
  args: {
    url: "https://docs.tavily.com"
  },
  id: "1",
  name: tool.name,
  type: "tool_call",
}

await tool.invoke(modelGeneratedToolCall)
```

## 链式调用

我们可以通过先将工具绑定到一个 [工具调用模型](/oss/langchain/tools/)，然后在链中使用它：

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

const toolChainResult = await toolChain.invoke("https://docs.tavily.com");
```

```typescript
const { tool_calls, content } = toolChainResult;

console.log("AIMessage", JSON.stringify({
  tool_calls,
  content,
}, null, 2));
```

## 智能体

关于如何在智能体中使用 LangChain 工具的指南，请参阅 [LangGraph.js](https://langchain-ai.github.io/langgraphjs/how-tos/#tool-calling) 文档。

---

## API 参考

有关所有 Tavily Crawl API 功能和配置的详细文档，请前往 API 参考：

[docs.tavily.com/documentation/api-reference/endpoint/crawl](https://docs.tavily.com/documentation/api-reference/endpoint/crawl)

## 相关

* [工具文档](/oss/langchain/tools)
