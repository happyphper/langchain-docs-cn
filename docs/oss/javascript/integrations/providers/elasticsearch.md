---
title: Elasticsearch
---
> [Elasticsearch](https://www.elastic.co/elasticsearch/) 是一个分布式的、RESTful 风格的搜索和分析引擎。
> 它提供了一个分布式的、支持多租户的全文搜索引擎，带有 HTTP Web 接口和无模式（schema-free）的 JSON 文档。

## 安装与设置

### 设置 Elasticsearch

有两种方式可以开始使用 Elasticsearch：

#### 在本地机器上安装 Elasticsearch

在本地进行开发和测试时，运行 Elasticsearch 最简单的方法是使用 [start-local](https://github.com/elastic/start-local) 脚本。该脚本使用 Docker 通过一行简单的命令来设置 Elasticsearch。

```bash
curl -fsSL https://elastic.co/start-local | sh
```

这会创建一个 `elastic-start-local` 文件夹。要启动 Elasticsearch：

```bash
cd elastic-start-local
./start.sh
```

Elasticsearch 将在 `http://localhost:9200` 地址可用。`elastic` 用户的密码和 API 密钥会自动生成并存储在 `elastic-start-local` 文件夹的 `.env` 文件中。

如果只需要 Elasticsearch 而不需要 Kibana，可以使用 `--esonly` 选项：

```bash
curl -fsSL https://elastic.co/start-local | sh -s -- --esonly
```

<Note>

start-local 设置仅用于本地测试，不应在生产环境中使用。关于生产环境安装，请参考官方的 [Elasticsearch 文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html)。

</Note>

#### 在 Elastic Cloud 上部署 Elasticsearch

`Elastic Cloud` 是一个托管的 Elasticsearch 服务。注册 [免费试用](https://cloud.elastic.co/registration?utm_source=langchain&utm_content=documentation)。

### 安装客户端

::: code-group

```bash [pip]
pip install elasticsearch
pip install langchain-elasticsearch
```

```bash [uv]
uv add elasticsearch
uv add langchain-elasticsearch
```

:::

## 嵌入模型

查看 [使用示例](/oss/integrations/text_embedding/elasticsearch)。

```python
from langchain_elasticsearch import ElasticsearchEmbeddings
```

## 向量存储

查看 [使用示例](/oss/integrations/vectorstores/elasticsearch)。

```python
from langchain_elasticsearch import ElasticsearchStore
```

### 第三方集成

#### EcloudESVectorStore

```python
from langchain_community.vectorstores.ecloud_vector_search import EcloudESVectorStore
```

## 检索器

### ElasticsearchRetriever

`ElasticsearchRetriever` 通过 Query DSL 提供了对所有 Elasticsearch 功能的灵活访问。

查看 [使用示例](/oss/integrations/retrievers/elasticsearch_retriever)。

```python
from langchain_elasticsearch import ElasticsearchRetriever
```

### BM25

查看 [使用示例](/oss/integrations/retrievers/elastic_search_bm25)。

```python
from langchain_community.retrievers import ElasticSearchBM25Retriever
```

## LLM 缓存

```python
from langchain_elasticsearch import ElasticsearchCache
```

## 字节存储

查看 [使用示例](/oss/integrations/stores/elasticsearch)。

```python
from langchain_elasticsearch import ElasticsearchEmbeddingsCache
```

## 链

这是一个用于与 Elasticsearch 数据库交互的链。

```python
from langchain_classic.chains.elasticsearch_database import ElasticsearchDatabaseChain
```
