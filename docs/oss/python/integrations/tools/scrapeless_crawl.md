---
title: 无痕爬取
---
[**Scrapeless**](https://www.scrapeless.com/) 提供灵活且功能丰富的数据获取服务，支持广泛的参数定制和多格式导出。这些能力使 LangChain 能够更有效地集成和利用外部数据。其核心功能模块包括：

**DeepSerp**

- **Google 搜索**：支持全面提取所有结果类型的 Google SERP 数据。
  - 支持选择本地化的 Google 域名（例如 `google.com`、`google.ad`）以获取特定区域的搜索结果。
  - 支持分页，可获取第一页之后的结果。
  - 支持搜索结果过滤开关，用于控制是否排除重复或相似内容。
- **Google 趋势**：从 Google 检索关键词趋势数据，包括随时间变化的流行度、区域兴趣度和相关搜索。
  - 支持多关键词对比。
  - 支持多种数据类型：`interest_over_time`、`interest_by_region`、`related_queries` 和 `related_topics`。
  - 允许按特定 Google 属性（网页、YouTube、新闻、购物）进行过滤，以进行特定来源的趋势分析。

**通用抓取**

- 专为现代、JavaScript 密集的网站设计，允许提取动态内容。
  - 支持全球优质代理，用于绕过地理限制并提高可靠性。

**爬虫**

- **爬取**：递归爬取网站及其链接页面，以提取全站内容。
  - 支持可配置的爬取深度和限定范围的 URL 目标。
- **抓取**：高精度地从单个网页提取内容。
  - 支持“仅主要内容”提取，以排除广告、页脚和其他非必要元素。
  - 允许批量抓取多个独立的 URL。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | JS 支持 | 版本 |
| :--- | :--- | :---: | :---: | :---: |
| [ScrapelessCrawlerScrapeTool](https://pypi.org/project/langchain-scrapeless/) | [langchain-scrapeless](https://pypi.org/project/langchain-scrapeless/) | ✅ | ❌ |  ![PyPI - Version](https://img.shields.io/pypi/v/langchain-scrapeless?style=flat-square&label=%20) |
| [ScrapelessCrawlerCrawlTool](https://pypi.org/project/langchain-scrapeless/) | [langchain-scrapeless](https://pypi.org/project/langchain-scrapeless/) | ✅ | ❌ |  ![PyPI - Version](https://img.shields.io/pypi/v/langchain-scrapeless?style=flat-square&label=%20) |

### 工具特性

|原生异步|返回工件|返回数据|
|:-:|:-:|:-:|
|✅|✅|markdown, rawHtml, screenshot@fullPage, json, links, screenshot, html|

## 设置

该集成位于 `langchain-scrapeless` 包中。
!pip install langchain-scrapeless

### 凭证

您需要一个 Scrapeless API 密钥才能使用此工具。您可以将其设置为环境变量：

```python
import os

os.environ["SCRAPELESS_API_KEY"] = "your-api-key"
```

## 实例化

### ScrapelessCrawlerScrapeTool

ScrapelessCrawlerScrapeTool 允许您使用 Scrapeless 的 Crawler Scrape API 从一个或多个网站抓取内容。您可以提取主要内容、控制格式、请求头、等待时间和输出类型。

该工具接受以下参数：

- `urls` （必需，List[str]）：要抓取的一个或多个网站的 URL。
- `formats` （可选，List[str]）：定义抓取输出的格式。默认为 `['markdown']`。选项包括：
  - `'markdown'`
  - `'rawHtml'`
  - `'screenshot@fullPage'`
  - `'json'`
  - `'links'`
  - `'screenshot'`
  - `'html'`
- `only_main_content` （可选，bool）：是否仅返回页面主要内容，排除页眉、导航栏、页脚等。默认为 True。
- `include_tags` （可选，List[str]）：要包含在输出中的 HTML 标签列表（例如 `['h1', 'p']`）。如果设置为 None，则不显式包含任何标签。
- `exclude_tags` （可选，List[str]）：要从输出中排除的 HTML 标签列表。如果设置为 None，则不显式排除任何标签。
- `headers` （可选，Dict[str, str]）：随请求发送的自定义请求头（例如用于 Cookie 或 User-Agent）。默认为 None。
- `wait_for` （可选，int）：抓取前的等待时间（毫秒）。用于给页面时间完全加载。默认为 `0`。
- `timeout` （可选，int）：请求超时时间（毫秒）。默认为 `30000`。

### ScrapelessCrawlerCrawlTool

ScrapelessCrawlerCrawlTool 允许您使用 Scrapeless 的 Crawler Crawl API 从基础 URL 开始爬取网站。它支持 URL 的高级过滤、爬取深度控制、内容抓取选项、请求头自定义等。

该工具接受以下参数：

- `url` （必需，str）：开始爬取的基础 URL。

- `limit` （可选，int）：要爬取的最大页面数。默认为 `10000`。
- `include_paths` （可选，List[str]）：URL 路径名正则表达式模式，用于在爬取中包含匹配的 URL。只有匹配这些模式的 URL 才会被包含。例如，设置 `["blog/.*"]` 将仅包含 `/blog/` 路径下的 URL。默认为 None。
- `exclude_paths` （可选，List[str]）：URL 路径名正则表达式模式，用于从爬取中排除匹配的 URL。例如，设置 `["blog/.*"]` 将排除 `/blog/` 路径下的 URL。默认为 None。
- `max_depth` （可选，int）：相对于基础 URL 的最大爬取深度，通过 URL 路径中的斜杠数量衡量。默认为 `10`。
- `max_discovery_depth` （可选，int）：基于发现顺序的最大爬取深度。根页面和站点地图页面深度为 `0`。例如，设置为 `1` 并忽略站点地图将仅爬取输入的 URL 及其直接链接。默认为 None。
- `ignore_sitemap` （可选，bool）：爬取期间是否忽略网站站点地图。默认为 False。
- `ignore_query_params` （可选，bool）：是否忽略查询参数差异以避免重复抓取相似 URL。默认为 False。
- `deduplicate_similar_urls` （可选，bool）：是否对相似 URL 进行去重。默认为 True。
- `regex_on_full_url` （可选，bool）：正则表达式匹配是否应用于完整 URL 而不仅仅是路径。默认为 True。
- `allow_backward_links` （可选，bool）：是否允许爬取 URL 层次结构之外的回链。默认为 False。
- `allow_external_links` （可选，bool）：是否允许爬取指向外部网站的链接。默认为 False。
- `delay` （可选，int）：页面抓取之间的延迟（秒），以遵守速率限制。默认为 `1`。
- `formats` （可选，List[str]）：抓取内容的格式。默认为 ["markdown"]。选项包括：
  - `'markdown'`
  - `'rawHtml'`
  - `'screenshot@fullPage'`
  - `'json'`
  - `'links'`
  - `'screenshot'`
  - `'html'`
- `only_main_content` （可选，bool）：是否仅返回主要内容，排除页眉、导航栏、页脚等。默认为 True。
- `include_tags` （可选，List[str]）：要包含在输出中的 HTML 标签列表（例如 `['h1', 'p']`）。默认为 None（无显式包含过滤器）。
- `exclude_tags` （可选，List[str]）：要从输出中排除的 HTML 标签列表。默认为 None（无显式排除过滤器）。
- `headers` （可选，Dict[str, str]）：随请求发送的自定义 HTTP 请求头，例如 Cookie 或 User-Agent 字符串。默认为 None。
- `wait_for` （可选，int）：抓取内容前的等待时间（毫秒），允许页面完全加载。默认为 `0`。
- `timeout` （可选，int）：请求超时时间（毫秒）。默认为 `30000`。

## 调用

### ScrapelessCrawlerCrawlTool

#### 带参数使用

```python
from langchain_scrapeless import ScrapelessCrawlerCrawlTool

tool = ScrapelessCrawlerCrawlTool()

# 高级用法
result = tool.invoke({"url": "https://exmaple.com", "limit": 4})
print(result)
```

```python
{'success': True, 'status': 'completed', 'completed': 1, 'total': 1, 'data': [{'markdown': '# Well hello there.\n\nWelcome to exmaple.com.\n\nChances are you got here by mistake (example.com, anyone?)', 'metadata': {'scrapeId': '547b2478-a41a-4a17-8015-8db378ee455f', 'sourceURL': 'https://exmaple.com', 'url': 'https://exmaple.com', 'statusCode': 200}}]}
```

#### 在智能体中使用

```python
from langchain_openai import ChatOpenAI
from langchain_scrapeless import ScrapelessCrawlerCrawlTool
from langchain.agents import create_agent

model = ChatOpenAI()

tool = ScrapelessCrawlerCrawlTool()

# 在智能体中使用该工具
tools = [tool]
agent = create_agent(model, tools)

for chunk in agent.stream(
    {
        "messages": [
            (
                "human",
                "Use the scrapeless crawler crawl tool to crawl the website https://example.com and output the markdown content as a string.",
            )
        ]
    },
    stream_mode="values",
):
    chunk["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

Use the scrapeless crawler crawl tool to crawl the website https://example.com and output the markdown content as a string.
================================== Ai Message ==================================
Tool Calls:
  scrapeless_crawler_crawl (call_Ne5HbxqsYDOKFaGDSuc4xppB)
 Call ID: call_Ne5HbxqsYDOKFaGDSuc4xppB
  Args:
    url: https://example.com
    formats: ['markdown']
    limit: 1
================================= Tool Message =================================
Name: scrapeless_crawler_crawl

{"success": true, "status": "completed", "completed": 1, "total": 1, "data": [{"markdown": "# Example Domain\n\nThis domain is for use in illustrative examples in documents. You may use this\ndomain in literature without prior coordination or asking for permission.\n\n[More information...](https://www.iana.org/domains/example)", "metadata": {"viewport": "width=device-width, initial-scale=1", "title": "Example Domain", "scrapeId": "00561460-9166-492b-8fed-889667383e55", "sourceURL": "https://example.com", "url": "https://example.com", "statusCode": 200}}]}
================================== Ai Message ==================================

The crawl of the website https://example.com has been completed. Here is the markdown content extracted from the website:

\`\`\`
# Example Domain

This domain is for use in illustrative examples in documents. You may use this
domain in literature without prior coordination or asking for permission.

[More information...](https://www.iana.org/domains/example)
\`\`\`

You can find more information on the website [here](https://www.iana.org/domains/example).
```

### ScrapelessCrawlerScrapeTool

#### 带参数使用

```python
from langchain_scrapeless import ScrapelessDeepSerpGoogleTrendsTool

tool = ScrapelessDeepSerpGoogleTrendsTool()

# 基本用法
result = tool.invoke("Funny 2048,negamon monster trainer")
print(result)
```

```python
{'parameters': {'engine': 'google.trends.search', 'hl': 'en', 'data_type': 'INTEREST_OVER_TIME', 'tz': '0', 'cat': '0', 'date': 'today 1-m', 'q': 'Funny 2048,negamon monster trainer'}, 'interest_over_time': {'timeline_data': [{'date': 'Jul 11, 2025', 'timestamp': '1752192000', 'value': [0, 0]}, {'date': 'Jul 12, 2025', 'timestamp': '1752278400', 'value': [0, 0]}, {'date': 'Jul 13, 2025', 'timestamp': '1752364800', 'value': [0, 0]}, {'date': 'Jul 14, 2025', 'timestamp': '1752451200', 'value': [0, 0]}, {'date': 'Jul 15, 2025', 'timestamp': '1752537600', 'value': [0, 0]}, {'date': 'Jul 16, 2025', 'timestamp': '1752624000', 'value': [0, 0]}, {'date': 'Jul 17, 2025', 'timestamp': '1752710400', 'value': [0, 0]}, {'date': 'Jul 18, 2025', 'timestamp': '1752796800', 'value': [0, 0]}, {'date': 'Jul 19, 2025', 'timestamp': '1752883200', 'value': [0, 0]}, {'date': 'Jul 20, 2025', 'timestamp': '1752969600', 'value': [0, 0]}, {'date': 'Jul 21, 2025', 'timestamp': '1753056000', 'value': [0, 0]}, {'date': 'Jul 22, 2025', 'timestamp': '1753142400', 'value': [0, 0]}, {'date': 'Jul 23, 2025', 'timestamp': '1753228800', 'value': [0, 0]}, {'date': 'Jul 24, 2025', 'timestamp': '1753315200', 'value': [0, 0]}, {'date': 'Jul 25, 2025', 'timestamp': '1753401600', 'value': [0, 0]}, {'date': 'Jul 26, 2025', 'timestamp': '1753488000', 'value': [0, 0]}, {'date': 'Jul 27, 2025', 'timestamp': '1753574400', 'value': [0, 0]}, {'date': 'Jul 28, 2025', 'timestamp': '1753660800', 'value': [0, 0]}, {'date': 'Jul 29, 2025', 'timestamp': '1753747200', 'value': [0, 0]}, {'date': 'Jul 30, 2025', 'timestamp': '1753833600', 'value': [0, 0]}, {'date': 'Jul 31, 2025', 'timestamp': '1753920000', 'value': [0, 0]}, {'date': 'Aug 1, 2025', 'timestamp': '1754006400', 'value': [0, 0]}, {'date': 'Aug 2, 2025', 'timestamp': '1754092800', 'value': [0, 0]}, {'date': 'Aug 3, 2025', 'timestamp': '1754179200', 'value': [0, 0]}, {'date': 'Aug 4, 2025', 'timestamp': '1754265600', 'value': [0, 0]}, {'date': 'Aug 5, 2025', 'timestamp': '1754352000', 'value': [0, 0]}, {'date': 'Aug 6, 2025', 'timestamp': '1754438400', 'value': [0, 0]}, {'date': 'Aug 7, 2025', 'timestamp': '1754524800', 'value': [0, 0]}, {'date': 'Aug 8, 2025', 'timestamp': '1754611200', 'value': [0, 0]}, {'date': 'Aug 9, 2025', 'timestamp': '1754697600', 'value': [0, 0]}, {'date': 'Aug 10, 2025', 'timestamp': '1754784000', 'value': [0, 100]}, {'date': 'Aug 11, 2025', 'timestamp': '1754870400', 'value': [0, 0]}], 'averages': [{'value': 0}, {'value': 3}], 'isPartial': True}}
```

#### 带参数的高级用法

```python
from langchain_scrapeless import ScrapelessCrawlerScrapeTool

tool = ScrapelessCrawlerScrapeTool()

result = tool.invoke(
    {
        "urls": ["https://exmaple.com", "https://www.scrapeless.com/en"],
        "formats": ["markdown"],
    }
)
print(result)
```

```python
{'success': True, 'status': 'completed', 'completed': 1, 'total': 1, 'data': [{'markdown': "[🩵 Don't just take our word for it. See what our users say on Product Hunt.](https://www.producthunt.com/posts/scrapeless-deep-serpapi)\n\n# Effortless Web Scraping Toolkit  for Business and Developers\n\nThe ultimate scraper's companion: an expandable suite of tools, including\n\nScraping Browser, Scraping API, Universal Scraping API\n\nand Anti-Bot Solutions—designed to work together or independently.\n\n[**4.8**](https://www.g2.com/products/scrapeless/reviews) [**4.5**](https://www.trustpilot.com/re
