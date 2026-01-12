---
title: Voy
---
[Voy](https://github.com/tantaraio/voy) 是一个用 Rust 编写的 WASM 向量相似性搜索引擎。
它支持非 Node 环境，例如浏览器。你可以将 Voy 与 LangChain.js 一起用作向量存储。

### 安装 Voy

<Tip>

关于安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/openai voy-search @langchain/community @langchain/core
```

## 使用方法

```typescript
import { VoyVectorStore } from "@langchain/community/vectorstores/voy";
import { Voy as VoyClient } from "voy-search";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

// 使用库创建 Voy 客户端。
const voyClient = new VoyClient();
// 创建嵌入
const embeddings = new OpenAIEmbeddings();
// 创建 Voy 存储。
const store = new VoyVectorStore(voyClient, embeddings);

// 添加两个带有一些元数据的文档。
await store.addDocuments([
  new Document({
    pageContent: "How has life been treating you?",
    metadata: {
      foo: "Mike",
    },
  }),
  new Document({
    pageContent: "And I took it personally...",
    metadata: {
      foo: "Testing",
    },
  }),
]);

const model = new OpenAIEmbeddings();
const query = await model.embedQuery("And I took it personally");

// 执行相似性搜索。
const resultsWithScore = await store.similaritySearchVectorWithScore(query, 1);

// 打印结果。
console.log(JSON.stringify(resultsWithScore, null, 2));
/*
  [
    [
      {
        "pageContent": "And I took it personally...",
        "metadata": {
          "foo": "Testing"
        }
      },
      0
    ]
  ]
*/
```

## 相关链接

- 向量存储[概念指南](/oss/javascript/integrations/vectorstores)
- 向量存储[操作指南](/oss/javascript/integrations/vectorstores)
