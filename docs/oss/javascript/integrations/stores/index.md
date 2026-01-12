---
title: 键值存储
---
## 概述

LangChain 提供了一个键值存储接口，用于通过键存储和检索数据。LangChain 中的键值存储接口主要用于缓存[嵌入向量](/oss/javascript/integrations/text_embedding)。

## 接口

所有 [`BaseStores`](https://api.js.langchain.com/classes/langchain_core.stores.BaseStore.html) 都是**泛型**的，并支持以下接口，其中 `K` 代表键的类型，`V` 代表值的类型：

- `mget(keys: K[]): Promise<(V | undefined)[]>`：获取多个键对应的值，如果键不存在则返回 `undefined`
- `mset(keyValuePairs: [K, V][]): Promise<void>`：设置多个键的值
- `mdelete(keys: K[]): Promise<void>`：删除多个键
- `yieldKeys(prefix?: string): AsyncGenerator<K | string>`：异步生成存储中的所有键，可选择按前缀过滤

该接口的泛型特性允许您为键和值使用不同的类型。例如，`BaseStore<string, BaseMessage>` 将使用字符串键存储消息，而 `BaseStore<string, number[]>` 将存储数字数组。

<Note>

基础存储（Base stores）设计为一次处理<strong>多个</strong>键值对以提高效率。这节省了网络往返时间，并可能允许底层存储进行更高效的批量操作。

</Note>

## 用于本地开发的内置存储

<Columns :cols="2">

<Card title="InMemoryStore" icon="link" href="/oss/integrations/stores/in_memory" arrow="true" cta="查看指南" />
<Card title="LocalFileStore" icon="link" href="/oss/integrations/stores/file_system" arrow="true" cta="查看指南" />

</Columns>

## 自定义存储

您也可以通过扩展 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph-checkpoint.BaseStore.html" target="_blank" rel="noreferrer" class="link"><code>BaseStore</code></a> 类来实现自己的自定义存储。更多详情请参阅[存储接口文档](https://api.js.langchain.com/classes/langchain_core.stores.BaseStore.html)。

## 所有集成

<Columns :cols="3">

<Card
title="Cassandra KV"
icon="link"
href="/oss/integrations/stores/cassandra_storage"
arrow="true"
cta="查看指南"
/>
<Card
title="IORedis"
icon="link"
href="/oss/integrations/stores/ioredis_storage"
arrow="true"
cta="查看指南"
/>
<Card
title="Upstash Redis"
icon="link"
href="/oss/integrations/stores/upstash_redis_storage"
arrow="true"
cta="查看指南"
/>
<Card
title="Vercel KV"
icon="link"
href="/oss/integrations/stores/vercel_kv_storage"
arrow="true"
cta="查看指南"
/>

</Columns>

