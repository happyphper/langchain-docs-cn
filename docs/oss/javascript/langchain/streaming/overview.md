---
title: 概述
description: 实时流式传输智能体运行更新
---
LangChain 实现了一套流式传输系统，用于实时呈现更新。

流式传输对于提升基于大语言模型（LLM）构建的应用程序的响应能力至关重要。通过逐步显示输出，甚至在完整响应准备就绪之前，流式传输能显著改善用户体验（UX），尤其是在处理大语言模型的延迟时。

## 概述

LangChain 的流式传输系统允许您将智能体（agent）运行过程中的实时反馈呈现给您的应用程序。

使用 LangChain 流式传输可以实现的功能：

* <Icon icon="brain" :size="16" /> [**流式传输智能体进度**](#agent-progress) — 在每次智能体步骤后获取状态更新。
* <Icon icon="square-binary" :size="16" /> [**流式传输大语言模型词元**](#llm-tokens) — 在大语言模型生成词元时进行流式传输。
* <Icon icon="table" :size="16" /> [**流式传输自定义更新**](#custom-updates) — 发出用户定义的信号（例如，`"已获取 10/100 条记录"`）。
* <Icon icon="layer-plus" :size="16" /> [**流式传输多种模式**](#stream-multiple-modes) — 从 `updates`（智能体进度）、`messages`（大语言模型词元 + 元数据）或 `custom`（任意用户数据）中选择。

更多端到端示例，请参阅下面的[常见模式](#common-patterns)部分。

## 支持的流模式

将一个或多个以下流模式作为列表传递给 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.CompiledStateGraph.html#stream" target="_blank" rel="noreferrer" class="link"><code>stream</code></a> 方法：

| 模式        | 描述                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `updates`   | 在每次智能体步骤后流式传输状态更新。如果在同一步骤中进行了多次更新（例如，运行了多个节点），这些更新将分别流式传输。 |
| `messages`  | 从任何调用大语言模型的图节点流式传输 `(token, metadata)` 元组。 |
| `custom`    | 使用流写入器从图节点内部流式传输自定义数据。 |

## 智能体进度

要流式传输智能体进度，请使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.CompiledStateGraph.html#stream" target="_blank" rel="noreferrer" class="link"><code>stream</code></a> 方法并设置 `streamMode: "updates"`。这会在每次智能体步骤后发出一个事件。

例如，如果您有一个调用一次工具的智能体，您应该会看到以下更新：

* **大语言模型节点**：包含工具调用请求的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a>
* **工具节点**：包含执行结果的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>
* **大语言模型节点**：最终的人工智能响应

```typescript
import z from "zod";
import { createAgent, tool } from "langchain";

const getWeather = tool(
    async ({ city }) => {
        return `The weather in ${city} is always sunny!`;
    },
    {
        name: "get_weather",
        description: "获取给定城市的天气。",
        schema: z.object({
        city: z.string(),
        }),
    }
);

const agent = createAgent({
    model: "gpt-5-nano",
    tools: [getWeather],
});

for await (const chunk of await agent.stream(
    { messages: [{ role: "user", content: "what is the weather in sf" }] },
    { streamMode: "updates" }
)) {
    const [step, content] = Object.entries(chunk)[0];
    console.log(`step: ${step}`);
    console.log(`content: ${JSON.stringify(content, null, 2)}`);
}
/**
 * step: model
 * content: {
 *   "messages": [
 *     {
 *       "kwargs": {
 *         // ...
 *         "tool_calls": [
 *           {
 *             "name": "get_weather",
 *             "args": {
 *               "city": "San Francisco"
 *             },
 *             "type": "tool_call",
 *             "id": "call_0qLS2Jp3MCmaKJ5MAYtr4jJd"
 *           }
 *         ],
 *         // ...
 *       }
 *     }
 *   ]
 * }
 * step: tools
 * content: {
 *   "messages": [
 *     {
 *       "kwargs": {
 *         "content": "The weather in San Francisco is always sunny!",
 *         "name": "get_weather",
 *         // ...
 *       }
 *     }
 *   ]
 * }
 * step: model
 * content: {
 *   "messages": [
 *     {
 *       "kwargs": {
 *         "content": "The latest update says: The weather in San Francisco is always sunny!\n\nIf you'd like real-time details (current temperature, humidity, wind, and today's forecast), I can pull the latest data for you. Want me to fetch that?",
 *         // ...
 *       }
 *     }
 *   ]
 * }
 */
```

## LLM 令牌

## 禁用流式传输

在某些应用中，您可能需要为给定模型禁用单个令牌的流式传输。这在以下情况下很有用：

- 使用[多智能体](/oss/javascript/langchain/multi-agent)系统时，控制哪些智能体流式传输其输出
- 混合使用支持流式传输和不支持流式传输的模型时
- 部署到[LangSmith](/langsmith/home)并希望阻止某些模型输出被流式传输到客户端时

初始化模型时设置 `streaming: false`。

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o",
  streaming: false,  // [!code highlight]
});
```

<Tip>

部署到 LangSmith 时，对于不希望流式传输到客户端的任何模型，请设置 `streaming=False`。这需要在部署前在您的图代码中进行配置。

</Tip>

<Note>

并非所有聊天模型集成都支持 `streaming` 参数。如果您的模型不支持，请改用 `disableStreaming: true`。此参数可通过基类在所有聊天模型上使用。

</Note>

更多详情请参阅 [LangGraph 流式传输指南](/oss/javascript/langgraph/streaming#disable-streaming-for-specific-chat-models)。

## 相关链接

- [前端流式传输](/oss/javascript/langchain/streaming/frontend) — 使用 `useStream` 构建 React UI，实现实时智能体交互
- [使用聊天模型进行流式传输](/oss/javascript/langchain/models#stream) — 无需使用智能体或图，直接从聊天模型流式传输令牌
- [人机协同（human-in-the-loop）流式传输](/oss/javascript/langchain/human-in-the-loop#streaming-with-hil) — 在处理人工审核中断的同时流式传输智能体进度
- [LangGraph 流式传输](/oss/javascript/langgraph/streaming) — 高级流式传输选项，包括 `values`、`debug` 模式以及子图流式传输
