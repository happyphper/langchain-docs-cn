---
title: 使用时间旅行
sidebarTitle: Time travel
---
在处理基于模型决策的非确定性系统（例如由 LLM 驱动的智能体）时，详细检查其决策过程会很有用：

1. <Icon icon="lightbulb" :size="16" /> **理解推理过程**：分析导致成功结果的步骤。
2. <Icon icon="bug" :size="16" /> **调试错误**：识别错误发生的位置和原因。
3. <Icon icon="magnifying-glass" :size="16" /> **探索替代方案**：测试不同的路径以发现更好的解决方案。

LangGraph 提供了[时间旅行](/oss/python/langgraph/use-time-travel)功能来支持这些用例。具体来说，您可以从先前的检查点恢复执行——既可以重放相同的状态，也可以修改它以探索替代方案。在所有情况下，恢复过去的执行都会在历史记录中创建一个新的分支。

要在 LangGraph 中使用[时间旅行](/oss/python/langgraph/use-time-travel)：

1.  [运行图](#1-run-the-graph)：使用 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.invoke" target="_blank" rel="noreferrer" class="link"><code>invoke</code></a> 或 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.stream" target="_blank" rel="noreferrer" class="link"><code>stream</code></a> 方法，结合初始输入运行图。
2.  [识别现有线程中的检查点](#2-identify-a-checkpoint)：使用 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.get_state_history" target="_blank" rel="noreferrer" class="link"><code>get_state_history</code></a> 方法检索特定 `thread_id` 的执行历史，并定位所需的 `checkpoint_id`。
或者，在您希望执行暂停的节点之前设置一个[中断](/oss/python/langgraph/interrupts)。然后，您可以找到该中断之前记录的最新检查点。
3.  [更新图状态（可选）](#3-update-the-state-optional)：使用 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.update_state" target="_blank" rel="noreferrer" class="link"><code>update_state</code></a> 方法在检查点处修改图的状态，并从替代状态恢复执行。
4.  [从检查点恢复执行](#4-resume-execution-from-the-checkpoint)：使用 `invoke` 或 `stream` 方法，输入为 `None`，配置中包含适当的 `thread_id` 和 `checkpoint_id`。

<Tip>

有关时间旅行的概念性概述，请参阅[时间旅行](/oss/python/langgraph/use-time-travel)。

</Tip>

## 在工作流中

此示例构建了一个简单的 LangGraph 工作流，该工作流使用 LLM 生成一个笑话主题并编写一个笑话。它演示了如何运行图、检索过去的执行检查点、可选地修改状态，以及从选定的检查点恢复执行以探索替代结果。

### 设置

首先，我们需要安装所需的包。

```python
%%capture --no-stderr
pip install --quiet -U langgraph langchain_anthropic
```

接下来，我们需要为 Anthropic（我们将使用的 LLM）设置 API 密钥。

```python
import getpass
import os

def _set_env(var: str):
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"{var}: ")

_set_env("ANTHROPIC_API_KEY")
```

<Tip>

注册 [LangSmith](https://smith.langchain.com) 以快速发现问题并提升您的 LangGraph 项目性能。LangSmith 让您能够使用追踪数据来调试、测试和监控您使用 LangGraph 构建的 LLM 应用。您还可以[从 LangSmith 获取追踪记录](/langsmith/export-traces#fetch-a-single-run-by-id)，以便在本地重放和调试生产环境问题。

</Tip>

```python
import uuid

from typing_extensions import TypedDict, NotRequired
from langgraph.graph import StateGraph, START, END
from langchain.chat_models import init_chat_model
from langgraph.checkpoint.memory import InMemorySaver

class State(TypedDict):
    topic: NotRequired[str]
    joke: NotRequired[str]

model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    temperature=0,
)

def generate_topic(state: State):
    """LLM call to generate a topic for the joke"""
    msg = model.invoke("Give me a funny topic for a joke")
    return {"topic": msg.content}

def write_joke(state: State):
    """LLM call to write a joke based on the topic"""
    msg = model.invoke(f"Write a short joke about {state['topic']}")
    return {"joke": msg.content}

# Build workflow
workflow = StateGraph(State)

# Add nodes
workflow.add_node("generate_topic", generate_topic)
workflow.add_node("write_joke", write_joke)

# Add edges to connect nodes
workflow.add_edge(START, "generate_topic")
workflow.add_edge("generate_topic", "write_joke")
workflow.add_edge("write_joke", END)

# Compile
checkpointer = InMemorySaver()
graph = workflow.compile(checkpointer=checkpointer)
graph
```

### 1. 运行图

```python
config = {
    "configurable": {
        "thread_id": uuid.uuid4(),
    }
}
state = graph.invoke({}, config)

print(state["topic"])
print()
print(state["joke"])
```

**输出：**

```
How about "The Secret Life of Socks in the Dryer"? You know, exploring the mysterious phenomenon of how socks go into the laundry as pairs but come out as singles. Where do they go? Are they starting new lives elsewhere? Is there a sock paradise we don't know about? There's a lot of comedic potential in the everyday mystery that unites us all!

# The Secret Life of Socks in the Dryer

I finally discovered where all my missing socks go after the dryer. Turns out they're not missing at all—they've just eloped with someone else's socks from the laundromat to start new lives together.

My blue argyle is now living in Bermuda with a red polka dot, posting vacation photos on Sockstagram and sending me lint as alimony.
```

### 2. 识别检查点

```python
# The states are returned in reverse chronological order.
states = list(graph.get_state_history(config))

for state in states:
    print(state.next)
    print(state.config["configurable"]["checkpoint_id"])
    print()
```

**输出：**

```
()
1f02ac4a-ec9f-6524-8002-8f7b0bbeed0e

('write_joke',)
1f02ac4a-ce2a-6494-8001-cb2e2d651227

('generate_topic',)
1f02ac4a-a4e0-630d-8000-b73c254ba748

('__start__',)
1f02ac4a-a4dd-665e-bfff-e6c8c44315d9
```

```python
# This is the state before last (states are listed in chronological order)
selected_state = states[1]
print(selected_state.next)
print(selected_state.values)
```

**输出：**

```
('write_joke',)
{'topic': 'How about "The Secret Life of Socks in the Dryer"? You know, exploring the mysterious phenomenon of how socks go into the laundry as pairs but come out as singles. Where do they go? Are they starting new lives elsewhere? Is there a sock paradise we don\\'t know about? There\\'s a lot of comedic potential in the everyday mystery that unites us all!'}
```

<a id="optional"></a>
### 3. 更新状态

<a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.update_state" target="_blank" rel="noreferrer" class="link"><code>update_state</code></a> 将创建一个新的检查点。新的检查点将与同一个线程关联，但具有新的检查点 ID。

```python
new_config = graph.update_state(selected_state.config, values={"topic": "chickens"})
print(new_config)
```

**输出：**

```
{'configurable': {'thread_id': 'c62e2e03-c27b-4cb6-8cea-ea9bfedae006', 'checkpoint_ns': '', 'checkpoint_id': '1f02ac4a-ecee-600b-8002-a1d21df32e4c'}}
```

### 4. 从检查点恢复执行

```python
graph.invoke(None, new_config)
```

**输出：**

```python
{'topic': 'chickens',
 'joke': 'Why did the chicken join a band?\n\nBecause it had excellent drumsticks!'}
```

