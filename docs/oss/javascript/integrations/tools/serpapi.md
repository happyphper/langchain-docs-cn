---
title: SerpApi
---
[SerpApi](https://serpapi.com/) 允许你将搜索引擎结果集成到你的 LLM 应用中。

本指南提供了 SerpApi [工具](/oss/integrations/tools/) 的快速入门概览。有关 `SerpAPI` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/_langchain_community.tools_serpapi.SerpAPI.html)。

## 概述

### 集成详情

| 类 | 包 | [PY 支持](https://python.langchain.com/docs/integrations/tools/serpapi/) | 版本 |
| :--- | :--- | :---: | :---: |
| [SerpAPI](https://api.js.langchain.com/classes/_langchain_community.tools_serpapi.SerpAPI.html) | [`@langchain/community`](https://www.npmjs.com/package/@langchain/community) | ✅ |  ![NPM - Version](https://img.shields.io/npm/v/@langchain/community?style=flat-square&label=%20&) |

## 设置

该集成位于 `@langchain/community` 包中，你可以按如下方式安装：

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

请在此处 [设置 API 密钥](https://serpapi.com/)，并将其设置为名为 `SERPAPI_API_KEY` 的环境变量。

```typescript
process.env.SERPAPI_API_KEY = "YOUR_API_KEY"
```

同时，为了获得最佳的观测性，设置 [LangSmith](https://smith.langchain.com/) 也很有帮助（但不是必需的）：

```typescript
process.env.LANGSMITH_TRACING="true"
process.env.LANGSMITH_API_KEY="your-api-key"
```

## 实例化

你可以像这样导入并实例化 `SerpAPI` 工具：

```typescript
import { SerpAPI } from "@langchain/community/tools/serpapi";

const tool = new SerpAPI();
```

## 调用

### [直接使用参数调用](/oss/concepts/#invoke-with-just-the-arguments)

你可以像这样直接调用工具：

```typescript
await tool.invoke({
  input: "what is the current weather in SF?"
});
```

```json
{"type":"weather_result","temperature":"63","unit":"Fahrenheit","precipitation":"3%","humidity":"91%","wind":"5 mph","location":"San Francisco, CA","date":"Sunday 9:00 AM","weather":"Mostly cloudy"}
```

### [使用 ToolCall 调用](/oss/concepts/#invoke-with-toolcall)

我们也可以使用模型生成的 `ToolCall` 来调用工具，在这种情况下，将返回一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>：

```typescript
// 这通常由模型生成，但为了演示目的，我们将直接创建一个工具调用。
const modelGeneratedToolCall = {
  args: {
    input: "what is the current weather in SF?"
  },
  id: "1",
  name: tool.name,
  type: "tool_call",
}

await tool.invoke(modelGeneratedToolCall)
```

```text
ToolMessage {
  "content": "{\"type\":\"weather_result\",\"temperature\":\"63\",\"unit\":\"Fahrenheit\",\"precipitation\":\"3%\",\"humidity\":\"91%\",\"wind\":\"5 mph\",\"location\":\"San Francisco, CA\",\"date\":\"Sunday 9:00 AM\",\"weather\":\"Mostly cloudy\"}",
  "name": "search",
  "additional_kwargs": {},
  "response_metadata": {},
  "tool_call_id": "1"
}
```

## 链式调用

我们可以通过先将工具绑定到一个 [工具调用模型](/oss/langchain/tools/)，然后在链中使用它：

```typescript
// @lc-docs-hide-cell

import { ChatOpenAI } from "@langchain/openai"

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
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

```text
AIMessage {
  "tool_calls": [],
  "content": "The current weather in San Francisco is mostly cloudy, with a temperature of 64°F. The humidity is at 90%, there is a 3% chance of precipitation, and the wind is blowing at 5 mph."
}
```

## 智能体

有关如何在智能体中使用 LangChain 工具的指南，请参阅 [LangGraph.js](https://langchain-ai.github.io/langgraphjs/) 文档。

---

## API 参考

有关 `SerpAPI` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/_langchain_community.tools_serpapi.SerpAPI.html)。
