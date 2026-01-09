---
title: DuckDB
---
>[DuckDB](https://duckdb.org/) 是一个进程内的 SQL OLAP 数据库管理系统。

## 安装与设置

首先，你需要安装 `duckdb` Python 包。

::: code-group

```bash [pip]
pip install duckdb
```

```bash [uv]
uv add duckdb
```

:::

## 文档加载器

```python
from langchain_community.document_loaders import DuckDBLoader
```
