---
title: Tigris
---
> [Tigris](https://tigrisdata.com) 是一个开源的 Serverless NoSQL 数据库和搜索平台，旨在简化构建高性能向量搜索应用。
> `Tigris` 消除了管理、操作和同步多个工具的基础设施复杂性，让您可以专注于构建出色的应用，而非处理底层架构。

本指南将介绍如何使用 Tigris 作为您的向量存储（VectorStore）。

**前提条件**

1.  一个 OpenAI 账户。您可以在此[注册](https://platform.openai.com/)。
2.  [注册一个免费的 Tigris 账户](https://console.preview.tigrisdata.cloud)。注册成功后，创建一个名为 `vectordemo` 的新项目。接着，请记下您创建项目所在区域的 *Uri*、**clientId** 和 **clientSecret**。您可以在项目的 **Application Keys** 部分找到所有这些信息。

首先，让我们安装所需的依赖项：

```python
pip install -qU  tigrisdb openapi-schema-pydantic langchain-openai langchain-community tiktoken
```

我们将把 OpenAI API 密钥和 Tigris 凭证加载到环境变量中：

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
if "TIGRIS_PROJECT" not in os.environ:
    os.environ["TIGRIS_PROJECT"] = getpass.getpass("Tigris Project Name:")
if "TIGRIS_CLIENT_ID" not in os.environ:
    os.environ["TIGRIS_CLIENT_ID"] = getpass.getpass("Tigris Client Id:")
if "TIGRIS_CLIENT_SECRET" not in os.environ:
    os.environ["TIGRIS_CLIENT_SECRET"] = getpass.getpass("Tigris Client Secret:")
```

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Tigris
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
```

### 初始化 Tigris 向量存储

让我们导入测试数据集：

```python
loader = TextLoader("../../../state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()
```

```python
vector_store = Tigris.from_documents(docs, embeddings, index_name="my_embeddings")
```

### 相似性搜索

```python
query = "What did the president say about Ketanji Brown Jackson"
found_docs = vector_store.similarity_search(query)
print(found_docs)
```

### 带分数（向量距离）的相似性搜索

```python
query = "What did the president say about Ketanji Brown Jackson"
result = vector_store.similarity_search_with_score(query)
for doc, score in result:
    print(f"document={doc}, score={score}")
```
