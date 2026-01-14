---
title: 金属
---
>[Metal](https://github.com/getmetal/metal-python) 是一个用于 ML 嵌入（Embeddings）的托管服务。

本笔记本展示了如何使用 [Metal](https://docs.getmetal.io/introduction) 的检索器（retriever）。

首先，您需要注册 Metal 并获取一个 API 密钥。您可以在此处完成注册：[here](https://docs.getmetal.io/misc-create-app)

```python
pip install -qU  metal_sdk
```

```python
from metal_sdk.metal import Metal

API_KEY = ""
CLIENT_ID = ""
INDEX_ID = ""

metal = Metal(API_KEY, CLIENT_ID, INDEX_ID)
```

## 摄取文档

如果您尚未设置索引，才需要执行此步骤。

```python
metal.index({"text": "foo1"})
metal.index({"text": "foo"})
```

```text
{'data': {'id': '642739aa7559b026b4430e42',
  'text': 'foo',
  'createdAt': '2023-03-31T19:51:06.748Z'}}
```

## 查询

现在我们的索引已设置好，我们可以设置一个检索器并开始查询。

```python
from langchain_community.retrievers import MetalRetriever
```

```python
retriever = MetalRetriever(metal, params={"limit": 2})
```

```python
retriever.invoke("foo1")
```

```python
[Document(page_content='foo1', metadata={'dist': '1.19209289551e-07', 'id': '642739a17559b026b4430e40', 'createdAt': '2023-03-31T19:50:57.853Z'}),
 Document(page_content='foo1', metadata={'dist': '4.05311584473e-06', 'id': '642738f67559b026b4430e3c', 'createdAt': '2023-03-31T19:48:06.769Z'})]
```

```python

```
