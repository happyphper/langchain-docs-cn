---
title: 流式 API
sidebarTitle: Streaming API
---
[LangGraph SDK](/langsmith/langgraph-python-sdk) 允许您从 [LangSmith 部署 API](/langsmith/server-api-ref) [流式传输输出](/oss/langgraph/streaming/)。

<Note>

LangGraph SDK 和 Agent Server 是 [LangSmith](/langsmith/home) 的一部分。

</Note>

## 基本用法

基本用法示例：

<Tabs>

<Tab title="Python">

```python {highlight={12}}
from langgraph_sdk import get_client
client = get_client(url=<DEPLOYMENT_URL>, api_key=<API_KEY>)

# 使用名为 "agent" 的部署图
assistant_id = "agent"

# 创建一个线程
thread = await client.threads.create()
thread_id = thread["thread_id"]

# 创建一个流式运行
async for chunk in client.runs.stream(
    thread_id,
    assistant_id,
    input=inputs,
    stream_mode="updates"
):
    print(chunk.data)
```

</Tab>

<Tab title="JavaScript">

```javascript {highlight={12}}
import { Client } from "@langchain/langgraph-sdk";
const client = new Client({ apiUrl: <DEPLOYMENT_URL>, apiKey: <API_KEY> });

// 使用名为 "agent" 的部署图
const assistantID = "agent";

// 创建一个线程
const thread = await client.threads.create();
const threadID = thread["thread_id"];

// 创建一个流式运行
const streamResponse = client.runs.stream(
  threadID,
  assistantID,
  {
    input,
    streamMode: "updates"
  }
);
for await (const chunk of streamResponse) {
  console.log(chunk.data);
}
```

</Tab>

<Tab title="cURL">

创建一个线程：

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads \
--header 'Content-Type: application/json' \
--data '{}'
```

创建一个流式运行：

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
--header 'Content-Type: application/json' \
--header 'x-api-key: <API_KEY>'
--data "{
  \"assistant_id\": \"agent\",
  \"input\": <inputs>,
  \"stream_mode\": \"updates\"
}"
```

</Tab>

</Tabs>

:::: details 扩展示例：流式传输更新

这是一个您可以在 Agent Server 中运行的示例图。
有关更多详细信息，请参阅 [LangSmith 快速入门](/langsmith/deployment-quickstart)。

```python
# graph.py
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    topic: str
    joke: str

def refine_topic(state: State):
    return {"topic": state["topic"] + " and cats"}

def generate_joke(state: State):
    return {"joke": f"这是一个关于 {state['topic']} 的笑话"}

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

一旦您运行了 Agent Server，您就可以使用 [LangGraph SDK](/langsmith/langgraph-python-sdk) 与其交互

<Tabs>

<Tab title="Python">

```python {highlight={12,16}}
from langgraph_sdk import get_client
client = get_client(url=<DEPLOYMENT_URL>)

# 使用名为 "agent" 的部署图
assistant_id = "agent"

# 创建一个线程
thread = await client.threads.create()
thread_id = thread["thread_id"]

# 创建一个流式运行
async for chunk in client.runs.stream(  # (1)!
    thread_id,
    assistant_id,
    input={"topic": "ice cream"},
    stream_mode="updates"  # (2)!
):
    print(chunk.data)
```

1. `client.runs.stream()` 方法返回一个迭代流式输出的迭代器。
2. 设置 `stream_mode="updates"` 以仅流式传输每个节点后图状态的更新。其他流模式也可用。有关详细信息，请参阅 [支持的流模式](#supported-stream-modes)。

</Tab>

<Tab title="JavaScript">

```javascript {highlight={12,17}}
import { Client } from "@langchain/langgraph-sdk";
const client = new Client({ apiUrl: <DEPLOYMENT_URL> });

// 使用名为 "agent" 的部署图
const assistantID = "agent";

// 创建一个线程
const thread = await client.threads.create();
const threadID = thread["thread_id"];

