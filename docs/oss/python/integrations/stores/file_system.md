---
title: LocalFileStore
---
这将帮助您开始使用本地文件系统 [键值存储](/oss/python/integrations/stores)。有关 `LocalFileStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/langchain/storage/langchain.storage.file_system.LocalFileStore.html)。

## 概述

`LocalFileStore` 是 `ByteStore` 的一个持久化实现，它将所有内容存储在您选择的文件夹中。如果您使用单台机器并且能够容忍文件的添加或删除，这将非常有用。

### 集成详情

| 类 | 包 | 本地 | [JS 支持](https://js.langchain.com/docs/integrations/stores/file_system) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: |
| [LocalFileStore](https://python.langchain.com/api_reference/langchain/storage/langchain.storage.file_system.LocalFileStore.html) | [langchain](https://python.langchain.com/api_reference/langchain/index.html) | ✅ | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain?style=flat-square&label=%20) |

### 安装

LangChain 的 `LocalFileStore` 集成位于 `langchain` 包中：

```python
pip install -qU langchain-classic
```

## 实例化

现在我们可以实例化我们的字节存储：

```python
from pathlib import Path

from langchain_classic.storage import LocalFileStore

root_path = Path.cwd() / "data"  # 也可以是由字符串设置的路径

kv_store = LocalFileStore(root_path)
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

您可以在 `data` 文件夹中看到创建的文件：

```python
!ls {root_path}
```

```text
key1 key2
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

有关 `LocalFileStore` 所有功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/langchain/storage/langchain.storage.file_system.LocalFileStore.html](https://python.langchain.com/api_reference/langchain/storage/langchain.storage.file_system.LocalFileStore.html)
