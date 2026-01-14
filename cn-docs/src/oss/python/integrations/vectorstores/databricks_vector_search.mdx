---
title: Databricks Vector Search
---
[Databricks Vector Search](https://docs.databricks.com/en/generative-ai/vector-search.html) 是一个无服务器的相似性搜索引擎，允许您在向量数据库中存储数据的向量表示（包括元数据）。借助 Vector Search，您可以从 Unity Catalog 管理的 Delta 表创建自动更新的向量搜索索引，并通过简单的 API 查询它们以返回最相似的向量。

本笔记本展示了如何将 LangChain 与 Databricks Vector Search 结合使用。

## 设置

要访问 Databricks 模型，您需要创建一个 Databricks 账户、设置凭据（仅当您在 Databricks 工作区外部时）并安装所需的软件包。

### 凭据（仅当您在 Databricks 外部时）

如果您在 Databricks 内部运行 LangChain 应用，可以跳过此步骤。

否则，您需要手动将 Databricks 工作区主机名和个人访问令牌分别设置为 `DATABRICKS_HOST` 和 `DATABRICKS_TOKEN` 环境变量。有关如何获取访问令牌，请参阅[身份验证文档](https://docs.databricks.com/en/dev-tools/auth/index.html#databricks-personal-access-tokens)。

```python
import getpass
import os

os.environ["DATABRICKS_HOST"] = "https://your-databricks-workspace"
if "DATABRICKS_TOKEN" not in os.environ:
    os.environ["DATABRICKS_TOKEN"] = getpass.getpass(
        "Enter your Databricks access token: "
    )
```

### 安装

LangChain Databricks 集成位于 `databricks-langchain` 包中。

```python
pip install -qU databricks-langchain
```

### 创建 Vector Search 终端节点和索引（如果尚未创建）

在本节中，我们将使用客户端 SDK 创建一个 Databricks Vector Search 终端节点和一个索引。

如果您已经有一个终端节点和一个索引，可以跳过本节，直接转到“实例化”部分。

首先，实例化 Databricks VectorSearch 客户端：

```python
from databricks.vector_search.client import VectorSearchClient

client = VectorSearchClient()
```

接下来，我们将创建一个新的 VectorSearch 终端节点。

```python
endpoint_name = "<your-endpoint-name>"

client.create_endpoint(name=endpoint_name, endpoint_type="STANDARD")
```

最后，我们将创建一个可以在该终端节点上查询的索引。Databricks Vector Search 中有两种类型的索引，`DatabricksVectorSearch` 类支持这两种用例。

*   **Delta 同步索引** 会自动与源 Delta 表同步，并随着 Delta 表中底层数据的变化自动增量更新索引。
*   **直接向量访问索引** 支持直接读写向量和元数据。用户负责使用 REST API 或 Python SDK 更新此表。

此外，对于 delta-sync 索引，您可以选择使用 Databricks 托管的嵌入或自管理的嵌入（通过 LangChain 嵌入类）。

以下代码创建一个**直接访问**索引。有关创建其他类型索引的说明，请参阅 [Databricks 文档](https://docs.databricks.com/en/generative-ai/create-query-vector-search.html)。

```python
index_name = "<your-index-name>"  # 格式："<catalog>.<schema>.<index-name>"

index = client.create_direct_access_index(
    endpoint_name=endpoint_name,
    index_name=index_name,
    primary_key="id",
    # 嵌入的维度。请根据您使用的嵌入模型进行更改。
    embedding_dimension=3072,
    # 用于存储文本数据嵌入向量的列
    embedding_vector_column="text_vector",
    schema={
        "id": "string",
        "text": "string",
        "text_vector": "array<float>",
        # 可选的元数据列
        "source": "string",
    },
)

index.describe()
```

## 实例化

`DatabricksVectorSearch` 的实例化方式略有不同，具体取决于您的索引是使用 Databricks 托管的嵌入还是自管理的嵌入（即您选择的 LangChain Embeddings 对象）。

如果您使用的是带有 Databricks 托管嵌入的 delta-sync 索引：

```python
from databricks_langchain import DatabricksVectorSearch

vector_store = DatabricksVectorSearch(
    endpoint=endpoint_name,
    index_name=index_name,
)
```

如果您使用的是直接访问索引或带有自管理嵌入的 delta-sync 索引，您还需要提供嵌入模型以及源表中用于生成嵌入的文本列：

<EmbeddingTabs/>

```python
# | output: false
# | echo: false
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
```

```python
vector_store = DatabricksVectorSearch(
    endpoint=endpoint_name,
    index_name=index_name,
    embedding=embeddings,
    # 索引中包含要嵌入的文本数据的列名
    text_column="document_content",
)
```

## 管理向量存储

### 向向量存储添加项目

注意：通过 `add_documents` 方法向向量存储添加项目仅支持**直接访问**索引。

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

### 从向量存储中删除项目

注意：通过 `delete` 方法从向量存储中删除项目仅支持**直接访问**索引。

```python
vector_store.delete(ids=["3"])
```

```text
True
```

## 查询向量存储

一旦您的向量存储创建完成并添加了相关文档，您很可能希望在运行链或代理时查询它。

### 直接查询

可以按如下方式执行简单的相似性搜索：

```python
results = vector_store.similarity_search(
    query="thud", k=1, filter={"source": "https://example.com"}
)
for doc in results:
    print(f"* {doc.page_content} [{doc.metadata}]")
```

```text
* foo [{'id': '1'}]
```

注意：默认情况下，相似性搜索仅返回主键和文本列。如果您想检索与文档关联的自定义元数据，请在初始化向量存储时在 `columns` 参数中传递额外的列。

```python
vector_store = DatabricksVectorSearch(
    endpoint=endpoint_name,
    index_name=index_name,
    embedding=embeddings,
    text_column="text",
    columns=["source"],
)

results = vector_store.similarity_search(query="thud", k=1)
for doc in results:
    print(f"* {doc.page_content} [{doc.metadata}]")
```

```text
* foo [{'source': 'https://example.com', 'id': '1'}]
```

如果您想执行相似性搜索并获取相应的分数，可以运行：

```python
results = vector_store.similarity_search_with_score(
    query="thud", k=1, filter={"source": "https://example.com"}
)
for doc, score in results:
    print(f"* [SIM={score:3f}] {doc.page_content} [{doc.metadata}]")
```

```text
* [SIM=0.414035] foo [{'source': 'https://example.com', 'id': '1'}]
```

### 通过转换为检索器进行查询

您还可以将向量存储转换为检索器，以便在链中更轻松地使用。

```python
retriever = vector_store.as_retriever(search_type="mmr", search_kwargs={"k": 1})
retriever.invoke("thud")
```

```text
[Document(metadata={'source': 'https://example.com', 'id': '1'}, page_content='foo')]
```

## 用于检索增强生成

有关如何使用此向量存储进行检索增强生成 (RAG) 的指南，请参阅以下部分：

*   [教程](/oss/langchain/rag)
*   [操作指南：使用 RAG 进行问答](https://python.langchain.com/docs/how_to/#qa-with-rag)
*   [检索概念文档](https://python.langchain.com/docs/concepts/retrieval)

---

## API 参考

有关 DatabricksVectorSearch 所有功能和配置的详细文档，请访问 API 参考：[api-docs.databricks.com/python/databricks-ai-bridge/latest/databricks_langchain.html#databricks_langchain.DatabricksVectorSearch](https://api-docs.databricks.com/python/databricks-ai-bridge/latest/databricks_langchain.html#databricks_langchain.DatabricksVectorSearch)
