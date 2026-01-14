---
title: 短期记忆 (Short-term memory)
---

## 概述 (Overview)

记忆（Memory）是一个能够记住先前交互信息的系统。对于 AI 智能体（Agent）而言，记忆至关重要，因为它能让智能体记住之前的交互、从反馈中学习并适应用户偏好。随着智能体处理涉及大量用户交互的复杂任务，这种能力对于效率和用户满意度都变得至关重要。

短期记忆（Short-term memory）让你的应用程序能够记住单个线程（Thread）或对话中的先前交互。

<Note>

线程（Thread）在一个会话中组织多次交互，类似于电子邮件将消息分组到单个对话中的方式。

</Note>

对话历史（Conversation history）是最常见的短期记忆形式。长对话对当今的 LLM 构成了挑战；完整的历史记录可能无法放入 LLM 的上下文窗口（Context Window），从而导致上下文丢失或错误。

即使你的模型支持完整的上下文长度，大多数 LLM 在处理长上下文时表现仍然不佳。它们会被过时或离题的内容“分散注意力”，同时还会遭受响应时间变慢和成本更高的困扰。

聊天模型使用[消息（Messages）](/oss/python/langchain/messages)来接受上下文，这些消息包括指令（系统消息）和输入（人类消息）。在聊天应用中，消息在人类输入和模型响应之间交替，导致消息列表随时间推移而变长。由于上下文窗口有限，许多应用可以通过使用技术来移除或“遗忘”过时信息而受益。

## 使用方法 (Usage)

要为智能体添加短期记忆（线程级持久化），你需要在创建智能体时指定一个 `checkpointer`。

<Info>

LangChain 的智能体将短期记忆作为智能体状态（State）的一部分进行管理。

通过将这些信息存储在图（Graph）的状态中，智能体可以访问给定对话的完整上下文，同时保持不同线程之间的隔离。

状态通过检查点（Checkpointer）持久化到数据库（或内存）中，因此线程可以在任何时候恢复。

短期记忆在智能体被调用或步骤（如工具调用）完成时更新，状态在每个步骤开始时被读取。

</Info>

```python
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver  # [!code highlight]

agent = create_agent(
    "gpt-5",
    # tools 也可以是空列表 []
    tools=[get_user_info],
    checkpointer=InMemorySaver(),  # [!code highlight]
)

agent.invoke(
    {"messages": [{"role": "user", "content": "你好！我叫小明。"}]},
    {"configurable": {"thread_id": "1"}},  # [!code highlight]
)
```

### 在生产环境中 (In production)

在生产环境中，使用由数据库支持的检查点（Checkpointer）：

```shell
pip install langgraph-checkpoint-postgres
```

```python
from langchain.agents import create_agent

from langgraph.checkpoint.postgres import PostgresSaver  # [!code highlight]

DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable"
with PostgresSaver.from_conn_string(DB_URI) as checkpointer:
    checkpointer.setup() # 在 PostgreSQL 中自动创建表
    agent = create_agent(
        "gpt-5",
        tools=[get_user_info],
        checkpointer=checkpointer,  # [!code highlight]
    )
```

## 自定义智能体记忆 (Customizing agent memory)

默认情况下，智能体使用 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState" target="_blank" rel="noreferrer" class="link"><code>AgentState</code></a> 来管理短期记忆，特别是通过 `messages` 键管理对话历史。

你可以扩展 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState" target="_blank" rel="noreferrer" class="link"><code>AgentState</code></a> 来添加额外的字段。自定义状态模式（State Schema）通过 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema" target="_blank" rel="noreferrer" class="link"><code>state_schema</code></a> 参数传递给 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a>。

```python
from langchain.agents import create_agent, AgentState
from langgraph.checkpoint.memory import InMemorySaver

class CustomAgentState(AgentState):  # [!code highlight]
    user_id: str  # [!code highlight]
    preferences: dict  # [!code highlight]

agent = create_agent(
    "gpt-5",
    tools=[get_user_info],
    state_schema=CustomAgentState,  # [!code highlight]
    checkpointer=InMemorySaver(),
)

# 可以在 invoke 时传入自定义状态
result = agent.invoke(
    {
        "messages": [{"role": "user", "content": "你好"}],
        "user_id": "user_123",  # [!code highlight]
        "preferences": {"theme": "dark"}  # [!code highlight]
    },
    {"configurable": {"thread_id": "1"}})
```

