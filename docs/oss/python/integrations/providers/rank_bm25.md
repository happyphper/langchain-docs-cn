---
title: rank_bm25
---
[rank_bm25](https://github.com/dorianbrown/rank_bm25) 是一个开源算法集合，旨在查询文档并返回最相关的结果，通常用于构建搜索引擎。

有关可用算法的详细信息，请参阅其[项目页面](https://github.com/dorianbrown/rank_bm25)。

## 安装与设置

首先，你需要安装 `rank_bm25` Python 包。

::: code-group

```bash [pip]
pip install rank_bm25
```

```bash [uv]
uv add rank_bm25
```

:::

## 检索器

查看[使用示例](/oss/integrations/retrievers/bm25)。

```python
from langchain_community.retrievers import BM25Retriever
```
