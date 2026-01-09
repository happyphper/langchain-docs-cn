---
title: AimlapiEmbeddings
---
本指南将帮助您开始使用 LangChain 的 AI/ML API 嵌入模型。有关 `AimlapiEmbeddings` 功能和配置选项的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/aimlapi/embeddings/langchain_aimlapi.embeddings.AimlapiEmbeddings.html)。

## 概述

### 集成详情

| 类 | 包 | 本地 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| [AimlapiEmbeddings](https://python.langchain.com/api_reference/aimlapi/embeddings/langchain_aimlapi.embeddings.AimlapiEmbeddings.html) | [langchain-aimlapi](https://python.langchain.com/api_reference/aimlapi/index.html) | ❌ | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-aimlapi?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-aimlapi?style=flat-square&label=%20) |

## 设置

要访问 AI/ML API 嵌入模型，您需要创建一个账户，获取一个 API 密钥，并安装 `langchain-aimlapi` 集成包。

### 凭证

前往 [aimlapi.com](https://aimlapi.com/app/?utm_source=langchain&utm_medium=github&utm_campaign=integration) 注册并生成一个 API 密钥。完成后，请设置 `AIMLAPI_API_KEY` 环境变量：

```python
import getpass
import os

if not os.getenv("AIMLAPI_API_KEY"):
    os.environ["AIMLAPI_API_KEY"] = getpass.getpass("Enter your AI/ML API key: ")
```

要启用模型调用的自动化追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

LangChain AI/ML API 集成位于 `langchain-aimlapi` 包中：

```python
pip install -qU langchain-aimlapi
```

## 实例化

现在我们可以实例化我们的嵌入模型并执行嵌入操作：

```python
from langchain_aimlapi import AimlapiEmbeddings

embeddings = AimlapiEmbeddings(
    model="text-embedding-ada-002",
)
```

## 索引与检索

嵌入模型通常用于检索增强生成 (RAG) 流程。以下是如何使用上面初始化的 `embeddings` 对象和 `InMemoryVectorStore` 来索引和检索数据。

```python
from langchain_core.vectorstores import InMemoryVectorStore

text = "LangChain is the framework for building context-aware reasoning applications"

vectorstore = InMemoryVectorStore.from_texts(
    [text],
    embedding=embeddings,
)

retriever = vectorstore.as_retriever()

retrieved_documents = retriever.invoke("What is LangChain?")
retrieved_documents[0].page_content
```

```text
'LangChain is the framework for building context-aware reasoning applications'
```

## 直接使用

您可以直接调用 `embed_query` 和 `embed_documents` 以用于自定义嵌入场景。

### 嵌入单个文本

```python
single_vector = embeddings.embed_query(text)
print(str(single_vector)[:100])
```

### 嵌入多个文本

```python
text2 = "LangGraph is a library for building stateful, multi-actor applications with LLMs"

vectors = embeddings.embed_documents([text, text2])
for vector in vectors:
    print(str(vector)[:100])
```

---

## API 参考

有关 `AimlapiEmbeddings` 功能和配置选项的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/aimlapi/embeddings/langchain_aimlapi.embeddings.AimlapiEmbeddings.html)。
