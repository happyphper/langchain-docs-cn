---
title: LangGraph v1 有哪些新功能
sidebarTitle: LangGraph v1
---
**LangGraph v1 是一个专注于稳定性的智能体运行时版本。** 它保持了核心的图 API 和执行模型不变，同时改进了类型安全性、文档和开发者体验。

它旨在与 [LangChain v1](/oss/releases/langchain-v1)（其 `createAgent` 构建于 LangGraph 之上）无缝协作，因此您可以快速上手，并在需要时深入进行细粒度控制。

<CardGroup :cols="1">

<Card title="稳定的核心 API" icon="diagram-project">

图的基本元素（状态、节点、边）以及执行/运行时模型保持不变，使得升级过程简单明了。

</Card>

<Card title="默认具备可靠性" icon="database">

具备检查点、持久化、流式处理和人工干预的持久化执行（Durable execution）继续是一等公民。

</Card>

<Card title="与 LangChain v1 无缝集成" icon="link">

LangChain 的 `createAgent` 运行在 LangGraph 之上。使用 LangChain 快速启动；切换到 LangGraph 进行自定义编排。

</Card>

</CardGroup>

要升级，请执行：

::: code-group

```bash [npm]
npm install @langchain/langgraph @langchain/core
```

```bash [pnpm]
pnpm add @langchain/langgraph @langchain/core
```

```bash [yarn]
yarn add @langchain/langgraph @langchain/core
```

```bash [bun]
bun add @langchain/langgraph @langchain/core
```

:::

有关完整的变更列表，请参阅 [迁移指南](/oss/migrate/langgraph-v1)。

## `createReactAgent` 的弃用

LangGraph 的预构建 `createReactAgent` 已被弃用，转而推荐使用 LangChain 的 `createAgent`。后者提供了更简单的接口，并通过引入中间件提供了更大的自定义潜力。

* 有关新的 `createAgent` API 的信息，请参阅 [LangChain v1 发布说明](/oss/releases/langchain-v1#createagent)。
* 有关从 `createReactAgent` 迁移到 `createAgent` 的信息，请参阅 [LangChain v1 迁移指南](/oss/migrate/langchain-v1#createagent)。

## 类型化的中断（Typed interrupts）

<a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 现在在构造函数中接受一个中断类型映射，以便更严格地约束图中可使用的中断类型。

```typescript [expandable]
import { StateGraph, MemorySaver, interrupt } from "@langchain/langgraph";
import * as z from "zod";

const stateSchema = z.object({
  foo: z.string(),
})

const graphConfig = {
  interrupts: {
    // 定义一个简单中断，接受原因并返回消息
    simple: interrupt<{ reason: string }, { messages: string[] }>, // [!code highlight]
    // 定义一个具有相同签名的复杂中断
    complex: interrupt<{ reason: string }, { messages: string[] }>, // [!code highlight]
  }
}

const checkpointer = new MemorySaver();

const graph = new StateGraph(stateSchema, graphConfig)
  .addNode("node", async (state, runtime) => {
    // 触发简单中断并附带原因
    const response = runtime.interrupt.simple({ reason: "test" });
    // 将中断响应作为新状态返回
    return { foo: response };
  })
  // 使用检查点器编译图
  .compile({ checkpointer });

// 使用初始状态调用图
const result = await graph.invoke({ foo: "test" });

// 访问中断数据
if (graph.isInterrupted(result)) {
  console.log(result.__interrupt__.messages);
}
```

有关中断的更多信息，请参阅 [中断](/oss/langgraph/interrupts) 文档。

## 前端 SDK 增强

LangGraph v1 在前端与 LangGraph 应用程序交互方面带来了一些增强。

### 事件流编码

底层的 `toLangGraphEventStream` 辅助函数已被移除。流式响应现在由 SDK 原生处理，您可以通过向 `graph.stream` 传入 `encoding` 格式来选择传输格式。这使得在 SSE 和普通 JSON 响应之间切换变得简单，而无需更改 UI 逻辑。

更多信息请参阅 [迁移指南](/oss/migrate/langgraph-v1#stream-encoding)。

### `useStream` 中的自定义传输器

React 的 `useStream` 钩子现在支持可插拔的传输器，因此您可以在不更改 UI 代码的情况下更好地控制网络层。

```typescript
const stream = useStream({
  transport: new FetchStreamTransport({
    apiUrl: "http://localhost:2024",
  }),
});
```

了解如何集成和自定义此钩子：[将 LangGraph 集成到您的 React 应用程序中](/oss/langgraph/ui)。

## 报告问题

请在 [GitHub](https://github.com/langchain-ai/langgraphjs/issues) 上使用 [`'v1'` 标签](https://github.com/langchain-ai/langgraphjs/issues?q=state%3Aopen%20label%3Av1) 报告在 1.0 版本中发现的任何问题。

## 其他资源

<CardGroup :cols="3">

<Card title="LangGraph 1.0" icon="rocket" href="https://blog.langchain.com/langchain-langchain-1-0-alpha-releases/">

阅读公告

</Card>

<Card title="概述" icon="book" href="/oss/langgraph/overview" arrow>

LangGraph 是什么以及何时使用它

</Card>

<Card title="图 API" icon="diagram-project" href="/oss/langgraph/graph-api" arrow>

使用状态、节点和边构建图

</Card>

<Card title="LangChain 智能体" icon="robot" href="/oss/langchain/agents" arrow>

构建在 LangGraph 之上的高级智能体

</Card>

<Card title="迁移指南" icon="arrow-right-arrow-left" href="/oss/migrate/langgraph-v1" arrow>

如何迁移到 LangGraph v1

</Card>

<Card title="GitHub" icon="github" href="https://github.com/langchain-ai/langgraphjs">

报告问题或参与贡献

</Card>

</CardGroup>

## 另请参阅

- [版本控制](/oss/versioning) – 理解版本号
- [发布策略](/oss/release-policy) – 详细的发布策略
