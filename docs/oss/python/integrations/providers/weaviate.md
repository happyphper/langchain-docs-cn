---
title: Weaviate
---
>[Weaviate](https://weaviate.io/) 是一个开源的向量数据库。它允许您存储来自您喜爱的机器学习模型的数据对象和向量嵌入，并能无缝扩展到数十亿个数据对象。

什么是 `Weaviate`？
- Weaviate 是一种开源数据库，属于向量搜索引擎类型。
- Weaviate 允许您以类似类属性的方式存储 JSON 文档，同时将机器学习向量附加到这些文档上，以在向量空间中表示它们。
- Weaviate 可以独立使用（即自带向量），也可以与各种模块一起使用，这些模块可以为您进行向量化并扩展核心功能。
- Weaviate 拥有一个 GraphQL-API，可以轻松访问您的数据。
- 我们的目标是将您的向量搜索部署到生产环境，实现毫秒级查询（查看我们的[开源基准测试](https://weaviate.io/developers/weaviate/current/benchmarks/)以了解 Weaviate 是否适合您的用例）。
- 在五分钟内通过[基础入门指南](https://weaviate.io/developers/weaviate/current/core-knowledge/basics.html)了解 Weaviate。

**Weaviate 详解：**

`Weaviate` 是一个低延迟的向量搜索引擎，开箱即用地支持不同的媒体类型（文本、图像等）。它提供语义搜索、问答提取、分类、可定制模型（PyTorch/TensorFlow/Keras）等功能。Weaviate 完全使用 Go 语言从头构建，同时存储对象和向量，允许将向量搜索与结构化过滤以及云原生数据库的容错性相结合。所有这些都可以通过 GraphQL、REST 和各种客户端编程语言进行访问。

## 安装与设置

安装 Python SDK：

::: code-group

```bash [pip]
pip install langchain-weaviate
```

```bash [uv]
uv add langchain-weaviate
```

:::

## 向量存储

存在一个围绕 `Weaviate` 索引的包装器，允许您将其用作向量存储，无论是用于语义搜索还是示例选择。

导入此向量存储：

```python
from langchain_weaviate import WeaviateVectorStore
```

有关 Weaviate 包装器的更详细演练，请参阅[此笔记本](/oss/integrations/vectorstores/weaviate)
