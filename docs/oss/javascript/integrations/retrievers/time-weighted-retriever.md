---
title: 时间加权检索器
---
时间加权检索器（Time-Weighted Retriever）是一种除了考虑相似度外，还兼顾时效性的检索器。其评分算法如下：

```typescript
let score = (1.0 - this.decayRate) ** hoursPassed + vectorRelevance;
```

值得注意的是，上述公式中的 `hoursPassed` 指的是检索器中对象自上次被访问以来经过的时间，而非自创建以来的时间。这意味着频繁访问的对象会保持“新鲜度”并获得更高的评分。

`this.decayRate` 是一个可配置的介于 0 到 1 之间的小数。数值越低意味着文档会被“记住”更长时间，而数值越高则会显著偏向最近被访问的文档。

请注意，将衰减率（decay rate）精确设置为 0 或 1 会使 `hoursPassed` 变得无关紧要，从而使该检索器等同于标准的向量查找。

## 使用方法

此示例展示了如何使用向量存储初始化 `TimeWeightedVectorStoreRetriever`。
需要重点注意的是，由于必需的元数据，所有文档都必须通过**检索器**上的 `addDocuments` 方法添加到基础向量存储中，而不是直接使用向量存储本身的方法。

```typescript
import { TimeWeightedVectorStoreRetriever } from "@langchain/classic/retrievers/time_weighted";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

const retriever = new TimeWeightedVectorStoreRetriever({
  vectorStore,
  memoryStream: [],
  searchKwargs: 2,
});

const documents = [
  "My name is John.",
  "My name is Bob.",
  "My favourite food is pizza.",
  "My favourite food is pasta.",
  "My favourite food is sushi.",
].map((pageContent) => ({ pageContent, metadata: {} }));

// 所有文档都必须使用检索器上的此方法添加（而不是向量存储！）
// 以便填充正确的访问历史元数据
await retriever.addDocuments(documents);

const results1 = await retriever.invoke("What is my favourite food?");

console.log(results1);

/*
[
  Document { pageContent: 'My favourite food is pasta.', metadata: {} }
]
 */

const results2 = await retriever.invoke("What is my favourite food?");

console.log(results2);

/*
[
  Document { pageContent: 'My favourite food is pasta.', metadata: {} }
]
 */
```

## 相关链接

- [检索指南](/oss/javascript/langchain/retrieval)
