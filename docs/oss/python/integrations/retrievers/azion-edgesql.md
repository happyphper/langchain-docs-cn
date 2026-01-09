---
title: AzionRetriever
---
## 概述

本文将帮助您开始使用 [AzionRetriever](/oss/langchain/retrieval)。有关 AzionRetriever 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/_langchain_community.retrievers_azion_edgesql.AzionRetriever.html)。

### 集成详情

| 检索器 | 自托管 | 云服务 | 包 | [Python 支持] |
| :--- | :---: | :---: | :---: | :---: |
| [AzionRetriever](https://api.js.langchain.com/classes/_langchain_community.retrievers_azion_edgesql.AzionRetriever.html) | ❌ | ❌ | @langchain/community | ❌ |

## 设置

要使用 AzionRetriever，您需要设置 AZION_TOKEN 环境变量。

```typescript
process.env.AZION_TOKEN = "your-api-key"
```

如果您在本指南中使用 OpenAI 嵌入模型，您还需要设置您的 OpenAI 密钥：

```typescript
process.env.OPENAI_API_KEY = "YOUR_API_KEY";
```

如果您希望从单个查询中获得自动化追踪，您也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```typescript
// process.env.LANGSMITH_API_KEY = "<YOUR API KEY HERE>";
// process.env.LANGSMITH_TRACING = "true";
```

### 安装

此检索器位于 `@langchain/community/retrievers/azion_edgesql` 包中：

::: code-group

```bash [npm]
npm install azion @langchain/openai @langchain/community
```

```bash [yarn]
yarn add azion @langchain/openai @langchain/community
```

```bash [pnpm]
pnpm add azion @langchain/openai @langchain/community
```

:::

## 实例化

现在我们可以实例化我们的检索器：

```typescript
import { AzionRetriever } from "@langchain/community/retrievers/azion_edgesql";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";

const embeddingModel = new OpenAIEmbeddings({
  model: "text-embedding-3-small"
})

const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY
})

const retriever = new AzionRetriever(embeddingModel,
  {dbName:"langchain",
   vectorTable:"documents", // 存储向量嵌入的表
   ftsTable:"documents_fts", // 存储全文搜索索引的表
   searchType:"hybrid", // 检索器使用的搜索类型
   ftsK:2, // 从全文搜索索引返回的结果数量
   similarityK:2, // 从向量索引返回的结果数量
   metadataItems:["language","topic"],
   filters: [{ operator: "=", column: "language", value: "en" }],
   entityExtractor:chatModel

}) // 从向量索引返回的结果数量
```

## 使用

```typescript
const query = "Australia"

await retriever.invoke(query);
```

```javascript
[
  Document {
    pageContent: 'Australia s indigenous people have inhabited the continent for over 65,000 years',
    metadata: { language: 'en', topic: 'history', searchtype: 'similarity' },
    id: '3'
  },
  Document {
    pageContent: 'Australia is a leader in solar energy adoption and renewable technology',
    metadata: { language: 'en', topic: 'technology', searchtype: 'similarity' },
    id: '5'
  },
  Document {
    pageContent: 'Australia s tech sector is rapidly growing with innovation hubs in major cities',
    metadata: { language: 'en', topic: 'technology', searchtype: 'fts' },
    id: '7'
  }
]
```

---

## API 参考

有关 AzionRetriever 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/_langchain_community.retrievers_azion_edgesql.AzionRetriever.html)。
