---
title: Vespa
---
>[Vespa](https://vespa.ai/) 是一个功能齐全的搜索引擎和向量数据库。
> 它支持向量搜索（ANN）、词法搜索和结构化数据搜索，所有这些都可以在同一个查询中完成。

## 安装与设置

::: code-group

```bash [pip]
pip install pyvespa
```

```bash [uv]
uv add pyvespa
```

:::

## 检索器

查看[使用示例](/oss/javascript/integrations/retrievers/vespa)。

```python
from langchain_classic.retrievers import VespaRetriever
```
