---
title: LangGraph 运行时 (LangGraph runtime)
sidebarTitle: 运行时 (Runtime)
---


<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.pregel.Pregel.html" target="_blank" rel="noreferrer" class="link"><code>Pregel</code></a> 实现了 LangGraph 的运行时，负责管理 LangGraph 应用程序的执行。

编译一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html" target="_blank" rel="noreferrer" class="link">StateGraph</a> 或创建一个 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.entrypoint.html" target="_blank" rel="noreferrer" class="link">entrypoint</a> 会产生一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.pregel.Pregel.html" target="_blank" rel="noreferrer" class="link"><code>Pregel</code></a> 实例，该实例可以通过输入来调用。

本指南从高层次解释了该运行时，并提供了直接使用 Pregel 实现应用程序的说明。

> **注意：** <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.pregel.Pregel.html" target="_blank" rel="noreferrer" class="link"><code>Pregel</code></a> 运行时以 [Google 的 Pregel 算法](https://research.google/pubs/pub37252/) 命名，该算法描述了一种使用图进行大规模并行计算的高效方法。

## 概述 (Overview)

在 LangGraph 中，Pregel 将 [**参与者 (actors)**](https://en.wikipedia.org/wiki/Actor_model) 和 **通道 (channels)** 组合到一个应用程序中。**参与者** 从通道读取数据并向通道写入数据。Pregel 按照 **Pregel 算法 (Pregel Algorithm)**/**批量同步并行 (Bulk Synchronous Parallel)** 模型将应用程序的执行组织成多个步骤。

每个步骤包含三个阶段：

* **规划 (Plan)**：确定在此步骤中要执行哪些 **参与者**。例如，在第一步中，选择订阅特殊 **输入 (input)** 通道的 **参与者**；在后续步骤中，选择订阅了上一步中更新的通道的 **参与者**。
* **执行 (Execution)**：并行执行所有选定的 **参与者**，直到全部完成，或其中一个失败，或达到超时。在此阶段，通道的更新对参与者不可见，直到下一个步骤。
* **更新 (Update)**：用此步骤中 **参与者** 写入的值更新通道。

重复此过程，直到没有 **参与者** 被选中执行，或达到最大步骤数。

## 参与者 (Actors)

一个 **参与者** 就是一个 `PregelNode`。它订阅通道，从中读取数据，并向其写入数据。可以将其视为 Pregel 算法中的 **参与者**。`PregelNode` 实现了 LangChain 的 Runnable 接口。

## 通道 (Channels)

通道用于在参与者 (PregelNodes) 之间进行通信。每个通道都有一个值类型、一个更新类型和一个更新函数——该函数接收一系列更新并修改存储的值。通道可用于将数据从一个链发送到另一个链，或者用于在未来的步骤中将数据从一个链发送到自身。LangGraph 提供了许多内置通道：

* <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.channels.LastValue.html" target="_blank" rel="noreferrer" class="link"><code>LastValue</code></a>：默认通道，存储发送到通道的最后一个值，适用于输入和输出值，或用于将数据从一个步骤发送到下一个步骤。
* <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.channels.Topic.html" target="_blank" rel="noreferrer" class="link"><code>Topic</code></a>：一个可配置的发布-订阅主题，适用于在 **参与者** 之间发送多个值，或用于累积输出。可以配置为去重或在多个步骤过程中累积值。
* <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.BinaryOperatorAggregate.html" target="_blank" rel="noreferrer" class="link"><code>BinaryOperatorAggregate</code></a>：存储一个持久值，通过对当前值和发送到通道的每个更新应用二元运算符来更新，适用于跨多个步骤计算聚合；例如，`total = BinaryOperatorAggregate(int, operator.add)`

## 示例 (Examples)

虽然大多数用户将通过 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html" target="_blank" rel="noreferrer" class="link">StateGraph</a> API 或 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.entrypoint.html" target="_blank" rel="noreferrer" class="link">entrypoint</a> 装饰器与 Pregel 交互，但也可以直接与 Pregel 交互。

以下是几个不同的示例，让您了解 Pregel API。

<Tabs>

<Tab title="单节点 (Single node)">

```typescript
import { EphemeralValue } from "@langchain/langgraph/channels";
import { Pregel, NodeBuilder } from "@langchain/langgraph/pregel";

const node1 = new NodeBuilder()
  .subscribeOnly("a")
  .do((x: string) => x + x)
  .writeTo("b");

const app = new Pregel({
  nodes: { node1 },
  channels: {
    a: new EphemeralValue<string>(),
    b: new EphemeralValue<string>(),
  },
  inputChannels: ["a"],
  outputChannels: ["b"],
});

await app.invoke({ a: "foo" });
```

```console
{ b: 'foofoo' }
```

</Tab>

<Tab title="多节点 (Multiple nodes)">

```typescript
import { LastValue, EphemeralValue } from "@langchain/langgraph/channels";
import { Pregel, NodeBuilder } from "@langchain/langgraph/pregel";

const node1 = new NodeBuilder()
  .subscribeOnly("a")
  .do((x: string) => x + x)
  .writeTo("b");

const node2 = new NodeBuilder()
  .subscribeOnly("b")
  .do((x: string) => x + x)
  .writeTo("c");

const app = new Pregel({
  nodes: { node1, node2 },
  channels: {
    a: new EphemeralValue<string>(),
    b: new LastValue<string>(),
    c: new EphemeralValue<string>(),
  },
  inputChannels: ["a"],
  outputChannels: ["b", "c"],
});

await app.invoke({ a: "foo" });
```

```console
{ b: 'foofoo', c: 'foofoofoofoo' }
```

</Tab>

<Tab title="主题 (Topic)">

```typescript
import { EphemeralValue, Topic } from "@langchain/langgraph/channels";
import { Pregel, NodeBuilder } from "@langchain/langgraph/pregel";

const node1 = new NodeBuilder()
  .subscribeOnly("a")
  .do((x: string) => x + x)
  .writeTo("b", "c");

const node2 = new NodeBuilder()
  .subscribeTo("b")
  .do((x: { b: string }) => x.b + x.b)
  .writeTo("c");

const app = new Pregel({
  nodes: { node1, node2 },
  channels: {
    a: new EphemeralValue<string>(),
    b: new EphemeralValue<string>(),
    c: new Topic<string>({ accumulate: true }),
  },
  inputChannels: ["a"],
  outputChannels: ["c"],
});

await app.invoke({ a: "foo" });
```

```console
{ c: ['foofoo', 'foofoofoofoo'] }
```

</Tab>

<Tab title="二元运算符聚合 (BinaryOperatorAggregate)">

本示例演示了如何使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.BinaryOperatorAggregate.html" target="_blank" rel="noreferrer" class="link"><code>BinaryOperatorAggregate</code></a> 通道来实现一个归约器 (reducer)。

```typescript
import { EphemeralValue, BinaryOperatorAggregate } from "@langchain/langgraph/channels";
import { Pregel, NodeBuilder } from "@langchain/langgraph/pregel";

const node1 = new NodeBuilder()
  .subscribeOnly("a")
  .do((x: string) => x + x)
  .writeTo("b", "c");

const node2 = new NodeBuilder()
  .subscribeOnly("b")
  .do((x: string) => x + x)
  .writeTo("c");

const reducer = (current: string, update: string) => {
  if (current) {
    return current + " | " + update;
  } else {
    return update;
  }
};

const app = new Pregel({
  nodes: { node1, node2 },
  channels: {
    a: new EphemeralValue<string>(),
    b: new EphemeralValue<string>(),
    c: new BinaryOperatorAggregate<string>({ operator: reducer }),
  },
  inputChannels: ["a"],
  outputChannels: ["c"],
});

await app.invoke({ a: "foo" });
```

</Tab>

<Tab title="循环 (Cycle)">

此示例演示了如何通过让一个链向其订阅的通道写入数据，从而在图中引入循环。执行将持续进行，直到向通道写入 `null` 值。

```typescript
import { EphemeralValue } from "@langchain/langgraph/channels";
import { Pregel, NodeBuilder, ChannelWriteEntry } from "@langchain/langgraph/pregel";

const exampleNode = new NodeBuilder()
  .subscribeOnly("value")
  .do((x: string) => x.length < 10 ? x + x : null)
  .writeTo(new ChannelWriteEntry("value", { skipNone: true }));

const app = new Pregel({
  nodes: { exampleNode },
  channels: {
    value: new EphemeralValue<string>(),
  },
  inputChannels: ["value"],
  outputChannels: ["value"],
});

await app.invoke({ value: "a" });
```

```console
{ value: 'aaaaaaaaaaaaaaaa' }
```

</Tab>

</Tabs>

## 高级 API (High-level API)

LangGraph 提供了两个用于创建 Pregel 应用程序的高级 API：[StateGraph (图 API)](/oss/javascript/langgraph/graph-api) 和 [函数式 API (Functional API)](/oss/javascript/langgraph/functional-api)。

<Tabs>

<Tab title="StateGraph (图 API)">

<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html" target="_blank" rel="noreferrer" class="link">StateGraph (图 API)</a> 是一个更高级别的抽象，它简化了 Pregel 应用程序的创建。它允许您定义节点和边的图。当您编译图时，StateGraph API 会自动为您创建 Pregel 应用程序。

```typescript
import { START, StateGraph } from "@langchain/langgraph";

interface Essay {
  topic: string;
  content?: string;
  score?: number;
}

const writeEssay = (essay: Essay) => {
  return {
    content: `Essay about ${essay.topic}`,
  };
};

const scoreEssay = (essay: Essay) => {
  return {
    score: 10
  };
};

const builder = new StateGraph<Essay>({
  channels: {
    topic: null,
    content: null,
    score: null,
  }
})
  .addNode("writeEssay", writeEssay)
  .addNode("scoreEssay", scoreEssay)
  .addEdge(START, "writeEssay")
  .addEdge("writeEssay", "scoreEssay");

// 编译图。
// 这将返回一个 Pregel 实例。
const graph = builder.compile();
```

编译后的 Pregel 实例将与一系列节点和通道相关联。您可以通过打印它们来检查节点和通道。

```typescript
console.log(graph.nodes);
```

您将看到类似这样的内容：

```console
{
  __start__: PregelNode { ... },
  writeEssay: PregelNode { ... },
  scoreEssay: PregelNode { ... }
}
```

```typescript
console.log(graph.channels);
```

您将看到类似这样的内容：

```console
{
  topic: LastValue { ... },
  content: LastValue { ... },
  score: LastValue { ... },
  __start__: EphemeralValue { ... },
  writeEssay: EphemeralValue { ... },
  scoreEssay: EphemeralValue { ... },
  'branch:__start__:__self__:writeEssay': EphemeralValue { ... },
  'branch:__start__:__self__:scoreEssay': EphemeralValue { ... },
  'branch:writeEssay:__self__:writeEssay': EphemeralValue { ... },
  'branch:writeEssay:__self__:scoreEssay': EphemeralValue { ... },
  'branch:scoreEssay:__self__:writeEssay': EphemeralValue { ... },
  'branch:scoreEssay:__self__:scoreEssay': EphemeralValue { ... },
  'start:writeEssay': EphemeralValue { ... }
}
```

</Tab>

<Tab title="函数式 API (Functional API)">

在 [函数式 API (Functional API)](/oss/javascript/langgraph/functional-api) 中，您可以使用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.entrypoint.html" target="_blank" rel="noreferrer" class="link">entrypoint</a> 来创建 Pregel 应用程序。`entrypoint` 装饰器允许您定义一个接收输入并返回输出的函数。

```typescript
import { MemorySaver } from "@langchain/langgraph";
import { entrypoint } from "@langchain/langgraph/func";

interface Essay {
  topic: string;
  content?: string;
  score?: number;
}

const checkpointer = new MemorySaver();

const writeEssay = entrypoint(
  { checkpointer, name: "writeEssay" },
  async (essay: Essay) => {
    return {
      content: `Essay about ${essay.topic}`,
    };
  }
);

console.log("Nodes: ");
console.log(writeEssay.nodes);
console.log("Channels: ");
console.log(writeEssay.channels);
```

```console
Nodes:
{ writeEssay: PregelNode { ... } }
Channels:
{
  __start__: EphemeralValue { ... },
  __end__: LastValue { ... },
  __previous__: LastValue { ... }
}
```

</Tab>

</Tabs>

