---
title: 百度云 ElasticSearch 向量搜索
---
>[百度云向量检索服务](https://cloud.baidu.com/doc/BES/index.html?from=productToDoc) 是一款完全托管的企业级分布式搜索与分析服务，100% 兼容开源。百度云向量检索服务为结构化/非结构化数据提供低成本、高性能、高可靠的检索与分析平台级产品服务。作为向量数据库，它支持多种索引类型和相似度距离计算方法。

>`百度云 ElasticSearch` 提供了权限管理机制，允许您自由配置集群权限，从而进一步保障数据安全。

本笔记本展示了如何使用与 `百度云 ElasticSearch 向量存储` 相关的功能。
要运行此示例，您需要有一个已启动并运行的 [百度云 ElasticSearch](https://cloud.baidu.com/product/bes.html) 实例：

请阅读 [帮助文档](https://cloud.baidu.com/doc/BES/s/8llyn0hh4 ) 以快速熟悉并配置百度云 ElasticSearch 实例。

实例启动并运行后，请按照以下步骤分割文档、获取嵌入向量、连接到百度云 ElasticSearch 实例、索引文档并执行向量检索。

我们首先需要安装以下 Python 包。

```python
pip install -qU langchain-community elasticsearch == 7.11.0
```

首先，我们想使用 `QianfanEmbeddings`，因此需要获取千帆的 AK 和 SK。关于千帆的详细信息，请参考 [百度千帆大模型平台](https://cloud.baidu.com/product/wenxinworkshop)。

```python
import getpass
import os

if "QIANFAN_AK" not in os.environ:
    os.environ["QIANFAN_AK"] = getpass.getpass("Your Qianfan AK:")
if "QIANFAN_SK" not in os.environ:
    os.environ["QIANFAN_SK"] = getpass.getpass("Your Qianfan SK:")
```

其次，分割文档并获取嵌入向量。

```python
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter

loader = TextLoader("../../../state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

from langchain_community.embeddings import QianfanEmbeddingsEndpoint

embeddings = QianfanEmbeddingsEndpoint()
```

然后，创建一个可访问的百度 ElasticSearch 实例。

```python
# Create a bes instance and index docs.
from langchain_community.vectorstores import BESVectorStore

bes = BESVectorStore.from_documents(
    documents=docs,
    embedding=embeddings,
    bes_url="your bes cluster url",
    index_name="your vector index",
)
bes.client.indices.refresh(index="your vector index")
```

最后，查询并检索数据。

```python
query = "What did the president say about Ketanji Brown Jackson"
docs = bes.similarity_search(query)
print(docs[0].page_content)
```

如果在使用过程中遇到任何问题，请随时联系 [liuboyao@baidu.com](mailto:liuboyao@baidu.com) 或 [chenweixu01@baidu.com](mailto:chenweixu01@baidu.com)，我们将尽力为您提供支持。