## 常见模式 (Common patterns)

启用[短期记忆](#add-short-term-memory)后，长对话可能会超出 LLM 的上下文窗口。常见的解决方案有：

<CardGroup :cols="2">

<Card title="修剪消息" icon="scissors" href="#trim-messages" arrow>

在调用 LLM 之前移除前 N 条或最后 N 条消息

</Card>

<Card title="删除消息" icon="trash" href="#delete-messages" arrow>

从 LangGraph 状态中永久删除消息

</Card>

<Card title="总结消息" icon="layer-group" href="#summarize-messages" arrow>

总结历史中较早的消息，并用摘要内容替换它们

</Card>

<Card title="自定义策略" icon="gears">

自定义策略（例如：消息过滤等）

</Card>

</CardGroup>

这使得智能体能够跟踪对话，而不会超出 LLM 的上下文窗口。

### 修剪消息 (Trim messages)

大多数 LLM 都有最大支持的上下文窗口（以 Token 为计量单位）。

决定何时截断消息的一种方法是计算消息历史中的 Token 数量，并在接近限制时启动截断。如果你使用 LangChain，可以使用修剪消息工具，并指定要从列表中保留的 Token 数量，以及用于处理边界的 `strategy`（例如：保留最后 `max_tokens` 个 Token）。

要在智能体中修剪消息历史，请使用 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.before_model" target="_blank" rel="noreferrer" class="link"><code>@before_model</code></a> 中间件装饰器：

```python
from langchain.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import before_model
from langgraph.runtime import Runtime
from langchain_core.runnables import RunnableConfig
from typing import Any

@before_model
def trim_messages(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    """仅保留最后几条消息以适应上下文窗口。"""
    messages = state["messages"]

    if len(messages) <= 3:
        return None  # 无需更改

    first_msg = messages[0]
    recent_messages = messages[-3:] if len(messages) % 2 == 0 else messages[-4:]
    new_messages = [first_msg] + recent_messages

    return {
        "messages": [
            RemoveMessage(id=REMOVE_ALL_MESSAGES),
            *new_messages
        ]
    }

agent = create_agent(
    your_model_here,
    tools=your_tools_here,
    middleware=[trim_messages],
    checkpointer=InMemorySaver(),
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}

agent.invoke({"messages": "你好，我叫小明"}, config)
agent.invoke({"messages": "写一首关于猫的短诗"}, config)
agent.invoke({"messages": "现在也为狗写一首"}, config)
final_response = agent.invoke({"messages": "我叫什么名字？"}, config)

final_response["messages"][-1].pretty_print()
"""
================================== Ai Message ==================================

你叫小明。你早些时候告诉过我。
如果你想让我用昵称或其他名字称呼你，尽管开口。
"""
```

### 删除消息 (Delete messages)

你可以从图（Graph）状态中删除消息来管理对话历史。

当你想要移除特定消息或清除整个消息历史时，这非常有用。

要从图状态中删除消息，你可以使用 `RemoveMessage`。

为了让 `RemoveMessage` 生效，你需要使用带有 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.message.add_messages" target="_blank" rel="noreferrer" class="link"><code>add_messages</code></a> [归约器（Reducer）](/oss/python/langgraph/graph-api#reducers)的状态键。

默认的 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState" target="_blank" rel="noreferrer" class="link"><code>AgentState</code></a> 已经提供了此功能。

要移除特定消息：

```python
from langchain.messages import RemoveMessage  # [!code highlight]

def delete_messages(state):
    messages = state["messages"]
    if len(messages) > 2:
        # 移除最早的两条消息
        return {"messages": [RemoveMessage(id=m.id) for m in messages[:2]]}  # [!code highlight]
```

要移除**所有**消息：

```python
from langgraph.graph.message import REMOVE_ALL_MESSAGES  # [!code highlight]

def delete_messages(state):
    return {"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)]}  # [!code highlight]
```

<Warning>

删除消息时，<strong>务必确保</strong>生成的消息历史记录是有效的。请检查你所使用的 LLM 提供商的限制。例如：

* 某些提供商要求消息历史必须以 `user` 消息开始。
* 大多数提供商要求带有工具调用的 `assistant` 消息后面必须紧跟相应的 `tool` 结果消息。

</Warning>

```python
from langchain.messages import RemoveMessage
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import after_model
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.runtime import Runtime
from langchain_core.runnables import RunnableConfig

@after_model
def delete_old_messages(state: AgentState, runtime: Runtime) -> dict | None:
    """移除旧消息以保持对话的可管理性。"""
    messages = state["messages"]
    if len(messages) > 2:
        # 移除最早的两条消息
        return {"messages": [RemoveMessage(id=m.id) for m in messages[:2]]}
    return None

agent = create_agent(
    "gpt-5-nano",
    tools=[],
    system_prompt="请简明扼要，直达重点。",
    middleware=[delete_old_messages],
    checkpointer=InMemorySaver(),
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}

for event in agent.stream(
    {"messages": [{"role": "user", "content": "你好！我叫小明"}]},
    config,
    stream_mode="values",
):
    print([(message.type, message.content) for message in event["messages"]])

for event in agent.stream(
    {"messages": [{"role": "user", "content": "我叫什么名字？"}]},
    config,
    stream_mode="values",
):
    print([(message.type, message.content) for message in event["messages"]])
```

```
[('human', "hi! I'm bob")]
[('human', "hi! I'm bob"), ('ai', 'Hi Bob! Nice to meet you. How can I help you today? I can answer questions, brainstorm ideas, draft text, explain things, or help with code.')]
[('human', "hi! I'm bob"), ('ai', 'Hi Bob! Nice to meet you. How can I help you today? I can answer questions, brainstorm ideas, draft text, explain things, or help with code.'), ('human', "what's my name?")]
[('human', "hi! I'm bob"), ('ai', 'Hi Bob! Nice to meet you. How can I help you today? I can answer questions, brainstorm ideas, draft text, explain things, or help with code.'), ('human', "what's my name?"), ('ai', 'Your name is Bob. How can I help you today, Bob?')]
[('human', "what's my name?"), ('ai', 'Your name is Bob. How can I help you today, Bob?')]
```

### 总结消息 (Summarize messages)

如上所述，修剪或删除消息的问题在于，你可能会因为剔除消息队列而丢失重要信息。
因此，某些应用程序会受益于更高级的方法：使用聊天模型对对话历史进行总结。

![总结](/oss/images/summary.png)

要总结智能体中的消息历史，请使用内置的 [``SummarizationMiddleware``](/oss/python/langchain/middleware#summarization)：

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.runnables import RunnableConfig

checkpointer = InMemorySaver()

agent = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        SummarizationMiddleware(
            model="gpt-4o-mini",
            trigger=("tokens", 4000), # 触发条件：超过 4000 个 Token
            keep=("messages", 20)      # 保留最后 20 条消息
        )
    ],
    checkpointer=checkpointer,
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}
agent.invoke({"messages": "你好，我叫小明"}, config)
agent.invoke({"messages": "写一首关于猫的短诗"}, config)
agent.invoke({"messages": "现在也为狗写一首"}, config)
final_response = agent.invoke({"messages": "我叫什么名字？"}, config)

