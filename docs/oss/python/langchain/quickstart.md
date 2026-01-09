---
title: 快速入门 (Quickstart)
---

本快速入门将引导您在几分钟内从简单的设置到构建一个功能完整的 AI 智能体（agent）。

<Tip>

<strong>LangChain 文档 MCP 服务器</strong>

如果您正在使用 AI 编程助手或 IDE（例如 Claude Code 或 Cursor），您应该安装 [LangChain Docs MCP 服务器](/use-these-docs) 以充分利用它。这能确保您的智能体可以访问最新的 LangChain 文档和示例。

</Tip>

## 要求 (Requirements)

要运行这些示例，您需要：

* [安装 (Install)](/oss/langchain/install) LangChain 包
* 设置 [Claude (Anthropic)](https://www.anthropic.com/) 账户并获取 API 密钥
* 在您的终端中设置 `ANTHROPIC_API_KEY` 环境变量

虽然这些示例使用 Claude，但您也可以通过更改代码中的模型名称并设置相应的 API 密钥来使用[任何支持的模型](/oss/integrations/providers/overview)。

## 构建基础智能体 (Build a basic agent)

首先创建一个可以回答问题并调用工具的简单智能体。该智能体将使用 Claude Sonnet 4.5 作为其语言模型，一个基础的天气函数作为工具，以及一个简单的提示词来指导其行为。

```python
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """获取指定城市的天气。"""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

# 运行智能体
agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]}
)
```

<Tip>

要了解如何使用 LangSmith 追踪您的智能体，请参阅 [LangSmith 文档](/langsmith/trace-with-langchain)。

</Tip>

## 构建真实世界的智能体 (Build a real-world agent)

接下来，构建一个实用的天气预报智能体，演示关键的生产级概念：

1. **详细的系统提示词 (Detailed system prompts)** 以获得更好的智能体行为
2. **创建工具 (Create tools)** 以集成外部数据
3. **模型配置 (Model configuration)** 以获得一致的响应
4. **结构化输出 (Structured output)** 以获得可预测的结果
5. **对话记忆 (Conversational memory)** 以实现类似聊天的交互
6. **创建并运行智能体 (Create and run the agent)** 构建一个功能完整的智能体

让我们逐步完成每个步骤：

<Steps>

<Step title="定义系统提示词 (Define the system prompt)">

系统提示词定义了智能体的角色和行为。请保持其具体且具可操作性：

```python [wrap]
SYSTEM_PROMPT = """You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location."""
```

</Step>

<Step title="创建工具 (Create tools)">

[工具 (Tools)](/oss/langchain/tools) 允许模型通过调用您定义的函数与外部系统交互。
工具可以依赖[运行时上下文 (runtime context)](/oss/langchain/runtime)，也可以与[智能体记忆 (agent memory)](/oss/langchain/short-term-memory)交互。

请注意下方 `get_user_location` 工具如何使用运行时上下文：

```python
from dataclasses import dataclass
from langchain.tools import tool, ToolRuntime

@tool
def get_weather_for_location(city: str) -> str:
    """获取指定城市的天气。"""
    return f"It's always sunny in {city}!"

@dataclass
class Context:
    """自定义运行时上下文模式。"""
    user_id: str

@tool
def get_user_location(runtime: ToolRuntime[Context]) -> str:
    """根据用户 ID 检索用户信息。"""
    user_id = runtime.context.user_id
    return "Florida" if user_id == "1" else "SF"
```

<Tip>

工具应该有良好的文档记录：它们的名称、描述和参数名称会成为模型提示词的一部分。
LangChain 的 @[`@tool` 装饰器][@tool] 添加了元数据，并通过 `ToolRuntime` 参数启用了运行时注入。

</Tip>

</Step>

<Step title="配置模型 (Configure your model)">

根据您的用例，使用正确的参数设置您的[语言模型 (language model)](/oss/langchain/models)：

```python
from langchain.chat_models import init_chat_model

model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    temperature=0.5,
    timeout=10,
    max_tokens=1000
)
```

根据所选模型和提供商的不同，初始化参数可能会有所不同；请参阅其参考页面以获取详细信息。

</Step>

<Step title="定义响应格式 (Define response format)">

可选地，如果您需要智能体的响应符合特定的模式，可以定义结构化响应格式。

```python
from dataclasses import dataclass

# 我们在这里使用 dataclass，但也支持 Pydantic 模型。
@dataclass
class ResponseFormat:
    """智能体的响应模式。"""
    # 幽默的回答（必填）
    punny_response: str
    # 如果可用，提供有关天气的任何有趣信息
    weather_conditions: str | None = None
```

</Step>

<Step title="添加记忆 (Add memory)">

为您的智能体添加[记忆 (memory)](/oss/langchain/short-term-memory)，以在多次交互之间保持状态。这允许智能体记住之前的对话和上下文。

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
```

<Info>

在生产环境中，请使用将数据保存到数据库的持久化检查点加载器。详见[添加和管理记忆](/oss/langgraph/add-memory#manage-short-term-memory)。

</Info>

</Step>

<Step title="创建并运行智能体 (Create and run the agent)">

现在，用所有的组件组装您的智能体并运行它！

```python
from langchain.agents.structured_output import ToolStrategy

agent = create_agent(
    model=model,
    system_prompt=SYSTEM_PROMPT,
    tools=[get_user_location, get_weather_for_location],
    context_schema=Context,
    response_format=ToolStrategy(ResponseFormat),
    checkpointer=checkpointer
)

# `thread_id` 是给定对话的唯一标识符。
config = {"configurable": {"thread_id": "1"}}

response = agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather outside?"}]},
    config=config,
    context=Context(user_id="1")
)

