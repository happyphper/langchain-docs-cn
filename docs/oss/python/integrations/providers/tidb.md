---
title: TiDB
---
> [TiDB Cloud](https://www.pingcap.com/tidb-serverless) 是一个全面的数据库即服务 (DBaaS) 解决方案，
> 提供专用和 Serverless 两种选项。`TiDB Serverless` 现在正在将内置的向量搜索功能集成到 MySQL 生态中。
> 通过此增强功能，您可以无缝地使用 `TiDB Serverless` 开发 AI 应用程序，而无需新的数据库或额外的
> 技术栈。创建一个免费的 TiDB Serverless 集群，并在 https://pingcap.com/ai 开始使用向量搜索功能。

## 安装与设置

您需要获取 TiDB 数据库的连接详细信息。
请访问 [TiDB Cloud](https://tidbcloud.com/) 以获取连接详细信息。

```bash
## 文档加载器

```python
from langchain_community.document_loaders import TiDBLoader
```
请参阅此处的详细信息 [here](/oss/integrations/document_loaders/tidb)。

## 向量存储

```python
from langchain_community.vectorstores import TiDBVectorStore
```
请参阅此处的详细信息 [here](/oss/python/integrations/vectorstores/tidb_vector)。
