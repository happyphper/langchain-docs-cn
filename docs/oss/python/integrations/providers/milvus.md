---
title: Milvus
---
>[Milvus](https://milvus.io/docs/overview.md) 是一个用于存储、索引和管理由深度神经网络及其他机器学习（ML）模型生成的海量嵌入向量的数据库。

## 安装与设置

安装 Python SDK：

::: code-group

```bash [pip]
pip install langchain-milvus
```

```bash [uv]
uv add langchain-milvus
```

:::

## 向量存储

查看[使用示例](/oss/python/integrations/vectorstores/milvus)。

导入此向量存储：

```python
from langchain_milvus import Milvus
```
