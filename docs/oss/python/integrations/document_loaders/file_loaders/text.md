---
title: 文本加载器
---

<Tip>

<strong>兼容性</strong>：仅在 Node.js 环境中可用。

</Tip>

本笔记本提供了快速入门 `TextLoader` [文档加载器](/oss/python/integrations/document_loaders) 的概述。有关 `TextLoader` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain.document_loaders_fs_text.TextLoader.html)。

## 概述

### 集成详情

| 类 | 包 | 兼容性 | 本地 | Python 支持 |
| :--- | :--- | :---: | :---: |  :---: |
| [TextLoader](https://api.js.langchain.com/classes/langchain.document_loaders_fs_text.TextLoader.html) | [langchain](https://api.js.langchain.com/modules/langchain.document_loaders_fs_text.html) | 仅限 Node.js | ✅ | ❌ |

## 设置

要使用 `TextLoader` 文档加载器，您需要安装 `langchain` 包。

### 安装

LangChain TextLoader 集成位于 `langchain` 包中：

::: code-group

```bash [npm]
npm install langchain
```

```bash [yarn]
yarn add langchain
```

```bash [pnpm]
pnpm add langchain
```

:::

## 实例化

现在我们可以实例化模型对象并加载文档：

```typescript
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"

const loader = new TextLoader("../../../../../../examples/src/document_loaders/example_data/example.txt")
```

## 加载

```typescript
const docs = await loader.load()
docs[0]
```

```javascript
Document {
  pageContent: 'Foo\nBar\nBaz\n\n',
  metadata: {
    source: '../../../../../../examples/src/document_loaders/example_data/example.txt'
  },
  id: undefined
}
```

```typescript
console.log(docs[0].metadata)
```

```javascript
{
  source: '../../../../../../examples/src/document_loaders/example_data/example.txt'
}
```

---

## API 参考

有关 TextLoader 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain.document_loaders_fs_text.TextLoader.html)。
