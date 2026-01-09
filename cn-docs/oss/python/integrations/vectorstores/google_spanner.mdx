---
title: Google Spanner
---
> [Spanner](https://cloud.google.com/spanner) 是一个高度可扩展的数据库，它将无限的可扩展性与关系型语义（如二级索引、强一致性、模式和 SQL）相结合，在一个简单的解决方案中提供 99.999% 的可用性。

本笔记本将介绍如何使用 `SpannerVectorStore` 类在 `Spanner` 中进行向量搜索。

在 [GitHub](https://github.com/googleapis/langchain-google-spanner-python/) 上了解更多关于该软件包的信息。

[![在 Colab 中打开](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/googleapis/langchain-google-spanner-python/blob/main/docs/vector_store.ipynb)

## 开始之前

要运行此笔记本，您需要完成以下操作：

*   [创建一个 Google Cloud 项目](https://developers.google.com/workspace/guides/create-project)
*   [启用 Cloud Spanner API](https://console.cloud.google.com/flows/enableapi?apiid=spanner.googleapis.com)
*   [创建一个 Spanner 实例](https://cloud.google.com/spanner/docs/create-manage-instances)
*   [创建一个 Spanner 数据库](https://cloud.google.com/spanner/docs/create-manage-databases)

### 🦜🔗 库安装

该集成位于其独立的 `langchain-google-spanner` 包中，因此我们需要安装它。

```python
pip install -qU langchain-google-spanner langchain-google-vertexai
```

**仅限 Colab：** 取消注释以下单元格以重启内核，或使用按钮重启内核。对于 Vertex AI Workbench，您可以使用顶部的按钮重启终端。

```python
# # 安装后自动重启内核，以便您的环境可以访问新的包
# import IPython

# app = IPython.Application.instance()
# app.kernel.do_shutdown(True)
```

### 🔐 身份验证

以登录此笔记本的 IAM 用户身份向 Google Cloud 进行身份验证，以便访问您的 Google Cloud 项目。

*   如果您使用 Colab 运行此笔记本，请使用下面的单元格并继续。
*   如果您使用 Vertex AI Workbench，请查看[此处的设置说明](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/setup-env)。

```python
from google.colab import auth

auth.authenticate_user()
```

### ☁ 设置您的 Google Cloud 项目

设置您的 Google Cloud 项目，以便您可以在本笔记本中利用 Google Cloud 资源。

如果您不知道您的项目 ID，请尝试以下操作：

*   运行 `gcloud config list`。
*   运行 `gcloud projects list`。
*   查看支持页面：[查找项目 ID](https://support.google.com/googleapi/answer/7014113)。

```python
# @markdown 请在下方填写您的 Google Cloud 项目 ID，然后运行该单元格。

PROJECT_ID = "my-project-id"  # @param {type:"string"}

# 设置项目 ID
!gcloud config set project {PROJECT_ID}
%env GOOGLE_CLOUD_PROJECT={PROJECT_ID}
```

### 💡 API 启用

`langchain-google-spanner` 包要求您在 Google Cloud 项目中[启用 Spanner API](https://console.cloud.google.com/flows/enableapi?apiid=spanner.googleapis.com)。

```python
# 启用 Spanner API
!gcloud services enable spanner.googleapis.com
```

## 基本用法

### 设置 Spanner 数据库值

在 [Spanner 实例页面](https://console.cloud.google.com/spanner?_ga=2.223735448.2062268965.1707700487-2088871159.1707257687) 中找到您的数据库值。

```python
# @title 在此处设置您的值 { display-mode: "form" }
INSTANCE = "my-instance"  # @param {type: "string"}
DATABASE = "my-database"  # @param {type: "string"}
TABLE_NAME = "vectors_search_data"  # @param {type: "string"}
```

### 初始化表

`SpannerVectorStore` 类实例需要一个包含 id、content 和 embeddings 列的数据库表。

可以使用辅助方法 `init_vector_store_table()` 来为您创建具有正确模式的表。

```python
from langchain_google_spanner import SecondaryIndex, SpannerVectorStore, TableColumn

SpannerVectorStore.init_vector_store_table(
    instance_id=INSTANCE,
    database_id=DATABASE,
    table_name=TABLE_NAME,
    # 自定义表创建
    # id_column="row_id",
    # content_column="content_column",
    # metadata_columns=[
    #     TableColumn(name="metadata", type="JSON", is_null=True),
    #     TableColumn(name="title", type="STRING(MAX)", is_null=False),
    # ],
    # secondary_indexes=[
    #     SecondaryIndex(index_name="row_id_and_title", columns=["row_id", "title"])
    # ],
)
```

### 创建嵌入类实例

您可以使用任何 [LangChain 嵌入模型](/oss/integrations/text_embedding/)。
您可能需要启用 Vertex AI API 才能使用 `VertexAIEmbeddings`。我们建议为生产环境设置嵌入模型的版本，了解更多关于[文本嵌入模型](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-embeddings)的信息。

```python
# 启用 Vertex AI API
!gcloud services enable aiplatform.googleapis.com
```

```python
from langchain_google_vertexai import VertexAIEmbeddings

embeddings = VertexAIEmbeddings(
    model_name="textembedding-gecko@latest", project=PROJECT_ID
)
```

### SpannerVectorStore

要初始化 `SpannerVectorStore` 类，您需要提供 4 个必需参数，其他参数是可选的，仅在与默认值不同时才需要传递。

1.  `instance_id` - Spanner 实例的名称
2.  `database_id` - Spanner 数据库的名称
3.  `table_name` - 数据库中用于存储文档及其嵌入的表的名称。
4.  `embedding_service` - 用于生成嵌入的 Embeddings 实现。

```python
db = SpannerVectorStore(
    instance_id=INSTANCE,
    database_id=DATABASE,
    table_name=TABLE_NAME,
    embedding_service=embeddings,
    # 连接到自定义向量存储表
    # id_column="row_id",
    # content_column="content",
    # metadata_columns=["metadata", "title"],
)
```

#### 添加文档

将文档添加到向量存储中。

```python
import uuid

from langchain_community.document_loaders import HNLoader

loader = HNLoader("https://news.ycombinator.com/item?id=34817881")

documents = loader.load()
ids = [str(uuid.uuid4()) for _ in range(len(documents))]
db.add_documents(documents, ids)
```

#### 搜索文档

使用相似性搜索在向量存储中搜索文档。

```python
db.similarity_search(query="Explain me vector store?", k=3)
```

#### 搜索文档

使用最大边际相关性搜索在向量存储中搜索文档。

```python
db.max_marginal_relevance_search("Testing the langchain integration with spanner", k=3)
```

#### 删除文档

要从向量存储中删除文档，请使用初始化 VectorStore 时 `row_id` 列对应的 ID。

```python
db.delete(ids=["id1", "id2"])
```

#### 删除文档

要从向量存储中删除文档，您可以直接使用文档本身。将使用初始化 VectorStore 时提供的内容列和元数据列来查找与文档对应的行。任何匹配的行都将被删除。

```python
db.delete(documents=[documents[0], documents[1]])
```
