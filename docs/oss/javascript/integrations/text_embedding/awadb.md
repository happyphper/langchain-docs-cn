---
title: AwaDB
---
>[AwaDB](https://github.com/awa-ai/awadb) 是一个 AI 原生数据库，用于存储和检索 LLM 应用使用的嵌入向量。

本笔记本解释了如何在 LangChain 中使用 `AwaEmbeddings`。

```python
# pip install awadb
```

## 导入库

```python
from langchain_community.embeddings import AwaEmbeddings
```

```python
Embedding = AwaEmbeddings()
```

# 设置嵌入模型

用户可以使用 `Embedding.set_model()` 来指定嵌入模型。\
该函数的输入是一个字符串，代表模型名称。\
当前支持的模型列表可以在[这里](https://github.com/awa-ai/awadb)获取。\

**默认模型**是 `all-mpnet-base-v2`，不设置时即使用此模型。

```python
text = "our embedding test"

Embedding.set_model("all-mpnet-base-v2")
```

```python
res_query = Embedding.embed_query("The test information")
res_document = Embedding.embed_documents(["test1", "another test"])
```
