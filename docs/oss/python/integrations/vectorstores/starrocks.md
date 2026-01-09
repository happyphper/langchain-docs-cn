---
title: StarRocks
---
>[StarRocks](https://www.starrocks.io/) 是一款高性能分析型数据库。
`StarRocks` 是面向全场景分析的下一代亚秒级 MPP 数据库，支持多维分析、实时分析和即席查询。

>通常 `StarRocks` 被归类为 OLAP 数据库，它在 [ClickBench — 分析型数据库管理系统基准测试](https://benchmark.clickhouse.com/) 中展现了卓越的性能。由于其拥有超快的向量化执行引擎，它也可以被用作一个快速的向量数据库。

这里我们将展示如何使用 StarRocks 向量存储。

## 环境设置

```python
pip install -qU  pymysql langchain-community
```

在开始时设置 `update_vectordb = False`。如果没有文档更新，我们就不需要重建文档的嵌入向量。

```python
from langchain_classic.chains import RetrievalQA
from langchain_community.document_loaders import (
    DirectoryLoader,
    UnstructuredMarkdownLoader,
)
from langchain_community.vectorstores import StarRocks
from langchain_community.vectorstores.starrocks import StarRocksSettings
from langchain_openai import OpenAI, OpenAIEmbeddings
from langchain_text_splitters import TokenTextSplitter

update_vectordb = False
```

```text
/Users/dirlt/utils/py3env/lib/python3.9/site-packages/requests/__init__.py:102: RequestsDependencyWarning: urllib3 (1.26.7) or chardet (5.1.0)/charset_normalizer (2.0.9) doesn't match a supported version!
  warnings.warn("urllib3 ({}) or chardet ({})/charset_normalizer ({}) doesn't match a supported version!"
```

## 加载文档并将其分割成词元

加载 `docs` 目录下的所有 markdown 文件。

对于 StarRocks 文档，你可以从 [github.com/StarRocks/starrocks](https://github.com/StarRocks/starrocks) 克隆仓库，其中包含 `docs` 目录。

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

```python
split_docs[-20]
```

```python
Document(page_content='Compile StarRocks with Docker\n\nThis topic describes how to compile StarRocks using Docker.\n\nOverview\n\nStarRocks provides development environment images for both Ubuntu 22.04 and CentOS 7.9. With the image, you can launch a Docker container and compile StarRocks in the container.\n\nStarRocks version and DEV ENV image\n\nDifferent branches of StarRocks correspond to different development environment images provided on StarRocks Docker Hub.\n\nFor Ubuntu 22.04:\n\n| Branch name | Image name              |\n  | --------------- | ----------------------------------- |\n  | main            | starrocks/dev-env-ubuntu:latest     |\n  | branch-3.0      | starrocks/dev-env-ubuntu:3.0-latest |\n  | branch-2.5      | starrocks/dev-env-ubuntu:2.5-latest |\n\nFor CentOS 7.9:\n\n| Branch name | Image name                       |\n  | --------------- | ------------------------------------ |\n  | main            | starrocks/dev-env-centos7:latest     |\n  | branch-3.0      | starrocks/dev-env-centos7:3.0-latest |\n  | branch-2.5      | starrocks/dev-env-centos7:2.5-latest |\n\nPrerequisites\n\nBefore compiling StarRocks, make sure the following requirements are satisfied:\n\nHardware\n\n', metadata={'source': 'docs/developers/build-starrocks/Build_in_docker.md'})
```

```python
print("# docs  = %d, # splits = %d" % (len(documents), len(split_docs)))
```

```text
# docs  = 657, # splits = 2802
```

## 创建向量数据库实例

### 使用 StarRocks 作为向量数据库

```python
def gen_starrocks(update_vectordb, embeddings, settings):
    if update_vectordb:
        docsearch = StarRocks.from_documents(split_docs, embeddings, config=settings)
    else:
        docsearch = StarRocks(embeddings, settings)
    return docsearch
```

## 将词元转换为嵌入向量并存入向量数据库

这里我们使用 StarRocks 作为向量数据库，你可以通过 `StarRocksSettings` 来配置 StarRocks 实例。

配置 StarRocks 实例与配置 MySQL 实例非常相似。你需要指定：

1. 主机/端口
2. 用户名（默认：'root'）
3. 密码（默认：''）
4. 数据库（默认：'default'）
5. 表（默认：'langchain'）

```python
embeddings = OpenAIEmbeddings()

# 配置 starrocks 设置（主机/端口/用户/密码/数据库）
settings = StarRocksSettings()
settings.port = 41003
settings.host = "127.0.0.1"
settings.username = "root"
settings.password = ""
settings.database = "zya"
docsearch = gen_starrocks(update_vectordb, embeddings, settings)

print(docsearch)

update_vectordb = False
```

```text
Inserting data...: 100%|████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 2802/2802 [02:26<00:00, 19.11it/s]
```

```text
zya.langchain @ 127.0.0.1:41003

username: root

Table Schema:
----------------------------------------------------------------------------
|name                    |type                    |key                     |
----------------------------------------------------------------------------
|id                      |varchar(65533)          |true                    |
|document                |varchar(65533)          |false                   |
|embedding               |array<float>            |false                   |
|metadata                |varchar(65533)          |false                   |
----------------------------------------------------------------------------
```

## 构建问答系统并向其提问

```python
llm = OpenAI()
qa = RetrievalQA.from_chain_type(
        llm=llm, chain_type="stuff", retriever=docsearch.as_retriever()
)
query = "is profile enabled by default? if not, how to enable profile?"
resp = qa.run(query)
print(resp)
```

```text
No, profile is not enabled by default. To enable profile, set the variable `enable_profile` to `true` using the command `set enable_profile = true;`
```
