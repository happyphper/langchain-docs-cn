---
title: Meilisearch
---
> [Meilisearch](https://meilisearch.com) 是一个开源、闪电般快速且高度相关的搜索引擎。它提供了出色的默认设置，帮助开发者构建迅捷的搜索体验。
>
> 你可以[自托管 Meilisearch](https://www.meilisearch.com/docs/learn/getting_started/installation#local-installation) 或在 [Meilisearch Cloud](https://www.meilisearch.com/pricing) 上运行。

Meilisearch v1.3 支持向量搜索。本页将指导你如何将 Meilisearch 集成为向量存储，并使用它来执行向量搜索。

你需要安装 `langchain-community`，使用 `pip install -qU langchain-community` 来使用此集成。

## 设置

### 启动 Meilisearch 实例

你需要一个正在运行的 Meilisearch 实例作为你的向量存储。你可以在[本地运行 Meilisearch](https://www.meilisearch.com/docs/learn/getting_started/installation#local-installation) 或创建一个 [Meilisearch Cloud](https://cloud.meilisearch.com/) 账户。

从 Meilisearch v1.3 开始，向量存储是一项实验性功能。启动你的 Meilisearch 实例后，你需要**启用向量存储**。对于自托管的 Meilisearch，请阅读关于[启用实验性功能](https://www.meilisearch.com/docs/learn/experimental/overview)的文档。在 **Meilisearch Cloud** 上，通过你的项目 _设置_ 页面启用 _向量存储_。

现在你应该已经有一个启用了向量存储的 Meilisearch 实例在运行了。🎉

### 凭证

要与你的 Meilisearch 实例交互，Meilisearch SDK 需要一个主机（你的实例的 URL）和一个 API 密钥。

**主机**

- 在**本地**，默认主机是 `localhost:7700`
- 在 **Meilisearch Cloud** 上，在你的项目 _设置_ 页面找到主机

**API 密钥**

Meilisearch 实例默认提供三个 API 密钥：

- 一个 `MASTER KEY`（主密钥）—— 应仅用于创建你的 Meilisearch 实例
- 一个 `ADMIN KEY`（管理员密钥）—— 仅在服务器端用于更新你的数据库及其设置
- 一个 `SEARCH KEY`（搜索密钥）—— 一个可以安全地在前端应用程序中共享的密钥

你可以根据需要创建[额外的 API 密钥](https://www.meilisearch.com/docs/learn/security/master_api_keys)。

### 安装依赖项

本指南使用 [Meilisearch Python SDK](https://github.com/meilisearch/meilisearch-python)。你可以通过运行以下命令来安装它：

```python
pip install -qU  meilisearch
```

更多信息，请参考 [Meilisearch Python SDK 文档](https://meilisearch.github.io/meilisearch-python/)。

## 示例

有多种方法可以初始化 Meilisearch 向量存储：提供 Meilisearch 客户端或根据需要提供 _URL_ 和 _API 密钥_。在我们的示例中，凭证将从环境中加载。

你可以使用 `os` 和 `getpass` 使环境变量在你的 Notebook 环境中可用。你可以将此技术用于以下所有示例。

```python
import getpass
import os

if "MEILI_HTTP_ADDR" not in os.environ:
    os.environ["MEILI_HTTP_ADDR"] = getpass.getpass(
        "Meilisearch HTTP address and port:"
    )
if "MEILI_MASTER_KEY" not in os.environ:
    os.environ["MEILI_MASTER_KEY"] = getpass.getpass("Meilisearch API Key:")
```

我们想使用 <a href="https://reference.langchain.com/python/integrations/langchain_openai/OpenAIEmbeddings" target="_blank" rel="noreferrer" class="link"><code>OpenAIEmbeddings</code></a>，所以我们必须获取 OpenAI API 密钥。

```python
if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

### 添加文本和嵌入向量

此示例将文本添加到 Meilisearch 向量数据库，而无需初始化 Meilisearch 向量存储。

```python
from langchain_community.vectorstores import Meilisearch
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter

embeddings = OpenAIEmbeddings()
embedders = {
    "default": {
        "source": "userProvided",
        "dimensions": 1536,
    }
}
embedder_name = "default"
```

```python
with open("../../how_to/state_of_the_union.txt") as f:
    state_of_the_union = f.read()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_text(state_of_the_union)
```

```python
# 使用 Meilisearch 向量存储来存储文本及相关的嵌入向量
vector_store = Meilisearch.from_texts(
    texts=texts, embedding=embeddings, embedders=embedders, embedder_name=embedder_name
)
```

在幕后，Meilisearch 会将文本转换为多个向量。这将使我们得到与以下示例相同的结果。

### 添加文档和嵌入向量

在此示例中，我们将使用 LangChain TextSplitter 将文本分割成多个文档。然后，我们将存储这些文档及其嵌入向量。

```python
from langchain_community.document_loaders import TextLoader

# 加载文本
loader = TextLoader("../../how_to/state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)

# 创建文档
docs = text_splitter.split_documents(documents)

# 将文档和嵌入向量导入向量存储
vector_store = Meilisearch.from_documents(
    documents=documents,
    embedding=embeddings,
    embedders=embedders,
    embedder_name=embedder_name,
)

# 在我们的向量存储中搜索
query = "What did the president say about Ketanji Brown Jackson"
docs = vector_store.similarity_search(query, embedder_name=embedder_name)
print(docs[0].page_content)
```

## 通过创建 Meilisearch 向量存储来添加文档

在这种方法中，我们创建一个向量存储对象并向其中添加文档。

```python
import meilisearch
from langchain_community.vectorstores import Meilisearch

client = meilisearch.Client(url="http://127.0.0.1:7700", api_key="***")
vector_store = Meilisearch(
    embedding=embeddings,
    embedders=embedders,
    client=client,
    index_name="langchain_demo",
    text_key="text",
)
vector_store.add_documents(documents)
```

## 带分数的相似性搜索

此特定方法允许你返回文档以及查询与它们的距离分数。`embedder_name` 是应用于语义搜索的嵌入器名称，默认为 "default"。

```python
docs_and_scores = vector_store.similarity_search_with_score(
    query, embedder_name=embedder_name
)
docs_and_scores[0]
```

## 通过向量进行相似性搜索

`embedder_name` 是应用于语义搜索的嵌入器名称，默认为 "default"。

```python
embedding_vector = embeddings.embed_query(query)
docs_and_scores = vector_store.similarity_search_by_vector(
    embedding_vector, embedder_name=embedder_name
)
docs_and_scores[0]
```

## 其他资源

文档

- [Meilisearch](https://www.meilisearch.com/docs/)
- [Meilisearch Python SDK](https://python-sdk.meilisearch.com)

开源仓库

- [Meilisearch 仓库](https://github.com/meilisearch/meilisearch)
- [Meilisearch Python SDK](https://github.com/meilisearch/meilisearch-python)
