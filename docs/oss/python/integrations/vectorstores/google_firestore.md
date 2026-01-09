---
title: Google Firestore
---
> [Firestore](https://cloud.google.com/firestore) 是一个无服务器的面向文档的数据库，可根据需求灵活扩展。利用 Firestore 的 LangChain 集成，扩展您的数据库应用程序以构建由 AI 驱动的体验。

本笔记本将介绍如何使用 [Firestore](https://cloud.google.com/firestore) 存储向量，并使用 `FirestoreVectorStore` 类进行查询。

[![在 Colab 中打开](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/googleapis/langchain-google-firestore-python/blob/main/docs/vectorstores.ipynb)

## 开始之前

要运行此笔记本，您需要完成以下操作：

*   [创建一个 Google Cloud 项目](https://developers.google.com/workspace/guides/create-project)
*   [启用 Firestore API](https://console.cloud.google.com/flows/enableapi?apiid=firestore.googleapis.com)
*   [创建一个 Firestore 数据库](https://cloud.google.com/firestore/docs/manage-databases)

在确认可以在此笔记本的运行时环境中访问数据库后，请填写以下值并在运行示例脚本之前运行该单元格。

```python
# @markdown 请为演示目的指定一个源。
COLLECTION_NAME = "test"  # @param {type:"CollectionReference"|"string"}
```

### 🦜🔗 库安装

该集成位于其独立的 `langchain-google-firestore` 包中，因此我们需要安装它。对于此笔记本，我们还将安装 `langchain-google-genai` 以使用 Google Generative AI 嵌入模型。

```python
pip install -upgrade --quiet langchain-google-firestore langchain-google-vertexai
```

**仅限 Colab**：取消注释以下单元格以重启内核，或使用按钮重启内核。对于 Vertex AI Workbench，您可以使用顶部的按钮重启终端。

```python
# # 安装后自动重启内核，以便您的环境可以访问新包
# import IPython

# app = IPython.Application.instance()
# app.kernel.do_shutdown(True)
```

### ☁ 设置您的 Google Cloud 项目

设置您的 Google Cloud 项目，以便您可以在本笔记本中使用 Google Cloud 资源。

如果您不知道自己的项目 ID，请尝试以下操作：

*   运行 `gcloud config list`。
*   运行 `gcloud projects list`。
*   查看支持页面：[查找项目 ID](https://support.google.com/googleapi/answer/7014113)。

```python
# @markdown 请在下方填写您的 Google Cloud 项目 ID，然后运行该单元格。

PROJECT_ID = "extensions-testing"  # @param {type:"string"}

# 设置项目 ID
!gcloud config set project {PROJECT_ID}
```

### 🔐 身份验证

以登录此笔记本的 IAM 用户身份向 Google Cloud 进行身份验证，以便访问您的 Google Cloud 项目。

*   如果您使用 Colab 运行此笔记本，请使用下面的单元格并继续。
*   如果您使用 Vertex AI Workbench，请查看[此处的设置说明](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/setup-env)。

```python
from google.colab import auth

auth.authenticate_user()
```

# 基本用法

### 初始化 FirestoreVectorStore

`FirestoreVectorStore` 允许您在 Firestore 数据库中存储新的向量。您可以使用它来存储来自任何模型的嵌入，包括来自 Google Generative AI 的模型。

```python
from langchain_google_firestore import FirestoreVectorStore
from langchain_google_vertexai import VertexAIEmbeddings

embedding = VertexAIEmbeddings(
    model_name="textembedding-gecko@latest",
    project=PROJECT_ID,
)

# 示例数据
ids = ["apple", "banana", "orange"]
fruits_texts = ['{"name": "apple"}', '{"name": "banana"}', '{"name": "orange"}']

# 创建一个向量存储
vector_store = FirestoreVectorStore(
    collection="fruits",
    embedding=embedding,
)

# 将水果添加到向量存储
vector_store.add_texts(fruits_texts, ids=ids)
```

作为一种快捷方式，您可以使用 `from_texts` 和 `from_documents` 方法一步完成初始化和添加向量。

```python
vector_store = FirestoreVectorStore.from_texts(
    collection="fruits",
    texts=fruits_texts,
    embedding=embedding,
)
```

```python
from langchain_core.documents import Document

fruits_docs = [Document(page_content=fruit) for fruit in fruits_texts]

vector_store = FirestoreVectorStore.from_documents(
    collection="fruits",
    documents=fruits_docs,
    embedding=embedding,
)
```

### 删除向量

您可以使用 `delete` 方法从数据库中删除包含向量的文档。您需要提供要删除的向量的文档 ID。这将从数据库中删除整个文档，包括它可能具有的任何其他字段。

```python
vector_store.delete(ids)
```

### 更新向量

更新向量与添加向量类似。您可以使用 `add` 方法，通过提供文档 ID 和新向量来更新文档的向量。

```python
fruit_to_update = ['{"name": "apple","price": 12}']
apple_id = "apple"

vector_store.add_texts(fruit_to_update, ids=[apple_id])
```

## 相似性搜索

您可以使用 `FirestoreVectorStore` 对已存储的向量执行相似性搜索。这对于查找相似的文档或文本非常有用。

```python
vector_store.similarity_search("I like fuji apples", k=3)
```

```python
vector_store.max_marginal_relevance_search("fuji", 5)
```

您可以通过使用 `filters` 参数为搜索添加预过滤器。这对于按特定字段或值进行过滤非常有用。

```python
from google.cloud.firestore_v1.base_query import FieldFilter

vector_store.max_marginal_relevance_search(
    "fuji", 5, filters=FieldFilter("content", "==", "apple")
)
```

### 自定义连接和身份验证

```python
from google.api_core.client_options import ClientOptions
from google.cloud import firestore
from langchain_google_firestore import FirestoreVectorStore

client_options = ClientOptions()
client = firestore.Client(client_options=client_options)

# 创建一个向量存储
vector_store = FirestoreVectorStore(
    collection="fruits",
    embedding=embedding,
    client=client,
)
```