final_response["messages"][-1].pretty_print()
"""
================================== Ai Message ==================================

你叫小明！
"""
```

有关更多配置选项，请参阅 [`SummarizationMiddleware`](/oss/python/langchain/middleware#summarization)。

## 访问记忆 (Access memory)

你可以通过多种方式访问和修改智能体的短期记忆（状态）：

### 工具 (Tools)

#### 在工具中读取短期记忆

使用 `runtime` 参数（类型为 `ToolRuntime`）在工具中访问短期记忆（状态）。

`runtime` 参数在工具签名中是隐藏的（因此模型看不见它），但工具可以通过它访问状态。

```python
from langchain.agents import create_agent, AgentState
from langchain.tools import tool, ToolRuntime

class CustomState(AgentState):
    user_id: str

@tool
def get_user_info(
    runtime: ToolRuntime
) -> str:
    """查询用户信息。"""
    user_id = runtime.state["user_id"]
    return "用户是张三" if user_id == "user_123" else "未知用户"

agent = create_agent(
    model="gpt-5-nano",
    tools=[get_user_info],
    state_schema=CustomState,
)

result = agent.invoke({
    "messages": "查询用户信息",
    "user_id": "user_123"
})
print(result["messages"][-1].content)
# > 用户是张三。
```

#### 从工具中写入短期记忆

要在执行期间修改智能体的短期记忆（状态），你可以直接从工具返回状态更新。

这对于持久化中间结果或使信息可被后续工具或提示词访问非常有用。

```python
from langchain.tools import tool, ToolRuntime
from langchain_core.runnables import RunnableConfig
from langchain.messages import ToolMessage
from langchain.agents import create_agent, AgentState
from langgraph.types import Command
from pydantic import BaseModel

