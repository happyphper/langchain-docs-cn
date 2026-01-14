---
title: ElasticSearch BM25
---
>[Elasticsearch](https://www.elastic.co/elasticsearch/) 是一个分布式的、RESTful 风格的搜索和分析引擎。它提供了一个分布式的、支持多租户的全文搜索引擎，具有 HTTP Web 接口和无模式（schema-free）的 JSON 文档。

>在信息检索领域，[Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25)（BM 是“最佳匹配”的缩写）是一种搜索引擎用来评估文档与给定搜索查询相关性的排序函数。它基于 Stephen E. Robertson、Karen Spärck Jones 等人在 20 世纪 70 和 80 年代开发的概率检索框架。

>实际排序函数的名称是 BM25。更完整的名称 Okapi BM25 包含了第一个使用它的系统名称，即 Okapi 信息检索系统，该系统于 20 世纪 80 和 90 年代在伦敦城市大学实现。BM25 及其较新的变体，例如 BM25F（一个可以考虑文档结构和锚文本的 BM25 版本），代表了用于文档检索的、类似于 TF-IDF 的检索函数。

本笔记本展示了如何使用一个结合了 `ElasticSearch` 和 `BM25` 的检索器。

有关 BM25 算法细节的更多信息，请参阅[这篇博客文章](https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables)。

```python
pip install -qU  elasticsearch
```

```python
from langchain_community.retrievers import (
    ElasticSearchBM25Retriever,
)
```

## 创建新的检索器

```python
elasticsearch_url = "http://localhost:9200"
retriever = ElasticSearchBM25Retriever.create(elasticsearch_url, "langchain-index-4")
```

```python
# 或者，您可以加载一个已存在的索引
# import elasticsearch
# elasticsearch_url="http://localhost:9200"
# retriever = ElasticSearchBM25Retriever(elasticsearch.Elasticsearch(elasticsearch_url), "langchain-index")
```

## 添加文本（如果需要）

我们可以选择性地向检索器添加文本（如果它们尚未在其中）

```python
retriever.add_texts(["foo", "bar", "world", "hello", "foo bar"])
```

```python
['cbd4cb47-8d9f-4f34-b80e-ea871bc49856',
 'f3bd2e24-76d1-4f9b-826b-ec4c0e8c7365',
 '8631bfc8-7c12-48ee-ab56-8ad5f373676e',
 '8be8374c-3253-4d87-928d-d73550a2ecf0',
 'd79f457b-2842-4eab-ae10-77aa420b53d7']
```

## 使用检索器

现在我们可以使用检索器了！

```python
result = retriever.invoke("foo")
```

```python
result
```

```python
[Document(page_content='foo', metadata={}),
 Document(page_content='foo bar', metadata={})]
```

```python

```
