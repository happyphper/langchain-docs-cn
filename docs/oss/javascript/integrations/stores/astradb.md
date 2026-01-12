---
title: AstraDBByteStore
---
这将帮助您开始使用 Astra DB [键值存储](/oss/javascript/integrations/stores)。有关 `AstraDBByteStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/astradb/storage/langchain_astradb.storage.AstraDBByteStore.html)。

## 概述

> [DataStax Astra DB](https://docs.datastax.com/en/astra-db-serverless/index.html) 是一个基于 `Apache Cassandra®` 构建的无服务器 AI 就绪数据库，通过易于使用的 JSON API 方便地提供。

### 集成详情

| 类 | 包 | 本地支持 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: |
| [AstraDBByteStore](https://python.langchain.com/api_reference/astradb/storage/langchain_astradb.storage.AstraDBByteStore.html) | [langchain-astradb](https://python.langchain.com/api_reference/astradb/index.html) | ❌ | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain_astradb?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain_astradb?style=flat-square&label=%20) |

## 设置

要创建 `AstraDBByteStore` 字节存储，您需要 [创建一个 DataStax 账户](https://www.datastax.com/products/datastax-astra)。

### 凭证

注册后，请设置以下凭证：

```python
from getpass import getpass

ASTRA_DB_API_ENDPOINT = getpass("ASTRA_DB_API_ENDPOINT = ")
ASTRA_DB_APPLICATION_TOKEN = getpass("ASTRA_DB_APPLICATION_TOKEN = ")
```

### 安装

LangChain AstraDB 集成位于 `langchain-astradb` 包中：

```python
pip install -qU langchain-astradb
```

## 实例化

现在我们可以实例化我们的字节存储：

```python
from langchain_astradb import AstraDBByteStore

kv_store = AstraDBByteStore(
    api_endpoint=ASTRA_DB_API_ENDPOINT,
    token=ASTRA_DB_APPLICATION_TOKEN,
    collection_name="my_store",
)
```

## 使用

您可以使用 `mset` 方法在键下设置数据，如下所示：

```python
kv_store.mset(
    [
        ["key1", b"value1"],
        ["key2", b"value2"],
    ]
)

kv_store.mget(
    [
        "key1",
        "key2",
    ]
)
```

```text
[b'value1', b'value2']
```

您可以使用 `mdelete` 方法删除数据：

```python
kv_store.mdelete(
    [
        "key1",
        "key2",
    ]
)

kv_store.mget(
    [
        "key1",
        "key2",
    ]
)
```

```text
[None, None]
```

您可以在任何使用其他 ByteStore 的地方使用 `AstraDBByteStore`。

---

## API 参考

有关 `AstraDBByteStore` 所有功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/astradb/storage/langchain_astradb.storage.AstraDBByteStore.html](https://python.langchain.com/api_reference/astradb/storage/langchain_astradb.storage.AstraDBByteStore.html)
