---
title: DuckDuckGo搜索
---
本笔记本提供了快速入门 [DuckDuckGoSearch](/oss/integrations/tools/) 的概述。有关 DuckDuckGoSearch 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_community_tools_duckduckgo_search.DuckDuckGoSearch.html)。

DuckDuckGoSearch 提供了一个专注于隐私、专为 LLM 智能体设计的搜索 API。它能够与广泛的数据源无缝集成，同时优先考虑用户隐私和相关的搜索结果。

## 概述

### 集成详情

| 类 | 包 | [PY 支持](https://python.langchain.com/docs/integrations/tools/ddg/) | 版本 |
| :--- | :--- | :---: | :---: |
| [DuckDuckGoSearch](https://api.js.langchain.com/classes/langchain_community_tools_duckduckgo_search.DuckDuckGoSearch.html) | [`@langchain/community`](https://www.npmjs.com/package/@langchain/community) | ✅ |  ![NPM - Version](https://img.shields.io/npm/v/@langchain/community?style=flat-square&label=%20&) |

## 安装设置

该集成位于 `@langchain/community` 包中，同时需要 `duck-duck-scrape` 依赖：

::: code-group

```bash [npm]
npm install @langchain/community @langchain/core duck-duck-scrape
```

```bash [yarn]
yarn add @langchain/community @langchain/core duck-duck-scrape
```

```bash [pnpm]
pnpm add @langchain/community @langchain/core duck-duck-scrape
```

:::

### 凭证

为了获得最佳的观测性，设置 [LangSmith](https://smith.langchain.com/) 也很有帮助（但不是必需的）：

```typescript
process.env.LANGSMITH_TRACING="true"
process.env.LANGSMITH_API_KEY="your-api-key"
```

## 实例化

你可以像这样实例化一个 `DuckDuckGoSearch` 工具：

```typescript
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search"

const tool = new DuckDuckGoSearch({ maxResults: 1 })
```

## 调用

### [直接使用参数调用](/oss/langchain/tools)

```typescript
await tool.invoke("what is the current weather in sf?")
```

```json
[{"title":"San Francisco, CA Current Weather | AccuWeather","link":"https://www.accuweather.com/en/us/san-francisco/94103/current-weather/347629","snippet":"<b>Current</b> <b>weather</b> <b>in</b> San Francisco, CA. Check <b>current</b> conditions in San Francisco, CA with radar, hourly, and more."}]
```

### [使用 ToolCall 调用](/oss/langchain/tools)

我们也可以使用模型生成的 `ToolCall` 来调用工具，在这种情况下，将返回一个 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>：

```typescript
// 这通常由模型生成，但为了演示目的，我们将直接创建一个工具调用。
const modelGeneratedToolCall = {
  args: {
    input: "what is the current weather in sf?"
  },
  id: "tool_call_id",
  name: tool.name,
  type: "tool_call",
}
await tool.invoke(modelGeneratedToolCall)
```

```text
ToolMessage {
  "content": "[{\"title\":\"San Francisco, CA Weather Conditions | Weather Underground\",\"link\":\"https://www.wunderground.com/weather/us/ca/san-francisco\",\"snippet\":\"San Francisco <b>Weather</b> Forecasts. <b>Weather</b> Underground provides local & long-range <b>weather</b> forecasts, weatherreports, maps & tropical <b>weather</b> conditions for the San Francisco area.\"}]",
  "name": "duckduckgo-search",
  "additional_kwargs": {},
  "response_metadata": {},
  "tool_call_id": "tool_call_id"
}
```

## 链式调用

我们可以通过先将工具绑定到一个 [工具调用模型](/oss/langchain/tools/)，然后在链中使用它：

```typescript
// @lc-docs-hide-cell

import { ChatOpenAI } from "@langchain/openai"

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
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

const toolChainResult = await toolChain.invoke("how many people have climbed mount everest?");
```

```typescript
const { tool_calls, content } = toolChainResult;

console.log("AIMessage", JSON.stringify({
  tool_calls,
  content,
}, null, 2));
```

```text
AIMessage {
  "tool_calls": [],
  "content": "As of December 2023, a total of 6,664 different people have reached the summit of Mount Everest."
}
```

## 智能体

有关如何在智能体中使用 LangChain 工具的指南，请参阅 [LangGraph.js](https://langchain-ai.github.io/langgraphjs/) 文档。

---

## API 参考

有关 DuckDuckGoSearch 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_community_tools_duckduckgo_search.DuckDuckGoSearch.html)
