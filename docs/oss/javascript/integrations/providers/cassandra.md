---
title: Cassandra
---
> [Apache Cassandra®](https://cassandra.apache.org/) 是一个 NoSQL、面向行、高度可扩展且高可用的数据库。
> 从 5.0 版本开始，该数据库内置了[向量搜索功能](https://cassandra.apache.org/doc/trunk/cassandra/vector-search/overview.html)。

本页概述的集成可用于 `Cassandra` 以及其他兼容 CQL 的数据库，即那些使用 `Cassandra 查询语言` 协议的数据库。

## 安装与设置

安装以下 Python 包：

::: code-group

```bash [pip]
pip install "cassio>=0.1.6"
```

```bash [uv]
uv add "cassio>=0.1.6"
```

:::

## 向量存储

```python
from langchain_community.vectorstores import Cassandra
```

了解更多信息，请参阅[示例笔记本](/oss/javascript/integrations/vectorstores/cassandra)。

## LLM 缓存

```python
from langchain.globals import set_llm_cache
from langchain_community.cache import CassandraCache
set_llm_cache(CassandraCache())
```

## 语义 LLM 缓存

```python
from langchain.globals import set_llm_cache
from langchain_community.cache import CassandraSemanticCache
set_llm_cache(CassandraSemanticCache(
    embedding=my_embedding,
    table_name="my_store",
))
```

## 文档加载器

```python
from langchain_community.document_loaders import CassandraLoader
```

了解更多信息，请参阅[示例笔记本](/oss/javascript/integrations/document_loaders/cassandra)。

#### 归属声明

> Apache Cassandra、Cassandra 和 Apache 是 [Apache Software Foundation](http://www.apache.org/) 在美国和/或其他国家的注册商标或商标。

## 工具包

`Cassandra 数据库工具包` 使 AI 工程师能够高效地将智能体与 Cassandra 数据集成。

```python
from langchain_community.agent_toolkits.cassandra_database.toolkit import (
    CassandraDatabaseToolkit,
)
```

了解更多信息，请参阅[示例笔记本](/oss/javascript/integrations/tools/cassandra_database)。

Cassandra 数据库独立工具：

### 获取模式

用于获取 Apache Cassandra 数据库中键空间（keyspace）模式的工具。

```python
from langchain_community.tools import GetSchemaCassandraDatabaseTool
```

### 获取表数据

用于从 Apache Cassandra 数据库表中获取数据的工具。

```python
from langchain_community.tools import GetTableDataCassandraDatabaseTool
```

### 查询

用于使用提供的 CQL 查询 Apache Cassandra 数据库的工具。

```python
from langchain_community.tools import QueryCassandraDatabaseTool
```
