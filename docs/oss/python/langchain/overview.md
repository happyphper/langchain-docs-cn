---
title: LangChain 概述
sidebarTitle: Overview
description: LangChain 是一个开源框架，提供预构建的智能体架构，并支持与任何模型或工具集成——因此您可以构建能够随着生态系统快速演进而自适应调整的智能体。
---
LangChain 是开始构建由大语言模型（LLM）驱动的智能体（agent）和应用程序的最简单方式。只需不到 10 行代码，您就可以连接到 OpenAI、Anthropic、Google 以及[更多](/oss/python/integrations/providers/overview)模型提供商。LangChain 提供了预构建的智能体架构和模型集成，帮助您快速入门，并将 LLM 无缝地融入您的智能体和应用程序中。

如果您希望快速构建智能体和自主应用程序，我们推荐您使用 LangChain。当您有更高级的需求，需要结合确定性工作流和智能体工作流、进行重度定制以及严格控制延迟时，请使用我们的底层智能体编排框架和运行时 [LangGraph](/oss/python/langgraph/overview)。

LangChain 的[智能体](/oss/python/langchain/agents)构建在 LangGraph 之上，以提供持久化执行、流式处理、人在回路（human-in-the-loop）、持久化存储等功能。对于基本的 LangChain 智能体使用，您无需了解 LangGraph。

## <Icon icon="wand-magic-sparkles" /> 创建一个智能体

```python
# pip install -qU langchain "langchain[anthropic]"
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

# Run the agent
agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]}
)
```

请参阅[安装说明](/oss/python/langchain/install)和[快速入门指南](/oss/python/langchain/quickstart)，开始使用 LangChain 构建您自己的智能体和应用程序。

## <Icon icon="star" :size="20" /> 核心优势

<Columns :cols="2">

<Card title="标准模型接口" icon="arrows-rotate" href="/oss/langchain/models" arrow cta="了解更多">

不同的提供商拥有独特的模型交互 API，包括响应格式。LangChain 标准化了您与模型的交互方式，使您可以无缝切换提供商并避免供应商锁定。

</Card>

<Card title="易于使用、高度灵活的智能体" icon="wand-magic-sparkles" href="/oss/langchain/agents" arrow cta="了解更多">

LangChain 的智能体抽象设计得易于上手，让您可以用不到 10 行代码构建一个简单的智能体。但它也提供了足够的灵活性，让您可以随心所欲地进行所有上下文工程。

</Card>

<Card title="构建于 LangGraph 之上" icon="circle-nodes" href="/oss/langgraph/overview" arrow cta="了解更多">

LangChain 的智能体构建在 LangGraph 之上。这使我们能够利用 LangGraph 的持久化执行、人在回路支持、持久化存储等功能。

</Card>

<Card title="使用 LangSmith 进行调试" icon="eye" href="/langsmith/home" arrow cta="了解更多">

通过可视化工具深入了解复杂的智能体行为，这些工具可以追踪执行路径、捕获状态转换并提供详细的运行时指标。

</Card>

</Columns>

