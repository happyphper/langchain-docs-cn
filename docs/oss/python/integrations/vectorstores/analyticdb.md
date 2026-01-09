---
title: AnalyticDB
---
[AnalyticDB for PostgreSQL](https://www.alibabacloud.com/help/en/analyticdb-for-postgresql/latest/product-introduction-overview) 是一种大规模并行处理（MPP）数据仓库服务，专为在线分析海量数据而设计。

`AnalyticDB for PostgreSQL` 基于开源的 `Greenplum Database` 项目开发，并由 `阿里云` 进行了深度扩展增强。AnalyticDB for PostgreSQL 兼容 ANSI SQL 2003 语法以及 PostgreSQL 和 Oracle 数据库生态系统。AnalyticDB for PostgreSQL 还支持行存储和列存储。AnalyticDB for PostgreSQL 能够高性能地离线处理 PB 级数据，并支持高并发的在线查询。

本笔记本展示了如何使用与 `AnalyticDB` 向量数据库相关的功能。

要运行，您需要有一个已启动并运行的 [AnalyticDB](https://www.alibabacloud.com/help/en/analyticdb-for-postgresql/latest/product-introduction-overview) 实例：

- 使用 [AnalyticDB 云向量数据库](https://www.alibabacloud.com/product/hybriddb-postgresql)。

<Tip>

<strong>兼容性</strong>

仅在 Node.js 上可用。

</Tip>

## 设置

LangChain.js 接受 [node-postgres](https://node-postgres.com/) 作为 AnalyticDB 向量存储的连接池。

```bash [npm]
npm install -S pg
```
并且我们需要 [pg-copy-streams](https://github.com/brianc/node-pg-copy-streams) 来快速批量添加向量。

```bash [npm]
npm install -S pg-copy-streams
```

<Tip>

有关安装 LangChain 包的通用说明，请参阅 [此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/openai @langchain/community @langchain/core
```

## 用法

<Warning>

<strong>安全提示</strong>

用户生成的数据（如用户名）不应作为集合名称的输入。
<strong>这可能导致 SQL 注入！</strong>

</Warning>

```typescript
import { AnalyticDBVectorStore } from "@langchain/community/vectorstores/analyticdb";
import { OpenAIEmbeddings } from "@langchain/openai";

const connectionOptions = {
  host: process.env.ANALYTICDB_HOST || "localhost",
  port: Number(process.env.ANALYTICDB_PORT) || 5432,
  database: process.env.ANALYTICDB_DATABASE || "your_database",
  user: process.env.ANALYTICDB_USERNAME || "username",
  password: process.env.ANALYTICDB_PASSWORD || "password",
};

const vectorStore = await AnalyticDBVectorStore.fromTexts(
  ["foo", "bar", "baz"],
  [{ page: 1 }, { page: 2 }, { page: 3 }],
  new OpenAIEmbeddings(),
  { connectionOptions }
);
const result = await vectorStore.similaritySearch("foo", 1);
console.log(JSON.stringify(result));
// [{"pageContent":"foo","metadata":{"page":1}}]

await vectorStore.addDocuments([{ pageContent: "foo", metadata: { page: 4 } }]);

const filterResult = await vectorStore.similaritySearch("foo", 1, {
  page: 4,
});
console.log(JSON.stringify(filterResult));
// [{"pageContent":"foo","metadata":{"page":4}}]

const filterWithScoreResult = await vectorStore.similaritySearchWithScore(
  "foo",
  1,
  { page: 3 }
);
console.log(JSON.stringify(filterWithScoreResult));
// [[{"pageContent":"baz","metadata":{"page":3}},0.26075905561447144]]

const filterNoMatchResult = await vectorStore.similaritySearchWithScore(
  "foo",
  1,
  { page: 5 }
);
console.log(JSON.stringify(filterNoMatchResult));
// []

// 需要手动关闭连接池
await vectorStore.end();
```

## 相关链接

- 向量存储 [概念指南](/oss/integrations/vectorstores)
- 向量存储 [操作指南](/oss/integrations/vectorstores)
