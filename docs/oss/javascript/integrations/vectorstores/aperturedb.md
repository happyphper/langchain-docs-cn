---
title: ApertureDB
---
[ApertureDB](https://docs.aperturedata.io) 是一个用于存储、索引和管理多模态数据（如文本、图像、视频、边界框和嵌入向量）及其关联元数据的数据库。

本笔记本将介绍如何使用 ApertureDB 的嵌入向量功能。

## 安装 ApertureDB Python SDK

这将安装用于为 ApertureDB 编写客户端代码的 [Python SDK](https://docs.aperturedata.io/category/aperturedb-python-sdk)。

```python
pip install -qU aperturedb
```

## 运行 ApertureDB 实例

要继续操作，您需要 [启动并运行一个 ApertureDB 实例](https://docs.aperturedata.io/HowToGuides/start/Setup)，并配置您的环境以使用它。
有多种方法可以实现，例如：

```bash
docker run --publish 55555:55555 aperturedata/aperturedb-standalone
adb config create local --active --no-interactive
```

## 下载一些网页文档

我们将在此处对一个网页进行小型爬取。

```python
# 用于从网页加载文档
from langchain_community.document_loaders import WebBaseLoader

loader = WebBaseLoader("https://docs.aperturedata.io")
docs = loader.load()
```

```text
USER_AGENT environment variable not set, consider setting it to identify your requests.
```

## 选择嵌入模型

我们想使用 OllamaEmbeddings，因此必须导入必要的模块。

可以按照 [文档](https://hub.docker.com/r/ollama/ollama) 中的描述将 Ollama 设置为 Docker 容器，例如：

```bash
# 运行服务器
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
# 告诉服务器加载特定模型
docker exec ollama ollama run llama2
```

```python
from langchain_community.embeddings import OllamaEmbeddings

embeddings = OllamaEmbeddings()
```

## 将文档分割成片段

我们希望将单个文档转换为多个片段。

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter()
documents = text_splitter.split_documents(docs)
```

## 从文档和嵌入向量创建向量存储

此代码在 ApertureDB 实例中创建一个向量存储。
在实例内部，此向量存储表示为一个 "[描述符集（descriptor set）](https://docs.aperturedata.io/category/descriptorset-commands)"。
默认情况下，描述符集命名为 `langchain`。以下代码将为每个文档生成嵌入向量，并将它们作为描述符存储在 ApertureDB 中。由于需要生成嵌入向量，这将需要几秒钟时间。

```python
from langchain_community.vectorstores import ApertureDB

vector_db = ApertureDB.from_documents(documents, embeddings)
```

## 选择一个大语言模型

同样，我们使用为本地处理设置的 Ollama 服务器。

```python
from langchain_community.llms import Ollama

llm = Ollama(model="llama2")
```

## 构建 RAG 链

现在我们拥有了创建 RAG（检索增强生成）链所需的所有组件。该链执行以下操作：

1.  为用户查询生成嵌入描述符
2.  使用向量存储查找与用户查询相似的文本片段
3.  使用提示模板将用户查询和上下文文档传递给 LLM
4.  返回 LLM 的答案

```python
# 创建提示
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("""请仅根据提供的上下文回答以下问题：

<context>
{context}
</context>

问题：{input}""")

# 创建一个将文档传递给 LLM 的链
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

document_chain = create_stuff_documents_chain(llm, prompt)

# 将向量存储视为文档检索器
retriever = vector_db.as_retriever()

# 创建一个将检索器连接到 LLM 的 RAG 链
from langchain_classic.chains import create_retrieval_chain

retrieval_chain = create_retrieval_chain(retriever, document_chain)
```

```text
Based on the provided context, ApertureDB can store images. In fact, it is specifically designed to manage multimodal data such as images, videos, documents, embeddings, and associated metadata including annotations. So, ApertureDB has the capability to store and manage images.
```

## 运行 RAG 链

最后，我们将一个问题传递给链并获取答案。由于 LLM 需要根据查询和上下文文档生成答案，这将需要几秒钟时间来运行。

```python
user_query = "How can ApertureDB store images?"
response = retrieval_chain.invoke({"input": user_query})
print(response["answer"])
```

```text
Based on the provided context, ApertureDB can store images in several ways:

1. Multimodal data management: ApertureDB offers a unified interface to manage multimodal data such as images, videos, documents, embeddings, and associated metadata including annotations. This means that images can be stored along with other types of data in a single database instance.
2. Image storage: ApertureDB provides image storage capabilities through its integration with the public cloud providers or on-premise installations. This allows customers to host their own ApertureDB instances and store images on their preferred cloud provider or on-premise infrastructure.
3. Vector database: ApertureDB also offers a vector database that enables efficient similarity search and classification of images based on their semantic meaning. This can be useful for applications where image search and classification are important, such as in computer vision or machine learning workflows.

Overall, ApertureDB provides flexible and scalable storage options for images, allowing customers to choose the deployment model that best suits their needs.
```
