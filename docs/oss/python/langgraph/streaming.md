---
title: 流式传输
---
LangGraph 实现了流式处理系统，以提供实时更新。流式处理对于提升基于 LLM 构建的应用程序的响应能力至关重要。通过逐步显示输出，甚至在完整响应准备就绪之前，流式处理能显著改善用户体验，尤其是在处理 LLM 的延迟时。

LangGraph 流式处理可实现的功能：

* <Icon icon="share-nodes" :size="16" /> [**流式传输图状态**](#stream-graph-state) — 通过 `updates` 和 `values` 模式获取状态更新/值。
* <Icon icon="square-poll-horizontal" :size="16" /> [**流式传输子图输出**](#stream-subgraph-outputs) — 包含父图和任何嵌套子图的输出。
* <Icon icon="square-binary" :size="16" /> [**流式传输 LLM 令牌**](#messages) — 从节点、子图或工具内部捕获令牌流。
* <Icon icon="table" :size="16" /> [**流式传输自定义数据**](#stream-custom-data) — 直接从工具函数发送自定义更新或进度信号。
* <Icon icon="layer-plus" :size="16" /> [**使用多种流模式**](#stream-multiple-modes) — 从 `values`（完整状态）、`updates`（状态增量）、`messages`（LLM 令牌 + 元数据）、`custom`（任意用户数据）或 `debug`（详细跟踪）中选择。

## 支持的流模式

将一个或多个以下流模式作为列表传递给 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.stream" target="_blank" rel="noreferrer" class="link"><code>stream</code></a> 或 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.astream" target="_blank" rel="noreferrer" class="link"><code>astream</code></a> 方法：

| 模式       | 描述                                                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `values`   | 在图执行的每一步之后流式传输状态的完整值。                                                                                                                   |
| `updates`  | 在图执行的每一步之后流式传输状态的更新。如果在同一步骤中进行了多次更新（例如，运行了多个节点），这些更新将分别流式传输。 |
| `custom`   | 从图节点内部流式传输自定义数据。                                                                                                                                   |
| `messages` | 从任何调用 LLM 的图节点流式传输 2 元组（LLM 令牌，元数据）。                                                                                                |
| `debug`    | 在图执行过程中流式传输尽可能多的信息。                                                                                                      |

## 基本用法示例

LangGraph 图暴露了 <a href="https://reference.langchain.com/python/langgraph/pregel/#langgraph.pregel.Pregel.stream" target="_blank" rel="noreferrer" class="link"><code>stream</code></a>（同步）和 <a href="https://reference.langchain.com/python/langgraph/pregel/#langgraph.pregel.Pregel.astream" target="_blank" rel="noreferrer" class="link"><code>astream</code></a>（异步）方法，以迭代器的形式产生流式输出。

```python
for chunk in graph.stream(inputs, stream_mode="updates"):
    print(chunk)
```

:::: details 扩展示例：流式传输更新

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    topic: str
    joke: str

def refine_topic(state: State):
    return {"topic": state["topic"] + " and cats"}

def generate_joke(state: State):
    return {"joke": f"This is a joke about {state['topic']}"}

graph = (
    StateGraph(State)
    .add_node(refine_topic)
    .add_node(generate_joke)
    .add_edge(START, "refine_topic")
    .add_edge("refine_topic", "generate_joke")
    .add_edge("generate_joke", END)
    .compile()
)

# The stream() method returns an iterator that yields streamed outputs
for chunk in graph.stream(  # [!code highlight]
    {"topic": "ice cream"},
    # Set stream_mode="updates" to stream only the updates to the graph state after each node
    # Other stream modes are also available. See supported stream modes for details
    stream_mode="updates",  # [!code highlight]
):
    print(chunk)
```

```python
{'refineTopic': {'topic': 'ice cream and cats'}}
{'generateJoke': {'joke': 'This is a joke about ice cream and cats'}}
```

::::

## 流式传输多种模式

你可以传递一个列表作为 `stream_mode` 参数，以同时流式传输多种模式。

流式输出将是 `(mode, chunk)` 元组，其中 `mode` 是流模式的名称，`chunk` 是该模式流式传输的数据。

```python
for mode, chunk in graph.stream(inputs, stream_mode=["updates", "custom"]):
    print(chunk)
```

## 流式传输图状态

使用流模式 `updates` 和 `values` 来流式传输图执行时的状态。

* `updates` 流式传输图每一步之后状态的**更新**。
* `values` 流式传输图每一步之后状态的**完整值**。

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
  topic: str
  joke: str

def refine_topic(state: State):
    return {"topic": state["topic"] + " and cats"}

def generate_joke(state: State):
    return {"joke": f"This is a joke about {state['topic']}"}

graph = (
  StateGraph(State)
  .add_node(refine_topic)
  .add_node(generate_joke)
  .add_edge(START, "refine_topic")
  .add_edge("refine_topic", "generate_joke")
  .add_edge("generate_joke", END)
  .compile()
)
```

<Tabs>

<Tab title="updates">

使用此模式仅流式传输节点每一步之后返回的**状态更新**。流式输出包括节点名称以及更新内容。

```python
for chunk in graph.stream(
    {"topic": "ice cream"},
    stream_mode="updates",  # [!code highlight]
):
    print(chunk)
```

</Tab>

<Tab title="values">

使用此模式流式传输每一步之后图的**完整状态**。

```python
for chunk in graph.stream(
    {"topic": "ice cream"},
    stream_mode="values",  # [!code highlight]
):
    print(chunk)
```

</Tab>

</Tabs>

## 流式传输子图输出

要在流式输出中包含[子图](/oss/python/langgraph/use-subgraphs)的输出，可以在父图的 `.stream()` 方法中设置 `subgraphs=True`。这将同时流式传输父图和任何子图的输出。

输出将作为元组 `(namespace, data)` 流式传输，其中 `namespace` 是一个元组，包含调用子图的节点路径，例如 `("parent_node:<task_id>", "child_node:<task_id>")`。

```python
for chunk in graph.stream(
    {"foo": "foo"},
    # Set subgraphs=True to stream outputs from subgraphs
    subgraphs=True,  # [!code highlight]
    stream_mode="updates",
):
    print(chunk)
```

:::: details 扩展示例：从子图流式传输

```python
from langgraph.graph import START, StateGraph
from typing import TypedDict

# Define subgraph
class SubgraphState(TypedDict):
    foo: str  # note that this key is shared with the parent graph state
    bar: str

def subgraph_node_1(state: SubgraphState):
    return {"bar": "bar"}

def subgraph_node_2(state: SubgraphState):
    return {"foo": state["foo"] + state["bar"]}

subgraph_builder = StateGraph(SubgraphState)
subgraph_builder.add_node(subgraph_node_1)
subgraph_builder.add_node(subgraph_node_2)
subgraph_builder.add_edge(START, "subgraph_node_1")
subgraph_builder.add_edge("subgraph_node_1", "subgraph_node_2")
subgraph = subgraph_builder.compile()

# Define parent graph
class ParentState(TypedDict):
    foo: str

def node_1(state: ParentState):
    return {"foo": "hi! " + state["foo"]}

builder = StateGraph(ParentState)
builder.add_node("node_1", node_1)
builder.add_node("node_2", subgraph)
builder.add_edge(START, "node_1")
builder.add_edge("node_1", "node_2")
graph = builder.compile()

for chunk in graph.stream(
    {"foo": "foo"},
    stream_mode="updates",
    # Set subgraphs=True to stream outputs from subgraphs
    subgraphs=True,  # [!code highlight]
):
    print(chunk)
```

```
((), {'node_1': {'foo': 'hi! foo'}})
(('node_2:dfddc4ba-c3c5-6887-5012-a243b5b377c2',), {'subgraph_node_1': {'bar': 'bar'}})
(('node_2:dfddc4ba-c3c5-6887-5012-a243b5b377c2',), {'subgraph_node_2': {'foo': 'hi! foobar'}})
((), {'node_2': {'foo': 'hi! foobar'}})
```

<strong>注意</strong>，我们接收到的不仅仅是节点更新，还包括命名空间，这些命名空间告诉我们正在从哪个图（或子图）进行流式传输。

::::

<a id="debug"></a>
### 调试

使用 `debug` 流模式在图执行过程中流式传输尽可能多的信息。流式输出包括节点名称以及完整状态。

```python
for chunk in graph.stream(
    {"topic": "ice cream"},
    stream_mode="debug",  # [!code highlight]
):
    print(chunk)
```

<a id="messages"></a>
## LLM 令牌

使用 `messages` 流模式从图的任何部分（包括节点、工具、子图或任务）**逐令牌**流式传输大语言模型输出。

来自 [`messages` 模式](#supported-stream-modes) 的流式输出是一个元组 `(message_chunk, metadata)`，其中：

* `message_chunk`：来自 LLM 的令牌或消息片段。
* `metadata`：包含图节点和 LLM 调用详细信息的字典。

> 如果你的 LLM 不作为 LangChain 集成提供，你可以改用 `custom` 模式流式传输其输出。详情请参阅[与任何 LLM 一起使用](#use-with-any-llm)。

<Warning>

**Python < 3.11 异步需要手动配置**
当在 Python < 3.11 中使用异步代码时，必须显式地将 <a href="https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig" target="_blank" rel="noreferrer" class="link"><code>RunnableConfig</code></a> 传递给 `ainvoke()` 以启用正确的流式传输。详情请参阅 [Python < 3.11 异步](#async) 或升级到 Python 3.11+。

</Warning>

```python
from dataclasses import dataclass

from langchain.chat_models import init_chat_model
from langgraph.graph import StateGraph, START

@dataclass
class MyState:
    topic: str
    joke: str = ""

model = init_chat_model(model="gpt-4o-mini")

def call_model(state: MyState):
    """Call the LLM to generate a joke about a topic"""
    # Note that message events are emitted even when the LLM is run using .invoke rather than .stream
    model_response = model.invoke(  # [!code highlight]
        [
            {"role": "user", "content": f"Generate a joke about {state.topic}"}
        ]
    )
    return {"joke": model_response.content}

graph = (
    StateGraph(MyState)
    .add_node(call_model)
    .add_edge(START, "call_model")
    .compile()
)

# The "messages" stream mode returns an iterator of tuples (message_chunk, metadata)
# where message_chunk is the token streamed by the LLM and metadata is a dictionary
# with information about the graph node where the LLM was called and other information
for message_chunk, metadata in graph.stream(
    {"topic": "ice cream"},
    stream_mode="messages",  # [!code highlight]
):
    if message_chunk.content:
        print(message_chunk.content, end="|", flush=True)
```

#### 按 LLM 调用过滤

你可以为 LLM 调用关联 `tags`，以按 LLM 调用过滤流式传输的令牌。

```python
from langchain.chat_models import init_chat_model

# model_1 is tagged with "joke"
model_1 = init_chat_model(model="gpt-4o-mini", tags=['joke'])
# model_2 is tagged with "poem"
model_2 = init_chat_model(model="gpt-4o-mini", tags=['poem'])

graph = ... # define a graph that uses these LLMs

# The stream_mode is set to "messages" to stream LLM tokens
# The metadata contains information about the LLM invocation, including the tags
async for msg, metadata in graph.astream(
    {"topic": "cats"},
    stream_mode="messages",  # [!code highlight]
):
    # Filter the streamed tokens by the tags field in the metadata to only include
    # the tokens from the LLM invocation with the "joke" tag
    if metadata["tags"] == ["joke"]:
        print(msg.content, end="|", flush=True)
```

:::: details 扩展示例：按标签过滤

```python
from typing import TypedDict

from langchain.chat_models import init_chat_model
from langgraph.graph import START, StateGraph

# The joke_model is tagged with "joke"
joke_model = init_chat_model(model="gpt-4o-mini", tags=["joke"])
# The poem_model is tagged with "poem"
poem_model = init_chat_model(model="gpt-4o-mini", tags=["poem"])

class State(TypedDict):
      topic: str
      joke: str
      poem: str

async def call_model(state, config):
      topic = state["topic"]
      print("Writing joke...")
      # Note: Passing the config through explicitly is required for python < 3.11
      # Since context var support wasn't added before then: https://docs.python.org/3/library/asyncio-task.html#creating-tasks
      # The config is passed through explicitly to ensure the context vars are propagated correctly
      # This is required for Python < 3.11 when using async code. Please see the async section for more details
      joke_response = await joke_model.ainvoke(
            [{"role": "user", "content": f"Write a joke about {topic}"}],
            config,
      )
      print("\n\nWriting poem...")
      poem_response = await poem_model.ainvoke(
            [{"role": "user", "content": f"Write a short poem about {topic}"}],
            config,
      )
      return {"joke": joke_response.content, "poem": poem_response.content}

graph = (
      StateGraph(State)
      .add_node(call_model)
      .add_edge(START, "call_model")
      .compile()
)

# The stream_mode is set to "messages" to stream LLM tokens
# The metadata contains information about the LLM invocation, including the tags
async for msg, metadata in graph.astream(
      {"topic": "cats"},
      stream_mode="messages",
):
    if metadata["tags"] == ["joke"]:
        print(msg.content, end="|", flush=True)
```

::::

#### 按节点过滤

要仅从特定节点流式传输令牌，请使用 `stream_mode="messages"` 并通过流式元数据中的 `langgraph_node` 字段过滤输出：

```python
# The "messages" stream mode returns a tuple of (message_chunk, metadata)
# where message_chunk is the token streamed by the LLM and metadata is a dictionary
# with information about the graph node where the LLM was called and other information
for msg, metadata in graph.stream(
    inputs,
    stream_mode="messages",  # [!code highlight]
):
    # Filter the streamed tokens by the langgraph_node field in the metadata
    # to only include the tokens from the specified node
    if msg.content and metadata["langgraph_node"] == "some_node_name":
        ...
```

:::: details 扩展示例：从特定节点流式传输 LLM 令牌

```python
from typing import TypedDict
from langgraph.graph import START, StateGraph
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini")

class State(TypedDict):
      topic: str
      joke: str
      poem: str

def write_joke(state: State):
      topic = state["topic"]
      joke_response = model.invoke(
            [{"role": "user", "content": f"Write a joke about {topic}"}]
      )
      return {"joke": joke_response.content}

def write_poem(state: State):
      topic = state["topic"]
      poem_response = model.invoke(
            [{"role": "user", "content": f"Write a short poem about {topic}"}]
      )
      return {"poem": poem_response.content}

graph = (
      StateGraph(State)
      .add_node(write_joke)
      .add_node(write_poem)
      # write both the joke and the poem concurrently
      .add_edge(START, "write_joke")
      .add_edge(START, "write_poem")
      .compile()
)

# The "messages" stream mode returns a tuple of (message_chunk, metadata)
# where message_chunk is the token streamed by the LLM and metadata is a dictionary
# with information about the graph node where the LLM was called and other information
for msg, metadata in graph.stream(
    {"topic": "cats"},
    stream_mode="messages",  # [!code highlight]
):
    # Filter the streamed tokens by the langgraph_node field in the metadata
    # to only include the tokens from the write_poem node
    if msg.content and metadata["langgraph_node"] == "write_poem":
        print(msg.content, end="|", flush=True)
```

::::

## 流式传输自定义数据

要从 LangGraph 节点或工具内部发送**自定义用户定义的数据**，请按照以下步骤操作：

1. 使用 <a href="https://reference.langchain.com/python/langgraph/config/#langgraph.config.get_stream_writer" target="_blank" rel="noreferrer" class="link"><code>get_stream_writer</code></a> 访问流写入器并发出自定义数据。
2. 调用 `.stream()` 或 `.astream()` 时设置 `stream_mode="custom"` 以在流中获取自定义数据。你可以组合多种模式（例如 `["updates", "custom"]`），但至少有一种必须是 `"custom"`。

<Warning>

<strong>Python < 3.11 异步中无 <a href="https://reference.langchain.com/python/langgraph/config/#langgraph.config.get_stream_writer" target="_blank" rel="noreferrer" class="link"><code>get_stream_writer</code></a></strong>
在 Python < 3.11 上运行的异步代码中，<a href="https://reference.langchain.com/python/langgraph/config/#langgraph.config.get_stream_writer" target="_blank" rel="noreferrer" class="link"><code>get_stream_writer</code></a> 将不起作用。
相反，请向你的节点或工具添加一个 `writer` 参数并手动传递它。
用法示例请参阅 [Python < 3.11 异步](#async)。

</Warning>

<Tabs>

<Tab title="节点">

```python
from typing import TypedDict
from langgraph.config import get_stream_writer
from langgraph.graph import StateGraph, START

class State(TypedDict):
    query: str
    answer: str

def node(state: State):
    # Get the stream writer to send custom data
    writer = get_stream_writer()
    # Emit a custom key-value pair (e.g., progress update)
    writer({"custom_key": "Generating custom data inside node"})
    return {"answer": "some data"}

graph = (
    StateGraph(State)
    .add_node(node)
    .add_edge(START, "node")
    .compile()
)

inputs = {"query": "example"}

# Set stream_mode="custom" to receive the custom data in the stream
for chunk in graph.stream(inputs, stream_mode="custom"):
    print(chunk)
```

</Tab>

<Tab title="工具">

```python
from langchain.tools import tool
from langgraph.config import get_stream_writer

@tool
def query_database(query: str) -> str:
    """Query the database."""
    # Access the stream writer to send custom data
    writer = get_stream_writer()  # [!code highlight]
    # Emit a custom key-value pair (e.g., progress update)
    writer({"data": "Retrieved 0/100 records", "type": "progress"})  # [!code highlight]
    # perform query
    # Emit another custom key-value pair
    writer({"data": "Retrieved 100/100 records", "type": "progress"})
    return "some-answer"

graph = ... # define a graph that uses this tool

# Set stream_mode="custom" to receive the custom data in the stream
for chunk in graph.stream(inputs, stream_mode="custom"):
    print(chunk)
```

</Tab>

</Tabs>

## 与任何 LLM 一起使用

你可以使用 `stream_mode="custom"` 从**任何 LLM API** 流式传输数据——即使该 API **没有**实现 LangChain 聊天模型接口。

这让你可以集成原始的 LLM 客户端或提供自己流式接口的外部服务，使 LangGraph 在自定义设置中具有高度灵活性。

```python
from langgraph.config import get_stream_writer

def call_arbitrary_model(state):
    """Example node that calls an arbitrary model and streams the output"""
    # Get the stream writer to send custom data
    writer = get_stream_writer()  # [!code highlight]
    # Assume you have a streaming client that yields chunks
    # Generate LLM tokens using your custom streaming client
    for chunk in your_custom_streaming_client(state["topic"]):
        # Use the writer to send custom data to the stream
        writer({"custom_llm_chunk": chunk})  # [!code highlight]
    return {"result": "completed"}

graph = (
    StateGraph(State)
    .add_node(call_arbitrary_model)
    # Add other nodes and edges as needed
    .compile()
)
# Set stream_mode="custom" to receive the custom data in the stream
for chunk in graph.stream(
    {"topic": "cats"},
    stream_mode="custom",  # [!code highlight]

):
    # The chunk will contain the custom data streamed from the llm
    print(chunk)
```

:::: details 扩展示例：流式传输任意聊天模型

```python
import operator
import json

from typing import TypedDict
from typing_extensions import Annotated
from langgraph.graph import StateGraph, START

from openai import AsyncOpenAI

openai_client = AsyncOpenAI()
model_name = "gpt-4o-mini"

async def stream_tokens(model_name: str, messages: list[dict]):
    response = await openai_client.chat.completions.create(
        messages=messages, model=model_name, stream=True
    )
    role = None
    async for chunk in response:
        delta = chunk.choices[0].delta

        if delta.role is not None:
            role = delta.role

        if delta.content:
            yield {"role": role, "content": delta.content}

# this is our tool
async def get_items(place: str) -> str:
    """Use this tool to list items one might find in a place you're asked about."""
    writer = get_stream_writer()
    response = ""
    async for msg_chunk in stream_tokens(
        model_name,
        [
            {
                "role": "user",
                "content": (
                    "Can you tell me what kind of items "
                    f"i might find in the following place: '{place}'. "
                    "List at least 3 such items separating them by a comma. "
                    "And include a brief description of each item."
                ),
            }
        ],
    ):
        response += msg_chunk["content"]
        writer(msg_chunk)

    return response

class State(TypedDict):
    messages: Annotated[list[dict], operator.add]

# this is the tool-calling graph node
async def call_tool(state: State):
    ai_message = state["messages"][-1]
    tool_call = ai_message["tool_calls"][-1]

    function_name = tool_call["function"]["name"]
    if function_name != "get_items":
        raise ValueError(f"Tool {function_name} not supported")

    function_arguments = tool_call["function"]["arguments"]
    arguments = json.loads(function_arguments)

    function_response = await get_items(**arguments)
    tool_message = {
        "tool_call_id": tool_call["id"],
        "role": "tool",
        "name": function_name,
        "content": function_response,
    }
    return {"messages": [tool_message]}

graph = (
    StateGraph(State)
    .add_node(call_tool)
    .add_edge(START, "call_tool")
    .compile()
)
```

让我们用一个包含工具调用的 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 来调用图：

```python
inputs = {
    "messages": [
        {
            "content": None,
            "role": "assistant",
            "tool_calls": [
                {
                    "id": "1",
                    "function": {
                        "arguments": '{"place":"bedroom"}',
                        "name": "get_items",
                    },
                    "type": "function",
                }
            ],
        }
    ]
}

async for chunk in graph.astream(
    inputs,
    stream_mode="custom",
):
    print(chunk["content"], end="|", flush=True)
```

::::

## 为特定聊天模型禁用流式传输

如果你的应用程序混合了支持流式传输和不支持流式传输的模型，你可能需要为不支持流式传输的模型显式禁用流式传输。

初始化模型时设置 `streaming=False`。

<Tabs>

<Tab title="init_chat_model">

```python
from langchain.chat_models import init_chat_model

model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    # Set streaming=False to disable streaming for the chat model
    streaming=False  # [!code highlight]
)
```

</Tab>

<Tab title="聊天模型接口">

```python
from langchain_openai import ChatOpenAI

# Set streaming=False to disable streaming for the chat model
model = ChatOpenAI(model="o1-preview", streaming=False)
```

</Tab>

</Tabs>

<Note>

并非所有聊天模型集成都支持 `streaming` 参数。如果你的模型不支持，请改用 `disable_streaming=True`。此参数可通过基类在所有聊天模型上使用。

</Note>

<a id="async"></a>
### Python < 3.11 异步

在 Python 版本 < 3.11 中，[asyncio 任务](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task) 不支持 `context` 参数。
这限制了 LangGraph 自动传播上下文的能力，并在两个关键方面影响了 LangGraph 的流式传输机制：

1. 你必须显式地将 [`RunnableConfig`](https://python.langchain.com/docs/concepts/runnables/#runnableconfig) 传递给异步 LLM 调用（例如 `ainvoke()`），因为回调不会自动传播。
2. 你不能在异步节点或工具中使用 <a href="https://reference.langchain.com/python/langgraph/config/#langgraph.config.get_stream_writer" target="_blank" rel="noreferrer" class="link"><code>get_stream_writer</code></a>——你必须直接传递一个 `writer` 参数。

:::: details 扩展示例：带手动配置的异步 LLM 调用

```python
from typing import TypedDict
from langgraph.graph import START, StateGraph
from langchain.chat_models import init_chat_model

model = init_chat_model(model="gpt-4o-mini")

class State(TypedDict):
    topic: str
    joke: str

# Accept config as an argument in the async node function
async def call_model(state, config):
    topic = state["topic"]
    print("Generating joke...")
    # Pass config to model.ainvoke() to ensure proper context propagation
    joke_response = await model.ainvoke(  # [!code highlight]
        [{"role": "user", "content": f"Write a joke about {topic}"}],
        config,
    )
    return {"joke": joke_response.content}

graph = (
    StateGraph(State)
    .add_node(call_model)
    .add_edge(START, "call_model")
    .compile()
)

# Set stream_mode="messages" to stream LLM tokens
async for chunk, metadata in graph.astream(
    {"topic": "ice cream"},
    stream_mode="messages",  # [!code highlight]
):
    if chunk.content:
        print(chunk.content, end="|", flush=True)
```

::::

:::: details 扩展示例：带流写入器的异步自定义流式传输

```python
from typing import TypedDict
from langgraph.types import StreamWriter

class State(TypedDict):
      topic: str
      joke: str

# Add writer as an argument in the function signature of the async node or tool
# LangGraph will automatically pass the stream writer to the function
async def generate_joke(state: State, writer: StreamWriter):  # [!code highlight]
      writer({"custom_key": "Streaming custom data while generating a joke"})
      return {"joke": f"This is a joke about {state['topic']}"}

graph = (
      StateGraph(State)
      .add_node(generate_joke)
      .add_edge(START, "generate_joke")
      .compile()
)

# Set stream_mode="custom" to receive the custom data in the stream  # [!code highlight]
async for chunk in graph.astream(
      {"topic": "ice cream"},
      stream_mode="custom",
):
      print(chunk)
```

::::

