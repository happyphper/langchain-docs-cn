---
title: PGVectorStore
---

<Tip>

<strong>兼容性</strong>：仅在 Node.js 环境下可用。

</Tip>

为了在通用 PostgreSQL 数据库中启用向量搜索，LangChain.js 支持使用 [`pgvector`](https://github.com/pgvector/pgvector) Postgres 扩展。

本指南提供了快速入门 PGVector [向量存储](/oss/integrations/vectorstores) 的概述。有关 `PGVectorStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_community_vectorstores_pgvector.PGVectorStore.html)。

## 概述

### 集成详情

| 类 | 包 | [PY 支持](https://python.langchain.com/docs/integrations/vectorstores/pgvector/) | 版本 |
| :--- | :--- | :---: | :---: |
| [`PGVectorStore`](https://api.js.langchain.com/classes/langchain_community_vectorstores_pgvector.PGVectorStore.html) | [`@langchain/community`](https://npmjs.com/@langchain/community) | ✅ | ![NPM - Version](https://img.shields.io/npm/v/@langchain/community?style=flat-square&label=%20&) |

## 设置

要使用 PGVector 向量存储，你需要设置一个启用了 [`pgvector`](https://github.com/pgvector/pgvector) 扩展的 Postgres 实例。你还需要安装 `@langchain/community` 集成包，并将 [`pg`](https://www.npmjs.com/package/pg) 包作为对等依赖项。

本指南还将使用 [OpenAI 嵌入](/oss/integrations/text_embedding/openai)，这需要你安装 `@langchain/openai` 集成包。如果你愿意，也可以使用 [其他支持的嵌入模型](/oss/integrations/text_embedding)。

我们还将使用 [`uuid`](https://www.npmjs.com/package/uuid) 包来生成所需格式的 ID。

::: code-group

```bash [npm]
npm install @langchain/community @langchain/openai @langchain/core pg uuid
```

```bash [yarn]
yarn add @langchain/community @langchain/openai @langchain/core pg uuid
```

```bash [pnpm]
pnpm add @langchain/community @langchain/openai @langchain/core pg uuid
```

:::

### 设置实例

根据你设置实例的方式，有多种连接到 Postgres 的方法。这里有一个使用 `pgvector` 团队提供的预构建 Docker 镜像进行本地设置的示例。

创建一个名为 docker-compose.yml 的文件，内容如下：

```yaml
# 运行此命令启动数据库：
# docker compose up
services:
  db:
    hostname: 127.0.0.1
    image: pgvector/pgvector:pg16
    ports:
      - 5432:5432
    restart: always
    environment:
      - POSTGRES_DB=api
      - POSTGRES_USER=myuser
      - POSTGRES_PASSWORD=ChangeMe
```

然后在同一目录下，运行 `docker compose up` 来启动容器。

你可以在 [官方仓库](https://github.com/pgvector/pgvector/) 中找到关于如何设置 pgvector 的更多信息。

### 凭据

要连接到你的 Postgres 实例，你需要相应的凭据。有关支持选项的完整列表，请参阅 [`node-postgres` 文档](https://node-postgres.com/apis/client)。

如果你在本指南中使用 OpenAI 嵌入，你还需要设置你的 OpenAI 密钥：

```typescript
process.env.OPENAI_API_KEY = "YOUR_API_KEY";
```

如果你想获取模型调用的自动化追踪，也可以通过取消注释以下内容来设置你的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```typescript
// process.env.LANGSMITH_TRACING="true"
// process.env.LANGSMITH_API_KEY="your-api-key"
```

## 实例化

要实例化向量存储，请调用 `.initialize()` 静态方法。这将自动检查传入 `config` 中由 `tableName` 指定的表是否存在。如果不存在，它将使用所需的列创建该表。

<Warning>

<strong>安全性</strong>：不应将用户名等用户生成的数据用作表和列名的输入。
<strong>这可能导致 SQL 注入！</strong>

</Warning>

```typescript
import {
  PGVectorStore,
  DistanceStrategy,
} from "@langchain/community/vectorstores/pgvector";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PoolConfig } from "pg";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

