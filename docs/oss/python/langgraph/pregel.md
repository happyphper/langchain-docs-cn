---
title: LangGraph 运行时 (LangGraph runtime)
sidebarTitle: 运行时 (Runtime)
---

<a href="https://reference.langchain.com/python/langgraph/pregel/" target="_blank" rel="noreferrer" class="link"><code>Pregel</code></a> 实现了 LangGraph 的运行时，负责管理 LangGraph 应用程序的执行。

编译一个 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link">StateGraph</a> 或创建一个 <a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint" target="_blank" rel="noreferrer" class="link"><code>@entrypoint</code></a> 会产生一个 <a href="https://reference.langchain.com/python/langgraph/pregel/" target="_blank" rel="noreferrer" class="link"><code>Pregel</code></a> 实例，该实例可以通过输入来调用。

本指南从高层次解释了该运行时，并提供了直接使用 Pregel 实现应用程序的说明。

> **注意：** <a href="https://reference.langchain.com/python/langgraph/pregel/" target="_blank" rel="noreferrer" class="link"><code>Pregel</code></a> 运行时以 [Google 的 Pregel 算法](https://research.google/pubs/pub37252/) 命名，该算法描述了一种使用图进行大规模并行计算的高效方法。

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

* <a href="https://reference.langchain.com/python/langgraph/channels/#langgraph.channels.LastValue" target="_blank" rel="noreferrer" class="link"><code>LastValue</code></a>：默认通道，存储发送到通道的最后一个值，适用于输入和输出值，或用于将数据从一个步骤发送到下一个步骤。
* <a href="https://reference.langchain.com/python/langgraph/channels/#langgraph.channels.Topic" target="_blank" rel="noreferrer" class="link"><code>Topic</code></a>：一个可配置的发布-订阅主题，适用于在 **参与者** 之间发送多个值，或用于累积输出。可以配置为去重或在多个步骤过程中累积值。
* <a href="https://reference.langchain.com/python/langgraph/pregel/#langgraph.pregel.Pregel--advanced-channels-context-and-binaryoperatoraggregate" target="_blank" rel="noreferrer" class="link"><code>BinaryOperatorAggregate</code></a>：存储一个持久值，通过对当前值和发送到通道的每个更新应用二元运算符来更新，适用于跨多个步骤计算聚合；例如，`total = BinaryOperatorAggregate(int, operator.add)`

## 示例 (Examples)

虽然大多数用户将通过 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link">StateGraph</a> API 或 <a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint" target="_blank" rel="noreferrer" class="link"><code>@entrypoint</code></a> 装饰器与 Pregel 交互，但也可以直接与 Pregel 交互。

以下是几个不同的示例，让您了解 Pregel API。

<Tabs>

<Tab title="单节点 (Single node)">

```python
from langgraph.channels import EphemeralValue
from langgraph.pregel import Pregel, NodeBuilder

node1 = (
    NodeBuilder().subscribe_only("a")
    .do(lambda x: x + x)
    .write_to("b")
)

app = Pregel(
    nodes={"node1": node1},
    channels={
        "a": EphemeralValue(str),
        "b": EphemeralValue(str),
    },
    input_channels=["a"],
    output_channels=["b"],
)

app.invoke({"a": "foo"})
```

```con
{'b': 'foofoo'}
```

</Tab>

<Tab title="多节点 (Multiple nodes)">

```python
from langgraph.channels import LastValue, EphemeralValue
from langgraph.pregel import Pregel, NodeBuilder

node1 = (
    NodeBuilder().subscribe_only("a")
    .do(lambda x: x + x)
    .write_to("b")
)

node2 = (
    NodeBuilder().subscribe_only("b")
    .do(lambda x: x + x)
    .write_to("c")
)

app = Pregel(
    nodes={"node1": node1, "node2": node2},
    channels={
        "a": EphemeralValue(str),
        "b": LastValue(str),
        "c": EphemeralValue(str),
    },
    input_channels=["a"],
    output_channels=["b", "c"],
)

app.invoke({"a": "foo"})
```

```con
{'b': 'foofoo', 'c': 'foofoofoofoo'}
```

</Tab>

<Tab title="主题 (Topic)">

```python
from langgraph.channels import EphemeralValue, Topic
from langgraph.pregel import Pregel, NodeBuilder

node1 = (
    NodeBuilder().subscribe_only("a")
    .do(lambda x: x + x)
    .write_to("b", "c")
)

node2 = (
    NodeBuilder().subscribe_to("b")
    .do(lambda x: x["b"] + x["b"])
    .write_to("c")
)

app = Pregel(
    nodes={"node1": node1, "node2": node2},
    channels={
        "a": EphemeralValue(str),
        "b": EphemeralValue(str),
        "c": Topic(str, accumulate=True),
    },
    input_channels=["a"],
    output_channels=["c"],
)

app.invoke({"a": "foo"})
```

```pycon
{'c': ['foofoo', 'foofoofoofoo']}
```

</Tab>

<Tab title="二元运算符聚合 (BinaryOperatorAggregate)">

本示例演示了如何使用 <a href="https://reference.langchain.com/python/langgraph/pregel/#langgraph.pregel.Pregel--advanced-channels-context-and-binaryoperatoraggregate" target="_blank" rel="noreferrer" class="link"><code>BinaryOperatorAggregate</code></a> 通道来实现一个归约器 (reducer)。

```python
from langgraph.channels import EphemeralValue, BinaryOperatorAggregate
from langgraph.pregel import Pregel, NodeBuilder

node1 = (
    NodeBuilder().subscribe_only("a")
    .do(lambda x: x + x)
    .write_to("b", "c")
)

node2 = (
    NodeBuilder().subscribe_only("b")
    .do(lambda x: x + x)
    .write_to("c")
)

def reducer(current, update):
    if current:
        return current + " | " + update
    else:
        return update

app = Pregel(
    nodes={"node1": node1, "node2": node2},
    channels={
        "a": EphemeralValue(str),
        "b": EphemeralValue(str),
        "c": BinaryOperatorAggregate(str, operator=reducer),
    },
    input_channels=["a"],
    output_channels=["c"],
)

app.invoke({"a": "foo"})
```

</Tab>

<Tab title="循环 (Cycle)">

此示例演示了如何通过让一个链向其订阅的通道写入数据，从而在图中引入循环。执行将持续进行，直到向通道写入 `None` 值。

```python
from langgraph.channels import EphemeralValue
from langgraph.pregel import Pregel, NodeBuilder, ChannelWriteEntry

example_node = (
    NodeBuilder().subscribe_only("value")
    .do(lambda x: x + x if len(x) < 10 else None)
    .write_to(ChannelWriteEntry("value", skip_none=True))
)

app = Pregel(
    nodes={"example_node": example_node},
    channels={
        "value": EphemeralValue(str),
    },
    input_channels=["value"],
    output_channels=["value"],
)

app.invoke({"value": "a"})
```

```pycon
{'value': 'aaaaaaaaaaaaaaaa'}
```

</Tab>

</Tabs>

## 高级 API (High-level API)

LangGraph 提供了两个用于创建 Pregel 应用程序的高级 API：[StateGraph (图 API)](/oss/langgraph/graph-api) 和 [函数式 API (Functional API)](/oss/langgraph/functional-api)。

<Tabs>

<Tab title="StateGraph (图 API)">

<a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link">StateGraph (图 API)</a> 是一个更高级别的抽象，它简化了 Pregel 应用程序的创建。它允许您定义节点和边的图。当您编译图时，StateGraph API 会自动为您创建 Pregel 应用程序。

```python
from typing import TypedDict

from langgraph.constants import START
from langgraph.graph import StateGraph

class Essay(TypedDict):
    topic: str
    content: str | None
    score: float | None

def write_essay(essay: Essay):
    return {
        "content": f"Essay about {essay['topic']}",
    }

def score_essay(essay: Essay):
    return {
        "score": 10
    }

builder = StateGraph(Essay)
builder.add_node(write_essay)
builder.add_node(score_essay)
builder.add_edge(START, "write_essay")
builder.add_edge("write_essay", "score_essay")

# 编译图。
# 这将返回一个 Pregel 实例。
graph = builder.compile()
```

编译后的 Pregel 实例将与一系列节点和通道相关联。您可以通过打印它们来检查节点和通道。

```python
print(graph.nodes)
```

您将看到类似这样的内容：

```pycon
{'__start__': <langgraph.pregel.read.PregelNode at 0x7d05e3ba1810>,
 'write_essay': <langgraph.pregel.read.PregelNode at 0x7d05e3ba14d0>,
 'score_essay': <langgraph.pregel.read.PregelNode at 0x7d05e3ba1710>}
```

```python
print(graph.channels)
```

您将看到类似这样的内容：

```pycon
{'topic': <langgraph.channels.last_value.LastValue at 0x7d05e3294d80>,
 'content': <langgraph.channels.last_value.LastValue at 0x7d05e3295040>,
 'score': <langgraph.channels.last_value.LastValue at 0x7d05e3295980>,
 '__start__': <langgraph.channels.ephemeral_value.EphemeralValue at 0x7d05e3297e00>,
 'write_essay': <langgraph.channels.ephemeral_value.EphemeralValue at 0x7d05e32960c0>,
 'score_essay': <langgraph.channels.ephemeral_value.EphemeralValue at 0x7d05e2d8ab80>,
 'branch:__start__:__self__:write_essay': <langgraph.channels.ephemeral_value.EphemeralValue at 0x7d05e32941c0>,
 'branch:__start__:__self__:score_essay': <langgraph.channels.ephemeral_value.EphemeralValue at 0x7d05e2d88800>,
 'branch:write_essay:__self__:write_essay': <langgraph.channels.ephemeral_value.EphemeralValue at 0x7d05e3295ec0>,
 'branch:write_essay:__self__:score_essay': <langgraph.channels.ephemeral_value.EphemeralValue at 0x7d05e2d8ac00>,
 'branch:score_essay:__self__:write_essay': <langgraph.channels.ephemeral_value.EphemeralValue at 0x7d05e2d89700>,
 'branch:score_essay:__self__:score_essay': <langgraph.channels.ephemeral_value.EphemeralValue at 0x7d05e2d8b400>,
 'start:write_essay': <langgraph.channels.ephemeral_value.EphemeralValue at 0x7d05e2d8b280>}
```

</Tab>

<Tab title="函数式 API (Functional API)">

在 [函数式 API (Functional API)](/oss/langgraph/functional-api) 中，您可以使用 <a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint" target="_blank" rel="noreferrer" class="link"><code>@entrypoint</code></a> 来创建 Pregel 应用程序。`entrypoint` 装饰器允许您定义一个接收输入并返回输出的函数。

```python
from typing import TypedDict

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.func import entrypoint

class Essay(TypedDict):
    topic: str
    content: str | None
    score: float | None

checkpointer = InMemorySaver()

@entrypoint(checkpointer=checkpointer)
def write_essay(essay: Essay):
    return {
        "content": f"Essay about {essay['topic']}",
    }

print("Nodes: ")
print(write_essay.nodes)
print("Channels: ")
print(write_essay.channels)
```

```pycon
Nodes:
{'write_essay': <langgraph.pregel.read.PregelNode object at 0x7d05e2f9aad0>}
Channels:
{'__start__': <langgraph.channels.ephemeral_value.EphemeralValue object at 0x7d05e2c906c0>, '__end__': <langgraph.channels.last_value.LastValue object at 0x7d05e2c90c40>, '__previous__': <langgraph.channels.last_value.LastValue object at 0x7d05e1007280>}
```

</Tab>

</Tabs>

