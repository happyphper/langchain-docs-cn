---
title: 向量化
---
> [Vectorize](https://vectorize.io/) 帮助您更快、更轻松地构建 AI 应用。
> 它自动化数据提取，通过 RAG 评估找到最佳的向量化策略，
> 并让您能够为您的非结构化数据快速部署实时 RAG 管道。
> 您的向量搜索索引始终保持最新，并且它能与您现有的向量数据库集成，
> 因此您可以完全掌控您的数据。
> Vectorize 处理繁重的工作，让您能够专注于构建稳健的 AI 解决方案，而不会被数据管理所困扰。

# 安装与设置

安装以下 Python 包：

::: code-group

```bash [pip]
pip install langchain-vectorize
```

```bash [uv]
uv add langchain-vectorize
```

:::

在此处注册一个免费的 Vectorize 账户 [here](https://platform.vectorize.io/)
在 [Access Token](https://docs.vectorize.io/rag-pipelines/retrieval-endpoint#access-tokens) 部分生成一个访问令牌
收集您的组织 ID。从浏览器 URL 中，提取 `/organization/` 之后的 UUID。

设置以下变量：

```python
VECTORIZE_ORG_ID="your-organization-id"
VECTORIZE_API_TOKEN="your-api-token"
```

## 检索器

```python
from langchain_vectorize import VectorizeRetriever

retriever = VectorizeRetriever(
    api_token=VECTORIZE_API_TOKEN,
    organization=VECTORIZE_ORG_ID,
    pipeline_id="...",
)
retriever.invoke("query")
```

在 [示例笔记本](/oss/javascript/integrations/retrievers/vectorize) 中了解更多信息。
