---
title: 子图
sidebarTitle: Subgraphs
---
本指南解释了使用子图（subgraph）的机制。子图是一个[图](/oss/langgraph/graph-api#graphs)，在另一个图中用作[节点](/oss/langgraph/graph-api#nodes)。

子图适用于：
- 构建[多智能体系统](/oss/langchain/multi-agent)
- 在多个图中复用一组节点
- 分布式开发：当希望不同团队独立处理图的不同部分时，可以将每个部分定义为一个子图。只要子图接口（输入和输出模式）得到遵守，父图就可以在不知道子图任何细节的情况下构建

添加子图时，需要定义父图和子图之间的通信方式：

* [从节点调用图](#invoke-a-graph-from-a-node) —— 子图从父图的节点内部调用
* [将图添加为节点](#add-a-graph-as-a-node) —— 子图直接作为节点添加到父图中，并与父图**共享[状态键（state keys）](/oss/langgraph/graph-api#state)**

## 环境设置

```bash
npm install @langchain/langgraph
```

<Tip>

<strong>为 LangGraph 开发设置 LangSmith</strong>
注册 [LangSmith](https://smith.langchain.com) 以快速发现问题并提升 LangGraph 项目的性能。LangSmith 让你能够使用追踪数据来调试、测试和监控使用 LangGraph 构建的 LLM 应用 —— 阅读更多关于如何开始的[信息](https://docs.smith.langchain.com)。

</Tip>

## 从节点调用图

实现子图的一种简单方法是从另一个图的节点内部调用一个图。在这种情况下，子图可以拥有与父图**完全不同的模式**（没有共享的键）。例如，你可能希望在[多智能体](/oss/langchain/multi-agent)系统中为每个智能体保留私有的消息历史记录。

如果你的应用属于这种情况，你需要定义一个**调用子图的节点函数**。该函数需要在调用子图之前将输入（父）状态转换为子图状态，并在从节点返回状态更新之前将结果转换回父状态。

```typescript
import { StateGraph, START } from "@langchain/langgraph";
import * as z from "zod";

const SubgraphState = z.object({
  bar: z.string(),
});

// 子图
const subgraphBuilder = new StateGraph(SubgraphState)
  .addNode("subgraphNode1", (state) => {
    return { bar: "hi! " + state.bar };
  })
  .addEdge(START, "subgraphNode1");

const subgraph = subgraphBuilder.compile();

// 父图
const State = z.object({
  foo: z.string(),
});

// 将状态转换为子图状态并转换回来
const builder = new StateGraph(State)
  .addNode("node1", async (state) => {
    const subgraphOutput = await subgraph.invoke({ bar: state.foo });
    return { foo: subgraphOutput.bar };
  })
  .addEdge(START, "node1");

const graph = builder.compile();
```

:::: details 完整示例：不同的状态模式

```typescript
import { StateGraph, START } from "@langchain/langgraph";
import * as z from "zod";

// 定义子图
const SubgraphState = z.object({
  // 注意：这些键都没有与父图状态共享
  bar: z.string(),
  baz: z.string(),
});

const subgraphBuilder = new StateGraph(SubgraphState)
  .addNode("subgraphNode1", (state) => {
    return { baz: "baz" };
  })
  .addNode("subgraphNode2", (state) => {
    return { bar: state.bar + state.baz };
  })
  .addEdge(START, "subgraphNode1")
  .addEdge("subgraphNode1", "subgraphNode2");

const subgraph = subgraphBuilder.compile();

// 定义父图
const ParentState = z.object({
  foo: z.string(),
});

const builder = new StateGraph(ParentState)
  .addNode("node1", (state) => {
    return { foo: "hi! " + state.foo };
  })
  .addNode("node2", async (state) => {
    const response = await subgraph.invoke({ bar: state.foo });   // [!code highlight]
    return { foo: response.bar };   // [!code highlight]
  })
  .addEdge(START, "node1")
  .addEdge("node1", "node2");

const graph = builder.compile();

for await (const chunk of await graph.stream(
  { foo: "foo" },
  { subgraphs: true }
)) {
  console.log(chunk);
}
```

1. 将状态转换为子图状态
2. 将响应转换回父状态

```
[[], { node1: { foo: 'hi! foo' } }]
[['node2:9c36dd0f-151a-cb42-cbad-fa2f851f9ab7'], { subgraphNode1: { baz: 'baz' } }]
[['node2:9c36dd0f-151a-cb42-cbad-fa2f851f9ab7'], { subgraphNode2: { bar: 'hi! foobaz' } }]
[[], { node2: { foo: 'hi! foobaz' } }]
```

::::

:::: details 完整示例：不同的状态模式（两级子图）

这是一个包含两级子图的示例：父图 -> 子图 -> 孙图。

```typescript
import { StateGraph, START, END } from "@langchain/langgraph";
import * as z from "zod";

// 孙图
const GrandChildState = z.object({
  myGrandchildKey: z.string(),
});

const grandchild = new StateGraph(GrandChildState)
  .addNode("grandchild1", (state) => {
    // 注意：子图或父图的键在这里不可访问
    return { myGrandchildKey: state.myGrandchildKey + ", how are you" };
  })
  .addEdge(START, "grandchild1")
  .addEdge("grandchild1", END);

const grandchildGraph = grandchild.compile();

// 子图
const ChildState = z.object({
  myChildKey: z.string(),
});

const child = new StateGraph(ChildState)
  .addNode("child1", async (state) => {
    // 注意：父图或孙图的键在这里不可访问
    const grandchildGraphInput = { myGrandchildKey: state.myChildKey };   // [!code highlight]
    const grandchildGraphOutput = await grandchildGraph.invoke(grandchildGraphInput);
    return { myChildKey: grandchildGraphOutput.myGrandchildKey + " today?" };   // [!code highlight]
  })   // [!code highlight]
  .addEdge(START, "child1")
  .addEdge("child1", END);

const childGraph = child.compile();

// 父图
const ParentState = z.object({
  myKey: z.string(),
});

const parent = new StateGraph(ParentState)
  .addNode("parent1", (state) => {
    // 注意：子图或孙图的键在这里不可访问
    return { myKey: "hi " + state.myKey };
  })
  .addNode("child", async (state) => {
    const childGraphInput = { myChildKey: state.myKey };   // [!code highlight]
    const childGraphOutput = await childGraph.invoke(childGraphInput);
    return { myKey: childGraphOutput.myChildKey };   // [!code highlight]
  })   // [!code highlight]
  .addNode("parent2", (state) => {
    return { myKey: state.myKey + " bye!" };
  })
  .addEdge(START, "parent1")
  .addEdge("parent1", "child")
  .addEdge("child", "parent2")
  .addEdge("parent2", END);

const parentGraph = parent.compile();

for await (const chunk of await parentGraph.stream(
  { myKey: "Bob" },
  { subgraphs: true }
)) {
  console.log(chunk);
}
```

1. 我们将状态从子图状态通道 (`myChildKey`) 转换为孙图状态通道 (`myGrandchildKey`)
2. 我们将状态从孙图状态通道 (`myGrandchildKey`) 转换回子图状态通道 (`myChildKey`)
3. 我们在这里传递一个函数，而不仅仅是编译好的图 (`grandchildGraph`)
4. 我们将状态从父图状态通道 (`myKey`) 转换为子图状态通道 (`myChildKey`)
5. 我们将状态从子图状态通道 (`myChildKey`) 转换回父图状态通道 (`myKey`)
6. 我们在这里传递一个函数，而不仅仅是编译好的图 (`childGraph`)

```
[[], { parent1: { myKey: 'hi Bob' } }]
[['child:2e26e9ce-602f-862c-aa66-1ea5a4655e3b', 'child1:781bb3b1-3971-84ce-810b-acf819a03f9c'], { grandchild1: { myGrandchildKey: 'hi Bob, how are you' } }]
[['child:2e26e9ce-602f-862c-aa66-1ea5a4655e3b'], { child1: { myChildKey: 'hi Bob, how are you today?' } }]
[[], { child: { myKey: 'hi Bob, how are you today?' } }]
[[], { parent2: { myKey: 'hi Bob, how are you today? bye!' } }]
```

::::

## 将图添加为节点

当父图和子图可以通过[模式](/oss/langgraph/graph-api#state)中的共享状态键（通道）进行通信时，你可以将一个图作为[节点](/oss/langgraph/graph-api#nodes)添加到另一个图中。例如，在[多智能体](/oss/langchain/multi-agent)系统中，智能体通常通过共享的[消息](/oss/langgraph/graph-api#why-use-messages)键进行通信。

<img src="/oss/images/subgraph.png" alt="SQL agent graph" />

如果你的子图与父图共享状态键，可以按照以下步骤将其添加到你的图中：

:::python
1. 定义子图工作流（如下例中的 `subgraph_builder`）并编译它
2. 在定义父图工作流时，将编译好的子图传递给 @[
