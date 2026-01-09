---
title: 腾讯云对象存储（COS）目录
---
>[腾讯云对象存储（COS）](https://www.tencentcloud.com/products/cos) 是一种分布式存储服务，允许您通过 HTTP/HTTPS 协议从任何地方存储任意数量的数据。
> `COS` 对数据结构或格式没有限制。它也没有存储桶大小限制和分区管理，使其几乎适用于任何用例，例如数据分发、数据处理和数据湖。`COS` 提供基于 Web 的控制台、多语言 SDK 和 API、命令行工具以及图形化工具。它与 Amazon S3 API 兼容良好，允许您快速访问社区工具和插件。

本文档介绍如何从 `Tencent COS Directory` 加载文档对象。

```python
pip install -qU  cos-python-sdk-v5
```

```python
from langchain_community.document_loaders import TencentCOSDirectoryLoader
from qcloud_cos import CosConfig
```

```python
conf = CosConfig(
    Region="your cos region",
    SecretId="your cos secret_id",
    SecretKey="your cos secret_key",
)
loader = TencentCOSDirectoryLoader(conf=conf, bucket="you_cos_bucket")
```

```python
loader.load()
```

## 指定前缀

您还可以指定一个前缀，以便更精细地控制要加载哪些文件。

```python
loader = TencentCOSDirectoryLoader(conf=conf, bucket="you_cos_bucket", prefix="fake")
```

```python
loader.load()
```
