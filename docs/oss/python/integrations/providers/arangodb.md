---
title: ArangoDB
---
>[ArangoDB](https://github.com/arangodb/arangodb) 是一个可扩展的图数据库系统，旨在更快地从关联数据中驱动价值。它通过单一查询语言，提供原生图、集成搜索引擎和 JSON 支持。ArangoDB 可以在本地、云端——任何地方运行。

## 安装与设置

使用以下命令安装 [ArangoDB Python 驱动](https://github.com/ArangoDB-Community/python-arango) 包：

::: code-group

```bash [pip]
pip install python-arango
```

```bash [uv]
uv add python-arango
```

:::

## 图问答链

将你的 `ArangoDB` 数据库与聊天模型连接，以获取数据洞察。

查看笔记本示例 [此处](/oss/integrations/graphs/arangodb)。

```python
from arango import ArangoClient

from langchain_community.graphs import ArangoGraph
from langchain_classic.chains import ArangoGraphQAChain
```
