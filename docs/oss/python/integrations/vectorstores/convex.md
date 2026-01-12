---
title: Convex
---
LangChain.js 支持将 [Convex](https://convex.dev/) 作为 [向量存储](https://docs.convex.dev/vector-search)，并支持标准的相似性搜索。

## 设置

### 创建项目

设置一个可运行的 [Convex](https://docs.convex.dev/) 项目，例如使用以下命令：

```bash
npm create convex@latest
```

### 添加数据库访问器

将查询和变更辅助函数添加到 `convex/langchain/db.ts`：

```ts title="convex/langchain/db.ts"
export * from "@langchain/community/utils/convex";
```

### 配置你的模式

设置你的模式（用于向量索引）：

```ts title="convex/schema.ts"
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 1536,
  }),
});
```

## 用法

<Tip>

关于安装 LangChain 包的通用说明，请参阅 [此部分](/oss/python/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/openai @langchain/community @langchain/core
```

### 数据摄取

```typescript
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { OpenAIEmbeddings } from "@langchain/openai";
import { action } from "./_generated/server.js";

export const ingest = action({
  args: {},
  handler: async (ctx) => {
    await ConvexVectorStore.fromTexts(
      ["Hello world", "Bye bye", "What's this?"],
      [{ prop: 2 }, { prop: 1 }, { prop: 3 }],
      new OpenAIEmbeddings(),
      { ctx }
    );
  },
});
```

### 搜索

```typescript
"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { OpenAIEmbeddings } from "@langchain/openai";
import { v } from "convex/values";
import { action } from "./_generated/server.js";

export const search = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(new OpenAIEmbeddings(), { ctx });

    const resultOne = await vectorStore.similaritySearch(args.query, 1);
    console.log(resultOne);
  },
});
```

## 相关链接

- 向量存储 [概念指南](/oss/python/integrations/vectorstores)
- 向量存储 [操作指南](/oss/python/integrations/vectorstores)
