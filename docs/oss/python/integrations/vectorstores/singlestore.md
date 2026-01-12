---
title: SingleStoreVectorStore
---
>[SingleStore](https://singlestore.com/) 是一款强大、高性能的分布式 SQL 数据库解决方案，专为在[云端](https://www.singlestore.com/cloud/)和本地环境中表现出色而设计。它拥有多功能特性集，提供无缝的部署选项，同时提供无与伦比的性能。

SingleStore 的一个突出特点是其对向量存储和操作的高级支持，这使其成为需要复杂 AI 功能（如文本相似性匹配）的应用程序的理想选择。借助内置的向量函数，如 [dot_product](https://docs.singlestore.com/managed-service/en/reference/sql-reference/vector-functions/dot_product.html) 和 [euclidean_distance](https://docs.singlestore.com/managed-service/en/reference/sql-reference/vector-functions/euclidean_distance.html)，SingleStore 使开发人员能够高效地实现复杂的算法。

对于希望在 SingleStore 中利用向量数据的开发人员，有一份全面的教程可供参考，指导他们深入了解[处理向量数据](https://docs.singlestore.com/managed-service/en/developer-resources/functional-extensions/working-with-vector-data.html)的细节。本教程深入探讨了 SingleStoreDB 中的向量存储，展示了其基于向量相似性进行搜索的能力。利用向量索引，可以以惊人的速度执行查询，从而实现快速检索相关数据。

此外，SingleStore 的向量存储与[基于 Lucene 的全文索引](https://docs.singlestore.com/cloud/developer-resources/functional-extensions/working-with-full-text-search/)无缝集成，实现了强大的文本相似性搜索。用户可以根据文档元数据对象的选定字段过滤搜索结果，从而提高查询精度。

SingleStore 的独特之处在于其能够以多种方式结合向量搜索和全文搜索，提供了灵活性和多功能性。无论是通过文本或向量相似性进行预过滤并选择最相关的数据，还是采用加权和方法计算最终的相似性分数，开发人员都有多种选择。

本质上，SingleStore 为管理和查询向量数据提供了一个全面的解决方案，为 AI 驱动的应用程序提供了无与伦比的性能和灵活性。

| 类 | 包 | JS 支持 |
| :--- | :--- |  :---: |
| SingleStoreVectorStore | langchain_singlestore | ✅ |

<Note>

<strong>对于 langchain-community 版本的 `SingleStoreDB`（已弃用），请参阅</strong>

[v0.2 文档](https://python.langchain.com/v0.2/docs/integrations/vectorstores/singlestoredb/)。

</Note>

## 设置

要访问 SingleStore 向量存储，您需要安装 `langchain-singlestore` 集成包。
pip install -qU "langchain-singlestore"

## 初始化

要初始化 `SingleStoreVectorStore`，您需要一个 <a href="https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings" target="_blank" rel="noreferrer" class="link"><code>Embeddings</code></a> 对象以及 SingleStore 数据库的连接参数。

### 必需参数

- **embedding** (`Embeddings`): 一个文本嵌入模型。

### 可选参数

- **distance_strategy** (`DistanceStrategy`): 计算向量距离的策略。默认为 `DOT_PRODUCT`。选项：
  - `DOT_PRODUCT`: 计算两个向量的标量积。
  - `EUCLIDEAN_DISTANCE`: 计算两个向量之间的欧几里得距离。

- **table_name** (`str`): 表名。默认为 `embeddings`。
- **content_field** (`str`): 存储内容的字段。默认为 `content`。
- **metadata_field** (`str`): 存储元数据的字段。默认为 `metadata`。
- **vector_field** (`str`): 存储向量的字段。默认为 `vector`。
- **id_field** (`str`): 存储 ID 的字段。默认为 `id`。

- **use_vector_index** (`bool`): 启用向量索引（需要 SingleStore 8.5+）。默认为 `False`。
- **vector_index_name** (`str`): 向量索引的名称。如果 `use_vector_index` 为 `False` 则忽略。
- **vector_index_options** (`dict`): 向量索引的选项。如果 `use_vector_index` 为 `False` 则忽略。
- **vector_size** (`int`): 向量的大小。如果 `use_vector_index` 为 `True` 则为必需。

- **use_full_text_search** (`bool`): 在内容上启用全文索引。默认为 `False`。

### 连接池参数

- **pool_size** (`int`): 池中活动连接的数量。默认为 `5`。
- **max_overflow** (`int`): 超出 `pool_size` 的最大连接数。默认为 `10`。
- **timeout** (`float`): 连接超时时间（秒）。默认为 `30`。

### 数据库连接参数

- **host** (`str`): 数据库的主机名、IP 或 URL。
- **user** (`str`): 数据库用户名。
- **password** (`str`): 数据库密码。
- **port** (`int`): 数据库端口。默认为 `3306`。
- **database** (`str`): 数据库名称。

### 附加选项

- **pure_python** (`bool`): 启用纯 Python 模式。
- **local_infile** (`bool`): 允许本地文件上传。
- **charset** (`str`): 字符串值的字符集。
- **ssl_key**, **ssl_cert**, **ssl_ca** (`str`): SSL 文件的路径。
- **ssl_disabled** (`bool`): 禁用 SSL。
- **ssl_verify_cert** (`bool`): 验证服务器的证书。
- **ssl_verify_identity** (`bool`): 验证服务器的身份。
- **autocommit** (`bool`): 启用自动提交。
- **results_type** (`str`): 查询结果的结构（例如 `tuples`, `dicts`）。

```python
import os

from langchain_singlestore.vectorstores import SingleStoreVectorStore

os.environ["SINGLESTOREDB_URL"] = "root:pass@localhost:3306/db"

vector_store = SingleStoreVectorStore(embeddings=embeddings)
```

## 管理向量存储

`SingleStoreVectorStore` 假设文档的 ID 是整数。以下是管理向量存储的示例。

### 向向量存储添加项目

您可以按如下方式向向量存储添加文档：

```python
pip install -qU langchain-core
```

```python
from langchain_core.documents import Document

docs = [
    Document(
        page_content="""在干旱的沙漠中，一场突如其来的暴雨带来了缓解，
            雨滴在干渴的土地上翩翩起舞，用甜美的泥土气息
            使景观焕然一新。""",
        metadata={"category": "rain"},
    ),
    Document(
        page_content="""在熙熙攘攘的城市景观中，雨无情地落下，
            在人行道上创造出淅淅沥沥的交响乐，而雨伞
            像灰色海洋中绽放的彩色花朵。""",
        metadata={"category": "rain"},
    ),
    Document(
        page_content="""在高山上，雨化作了细腻的
            薄雾，将山峰笼罩在神秘的面纱中，每一滴雨似乎都在
            向古老的岩石低语着秘密。""",
        metadata={"category": "rain"},
    ),
    Document(
        page_content="""雪为乡村覆盖了一层柔软、纯净的毯子，
            描绘出一幅宁静的画面，将世界笼罩在宁静的寂静中，
            精致的雪花像大自然自己的蕾丝一样
            落在树枝上。""",
        metadata={"category": "snow"},
    ),
    Document(
        page_content="""在城市景观中，雪降临了，将
            繁忙的街道变成了冬季仙境，孩子们的
            笑声在纷飞的雪球和节日灯光的闪烁中回荡。""",
        metadata={"category": "snow"},
    ),
    Document(
        page_content="""在崎岖的山峰上，雪以不屈不挠的
            强度落下，将景观塑造成一个原始的高山天堂，
            冰冻的晶体在月光下闪闪发光，对下方的荒野
            施下了迷人的咒语。""",
        metadata={"category": "snow"},
    ),
]

vector_store.add_documents(docs)
```

### 更新向量存储中的项目

要更新向量存储中的现有文档，请使用以下代码：

```python
updated_document = Document(
    page_content="qux", metadata={"source": "https://another-example.com"}
)

vector_store.update_documents(document_id="1", document=updated_document)
```

### 从向量存储中删除项目

要从向量存储中删除文档，请使用以下代码：

```python
vector_store.delete(ids=["3"])
```

## 查询向量存储

一旦您的向量存储创建完成并添加了相关文档，您很可能希望在运行链或代理时查询它。

### 直接查询

执行简单的相似性搜索可以按如下方式进行：

```python
results = vector_store.similarity_search(query="雪中的树木", k=1)
for doc in results:
    print(f"* {doc.page_content} [{doc.metadata}]")
```

如果您想执行相似性搜索并接收相应的分数，可以运行：

- TODO: 编辑然后运行代码单元以生成输出

```python
results = vector_store.similarity_search_with_score(query="雪中的树木", k=1)
for doc, score in results:
    print(f"* [SIM={score:3f}] {doc.page_content} [{doc.metadata}]")
```

### 元数据过滤

SingleStoreDB 通过允许用户基于元数据字段进行预过滤来增强和优化搜索结果，从而提升了搜索能力。此功能使开发人员和数据分析师能够微调查询，确保搜索结果精确地满足他们的要求。通过使用特定的元数据属性过滤搜索结果，用户可以缩小查询范围，仅关注相关的数据子集。

```python
query = "树木 树枝"
docs = vector_store.similarity_search(
    query, filter={"category": "snow"}
)  # 查找与查询对应且类别为 "snow" 的文档
print(docs[0].page_content)
```

### 向量索引

通过利用 [ANN 向量索引](https://docs.singlestore.com/cloud/reference/sql-reference/vector-functions/vector-indexing/)，使用 SingleStore DB 版本 8.5 或更高版本来提升搜索效率。通过在创建向量存储对象时设置 `use_vector_index=True`，您可以激活此功能。此外，如果您的向量维度与默认的 OpenAI 嵌入大小 1536 不同，请确保相应地指定 `vector_size` 参数。

### 搜索策略

SingleStoreDB 提供了多样化的搜索策略，每种策略都经过精心设计，以满足特定的用例和用户偏好。默认的 `VECTOR_ONLY` 策略使用向量操作（如 `dot_product` 或 `euclidean_distance`）直接计算向量之间的相似性分数，而 `TEXT_ONLY` 则采用基于 Lucene 的全文搜索，对于以文本为中心的应用程序尤其有利。对于寻求平衡方法的用户，`FILTER_BY_TEXT` 首先基于文本相似性优化结果，然后进行向量比较，而 `FILTER_BY_VECTOR` 则优先考虑向量相似性，在评估文本相似性以获得最佳匹配之前过滤结果。值得注意的是，`FILTER_BY_TEXT` 和 `FILTER_BY_VECTOR` 都需要全文索引才能运行。此外，`WEIGHTED_SUM` 作为一种复杂的策略出现，通过权衡向量和文本相似性来计算最终的相似性分数，尽管它专门使用 dot_product 距离计算，并且也需要全文索引。这些多功能的策略使用户能够根据其独特需求微调搜索，促进高效和精确的数据检索和分析。此外，SingleStoreDB 的混合方法，以 `FILTER_BY_TEXT`、`FILTER_BY_VECTOR` 和 `WEIGHTED_SUM` 策略为例，无缝地结合了基于向量和文本的搜索，以最大限度地提高效率和准确性，确保用户能够充分利用该平台的功能，适用于广泛的应用场景。

```python
from langchain_singlestore.vectorstores import DistanceStrategy

docsearch = SingleStoreVectorStore.from_documents(
    docs,
    embeddings,
    distance_strategy=DistanceStrategy.DOT_PRODUCT,  # 使用点积进行相似性搜索
    use_vector_index=True,  # 使用向量索引以加快搜索速度
    use_full_text_search=True,  # 使用全文索引
)

vectorResults = docsearch.similarity_search(
    "干旱沙漠中的暴雨，雨",
    k=1,
    search_strategy=SingleStoreVectorStore.SearchStrategy.VECTOR_ONLY,
    filter={"category": "rain"},
)
print(vectorResults[0].page_content)

textResults = docsearch.similarity_search(
    "干旱沙漠中的暴雨，雨",
    k=1,
    search_strategy=SingleStoreVectorStore.SearchStrategy.TEXT_ONLY,
)
print(textResults[0].page_content)

filteredByTextResults = docsearch.similarity_search(
    "干旱沙漠中的暴雨，雨",
    k=1,
    search_strategy=SingleStoreVectorStore.SearchStrategy.FILTER_BY_TEXT,
    filter_threshold=0.1,
)
print(filteredByTextResults[0].page_content)

filteredByVectorResults = docsearch.similarity_search(
    "干旱沙漠中的暴雨，雨",
    k=1,
    search_strategy=SingleStoreVectorStore.SearchStrategy.FILTER_BY_VECTOR,
    filter_threshold=0.1,
)
print(filteredByVectorResults[0].page_content)

weightedSumResults = docsearch.similarity_search(
    "干旱沙漠中的暴雨，雨",
    k=1,
    search_strategy=SingleStoreVectorStore.SearchStrategy.WEIGHTED_SUM,
    text_weight=0.2,
    vector_weight=0.8,
)
print(weightedSumResults[0].page_content)
```

### 通过转换为检索器进行查询

您还可以将向量存储转换为检索器，以便在链中更轻松地使用。

```python
retriever = vector_store.as_retriever(search_kwargs={"k": 1})
retriever.invoke("雪中的树木")
```

## 多模态示例：利用 CLIP 和 OpenClip 嵌入

在多模态数据分析领域，整合图像和文本等多样化信息类型变得越来越重要。[CLIP](https://openai.com/research/clip) 是一个促进这种整合的强大工具，它是一个能够将图像和文本嵌入到共享语义空间中的尖端模型。通过这样做，CLIP 使得能够通过相似性搜索跨不同模态检索相关内容。

为了说明，让我们考虑一个应用场景，我们的目标是有效地分析多模态数据。在这个例子中，我们利用了 [OpenClip 多模态嵌入](/oss/python/integrations/text_embedding/open_clip) 的能力，它利用了 CLIP 的框架。借助 OpenClip，我们可以无缝地嵌入文本描述以及相应的图像，从而实现全面的分析和检索任务。无论是基于文本查询识别视觉上相似的图像，还是查找与特定视觉内容相关的文本段落，OpenClip 都使用户能够以卓越的效率和准确性探索和提取多模态数据的洞察。

```python
pip install -U langchain openai lanchain-singlestore langchain-experimental
```

```python
import os

from langchain_experimental.open_clip import OpenCLIPEmbeddings
from langchain_singlestore.vectorstores import SingleStoreVectorStore

os.environ["SINGLESTOREDB_URL"] = "root:pass@localhost:3306/db"

TEST_IMAGES_DIR = "../../modules/images"

docsearch = SingleStoreVectorStore(OpenCLIPEmbeddings())

image_uris = sorted(
    [
        os.path.join(TEST_IMAGES_DIR, image_name)
        for image_name in os.listdir(TEST_IMAGES_DIR)
        if image_name.endswith(".jpg")
    ]
)

# 添加图像
docsearch.add_images(uris=image_uris)
```

## 用于检索增强生成的用法

有关如何使用此向量存储进行检索增强生成 (RAG) 的指南，请参阅以下部分：

- [使用 LangChain 构建 RAG 应用](/oss/python/langchain/rag)
- [代理式 RAG](/oss/python/langgraph/agentic-rag)
- [检索文档](/oss/python/langchain/retrieval)

---

## API 参考

有关 SingleStore 文档加载器所有功能和配置的详细文档，请访问 GitHub 页面：[https://github.com/singlestore-labs/langchain-singlestore/](https://github.com/singlestore-labs/langchain-singlestore/)
