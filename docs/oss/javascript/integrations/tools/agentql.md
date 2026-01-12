---
title: AgentQL
---
[AgentQL](https://www.agentql.com/) 工具提供网页交互和结构化数据提取功能，可通过 [AgentQL 查询](https://docs.agentql.com/agentql-query) 或自然语言提示从任何网页提取数据。AgentQL 可跨多种语言和网页使用，且不会因时间推移和网页变更而失效。

## 概述

AgentQL 提供以下三种工具：

- **`ExtractWebDataTool`** 使用 [AgentQL 查询](https://docs.agentql.com/agentql-query/query-intro) 或数据的自然语言描述，从给定 URL 的网页中提取结构化数据为 JSON。

以下两种工具也捆绑为 `AgentQLBrowserToolkit`，必须与 `Playwright` 浏览器或通过 Chrome DevTools 协议 (CDP) 的远程浏览器实例一起使用：

- **`ExtractWebDataBrowserTool`** 使用 [AgentQL 查询](https://docs.agentql.com/agentql-query/query-intro) 或自然语言描述，从浏览器中的活动网页提取结构化数据为 JSON。

- **`GetWebElementBrowserTool`** 使用自然语言描述在浏览器中的活动网页上查找网页元素，并返回其 CSS 选择器以供进一步交互。

### 集成详情

| 类 | 包 | 可序列化 | [JS 支持](https://js.langchain.com/docs/integrations/tools/langchain_agentql) | 版本 |
| :--- | :--- | :---: | :---: | :---: |
| AgentQL | langchain-agentql | ❌ | ❌ | 1.0.0 |

### 工具特性

| 工具 | 网页数据提取 | 网页元素提取 | 与本地浏览器一起使用 |
| :--- | :---: | :---: | :---: |
| ExtractWebDataTool | ✅ | ❌ | ❌
| ExtractWebDataBrowserTool | ✅ | ❌ | ✅
| GetWebElementBrowserTool | ❌ | ✅ | ✅

## 设置

```python
pip install --quiet -U langchain-agentql
```

要运行此笔记本，请安装 `Playwright` 浏览器并配置 Jupyter Notebook 的 `asyncio` 循环。

```python
!playwright install

# This import is required only for jupyter notebooks, since they have their own eventloop
import nest_asyncio

nest_asyncio.apply()
```

### 凭证

要使用 AgentQL 工具，您需要从 [AgentQL 开发者门户](https://dev.agentql.com/) 获取您自己的 API 密钥，并设置 AgentQL 环境变量。

```python
import os

os.environ["AGENTQL_API_KEY"] = "YOUR_AGENTQL_API_KEY"
```

## 实例化

### `ExtractWebDataTool`

您可以使用以下参数实例化 `ExtractWebDataTool`：

- `api_key`：您来自 [dev.agentql.com](https://dev.agentql.com) 的 AgentQL API 密钥。**`可选`。**
- `timeout`：请求超时前等待的秒数。如果数据提取超时，请增加此值。**默认为 `900`。**
- `is_stealth_mode_enabled`：是否启用实验性的反机器人规避策略。此功能可能无法在所有网站的所有时间都有效。启用此模式后，数据提取可能需要更长时间才能完成。**默认为 `False`。**
- `wait_for`：提取数据前等待页面加载的秒数。**默认为 `0`。**
- `is_scroll_to_bottom_enabled`：提取数据前是否滚动到页面底部。**默认为 `False`。**
- `mode`：`"standard"` 使用深度数据分析，而 `"fast"` 以牺牲部分分析深度为代价换取速度，适用于大多数用例。[在此指南中了解更多关于模式的信息。](https://docs.agentql.com/accuracy/standard-mode) **默认为 `"fast"`。**
- `is_screenshot_enabled`：提取数据前是否截图。在 'metadata' 中以 Base64 字符串形式返回。**默认为 `False`。**

`ExtractWebDataTool` 使用 AgentQL 的 REST API 实现，您可以在 [API 参考文档](https://docs.agentql.com/rest-api/api-reference) 中查看有关参数的更多详细信息。

```python
from langchain_agentql.tools import ExtractWebDataTool

extract_web_data_tool = ExtractWebDataTool()
```

### `ExtractWebDataBrowserTool`

要实例化 **ExtractWebDataBrowserTool**，您需要将该工具与浏览器实例连接。

您可以设置以下参数：

- `timeout`：请求超时前等待的秒数。如果数据提取超时，请增加此值。**默认为 `900`。**
- `wait_for_network_idle`：是否等待网络达到完全空闲状态后再执行。**默认为 `True`。**
- `include_hidden`：是否考虑页面上视觉上隐藏的元素。**默认为 `True`。**
- `mode`：`"standard"` 使用深度数据分析，而 `"fast"` 以牺牲部分分析深度为代价换取速度，适用于大多数用例。[在此指南中了解更多关于模式的信息。](https://docs.agentql.com/accuracy/standard-mode) **默认为 `"fast"`。**

`ExtractWebDataBrowserTool` 使用 AgentQL 的 SDK 实现。您可以在 AgentQL 的 [API 参考](https://docs.agentql.com/python-sdk/api-references/agentql-page#querydata) 中找到有关参数和函数的更多详细信息。

```python
from langchain_agentql.tools import ExtractWebDataBrowserTool
from langchain_agentql.utils import create_async_playwright_browser

async_browser = await create_async_playwright_browser()

extract_web_data_browser_tool = ExtractWebDataBrowserTool(async_browser=async_browser)
```

### `GetWebElementBrowserTool`

要实例化 **GetWebElementBrowserTool**，您需要将该工具与浏览器实例连接。

您可以设置以下参数：

- `timeout`：请求超时前等待的秒数。如果数据提取超时，请增加此值。**默认为 `900`。**
- `wait_for_network_idle`：是否等待网络达到完全空闲状态后再执行。**默认为 `True`。**
- `include_hidden`：是否考虑页面上视觉上隐藏的元素。**默认为 `False`。**
- `mode`：`"standard"` 使用深度数据分析，而 `"fast"` 以牺牲部分分析深度为代价换取速度，适用于大多数用例。[在此指南中了解更多关于模式的信息。](https://docs.agentql.com/accuracy/standard-mode) **默认为 `"fast"`。**

`GetWebElementBrowserTool` 使用 AgentQL 的 SDK 实现。您可以在 AgentQL 的 [API 参考](https://docs.agentql.com/python-sdk/api-references/agentql-page#queryelements) 中找到有关参数和函数的更多详细信息。`

```python
from langchain_agentql.tools import GetWebElementBrowserTool

extract_web_element_tool = GetWebElementBrowserTool(async_browser=async_browser)
```

## 调用

### `ExtractWebDataTool`

此工具在底层使用 AgentQL 的 REST API，将公开可访问的网页 URL 发送到 AgentQL 的端点。这不适用于私有页面或已登录的会话。对于这些用例，请使用 `ExtractWebDataBrowserTool`。

- `url`：您要从中提取数据的网页 URL。
- `query`：要执行的 AgentQL 查询。如果您想提取精确的结构化数据，请使用 AgentQL 查询。在 [文档中了解更多关于如何编写 AgentQL 查询的信息](https://docs.agentql.com/agentql-query)，或在 [AgentQL Playground](https://dev.agentql.com/playground) 中测试一个查询。
- `prompt`：要从页面提取的数据的自然语言描述。AgentQL 将从您的提示中推断数据的结构。如果您想提取由自由形式语言定义的数据而不定义特定结构，请使用 `prompt`。

**注意：** 您必须定义 `query` 或 `prompt` 才能使用 AgentQL。

```python
# 您可以使用查询或提示来调用该工具

# extract_web_data_tool.invoke(
#     {
#         "url": "https://www.agentql.com/blog",
#         "prompt": "the blog posts with title, url, date of post and author",
#     }
# )

extract_web_data_tool.invoke(
    {
        "url": "https://www.agentql.com/blog",
        "query": "{ posts[] { title url date author } }",
    },
)
```

```text
{'data': {'posts': [{'title': 'Launch Week Recap—make the web AI-ready',
    'url': 'https://www.agentql.com/blog/2024-launch-week-recap',
    'date': 'Nov 18, 2024',
    'author': 'Rachel-Lee Nabors'},
   {'title': 'Accurate data extraction from PDFs and images with AgentQL',
    'url': 'https://www.agentql.com/blog/accurate-data-extraction-pdfs-images',
    'date': 'Feb 1, 2025',
    'author': 'Rachel-Lee Nabors'},
   {'title': 'Introducing Scheduled Scraping Workflows',
    'url': 'https://www.agentql.com/blog/scheduling',
    'date': 'Dec 2, 2024',
    'author': 'Rachel-Lee Nabors'},
   {'title': 'Updates to Our Pricing Model',
    'url': 'https://www.agentql.com/blog/2024-pricing-update',
    'date': 'Nov 19, 2024',
    'author': 'Rachel-Lee Nabors'},
   {'title': 'Get data from any page: AgentQL’s REST API Endpoint—Launch week day 5',
    'url': 'https://www.agentql.com/blog/data-rest-api',
    'date': 'Nov 15, 2024',
    'author': 'Rachel-Lee Nabors'}]},
 'metadata': {'request_id': '0dc1f89c-1b6a-46fe-8089-6cd0f082f094',
  'generated_query': None,
  'screenshot': None}}
```

### `ExtractWebDataBrowserTool`

- `query`：要执行的 AgentQL 查询。如果您想提取精确的结构化数据，请使用 AgentQL 查询。在 [文档中了解更多关于如何编写 AgentQL 查询的信息](https://docs.agentql.com/agentql-query)，或在 [AgentQL Playground](https://dev.agentql.com/playground) 中测试一个查询。
- `prompt`：要从页面提取的数据的自然语言描述。AgentQL 将从您的提示中推断数据的结构。如果您想提取由自由形式语言定义的数据而不定义特定结构，请使用 `prompt`。

**注意：** 您必须定义 `query` 或 `prompt` 才能使用 AgentQL。

要提取数据，首先必须使用 LangChain 的 [Playwright](https://python.langchain.com/docs/integrations/tools/playwright/) 工具导航到网页。

```python
from langchain_community.tools.playwright import NavigateTool

navigate_tool = NavigateTool(async_browser=async_browser)
await navigate_tool.ainvoke({"url": "https://www.agentql.com/blog"})
```

```text
'Navigating to https://www.agentql.com/blog returned status code 200'
```

```python
# 您可以使用查询或提示来调用该工具

# await extract_web_data_browser_tool.ainvoke(
#     {'query': '{ blogs[] { title url date author } }'}
# )

await extract_web_data_browser_tool.ainvoke(
    {"prompt": "the blog posts with title, url, date of post and author"}
)
```

```text
/usr/local/lib/python3.11/dist-packages/agentql/_core/_utils.py:167: UserWarning: 🚨 The function get_data_by_prompt_experimental is experimental and may not work as expected 🚨
  warnings.warn(
```

```text
{'blog_posts': [{'title': 'Launch Week Recap—make the web AI-ready',
   'url': 'https://www.agentql.com/blog/2024-launch-week-recap',
   'date': 'Nov 18, 2024',
   'author': 'Rachel-Lee Nabors'},
  {'title': 'Accurate data extraction from PDFs and images with AgentQL',
   'url': 'https://www.agentql.com/blog/accurate-data-extraction-pdfs-images',
   'date': 'Feb 1, 2025',
   'author': 'Rachel-Lee Nabors'},
  {'title': 'Introducing Scheduled Scraping Workflows',
   'url': 'https://www.agentql.com/blog/scheduling',
   'date': 'Dec 2, 2024',
   'author': 'Rachel-Lee Nabors'},
  {'title': 'Updates to Our Pricing Model',
   'url': 'https://www.agentql.com/blog/2024-pricing-update',
   'date': 'Nov 19, 2024',
   'author': 'Rachel-Lee Nabors'},
  {'title': 'Get data from any page: AgentQL’s REST API Endpoint—Launch week day 5',
   'url': 'https://www.agentql.com/blog/data-rest-api',
   'date': 'Nov 15, 2024',
   'author': 'Rachel-Lee Nabors'}]}
```

### `GetWebElementBrowserTool`

- `prompt`：要在页面上查找的网页元素的自然语言描述。

```python
selector = await extract_web_element_tool.ainvoke({"prompt": "Next page button"})
selector
```

```text
"[tf623_id='194']"
```

```python
from langchain_community.tools.playwright import ClickTool

# Disabling 'visible_only' will allow us to click on elements that are not visible on the page
await ClickTool(async_browser=async_browser, visible_only=False).ainvoke(
    {"selector": selector}
)
```

```text
"Clicked element '[tf623_id='194']'"
```

```python
from langchain_community.tools.playwright import CurrentWebPageTool

await CurrentWebPageTool(async_browser=async_browser).ainvoke({})
```

```text
'https://www.agentql.com/blog/page/2'
```

## 链式调用

您可以在链中使用 AgentQL 工具，首先将其绑定到 [工具调用模型](/oss/javascript/langchain/tools/)，然后调用它：

### 实例化 LLM

```python
import os

os.environ["OPENAI_API_KEY"] = "YOUR_OPENAI_API_KEY"
```

```python
from langchain.chat_models import init_chat_model

model = init_chat_model(model="gpt-4o", model_provider="openai")
```

### 执行工具链

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableConfig, chain

prompt = ChatPromptTemplate(
    [
        ("system", "You are a helpful assistant in extracting data from website."),
        ("human", "{user_input}"),
        ("placeholder", "{messages}"),
    ]
)

# specifying tool_choice will force the model to call this tool.
model_with_tools = model.bind_tools(
    [extract_web_data_tool], tool_choice="extract_web_data_with_rest_api"
)

model_chain = prompt | model_with_tools

@chain
def tool_chain(user_input: str, config: RunnableConfig):
    input_ = {"user_input": user_input}
    ai_msg = model_chain.invoke(input_, config=config)
    tool_msgs = extract_web_data_tool.batch(ai_msg.tool_calls, config=config)
    return {"messages": tool_msgs}

tool_chain.invoke(
    "Extract data from https://www.agentql.com/blog using the following agentql query: { posts[] { title url date author } }"
)
```

```json
{'messages': [ToolMessage(content='{"data": {"posts": [{"title": "Launch Week Recap—make the web AI-ready", "url": "https://www.agentql.com/blog/2024-launch-week-recap", "date": "Nov 18, 2024", "author": "Rachel-Lee Nabors"}, {"title": "Accurate data extraction from PDFs and images with AgentQL", "url": "https://www.agentql.com/blog/accurate-data-extraction-pdfs-images", "date": "Feb 1, 2025", "author": "Rachel-Lee Nabors"}, {"title": "Introducing Scheduled Scraping Workflows", "url": "https://www.agentql.com/blog/scheduling", "date": "Dec 2, 2024", "author": "Rachel-Lee Nabors"}, {"title": "Updates to Our Pricing Model", "url": "https://www.agentql.com/blog/2024-pricing-update", "date": "Nov 19, 2024", "author": "Rachel-Lee Nabors"}, {"title": "Get data from any page: AgentQL’s REST API Endpoint—Launch week day 5", "url": "https://www.agentql.com/blog/data-rest-api", "date": "Nov 15, 2024", "author": "Rachel-Lee Nabors"}]}, "metadata": {"request_id": "1a84ed12-d02a-497d-b09d-21fe49342fa3", "generated_query": null, "screenshot": null}}', name='extract_web_data_with_rest_api', tool_call_id='call_z4Rl1MpjJZNcbLlq1OCneoMF')]}
```

## 在智能体中使用

您可以使用 `AgentQLBrowserToolkit` 将 AgentQL 工具与 AI 智能体一起使用。此工具包包括 `ExtractDataBrowserTool` 和 `GetWebElementBrowserTool`。以下是一个结合 AgentQL 工具包和 Playwright 工具的智能体浏览器操作示例。

### 实例化工具包

```python
from langchain_agentql.utils import create_async_playwright_browser

async_agent_browser = await create_async_playwright_browser()
```

```python
from langchain_agentql import AgentQLBrowserToolkit

agentql_tool
