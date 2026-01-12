---
title: LangGraph v1 迁移指南
sidebarTitle: LangGraph v1
---
本指南概述了 LangGraph v1 中的变更以及如何从先前版本迁移。有关变更的高层概述，请参阅[新功能](/oss/python/releases/langgraph-v1)页面。

升级方法：

::: code-group

```bash [pip]
pip install -U langgraph langchain-core
```

```bash [uv]
uv add langgraph langchain-core
```

:::

## 变更摘要

LangGraph v1 在很大程度上与先前版本向后兼容。主要变化是弃用了 <a href="https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent" target="_blank" rel="noreferrer" class="link"><code>create_react_agent</code></a>，转而使用 LangChain 的新 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 函数。

## 已弃用项

下表列出了 LangGraph v1 中所有已弃用的项目：

| 已弃用项目 | 替代方案 |
|----------------|-------------|
| `create_react_agent` | <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>langchain.agents.create_agent</code></a> |
| `AgentState` | <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState" target="_blank" rel="noreferrer" class="link"><code>langchain.agents.AgentState</code></a> |
| `AgentStatePydantic` | `langchain.agents.AgentState` (不再使用 pydantic 状态) |
| `AgentStateWithStructuredResponse` | `langchain.agents.AgentState` |
| `AgentStateWithStructuredResponsePydantic` | `langchain.agents.AgentState` (不再使用 pydantic 状态) |
| `HumanInterruptConfig` | `langchain.agents.middleware.human_in_the_loop.InterruptOnConfig` |
| `ActionRequest` | `langchain.agents.middleware.human_in_the_loop.InterruptOnConfig` |
| `HumanInterrupt` | `langchain.agents.middleware.human_in_the_loop.HITLRequest` |
| `ValidationNode` | 使用 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 时工具会自动验证输入 |
| `MessageGraph` | 带有 `messages` 键的 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a>，例如 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 提供的 |

## `create_react_agent` → `create_agent`

LangGraph v1 弃用了预构建的 <a href="https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent" target="_blank" rel="noreferrer" class="link"><code>create_react_agent</code></a>。请使用 LangChain 的 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a>，它运行在 LangGraph 上并添加了灵活的中间件系统。

详情请参阅 LangChain v1 文档：

- [发布说明](/oss/python/releases/langchain-v1#createagent)
- [迁移指南](/oss/python/migrate/langchain-v1#migrate-to-create_agent)

::: code-group

```python [v1 (新)]
from langchain.agents import create_agent

agent = create_agent(  # [!code highlight]
    model,
    tools,
    system_prompt="You are a helpful assistant.",
)
```

```python [v0 (旧)]
from langgraph.prebuilt import create_react_agent

agent = create_react_agent(  # [!code highlight]
    model,
    tools,
    prompt="You are a helpful assistant.",  # [!code highlight]
)
```

:::

## 破坏性变更

### 放弃对 Python 3.9 的支持

所有 LangChain 包现在要求 **Python 3.10 或更高版本**。Python 3.9 已于 2025 年 10 月[终止支持](https://devguide.python.org/versions/)。
