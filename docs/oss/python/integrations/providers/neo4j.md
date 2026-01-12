---
title: Neo4j
---
>- Neo4j 是一个 `开源数据库管理系统`，专门用于图数据库技术。
>- Neo4j 允许您以节点和边的形式表示和存储数据，非常适合处理连接数据和关系。
>- Neo4j 提供了 `Cypher 查询语言`，使得与图数据交互和查询变得简单。
>- 使用 Neo4j，您可以实现高性能的 `图遍历和查询`，适用于生产级系统。

>请访问 [Neo4j 官网](https://neo4j.com/) 开始使用。

## 安装与设置

- 使用 `pip install neo4j langchain-neo4j` 安装 Python SDK

## VectorStore

Neo4j 向量索引被用作向量存储，无论是用于语义搜索还是示例选择。

```python
from langchain_neo4j import Neo4jVector
```

查看 [使用示例](/oss/python/integrations/vectorstores/neo4jvector)

## GraphCypherQAChain

存在一个围绕 Neo4j 图数据库的包装器，允许您根据用户输入生成 Cypher 语句，并用它们从数据库中检索相关信息。

```python
from langchain_neo4j import GraphCypherQAChain, Neo4jGraph
```

查看 [使用示例](/oss/python/integrations/graphs/neo4j_cypher)

## 从文本构建知识图谱

文本数据通常包含丰富的关系和洞察，这些信息对于各种分析、推荐引擎或知识管理应用程序非常有用。
Diffbot 的 NLP API 允许从非结构化文本数据中提取实体、关系和语义信息。
通过将 Diffbot 的 NLP API 与图数据库 Neo4j 结合，您可以根据从文本中提取的信息创建强大、动态的图结构。
这些图结构完全可查询，并且可以集成到各种应用程序中。

```python
from langchain_neo4j import Neo4jGraph
from langchain_experimental.graph_transformers.diffbot import DiffbotGraphTransformer
```

查看 [使用示例](/oss/python/integrations/graphs/diffbot)
