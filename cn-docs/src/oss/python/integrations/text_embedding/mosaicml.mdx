---
title: MosaicML
---
>[MosaicML](https://docs.mosaicml.com/en/latest/inference.html) 提供了一个托管的推理服务。您既可以使用各种开源模型，也可以部署自己的模型。

本示例将介绍如何使用 LangChain 与 `MosaicML` 推理服务进行交互，以实现文本嵌入。

```python
# 注册账户：https://forms.mosaicml.com/demo?utm_source=langchain

from getpass import getpass

MOSAICML_API_TOKEN = getpass()
```

```python
import os

os.environ["MOSAICML_API_TOKEN"] = MOSAICML_API_TOKEN
```

```python
from langchain_community.embeddings import MosaicMLInstructorEmbeddings
```

```python
embeddings = MosaicMLInstructorEmbeddings(
    query_instruction="Represent the query for retrieval: "
)
```

```python
query_text = "This is a test query."
query_result = embeddings.embed_query(query_text)
```

```python
document_text = "This is a test document."
document_result = embeddings.embed_documents([document_text])
```

```python
import numpy as np

query_numpy = np.array(query_result)
document_numpy = np.array(document_result[0])
similarity = np.dot(query_numpy, document_numpy) / (
    np.linalg.norm(query_numpy) * np.linalg.norm(document_numpy)
)
print(f"Cosine similarity between document and query: {similarity}")
```
