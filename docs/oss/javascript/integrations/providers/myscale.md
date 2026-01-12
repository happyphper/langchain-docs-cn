---
title: MyScale
---
本页介绍如何在 LangChain 中使用 MyScale 向量数据库。
内容分为两部分：安装与设置，以及特定 MyScale 封装器的参考说明。

通过 MyScale，您可以同时管理结构化数据和非结构化（向量化）数据，并使用 SQL 对这两种类型的数据执行联合查询和分析。此外，MyScale 基于 ClickHouse 构建的云原生 OLAP 架构，即使在海量数据集上也能实现闪电般快速的数据处理。

## 简介

[MyScale 概述与高性能向量搜索](https://docs.myscale.com/en/overview/)

您现在可以在我们的 SaaS 平台上注册并[立即启动集群！](https://docs.myscale.com/en/quickstart/)

如果您对我们如何实现 SQL 与向量的集成感兴趣，请参阅[此文档](https://docs.myscale.com/en/vector-reference/)以获取进一步的语法参考。

我们还在 Hugging Face 上提供了实时演示！请查看我们的 [Hugging Face 空间](https://huggingface.co/myscale)！它们能在瞬间搜索数百万个向量！

## 安装与设置
- 使用 `pip install clickhouse-connect` 安装 Python SDK

### 设置环境

有两种方法可以为 MyScale 索引设置参数。

1. 环境变量

在运行应用程序之前，请使用 `export` 设置环境变量：
`export MYSCALE_HOST='<your-endpoints-url>' MYSCALE_PORT=<your-endpoints-port> MYSCALE_USERNAME=<your-username> MYSCALE_PASSWORD=<your-password> ...`

您可以在我们的 SaaS 平台上轻松找到您的账户、密码和其他信息。详情请参阅[此文档](https://docs.myscale.com/en/cluster-management/)
`MyScaleSettings` 下的每个属性都可以通过前缀 `MYSCALE_` 设置，且不区分大小写。

2. 使用参数创建 `MyScaleSettings` 对象

```python
from langchain_community.vectorstores import MyScale, MyScaleSettings
config = MyScaleSettings(host="<your-backend-url>", port=8443, ...)
index = MyScale(embedding_function, config)
index.add_documents(...)
```

## 封装器
支持的功能：
- `add_texts`
- `add_documents`
- `from_texts`
- `from_documents`
- `similarity_search`
- `asimilarity_search`
- `similarity_search_by_vector`
- `asimilarity_search_by_vector`
- `similarity_search_with_relevance_scores`
- `delete`

### VectorStore

存在一个围绕 MyScale 数据库的封装器，允许您将其用作向量存储，无论是用于语义搜索还是相似示例检索。

要导入此向量存储：

```python
from langchain_community.vectorstores import MyScale
```

有关 MyScale 封装器的更详细演练，请参阅[此笔记本](/oss/javascript/integrations/vectorstores/myscale)
