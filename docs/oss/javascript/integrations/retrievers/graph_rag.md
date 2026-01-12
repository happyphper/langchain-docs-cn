---
title: 图检索增强生成
---
本指南提供了 Graph RAG 的入门介绍。有关所有支持功能和配置的详细文档，请参阅 [Graph RAG 项目页面](https://datastax.github.io/graph-rag/)。

## 概述

`langchain-graph-retriever` 包中的 `GraphRetriever` 提供了一个 LangChain [检索器](/oss/javascript/langchain/retrieval/)，它结合了对向量的**非结构化**相似性搜索和对元数据属性的**结构化**遍历。这使得可以在**现有**向量存储之上进行基于图的检索。

### 集成详情

| 检索器 | 源码 | PyPI 包 | 最新版本 | 项目页面 |
| :--- | :--- | :---: | :---: | :---: |
| GraphRetriever | [github.com/datastax/graph-rag](https://github.com/datastax/graph-rag/tree/main/packages/langchain-graph-retriever) | [langchain-graph-retriever](https://pypi.org/project/langchain-graph-retriever/) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-graph-retriever?style=flat-square&label=%20&color=orange) | [Graph RAG](https://datastax.github.io/graph-rag/) |

## 优势

* [**基于现有元数据建立链接：**](https://datastax.github.io/graph-rag/guide/get-started/)
  使用现有的元数据字段，无需额外处理。从现有向量存储中检索更多内容！

* [**按需更改链接：**](https://datastax.github.io/graph-rag/guide/edges/)
  可以动态指定边（edges），允许根据问题遍历不同的关系。

* [**可插拔的遍历策略：**](https://datastax.github.io/graph-rag/guide/strategies/)
  使用内置的遍历策略，如 Eager 或 MMR，或定义自定义逻辑来选择要探索的节点。

* [**广泛的兼容性：**](https://datastax.github.io/graph-rag/guide/adapters/)
  适配器适用于多种向量存储，并且可以轻松添加对其他存储的支持。

## 设置

### 安装

此检索器位于 `langchain-graph-retriever` 包中。

::: code-group

```bash [pip]
pip install -qU langchain-graph-retriever
```

```bash [uv]
uv add langchain-graph-retriever
```

:::

## 实例化

以下示例将展示如何对一些关于动物的示例文档执行图遍历。

### 先决条件

::: details 点击查看详情
1. 确保已安装 Python 3.10+

    1. 安装提供示例数据的包。
```bash
pip install -qU graph_rag_example_helpers
```

    1. 下载测试文档：
```python
from graph_rag_example_helpers.datasets.animals import fetch_documents
animals = fetch_documents()
```

    1. <EmbeddingTabs/>
:::

### 填充向量存储

本节展示如何使用示例数据填充各种向量存储。

如需帮助选择下面的向量存储之一，或要添加对您向量存储的支持，请查阅关于[适配器和支持的存储](https://datastax.github.io/graph-rag/guide/adapters/)的文档。

<Tabs groupId="vector-store" queryString>

<Tab title="AstraDB">

<div :style="{ paddingLeft: '30px' }">

安装带有 `astra` 额外依赖的 `langchain-graph-retriever` 包：

```bash
pip install "langchain-graph-retriever[astra]"
```

然后创建向量存储并加载测试文档：

```python
from langchain_astradb import AstraDBVectorStore

vector_store = AstraDBVectorStore.from_documents(
    documents=animals,
    embedding=embeddings,
    collection_name="animals",
    api_endpoint=ASTRA_DB_API_ENDPOINT,
    token=ASTRA_DB_APPLICATION_TOKEN,
)
```
关于 `ASTRA_DB_API_ENDPOINT` 和 `ASTRA_DB_APPLICATION_TOKEN` 凭据，请查阅 [AstraDB 向量存储指南](/oss/javascript/integrations/vectorstores/astradb)。

:::note
为了更快的初始测试，请考虑使用 **InMemory** 向量存储。
:::

</div>

</Tab>

<Tab title="Apache Cassandra">

<div :style="{ paddingLeft: '30px' }">

安装带有 `cassandra` 额外依赖的 `langchain-graph-retriever` 包：

```bash
pip install "langchain-graph-retriever[cassandra]"
```

然后创建向量存储并加载测试文档：

```python
from langchain_community.vectorstores.cassandra import Cassandra
from langchain_graph_retriever.transformers import ShreddingTransformer

vector_store = Cassandra.from_documents(
    documents=list(ShreddingTransformer().transform_documents(animals)),
    embedding=embeddings,
    table_name="animals",
)
```

有关创建 Cassandra 连接的帮助，请查阅 [Apache Cassandra 向量存储指南](/oss/javascript/integrations/vectorstores/cassandra#connection-parameters)

:::note
Apache Cassandra 不支持在嵌套元数据中搜索。因此，在插入文档时必须使用 [`ShreddingTransformer`](https://datastax.github.io/graph-rag/reference/langchain_graph_retriever/transformers/#langchain_graph_retriever.transformers.shredding.ShreddingTransformer)。
:::

</div>

</Tab>

<Tab title="OpenSearch">

<div :style="{ paddingLeft: '30px' }">

安装带有 `opensearch` 额外依赖的 `langchain-graph-retriever` 包：

```bash
pip install "langchain-graph-retriever[opensearch]"
```

然后创建向量存储并加载测试文档：

```python
from langchain_community.vectorstores import OpenSearchVectorSearch

vector_store = OpenSearchVectorSearch.from_documents(
    documents=animals,
    embedding=embeddings,
    engine="faiss",
    index_name="animals",
    opensearch_url=OPEN_SEARCH_URL,
    bulk_size=500,
)
```

有关创建 OpenSearch 连接的帮助，请查阅 [OpenSearch 向量存储指南](/oss/javascript/integrations/vectorstores/opensearch)。

</div>

</Tab>

<Tab title="Chroma">

<div :style="{ paddingLeft: '30px' }">

安装带有 `chroma` 额外依赖的 `langchain-graph-retriever` 包：

```bash
pip install "langchain-graph-retriever[chroma]"
```

然后创建向量存储并加载测试文档：

```python
from langchain_chroma.vectorstores import Chroma
from langchain_graph_retriever.transformers import ShreddingTransformer

vector_store = Chroma.from_documents(
    documents=list(ShreddingTransformer().transform_documents(animals)),
    embedding=embeddings,
    collection_name="animals",
)
```

有关创建 Chroma 连接的帮助，请查阅 [Chroma 向量存储指南](/oss/javascript/integrations/vectorstores/chroma)。

:::note
Chroma 不支持在嵌套元数据中搜索。因此，在插入文档时必须使用 [`ShreddingTransformer`](https://datastax.github.io/graph-rag/reference/langchain_graph_retriever/transformers/#langchain_graph_retriever.transformers.shredding.ShreddingTransformer)。
:::

</div>

</Tab>

<Tab title="InMemory">

<div :style="{ paddingLeft: '30px' }">

安装 `langchain-graph-retriever` 包：

```bash
pip install "langchain-graph-retriever"
```

然后创建向量存储并加载测试文档：

```python
from langchain_core.vectorstores import InMemoryVectorStore

vector_store = InMemoryVectorStore.from_documents(
    documents=animals,
    embedding=embeddings,
)
```

:::tip
使用 `InMemoryVectorStore` 是开始使用 Graph RAG 的最快方式，但不建议在生产环境中使用。建议使用 **AstraDB** 或 **OpenSearch**。
:::

</div>

</Tab>

</Tabs>

### 图遍历

此图检索器从与查询最匹配的单个动物开始，然后遍历到共享相同 `habitat` 和/或 `origin` 的其他动物。

```python
from graph_retriever.strategies import Eager
from langchain_graph_retriever import GraphRetriever

traversal_retriever = GraphRetriever(
    store = vector_store,
    edges = [("habitat", "habitat"), ("origin", "origin")],
    strategy = Eager(k=5, start_k=1, max_depth=2),
)
```

以上代码创建了一个图遍历检索器，它从最近的动物开始 (`start_k=1`)，检索 5 个文档 (`k=5`)，并将搜索限制在距离第一个动物最多 2 步的文档内 (`max_depth=2`)。

`edges` 定义了如何将元数据值用于遍历。在本例中，每个动物都通过相同的 `habitat` 和/或 `origin` 连接到其他动物。

```python
results = traversal_retriever.invoke("what animals could be found near a capybara?")

for doc in results:
    print(f"{doc.id}: {doc.page_content}")
```

```text
capybara: capybaras are the largest rodents in the world and are highly social animals.
heron: herons are wading birds known for their long legs and necks, often seen near water.
crocodile: crocodiles are large reptiles with powerful jaws and a long lifespan, often living over 70 years.
frog: frogs are amphibians known for their jumping ability and croaking sounds.
duck: ducks are waterfowl birds known for their webbed feet and quacking sounds.
```

图遍历通过利用数据中的结构化关系来提高检索质量。与标准相似性搜索（见下文）不同，它为文档选择提供了清晰、可解释的理由。

在本例中，文档 `capybara`、`heron`、`frog`、`crocodile` 和 `newt` 都共享相同的 `habitat=wetlands`，这是由其元数据定义的。这应该会提高文档相关性以及 LLM 回答的质量。

### 与标准检索的比较

当 `max_depth=0` 时，图遍历检索器的行为类似于标准检索器：

```python
standard_retriever = GraphRetriever(
    store = vector_store,
    edges = [("habitat", "habitat"), ("origin", "origin")],
    strategy = Eager(k=5, start_k=5, max_depth=0),
)
```

这将创建一个检索器，从最近的 5 个动物开始 (`start_k=5`)，并在没有任何遍历的情况下返回它们 (`max_depth=0`)。在这种情况下，边的定义被忽略。

这基本上等同于：

```python
standard_retriever = vector_store.as_retriever(search_kwargs={"k":5})
```

对于这两种情况，调用检索器都会返回：

```python
results = standard_retriever.invoke("what animals could be found near a capybara?")

for doc in results:
    print(f"{doc.id}: {doc.page_content}")
```

```text
capybara: capybaras are the largest rodents in the world and are highly social animals.
iguana: iguanas are large herbivorous lizards often found basking in trees and near water.
guinea pig: guinea pigs are small rodents often kept as pets due to their gentle and social nature.
hippopotamus: hippopotamuses are large semi-aquatic mammals known for their massive size and territorial behavior.
boar: boars are wild relatives of pigs, known for their tough hides and tusks.
```

这些文档仅基于相似性连接。存储中存在的任何结构化数据都被忽略。与图检索相比，这可能会降低文档相关性，因为返回的结果对回答查询有帮助的可能性较低。

## 使用

按照上面的示例，使用 `invoke` 来启动对查询的检索。

---

## API 参考

要探索所有可用参数和高级配置，请参阅 [Graph RAG API 参考](https://datastax.github.io/graph-rag/reference/)。
