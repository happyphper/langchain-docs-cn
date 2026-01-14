---
title: TileDB
---
> [TileDB](https://github.com/TileDB-Inc/TileDB) 是一个用于索引和查询密集与稀疏多维数组的强大引擎。

> TileDB 通过 [TileDB-Vector-Search](https://github.com/TileDB-Inc/TileDB-Vector-Search) 模块提供近似最近邻（ANN）搜索功能。它支持在本地磁盘和云对象存储（例如 AWS S3）上以无服务器方式执行 ANN 查询并存储向量索引。

更多详情请参阅：

- [为何选择 TileDB 作为向量数据库](https://tiledb.com/blog/why-tiledb-as-a-vector-database)
- [TileDB 101：向量搜索](https://tiledb.com/blog/tiledb-101-vector-search)

本笔记本展示了如何使用 `TileDB` 向量数据库。

```python
pip install -qU  tiledb-vector-search langchain-community
```

## 基础示例

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import TileDB
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import CharacterTextSplitter

raw_documents = TextLoader("../../how_to/state_of_the_union.txt").load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
documents = text_splitter.split_documents(raw_documents)
model_name = "sentence-transformers/all-mpnet-base-v2"
embeddings = HuggingFaceEmbeddings(model_name=model_name)
db = TileDB.from_documents(
    documents, embeddings, index_uri="/tmp/tiledb_index", index_type="FLAT"
)
```

```python
query = "What did the president say about Ketanji Brown Jackson"
docs = db.similarity_search(query)
docs[0].page_content
```

### 通过向量进行相似性搜索

```python
embedding_vector = embeddings.embed_query(query)
docs = db.similarity_search_by_vector(embedding_vector)
docs[0].page_content
```

### 带分数的相似性搜索

```python
docs_and_scores = db.similarity_search_with_score(query)
docs_and_scores[0]
```

## 最大边际相关性搜索（MMR）

除了在检索器对象中使用相似性搜索外，你也可以使用 `mmr` 作为检索器。

```python
retriever = db.as_retriever(search_type="mmr")
retriever.invoke(query)
```

或者直接使用 `max_marginal_relevance_search`：

```python
db.max_marginal_relevance_search(query, k=2, fetch_k=10)
```
