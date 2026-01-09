---
title: 阿里云 OpenSearch
---
>[阿里云开放搜索（Alibaba Cloud Opensearch）](https://www.alibabacloud.com/product/opensearch) 是开发智能搜索服务的一站式平台。`OpenSearch` 基于 `阿里巴巴` 开发的大规模分布式搜索引擎构建。`OpenSearch` 服务于阿里巴巴集团内超过 500 个业务场景以及数千家阿里云客户。`OpenSearch` 帮助开发不同搜索场景下的搜索服务，包括电子商务、O2O、多媒体、内容行业、社区论坛以及企业大数据查询。

>`OpenSearch` 帮助您开发高质量、免运维、高性能的智能搜索服务，为用户提供高搜索效率和准确性。

>`OpenSearch` 提供向量检索功能。在特定场景下，尤其是试题搜索和图片搜索场景，您可以结合多模态搜索功能使用向量检索，以提高搜索结果的准确性。

本文档展示了如何使用与 `阿里云 OpenSearch 向量检索版` 相关的功能。

## 环境设置

### 购买并配置实例

从 [阿里云](https://opensearch.console.aliyun.com) 购买 OpenSearch 向量检索版，并根据帮助 [文档](https://help.aliyun.com/document_detail/463198.html?spm=a2c4g.465092.0.0.2cd15002hdwavO) 配置实例。

要运行示例，您需要有一个已启动并运行的 [OpenSearch 向量检索版](https://opensearch.console.aliyun.com) 实例。

### 阿里云 OpenSearch 向量存储类

`AlibabaCloudOpenSearch` 类支持以下功能：

- `add_texts`
- `add_documents`
- `from_texts`
- `from_documents`
- `similarity_search`
- `asimilarity_search`
- `similarity_search_by_vector`
- `asimilarity_search_by_vector`
- `similarity_search_with_relevance_scores`
- `delete_doc_by_texts`

阅读 [帮助文档](https://www.alibabacloud.com/help/en/opensearch/latest/vector-search) 以快速熟悉并配置 OpenSearch 向量检索版实例。

如果您在使用过程中遇到任何问题，请随时联系 [xingshaomin.xsm@alibaba-inc.com](mailto:xingshaomin.xsm@alibaba-inc.com)，我们将尽力为您提供帮助和支持。

实例启动并运行后，请按照以下步骤分割文档、获取嵌入向量、连接到阿里云 OpenSearch 实例、索引文档并执行向量检索。

我们首先需要安装以下 Python 包。

```python
pip install -qU  langchain-community alibabacloud_ha3engine_vector
```

我们希望使用 `OpenAIEmbeddings`，因此需要获取 OpenAI API 密钥。

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

## 示例

```python
from langchain_community.vectorstores import (
    AlibabaCloudOpenSearch,
    AlibabaCloudOpenSearchSettings,
)
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
```

分割文档并获取嵌入向量。

```python
from langchain_community.document_loaders import TextLoader

loader = TextLoader("../../../state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()
```

创建 OpenSearch 设置。

```python
settings = AlibabaCloudOpenSearchSettings(
    endpoint="OpenSearch 实例的端点，您可以从阿里云 OpenSearch 控制台找到。",
    instance_id="OpenSearch 实例的标识，您可以从阿里云 OpenSearch 控制台找到。",
    protocol="SDK 与服务器之间的通信协议，默认为 http。",
    username="购买实例时指定的用户名。",
    password="购买实例时指定的密码。",
    namespace="实例数据将根据 namespace 字段进行分区。如果启用了 namespace，您需要在初始化时指定 namespace 字段名称。否则，查询可能无法正确执行。",
    tablename="实例配置期间指定的表名。",
    embedding_field_separator="写入向量字段数据时指定的分隔符，默认为逗号。",
    output_fields="调用 OpenSearch 时返回的字段列表，默认为字段映射 field 的值列表。",
    field_name_mapping={
        "id": "id",  # 索引文档的 id 字段名称映射。
        "document": "document",  # 索引文档的文本字段名称映射。
        "embedding": "embedding",  # 索引文档的嵌入向量字段名称映射。
        "name_of_the_metadata_specified_during_search": "opensearch_metadata_field_name,=",
        # 索引文档的元数据字段名称映射，可以指定多个。值字段包含映射名称和操作符，操作符将在执行元数据过滤查询时使用，
        # 当前支持的逻辑操作符有：> (大于), < (小于), = (等于), <= (小于等于), >= (大于等于), != (不等于)。
        # 参考此链接：https://help.aliyun.com/zh/open-search/vector-search-edition/filter-expression
    },
)

# 例如

# settings = AlibabaCloudOpenSearchSettings(
#     endpoint='ha-cn-5yd3fhdm102.public.ha.aliyuncs.com',
#     instance_id='ha-cn-5yd3fhdm102',
#     username='instance user name',
#     password='instance password',
#     table_name='test_table',
#     field_name_mapping={
#         "id": "id",
#         "document": "document",
#         "embedding": "embedding",
#         "string_field": "string_filed,=",
#         "int_field": "int_filed,=",
#         "float_field": "float_field,=",
#         "double_field": "double_field,="
#
#     },
# )
```

通过设置创建 OpenSearch 访问实例。

```python
# 创建 OpenSearch 实例并索引文档。
opensearch = AlibabaCloudOpenSearch.from_texts(
    texts=docs, embedding=embeddings, config=settings
)
```

或者

```python
# 创建 OpenSearch 实例。
opensearch = AlibabaCloudOpenSearch(embedding=embeddings, config=settings)
```

添加文本并构建索引。

```python
metadatas = [
    {"string_field": "value1", "int_field": 1, "float_field": 1.0, "double_field": 2.0},
    {"string_field": "value2", "int_field": 2, "float_field": 3.0, "double_field": 4.0},
    {"string_field": "value3", "int_field": 3, "float_field": 5.0, "double_field": 6.0},
]
# metadatas 的键必须与 settings 中的 field_name_mapping 匹配。
opensearch.add_texts(texts=docs, ids=[], metadatas=metadatas)
```

查询和检索数据。

```python
query = "What did the president say about Ketanji Brown Jackson"
docs = opensearch.similarity_search(query)
print(docs[0].page_content)
```

使用元数据进行查询和检索。

```python
query = "What did the president say about Ketanji Brown Jackson"
metadata = {
    "string_field": "value1",
    "int_field": 1,
    "float_field": 1.0,
    "double_field": 2.0,
}
docs = opensearch.similarity_search(query, filter=metadata)
print(docs[0].page_content)
```

如果您在使用过程中遇到任何问题，请随时联系 [xingshaomin.xsm@alibaba-inc.com](mailto:xingshaomin.xsm@alibaba-inc.com)，我们将尽力为您提供帮助和支持。
