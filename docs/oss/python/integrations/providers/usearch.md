---
title: USearch
---
>[USearch](https://unum-cloud.github.io/usearch/) 是一个更小、更快的单文件向量搜索引擎。

>`USearch` 的基本功能与 `FAISS` 相同，如果你曾研究过近似最近邻搜索，其接口看起来会很熟悉。
> `USearch` 和 `FAISS` 都采用了 `HNSW` 算法，但它们在设计理念上存在显著差异。
> `USearch` 设计紧凑，在不牺牲性能的前提下与 FAISS 广泛兼容，主要专注于用户自定义的度量标准和更少的依赖项。

## 安装与设置

我们需要安装 `usearch` Python 包。

::: code-group

```bash [pip]
pip install usearch
```

```bash [uv]
uv add usearch
```

:::

## 向量存储

查看[使用示例](/oss/python/integrations/vectorstores/usearch)。

```python
from langchain_community.vectorstores import USearch
```
