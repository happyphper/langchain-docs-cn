---
title: LocalFileStore
---

<Tip>

<strong>兼容性</strong>：仅在 Node.js 环境中可用。

</Tip>

本文将帮助您开始使用 [LocalFileStore](/oss/integrations/stores)。如需了解 LocalFileStore 所有功能和配置的详细文档，请查阅 [API 参考](https://api.js.langchain.com/classes/langchain.storage_file_system.LocalFileStore.html)。

## 概述

`LocalFileStore` 是对 `fs` 模块的封装，用于以键值对的形式存储数据。
每个键值对在传递给 `.fromPath` 方法的目录内都有其独立的文件。
文件名即为键，文件内容则为该键对应的值。

<Info>

<strong>传递给 `.fromPath` 的路径必须是一个目录，而不是文件。</strong>

</Info>

<Warning>

<strong>此文件存储可以修改指定目录及其所有子文件夹中的任何文本文件。</strong>

请确保在初始化存储时指定的路径中没有其他文件。

</Warning>

### 集成详情

| 类 | 包 | 本地 | [Python 支持](https://python.langchain.com/docs/integrations/stores/file_system/) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: |
| [LocalFileStore](https://api.js.langchain.com/classes/langchain.storage_file_system.LocalFileStore.html) | [langchain](https://api.js.langchain.com/modules/langchain.storage_file_system.html) | ✅ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/langchain?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/langchain?style=flat-square&label=%20&) |

## 设置

### 安装

LangChain 的 `LocalFileStore` 集成位于 `langchain` 包中：

::: code-group

```bash [npm]
npm install langchain @langchain/core
```

```bash [yarn]
yarn add langchain @langchain/core
```

```bash [pnpm]
pnpm add langchain @langchain/core
```

:::

## 实例化

现在我们可以实例化我们的字节存储：

```typescript
import { LocalFileStore } from "@langchain/classic/storage/file_system"

const kvStore = await LocalFileStore.fromPath("./messages");
```

定义编码器和解码器，用于将数据转换为 `Uint8Array` 以及从 `Uint8Array` 转换回来：

```typescript
const encoder = new TextEncoder();
const decoder = new TextDecoder();
```

## 使用

您可以使用 `mset` 方法像这样在键下设置数据：

```typescript
await kvStore.mset(
  [
    ["key1", encoder.encode("value1")],
    ["key2", encoder.encode("value2")],
  ]
)

const results = await kvStore.mget(
  [
    "key1",
    "key2",
  ]
)
console.log(results.map((v) => decoder.decode(v)));
```

```python
[ 'value1', 'value2' ]
```

您可以使用 `mdelete` 方法删除数据：

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

## 遍历键值

如果您想获取所有键，可以调用 `yieldKeys` 方法。可选地，您可以传递一个键前缀，以仅获取匹配该前缀的键。

```typescript
import { LocalFileStore } from "@langchain/classic/storage/file_system"

const kvStoreForYield = await LocalFileStore.fromPath("./messages");

const encoderForYield = new TextEncoder();

// 向存储中添加一些数据
await kvStoreForYield.mset(
  [
    ["message:id:key1", encoderForYield.encode("value1")],
    ["message:id:key2", encoderForYield.encode("value2")],
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

```typescript
import fs from "fs";

// 清理
await fs.promises.rm("./messages", { recursive: true, force: true });
```

---

## API 参考

如需了解 LocalFileStore 所有功能和配置的详细文档，请查阅 [API 参考](https://api.js.langchain.com/classes/langchain_storage_file_system.LocalFileStore.html)
