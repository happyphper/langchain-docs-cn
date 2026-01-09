---
title: Graph API 概述
sidebarTitle: Graph API
---
## 图

LangGraph 的核心是将智能体工作流建模为图。您可以使用三个关键组件来定义智能体的行为：

1. [`State`](#state)：一个共享数据结构，表示应用程序的当前快照。它可以是任何数据类型，但通常使用共享状态模式定义。

2. [`Nodes`](#nodes)：编码智能体逻辑的函数。它们接收当前状态作为输入，执行一些计算或副作用，并返回更新后的状态。

3. [`Edges`](#edges)：根据当前状态决定接下来执行哪个 `Node` 的函数。它们可以是条件分支或固定转换。

通过组合 `Nodes` 和 `Edges`，您可以创建随时间演变状态的复杂、循环工作流。然而，真正的威力来自 LangGraph 如何管理该状态。

需要强调的是：`Nodes` 和 `Edges` 仅仅是函数——它们可以包含 LLM 或只是普通的代码。

简而言之：_节点执行工作，边告诉接下来做什么_。

LangGraph 底层的图算法使用[消息传递](https://en.wikipedia.org/wiki/wiki/Message_passing)来定义一个通用程序。当一个节点完成其操作时，它会沿着一条或多条边向其他节点发送消息。这些接收节点然后执行其函数，将结果消息传递给下一组节点，过程持续进行。受 Google 的 [Pregel](https://research.google/pubs/pregel-a-system-for-large-scale-graph-processing/) 系统启发，程序以离散的“超级步”进行。

超级步可以被视为对图节点的一次迭代。并行运行的节点属于同一个超级步，而顺序运行的节点属于不同的超级步。在图执行开始时，所有节点都处于 `inactive` 状态。当一个节点在其任何传入边（或“通道”）上接收到新消息（状态）时，它变为 `active`。然后，活动节点运行其函数并响应更新。在每个超级步结束时，没有传入消息的节点通过将自己标记为 `inactive` 来投票 `halt`。当所有节点都处于 `inactive` 状态且没有消息在传输中时，图执行终止。

### StateGraph

<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 类是使用的主要图类。它由用户定义的 `State` 对象参数化。

### 编译您的图

要构建您的图，您首先定义[状态](#state)，然后添加[节点](#nodes)和[边](#edges)，最后编译它。编译图到底是什么，为什么需要它？

编译是一个相当简单的步骤。它对图的结构进行一些基本检查（没有孤立节点等）。这也是您可以指定运行时参数（如[检查点](/oss/langgraph/persistence)和断点）的地方。您只需调用 `.compile` 方法来编译您的图：

```typescript
const graph = new StateGraph(StateAnnotation)
  .addNode("nodeA", nodeA)
  .addEdge(START, "nodeA")
  .addEdge("nodeA", END)
  .compile();
```

<Warning>

在使用图之前，您<strong>必须</strong>编译它。

</Warning>

## 状态

定义图时，您要做的第一件事是定义图的 `State`。`State` 由[图的模式](#schema)以及指定如何将更新应用到状态的[`reducer` 函数](#reducers)组成。`State` 的模式将是图中所有 `Nodes` 和 `Edges` 的输入模式，可以是 Zod 模式或使用 `Annotation.Root` 构建的模式。所有 `Nodes` 都会发出对 `State` 的更新，然后使用指定的 `reducer` 函数应用这些更新。

### 模式

指定图模式的主要文档化方法是使用 Zod 模式。但是，我们也支持使用 `Annotation` API 来定义图的模式。

默认情况下，图将具有相同的输入和输出模式。如果您想更改这一点，也可以直接指定显式的输入和输出模式。当您有很多键，并且其中一些明确用于输入，另一些用于输出时，这很有用。

#### 多个模式

通常，所有图节点都使用单一模式进行通信。这意味着它们将读取和写入相同的状态通道。但是，有些情况下我们希望对这一点有更多控制：

- 内部节点可以传递图中输入/输出不需要的信息。
- 我们可能还想为图使用不同的输入/输出模式。例如，输出可能只包含一个相关的输出键。

可以让节点在图中写入私有状态通道，用于内部节点通信。我们可以简单地定义一个私有模式 `PrivateState`。

也可以为图定义显式的输入和输出模式。在这些情况下，我们定义一个“内部”模式，其中包含与图操作相关的_所有_键。但是，我们还定义了 `input` 和 `output` 模式，它们是“内部”模式的子集，以约束图的输入和输出。有关更多详细信息，请参阅[本指南](/oss/langgraph/graph-api#define-input-and-output-schemas)。

让我们看一个例子：

```typescript
const InputState = z.object({
  userInput: z.string(),
});

const OutputState = z.object({
  graphOutput: z.string(),
});

const OverallState = z.object({
  foo: z.string(),
  userInput: z.string(),
  graphOutput: z.string(),
});

const PrivateState = z.object({
  bar: z.string(),
});

const graph = new StateGraph({
  state: OverallState,
  input: InputState,
  output: OutputState,
})
  .addNode("node1", (state) => {
    // Write to OverallState
    return { foo: state.userInput + " name" };
  })
  .addNode("node2", (state) => {
    // Read from OverallState, write to PrivateState
    return { bar: state.foo + " is" };
  })
  .addNode(
    "node3",
    (state) => {
      // Read from PrivateState, write to OutputState
      return { graphOutput: state.bar + " Lance" };
    },
    { input: PrivateState }
  )
  .addEdge(START, "node1")
  .addEdge("node1", "node2")
  .addEdge("node2", "node3")
  .addEdge("node3", END)
  .compile();

await graph.invoke({ userInput: "My" });
// { graphOutput: 'My name is Lance' }
```

这里有两个微妙而重要的点需要注意：

1. 我们将 `state` 作为输入模式传递给 `node1`。但是，我们写出到 `foo`，这是 `OverallState` 中的一个通道。我们如何写出到输入模式中未包含的状态通道？这是因为节点_可以写入图状态中的任何状态通道_。图状态是初始化时定义的状态通道的并集，其中包括 `OverallState` 以及过滤器 `InputState` 和 `OutputState`。

2. 我们使用 `StateGraph({ state: OverallState, input: InputState, output: OutputState })` 初始化图。那么，我们如何在 `node2` 中写入 `PrivateState`？如果它没有在 `StateGraph` 初始化中传递，图如何获得对此模式的访问权限？我们可以这样做，因为_节点也可以声明额外的状态通道_，只要状态模式定义存在。在这种情况下，`PrivateState` 模式已定义，因此我们可以将 `bar` 添加为图中的新状态通道并写入它。

### Reducers

Reducers 是理解节点更新如何应用到 `State` 的关键。`State` 中的每个键都有其独立的 reducer 函数。如果没有显式指定 reducer 函数，则假定对该键的所有更新都应覆盖它。有几种不同类型的 reducers，从默认的 reducer 类型开始：

#### 默认 reducer

这两个示例展示了如何使用默认 reducer：

```typescript [Example A]
const State = z.object({
  foo: z.number(),
  bar: z.array(z.string()),
});
```

在这个例子中，没有为任何键指定 reducer 函数。假设图的输入是：

`{ foo: 1, bar: ["hi"] }`。然后假设第一个 `Node` 返回 `{ foo: 2 }`。这被视为对状态的更新。请注意，`Node` 不需要返回整个 `State` 模式——只需要一个更新。应用此更新后，`State` 将变为 `{ foo: 2, bar: ["hi"] }`。如果第二个节点返回 `{ bar: ["bye"] }`，那么 `State` 将变为 `{ foo: 2, bar: ["bye"] }`

```typescript [Example B]
import * as z from "zod";
import { registry } from "@langchain/langgraph/zod";

const State = z.object({
  foo: z.number(),
  bar: z.array(z.string()).register(registry, {
    reducer: {
      fn: (x, y) => x.concat(y),
    },
    default: () => [] as string[],
  }),
});
```

在这个例子中，我们使用了 [Zod 4 注册表](https://zod.dev/metadata) 来为第二个键（`bar`）指定一个 reducer 函数。请注意，第一个键保持不变。假设图的输入是 `{ foo: 1, bar: ["hi"] }`。然后假设第一个 `Node` 返回 `{ foo: 2 }`。这被视为对状态的更新。请注意，`Node` 不需要返回整个 `State` 模式——只需要一个更新。应用此更新后，`State` 将变为 `{ foo: 2, bar: ["hi"] }`。如果第二个节点返回 `{ bar: ["bye"] }`，那么 `State` 将变为 `{ foo: 2, bar: ["hi", "bye"] }`。请注意，这里 `bar` 键是通过将两个数组相加来更新的。

### 在图状态中使用消息

#### 为什么使用消息？

大多数现代 LLM 提供商都有一个聊天模型接口，接受消息列表作为输入。特别是 LangChain 的[聊天模型接口](/oss/langchain/models)接受消息对象列表作为输入。这些消息有多种形式，例如 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.HumanMessage.html" target="_blank" rel="noreferrer" class="link"><code>HumanMessage</code></a>（用户输入）或 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a>（LLM 响应）。

要了解更多关于消息对象的信息，请参阅[消息概念指南](/oss/langchain/messages)。

#### 在您的图中使用消息

在许多情况下，将先前的对话历史记录作为消息列表存储在您的图状态中是有帮助的。为此，我们可以向图状态添加一个键（通道），用于存储 `Message` 对象列表，并使用 reducer 函数对其进行注释（参见下面的示例中的 `messages` 键）。reducer 函数对于告诉图如何用每次状态更新（例如，当节点发送更新时）来更新状态中的 `Message` 对象列表至关重要。如果您不指定 reducer，每次状态更新都会用最近提供的值覆盖消息列表。如果您想简单地将消息追加到现有列表中，可以使用连接数组的函数作为 reducer。

但是，您可能还想手动更新图状态中的消息（例如，人在回路中）。如果您使用简单的连接函数，您发送到图的手动状态更新将被追加到现有的消息列表中，而不是更新现有消息。为了避免这种情况，您需要一个能够跟踪消息 ID 并在更新时覆盖现有消息的 reducer。为了实现这一点，您可以使用预构建的 `messagesStateReducer` 函数，或者当状态模式使用 Zod 定义时使用 `MessagesZodMeta`。对于全新的消息，它只会追加到现有列表，但它也会正确处理现有消息的更新。

#### 序列化

除了跟踪消息ID外，每当在`messages`通道上接收到状态更新时，`MessagesZodMeta`也会尝试将消息反序列化为LangChain的`Message`对象。这允许以以下格式发送图输入/状态更新：

```typescript
// this is supported
{
  messages: [new HumanMessage("message")];
}

// and this is also supported
{
  messages: [{ role: "human", content: "message" }];
}
```

由于在使用`MessagesZodMeta`时，状态更新总是被反序列化为LangChain的`Messages`，因此你应该使用点表示法来访问消息属性，例如`state.messages[state.messages.length - 1].content`。下面是一个使用`MessagesZodMeta`的图示例：

```typescript
import { StateGraph, MessagesZodMeta } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const MessagesZodState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

const graph = new StateGraph(MessagesZodState)
  ...
```

`MessagesZodState`定义了一个单一的`messages`键，它是一个<a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.BaseMessage.html" target="_blank" rel="noreferrer" class="link"><code>BaseMessage</code></a>对象列表，并使用适当的归约器。通常，除了消息之外，还需要跟踪更多的状态，所以我们看到人们扩展这个状态并添加更多字段，例如：

```typescript
const State = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
  documents: z.array(z.string()),
});
```

## 节点

在LangGraph中，节点通常是接受以下参数的函数（同步或异步）：

1. `state` – 图的[状态](#state)
2. `config` – 一个包含配置信息（如`thread_id`）和追踪信息（如`tags`）的<a href="https://reference.langchain.com/javascript/interfaces/_langchain_core.runnables.RunnableConfig.html" target="_blank" rel="noreferrer" class="link"><code>RunnableConfig</code></a>对象

你可以使用`addNode`方法将节点添加到图中。

```typescript
import { StateGraph } from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import * as z from "zod";

const State = z.object({
  input: z.string(),
  results: z.string(),
});

const builder = new StateGraph(State);
  .addNode("myNode", (state, config) => {
    console.log("In node: ", config?.configurable?.user_id);
    return { results: `Hello, ${state.input}!` };
  })
  addNode("otherNode", (state) => {
    return state;
  })
  ...
```

在幕后，函数被转换为[`RunnableLambda`](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)，它为你的函数添加了批处理和异步支持，以及原生的追踪和调试功能。

如果你向图中添加一个节点而没有指定名称，它将被赋予一个默认名称，等同于函数名。

```typescript
builder.addNode(myNode);
// You can then create edges to/from this node by referencing it as `"myNode"`
```

### `START` 节点

<a href="https://reference.langchain.com/javascript/variables/_langchain_langgraph.index.START.html" target="_blank" rel="noreferrer" class="link"><code>START</code></a>节点是一个特殊节点，代表将用户输入发送到图的节点。引用此节点的主要目的是确定应该首先调用哪些节点。

```typescript
import { START } from "@langchain/langgraph";

graph.addEdge(START, "nodeA");
```

### `END` 节点

`END`节点是一个代表终端节点的特殊节点。当你想要表示哪些边在完成后没有后续操作时，会引用此节点。

```typescript
import { END } from "@langchain/langgraph";

graph.addEdge("nodeA", END);
```

### 节点缓存

LangGraph支持基于节点输入的任务/节点缓存。要使用缓存：

- 在编译图（或指定入口点）时指定一个缓存
- 为节点指定缓存策略。每个缓存策略支持：
  - `keyFunc`，用于基于节点输入生成缓存键。
  - `ttl`，缓存的生存时间（秒）。如果未指定，缓存将永不过期。

```typescript
import { StateGraph, MessagesZodMeta } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";
import { InMemoryCache } from "@langchain/langgraph-checkpoint";

const MessagesZodState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

const graph = new StateGraph(MessagesZodState)
  .addNode(
    "expensive_node",
    async () => {
      // Simulate an expensive operation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return { result: 10 };
    },
    { cachePolicy: { ttl: 3 } }
  )
  .addEdge(START, "expensive_node")
  .compile({ cache: new InMemoryCache() });

await graph.invoke({ x: 5 }, { streamMode: "updates" });   // [!code highlight]
// [{"expensive_node": {"result": 10}}]
await graph.invoke({ x: 5 }, { streamMode: "updates" });   // [!code highlight]
// [{"expensive_node": {"result": 10}, "__metadata__": {"cached": true}}]
```

## 边

边定义了逻辑如何路由以及图如何决定停止。这是你的代理如何工作以及不同节点如何相互通信的重要组成部分。有几种关键类型的边：

- 普通边：直接从一个节点到下一个节点。
- 条件边：调用一个函数来确定接下来要转到哪个节点（或多个节点）。
- 入口点：当用户输入到达时首先调用哪个节点。
- 条件入口点：调用一个函数来确定当用户输入到达时首先调用哪个节点（或多个节点）。

一个节点可以有多个出边。如果一个节点有多个出边，**所有**这些目标节点将作为下一个超步的一部分并行执行。

### 普通边

如果你**总是**想从节点A转到节点B，可以直接使用<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html#addEdge" target="_blank" rel="noreferrer" class="link"><code>addEdge</code></a>方法。

```typescript
graph.addEdge("nodeA", "nodeB");
```

### 条件边

如果你想**有条件地**路由到一个或多个边（或选择性地终止），可以使用<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html#addConditionalEdges" target="_blank" rel="noreferrer" class="link"><code>addConditionalEdges</code></a>方法。该方法接受一个节点名称和一个在该节点执行后调用的“路由函数”：

```typescript
graph.addConditionalEdges("nodeA", routingFunction);
```

与节点类似，`routingFunction`接受图的当前`state`并返回一个值。

默认情况下，`routingFunction`的返回值被用作下一个要发送状态的节点（或节点列表）的名称。所有这些节点将作为下一个超步的一部分并行运行。

你可以选择提供一个对象，将`routingFunction`的输出映射到下一个节点的名称。

```typescript
graph.addConditionalEdges("nodeA", routingFunction, {
  true: "nodeB",
  false: "nodeC",
});
```

<Tip>

如果你想在单个函数中结合状态更新和路由，请使用[`Command`](#command)而不是条件边。

</Tip>

### 入口点

入口点是图启动时首先运行的节点。你可以使用从虚拟<a href="https://reference.langchain.com/javascript/variables/_langchain_langgraph.index.START.html" target="_blank" rel="noreferrer" class="link"><code>START</code></a>节点到要执行的第一个节点的<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html#addEdge" target="_blank" rel="noreferrer" class="link"><code>addEdge</code></a>方法来指定图的入口位置。

```typescript
import { START } from "@langchain/langgraph";

graph.addEdge(START, "nodeA");
```

### 条件入口点

条件入口点允许你根据自定义逻辑从不同的节点开始。你可以使用从虚拟<a href="https://reference.langchain.com/javascript/variables/_langchain_langgraph.index.START.html" target="_blank" rel="noreferrer" class="link"><code>START</code></a>节点出发的<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html#addConditionalEdges" target="_blank" rel="noreferrer" class="link"><code>addConditionalEdges</code></a>来实现这一点。

```typescript
import { START } from "@langchain/langgraph";

graph.addConditionalEdges(START, routingFunction);
```

你可以选择提供一个对象，将`routingFunction`的输出映射到下一个节点的名称。

```typescript
graph.addConditionalEdges(START, routingFunction, {
  true: "nodeB",
  false: "nodeC",
});
```

## `Send`

默认情况下，`Nodes`和`Edges`是预先定义的，并在相同的共享状态上操作。然而，有些情况下，确切的边是事先未知的，和/或你可能希望同时存在不同版本的`State`。一个常见的例子是map-reduce设计模式。在这种设计模式中，第一个节点可能生成一个对象列表，你可能希望将其他节点应用于所有这些对象。对象的数量可能事先未知（意味着边的数量可能未知），并且下游`Node`的输入`State`应该不同（每个生成的对象一个）。

为了支持这种设计模式，LangGraph支持从条件边返回<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Send.html" target="_blank" rel="noreferrer" class="link"><code>Send</code></a>对象。`Send`接受两个参数：第一个是节点名称，第二个是传递给该节点的状态。

```typescript
import { Send } from "@langchain/langgraph";

graph.addConditionalEdges("nodeA", (state) => {
  return state.subjects.map((subject) => new Send("generateJoke", { subject }));
});
```

## `Command`

将控制流（边）和状态更新（节点）结合起来可能很有用。例如，你可能希望在**同一个**节点中**同时**执行状态更新**并**决定接下来转到哪个节点。LangGraph提供了一种方法，通过从节点函数返回一个<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a>对象来实现这一点：

```typescript
import { Command } from "@langchain/langgraph";

graph.addNode("myNode", (state) => {
  return new Command({
    update: { foo: "bar" },
    goto: "myOtherNode",
  });
});
```

使用<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a>，你还可以实现动态控制流行为（与[条件边](#conditional-edges)完全相同）：

```typescript
import { Command } from "@langchain/langgraph";

graph.addNode("myNode", (state) => {
  if (state.foo === "bar") {
    return new Command({
      update: { foo: "baz" },
      goto: "myOtherNode",
    });
  }
});
```

当在你的节点函数中使用<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a>时，你必须在添加节点时指定`ends`参数，以指定它可以路由到哪些节点：

```typescript
builder.addNode("myNode", myNode, {
  ends: ["myOtherNode", END],
});
```

<Note>

当在你的节点函数中返回<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a>时，你必须添加返回类型注解，并列出节点可以路由到的节点名称列表，例如`Command[Literal["my_other_node"]]`。这对于图渲染是必要的，并告诉LangGraph`my_node`可以导航到`my_other_node`。

</Note>

查看这个[操作指南](/oss/langgraph/use-graph-api#combine-control-flow-and-state-updates-with-command)，了解如何使用<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a>的端到端示例。

### 我应该何时使用Command而不是条件边？

- 当你需要**同时**更新图状态**并**路由到不同节点时，使用<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a>。例如，在实现[多代理交接](/oss/langchain/multi-agent/handoffs)时，路由到不同的代理并向该代理传递一些信息非常重要。
- 使用[条件边](#conditional-edges)来有条件地在节点之间路由，而不更新状态。

### 导航到父图中的节点

如果你正在使用[子图](/oss/langgraph/use-subgraphs)，你可能希望从子图内的节点导航到不同的子图（即父图中的不同节点）。为此，你可以在`Command`中指定`graph: Command.PARENT`：

```typescript
import { Command } from "@langchain/langgraph";

graph.addNode("myNode", (state) => {
  return new Command({
    update: { foo: "bar" },
    goto: "otherSubgraph", // where `otherSubgraph` is a node in the parent graph
    graph: Command.PARENT,
  });
});
```

<Note>

将`graph`设置为`Command.PARENT`将导航到最近的父图。

当你从子图节点向父图节点发送更新，且更新的键由父图和子图[状态模式](#schema)共享时，你<strong>必须</strong>在父图状态中为你正在更新的键定义一个[归约器](#reducers)。

</Note>

这在实现[多代理交接](/oss/langchain/multi-agent/handoffs)时特别有用。

查看[本指南](/oss/langgraph/use-graph-api#navigate-to-a-node-in-a-parent-graph)了解详情。

### 在工具内部使用

一个常见的用例是从工具内部更新图状态。例如，在客户支持应用程序中，你可能希望在对话开始时根据客户的账号或ID查找客户信息。

请参阅[本指南](/oss/langgraph/use-graph-api#use-inside-tools)了解详情。

### 人在回路中

<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 是人机协同工作流的重要组成部分：当使用 `interrupt()` 收集用户输入时，<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 随后用于提供输入并通过 `new Command({ resume: "用户输入" })` 恢复执行。查看[人机协同概念指南](/oss/langgraph/interrupts)了解更多信息。

## 图迁移

LangGraph 可以轻松处理图定义（节点、边和状态）的迁移，即使在使用检查点跟踪状态时也是如此。

- 对于图末尾的线程（即未中断的线程），您可以更改图的整个拓扑结构（即所有节点和边，删除、添加、重命名等）
- 对于当前中断的线程，我们支持除重命名/删除节点之外的所有拓扑更改（因为该线程可能即将进入一个不再存在的节点）——如果这成为阻碍，请联系我们，我们可以优先解决。
- 对于修改状态，我们在添加和删除键方面具有完全的向前和向后兼容性
- 重命名的状态键在现有线程中会丢失其保存的状态
- 类型以不兼容方式更改的状态键目前可能会在包含更改前状态的线程中引发问题——如果这成为阻碍，请联系我们，我们可以优先解决。

## 运行时上下文

创建图时，可以为传递给节点的运行时上下文指定 `contextSchema`。这对于向节点传递不属于图状态的信息非常有用。例如，您可能希望传递模型名称或数据库连接等依赖项。

```typescript
import * as z from "zod";

const ContextSchema = z.object({
  llm: z.union([z.literal("openai"), z.literal("anthropic")]),
});

const graph = new StateGraph(State, ContextSchema);
```

然后，您可以使用 `context` 属性将此配置传递到图中。

```typescript
const config = { context: { llm: "anthropic" } };

await graph.invoke(inputs, config);
```

然后，您可以在节点或条件边内部访问和使用此上下文：

```typescript
import { Runtime } from "@langchain/langgraph";
import * as z from "zod";

const nodeA = (
  state: z.infer<typeof State>,
  runtime: Runtime<z.infer<typeof ContextSchema>>,
) => {
  const llm = getLLM(runtime.context?.llm);
  // ...
};
```

查看[此指南](/oss/langgraph/use-graph-api#add-runtime-configuration)以获取关于配置的完整解析。

```typescript
graph.addNode("myNode", (state, runtime) => {
  const llmType = runtime.context?.llm || "openai";
  const llm = getLLM(llmType);
  return { results: `Hello, ${state.input}!` };
});
```

### 递归限制

递归限制设置了图在单次执行期间可以执行的[超级步骤](#graphs)的最大数量。一旦达到限制，LangGraph 将引发 `GraphRecursionError`。默认情况下，此值设置为 25 步。递归限制可以在运行时在任何图上设置，并通过配置对象传递给 `invoke`/`stream`。重要的是，`recursionLimit` 是一个独立的 `config` 键，不应像所有其他用户定义的配置一样传递到 `configurable` 键内部。请参见以下示例：

```typescript
await graph.invoke(inputs, {
  recursionLimit: 5,
  context: { llm: "anthropic" },
});
```

### 访问和处理递归计数器

当前步骤计数器可在任何节点内的 `config.metadata.langgraph_step` 中访问，允许在达到递归限制之前进行主动的递归处理。这使您能够在图逻辑中实现优雅降级策略。

#### 工作原理

步骤计数器存储在 `config.metadata.langgraph_step` 中。递归限制检查遵循以下逻辑：`step > stop`，其中 `stop = step + recursionLimit + 1`。当超过限制时，LangGraph 会引发 `GraphRecursionError`。

#### 访问当前步骤计数器

您可以在任何节点内访问当前步骤计数器以监控执行进度。

```typescript
import { RunnableConfig } from "@langchain/core/runnables";
import { StateGraph } from "@langchain/langgraph";

async function myNode(state: any, config: RunnableConfig): Promise<any> {
  const currentStep = config.metadata?.langgraph_step;
  console.log(`Currently on step: ${currentStep}`);
  return state;
}
```

#### 主动递归处理

LangGraph 提供了一个 `RemainingSteps` 托管值，用于跟踪在达到递归限制之前剩余的步骤数。这允许在图内进行优雅降级。

设计具有明确终止条件的图，并将 `GraphRecursionError` 作为安全网捕获：

```typescript
import { StateGraph, END, GraphRecursionError } from "@langchain/langgraph";

interface State {
  messages: string[];
}

async function reasoningNode(state: State): Promise<Partial<State>> {
  // Normal processing - design your graph with explicit termination conditions
  return {
    messages: [...state.messages, "thinking..."]
  };
}

// Build graph with explicit termination logic
const graph = new StateGraph<State>({ channels: {} })
  .addNode("reasoning", reasoningNode)
  .addConditionalEdges("reasoning", (state) => {
    // Add your termination condition here
    if (state.messages.length >= 5) {
      return END;
    }
    return "reasoning";
  });

const app = graph.compile();

// Catch GraphRecursionError as a safety net
try {
  const result = await app.invoke(
    { messages: [] },
    { recursionLimit: 10 }
  );
} catch (error) {
  if (error instanceof GraphRecursionError) {
    console.log("Recursion limit reached, handling gracefully");
    // Handle the error - return partial results, notify user, etc.
  }
}
```

#### 主动与被动方法

处理递归限制主要有两种方法：主动（在图内监控）和被动（在外部捕获错误）。

```typescript
import { StateGraph, END, GraphRecursionError } from "@langchain/langgraph";

interface State {
  messages: string[];
}

async function agent(state: State): Promise<Partial<State>> {
  return {
    messages: [...state.messages, "Processing..."]
  };
}

// Build graph with explicit termination logic
const builder = new StateGraph<State>({ channels: {} })
  .addNode("agent", agent)
  .addConditionalEdges("agent", (state) => {
    // Design termination conditions into your graph
    if (state.messages.length >= 5) {
      return END;
    }
    return "agent";
  });

const graph = builder.compile();

// Reactive Approach - catch GraphRecursionError as safety net
try {
  const result = await graph.invoke(
    { messages: [] },
    { recursionLimit: 10 }
  );
} catch (error) {
  if (error instanceof GraphRecursionError) {
    // Handle externally after graph execution fails
    console.log("Recursion limit exceeded, handling gracefully");
  }
}
```

被动方法在超过限制后捕获 `GraphRecursionError`。设计具有明确终止条件的图，以避免首先达到限制。

| 方法 | 检测时机 | 处理方式 | 控制流 |
|----------|-----------|----------|--------------|
| 被动（捕获 `GraphRecursionError`） | 在超过限制之后 | 在 try/catch 块中在图外部处理 | 图执行终止 |

**被动方法的优势：**

- 实现简单
- 无需修改图逻辑
- 集中式错误处理

#### 其他可用的元数据

除了 `langgraph_step` 之外，以下元数据也可在 `config.metadata` 中获取：

```typescript
async function inspectMetadata(
  state: any,
  config: RunnableConfig
): Promise<any> {
  const metadata = config.metadata;

  console.log(`Step: ${metadata?.langgraph_step}`);
  console.log(`Node: ${metadata?.langgraph_node}`);
  console.log(`Triggers: ${metadata?.langgraph_triggers}`);
  console.log(`Path: ${metadata?.langgraph_path}`);
  console.log(`Checkpoint NS: ${metadata?.langgraph_checkpoint_ns}`);

  return state;
}
```

## 可视化

能够可视化图通常很有帮助，尤其是当它们变得更加复杂时。LangGraph 提供了几种内置的可视化图的方法。查看[此操作指南](/oss/langgraph/use-graph-api#visualize-your-graph)以获取更多信息。

