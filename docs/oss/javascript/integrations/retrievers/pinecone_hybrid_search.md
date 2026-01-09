---
title: Pinecone 混合搜索
---
>[Pinecone](https://docs.pinecone.io/docs/overview) 是一个功能广泛的向量数据库。

本笔记本将介绍如何使用一个底层基于 Pinecone 和混合搜索（Hybrid Search）的检索器。

该检索器的逻辑取自[此文档](https://docs.pinecone.io/docs/hybrid-search)。

要使用 Pinecone，您必须拥有 API 密钥和环境。
以下是[安装说明](https://docs.pinecone.io/docs/quickstart)。

```python
pip install -qU  pinecone pinecone-text pinecone-notebooks
```

```python
# 连接到 Pinecone 并获取 API 密钥。
from pinecone_notebooks.colab import Authenticate

Authenticate()

import os

api_key = os.environ["PINECONE_API_KEY"]
```

```python
from langchain_community.retrievers import (
    PineconeHybridSearchRetriever,
)
```

我们希望使用 `OpenAIEmbeddings`，因此需要获取 OpenAI API 密钥。

```python
import getpass

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

## 设置 Pinecone

您只需要执行此部分一次。

```python
import os

from pinecone import Pinecone, ServerlessSpec

index_name = "langchain-pinecone-hybrid-search"

# 初始化 Pinecone 客户端
pc = Pinecone(api_key=api_key)

# 创建索引
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=1536,  # 稠密模型的维度
        metric="dotproduct",  # 稀疏值仅支持 dotproduct
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )
```

```text
WhoAmIResponse(username='load', user_label='label', projectname='load-test')
```

现在索引已创建，我们可以使用它了。

```python
index = pc.Index(index_name)
```

## 获取嵌入模型和稀疏编码器

嵌入模型用于稠密向量，分词器用于稀疏向量。

```python
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()
```

要将文本编码为稀疏值，您可以选择 SPLADE 或 BM25。对于领域外任务，我们建议使用 BM25。

有关稀疏编码器的更多信息，您可以查看 pinecone-text 库的[文档](https://pinecone-io.github.io/pinecone-text/pinecone_text.html)。

```python
from pinecone_text.sparse import BM25Encoder

# 或者，如果您想使用 SPLADE，可以使用 from pinecone_text.sparse import SpladeEncoder

# 使用默认的 tf-idf 值
bm25_encoder = BM25Encoder().default()
```

上面的代码使用了默认的 tf-idf 值。强烈建议根据您自己的语料库来拟合 tf-idf 值。您可以按如下方式操作：

```python
corpus = ["foo", "bar", "world", "hello"]

# 在您的语料库上拟合 tf-idf 值
bm25_encoder.fit(corpus)

# 将值存储到 json 文件
bm25_encoder.dump("bm25_values.json")

# 加载到您的 BM25Encoder 对象
bm25_encoder = BM25Encoder().load("bm25_values.json")
```

## 加载检索器

我们现在可以构建检索器了！

```python
retriever = PineconeHybridSearchRetriever(
    embeddings=embeddings, sparse_encoder=bm25_encoder, index=index
)
```

## 添加文本（如果需要）

我们可以选择性地向检索器添加文本（如果它们尚未在其中）。

```python
retriever.add_texts(["foo", "bar", "world", "hello"])
```

```text
100%|██████████| 1/1 [00:02<00:00,  2.27s/it]
```

## 使用检索器

我们现在可以使用检索器了！

```python
result = retriever.invoke("foo")
```

```python
result[0]
```

```python
Document(page_content='foo', metadata={})
```
