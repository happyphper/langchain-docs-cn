---
title: Xata
---
> [Xata](https://xata.io) 是一个基于 PostgreSQL 的无服务器数据平台。它提供了用于与数据库交互的 Python SDK 以及用于管理数据的 UI。
> Xata 具有原生的向量类型，可以添加到任何表中，并支持相似性搜索。LangChain 直接将向量插入到 Xata 中，并查询给定向量的最近邻，因此您可以将所有 LangChain 嵌入集成与 Xata 一起使用。

本指南将介绍如何使用 Xata 作为向量存储。

## 设置

### 创建用作向量存储的数据库

在 [Xata UI](https://app.xata.io) 中创建一个新数据库。您可以随意命名，在本指南中我们将使用 `langchain`。
创建一个表，同样可以任意命名，但我们将使用 `vectors`。通过 UI 添加以下列：

* `content`，类型为 "Text"。用于存储 `Document.pageContent` 值。
* `embedding`，类型为 "Vector"。使用您计划使用的模型的维度。在本指南中，我们使用 OpenAI 嵌入，其维度为 1536。
* `source`，类型为 "Text"。在本示例中用作元数据列。
* 任何其他您想用作元数据的列。它们将从 `Document.metadata` 对象中填充。例如，如果 `Document.metadata` 对象中有 `title` 属性，您可以在表中创建 `title` 列，它将被填充。

首先安装依赖项：

```python
pip install -qU  xata langchain-openai langchain-community tiktoken langchain
```

将 OpenAI 密钥加载到环境中。如果您没有密钥，可以创建一个 OpenAI 账户并在[此页面](https://platform.openai.com/account/api-keys)生成密钥。

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

同样，我们需要获取 Xata 的环境变量。您可以通过访问[账户设置](https://app.xata.io/settings)创建新的 API 密钥。要查找数据库 URL，请转到您创建的数据库的设置页面。数据库 URL 应类似于：`https://demo-uni3q8.eu-west-1.xata.sh/db/langchain`。

```python
api_key = getpass.getpass("Xata API key: ")
db_url = input("Xata database URL (copy it from your DB settings):")
```

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores.xata import XataVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
```

### 创建 Xata 向量存储

导入测试数据集：

```python
loader = TextLoader("../../how_to/state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()
```

现在创建实际的向量存储，由 Xata 表支持。

```python
vector_store = XataVectorStore.from_documents(
    docs, embeddings, api_key=api_key, db_url=db_url, table_name="vectors"
)
```

运行上述命令后，如果您转到 Xata UI，应该会看到文档及其嵌入已加载。
要使用已包含向量内容的现有 Xata 表，请初始化 XataVectorStore 构造函数：

```python
vector_store = XataVectorStore(
    api_key=api_key, db_url=db_url, embedding=embeddings, table_name="vectors"
)
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
