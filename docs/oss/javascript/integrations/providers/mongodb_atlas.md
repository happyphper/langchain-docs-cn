---
title: MongoDB Atlas
---
>[MongoDB Atlas](https://www.mongodb.com/docs/atlas/) 是一个完全托管的云数据库，可在 AWS、Azure 和 GCP 上使用。它现在支持对 MongoDB 文档数据进行原生向量搜索。

## 安装与设置

请参阅[详细配置说明](/oss/integrations/vectorstores/mongodb_atlas)。

我们需要安装 `langchain-mongodb` Python 包。

::: code-group

```bash [pip]
pip install langchain-mongodb
```

```bash [uv]
uv add langchain-mongodb
```

:::

## 向量存储

请参阅[使用示例](/oss/integrations/vectorstores/mongodb_atlas)。

```python
from langchain_mongodb import MongoDBAtlasVectorSearch
```

## 检索器

### 全文搜索检索器

>`Hybrid Search Retriever` 使用 Lucene 的标准 (`BM25`) 分析器执行全文搜索。

```python
from langchain_mongodb.retrievers import MongoDBAtlasFullTextSearchRetriever
```

### 混合搜索检索器

>`Hybrid Search Retriever` 结合了向量搜索和全文搜索，并通过 `Reciprocal Rank Fusion` (`RRF`) 算法对它们进行加权。

```python
from langchain_mongodb.retrievers import MongoDBAtlasHybridSearchRetriever
```

## 模型缓存

### MongoDBCache

这是一个在 MongoDB 中存储简单缓存的抽象。它不使用语义缓存，也不要求在生成前在集合上创建索引。

导入此缓存：

```python
from langchain_mongodb.cache import MongoDBCache
```

将此缓存与您的 LLM 一起使用：

```python
from langchain_core.globals import set_llm_cache

# 使用任何嵌入提供程序...
from tests.integration_tests.vectorstores.fake_embeddings import FakeEmbeddings

mongodb_atlas_uri = "<YOUR_CONNECTION_STRING>"
COLLECTION_NAME="<YOUR_CACHE_COLLECTION_NAME>"
DATABASE_NAME="<YOUR_DATABASE_NAME>"

set_llm_cache(MongoDBCache(
    connection_string=mongodb_atlas_uri,
    collection_name=COLLECTION_NAME,
    database_name=DATABASE_NAME,
))
```

### MongoDBAtlasSemanticCache

语义缓存允许用户根据用户输入与先前缓存结果之间的语义相似性来检索缓存的提示。在底层，它将 MongoDBAtlas 同时用作缓存和向量存储。
MongoDBAtlasSemanticCache 继承自 `MongoDBAtlasVectorSearch`，并且需要定义一个 Atlas 向量搜索索引才能工作。请查看[使用示例](/oss/integrations/vectorstores/mongodb_atlas)了解如何设置索引。

导入此缓存：

```python
from langchain_mongodb.cache import MongoDBAtlasSemanticCache
```

将此缓存与您的 LLM 一起使用：

```python
from langchain_core.globals import set_llm_cache

# 使用任何嵌入提供程序...
from tests.integration_tests.vectorstores.fake_embeddings import FakeEmbeddings

mongodb_atlas_uri = "<YOUR_CONNECTION_STRING>"
COLLECTION_NAME="<YOUR_CACHE_COLLECTION_NAME>"
DATABASE_NAME="<YOUR_DATABASE_NAME>"

set_llm_cache(MongoDBAtlasSemanticCache(
    embedding=FakeEmbeddings(),
    connection_string=mongodb_atlas_uri,
    collection_name=COLLECTION_NAME,
    database_name=DATABASE_NAME,
))
```
