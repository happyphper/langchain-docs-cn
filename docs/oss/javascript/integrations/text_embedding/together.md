---
title: TogetherEmbeddings
---
本文将帮助您开始使用 LangChain 集成 Together 的嵌入模型。有关 `TogetherEmbeddings` 功能和配置选项的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/together/embeddings/langchain_together.embeddings.TogetherEmbeddings.html)。

## 概述

### 集成详情

<ItemTable category="text_embedding" item="Together" />

## 设置

要访问 Together 的嵌入模型，您需要创建一个 Together 账户、获取 API 密钥，并安装 `langchain-together` 集成包。

### 凭证

前往 [https://api.together.xyz/](https://api.together.xyz/) 注册 Together 并生成 API 密钥。完成后，请设置 `TOGETHER_API_KEY` 环境变量：

```python
import getpass
import os

if not os.getenv("TOGETHER_API_KEY"):
    os.environ["TOGETHER_API_KEY"] = getpass.getpass("Enter your Together API key: ")
```

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### 安装

LangChain 的 Together 集成位于 `langchain-together` 包中：

```python
pip install -qU langchain-together
```

## 实例化

现在我们可以实例化模型对象并生成嵌入向量：

```python
from langchain_together import TogetherEmbeddings

embeddings = TogetherEmbeddings(
    model="togethercomputer/m2-bert-80M-8k-retrieval",
)
```

## 索引与检索

嵌入模型常用于检索增强生成（RAG）流程中，既用于索引数据，也用于后续检索。更详细的说明，请参阅我们的 [RAG 教程](/oss/javascript/langchain/rag)。

下面展示了如何使用上面初始化的 `embeddings` 对象来索引和检索数据。在本示例中，我们将在 `InMemoryVectorStore` 中索引和检索一个示例文档。

```python
# 使用示例文本创建向量存储
from langchain_core.vectorstores import InMemoryVectorStore

text = "LangChain is the framework for building context-aware reasoning applications"

vectorstore = InMemoryVectorStore.from_texts(
    [text],
    embedding=embeddings,
)

# 将向量存储用作检索器
retriever = vectorstore.as_retriever()

# 检索最相似的文本
retrieved_documents = retriever.invoke("What is LangChain?")

# 显示检索到的文档内容
retrieved_documents[0].page_content
```

```text
'LangChain is the framework for building context-aware reasoning applications'
```

## 直接使用

在底层，向量存储和检索器的实现分别调用了 `embeddings.embed_documents(...)` 和 `embeddings.embed_query(...)` 来为 `from_texts` 中使用的文本和检索 `invoke` 操作创建嵌入向量。

您可以直接调用这些方法来获取嵌入向量，以满足您自己的用例。

### 嵌入单个文本

您可以使用 `embed_query` 嵌入单个文本或文档：

```python
single_vector = embeddings.embed_query(text)
print(str(single_vector)[:100])  # 显示向量的前100个字符
```

```text
[0.3812227, -0.052848946, -0.10564975, 0.03480297, 0.2878488, 0.0084609175, 0.11605915, 0.05303011,
```

### 嵌入多个文本

您可以使用 `embed_documents` 嵌入多个文本：

```python
text2 = (
    "LangGraph is a library for building stateful, multi-actor applications with LLMs"
)
two_vectors = embeddings.embed_documents([text, text2])
for vector in two_vectors:
    print(str(vector)[:100])  # 显示向量的前100个字符
```

```text
[0.3812227, -0.052848946, -0.10564975, 0.03480297, 0.2878488, 0.0084609175, 0.11605915, 0.05303011,
[0.066308185, -0.032866564, 0.115751594, 0.19082588, 0.14017, -0.26976448, -0.056340694, -0.26923394
```

---

## API 参考

有关 `TogetherEmbeddings` 功能和配置选项的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/together/embeddings/langchain_together.embeddings.TogetherEmbeddings.html)。
