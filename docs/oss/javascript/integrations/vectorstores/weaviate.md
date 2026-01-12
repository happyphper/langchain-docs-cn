---
title: WeaviateStore
---
[Weaviate](https://weaviate.io/) 是一个开源的向量数据库，它同时存储对象和向量，允许将向量搜索与结构化过滤相结合。LangChain 通过 weaviate-client 包（Weaviate 官方的 TypeScript 客户端）连接到 Weaviate。

本指南提供了快速入门 Weaviate [向量存储](/oss/javascript/integrations/vectorstores) 的概述。有关 `WeaviateStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_weaviate.WeaviateStore.html)。

## 概述

### 集成详情

| 类 | 包 | [PY 支持](https://python.langchain.com/docs/integrations/vectorstores/weaviate/) | 版本 |
| :--- | :--- | :---: | :---: |
| [`WeaviateStore`](https://api.js.langchain.com/classes/langchain_weaviate.WeaviateStore.html) | [`@langchain/weaviate`](https://npmjs.com/@langchain/weaviate) | ✅ |  ![NPM - Version](https://img.shields.io/npm/v/@langchain/weaviate?style=flat-square&label=%20&) |

## 设置

要使用 Weaviate 向量存储，你需要设置一个 Weaviate 实例并安装 `@langchain/weaviate` 集成包。你还应该安装 `weaviate-client` 包来初始化一个客户端以连接到你的实例，并且如果你希望为索引文档分配 ID，还需要安装 `uuid` 包。

本指南还将使用 [OpenAI 嵌入](/oss/javascript/integrations/text_embedding/openai)，这需要你安装 `@langchain/openai` 集成包。你也可以根据需要使用 [其他支持的嵌入模型](/oss/javascript/integrations/text_embedding)。

::: code-group

```bash [npm]
npm install @langchain/weaviate @langchain/core weaviate-client uuid @langchain/openai
```

```bash [yarn]
yarn add @langchain/weaviate @langchain/core weaviate-client uuid @langchain/openai
```

```bash [pnpm]
pnpm add @langchain/weaviate @langchain/core weaviate-client uuid @langchain/openai
```

:::

你需要在本地或服务器上运行 Weaviate。更多信息请参阅 [Weaviate 文档](https://weaviate.io/developers/weaviate/installation)。

### 凭证

设置好实例后，设置以下环境变量：

```typescript
// 如果在本地运行，请包含端口，例如 "localhost:8080"
process.env.WEAVIATE_URL = "YOUR_WEAVIATE_URL";
// 可选，用于云部署
process.env.WEAVIATE_API_KEY = "YOUR_API_KEY";
```

如果你在本指南中使用 OpenAI 嵌入，还需要设置你的 OpenAI 密钥：

```typescript
process.env.OPENAI_API_KEY = "YOUR_API_KEY";
```

如果你想获取模型调用的自动化追踪，也可以通过取消注释以下内容来设置你的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```typescript
// process.env.LANGSMITH_TRACING="true"
// process.env.LANGSMITH_API_KEY="your-api-key"
```

## 实例化

### 连接 Weaviate 客户端

在大多数情况下，你应该使用其中一个连接辅助函数来连接到你的 Weaviate 实例：

- connectToWeaviateCloud
- connectToLocal
- connectToCustom

```typescript
import { WeaviateStore } from "@langchain/weaviate";
import { OpenAIEmbeddings } from "@langchain/openai";
import weaviate from "weaviate-client";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const weaviateClient = weaviate.connectToWeaviateCloud({
   clusterURL: process.env.WEAVIATE_URL!,
  options : {
      authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY || ""),
      headers: {
        "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY || "",
        "X-Cohere-Api-Key": process.env.COHERE_API_KEY || "",
      },
    },
});
```

### 初始化向量存储

要创建一个集合（collection），至少需要指定集合名称。如果不指定任何属性，`auto-schema` 会自动创建它们。

```typescript
const vectorStore = new WeaviateStore(embeddings, {
  client: weaviateClient,
  indexName: "Langchainjs_test",
});
```

要使用 Weaviate 的命名向量（named vectors）、向量化器（vectorizers）、重排序器（reranker）、生成模型（generative-models）等，请在启用向量存储时使用 `schema` 属性。创建向量存储时，`schema` 中的集合名称和其他属性将优先。

```typescript
const vectorStore = new WeaviateStore(embeddings, {
  client: weaviateClient,
  schema: {
    name: "Langchainjs_test",
    description: "A simple dataset",
    properties: [
      {
        name: "title",
        dataType: dataType.TEXT,
      },
      {
        name: "foo",
        dataType: dataType.TEXT,
      },
    ],
    vectorizers: [
      vectorizer.text2VecOpenAI({
        name: "title",
        sourceProperties: ["title"], // (可选) 设置源属性
        // vectorIndexConfig: configure.vectorIndex.hnsw()   // (可选) 设置向量索引配置
      }),
    ],
    generative: weaviate.configure.generative.openAI(),
    reranker: weaviate.configure.reranker.cohere(),
  },
});
```

## 管理向量存储

### 向向量存储添加项目

**注意：** 如果你想为索引文档关联 ID，它们必须是 UUID。

```typescript
import type { Document } from "@langchain/core/documents";
import { v4 as uuidv4 } from "uuid";

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

