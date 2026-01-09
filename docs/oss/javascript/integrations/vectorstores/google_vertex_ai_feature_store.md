---
title: Google Vertex AI 特征存储
---
> [Google Cloud Vertex Feature Store](https://cloud.google.com/vertex-ai/docs/featurestore/latest/overview) 通过支持低延迟地提供 [Google Cloud BigQuery](https://cloud.google.com/bigquery?hl=en) 中的数据（包括执行嵌入向量的近似最近邻检索能力），简化了您的机器学习特征管理和在线服务流程。

本教程将向您展示如何直接从 BigQuery 数据轻松执行低延迟向量搜索和近似最近邻检索，从而以最少的设置实现强大的机器学习应用。我们将使用 `VertexFSVectorStore` 类来实现这一目标。

该类属于一组能够在 Google Cloud 中提供统一数据存储和灵活向量搜索的两个类之一：

- **BigQuery 向量搜索**：通过 `BigQueryVectorStore` 类实现，非常适合无需基础设施设置和批量检索的快速原型开发。
- **特征存储在线存储**：通过 `VertexFSVectorStore` 类实现，支持通过手动或计划数据同步进行低延迟检索。是面向生产环境的、面向用户的生成式 AI 应用的理想选择。

Diagram BQ-VertexFS

## 快速开始

### 安装库

```python
pip install -qU  langchain langchain-google-vertexai "langchain-google-community[featurestore]"
```

要在此 Jupyter 运行时中使用新安装的包，您必须重启运行时。您可以通过运行下面的单元格来重启当前内核。

```python
import IPython

app = IPython.Application.instance()
app.kernel.do_shutdown(True)
```

## 开始之前

#### 设置您的项目 ID

如果您不知道您的项目 ID，请尝试以下方法：
- 运行 `gcloud config list`。
- 运行 `gcloud projects list`。
- 查看支持页面：[查找项目 ID](https://support.google.com/googleapi/answer/7014113)。

```python
PROJECT_ID = ""  # @param {type:"string"}

# 设置项目 ID
! gcloud config set project {PROJECT_ID}
```

#### 设置区域

您也可以更改 BigQuery 使用的 `REGION` 变量。了解更多关于 [BigQuery 区域](https://cloud.google.com/bigquery/docs/locations#supported_locations) 的信息。

```python
REGION = "us-central1"  # @param {type: "string"}
```

#### 设置数据集和表名

它们将成为您的 BigQuery 向量存储。

```python
DATASET = "my_langchain_dataset"  # @param {type: "string"}
TABLE = "doc_and_vectors"  # @param {type: "string"}
```

### 验证您的笔记本环境

- 如果您使用 **Colab** 运行此笔记本，请取消注释下面的单元格并继续。
- 如果您使用 **Vertex AI Workbench**，请查看 [此处](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/setup-env) 的设置说明。

```python
# from google.colab import auth as google_auth

# google_auth.authenticate_user()
```

## 演示：VertexFSVectorStore

### 创建嵌入类实例

您可能需要通过运行 `gcloud services enable aiplatform.googleapis.com --project {PROJECT_ID}` 在您的项目中启用 Vertex AI API（将 `{PROJECT_ID}` 替换为您的项目名称）。

您可以使用任何 [LangChain 嵌入模型](/oss/integrations/text_embedding/)。

```python
from langchain_google_vertexai import VertexAIEmbeddings

embedding = VertexAIEmbeddings(
    model_name="textembedding-gecko@latest", project=PROJECT_ID
)
```

### 初始化 VertexFSVectorStore

如果 BigQuery 数据集和表不存在，它们将被自动创建。查看 [此处](https://github.com/langchain-ai/langchain-google/blob/main/libs/community/langchain_google_community/bq_storage_vectorstores/featurestore.py#L33) 的类定义以了解所有可选参数。

```python
from langchain_google_community import VertexFSVectorStore

store = VertexFSVectorStore(
    project_id=PROJECT_ID,
    dataset_name=DATASET,
    table_name=TABLE,
    location=REGION,
    embedding=embedding,
)
```

### 添加文本

> 注意：由于需要创建特征在线存储，第一次同步过程将需要大约 20 分钟。

```python
all_texts = ["Apples and oranges", "Cars and airplanes", "Pineapple", "Train", "Banana"]
metadatas = [{"len": len(t)} for t in all_texts]

store.add_texts(all_texts, metadatas=metadatas)
```

您也可以通过执行 `sync_data` 方法按需启动同步。

```python
store.sync_data()
```

在生产环境中，您还可以使用 `cron_schedule` 类参数来设置自动计划同步。
例如：

```python
store = VertexFSVectorStore(cron_schedule="TZ=America/Los_Angeles 00 13 11 8 *", ...)
```

### 搜索文档

```python
query = "I'd like a fruit."
docs = store.similarity_search(query)
print(docs)
```

### 通过向量搜索文档

```python
query_vector = embedding.embed_query(query)
docs = store.similarity_search_by_vector(query_vector, k=2)
print(docs)
```

### 使用元数据过滤器搜索文档

```python
# 这应该只返回 "Banana" 文档。
docs = store.similarity_search_by_vector(query_vector, filter={"len": 6})
print(docs)
```

### 添加带嵌入的文本

您也可以使用 `add_texts_with_embeddings` 方法自带嵌入。
这对于可能需要自定义预处理才能生成嵌入的多模态数据特别有用。

```python
items = ["some text"]
embs = embedding.embed(items)

ids = store.add_texts_with_embeddings(
    texts=["some text"], embs=embs, metadatas=[{"len": 1}]
)
```

### 使用 BigQuery 进行批量服务

您可以简单地使用 `.to_bq_vector_store()` 方法来获取一个 BigQueryVectorStore 对象，该对象为批量用例提供了优化的性能。所有必需的参数将自动从现有类中传递。查看 [类定义](https://github.com/langchain-ai/langchain-google/blob/main/libs/community/langchain_google_community/bq_storage_vectorstores/bigquery.py#L26) 以了解您可以使用的所有参数。

使用 `.to_vertex_fs_vector_store()` 方法可以同样轻松地切换回 BigQueryVectorStore。

```python
store.to_bq_vector_store()  # 将可选的 VertexFSVectorStore 参数作为参数传递
```
