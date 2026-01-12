---
title: 使用图形 API
sidebarTitle: Use the graph API
---

本指南演示了 LangGraph Graph API 的基础知识。它将引导您了解[状态](#define-and-update-state)，以及构建常见的图结构，例如[序列](#create-a-sequence-of-steps)、[分支](#create-branches)和[循环](#create-and-control-loops)。它还涵盖了 LangGraph 的控制功能，包括用于 map-reduce 工作流的[Send API](#map-reduce-and-the-send-api)，以及用于将状态更新与跨节点"跳转"相结合的[Command API](#combine-control-flow-and-state-updates-with-command)。

## 设置

安装 `langgraph`：

::: code-group

```bash [pip]
pip install -U langgraph
```

```bash [uv]
uv add langgraph
```

:::

<Tip>

<strong>设置 LangSmith 以获得更好的调试体验</strong>

注册 [LangSmith](https://smith.langchain.com) 以快速发现问题并提升 LangGraph 项目的性能。LangSmith 允许您使用追踪数据来调试、测试和监控使用 LangGraph 构建的 LLM 应用——更多关于如何开始的信息，请参阅[文档](/langsmith/observability)。

</Tip>

## 定义和更新状态

这里我们将展示如何在 LangGraph 中定义和更新[状态](/oss/python/langgraph/graph-api#state)。我们将演示：

1. 如何使用状态定义图的[模式](/oss/python/langgraph/graph-api#schema)
2. 如何使用[归约器](/oss/python/langgraph/graph-api#reducers)来控制状态更新的处理方式。

### 定义状态

LangGraph 中的[状态](/oss/python/langgraph/graph-api#state)可以是 `TypedDict`、`Pydantic` 模型或数据类。下面我们将使用 `TypedDict`。有关使用 Pydantic 的详细信息，请参阅[此部分](#use-pydantic-models-for-graph-state)。

默认情况下，图将具有相同的输入和输出模式，状态决定了该模式。有关如何定义不同的输入和输出模式，请参阅[此部分](#define-input-and-output-schemas)。

让我们考虑一个使用[消息](/oss/python/langgraph/graph-api#messagesstate)的简单示例。这代表了许多 LLM 应用状态的通用表示形式。更多细节请参阅我们的[概念页面](/oss/python/langgraph/graph-api#working-with-messages-in-graph-state)。

```python
from langchain.messages import AnyMessage
from typing_extensions import TypedDict

class State(TypedDict):
    messages: list[AnyMessage]
    extra_field: int
```

此状态跟踪一个[消息](https://python.langchain.com/docs/concepts/messages/)对象列表，以及一个额外的整数字段。

### 更新状态

让我们构建一个包含单个节点的示例图。我们的[节点](/oss/python/langgraph/graph-api#nodes)只是一个 Python 函数，它读取图的状态并对其进行更新。此函数的第一个参数始终是状态：

```python
from langchain.messages import AIMessage

def node(state: State):
    messages = state["messages"]
    new_message = AIMessage("Hello!")
    return {"messages": messages + [new_message], "extra_field": 10}
```

此节点只是将一条消息附加到我们的消息列表，并填充一个额外的字段。

<Warning>

节点应直接返回对状态的更新，而不是改变状态。

</Warning>

接下来让我们定义一个包含此节点的简单图。我们使用 [`StateGraph`](/oss/python/langgraph/graph-api#stategraph) 来定义一个在此状态上操作的图。然后我们使用 [`add_node`](/oss/python/langgraph/graph-api#nodes) 来填充我们的图。

```python
from langgraph.graph import StateGraph

builder = StateGraph(State)
builder.add_node(node)
builder.set_entry_point("node")
graph = builder.compile()
```

LangGraph 提供了内置工具来可视化您的图。让我们检查一下我们的图。有关可视化的详细信息，请参阅[此部分](#visualize-your-graph)。

```python
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))
```

![包含单个节点的简单图](/oss/python/images/graph_api_image_1.png)

在这种情况下，我们的图只执行单个节点。让我们继续一个简单的调用：

```python
from langchain.messages import HumanMessage

result = graph.invoke({"messages": [HumanMessage("Hi")]})
result
```

```
{'messages': [HumanMessage(content='Hi'), AIMessage(content='Hello!')], 'extra_field': 10}
```

请注意：

* 我们通过更新状态的单个键来启动调用。
* 我们在调用结果中接收到完整的状态。

为了方便起见，我们经常通过美化打印来检查[消息对象](https://python.langchain.com/docs/concepts/messages/)的内容：

```python
for message in result["messages"]:
    message.pretty_print()
```

```
================================ Human Message ================================

Hi
================================== Ai Message ==================================

Hello!
```

### 使用归约器处理状态更新

状态中的每个键都可以有自己的独立[归约器](/oss/python/langgraph/graph-api#reducers)函数，它控制如何应用来自节点的更新。如果没有明确指定归约器函数，则假定对该键的所有更新都应覆盖它。

对于 `TypedDict` 状态模式，我们可以通过用归约器函数注释状态的相应字段来定义归约器。

在前面的示例中，我们的节点通过向其附加一条消息来更新状态中的 `"messages"` 键。下面，我们为此键添加一个归约器，以便自动附加更新：

```python
from typing_extensions import Annotated

def add(left, right):
    """Can also import `add` from the `operator` built-in."""
    return left + right

class State(TypedDict):
    messages: Annotated[list[AnyMessage], add]  # [!code highlight]
    extra_field: int
```

现在我们的节点可以简化：

```python
def node(state: State):
    new_message = AIMessage("Hello!")
    return {"messages": [new_message], "extra_field": 10}  # [!code highlight]
```

```python
from langgraph.graph import START

graph = StateGraph(State).add_node(node).add_edge(START, "node").compile()

result = graph.invoke({"messages": [HumanMessage("Hi")]})

for message in result["messages"]:
    message.pretty_print()
```

```
================================ Human Message ================================

Hi
================================== Ai Message ==================================

Hello!
```

#### MessagesState

实际上，更新消息列表还有其他考虑因素：

* 我们可能希望更新状态中的现有消息。
* 我们可能希望接受[消息格式](/oss/python/langgraph/graph-api#using-messages-in-your-graph)的简写，例如 [OpenAI 格式](https://python.langchain.com/docs/concepts/messages/#openai-format)。

LangGraph 包含一个内置的归约器 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.message.add_messages" target="_blank" rel="noreferrer" class="link"><code>add_messages</code></a> 来处理这些考虑因素：

```python
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]  # [!code highlight]
    extra_field: int

def node(state: State):
    new_message = AIMessage("Hello!")
    return {"messages": [new_message], "extra_field": 10}

graph = StateGraph(State).add_node(node).set_entry_point("node").compile()
```

```python
input_message = {"role": "user", "content": "Hi"}  # [!code highlight]

result = graph.invoke({"messages": [input_message]})

for message in result["messages"]:
    message.pretty_print()
```

```
================================ Human Message ================================

Hi
================================== Ai Message ==================================

Hello!
```

这是涉及[聊天模型](https://python.langchain.com/docs/concepts/chat_models/)的应用状态的通用表示形式。LangGraph 包含一个预构建的 `MessagesState` 以方便使用，这样我们就可以有：

```python
from langgraph.graph import MessagesState

class State(MessagesState):
    extra_field: int
```

### 使用 `Overwrite` 绕过归约器

在某些情况下，您可能希望绕过归约器并直接覆盖状态值。LangGraph 为此提供了 [`Overwrite`](https://reference.langchain.com/python/langgraph/types/) 类型。当节点返回用 `Overwrite` 包装的值时，归约器将被绕过，通道将直接设置为该值。

当您想要重置或替换累积状态而不是将其与现有值合并时，这很有用。

```python
from langgraph.graph import StateGraph, START, END
from langgraph.types import Overwrite
from typing_extensions import Annotated, TypedDict
import operator

class State(TypedDict):
    messages: Annotated[list, operator.add]

def add_message(state: State):
    return {"messages": ["first message"]}

def replace_messages(state: State):
    # Bypass the reducer and replace the entire messages list
    return {"messages": Overwrite(["replacement message"])}

builder = StateGraph(State)
builder.add_node("add_message", add_message)
builder.add_node("replace_messages", replace_messages)
builder.add_edge(START, "add_message")
builder.add_edge("add_message", "replace_messages")
builder.add_edge("replace_messages", END)

graph = builder.compile()

result = graph.invoke({"messages": ["initial"]})
print(result["messages"])
```

```
['replacement message']
```

您也可以使用带有特殊键 `"__overwrite__"` 的 JSON 格式：

```python
def replace_messages(state: State):
    return {"messages": {"__overwrite__": ["replacement message"]}}
```

<Warning>

当节点并行执行时，在给定的超级步骤中，只有一个节点可以对同一状态键使用 `Overwrite`。如果多个节点在同一超级步骤中尝试覆盖同一键，将引发 `InvalidUpdateError`。

</Warning>

### 定义输入和输出模式

默认情况下，`StateGraph` 使用单一模式操作，所有节点都期望使用该模式进行通信。但是，也可以为图定义不同的输入和输出模式。

当指定了不同的模式时，节点之间的通信仍将使用内部模式。输入模式确保提供的输入符合预期结构，而输出模式则根据定义的输出模式过滤内部数据，仅返回相关信息。

下面，我们将看到如何定义不同的输入和输出模式。

```python
from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict

# Define the schema for the input
class InputState(TypedDict):
    question: str

# Define the schema for the output
class OutputState(TypedDict):
    answer: str

# Define the overall schema, combining both input and output
class OverallState(InputState, OutputState):
    pass

# Define the node that processes the input and generates an answer
def answer_node(state: InputState):
    # Example answer and an extra key
    return {"answer": "bye", "question": state["question"]}

# Build the graph with input and output schemas specified
builder = StateGraph(OverallState, input_schema=InputState, output_schema=OutputState)
builder.add_node(answer_node)  # Add the answer node
builder.add_edge(START, "answer_node")  # Define the starting edge
builder.add_edge("answer_node", END)  # Define the ending edge
graph = builder.compile()  # Compile the graph

# Invoke the graph with an input and print the result
print(graph.invoke({"question": "hi"}))
```

```
{'answer': 'bye'}
```

请注意，invoke 的输出仅包含输出模式。

### 在节点之间传递私有状态

在某些情况下，您可能希望节点交换对中间逻辑至关重要但不需要成为图主模式一部分的信息。这些私有数据与图的整体输入/输出无关，应仅在特定节点之间共享。

下面，我们将创建一个由三个节点（node_1、node_2 和 node_3）组成的示例顺序图，其中私有数据在前两个步骤（node_1 和 node_2）之间传递，而第三个步骤（node_3）只能访问公共的整体状态。

```python
from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict

# The overall state of the graph (this is the public state shared across nodes)
class OverallState(TypedDict):
    a: str

# Output from node_1 contains private data that is not part of the overall state
class Node1Output(TypedDict):
    private_data: str

# The private data is only shared between node_1 and node_2
def node_1(state: OverallState) -> Node1Output:
    output = {"private_data": "set by node_1"}
    print(f"Entered node `node_1`:\n\tInput: {state}.\n\tReturned: {output}")
    return output

# Node 2 input only requests the private data available after node_1
class Node2Input(TypedDict):
    private_data: str

def node_2(state: Node2Input) -> OverallState:
    output = {"a": "set by node_2"}
    print(f"Entered node `node_2`:\n\tInput: {state}.\n\tReturned: {output}")
    return output

# Node 3 only has access to the overall state (no access to private data from node_1)
def node_3(state: OverallState) -> OverallState:
    output = {"a": "set by node_3"}
    print(f"Entered node `node_3`:\n\tInput: {state}.\n\tReturned: {output}")
    return output

# Connect nodes in a sequence
# node_2 accepts private data from node_1, whereas
# node_3 does not see the private data.
builder = StateGraph(OverallState).add_sequence([node_1, node_2, node_3])
builder.add_edge(START, "node_1")
graph = builder.compile()

# Invoke the graph with the initial state
response = graph.invoke(
    {
        "a": "set at start",
    }
)

print()
print(f"Output of graph invocation: {response}")
```

```
Entered node `node_1`:
    Input: {'a': 'set at start'}.
    Returned: {'private_data': 'set by node_1'}
Entered node `node_2`:
    Input: {'private_data': 'set by node_1'}.
    Returned: {'a': 'set by node_2'}
Entered node `node_3`:
    Input: {'a': 'set by node_2'}.
    Returned: {'a': 'set by node_3'}

Output of graph invocation: {'a': 'set by node_3'}
```

### 使用 pydantic 模型作为图状态

[StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs.md#langgraph.graph.StateGraph) 在初始化时接受一个 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema" target="_blank" rel="noreferrer" class="link"><code>state_schema</code></a> 参数，该参数指定图中节点可以访问和更新的状态的"形状"。

在我们的示例中，我们通常使用 Python 原生的 `TypedDict` 或 [`dataclass`](https://docs.python.org/3/library/dataclasses.html) 作为 `state_schema`，但 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema" target="_blank" rel="noreferrer" class="link"><code>state_schema</code></a> 可以是任何[类型](https://docs.python.org/3/library/stdtypes.html#type-objects)。

这里，我们将看到如何使用 [Pydantic BaseModel](https://docs.pydantic.dev/latest/api/base_model/) 作为 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema" target="_blank" rel="noreferrer" class="link"><code>state_schema</code></a>，以在**输入**上添加运行时验证。

<Note>

<strong>已知限制</strong>
* 目前，图的输出将<strong>不会</strong>是 pydantic 模型的实例。
* 运行时验证仅发生在图中第一个节点的输入上，而不是后续节点或输出上。
* Pydantic 的验证错误追踪不会显示错误出现在哪个节点。
* Pydantic 的递归验证可能较慢。对于性能敏感的应用，您可能需要考虑使用 `dataclass` 代替。

</Note>

```python
from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict
from pydantic import BaseModel

# The overall state of the graph (this is the public state shared across nodes)
class OverallState(BaseModel):
    a: str

def node(state: OverallState):
    return {"a": "goodbye"}

# Build the state graph
builder = StateGraph(OverallState)
builder.add_node(node)  # node_1 is the first node
builder.add_edge(START, "node")  # Start the graph with node_1
builder.add_edge("node", END)  # End the graph after node_1
graph = builder.compile()

# Test the graph with a valid input
graph.invoke({"a": "hello"})
```

使用**无效**输入调用图

```python
try:
    graph.invoke({"a": 123})  # Should be a string
except Exception as e:
    print("An exception was raised because `a` is an integer rather than a string.")
    print(e)
```

```
An exception was raised because `a` is an integer rather than a string.
1 validation error for OverallState
a
  Input should be a valid string [type=string_type, input_value=123, input_type=int]
    For further information visit https://errors.pydantic.dev/2.9/v/string_type
```

有关 Pydantic 模型状态的更多功能，请参见下文：

:::: details 序列化行为

当使用 Pydantic 模型作为状态模式时，了解序列化的工作方式非常重要，尤其是在以下情况下：

* 将 Pydantic 对象作为输入传递
* 接收图的输出
* 使用嵌套的 Pydantic 模型

让我们看看这些行为的具体表现。

```python
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel

class NestedModel(BaseModel):
    value: str

class ComplexState(BaseModel):
    text: str
    count: int
    nested: NestedModel

def process_node(state: ComplexState):
    # Node receives a validated Pydantic object
    print(f"Input state type: {type(state)}")
    print(f"Nested type: {type(state.nested)}")
    # Return a dictionary update
    return {"text": state.text + " processed", "count": state.count + 1}

# Build the graph
builder = StateGraph(ComplexState)
builder.add_node("process", process_node)
builder.add_edge(START, "process")
builder.add_edge("process", END)
graph = builder.compile()

# Create a Pydantic instance for input
input_state = ComplexState(text="hello", count=0, nested=NestedModel(value="test"))
print(f"Input object type: {type(input_state)}")

# Invoke graph with a Pydantic instance
result = graph.invoke(input_state)
print(f"Output type: {type(result)}")
print(f"Output content: {result}")

# Convert back to Pydantic model if needed
output_model = ComplexState(**result)
print(f"Converted back to Pydantic: {type(output_model)}")
```

::::

:::: details 运行时类型强制转换

Pydantic 对某些数据类型执行运行时类型强制转换。这可能有所帮助，但如果您不了解，也可能导致意外行为。

```python
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel

class CoercionExample(BaseModel):
    # Pydantic will coerce string numbers to integers
    number: int
    # Pydantic will parse string booleans to bool
    flag: bool

def inspect_node(state: CoercionExample):
    print(f"number: {state.number} (type: {type(state.number)})")
    print(f"flag: {state.flag} (type: {type(state.flag)})")
    return {}

builder = StateGraph(CoercionExample)
builder.add_node("inspect", inspect_node)
builder.add_edge(START, "inspect")
builder.add_edge("inspect", END)
graph = builder.compile()

# Demonstrate coercion with string inputs that will be converted
result = graph.invoke({"number": "42", "flag": "true"})

# This would fail with a validation error
try:
    graph.invoke({"number": "not-a-number", "flag": "true"})
except Exception as e:
    print(f"\nExpected validation error: {e}")
```

::::

:::: details 使用消息模型

在状态模式中使用 LangChain 消息类型时，序列化有重要的考虑因素。当通过网络使用消息对象时，您应该使用 `AnyMessage`（而不是 `BaseMessage`）以进行正确的序列化/反序列化。

```python
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel
from langchain.messages import HumanMessage, AIMessage, AnyMessage
from typing import List

class ChatState(BaseModel):
    messages: List[AnyMessage]
    context: str

def add_message(state: ChatState):
    return {"messages": state.messages + [AIMessage(content="Hello there!")]}

builder = StateGraph(ChatState)
builder.add_node("add_message", add_message)
builder.add_edge(START, "add_message")
builder.add_edge("add_message", END)
graph = builder.compile()

# Create input with a message
initial_state = ChatState(
    messages=[HumanMessage(content="Hi")], context="Customer support chat"
)

result = graph.invoke(initial_state)
print(f"Output: {result}")

# Convert back to Pydantic model to see message types
output_model = ChatState(**result)
for i, msg in enumerate(output_model.messages):
    print(f"Message {i}: {type(msg).__name__} - {msg.content}")
```

::::

## 添加运行时配置

有时您希望在调用图时能够配置它。例如，您可能希望在运行时指定使用哪个 LLM 或系统提示，_而不让这些参数污染图状态_。

要添加运行时配置：

1. 为您的配置指定一个模式
2. 将配置添加到节点或条件边的函数签名中
3. 将配置传递到图中。

请参见下面的简单示例：

```python
from langgraph.graph import END, StateGraph, START
from langgraph.runtime import Runtime
from typing_extensions import TypedDict

# 1. Specify config schema
class ContextSchema(TypedDict):
    my_runtime_value: str

# 2. Define a graph that accesses the config in a node
class State(TypedDict):
    my_state_value: str

def node(state: State, runtime: Runtime[ContextSchema]):  # [!code highlight]
    if runtime.context["my_runtime_value"] == "a":  # [!code highlight]
        return {"my_state_value": 1}
    elif runtime.context["my_runtime_value"] == "b":  # [!code highlight]
        return {"my_state_value": 2}
    else:
        raise ValueError("Unknown values.")

builder = StateGraph(State, context_schema=ContextSchema)  # [!code highlight]
builder.add_node(node)
builder.add_edge(START, "node")
builder.add_edge("node", END)

graph = builder.compile()

# 3. Pass in configuration at runtime:
print(graph.invoke({}, context={"my_runtime_value": "a"}))  # [!code highlight]
print(graph.invoke({}, context={"my_runtime_value": "b"}))  # [!code highlight]
```

```
{'my_state_value': 1}
{'my_state_value': 2}
```

:::: details 扩展示例：在运行时指定 LLM

下面我们演示一个实际示例，其中我们在运行时配置使用哪个 LLM。我们将同时使用 OpenAI 和 Anthropic 模型。

```python
from dataclasses import dataclass

from langchain.chat_models import init_chat_model
from langgraph.graph import MessagesState, END, StateGraph, START
from langgraph.runtime import Runtime
from typing_extensions import TypedDict

@dataclass
class ContextSchema:
    model_provider: str = "anthropic"

MODELS = {
    "anthropic": init_chat_model("claude-haiku-4-5-20251001"),
    "openai": init_chat_model("gpt-4.1-mini"),
}

def call_model(state: MessagesState, runtime: Runtime[ContextSchema]):
    model = MODELS[runtime.context.model_provider]
    response = model.invoke(state["messages"])
    return {"messages": [response]}

builder = StateGraph(MessagesState, context_schema=ContextSchema)
builder.add_node("model", call_model)
builder.add_edge(START, "model")
builder.add_edge("model", END)

graph = builder.compile()

# Usage
input_message = {"role": "user", "content": "hi"}
# With no configuration, uses default (Anthropic)
response_1 = graph.invoke({"messages": [input_message]}, context=ContextSchema())["messages"][-1]
# Or, can set OpenAI
response_2 = graph.invoke({"messages": [input_message]}, context={"model_provider": "openai"})["messages"][-1]

print(response_1.response_metadata["model_name"])
print(response_2.response_metadata["model_name"])
```

```
claude-haiku-4-5-20251001
gpt-4.1-mini-2025-04-14
```

::::

:::: details 扩展示例：在运行时指定模型和系统消息

下面我们演示一个实际示例，其中我们在运行时配置两个参数：要使用的 LLM 和系统消息。

```python
from dataclasses import dataclass
from langchain.chat_models import init_chat_model
from langchain.messages import SystemMessage
from langgraph.graph import END, MessagesState, StateGraph, START
from langgraph.runtime import Runtime
from typing_extensions import TypedDict

@dataclass
class ContextSchema:
    model_provider: str = "anthropic"
    system_message: str | None = None

MODELS = {
    "anthropic": init_chat_model("claude-haiku-4-5-20251001"),
    "openai": init_chat_model("gpt-4.1-mini"),
}

def call_model(state: MessagesState, runtime: Runtime[ContextSchema]):
    model = MODELS[runtime.context.model_provider]
    messages = state["messages"]
    if (system_message := runtime.context.system_message):
        messages = [SystemMessage(system_message)] + messages
    response = model.invoke(messages)
    return {"messages": [response]}

builder = StateGraph(MessagesState, context_schema=ContextSchema)
builder.add_node("model", call_model)
builder.add_edge(START, "model")
builder.add_edge("model", END)

graph = builder.compile()

# Usage
input_message = {"role": "user", "content": "hi"}
response = graph.invoke({"messages": [input_message]}, context={"model_provider": "openai", "system_message": "Respond in Italian."})
for message in response["messages"]:
    message.pretty_print()
```

```
================================ Human Message ================================

hi
================================== Ai Message ==================================

Ciao! Come posso aiutarti oggi?
```

::::

## 添加重试策略

在许多用例中，您可能希望节点具有自定义的重试策略，例如，如果您正在调用 API、查询数据库或调用 LLM 等。LangGraph 允许您向节点添加重试策略。

要配置重试策略，请将 `retry_policy` 参数传递给 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph.add_node" target="_blank" rel="noreferrer" class="link"><code>add_node</code></a>。`retry_policy` 参数接受一个 `RetryPolicy` 命名元组对象。下面我们使用默认参数实例化一个 `RetryPolicy` 对象并将其与节点关联：

```python
from langgraph.types import RetryPolicy

builder.add_node(
    "node_name",
    node_function,
    retry_policy=RetryPolicy(),
)
```

默认情况下，`retry_on` 参数使用 `default_retry_on` 函数，该函数重试任何异常，但以下情况除外：

* `ValueError`
* `TypeError`
* `ArithmeticError`
* `ImportError`
* `LookupError`
* `NameError`
* `SyntaxError`
* `RuntimeError`
* `ReferenceError`
* `StopIteration`
* `StopAsyncIteration`
* `OSError`

此外，对于来自流行 HTTP 请求库（如 `requests` 和 `httpx`）的异常，它仅对 5xx 状态码进行重试。

:::: details 扩展示例：自定义重试策略

考虑一个我们从 SQL 数据库读取数据的示例。下面我们向节点传递两种不同的重试策略：

```python
import sqlite3
from typing_extensions import TypedDict
from langchain.chat_models import init_chat_model
from langgraph.graph import END, MessagesState, StateGraph, START
from langgraph.types import RetryPolicy
from langchain_community.utilities import SQLDatabase
from langchain.messages import AIMessage

db = SQLDatabase.from_uri("sqlite:///:memory:")
model = init_chat_model("claude-haiku-4-5-20251001")

def query_database(state: MessagesState):
    query_result = db.run("SELECT * FROM Artist LIMIT 10;")
    return {"messages": [AIMessage(content=query_result)]}

def call_model(state: MessagesState):
    response = model.invoke(state["messages"])
    return {"messages": [response]}

# Define a new graph
builder = StateGraph(MessagesState)
builder.add_node(
    "query_database",
    query_database,
    retry_policy=RetryPolicy(retry_on=sqlite3.OperationalError),
)
builder.add_node("model", call_model, retry_policy=RetryPolicy(max_attempts=5))
builder.add_edge(START, "model")
builder.add_edge("model", "query_database")
builder.add_edge("query_database", END)
graph = builder.compile()
```

::::

## 添加节点缓存

当您希望避免重复操作时，节点缓存非常有用，例如在执行耗时（时间或成本方面）的操作时。LangGraph 允许您向图中的节点添加个性化的缓存策略。

要配置缓存策略，请将 `cache_policy` 参数传递给 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph.add_node" target="_blank" rel="noreferrer" class="link"><code>add_node</code></a> 函数。在以下示例中，实例化了一个 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.CachePolicy" target="_blank" rel="noreferrer" class="link"><code>CachePolicy</code></a> 对象，其生存时间为 120 秒，并使用默认的 `key_func` 生成器。然后将其与一个节点关联：

```python
from langgraph.types import CachePolicy

builder.add_node(
    "node_name",
    node_function,
    cache_policy=CachePolicy(ttl=120),
)
```

然后，要为图启用节点级缓存，请在编译图时设置 `cache` 参数。下面的示例使用 `InMemoryCache` 来设置一个具有内存缓存的图，但也可以使用 `SqliteCache`。

```python
from langgraph.cache.memory import InMemoryCache

graph = builder.compile(cache=InMemoryCache())
```

## 创建步骤序列

<Info>

<strong>先决条件</strong>
本指南假设您熟悉上面关于[状态](#define-and-update-state)的部分。

</Info>

这里我们将演示如何构建一个简单的步骤序列。我们将展示：

1. 如何构建一个顺序图
2. 用于构建类似图的内置简写。

要添加节点序列，我们使用图的 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph.add_node" target="_blank" rel="noreferrer" class="link"><code>add_node</code></a> 和 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph.add_edge" target="_blank" rel="noreferrer" class="link"><code>add_edge</code></a> 方法：

```python
from langgraph.graph import START, StateGraph

builder = StateGraph(State)

# Add nodes
builder.add_node(step_1)
builder.add_node(step_2)
builder.add_node(step_3)

# Add edges
builder.add_edge(START, "step_1")
builder.add_edge("step_1", "step_2")
builder.add_edge("step_2", "step_3")
```

我们也可以使用内置的简写 `.add_sequence`：

```python
builder = StateGraph(State).add_sequence([step_1, step_2, step_3])
builder.add_edge(START, "step_1")
```

:::: details 为什么使用 LangGraph 将应用程序步骤拆分为序列？

LangGraph 使得为您的应用程序添加底层持久层变得容易。
这允许在节点执行之间对状态进行检查点保存，因此您的 LangGraph 节点控制着：

* 状态更新如何[检查点保存](/oss/python/langgraph/persistence)
* 在[人机交互](/oss/python/langgraph/interrupts)工作流中如何恢复中断
* 如何使用 LangGraph 的[时间旅行](/oss/python/langgraph/use-time-travel)功能"回滚"和分支执行

它们还决定了执行步骤如何[流式传输](/oss/python/langgraph/streaming)，以及如何使用 [Studio](/langsmith/studio) 可视化和调试您的应用程序。

让我们演示一个端到端的示例。我们将创建一个包含三个步骤的序列：

1. 在状态的键中填充一个值
2. 更新相同的值
3. 填充一个不同的值

首先定义我们的[状态](/oss/python/langgraph/graph-api#state)。这控制着[图的模式](/oss/python/langgraph/graph-api#schema)，并且还可以指定如何应用更新。更多细节请参见[本节](#process-state-updates-with-reducers)。

在我们的例子中，我们将只跟踪两个值：

```python
from typing_extensions import TypedDict

class State(TypedDict):
    value_1: str
    value_2: int
```

我们的[节点](/oss/python/langgraph/graph-api#nodes)只是读取图状态并对其进行更新的 Python 函数。该函数的第一个参数始终是状态：

```python
def step_1(state: State):
    return {"value_1": "a"}

def step_2(state: State):
    current_value_1 = state["value_1"]
    return {"value_1": f"{current_value_1} b"}

def step_3(state: State):
    return {"value_2": 10}
```

<Note>

请注意，当向状态发出更新时，每个节点只需指定它希望更新的键的值。

默认情况下，这将<strong>覆盖</strong>相应键的值。您也可以使用[归约器](/oss/python/langgraph/graph-api#reducers)来控制如何处理更新——例如，您可以向键追加连续的更新而不是覆盖。更多细节请参见[本节](#process-state-updates-with-reducers)。

</Note>

最后，我们定义图。我们使用 [StateGraph](/oss/python/langgraph/graph-api#stategraph) 来定义一个在此状态上操作的图。

然后我们将使用 [`add_node`](/oss/python/langgraph/graph-api#messagesstate) 和 [`add_edge`](/oss/python/langgraph/graph-api#edges) 来填充我们的图并定义其控制流。

```python
from langgraph.graph import START, StateGraph

builder = StateGraph(State)

# Add nodes
builder.add_node(step_1)
builder.add_node(step_2)
builder.add_node(step_3)

# Add edges
builder.add_edge(START, "step_1")
builder.add_edge("step_1", "step_2")
builder.add_edge("step_2", "step_3")
```

<Tip>

<strong>指定自定义名称</strong>
您可以使用 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph.add_node" target="_blank" rel="noreferrer" class="link"><code>add_node</code></a> 为节点指定自定义名称：

```python
builder.add_node("my_node", step_1)
```

</Tip>

请注意：

* <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph.add_edge" target="_blank" rel="noreferrer" class="link"><code>add_edge</code></a> 接受节点名称，对于函数，默认使用 `node.__name__`。
* 我们必须指定图的入口点。为此，我们添加一条与 [START 节点](/oss/python/langgraph/graph-api#start-node) 的边。
* 当没有更多节点要执行时，图停止。

接下来我们[编译](/oss/python/langgraph/graph-api#compiling-your-graph)我们的图。这提供了对图结构的一些基本检查（例如，识别孤立节点）。如果我们通过[检查点保存器](/oss/python/langgraph/persistence)向应用程序添加持久性，它也会在这里传递。

```python
graph = builder.compile()
```

LangGraph 提供了内置工具来可视化您的图。让我们检查我们的序列。有关可视化的详细信息，请参见[本指南](#visualize-your-graph)。

```python
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))
```

![步骤序列图](/oss/python/images/graph_api_image_2.png)

让我们进行一个简单的调用：

```python
graph.invoke({"value_1": "c"})
```

```
{'value_1': 'a b', 'value_2': 10}
```

请注意：

* 我们通过为单个状态键提供一个值来启动调用。我们必须始终为至少一个键提供一个值。
* 我们传入的值被第一个节点覆盖。
* 第二个节点更新了该值。
* 第三个节点填充了一个不同的值。

<Tip>

<strong>内置简写</strong>
`langgraph>=0.2.46` 包含一个内置的简写 `add_sequence` 用于添加节点序列。您可以按如下方式编译相同的图：

```python
builder = StateGraph(State).add_sequence([step_1, step_2, step_3])  # [!code highlight]
builder.add_edge(START, "step_1")

graph = builder.compile()

graph.invoke({"value_1": "c"})
```

</Tip>

::::

## 创建分支

节点的并行执行对于加速整体图操作至关重要。LangGraph 原生支持节点的并行执行，可以显著提高基于图的工作流的性能。这种并行化是通过扇出和扇入机制实现的，利用标准边和 [conditional_edges](https://langchain-ai.github.io/langgraph/reference/graphs.md#langgraph.graph.MessageGraph.add_conditional_edges)。以下是一些示例，展示了如何添加创建适用于您的分支数据流。

### 并行运行图节点

在这个示例中，我们从 `Node A` 扇出到 `B 和 C`，然后扇入到 `D`。对于我们的状态，[我们指定归约器 add 操作](/oss/python/langgraph/graph-api#reducers)。这将组合或累积状态中特定键的值，而不是简单地覆盖现有值。对于列表，这意味着将新列表与现有列表连接起来。有关使用归约器更新状态的更多详细信息，请参见上面关于[状态归约器](#process-state-updates-with-reducers)的部分。

```python
import operator
from typing import Annotated, Any
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    # The operator.add reducer fn makes this append-only
    aggregate: Annotated[list, operator.add]

def a(state: State):
    print(f'Adding "A" to {state["aggregate"]}')
    return {"aggregate": ["A"]}

def b(state: State):
    print(f'Adding "B" to {state["aggregate"]}')
    return {"aggregate": ["B"]}

def c(state: State):
    print(f'Adding "C" to {state["aggregate"]}')
    return {"aggregate": ["C"]}

def d(state: State):
    print(f'Adding "D" to {state["aggregate"]}')
    return {"aggregate": ["D"]}

builder = StateGraph(State)
builder.add_node(a)
builder.add_node(b)
builder.add_node(c)
builder.add_node(d)
builder.add_edge(START, "a")
builder.add_edge("a", "b")
builder.add_edge("a", "c")
builder.add_edge("b", "d")
builder.add_edge("c", "d")
builder.add_edge("d", END)
graph = builder.compile()
```

```python
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))
```

![并行执行图](/oss/python/images/graph_api_image_3.png)

使用归约器，您可以看到每个节点中添加的值都被累积了。

```python
graph.invoke({"aggregate": []}, {"configurable": {"thread_id": "foo"}})
```

```
Adding "A" to []
Adding "B" to ['A']
Adding "C" to ['A']
Adding "D" to ['A', 'B', 'C']
```

<Note>

在上面的示例中，节点 `"b"` 和 `"c"` 在同一个[超步](/oss/python/langgraph/graph-api#graphs)中并发执行。因为它们在同一个步骤中，节点 `"d"` 在 `"b"` 和 `"c"` 都完成后执行。

重要的是，来自并行超步的更新可能不会保持一致的顺序。如果您需要并行超步的更新具有一致的、预定的顺序，您应该将输出写入状态中的一个单独字段，并附带一个用于排序的值。

</Note>

:::: details 异常处理？

LangGraph 在[超步](/oss/python/langgraph/graph-api#graphs)内执行节点，这意味着虽然并行分支是并行执行的，但整个超步是<strong>事务性的</strong>。如果这些分支中的任何一个引发异常，<strong>所有</strong>更新都不会应用到状态（整个超步出错）。

重要的是，当使用[检查点保存器](/oss/python/langgraph/persistence)时，超步内成功节点的结果会被保存，并且在恢复时不会重复。

如果您有容易出错的节点（可能希望处理不稳定的 API 调用），LangGraph 提供了两种方法来解决这个问题：

1. 您可以在节点内编写常规的 python 代码来捕获和处理异常。
2. 您可以设置一个 <strong>[retry_policy](https://langchain-ai.github.io/langgraph/reference/types/#langgraph.types.RetryPolicy)</strong> 来指示图重试引发某些类型异常的节点。只有失败的分支会被重试，因此您无需担心执行冗余工作。

总之，这些让您可以执行并行执行并完全控制异常处理。

::::

<Tip>

<strong>设置最大并发数</strong>
您可以通过在调用图时在[配置](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html)中设置 `max_concurrency` 来控制最大并发任务数。

```python
graph.invoke({"value_1": "c"}, {"configurable": {"max_concurrency": 10}})
```

</Tip>

### 延迟节点执行

当您希望延迟节点的执行直到所有其他挂起的任务完成时，延迟节点执行非常有用。这在分支具有不同长度的工作流（如 map-reduce 流）中尤其常见。

上面的示例展示了当每个路径只有一个步骤时如何进行扇出和扇入。但是如果一个分支有多个步骤呢？让我们在 `"b"` 分支中添加一个节点 `"b_2"`：

```python
import operator
from typing import Annotated, Any
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    # The operator.add reducer fn makes this append-only
    aggregate: Annotated[list, operator.add]

def a(state: State):
    print(f'Adding "A" to {state["aggregate"]}')
    return {"aggregate": ["A"]}

def b(state: State):
    print(f'Adding "B" to {state["aggregate"]}')
    return {"aggregate": ["B"]}

def b_2(state: State):
    print(f'Adding "B_2" to {state["aggregate"]}')
    return {"aggregate": ["B_2"]}

def c(state: State):
    print(f'Adding "C" to {state["aggregate"]}')
    return {"aggregate": ["C"]}

def d(state: State):
    print(f'Adding "D" to {state["aggregate"]}')
    return {"aggregate": ["D"]}

builder = StateGraph(State)
builder.add_node(a)
builder.add_node(b)
builder.add_node(b_2)
builder.add_node(c)
builder.add_node(d, defer=True)  # [!code highlight]
builder.add_edge(START, "a")
builder.add_edge("a", "b")
builder.add_edge("a", "c")
builder.add_edge("b", "b_2")
builder.add_edge("b_2", "d")
builder.add_edge("c", "d")
builder.add_edge("d", END)
graph = builder.compile()
```

```python
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))
```

![延迟执行图](/oss/python/images/graph_api_image_4.png)

```python
graph.invoke({"aggregate": []})
```

```
Adding "A" to []
Adding "B" to ['A']
Adding "C" to ['A']
Adding "B_2" to ['A', 'B', 'C']
Adding "D" to ['A', 'B', 'C', 'B_2']
```

在上面的示例中，节点 `"b"` 和 `"c"` 在同一个超步中并发执行。我们在节点 `d` 上设置 `defer=True`，因此它不会执行，直到所有挂起的任务完成。在这种情况下，这意味着 `"d"` 等待执行，直到整个 `"b"` 分支完成。

### 条件分支

如果您的扇出应在运行时根据状态而变化，您可以使用 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph.add_conditional_edges" target="_blank" rel="noreferrer" class="link"><code>add_conditional_edges</code></a> 来选择一条或多条路径。请参见下面的示例，其中节点 `a` 生成一个状态更新，该更新决定了下一个节点。

```python
import operator
from typing import Annotated, Literal, Sequence
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    aggregate: Annotated[list, operator.add]
    # Add a key to the state. We will set this key to determine
    # how we branch.
    which: str

def a(state: State):
    print(f'Adding "A" to {state["aggregate"]}')
    return {"aggregate": ["A"], "which": "c"}  # [!code highlight]

def b(state: State):
    print(f'Adding "B" to {state["aggregate"]}')
    return {"aggregate": ["B"]}

def c(state: State):
    print(f'Adding "C" to {state["aggregate"]}')
    return {"aggregate": ["C"]}

builder = StateGraph(State)
builder.add_node(a)
builder.add_node(b)
builder.add_node(c)
builder.add_edge(START, "a")
builder.add_edge("b", END)
builder.add_edge("c", END)

def conditional_edge(state: State) -> Literal["b", "c"]:
    # Fill in arbitrary logic here that uses the state
    # to determine the next node
    return state["which"]

builder.add_conditional_edges("a", conditional_edge)  # [!code highlight]

graph = builder.compile()
```

```python
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))
```

![条件分支图](/oss/python/images/graph_api_image_5.png)

```python
result = graph.invoke({"aggregate": []})
print(result)
```

```
Adding "A" to []
Adding "C" to ['A']
{'aggregate': ['A', 'C'], 'which': 'c'}
```

<Tip>

您的条件边可以路由到多个目标节点。例如：

```python
def route_bc_or_cd(state: State) -> Sequence[str]:
    if state["which"] == "cd":
        return ["c", "d"]
    return ["b", "c"]
```

</Tip>

## Map-Reduce 和 Send API

LangGraph 使用 Send API 支持 map-reduce 和其他高级分支模式。以下是如何使用它的示例：

```python
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from typing_extensions import TypedDict, Annotated
import operator

class OverallState(TypedDict):
    topic: str
    subjects: list[str]
    jokes: Annotated[list[str], operator.add]
    best_selected_joke: str

def generate_topics(state: OverallState):
    return {"subjects": ["lions", "elephants", "penguins"]}

def generate_joke(state: OverallState):
    joke_map = {
        "lions": "Why don't lions like fast food? Because they can't catch it!",
        "elephants": "Why don't elephants use computers? They're afraid of the mouse!",
        "penguins": "Why don't penguins like talking to strangers at parties? Because they find it hard to break the ice."
    }
    return {"jokes": [joke_map[state["subject"]]]}

def continue_to_jokes(state: OverallState):
    return [Send("generate_joke", {"subject": s}) for s in state["subjects"]]

def best_joke(state: OverallState):
    return {"best_selected_joke": "penguins"}

builder = StateGraph(OverallState)
builder.add_node("generate_topics", generate_topics)
builder.add_node("generate_joke", generate_joke)
builder.add_node("best_joke", best_joke)
builder.add_edge(START, "generate_topics")
builder.add_conditional_edges("generate_topics", continue_to_jokes, ["generate_joke"])
builder.add_edge("generate_joke", "best_joke")
builder.add_edge("best_joke", END)
graph = builder.compile()
```

```python
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))
```

![带扇出的 Map-reduce 图](/oss/python/images/graph_api_image_6.png)

```python
# Call the graph: here we call it to generate a list of jokes
for step in graph.stream({"topic": "animals"}):
    print(step)
```

```
{'generate_topics': {'subjects': ['lions', 'elephants', 'penguins']}}
{'generate_joke': {'jokes': ["Why don't lions like fast food? Because they can't catch it!"]}}
{'generate_joke': {'jokes': ["Why don't elephants use computers? They're afraid of the mouse!"]}}
{'generate_joke': {'jokes': ['Why don't penguins like talking to strangers at parties? Because they find it hard to break the ice.']}}
{'best_joke': {'best_selected_joke': 'penguins'}}
```

## 创建和控制循环

当创建带有循环的图时，我们需要一种终止执行的机制。这通常通过添加一个[条件边](/oss/python/langgraph/graph-api#conditional-edges)来实现，该边在达到某个终止条件时路由到 [END](/oss/python/langgraph/graph-api#end-node) 节点。

您还可以在调用或流式传输图时设置图递归限制。递归限制设置了图在执行引发错误之前允许执行的[超步](/oss/python/langgraph/graph-api#graphs)数。有关递归限制概念的更多信息，请参见[此处](/oss/python/langgraph/graph-api#recursion-limit)。

让我们考虑一个带有循环的简单图，以更好地理解这些机制的工作原理。

<Tip>

要返回状态的最后一个值而不是收到递归限制错误，请参见[下一节](#impose-a-recursion-limit)。

</Tip>

创建循环时，可以包含一个指定终止条件的条件边：

```python
builder = StateGraph(State)
builder.add_node(a)
builder.add_node(b)

def route(state: State) -> Literal["b", END]:
    if termination_condition(state):
        return END
    else:
        return "b"

builder.add_edge(START, "a")
builder.add_conditional_edges("a", route)
builder.add_edge("b", "a")
graph = builder.compile()
```

要控制递归限制，请在配置中指定 `"recursionLimit"`。这将引发一个 `GraphRecursionError`，您可以捕获并处理它：

```python
from langgraph.errors import GraphRecursionError

try:
    graph.invoke(inputs, {"recursion_limit": 3})
except GraphRecursionError:
    print("Recursion Error")
```

让我们定义一个带有简单循环的图。注意，我们使用条件边来实现终止条件。

```python
import operator
from typing import Annotated, Literal
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    # The operator.add reducer fn makes this append-only
    aggregate: Annotated[list, operator.add]

def a(state: State):
    print(f'Node A sees {state["aggregate"]}')
    return {"aggregate": ["A"]}

def b(state: State):
    print(f'Node B sees {state["aggregate"]}')
    return {"aggregate": ["B"]}

# Define nodes
builder = StateGraph(State)
builder.add_node(a)
builder.add_node(b)

# Define edges
def route(state: State) -> Literal["b", END]:
    if len(state["aggregate"]) < 7:
        return "b"
    else:
        return END

builder.add_edge(START, "a")
builder.add_conditional_edges("a", route)
builder.add_edge("b", "a")
graph = builder.compile()
```

```python
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))
```

![简单循环图](/oss/python/images/graph_api_image_7.png)

这种架构类似于 [ReAct 智能体](/oss/python/langgraph/workflows-agents)，其中节点 `"a"` 是一个工具调用模型，节点 `"b"` 代表工具。

在我们的 `route` 条件边中，我们指定当状态中的 `"aggregate"` 列表长度超过阈值后应该结束。

调用该图，我们看到在达到终止条件之前，我们在节点 `"a"` 和 `"b"` 之间交替执行。

```python
graph.invoke({"aggregate": []})
```

```
Node A sees []
Node B sees ['A']
Node A sees ['A', 'B']
Node B sees ['A', 'B', 'A']
Node A sees ['A', 'B', 'A', 'B']
Node B sees ['A', 'B', 'A', 'B', 'A']
Node A sees ['A', 'B', 'A', 'B', 'A', 'B']
```

### 强制递归限制

在某些应用中，我们可能无法保证会达到给定的终止条件。在这些情况下，我们可以设置图的 [递归限制](/oss/python/langgraph/graph-api#recursion-limit)。这将在给定数量的 [超步](/oss/python/langgraph/graph-api#graphs) 后引发 `GraphRecursionError`。然后我们可以捕获并处理这个异常：

```python
from langgraph.errors import GraphRecursionError

try:
    graph.invoke({"aggregate": []}, {"recursion_limit": 4})
except GraphRecursionError:
    print("Recursion Error")
```

```
Node A sees []
Node B sees ['A']
Node C sees ['A', 'B']
Node D sees ['A', 'B']
Node A sees ['A', 'B', 'C', 'D']
Recursion Error
```

:::: details 扩展示例：达到递归限制时返回状态

除了引发 `GraphRecursionError`，我们还可以在状态中引入一个新键来跟踪达到递归限制前剩余的步数。然后我们可以使用这个键来决定是否应该结束运行。

LangGraph 实现了一个特殊的 `RemainingSteps` 注解。在底层，它创建了一个 `ManagedValue` 通道——一个仅在我们的图运行期间存在且之后不再存在的状态通道。

```python
import operator
from typing import Annotated, Literal
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.managed.is_last_step import RemainingSteps

class State(TypedDict):
    aggregate: Annotated[list, operator.add]
    remaining_steps: RemainingSteps

def a(state: State):
    print(f'Node A sees {state["aggregate"]}')
    return {"aggregate": ["A"]}

def b(state: State):
    print(f'Node B sees {state["aggregate"]}')
    return {"aggregate": ["B"]}

# Define nodes
builder = StateGraph(State)
builder.add_node(a)
builder.add_node(b)

# Define edges
def route(state: State) -> Literal["b", END]:
    if state["remaining_steps"] <= 2:
        return END
    else:
        return "b"

builder.add_edge(START, "a")
builder.add_conditional_edges("a", route)
builder.add_edge("b", "a")
graph = builder.compile()

# Test it out
result = graph.invoke({"aggregate": []}, {"recursion_limit": 4})
print(result)
```

```
Node A sees []
Node B sees ['A']
Node A sees ['A', 'B']
{'aggregate': ['A', 'B', 'A']}
```

::::

:::: details 扩展示例：带分支的循环

为了更好地理解递归限制的工作原理，让我们考虑一个更复杂的例子。下面我们实现一个循环，但其中一步会分支到两个节点：

```python
import operator
from typing import Annotated, Literal
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    aggregate: Annotated[list, operator.add]

def a(state: State):
    print(f'Node A sees {state["aggregate"]}')
    return {"aggregate": ["A"]}

def b(state: State):
    print(f'Node B sees {state["aggregate"]}')
    return {"aggregate": ["B"]}

def c(state: State):
    print(f'Node C sees {state["aggregate"]}')
    return {"aggregate": ["C"]}

def d(state: State):
    print(f'Node D sees {state["aggregate"]}')
    return {"aggregate": ["D"]}

# Define nodes
builder = StateGraph(State)
builder.add_node(a)
builder.add_node(b)
builder.add_node(c)
builder.add_node(d)

# Define edges
def route(state: State) -> Literal["b", END]:
    if len(state["aggregate"]) < 7:
        return "b"
    else:
        return END

builder.add_edge(START, "a")
builder.add_conditional_edges("a", route)
builder.add_edge("b", "c")
builder.add_edge("b", "d")
builder.add_edge(["c", "d"], "a")
graph = builder.compile()
```

```python
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))
```

![带分支的复杂循环图](/oss/python/images/graph_api_image_8.png)

这个图看起来很复杂，但可以概念化为 [超步](/oss/python/langgraph/graph-api#graphs) 的循环：

1. 节点 A
2. 节点 B
3. 节点 C 和 D
4. 节点 A
5. ...

我们有一个由四个超步组成的循环，其中节点 C 和 D 并发执行。

像之前一样调用该图，我们看到在达到终止条件之前完成了两个完整的“圈”：

```python
result = graph.invoke({"aggregate": []})
```

```
Node A sees []
Node B sees ['A']
Node D sees ['A', 'B']
Node C sees ['A', 'B']
Node A sees ['A', 'B', 'C', 'D']
Node B sees ['A', 'B', 'C', 'D', 'A']
Node D sees ['A', 'B', 'C', 'D', 'A', 'B']
Node C sees ['A', 'B', 'C', 'D', 'A', 'B']
Node A sees ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D']
```

但是，如果我们将递归限制设置为四，我们只完成一圈，因为每一圈是四个超步：

```python
from langgraph.errors import GraphRecursionError

try:
    result = graph.invoke({"aggregate": []}, {"recursion_limit": 4})
except GraphRecursionError:
    print("Recursion Error")
```

```
Node A sees []
Node B sees ['A']
Node C sees ['A', 'B']
Node D sees ['A', 'B']
Node A sees ['A', 'B', 'C', 'D']
Recursion Error
```

::::

## 异步

在并发运行 [IO 密集型](https://en.wikipedia.org/wiki/I/O_bound) 代码时（例如，向聊天模型提供商并发发出 API 请求），使用异步编程范式可以显著提高性能。

要将图的 `sync` 实现转换为 `async` 实现，您需要：

1. 将 `nodes` 更新为使用 `async def` 而不是 `def`。
2. 适当更新内部代码以使用 `await`。
3. 根据需要调用图的 `.ainvoke` 或 `.astream`。

因为许多 LangChain 对象实现了 [Runnable 协议](https://python.langchain.com/docs/expression_language/interface/)，该协议具有所有 `sync` 方法的 `async` 变体，所以将 `sync` 图升级为 `async` 图通常相当快。

请参见下面的示例。为了演示底层 LLM 的异步调用，我们将包含一个聊天模型：

<!--@include: @/snippets/python/chat-model-tabs.md-->

```python
from langchain.chat_models import init_chat_model
from langgraph.graph import MessagesState, StateGraph

async def node(state: MessagesState):  # [!code highlight]
    new_message = await llm.ainvoke(state["messages"])  # [!code highlight]
    return {"messages": [new_message]}

builder = StateGraph(MessagesState).add_node(node).set_entry_point("node")
graph = builder.compile()

input_message = {"role": "user", "content": "Hello"}
result = await graph.ainvoke({"messages": [input_message]})  # [!code highlight]
```

<Tip>

<strong>异步流式处理</strong>
有关异步流式处理的示例，请参阅 [流式处理指南](/oss/python/langgraph/streaming)。

</Tip>

## 使用 `Command` 结合控制流和状态更新

将控制流（边）和状态更新（节点）结合起来可能很有用。例如，您可能希望在同一个节点中既执行状态更新又决定下一步去哪个节点。LangGraph 提供了一种方法，通过从节点函数返回 [Command](https://langchain-ai.github.io/langgraph/reference/types/#langgraph.types.Command) 对象来实现：

```python
def my_node(state: State) -> Command[Literal["my_other_node"]]:
    return Command(
        # state update
        update={"foo": "bar"},
        # control flow
        goto="my_other_node"
    )
```

我们在下面展示一个端到端的示例。让我们创建一个包含 3 个节点的简单图：A、B 和 C。我们将首先执行节点 A，然后根据节点 A 的输出决定下一步是去节点 B 还是节点 C。

```python
import random
from typing_extensions import TypedDict, Literal
from langgraph.graph import StateGraph, START
from langgraph.types import Command

# Define graph state
class State(TypedDict):
    foo: str

# Define the nodes

def node_a(state: State) -> Command[Literal["node_b", "node_c"]]:
    print("Called A")
    value = random.choice(["b", "c"])
    # this is a replacement for a conditional edge function
    if value == "b":
        goto = "node_b"
    else:
        goto = "node_c"

    # note how Command allows you to BOTH update the graph state AND route to the next node
    return Command(
        # this is the state update
        update={"foo": value},
        # this is a replacement for an edge
        goto=goto,
    )

def node_b(state: State):
    print("Called B")
    return {"foo": state["foo"] + "b"}

def node_c(state: State):
    print("Called C")
    return {"foo": state["foo"] + "c"}
```

现在我们可以用上面的节点创建 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a>。注意，该图没有用于路由的 [条件边](/oss/python/langgraph/graph-api#conditional-edges)！这是因为控制流是在 `node_a` 内部用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 定义的。

```python
builder = StateGraph(State)
builder.add_edge(START, "node_a")
builder.add_node(node_a)
builder.add_node(node_b)
builder.add_node(node_c)
# NOTE: there are no edges between nodes A, B and C!

graph = builder.compile()
```

<Warning>

您可能已经注意到我们使用了 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 作为返回类型注解，例如 `Command[Literal["node_b", "node_c"]]`。这对于图渲染是必要的，并告诉 LangGraph `node_a` 可以导航到 `node_b` 和 `node_c`。

</Warning>

```python
from IPython.display import display, Image

display(Image(graph.get_graph().draw_mermaid_png()))
```

![基于 Command 的图导航](/oss/python/images/graph_api_image_11.png)

如果我们多次运行该图，我们会看到它根据节点 A 中的随机选择采取不同的路径（A -> B 或 A -> C）。

```python
graph.invoke({"foo": ""})
```

```
Called A
Called C
```

### 导航到父图中的节点

如果您正在使用 [子图](/oss/python/langgraph/use-subgraphs)，您可能希望从子图内的节点导航到不同的子图（即父图中的不同节点）。为此，您可以在 `Command` 中指定 `graph=Command.PARENT`：

```python
def my_node(state: State) -> Command[Literal["my_other_node"]]:
    return Command(
        update={"foo": "bar"},
        goto="other_subgraph",  # where `other_subgraph` is a node in the parent graph
        graph=Command.PARENT
    )
```

让我们使用上面的示例来演示这一点。我们将把上面示例中的 `nodeA` 更改为一个单节点图，然后将其作为子图添加到我们的父图中。

<Warning>

<strong>使用 `Command.PARENT` 进行状态更新</strong>
当您从子图节点向父图节点发送更新，且该键由父图和子图的 [状态模式](/oss/python/langgraph/graph-api#schema) 共享时，您<strong>必须</strong>在父图状态中为您正在更新的键定义一个 [归约器](/oss/python/langgraph/graph-api#reducers)。请参见下面的示例。

</Warning>

```python
import operator
from typing_extensions import Annotated

class State(TypedDict):
    # NOTE: we define a reducer here
    foo: Annotated[str, operator.add]  # [!code highlight]

def node_a(state: State):
    print("Called A")
    value = random.choice(["a", "b"])
    # this is a replacement for a conditional edge function
    if value == "a":
        goto = "node_b"
    else:
        goto = "node_c"

    # note how Command allows you to BOTH update the graph state AND route to the next node
    return Command(
        update={"foo": value},
        goto=goto,
        # this tells LangGraph to navigate to node_b or node_c in the parent graph
        # NOTE: this will navigate to the closest parent graph relative to the subgraph
        graph=Command.PARENT,  # [!code highlight]
    )

subgraph = StateGraph(State).add_node(node_a).add_edge(START, "node_a").compile()

def node_b(state: State):
    print("Called B")
    # NOTE: since we've defined a reducer, we don't need to manually append
    # new characters to existing 'foo' value. instead, reducer will append these
    # automatically (via operator.add)
    return {"foo": "b"}  # [!code highlight]

def node_c(state: State):
    print("Called C")
    return {"foo": "c"}  # [!code highlight]

builder = StateGraph(State)
builder.add_edge(START, "subgraph")
builder.add_node("subgraph", subgraph)
builder.add_node(node_b)
builder.add_node(node_c)

graph = builder.compile()
```

```python
graph.invoke({"foo": ""})
```

```
Called A
Called C
```

### 在工具内部使用

一个常见的用例是从工具内部更新图状态。例如，在客户支持应用程序中，您可能希望在对话开始时根据客户的账号或 ID 查找客户信息。要从工具更新图状态，您可以从工具返回 `Command(update={"my_custom_key": "foo", "messages": [...]})`：

```python
@tool
def lookup_user_info(tool_call_id: Annotated[str, InjectedToolCallId], config: RunnableConfig):
    """Use this to look up user information to better assist them with their questions."""
    user_info = get_user_info(config.get("configurable", {}).get("user_id"))
    return Command(
        update={
            # update the state keys
            "user_info": user_info,
            # update the message history
            "messages": [ToolMessage("Successfully looked up user information", tool_call_id=tool_call_id)]
        }
    )
```

<Warning>

当从工具返回 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 时，您<strong>必须</strong>在 `Command.update` 中包含 `messages`（或用于消息历史的任何状态键），并且 `messages` 中的消息列表<strong>必须</strong>包含一个 `ToolMessage`。这对于生成的消息历史有效是必要的（LLM 提供商要求带有工具调用的 AI 消息后面必须跟着工具结果消息）。

</Warning>

如果您正在使用通过 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 更新状态的工具，我们建议使用预构建的 <a href="https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.tool_node.ToolNode" target="_blank" rel="noreferrer" class="link"><code>ToolNode</code></a>，它会自动处理返回 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 对象的工具，并将其传播到图状态。如果您正在编写调用工具的自定义节点，则需要手动将工具返回的 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 对象作为节点的更新进行传播。

## 可视化您的图

这里我们演示如何可视化您创建的图。

您可以可视化任何任意的 [Graph](https://langchain-ai.github.io/langgraph/reference/graphs/)，包括 [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph)。

让我们通过绘制分形图来玩点有趣的 :)。

```python
import random
from typing import Annotated, Literal
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]

class MyNode:
    def __init__(self, name: str):
        self.name = name
    def __call__(self, state: State):
        return {"messages": [("assistant", f"Called node {self.name}")]}

def route(state) -> Literal["entry_node", END]:
    if len(state["messages"]) > 10:
        return END
    return "entry_node"

def add_fractal_nodes(builder, current_node, level, max_level):
    if level > max_level:
        return
    # Number of nodes to create at this level
    num_nodes = random.randint(1, 3)  # Adjust randomness as needed
    for i in range(num_nodes):
        nm = ["A", "B", "C"][i]
        node_name = f"node_{current_node}_{nm}"
        builder.add_node(node_name, MyNode(node_name))
        builder.add_edge(current_node, node_name)
        # Recursively add more nodes
        r = random.random()
        if r > 0.2 and level + 1 < max_level:
            add_fractal_nodes(builder, node_name, level + 1, max_level)
        elif r > 0.05:
            builder.add_conditional_edges(node_name, route, node_name)
        else:
            # End
            builder.add_edge(node_name, END)

def build_fractal_graph(max_level: int):
    builder = StateGraph(State)
    entry_point = "entry_node"
    builder.add_node(entry_point, MyNode(entry_point))
    builder.add_edge(START, entry_point)
    add_fractal_nodes(builder, entry_point, 1, max_level)
    # Optional: set a finish point if required
    builder.add_edge(entry_point, END)  # or any specific node
    return builder.compile()

app = build_fractal_graph(3)
```

### Mermaid

我们还可以将图类转换为 Mermaid 语法。

```python
print(app.get_graph().draw_mermaid())
```

```
%%{init: {'flowchart': {'curve': 'linear'}}}%%
graph TD;
    tart__([<p>__start__</p>]):::first
    ry_node(entry_node)
    e_entry_node_A(node_entry_node_A)
    e_entry_node_B(node_entry_node_B)
    e_node_entry_node_B_A(node_node_entry_node_B_A)
    e_node_entry_node_B_B(node_node_entry_node_B_B)
    e_node_entry_node_B_C(node_node_entry_node_B_C)
    nd__([<p>__end__</p>]):::last
    tart__ --> entry_node;
    ry_node --> __end__;
    ry_node --> node_entry_node_A;
    ry_node --> node_entry_node_B;
    e_entry_node_B --> node_node_entry_node_B_A;
    e_entry_node_B --> node_node_entry_node_B_B;
    e_entry_node_B --> node_node_entry_node_B_C;
    e_entry_node_A -.-> entry_node;
    e_entry_node_A -.-> __end__;
    e_node_entry_node_B_A -.-> entry_node;
    e_node_entry_node_B_A -.-> __end__;
    e_node_entry_node_B_B -.-> entry_node;
    e_node_entry_node_B_B -.-> __end__;
    e_node_entry_node_B_C -.-> entry_node;
    e_node_entry_node_B_C -.-> __end__;
    ssDef default fill:#f2f0ff,line-height:1.2
    ssDef first fill-opacity:0
    ssDef last fill:#bfb6fc
```

### PNG

如果愿意，我们可以将图渲染为 `.png`。这里我们可以使用三种选项：

* 使用 Mermaid.ink API（不需要额外的包）
* 使用 Mermaid + Pyppeteer（需要 `pip install pyppeteer`）
* 使用 graphviz（需要 `pip install graphviz`）

**使用 Mermaid.Ink**

默认情况下，`draw_mermaid_png()` 使用 Mermaid.Ink 的 API 生成图表。

```python
from IPython.display import Image, display
from langchain_core.runnables.graph import CurveStyle, MermaidDrawMethod, NodeStyles

display(Image(app.get_graph().draw_mermaid_png()))
```

![分形图可视化](/oss/python/images/graph_api_image_10.png)

**使用 Mermaid + Pyppeteer**

```python
import nest_asyncio

nest_asyncio.apply()  # Required for Jupyter Notebook to run async functions

display(
    Image(
        app.get_graph().draw_mermaid_png(
            curve_style=CurveStyle.LINEAR,
            node_colors=NodeStyles(first="#ffdfba", last="#baffc9", default="#fad7de"),
            wrap_label_n_words=9,
            output_file_path=None,
            draw_method=MermaidDrawMethod.PYPPETEER,
            background_color="white",
            padding=10,
        )
    )
)
```

**使用 Graphviz**

```python
try:
    display(Image(app.get_graph().draw_png()))
except ImportError:
    print(
        "You likely need to install dependencies for pygraphviz, see more here https://github.com/pygraphviz/pygraphviz/blob/main/INSTALL.txt"
    )
```

