---
title: Databricks
---
> [Databricks](https://www.databricks.com/) Intelligence Platform 是全球首个由生成式 AI 驱动的数据智能平台。将 AI 融入您业务的方方面面。

Databricks 通过多种方式拥抱 LangChain 生态系统：

1.  🚀 **模型服务** - 通过高可用、低延迟的推理端点，访问最先进的 LLM，例如 DBRX、Llama3、Mixtral 或您在 [Databricks Model Serving](https://www.databricks.com/product/model-serving) 上微调的模型。LangChain 提供了 LLM (`Databricks`)、聊天模型 (`ChatDatabricks`) 和嵌入 (`DatabricksEmbeddings`) 的实现，简化了将托管在 Databricks Model Serving 上的模型与您的 LangChain 应用程序的集成。
2.  📃 **向量搜索** - [Databricks Vector Search](https://www.databricks.com/product/machine-learning/vector-search) 是一个与 Databricks 平台无缝集成的无服务器向量数据库。使用 `DatabricksVectorSearch`，您可以将高度可扩展且可靠的相似性搜索引擎集成到您的 LangChain 应用程序中。
3.  📊 **MLflow** - [MLflow](https://mlflow.org/) 是一个用于管理完整 ML 生命周期的开源平台，包括实验管理、评估、追踪、部署等。[MLflow 的 LangChain 集成](/oss/integrations/providers/mlflow_tracking) 简化了开发和运营现代复合 ML 系统的过程。
4.  🌐 **SQL 数据库** - [Databricks SQL](https://www.databricks.com/product/databricks-sql) 与 LangChain 中的 `SQLDatabase` 集成，允许您访问自动优化、性能卓越的数据仓库。
5.  💡 **开源模型** - Databricks 开源模型，例如 [DBRX](https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm)，可通过 [Hugging Face Hub](https://huggingface.co/databricks/dbrx-instruct) 获取。这些模型可以直接与 LangChain 一起使用，利用其与 `transformers` 库的集成。

安装
------------

Databricks 官方集成现在可通过 databricks-langchain 合作伙伴包获得。

::: code-group

```bash [pip]
pip install databricks-langchain
```

```bash [uv]
uv add databricks-langchain
```

:::

旧的 langchain-databricks 合作伙伴包仍然可用，但即将弃用。

聊天模型
----------

`ChatDatabricks` 是一个聊天模型类，用于访问托管在 Databricks 上的聊天端点，包括最先进的模型，如 Llama3、Mixtral 和 DBRX，以及您自己微调的模型。

```
from databricks_langchain import ChatDatabricks

chat_model = ChatDatabricks(endpoint="databricks-meta-llama-3-70b-instruct")
```

有关如何在您的 LangChain 应用程序中使用它的更多指导，请参阅 [使用示例](/oss/integrations/chat/databricks)。

LLM
---

`Databricks` 是一个 LLM 类，用于访问托管在 Databricks 上的补全端点。

<Warning>

文本补全模型已被弃用，最新和最流行的模型是 [聊天补全模型](/oss/langchain/models)。请改用 `ChatDatabricks` 聊天模型来使用这些模型以及工具调用等高级功能。

</Warning>

```
from langchain_community.llm.databricks import Databricks

llm = Databricks(endpoint="your-completion-endpoint")
```

有关如何在您的 LangChain 应用程序中使用它的更多指导，请参阅 [使用示例](/oss/integrations/llms/databricks)。

嵌入
----------

`DatabricksEmbeddings` 是一个嵌入类，用于访问托管在 Databricks 上的文本嵌入端点，包括最先进的模型，如 BGE，以及您自己微调的模型。

```
from databricks_langchain import DatabricksEmbeddings

embeddings = DatabricksEmbeddings(endpoint="databricks-bge-large-en")
```

有关如何在您的 LangChain 应用程序中使用它的更多指导，请参阅 [使用示例](/oss/integrations/text_embedding/databricks)。

向量搜索
-------------

Databricks Vector Search 是一个无服务器的相似性搜索引擎，允许您在向量数据库中存储数据的向量表示（包括元数据）。借助 Vector Search，您可以从由 [Unity Catalog](https://www.databricks.com/product/unity-catalog) 管理的 [Delta](https://docs.databricks.com/en/introduction/delta-comparison.html) 表创建自动更新的向量搜索索引，并使用简单的 API 进行查询以返回最相似的向量。

```
from databricks_langchain import DatabricksVectorSearch

dvs = DatabricksVectorSearch(
    endpoint="<YOUT_ENDPOINT_NAME>",
    index_name="<YOUR_INDEX_NAME>",
    index,
    text_column="text",
    embedding=embeddings,
    columns=["source"]
)
docs = dvs.similarity_search("What is vector search?)
```

有关如何设置向量索引并将其与 LangChain 集成的信息，请参阅 [使用示例](/oss/integrations/vectorstores/databricks_vector_search)。

MLflow 集成
------------------

在 LangChain 集成的背景下，MLflow 提供以下功能：

-   **实验追踪**：追踪和存储来自 LangChain 实验的模型、工件和追踪记录。
-   **依赖管理**：自动记录依赖库，确保开发、暂存和生产环境之间的一致性。
-   **模型评估**：提供用于评估 LangChain 应用程序的原生功能。
-   **追踪**：可视化追踪数据在 LangChain 应用程序中的流动。

请参阅 [MLflow LangChain 集成](/oss/integrations/providers/mlflow_tracking)，通过丰富的代码示例和指南了解将 MLflow 与 LangChain 结合使用的全部功能。

SQLDatabase
-----------

要连接到 Databricks SQL 或查询结构化数据，请参阅 [Databricks 结构化检索器工具文档](https://docs.databricks.com/en/generative-ai/agent-framework/structured-retrieval-tools.html#table-query-tool)。要使用上述创建的 SQL UDF 创建代理，请参阅 [Databricks UC 集成](https://docs.unitycatalog.io/ai/integrations/langchain/)。

开源模型
-----------

要直接集成托管在 HuggingFace 上的 Databricks 开源模型，您可以使用 LangChain 的 [HuggingFace 集成](/oss/integrations/providers/huggingface)。

```
from langchain_huggingface import HuggingFaceEndpoint

llm = HuggingFaceEndpoint(
    repo_id="databricks/dbrx-instruct",
    task="text-generation",
    max_new_tokens=512,
    do_sample=False,
    repetition_penalty=1.03,
)
llm.invoke("What is DBRX model?")
```
