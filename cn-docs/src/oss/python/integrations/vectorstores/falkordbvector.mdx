---
title: FalkorDBVectorStore
---
<a href="https://docs.falkordb.com/" target="_blank">FalkorDB</a> 是一个开源的图数据库，集成了向量相似性搜索功能。

它支持：

- 近似最近邻搜索
- 欧几里得相似度与余弦相似度
- 结合向量搜索和关键词搜索的混合搜索

本笔记本展示了如何使用 FalkorDB 向量索引 (`FalkorDB`)

请参阅 <a href="https://docs.falkordb.com/" target="_blank">安装说明</a>

## 设置

```python
# 使用 pip 安装必要的包
pip install -U  falkordb
pip install -U  tiktoken
pip install -U  langchain langchain_huggingface
```

### 凭证

我们想使用 `HuggingFace`，因此需要获取 HuggingFace API 密钥

```python
import getpass
import os

if "HUGGINGFACE_API_KEY" not in os.environ:
    os.environ["HUGGINGFACE_API_KEY"] = getpass.getpass("HuggingFace API Key:")
```

如果你想启用模型调用的自动追踪功能，也可以通过取消下面代码的注释来设置你的 LangSmith API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

## 初始化

```python
from langchain_community.vectorstores.falkordb_vector import FalkorDBVector
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
```

你可以使用 Docker 在本地运行 FalkorDBVector。请参阅 <a href="https://docs.falkordb.com/" target="_blank">安装说明</a>

```python
host = "localhost"
port = 6379
```

或者，你也可以使用 <a href="https://app.falkordb.cloud">FalkorDB Cloud</a> 来运行 FalkorDBVector

```python
# 例如
# host = "r-6jissuruar.instance-zwb082gpf.hc-v8noonp0c.europe-west1.gcp.f2e0a955bb84.cloud"
# port = 62471
# username = "falkordb" # 在 FALKORDB CLOUD 上设置
# password = "password" # 在 FALKORDB CLOUD 上设置
```

```python
vector_store = FalkorDBVector(host=host, port=port, embedding=HuggingFaceEmbeddings())
```

## 管理向量存储

### 向向量存储添加项目

```python
from langchain_core.documents import Document

document_1 = Document(page_content="foo", metadata={"source": "https://example.com"})

document_2 = Document(page_content="bar", metadata={"source": "https://example.com"})

document_3 = Document(page_content="baz", metadata={"source": "https://example.com"})

documents = [document_1, document_2, document_3]

vector_store.add_documents(documents=documents, ids=["1", "2", "3"])
```

```python
['1', '2', '3']
```

### 更新向量存储中的项目

```python
updated_document = Document(
    page_content="qux", metadata={"source": "https://another-example.com"}
)

vector_store.update_documents(document_id="1", document=updated_document)
```

### 从向量存储中删除项目

```python
vector_store.delete(ids=["3"])
```

## 查询向量存储

一旦你的向量存储被创建并且相关文档已添加，你很可能会在运行链或代理时查询它。

### 直接查询

执行简单的相似性搜索可以按如下方式进行：

```python
results = vector_store.similarity_search(
    query="thud", k=1, filter={"source": "https://another-example.com"}
)
for doc in results:
    print(f"* {doc.page_content} [{doc.metadata}]")
```

```text
* qux [{'text': 'qux', 'id': '1', 'source': 'https://another-example.com'}]
```

如果你想执行相似性搜索并获取相应的分数，可以运行：

```python
results = vector_store.similarity_search_with_score(query="bar")
for doc, score in results:
    print(f"* [SIM={score:3f}] {doc.page_content} [{doc.metadata}]")
```

```text
* [SIM=0.000001] bar [{'text': 'bar', 'id': '2', 'source': 'https://example.com'}]
```

### 转换为检索器进行查询

你也可以将向量存储转换为检索器，以便在你的链中更轻松地使用。

```python
retriever = vector_store.as_retriever(search_type="mmr", search_kwargs={"k": 1})
retriever.invoke("thud")
```

```text
[Document(metadata={'text': 'qux', 'id': '1', 'source': 'https://another-example.com'}, page_content='qux')]
```

---

## API 参考

有关 `FalkorDBVector` 所有功能和配置的详细文档，请访问 API 参考：[python.langchain.com/api_reference/community/vectorstores/langchain_community.vectorstores.falkordb_vector.FalkorDBVector.html](https://python.langchain.com/api_reference/community/vectorstores/langchain_community.vectorstores.falkordb_vector.FalkorDBVector.html)
