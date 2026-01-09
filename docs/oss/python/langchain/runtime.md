---
title: 运行时
---
## 概述

LangChain 的 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 底层运行在 LangGraph 的运行时上。

LangGraph 暴露了一个 <a href="https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime" target="_blank" rel="noreferrer" class="link"><code>Runtime</code></a> 对象，包含以下信息：

1.  **上下文**：静态信息，例如用户 ID、数据库连接或代理调用所需的其他依赖项。
2.  **存储**：一个 <a href="https://reference.langchain.com/python/langsmith/deployment/remote_graph/" target="_blank" rel="noreferrer" class="link">BaseStore</a> 实例，用于[长期记忆](/oss/langchain/long-term-memory)。
3.  **流写入器**：一个用于通过 `"custom"` 流模式流式传输信息的对象。

<Tip>

运行时上下文为你的工具和中间件提供了<strong>依赖注入</strong>。你可以在调用代理时注入运行时依赖项（如数据库连接、用户 ID 或配置），而不是硬编码值或使用全局状态。这使你的工具更具可测试性、可重用性和灵活性。

</Tip>

你可以在[工具内部](#inside-tools)和[中间件内部](#inside-middleware)访问运行时信息。

## 访问

使用 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 创建代理时，你可以指定一个 `context_schema` 来定义存储在代理 <a href="https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime" target="_blank" rel="noreferrer" class="link"><code>Runtime</code></a> 中的 `context` 的结构。

调用代理时，传递包含该次运行相关配置的 `context` 参数：

```python
from dataclasses import dataclass

from langchain.agents import create_agent

@dataclass
class Context:
    user_name: str

agent = create_agent(
    model="gpt-5-nano",
    tools=[...],
    context_schema=Context  # [!code highlight]
)

agent.invoke(
    {"messages": [{"role": "user", "content": "What's my name?"}]},
    context=Context(user_name="John Smith")  # [!code highlight]
)
```

### 在工具内部

你可以在工具内部访问运行时信息，以便：

*   访问上下文
*   读取或写入长期记忆
*   写入[自定义流](/oss/langchain/streaming#custom-updates)（例如，工具进度/更新）

使用 `ToolRuntime` 参数在工具内部访问 <a href="https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime" target="_blank" rel="noreferrer" class="link"><code>Runtime</code></a> 对象。

```python
from dataclasses import dataclass
from langchain.tools import tool, ToolRuntime  # [!code highlight]

@dataclass
class Context:
    user_id: str

@tool
def fetch_user_email_preferences(runtime: ToolRuntime[Context]) -> str:  # [!code highlight]
    """从存储中获取用户的电子邮件偏好设置。"""
    user_id = runtime.context.user_id  # [!code highlight]

    preferences: str = "The user prefers you to write a brief and polite email."
    if runtime.store:  # [!code highlight]
        if memory := runtime.store.get(("users",), user_id):  # [!code highlight]
            preferences = memory.value["preferences"]

    return preferences
```

### 在中间件内部

你可以在中间件中访问运行时信息，以创建动态提示、修改消息或根据用户上下文控制代理行为。

使用 `request.runtime` 在中间件装饰器内部访问 <a href="https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime" target="_blank" rel="noreferrer" class="link"><code>Runtime</code></a> 对象。运行时对象在传递给中间件函数的 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelRequest" target="_blank" rel="noreferrer" class="link"><code>ModelRequest</code></a> 参数中可用。

```python
from dataclasses import dataclass

from langchain.messages import AnyMessage
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import dynamic_prompt, ModelRequest, before_model, after_model
from langgraph.runtime import Runtime

@dataclass
class Context:
    user_name: str

# 动态提示
@dynamic_prompt
def dynamic_system_prompt(request: ModelRequest) -> str:
    user_name = request.runtime.context.user_name  # [!code highlight]
    system_prompt = f"You are a helpful assistant. Address the user as {user_name}."
    return system_prompt

# 模型前钩子
@before_model
def log_before_model(state: AgentState, runtime: Runtime[Context]) -> dict | None:  # [!code highlight]
    print(f"Processing request for user: {runtime.context.user_name}")  # [!code highlight]
    return None

# 模型后钩子
@after_model
def log_after_model(state: AgentState, runtime: Runtime[Context]) -> dict | None:  # [!code highlight]
    print(f"Completed request for user: {runtime.context.user_name}")  # [!code highlight]
    return None

agent = create_agent(
    model="gpt-5-nano",
    tools=[...],
    middleware=[dynamic_system_prompt, log_before_model, log_after_model],  # [!code highlight]
    context_schema=Context
)

agent.invoke(
    {"messages": [{"role": "user", "content": "What's my name?"}]},
    context=Context(user_name="John Smith")
)
```

