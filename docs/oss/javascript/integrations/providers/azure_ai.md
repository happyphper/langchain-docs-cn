---
title: Azure AI
---
本页面涵盖了 LangChain 与 [Microsoft Azure](https://azure.microsoft.com/) 及其相关项目的所有集成。

针对 Azure AI、Dynamic Sessions、SQL Server 的集成包维护在 [langchain-azure](https://github.com/langchain-ai/langchain-azure) 代码仓库中。

## 聊天模型

我们建议开发者从 (`langchain-azure-ai`) 开始，以访问 [Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/model-catalog-overview) 中提供的所有模型。

### Azure AI 聊天补全

使用 `AzureAIChatCompletionsModel` 类访问 Azure OpenAI、DeepSeek R1、Cohere、Phi 和 Mistral 等模型。

::: code-group

```bash [pip]
pip install -U langchain-azure-ai
```

```bash [uv]
uv add langchain-azure-ai
```

:::

配置您的 API 密钥和终端节点。

```bash
export AZURE_AI_CREDENTIAL=your-api-key
export AZURE_AI_ENDPOINT=your-endpoint
```

```python
from langchain_azure_ai.chat_models import AzureAIChatCompletionsModel

llm = AzureAIChatCompletionsModel(
    model_name="gpt-4o",
    api_version="2024-05-01-preview",
)

llm.invoke('Tell me a joke and include some emojis')
```

## 嵌入模型

### Azure AI 模型推理用于嵌入

::: code-group

```bash [pip]
pip install -U langchain-azure-ai
```

```bash [uv]
uv add langchain-azure-ai
```

:::

配置您的 API 密钥和终端节点。

```bash
export AZURE_AI_CREDENTIAL=your-api-key
export AZURE_AI_ENDPOINT=your-endpoint
```

```python
from langchain_azure_ai.embeddings import AzureAIEmbeddingsModel

embed_model = AzureAIEmbeddingsModel(
    model_name="text-embedding-ada-002"
)
```

## 向量存储

### Azure CosmosDB NoSQL 向量搜索

> [Azure CosmosDB NoSQL](https://azure.microsoft.com/en-us/products/cosmos-db/) 是一个完全托管、全球分布式、无服务器的现代应用程序文档数据库。它以灵活的 JSON 文档存储数据，并使用类似 SQL 的查询语言。这提供了高性能、低延迟以及自动、弹性的可扩展性。它还具备集成的向量搜索功能，适用于生成式 AI 和 RAG 等 AI 工作负载。这允许您将向量嵌入与操作数据一起存储、索引和查询在同一数据库中。您可以将向量相似性搜索与传统的基于关键字的搜索相结合以获得相关结果，并可以选择多种索引方法以获得最佳性能。这种统一的方法简化了应用程序架构并确保了数据一致性。

我们需要安装 `azure-cosmos` 包来使用此向量存储。

::: code-group

```bash [pip]
pip install -qU azure-cosmos
```

```bash [uv]
uv add azure-cosmos
```

:::

```python
from langchain_azure_ai.vectorstores.azure_cosmos_db_no_sql import (
    AzureCosmosDBNoSqlVectorSearch,
)
vector_search = AzureCosmosDBNoSqlVectorSearch.from_documents(
    documents=docs,
    embedding=openai_embeddings,
    cosmos_client=cosmos_client,
    database_name=database_name,
    container_name=container_name,
    vector_embedding_policy=vector_embedding_policy,
    full_text_policy=full_text_policy,
    indexing_policy=indexing_policy,
    cosmos_container_properties=cosmos_container_properties,
    cosmos_database_properties={},
    full_text_search_enabled=True,
)
```

查看[使用示例](/oss/integrations/vectorstores/azure_cosmos_db_no_sql)。

### Azure CosmosDB Mongo vCore 向量搜索

> [Azure CosmosDB Mongo vCore](https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/vcore/) 架构使得创建具有完整原生 MongoDB 支持的数据库变得容易。您可以应用您的 MongoDB 经验，并通过将应用程序指向 MongoDB (vCore) API 集群的连接字符串，继续使用您喜欢的 MongoDB 驱动程序、SDK 和工具。

我们需要安装 `pymongo` 包来使用此向量存储。

::: code-group

```bash [pip]
pip install -qU pymongo
```

```bash [uv]
uv add pymongo
```

:::

```python
from langchain_azure_ai.vectorstores.azure_cosmos_db_mongo_vcore import (
    AzureCosmosDBMongoVCoreVectorSearch,
)

vectorstore = AzureCosmosDBMongoVCoreVectorSearch.from_documents(
    docs,
    openai_embeddings,
    collection=collection,
    index_name=INDEX_NAME,
)
```

查看[使用示例](/oss/integrations/vectorstores/azure_cosmos_db_mongo_vcore)。
