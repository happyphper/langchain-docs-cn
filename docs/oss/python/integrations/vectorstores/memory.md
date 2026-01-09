---
title: MemoryVectorStore
---
LangChain 提供了一种内存中的临时向量存储（vectorstore），它将嵌入向量存储在内存中，并执行精确的线性搜索以查找最相似的嵌入向量。默认的相似度度量是余弦相似度，但可以更改为 [ml-distance](https://mljs.github.io/distance/modules/similarity.html) 支持的任何相似度度量。

由于它主要用于演示，目前还不支持 ID 或删除操作。

本指南提供了快速入门内存 [`向量存储`](/oss/integrations/vectorstores) 的概述。有关 `MemoryVectorStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain.vectorstores_memory.MemoryVectorStore.html)。

## 概述

### 集成详情

| 类 | 包 | PY 支持 | 版本 |
| :--- | :--- | :---: | :---: |
| [`MemoryVectorStore`](https://api.js.langchain.com/classes/langchain.vectorstores_memory.MemoryVectorStore.html) | [`langchain`](https://www.npmjs.com/package/langchain) | ❌ |  ![NPM - Version](https://img.shields.io/npm/v/langchain?style=flat-square&label=%20&) |

## 设置

要使用内存向量存储，您需要安装 `langchain` 包：

本指南还将使用 [OpenAI 嵌入](/oss/integrations/text_embedding/openai)，这需要您安装 `@langchain/openai` 集成包。您也可以根据需要选择使用 [其他支持的嵌入模型](/oss/integrations/text_embedding)。

::: code-group

```bash [npm]
npm install langchain @langchain/openai @langchain/core
```

```bash [yarn]
yarn add langchain @langchain/openai @langchain/core
```

```bash [pnpm]
pnpm add langchain @langchain/openai @langchain/core
```

:::

### 凭证

使用内存向量存储不需要任何凭证。

如果您在本指南中使用 OpenAI 嵌入，您还需要设置您的 OpenAI 密钥：

```typescript
process.env.OPENAI_API_KEY = "YOUR_API_KEY";
```

如果您希望获得模型调用的自动追踪，您也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```typescript
// process.env.LANGSMITH_TRACING="true"
// process.env.LANGSMITH_API_KEY="your-api-key"
```

## 实例化

```typescript
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const vectorStore = new MemoryVectorStore(embeddings);
```

## 管理向量存储

### 向向量存储添加项目

```typescript
import type { Document } from "@langchain/core/documents";

const document1: Document = {
  pageContent: "The powerhouse of the cell is the mitochondria",
  metadata: { source: "https://example.com" }
};

const document2: Document = {
  pageContent: "Buildings are made out of brick",
  metadata: { source: "https://example.com" }
};

const document3: Document = {
  pageContent: "Mitochondria are made out of lipids",
  metadata: { source: "https://example.com" }
};

const documents = [document1, document2, document3];

await vectorStore.addDocuments(documents);
```

## 查询向量存储

一旦您的向量存储创建完成并添加了相关文档，您很可能希望在运行链或代理时查询它。

### 直接查询

执行简单的相似性搜索可以按如下方式进行：

```typescript
const filter = (doc) => doc.metadata.source === "https://example.com";

const similaritySearchResults = await vectorStore.similaritySearch("biology", 2, filter)

for (const doc of similaritySearchResults) {
  console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`);
}
```

```text
* The powerhouse of the cell is the mitochondria [{"source":"https://example.com"}]
* Mitochondria are made out of lipids [{"source":"https://example.com"}]
```

过滤器是可选的，它必须是一个谓词函数，接收一个文档作为输入，并根据文档是否应该被返回来返回 `true` 或 `false`。

如果您想执行相似性搜索并获取相应的分数，可以运行：

```typescript
const similaritySearchWithScoreResults = await vectorStore.similaritySearchWithScore("biology", 2, filter)

for (const [doc, score] of similaritySearchWithScoreResults) {
  console.log(`* [SIM=${score.toFixed(3)}] ${doc.pageContent} [${JSON.stringify(doc.metadata)}]`);
}
```

```text
* [SIM=0.165] The powerhouse of the cell is the mitochondria [{"source":"https://example.com"}]
* [SIM=0.148] Mitochondria are made out of lipids [{"source":"https://example.com"}]
```

### 转换为检索器进行查询

您也可以将向量存储转换为 [检索器](/oss/langchain/retrieval)，以便在您的链中更轻松地使用：

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

### 最大边际相关性

此向量存储还支持最大边际相关性（MMR），这是一种首先通过经典相似性搜索获取更多结果（由 `searchKwargs.fetchK` 指定），然后根据多样性重新排序并返回前 `k` 个结果的技术。这有助于防止冗余信息：

```typescript
const mmrRetriever = vectorStore.asRetriever({
  searchType: "mmr",
  searchKwargs: {
    fetchK: 10,
  },
  // 可选过滤器
  filter: filter,
  k: 2,
});

await mmrRetriever.invoke("biology");
```

```javascript
[
  Document {
    pageContent: 'The powerhouse of the cell is the mitochondria',
    metadata: { source: 'https://example.com' },
    id: undefined
  },
  Document {
    pageContent: 'Buildings are made out of brick',
    metadata: { source: 'https://example.com' },
    id: undefined
  }
]
```

### 用于检索增强生成

有关如何使用此向量存储进行检索增强生成（RAG）的指南，请参阅以下部分：

- [使用 LangChain 构建 RAG 应用](/oss/langchain/rag)。
- [代理式 RAG](/oss/langgraph/agentic-rag)
- [检索文档](/oss/langchain/retrieval)

---

## API 参考

有关 `MemoryVectorStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain.vectorstores_memory.MemoryVectorStore.html)。
