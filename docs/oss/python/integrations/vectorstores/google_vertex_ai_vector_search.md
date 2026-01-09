---
title: Google Vertex AI 向量搜索
---
本笔记本展示了如何使用与 `Google Cloud Vertex AI Vector Search` 向量数据库相关的功能。

> [Google Vertex AI Vector Search](https://cloud.google.com/vertex-ai/docs/vector-search/overview)，前身为 Vertex AI Matching Engine，提供业界领先的高规模、低延迟向量数据库。这些向量数据库通常被称为向量相似性匹配或近似最近邻（ANN）服务。

**注意**：LangChain API 期望已创建好端点并部署了索引。索引创建时间可能长达一小时。

> 要了解如何创建索引，请参阅章节 [创建索引并将其部署到端点](#create-index-and-deploy-it-to-an-endpoint)
如果您已有部署好的索引，请跳转到 [从文本创建 VectorStore](#create-vector-store-from-texts)

## 创建索引并将其部署到端点

- 本节演示如何创建新索引并将其部署到端点

```python
# TODO : Set values as per your requirements
# Project and Storage Constants
PROJECT_ID = "<my_project_id>"
REGION = "<my_region>"
BUCKET = "<my_gcs_bucket>"
BUCKET_URI = f"gs://{BUCKET}"

# The number of dimensions for the textembedding-gecko@003 is 768
# If other embedder is used, the dimensions would probably need to change.
DIMENSIONS = 768

# Index Constants
DISPLAY_NAME = "<my_matching_engine_index_id>"
DEPLOYED_INDEX_ID = "<my_matching_engine_endpoint_id>"
```

```python
# Create a bucket.
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

**注意：** 创建索引时，您应从 "BATCH_UPDATE" 或 "STREAM_UPDATE" 中指定一个 "index_update_method"
> 批处理索引适用于您希望批量更新索引的情况，数据是在一段时间内累积存储的，例如每周或每月处理的系统。流式索引适用于您希望在新数据添加到数据存储时立即更新索引数据的情况，例如，如果您有一个书店，并希望尽快在线展示新库存。选择哪种类型很重要，因为设置和要求不同。

有关配置索引的更多详细信息，请参阅 [官方文档](https://cloud.google.com/vertex-ai/docs/vector-search/create-manage-index#create-index-batch)

```python
# NOTE : This operation can take upto 30 seconds
my_index = aiplatform.MatchingEngineIndex.create_tree_ah_index(
    display_name=DISPLAY_NAME,
    dimensions=DIMENSIONS,
    approximate_neighbors_count=150,
    distance_measure_type="DOT_PRODUCT_DISTANCE",
    index_update_method="STREAM_UPDATE",  # allowed values BATCH_UPDATE , STREAM_UPDATE
)
```

### 创建端点

```python
# Create an endpoint
my_index_endpoint = aiplatform.MatchingEngineIndexEndpoint.create(
    display_name=f"{DISPLAY_NAME}-endpoint", public_endpoint_enabled=True
)
```

### 将索引部署到端点

```python
# NOTE : This operation can take upto 20 minutes
my_index_endpoint = my_index_endpoint.deploy_index(
    index=my_index, deployed_index_id=DEPLOYED_INDEX_ID
)

my_index_endpoint.deployed_indexes
```

## 从文本创建向量存储

注意：如果您已有现有的索引和端点，可以使用以下代码加载它们

```python
# TODO : replace 1234567890123456789 with your acutial index ID
my_index = aiplatform.MatchingEngineIndex("1234567890123456789")

# TODO : replace 1234567890123456789 with your acutial endpoint ID
my_index_endpoint = aiplatform.MatchingEngineIndexEndpoint("1234567890123456789")
```

```python
from langchain_google_vertexai import (
    VectorSearchVectorStore,
    VectorSearchVectorStoreDatastore,
)
```

Langchainassets.png了解更多。

为了使用混合搜索，我们需要拟合一个稀疏嵌入向量化器，并在向量搜索集成之外处理嵌入。
稀疏嵌入向量化器的一个例子是 sklearn 的 TfidfVectorizer，但也可以使用其他技术，例如 BM25。

```python
# Define some sample data
texts = [
    "The cat sat on",
    "the mat.",
    "I like to",
    "eat pizza for",
    "dinner.",
    "The sun sets",
    "in the west.",
]

# optional IDs
ids = ["i_" + str(i + 1) for i in range(len(texts))]

# optional metadata
metadatas = [{"my_metadata": i} for i in range(len(texts))]
```

```python
from sklearn.feature_extraction.text import TfidfVectorizer

# Fit the TFIDF Vectorizer (This is usually done on a very large corpus of data to make sure that word statistics generalize well on new data)
vectorizer = TfidfVectorizer()
vectorizer.fit(texts)
```

```python
# Utility function to transform text into a TF-IDF Sparse Vector
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
# semantic (dense) embeddings
embeddings = embedding_model.embed_documents(texts)
# tfidf (sparse) embeddings
sparse_embeddings = [get_sparse_embedding(vectorizer, x) for x in texts]
```

```python
sparse_embeddings[0]
```

```python
# Add the dense and sparse embeddings in Vector Search

vector_store.add_texts_with_embeddings(
    texts=texts,
    embeddings=embeddings,
    sparse_embeddings=sparse_embeddings,
    ids=ids,
    metadatas=metadatas,
)
```

```python
# Run hybrid search
query = "the cat"
embedding = embedding_model.embed_query(query)
sparse_embedding = get_sparse_embedding(vectorizer, query)

vector_store.similarity_search_by_vector_with_score(
    embedding=embedding,
    sparse_embedding=sparse_embedding,
    k=5,
    rrf_ranking_alpha=0.7,  # 0.7 weight to dense and 0.3 weight to sparse
)
```

