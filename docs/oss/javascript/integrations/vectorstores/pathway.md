---
title: 路径
---
> [Pathway](https://pathway.com/) 是一个开源的数据处理框架。它允许您轻松开发数据转换流水线和机器学习应用程序，这些程序能够处理实时数据源和变化的数据。

本笔记本演示了如何将实时的 `Pathway` 数据索引流水线与 `LangChain` 结合使用。您可以像查询常规向量存储一样，从您的链中查询此流水线的结果。然而，在底层，Pathway 会在每次数据变化时更新索引，从而确保您始终获得最新的答案。

在本笔记本中，我们将使用一个[公共演示文档处理流水线](https://pathway.com/solutions/ai-pipelines#try-it-out)，该流水线：

1.  监控多个云数据源的数据变化。
2.  为数据构建向量索引。

要拥有您自己的文档处理流水线，请查看[托管服务](https://pathway.com/solutions/ai-pipelines)或[自行构建](https://pathway.com/developers/user-guide/llm-xpack/vectorstore_pipeline/)。

我们将使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.vectorstores.VectorStore.html" target="_blank" rel="noreferrer" class="link"><code>VectorStore</code></a> 客户端连接到索引，该客户端实现了 `similarity_search` 函数以检索匹配的文档。

本文档中使用的基本流水线可以轻松构建存储在云位置文件的简单向量索引。然而，Pathway 提供了构建实时数据流水线和应用程序所需的一切，包括类似 SQL 的操作（例如不同数据源之间的分组归约和连接）、基于时间的数据分组和窗口化，以及广泛的连接器。

您需要安装 `langchain-community`，使用 `pip install -qU langchain-community` 来使用此集成。

## 查询数据流水线

要实例化和配置客户端，您需要提供文档索引流水线的 `url` 或 `host` 和 `port`。在下面的代码中，我们使用了一个公开可用的[演示流水线](https://pathway.com/solutions/ai-pipelines#try-it-out)，其 REST API 可通过 `https://demo-document-indexing.pathway.stream` 访问。此演示从 [Google Drive](https://drive.google.com/drive/u/0/folders/1cULDv2OaViJBmOfG5WB0oWcgayNrGtVs) 和 [Sharepoint](https://navalgo.sharepoint.com/sites/ConnectorSandbox/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FConnectorSandbox%2FShared%20Documents%2FIndexerSandbox&p=true&ga=1) 摄取文档，并维护一个用于检索文档的索引。

```python
from langchain_community.vectorstores import PathwayVectorClient

client = PathwayVectorClient(url="https://demo-document-indexing.pathway.stream")
```

然后我们可以开始进行查询

```python
query = "What is Pathway?"
docs = client.similarity_search(query)
```

```python
print(docs[0].page_content)
```

**轮到您了！** [获取您自己的流水线](https://pathway.com/solutions/ai-pipelines) 或向演示流水线[上传新文档](https://chat-realtime-sharepoint-gdrive.demo.pathway.com/)，然后重新尝试查询！

## 基于文件元数据进行过滤

我们支持使用 [jmespath](https://jmespath.org/) 表达式进行文档过滤，例如：

```python
# 仅考虑在 Unix 时间戳之后修改的源
docs = client.similarity_search(query, metadata_filter="modified_at >= `1702672093`")

# 仅考虑所有者为 `james` 的源
docs = client.similarity_search(query, metadata_filter="owner == `james`")

# 仅考虑路径包含 'repo_readme' 的源
docs = client.similarity_search(query, metadata_filter="contains(path, 'repo_readme')")

# 两个条件的与运算
docs = client.similarity_search(
    query, metadata_filter="owner == `james` && modified_at >= `1702672093`"
)

# 两个条件的或运算
docs = client.similarity_search(
    query, metadata_filter="owner == `james` || modified_at >= `1702672093`"
)
```

## 获取索引文件的信息

`PathwayVectorClient.get_vectorstore_statistics()` 提供向量存储状态的基本统计信息，例如索引文件的数量和最后更新文件的时间戳。您可以在您的链中使用它来告知用户您的知识库的新鲜度。

```python
client.get_vectorstore_statistics()
```

## 您自己的流水线

### 在生产环境中运行

要拥有您自己的 Pathway 数据索引流水线，请查看 Pathway 的[托管流水线](https://pathway.com/solutions/ai-pipelines)服务。您也可以运行自己的 Pathway 流水线 - 有关如何构建流水线的信息，请参阅 [Pathway 指南](https://pathway.com/developers/user-guide/llm-xpack/vectorstore_pipeline/)。

### 处理文档

向量化流水线支持可插拔的组件用于解析、拆分和嵌入文档。对于嵌入和拆分，您可以使用 [LangChain 组件](https://pathway.com/developers/user-guide/llm-xpack/vectorstore_pipeline/#langchain)，或查看 Pathway 中可用的[嵌入器](https://pathway.com/developers/api-docs/pathway-xpacks-llm/embedders)和[拆分器](https://pathway.com/developers/api-docs/pathway-xpacks-llm/splitters)。如果未提供解析器，则默认为 `UTF-8` 解析器。您可以在此处找到可用的解析器[列表](https://github.com/pathwaycom/pathway/blob/main/python/pathway/xpacks/llm/parser.py)。
