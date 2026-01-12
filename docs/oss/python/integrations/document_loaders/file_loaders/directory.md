---
title: DirectoryLoader
---

<Tip>

<strong>兼容性</strong>：仅在 Node.js 环境中可用。

</Tip>

本笔记本提供了 `DirectoryLoader` [文档加载器](/oss/python/integrations/document_loaders) 的快速入门概述。有关 `DirectoryLoader` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain.document_loaders_fs_directory.DirectoryLoader.html)。

本示例将介绍如何从包含多个文件的文件夹中加载数据。第二个参数是一个文件扩展名到加载器工厂的映射。每个文件将被传递给匹配的加载器，最终生成的文档将被连接在一起。

示例文件夹：

```text
src/document_loaders/example_data/example/
├── example.json
├── example.jsonl
├── example.txt
└── example.csv
```

## 概述

### 集成详情

| 类 | 包 | 兼容性 | 本地 | Python 支持 |
| :--- | :--- | :---: | :---: |  :---: |
| [DirectoryLoader](https://api.js.langchain.com/classes/langchain.document_loaders_fs_directory.DirectoryLoader.html) | [langchain](https://api.js.langchain.com/modules/langchain.document_loaders_fs_directory.html) | 仅限 Node.js | ✅ | ✅ |

## 设置

要使用 `DirectoryLoader` 文档加载器，您需要安装 `langchain` 包。

### 安装

LangChain DirectoryLoader 集成位于 `langchain` 包中：

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

现在我们可以实例化模型对象并加载文档：

```typescript
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "@langchain/classic/document_loaders/fs/json";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const loader = new DirectoryLoader(
  "../../../../../../examples/src/document_loaders/example_data",
  {
    ".json": (path) => new JSONLoader(path, "/texts"),
    ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path, "text"),
  }
);
```

## 加载

```typescript
const docs = await loader.load()
// 禁用 console.warn 调用
console.warn = () => {}
docs[0]
```

```javascript
Document {
  pageContent: 'Foo\nBar\nBaz\n\n',
  metadata: {
    source: '/Users/bracesproul/code/lang-chain-ai/langchainjs/examples/src/document_loaders/example_data/example.txt'
  },
  id: undefined
}
```

```typescript
console.log(docs[0].metadata)
```

```javascript
{
  source: '/Users/bracesproul/code/lang-chain-ai/langchainjs/examples/src/document_loaders/example_data/example.txt'
}
```

---

## API 参考

有关 DirectoryLoader 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain.document_loaders_fs_directory.DirectoryLoader.html)。
