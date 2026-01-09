---
title: InMemoryStore
---
这将帮助你开始使用 [InMemoryStore](/oss/integrations/stores)。关于 InMemoryStore 所有功能和配置的详细文档，请查阅 [API 参考](https://api.js.langchain.com/classes/langchain_core.stores.InMemoryStore.html)。

`InMemoryStore` 允许为存储中的值分配一个泛型类型。我们将分配 `BaseMessage` 类型作为值的类型，以符合聊天历史存储的主题。

## 概述

### 集成详情

| 类 | 包 | 本地 | [Python 支持](https://python.langchain.com/docs/integrations/stores/in_memory/) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: |
| [InMemoryStore](https://api.js.langchain.com/classes/langchain_core.stores.InMemoryStore.html) | [@langchain/core](https://api.js.langchain.com/modules/langchain_core.stores.html) | ✅ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/core?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/core?style=flat-square&label=%20&) |

## 设置

### 安装

LangChain InMemoryStore 集成位于 `@langchain/core` 包中：

::: code-group

```bash [npm]
npm install @langchain/core
```

```bash [yarn]
yarn add @langchain/core
```

```bash [pnpm]
pnpm add @langchain/core
```

:::

## 实例化

现在我们可以实例化我们的字节存储：

```typescript
import { InMemoryStore } from "@langchain/core/stores"
import { BaseMessage } from "@langchain/core/messages";

const kvStore = new InMemoryStore<BaseMessage>();
```

## 用法

你可以使用 `mset` 方法在键下设置数据，如下所示：

```typescript
import { AIMessage, HumanMessage } from "@langchain/core/messages";

await kvStore.mset(
  [
    ["key1", new HumanMessage("value1")],
    ["key2", new AIMessage("value2")],
  ]
)

await kvStore.mget(
  [
    "key1",
    "key2",
  ]
)
```

```json
[
  HumanMessage {
    "content": "value1",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "value2",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  }
]
```

你可以使用 `mdelete` 方法删除数据：

```typescript
await kvStore.mdelete(
  [
    "key1",
    "key2",
  ]
)

await kvStore.mget(
  [
    "key1",
    "key2",
  ]
)
```

```text
[ undefined, undefined ]
```

## 生成值

如果你想获取所有键，可以调用 `yieldKeys` 方法。可选地，你可以传递一个键前缀，只获取匹配该前缀的键。

```typescript
import { InMemoryStore } from "@langchain/core/stores"
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";

const kvStoreForYield = new InMemoryStore<BaseMessage>();

// 向存储中添加一些数据
await kvStoreForYield.mset(
  [
    ["message:id:key1", new HumanMessage("value1")],
    ["message:id:key2", new AIMessage("value2")],
  ]
)

const yieldedKeys = [];
for await (const key of kvStoreForYield.yieldKeys("message:id:")) {
  yieldedKeys.push(key);
}

console.log(yieldedKeys);
```

```python
[ 'message:id:key1', 'message:id:key2' ]
```

---

## API 参考

关于 InMemoryStore 所有功能和配置的详细文档，请查阅 [API 参考](https://api.js.langchain.com/classes/langchain_core.stores.InMemoryStore.html)