class CustomState(AgentState):  # [!code highlight]
    user_name: str

class CustomContext(BaseModel):
    user_id: str

@tool
def update_user_info(
    runtime: ToolRuntime[CustomContext, CustomState],
) -> Command:
    """查询并更新用户信息。"""
    user_id = runtime.context.user_id
    name = "张三" if user_id == "user_123" else "未知用户"
    return Command(update={  # [!code highlight]
        "user_name": name,
        # 更新对话历史
        "messages": [
            ToolMessage(
                "成功查询到用户信息",
                tool_call_id=runtime.tool_call_id
            )
        ]
    })

@tool
def greet(
    runtime: ToolRuntime[CustomContext, CustomState]
) -> str | Command:
    """一旦查询到用户信息，就用它来问候用户。"""
    user_name = runtime.state.get("user_name", None)
    if user_name is None:
       return Command(update={
            "messages": [
                ToolMessage(
                    "请调用 'update_user_info' 工具，它将获取并更新用户的姓名。",
                    tool_call_id=runtime.tool_call_id
                )
            ]
        })
    return f"你好，{user_name}！"

agent = create_agent(
    model="gpt-5-nano",
    tools=[update_user_info, greet],
    state_schema=CustomState, # [!code highlight]
    context_schema=CustomContext,
)

agent.invoke(
    {"messages": [{"role": "user", "content": "问候用户"}]},
    context=CustomContext(user_id="user_123"),
)
```

### 提示词 (Prompt)

在中间件（Middleware）中访问短期记忆（状态），以便根据对话历史或自定义状态字段创建动态提示词。

```python
from langchain.agents import create_agent
from typing import TypedDict
from langchain.agents.middleware import dynamic_prompt, ModelRequest

class CustomContext(TypedDict):
    user_name: str

def get_weather(city: str) -> str:
    """获取城市的天气。"""
    return f"{city} 的天气总是晴朗的！"

@dynamic_prompt
def dynamic_system_prompt(request: ModelRequest) -> str:
    user_name = request.runtime.context["user_name"]
    system_prompt = f"你是一个得力的助手。请称呼用户为 {user_name}。"
    return system_prompt

agent = create_agent(
    model="gpt-5-nano",
    tools=[get_weather],
    middleware=[dynamic_system_prompt],
    context_schema=CustomContext,
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "旧金山的天气怎么样？"}]},
    context=CustomContext(user_name="张三"),
)
for msg in result["messages"]:
    msg.pretty_print()
```

```shell title="输出"
================================ Human Message =================================

旧金山的天气怎么样？
================================== Ai Message ==================================
Tool Calls:
  get_weather (call_WFQlOGn4b2yoJrv7cih342FG)
 Call ID: call_WFQlOGn4b2yoJrv7cih342FG
  Args:
    city: San Francisco
