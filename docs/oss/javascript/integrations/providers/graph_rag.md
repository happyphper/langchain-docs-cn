---
title: 图检索增强生成
---
## 概述

[Graph RAG](https://datastax.github.io/graph-rag/) 提供了一个检索器接口，它将向量上的**非结构化**相似性搜索与元数据属性的**结构化**遍历相结合。这使得能够对**现有**的向量存储进行基于图的检索。

## 安装与设置

::: code-group

```bash [pip]
pip install langchain-graph-retriever
```

```bash [uv]
uv add langchain-graph-retriever
```

:::

## 检索器

```python
from langchain_graph_retriever import GraphRetriever
```

更多信息，请参阅 [Graph RAG 集成指南](/oss/javascript/integrations/retrievers/graph_rag)。
