---
title: 支持向量机 (SVM)
---
>[支持向量机（SVM）](https://scikit-learn.org/stable/modules/svm.html#support-vector-machines) 是一组用于分类、回归和异常值检测的监督学习方法。

本笔记本将介绍如何使用一个底层基于 `scikit-learn` 包实现 `SVM` 的检索器。

主要基于 [github.com/karpathy/randomfun/blob/master/knn_vs_svm.html](https://github.com/karpathy/randomfun/blob/master/knn_vs_svm.html)

```python
pip install -qU  scikit-learn
```

```python
pip install -qU  lark
```

我们希望使用 `OpenAIEmbeddings`，因此需要获取 OpenAI API 密钥。

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

```text
OpenAI API Key: ········
```

```python
from langchain_community.retrievers import SVMRetriever
from langchain_openai import OpenAIEmbeddings
```

## 使用文本创建新的检索器

```python
retriever = SVMRetriever.from_texts(
    ["foo", "bar", "world", "hello", "foo bar"], OpenAIEmbeddings()
)
```

## 使用检索器

现在我们可以使用这个检索器了！

```python
result = retriever.invoke("foo")
```

```python
result
```

```python
[Document(page_content='foo', metadata={}),
 Document(page_content='foo bar', metadata={}),
 Document(page_content='hello', metadata={}),
 Document(page_content='world', metadata={})]
```

```python

```
