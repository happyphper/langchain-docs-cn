---
title: Apache Doris
---
>[Apache Doris](https://doris.apache.org/) 是一个用于实时分析的现代化数据仓库。
它能够大规模地对实时数据进行极速分析。

>通常 `Apache Doris` 被归类为 OLAP 系统，并且在 [ClickBench — 分析型数据库管理系统基准测试](https://benchmark.clickhouse.com/) 中展现了卓越的性能。由于它拥有超快的向量化执行引擎，它也可以被用作一个快速的向量数据库。

你需要安装 `langchain-community`，使用 `pip install -qU langchain-community` 来使用此集成。

这里我们将展示如何使用 Apache Doris 向量存储。

## 设置

```python
pip install -qU  pymysql
```

在开始时设置 `update_vectordb = False`。如果没有文档更新，那么我们就不需要重建文档的嵌入向量。

```python
!pip install  sqlalchemy
!pip install langchain
```

```python
from langchain_classic.chains import RetrievalQA
from langchain_community.document_loaders import (
    DirectoryLoader,
    UnstructuredMarkdownLoader,
)
from langchain_community.vectorstores.apache_doris import (
    ApacheDoris,
    ApacheDorisSettings,
)
from langchain_openai import OpenAI, OpenAIEmbeddings
from langchain_text_splitters import TokenTextSplitter

update_vectordb = False
```

## 加载文档并将其分割成词元

加载 `docs` 目录下的所有 markdown 文件。

对于 Apache Doris 文档，你可以从 [github.com/apache/doris](https://github.com/apache/doris) 克隆仓库，其中包含 `docs` 目录。

```python
loader = DirectoryLoader(
    "./docs", glob="**/*.md", loader_cls=UnstructuredMarkdownLoader
)
documents = loader.load()
```

将文档分割成词元，并设置 `update_vectordb = True`，因为有了新的文档/词元。

```python
# 加载文本分割器并将文档分割成文本片段
text_splitter = TokenTextSplitter(chunk_size=400, chunk_overlap=50)
split_docs = text_splitter.split_documents(documents)

# 通知向量数据库更新文本嵌入向量
update_vectordb = True
```

split_docs[-20]

print("# docs  = %d, # splits = %d" % (len(documents), len(split_docs)))

## 创建向量数据库实例

### 使用 Apache Doris 作为向量数据库

```python
def gen_apache_doris(update_vectordb, embeddings, settings):
    if update_vectordb:
        docsearch = ApacheDoris.from_documents(split_docs, embeddings, config=settings)
    else:
        docsearch = ApacheDoris(embeddings, settings)
    return docsearch
```

## 将词元转换为嵌入向量并放入向量数据库

这里我们使用 Apache Doris 作为向量数据库，你可以通过 `ApacheDorisSettings` 来配置 Apache Doris 实例。

配置 Apache Doris 实例非常类似于配置 MySQL 实例。你需要指定：

1. 主机/端口
2. 用户名（默认：'root'）
3. 密码（默认：''）
4. 数据库（默认：'default'）
5. 表（默认：'langchain'）

```python
import os
from getpass import getpass

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass()
```

```python
update_vectordb = True

embeddings = OpenAIEmbeddings()

# 配置 Apache Doris 设置（主机/端口/用户/密码/数据库）
settings = ApacheDorisSettings()
settings.port = 9030
settings.host = "172.30.34.130"
settings.username = "root"
settings.password = ""
settings.database = "langchain"
docsearch = gen_apache_doris(update_vectordb, embeddings, settings)

print(docsearch)

update_vectordb = False
```

## 构建问答系统并向其提问

```python
llm = OpenAI()
qa = RetrievalQA.from_chain_type(
    llm=llm, chain_type="stuff", retriever=docsearch.as_retriever()
)
query = "what is apache doris"
resp = qa.run(query)
print(resp)
```
