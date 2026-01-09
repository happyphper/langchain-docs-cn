---
title: 部署其他框架
sidebarTitle: 'Deploy other frameworks (e.g., Strands, CrewAI)'
---
本指南将展示如何使用 [Functional API](/oss/langgraph/functional-api) 在 [LangSmith Deployment](/langsmith/deployments) 上部署一个 [Strands Agent](https://strandsagents.com/latest/documentation/docs/)，并为 [LangSmith Observability](/langsmith/observability) 设置追踪。你也可以对 CrewAI、AutoGen、Google ADK 等其他框架采用相同的方法。

使用 Functional API 并部署到 LangSmith Deployment 具有以下优势：

* **生产部署**：将你的集成解决方案部署到 [LangSmith Deployment](/langsmith/deployments)，以实现可扩展的生产使用。
* **增强功能**：通过 Functional API，你可以将现有代理与 [持久化](/oss/langgraph/persistence)、[流式处理](/langsmith/streaming)、[短期和长期记忆](/oss/concepts/memory) 等功能集成，并且只需对现有代码进行最小改动。
* **多代理系统**：构建 [多代理系统](/oss/langchain/multi-agent)，其中各个代理可以使用不同的框架构建。

## 先决条件

* Python 3.9+
* 依赖项：`pip install strands-agents strands-agents-tools langgraph`
* 环境变量中配置的 AWS 凭证

## 1. 定义 Strands 代理

使用预构建的工具创建一个 Strands Agent。

```python
from strands import Agent
from strands_tools import file_read, file_write, python_repl, shell, journal

agent = Agent(
        tools=[file_read, file_write, python_repl, shell, journal],
        system_prompt="You are an Expert Software Developer Assistant specializing in web frameworks. Your task is to analyze project structures and identify mappings.",
        model="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    )
```

## 2. 使用 Functional API 在 LangSmith Deployment 上部署

[Functional API](/oss/langgraph/functional-api) 允许你集成和部署 LangChain 以外的框架。Functional API 还提供了额外的好处，可以让你在最小化现有代码改动的情况下，将其他关键功能——持久化、记忆、人在回路和流式处理——与现有代理结合使用。

它使用两个关键构建块：

* **<a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint" target="_blank" rel="noreferrer" class="link"><code>@entrypoint</code></a>**：将一个函数标记为工作流的起点，封装逻辑并管理执行流程，包括处理长时间运行的任务和中断。
* **<a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.task" target="_blank" rel="noreferrer" class="link"><code>@task</code></a>**：表示一个离散的工作单元，例如 API 调用或数据处理步骤，可以在入口点内异步执行。任务返回一个类似 future 的对象，可以等待或同步解析。

```python
from strands.types.content import Message

from langgraph.func import entrypoint, task
import operator

@task
def invoke_strands(messages: list[Message]):
    # 使用现有消息运行代理；可以使用 messages[-1] 调用最终消息
    result = agent(messages)
    # 返回结果消息
    return [result.message]

@entrypoint()
def workflow(messages: list[Message], previous: list[Message]):
    messages = operator.add(previous or [], messages)
    response = invoke_strands(messages).result()
    return entrypoint.final(value=response, save=operator.add(messages, response))
```

## 3. 使用 OpenTelemetry 设置追踪

在你的环境变量中，设置以下内容：

```python
# 关闭 LangSmith 默认追踪，因为我们只想使用 OpenTelemetry 进行追踪
LANGSMITH_TRACING=false

OTEL_EXPORTER_OTLP_ENDPOINT = "https://api.smith.langchain.com/otel/"

OTEL_EXPORTER_OTLP_HEADERS = "x-api-key=your-langsmith-api-key,Langsmith-Project=your-tracing-project-name"
```

<Note>

如果你正在 [自托管 LangSmith](/langsmith/self-hosted)，请将 `OTEL_EXPORTER_OTLP_ENDPOINT` 端点替换为你的 LangSmith API 端点，并附加 `/api/v1/otel`。例如：`OTEL_EXPORTER_OTLP_ENDPOINT = "https://ai-company.com/api/v1/otel"`

</Note>

<Note>

Strand 的 OTel 追踪包含同步代码。在这种情况下，你可能需要设置 `BG_JOB_ISOLATED_LOOPS=true`，以便在与服务 API 事件循环分离的独立事件循环中执行后台运行。

</Note>

在你的主代理中，设置以下内容：

```python
from strands.telemetry import StrandsTelemetry

strands_telemetry = StrandsTelemetry()
strands_telemetry.setup_otlp_exporter()
strands_telemetry.setup_meter()
```

## 4. 准备部署

至此，要部署到 LangSmith，请创建如下文件结构：

```
my-strands-agent/
├── agent.py          # 你的主代理代码
├── requirements.txt  # Python 依赖项
└── langgraph.json   # LangGraph 配置
```

要部署你的代理，请遵循 [部署到云端](/langsmith/deploy-to-cloud) 指南。
