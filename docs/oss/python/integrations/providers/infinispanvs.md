---
title: Infinispan VS
---
> [Infinispan](https://infinispan.org) Infinispan 是一个开源的内存数据网格，它提供了一个键/值数据存储，能够保存所有类型的数据，从 Java 对象到纯文本。
> 从版本 15 开始，Infinispan 支持对缓存进行向量搜索。

## 安装与设置
请参阅 [Get Started](https://infinispan.org/get-started/) 来运行 Infinispan 服务器，您可能需要禁用身份验证（目前不支持）。

## 向量存储

```python
from langchain_community.vectorstores import InfinispanVS
```
