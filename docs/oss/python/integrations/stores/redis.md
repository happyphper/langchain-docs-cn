---
title: RedisStore
---
这将帮助您开始使用 Redis [键值存储](/oss/integrations/stores)。有关 `RedisStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/storage/langchain_community.storage.redis.RedisStore.html)。

## 概述

`RedisStore` 是 `ByteStore` 的一个实现，它将所有内容存储在您的 Redis 实例中。

### 集成详情

| 类 | 包 | 本地 | [JS 支持](https://js.langchain.com/docs/integrations/stores/ioredis_storage) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: |
| [RedisStore](https://python.langchain.com/api_reference/community/storage/langchain_community.storage.redis.RedisStore.html) | [langchain-community](https://python.langchain.com/api_reference/community/index.html) | ✅ | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain_community?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain_community?style=flat-square&label=%20) |

## 设置

要创建一个 Redis 字节存储，您需要设置一个 Redis 实例。您可以在本地或通过提供商进行设置 - 有关选项的概述，请参阅我们的 [Redis 指南](/oss/integrations/providers/redis)。

### 安装

LangChain 的 `RedisStore` 集成位于 `langchain-community` 包中：

```python
pip install -qU langchain-community redis
```

## 实例化

现在我们可以实例化我们的字节存储：

```python
from langchain_community.storage import RedisStore

kv_store = RedisStore(redis_url="redis://localhost:6379")
```

## 用法

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

有关 `RedisStore` 所有功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/community/storage/langchain_community.storage.redis.RedisStore.html](https://python.langchain.com/api_reference/community/storage/langchain_community.storage.redis.RedisStore.html)
