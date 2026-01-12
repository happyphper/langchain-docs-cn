---
title: Epsilla
---
本页介绍了如何在 LangChain 中使用 [Epsilla](https://github.com/epsilla-cloud/vectordb)。
内容分为两部分：安装与设置，以及对特定 Epsilla 封装器的引用。

## 安装与设置

- 使用 `pip/pip3 install pyepsilla` 安装 Python SDK

## 封装器

### VectorStore

Epsilla 向量数据库提供了一个封装器，允许您将其用作向量存储，无论是用于语义搜索还是示例选择。

导入此向量存储：

```python
from langchain_community.vectorstores import Epsilla
```

有关 Epsilla 封装器的更详细说明，请参阅 [此笔记本](/oss/python/integrations/vectorstores/epsilla)
