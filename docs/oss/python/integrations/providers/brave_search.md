---
title: Brave 搜索
---
>[Brave Search](https://en.wikipedia.org/wiki/Brave_Search) 是由 Brave Software 开发的搜索引擎。
> - `Brave Search` 使用其自身的网络索引。截至 2022 年 5 月，它覆盖了超过 100 亿个页面，并且 92% 的搜索结果无需依赖任何第三方即可提供，其余部分则通过服务器端从 Bing API 检索，或（在用户选择加入的基础上）通过客户端从 Google 检索。据 Brave 称，该索引被“有意保持得比 Google 或 Bing 的索引更小”，以帮助避免垃圾邮件和其他低质量内容，其缺点是“在恢复长尾查询方面，Brave Search 目前还不及 Google”。
>- `Brave Search Premium`：截至 2023 年 4 月，Brave Search 是一个无广告网站，但它最终将切换到一个包含广告的新模式，而高级用户将获得无广告体验。默认情况下，包括 IP 地址在内的用户数据不会被收集。选择加入数据收集将需要高级账户。

## 安装与设置

要访问 Brave Search API，您需要[创建账户并获取 API 密钥](https://api.search.brave.com/app/dashboard)。

## 文档加载器

查看[使用示例](/oss/python/integrations/document_loaders/brave_search)。

```python
from langchain_community.document_loaders import BraveSearchLoader
```

## 工具

查看[使用示例](/oss/python/integrations/tools/brave_search)。

```python
from langchain.tools import BraveSearch
```
