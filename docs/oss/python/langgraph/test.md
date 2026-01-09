---
title: 测试
---
在完成 LangGraph 智能体（agent）的原型设计后，自然而然的下一步就是添加测试。本指南涵盖了一些在编写单元测试时可以使用的有用模式。

请注意，本指南是 LangGraph 特有的，涵盖了具有自定义结构的图（graph）相关场景——如果你是刚开始接触，请查看[此章节](/oss/langchain/test/)，该章节使用了 LangChain 内置的 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 函数。

## 前提条件

首先，确保你已经安装了 [`pytest`](https://docs.pytest.org/)：

```bash
$ pip install -U pytest
```

## 开始使用

由于许多 LangGraph 智能体依赖于状态（state），一个有用的模式是在每个使用它的测试之前创建你的图（graph），然后在测试中使用一个新的检查点（checkpointer）实例来编译它。

下面的示例展示了一个简单的线性图如何工作，该图依次经过 `node1` 和 `node2`。每个节点都会更新单一的状态键 `my_key`：

```python
import pytest

from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

def create_graph() -> StateGraph:
    class MyState(TypedDict):
        my_key: str

    graph = StateGraph(MyState)
    graph.add_node("node1", lambda state: {"my_key": "hello from node1"})
    graph.add_node("node2", lambda state: {"my_key": "hello from node2"})
    graph.add_edge(START, "node1")
    graph.add_edge("node1", "node2")
    graph.add_edge("node2", END)
    return graph

def test_basic_agent_execution() -> None:
    checkpointer = MemorySaver()
    graph = create_graph()
    compiled_graph = graph.compile(checkpointer=checkpointer)
    result = compiled_graph.invoke(
        {"my_key": "initial_value"},
        config={"configurable": {"thread_id": "1"}}
    )
    assert result["my_key"] == "hello from node2"
```

## 测试单个节点和边

已编译的 LangGraph 智能体将每个单独的节点引用暴露为 `graph.nodes`。你可以利用这一点来测试智能体中的单个节点。请注意，这将绕过在编译图时传递的任何检查点器（checkpointer）：

```python
import pytest

from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

def create_graph() -> StateGraph:
    class MyState(TypedDict):
        my_key: str

    graph = StateGraph(MyState)
    graph.add_node("node1", lambda state: {"my_key": "hello from node1"})
    graph.add_node("node2", lambda state: {"my_key": "hello from node2"})
    graph.add_edge(START, "node1")
    graph.add_edge("node1", "node2")
    graph.add_edge("node2", END)
    return graph

def test_individual_node_execution() -> None:
    # 在此示例中将被忽略
    checkpointer = MemorySaver()
    graph = create_graph()
    compiled_graph = graph.compile(checkpointer=checkpointer)
    # 仅调用节点 1
    result = compiled_graph.nodes["node1"].invoke(
        {"my_key": "initial_value"},
    )
    assert result["my_key"] == "hello from node1"
```

## 部分执行

对于由较大图组成的智能体，你可能希望测试智能体中的部分执行路径，而不是整个端到端流程。在某些情况下，[将这些部分重构为子图](/oss/langgraph/use-subgraphs)在语义上可能更合理，你可以像平常一样单独调用它们。

但是，如果你不希望更改智能体图的整体结构，则可以使用 LangGraph 的持久化机制来模拟一种状态：你的智能体在所需部分开始之前暂停，并在所需部分结束时再次暂停。步骤如下：

1.  使用检查点器（checkpointer）编译你的智能体（用于测试时，内存检查点器 <a href="https://reference.langchain.com/python/langgraph/checkpoints/#langgraph.checkpoint.memory.InMemorySaver" target="_blank" rel="noreferrer" class="link"><code>InMemorySaver</code></a> 就足够了）。
2.  调用智能体的 [`update_state`](/oss/langgraph/use-time-travel) 方法，并将 [`as_node`](/oss/langgraph/persistence#as-node) 参数设置为*你想要开始测试的节点之前*的那个节点的名称。
3.  使用你用来更新状态的相同 `thread_id` 调用你的智能体，并将 `interrupt_after` 参数设置为你想要停止的节点名称。

以下是一个示例，它仅执行线性图中的第二个和第三个节点：

```python
import pytest

from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

def create_graph() -> StateGraph:
    class MyState(TypedDict):
        my_key: str

    graph = StateGraph(MyState)
    graph.add_node("node1", lambda state: {"my_key": "hello from node1"})
    graph.add_node("node2", lambda state: {"my_key": "hello from node2"})
    graph.add_node("node3", lambda state: {"my_key": "hello from node3"})
    graph.add_node("node4", lambda state: {"my_key": "hello from node4"})
    graph.add_edge(START, "node1")
    graph.add_edge("node1", "node2")
    graph.add_edge("node2", "node3")
    graph.add_edge("node3", "node4")
    graph.add_edge("node4", END)
    return graph

def test_partial_execution_from_node2_to_node3() -> None:
    checkpointer = MemorySaver()
    graph = create_graph()
    compiled_graph = graph.compile(checkpointer=checkpointer)
    compiled_graph.update_state(
        config={
          "configurable": {
            "thread_id": "1"
          }
        },
        # 传递给节点 2 的状态——模拟节点 1 结束时的状态
        values={"my_key": "initial_value"},
        # 更新保存的状态，使其看起来像是来自节点 1
        # 执行将在节点 2 处恢复
        as_node="node1",
    )
    result = compiled_graph.invoke(
        # 通过传递 None 来恢复执行
        None,
        config={"configurable": {"thread_id": "1"}},
        # 在节点 3 之后停止，这样节点 4 就不会运行
        interrupt_after="node3",
    )
    assert result["my_key"] == "hello from node3"
```