// 创建一个流式运行
const streamResponse = client.runs.stream(  # (1)!
  threadID,
  assistantID,
  {
    input: { topic: "ice cream" },
    streamMode: "updates"  # (2)!
  }
);
for await (const chunk of streamResponse) {
  console.log(chunk.data);
}
```

1. `client.runs.stream()` 方法返回一个迭代流式输出的迭代器。
2. 设置 `streamMode: "updates"` 以仅流式传输每个节点后图状态的更新。其他流模式也可用。有关详细信息，请参阅 [支持的流模式](#supported-stream-modes)。

</Tab>

<Tab title="cURL">

创建一个线程：

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads \
--header 'Content-Type: application/json' \
--data '{}'
```

创建一个流式运行：

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
--header 'Content-Type: application/json' \
--data "{
  \"assistant_id\": \"agent\",
  \"input\": {\"topic\": \"ice cream\"},
  \"stream_mode\": \"updates\"
}"
```

</Tab>

</Tabs>

```python
{'run_id': '1f02c2b3-3cef-68de-b720-eec2a4a8e920', 'attempt': 1}
{'refine_topic': {'topic': 'ice cream and cats'}}
{'generate_joke': {'joke': '这是一个关于 ice cream and cats 的笑话'}}
```

::::

### 支持的流模式

| 模式                             | 描述                                                                                                                                                                         | LangGraph 库方法                                                                                 |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| [`values`](#stream-graph-state)  | 在每个 [超级步骤 (super-step)](/langsmith/graph-rebuild#graphs) 后流式传输完整的图状态。                                                                                            | `.stream()` / `.astream()` 配合 [`stream_mode="values"`](/oss/langgraph/streaming#stream-graph-state)  |
| [`updates`](#stream-graph-state) | 在图的每个步骤之后流式传输状态更新。如果在同一步骤中进行了多次更新（例如运行了多个节点），这些更新将分别流式传输。 | `.stream()` / `.astream()` 配合 [`stream_mode="updates"`](/oss/langgraph/streaming#stream-graph-state) |
| [`messages-tuple`](#messages)    | 流式传输调用 LLM 的图节点的 LLM 令牌和元数据（对聊天应用很有用）。                                                                                 | `.stream()` / `.astream()` 配合 [`stream_mode="messages"`](/oss/langgraph/streaming#messages)          |
| [`debug`](#debug)                | 在图执行过程中流式传输尽可能多的信息。                                                                                                      | `.stream()` / `.astream()` 配合 [`stream_mode="debug"`](/oss/langgraph/streaming#stream-graph-state)   |
| [`custom`](#stream-custom-data)  | 从您的图内部流式传输自定义数据                                                                                                                                          | `.stream()` / `.astream()` 配合 [`stream_mode="custom"`](/oss/langgraph/streaming#stream-custom-data)  |
| [`events`](#stream-events)       | 流式传输所有事件（包括图的状态）；主要在迁移大型 LCEL 应用时有用。                                                                                 | `.astream_events()`                                                                                      |

### 流式传输多种模式

您可以传递一个列表作为 `stream_mode` 参数来同时流式传输多种模式。

流式输出将是 `(mode, chunk)` 的元组，其中 `mode` 是流模式的名称，`chunk` 是该模式流式传输的数据。

<Tabs>

<Tab title="Python">

```python
async for chunk in client.runs.stream(
    thread_id,
    assistant_id,
    input=inputs,
    stream_mode=["updates", "custom"]
):
    print(chunk)
```

</Tab>

<Tab title="JavaScript">

```js
const streamResponse = client.runs.stream(
  threadID,
  assistantID,
  {
    input,
    streamMode: ["updates", "custom"]
  }
);
for await (const chunk of streamResponse) {
  console.log(chunk);
}
```

</Tab>

<Tab title="cURL">

```bash
curl --request POST \
 --url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
 --header 'Content-Type: application/json' \
 --data "{
   \"assistant_id\": \"agent\",
   \"input\": <inputs>,
   \"stream_mode\": [
     \"updates\"
     \"custom\"
   ]
 }"
