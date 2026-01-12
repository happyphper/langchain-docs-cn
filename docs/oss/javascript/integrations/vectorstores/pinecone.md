---
title: PineconeStore
---
[Pinecone](https://www.pinecone.io/) 是一个向量数据库，为全球一些顶尖公司的 AI 应用提供支持。

本指南提供了快速入门 Pinecone [向量存储](/oss/javascript/integrations/vectorstores) 的概览。有关 `PineconeStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_pinecone.PineconeStore.html)。

## 概述

### 集成详情

| 类 | 包 | [PY 支持](https://python.langchain.com/docs/integrations/vectorstores/pinecone/) | 版本 |
| :--- | :--- | :---: | :---: |
| [`PineconeStore`](https://api.js.langchain.com/classes/langchain_pinecone.PineconeStore.html) | [`@langchain/pinecone`](https://npmjs.com/@langchain/pinecone) | ✅ |  ![NPM - Version](https://img.shields.io/npm/v/@langchain/pinecone?style=flat-square&label=%20&) |

## 设置

要使用 Pinecone 向量存储，您需要创建一个 Pinecone 账户，初始化一个索引，并安装 `@langchain/pinecone` 集成包。您还需要安装 [官方 Pinecone SDK](https://www.npmjs.com/package/@pinecone-database/pinecone) 来初始化一个客户端，以便传递给 `PineconeStore` 实例。

本指南还将使用 [OpenAI 嵌入](/oss/javascript/integrations/text_embedding/openai)，这需要您安装 `@langchain/openai` 集成包。您也可以使用 [其他支持的嵌入模型](/oss/javascript/integrations/text_embedding)。

::: code-group

```bash [npm]
npm install @langchain/pinecone @langchain/openai @langchain/core @pinecone-database/pinecone@5
```

```bash [yarn]
yarn add @langchain/pinecone @langchain/openai @langchain/core @pinecone-database/pinecone@5
```

```bash [pnpm]
pnpm add @langchain/pinecone @langchain/openai @langchain/core @pinecone-database/pinecone@5
```

:::

### 凭证

注册一个 [Pinecone](https://www.pinecone.io/) 账户并创建一个索引。请确保维度与您要使用的嵌入模型匹配（OpenAI 的 `text-embedding-3-small` 默认维度为 1536）。完成此操作后，设置 `PINECONE_INDEX`、`PINECONE_API_KEY` 和（可选的）`PINECONE_ENVIRONMENT` 环境变量：

```typescript
process.env.PINECONE_API_KEY = "your-pinecone-api-key";
process.env.PINECONE_INDEX = "your-pinecone-index";

// 可选
process.env.PINECONE_ENVIRONMENT = "your-pinecone-environment";
```

如果您在本指南中使用 OpenAI 嵌入，还需要设置您的 OpenAI 密钥：

```typescript
process.env.OPENAI_API_KEY = "YOUR_API_KEY";
```

如果您希望获得模型调用的自动追踪，也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```typescript
// process.env.LANGSMITH_TRACING="true"
// process.env.LANGSMITH_API_KEY="your-api-key"
```

## 实例化

```typescript
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const pinecone = new PineconeClient();
// 将自动读取 PINECONE_API_KEY 和 PINECONE_ENVIRONMENT 环境变量
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

const vectorStore = await PineconeStore.fromExistingIndex(
  embeddings,
  {
    pineconeIndex,
    // 允许同时进行的最大批处理请求数。每批 1000 个向量。
    maxConcurrency: 5,
    // 您也可以在这里传递命名空间
    // namespace: "foo",
  }
);
```

## 管理向量存储

### 向向量存储添加项目

```typescript
import type { Document } from "@langchain/core/documents";

const document1: Document = {
  pageContent: "细胞中的能量工厂是线粒体",
  metadata: { source: "https://example.com" }
};

const document2: Document = {
  pageContent: "建筑物由砖块构成",
  metadata: { source: "https://example.com" }
};

const document3: Document = {
  pageContent: "线粒体由脂质构成",
  metadata: { source: "https://example.com" }
};

const document4: Document = {
  pageContent: "2024 年奥运会在巴黎举行",
  metadata: { source: "https://example.com" }
}

const documents = [document1, document2, document3, document4];

await vectorStore.addDocuments(documents, { ids: ["1", "2", "3", "4"] });
```

```python
[ '1', '2', '3', '4' ]
```

**注意：** 添加文档后，需要短暂延迟才能进行查询。

### 从向量存储中删除项目

```typescript
await vectorStore.delete({ ids: ["4"] });
```

## 查询向量存储

一旦您的向量存储创建完成并添加了相关文档，您很可能希望在运行链或代理时查询它。

### 直接查询

执行简单的相似性搜索可以按如下方式进行：

```typescript
// 可选过滤器
const filter = { source: "https://example.com" };

const similaritySearchResults = await vectorStore.similaritySearch("biology", 2, filter);

for (const doc of similaritySearchResults) {
  console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`);
}
```

```text
* 细胞中的能量工厂是线粒体 [{"source":"https://example.com"}]
* 线粒体由脂质构成 [{"source":"https://example.com"}]
```

如果您想执行相似性搜索并获取相应的分数，可以运行：

```typescript
const similaritySearchWithScoreResults = await vectorStore.similaritySearchWithScore("biology", 2, filter)

for (const [doc, score] of similaritySearchWithScoreResults) {
  console.log(`* [SIM=${score.toFixed(3)}] ${doc.pageContent} [${JSON.stringify(doc.metadata)}]`);
}
```

```text
* [SIM=0.165] 细胞中的能量工厂是线粒体 [{"source":"https://example.com"}]
* [SIM=0.148] 线粒体由脂质构成 [{"source":"https://example.com"}]
```

### 转换为检索器进行查询

您也可以将向量存储转换为 [检索器](/oss/javascript/langchain/retrieval)，以便在您的链中更轻松地使用。

```typescript
const retriever = vectorStore.asRetriever({
  // 可选过滤器
  filter: filter,
  k: 2,
});

await retriever.invoke("biology");
```

```javascript
[
  Document {
    pageContent: 'The powerhouse of the cell is the mitochondria',
    metadata: { source: 'https://example.com' },
    id: undefined
  },
  Document {
    pageContent: 'Mitochondria are made out of lipids',
    metadata: { source: 'https://example.com' },
    id: undefined
  }
]
```

### 用于检索增强生成

有关如何使用此向量存储进行检索增强生成 (RAG) 的指南，请参阅以下部分：

- [使用 LangChain 构建 RAG 应用](/oss/javascript/langchain/rag)。
- [代理式 RAG](/oss/javascript/langgraph/agentic-rag)
- [检索文档](/oss/javascript/langchain/retrieval)

---

## API 参考

有关 `PineconeStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_pinecone.PineconeStore.html)。
