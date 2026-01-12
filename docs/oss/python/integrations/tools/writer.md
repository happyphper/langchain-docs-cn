---
title: WRITER 工具
---
本指南概述了如何开始使用 WRITER [工具](/oss/python/langchain/tools)。有关所有 WRITER 功能和配置的详细文档，请参阅 [WRITER 文档](https://dev.writer.com/home)。

## 概述

### 集成详情

| 类                                                                                                      | 包          | 本地 | 可序列化 | JS 支持 |                                        下载量                                         |                                        版本                                         |
|:-----------------------------------------------------------------------------------------------------------|:-----------------| :---: | :---: |:----------:|:------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------:|
| [GraphTool](https://github.com/writer/langchain-writer/blob/main/langchain_writer/tools.py#L9) | [langchain-writer](https://pypi.org/project/langchain-writer/) |      ❌       |                                       ❌                                       | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-writer?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-writer?style=flat-square&label=%20) |
| [TranslationTool](https://github.com/writer/langchain-writer/blob/main/langchain_writer/tools.py) | [langchain-writer](https://pypi.org/project/langchain-writer/) |      ❌       |                                       ❌                                       | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-writer?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-writer?style=flat-square&label=%20) |
| [WebSearchTool](https://github.com/writer/langchain-writer/blob/main/langchain_writer/tools.py) | [langchain-writer](https://pypi.org/project/langchain-writer/) |      ❌       |                                       ❌                                       | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-writer?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-writer?style=flat-square&label=%20) |

### 功能

`ChatWriter` 支持多种工具类型：`function`、`graph`、`translation` 和 `web_search`。

> **重要限制**：一次只能使用一个 WRITER 工具（translation、graph、web_search、llm、image、vision）。虽然不能组合多个 WRITER 工具，但可以将一个 WRITER 工具与多个自定义函数工具一起使用。

#### 函数 (Function)

函数是最常见的工具类型，它允许 LLM 调用外部 API、从数据库获取数据，并执行任何您想要的外部操作。更多信息请访问 WRITER 的 [工具调用文档](https://dev.writer.com/home/tool-calling)。

#### 图谱 (Graph)

`Graph` 工具使用 WRITER 的知识图谱 (Knowledge Graph)，这是一个基于图谱的检索增强生成 (RAG) 系统。使用此工具时，开发者需要提供一个引用其特定知识图谱的图谱 ID (graph ID)。模型随后使用该图谱来查找相关信息，并为提示中的问题生成准确的答案。这使得模型能够在对话中访问和利用自定义知识库。更多详情，请参阅 WRITER 的 [知识图谱 API 文档](https://dev.writer.com/home/knowledge-graph)。

#### 翻译 (Translation)

翻译工具允许您在与 Palmyra 模型对话时翻译文本。虽然 Palmyra X 模型可以执行翻译任务，但它们并未针对这些任务进行优化，在没有正确提示的情况下可能表现不佳。更多信息请参阅 WRITER 的 [翻译 API 文档](https://dev.writer.com/home/translation-tool#translate-text-in-a-chat)。

#### 网络搜索 (Web Search)

网络搜索工具允许您在与 Palmyra 模型对话时搜索网络以获取最新信息。虽然 Palmyra 模型知识渊博，但它们可能无法访问最新的信息或实时数据。网络搜索工具使您的 AI 助手能够从网络上查找最新的信息、新闻和事实。更多信息请参阅 WRITER 的 [网络搜索 API 文档](https://dev.writer.com/home/web-search-tool#web-search-in-a-chat)。

## 设置

注册 [WRITER AI Studio](https://app.writer.com/aistudio/signup?utm_campaign=devrel) 以生成 API 密钥（您可以按照此 [快速入门](https://dev.writer.com/home/quickstart) 操作）。然后，设置 `WRITER_API_KEY` 环境变量：

```python
import getpass
import os

if not os.getenv("WRITER_API_KEY"):
    os.environ["WRITER_API_KEY"] = getpass.getpass("Enter your WRITER API key: ")
```

## 用法

您可以将图谱或函数工具绑定到 `ChatWriter`。

### 图谱工具

要绑定图谱工具，首先使用您想用作来源的 `graph_ids` 创建并初始化一个 `GraphTool` 实例：

```python
from langchain_writer.chat_models import ChatWriter
from langchain_writer.tools import GraphTool

chat = ChatWriter()

graph_id = getpass.getpass("Enter WRITER Knowledge Graph ID: ")
graph_tool = GraphTool(graph_ids=[graph_id])
```

### 翻译工具

翻译工具允许您在与 Palmyra 模型对话时翻译文本。虽然 Palmyra X 模型可以执行翻译任务，但它们并未针对这些任务进行优化，在没有正确提示的情况下可能表现不佳。

要使用翻译工具，导入并初始化内置的 `TranslationTool`：

```python
from langchain_writer.tools import TranslationTool

# Initialize the translation tool
translation_tool = TranslationTool()
```

### 网络搜索工具

网络搜索工具允许您在与 Palmyra 模型对话时搜索网络以获取最新信息。虽然 Palmyra 模型知识渊博，但它们可能无法访问最新的信息或实时数据。网络搜索工具使您的 AI 助手能够从网络上查找最新的信息、新闻和事实。

要使用网络搜索工具，导入并初始化内置的 `WebSearchTool`：

```python
from langchain_writer.tools import WebSearchTool

# Initialize the web search tool with optional configuration
web_search_tool = WebSearchTool(
    include_domains=["wikipedia.org", "github.com", "techcrunch.com"],
    exclude_domains=["quora.com"]
)
```

## 实例化

```python
from langchain.tools import tool
from pydantic import BaseModel, Field

@tool
def get_supercopa_trophies_count(club_name: str) -> int | None:
    """Returns information about supercopa trophies count.

    Args:
        club_name: Club you want to investigate info of supercopa trophies about

    Returns:
        Number of supercopa trophies or None if there is no info about requested club
    """

    if club_name == "Barcelona":
        return 15
    elif club_name == "Real Madrid":
        return 13
    elif club_name == "Atletico Madrid":
        return 2
    else:
        return None

class GetWeather(BaseModel):
    """Get the current weather in a given location"""

    location: str = Field(..., description="The city and state, e.g. San Francisco, CA")

get_product_info = {
    "type": "function",
    "function": {
        "name": "get_product_info",
        "description": "Get information about a product by its id",
        "parameters": {
            "type": "object",
            "properties": {
                "product_id": {
                    "type": "number",
                    "description": "The unique identifier of the product to retrieve information for",
                }
            },
            "required": ["product_id"],
        },
    },
}
```

### 绑定工具

**重要提示**：WRITER 一次只允许绑定一个 WRITER 工具（translation、graph、web_search、llm、image、vision）。您不能同时绑定多个 WRITER 工具。但是，您可以将多个自定义函数工具与一个 WRITER 工具一起绑定。

```python
# ✅ 正确：一个 WRITER 工具 + 多个函数工具
llm_with_tools = chat.bind_tools(
    [graph_tool, get_supercopa_trophies_count, GetWeather, get_product_info]
)

# ✅ 正确：不同的 WRITER 工具 + 函数工具
llm_with_tools = chat.bind_tools(
    [translation_tool, get_supercopa_trophies_count, GetWeather]
)

# ❌ 错误：多个 WRITER 工具（将导致 BadRequestError）
llm_with_tools = chat.bind_tools(
    [graph_tool, translation_tool, web_search_tool]  # This will fail
)
```

如果您需要使用不同的 WRITER 工具，有几种选择：

**选项 1：为每次对话重新绑定工具**：

```python
# 为一次对话使用图谱工具
llm_with_tools = chat.bind_tools([graph_tool, get_supercopa_trophies_count])
response1 = llm_with_tools.invoke([HumanMessage("Use the knowledge graph to answer...")])

# 为另一次对话切换到翻译工具
llm_with_tools = chat.bind_tools([translation_tool, get_supercopa_trophies_count])
response2 = llm_with_tools.invoke([HumanMessage("Translate this text...")])
```

**选项 2：使用独立的 ChatWriter 实例**：

```python
# 为不同的工具创建独立的 ChatWriter 实例
chat_with_graph = ChatWriter()
llm_with_graph_tool = chat_with_graph.bind_tools([graph_tool])

chat_with_translation = ChatWriter()
llm_with_translation_tool = chat_with_translation.bind_tools([translation_tool])
```

## 调用

在所有模式（流式/非流式、同步/异步）下，模型都会在调用期间自动选择工具。

```python
from langchain.messages import HumanMessage

# 使用图谱工具和函数工具的示例
llm_with_tools = chat.bind_tools([graph_tool, get_supercopa_trophies_count])
messages = [
    HumanMessage(
        "Use knowledge graph tool to compose this answer. Tell me what the first line of documents stored in your KG. Also I want to know: how many SuperCopa trophies have Barcelona won?"
    )
]

response = llm_with_tools.invoke(messages)
messages.append(response)

# 使用翻译工具的示例
llm_with_translation = chat.bind_tools([translation_tool])
translation_messages = [
    HumanMessage("Translate 'Hello, world!' to Spanish")
]

translation_response = llm_with_translation.invoke(translation_messages)
print(translation_response.content)  # Output: "¡Hola, mundo!"

# 使用网络搜索工具的示例
llm_with_search = chat.bind_tools([web_search_tool])
search_messages = [
    HumanMessage("What are the latest developments in AI technology? Please search the web for current information.")
]

search_response = llm_with_search.invoke(search_messages)
print(search_response.content)  # Output: Current AI developments based on web search
```

对于函数工具，您将收到一个包含工具调用请求的助手消息。

```python
print(response.tool_calls)
```

然后，您可以手动处理工具调用请求，发送给模型并接收最终响应：

```python
for tool_call in response.tool_calls:
    selected_tool = {
        "get_supercopa_trophies_count": get_supercopa_trophies_count,
    }[tool_call["name"].lower()]
    tool_msg = selected_tool.invoke(tool_call)
    messages.append(tool_msg)

response = llm_with_tools.invoke(messages)
print(response.content)
```

对于 `GraphTool`，模型将远程调用它，并在 `additional_kwargs` 下的 `graph_data` 键中返回使用信息：

```python
print(response.additional_kwargs["graph_data"])
```

`content` 属性包含最终响应：

```python
print(response.content)
```

## 链式调用

WRITER 图谱工具的工作方式与其他工具不同；使用时，WRITER 服务器会自动处理调用知识图谱和使用 RAG 生成响应。由于这种自动化的服务器端处理，您无法独立调用 `GraphTool` 或将其用作 LangChain 链的一部分。您必须像上面的示例一样，将 `GraphTool` 直接与 `ChatWriter` 实例一起使用。

---

## API 参考

有关所有 `GraphTool` 功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/writer/tools/langchain_writer.tools.GraphTool.html#langchain_writer.tools.GraphTool)。