const document4: Document = {
  pageContent: "The 2024 Olympics are in Paris",
  metadata: { source: "https://example.com" }
}

const documents = [document1, document2, document3, document4];
const uuids = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];

await vectorStore.addDocuments(documents, { ids: uuids });
```

```python
[
  '610f9b92-9bee-473f-a4db-8f2ca6e3442d',
  '995160fa-441e-41a0-b476-cf3785518a0d',
  '0cdbe6d4-0df8-4f99-9b67-184009fee9a2',
  '18a8211c-0649-467b-a7c5-50ebb4b9ca9d'
]
```

### 从向量存储删除项目

你可以通过传递 `filter` 参数按 ID 删除：

```typescript
await vectorStore.delete({ ids: [uuids[3]] });
```

## 查询向量存储

一旦你的向量存储创建完成并且相关文档已添加，你很可能会希望在运行链（chain）或代理（agent）时查询它。
在 Weaviate 的 v3 版本中，客户端主要通过 `collections` 与数据库中的对象进行交互。`collection` 对象可以在整个代码库中重复使用。

### 直接查询

执行简单的相似性搜索可以按如下方式进行。`Filter` 辅助类使得使用带条件的过滤器更加容易。v3 客户端简化了 `Filter` 的使用方式，使你的代码更简洁。

关于 Weaviate 过滤器语法的更多信息，请参阅 [此页面](https://weaviate.io/developers/weaviate/api/graphql/filters)。

```typescript
import { Filters } from "weaviate-client";

const collection = client.collections.use('Langchainjs_test');

const filter = Filters.and(collection.filter.byProperty("source").equal("https://example.com"))

const similaritySearchResults = await vectorStore.similaritySearch("biology", 2, filter);

for (const doc of similaritySearchResults) {
  console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`);
}
```

```text
* The powerhouse of the cell is the mitochondria [{"source":"https://example.com"}]
* Mitochondria are made out of lipids [{"source":"https://example.com"}]
```

如果你想执行相似性搜索并获取相应的分数，可以运行：

```typescript
const similaritySearchWithScoreResults = await vectorStore.similaritySearchWithScore("biology", 2, filter)

for (const [doc, score] of similaritySearchWithScoreResults) {
  console.log(`* [SIM=${score.toFixed(3)}] ${doc.pageContent} [${JSON.stringify(doc.metadata)}]`);
}
```

```text
* [SIM=0.835] The powerhouse of the cell is the mitochondria [{"source":"https://example.com"}]
* [SIM=0.852] Mitochondria are made out of lipids [{"source":"https://example.com"}]
```

### 混合搜索

在 Weaviate 中，`混合搜索` 通过融合两个结果集，将向量搜索和关键词（BM25F）搜索的结果结合起来。要改变关键词和向量组件的相对权重，请在查询中设置 `alpha` 值。

查看 **[文档](https://weaviate.io/developers/weaviate/search/hybrid)** 获取混合搜索选项的完整列表。

```typescript
const results = await vectorStore.hybridSearch("biology",
  {
    limit: 1,
    alpha: 0.25,
    targetVector: ["title"],
    rerank: {
      property: "title",
      query: "greeting",
    },
});
```

### 检索增强生成

检索增强生成 将信息检索与生成式 AI 模型相结合。

在 Weaviate 中，一个 RAG 查询由两部分组成：一个搜索查询和一个给模型的提示。Weaviate 首先执行搜索，然后将搜索结果和你的提示一起传递给生成式 AI 模型，最后返回生成的响应。

- @param query 要搜索的查询。
- @param options 执行混合搜索的可用选项
- @param generate 生成的可用选项。查看文档获取完整列表

```typescript
const results = await vectorStore.generate("hello world",
    {
        singlePrompt: {
            prompt: "Translate this into German: {title}",
        },
        config: generativeParameters.openAI({
            model: "gpt-3.5-turbo",
        }),
    },
    {
        limit: 2,
        targetVector: ["title"],
    }
);
```

### 通过转换为检索器进行查询

你也可以将向量存储转换为 [检索器](/oss/javascript/langchain/retrieval)，以便在你的链中更轻松地使用。

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

关于如何使用此向量存储进行检索增强生成的指南，请参阅以下部分：

- [使用 LangChain 构建 RAG 应用](/oss/javascript/langchain/rag)。
- [智能体 RAG](/oss/javascript/langgraph/agentic-rag)
- [检索文档](/oss/javascript/langchain/retrieval)

---

## API 参考

有关 `WeaviateStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_weaviate.WeaviateStore.html)。
