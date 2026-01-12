---
title: ScrapeGraph AI
---
>[ScrapeGraph AI](https://scrapegraphai.com) 是一项提供 AI 驱动的网络抓取能力的服务。
它提供工具，用于提取结构化数据、将网页转换为 Markdown 以及使用自然语言提示处理本地 HTML 内容。

## 安装与设置

安装所需的包：

::: code-group

```bash [pip]
pip install langchain-scrapegraph
```

```bash [uv]
uv add langchain-scrapegraph
```

:::

设置您的 API 密钥：

```bash
export SGAI_API_KEY="your-scrapegraph-api-key"
```

## 工具

查看[使用示例](/oss/javascript/integrations/tools/scrapegraph)。

目前有四个可用的工具：

```python
from langchain_scrapegraph.tools import (
    SmartScraperTool,    # 从网站提取结构化数据
    SmartCrawlerTool,    # 通过爬虫从多个页面提取数据
    MarkdownifyTool,     # 将网页转换为 Markdown
    AgenticScraperTool,  # 通过指定步骤提取
    GetCreditsTool,      # 检查剩余的 API 积分
)
```

每个工具都有特定的用途：

- `SmartScraperTool`：给定 URL、提示和可选的输出模式，从网站提取结构化数据
- `SmartCrawlerTool`：通过高级爬虫选项（如深度控制、页面限制和域名限制）从多个页面提取数据
- `MarkdownifyTool`：将任何网页转换为干净的 Markdown 格式
- `AgenticScraperTool`：通过指定步骤提取
- `GetCreditsTool`：检查您剩余的 ScrapeGraph AI 积分
