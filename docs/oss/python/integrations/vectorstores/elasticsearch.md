---
title: Elasticsearch
---
>[Elasticsearch](https://www.elastic.co/elasticsearch/) 是一个分布式的、RESTful 风格的搜索和分析引擎，能够执行向量搜索和词法搜索。它构建在 Apache Lucene 库之上。

本笔记本展示了如何使用与 `Elasticsearch` 向量存储相关的功能。

## 设置

为了使用 `Elasticsearch` 向量搜索，你必须安装 `langchain-elasticsearch` 包。

```python
pip install -qU langchain-elasticsearch
```

### 凭证

主要有两种方式来设置用于本库的 Elasticsearch 实例：

1.  Elastic Cloud：Elastic Cloud 是一个托管的 Elasticsearch 服务。注册[免费试用](https://cloud.elastic.co/registration?utm_source=langchain&utm_content=documentation)。

要连接到不需要登录凭证的 Elasticsearch 实例（启动启用了安全性的 Docker 实例），请将 Elasticsearch URL、索引名称以及嵌入对象传递给构造函数。

2.  本地安装 Elasticsearch：通过本地运行 Elasticsearch 来开始使用。最简单的方法是使用官方的 Elasticsearch Docker 镜像。更多信息请参阅 [Elasticsearch Docker 文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)。

### 本地运行 Elasticsearch

对于开发和测试，本地运行 Elasticsearch 最简单的方法是使用 [start-local](https://github.com/elastic/start-local) 脚本。该脚本使用 Docker 通过一行简单的命令来设置 Elasticsearch（以及可选的 Kibana）。

```bash
curl -fsSL https://elastic.co/start-local | sh
```

这将创建一个包含配置文件和启动脚本的 `elastic-start-local` 文件夹。要启动 Elasticsearch：

```bash
cd elastic-start-local
./start.sh
```

Elasticsearch 将在 `http://localhost:9200` 可用。`elastic` 用户的密码和 API 密钥会自动生成并存储在 `elastic-start-local` 文件夹的 `.env` 文件中。

如果你只需要 Elasticsearch 而不需要 Kibana，可以使用 `--esonly` 选项：

```bash
curl -fsSL https://elastic.co/start-local | sh -s -- --esonly
```

<Note>

start-local 设置仅用于本地测试，不应在生产环境中使用。对于生产安装，请参考官方的 [Elasticsearch 文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html)。

</Note>

### 使用身份验证运行

对于生产环境，我们建议启用安全性运行。要使用登录凭证连接，可以使用参数 `es_api_key` 或 `es_user` 和 `es_password`。

<EmbeddingTabs/>

```python
# | output: false
# | echo: false
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
```

```python
from langchain_elasticsearch import ElasticsearchStore

elastic_vector_search = ElasticsearchStore(
    es_url="http://localhost:9200",
    index_name="langchain_index",
    embedding=embeddings,
    es_user="elastic",
    es_password="changeme",
)
```

#### 如何获取默认 "elastic" 用户的密码？

要获取 Elastic Cloud 中默认 "elastic" 用户的密码：

1.  登录 Elastic Cloud 控制台 [cloud.elastic.co](https://cloud.elastic.co)
2.  转到 "Security" > "Users"
3.  找到 "elastic" 用户并点击 "Edit"
4.  点击 "Reset password"
5.  按照提示重置密码

#### 如何获取 API 密钥？

要获取 API 密钥：

1.  登录 Elastic Cloud 控制台 [cloud.elastic.co](https://cloud.elastic.co)
2.  打开 Kibana 并转到 Stack Management > API Keys
3.  点击 "Create API key"
4.  输入 API 密钥的名称并点击 "Create"
5.  复制 API 密钥并将其粘贴到 `api_key` 参数中

### Elastic Cloud

要连接到 Elastic Cloud 上的 Elasticsearch 实例，可以使用 `es_cloud_id` 参数或 `es_url`。

```python
elastic_vector_search = ElasticsearchStore(
    es_cloud_id="<cloud_id>",
    index_name="test_index",
    embedding=embeddings,
    es_user="elastic",
    es_password="changeme",
)
```

如果你想获得最佳的模型调用自动追踪功能，也可以通过取消注释以下代码来设置你的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

## 初始化

Elasticsearch 通过 [docker](#running-elasticsearch-via-docker) 在本地 localhost:9200 上运行。有关如何从 Elastic Cloud 连接到 Elasticsearch 的更多详细信息，请参阅上面的[使用身份验证连接](#running-with-authentication)。

```python
from langchain_elasticsearch import ElasticsearchStore

vector_store = ElasticsearchStore(
    "langchain-demo", embedding=embeddings, es_url="http://localhost:9201"
)
```

## 管理向量存储

### 向向量存储添加项目

```python
from uuid import uuid4

from langchain_core.documents import Document

document_1 = Document(
    page_content="I had chocolate chip pancakes and scrambled eggs for breakfast this morning.",
    metadata={"source": "tweet"},
)

document_2 = Document(
    page_content="The weather forecast for tomorrow is cloudy and overcast, with a high of 62 degrees.",
    metadata={"source": "news"},
)

document_3 = Document(
    page_content="Building an exciting new project with LangChain - come check it out!",
    metadata={"source": "tweet"},
)

document_4 = Document(
    page_content="Robbers broke into the city bank and stole $1 million in cash.",
    metadata={"source": "news"},
)

document_5 = Document(
    page_content="Wow! That was an amazing movie. I can't wait to see it again.",
    metadata={"source": "tweet"},
)

document_6 = Document(
    page_content="Is the new iPhone worth the price? Read this review to find out.",
    metadata={"source": "website"},
)

document_7 = Document(
    page_content="The top 10 soccer players in the world right now.",
    metadata={"source": "website"},
)

document_8 = Document(
    page_content="LangGraph is the best framework for building stateful, agentic applications!",
    metadata={"source": "tweet"},
)

document_9 = Document(
    page_content="The stock market is down 500 points today due to fears of a recession.",
    metadata={"source": "news"},
)

document_10 = Document(
    page_content="I have a bad feeling I am going to get deleted :(",
    metadata={"source": "tweet"},
)

documents = [
    document_1,
    document_2,
    document_3,
    document_4,
    document_5,
    document_6,
    document_7,
    document_8,
    document_9,
    document_10,
]
uuids = [str(uuid4()) for _ in range(len(documents))]

vector_store.add_documents(documents=documents, ids=uuids)
```

```python
['21cca03c-9089-42d2-b41c-3d156be2b519',
 'a6ceb967-b552-4802-bb06-c0e95fce386e',
 '3a35fac4-e5f0-493b-bee0-9143b41aedae',
 '176da099-66b1-4d6a-811b-dfdfe0808d30',
 'ecfa1a30-3c97-408b-80c0-5c43d68bf5ff',
 'c0f08baa-e70b-4f83-b387-c6e0a0f36f73',
 '489b2c9c-1925-43e1-bcf0-0fa94cf1cbc4',
 '408c6503-9ba4-49fd-b1cc-95584cd914c5',
 '5248c899-16d5-4377-a9e9-736ca443ad4f',
 'ca182769-c4fc-4e25-8f0a-8dd0a525955c']
```

### 从向量存储中删除项目

```python
vector_store.delete(ids=[uuids[-1]])
```

```text
True
```

## 查询向量存储

一旦你的向量存储被创建并且相关文档已添加，你很可能会希望在运行链或代理时查询它。这些示例还展示了如何在搜索时使用过滤。

### 直接查询

#### 相似性搜索

可以通过以下方式执行带有元数据过滤的简单相似性搜索：

```python
results = vector_store.similarity_search(
    query="LangChain provides abstractions to make working with LLMs easy",
    k=2,
    filter=[{"term": {"metadata.source.keyword": "tweet"}}],
)
for res in results:
    print(f"* {res.page_content} [{res.metadata}]")
```

```text
* Building an exciting new project with LangChain - come check it out! [{'source': 'tweet'}]
* LangGraph is the best framework for building stateful, agentic applications! [{'source': 'tweet'}]
```

#### 带分数的相似性搜索

如果你想执行相似性搜索并接收相应的分数，可以运行：

```python
results = vector_store.similarity_search_with_score(
    query="Will it be hot tomorrow",
    k=1,
    filter=[{"term": {"metadata.source.keyword": "news"}}],
)
for doc, score in results:
    print(f"* [SIM={score:3f}] {doc.page_content} [{doc.metadata}]")
```

```text
* [SIM=0.765887] The weather forecast for tomorrow is cloudy and overcast, with a high of 62 degrees. [{'source': 'news'}]
```

### 通过转换为检索器进行查询

你也可以将向量存储转换为检索器，以便在你的链中更轻松地使用。

```python
retriever = vector_store.as_retriever(
    search_type="similarity_score_threshold", search_kwargs={"score_threshold": 0.2}
)
retriever.invoke("Stealing from the bank is a crime")
```

```text
[Document(metadata={'source': 'news'}, page_content='Robbers broke into the city bank and stole $1 million in cash.'),
 Document(metadata={'source': 'news'}, page_content='The stock market is down 500 points today due to fears of a recession.'),
 Document(metadata={'source': 'website'}, page_content='Is the new iPhone worth the price? Read this review to find out.'),
 Document(metadata={'source': 'tweet'}, page_content='Building an exciting new project with LangChain - come check it out!')]
```

## 距离相似性算法

Elasticsearch 支持以下向量距离相似性算法：

-   cosine
-   euclidean
-   dot_product

余弦相似性算法是默认算法。

你可以通过 similarity 参数指定所需的相似性算法。

**注意**：根据检索策略，相似性算法不能在查询时更改。需要在为字段创建索引映射时设置。如果你需要更改相似性算法，需要删除索引并使用正确的 distance_strategy 重新创建。

```python
db = ElasticsearchStore.from_documents(
    docs,
    embeddings,
    es_url="http://localhost:9200",
    index_name="test",
    distance_strategy="COSINE",
    # distance_strategy="EUCLIDEAN_DISTANCE"
    # distance_strategy="DOT_PRODUCT"
)
```

## 检索策略

Elasticsearch 相对于其他纯向量数据库的一大优势在于其能够支持广泛的检索策略。在本笔记本中，我们将配置 `ElasticsearchStore` 以支持一些最常见的检索策略。

默认情况下，`ElasticsearchStore` 使用 `DenseVectorStrategy`（在 0.2.0 版本之前称为 `ApproxRetrievalStrategy`）。

### DenseVectorStrategy

这将返回与查询向量最相似的前 k 个向量。`k` 参数在初始化 `ElasticsearchStore` 时设置。默认值为 10。

```python
from langchain_elasticsearch import DenseVectorStrategy

db = ElasticsearchStore.from_documents(
    docs,
    embeddings,
    es_url="http://localhost:9200",
    index_name="test",
    strategy=DenseVectorStrategy(),
)

docs = db.similarity_search(
    query="What did the president say about Ketanji Brown Jackson?", k=10
)
```

#### 示例：密集向量和关键词搜索的混合检索

此示例将展示如何配置 ElasticsearchStore 以执行混合检索，结合使用近似语义搜索和基于关键词的搜索。

我们使用 RRF 来平衡来自不同检索方法的两个分数。

要启用混合检索，我们需要在 `DenseVectorStrategy` 构造函数中设置 `hybrid=True`。

```python
db = ElasticsearchStore.from_documents(
    docs,
    embeddings,
    es_url="http://localhost:9200",
    index_name="test",
    strategy=DenseVectorStrategy(hybrid=True),
)
```

当启用混合模式时，执行的查询将是近似语义搜索和基于关键词的搜索的组合。

它将使用 rrf（Reciprocal Rank Fusion）来平衡来自不同检索方法的两个分数。

**注意**：RRF 需要 Elasticsearch 8.9.0 或更高版本。

```python
{
    "retriever": {
        "rrf": {
            "retrievers": [
                {
                    "standard": {
                        "query": {
                            "bool": {
                                "filter": [],
                                "must": [{"match": {"text": {"query": "foo"}}}],
                            }
                        },
                    },
                },
                {
                    "knn": {
                        "field": "vector",
                        "filter": [],
                        "k": 1,
                        "num_candidates": 50,
                        "query_vector": [1.0, ..., 0.0],
                    },
                },
            ]
        }
    }
}
```

#### 示例：使用 Elasticsearch 中的嵌入模型进行密集向量搜索

此示例将展示如何配置 `ElasticsearchStore` 以使用部署在 Elasticsearch 中的嵌入模型进行密集向量检索。

要使用此功能，请在 `DenseVectorStrategy` 构造函数中通过 `query_model_id` 参数指定 model_id。

**注意**：这要求模型已部署并在 Elasticsearch ML 节点中运行。有关如何使用 `eland` 部署模型的示例，请参阅[笔记本示例](https://github.com/elastic/elasticsearch-labs/blob/main/notebooks/integrations/hugging-face/loading-model-from-hugging-face.ipynb)。

```python
DENSE_SELF_DEPLOYED_INDEX_NAME = "test-dense-self-deployed"

# 注意：这里没有指定嵌入函数
# 相反，我们将使用部署在 Elasticsearch 中的嵌入模型
db = ElasticsearchStore(
    es_cloud_id="<your cloud id>",
    es_user="elastic",
    es_password="<your password>",
    index_name=DENSE_SELF_DEPLOYED_INDEX_NAME,
    query_field="text_field",
    vector_query_field="vector_query_field.predicted_value",
    strategy=DenseVectorStrategy(model_id="sentence-transformers__all-minilm-l6-v2"),
)

# 设置一个 Ingest Pipeline 来执行文本字段的嵌入
db.client.ingest.put_pipeline(
    id="test_pipeline",
    processors=[
        {
            "inference": {
                "model_id": "sentence-transformers__all-minilm-l6-v2",
                "field_map": {"query_field": "text_field"},
                "target_field": "vector_query_field",
            }
        }
    ],
)

# 使用 pipeline 创建一个新索引，
# 不依赖 langchain 创建索引
db.client.indices.create(
    index=DENSE_SELF_DEPLOYED_INDEX_NAME,
    mappings={
        "properties": {
            "text_field": {"type": "text"},
            "vector_query_field": {
                "properties": {
                    "predicted_value": {
                        "type": "dense_vector",
                        "dims": 384,
                        "index": True,
                        "similarity": "l2_norm",
                    }
                }
            },
        }
    },
    settings={"index": {"default_pipeline": "test_pipeline"}},
)

db.from_texts(
    ["hello world"],
    es_cloud_id="<cloud id>",
    es_user="elastic",
    es_password="<cloud password>",
    index_name=DENSE_SELF_DEPLOYED_INDEX_NAME,
    query_field="text_field",
    vector_query_field="vector_query_field.predicted_value",
    strategy=DenseVectorStrategy(model_id="sentence-transformers__all-minilm-l6-v2"),
)

# 执行搜索
db.similarity_search("hello world", k=10)
```

### SparseVectorStrategy (ELSER)

此策略使用 Elasticsearch 的稀疏向量检索来获取前 k 个结果。目前我们仅支持我们自己的 "ELSER" 嵌入模型。

**注意**：这要求 ELSER 模型已部署并在 Elasticsearch ml 节点中运行。

要使用此策略，请在 `ElasticsearchStore` 构造函数中指定 `SparseVectorStrategy`（在 0.2.0 版本之前称为 `SparseVectorRetrievalStrategy`）。你需要提供一个模型 ID。

```python
from langchain_elasticsearch import SparseVectorStrategy

# 注意，此示例没有嵌入函数。这是因为我们在 Elasticsearch 内部在索引时和查询时推断标记。
# 这要求 ELSER 模型已加载并在 Elasticsearch 中运行。
db = ElasticsearchStore.from_documents(
    docs,
    es_cloud_id="<cloud id>",
    es_user="elastic",
    es_password="<cloud password>",
    index_name="test-elser",
    strategy=SparseVectorStrategy(model_id=".elser_model_2"),
)

db.client.indices.refresh(index="test-elser")

results = db.similarity_search(
    "What did the president say about Ketanji Brown Jackson", k=4
)
print(results[0])
```

### DenseVectorScriptScoreStrategy

此策略使用 Elasticsearch 的脚本评分查询来执行精确向量检索（也称为暴力检索）以获取前 k 个结果。（此策略在 0.2.0 版本之前称为 `ExactRetrievalStrategy`。）

要使用此策略，请在 `ElasticsearchStore` 构造函数中指定 `DenseVectorScriptScoreStrategy`。

```python
from langchain_elasticsearch import
