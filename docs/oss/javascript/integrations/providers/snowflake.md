---
title: Snowflake
---
> [Snowflake](https://www.snowflake.com/) 是一个基于云的数据仓库平台，允许您存储和查询大量数据。

本页介绍如何在 `LangChain` 中使用 `Snowflake` 生态系统。

## 嵌入模型

Snowflake 在 [Hugging Face](https://huggingface.co/Snowflake/snowflake-arctic-embed-m-v1.5) 上免费提供了其开放权重的 `arctic` 系列嵌入模型。最新的模型 snowflake-arctic-embed-m-v1.5 具有 [matryoshka embedding](https://arxiv.org/abs/2205.13147) 功能，允许进行有效的向量截断。
您可以通过 [HuggingFaceEmbeddings](/oss/javascript/integrations/text_embedding/huggingfacehub) 连接器使用这些模型：

::: code-group

```bash [pip]
pip install langchain-community sentence-transformers
```

```bash [uv]
uv add langchain-community sentence-transformers
```

:::

```python
from langchain_huggingface import HuggingFaceEmbeddings

model = HuggingFaceEmbeddings(model_name="snowflake/arctic-embed-m-v1.5")
```

## 文档加载器

您可以使用 [`SnowflakeLoader`](/oss/javascript/integrations/document_loaders/snowflake) 从 Snowflake 加载数据：

```python
from langchain_community.document_loaders import SnowflakeLoader
```
