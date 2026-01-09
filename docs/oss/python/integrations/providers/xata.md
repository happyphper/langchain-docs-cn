---
title: Xata
---
> [Xata](https://xata.io) 是一个基于 `PostgreSQL` 的无服务器数据平台。
> 它提供了用于与数据库交互的 Python SDK，以及用于管理数据的 UI。
> `Xata` 具有原生的向量类型，可以添加到任何表中，并支持相似性搜索。LangChain 直接将向量插入到 `Xata` 中，并查询给定向量的最近邻，因此您可以将所有 LangChain 嵌入集成与 `Xata` 一起使用。

## 安装与设置

我们需要安装 `xata` Python 包。

::: code-group

```bash [pip]
pip install xata==1.0.0a7
```

```bash [uv]
uv add "xata==1.0.0a7"
```

:::

## 向量存储

查看[使用示例](/oss/integrations/vectorstores/xata)。

```python
from langchain_community.vectorstores import XataVectorStore
```
