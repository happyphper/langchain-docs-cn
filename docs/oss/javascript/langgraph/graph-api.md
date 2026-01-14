---
title: Graph API 概览
sidebarTitle: Graph API
---
## 图

LangGraph 的核心是将智能体（agent）工作流建模为图。您可以使用三个关键组件来定义智能体的行为：

1. [`State`](#state)：一个共享的数据结构，代表应用程序的当前快照。它可以是任何数据类型，但通常使用共享状态模式（schema）来定义。

2. [`Nodes`](#nodes)：编码智能体逻辑的函数。它们接收当前状态作为输入，执行一些计算或产生副作用，并返回更新后的状态。

3. [`Edges`](#edges)：根据当前状态决定接下来执行哪个 `Node` 的函数。它们可以是条件分支或固定转换。

通过组合 `Nodes` 和 `Edges`，您可以创建随时间推移而状态演变的复杂、循环工作流。然而，真正的威力来自于 LangGraph 如何管理该状态。

需要强调的是：`Nodes` 和 `Edges` 只不过是函数——它们可以包含一个 LLM 或者仅仅是普通的代码。

简而言之：_节点执行工作，边决定下一步做什么_。

LangGraph 底层的图算法使用[消息传递](https://en.wikipedia.org/wiki/Message_passing)来定义一个通用程序。当一个节点完成其操作时，它会沿着一条或多条边向其他节点发送消息。这些接收节点然后执行其函数，将结果消息传递给下一组节点，过程持续进行。受谷歌的 [Pregel](https://research.google/pubs/pregel-a-system-for-large-scale-graph-processing/) 系统启发，该程序以离散的“超级步（super-step）”进行。

一个超级步可以被视为对图节点的一次迭代。并行运行的节点属于同一个超级步，而顺序运行的节点则属于不同的超级步。在图执行开始时，所有节点都处于 `inactive` 状态。当一个节点在其任何传入边（或“通道”）上接收到新消息（状态）时，它就变为 `active`。然后，活动节点运行其函数并响应更新。在每个超级步结束时，没有传入消息的节点通过将自身标记为 `inactive` 来投票 `halt`。当所有节点都处于 `inactive` 状态且没有消息在传输中时，图执行终止。

### StateGraph

<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 类是主要使用的图类。它由用户定义的 `State` 对象参数化。

### 编译您的图

要构建您的图，您首先定义[状态](#state)，然后添加[节点](#nodes)和[边](#edges)，最后编译它。编译您的图到底是什么，为什么需要它？

编译是一个相当简单的步骤。它对图的结构进行一些基本检查（例如，没有孤立节点等）。这也是您可以指定运行时参数的地方，比如[检查点（checkpointers）](/oss/javascript/langgraph/persistence)和断点。您只需调用 `.compile` 方法来编译您的图：

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

定义图时首先要定义图的 `State`。`State` 包含图的[模式（schema）](#schema)以及指定如何对状态应用更新的 [`reducer` 函数](#reducers)。`State` 的模式将是图中所有 `Nodes` 和 `Edges` 的输入模式，可以是 Zod 模式或使用 `Annotation.Root` 构建的模式。所有 `Nodes` 都会向 `State` 发出更新，然后使用指定的 `reducer` 函数应用这些更新。

### 模式

指定图模式的主要文档化方法是使用 Zod 模式。但是，我们也支持使用 `Annotation` API 来定义图的模式。

默认情况下，图将具有相同的输入和输出模式。如果想改变这一点，也可以直接指定显式的输入和输出模式。这在有很多键，并且其中一些明确用于输入而另一些用于输出时非常有用。

#### 多个模式

通常，所有图节点都使用单一模式进行通信。这意味着它们将读取和写入相同的状态通道。但是，有些情况下我们需要对此进行更多控制：

- 内部节点可以传递图中输入/输出不需要的信息。
- 我们可能还希望为图使用不同的输入/输出模式。例如，输出可能只包含一个相关的输出键。

可以让节点写入图内部的私有状态通道，用于内部节点通信。我们可以简单地定义一个私有模式 `PrivateState`。

也可以为图定义显式的输入和输出模式。在这些情况下，我们定义一个“内部”模式，其中包含与图操作相关的*所有*键。但是，我们还定义 `input` 和 `output` 模式，它们是“内部”模式的子集，用于约束图的输入和输出。更多细节请参阅[本指南](/oss/javascript/langgraph/graph-api#define-input-and-output-schemas)。

让我们看一个例子：

除了 `langgraph_step`，以下元数据也可以在 `config.metadata` 中找到：

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

能够可视化图通常很有帮助，尤其是当它们变得更加复杂时。LangGraph 提供了几种内置的可视化图的方法。更多信息请参阅[此操作指南](/oss/javascript/langgraph/use-graph-api#visualize-your-graph)。
