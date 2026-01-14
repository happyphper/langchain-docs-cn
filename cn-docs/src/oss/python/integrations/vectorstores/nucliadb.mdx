---
title: NucliaDB
---
您可以使用本地 NucliaDB 实例或 [Nuclia Cloud](https://nuclia.cloud)。

使用本地实例时，您需要一个 Nuclia Understanding API 密钥，以便您的文本能够被正确地向量化和索引。您可以在 [https://nuclia.cloud](https://nuclia.cloud) 创建一个免费账户，然后[创建一个 NUA 密钥](https://docs.nuclia.dev/docs/docs/using/understanding/intro)来获取密钥。

```python
pip install -qU  langchain langchain-community nuclia
```

## 与 nuclia.cloud 一起使用

```python
from langchain_community.vectorstores.nucliadb import NucliaDB

API_KEY = "YOUR_API_KEY"

ndb = NucliaDB(knowledge_box="YOUR_KB_ID", local=False, api_key=API_KEY)
```

## 与本地实例一起使用

注意：默认情况下，`backend` 设置为 `http://localhost:8080`。

```python
from langchain_community.vectorstores.nucliadb import NucliaDB

ndb = NucliaDB(knowledge_box="YOUR_KB_ID", local=True, backend="http://my-local-server")
```

## 向您的知识库添加和删除文本

```python
ids = ndb.add_texts(["This is a new test", "This is a second test"])
```

```python
ndb.delete(ids=ids)
```

## 在您的知识库中搜索

```python
results = ndb.similarity_search("Who was inspired by Ada Lovelace?")
print(results[0].page_content)
```
