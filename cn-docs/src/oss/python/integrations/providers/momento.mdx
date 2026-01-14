---
title: Momento
---
> [Momento Cache](https://docs.momentohq.com/) 是全球首个真正意义上的无服务器缓存服务，提供即时弹性、缩容至零的能力以及极致的性能。
>
> [Momento Vector Index](https://docs.momentohq.com/vector-index) 则是最具生产力、最易于使用、完全无服务器的向量索引。
>
> 对于这两项服务，您只需获取 SDK，获得一个 API 密钥，在代码中输入几行，即可开始使用。它们共同为您的 LLM 数据需求提供了一个全面的解决方案。

本页介绍了如何在 LangChain 中使用 [Momento](https://gomomento.com) 生态系统。

## 安装与设置

- 在此处[注册](https://console.gomomento.com/)免费账户以获取 API 密钥
- 使用 `pip install momento` 安装 Momento Python SDK

## 缓存

将 Momento 用作 LLM 提示词和响应的无服务器、分布式、低延迟缓存。标准缓存是 Momento 用户在任何环境中的主要用例。

要将 Momento Cache 集成到您的应用程序中：

```python
from langchain.cache import MomentoCache
```

然后，使用以下代码进行设置：

```python
from datetime import timedelta
from momento import CacheClient, Configurations, CredentialProvider
from langchain.globals import set_llm_cache

# 实例化 Momento 客户端
cache_client = CacheClient(
    Configurations.Laptop.v1(),
    CredentialProvider.from_environment_variable("MOMENTO_API_KEY"),
    default_ttl=timedelta(days=1))

# 选择您喜欢的 Momento 缓存名称
cache_name = "langchain"

# 实例化 LLM 缓存
set_llm_cache(MomentoCache(cache_client, cache_name))
```

## 向量存储

Momento Vector Index (MVI) 可用作向量存储。

请参阅[此笔记本](/oss/integrations/vectorstores/momento_vector_index)，了解如何将 MVI 用作向量存储的详细步骤。

```python
from langchain_community.vectorstores import MomentoVectorIndex
```