print(response['structured_response'])
# ResponseFormat(
#     punny_response="Florida is still having a 'sun-derful' day! ...",
#     weather_conditions="It's always sunny in Florida!"
# )

# 请注意，我们可以使用相同的 `thread_id` 继续对话。
response = agent.invoke(
    {"messages": [{"role": "user", "content": "thank you!"}]},
    config=config,
    context=Context(user_id="1")
)

print(response['structured_response'])
# ResponseFormat(
#     punny_response="You're 'thund-erfully' welcome! ...",
#     weather_conditions=None
# )
```

</Step>

</Steps>

<Expandable title="完整示例代码 (Full example code)">

```python
from dataclasses import dataclass

from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain.tools import tool, ToolRuntime
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents.structured_output import ToolStrategy

# 定义系统提示词
SYSTEM_PROMPT = """You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location."""

# 定义上下文模式
@dataclass
class Context:
    """自定义运行时上下文模式。"""
    user_id: str

# 定义工具
@tool
def get_weather_for_location(city: str) -> str:
    """获取指定城市的天气。"""
    return f"It's always sunny in {city}!"

@tool
def get_user_location(runtime: ToolRuntime[Context]) -> str:
    """根据用户 ID 检索用户信息。"""
    user_id = runtime.context.user_id
    return "Florida" if user_id == "1" else "SF"

# 配置模型
model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    temperature=0
)

# 定义响应格式
@dataclass
class ResponseFormat:
    """智能体的响应模式。"""
    # 幽默的回答（必填）
    punny_response: str
    # 如果可用，提供有关天气的任何有趣信息
    weather_conditions: str | None = None

# 设置记忆
checkpointer = InMemorySaver()

# 创建智能体
agent = create_agent(
    model=model,
    system_prompt=SYSTEM_PROMPT,
    tools=[get_user_location, get_weather_for_location],
    context_schema=Context,
    response_format=ToolStrategy(ResponseFormat),
    checkpointer=checkpointer
)

# 运行智能体
# `thread_id` 是给定对话的唯一标识符。
config = {"configurable": {"thread_id": "1"}}

response = agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather outside?"}]},
    config=config,
    context=Context(user_id="1")
)

print(response['structured_response'])

# 请注意，我们可以使用相同的 `thread_id` 继续对话。
response = agent.invoke(
    {"messages": [{"role": "user", "content": "thank you!"}]},
    config=config,
    context=Context(user_id="1")
)

print(response['structured_response'])
```

</Expandable>

<Tip>

要了解如何使用 LangSmith 追踪您的智能体，请参阅 [LangSmith 文档](/langsmith/trace-with-langchain)。

</Tip>

恭喜！您现在拥有了一个 AI 智能体，它可以：

- **理解上下文**并记住对话
- **智能使用多种工具**
- **以一致的格式提供结构化响应**
- **通过上下文处理特定用户的信息**
- **在交互过程中维护对话状态**
