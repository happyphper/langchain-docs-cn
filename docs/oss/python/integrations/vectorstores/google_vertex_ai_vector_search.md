---
title: Google Vertex AI 向量搜索
---
本页面介绍如何在 LangChain 中使用 Google Vertex AI Vector Search 作为向量存储。

## 概述

[Google Vertex AI Vector Search](https://cloud.google.com/vertex-ai/docs/vector-search/overview) 是一个完全托管的、大规模、低延迟的相似向量查找解决方案。它支持使用 Google 的 ScaNN（可扩展最近邻）技术进行精确和近似最近邻（ANN）搜索。

Vertex AI Vector Search 提供两个版本：

- **[Vector Search 2.0](https://docs.cloud.google.com/vertex-ai/docs/vector-search-2/overview)**：使用集合（Collections）来存储包含向量、元数据和内容的数据对象（Data Objects）。提供统一的数据模型，操作更简单、更快捷。
- **[Vector Search 1.0](https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview)**：使用部署到端点（Endpoints）的索引（Indexes），并在 Google Cloud Storage 或 Datastore 中单独存储文档。

请根据您使用的版本选择以下部分：
- [Vector Search 2.0](#vector-search-20) - 如果您使用集合（Collections）
- [Vector Search 1.0](#vector-search-10) - 如果您使用索引（Indexes）和端点（Endpoints）

有关从 Vertex AI Vector Search 1.0 迁移到 2.0 的信息，请参阅[迁移指南](https://cloud.google.com/vertex-ai/docs/vector-search-2/migration-from-vs-1_0)。

## 安装

安装 LangChain Google Vertex AI 集成包：

```bash
pip install -U langchain-google-vertexai
```

---

# Vector Search 2.0

Vector Search 2.0 使用集合（Collections）来存储数据对象（Data Objects）。每个数据对象在一个统一的结构中包含向量、元数据和内容。

## 前提条件

- 已启用 Vertex AI API 和 Vector Search API 的 Google Cloud 项目

```bash
gcloud services enable vectorsearch.googleapis.com aiplatform.googleapis.com --project "{PROJECT_ID}"
```

- 已创建 Vector Search 集合（参见[创建集合](#creating-a-collection-v2)）
- 适当的 IAM 权限（`Vertex AI User` 角色或同等权限）

## 创建集合 (V2)

在使用 Vector Search 2.0 之前，您需要创建一个集合。以下是如何创建与 LangChain 兼容的集合：

```python
from google.cloud import vectorsearch_v1beta

# 配置
PROJECT_ID = "your-project-id"
LOCATION = "us-central1"
COLLECTION_ID = "langchain-test-collection"

# 创建 Vector Search 服务客户端
vector_search_service_client = vectorsearch_v1beta.VectorSearchServiceClient()

# 创建与 LangChain 兼容的集合
# 重要：要启用过滤功能，必须在 data_schema.properties 中定义可过滤字段
request = vectorsearch_v1beta.CreateCollectionRequest(
    parent=f"projects/{PROJECT_ID}/locations/{LOCATION}",
    collection_id=COLLECTION_ID,
    collection={
        "display_name": "LangChain Test Collection",
        "description": "Collection for testing LangChain VectorSearchVectorStore with filtering",
        "data_schema": {
            "type": "object",
            "properties": {
                # 定义您想要过滤的字段
                "source": {"type": "string"},
                "category": {"type": "string"},
                "page": {"type": "number"},
                # 根据您的具体用例添加更多字段
            },
        },
        "vector_schema": {
            # 向量字段必须命名为 "embedding" 以匹配 LangChain 的默认设置
            "embedding": {
                "dense_vector": {
                    "dimensions": 768  # 对于 text-embedding-005
                }
            },
        },
    },
)

print(f"Creating collection: {COLLECTION_ID}")
operation = vector_search_service_client.create_collection(request=request)
print(f"Operation started: {operation.operation.name}")
print("Waiting for operation to complete...")

result = operation.result()
print(f"Collection created successfully!")
print(f"Resource name: {result.name}")
```

**重要说明：**
- 向量字段必须命名为 `"embedding"` 以匹配 LangChain 的默认设置（或使用 `vector_field_name` 参数）
- 在 V2 中，只有 `data_schema.properties` 中定义的字段可用于过滤
- 维度应与您的嵌入模型匹配（text-embedding-005 为 768）

## 初始化

```python
from langchain_google_vertexai import VectorSearchVectorStore, VertexAIEmbeddings

# 初始化嵌入模型
embeddings = VertexAIEmbeddings(model_name="text-embedding-005")

# 从集合创建向量存储
# 使用创建集合时相同的 PROJECT_ID、LOCATION 和 COLLECTION_ID
vector_store = VectorSearchVectorStore.from_components(
    project_id=PROJECT_ID,
    region=LOCATION,
    collection_id=COLLECTION_ID,
    embedding=embeddings,
    api_version="v2",
)
```

**关键参数：**
- `collection_id`：您的 Vector Search 集合 ID（必需）
- `api_version`：必须设置为 `"v2"`（必需）
- `project_id`：GCP 项目 ID（必需）
- `region`：集合所在的 GCP 区域（必需）
- `vector_field_name`：集合模式中向量字段的名称（默认：`"embedding"`）

## 添加文档

```python
from langchain_core.documents import Document

# 创建文档
docs = [
    Document(
        page_content="Google Vertex AI 是一个托管的机器学习平台",
        metadata={"source": "docs", "category": "AI"}
    ),
    Document(
        page_content="LangChain 与 Vertex AI Vector Search 集成",
        metadata={"source": "blog", "category": "integration"}
    ),
]

# 将文档添加到向量存储
ids = vector_store.add_documents(docs)
print(f"已添加文档，ID 为：{ids}")
```

### 添加文本

```python
texts = [
    "Vertex AI 提供可扩展的 ML 基础设施",
    "Vector Search 支持大规模相似性搜索",
]

metadatas = [
    {"source": "website", "page": 1},
    {"source": "website", "page": 2},
]

ids = vector_store.add_texts(texts=texts, metadatas=metadatas)
```

## 搜索

### 基本相似性搜索

```python
# 基本相似性搜索
query = "什么是 Vertex AI？"
results = vector_store.similarity_search(query, k=5)

for doc in results:
    print(f"内容：{doc.page_content}")
    print(f"元数据：{doc.metadata}\n")
```

### 带分数的相似性搜索

```python
# 获取文档及其相似性分数
results_with_scores = vector_store.similarity_search_with_score(
    "什么是 Vertex AI？",
    k=5
)

for doc, score in results_with_scores:
    print(f"分数：{score}")
    print(f"内容：{doc.page_content}")
    print(f"元数据：{doc.metadata}\n")
```

### 通过向量搜索

```python
# 使用预计算的嵌入进行搜索
embedding = embeddings.embed_query("Vertex AI 功能")

results = vector_store.similarity_search_by_vector_with_score(embedding, k=5)

for doc, score in results:
    print(f"分数：{score}")
    print(f"内容：{doc.page_content}\n")
```

## 过滤

Vector Search 2.0 使用基于字典的查询语法来过滤数据对象：

```python
# 简单相等过滤器
results = vector_store.similarity_search(
    "AI 功能",
    k=5,
    filter={"source": {"$eq": "docs"}}
)

# 比较运算符
results = vector_store.similarity_search(
    "最近页面",
    k=5,
    filter={"page": {"$gte": 10}}
)

# 逻辑 AND
results = vector_store.similarity_search(
    "AI 文档",
    k=5,
    filter={
        "$and": [
            {"source": {"$eq": "docs"}},
            {"category": {"$eq": "AI"}}
        ]
    }
)

# 逻辑 OR
results = vector_store.similarity_search(
    "文档",
    k=5,
    filter={
        "$or": [
            {"source": {"$eq": "docs"}},
            {"source": {"$eq": "blog"}}
        ]
    }
)

# 小于
results = vector_store.similarity_search(
    "早期页面",
    k=5,
    filter={"page": {"$lt": 5}}
)
```

**支持的运算符：**
- `$eq`：等于
- `$ne`：不等于
- `$lt`：小于
- `$lte`：小于或等于
- `$gt`：大于
- `$gte`：大于或等于
- `$and`：逻辑与
- `$or`：逻辑或
- `$not`：逻辑非

更多详情，请参阅 [Vector Search 2.0 查询文档](https://cloud.google.com/vertex-ai/docs/vector-search-2/query-search/query)。

## 删除操作

### 按 ID 删除

```python
# 按 ID 删除特定文档
ids_to_delete = ["id1", "id2", "id3"]
vector_store.delete(ids=ids_to_delete)
```

### 按元数据过滤器删除

**注意**：在当前 V2 API 中，按元数据过滤器删除存在限制。推荐的方法是：
1. 使用 `similarity_search` 配合您的过滤器来获取文档 ID
2. 按 ID 删除

```python
# 推荐：先搜索，然后按 ID 删除
results = vector_store.similarity_search(
    "query",  # 使用一个宽泛的查询
    k=1000,   # 获取更多结果
    filter={"source": {"$eq": "old_docs"}}
)
ids_to_delete = [doc.metadata.get("id") for doc in results if "id" in doc.metadata]
vector_store.delete(ids=ids_to_delete)
```

或者，如果您的环境支持直接按元数据删除：

```python
# 直接按元数据删除（可能有限制）
try:
    vector_store.delete(metadata={"source": {"$eq": "old_docs"}})
except Exception as e:
    # 回退到先搜索再删除的方法
    print(f"直接删除失败: {e}")
```

## 高级功能

Vector Search 2.0 提供了多种超越传统密集向量搜索的高级搜索能力。

### 语义搜索

语义搜索使用 Vertex AI 模型自动从您的查询文本生成嵌入向量。您的集合必须在向量模式中配置 `vertex_embedding_config`。

```python
# 使用自动生成嵌入向量的语义搜索
results = vector_store.semantic_search(
    query="Tell me about animals",
    k=5,
    search_field="embedding",  # 具有自动嵌入配置的向量字段
    task_type="RETRIEVAL_QUERY",  # 为搜索查询优化嵌入向量
    filter={"category": {"$eq": "wildlife"}}  # 可选过滤
)

for doc in results:
    print(f"内容: {doc.page_content}")
    print(f"元数据: {doc.metadata}\n")
```

**任务类型：**
- `RETRIEVAL_QUERY`：用于搜索查询（默认）
- `RETRIEVAL_DOCUMENT`：用于文档索引
- `SEMANTIC_SIMILARITY`：用于语义相似性任务
- `CLASSIFICATION`：用于分类任务
- `CLUSTERING`：用于聚类任务

### 文本搜索

文本搜索在不使用嵌入向量的情况下，对数据字段执行关键词/全文匹配。

```python
# 在数据字段上进行关键词搜索
results = vector_store.text_search(
    query="Python programming",
    k=10,
    data_field_names=["page_content", "title"]  # 要搜索的字段
)

for doc in results:
    print(f"内容: {doc.page_content}\n")
```

!!! note
文本搜索不支持过滤器。如果需要过滤，请使用 `semantic_search()` 或 `similarity_search()`。

### 混合搜索

混合搜索结合了语义搜索（使用自动生成的嵌入向量）和文本搜索（关键词匹配），使用 Reciprocal Rank Fusion (RRF) 来产生最优排序的结果。

```python
# 混合搜索：语义理解 + 关键词匹配
results = vector_store.hybrid_search(
    query="Men's outfit for beach",
    k=10,
    search_field="embedding",  # 具有自动嵌入配置的向量字段
    data_field_names=["page_content"],  # 用于文本搜索的字段
    task_type="RETRIEVAL_QUERY",
    filter={"price": {"$lt": 100}},  # 语义搜索的可选过滤器
    semantic_weight=1.0,  # 语义结果的权重
    text_weight=1.0  # 关键词结果的权重
)

for doc in results:
    print(f"内容: {doc.page_content}\n")
```

**权重参数：**
- 更高的 `semantic_weight`：优先考虑语义理解
- 更高的 `text_weight`：优先考虑精确的关键词匹配
- 相等的权重（默认）：平衡的结果

在语义搜索和文本搜索结果中均排名靠前的产品，将在合并结果中获得最高排名。

有关更多信息，请参阅 [Vector Search 2.0 文档](https://cloud.google.com/vertex-ai/docs/vector-search/overview)。

### 自定义向量字段名称

如果您的集合（Collection）模式为向量使用了自定义字段名：

```python
vector_store = VectorSearchVectorStore.from_components(
    project_id="your-project-id",
    region="us-central1",
    collection_id="your-collection-id",
    embedding=embeddings,
    api_version="v2",
    vector_field_name="custom_embedding_field",  # 与您的模式匹配
)
```

## 其他资源

- [Vector Search 2.0 概述](https://cloud.google.com/vertex-ai/docs/vector-search-2/overview)
- [Vector Search 2.0 集合](https://cloud.google.com/vertex-ai/docs/vector-search-2/collections/collections)
- [Vector Search 2.0 数据对象](https://cloud.google.com/vertex-ai/docs/vector-search-2/data-objects/data-objects)
- [Vector Search 2.0 搜索指南](https://cloud.google.com/vertex-ai/docs/vector-search-2/query-search/search)
- [Vector Search 2.0 查询指南](https://cloud.google.com/vertex-ai/docs/vector-search-2/query-search/query)
- [Vector Search 2.0 迁移指南](https://cloud.google.com/vertex-ai/docs/vector-search-2/migration-from-vs-1_0)

---

# Vector Search 1.0

本笔记本展示了如何使用与 `Google Cloud Vertex AI Vector Search` 向量数据库相关的功能。

> [Google Vertex AI Vector Search](https://cloud.google.com/vertex-ai/docs/vector-search/overview)，前身为 Vertex AI Matching Engine，提供了业界领先的高规模、低延迟向量数据库。这些向量数据库通常被称为向量相似性匹配或近似最近邻（ANN）服务。

**注意**：LangChain API 期望已创建一个端点和一个已部署的索引。索引创建时间可能长达一小时。

> 要了解如何创建索引，请参阅 [创建索引并将其部署到端点](#create-index-and-deploy-it-to-an-endpoint) 部分。
如果您已有已部署的索引，请跳转到 [从文本创建 VectorStore](#create-vector-store-from-texts)

## 创建索引并将其部署到端点

- 本节演示如何创建新索引并将其部署到端点。

```python
# TODO : 根据您的需求设置值
# 项目和存储常量
PROJECT_ID = "<my_project_id>"
REGION = "<my_region>"
BUCKET = "<my_gcs_bucket>"
BUCKET_URI = f"gs://{BUCKET}"

# textembedding-gecko@003 的维度数为 768
# 如果使用其他嵌入器，维度可能需要更改。
DIMENSIONS = 768

# 索引常量
DISPLAY_NAME = "<my_matching_engine_index_id>"
DEPLOYED_INDEX_ID = "<my_matching_engine_endpoint_id>"
```

```python
# 创建一个存储桶。
! gsutil mb -l $REGION -p $PROJECT_ID $BUCKET_URI
```

### 使用 `VertexAIEmbeddings` 作为嵌入模型

```python
from google.cloud import aiplatform
from langchain_google_vertexai import VertexAIEmbeddings
```

```python
aiplatform.init(project=PROJECT_ID, location=REGION, staging_bucket=BUCKET_URI)
```

```python
embedding_model = VertexAIEmbeddings(model_name="text-embedding-005")
```

### 创建空索引

**注意：** 创建索引时，您应指定 "index_update_method"，可以是 "BATCH_UPDATE" 或 "STREAM_UPDATE"。
> 批处理索引适用于您希望批量更新索引，处理在一段时间内存储的数据，例如每周或每月处理的系统。流式索引适用于您希望在将新数据添加到数据存储时立即更新索引数据的情况，例如，如果您有一个书店，并希望尽快在线展示新库存。选择哪种类型很重要，因为设置和要求不同。

有关配置索引的更多详细信息，请参阅 [官方文档](https://cloud.google.com/vertex-ai/docs/vector-search/create-manage-index#create-index-batch)。

```python
# 注意：此操作最多可能需要 30 秒
my_index = aiplatform.MatchingEngineIndex.create_tree_ah_index(
    display_name=DISPLAY_NAME,
    dimensions=DIMENSIONS,
    approximate_neighbors_count=150,
    distance_measure_type="DOT_PRODUCT_DISTANCE",
    index_update_method="STREAM_UPDATE",  # 允许的值 BATCH_UPDATE , STREAM_UPDATE
)
```

### 创建端点

```python
# 创建端点
my_index_endpoint = aiplatform.MatchingEngineIndexEndpoint.create(
    display_name=f"{DISPLAY_NAME}-endpoint", public_endpoint_enabled=True
)
```

### 将索引部署到端点

```python
# 注意：此操作最多可能需要 20 分钟
my_index_endpoint = my_index_endpoint.deploy_index(
    index=my_index, deployed_index_id=DEPLOYED_INDEX_ID
)

my_index_endpoint.deployed_indexes
```

## 从文本创建向量存储

注意：如果您已有现有的索引和端点，可以使用以下代码加载它们

```python
# TODO : 将 1234567890123456789 替换为您的实际索引 ID
my_index = aiplatform.MatchingEngineIndex("1234567890123456789")

# TODO : 将 1234567890123456789 替换为您的实际端点 ID
my_index_endpoint = aiplatform.MatchingEngineIndexEndpoint("1234567890123456789")
```

```python
from langchain_google_vertexai import (
    VectorSearchVectorStore,
    VectorSearchVectorStoreDatastore,
)
```

Langchainassets.png
```

### 在问答链中使用检索器的过滤器

```python
from langchain_google_vertexai import VertexAI

llm = VertexAI(model_name="gemini-pro")
```

```python
from langchain_classic.chains import RetrievalQA

filters = [Namespace(name="season", allow_tokens=["spring"])]
numeric_filters = [NumericNamespace(name="price", value_float=40.0, op="LESS")]

retriever.search_kwargs = {"k": 2, "filter": filters, "numeric_filter": numeric_filters}

retrieval_qa = RetrievalQA.from_chain_type(
llm=llm,
chain_type="stuff",
retriever=retriever,
return_source_documents=True,
)

question = "What are my options in breathable fabric?"
response = retrieval_qa({"query": question})
print(f"{response['result']}")
print("REFERENCES")
print(f"{response['source_documents']}")
```

## 读取、分块、向量化和索引 PDF 文件

```python
!pip install pypdf
```

```python
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
```

```python
loader = PyPDFLoader("https://arxiv.org/pdf/1706.03762.pdf")
pages = loader.load()
```

```python
text_splitter = RecursiveCharacterTextSplitter(
    # 设置一个非常小的块大小，仅用于演示。
chunk_size=1000,
chunk_overlap=20,
length_function=len,
is_separator_regex=False,
)
doc_splits = text_splitter.split_documents(pages)
```

```python
texts = [doc.page_content for doc in doc_splits]
metadatas = [doc.metadata for doc in doc_splits]
```

```python
texts[0]
```

```python
# 检查第一页的元数据
metadatas[0]
```

```python
vector_store = VectorSearchVectorStore.from_components(
project_id=PROJECT_ID,
region=REGION,
gcs_bucket_name=BUCKET,
index_id=my_index.name,
endpoint_id=my_index_endpoint.name,
embedding=embedding_model,
)

vector_store.add_texts(texts=texts, metadatas=metadatas, is_complete_overwrite=True)
```

```python
vector_store = VectorSearchVectorStore.from_components(
project_id=PROJECT_ID,
region=REGION,
gcs_bucket_name=BUCKET,
index_id=my_index.name,
endpoint_id=my_index_endpoint.name,
embedding=embedding_model,
)
```

## 混合搜索

向量搜索支持混合搜索，这是信息检索（IR）中一种流行的架构模式，它结合了语义搜索和关键词搜索（也称为基于令牌的搜索）。通过混合搜索，开发者可以充分利用这两种方法的优势，有效提供更高的搜索质量。
点击[此处](https://cloud.google.com/vertex-ai/docs/vector-search/about-hybrid-search)了解更多。

为了使用混合搜索，我们需要拟合一个稀疏嵌入向量化器，并在向量搜索集成之外处理嵌入。
稀疏嵌入向量化器的一个例子是 sklearn 的 TfidfVectorizer，但也可以使用其他技术，例如 BM25。

```python
# 定义一些示例数据
texts = [
"The cat sat on",
"the mat.",
"I like to",
"eat pizza for",
"dinner.",
"The sun sets",
"in the west.",
]

# 可选的 ID
ids = ["i_" + str(i + 1) for i in range(len(texts))]

# 可选的元数据
metadatas = [{"my_metadata": i} for i in range(len(texts))]
```

```python
from sklearn.feature_extraction.text import TfidfVectorizer

# 拟合 TFIDF 向量化器（这通常在一个非常大的数据语料库上完成，以确保单词统计在新数据上能很好地泛化）
vectorizer = TfidfVectorizer()
vectorizer.fit(texts)
```

```python
# 将文本转换为 TF-IDF 稀疏向量的实用函数
def get_sparse_embedding(tfidf_vectorizer, text):
tfidf_vector = tfidf_vectorizer.transform([text])
values = []
dims = []
for i, tfidf_value in enumerate(tfidf_vector.data):
values.append(float(tfidf_value))
dims.append(int(tfidf_vector.indices[i]))
return {"values": values, "dimensions": dims}
```

```python
# 语义（稠密）嵌入
embeddings = embedding_model.embed_documents(texts)
# tfidf（稀疏）嵌入
sparse_embeddings = [get_sparse_embedding(vectorizer, x) for x in texts]
```

```python
sparse_embeddings[0]
```

```python
# 在向量搜索中添加稠密和稀疏嵌入

vector_store.add_texts_with_embeddings(
texts=texts,
embeddings=embeddings,
sparse_embeddings=sparse_embeddings,
ids=ids,
metadatas=metadatas,
)
```

```python
# 运行混合搜索
query = "the cat"
embedding = embedding_model.embed_query(query)
sparse_embedding = get_sparse_embedding(vectorizer, query)

vector_store.similarity_search_by_vector_with_score(
embedding=embedding,
sparse_embedding=sparse_embedding,
k=5,
rrf_ranking_alpha=0.7,  # 0.7 权重给稠密，0.3 权重给稀疏
)
```
