---
title: DocArray
---
> [DocArray](https://docarray.jina.ai/) 是一个用于处理传输中的嵌套、非结构化、多模态数据的库，
> 包括文本、图像、音频、视频、3D网格等。它允许深度学习工程师通过 Pythonic API 高效地
> 处理、嵌入、搜索、推荐、存储和传输多模态数据。

## 安装与设置

我们需要安装 `docarray` Python 包。

::: code-group

```bash [pip]
pip install docarray
```

```bash [uv]
uv add docarray
```

:::

## 向量存储

LangChain 提供了对 `DocArray` 库中 `In-memory` 和 `HNSW` 向量存储的访问。

查看[使用示例](/oss/python/integrations/vectorstores/docarray_hnsw)。

```python
from langchain_community.vectorstores import DocArrayHnswSearch
```
查看[使用示例](/oss/python/integrations/vectorstores/docarray_in_memory)。

```python
from langchain_community.vectorstores DocArrayInMemorySearch
```

## 检索器

查看[使用示例](/oss/python/integrations/retrievers/docarray_retriever)。

```python
from langchain_community.retrievers import DocArrayRetriever
```
