---
title: UpstashRedisByteStore
---
本文将帮助您开始使用 Upstash Redis [键值存储](/oss/integrations/stores)。如需了解 `UpstashRedisByteStore` 所有功能和配置的详细文档，请查阅 [API 参考](https://python.langchain.com/api_reference/community/storage/langchain_community.storage.upstash_redis.UpstashRedisByteStore.html)。

## 概述

`UpstashRedisStore` 是 `ByteStore` 的一个实现，它将所有数据存储在您 [Upstash](https://upstash.com/) 托管的 Redis 实例中。

如需使用基础的 `RedisStore`，请参阅 [本指南](/oss/integrations/stores/redis/)。

### 集成详情

| 类 | 包 | 本地 | [JS 支持](https://js.langchain.com/docs/integrations/stores/upstash_redis_storage) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: |
| [UpstashRedisByteStore](https://python.langchain.com/api_reference/community/storage/langchain_community.storage.upstash_redis.UpstashRedisByteStore.html) | [langchain-community](https://python.langchain.com/api_reference/community/index.html) | ❌ | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain_community?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain_community?style=flat-square&label=%20) |

## 设置

您首先需要 [注册一个 Upstash 账户](https://upstash.com/docs/redis/overall/getstarted)。接下来，您需要创建一个 Redis 数据库进行连接。

### 凭据

创建数据库后，获取您的数据库 URL（别忘了 `https://`！）和令牌：

```python
from getpass import getpass

URL = getpass("Enter your Upstash URL")
TOKEN = getpass("Enter your Upstash REST token")
```

### 安装

LangChain 的 Upstash 集成位于 `langchain-community` 包中。您还需要安装 `upstash-redis` 包作为对等依赖项：

```python
pip install -qU langchain-community upstash-redis
```

## 实例化

现在我们可以实例化我们的字节存储：

```python
from langchain_community.storage import UpstashRedisByteStore
from upstash_redis import Redis

redis_client = Redis(url=URL, token=TOKEN)
kv_store = UpstashRedisByteStore(client=redis_client, ttl=None, namespace="test-ns")
```

## 使用

您可以使用 `mset` 方法像这样在键下设置数据：

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

---

## API 参考

如需了解 `UpstashRedisByteStore` 所有功能和配置的详细文档，请查阅 API 参考：[python.langchain.com/api_reference/community/storage/langchain_community.storage.upstash_redis.UpstashRedisByteStore.html](https://python.langchain.com/api_reference/community/storage/langchain_community.storage.upstash_redis.UpstashRedisByteStore.html)
