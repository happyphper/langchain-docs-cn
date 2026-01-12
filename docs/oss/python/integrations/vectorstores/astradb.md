---
title: Astra DB 向量存储
---
本页面提供了使用 Astra DB 作为向量存储的快速入门指南。

> [DataStax Astra DB](https://docs.datastax.com/en/astra-db-serverless/index.html) 是一个基于 `Apache Cassandra®` 构建的无服务器 AI 就绪数据库，通过易于使用的 JSON API 方便地提供。

## 设置

### 依赖项

使用该集成需要 `langchain-astradb` 合作伙伴包：

```python
!pip install \
    "langchain>=0.3.23,<0.4" \
    "langchain-core>=0.3.52,<0.4" \
    "langchain-astradb>=0.6,<0.7"
```

### 凭证

为了使用 AstraDB 向量存储，您必须首先访问 [AstraDB 网站](https://astra.datastax.com)，创建一个账户，然后创建一个新数据库——初始化可能需要几分钟时间。

数据库初始化完成后，请获取您的[连接密钥](https://docs.datastax.com/en/astra-db-serverless/get-started/quickstart.html#create-a-database-and-store-your-credentials)，稍后您将需要它们。这些是：

- 一个 **`API 端点`**，例如 `"https://01234567-89ab-cdef-0123-456789abcdef-us-east1.apps.astra.datastax.com/"`
- 以及一个 **`数据库令牌`**，例如 `"AstraCS:aBcD123......"`

您可以选择性地提供一个 **`键空间`**（在 LangChain 组件中称为 "namespace"），您可以从数据库仪表板的 `Data Explorer` 选项卡管理它。如果您愿意，可以在下面的提示中留空，回退到默认键空间。

```python
import getpass

ASTRA_DB_API_ENDPOINT = input("ASTRA_DB_API_ENDPOINT = ").strip()
ASTRA_DB_APPLICATION_TOKEN = getpass.getpass("ASTRA_DB_APPLICATION_TOKEN = ").strip()

desired_keyspace = input("(optional) ASTRA_DB_KEYSPACE = ").strip()
if desired_keyspace:
    ASTRA_DB_KEYSPACE = desired_keyspace
else:
    ASTRA_DB_KEYSPACE = None
```

```text
ASTRA_DB_API_ENDPOINT =  https://01234567-89ab-cdef-0123-456789abcdef-us-east1.apps.astra.datastax.com
ASTRA_DB_APPLICATION_TOKEN =  ········
(optional) ASTRA_DB_KEYSPACE =
```

如果您希望获得最佳的模型调用自动追踪功能，还可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

## 初始化

有多种方法可以创建 Astra DB 向量存储：

#### 方法 1：显式嵌入

您可以单独实例化一个 `langchain_core.embeddings.Embeddings` 类，并将其传递给 `AstraDBVectorStore` 构造函数，就像大多数其他 LangChain 向量存储一样。

#### 方法 2：服务器端嵌入（'vectorize'）

或者，您可以使用 Astra DB 的[服务器端嵌入计算](https://docs.datastax.com/en/astra-db-serverless/databases/embedding-generation.html)功能（'vectorize'），在创建存储的服务器基础设施时简单地指定一个嵌入模型。然后，在后续的读写操作中，嵌入计算将完全在数据库内部处理。（要使用此方法，您必须已为数据库启用所需的嵌入集成，如[文档](https://docs.datastax.com/en/astra-db-serverless/databases/embedding-generation.html)中所述。）

#### 方法 3：从预先存在的集合自动检测

您可能已经在 Astra DB 中有一个[集合](https://docs.datastax.com/en/astra-db-serverless/api-reference/collections.html)，可能已通过其他方式（例如通过 Astra UI 或第三方应用程序）预先填充了数据，并且只想在 LangChain 中开始查询它。在这种情况下，正确的方法是在向量存储构造函数中启用 `autodetect_collection` 模式，让类自行确定细节。（当然，如果您的集合没有 'vectorize'，您仍然需要提供一个 <a href="https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings" target="_blank" rel="noreferrer" class="link"><code>Embeddings</code></a> 对象）。

#### 关于"混合搜索"的说明

Astra DB 向量存储在向量搜索中支持元数据搜索；此外，版本 0.6 通过 [findAndRerank](https://docs.datastax.com/en/astra-db-serverless/api-reference/document-methods/find-and-rerank.html) 数据库原语引入了对*混合搜索*的全面支持：文档通过向量相似度*和*基于关键词（"词汇"）的搜索进行检索，然后通过重排序模型进行合并。这种完全在服务器端处理的搜索策略可以提高结果的准确性，从而改善您的 RAG 应用程序质量。只要可用，向量存储会自动使用混合搜索（尽管您也可以手动控制它）。

#### 附加信息

`AstraDBVectorStore` 可以通过多种方式进行配置；有关完整指南，请参阅 [API 参考](https://python.langchain.com/api_reference/astradb/vectorstores/langchain_astradb.vectorstores.AstraDBVectorStore.html)，涵盖例如异步初始化；非 Astra-DB 数据库；自定义索引允许/拒绝列表；手动混合搜索控制；以及更多内容。

### 显式嵌入初始化（方法 1）

使用显式嵌入类实例化我们的向量存储：

<EmbeddingTabs/>

```python
# | output: false
# | echo: false
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
```

```python
from langchain_astradb import AstraDBVectorStore

vector_store_explicit_embeddings = AstraDBVectorStore(
    collection_name="astra_vector_langchain",
    embedding=embeddings,
    api_endpoint=ASTRA_DB_API_ENDPOINT,
    token=ASTRA_DB_APPLICATION_TOKEN,
    namespace=ASTRA_DB_KEYSPACE,
)
```

### 服务器端嵌入初始化（"vectorize"，方法 2）

在此示例代码中，假设您已经：

- 在您的 Astra DB 组织中启用了 OpenAI 集成，
- 向该集成添加了一个名为 `"OPENAI_API_KEY"` 的 API 密钥，并将其范围限定为您正在使用的数据库。

有关更多详细信息，包括切换提供商/模型的说明，请查阅[文档](https://docs.datastax.com/en/astra-db-serverless/databases/embedding-generation.html)。

```python
from astrapy.info import VectorServiceOptions

openai_vectorize_options = VectorServiceOptions(
    provider="openai",
    model_name="text-embedding-3-small",
    authentication={
        "providerKey": "OPENAI_API_KEY",
    },
)

vector_store_integrated_embeddings = AstraDBVectorStore(
    collection_name="astra_vectorize_langchain",
    api_endpoint=ASTRA_DB_API_ENDPOINT,
    token=ASTRA_DB_APPLICATION_TOKEN,
    namespace=ASTRA_DB_KEYSPACE,
    collection_vector_service_options=openai_vectorize_options,
)
```

### 自动检测初始化（方法 3）

如果集合已存在于数据库中，并且您的 `AstraDBVectorStore` 需要使用它（进行读写操作），则可以使用此模式。LangChain 组件将检查集合并确定其细节。

如果集合是通过 LangChain 以外的工具创建并——最重要的是——填充的，例如数据是通过 Astra DB Web 界面摄取的，则这是推荐的方法。

自动检测模式不能与*集合*设置（例如相似性度量等）共存；另一方面，如果未使用服务器端嵌入，则仍需要向构造函数传递一个 <a href="https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings" target="_blank" rel="noreferrer" class="link"><code>Embeddings</code></a> 对象。

在以下示例代码中，我们将"自动检测"上面方法 2（"vectorize"）创建的同一个集合。因此，不需要提供 <a href="https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings" target="_blank" rel="noreferrer" class="link"><code>Embeddings</code></a> 对象。

```python
vector_store_autodetected = AstraDBVectorStore(
    collection_name="astra_vectorize_langchain",
    api_endpoint=ASTRA_DB_API_ENDPOINT,
    token=ASTRA_DB_APPLICATION_TOKEN,
    namespace=ASTRA_DB_KEYSPACE,
    autodetect_collection=True,
)
```

## 管理向量存储

创建向量存储后，通过添加和删除不同项目与其进行交互。

与向量存储的所有交互都独立于初始化方法进行：如果您愿意，请**修改以下单元格**，以选择您创建并希望测试的向量存储。

```python
# 如果需要，请在此处取消注释不同的行：

# vector_store = vector_store_explicit_embeddings
vector_store = vector_store_integrated_embeddings
# vector_store = vector_store_autodetected
```

### 向向量存储添加项目

使用 `add_documents` 方法向向量存储添加文档。

_"id" 字段可以单独提供，作为 `add_documents` 的匹配 `ids=[...]` 参数，甚至可以完全省略，让存储生成 ID。_

```python
from langchain_core.documents import Document

documents_to_insert = [
    Document(
        page_content="ZYX, just another tool in the world, is actually my agent-based superhero",
        metadata={"source": "tweet"},
        id="entry_00",
    ),
    Document(
        page_content="I had chocolate chip pancakes and scrambled eggs "
        "for breakfast this morning.",
        metadata={"source": "tweet"},
        id="entry_01",
    ),
    Document(
        page_content="The weather forecast for tomorrow is cloudy and "
        "overcast, with a high of 62 degrees.",
        metadata={"source": "news"},
        id="entry_02",
    ),
    Document(
        page_content="Building an exciting new project with LangChain "
        "- come check it out!",
        metadata={"source": "tweet"},
        id="entry_03",
    ),
    Document(
        page_content="Robbers broke into the city bank and stole $1 million in cash.",
        metadata={"source": "news"},
        id="entry_04",
    ),
    Document(
        page_content="Thanks to her sophisticated language skills, the agent "
        "managed to extract strategic information all right.",
        metadata={"source": "tweet"},
        id="entry_05",
    ),
    Document(
        page_content="Is the new iPhone worth the price? Read this review to find out.",
        metadata={"source": "website"},
        id="entry_06",
    ),
    Document(
        page_content="The top 10 soccer players in the world right now.",
        metadata={"source": "website"},
        id="entry_07",
    ),
    Document(
        page_content="LangGraph is the best framework for building stateful, "
        "agentic applications!",
        metadata={"source": "tweet"},
        id="entry_08",
    ),
    Document(
        page_content="The stock market is down 500 points today due to "
        "fears of a recession.",
        metadata={"source": "news"},
        id="entry_09",
    ),
    Document(
        page_content="I have a bad feeling I am going to get deleted :(",
        metadata={"source": "tweet"},
        id="entry_10",
    ),
]

vector_store.add_documents(documents=documents_to_insert)
```

```python
['entry_00',
 'entry_01',
 'entry_02',
 'entry_03',
 'entry_04',
 'entry_05',
 'entry_06',
 'entry_07',
 'entry_08',
 'entry_09',
 'entry_10']
```

### 从向量存储中删除项目

使用 `delete` 函数按 ID 删除项目。

```python
vector_store.delete(ids=["entry_10", "entry_02"])
```

```text
True
```

## 查询向量存储

向量存储创建并填充后，您可以查询它（例如，作为您的链或代理的一部分）。

### 直接查询

#### 相似性搜索

搜索与提供文本相似的文档，如果需要可以附加元数据过滤器：

```python
results = vector_store.similarity_search(
    "LangChain provides abstractions to make working with LLMs easy",
    k=3,
    filter={"source": "tweet"},
)
for res in results:
    print(f'* "{res.page_content}", metadata={res.metadata}')
```

```text
* "Building an exciting new project with LangChain - come check it out!", metadata={'source': 'tweet'}
* "LangGraph is the best framework for building stateful, agentic applications!", metadata={'source': 'tweet'}
* "Thanks to her sophisticated language skills, the agent managed to extract strategic information all right.", metadata={'source': 'tweet'}
```

#### 带分数的相似性搜索

您也可以返回相似性分数：

```python
results = vector_store.similarity_search_with_score(
    "LangChain provides abstractions to make working with LLMs easy",
    k=3,
    filter={"source": "tweet"},
)
for res, score in results:
    print(f'* [SIM={score:.2f}] "{res.page_content}", metadata={res.metadata}')
```

```text
* [SIM=0.71] "Building an exciting new project with LangChain - come check it out!", metadata={'source': 'tweet'}
* [SIM=0.70] "LangGraph is the best framework for building stateful, agentic applications!", metadata={'source': 'tweet'}
* [SIM=0.61] "Thanks to her sophisticated language skills, the agent managed to extract strategic information all right.", metadata={'source': 'tweet'}
```

#### 指定不同的关键词查询（需要混合搜索）

> 注意：仅当集合支持 [find-and-rerank](https://docs.datastax.com/en/astra-db-serverless/api-reference/document-methods/find-and-rerank.html) 命令且向量存储知晓此事实时，才能运行此单元格。

如果向量存储使用的是支持混合搜索的集合并且已检测到这一事实，默认情况下它将在运行搜索时使用该功能。

在这种情况下，在 find-and-rerank 过程中，相同的查询文本将用于向量相似度和基于词汇的检索步骤，*除非您明确为后者提供不同的查询*：

```python
results = vector_store_autodetected.similarity_search(
    "LangChain provides abstractions to make working with LLMs easy",
    k=3,
    filter={"source": "tweet"},
    lexical_query="agent",
)
for res in results:
    print(f'* "{res.page_content}", metadata={res.metadata}')
```

```text
* "Building an exciting new project with LangChain - come check it out!", metadata={'source': 'tweet'}
* "LangGraph is the best framework for building stateful, agentic applications!", metadata={'source': 'tweet'}
* "ZYX, just another tool in the world, is actually my agent-based superhero", metadata={'source': 'tweet'}
```

_上面的示例硬编码了"自动检测"的向量存储，它肯定已经检查了集合并确定了混合搜索是否可用。另一种选择是显式地向构造函数提供混合搜索参数（更多详细信息/示例请参阅 API 参考）。_

#### 其他搜索方法

还有许多其他搜索方法未在本笔记本中涵盖，例如 MMR 搜索和按向量搜索。

有关 `AstraDBVectorStore` 中可用搜索模式的完整列表，请查看 [API 参考](https://python.langchain.com/api_reference/astradb/vectorstores/langchain_astradb.vectorstores.AstraDBVectorStore.html)。

### 通过转换为检索器进行查询

您还可以将向量存储转换为检索器，以便在您的链中更轻松地使用。

将向量存储转换为检索器，并使用简单查询 + 元数据过滤器调用它：

```python
retriever = vector_store.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"k": 1, "score_threshold": 0.5},
)
retriever.invoke("Stealing from the bank is a crime", filter={"source": "news"})
```

```text
[Document(id='entry_04', metadata={'source': 'news'}, page_content='Robbers broke into the city bank and stole $1 million in cash.')]
```

## 用于检索增强生成

有关如何使用此向量存储进行检索增强生成 (RAG) 的指南，请参阅以下部分：

- [教程](/oss/python/langchain/rag)
- [操作指南：使用 RAG 进行问答](https://python.langchain.com/docs/how_to/#qa-with-rag)
- [检索概念文档](https://python.langchain.com/docs/concepts/retrieval)

更多信息，请查看使用 Astra DB 的完整 RAG 模板[此处](https://github.com/langchain-ai/langchain/tree/master/templates/rag-astradb)。

## 清理向量存储

如果您想从 Astra DB 实例中完全删除集合，请运行此命令。

_（您将丢失其中存储的数据。）_

```python
vector_store.delete_collection()
```

---

## API 参考

有关 `AstraDBVectorStore` 所有功能和配置的详细文档，请查阅 [API 参考](https://python.langchain.com/api_reference/astradb/vectorstores/langchain_astradb.vectorstores.AstraDBVectorStore.html)。
