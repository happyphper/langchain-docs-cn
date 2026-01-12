---
title: Kùzu
---
> [Kùzu](https://kuzudb.com/) 是一个可嵌入、可扩展、速度极快的图数据库。
> 它采用宽松的 MIT 许可证，您可以在[这里](https://github.com/kuzudb/kuzu)查看其源代码。

> Kùzu 的主要特点：
>- **性能与可扩展性**：为图数据实现了现代、最先进的连接算法。
>- **易用性**：由于采用无服务器（嵌入式）架构，设置和上手非常容易。
>- **互操作性**：可以方便地从外部列式格式、CSV、JSON 和关系数据库中扫描和复制数据。
>- **结构化属性图模型**：实现了属性图模型，并增加了结构。
>- **Cypher 支持**：允许使用声明式查询语言 Cypher 方便地查询图。

> 访问其[文档](https://docs.kuzudb.com/)开始使用 Kùzu。

## 安装与设置

按如下方式安装 Python SDK：

::: code-group

```bash [pip]
pip install -U langchain-kuzu
```

```bash [uv]
uv add langchain-kuzu
```

:::

## 使用方法

## 图

查看[使用示例](/oss/javascript/integrations/graphs/kuzu_db)。

```python
from langchain_kuzu.graphs.kuzu_graph import KuzuGraph
```

## 链

查看[使用示例](/oss/javascript/integrations/graphs/kuzu_db/#creating-kuzuqachain)。

```python
from langchain_kuzu.chains.graph_qa.kuzu import KuzuQAChain
```