// 示例配置
const config = {
  postgresConnectionOptions: {
    type: "postgres",
    host: "127.0.0.1",
    port: 5433,
    user: "myuser",
    password: "ChangeMe",
    database: "api",
  } as PoolConfig,
  tableName: "testlangchainjs",
  columns: {
    idColumnName: "id",
    vectorColumnName: "vector",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
  // 支持的距离策略：cosine（默认）、innerProduct 或 euclidean
  distanceStrategy: "cosine" as DistanceStrategy,
};

const vectorStore = await PGVectorStore.initialize(
  embeddings,
  config
);
```

## 管理向量存储

### 向向量存储添加项目

```typescript
import { v4 as uuidv4 } from "uuid";
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

const document4: Document = {
  pageContent: "The 2024 Olympics are in Paris",
  metadata: { source: "https://example.com" }
}

const documents = [document1, document2, document3, document4];

const ids = [uuidv4(), uuidv4(), uuidv4(), uuidv4()]

await vectorStore.addDocuments(documents, { ids: ids });
```

### 从向量存储中删除项目

```typescript
const id4 = ids[ids.length - 1];

await vectorStore.delete({ ids: [id4] });
```

## 查询向量存储

一旦你的向量存储被创建并且相关文档已添加，你很可能会希望在运行链或代理时查询它。

### 直接查询

执行简单的相似性搜索可以按如下方式进行：

```typescript
const filter = { source: "https://example.com" };

const similaritySearchResults = await vectorStore.similaritySearch("biology", 2, filter);

for (const doc of similaritySearchResults) {
  console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`);
}
```

```text
* The powerhouse of the cell is the mitochondria [{"source":"https://example.com"}]
* Mitochondria are made out of lipids [{"source":"https://example.com"}]
```

上述过滤器语法支持精确匹配，但也支持以下操作：

#### 使用 `in` 操作符

```json
{
  "field": {
    "in": ["value1", "value2"],
  }
}
```

#### 使用 `notIn` 操作符

```json
{
  "field": {
    "notIn": ["value1", "value2"],
  }
}
```

#### 使用 `arrayContains` 操作符

```json
{
  "field": {
    "arrayContains": ["value1", "value2"],
  }
}
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

### 通过转换为检索器进行查询

你也可以将向量存储转换为 [检索器](/oss/langchain/retrieval)，以便在你的链中更轻松地使用。

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

- [使用 LangChain 构建 RAG 应用](/oss/langchain/rag)。
- [智能体 RAG](/oss/langgraph/agentic-rag)
- [检索文档](/oss/langchain/retrieval)

## 高级：重用连接

你可以通过创建一个连接池，然后直接通过构造函数创建新的 `PGVectorStore` 实例来重用连接。

请注意，在使用构造函数之前，你应至少调用一次 `.initialize()` 来正确设置数据库表。

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import pg from "pg";

// 首先，按照以下说明进行设置
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pgvector

const reusablePool = new pg.Pool({
  host: "127.0.0.1",
  port: 5433,
  user: "myuser",
  password: "ChangeMe",
  database: "api",
});

const originalConfig = {
  pool: reusablePool,
  tableName: "testlangchainjs",
  collectionName: "sample",
  collectionTableName: "collections",
  columns: {
    idColumnName: "id",
    vectorColumnName: "vector",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
};

// 设置数据库。
// 如果已经初始化了数据库，可以跳过此步骤。
// await PGVectorStore.initialize(new OpenAIEmbeddings(), originalConfig);
const pgvectorStore = new PGVectorStore(new OpenAIEmbeddings(), originalConfig);

await pgvectorStore.addDocuments([
  { pageContent: "what's this", metadata: { a: 2 } },
  { pageContent: "Cat drinks milk", metadata: { a: 1 } },
]);

const results = await pgvectorStore.similaritySearch("water", 1);

console.log(results);

/*
  [ Document { pageContent: 'Cat drinks milk', metadata: { a: 1 } } ]
*/

const pgvectorStore2 = new PGVectorStore(new OpenAIEmbeddings(), {
  pool: reusablePool,
  tableName: "testlangchainjs",
  collectionTableName: "collections",
  collectionName: "some_other_collection",
  columns: {
    idColumnName: "id",
    vectorColumnName: "vector",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
});

const results2 = await pgvectorStore2.similaritySearch("water", 1);

console.log(results2);

/*
  []
*/

await reusablePool.end();
```

## 创建 HNSW 索引

默认情况下，该扩展执行顺序扫描搜索，召回率为 100%。你可以考虑创建一个 HNSW 索引用于近似最近邻 (ANN) 搜索，以加快 `similaritySearchVectorWithScore` 的执行时间。要在你的向量列上创建 HNSW 索引，请使用 `createHnswIndex()` 方法。

该方法参数包括：

- `dimensions`：定义向量数据类型中的维度数，最多 2000。例如，对于 OpenAI 的 text-embedding-ada-002 和 Amazon 的 amazon.titan-embed-text-v1 模型，使用 1536。

- `m?`：每层的最大连接数（默认为 16）。较小的值可以改善索引构建时间，而较高的值可以加速搜索查询。

- `efConstruction?`：用于构建图的动态候选列表的大小（默认为 64）。较高的值可能会提高索引质量，但会增加索引构建时间。

- `distanceFunction?`：你想要使用的距离函数名称，根据 distanceStrategy 自动选择。

更多信息，请参阅 [Pgvector GitHub 仓库](https://github.com/pgvector/pgvector?tab=readme-ov-file#hnsw) 和 [Malkov Yu A. 和 Yashunin D. A. 于 2020 年发表的 HNSW 论文：使用分层可导航小世界图进行高效且稳健的近似最近邻搜索](https://arxiv.org/pdf/1603.09320)

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  DistanceStrategy,
  PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";
import { PoolConfig } from "pg";

// 首先，按照以下说明进行设置
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pgvector

const hnswConfig = {
  postgresConnectionOptions: {
    type: "postgres",
    host: "127.0.0.1",
    port: 5433,
    user: "myuser",
    password: "ChangeMe",
    database: "api",
  } as PoolConfig,
  tableName: "testlangchainjs",
  columns: {
    idColumnName: "id",
    vectorColumnName: "vector",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
  // 支持的距离策略：cosine（默认）、innerProduct 或 euclidean
  distanceStrategy: "cosine" as DistanceStrategy,
};

const hnswPgVectorStore = await PGVectorStore.initialize(
  new OpenAIEmbeddings(),
  hnswConfig
);

// 创建索引
await hnswPgVectorStore.createHnswIndex({
  dimensions: 1536,
  efConstruction: 64,
  m: 16,
});

await hnswPgVectorStore.addDocuments([
  { pageContent: "what's this", metadata: { a: 2, b: ["tag1", "tag2"] } },
  { pageContent: "Cat drinks milk", metadata: { a: 1, b: ["tag2"] } },
]);

const model = new OpenAIEmbeddings();
const query = await model.embedQuery("water");
const hnswResults = await hnswPgVectorStore.similaritySearchVectorWithScore(query, 1);

console.log(hnswResults);

await pgvectorStore.end();
```

## 关闭连接

确保在完成后关闭连接，以避免资源过度消耗：

```typescript
await vectorStore.end();
```

---

## API 参考

有关 `PGVectorStore` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_community_vectorstores_pgvector.PGVectorStore.html)。
