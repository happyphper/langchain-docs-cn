---
title: Memgraph
---
>Memgraph 是一款高性能的内存图数据库，专为实时查询和分析优化。
>访问 [Memgraph 官网](https://memgraph.com/) 开始使用。

## 安装与设置

- 使用 `pip install langchain-memgraph` 安装 Python SDK

## MemgraphQAChain

Memgraph 图数据库提供了一个封装器，允许您根据用户输入生成 Cypher 语句，并用它们从数据库中检索相关信息。

```python
from langchain_memgraph.chains.graph_qa import MemgraphQAChain
from langchain_memgraph.graphs.memgraph import MemgraphLangChain
```

查看 [使用示例](/oss/integrations/graphs/memgraph)

## 从非结构化数据构建知识图谱

您可以使用该集成从非结构化数据构建知识图谱。

```python
from langchain_memgraph.graphs.memgraph import MemgraphLangChain
from langchain_experimental.graph_transformers import LLMGraphTransformer
```

查看 [使用示例](/oss/integrations/graphs/memgraph)

## Memgraph 工具与工具包

Memgraph 还提供了一个工具包，允许您与 Memgraph 数据库进行交互。
查看 [使用示例](/oss/integrations/tools/memgraph)。

```python
from langchain_memgraph import MemgraphToolkit
```
