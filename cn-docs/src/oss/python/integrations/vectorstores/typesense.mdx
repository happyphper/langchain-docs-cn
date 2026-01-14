---
title: Typesense
---
> [Typesense](https://typesense.org) 是一个开源的内存搜索引擎，你可以选择[自行托管](https://typesense.org/docs/guide/install-typesense#option-2-local-machine-self-hosting)或在 [Typesense Cloud](https://cloud.typesense.org/) 上运行。
>
> Typesense 专注于性能，它将整个索引存储在 RAM 中（并在磁盘上备份），同时也专注于提供开箱即用的开发者体验，通过简化可用选项并设置良好的默认值来实现。
>
> 它还允许你将基于属性的过滤与向量查询结合起来，以获取最相关的文档。

本笔记本将向你展示如何使用 Typesense 作为你的向量存储（VectorStore）。

首先，让我们安装所需的依赖项：

```python
pip install -qU  typesense openapi-schema-pydantic langchain-openai langchain-community tiktoken
```

我们想要使用 `OpenAIEmbeddings`，因此需要获取 OpenAI API 密钥。

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Typesense
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
```

让我们导入测试数据集：

```python
loader = TextLoader("../../how_to/state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()
```

```python
docsearch = Typesense.from_documents(
    docs,
    embeddings,
    typesense_client_params={
        "host": "localhost",  # 对于 Typesense Cloud，请使用 xxx.a1.typesense.net
        "port": "8108",  # 对于 Typesense Cloud，请使用 443
        "protocol": "http",  # 对于 Typesense Cloud，请使用 https
        "typesense_api_key": "xyz",
        "typesense_collection_name": "lang-chain",
    },
)
```

## 相似性搜索

```python
query = "What did the president say about Ketanji Brown Jackson"
found_docs = docsearch.similarity_search(query)
```

```python
print(found_docs[0].page_content)
```

## Typesense 作为检索器

与其他所有向量存储一样，Typesense 也是一个 LangChain 检索器（Retriever），它使用余弦相似度进行检索。

```python
retriever = docsearch.as_retriever()
retriever
```

```python
query = "What did the president say about Ketanji Brown Jackson"
retriever.invoke(query)[0]
```