```

</Tab>

</Tabs>

## 流式传输图状态

使用流模式 `updates` 和 `values` 在图执行时流式传输图的状态。

* `updates` 流式传输图每个步骤后状态的**更新**。
* `values` 流式传输图每个步骤后状态的**完整值**。

:::: details 示例图

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
  topic: str
  joke: str

def refine_topic(state: State):
    return {"topic": state["topic"] + " and cats"}

def generate_joke(state: State):
    return {"joke": f"这是一个关于 {state['topic']} 的笑话"}

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

::::

<Note>

<strong>有状态运行</strong>
以下示例假设您希望在 [检查点 (checkpointer)](/oss/langgraph/persistence) 数据库中<strong>持久化流式运行的输出</strong>，并已创建了一个线程。要创建一个线程：

<Tabs>

<Tab title="Python">

```python
from langgraph_sdk import get_client
client = get_client(url=<DEPLOYMENT_URL>)

# 使用名为 "agent" 的部署图
assistant_id = "agent"
# 创建一个线程
thread = await client.threads.create()
thread_id = thread["thread_id"]
```

</Tab>

<Tab title="JavaScript">

```js
import { Client } from "@langchain/langgraph-sdk";
const client = new Client({ apiUrl: <DEPLOYMENT_URL> });

// 使用名为 "agent" 的部署图
const assistantID = "agent";
// 创建一个线程
const thread = await client.threads.create();
const threadID = thread["thread_id"]
```

</Tab>

<Tab title="cURL">

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads \
--header 'Content-Type: application/json' \
--data '{}'
```

</Tab>

</Tabs>

如果您不需要持久化运行的输出，可以在流式传输时传递 `None` 而不是 `thread_id`。

</Note>

### 流模式：`updates`

使用此模式仅流式传输每个步骤后节点返回的**状态更新**。流式输出包括节点名称以及更新。

<Tabs>

<Tab title="Python">

```python {highlight={5}}
async for chunk in client.runs.stream(
    thread_id,
    assistant_id,
    input={"topic": "ice cream"},
    stream_mode="updates"
):
    print(chunk.data)
```

</Tab>

<Tab title="JavaScript">

```javascript {highlight={6}}
const streamResponse = client.runs.stream(
  threadID,
  assistantID,
  {
    input: { topic: "ice cream" },
    streamMode: "updates"
  }
);
for await (const chunk of streamResponse) {
  console.log(chunk.data);
}
```

</Tab>

<Tab title="cURL">

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
--header 'Content-Type: application/json' \
--data "{
  \"assistant_id\": \"agent\",
  \"input\": {\"topic\": \"ice cream\"},
  \"stream_mode\": \"updates\"
}"
```

</Tab>

</Tabs>

### 流模式：`values`

使用此模式流式传输每个步骤后图的**完整状态**。

<Tabs>

<Tab title="Python">

```python {highlight={5}}
async for chunk in client.runs.stream(
    thread_id,
    assistant_id,
    input={"topic": "ice cream"},
    stream_mode="values"
):
    print(chunk.data)
```

</Tab>

<Tab title="JavaScript">

```javascript {highlight={6}}
const streamResponse = client.runs.stream(
  threadID,
  assistantID,
  {
    input: { topic: "ice cream" },
    streamMode: "values"
  }
);
for await (const chunk of streamResponse) {
  console.log(chunk.data);
}
```

</Tab>

<Tab title="cURL">

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
--header 'Content-Type: application/json' \
--data "{
  \"assistant_id\": \"agent\",
  \"input\": {\"topic\": \"ice cream\"},
  \"stream_mode\": \"values\"
}"
```

</Tab>

</Tabs>

## 子图

要将 [子图](/oss/langgraph/use-subgraphs) 的输出包含在流式输出中，您可以在父图的 `.stream()` 方法中设置 `subgraphs=True`。这将流式传输来自父图和任何子图的输出。

```python {highlight={5}}
async for chunk in client.runs.stream(
    thread_id,
    assistant_id,
    input={"foo": "foo"},
    stream_subgraphs=True, # (1)!
    stream_mode="updates",
):
    print(chunk)
```

1. 设置 `stream_subgraphs=True` 以流式传输来自子图的输出。

:::: details 扩展示例：从子图流式传输

这是一个您可以在 Agent Server 中运行的示例图。
有关更多详细信息，请参阅 [LangSmith 快速入门](/langsmith/deployment-quickstart)。

