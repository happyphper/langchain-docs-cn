---
title: Zep Cloud
---
> [Zep](https://www.getzep.com) 是一个为 AI 助手应用设计的长时记忆服务。
> 通过 Zep，您可以让 AI 助手具备回忆过去对话的能力，无论对话发生在多久以前，
> 同时还能减少幻觉、降低延迟和成本。

**注意：** `ZepCloudVectorStore` 处理的是 `Documents`，旨在用作 `Retriever`（检索器）。
它提供的功能与 Zep 的 `ZepCloudMemory` 类不同，后者专用于持久化、丰富和搜索用户的聊天历史。

## 为什么选择 Zep 的 VectorStore？

Zep 会自动使用 Zep 服务器本地的低延迟模型，对添加到 Zep 向量存储库的文档进行嵌入。
Zep 的 TS/JS 客户端可以在非 Node 的边缘环境中使用。这两者与 Zep 的聊天记忆功能相结合，
使得 Zep 成为构建对延迟和性能有要求的对话式 LLM 应用的理想选择。

### 支持的搜索类型

Zep 同时支持相似性搜索和最大边际相关性（MMR）搜索。MMR 搜索对于检索增强生成（RAG）应用特别有用，
因为它会对结果进行重新排序，以确保返回文档的多样性。

## 安装

注册 [Zep Cloud](https://app.getzep.com/) 并创建一个项目。

按照 [Zep Cloud Typescript SDK 安装指南](https://help.getzep.com/sdks) 进行安装并开始使用 Zep。

## 使用方法

您需要 Zep Cloud 项目的 API 密钥才能使用 Zep VectorStore。更多信息请参阅 [Zep Cloud 文档](https://help.getzep.com/projects)。

Zep 默认会自动嵌入所有文档，并且不期望从用户那里接收任何嵌入向量。
由于 LangChain 要求传入一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.embeddings.Embeddings.html" target="_blank" rel="noreferrer" class="link"><code>Embeddings</code></a> 实例，我们传入 `FakeEmbeddings`。

<Tip>

有关安装 LangChain 包的通用说明，请参阅 [此部分](/oss/javascript/langchain/install)。

</Tip>

### 示例：从文档创建 ZepVectorStore 并进行查询

```bash [npm]
npm install @getzep/zep-cloud @langchain/openai @langchain/community @langchain/core
```

```typescript
import { ZepCloudVectorStore } from "@langchain/community/vectorstores/zep_cloud";
import { FakeEmbeddings } from "@langchain/core/utils/testing";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { randomUUID } from "crypto";

const loader = new TextLoader("src/document_loaders/example_data/example.txt");
const docs = await loader.load();
const collectionName = `collection${randomUUID().split("-")[0]}`;

const zepConfig = {
  // 您的 Zep Cloud 项目 API 密钥 https://help.getzep.com/projects
  apiKey: "<Zep Api Key>",
  collectionName,
};

// 我们在这里使用假嵌入，因为 Zep Cloud 会为您处理嵌入
const embeddings = new FakeEmbeddings();

const vectorStore = await ZepCloudVectorStore.fromDocuments(
  docs,
  embeddings,
  zepConfig
);

// 等待文档被嵌入
// eslint-disable-next-line no-constant-condition
while (true) {
  const c = await vectorStore.client.document.getCollection(collectionName);
  console.log(
    `嵌入状态：${c.documentEmbeddedCount}/${c.documentCount} 个文档已嵌入`
  );
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (c.documentEmbeddedCount === c.documentCount) {
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
```

### 示例：结合表达式语言使用 ZepCloudVectorStore

```typescript
import { ZepClient } from "@getzep/zep-cloud";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import {
  RunnableLambda,
  RunnableMap,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { ZepCloudVectorStore } from "@langchain/community/vectorstores/zep_cloud";
import { StringOutputParser } from "@langchain/core/output_parsers";

async function combineDocuments(docs: Document[], documentSeparator = "\n\n") {
  const docStrings: string[] = await Promise.all(
    docs.map((doc) => doc.pageContent)
  );
  return docStrings.join(documentSeparator);
}

// 您的 Zep 集合名称
const collectionName = "<Zep Collection Name>";

const zepClient = new ZepClient({
  // 您的 Zep Cloud 项目 API 密钥 https://help.getzep.com/projects
  apiKey: "<Zep Api Key>",
});

const vectorStore = await ZepCloudVectorStore.init({
  client: zepClient,
  collectionName,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `仅根据以下上下文回答问题：{context}`,
  ],
  ["human", "{question}"],
]);

const model = new ChatOpenAI({
  temperature: 0.8,
  model: "gpt-3.5-turbo-1106",
});
const retriever = vectorStore.asRetriever();

const setupAndRetrieval = RunnableMap.from({
  context: new RunnableLambda({
    func: (input: string) => retriever.invoke(input).then(combineDocuments),
  }),
  question: new RunnablePassthrough(),
});
const outputParser = new StringOutputParser();

const chain = setupAndRetrieval
  .pipe(prompt)
  .pipe(model)
  .pipe(outputParser)
  .withConfig({
    callbacks: [new ConsoleCallbackHandler()],
  });

const result = await chain.invoke("Project Gutenberg?");

console.log("result", result);
```

## 相关链接

- 向量存储 [概念指南](/oss/javascript/integrations/vectorstores)
- 向量存储 [操作指南](/oss/javascript/integrations/vectorstores)
