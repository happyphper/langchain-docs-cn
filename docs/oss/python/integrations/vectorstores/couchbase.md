---
title: Couchbase
---
[Couchbase](http://couchbase.com/) 是一款屡获殊荣的分布式 NoSQL 云数据库，为您的所有云、移动、AI 和边缘计算应用提供无与伦比的多功能性、性能、可扩展性和财务价值。Couchbase 拥抱 AI，为开发者提供编码辅助，并为他们的应用提供向量搜索功能。

向量搜索是 Couchbase 中[全文搜索服务](https://docs.couchbase.com/server/current/learn/services-and-indexes/services/search-service.html)（Search Service）的一部分。

本教程解释了如何在 Couchbase 中使用向量搜索。您可以使用 [Couchbase Capella](https://www.couchbase.com/products/capella/) 或您自管理的 Couchbase Server。

## 设置

要访问 `CouchbaseSearchVectorStore`，首先需要安装 `langchain-couchbase` 合作伙伴包：

```python
pip install -qU langchain-couchbase
```

### 凭证

前往 Couchbase [网站](https://cloud.couchbase.com) 并创建一个新连接，确保保存好您的数据库用户名和密码：

```python
import getpass

COUCHBASE_CONNECTION_STRING = getpass.getpass(
    "Enter the connection string for the Couchbase cluster: "
)
DB_USERNAME = getpass.getpass("Enter the username for the Couchbase cluster: ")
DB_PASSWORD = getpass.getpass("Enter the password for the Couchbase cluster: ")
```

```text
Enter the connection string for the Couchbase cluster:  ········
Enter the username for the Couchbase cluster:  ········
Enter the password for the Couchbase cluster:  ········
```

如果您希望获得业界最佳的模型调用自动追踪，您也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()
```

## 初始化

在实例化之前，我们需要创建一个连接。

### 创建 Couchbase 连接对象

我们首先创建到 Couchbase 集群的连接，然后将集群对象传递给向量存储。

这里，我们使用上面获取的用户名和密码进行连接。您也可以使用任何其他支持的方式连接到您的集群。

有关连接到 Couchbase 集群的更多信息，请查阅 [文档](https://docs.couchbase.com/python-sdk/current/hello-world/start-using-sdk.html#connect)。

```python
from datetime import timedelta

from couchbase.auth import PasswordAuthenticator
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions

auth = PasswordAuthenticator(DB_USERNAME, DB_PASSWORD)
options = ClusterOptions(auth)
cluster = Cluster(COUCHBASE_CONNECTION_STRING, options)

# Wait until the cluster is ready for use.
cluster.wait_until_ready(timedelta(seconds=5))
```

现在，我们将在 Couchbase 集群中设置要用于向量搜索的桶（bucket）、作用域（scope）和集合（collection）名称。

对于此示例，我们使用默认的作用域和集合。

```python
BUCKET_NAME = "langchain_bucket"
SCOPE_NAME = "_default"
COLLECTION_NAME = "_default"
SEARCH_INDEX_NAME = "langchain-test-index"
```

有关如何创建支持向量字段的搜索索引的详细信息，请参阅文档。

- [Couchbase Capella](https://docs.couchbase.com/cloud/vector-search/create-vector-search-index-ui.html)

- [Couchbase Server](https://docs.couchbase.com/server/current/vector-search/create-vector-search-index-ui.html)

### 简单实例化

下面，我们使用集群信息和搜索索引名称创建向量存储对象。

<EmbeddingTabs/>

```python
# | output: false
# | echo: false
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
```

```python
from langchain_couchbase.vectorstores import CouchbaseSearchVectorStore

vector_store = CouchbaseSearchVectorStore(
    cluster=cluster,
    bucket_name=BUCKET_NAME,
    scope_name=SCOPE_NAME,
    collection_name=COLLECTION_NAME,
    embedding=embeddings,
    index_name=SEARCH_INDEX_NAME,
)
```

### 指定文本和嵌入字段

您可以选择性地使用 `text_key` 和 `embedding_key` 字段来指定文档的文本和嵌入字段。

```python
vector_store_specific = CouchbaseSearchVectorStore(
    cluster=cluster,
    bucket_name=BUCKET_NAME,
    scope_name=SCOPE_NAME,
    collection_name=COLLECTION_NAME,
    embedding=embeddings,
    index_name=SEARCH_INDEX_NAME,
    text_key="text",
    embedding_key="embedding",
)
```

## 管理向量存储

创建向量存储后，我们可以通过添加和删除不同的项目来与之交互。

### 向向量存储添加项目

我们可以使用 `add_documents` 函数向向量存储添加项目。

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
['f125b836-f555-4449-98dc-cbda4e77ae3f',
 'a28fccde-fd32-4775-9ca8-6cdb22ca7031',
 'b1037c4b-947f-497f-84db-63a4def5080b',
 'c7082b74-b385-4c4b-bbe5-0740909c01db',
 'a7e31f62-13a5-4109-b881-8631aff7d46c',
 '9fcc2894-fdb1-41bd-9a93-8547747650f4',
 'a5b0632d-abaf-4802-99b3-df6b6c99be29',
 '0475592e-4b7f-425d-91fd-ac2459d48a36',
 '94c6db4e-ba07-43ff-aa96-3a5d577db43a',
 'd21c7feb-ad47-4e7d-84c5-785afb189160']
```

### 从向量存储删除项目

```python
vector_store.delete(ids=[uuids[-1]])
```

```text
True
```

## 查询向量存储

创建向量存储并添加相关文档后，您很可能希望在运行链或代理时查询它。

### 直接查询

#### 相似性搜索

执行简单的相似性搜索可以按如下方式进行：

```python
results = vector_store.similarity_search(
    "LangChain provides abstractions to make working with LLMs easy",
    k=2,
)
for res in results:
    print(f"* {res.page_content} [{res.metadata}]")
```

```text
* Building an exciting new project with LangChain - come check it out! [{'source': 'tweet'}]
* LangGraph is the best framework for building stateful, agentic applications! [{'source': 'tweet'}]
```

#### 带分数的相似性搜索

您也可以通过调用 `similarity_search_with_score` 方法来获取结果的分数。

```python
results = vector_store.similarity_search_with_score("Will it be hot tomorrow?", k=1)
for res, score in results:
    print(f"* [SIM={score:3f}] {res.page_content} [{res.metadata}]")
```

```text
* [SIM=0.553112] The weather forecast for tomorrow is cloudy and overcast, with a high of 62 degrees. [{'source': 'news'}]
```

### 过滤结果

您可以通过指定文档文本或元数据上任何受 Couchbase 搜索服务支持的过滤器来过滤搜索结果。

`filter` 可以是 Couchbase Python SDK 支持的任何有效 [SearchQuery](https://docs.couchbase.com/python-sdk/current/howtos/full-text-searching-with-sdk.html#search-queries)。这些过滤器在向量搜索执行之前应用。

如果要对元数据中的某个字段进行过滤，需要使用 `.` 来指定。

例如，要获取元数据中的 `source` 字段，需要指定 `metadata.source`。

请注意，过滤器需要得到搜索索引的支持。

```python
from couchbase import search

query = "Are there any concerning financial news?"
filter_on_source = search.MatchQuery("news", field="metadata.source")
results = vector_store.similarity_search_with_score(
    query, fields=["metadata.source"], filter=filter_on_source, k=5
)
for res, score in results:
    print(f"* {res.page_content} [{res.metadata}] {score}")
```

```text
* The stock market is down 500 points today due to fears of a recession. [{'source': 'news'}] 0.3873019218444824
* Robbers broke into the city bank and stole $1 million in cash. [{'source': 'news'}] 0.20637212693691254
* The weather forecast for tomorrow is cloudy and overcast, with a high of 62 degrees. [{'source': 'news'}] 0.10404900461435318
```

### 指定返回字段

您可以使用搜索中的 `fields` 参数来指定要从文档返回的字段。这些字段作为返回的 Document 中 `metadata` 对象的一部分返回。您可以获取存储在搜索索引中的任何字段。文档的 `text_key` 作为文档 `page_content` 的一部分返回。

如果您未指定要获取的任何字段，则返回索引中存储的所有字段。

如果要获取元数据中的某个字段，需要使用 `.` 来指定。

例如，要获取元数据中的 `source` 字段，需要指定 `metadata.source`。

```python
query = "What did I eat for breakfast today?"
results = vector_store.similarity_search(query, fields=["metadata.source"])
print(results[0])
```

```python
page_content='I had chocolate chip pancakes and scrambled eggs for breakfast this morning.' metadata={'source': 'tweet'}
```

### 通过转换为检索器进行查询

您也可以将向量存储转换为检索器，以便在链中更轻松地使用。

以下是如何将向量存储转换为检索器，然后使用简单查询和过滤器调用该检索器。

```python
retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 1, "score_threshold": 0.5},
)
filter_on_source = search.MatchQuery("news", field="metadata.source")
retriever.invoke("Stealing from the bank is a crime", filter=filter_on_source)
```

```text
[Document(id='c7082b74-b385-4c4b-bbe5-0740909c01db', metadata={'source': 'news'}, page_content='Robbers broke into the city bank and stole $1 million in cash.')]
```

### 混合查询

Couchbase 允许您通过将向量搜索结果与对文档非向量字段（如 `metadata` 对象）的搜索相结合来进行混合搜索。

结果将基于向量搜索和搜索服务支持的搜索结果的组合。每个组件搜索的分数相加得到结果的总分。

要执行混合搜索，可以向所有相似性搜索传递一个可选参数 `search_options`。
`search_options` 的不同搜索/查询可能性可以在 [这里](https://docs.couchbase.com/server/current/search/search-request-params.html#query-object) 找到。

#### 为混合搜索创建多样化的元数据

为了模拟混合搜索，让我们从现有文档中创建一些随机元数据。
我们统一向元数据添加三个字段：`date` 在 2010 到 2020 之间，`rating` 在 1 到 5 之间，`author` 设置为 John Doe 或 Jane Doe。

```python
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter

loader = TextLoader("../../how_to/state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

# Adding metadata to documents
for i, doc in enumerate(docs):
    doc.metadata["date"] = f"{range(2010, 2020)[i % 10]}-01-01"
    doc.metadata["rating"] = range(1, 6)[i % 5]
    doc.metadata["author"] = ["John Doe", "Jane Doe"][i % 2]

vector_store.add_documents(docs)

query = "What did the president say about Ketanji Brown Jackson"
results = vector_store.similarity_search(query)
print(results[0].metadata)
```

```python
{'author': 'John Doe', 'date': '2016-01-01', 'rating': 2, 'source': '../../how_to/state_of_the_union.txt'}
```

### 按精确值查询

我们可以搜索文本字段（如 `metadata` 对象中的作者）的精确匹配。

```python
query = "What did the president say about Ketanji Brown Jackson"
results = vector_store.similarity_search(
    query,
    search_options={"query": {"field": "metadata.author", "match": "John Doe"}},
    fields=["metadata.author"],
)
print(results[0])
```

```python
page_content='One of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.

And I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.' metadata={'author': 'John Doe'}
```

### 按部分匹配查询

我们可以通过为搜索指定模糊度来搜索部分匹配。当您想搜索搜索查询的轻微变体或拼写错误时，这很有用。

这里，"Jae" 与 "Jane" 很接近（模糊度为 1）。

```python
query = "What did the president say about Ketanji Brown Jackson"
results = vector_store.similarity_search(
    query,
    search_options={
        "query": {"field": "metadata.author", "match": "Jae", "fuzziness": 1}
    },
    fields=["metadata.author"],
)
print(results[0])
```

```python
page_content='A former top litigator in private practice. A former federal public defender. And from a family of public school educators and police officers. A consensus builder. Since she’s been nominated, she’s received a broad range of support—from the Fraternal Order of Police to former judges appointed by Democrats and Republicans.

And if we are to advance liberty and justice, we need to secure the Border and fix the immigration system.' metadata={'author': 'Jane Doe'}
```

### 按日期范围查询

我们可以搜索日期字段（如 `metadata.date`）在某个日期范围内的文档。

```python
query = "Any mention about independence?"
results = vector_store.similarity_search(
    query,
    search_options={
        "query": {
            "start": "2016-12-31",
            "end": "2017-01-02",
            "inclusive_start": True,
            "inclusive_end": False,
            "field": "metadata.date",
        }
    },
)
print(results[0])
```

```python
page_content='And with 75% of adult Americans fully vaccinated and hospitalizations down by 77%, most Americans can remove their masks, return to work, stay in the classroom, and move forward safely.

We achieved this because we provided free vaccines, treatments, tests, and masks.

Of course, continuing this costs money.

I will soon send Congress a request.

The vast majority of Americans have used these tools and may want to again, so I expect Congress to pass it quickly.' metadata={'author': 'Jane Doe', 'date': '2017-01-01', 'rating': 3, 'source': '../../how_to/state_of_the_union.txt'}
```

### 按数值范围查询

我们可以搜索数值字段（如 `metadata.rating`）在某个范围内的文档。

```python
query = "Any mention about independence?"
results = vector_store.similarity_search_with_score(
    query,
    search_options={
        "query": {
            "min": 3,
            "max": 5,
            "inclusive_min": True,
            "inclusive_max": True,
            "field": "metadata.rating",
        }
    },
)
print(results[0])
```

```text
(Document(id='3a90405c0f5b4c09a6646259678f1f61', metadata={'author': 'John Doe', 'date': '2014-01-01', 'rating': 5, 'source': '../../how_to/state_of_the_union.txt'},