```python
# graph.py
from langgraph.graph import START, StateGraph
from typing import TypedDict

# 定义子图
class SubgraphState(TypedDict):
    foo: str  # 注意，此键与父图状态共享
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

# 定义父图
class ParentState(TypedDict):
    foo: str

def node_1(state: ParentState):
    return {"foo": "嗨！" + state["foo"]}

builder = StateGraph(ParentState)
builder.add_node("node_1", node_1)
builder.add_node("node_2", subgraph)
builder.add_edge(START, "node_1")
builder.add_edge("node_1", "node_2")
graph = builder.compile()
```

一旦您运行了 Agent Server，您就可以使用 [LangGraph SDK](/langsmith/langgraph-python-sdk) 与其交互

<Tabs>

<Tab title="Python">

```python {highlight={15}}
from langgraph_sdk import get_client
client = get_client(url=<DEPLOYMENT_URL>)

# 使用名为 "agent" 的部署图
assistant_id = "agent"

# 创建一个线程
thread = await client.threads.create()
thread_id = thread["thread_id"]

async for chunk in client.runs.stream(
    thread_id,
    assistant_id,
    input={"foo": "foo"},
    stream_subgraphs=True, # (1)!
    stream_mode="updates",
):
    print(chunk)
```

1. 设置 `stream_subgraphs=True` 以流式传输来自子图的输出。

</Tab>

<Tab title="JavaScript">

```javascript {highlight={17}}
import { Client } from "@langchain/langgraph-sdk";
const client = new Client({ apiUrl: <DEPLOYMENT_URL> });

// 使用名为 "agent" 的部署图
const assistantID = "agent";

// 创建一个线程
const thread = await client.threads.create();
const threadID = thread["thread_id"];

// 创建一个流式运行
const streamResponse = client.runs.stream(
  threadID,
  assistantID,
  {
    input: { foo: "foo" },
    streamSubgraphs: true,  // (1)!
    streamMode: "updates"
  }
);
for await (const chunk of streamResponse) {
  console.log(chunk);
}
```

1. 设置 `streamSubgraphs: true` 以流式传输来自子图的输出。

</Tab>

<Tab title="cURL">

创建一个线程：

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads \
--header 'Content-Type: application/json' \
--data '{}'
```

创建一个流式运行：

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
--header 'Content-Type: application/json' \
--data "{
  \"assistant_id\": \"agent\",
  \"input\": {\"foo\": \"foo\"},
  \"stream_subgraphs\": true,
  \"stream_mode\": [
    \"updates\"
  ]
}"
```

</Tab>

</Tabs>

<strong>请注意</strong>，我们不仅收到了节点更新，还收到了命名空间，它们告诉我们正在从哪个图（或子图）进行流式传输。

::::

<a id="debug"></a>
## 调试

使用 `debug` 流模式在图的整个执行过程中流式传输尽可能多的信息。流式输出包括节点名称以及完整状态。

<Tabs>

<Tab title="Python">

```python {highlight={5}}
async for chunk in client.runs.stream(
    thread_id,
    assistant_id,
    input={"topic": "ice cream"},
    stream_mode="debug"
):
    print(chunk.data)
```

</Tab>

<Tab title="JavaScript">

```javascript {highlight={6}}
const streamResponse = client.runs.stream(
  threadID,
  assistantID,
  {
    input: { topic: "ice cream" },
    streamMode: "debug"
  }
);
for await (const chunk of streamResponse) {
  console.log(chunk.data);
}
```

</Tab>

<Tab title="cURL">

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
--header 'Content-Type: application/json' \
--data "{
  \"assistant_id\": \"agent\",
  \"input\": {\"topic\": \"ice cream\"},
  \"stream_mode\": \"debug\"
}"
```

</Tab>

</Tabs>

<a id="messages"></a>
## LLM 令牌

使用 `messages-tuple` 流模式从图的任何部分（包括节点、工具、子图或任务）**逐个令牌**流式传输大语言模型 (LLM) 的输出。

来自 [`messages-tuple` 模式](#supported-stream-modes)的流式输出是元组 `(message_chunk, metadata)`，其中：

* `message_chunk`：来自 LLM 的令牌或消息段。
* `metadata`：包含图节点和 LLM 调用详情的字典。

:::: details 示例图

```python {highlight={15}}
from dataclasses import dataclass

