---
title: Git
---
>[Git](https://en.wikipedia.org/wiki/Git) 是一个分布式版本控制系统，用于跟踪任何计算机文件集合中的更改，通常用于在软件开发过程中协调程序员协作开发源代码。

## 安装与设置

首先，你需要安装 `GitPython` Python 包。

::: code-group

```bash [pip]
pip install GitPython
```

```bash [uv]
uv add GitPython
```

:::

## 文档加载器

查看[使用示例](/oss/javascript/integrations/document_loaders/git)。

```python
from langchain_community.document_loaders import GitLoader
```
