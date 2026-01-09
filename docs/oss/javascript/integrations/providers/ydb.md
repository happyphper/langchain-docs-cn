---
title: YDB
---
所有与 YDB 相关的功能。

> [YDB](https://ydb.tech/) 是一个多功能开源分布式 SQL 数据库，它结合了
> 高可用性和可扩展性，以及强一致性和 ACID 事务。
> 它可以同时处理事务型（OLTP）、分析型（OLAP）和流式工作负载。

## 安装与设置

::: code-group

```bash [pip]
pip install langchain-ydb
```

```bash [uv]
uv add langchain-ydb
```

:::

## 向量存储

要导入 YDB 向量存储：

```python
from langchain_ydb.vectorstores import YDB
```

关于 YDB 向量存储的更详细指南，请参阅 [此笔记本](/oss/integrations/vectorstores/ydb)。
