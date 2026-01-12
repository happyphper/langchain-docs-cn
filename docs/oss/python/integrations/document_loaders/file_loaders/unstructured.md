---
title: UnstructuredLoader
---

<Tip>

<strong>兼容性</strong>：仅在 Node.js 上可用。

</Tip>

本笔记本提供了快速入门 `UnstructuredLoader` [文档加载器](/oss/python/integrations/document_loaders) 的概述。有关 `UnstructuredLoader` 所有功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain_community_document_loaders_fs_unstructured.UnstructuredLoader.html)。

## 概述

### 集成详情

| 类 | 包 | 兼容性 | 本地运行 | [Python 支持](https://python.langchain.com/docs/integrations/document_loaders/unstructured_file) |
| :--- | :--- | :---: | :---: |  :---: |
| [UnstructuredLoader](https://api.js.langchain.com/classes/langchain_community_document_loaders_fs_unstructured.UnstructuredLoader.html) | [@langchain/community](https://api.js.langchain.com/modules/langchain_community_document_loaders_fs_unstructured.html) | 仅 Node.js | ✅ | ✅ |

## 设置

要使用 `UnstructuredLoader` 文档加载器，您需要安装 `@langchain/community` 集成包，并创建一个 Unstructured 账户以获取 API 密钥。

### 本地运行

您可以使用 Docker 在本地计算机上运行 Unstructured。为此，您需要安装 Docker。您可以在此处找到安装 Docker 的说明 [here](https://docs.docker.com/get-docker/)。

```bash
docker run -p 8000:8000 -d --rm --name unstructured-api downloads.unstructured.io/unstructured-io/unstructured-api:latest --port 8000 --host 0.0.0.0
```

### 凭证

前往 [unstructured.io](https://unstructured.io/api-key-hosted) 注册 Unstructured 并生成 API 密钥。完成后，请设置 `UNSTRUCTURED_API_KEY` 环境变量：

```bash
export UNSTRUCTURED_API_KEY="your-api-key"
```

### 安装

LangChain UnstructuredLoader 集成位于 `@langchain/community` 包中：

::: code-group

```bash [npm]
npm install @langchain/community @langchain/core
```

```bash [yarn]
yarn add @langchain/community @langchain/core
```

```bash [pnpm]
pnpm add @langchain/community @langchain/core
```

:::

## 实例化

现在我们可以实例化模型对象并加载文档：

```typescript
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured"

const loader = new UnstructuredLoader("../../../../../../examples/src/document_loaders/example_data/notion.mdx")
```

## 加载

```typescript
const docs = await loader.load()
docs[0]
```

```javascript
Document {
  pageContent: '# Testing the notion markdownloader',
  metadata: {
    filename: 'notion.mdx',
    languages: [ 'eng' ],
    filetype: 'text/plain',
    category: 'NarrativeText'
  },
  id: undefined
}
```

```typescript
console.log(docs[0].metadata)
```

```javascript
{
  filename: 'notion.mdx',
  languages: [ 'eng' ],
  filetype: 'text/plain',
  category: 'NarrativeText'
}
```

## 目录

您还可以使用 [`UnstructuredDirectoryLoader`](https://api.js.langchain.com/classes/langchain.document_loaders_fs_unstructured.UnstructuredDirectoryLoader.html) 加载目录中的所有文件，它继承自 [`DirectoryLoader`](/oss/python/integrations/document_loaders/file_loaders/directory)：

```typescript
import { UnstructuredDirectoryLoader } from "@langchain/community/document_loaders/fs/unstructured";

const directoryLoader = new UnstructuredDirectoryLoader(
  "../../../../../../examples/src/document_loaders/example_data/",
  {}
);
const directoryDocs = await directoryLoader.load();
console.log("directoryDocs.length: ", directoryDocs.length);
console.log(directoryDocs[0])
```

```text
Unknown file type: Star_Wars_The_Clone_Wars_S06E07_Crisis_at_the_Heart.srt
Unknown file type: test.mp3
```

```javascript
directoryDocs.length:  247
Document {
  pageContent: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
  metadata: {
    filetype: 'application/pdf',
    languages: [ 'eng' ],
    page_number: 1,
    filename: 'bitcoin.pdf',
    category: 'Title'
  },
  id: undefined
}
```

---

## API 参考

有关 UnstructuredLoader 所有功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain_community_document_loaders_fs_unstructured.UnstructuredLoader.html)。
