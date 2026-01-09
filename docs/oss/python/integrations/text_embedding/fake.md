---
title: FakeEmbeddings
---
LangChain 还提供了一个模拟嵌入类。您可以使用它来测试您的流水线。

```python
from langchain_community.embeddings import FakeEmbeddings
```

```python
embeddings = FakeEmbeddings(size=1352)
```

```python
query_result = embeddings.embed_query("foo")
```

```python
doc_results = embeddings.embed_documents(["foo"])
```
