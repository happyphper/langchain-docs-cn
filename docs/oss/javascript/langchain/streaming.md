---
title: 流式传输
---
LangChain 实现了流式传输系统，以提供实时更新。

流式传输对于提升基于大语言模型（LLM）构建的应用程序的响应能力至关重要。通过逐步显示输出，甚至在完整响应准备就绪之前，流式传输能显著改善用户体验（UX），尤其是在处理 LLM 延迟时。

## 概述

LangChain 的流式传输系统允许您将智能体运行过程中的实时反馈呈现给您的应用程序。

LangChain 流式传输可以实现的功能：

* <Icon icon="brain" :size="16" /> [**流式传输智能体进度**](#agent-progress) — 在智能体每个步骤后获取状态更新。
* <Icon icon="square-binary" :size="16" /> [**流式传输 LLM 令牌**](#llm-tokens) — 在语言模型令牌生成时进行流式传输。
* <Icon icon="table" :size="16" /> [**流式传输自定义更新**](#custom-updates) — 发出用户定义的信号（例如，`"已获取 10/100 条记录"`）。
* <Icon icon="layer-plus" :size="16" /> [**流式传输多种模式**](#stream-multiple-modes) — 可选择 `updates`（智能体进度）、`messages`（LLM 令牌 + 元数据）或 `custom`（任意用户数据）。

更多端到端示例，请参阅下面的[常见模式](#common-patterns)部分。

## 支持的流模式

将以下一个或多个流模式作为列表传递给 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.CompiledStateGraph.html#stream" target="_blank" rel="noreferrer" class="link"><code>stream</code></a> 方法：

| 模式       | 描述                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| `updates`  | 在每个智能体步骤后流式传输状态更新。如果在同一步骤中进行了多次更新（例如，运行了多个节点），这些更新将单独流式传输。 |
| `messages` | 从任何调用 LLM 的图节点流式传输 `(token, metadata)` 元组。 |
| `custom`   | 使用流写入器从图节点内部流式传输自定义数据。 |

## 智能体进度

要流式传输智能体进度，请使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.CompiledStateGraph.html#stream" target="_blank" rel="noreferrer" class="link"><code>stream</code></a> 方法并设置 `streamMode: "updates"`。这会在每个智能体步骤后发出一个事件。

例如，如果您有一个调用一次工具的智能体，您应该会看到以下更新：

* **LLM 节点**：包含工具调用请求的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a>
* **工具节点**：包含执行结果的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>
* **LLM 节点**：最终的 AI 响应

```typescript
import z from "zod";
import { createAgent, tool } from "langchain";

const getWeather = tool(
    async ({ city }) => {
        return `The weather in ${city} is always sunny!`;
    },
    {
        name: "get_weather",
        description: "Get weather for a given city.",
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

要在 LLM 生成令牌时流式传输它们，请使用 `streamMode: "messages"`：

```typescript
import z from "zod";
import { createAgent, tool } from "langchain";

const getWeather = tool(
    async ({ city }) => {
        return `The weather in ${city} is always sunny!`;
    },
    {
        name: "get_weather",
        description: "Get weather for a given city.",
        schema: z.object({
        city: z.string(),
        }),
    }
);

const agent = createAgent({
    model: "gpt-4o-mini",
    tools: [getWeather],
});

for await (const [token, metadata] of await agent.stream(
    { messages: [{ role: "user", content: "what is the weather in sf" }] },
    { streamMode: "messages" }
)) {
    console.log(`node: ${metadata.langgraph_node}`);
    console.log(`content: ${JSON.stringify(token.contentBlocks, null, 2)}`);
}
```

## 自定义更新

要在工具执行时流式传输其更新，您可以使用配置中的 `writer` 参数。

```typescript
import z from "zod";
import { tool, createAgent } from "langchain";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

const getWeather = tool(
    async (input, config: LangGraphRunnableConfig) => {
        // Stream any arbitrary data
        config.writer?.(`Looking up data for city: ${input.city}`);
        // ... fetch city data
        config.writer?.(`Acquired data for city: ${input.city}`);
        return `It's always sunny in ${input.city}!`;
    },
    {
        name: "get_weather",
        description: "Get weather for a given city.",
        schema: z.object({
        city: z.string().describe("The city to get weather for."),
        }),
    }
);

const agent = createAgent({
    model: "gpt-4o-mini",
    tools: [getWeather],
});

for await (const chunk of await agent.stream(
    { messages: [{ role: "user", content: "what is the weather in sf" }] },
    { streamMode: "custom" }
)) {
    console.log(chunk);
}
```

```shell title="Output"
Looking up data for city: San Francisco
Acquired data for city: San Francisco
```

<Note>

如果您将 `writer` 参数添加到您的工具中，在没有提供写入器函数的情况下，您将无法在 LangGraph 执行上下文之外调用该工具。

</Note>

## 流式传输多种模式

您可以通过将 streamMode 作为数组传递来指定多种流模式：`streamMode: ["updates", "messages", "custom"]`。

流式传输的输出将是 `[mode, chunk]` 元组，其中 `mode` 是流模式的名称，`chunk` 是该模式流式传输的数据。

```typescript
import z from "zod";
import { tool, createAgent } from "langchain";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

const getWeather = tool(
    async (input, config: LangGraphRunnableConfig) => {
        // Stream any arbitrary data
        config.writer?.(`Looking up data for city: ${input.city}`);
        // ... fetch city data
        config.writer?.(`Acquired data for city: ${input.city}`);
        return `It's always sunny in ${input.city}!`;
    },
    {
        name: "get_weather",
        description: "Get weather for a given city.",
        schema: z.object({
        city: z.string().describe("The city to get weather for."),
        }),
    }
);

const agent = createAgent({
    model: "gpt-4o-mini",
    tools: [getWeather],
});

for await (const [streamMode, chunk] of await agent.stream(
    { messages: [{ role: "user", content: "what is the weather in sf" }] },
    { streamMode: ["updates", "messages", "custom"] }
)) {
    console.log(`${streamMode}: ${JSON.stringify(chunk, null, 2)}`);
}
```

## 禁用流式传输

在某些应用程序中，您可能需要为给定模型禁用单个令牌的流式传输。这在以下情况下很有用：

- 使用[多智能体](/oss/javascript/langchain/multi-agent)系统来控制哪些智能体流式传输其输出
- 混合支持流式传输的模型与不支持流式传输的模型
- 部署到 [LangSmith](/langsmith/home) 并希望防止某些模型输出被流式传输到客户端

在初始化模型时设置 `streaming: false`。

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o",
  streaming: false,  // [!code highlight]
});
```

<Tip>

部署到 LangSmith 时，对于任何不希望其输出流式传输到客户端的模型，请设置 `streaming=False`。这需要在部署前在您的图代码中进行配置。

</Tip>

<Note>

并非所有聊天模型集成都支持 `streaming` 参数。如果您的模型不支持，请改用 `disableStreaming: true`。此参数可通过基类在所有聊天模型上使用。

</Note>

更多详细信息，请参阅 [LangGraph 流式传输指南](/oss/javascript/langgraph/streaming#disable-streaming-for-specific-chat-models)。

## 相关链接

- [使用聊天模型进行流式传输](/oss/javascript/langchain/models#stream) — 直接从聊天模型流式传输令牌，无需使用智能体或图
- [人机交互流式传输](/oss/javascript/langchain/human-in-the-loop#streaming-with-hil) — 在处理人工审核中断的同时流式传输智能体进度
- [LangGraph 流式传输](/oss/javascript/langgraph/streaming) — 高级流式传输选项，包括 `values`、`debug` 模式和子图流式传输

