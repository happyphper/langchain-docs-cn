---
title: Spider
---
[Spider](https://spider.cloud/?ref=langchainjs) 是[速度最快](https://github.com/spider-rs/spider/blob/main/benches/BENCHMARKS.md#benchmark-results)的网络爬虫。它可以将任何网站转换为纯 HTML、Markdown、元数据或文本，同时允许您使用 AI 执行自定义操作进行爬取。

## 概述

Spider 允许您使用高性能代理来防止被检测，缓存 AI 操作，通过 Webhook 获取爬取状态，安排定时爬取任务等。

本指南展示了如何使用 [Spider](https://spider.cloud/) 来爬取/抓取网站，并使用 LangChain 中的 `SpiderLoader` 加载可供 LLM 使用的文档。

## 设置

在 [spider.cloud](https://spider.cloud/) 获取您自己的 Spider API 密钥。

## 用法

以下是如何使用 `SpiderLoader` 的示例：

Spider 提供两种抓取模式：`scrape` 和 `crawl`。`scrape` 仅获取所提供 URL 的内容，而 `crawl` 则获取所提供 URL 的内容并进一步爬取其子页面。

```typescript
import { SpiderLoader } from "@langchain/community/document_loaders/web/spider";

const loader = new SpiderLoader({
  url: "https://spider.cloud", // 要抓取的 URL
  apiKey: process.env.SPIDER_API_KEY, // 可选，默认为您环境变量中的 `SPIDER_API_KEY`
  mode: "scrape", // 运行爬虫的模式。可以是 "scrape"（针对单个 URL）或 "crawl"（用于深度抓取，跟随子页面）
  // params: {
  //   // 基于 Spider API 文档的可选参数
  //   // API 文档请访问 https://spider.cloud/docs/api
  // },
});

const docs = await loader.load();
```

### 附加参数

有关所有可用 `params` 的详细信息，请参阅 [Spider 文档](https://spider.cloud/docs/api)。
