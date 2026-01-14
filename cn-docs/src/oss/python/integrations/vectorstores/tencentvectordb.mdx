---
title: 腾讯云向量数据库
---
>[腾讯云向量数据库](https://cloud.tencent.com/document/product/1709) 是一款全托管、自研企业级分布式数据库服务，专用于存储、检索和分析多维向量数据。该数据库支持多种索引类型和相似度计算方法。单个索引可支持高达十亿级的向量规模，并能支持百万级 QPS 和毫秒级查询延迟。腾讯云向量数据库不仅能为大模型提供外部知识库以提高大模型回答的准确性，还可广泛应用于推荐系统、NLP 服务、计算机视觉、智能客服等 AI 领域。

本笔记本展示了如何使用与腾讯向量数据库相关的功能。

要运行此示例，您需要拥有一个[数据库实例](https://cloud.tencent.com/document/product/1709/95101)。

## 基本用法

```python
!pip3 install tcvectordb langchain-community
```

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings.fake import FakeEmbeddings
from langchain_community.vectorstores import TencentVectorDB
from langchain_community.vectorstores.tencentvectordb import ConnectionParams
from langchain_text_splitters import CharacterTextSplitter
```

加载文档并将其分割成块。

```python
loader = TextLoader("../../how_to/state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)
```

我们支持两种方式来嵌入文档：

- 使用任何与 LangChain Embeddings 兼容的嵌入模型。
- 指定腾讯向量数据库的嵌入模型名称，可选值包括：
  - `bge-base-zh`，维度：768
  - `m3e-base`，维度：768
  - `text2vec-large-chinese`，维度：1024
  - `e5-large-v2`，维度：1024
  - `multilingual-e5-base`，维度：768

以下代码展示了两种嵌入文档的方式，您可以通过注释掉其中一种来选择另一种：

```python
## 您可以使用 LangChain 的 Embeddings 模型，例如 OpenAIEmbeddings：

# from langchain_community.embeddings.openai import OpenAIEmbeddings
#
# embeddings = OpenAIEmbeddings()
# t_vdb_embedding = None

## 或者您可以使用腾讯的嵌入模型，例如 `bge-base-zh`：

t_vdb_embedding = "bge-base-zh"  # bge-base-zh 是默认模型
embeddings = None
```

现在我们可以创建一个 TencentVectorDB 实例，您必须至少提供 `embeddings` 或 `t_vdb_embedding` 参数中的一个。如果两者都提供，将使用 `embeddings` 参数：

```python
conn_params = ConnectionParams(
    url="http://10.0.X.X",
    key="eC4bLRy2va******************************",
    username="root",
    timeout=20,
)

vector_db = TencentVectorDB.from_documents(
    docs, embeddings, connection_params=conn_params, t_vdb_embedding=t_vdb_embedding
)
```

```python
query = "What did the president say about Ketanji Brown Jackson"
docs = vector_db.similarity_search(query)
docs[0].page_content
```

```text
'Tonight. I call on the Senate to: Pass the Freedom to Vote Act. Pass the John Lewis Voting Rights Act. And while you’re at it, pass the Disclose Act so Americans can know who is funding our elections. \n\nTonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service. \n\nOne of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court. \n\nAnd I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.'
```

```python
vector_db = TencentVectorDB(embeddings, conn_params)

vector_db.add_texts(["Ankush went to Princeton"])
query = "Where did Ankush go to college?"
docs = vector_db.max_marginal_relevance_search(query)
docs[0].page_content
```

```text
'Ankush went to Princeton'
```

## 元数据与过滤

腾讯向量数据库支持元数据和[过滤](https://cloud.tencent.com/document/product/1709/95099#c6f6d3a3-02c5-4891-b0a1-30fe4daf18d8)。您可以为文档添加元数据，并根据元数据过滤搜索结果。

现在我们将创建一个带有元数据的新 TencentVectorDB 集合，并演示如何根据元数据过滤搜索结果：

```python
from langchain_community.vectorstores.tencentvectordb import (
    META_FIELD_TYPE_STRING,
    META_FIELD_TYPE_UINT64,
    ConnectionParams,
    MetaField,
    TencentVectorDB,
)
from langchain_core.documents import Document

meta_fields = [
    MetaField(name="year", data_type=META_FIELD_TYPE_UINT64, index=True),
    MetaField(name="rating", data_type=META_FIELD_TYPE_STRING, index=False),
    MetaField(name="genre", data_type=META_FIELD_TYPE_STRING, index=True),
    MetaField(name="director", data_type=META_FIELD_TYPE_STRING, index=True),
]

docs = [
    Document(
        page_content="The Shawshank Redemption is a 1994 American drama film written and directed by Frank Darabont.",
        metadata={
            "year": 1994,
            "rating": "9.3",
            "genre": "drama",
            "director": "Frank Darabont",
        },
    ),
    Document(
        page_content="The Godfather is a 1972 American crime film directed by Francis Ford Coppola.",
        metadata={
            "year": 1972,
            "rating": "9.2",
            "genre": "crime",
            "director": "Francis Ford Coppola",
        },
    ),
    Document(
        page_content="The Dark Knight is a 2008 superhero film directed by Christopher Nolan.",
        metadata={
            "year": 2008,
            "rating": "9.0",
            "genre": "superhero",
            "director": "Christopher Nolan",
        },
    ),
    Document(
        page_content="Inception is a 2010 science fiction action film written and directed by Christopher Nolan.",
        metadata={
            "year": 2010,
            "rating": "8.8",
            "genre": "science fiction",
            "director": "Christopher Nolan",
        },
    ),
]

vector_db = TencentVectorDB.from_documents(
    docs,
    None,
    connection_params=ConnectionParams(
        url="http://10.0.X.X",
        key="eC4bLRy2va******************************",
        username="root",
        timeout=20,
    ),
    collection_name="movies",
    meta_fields=meta_fields,
)

query = "film about dream by Christopher Nolan"

# 您可以使用 tencentvectordb 的过滤语法，通过 `expr` 参数：
result = vector_db.similarity_search(query, expr='director="Christopher Nolan"')

# 或者，您可以使用 langchain 的过滤语法，通过 `filter` 参数：
# result = vector_db.similarity_search(query, filter='eq("director", "Christopher Nolan")')

result
```

```python
[Document(page_content='The Dark Knight is a 2008 superhero film directed by Christopher Nolan.', metadata={'year': 2008, 'rating': '9.0', 'genre': 'superhero', 'director': 'Christopher Nolan'}),
 Document(page_content='The Dark Knight is a 2008 superhero film directed by Christopher Nolan.', metadata={'year': 2008, 'rating': '9.0', 'genre': 'superhero', 'director': 'Christopher Nolan'}),
 Document(page_content='The Dark Knight is a 2008 superhero film directed by Christopher Nolan.', metadata={'year': 2008, 'rating': '9.0', 'genre': 'superhero', 'director': 'Christopher Nolan'}),
 Document(page_content='Inception is a 2010 science fiction action film written and directed by Christopher Nolan.', metadata={'year': 2010, 'rating': '8.8', 'genre': 'science fiction', 'director': 'Christopher Nolan'})]
```
