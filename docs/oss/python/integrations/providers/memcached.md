---
title: Memcached
---
> [Memcached](https://www.memcached.org/) 是一个免费、开源、高性能、分布式的内存对象缓存系统，其本质是通用的，但旨在通过减轻数据库负载来加速动态 Web 应用程序。

本页介绍如何将 Memcached 与 LangChain 结合使用，使用 [pymemcache](https://github.com/pinterest/pymemcache) 作为客户端来连接到一个已经运行的 Memcached 实例。

## 安装与设置

::: code-group

```bash [pip]
pip install pymemcache
```

```bash [uv]
uv add pymemcache
```

:::

## LLM 缓存

要将 Memcached 缓存集成到您的应用程序中：

```python3
from langchain.globals import set_llm_cache
from langchain_openai import OpenAI

from langchain_community.cache import MemcachedCache
from pymemcache.client.base import Client

llm = OpenAI(model="gpt-3.5-turbo-instruct", n=2, best_of=2)
set_llm_cache(MemcachedCache(Client('localhost')))

# 第一次调用时，缓存中还没有，所以应该花费更长时间
llm.invoke("Which city is the most crowded city in the USA?")

# 第二次调用时，缓存中已有，所以速度更快
llm.invoke("Which city is the most crowded city in the USA?")
```
