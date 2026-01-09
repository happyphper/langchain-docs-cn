---
title: AnalyticDB
---
>[AnalyticDB for PostgreSQL](https://www.alibabacloud.com/help/en/analyticdb-for-postgresql/latest/product-introduction-overview)
> 是 [阿里云](https://www.alibabacloud.com/) 提供的一种大规模并行处理 (MPP) 数据仓库服务，
> 专为在线分析海量数据而设计。

>`AnalyticDB for PostgreSQL` 基于开源的 `Greenplum Database` 项目开发，
> 并由 `阿里云` 进行了深度扩展和增强。AnalyticDB for PostgreSQL 兼容 ANSI SQL 2003 语法以及
> PostgreSQL 和 Oracle 数据库生态系统。AnalyticDB for PostgreSQL 同时支持行存储和列存储。
> 它能够高性能地离线处理 PB 级数据，并支持高并发访问。

本页介绍如何在 LangChain 中使用 AnalyticDB 生态系统。

## 安装与设置

你需要安装 `sqlalchemy` Python 包。

::: code-group

```bash [pip]
pip install sqlalchemy
```

```bash [uv]
uv add sqlalchemy
```

:::

## VectorStore

查看 [使用示例](/oss/integrations/vectorstores/analyticdb)。

```python
from langchain_community.vectorstores import AnalyticDB
```
