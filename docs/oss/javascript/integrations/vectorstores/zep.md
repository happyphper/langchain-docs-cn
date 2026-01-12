---
title: Zep 开源
---
> [Zep](https://www.getzep.com) 是一个面向 AI 助手应用的长时记忆服务。
> 借助 Zep，您可以为 AI 助手提供回忆过去对话的能力，无论对话发生在多久以前，
> 同时还能减少幻觉、降低延迟和成本。

> 对 Zep Cloud 感兴趣？请参阅 [Zep Cloud 安装指南](https://help.getzep.com/sdks)

**注意：** `ZepVectorStore` 处理 `Documents`，旨在用作 `Retriever`（检索器）。
它提供的功能与 Zep 的 `ZepMemory` 类不同，后者专用于持久化、丰富和搜索用户的聊天历史。

## 为什么选择 Zep 的 VectorStore？

Zep 会自动使用 Zep 服务器本地的低延迟模型，对添加到 Zep 向量存储的文档进行嵌入。
Zep TS/JS 客户端可以在非 Node 的边缘环境中使用。这两者与 Zep 的聊天记忆功能相结合，
使得 Zep 成为构建延迟和性能至关重要的对话式 LLM 应用的理想选择。

### 支持的搜索类型

Zep 支持相似性搜索和最大边际相关性（MMR）搜索。MMR 搜索对于检索增强生成（RAG）应用特别有用，
因为它会对结果进行重新排序，以确保返回文档的多样性。

## 安装

请遵循 [Zep 开源快速入门指南](https://help.getzep.com/quickstart) 来安装并开始使用 Zep。

## 用法

您需要 Zep API URL 和可选的 API 密钥才能使用 Zep VectorStore。更多信息请参阅 [Zep 文档](https://help.getzep.com/welcome)。

在下面的示例中，我们使用了 Zep 的自动嵌入功能，该功能会自动使用低延迟嵌入模型在 Zep 服务器上嵌入文档。由于 LangChain 要求传入一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.embeddings.Embeddings.html" target="_blank" rel="noreferrer" class="link"><code>Embeddings</code></a> 实例，我们传入了 `FakeEmbeddings`。

**注意：** 如果您传入除 `FakeEmbeddings` 之外的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.embeddings.Embeddings.html" target="_blank" rel="noreferrer" class="link"><code>Embeddings</code></a> 实例，该类将用于嵌入文档。
您还必须将文档集合设置为 `isAutoEmbedded === false`。请参阅下面的 `OpenAIEmbeddings` 示例。

### 示例：从文档创建 ZepVectorStore 并进行查询

<Tip>

有关安装 LangChain 包的通用说明，请参阅 [此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/openai @langchain/community @langchain/core
```

```typescript
import { ZepVectorStore } from "@langchain/community/vectorstores/zep";
import { FakeEmbeddings } from "@langchain/core/utils/testing";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { randomUUID } from "crypto";

const loader = new TextLoader("src/document_loaders/example_data/example.txt");
const docs = await loader.load();
export const run = async () => {
  const collectionName = `collection${randomUUID().split("-")[0]}`;

  const zepConfig = {
    apiUrl: "http://localhost:8000", // 这应该是您的 Zep 实现的 URL
    collectionName,
    embeddingDimensions: 1536, // 这必须与您使用的嵌入维度匹配
    isAutoEmbedded: true, // 如果为 true，向量存储将在添加文档时自动嵌入它们
  };

  const embeddings = new FakeEmbeddings();

  const vectorStore = await ZepVectorStore.fromDocuments(
    docs,
    embeddings,
    zepConfig
  );

  // 等待文档被嵌入
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const c = await vectorStore.client.document.getCollection(collectionName);
    console.log(
      `嵌入状态：${c.document_embedded_count}/${c.document_count} 个文档已嵌入`
    );
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (c.status === "ready") {
      break;
    }
  }

  const results = await vectorStore.similaritySearchWithScore("bar", 3);

  console.log("相似性搜索结果：");
  console.log(JSON.stringify(results));

  const results2 = await vectorStore.maxMarginalRelevanceSearch("bar", {
    k: 3,
  });

  console.log("MMR 搜索结果：");
  console.log(JSON.stringify(results2));
};
```

### 示例：使用元数据过滤器查询 ZepVectorStore

```typescript
import { ZepVectorStore } from "@langchain/community/vectorstores/zep";
import { FakeEmbeddings } from "@langchain/core/utils/testing";
import { randomUUID } from "crypto";
import { Document } from "@langchain/core/documents";

const docs = [
  new Document({
    metadata: { album: "Led Zeppelin IV", year: 1971 },
    pageContent:
      "Stairway to Heaven is one of the most iconic songs by Led Zeppelin.",
  }),
  new Document({
    metadata: { album: "Led Zeppelin I", year: 1969 },
    pageContent:
      "Dazed and Confused was a standout track on Led Zeppelin's debut album.",
  }),
  new Document({
    metadata: { album: "Physical Graffiti", year: 1975 },
    pageContent:
      "Kashmir, from Physical Graffiti, showcases Led Zeppelin's unique blend of rock and world music.",
  }),
  new Document({
    metadata: { album: "Houses of the Holy", year: 1973 },
    pageContent:
      "The Rain Song is a beautiful, melancholic piece from Houses of the Holy.",
  }),
  new Document({
    metadata: { band: "Black Sabbath", album: "Paranoid", year: 1970 },
    pageContent:
      "Paranoid is Black Sabbath's second studio album and includes some of their most notable songs.",
  }),
  new Document({
    metadata: {
      band: "Iron Maiden",
      album: "The Number of the Beast",
      year: 1982,
    },
    pageContent:
      "The Number of the Beast is often considered Iron Maiden's best album.",
  }),
  new Document({
    metadata: { band: "Metallica", album: "Master of Puppets", year: 1986 },
    pageContent:
      "Master of Puppets is widely regarded as Metallica's finest work.",
  }),
  new Document({
    metadata: { band: "Megadeth", album: "Rust in Peace", year: 1990 },
    pageContent:
      "Rust in Peace is Megadeth's fourth studio album and features intricate guitar work.",
  }),
];

export const run = async () => {
  const collectionName = `collection${randomUUID().split("-")[0]}`;

  const zepConfig = {
    apiUrl: "http://localhost:8000", // 这应该是您的 Zep 实现的 URL
    collectionName,
    embeddingDimensions: 1536, // 这必须与您使用的嵌入维度匹配
    isAutoEmbedded: true, // 如果为 true，向量存储将在添加文档时自动嵌入它们
  };

  const embeddings = new FakeEmbeddings();

  const vectorStore = await ZepVectorStore.fromDocuments(
    docs,
    embeddings,
    zepConfig
  );

  // 等待文档被嵌入
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const c = await vectorStore.client.document.getCollection(collectionName);
    console.log(
      `嵌入状态：${c.document_embedded_count}/${c.document_count} 个文档已嵌入`
    );
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (c.status === "ready") {
      break;
    }
  }

  vectorStore
    .similaritySearchWithScore("sad music", 3, {
      where: { jsonpath: "$[*] ? (@.year == 1973)" }, // 我们应该看到一个结果：The Rain Song
    })
    .then((results) => {
      console.log(`\n\n相似性搜索结果：\n${JSON.stringify(results)}`);
    })
    .catch((e) => {
      if (e.name === "NotFoundError") {
        console.log("未找到结果");
      } else {
        throw e;
      }
    });

  // 我们这里没有过滤，而是演示 MMR 的工作原理。
  // 我们也可以像上面的相似性搜索一样，为 MMR 搜索添加过滤器。
  vectorStore
    .maxMarginalRelevanceSearch("sad music", {
      k: 3,
    })
    .then((results) => {
      console.log(`\n\nMMR 搜索结果：\n${JSON.stringify(results)}`);
    })
    .catch((e) => {
      if (e.name === "NotFoundError") {
        console.log("未找到结果");
      } else {
        throw e;
      }
    });
};
```

### 示例：使用 LangChain 嵌入类，例如 `OpenAIEmbeddings`

```typescript
import { ZepVectorStore } from "@langchain/community/vectorstores/zep";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { randomUUID } from "crypto";

const loader = new TextLoader("src/document_loaders/example_data/example.txt");
const docs = await loader.load();
export const run = async () => {
  const collectionName = `collection${randomUUID().split("-")[0]}`;

  const zepConfig = {
    apiUrl: "http://localhost:8000", // 这应该是您的 Zep 实现的 URL
    collectionName,
    embeddingDimensions: 1536, // 这必须与您使用的嵌入维度匹配
    isAutoEmbedded: false, // 设置为 false 以禁用自动嵌入
  };

  const embeddings = new OpenAIEmbeddings();

  const vectorStore = await ZepVectorStore.fromDocuments(
    docs,
    embeddings,
    zepConfig
  );

  const results = await vectorStore.similaritySearchWithScore("bar", 3);

  console.log("相似性搜索结果：");
  console.log(JSON.stringify(results));

  const results2 = await vectorStore.maxMarginalRelevanceSearch("bar", {
    k: 3,
  });

  console.log("MMR 搜索结果：");
  console.log(JSON.stringify(results2));
};
```

## 相关

- 向量存储 [概念指南](/oss/javascript/integrations/vectorstores)
- 向量存储 [操作指南](/oss/javascript/integrations/vectorstores)
