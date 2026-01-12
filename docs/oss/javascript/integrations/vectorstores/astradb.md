---
title: Astra DB
---
<提示>
**兼容性说明**

仅在 Node.js 环境下可用。
</提示>

DataStax [Astra DB](https://astra.datastax.com/register) 是一个基于 [Apache Cassandra](https://cassandra.apache.org/_/index.html) 构建的无服务器向量数据库，通过易于使用的 JSON API 方便地提供服务。

## 设置步骤

1. 创建一个 [Astra DB 账户](https://astra.datastax.com/register)。
2. 创建一个 [支持向量的数据库](https://astra.datastax.com/createDatabase)。
3. 从数据库详情中获取您的 `API 端点` 和 `令牌`。
4. 设置以下环境变量：

```bash
export ASTRA_DB_APPLICATION_TOKEN=YOUR_ASTRA_DB_APPLICATION_TOKEN_HERE
export ASTRA_DB_ENDPOINT=YOUR_ASTRA_DB_ENDPOINT_HERE
export ASTRA_DB_COLLECTION=YOUR_ASTRA_DB_COLLECTION_HERE
export OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
```

其中 `ASTRA_DB_COLLECTION` 是您希望创建的集合名称。

6. 安装 Astra TS 客户端和 LangChain 社区包

<提示>
关于安装 LangChain 包的通用说明，请参阅 [此部分](/oss/javascript/langchain/install)。
</提示>

```bash [npm]
npm install @langchain/openai @datastax/astra-db-ts @langchain/community @langchain/core
```

## 索引文档

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";

const astraConfig: AstraLibArgs = {
  token: process.env.ASTRA_DB_APPLICATION_TOKEN as string,
  endpoint: process.env.ASTRA_DB_ENDPOINT as string,
  collection: process.env.ASTRA_DB_COLLECTION ?? "langchain_test",
  collectionOptions: {
    vector: {
      dimension: 1536,
      metric: "cosine",
    },
  },
};

const vectorStore = await AstraDBVectorStore.fromTexts(
  [
    "AstraDB 基于 Apache Cassandra 构建",
    "AstraDB 是一个 NoSQL 数据库",
    "AstraDB 支持向量搜索",
  ],
  [{ foo: "foo" }, { foo: "bar" }, { foo: "baz" }],
  new OpenAIEmbeddings(),
  astraConfig
);

// 查询文档：
const results = await vectorStore.similaritySearch("Cassandra", 1);

// 或进行带过滤条件的查询：
const filteredQueryResults = await vectorStore.similaritySearch("A", 1, {
  foo: "bar",
});
```

## 向量类型

Astra DB 支持 `cosine`（默认）、`dot_product` 和 `euclidean` 相似度搜索；这需要在首次创建向量存储时，作为 `CreateCollectionOptions` 的一部分进行定义：

```typescript
vector: {
    dimension: number;
    metric?: "cosine" | "euclidean" | "dot_product";
};
```

## 相关内容

- 向量存储 [概念指南](/oss/javascript/integrations/vectorstores)
- 向量存储 [操作指南](/oss/javascript/integrations/vectorstores)