from langchain.chat_models import init_chat_model
from langgraph.graph import StateGraph, START

@dataclass
class MyState:
    topic: str
    joke: str = ""

model = init_chat_model(model="gpt-4o-mini")

def call_model(state: MyState):
    """调用 LLM 为某个主题生成一个笑话"""
    model_response = model.invoke( # (1)!
        [
            {"role": "user", "content": f"为 {state.topic} 生成一个笑话"}
        ]
    )
    return {"joke": model_response.content}

graph = (
    StateGraph(MyState)
    .add_node(call_model)
    .add_edge(START, "call_model")
    .compile()
)
```

1. 请注意，即使 LLM 是使用 `invoke` 而非 `stream` 运行的，消息事件也会发出。

::::

<Tabs>

<Tab title="Python">

```python {highlight={5}}
async for chunk in client.runs.stream(
    thread_id,
    assistant_id,
    input={"topic": "ice cream"},
    stream_mode="messages-tuple",
):
    if chunk.event != "messages":
        continue

    message_chunk, metadata = chunk.data  # (1)!
    if message_chunk["content"]:
        print(message_chunk["content"], end="|", flush=True)
```

    1. "messages-tuple" 流模式返回元组 `(message_chunk, metadata)` 的迭代器，其中 `message_chunk` 是 LLM 流式传输的令牌，而 `metadata` 是包含有关调用 LLM 的图节点及其他信息的字典。

</Tab>

<Tab title="JavaScript">

```javascript {highlight={6}}
const streamResponse = client.runs.stream(
  threadID,
  assistantID,
  {
    input: { topic: "ice cream" },
    streamMode: "messages-tuple"
  }
);
for await (const chunk of streamResponse) {
  if (chunk.event !== "messages") {
    continue;
  }
  console.log(chunk.data[0]["content"]);  // (1)!
}
```

    1. "messages-tuple" 流模式返回元组 `(message_chunk, metadata)` 的迭代器，其中 `message_chunk` 是 LLM 流式传输的令牌，而 `metadata` 是包含有关调用 LLM 的图节点及其他信息的字典。

</Tab>

<Tab title="cURL">

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
--header 'Content-Type: application/json' \
--data "{
  \"assistant_id\": \"agent\",
  \"input\": {\"topic\": \"ice cream\"},
  \"stream_mode\": \"messages-tuple\"
}"
```

</Tab>

</Tabs>

### 过滤 LLM 令牌

