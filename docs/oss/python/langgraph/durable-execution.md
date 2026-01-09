---
title: 持久化执行
---
**持久化执行**是一种技术，通过该技术，进程或工作流在关键点保存其进度，使其能够暂停并在之后从停止处精确恢复。这在需要[人机协同](/oss/langgraph/interrupts)的场景中尤其有用，用户可以在继续之前检查、验证或修改流程；同时，它也适用于可能遇到中断或错误（例如，调用 LLM 超时）的长时间运行任务。通过保留已完成的工作，持久化执行使得进程能够恢复而无需重新处理之前的步骤——即使在经历显著延迟（例如，一周后）之后。

LangGraph 内置的[持久化](/oss/langgraph/persistence)层为工作流提供了持久化执行功能，确保每个执行步骤的状态都保存到持久化存储中。此功能保证了如果工作流被中断——无论是由于系统故障还是为了[人机协同](/oss/langgraph/interrupts)交互——它都可以从最后记录的状态恢复。

<Tip>

如果你正在使用带有检查点（checkpointer）的 LangGraph，那么你已经启用了持久化执行。你可以在任何点暂停和恢复工作流，即使在中断或故障之后。
为了充分利用持久化执行，请确保你的工作流被设计为[确定性的](#determinism-and-consistent-replay)和[幂等的](#determinism-and-consistent-replay)，并将任何副作用或非确定性操作包装在[任务](/oss/langgraph/functional-api#task)内部。你可以同时使用[StateGraph (Graph API)](/oss/langgraph/graph-api) 和[Functional API](/oss/langgraph/functional-api) 中的[任务](/oss/langgraph/functional-api#task)。

</Tip>

## 要求

为了在 LangGraph 中利用持久化执行，你需要：

1.  通过指定一个将保存工作流进度的[检查点器](/oss/langgraph/persistence#checkpointer-libraries)来在工作流中启用[持久化](/oss/langgraph/persistence)。
2.  在执行工作流时指定一个[线程标识符](/oss/langgraph/persistence#threads)。这将跟踪特定工作流实例的执行历史。

1. 将任何非确定性操作（例如，随机数生成）或具有副作用的操作（例如，文件写入、API 调用）包装在 <a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.task" target="_blank" rel="noreferrer" class="link"><code>task</code></a> 内部，以确保当工作流恢复时，这些操作不会针对特定运行重复执行，而是从持久化层检索其结果。更多信息，请参阅[确定性与一致性重放](#determinism-and-consistent-replay)。

## 确定性与一致性重放

当你恢复一个工作流运行时，代码**不会**从执行停止的**同一行代码**恢复；相反，它将识别一个合适的[起始点](#starting-points-for-resuming-workflows)来从中断处继续。这意味着工作流将从[起始点](#starting-points-for-resuming-workflows)开始重放所有步骤，直到到达它被停止的点。

因此，当你为持久化执行编写工作流时，必须将任何非确定性操作（例如，随机数生成）和任何具有副作用的操作（例如，文件写入、API 调用）包装在[任务](/oss/langgraph/functional-api#task)或[节点](/oss/langgraph/graph-api#nodes)内部。

为确保你的工作流是确定性的并且可以一致地重放，请遵循以下准则：

*   **避免重复工作**：如果一个[节点](/oss/langgraph/graph-api#nodes)包含多个具有副作用的操作（例如，日志记录、文件写入或网络调用），请将每个操作包装在单独的**任务**中。这确保了当工作流恢复时，操作不会重复，并且它们的结果是从持久化层检索的。
*   **封装非确定性操作**：将任何可能产生非确定性结果的代码（例如，随机数生成）包装在**任务**或**节点**内部。这确保了在恢复时，工作流遵循完全相同的记录步骤序列，并产生相同的结果。
*   **使用幂等操作**：在可能的情况下，确保副作用（例如，API 调用、文件写入）是幂等的。这意味着如果操作在工作流失败后重试，它将产生与第一次执行时相同的效果。这对于导致数据写入的操作尤其重要。如果**任务**开始但未能成功完成，工作流的恢复将重新运行该**任务**，并依赖记录的结果来保持一致性。使用幂等性键或验证现有结果，以避免意外的重复，确保工作流执行平稳且可预测。

有关需要避免的常见陷阱示例，请参阅功能 API 中的[常见陷阱](/oss/langgraph/functional-api#common-pitfalls)部分，该部分展示了如何使用**任务**来构建代码以避免这些问题。相同的原则适用于 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link">StateGraph (Graph API)</a>。

## 持久化模式

LangGraph 支持三种持久化模式，允许你根据应用程序的需求在性能和数据一致性之间进行权衡。更高的持久化模式会给工作流执行带来更多开销。你可以在调用任何图执行方法时指定持久化模式：

```python
graph.stream(
    {"input": "test"},
    durability="sync"
)
```

持久化模式，从最不持久到最持久，如下所示：

*   `"exit"`：仅在图执行退出时（无论是成功、出错还是由于中断）持久化更改。这为长时间运行的图提供了最佳性能，但意味着中间状态不会被保存，因此你无法从执行过程中发生的系统故障（例如，进程崩溃）中恢复。
*   `"async"`：在下一步执行时异步持久化更改。这提供了良好的性能和持久性，但如果进程在执行期间崩溃，检查点可能无法写入的风险很小。
*   `"sync"`：在下一步开始之前同步持久化更改。这确保了每个检查点在继续执行之前都被写入，以一定的性能开销为代价提供了高持久性。

## 在节点中使用任务

如果一个[节点](/oss/langgraph/graph-api#nodes)包含多个操作，你可能会发现将每个操作转换为一个**任务**比将操作重构为单独的节点更容易。

<Tabs>

<Tab title="原始版本">

```python
from typing import NotRequired
from typing_extensions import TypedDict
import uuid

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import StateGraph, START, END
import requests

# Define a TypedDict to represent the state
class State(TypedDict):
    url: str
    result: NotRequired[str]

def call_api(state: State):
    """Example node that makes an API request."""
    result = requests.get(state['url']).text[:100]  # Side-effect  # [!code highlight]
    return {
        "result": result
    }

# Create a StateGraph builder and add a node for the call_api function
builder = StateGraph(State)
builder.add_node("call_api", call_api)

# Connect the start and end nodes to the call_api node
builder.add_edge(START, "call_api")
builder.add_edge("call_api", END)

# Specify a checkpointer
checkpointer = InMemorySaver()

# Compile the graph with the checkpointer
graph = builder.compile(checkpointer=checkpointer)

# Define a config with a thread ID.
thread_id = uuid.uuid4()
config = {"configurable": {"thread_id": thread_id}}

# Invoke the graph
graph.invoke({"url": "https://www.example.com"}, config)
```

</Tab>

<Tab title="使用任务">

```python
from typing import NotRequired
from typing_extensions import TypedDict
import uuid

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.func import task
from langgraph.graph import StateGraph, START, END
import requests

# Define a TypedDict to represent the state
class State(TypedDict):
    urls: list[str]
    result: NotRequired[list[str]]

@task
def _make_request(url: str):
    """Make a request."""
    return requests.get(url).text[:100]  # [!code highlight]

def call_api(state: State):
    """Example node that makes an API request."""
    requests = [_make_request(url) for url in state['urls']]  # [!code highlight]
    results = [request.result() for request in requests]
    return {
        "results": results
    }

# Create a StateGraph builder and add a node for the call_api function
builder = StateGraph(State)
builder.add_node("call_api", call_api)

# Connect the start and end nodes to the call_api node
builder.add_edge(START, "call_api")
builder.add_edge("call_api", END)

# Specify a checkpointer
checkpointer = InMemorySaver()

# Compile the graph with the checkpointer
graph = builder.compile(checkpointer=checkpointer)

# Define a config with a thread ID.
thread_id = uuid.uuid4()
config = {"configurable": {"thread_id": thread_id}}

# Invoke the graph
graph.invoke({"urls": ["https://www.example.com"]}, config)
```

</Tab>

</Tabs>

## 恢复工作流

一旦你在工作流中启用了持久化执行，你就可以在以下场景中恢复执行：

*   **暂停和恢复工作流**：使用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link">interrupt</a> 函数在特定点暂停工作流，并使用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 原语以更新后的状态恢复它。更多细节请参阅[**中断**](/oss/langgraph/interrupts)。
*   **从故障中恢复**：在异常（例如，LLM 提供商中断）后，从最后一个成功的检查点自动恢复工作流。这涉及通过提供 `None` 作为输入值，使用相同的线程标识符执行工作流（请参阅功能 API 中的此[示例](/oss/langgraph/use-functional-api#resuming-after-an-error)）。

## 恢复工作流的起始点

*   如果你正在使用 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link">StateGraph (Graph API)</a>，起始点是执行停止的[**节点**](/oss/langgraph/graph-api#nodes)的开头。
*   如果你在节点内部调用子图，起始点将是调用被暂停子图的**父**节点。
在子图内部，起始点将是执行停止的特定[**节点**](/oss/langgraph/graph-api#nodes)。
*   如果你正在使用功能 API，起始点是执行停止的[**入口点**](/oss/langgraph/functional-api#entrypoint)的开头。

