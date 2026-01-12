---
title: MyScale
---
>[MyScale](https://docs.myscale.com/en/overview/) 是一个为 AI 应用和解决方案优化的云数据库，基于开源的 [ClickHouse](https://github.com/ClickHouse/ClickHouse) 构建。

本笔记本展示了如何使用与 `MyScale` 向量数据库相关的功能。

## 设置环境

```python
pip install -qU  clickhouse-connect langchain-community
```

我们想使用 <a href="https://reference.langchain.com/python/integrations/langchain_openai/OpenAIEmbeddings" target="_blank" rel="noreferrer" class="link"><code>OpenAIEmbeddings</code></a>，所以必须获取 OpenAI API 密钥。

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
if "OPENAI_API_BASE" not in os.environ:
    os.environ["OPENAI_API_BASE"] = getpass.getpass("OpenAI Base:")
if "MYSCALE_HOST" not in os.environ:
    os.environ["MYSCALE_HOST"] = getpass.getpass("MyScale Host:")
if "MYSCALE_PORT" not in os.environ:
    os.environ["MYSCALE_PORT"] = getpass.getpass("MyScale Port:")
if "MYSCALE_USERNAME" not in os.environ:
    os.environ["MYSCALE_USERNAME"] = getpass.getpass("MyScale Username:")
if "MYSCALE_PASSWORD" not in os.environ:
    os.environ["MYSCALE_PASSWORD"] = getpass.getpass("MyScale Password:")
```

有两种方法可以为 MyScale 索引设置参数。

1.  环境变量

在运行应用之前，请使用 `export` 设置环境变量：
`export MYSCALE_HOST='<your-endpoints-url>' MYSCALE_PORT=<your-endpoints-port> MYSCALE_USERNAME=<your-username> MYSCALE_PASSWORD=<your-password> ...`

您可以在我们的 SaaS 平台上轻松找到您的账户、密码和其他信息。详情请参阅 [此文档](https://docs.myscale.com/en/cluster-management/)

`MyScaleSettings` 下的每个属性都可以使用前缀 `MYSCALE_` 来设置，并且不区分大小写。

2.  使用参数创建 `MyScaleSettings` 对象

```python
from langchain_community.vectorstores import MyScale, MyScaleSettings
config = MyScaleSetting(host="<your-backend-url>", port=8443, ...)
index = MyScale(embedding_function, config)
index.add_documents(...)
```

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import MyScale
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
```

```python
from langchain_community.document_loaders import TextLoader

loader = TextLoader("../../how_to/state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()
```

```python
for d in docs:
    d.metadata = {"some": "metadata"}
docsearch = MyScale.from_documents(docs, embeddings)

query = "What did the president say about Ketanji Brown Jackson"
docs = docsearch.similarity_search(query)
```

```text
Inserting data...: 100%|██████████| 42/42 [00:15<00:00,  2.66it/s]
```

```python
print(docs[0].page_content)
```

```text
Tonight. I call on the Senate to: Pass the Freedom to Vote Act. Pass the John Lewis Voting Rights Act. And while you’re at it, pass the Disclose Act so Americans can know who is funding our elections.

Tonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service.

One of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.

And I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.
```

## 获取连接信息和数据模式

```python
print(str(docsearch))
```

## 过滤

您可以直接访问 MyScale 的 SQL where 语句。您可以按照标准 SQL 编写 `WHERE` 子句。

**注意**：请注意 SQL 注入风险，此接口不得由最终用户直接调用。

如果您在设置中自定义了 `column_map`，可以像这样使用过滤器进行搜索：

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import MyScale

loader = TextLoader("../../how_to/state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()

for i, d in enumerate(docs):
    d.metadata = {"doc_id": i}

docsearch = MyScale.from_documents(docs, embeddings)
```

```text
Inserting data...: 100%|██████████| 42/42 [00:15<00:00,  2.68it/s]
```

### 带分数的相似性搜索

返回的距离分数是余弦距离。因此，分数越低越好。

```python
meta = docsearch.metadata_column
output = docsearch.similarity_search_with_relevance_scores(
    "What did the president say about Ketanji Brown Jackson?",
    k=4,
    where_str=f"{meta}.doc_id<10",
)
for d, dist in output:
    print(dist, d.metadata, d.page_content[:20] + "...")
```

```text
0.229655921459198 {'doc_id': 0} Madam Speaker, Madam...
0.24506962299346924 {'doc_id': 8} And so many families...
0.24786919355392456 {'doc_id': 1} Groups of citizens b...
0.24875116348266602 {'doc_id': 6} And I’m taking robus...
```

## 删除数据

您可以使用 `.drop()` 方法删除整个表，或者使用 `.delete()` 方法部分删除数据。

```python
# 直接使用 `where_str` 进行删除
docsearch.delete(where_str=f"{docsearch.metadata_column}.doc_id < 5")
meta = docsearch.metadata_column
output = docsearch.similarity_search_with_relevance_scores(
    "What did the president say about Ketanji Brown Jackson?",
    k=4,
    where_str=f"{meta}.doc_id<10",
)
for d, dist in output:
    print(dist, d.metadata, d.page_content[:20] + "...")
```

```text
0.24506962299346924 {'doc_id': 8} And so many families...
0.24875116348266602 {'doc_id': 6} And I’m taking robus...
0.26027143001556396 {'doc_id': 7} We see the unity amo...
0.26390212774276733 {'doc_id': 9} And unlike the $2 Tr...
```

```python
docsearch.drop()
```

```python

```
