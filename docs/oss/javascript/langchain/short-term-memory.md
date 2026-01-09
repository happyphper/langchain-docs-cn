---
title: 短期记忆
---
## 概述

记忆（Memory）是一个能够记住先前交互信息的系统。对于 AI 智能体（agent）而言，记忆至关重要，因为它能让智能体记住之前的交互、从反馈中学习并适应用户偏好。随着智能体处理涉及大量用户交互的复杂任务，这种能力对于效率和用户满意度都变得至关重要。

短期记忆（Short-term memory）让你的应用程序能够记住单个线程（thread）或对话中的先前交互。

<Note>

线程在一个会话中组织多次交互，类似于电子邮件将消息分组到单个对话中的方式。

</Note>

对话历史（Conversation history）是最常见的短期记忆形式。长对话对当今的大语言模型（LLM）构成了挑战；完整的历史记录可能无法放入 LLM 的上下文窗口（context window），导致上下文丢失或错误。

即使你的模型支持完整的上下文长度，大多数 LLM 在处理长上下文时表现仍然不佳。它们会被过时或离题的内容“分散注意力”，同时还会遭受响应时间变慢和成本更高的困扰。

聊天模型使用[消息（messages）](/oss/langchain/messages)来接受上下文，这些消息包括指令（系统消息）和输入（人类消息）。在聊天应用中，消息在人类输入和模型响应之间交替，导致消息列表随时间推移而变长。由于上下文窗口有限，许多应用可以通过使用技术来移除或“遗忘”过时信息而受益。

## 使用方法

要为智能体添加短期记忆（线程级持久化），你需要在创建智能体时指定一个 `checkpointer`。

<Info>

LangChain 的智能体将短期记忆作为其状态（state）的一部分进行管理。

通过将这些信息存储在图的（graph）状态中，智能体可以访问给定对话的完整上下文，同时保持不同线程之间的隔离。

状态通过检查点（checkpointer）持久化到数据库（或内存）中，因此线程可以在任何时候恢复。

短期记忆在智能体被调用或步骤（如工具调用）完成时更新，状态在每个步骤开始时被读取。

</Info>

```ts {highlight={2,4, 9,14}}
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [],
    checkpointer,
});

await agent.invoke(
    { messages: [{ role: "user", content: "hi! i am Bob" }] },
    { configurable: { thread_id: "1" } }
);
```

### 在生产环境中

在生产环境中，使用由数据库支持的检查点：

```ts
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable";
const checkpointer = PostgresSaver.fromConnString(DB_URI);
```

## 自定义智能体记忆

你可以通过创建带有状态模式的自定义中间件（middleware）来扩展智能体状态。自定义状态模式可以通过中间件中的 `stateSchema` 参数传递。

```typescript
import * as z from "zod";
import { createAgent, createMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const customStateSchema = z.object({  // [!code highlight]
    userId: z.string(),  // [!code highlight]
    preferences: z.record(z.string(), z.any()),  // [!code highlight]
});  // [!code highlight]

const stateExtensionMiddleware = createMiddleware({
    name: "StateExtension",
    stateSchema: customStateSchema,  // [!code highlight]
});

const checkpointer = new MemorySaver();
const agent = createAgent({
    model: "gpt-5",
    tools: [],
    middleware: [stateExtensionMiddleware],  // [!code highlight]
    checkpointer,
});

// 可以在调用时传入自定义状态
const result = await agent.invoke({
    messages: [{ role: "user", content: "Hello" }],
    userId: "user_123",  // [!code highlight]
    preferences: { theme: "dark" },  // [!code highlight]
});
```

## 常见模式

