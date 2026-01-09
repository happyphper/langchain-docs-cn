---
title: Viking DB
---
>[火山引擎向量数据库（VikingDB）](https://www.volcengine.com/docs/6459/1163946) 是一个用于存储、索引和管理由深度神经网络及其他机器学习（ML）模型生成的海量嵌入向量的数据库。

本笔记本展示了如何使用与 VikingDB 向量数据库相关的功能。

你需要通过 `pip install -qU langchain-community` 安装 `langchain-community` 来使用此集成。

要运行此示例，你需要有一个[正在运行的 VikingDB 实例](https://www.volcengine.com/docs/6459/1165058)。

```python
!pip install -U volcengine
```

我们希望使用 `VikingDBEmbeddings`，因此需要获取 VikingDB API 密钥。

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores.vikingdb import VikingDB, VikingDBConfig
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
```

```python
loader = TextLoader("./test.txt")
documents = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=10, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()
```

```python
db = VikingDB.from_documents(
    docs,
    embeddings,
    connection_args=VikingDBConfig(
        host="host", region="region", ak="ak", sk="sk", scheme="http"
    ),
    drop_old=True,
)
```

```python
query = "What did the president say about Ketanji Brown Jackson"
docs = db.similarity_search(query)
```

```python
docs[0].page_content
```

### 使用 VikingDB 集合（Collections）分隔数据

你可以在同一个 VikingDB 实例中，将不同且不相关的文档存储在不同的集合中，以保持上下文。

以下是如何创建一个新集合：

```python
db = VikingDB.from_documents(
    docs,
    embeddings,
    connection_args=VikingDBConfig(
        host="host", region="region", ak="ak", sk="sk", scheme="http"
    ),
    collection_name="collection_1",
    drop_old=True,
)
```

以下是如何检索已存储的集合：

```python
db = VikingDB.from_documents(
    embeddings,
    connection_args=VikingDBConfig(
        host="host", region="region", ak="ak", sk="sk", scheme="http"
    ),
    collection_name="collection_1",
)
```

检索之后，你可以像往常一样继续查询它。
