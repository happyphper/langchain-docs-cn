---
title: DashVector
---
> [DashVector](https://help.aliyun.com/document_detail/2510225.html) 是一个全托管的向量数据库服务，支持高维稠密和稀疏向量、实时插入和带过滤的搜索。它专为自动扩展而构建，能够适应不同的应用需求。

本文档演示了如何在 LangChain 生态系统中利用 DashVector。具体来说，它展示了如何安装 DashVector，以及如何在 LangChain 中将其用作 VectorStore 插件。
文档分为两部分：安装和设置，以及对特定 DashVector 包装器的引用。

## 安装与设置

安装 Python SDK：

::: code-group

```bash [pip]
pip install dashvector
```

```bash [uv]
uv add dashvector
```

:::

您必须拥有一个 API 密钥。这里是[安装说明](https://help.aliyun.com/document_detail/2510223.html)。

## 嵌入模型

```python
from langchain_community.embeddings import DashScopeEmbeddings
```

请参阅[使用示例](/oss/javascript/integrations/vectorstores/dashvector)。

## 向量存储

DashVector 的 Collection 被包装成一个熟悉的 VectorStore，以便在 LangChain 中原生使用，这使得它可以轻松用于各种场景，例如语义搜索或示例选择。

您可以通过以下方式导入向量存储：

```python
from langchain_community.vectorstores import DashVector
```

关于 DashVector 包装器的详细说明，请参考[此笔记本](/oss/javascript/integrations/vectorstores/dashvector)。
