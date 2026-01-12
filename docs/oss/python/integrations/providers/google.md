---
title: 谷歌
---
本页面涵盖了 LangChain 与 [Google Gemini](https://ai.google.dev/gemini-api/docs)、[Google Cloud](https://cloud.google.com/) 以及其他 Google 产品（如 Google Maps、YouTube 等）的所有集成。

<Note>

<strong>统一 SDK 与包整合</strong>

自 `langchain-google-genai` 4.0.0 版本起，该包使用整合后的 [`google-genai`](https://googleapis.github.io/python-genai/) SDK，现在支持 <strong>Gemini 开发者 API 和 Vertex AI</strong> 两种后端。

`langchain-google-vertexai` 包将继续支持 Vertex AI 平台特定的功能（Model Garden、Vector Search、评估服务等）。

阅读[完整公告和迁移指南](https://github.com/langchain-ai/langchain-google/discussions/1422)。

</Note>

不确定该使用哪个包？

:::: details Google Generative AI (Gemini API & Vertex AI)

通过 <strong>[Gemini 开发者 API](https://ai.google.dev/)</strong> 或 <strong>[Vertex AI](https://cloud.google.com/vertex-ai)</strong> 访问 Google Gemini 模型。后端会根据您的配置自动选择。

- <strong>Gemini 开发者 API</strong>：使用 API 密钥快速设置，适合个人开发者和快速原型设计
- <strong>Vertex AI</strong>：具备 Google Cloud 集成的企业级功能（需要 GCP 项目）

对于聊天模型、LLM 和嵌入模型，请使用 `langchain-google-genai` 包。

[查看集成。](#google-generative-ai)

::::

:::: details Google Cloud (Vertex AI 平台服务)

访问 Vertex AI 平台特定的服务，超越 Gemini 模型：Model Garden（Llama、Mistral、Anthropic）、评估服务和专门的视觉模型。

对于平台服务，请使用 `langchain-google-vertexai` 包；对于其他云服务（如数据库和存储），请使用特定的包（例如 `langchain-google-community`、`langchain-google-cloud-sql-pg`）。

[查看集成。](#google-cloud)

::::

有关差异的更多详细信息，请参阅 Google 关于[从 Gemini API 迁移到 Vertex AI](https://ai.google.dev/gemini-api/docs/migrate-to-cloud) 的指南。

<Note>

Gemini 模型和 Vertex AI 平台的集成包在 [`langchain-google`](https://github.com/langchain-ai/langchain-google) 仓库中维护。

您可以在 `langchain-google-community` 包（本页列出）和 [`googleapis`](https://github.com/orgs/googleapis/repositories?q=langchain) GitHub 组织中找到大量 LangChain 与其他 Google API 和服务的集成。

</Note>

---

## Google Generative AI

使用统一的 `langchain-google-genai` 包，通过 [Gemini 开发者 API](https://ai.google.dev/gemini-api/docs) 或 [Vertex AI](https://cloud.google.com/vertex-ai) 访问 Google Gemini 模型。

<Note>

<strong>包整合</strong>

某些用于 Gemini 模型的 `langchain-google-vertexai` 类正在被弃用，转而使用统一的 `langchain-google-genai` 包。请迁移到新类。

阅读[完整公告和迁移指南](https://github.com/langchain-ai/langchain-google/discussions/1422)。

</Note>

### 聊天模型

<Columns :cols="1">

<Card title="ChatGoogleGenerativeAI" href="/oss/integrations/chat/google_generative_ai" cta="Get started" icon="message" arrow>

通过 **Gemini 开发者 API** 或 **Vertex AI** 访问 Google Gemini 聊天模型。

</Card>

</Columns>

### LLMs

<Columns :cols="1">

<Card title="GoogleGenerativeAI" href="/oss/integrations/llms/google_ai" cta="Get started" icon="i-cursor" arrow>

使用（传统的）LLM 文本补全接口访问相同的 Gemini 模型（通过 **Gemini 开发者 API** 或 **Vertex AI**）。

</Card>

</Columns>

### 嵌入模型

<Columns :cols="1">

<Card title="GoogleGenerativeAIEmbeddings" href="/oss/integrations/text_embedding/google_generative_ai" cta="Get started" icon="layer-group" arrow>

通过 **Gemini 开发者 API** 或 **Vertex AI** 访问 Gemini 嵌入模型。

</Card>

</Columns>

---

## Google Cloud

访问 Vertex AI 平台特定的服务，包括 Model Garden（Llama、Mistral、Anthropic）、Vector Search、评估服务和专门的视觉模型。

### 聊天模型

<Note>

<strong>对于 Gemini 模型</strong>，请使用 `langchain-google-genai` 中的 [`ChatGoogleGenerativeAI`](/oss/python/integrations/chat/google_generative_ai) 而不是 `ChatVertexAI`。它支持 Gemini 开发者 API 和 Vertex AI 两种后端。

下面的类专注于<strong>Vertex AI 平台服务</strong>，这些服务*不*在整合后的 SDK 中提供。

阅读[完整公告和迁移指南](https://github.com/langchain-ai/langchain-google/discussions/1422)。

</Note>

<Columns :cols="2">

<Card title="ChatVertexAI" icon="comments" href="/oss/integrations/chat/google_vertex_ai" cta="Get started" arrow>

**已弃用** – 对于 Gemini 模型，请改用 [`ChatGoogleGenerativeAI`](/oss/python/integrations/chat/google_generative_ai)。

</Card>

<Card title="ChatAnthropicVertex" icon="comments" href="/oss/integrations/chat/google_anthropic_vertex" cta="Get started" arrow>

Vertex AI Model Garden 上的 Anthropic 模型

</Card>

</Columns>

:::: details VertexModelGardenLlama

Vertex AI Model Garden 上的 Llama 模型

```python [wrap]
from langchain_google_vertexai.model_garden_maas.llama import VertexModelGardenLlama
```

::::

:::: details VertexModelGardenMistral

Vertex AI Model Garden 上的 Mistral 模型

```python [wrap]
from langchain_google_vertexai.model_garden_maas.mistral import VertexModelGardenMistral
```

::::

:::: details GemmaChatLocalHF

从 HuggingFace 加载的本地 Gemma 模型。

```python [wrap]
from langchain_google_vertexai.gemma import GemmaChatLocalHF
```

::::

:::: details GemmaChatLocalKaggle

从 Kaggle 加载的本地 Gemma 模型。

```python [wrap]
from langchain_google_vertexai.gemma import GemmaChatLocalKaggle
```

::::

:::: details GemmaChatVertexAIModelGarden

Vertex AI Model Garden 上的 Gemma 模型

```python [wrap]
from langchain_google_vertexai.gemma import GemmaChatVertexAIModelGarden
```

::::

:::: details VertexAIImageCaptioningChat

将图像描述模型实现为聊天模型。

```python [wrap]
from langchain_google_vertexai.vision_models import VertexAIImageCaptioningChat
```

::::

:::: details VertexAIImageEditorChat

给定一张图像和一个提示，编辑该图像。目前仅支持无掩码编辑。

```python [wrap]
from langchain_google_vertexai.vision_models import VertexAIImageEditorChat
```

::::

:::: details VertexAIImageGeneratorChat

根据提示生成图像。

```python [wrap]
from langchain_google_vertexai.vision_models import VertexAIImageGeneratorChat
```

::::

:::: details VertexAIVisualQnAChat

视觉问答模型的聊天实现。

```python [wrap]
from langchain_google_vertexai.vision_models import VertexAIVisualQnAChat
```

::::

### LLMs

（传统的）字符串输入、字符串输出的 LLM 接口。

<Columns :cols="2">

<Card title="VertexAIModelGarden" icon="i-cursor" href="/oss/integrations/llms/google_vertex_ai#vertex-model-garden" cta="Get started" arrow>

通过 Vertex AI Model Garden 服务访问 Gemini 以及数百个开源模型。

</Card>

<Card title="VertexAI" icon="i-cursor" href="/oss/integrations/llms/google_vertex_ai" cta="Get started" arrow>

**已弃用** – 对于 Gemini 模型，请改用 [`GoogleGenerativeAI`](/oss/python/integrations/llms/google_generative_ai)。

</Card>

</Columns>

Gemma：

:::: details Gemma local from Hugging Face

从 HuggingFace 加载的本地 Gemma 模型。

```python [wrap]
from langchain_google_vertexai.gemma import GemmaLocalHF
```

::::

:::: details Gemma local from Kaggle

从 Kaggle 加载的本地 Gemma 模型。

```python [wrap]
from langchain_google_vertexai.gemma import GemmaLocalKaggle
```

::::

:::: details Gemma on Vertex AI Model Garden

```python [wrap]
from langchain_google_vertexai.gemma import GemmaVertexAIModelGarden
```

::::

:::: details Vertex AI image captioning

将图像描述模型实现为 LLM。

```python [wrap]
from langchain_google_vertexai.vision_models import VertexAIImageCaptioning
```

::::

### 嵌入模型

<Columns :cols="2">

<Card title="VertexAIEmbeddings" icon="layer-group" href="/oss/integrations/text_embedding/google_vertex_ai" cta="Get started" arrow>

**已弃用** – 请改用 [`GenerativeAIEmbeddings`](/oss/python/integrations/text_embedding/google_generative_ai)。

</Card>

</Columns>

### 文档加载器

从各种 Google Cloud 源加载文档。

<Columns :cols="2">

<Card title="AlloyDB for PostgreSQL" href="/oss/integrations/document_loaders/google_alloydb" cta="Get started" arrow>

Google Cloud AlloyDB 是一个完全托管的、与 PostgreSQL 兼容的数据库服务。

</Card>

<Card title="BigQuery" href="/oss/integrations/document_loaders/google_bigquery" cta="Get started" arrow>

Google Cloud BigQuery 是一个无服务器数据仓库。

</Card>

<Card title="Bigtable" href="/oss/integrations/document_loaders/google_bigtable" cta="Get started" arrow>

Google Cloud Bigtable 是一个完全托管的 NoSQL 大数据数据库服务。

</Card>

<Card title="Cloud SQL for MySQL" href="/oss/integrations/document_loaders/google_cloud_sql_mysql" cta="Get started" arrow>

Google Cloud SQL for MySQL 是一个完全托管的 MySQL 数据库服务。

</Card>

<Card title="Cloud SQL for SQL Server" href="/oss/integrations/document_loaders/google_cloud_sql_mssql" cta="Get started" arrow>

Google Cloud SQL for SQL Server 是一个完全托管的 SQL Server 数据库服务。

</Card>

<Card title="Cloud SQL for PostgreSQL" href="/oss/integrations/document_loaders/google_cloud_sql_pg" cta="Get started" arrow>

Google Cloud SQL for PostgreSQL 是一个完全托管的 PostgreSQL 数据库服务。

</Card>

<Card title="Cloud Storage (directory)" href="/oss/integrations/document_loaders/google_cloud_storage_directory" cta="Get started" arrow>

Google Cloud Storage 是一个用于存储非结构化数据的托管服务。

</Card>

<Card title="Cloud Storage (file)" href="/oss/integrations/document_loaders/google_cloud_storage_file" cta="Get started" arrow>

Google Cloud Storage 是一个用于存储非结构化数据的托管服务。

</Card>

<Card title="El Carro for Oracle Workloads" href="/oss/integrations/document_loaders/google_el_carro" cta="Get started" arrow>

Google El Carro Oracle Operator 在 Kubernetes 中运行 Oracle 数据库。

</Card>

<Card title="Firestore (Native Mode)" href="/oss/integrations/document_loaders/google_firestore" cta="Get started" arrow>

Google Cloud Firestore 是一个 NoSQL 文档数据库。

</Card>

<Card title="Firestore (Datastore Mode)" href="/oss/integrations/document_loaders/google_datastore" cta="Get started" arrow>

Datastore 模式下的 Google Cloud Firestore

</Card>

<Card title="Memorystore for Redis" href="/oss/integrations/document_loaders/google_memorystore_redis" cta="Get started" arrow>

Google Cloud Memorystore for Redis 是一个完全托管的 Redis 服务。

</Card>

<Card title="Spanner" href="/oss/integrations/document_loaders/google_spanner" cta="Get started" arrow>

Google Cloud Spanner 是一个完全托管的、全球分布的关系型数据库服务。

</Card>

<Card title="Speech-to-Text" href="/oss/integrations/document_loaders/google_speech_to_text" cta="Get started" arrow>

Google Cloud Speech-to-Text 转录音频文件。

</Card>

</Columns>

<Card title="Cloud Vision loader">

使用 Google Cloud Vision API 加载数据。

```python
from langchain_google_community.vision import CloudVisionLoader
```

</Card>

### 文档转换器

使用 Google Cloud 服务转换文档。

<Columns :cols="2">

<Card title="Document AI" href="/oss/integrations/document_transformers/google_docai" cta="Get started" arrow>

将文档中的非结构化数据转换为结构化数据，使其更易于理解、分析和使用。

</Card>

<Card title="Google Translate" href="/oss/integrations/document_transformers/google_translate" cta="Get started" arrow>

使用 Google Cloud Translation API 翻译文本和 HTML。

</Card>

</Columns>

### 向量存储

使用 Google Cloud 数据库和 Vertex AI Vector Search 存储和搜索向量。

<Columns :cols="2">

<Card title="AlloyDB for PostgreSQL" href="/oss/integrations/vectorstores/google_alloydb" cta="Get started" arrow>

Google Cloud AlloyDB 是一个完全托管的关系型数据库服务，在 Google Cloud 上提供高性能、无缝集成和令人印象深刻的扩展性。AlloyDB 与 PostgreSQL 100% 兼容。

</Card>

<Card title="BigQuery Vector Search" href="/oss/integrations/vectorstores/google_bigquery_vector_search" cta="Get started" arrow>

BigQuery 向量搜索允许您使用 GoogleSQL 进行语义搜索，使用向量索引进行快速但近似的结果，或使用暴力搜索进行精确结果。

</Card>

<Card title="Memorystore for Redis" href="/oss/integrations/vectorstores/google_memorystore_redis" cta="Get started" arrow>

使用 Memorystore for Redis 的向量存储

</Card>

<Card title="Spanner" href="/oss/integrations/vectorstores/google_spanner" cta="Get started" arrow>

使用 Cloud Spanner 的向量存储

</Card>

<Card title="Firestore (Native Mode)" href="/oss/integrations/vectorstores/google_firestore" cta="Get started" arrow>

使用 Firestore 的向量存储

</Card>

<Card title="Cloud SQL for MySQL" href="/oss/integrations/vectorstores/google_cloud_sql_mysql" cta="Get started" arrow>

使用 Cloud SQL for MySQL 的向量存储

</Card>

<Card title="Cloud SQL for PostgreSQL" href="/oss/integrations/vectorstores/google_cloud_sql_pg" cta="Get started" arrow>

使用 Cloud SQL for PostgreSQL 的向量存储。

</Card>

<Card title="Vertex AI Vector Search" href="/oss/integrations/vectorstores/google_vertex_ai_vector_search" cta="Get started" arrow>

以前称为 Vertex AI Matching Engine，提供低延迟向量数据库。这些向量数据库通常被称为向量相似性匹配或近似最近邻（ANN）服务。

</Card>

<Card title="With DataStore Backend" href="/oss/integrations/vectorstores/google_vertex_ai_vector_search/#optional--you-can-also-create-vectore-and-store-chunks-in-a-datastore" cta="Get started" arrow>

使用 Datastore 进行文档存储的向量搜索。

</Card>

</Columns>

### 检索器

使用 Google Cloud 服务检索信息。

<Columns :cols="2">

<Card title="Vertex AI Search" icon="magnifying-glass" href="/oss/integrations/retrievers/google_vertex_ai_search" cta="Get started" arrow>

使用 Vertex AI Search 构建由生成式 AI 驱动的搜索引擎

</Card>

<Card title="Document AI Warehouse" icon="warehouse" href="https://cloud.google.com/document-ai-warehouse" cta="Get started" arrow>

使用 Document AI Warehouse 搜索、存储和管理文档。

</Card>

</Columns>

```python [Other retrievers]
from langchain_google_community import VertexAIMultiTurnSearchRetriever
from langchain_google_community import VertexAISearchRetriever
from langchain_google_community import VertexAISearchSummaryTool
```

### 工具

将代理与各种 Google Cloud 服务集成。

<Columns :cols="2">
    <Card title="Text-to-Speech" icon="volume-high" href="/oss/integ
