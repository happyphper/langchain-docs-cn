---
title: Chroma
---
>[Chroma](https://docs.trychroma.com/getting-started) 是一个用于构建基于嵌入（embeddings）的 AI 应用程序的数据库。

## 安装与设置

::: code-group

```bash [pip]
pip install langchain-chroma
```

```bash [uv]
uv add langchain-chroma
```

:::

## VectorStore

Chroma 向量数据库提供了一个包装器（wrapper），允许你将其用作向量存储（vectorstore），无论是用于语义搜索还是示例选择。

```python
from langchain_chroma import Chroma
```

关于 Chroma 包装器的更详细教程，请参阅 [此笔记本](/oss/python/integrations/vectorstores/chroma)。

## Retriever

```python
from langchain_classic.retrievers import SelfQueryRetriever
```
