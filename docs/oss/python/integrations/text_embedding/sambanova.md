---
title: SambaNovaEmbeddings
---
本文将帮助您开始使用 LangChain 集成 SambaNova 嵌入模型。有关 `SambaNovaEmbeddings` 功能和配置选项的详细文档，请参阅 [API 参考](https://docs.sambanova.ai/cloud/docs/get-started/overview)。

**[SambaNova](https://sambanova.ai/)** 的 [SambaCloud](https://cloud.sambanova.ai/) 是一个用于运行开源模型推理的平台。

## 概述

### 集成详情

| 提供商 | 包 |
|:--------:|:-------:|
| [SambaNova](/oss/python/integrations/providers/sambanova/) | [langchain-sambanova](/oss/python/integrations/providers/sambanova/) |

## 设置

要访问 `SambaNovaEmbeddings` 模型，您需要创建一个 [SambaCloud](http://cloud.sambanova.ai?utm_source=langchain&utm_medium=external&utm_campaign=cloud_signup) 账户，获取 API 密钥，并安装 `langchain_sambanova` 集成包。

```bash
pip install langchain-sambanova
```

### 凭证

从 [cloud.sambanova.ai](http://cloud.sambanova.ai/apis?utm_source=langchain&utm_medium=external&utm_campaign=cloud_signup) 获取 API 密钥。完成后，设置 `SAMBANOVA_API_KEY` 环境变量：

```python
import getpass
import os

if not os.getenv("SAMBANOVA_API_KEY"):
    os.environ["SAMBANOVA_API_KEY"] = getpass.getpass("Enter your SambaNova API key: ")
```

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### 安装

LangChain SambaNova 集成位于 `langchain-sambanova` 包中：

```python
pip install -qU langchain-sambanova
```

## 实例化

现在我们可以实例化模型对象并生成嵌入：

```python
from langchain_sambanova import SambaNovaEmbeddings

embeddings = SambaNovaEmbeddings(
    model="E5-Mistral-7B-Instruct",
)
```

## 索引与检索

嵌入模型通常用于检索增强生成（RAG）流程中，既用于索引数据，也用于后续检索。更详细的说明，请参阅我们的 [RAG 教程](/oss/python/langchain/rag)。

下面展示了如何使用上面初始化的 `embeddings` 对象来索引和检索数据。在本例中，我们将在 `InMemoryVectorStore` 中索引和检索一个示例文档。

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

## 直接使用

在底层，向量存储和检索器的实现分别调用 `embeddings.embed_documents(...)` 和 `embeddings.embed_query(...)` 来为 `from_texts` 中使用的文本和检索 `invoke` 操作创建嵌入。

您可以直接调用这些方法来获取嵌入，用于您自己的用例。

### 嵌入单个文本

您可以使用 `embed_query` 嵌入单个文本或文档：

```python
single_vector = embeddings.embed_query(text)
print(str(single_vector)[:100])  # 显示向量的前 100 个字符
```

### 嵌入多个文本

您可以使用 `embed_documents` 嵌入多个文本：

```python
text2 = (
    "LangGraph is a library for building stateful, multi-actor applications with LLMs"
)
two_vectors = embeddings.embed_documents([text, text2])
for vector in two_vectors:
    print(str(vector)[:100])  # 显示向量的前 100 个字符
```

---

## API 参考

有关 `SambaNovaEmbeddings` 功能和配置选项的详细文档，请参阅 [SambaNova 开发者指南](https://docs.sambanova.ai/cloud/docs/get-started/overview)。
