---
title: Zilliz
---
>[Zilliz Cloud](https://zilliz.com/doc/quick_start) 是一个完全托管的云端服务，用于 `LF AI Milvus®`。

## 安装与设置

安装 Python SDK：

::: code-group

```bash [pip]
pip install pymilvus
```

```bash [uv]
uv add pymilvus
```

:::

## 向量存储

Zilliz 索引的包装器，允许您将其用作向量存储，无论是用于语义搜索还是示例选择。

```python
from langchain_community.vectorstores import Milvus
```

有关 Milvus 包装器的更详细教程，请参阅 [此笔记本](/oss/python/integrations/vectorstores/zilliz)。
