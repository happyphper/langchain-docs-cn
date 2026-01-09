---
title: NanoPQ（产品量化）
---
>[产品量化算法（k-NN）](https://towardsdatascience.com/similarity-search-product-quantization-b2a1a6397701) 简而言之是一种量化算法，有助于压缩数据库向量，从而在处理大型数据集时提升语义搜索的效率。其核心思想是将嵌入向量分割成 M 个子空间，然后对每个子空间进行聚类。聚类后，每个簇的质心向量会映射到该子空间各簇中的向量。

本笔记本将介绍如何使用一个底层基于产品量化算法的检索器，该算法由 [nanopq](https://github.com/matsui528/nanopq) 包实现。

```python
pip install -qU langchain-community langchain-openai nanopq
```

```python
from langchain_community.embeddings.spacy_embeddings import SpacyEmbeddings
from langchain_community.retrievers import NanoPQRetriever
```

## 使用文本创建新的检索器

```python
retriever = NanoPQRetriever.from_texts(
    ["Great world", "great words", "world", "planets of the world"],
    SpacyEmbeddings(model_name="en_core_web_sm"),
    clusters=2,
    subspace=2,
)
```

## 使用检索器

现在我们可以使用这个检索器了！

```python
retriever.invoke("earth")
```

```text
M: 2, Ks: 2, metric : <class 'numpy.uint8'>, code_dtype: l2
iter: 20, seed: 123
Training the subspace: 0 / 2
Training the subspace: 1 / 2
Encoding the subspace: 0 / 2
Encoding the subspace: 1 / 2
```

```python
[Document(page_content='world'),
 Document(page_content='Great world'),
 Document(page_content='great words'),
 Document(page_content='planets of the world')]
```

```python

```
