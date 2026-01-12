---
title: TigerGraph
---
>[TigerGraph](https://www.tigergraph.com/tigergraph-db/) 是一个原生分布式的高性能图数据库。
> 以顶点和边的图格式存储数据，能够形成丰富的关系，
> 非常适合作为 LLM 响应的知识基础。

## 安装与设置

请按照 [如何连接到 `TigerGraph` 数据库](https://docs.tigergraph.com/pytigergraph/current/getting-started/connection) 的说明进行操作。

安装 Python SDK：

::: code-group

```bash [pip]
pip install pyTigerGraph
```

```bash [uv]
uv add pyTigerGraph
```

:::

## 图存储

### TigerGraph

查看 [使用示例](/oss/javascript/integrations/graphs/tigergraph)。

```python
from langchain_community.graphs import TigerGraph
```
