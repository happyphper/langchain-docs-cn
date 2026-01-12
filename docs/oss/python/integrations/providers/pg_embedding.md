---
title: Postgres 嵌入
---
> [pg_embedding](https://github.com/neondatabase/pg_embedding) 是一个开源包，用于使用 `Postgres` 和 `Hierarchical Navigable Small Worlds` 算法进行近似最近邻搜索，以实现向量相似度搜索。

## 安装与设置

我们需要安装几个 Python 包。

::: code-group

```bash [pip]
pip install psycopg2-binary
```

```bash [uv]
uv add psycopg2-binary
```

:::

## 向量存储

查看[使用示例](/oss/python/integrations/vectorstores/pgembedding)。

```python
from langchain_community.vectorstores import PGEmbedding
```
