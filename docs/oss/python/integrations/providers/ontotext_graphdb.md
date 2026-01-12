---
title: Ontotext GraphDB
---
>[Ontotext GraphDB](https://graphdb.ontotext.com/) 是一个符合 RDF 和 SPARQL 标准的图数据库和知识发现工具。

## 依赖项

通过以下命令安装 [rdflib](https://github.com/RDFLib/rdflib) 包：

::: code-group

```bash [pip]
pip install rdflib==7.0.0
```

```bash [uv]
uv add "rdflib==7.0.0"
```

:::

## 图问答链

将您的 GraphDB 数据库与聊天模型连接，以获取对数据的洞察。

请参阅此处的笔记本示例：[这里](/oss/python/integrations/graphs/ontotext)。

```python
from langchain_community.graphs import OntotextGraphDBGraph
from langchain_classic.chains import OntotextGraphDBQAChain
```
