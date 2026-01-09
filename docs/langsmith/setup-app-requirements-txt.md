---
title: 如何使用 requirements.txt 设置应用程序
sidebarTitle: With requirements.txt
---


一个应用程序必须配置一个[配置文件](/langsmith/cli#configuration-file)才能部署到 LangSmith（或进行自托管）。本操作指南讨论了使用 `requirements.txt` 指定项目依赖项来设置应用程序进行部署的基本步骤。

此示例基于[此仓库](https://github.com/langchain-ai/langgraph-example)，该仓库使用 LangGraph 框架。

最终的仓库结构将类似于这样：

```bash
my-app/
├── my_agent # 所有项目代码都在这里
│   ├── utils # 你的图的实用工具
│   │   ├── __init__.py
│   │   ├── tools.py # 你的图的工具
│   │   ├── nodes.py # 你的图的节点函数
│   │   └── state.py # 你的图的状态定义
│   ├── requirements.txt # 包依赖项
│   ├── __init__.py
│   └── agent.py # 构建你的图的代码
├── .env # 环境变量
└── langgraph.json # LangGraph 的配置文件
```

<Tip>

<!--@include: @/snippets/python/langsmith/framework-agnostic.md-->

</Tip>

你也可以通过以下方式设置：

- `pyproject.toml`：如果你更喜欢使用 poetry 进行依赖管理，请查看关于在 LangSmith 中使用 `pyproject.toml` 的[此操作指南](/langsmith/setup-app-requirements-txt)。
- 单体仓库（monorepo）：如果你有兴趣部署位于单体仓库内的图，请查看[此仓库](https://github.com/langchain-ai/langgraph-example-monorepo)以获取示例。

每个步骤之后，都会提供一个示例文件目录，以演示代码的组织方式。

## 指定依赖项

依赖项可以选择性地在以下文件之一中指定：`pyproject.toml`、`setup.py` 或 `requirements.txt`。如果这些文件都没有创建，那么依赖项可以在稍后的[配置文件](#create-the-configuration-file)中指定。

以下依赖项将包含在镜像中，只要版本范围兼容，你也可以在代码中使用它们：

```
langgraph>=0.4.10,<2
langgraph-sdk>=0.2.0
langgraph-checkpoint>=3.0.1,<5
langchain-core>=0.3.64
langsmith>=0.3.45
orjson>=3.9.7,<3.10.17
httpx>=0.25.0
tenacity>=8.0.0
uvicorn>=0.26.0
sse-starlette>=2.1.0,<2.2.0
uvloop>=0.18.0
httptools>=0.5.0
jsonschema-rs>=0.20.0
structlog>=24.1.0
cloudpickle>=3.0.0
truststore>=0.1
protobuf>=6.32.1,<7.0.0
grpcio>=1.75.0,<2.0.0
grpcio-tools>=1.75.0,<2.0.0
grpcio-health-checking>=1.75.0,<2.0.0
```

示例 `requirements.txt` 文件：

```
langgraph
langchain_anthropic
tavily-python
langchain_community
langchain_openai
```

示例文件目录：

```bash
my-app/
├── my_agent # 所有项目代码都在这里
│   └── requirements.txt # 包依赖项
```

## 指定环境变量

环境变量可以选择性地在一个文件（例如 `.env`）中指定。请参阅[环境变量参考](/langsmith/env-var)来为部署配置其他变量。

示例 `.env` 文件：

```
MY_ENV_VAR_1=foo
MY_ENV_VAR_2=bar
OPENAI_API_KEY=key
```

示例文件目录：

```bash
my-app/
├── my_agent # 所有项目代码都在这里
│   └── requirements.txt # 包依赖项
└── .env # 环境变量
```

<Tip>

<!--@include: @/snippets/python/langsmith/pre-release-behavior.md-->

</Tip>

## 定义图

实现你的图。图可以在单个文件或多个文件中定义。请注意要包含在应用程序中的每个 `<a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph" target="_blank" rel="noreferrer" class="link">CompiledStateGraph</a>` 的变量名。这些变量名将在稍后创建 [LangGraph 配置文件](/langsmith/cli#configuration-file)时使用。

示例 `agent.py` 文件，展示了如何从你定义的其他模块导入（此处未显示模块的代码，请查看[此仓库](https://github.com/langchain-ai/langgraph-example)以查看其实现）：

```python
# my_agent/agent.py
from typing import Literal
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, END, START
from my_agent.utils.nodes import call_model, should_continue, tool_node # 导入节点
from my_agent.utils.state import AgentState # 导入状态

# 定义运行时上下文
class GraphContext(TypedDict):
    model_name: Literal["anthropic", "openai"]

workflow = StateGraph(AgentState, context_schema=GraphContext)
workflow.add_node("agent", call_model)
workflow.add_node("action", tool_node)
workflow.add_edge(START, "agent")
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "continue": "action",
        "end": END,
    },
)
workflow.add_edge("action", "agent")

graph = workflow.compile()
```

示例文件目录：

```bash
my-app/
├── my_agent # 所有项目代码都在这里
│   ├── utils # 你的图的实用工具
│   │   ├── __init__.py
│   │   ├── tools.py # 你的图的工具
│   │   ├── nodes.py # 你的图的节点函数
│   │   └── state.py # 你的图的状态定义
│   ├── requirements.txt # 包依赖项
│   ├── __init__.py
│   └── agent.py # 构建你的图的代码
└── .env # 环境变量
```

## 创建配置文件

创建一个名为 `langgraph.json` 的[配置文件](/langsmith/cli#configuration-file)。有关配置文件的 JSON 对象中每个键的详细说明，请参阅[配置文件参考](/langsmith/cli#configuration-file)。

示例 `langgraph.json` 文件：

```json
{
  "dependencies": ["./my_agent"],
  "graphs": {
    "agent": "./my_agent/agent.py:graph"
  },
  "env": ".env"
}
```

请注意，`CompiledGraph` 的变量名出现在顶级 `graphs` 键的每个子键值的末尾（即 `:<variable_name>`）。

<Warning>

<strong>配置文件位置</strong>
配置文件必须放置在与包含已编译图及其相关依赖项的 Python 文件同级或更高级别的目录中。

</Warning>

示例文件目录：

```bash
my-app/
├── my_agent # 所有项目代码都在这里
│   ├── utils # 你的图的实用工具
│   │   ├── __init__.py
│   │   ├── tools.py # 你的图的工具
│   │   ├── nodes.py # 你的图的节点函数
│   │   └── state.py # 你的图的状态定义
│   ├── requirements.txt # 包依赖项
│   ├── __init__.py
│   └── agent.py # 构建你的图的代码
├── .env # 环境变量
└── langgraph.json # LangGraph 的配置文件
```

## 下一步

设置好项目并将其放入 GitHub 仓库后，就可以[部署你的应用](/langsmith/deployment-quickstart)了。
