---
title: Annoy
---
> [Annoy](https://github.com/spotify/annoy) (`Approximate Nearest Neighbors Oh Yeah`)
> 是一个 C++ 库，附带 Python 绑定，用于在空间中搜索与给定查询点接近的点。它还能创建大型的、基于文件的只读数据结构，这些结构会被映射到内存中，以便多个进程可以共享相同的数据。

## 安装与设置

::: code-group

```bash [pip]
pip install annoy
```

```bash [uv]
uv add annoy
```

:::

## 向量存储

查看[使用示例](/oss/javascript/integrations/vectorstores/annoy)。

```python
from langchain_community.vectorstores import Annoy
```
