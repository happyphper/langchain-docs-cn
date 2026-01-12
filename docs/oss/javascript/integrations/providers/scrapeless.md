---
title: 无痕抓取
---
[Scrapeless](https://scrapeless.com) 提供灵活且功能丰富的数据采集服务，支持广泛的参数自定义和多格式导出。

## 安装与设置

::: code-group

```bash [pip]
pip install langchain-scrapeless
```

```bash [uv]
uv add langchain-scrapeless
```

:::

你需要设置你的 Scrapeless API 密钥：

```python
import os
os.environ["SCRAPELESS_API_KEY"] = "your-api-key"
```

## 工具

Scrapeless 集成提供了多种工具：

- [ScrapelessDeepSerpGoogleSearchTool](/oss/javascript/integrations/tools/scrapeless_scraping_api) - 支持全面提取 Google SERP 中所有结果类型的数据。
- [ScrapelessDeepSerpGoogleTrendsTool](/oss/javascript/integrations/tools/scrapeless_scraping_api) - 从 Google 检索关键词趋势数据，包括随时间变化的流行度、区域兴趣度和相关搜索。
- [ScrapelessUniversalScrapingTool](/oss/javascript/integrations/tools/scrapeless_universal_scraping) - 访问并提取通常屏蔽机器人的 JS-Render 网站的数据。
- [ScrapelessCrawlerCrawlTool](/oss/javascript/integrations/tools/scrapeless_crawl) - 爬取网站及其链接页面以提取全面数据。
- [ScrapelessCrawlerScrapeTool](/oss/javascript/integrations/tools/scrapeless_crawl) - 从单个网页提取信息。
