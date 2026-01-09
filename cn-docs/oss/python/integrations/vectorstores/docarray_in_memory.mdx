---
title: DocArray 内存搜索
---
>[DocArrayInMemorySearch](https://docs.docarray.org/user_guide/storing/index_in_memory/) 是由 [Docarray](https://github.com/docarray/docarray) 提供的一个文档索引，它将文档存储在内存中。对于小型数据集来说，这是一个很好的起点，因为你可能不希望启动一个数据库服务器。

本笔记本展示了如何使用与 `DocArrayInMemorySearch` 相关的功能。

## 设置

如果你还没有安装 docarray 以及获取/设置你的 OpenAI API 密钥，请取消注释下面的单元格。

```python
pip install -qU  langchain-community "docarray"
```

```python
# 获取 OpenAI token: https://platform.openai.com/account/api-keys

# import os
# from getpass import getpass

# OPENAI_API_KEY = getpass()

# os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
```

## 使用 DocArrayInMemorySearch

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
```

```python
documents = TextLoader("../../how_to/state_of_the_union.txt").load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()

db = DocArrayInMemorySearch.from_documents(docs, embeddings)
```

### 相似性搜索

```python
query = "What did the president say about Ketanji Brown Jackson"
docs = db.similarity_search(query)
```

```python
print(docs[0].page_content)
```

```text
Tonight. I call on the Senate to: Pass the Freedom to Vote Act. Pass the John Lewis Voting Rights Act. And while you’re at it, pass the Disclose Act so Americans can know who is funding our elections.

Tonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service.

One of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.

And I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.
```

### 带分数的相似性搜索

返回的距离分数是余弦距离。因此，分数越低越好。

```python
docs = db.similarity_search_with_score(query)
```

```python
docs[0]
```

```text
(Document(page_content='Tonight. I call on the Senate to: Pass the Freedom to Vote Act. Pass the John Lewis Voting Rights Act. And while you’re at it, pass the Disclose Act so Americans can know who is funding our elections. \n\nTonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service. \n\nOne of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court. \n\nAnd I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.', metadata={}),
 0.8154190158347903)
```

```python

```
