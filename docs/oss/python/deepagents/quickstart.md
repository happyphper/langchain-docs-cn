---
title: 快速入门
description: 在几分钟内构建你的第一个深度智能体
---
本指南将引导您创建第一个具备规划能力、文件系统工具和子代理功能的深度智能体。您将构建一个能够进行研究并撰写报告的研究型智能体。

## 前提条件

开始之前，请确保您拥有模型提供商（例如 Anthropic、OpenAI）的 API 密钥。

### 步骤 1：安装依赖项

::: code-group

```bash [pip]
pip install deepagents tavily-python
```

```bash [uv]
uv init
uv add deepagents tavily-python
uv sync
```

```bash [poetry]
poetry add deepagents tavily-python
```

:::

### 步骤 2：设置您的 API 密钥

```bash
export ANTHROPIC_API_KEY="your-api-key"
export TAVILY_API_KEY="your-tavily-api-key"
```

### 步骤 3：创建一个搜索工具

```python
import os
from typing import Literal
from tavily import TavilyClient
from deepagents import create_deep_agent

tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

def internet_search(
    query: str,
    max_results: int = 5,
    topic: Literal["general", "news", "finance"] = "general",
    include_raw_content: bool = False,
):
    """运行网络搜索"""
    return tavily_client.search(
        query,
        max_results=max_results,
        include_raw_content=include_raw_content,
        topic=topic,
    )
```

### 步骤 4：创建一个深度智能体

```python
# 引导智能体成为专家研究员的系统提示
research_instructions = """您是一位专家研究员。您的任务是进行深入研究，然后撰写一份完善的报告。

您可以使用互联网搜索工具作为收集信息的主要手段。

## `internet_search`

使用此工具运行给定查询的互联网搜索。您可以指定要返回的最大结果数、主题以及是否包含原始内容。
"""

agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=research_instructions
)
```

### 步骤 5：运行智能体

```python
result = agent.invoke({"messages": [{"role": "user", "content": "What is langgraph?"}]})

# 打印智能体的响应
print(result["messages"][-1].content)
```

## 发生了什么？

您的深度智能体自动执行了以下操作：

1.  **规划其方法**：使用内置的 `write_todos` 工具来分解研究任务
2.  **进行研究**：调用 `internet_search` 工具来收集信息
3.  **管理上下文**：使用文件系统工具（`write_file`、`read_file`）来卸载大型搜索结果
4.  **生成子代理**（如果需要）：将复杂的子任务委托给专门的子代理
5.  **综合报告**：将发现结果汇编成连贯的响应

## 后续步骤

现在您已经构建了第一个深度智能体：

-   **自定义您的智能体**：了解[自定义选项](/oss/deepagents/customization)，包括自定义系统提示、工具和子代理。
-   **理解中间件**：深入了解驱动深度智能体的[中间件架构](/oss/deepagents/middleware)。
-   **添加长期记忆**：启用跨对话的[持久性记忆](/oss/deepagents/long-term-memory)。
-   **部署到生产环境**：了解 LangGraph 应用程序的[部署选项](/oss/langgraph/deploy)。
