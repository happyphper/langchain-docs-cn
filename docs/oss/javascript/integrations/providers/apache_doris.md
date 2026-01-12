---
title: Apache Doris
---
>[Apache Doris](https://doris.apache.org/) 是一个用于实时分析的现代化数据仓库。
它能够大规模地对实时数据进行极速分析。

>通常，`Apache Doris` 被归类为 OLAP 系统，并且在 [ClickBench — 分析型数据库管理系统基准测试](https://benchmark.clickhouse.com/) 中展现了卓越的性能。
> 由于其拥有超快的向量化执行引擎，它也可以被用作一个快速的向量数据库。

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

查看 [使用示例](/oss/javascript/integrations/vectorstores/apache_doris)。

```python
from langchain_community.vectorstores import ApacheDoris
```
