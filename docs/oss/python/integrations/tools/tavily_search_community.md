---
title: TavilySearchResults（已弃用）
---

<Info>

<strong>弃用通知</strong>

此工具已被弃用。请改用 `@langchain/tavily` 包中的 [TavilySearch](./tavily_search) 工具。

</Info>

[Tavily](https://tavily.com/) Search 是一个专为 LLM 智能体（Agent）量身定制的强大搜索 API。它能无缝集成多种数据源，确保提供优质、相关的搜索体验。

本指南提供了快速入门 Tavily [工具](/oss/integrations/tools/) 的概览。关于 Tavily 工具的完整说明，您可以在 [API 参考](https://v03.api.js.langchain.com/classes/_langchain_community.tools_tavily_search.TavilySearchResults.html) 中找到更详细的文档。

## 概述

### 集成详情

| 类 | 包 | [PY 支持](https://python.langchain.com/docs/integrations/tools/tavily_search/) | 版本 |
| :--- | :--- | :---: | :---: |
| [TavilySearchResults](https://api.js.langchain.com/classes/langchain_community_tools_tavily_search.TavilySearchResults.html) | [`@langchain/community`](https://www.npmjs.com/package/@langchain/community) | ✅ |  ![NPM - Version](https://img.shields.io/npm/v/@langchain/community?style=flat-square&label=%20&) |

## 设置

该集成位于 `@langchain/community` 包中，您可以按如下方式安装：

::: code-group

```bash [npm]
npm install @langchain/community @langchain/core
```

```bash [yarn]
yarn add @langchain/community @langchain/core
```

```bash [pnpm]
pnpm add @langchain/community @langchain/core
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

您可以像这样导入并实例化 `TavilySearchResults` 工具：

```typescript
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const tool = new TavilySearchResults({
  maxResults: 2,
  // ...
});
```

## 调用

### [使用参数直接调用](/oss/langchain/tools)

您可以直接调用该工具，如下所示：

```typescript
await tool.invoke({
  input: "what is the current weather in SF?",
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

关于如何在智能体中使用 LangChain 工具的指南，请参阅 [LangGraph.js](https://langchain-ai.github.io/langgraphjs/) 文档。

---

## API 参考

有关 `TavilySearchResults` 所有功能和配置的详细文档，请访问 API 参考：

[api.js.langchain.com/classes/langchain_community_tools_tavily_search.TavilySearchResults.html](https://api.js.langchain.com/classes/langchain_community_tools_tavily_search.TavilySearchResults.html)

## 相关

* [工具文档](/oss/langchain/tools)
