---
title: FalkorDB
---
>什么是 `FalkorDB`？

>- FalkorDB 是一个专注于图数据库技术的 `开源数据库管理系统`。
>- FalkorDB 允许您以节点和边的形式表示和存储数据，使其非常适合处理连接数据和关系。
>- FalkorDB 支持带有专有扩展的 OpenCypher 查询语言，使得与图数据交互和查询变得容易。
>- 使用 FalkorDB，您可以实现高性能的 `图遍历和查询`，适用于生产级系统。

>请访问 [其官方网站](https://docs.falkordb.com/) 开始使用 FalkorDB。

## 安装与设置

- 使用 `pip install falkordb langchain-falkordb` 安装 Python SDK。

## VectorStore

FalkorDB 向量索引用作向量存储，无论是用于语义搜索还是示例选择。

```python
from langchain_community.vectorstores.falkordb_vector import FalkorDBVector
```

或

```python
from langchain_falkordb.vectorstore import FalkorDBVector
```

查看 [使用示例](/oss/javascript/integrations/vectorstores/falkordbvector.ipynb)