启用[短期记忆](#add-short-term-memory)后，长对话可能会超出 LLM 的上下文窗口。常见的解决方案有：

<CardGroup :cols="2">

<Card title="修剪消息" icon="scissors" href="#trim-messages" arrow>

移除前 N 条或后 N 条消息（在调用 LLM 之前）

</Card>

<Card title="删除消息" icon="trash" href="#delete-messages" arrow>

从 LangGraph 状态中永久删除消息

</Card>

<Card title="总结消息" icon="layer-group" href="#summarize-messages" arrow>

总结历史中较早的消息并用摘要替换它们

</Card>

<Card title="自定义策略" icon="gears">

自定义策略（例如，消息过滤等）

</Card>

</CardGroup>

这使得智能体能够跟踪对话，而不会超出 LLM 的上下文窗口。

### 修剪消息

大多数 LLM 都有最大支持的上下文窗口（以令牌（tokens）为单位）。

决定何时截断消息的一种方法是计算消息历史中的令牌数量，并在接近限制时进行截断。如果你使用 LangChain，可以使用修剪消息工具，并指定要从列表中保留的令牌数量，以及用于处理边界的 `strategy`（例如，保留最后 `maxTokens` 个令牌）。

要在智能体中修剪消息历史，请使用带有 `beforeModel` 钩子的 <a href="https://reference.langchain.com/javascript/functions/langchain.index.createMiddleware.html" target="_blank" rel="noreferrer" class="link"><code>createMiddleware</code></a>：

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware } from "langchain";
import { MemorySaver, REMOVE_ALL_MESSAGES } from "@langchain/langgraph";

const trimMessages = createMiddleware({
  name: "TrimMessages",
  beforeModel: (state) => {
    const messages = state.messages;

    if (messages.length <= 3) {
      return; // 无需更改
    }

    const firstMsg = messages[0];
    const recentMessages =
      messages.length % 2 === 0 ? messages.slice(-3) : messages.slice(-4);
    const newMessages = [firstMsg, ...recentMessages];

    return {
      messages: [
        new RemoveMessage({ id: REMOVE_ALL_MESSAGES }),
        ...newMessages,
      ],
    };
  },
});

const checkpointer = new MemorySaver();
const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  middleware: [trimMessages],
  checkpointer,
});
```

### 删除消息

你可以从图状态中删除消息来管理消息历史。

当你想删除特定消息或清除整个消息历史时，这很有用。

要从图状态中删除消息，可以使用 `RemoveMessage`。要使 `RemoveMessage` 生效，你需要使用带有 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.messagesStateReducer.html" target="_blank" rel="noreferrer" class="link"><code>messagesStateReducer</code></a> [归约器（reducer）](/oss/langgraph/graph-api#reducers)的状态键，例如 `MessagesZodState`。

要删除特定消息：

```typescript
import { RemoveMessage } from "@langchain/core/messages";

const deleteMessages = (state) => {
    const messages = state.messages;
    if (messages.length > 2) {
        // 移除最早的两条消息
        return {
        messages: messages
            .slice(0, 2)
            .map((m) => new RemoveMessage({ id: m.id })),
        };
    }
};
```

<Warning>

删除消息时，<strong>务必确保</strong>生成的消息历史是有效的。请检查你使用的 LLM 提供商的限制。例如：

    * 一些提供商期望消息历史以 `user` 消息开始
    * 大多数提供商要求带有工具调用的 `assistant` 消息后面必须跟着相应的 `tool` 结果消息。

</Warning>

:::js

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const deleteOldMessages = createMiddleware({
  name: "DeleteOldMessages",
  afterModel: (state) => {
    const messages = state.messages;
    if (messages.length > 2) {
      // 移除最早的两条消息
      return {
        messages: messages
          .slice(0, 2)
          .map((m) => new RemoveMessage({ id: m.id! })),
      };
    }
    return;
  },
});

const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  systemPrompt: "Please be concise and to the point.",
  middleware: [deleteOldMessages],
  checkpointer: new MemorySaver(),
});

const config = { configurable: { thread_id: "1" } };

const streamA = await agent.stream(
  { messages: [{ role: "user", content: "hi! I'm bob" }] },
  { ...config, streamMode: "values" }
);
for await (const event of streamA) {
  const messageDetails = event.messages.map((message) => [
    message.getType(),
    message.content,
  ]);
  console.log(messageDetails);
}

const streamB = await agent.stream(
  {
    messages: [{ role: "user", content: "what's my name?" }],
  },
  { ...config, streamMode: "values" }
);
for await (const event of streamB) {
  const messageDetails = event.messages.map((message) => [
    message.getType(),
    message.content,
  ]);
  console.log(messageDetails);
}
```

```
[[ "human", "hi! I'm bob" ]]
[[ "human", "hi! I'm bob" ], [ "ai", "Hello, Bob! How can I assist you today?" ]]
[[ "human", "hi! I'm bob" ], [ "ai", "Hello, Bob! How can I assist you today?" ]]
[[ "human", "hi! I'm bob" ], [ "ai", "Hello, Bob! How can I assist you today" ], ["human", "what's my name?" ]]
[[ "human", "hi! I'm bob" ], [ "ai",
