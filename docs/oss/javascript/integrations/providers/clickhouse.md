---
title: ClickHouse
---
> [ClickHouse](https://clickhouse.com/) 是一个快速且资源高效的开源数据库，适用于实时应用和分析，它提供完整的 SQL 支持以及丰富的函数集，帮助用户编写分析查询。
> 它具备数据结构和距离搜索函数（如 `L2Distance`），并支持[近似最近邻搜索索引](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/annindexes)。
> 这使得 ClickHouse 能够作为一个高性能、可扩展的向量数据库，使用 SQL 来存储和搜索向量。

## 安装与设置

我们需要安装 `clickhouse-connect` Python 包。

::: code-group

```bash [pip]
pip install clickhouse-connect
```

```bash [uv]
uv add clickhouse-connect
```

:::

## 向量存储

查看[使用示例](/oss/javascript/integrations/vectorstores/clickhouse)。

```python
from langchain_community.vectorstores import Clickhouse, ClickhouseSettings
```
