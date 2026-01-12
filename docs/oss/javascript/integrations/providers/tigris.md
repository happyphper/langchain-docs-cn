---
title: Tigris
---
> [Tigris](https://tigrisdata.com) 是一个开源的 Serverless NoSQL 数据库和搜索平台，旨在简化构建高性能向量搜索应用。
> `Tigris` 消除了管理、操作和同步多个工具的基础设施复杂性，让您可以专注于构建出色的应用程序。

## 安装与设置

::: code-group

```bash [pip]
pip install tigrisdb openapi-schema-pydantic
```

```bash [uv]
uv add tigrisdb openapi-schema-pydantic
```

:::

## 向量存储

查看[使用示例](/oss/javascript/integrations/vectorstores/tigris)。

```python
from langchain_community.vectorstores import Tigris
```
