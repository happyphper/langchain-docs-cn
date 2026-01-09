---
title: TrueFoundry
---
TrueFoundry 提供企业级就绪的 [AI Gateway](https://www.truefoundry.com/ai-gateway)，为 LangChain 等智能体框架提供治理和可观测性。TrueFoundry AI Gateway 作为统一的 LLM 访问接口，提供：

- **统一的 API 访问**：通过一个 API 连接 250+ 个 LLM（OpenAI、Claude、Gemini、Groq、Mistral）
- **低延迟**：借助智能路由和负载均衡，内部延迟低于 3 毫秒
- **企业级安全**：符合 SOC 2、HIPAA、GDPR 标准，支持 RBAC 和审计日志
- **配额与成本管理**：基于令牌的配额、速率限制和全面的使用情况跟踪
- **可观测性**：完整的请求/响应日志记录、指标和追踪，支持自定义保留策略

## 先决条件

在将 LangChain 与 TrueFoundry 集成之前，请确保您已具备：

1.  **TrueFoundry 账户**：拥有一个 [TrueFoundry 账户](https://www.truefoundry.com/register)，并至少配置了一个模型提供商。请按照[此处的快速入门指南](https://docs.truefoundry.com/gateway/quick-start)操作。
2.  **个人访问令牌**：按照 [TrueFoundry 令牌生成指南](https://docs.truefoundry.com/gateway/authentication)生成令牌。

## 快速开始

您可以通过 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 接口连接到 TrueFoundry 的统一 LLM 网关。

- 将 `base_url` 设置为您的 TrueFoundry 端点（下文说明）
- 将 `api_key` 设置为您的 TrueFoundry [PAT（个人访问令牌）](https://docs.truefoundry.com/gateway/authentication#personal-access-token-pat)
- 使用与统一代码片段中显示的相同的 `model-name`

### 安装

::: code-group

```bash [pip]
pip install langchain-openai
```

```bash [uv]
uv add langchain-openai
```

:::

### 基本设置

通过更新 LangChain 中的 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 模型来连接到 TrueFoundry：

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    api_key=TRUEFOUNDRY_API_KEY,
    base_url=TRUEFOUNDRY_GATEWAY_BASE_URL,
    model="openai-main/gpt-4o"  # 同样，您可以调用来自任何模型提供商的任何模型
)

llm.invoke("What is the meaning of life, universe and everything?")
```

请求通过您的 TrueFoundry 网关路由到指定的模型提供商。TrueFoundry 会自动处理速率限制、负载均衡和可观测性。

### LangGraph 集成

```python
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, MessagesState
from langchain.messages import HumanMessage

# 定义您的 LangGraph 工作流
def call_model(state: MessagesState):
    model = ChatOpenAI(
        api_key=TRUEFOUNDRY_API_KEY,
        base_url=TRUEFOUNDRY_GATEWAY_BASE_URL,
        # 从网关复制确切的模型名称
        model="openai-main/gpt-4o"
    )
    response = model.invoke(state["messages"])
    return {"messages": [response]}

# 构建工作流
workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.set_entry_point("agent")
workflow.set_finish_point("agent")

app = workflow.compile()

# 通过 TrueFoundry 运行智能体
result = app.invoke({"messages": [HumanMessage(content="Hello!")]})
```

## 可观测性与治理

通过指标仪表板，您可以监控和分析：

- **性能指标**：跟踪关键延迟指标，如请求延迟、首令牌时间（TTFS）和令牌间延迟（ITL），并提供 P99、P90 和 P50 百分位数。
- **成本与令牌使用情况**：通过详细的输入/输出令牌分解以及每个模型的相关费用，了解应用程序的成本。
- **使用模式**：通过用户活动、模型分布和基于团队的使用情况的详细分析，了解应用程序的使用方式。
- **速率限制与负载均衡**：配置限制、跨模型分发流量并设置回退机制。

## 支持

如有问题、疑问或需要支持：

- **电子邮件**：[support@truefoundry.com](mailto:support@truefoundry.com)
- **文档**：[https://docs.truefoundry.com/](https://docs.truefoundry.com/)
