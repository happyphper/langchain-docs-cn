---
title: StarRocks
---
>[StarRocks](https://www.starrocks.io/) 是一个高性能分析型数据库。
`StarRocks` 是面向全分析场景的新一代亚秒级 MPP 数据库，支持多维分析、实时分析和即席查询。

>通常 `StarRocks` 被归类为 OLAP 数据库，它在 [ClickBench — 分析型数据库管理系统基准测试](https://benchmark.clickhouse.com/) 中展现了卓越的性能。由于其拥有超快的向量化执行引擎，它也可以被用作一个快速的向量数据库。

## 安装与设置

::: code-group

```bash [pip]
pip install pymysql
```

```bash [uv]
uv add pymysql
```

:::

## 向量存储

查看 [使用示例](/oss/integrations/vectorstores/starrocks)。

```python
from langchain_community.vectorstores import StarRocks
```
