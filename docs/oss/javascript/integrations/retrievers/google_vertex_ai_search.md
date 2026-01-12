---
title: Google Vertex AI Search
---
>[Google Vertex AI Search](https://cloud.google.com/enterprise-search)（原名 `Generative AI App Builder` 上的 `Enterprise Search`）是 `Google Cloud` 提供的 [Vertex AI](https://cloud.google.com/vertex-ai) 机器学习平台的一部分。

>`Vertex AI Search` 让组织能够快速为客户和员工构建由生成式 AI 驱动的搜索引擎。它由多种 `Google Search` 技术支撑，包括语义搜索。语义搜索通过使用自然语言处理和机器学习技术来推断内容内部的关系以及用户查询输入的意图，从而提供比传统基于关键词的搜索技术更相关的结果。Vertex AI Search 还受益于 Google 在理解用户搜索方式方面的专业知识，并考虑内容相关性来对显示的结果进行排序。

>`Vertex AI Search` 可通过 `Google Cloud Console` 和 API 用于企业工作流集成。

本笔记本演示了如何配置 `Vertex AI Search` 并使用 Vertex AI Search [检索器](/oss/javascript/langchain/retrieval)。Vertex AI Search 检索器封装了 [Python 客户端库](https://cloud.google.com/generative-ai-app-builder/docs/libraries#client-libraries-install-python)，并使用它来访问 [Search Service API](https://cloud.google.com/python/docs/reference/discoveryengine/latest/google.cloud.discoveryengine_v1beta.services.search_service)。

有关 `VertexAISearchRetriever` 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/google_community/vertex_ai_search/langchain_google_community.vertex_ai_search.VertexAISearchRetriever.html)。

### 集成详情

<ItemTable category="document_retrievers" item="VertexAISearchRetriever" />

## 设置

### 安装

您需要安装 `langchain-google-community` 和 `google-cloud-discoveryengine` 包才能使用 Vertex AI Search 检索器。

```python
pip install -qU langchain-google-community google-cloud-discoveryengine
```

### 配置对 Google Cloud 和 Vertex AI Search 的访问权限

自 2023 年 8 月起，Vertex AI Search 已普遍可用，无需加入许可名单。

在使用检索器之前，您需要完成以下步骤：

#### 创建搜索引擎并填充非结构化数据存储

- 按照 [Vertex AI Search 入门指南](https://cloud.google.com/generative-ai-app-builder/docs/try-enterprise-search) 中的说明设置 Google Cloud 项目和 Vertex AI Search。
- [使用 Google Cloud Console 创建非结构化数据存储](https://cloud.google.com/generative-ai-app-builder/docs/create-engine-es#unstructured-data)
  - 使用 Cloud Storage 文件夹 `gs://cloud-samples-data/gen-app-builder/search/alphabet-investor-pdfs` 中的示例 PDF 文档填充它。
  - 确保使用 `Cloud Storage (without metadata)` 选项。

#### 设置访问 Vertex AI Search API 的凭据

Vertex AI Search 检索器使用的 [Vertex AI Search 客户端库](https://cloud.google.com/generative-ai-app-builder/docs/libraries) 为以编程方式向 Google Cloud 进行身份验证提供了高级语言支持。
客户端库支持 [应用程序默认凭据 (ADC)](https://cloud.google.com/docs/authentication/application-default-credentials)；这些库在一组定义的位置中查找凭据，并使用这些凭据对 API 请求进行身份验证。
使用 ADC，您可以在各种环境（例如本地开发或生产环境）中向您的应用程序提供凭据，而无需修改应用程序代码。

如果在 [Google Colab](https://colab.google) 中运行，请使用 `google.colab.google.auth` 进行身份验证，否则请遵循 [支持的方法](https://cloud.google.com/docs/authentication/application-default-credentials) 之一，以确保您的应用程序默认凭据已正确设置。

```python
import sys

if "google.colab" in sys.modules:
    from google.colab import auth as google_auth

    google_auth.authenticate_user()
```

### 配置和使用 Vertex AI Search 检索器

Vertex AI Search 检索器在 `langchain_google_community.VertexAISearchRetriever` 类中实现。`get_relevant_documents` 方法返回一个 `langchain.schema.Document` 文档列表，其中每个文档的 `page_content` 字段填充了文档内容。
根据 Vertex AI Search 中使用的数据类型（网站、结构化或非结构化），`page_content` 字段的填充方式如下：

- 具有高级索引的网站：与查询匹配的 `extractive answer`。`metadata` 字段填充了从中提取片段或答案的文档的元数据（如果有）。
- 非结构化数据源：与查询匹配的 `extractive segment` 或 `extractive answer`。`metadata` 字段填充了从中提取片段或答案的文档的元数据（如果有）。
- 结构化数据源：包含从结构化数据源返回的所有字段的字符串 json。`metadata` 字段填充了文档的元数据（如果有）

#### 提取式答案和提取式片段

提取式答案是与每个搜索结果一起返回的逐字文本。它直接从原始文档中提取。提取式答案通常显示在网页顶部附近，为最终用户提供与其查询上下文相关的简短答案。提取式答案适用于网站和非结构化搜索。

提取式片段是与每个搜索结果一起返回的逐字文本。提取式片段通常比提取式答案更详细。提取式片段可以作为查询的答案显示，并可用于执行后处理任务，以及作为大型语言模型的输入来生成答案或新文本。提取式片段适用于非结构化搜索。

有关提取式片段和提取式答案的更多信息，请参阅 [产品文档](https://cloud.google.com/generative-ai-app-builder/docs/snippets)。

注意：提取式片段需要启用 [企业版](https://cloud.google.com/generative-ai-app-builder/docs/about-advanced-features#enterprise-features) 功能。

创建检索器实例时，您可以指定许多参数来控制访问哪个数据存储以及如何处理自然语言查询，包括提取式答案和片段的配置。

#### 必需参数包括

- `project_id` - 您的 Google Cloud 项目 ID。
- `location_id` - 数据存储的位置。
  - `global`（默认）
  - `us`
  - `eu`

以下参数之一：

- `search_engine_id` - 您要使用的搜索应用的 ID。（混合搜索必需）
- `data_store_id` - 您要使用的数据存储的 ID。

`project_id`、`search_engine_id` 和 `data_store_id` 参数可以在检索器的构造函数中显式提供，也可以通过环境变量 `PROJECT_ID`、`SEARCH_ENGINE_ID` 和 `DATA_STORE_ID` 提供。

您还可以配置许多可选参数，包括：

- `max_documents` - 用于提供提取式片段或提取式答案的最大文档数
- `get_extractive_answers` - 默认情况下，检索器配置为返回提取式片段。
  - 将此字段设置为 `True` 以返回提取式答案。这仅在 `engine_data_type` 设置为 `0`（非结构化）时使用。
- `max_extractive_answer_count` - 每个搜索结果中返回的最大提取式答案数量。
  - 最多返回 5 个答案。这仅在 `engine_data_type` 设置为 `0`（非结构化）时使用。
- `max_extractive_segment_count` - 每个搜索结果中返回的最大提取式片段数量。
  - 当前将返回一个片段。这仅在 `engine_data_type` 设置为 `0`（非结构化）时使用。
- `filter` - 基于数据存储中文档关联元数据的搜索结果过滤表达式。
- `query_expansion_condition` - 确定在何种条件下应进行查询扩展的规范。
  - `0` - 未指定的查询扩展条件。在这种情况下，服务器行为默认为禁用。
  - `1` - 禁用查询扩展。即使 SearchResponse.total_size 为零，也只使用确切的搜索查询。
  - `2` - 由 Search API 构建的自动查询扩展。
- `engine_data_type` - 定义 Vertex AI Search 数据类型
  - `0` - 非结构化数据
  - `1` - 结构化数据
  - `2` - 网站数据
  - `3` - [混合搜索](https://cloud.google.com/generative-ai-app-builder/docs/create-data-store-es#multi-data-stores)

### `GoogleCloudEnterpriseSearchRetriever` 迁移指南

在之前的版本中，此检索器称为 `GoogleCloudEnterpriseSearchRetriever`。

要更新到新的检索器，请进行以下更改：

- 更改导入：`from langchain.retrievers import GoogleCloudEnterpriseSearchRetriever` -> `from langchain_google_community import VertexAISearchRetriever`。
- 将所有类引用从 `GoogleCloudEnterpriseSearchRetriever` 更改为 `VertexAISearchRetriever`。

注意：使用检索器时，如果您希望从单个查询获取自动跟踪，也可以通过取消注释以下内容来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

## 实例化

### 为使用提取式片段的**非结构化**数据配置和使用检索器

```python
from langchain_google_community import (
    VertexAIMultiTurnSearchRetriever,
    VertexAISearchRetriever,
)

PROJECT_ID = "<YOUR PROJECT ID>"  # 设置为您的项目 ID
LOCATION_ID = "<YOUR LOCATION>"  # 设置为您的数据存储位置
SEARCH_ENGINE_ID = "<YOUR SEARCH APP ID>"  # 设置为您的搜索应用 ID
DATA_STORE_ID = "<YOUR DATA STORE ID>"  # 设置为您的数据存储 ID
```

```python
retriever = VertexAISearchRetriever(
    project_id=PROJECT_ID,
    location_id=LOCATION_ID,
    data_store_id=DATA_STORE_ID,
    max_documents=3,
)
```

```python
query = "What are Alphabet's Other Bets?"

result = retriever.invoke(query)
for doc in result:
    print(doc)
```

### 为使用提取式答案的**非结构化**数据配置和使用检索器

```python
retriever = VertexAISearchRetriever(
    project_id=PROJECT_ID,
    location_id=LOCATION_ID,
    data_store_id=DATA_STORE_ID,
    max_documents=3,
    max_extractive_answer_count=3,
    get_extractive_answers=True,
)

result = retriever.invoke(query)
for doc in result:
    print(doc)
```

### 为**结构化**数据配置和使用检索器

```python
retriever = VertexAISearchRetriever(
    project_id=PROJECT_ID,
    location_id=LOCATION_ID,
    data_store_id=DATA_STORE_ID,
    max_documents=3,
    engine_data_type=1,
)

result = retriever.invoke(query)
for doc in result:
    print(doc)
```

### 为具有高级网站索引的**网站**数据配置和使用检索器

```python
retriever = VertexAISearchRetriever(
    project_id=PROJECT_ID,
    location_id=LOCATION_ID,
    data_store_id=DATA_STORE_ID,
    max_documents=3,
    max_extractive_answer_count=3,
    get_extractive_answers=True,
    engine_data_type=2,
)

result = retriever.invoke(query)
for doc in result:
    print(doc)
```

### 为**混合**数据配置和使用检索器

```python
retriever = VertexAISearchRetriever(
    project_id=PROJECT_ID,
    location_id=LOCATION_ID,
    search_engine_id=SEARCH_ENGINE_ID,
    max_documents=3,
    engine_data_type=3,
)

result = retriever.invoke(query)
for doc in result:
    print(doc)
```

### 为多轮搜索配置和使用检索器

[带后续问题的搜索](https://cloud.google.com/generative-ai-app-builder/docs/multi-turn-search) 基于生成式 AI 模型，它与常规的非结构化数据搜索不同。

```python
retriever = VertexAIMultiTurnSearchRetriever(
    project_id=PROJECT_ID, location_id=LOCATION_ID, data_store_id=DATA_STORE_ID
)

result = retriever.invoke(query)
for doc in result:
    print(doc)
```

## 使用

按照上述示例，我们使用 `invoke` 发出单个查询。

---

## API 参考

有关 `VertexAISearchRetriever` 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/google_community/vertex_ai_search/langchain_google_community.vertex_ai_search.VertexAISearchRetriever.html)。
