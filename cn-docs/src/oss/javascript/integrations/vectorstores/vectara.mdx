---
title: Vectara
---
Vectara 是一个用于构建 GenAI 应用程序的平台。它提供了一个易于使用的 API，用于文档索引和查询，该 API 由 Vectara 管理，并针对性能和准确性进行了优化。

您可以将 Vectara 与 LangChain.js 一起用作向量存储。

## 👉 包含嵌入

Vectara 在底层使用其自身的嵌入模型，因此您无需自行提供任何嵌入，也无需调用其他服务来获取嵌入。

这也意味着，如果您提供自己的嵌入，它们将不会产生任何效果。

```typescript
const store = await VectaraStore.fromTexts(
  ["hello world", "hi there"],
  [{ foo: "bar" }, { foo: "baz" }],
  // 这不会产生效果。为了清晰起见，请提供一个 FakeEmbeddings 实例。
  new OpenAIEmbeddings(),
  args
);
```

## 设置

您需要：

- 创建一个 [免费的 Vectara 账户](https://vectara.com/integrations/langchain)。
- 创建一个 [语料库](https://docs.vectara.com/docs/console-ui/creating-a-corpus) 来存储您的数据。
- 创建一个具有 QueryService 和 IndexService 访问权限的 [API 密钥](https://docs.vectara.com/docs/common-use-cases/app-authn-authz/api-keys)，以便您可以访问此语料库。

配置您的 `.env` 文件或提供参数，以将 LangChain 连接到您的 Vectara 语料库：

```
VECTARA_CUSTOMER_ID=your_customer_id
VECTARA_CORPUS_ID=your_corpus_id
VECTARA_API_KEY=your-vectara-api-key
```

请注意，您可以提供多个以逗号分隔的语料库 ID，以便同时查询多个语料库。例如：`VECTARA_CORPUS_ID=3,8,9,43`。
要为多个语料库建立索引，您需要为每个语料库创建一个单独的 VectaraStore 实例。

## 用法

```typescript
import { VectaraStore } from "@langchain/community/vectorstores/vectara";
import { VectaraSummaryRetriever } from "@langchain/community/retrievers/vectara_summary";
import { Document } from "@langchain/core/documents";

// 创建 Vectara 存储。
const store = new VectaraStore({
  customerId: Number(process.env.VECTARA_CUSTOMER_ID),
  corpusId: Number(process.env.VECTARA_CORPUS_ID),
  apiKey: String(process.env.VECTARA_API_KEY),
  verbose: true,
});

// 添加两个带有元数据的文档。
const doc_ids = await store.addDocuments([
  new Document({
    pageContent: "Do I dare to eat a peach?",
    metadata: {
      foo: "baz",
    },
  }),
  new Document({
    pageContent: "In the room the women come and go talking of Michelangelo",
    metadata: {
      foo: "bar",
    },
  }),
]);

// 执行相似性搜索。
const resultsWithScore = await store.similaritySearchWithScore(
  "What were the women talking about?",
  1,
  {
    lambda: 0.025,
  }
);

// 打印结果。
console.log(JSON.stringify(resultsWithScore, null, 2));
/*
[
  [
    {
      "pageContent": "In the room the women come and go talking of Michelangelo",
      "metadata": {
        "lang": "eng",
        "offset": "0",
        "len": "57",
        "foo": "bar"
      }
    },
    0.4678752
  ]
]
*/

const retriever = new VectaraSummaryRetriever({ vectara: store, topK: 3 });
const documents = await retriever.invoke("What were the women talking about?");

console.log(JSON.stringify(documents, null, 2));
/*
[
  {
    "pageContent": "<b>In the room the women come and go talking of Michelangelo</b>",
    "metadata": {
      "lang": "eng",
      "offset": "0",
      "len": "57",
      "foo": "bar"
    }
  },
  {
    "pageContent": "<b>In the room the women come and go talking of Michelangelo</b>",
    "metadata": {
      "lang": "eng",
      "offset": "0",
      "len": "57",
      "foo": "bar"
    }
  },
  {
    "pageContent": "<b>In the room the women come and go talking of Michelangelo</b>",
    "metadata": {
      "lang": "eng",
      "offset": "0",
      "len": "57",
      "foo": "bar"
    }
  }
]
*/

// 删除文档。
await store.deleteDocuments(doc_ids);
```

请注意，`lambda` 是一个与 Vectara 混合搜索能力相关的参数，它在神经搜索和布尔/精确匹配之间提供权衡，如 [此处](https://docs.vectara.com/docs/api-reference/search-apis/lexical-matching) 所述。我们建议默认值为 0.025，同时为高级用户提供了一种在需要时自定义此值的方法。

## API

Vectara 的 LangChain 向量存储使用 Vectara 的核心 API：

- [索引 API](https://docs.vectara.com/docs/indexing-apis/indexing) 用于将文档存储在 Vectara 语料库中。
- [搜索 API](https://docs.vectara.com/docs/search-apis/search) 用于查询此数据。此 API 支持混合搜索。

## 相关链接

- 向量存储 [概念指南](/oss/integrations/vectorstores)
- 向量存储 [操作指南](/oss/integrations/vectorstores)
