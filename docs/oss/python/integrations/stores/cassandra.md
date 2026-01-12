---
title: Cassandra字节存储（CassandraByteStore）
---
这将帮助您开始使用 Cassandra [键值存储](/oss/python/integrations/stores)。有关 `CassandraByteStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/storage/langchain_community.storage.cassandra.CassandraByteStore.html)。

## 概述

[Cassandra](https://cassandra.apache.org/) 是一个 NoSQL、面向行、高度可扩展且高可用的数据库。

### 集成详情

| 类 | 包 | 本地 | [JS 支持](https://js.langchain.com/docs/integrations/stores/cassandra_storage) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: |
| [CassandraByteStore](https://python.langchain.com/api_reference/community/storage/langchain_community.storage.cassandra.CassandraByteStore.html) | [langchain-community](https://python.langchain.com/api_reference/community/index.html) | ✅ | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain_community?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain_community?style=flat-square&label=%20) |

## 设置

`CassandraByteStore` 是 `ByteStore` 的一个实现，它将数据存储在您的 Cassandra 实例中。
存储键必须是字符串，并将映射到 Cassandra 表的 `row_id` 列。
存储的 `bytes` 值将映射到 Cassandra 表的 `body_blob` 列。

### 安装

LangChain 的 `CassandraByteStore` 集成位于 `langchain-community` 包中。您还需要根据您使用的初始化方法，安装 `cassio` 包或 `cassandra-driver` 包作为对等依赖项：

```python
pip install -qU langchain-community
pip install -qU cassandra-driver
pip install -qU cassio
```

您还需要创建一个 `cassandra.cluster.Session` 对象，具体方法请参考 [Cassandra 驱动文档](https://docs.datastax.com/en/developer/python-driver/latest/api/cassandra/cluster/#module-cassandra.cluster)。具体细节会有所不同（例如网络设置和身份验证），但可能类似于：

## 实例化

首先，您需要创建一个 `cassandra.cluster.Session` 对象，具体方法请参考 [Cassandra 驱动文档](https://docs.datastax.com/en/developer/python-driver/latest/api/cassandra/cluster/#module-cassandra.cluster)。具体细节会有所不同（例如网络设置和身份验证），但可能类似于：

```python
from cassandra.cluster import Cluster

cluster = Cluster()
session = cluster.connect()
```

然后您就可以创建您的存储了！您还需要提供 Cassandra 实例中现有键空间（keyspace）的名称：

```python
from langchain_community.storage import CassandraByteStore

kv_store = CassandraByteStore(
    table="my_store",
    session=session,
    keyspace="<YOUR KEYSPACE>",
)
```

## 用法

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

## 使用 `cassio` 初始化

也可以使用 cassio 来配置会话和键空间。

```python
import cassio

cassio.init(contact_points="127.0.0.1", keyspace="<YOUR KEYSPACE>")

store = CassandraByteStore(
    table="my_store",
)

store.mset([("k1", b"v1"), ("k2", b"v2")])
print(store.mget(["k1", "k2"]))
```

---

## API 参考

有关 `CassandraByteStore` 所有功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/community/storage/langchain_community.storage.cassandra.CassandraByteStore.html](https://python.langchain.com/api_reference/community/storage/langchain_community.storage.cassandra.CassandraByteStore.html)