================================= Tool Message =================================
Name: get_weather

旧金山的天气总是晴朗的！
================================== Ai Message ==================================

你好，张三。旧金山的天气总是晴朗的！
```

### 模型调用前 (Before model)

在 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.before_model" target="_blank" rel="noreferrer" class="link"><code>@before_model</code></a> 中间件中访问短期记忆（状态），以便在模型调用之前处理消息。

```mermaid
%%{
    init: {
        "fontFamily": "monospace",
        "flowchart": {
        "curve": "basis"
        },
        "themeVariables": {"edgeLabelBackground": "transparent"}
    }
}%%
graph TD
    S(["开始 (__start__)"])
    PRE(模型调用前 before_model)
    MODEL(模型 model)
    TOOLS(工具 tools)
    END(["结束 (__end__)"])
    S --> PRE
    PRE --> MODEL
    MODEL -.-> TOOLS
    MODEL -.-> END
    TOOLS --> PRE
    classDef blueHighlight fill:#0a1c25,stroke:#0a455f,color:#bae6fd;
    class S blueHighlight;
    class END blueHighlight;
```

```python
from langchain.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import before_model
from langchain_core.runnables import RunnableConfig
from langgraph.runtime import Runtime
from typing import Any

@before_model
def trim_messages(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    """仅保留最后几条消息以适应上下文窗口。"""
    messages = state["messages"]

    if len(messages) <= 3:
        return None  # 无需更改

    first_msg = messages[0]
    recent_messages = messages[-3:] if len(messages) % 2 == 0 else messages[-4:]
    new_messages = [first_msg] + recent_messages

    return {
        "messages": [
            RemoveMessage(id=REMOVE_ALL_MESSAGES),
            *new_messages
        ]
    }

agent = create_agent(
    "gpt-5-nano",
    tools=[],
    middleware=[trim_messages],
    checkpointer=InMemorySaver()
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}

agent.invoke({"messages": "你好，我叫小明"}, config)
agent.invoke({"messages": "写一首关于猫的短诗"}, config)
agent.invoke({"messages": "现在也为狗写一首"}, config)
final_response = agent.invoke({"messages": "我叫什么名字？"}, config)

final_response["messages"][-1].pretty_print()
"""
================================== Ai Message ==================================

你叫小明。你早些时候告诉我了。
如果你想让我换个称呼或者用不同的名字，尽管开口。
"""
```

### 模型调用后 (After model)

在 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.after_model" target="_blank" rel="noreferrer" class="link"><code>@after_model</code></a> 中间件中访问短期记忆（状态），以便在模型调用之后处理消息。

```mermaid
%%{
    init: {
        "fontFamily": "monospace",
        "flowchart": {
        "curve": "basis"
        },
        "themeVariables": {"edgeLabelBackground": "transparent"}
    }
}%%
graph TD
    S(["开始 (__start__)"])
    MODEL(模型 model)
    POST(模型调用后 after_model)
    TOOLS(工具 tools)
    END(["结束 (__end__)"])
    S --> MODEL
    MODEL --> POST
    POST -.-> END
    POST -.-> TOOLS
    TOOLS --> MODEL
    classDef blueHighlight fill:#0a1c25,stroke:#0a455f,color:#bae6fd;
    class S blueHighlight;
    class END blueHighlight;
    class POST greenHighlight;
```

```python
from langchain.messages import RemoveMessage
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import after_model
from langgraph.runtime import Runtime

@after_model
def validate_response(state: AgentState, runtime: Runtime) -> dict | None:
    """移除包含敏感词的消息。"""
    STOP_WORDS = ["密码", "秘密"]
    last_message = state["messages"][-1]
    if any(word in last_message.content for word in STOP_WORDS):
        return {"messages": [RemoveMessage(id=last_message.id)]}
    return None

agent = create_agent(
    model="gpt-5-nano",
    tools=[],
    middleware=[validate_response],
    checkpointer=InMemorySaver(),
)
```

