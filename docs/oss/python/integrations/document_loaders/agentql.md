---
title: AgentQLLoader
---
[AgentQL](https://www.agentql.com/) 的文档加载器（document loader）能够使用 [AgentQL 查询](https://docs.agentql.com/agentql-query) 从任何网页提取结构化数据。AgentQL 可以跨多种语言和网页使用，并且不会因时间推移或网页变更而失效。

## 概述

`AgentQLLoader` 需要以下两个参数：

- `url`：你想要从中提取数据的网页 URL。
- `query`：要执行的 AgentQL 查询。了解更多关于[如何在文档中编写 AgentQL 查询](https://docs.agentql.com/agentql-query)的信息，或在 [AgentQL Playground](https://dev.agentql.com/playground) 中测试查询。

以下参数是可选的：

- `api_key`：来自 [dev.agentql.com](https://dev.agentql.com) 的 AgentQL API 密钥。**`可选`。**
- `timeout`：请求超时前等待的秒数。**默认为 `900`。**
- `is_stealth_mode_enabled`：是否启用实验性的反机器人规避策略。此功能可能无法在所有网站的所有时间都有效。启用此模式后，数据提取可能需要更长时间才能完成。**默认为 `False`。**
- `wait_for`：在提取数据前等待页面加载的秒数。**默认为 `0`。**
- `is_scroll_to_bottom_enabled`：是否在提取数据前滚动到页面底部。**默认为 `False`。**
- `mode`：`"standard"` 模式使用深度数据分析，而 `"fast"` 模式以牺牲部分分析深度为代价换取速度，适用于大多数用例。[在此指南中了解更多关于模式的信息。](https://docs.agentql.com/accuracy/standard-mode) **默认为 `"fast"`。**
- `is_screenshot_enabled`：是否在提取数据前截图。截图将以 Base64 字符串形式在 'metadata' 中返回。**默认为 `False`。**

AgentQLLoader 是通过 AgentQL 的 [REST API](https://docs.agentql.com/rest-api/api-reference) 实现的。

### 集成详情

| 类 | 包 | 本地 | 可序列化 | JS 支持 |
| :--- | :--- | :---: | :---: |  :---: |
| AgentQLLoader| langchain-agentql | ✅ | ❌ | ❌ |

### 加载器特性

| 来源 | 文档惰性加载 | 原生异步支持 |
| :---: | :---: | :---: |
| AgentQLLoader | ✅ | ❌ |

## 设置

要使用 AgentQL 文档加载器，你需要配置 `AGENTQL_API_KEY` 环境变量，或使用 `api_key` 参数。你可以从我们的[开发者门户](https://dev.agentql.com)获取 API 密钥。

### 安装

安装 **langchain-agentql**。

```python
pip install -qU langchain-agentql
```

### 设置凭证

```python
import os

os.environ["AGENTQL_API_KEY"] = "YOUR_AGENTQL_API_KEY"
```

## 初始化

接下来实例化你的模型对象：

```python
from langchain_agentql.document_loaders import AgentQLLoader

loader = AgentQLLoader(
    url="https://www.agentql.com/blog",
    query="""
    {
        posts[] {
            title
            url
            date
            author
        }
    }
    """,
    is_scroll_to_bottom_enabled=True,
)
```

## 加载

```python
docs = loader.load()
docs[0]
```

```text
Document(metadata={'request_id': 'bdb9dbe7-8a7f-427f-bc16-839ccc02cae6', 'generated_query': None, 'screenshot': None}, page_content="{'posts': [{'title': 'Launch Week Recap—make the web AI-ready', 'url': 'https://www.agentql.com/blog/2024-launch-week-recap', 'date': 'Nov 18, 2024', 'author': 'Rachel-Lee Nabors'}, {'title': 'Accurate data extraction from PDFs and images with AgentQL', 'url': 'https://www.agentql.com/blog/accurate-data-extraction-pdfs-images', 'date': 'Feb 1, 2025', 'author': 'Rachel-Lee Nabors'}, {'title': 'Introducing Scheduled Scraping Workflows', 'url': 'https://www.agentql.com/blog/scheduling', 'date': 'Dec 2, 2024', 'author': 'Rachel-Lee Nabors'}, {'title': 'Updates to Our Pricing Model', 'url': 'https://www.agentql.com/blog/2024-pricing-update', 'date': 'Nov 19, 2024', 'author': 'Rachel-Lee Nabors'}, {'title': 'Get data from any page: AgentQL’s REST API Endpoint—Launch week day 5', 'url': 'https://www.agentql.com/blog/data-rest-api', 'date': 'Nov 15, 2024', 'author': 'Rachel-Lee Nabors'}]}")
```

```python
print(docs[0].metadata)
```

```python
{'request_id': 'bdb9dbe7-8a7f-427f-bc16-839ccc02cae6', 'generated_query': None, 'screenshot': None}
```

## 惰性加载

`AgentQLLoader` 目前一次只加载一个 <a href="https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document" target="_blank" rel="noreferrer" class="link"><code>Document</code></a>。因此，`load()` 和 `lazy_load()` 的行为相同：

```python
pages = [doc for doc in loader.lazy_load()]
pages
```

```text
[Document(metadata={'request_id': '06273abd-b2ef-4e15-b0ec-901cba7b4825', 'generated_query': None, 'screenshot': None}, page_content="{'posts': [{'title': 'Launch Week Recap—make the web AI-ready', 'url': 'https://www.agentql.com/blog/2024-launch-week-recap', 'date': 'Nov 18, 2024', 'author': 'Rachel-Lee Nabors'}, {'title': 'Accurate data extraction from PDFs and images with AgentQL', 'url': 'https://www.agentql.com/blog/accurate-data-extraction-pdfs-images', 'date': 'Feb 1, 2025', 'author': 'Rachel-Lee Nabors'}, {'title': 'Introducing Scheduled Scraping Workflows', 'url': 'https://www.agentql.com/blog/scheduling', 'date': 'Dec 2, 2024', 'author': 'Rachel-Lee Nabors'}, {'title': 'Updates to Our Pricing Model', 'url': 'https://www.agentql.com/blog/2024-pricing-update', 'date': 'Nov 19, 2024', 'author': 'Rachel-Lee Nabors'}, {'title': 'Get data from any page: AgentQL’s REST API Endpoint—Launch week day 5', 'url': 'https://www.agentql.com/blog/data-rest-api', 'date': 'Nov 15, 2024', 'author': 'Rachel-Lee Nabors'}]}")]
```

---

## API 参考

有关如何使用此集成的更多信息，请参阅 [git 仓库](https://github.com/tinyfish-io/agentql-integrations/tree/main/langchain) 或 [langchain 集成文档](https://docs.agentql.com/integrations/langchain)。
