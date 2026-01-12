---
title: Qdrant
---
>[Qdrant](https://qdrant.tech/documentation/)（读作：quadrant）是一个向量相似性搜索引擎。
> 它提供了一个生产就绪的服务，具有便捷的 API，用于存储、搜索和管理
> 点（points）—— 带有额外有效载荷（payload）的向量。`Qdrant` 专为扩展的过滤支持而设计。

## 安装与设置

安装 Python 合作伙伴包：

::: code-group

```bash [pip]
pip install langchain-qdrant
```

```bash [uv]
uv add langchain-qdrant
```

:::

## 嵌入模型

### FastEmbedSparse

```python
from langchain_qdrant import FastEmbedSparse
```

### SparseEmbeddings

```python
from langchain_qdrant import SparseEmbeddings
```

## 向量存储

存在一个围绕 `Qdrant` 索引的包装器，允许你将其用作向量存储，
无论是用于语义搜索还是示例选择。

导入此向量存储：

```python
from langchain_qdrant import QdrantVectorStore
```

关于 Qdrant 包装器的更详细演练，请参阅 [此笔记本](/oss/python/integrations/vectorstores/qdrant)
