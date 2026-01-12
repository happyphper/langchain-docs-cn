---
title: Netmind
---
本文将帮助您开始使用 LangChain 集成 Netmind 嵌入模型。有关 `NetmindEmbeddings` 功能和配置选项的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/)。

## 概述

### 集成详情

| 提供商 | 包 |
|:--------:|:-------:|
| [Netmind](/oss/javascript/integrations/providers/netmind/) | [langchain-netmind](https://python.langchain.com/api_reference/) |

## 设置

要访问 Netmind 嵌入模型，您需要创建一个 Netmind 账户，获取 API 密钥，并安装 `langchain-netmind` 集成包。

### 凭证

前往 [www.netmind.ai/](https://www.netmind.ai/) 注册 Netmind 并生成 API 密钥。完成后，设置 NETMIND_API_KEY 环境变量：

```python
import getpass
import os

if not os.getenv("NETMIND_API_KEY"):
    os.environ["NETMIND_API_KEY"] = getpass.getpass("Enter your Netmind API key: ")
```

如果您希望自动追踪模型调用，也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
# os.environ["LANGCHAIN_TRACING_V2"] = "true"
# os.environ["LANGCHAIN_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### 安装

LangChain Netmind 集成位于 `langchain-netmind` 包中：

```python
pip install -qU langchain-netmind
```

## 实例化

现在我们可以实例化我们的模型对象：

```python
from langchain_netmind import NetmindEmbeddings

embeddings = NetmindEmbeddings(
    model="nvidia/NV-Embed-v2",
)
```

## 索引与检索

嵌入模型常用于检索增强生成 (RAG) 流程中，既用于索引数据，也用于后续检索。更详细的说明，请参阅我们的 [RAG 教程](/oss/javascript/langchain/rag)。

下面展示了如何使用上面初始化的 `embeddings` 对象来索引和检索数据。在这个例子中，我们将在 `InMemoryVectorStore` 中索引和检索一个示例文档。

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

在底层，向量存储和检索器的实现分别调用 `embeddings.embed_documents(...)` 和 `embeddings.embed_query(...)` 来为 `from_texts` 中使用的文本和检索 `invoke` 操作创建嵌入向量。

您可以直接调用这些方法来获取嵌入向量，以满足您自己的用例。

### 嵌入单个文本

您可以使用 `embed_query` 嵌入单个文本或文档：

```python
single_vector = embeddings.embed_query(text)
print(str(single_vector)[:100])  # 显示向量的前 100 个字符
```

```text
[-0.0051240199245512486, -0.01726294495165348, 0.011966848745942116, -0.0018107350915670395, 0.01146
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

```text
[-0.0051240199245512486, -0.01726294495165348, 0.011966848745942116, -0.0018107350915670395, 0.01146
[0.022523142397403717, -0.002223758026957512, -0.008578270673751831, -0.006029821466654539, 0.008752
```

---

## API 参考

有关 `NetmindEmbeddings` 功能和配置选项的详细文档，请参阅：

* [API 参考](https://python.langchain.com/api_reference/)
* [langchain-netmind](https://github.com/protagolabs/langchain-netmind)
* [pypi](https://pypi.org/project/langchain-netmind/)
