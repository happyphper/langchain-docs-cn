---
title: InMemoryByteStore
---
本指南将帮助您开始使用内存中的[键值存储](/oss/python/integrations/stores)。有关 `InMemoryByteStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/core/stores/langchain_core.stores.InMemoryByteStore.html)。

## 概述

`InMemoryByteStore` 是 `ByteStore` 的一个非持久化实现，它将所有内容存储在一个 Python 字典中。它适用于演示以及不需要在 Python 进程生命周期之外进行持久化的场景。

### 集成详情

| 类 | 包 | 本地 | [JS 支持](https://js.langchain.com/docs/integrations/stores/in_memory/) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: |
| [InMemoryByteStore](https://python.langchain.com/api_reference/core/stores/langchain_core.stores.InMemoryByteStore.html) | [langchain-core](https://python.langchain.com/api_reference/core/index.html) | ✅ | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain_core?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain_core?style=flat-square&label=%20) |

### 安装

LangChain 的 `InMemoryByteStore` 集成位于 `langchain-core` 包中：

```python
pip install -qU langchain-core
```

## 实例化

现在您可以实例化您的字节存储：

```python
from langchain_core.stores import InMemoryByteStore

kv_store = InMemoryByteStore()
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

有关 `InMemoryByteStore` 所有功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/core/stores/langchain_core.stores.InMemoryByteStore.html](https://python.langchain.com/api_reference/core/stores/langchain_core.stores.InMemoryByteStore.html)
