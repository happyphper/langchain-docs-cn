---
title: 宙斯数据库
---
>[ZeusDB](https://www.zeusdb.com) 是一个基于 Rust 构建的高性能向量数据库，提供产品量化、持久化存储和企业级日志记录等高级功能。

本文档展示了如何使用 ZeusDB 为您的 LangChain 应用程序带来企业级向量搜索能力。

---

## 设置

从 PyPi 安装 ZeusDB LangChain 集成包：

```python
pip install -qU langchain-zeusdb
```

在 Jupyter Notebooks 中设置

```python
pip install -qU langchain-zeusdb
```

---

## 快速开始

此示例使用 OpenAIEmbeddings，它需要一个 OpenAI API 密钥：[在此获取您的 OpenAI API 密钥](https://platform.openai.com/api-keys)
如果您愿意，也可以将此包与任何其他嵌入提供程序（Hugging Face、Cohere、自定义函数等）一起使用。
从 PyPi 安装 LangChain OpenAI 集成包：

```python
pip install -qU langchain-openai

# 如果在 Jupyter Notebooks 内，请使用此命令
#pip install -qU langchain-openai
```

#### 请为您的 OpenAI 密钥集成选择以下选项之一

*选项 1: 🔑 每次输入您的 API 密钥*
在 Jupyter 中使用 getpass 为当前会话安全地输入您的密钥：

```python
import os
import getpass

os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

*选项 2: 🗂️ 使用 .env 文件*
将您的密钥保存在本地的 .env 文件中，并使用 python-dotenv 自动加载它

```python
from dotenv import load_dotenv

load_dotenv()  # 读取 .env 并设置 OPENAI_API_KEY
```

<Info>

🎉 干得漂亮！您可以开始了。

</Info>

---

## 初始化

```python
# 导入所需的包和类
from langchain_zeusdb import ZeusDBVectorStore
from langchain_openai import OpenAIEmbeddings
from zeusdb import VectorDatabase
```

```python
# 初始化嵌入模型
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# 创建 ZeusDB 索引
vdb = VectorDatabase()
index = vdb.create(index_type="hnsw", dim=1536, space="cosine")

# 创建向量存储
vector_store = ZeusDBVectorStore(zeusdb_index=index, embedding=embeddings)
```

---

## 管理向量存储

### 2.1 向向量存储添加项目

```python
from langchain_core.documents import Document

document_1 = Document(
    page_content="ZeusDB 是一个高性能向量数据库",
    metadata={"source": "https://docs.zeusdb.com"},
)

document_2 = Document(
    page_content="产品量化显著减少了内存使用",
    metadata={"source": "https://docs.zeusdb.com"},
)

document_3 = Document(
    page_content="ZeusDB 与 LangChain 无缝集成",
    metadata={"source": "https://docs.zeusdb.com"},
)

documents = [document_1, document_2, document_3]

vector_store.add_documents(documents=documents, ids=["1", "2", "3"])
```

### 2.2 更新向量存储中的项目

```python
updated_document = Document(
    page_content="ZeusDB 现在支持高级产品量化，具有 4x-256x 压缩比",
    metadata={"source": "https://docs.zeusdb.com", "updated": True},
)

vector_store.add_documents([updated_document], ids=["1"])
```

### 2.3 从向量存储中删除项目

```python
vector_store.delete(ids=["3"])
```

---

## 查询向量存储

### 3.1 直接查询

执行简单的相似性搜索：

```python
results = vector_store.similarity_search(query="high performance database", k=2)

for doc in results:
    print(f"* {doc.page_content} [{doc.metadata}]")
```

如果您想执行相似性搜索并获取相应的分数：

```python
results = vector_store.similarity_search_with_score(query="memory optimization", k=2)

for doc, score in results:
    print(f"* [SIM={score:.3f}] {doc.page_content} [{doc.metadata}]")
```

### 3.2 通过转换为检索器进行查询

您也可以将向量存储转换为检索器，以便在您的链中更轻松地使用：

```python
retriever = vector_store.as_retriever(search_type="mmr", search_kwargs={"k": 2})

retriever.invoke("vector database features")
```

---

## ZeusDB 特有功能

### 4.1 使用产品量化的内存高效设置

对于大型数据集，使用产品量化来减少内存使用：

```python
# 创建内存优化的向量存储
quantization_config = {"type": "pq", "subvectors": 8, "bits": 8, "training_size": 10000}

vdb_quantized = VectorDatabase()
quantized_index = vdb_quantized.create(
    index_type="hnsw", dim=1536, quantization_config=quantization_config
)

quantized_vector_store = ZeusDBVectorStore(
    zeusdb_index=quantized_index, embedding=embeddings
)

print(f"Created quantized store: {quantized_index.info()}")
```

### 4.2 持久化

将您的向量存储保存到磁盘并加载：
如何保存您的向量存储

```python
# 保存向量存储
vector_store.save_index("my_zeusdb_index.zdb")
```

如何加载您的向量存储

```python
# 加载向量存储
loaded_store = ZeusDBVectorStore.load_index(
    path="my_zeusdb_index.zdb", embedding=embeddings
)

print(f"Loaded store with {loaded_store.get_vector_count()} vectors")
```

---

## 用于检索增强生成 (RAG)

有关如何使用此向量存储进行检索增强生成 (RAG) 的指南，请参阅以下部分：

- [操作指南：使用 RAG 进行问答](https://python.langchain.com/docs/how_to/#qa-with-rag)
- [检索概念文档](https://python.langchain.com/docs/concepts/retrieval/)

---

## API 参考

有关 ZeusDBVectorStore 所有功能和配置的详细文档，请前往 [ZeusDB 文档](https://docs.zeusdb.com/en/latest/vector_database/integrations/langchain.html)。
