---
title: 微软
---
本页面涵盖了 LangChain 与 [Microsoft Azure](https://portal.azure.com) 及其他 [Microsoft](https://www.microsoft.com) 产品的所有集成。

## 聊天模型

Microsoft 通过 Azure 提供了三种主要的聊天模型访问选项：

1. [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/) - 通过 Microsoft Azure 安全的企业平台，提供对 OpenAI 强大模型（如 o3、4.1 及其他模型）的访问。
2. [Azure AI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models) - 通过统一的 API，提供对来自不同供应商（包括 Anthropic、DeepSeek、Cohere、Phi 和 Mistral）的各种模型的访问。
3. [Azure ML](https://learn.microsoft.com/en-us/azure/machine-learning/) - 允许使用 Azure 机器学习部署和管理您自己的自定义模型或微调的开源模型。

### Azure OpenAI

>[Microsoft Azure](https://en.wikipedia.org/wiki/Microsoft_Azure)，通常称为 `Azure`，是由 `Microsoft` 运营的云计算平台，它通过全球数据中心提供对应用程序和服务的访问、管理和开发。它提供了一系列功能，包括软件即服务 (SaaS)、平台即服务 (PaaS) 和基础设施即服务 (IaaS)。`Microsoft Azure` 支持多种编程语言、工具和框架，包括 Microsoft 特有的以及第三方的软件和系统。

>[Azure OpenAI](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/) 是一项 `Azure` 服务，提供来自 OpenAI 的强大语言模型，包括用于内容生成、摘要、语义搜索和自然语言到代码翻译的 `GPT-3`、`Codex` 和 Embeddings 模型系列。

::: code-group

```bash [pip]
pip install langchain-openai
```

```bash [uv]
uv add langchain-openai
```

:::

设置环境变量以获取对 `Azure OpenAI` 服务的访问权限。

```python
import os

os.environ["AZURE_OPENAI_ENDPOINT"] = "https://<your-endpoint.openai.azure.com/"
os.environ["AZURE_OPENAI_API_KEY"] = "your AzureOpenAI key"
```

查看[使用示例](/oss/python/integrations/chat/azure_chat_openai)

```python
from langchain_openai import AzureChatOpenAI
```

### Azure AI

>[Azure AI Foundry](https://learn.microsoft.com/en-us/azure/developer/python/get-started) 通过 `AzureAIChatCompletionsModel` 类，提供对来自各种供应商（包括 Azure OpenAI、DeepSeek R1、Cohere、Phi 和 Mistral）的广泛模型的访问。

::: code-group

```bash [pip]
pip install -U langchain-azure-ai
```

```bash [uv]
uv add langchain-azure-ai
```

:::

配置您的 API 密钥和端点。

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
```

查看[使用示例](/oss/python/integrations/chat/azure_ai)

### Azure ML 聊天在线端点

有关访问托管在 [Azure 机器学习](https://azure.microsoft.com/en-us/products/machine-learning/) 上的聊天模型，请参阅[此处](/oss/python/integrations/chat/azureml_chat_endpoint)的文档。

## 大语言模型

### Azure ML

查看[使用示例](/oss/python/integrations/llms/azure_ml)。

```python
from langchain_community.llms.azureml_endpoint import AzureMLOnlineEndpoint
```

### Azure OpenAI

查看[使用示例](/oss/python/integrations/llms/azure_openai)。

```python
from langchain_openai import AzureOpenAI
```

## 嵌入模型

Microsoft 通过 Azure 提供了两种主要的嵌入模型访问选项：

### Azure OpenAI

查看[使用示例](/oss/python/integrations/text_embedding/azure_openai)

```python
from langchain_openai import AzureOpenAIEmbeddings
```

### Azure AI

::: code-group

```bash [pip]
pip install -U langchain-azure-ai
```

```bash [uv]
uv add langchain-azure-ai
```

:::

配置您的 API 密钥和端点。

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

## 文档加载器

### Azure AI 数据

>[Azure AI Foundry（原 Azure AI Studio）](https://ai.azure.com/) 提供了将数据资产上传到云存储以及从以下来源注册现有数据资产的能力：
>
>- `Microsoft OneLake`
>- `Azure Blob Storage`
>- `Azure Data Lake gen 2`

首先，您需要安装几个 Python 包。

::: code-group

```bash [pip]
pip install azureml-fsspec, azure-ai-generative
```

```bash [uv]
uv add azureml-fsspec, azure-ai-generative
```

:::

查看[使用示例](/oss/python/integrations/document_loaders/azure_ai_data)。

```python
from langchain.document_loaders import AzureAIDataLoader
```

### Azure AI 文档智能

>[Azure AI 文档智能](https://aka.ms/doc-intelligence)（原名 `Azure Form Recognizer`）是一项基于机器学习的服务，可从数字或扫描的 PDF、图像、Office 和 HTML 文件中提取文本（包括手写）、表格、文档结构和键值对。
>
> 文档智能支持 `PDF`、`JPEG/JPG`、`PNG`、`BMP`、`TIFF`、`HEIF`、`DOCX`、`XLSX`、`PPTX` 和 `HTML`。

首先，您需要安装一个 Python 包。

::: code-group

```bash [pip]
pip install azure-ai-documentintelligence
```

```bash [uv]
uv add azure-ai-documentintelligence
```

:::

查看[使用示例](/oss/python/integrations/document_loaders/azure_document_intelligence)。

```python
from langchain.document_loaders import AzureAIDocumentIntelligenceLoader
```

### Azure Blob 存储

>[Azure Blob 存储](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction) 是 Microsoft 面向云的对象存储解决方案。Blob 存储针对存储海量非结构化数据进行了优化。非结构化数据是指不遵循特定数据模型或定义的数据，例如文本或二进制数据。

`Azure Blob 存储` 设计用于：
- 直接向浏览器提供图像或文档。
- 存储文件以供分布式访问。
- 流式传输视频和音频。
- 写入日志文件。
- 存储用于备份和还原、灾难恢复及归档的数据。
- 存储用于本地或 Azure 托管服务分析的数据。

::: code-group

```bash [pip]
pip install langchain-azure-storage
```

```bash [uv]
uv add langchain-azure-storage
```

:::

查看 [Azure Blob 存储加载器的使用示例](/oss/python/integrations/document_loaders/azure_blob_storage)。

```python
from langchain_azure_storage.document_loaders import AzureBlobStorageLoader
```

### Microsoft OneDrive

>[Microsoft OneDrive](https://en.wikipedia.org/wiki/OneDrive)（原名 `SkyDrive`）是由 Microsoft 运营的文件托管服务。

首先，您需要安装一个 Python 包。

::: code-group

```bash [pip]
pip install o365
```

```bash [uv]
uv add o365
```

:::

查看[使用示例](/oss/python/integrations/document_loaders/microsoft_onedrive)。

```python
from langchain_community.document_loaders import OneDriveLoader
```

### Microsoft OneDrive 文件

>[Microsoft OneDrive](https://en.wikipedia.org/wiki/OneDrive)（原名 `SkyDrive`）是由 Microsoft 运营的文件托管服务。

首先，您需要安装一个 Python 包。

::: code-group

```bash [pip]
pip install o365
```

```bash [uv]
uv add o365
```

:::

```python
from langchain_community.document_loaders import OneDriveFileLoader
```

### Microsoft Word

>[Microsoft Word](https://www.microsoft.com/en-us/microsoft-365/word) 是 Microsoft 开发的一款文字处理器。

查看[使用示例](/oss/python/integrations/document_loaders/microsoft_word)。

```python
from langchain_community.document_loaders import UnstructuredWordDocumentLoader
```

### Microsoft Excel

>[Microsoft Excel](https://en.wikipedia.org/wiki/Microsoft_Excel) 是 Microsoft 为 Windows、macOS、Android、iOS 和 iPadOS 开发的电子表格编辑器。
> 它具有计算或运算能力、图表工具、数据透视表以及一种名为 Visual Basic for Applications (VBA) 的宏编程语言。Excel 是 Microsoft 365 软件套件的一部分。

`UnstructuredExcelLoader` 用于加载 `Microsoft Excel` 文件。该加载器适用于 `.xlsx` 和 `.xls` 文件。
页面内容将是 Excel 文件的原始文本。如果您在 `"elements"` 模式下使用加载器，Excel 文件的 HTML 表示形式将在文档元数据中的 `text_as_html` 键下可用。

查看[使用示例](/oss/python/integrations/document_loaders/microsoft_excel)。

```python
from langchain_community.document_loaders import UnstructuredExcelLoader
```

### Microsoft SharePoint

>[Microsoft SharePoint](https://en.wikipedia.org/wiki/SharePoint) 是一个基于网站的协作系统，它使用工作流应用程序、“列表”数据库以及其他 Web 部件和安全功能来赋能业务团队协同工作，由 Microsoft 开发。

查看[使用示例](/oss/python/integrations/document_loaders/microsoft_sharepoint)。

```python
from langchain_community.document_loaders.sharepoint import SharePointLoader
```

### Microsoft PowerPoint

>[Microsoft PowerPoint](https://en.wikipedia.org/wiki/Microsoft_PowerPoint) 是 Microsoft 的演示文稿程序。

查看[使用示例](/oss/python/integrations/document_loaders/microsoft_powerpoint)。

```python
from langchain_community.document_loaders import UnstructuredPowerPointLoader
```

### Microsoft OneNote

首先，让我们安装依赖项：

::: code-group

```bash [pip]
pip install bs4 msal
```

```bash [uv]
uv add bs4 msal
```

:::

查看[使用示例](/oss/python/integrations/document_loaders/microsoft_onenote)。

```python
from langchain_community.document_loaders.onenote import OneNoteLoader
```

### Playwright URL 加载器

>[Playwright](https://github.com/microsoft/playwright) 是 `Microsoft` 开发的开源自动化工具，允许您以编程方式控制和自动化 Web 浏览器。它专为跨各种 Web 浏览器（如 `Chromium`、`Firefox` 和 `WebKit`）的端到端测试、抓取和自动化任务而设计。

首先，让我们安装依赖项：

::: code-group

```bash [pip]
pip install playwright unstructured
```

```bash [uv]
uv add playwright unstructured
```

:::

查看[使用示例](/oss/python/integrations/document_loaders/url/#playwright-url-loader)。

```python
from langchain_community.document_loaders.onenote import OneNoteLoader
```

## 记忆

### Azure Cosmos DB 聊天消息历史记录

>[Azure Cosmos DB](https://learn.microsoft.com/azure/cosmos-db/) 为对话式 AI 应用程序提供聊天消息历史记录存储，使您能够以低延迟和高可用性持久化和检索对话历史记录。

::: code-group

```bash [pip]
pip install langchain-azure-ai
```

```bash [uv]
uv add langchain-azure-ai
```

:::

配置您的 Azure Cosmos DB 连接：

```python
from langchain_azure_ai.chat_message_histories import CosmosDBChatMessageHistory

history = CosmosDBChatMessageHistory(
    cosmos_endpoint="https://<your-account>.documents.azure.com:443/",
    cosmos_database="<your-database>",
    cosmos_container="<your-container>",
    session_id="<session-id>",
    user_id="<user-id>",
    credential="<your-credential>"  # 或使用 connection_string
)
```

## 向量存储

### Azure Cosmos DB
AI 智能体可以依赖 Azure Cosmos DB 作为统一的[记忆系统](https://learn.microsoft.com/en-us/azure/cosmos-db/ai-agents#memory-can-make-or-break-agents)解决方案，享受速度、规模和简单性。该服务成功[支持了 OpenAI 的 ChatGPT 服务](https://www.youtube.com/watch?v=6IIUtEFKJec&t)动态扩展，具有高可靠性和低维护性。它由原子记录序列引擎驱动，是世界上第一个全局分布的 [NoSQL](https://learn.microsoft.com/en-us/azure/cosmos-db/distributed-nosql)、[关系型](https://learn.microsoft.com/en-us/azure/cosmos-db/distributed-relational)和[向量数据库](https://learn.microsoft.com/en-us/azure/cosmos-db/vector-database)服务，并提供无服务器模式。

以下是两个可用的 Azure Cosmos DB API，它们可以提供向量存储功能。

#### Azure Cosmos DB for MongoDB (vCore)

>[Azure Cosmos DB for MongoDB vCore](https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/vcore/) 使得创建具有完整原生 MongoDB 支持的数据库变得容易。
> 您可以应用您的 MongoDB 经验，并通过将应用程序指向 API for MongoDB vCore 帐户的连接字符串，继续使用您喜欢的 MongoDB 驱动程序、SDK 和工具。
> 使用 Azure Cosmos DB for MongoDB vCore 中的向量搜索，将您基于 AI 的应用程序与存储在 Azure Cosmos DB 中的数据无缝集成。

##### 安装与设置

查看[详细配置说明](/oss/python/integrations/vectorstores/azure_cosmos_db_mongo_vcore)。

我们需要安装 `langchain-azure-ai` 和 `pymongo` Python 包。

::: code-group

```bash [pip]
pip install langchain-azure-ai pymongo
```

```bash [uv]
uv add langchain-azure-ai pymongo
```

:::

##### 在 Microsoft Azure 上部署 Azure Cosmos DB

Azure Cosmos DB for MongoDB vCore 为开发人员提供了一个完全托管的、与 MongoDB 兼容的数据库服务，用于使用熟悉的架构构建现代应用程序。

借助 Cosmos DB for MongoDB vCore，开发人员在迁移现有应用程序或构建新应用程序时，可以享受原生 Azure 集成、低总拥有成本 (TCO) 以及熟悉的 vCore 架构带来的好处。

[免费注册](https://azure.microsoft.com/en-us/free/)即可立即开始。

查看[使用示例](/oss/python/integrations/vectorstores/azure_cosmos_db_mongo_vcore)。

```python
from langchain_azure_ai.vectorstores import AzureCosmosDBMongoVCoreVectorSearch
```

#### Azure Cosmos DB NoSQL

>[Azure Cosmos DB for NoSQL](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/vector-search) 现在提供预览版的向量索引和搜索功能。
此功能旨在处理高维向量，实现任何规模下高效且准确的向量搜索。您现在可以将向量直接存储在文档中，与您的数据放在一起。这意味着数据库中的每个文档不仅可以包含传统的无模式数据，还可以包含作为文档其他属性的高维向量。数据和向量的这种共置允许高效的索引和搜索，因为向量与它们所代表的数据存储在相同的逻辑单元中。这简化了数据管理、AI 应用程序架构以及基于向量的操作效率。

##### 安装与设置

查看[详细配置说明](/oss/python/integrations/vectorstores/azure_cosmos_db_no_sql)。

我们需要安装 `langchain-azure-ai` 和 `azure-cosmos` Python 包。

::: code-group

```bash [pip]
pip install langchain-azure-ai azure-cosmos
```

```bash [uv]
uv add langchain-azure-ai azure-cosmos
```

:::

##### 在 Microsoft Azure 上部署 Azure Cosmos DB

Azure Cosmos DB 通过动态和弹性的自动缩放实现快速响应，为现代应用程序和智能工作负载提供了解决方案。它在每个 Azure 区域都可用，并且可以自动将数据复制到更靠近用户的位置。它具有 SLA 保证的低延迟和高可用性。

[免费注册](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/quickstart-python?pivots=devcontainer-codespace)即可立即开始。

查看[使用示例](/oss/python/integrations/vectorstores/azure_cosmos_db_no_sql)。

```python
from langchain_azure_ai.vectorstores import AzureCosmosDBNoSqlVectorSearch
```

### Azure Database for PostgreSQL

>[Azure Database for PostgreSQL - 灵活服务器](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/service-overview) 是基于开源 Postgres 数据库引擎的关系型数据库服务。它是一个完全托管的数据库即服务，可以处理具有可预测性能、安全性、高可用性和动态可扩展性的关键任务工作负载。

查看 Azure Database for PostgreSQL 的[设置说明](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/quickstart-create-server-portal)。

只需使用来自 Azure 门户的[连接字符串](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/connect-python?tabs=cmd%2Cpassword#add-authentication-code)。

由于 Azure Database for PostgreSQL 是开源的 Postgres，您可以使用 [LangChain 的 Postgres 支持](/oss/python/integrations/vectorstores/pgvector/) 连接到 Azure Database for PostgreSQL。

### Azure SQL 数据库

>[Azure SQL 数据库](https://learn.microsoft.com/azure/azure-sql/database/sql-database-paas-overview?view=azuresql) 是一项强大的服务，结合了可扩展性、安全性和高可用性，提供了
