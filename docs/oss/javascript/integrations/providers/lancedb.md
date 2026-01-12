---
title: LanceDB
---
本页介绍如何在 LangChain 中使用 [LanceDB](https://github.com/lancedb/lancedb)。
内容分为两部分：安装与设置，以及特定 LanceDB 封装器的参考。

## 安装与设置

- 使用 `pip install lancedb` 安装 Python SDK

## 封装器

### VectorStore

LanceDB 数据库提供了一个封装器，允许你将其用作向量存储，无论是用于语义搜索还是示例选择。

导入此向量存储：

```python
from langchain_community.vectorstores import LanceDB
```

有关 LanceDB 封装器的更详细操作指南，请参阅 [此笔记本](/oss/javascript/integrations/vectorstores/lancedb)
