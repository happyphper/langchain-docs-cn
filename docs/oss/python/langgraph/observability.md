---
title: LangSmith 可观测性
---
追踪（Traces）是应用程序从输入到输出所经历的一系列步骤。每个独立的步骤都由一个运行（run）表示。您可以使用 [LangSmith](https://smith.langchain.com/) 来可视化这些执行步骤。要使用它，请[为您的应用程序启用追踪](/langsmith/trace-with-langgraph)。这使您可以执行以下操作：

* [调试本地运行的应用程序](/langsmith/observability-studio#debug-langsmith-traces)。
* [评估应用程序性能](/oss/python/langchain/evals)。
* [监控应用程序](/langsmith/dashboards)。

## 先决条件

开始之前，请确保您具备以下条件：

- **一个 LangSmith 账户**：在 [smith.langchain.com](https://smith.langchain.com) 注册（免费）或登录。
- **一个 LangSmith API 密钥**：请遵循[创建 API 密钥](/langsmith/create-account-api-key#create-an-api-key)指南。

## 启用追踪

要为您的应用程序启用追踪，请设置以下环境变量：

```python
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=<your-api-key>
```

默认情况下，追踪将记录到名为 `default` 的项目中。要配置自定义项目名称，请参阅[记录到项目](#log-to-a-project)。

更多信息，请参阅[使用 LangGraph 追踪](/langsmith/trace-with-langgraph)。

## 选择性追踪

您可以选择使用 LangSmith 的 `tracing_context` 上下文管理器来追踪特定的调用或应用程序的某些部分：

```python
import langsmith as ls

# 这将被追踪
with ls.tracing_context(enabled=True):
    agent.invoke({"messages": [{"role": "user", "content": "Send a test email to alice@example.com"}]})

# 这将不会被追踪（如果未设置 LANGSMITH_TRACING）
agent.invoke({"messages": [{"role": "user", "content": "Send another email"}]})
```

## 记录到项目

:::: details 静态设置

您可以通过设置 `LANGSMITH_PROJECT` 环境变量为整个应用程序设置自定义项目名称：

```bash
export LANGSMITH_PROJECT=my-agent-project
```

::::

:::: details 动态设置

您可以通过编程方式为特定操作设置项目名称：

```python
import langsmith as ls

with ls.tracing_context(project_name="email-agent-test", enabled=True):
    response = agent.invoke({
        "messages": [{"role": "user", "content": "Send a welcome email"}]
    })
```

::::

## 向追踪添加元数据

您可以使用自定义元数据和标签来注释您的追踪：

```python
response = agent.invoke(
    {"messages": [{"role": "user", "content": "Send a welcome email"}]},
    config={
        "tags": ["production", "email-assistant", "v1.0"],
        "metadata": {
            "user_id": "user_123",
            "session_id": "session_456",
            "environment": "production"
        }
    }
)
```

`tracing_context` 也接受标签和元数据以进行细粒度控制：

```python
with ls.tracing_context(
    project_name="email-agent-test",
    enabled=True,
    tags=["production", "email-assistant", "v1.0"],
    metadata={"user_id": "user_123", "session_id": "session_456", "environment": "production"}):
    response = agent.invoke(
        {"messages": [{"role": "user", "content": "Send a welcome email"}]}
    )
```

这些自定义元数据和标签将附加到 LangSmith 中的追踪上。

<Tip>

要了解更多关于如何使用追踪来调试、评估和监控您的智能体（agents），请参阅 [LangSmith 文档](/langsmith/home)。

</Tip>

## 使用匿名器防止敏感数据记录到追踪中

您可能希望屏蔽敏感数据，以防止其被记录到 LangSmith。您可以创建[匿名器](/langsmith/mask-inputs-outputs#rule-based-masking-of-inputs-and-outputs)并通过配置将其应用到您的图（graph）中。此示例将把发送到 LangSmith 的追踪中任何匹配社会保障号格式 XXX-XX-XXXX 的内容替换为 `<ssn>`。

```python [Python]
from langchain_core.tracers.langchain import LangChainTracer
from langgraph.graph import StateGraph, MessagesState
from langsmith import Client
from langsmith.anonymizer import create_anonymizer

anonymizer = create_anonymizer([
    # 匹配 SSNs
    { "pattern": r"\b\d{3}-?\d{2}-?\d{4}\b", "replace": "<ssn>" }
])

tracer_client = Client(anonymizer=anonymizer)
tracer = LangChainTracer(client=tracer_client)
# 定义图
graph = (
    StateGraph(MessagesState)
    ...
    .compile()
    .with_config({'callbacks': [tracer]})
)
```