* 要通过 LLM 调用过滤流式令牌，您可以 [将 `tags` 与 LLM 调用关联](/oss/langgraph/streaming#filter-by-llm-invocation)。
* 要仅从特定节点流式传输令牌，请使用 `stream_mode="messages"` 并 [通过 `langgraph_node` 字段过滤输出](/oss/langgraph/streaming#filter-by-node)（包含在流式元数据中）。

## 流式传输自定义数据

发送 **自定义用户定义数据**：

<Tabs>

<Tab title="Python">

```python {highlight={5}}
async for chunk in client.runs.stream(
    thread_id,
    assistant_id,
    input={"query": "example"},
    stream_mode="custom"
):
    print(chunk.data)
```

</Tab>

<Tab title="JavaScript">

```javascript {highlight={6}}
const streamResponse = client.runs.stream(
  threadID,
  assistantID,
  {
    input: { query: "example" },
    streamMode: "custom"
  }
);
for await (const chunk of streamResponse) {
  console.log(chunk.data);
}
```

</Tab>

<Tab title="cURL">

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
--header 'Content-Type: application/json' \
--data "{
  \"assistant_id\": \"agent\",
  \"input\": {\"query\": \"example\"},
  \"stream_mode\": \"custom\"
}"
```

</Tab>

</Tabs>

## 流式传输事件

要流式传输所有事件，包括图的状态：

<Tabs>

<Tab title="Python">

```python {highlight={5}}
async for chunk in client.runs.stream(
    thread_id,
    assistant_id,
    input={"topic": "ice cream"},
    stream_mode="events"
):
    print(chunk.data)
```

</Tab>

<Tab title="JavaScript">

```javascript {highlight={6}}
const streamResponse = client.runs.stream(
  threadID,
  assistantID,
  {
    input: { topic: "ice cream" },
    streamMode: "events"
  }
);
for await (const chunk of streamResponse) {
  console.log(chunk.data);
}
```

</Tab>

<Tab title="cURL">

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
--header 'Content-Type: application/json' \
--data "{
  \"assistant_id\": \"agent\",
  \"input\": {\"topic\": \"ice cream\"},
  \"stream_mode\": \"events\"
}"
```

</Tab>

</Tabs>

## 无状态运行

如果您不想在 [检查点 (checkpointer)](/oss/langgraph/persistence) 数据库中 **持久化流式运行的输出**，您可以在不创建线程的情况下创建一个无状态运行：

<Tabs>

<Tab title="Python">

```python {highlight={5}}
from langgraph_sdk import get_client
client = get_client(url=<DEPLOYMENT_URL>, api_key=<API_KEY>)

async for chunk in client.runs.stream(
    None,  # (1)!
    assistant_id,
    input=inputs,
    stream_mode="updates"
):
    print(chunk.data)
```

    1. 我们传递的是 `None` 而非 `thread_id` UUID。

</Tab>

<Tab title="JavaScript">

```javascript {highlight={5,6}}
import { Client } from "@langchain/langgraph-sdk";
const client = new Client({ apiUrl: <DEPLOYMENT_URL>, apiKey: <API_KEY> });

// 创建一个流式运行
const streamResponse = client.runs.stream(
  null,  // (1)!
  assistantID,
  {
    input,
    streamMode: "updates"
  }
);
for await (const chunk of streamResponse) {
  console.log(chunk.data);
}
```

    1. 我们传递的是 `null` 而非 `thread_id` UUID。

</Tab>

<Tab title="cURL">

```bash
curl --request POST \
--url <DEPLOYMENT_URL>/runs/stream \
--header 'Content-Type: application/json' \
--header 'x-api-key: <API_KEY>'
--data "{
  \"assistant_id\": \"agent\",
  \"input\": <inputs>,
  \"stream_mode\": \"updates\"
}"
```

</Tab>

</Tabs>

## 加入并流式传输

LangSmith 允许您加入一个正在进行的 [后台运行](/langsmith/background-run) 并流式传输其输出。为此，您可以使用 [LangGraph SDK](/langsmith/langgraph-python-sdk) 的 `client.runs.join_stream` 方法：

<Tabs>

<Tab title="Python">

```python {highlight={4,6}}
from langgraph_sdk import get_client
client = get_client(url=<DEPLOYMENT_URL>, api_key=<API_KEY>)

async for chunk in client.runs.join_stream(
    thread_id,
    run_id,  # (1)!
):
    print(chunk)
```

    1. 这是您想要加入的现有运行的 `run_id`。

</Tab>

<Tab title="JavaScript">

```javascript {highlight={4,6}}
import { Client } from "@langchain/langgraph-sdk";
const client = new Client({ apiUrl: <DEPLOYMENT_URL>, apiKey: <API_KEY> });

const streamResponse = client.runs.joinStream(
  threadID,
  runId  // (1)!
);
for await (const chunk of streamResponse) {
  console.log(chunk);
}
```

    1. 这是您想要加入的现有运行的 `run_id`。

</Tab>

<Tab title="cURL">

```bash
curl --request GET \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/<RUN_ID>/stream \
--header 'Content-Type: application/json' \
--header 'x-api-key: <API_KEY>'
```

</Tab>

</Tabs>

<Warning>

<strong>输出未缓冲</strong>
当您使用 `.join_stream` 时，输出不会被缓冲，因此在加入之前生成的任何输出都将无法接收。

</Warning>

---

## API 参考

有关 API 使用和实现，请参阅 [API 参考](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref.html#tag/thread-runs/POST/threads/{thread_id}/runs/stream)。
