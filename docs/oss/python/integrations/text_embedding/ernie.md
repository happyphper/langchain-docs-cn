---
title: 文心一言
---
[ERNIE Embedding-V1](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/alj562vvu) 是一个基于 `百度文心` 大模型技术的文本表示模型，它将文本转换为由数值表示的向量形式，用于文本检索、信息推荐、知识挖掘等场景。

**弃用警告**

我们建议使用 `langchain_community.embeddings.ErnieEmbeddings` 的用户改用 `langchain_community.embeddings.QianfanEmbeddingsEndpoint`。

`QianfanEmbeddingsEndpoint` 的文档在[这里](/oss/python/integrations/text_embedding/baidu_qianfan_endpoint/)。

我们推荐用户使用 `QianfanEmbeddingsEndpoint` 主要有两个原因：

1.  `QianfanEmbeddingsEndpoint` 支持千帆平台中更多的嵌入模型。
2.  `ErnieEmbeddings` 缺乏维护且已被弃用。

一些迁移建议：

```python
from langchain_community.embeddings import QianfanEmbeddingsEndpoint

embeddings = QianfanEmbeddingsEndpoint(
    qianfan_ak="your qianfan ak",
    qianfan_sk="your qianfan sk",
)
```

## 使用方法

```python
from langchain_community.embeddings import ErnieEmbeddings
```

```python
embeddings = ErnieEmbeddings()
```

```python
query_result = embeddings.embed_query("foo")
```

```python
doc_results = embeddings.embed_documents(["foo"])
```
