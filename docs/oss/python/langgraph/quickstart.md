---
title: 快速入门 (Quickstart)
---

本快速入门演示了如何使用 LangGraph 的 Graph API 或 Functional API 构建一个计算器智能体。

- 如果您倾向于将智能体定义为节点和边的图，请[使用 Graph API](#use-the-graph-api)。
- 如果您倾向于将智能体定义为单个函数，请[使用 Functional API](#use-the-functional-api)。

有关概念性信息，请参阅 [Graph API 概述](/oss/python/langgraph/graph-api) 和 [Functional API 概述](/oss/python/langgraph/functional-api)。

<Info>

对于此示例，您需要设置一个 [Claude (Anthropic)](https://www.anthropic.com/) 账户并获取 API 密钥。然后，在您的终端中设置 `ANTHROPIC_API_KEY` 环境变量。

</Info>

<Tabs>

<Tab title="使用 Graph API (Use the Graph API)">

## 1. 定义工具和模型 (Define tools and model)

在此示例中，我们将使用 Claude Sonnet 4.5 模型，并定义用于加法、乘法和除法的工具。

```python
from langchain.tools import tool
from langchain.chat_models import init_chat_model

model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    temperature=0
)

# 定义工具
@tool
def multiply(a: int, b: int) -> int:
    """将 `a` 和 `b` 相乘。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a * b

@tool
def add(a: int, b: int) -> int:
    """将 `a` 和 `b` 相加。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a + b

@tool
def divide(a: int, b: int) -> float:
    """将 `a` 除以 `b`。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a / b

# 为 LLM 绑定工具
tools = [add, multiply, divide]
tools_by_name = {tool.name: tool for tool in tools}
model_with_tools = model.bind_tools(tools)
```

## 2. 定义状态 (Define state)

图的状态用于存储消息和 LLM 调用次数。

<Tip>

LangGraph 中的状态在智能体执行期间持续存在。

使用 `operator.add` 的 `Annotated` 类型确保新消息被追加到现有列表中，而不是替换它。

</Tip>

```python
from langchain.messages import AnyMessage
from typing_extensions import TypedDict, Annotated
import operator

class MessagesState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    llm_calls: int
```

## 3. 定义模型节点 (Define model node)

模型节点用于调用 LLM 并决定是否调用工具。

```python
from langchain.messages import SystemMessage

def llm_call(state: dict):
    """LLM 决定是否调用工具"""

    return {
        "messages": [
            model_with_tools.invoke(
                [
                    SystemMessage(
                        content="You are a helpful assistant tasked with performing arithmetic on a set of inputs."
                    )
                ]
                + state["messages"]
            )
        ],
        "llm_calls": state.get('llm_calls', 0) + 1
    }
```

## 4. 定义工具节点 (Define tool node)

工具节点用于调用工具并返回结果。

```python
from langchain.messages import ToolMessage

def tool_node(state: dict):
    """执行工具调用"""

    result = []
    for tool_call in state["messages"][-1].tool_calls:
        tool = tools_by_name[tool_call["name"]]
        observation = tool.invoke(tool_call["args"])
        result.append(ToolMessage(content=observation, tool_call_id=tool_call["id"]))
    return {"messages": result}
```

## 5. 定义结束逻辑 (Define end logic)

条件边函数用于根据 LLM 是否进行了工具调用来路由到工具节点或结束。

```python
from typing import Literal
from langgraph.graph import StateGraph, START, END

def should_continue(state: MessagesState) -> Literal["tool_node", END]:
    """根据 LLM 是否进行了工具调用来决定是继续循环还是停止"""

    messages = state["messages"]
    last_message = messages[-1]

    # 如果 LLM 进行了工具调用，则执行操作
    if last_message.tool_calls:
        return "tool_node"

    # 否则，我们停止（回复用户）
    return END
```

## 6. 构建并编译智能体 (Build and compile the agent)

智能体使用 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 类构建，并使用 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph.compile" target="_blank" rel="noreferrer" class="link"><code>compile</code></a> 方法编译。

```python
# 构建工作流
agent_builder = StateGraph(MessagesState)

# 添加节点
agent_builder.add_node("llm_call", llm_call)
agent_builder.add_node("tool_node", tool_node)

# 添加边以连接节点
agent_builder.add_edge(START, "llm_call")
agent_builder.add_conditional_edges(
    "llm_call",
    should_continue,
    ["tool_node", END]
)
agent_builder.add_edge("tool_node", "llm_call")

# 编译智能体
agent = agent_builder.compile()

# 显示智能体
from IPython.display import Image, display
display(Image(agent.get_graph(xray=True).draw_mermaid_png()))

# 调用
from langchain.messages import HumanMessage
messages = [HumanMessage(content="Add 3 and 4.")]
messages = agent.invoke({"messages": messages})
for m in messages["messages"]:
    m.pretty_print()
```

<Tip>

要了解如何使用 LangSmith 追踪您的智能体，请参阅 [LangSmith 文档](/langsmith/trace-with-langgraph)。

</Tip>

恭喜！您已使用 LangGraph Graph API 构建了您的第一个智能体。

:::: details 完整代码示例 (Full code example)

```python
# 步骤 1: 定义工具和模型

from langchain.tools import tool
from langchain.chat_models import init_chat_model

model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    temperature=0
)

# 定义工具
@tool
def multiply(a: int, b: int) -> int:
    """将 `a` 和 `b` 相乘。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a * b

@tool
def add(a: int, b: int) -> int:
    """将 `a` 和 `b` 相加。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a + b

@tool
def divide(a: int, b: int) -> float:
    """将 `a` 除以 `b`。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a / b

# 为 LLM 绑定工具
tools = [add, multiply, divide]
tools_by_name = {tool.name: tool for tool in tools}
model_with_tools = model.bind_tools(tools)

# 步骤 2: 定义状态

from langchain.messages import AnyMessage
from typing_extensions import TypedDict, Annotated
import operator

class MessagesState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    llm_calls: int

# 步骤 3: 定义模型节点
from langchain.messages import SystemMessage

def llm_call(state: dict):
    """LLM 决定是否调用工具"""

    return {
        "messages": [
            model_with_tools.invoke(
                [
                    SystemMessage(
                        content="You are a helpful assistant tasked with performing arithmetic on a set of inputs."
                    )
                ]
                + state["messages"]
            )
        ],
        "llm_calls": state.get('llm_calls', 0) + 1
    }

# 步骤 4: 定义工具节点

from langchain.messages import ToolMessage

def tool_node(state: dict):
    """执行工具调用"""

    result = []
    for tool_call in state["messages"][-1].tool_calls:
        tool = tools_by_name[tool_call["name"]]
        observation = tool.invoke(tool_call["args"])
        result.append(ToolMessage(content=observation, tool_call_id=tool_call["id"]))
    return {"messages": result}

# 步骤 5: 定义决定是否结束的逻辑

from typing import Literal
from langgraph.graph import StateGraph, START, END

# 条件边函数，根据 LLM 是否进行了工具调用来路由到工具节点或结束
def should_continue(state: MessagesState) -> Literal["tool_node", END]:
    """根据 LLM 是否进行了工具调用来决定是继续循环还是停止"""

    messages = state["messages"]
    last_message = messages[-1]

    # 如果 LLM 进行了工具调用，则执行操作
    if last_message.tool_calls:
        return "tool_node"

    # 否则，我们停止（回复用户）
    return END

# 步骤 6: 构建智能体

# 构建工作流
agent_builder = StateGraph(MessagesState)

# 添加节点
agent_builder.add_node("llm_call", llm_call)
agent_builder.add_node("tool_node", tool_node)

# 添加边以连接节点
agent_builder.add_edge(START, "llm_call")
agent_builder.add_conditional_edges(
    "llm_call",
    should_continue,
    ["tool_node", END]
)
agent_builder.add_edge("tool_node", "llm_call")

# 编译智能体
agent = agent_builder.compile()

from IPython.display import Image, display
# 显示智能体
display(Image(agent.get_graph(xray=True).draw_mermaid_png()))

# 调用
from langchain.messages import HumanMessage
messages = [HumanMessage(content="Add 3 and 4.")]
messages = agent.invoke({"messages": messages})
for m in messages["messages"]:
    m.pretty_print()
```

::::

</Tab>

<Tab title="使用 Functional API (Use the Functional API)">

## 1. 定义工具和模型 (Define tools and model)

在此示例中，我们将使用 Claude Sonnet 4.5 模型，并定义用于加法、乘法和除法的工具。

```python
from langchain.tools import tool
from langchain.chat_models import init_chat_model

model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    temperature=0
)

# 定义工具
@tool
def multiply(a: int, b: int) -> int:
    """将 `a` 和 `b` 相乘。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a * b

@tool
def add(a: int, b: int) -> int:
    """将 `a` 和 `b` 相加。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a + b

@tool
def divide(a: int, b: int) -> float:
    """将 `a` 除以 `b`。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a / b

# 为 LLM 绑定工具
tools = [add, multiply, divide]
tools_by_name = {tool.name: tool for tool in tools}
model_with_tools = model.bind_tools(tools)

from langgraph.graph import add_messages
from langchain.messages import (
    SystemMessage,
    HumanMessage,
    ToolCall,
)
from langchain_core.messages import BaseMessage
from langgraph.func import entrypoint, task
```

## 2. 定义模型节点 (Define model node)

模型节点用于调用 LLM 并决定是否调用工具。

<Tip>

<a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.task" target="_blank" rel="noreferrer" class="link"><code>@task</code></a> 装饰器将函数标记为可以作为智能体一部分执行的任务。任务可以在您的入口点函数中同步或异步调用。

</Tip>

```python
@task
def call_llm(messages: list[BaseMessage]):
    """LLM 决定是否调用工具"""
    return model_with_tools.invoke(
        [
            SystemMessage(
                content="You are a helpful assistant tasked with performing arithmetic on a set of inputs."
            )
        ]
        + messages
    )
```

## 3. 定义工具节点 (Define tool node)

工具节点用于调用工具并返回结果。

```python
@task
def call_tool(tool_call: ToolCall):
    """执行工具调用"""
    tool = tools_by_name[tool_call["name"]]
    return tool.invoke(tool_call)
```

## 4. 定义智能体 (Define agent)

智能体使用 <a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint" target="_blank" rel="noreferrer" class="link"><code>@entrypoint</code></a> 函数构建。

<Note>

在 Functional API 中，您不需要显式定义节点和边，而是在单个函数内编写标准控制流逻辑（循环、条件）。

</Note>

```python
@entrypoint()
def agent(messages: list[BaseMessage]):
    model_response = call_llm(messages).result()

    while True:
        if not model_response.tool_calls:
            break

        # 执行工具
        tool_result_futures = [
            call_tool(tool_call) for tool_call in model_response.tool_calls
        ]
        tool_results = [fut.result() for fut in tool_result_futures]
        messages = add_messages(messages, [model_response, *tool_results])
        model_response = call_llm(messages).result()

    messages = add_messages(messages, model_response)
    return messages

# 调用
messages = [HumanMessage(content="Add 3 and 4.")]
for chunk in agent.stream(messages, stream_mode="updates"):
    print(chunk)
    print("\n")
```

<Tip>

要了解如何使用 LangSmith 追踪您的智能体，请参阅 [LangSmith 文档](/langsmith/trace-with-langgraph)。

</Tip>

恭喜！您已使用 LangGraph Functional API 构建了您的第一个智能体。

:::: details <Icon icon="code" style="margin-right: 8px; vertical-align: middle;" /> 完整代码示例 (Full code example)

```python
# 步骤 1: 定义工具和模型

from langchain.tools import tool
from langchain.chat_models import init_chat_model

model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    temperature=0
)

# 定义工具
@tool
def multiply(a: int, b: int) -> int:
    """将 `a` 和 `b` 相乘。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a * b

@tool
def add(a: int, b: int) -> int:
    """将 `a` 和 `b` 相加。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a + b

@tool
def divide(a: int, b: int) -> float:
    """将 `a` 除以 `b`。

    参数：
        a: 第一个整数
        b: 第二个整数
    """
    return a / b

# 为 LLM 绑定工具
tools = [add, multiply, divide]
tools_by_name = {tool.name: tool for tool in tools}
model_with_tools = model.bind_tools(tools)

from langgraph.graph import add_messages
from langchain.messages import (
    SystemMessage,
    HumanMessage,
    ToolCall,
)
from langchain_core.messages import BaseMessage
from langgraph.func import entrypoint, task

# 步骤 2: 定义模型节点

@task
def call_llm(messages: list[BaseMessage]):
    """LLM 决定是否调用工具"""
    return model_with_tools.invoke(
        [
            SystemMessage(
                content="You are a helpful assistant tasked with performing arithmetic on a set of inputs."
            )
        ]
        + messages
    )

# 步骤 3: 定义工具节点

@task
def call_tool(tool_call: ToolCall):
    """执行工具调用"""
    tool = tools_by_name[tool_call["name"]]
    return tool.invoke(tool_call)

# 步骤 4: 定义智能体

@entrypoint()
def agent(messages: list[BaseMessage]):
    model_response = call_llm(messages).result()

    while True:
        if not model_response.tool_calls:
            break

        # 执行工具
        tool_result_futures = [
            call_tool(tool_call) for tool_call in model_response.tool_calls
        ]
        tool_results = [fut.result() for fut in tool_result_futures]
        messages = add_messages(messages, [model_response, *tool_results])
        model_response = call_llm(messages).result()

    messages = add_messages(messages, model_response)
    return messages

# 调用
messages = [HumanMessage(content="Add 3 and 4.")]
for chunk in agent.stream(messages, stream_mode="updates"):
    print(chunk)
    print("\n")
```

::::

</Tab>

</Tabs>

