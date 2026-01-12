---
title: OllamaEmbeddings
---
本文将帮助您开始使用 LangChain 与 Ollama 嵌入模型。有关 `OllamaEmbeddings` 功能和配置选项的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/ollama/embeddings/langchain_ollama.embeddings.OllamaEmbeddings.html)。

## 概述

### 集成详情

<ItemTable category="text_embedding" item="Ollama" />

## 设置

首先，请按照 [这些说明](https://github.com/ollama/ollama?tab=readme-ov-file#ollama) 来设置并运行一个本地的 Ollama 实例：

*   [下载](https://ollama.ai/download) 并将 Ollama 安装到可用的受支持平台（包括 Windows Subsystem for Linux 即 WSL、macOS 和 Linux）
    *   macOS 用户可以通过 Homebrew 使用 `brew install ollama` 安装，并使用 `brew services start ollama` 启动
*   通过 `ollama pull <模型名称>` 获取可用的 LLM 模型
    *   通过 [模型库](https://ollama.ai/library) 查看可用模型列表
    *   例如：`ollama pull llama3`
*   这将下载模型的默认标记版本。通常，默认指向最新、参数规模最小的模型。

> 在 Mac 上，模型将下载到 `~/.ollama/models`
>
> 在 Linux（或 WSL）上，模型将存储在 `/usr/share/ollama/.ollama/models`

*   指定感兴趣模型的确切版本，例如 `ollama pull vicuna:13b-v1.5-16k-q4_0`（在此示例中查看 [`Vicuna`](https://ollama.ai/library/vicuna/tags) 模型的各种标签）
*   要查看所有已拉取的模型，请使用 `ollama list`
*   要从命令行直接与模型对话，请使用 `ollama run <模型名称>`
*   查看 [Ollama 文档](https://github.com/ollama/ollama/tree/main/docs) 以获取更多命令。您可以在终端中运行 `ollama help` 来查看可用命令。

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### 安装

LangChain Ollama 集成位于 `langchain-ollama` 包中：

```python
pip install -qU langchain-ollama
```

## 实例化

现在我们可以实例化我们的模型对象并生成嵌入向量：

```python
from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(
    model="llama3",
)
```

## 索引与检索

嵌入模型通常用于检索增强生成（RAG）流程中，既作为索引数据的一部分，也用于后续检索。更详细的说明，请参阅我们的 [RAG 教程](/oss/python/langchain/rag/)。

下面，我们将展示如何使用上面初始化的 `embeddings` 对象来索引和检索数据。在此示例中，我们将在 `InMemoryVectorStore` 中索引和检索一个示例文档。

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
print(retrieved_documents[0].page_content)
```

```text
LangChain is the framework for building context-aware reasoning applications
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
[-0.0039849705, 0.023019705, -0.001768838, -0.0058736936, 0.00040999008, 0.017861595, -0.011274585,
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
[-0.0039849705, 0.023019705, -0.001768838, -0.0058736936, 0.00040999008, 0.017861595, -0.011274585,
[-0.0066985516, 0.009878328, 0.008019467, -0.009384944, -0.029560851, 0.025744654, 0.004872892, -0.0
```

---

## API 参考

有关 `OllamaEmbeddings` 功能和配置选项的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/ollama/embeddings/langchain_ollama.embeddings.OllamaEmbeddings.html)。
