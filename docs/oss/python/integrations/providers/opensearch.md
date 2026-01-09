---
title: OpenSearch
---
本页介绍了如何在 LangChain 中使用 OpenSearch 生态系统。
内容分为两部分：安装与设置，以及特定 OpenSearch 封装器的参考。

## 安装与设置
- 使用 `pip install opensearch-py` 安装 Python 包

## 封装器

### VectorStore

OpenSearch 向量数据库提供了一个封装器，允许您将其用作向量存储，
以进行语义搜索。它支持使用由 lucene、nmslib 和 faiss 引擎驱动的近似向量搜索，
或使用 painless 脚本和脚本评分函数进行暴力向量搜索。

导入此向量存储：

```python
from langchain_community.vectorstores import OpenSearchVectorSearch
```

有关 OpenSearch 封装器的更详细操作指南，请参阅 [此笔记本](/oss/integrations/vectorstores/opensearch)
