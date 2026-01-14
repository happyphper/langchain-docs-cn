---
title: SerpAPI 加载器
---
本指南展示了如何在 LangChain 中使用 SerpApi 来加载网络搜索结果。

## 概述

[SerpApi](https://serpapi.com/) 是一个实时 API，提供对来自各种搜索引擎的搜索结果的访问。它通常用于竞争对手分析和排名跟踪等任务。它使企业能够从所有搜索引擎的结果页面中抓取、提取和理解数据。

本指南展示了如何使用 LangChain 中的 `SerpAPILoader` 来加载网络搜索结果。`SerpAPILoader` 简化了从 SerpApi 加载和处理网络搜索结果的过程。

## 设置

您需要注册并获取您的 [SerpApi API 密钥](https://serpapi.com/dashboard)。

## 用法

以下是如何使用 `SerpAPILoader` 的示例：

```typescript
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { SerpAPILoader } from "@langchain/community/document_loaders/web/serpapi";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";

// 初始化必要的组件
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
});
const embeddings = new OpenAIEmbeddings();
const apiKey = "Your SerpApi API key";

// 定义您的问题和查询
const question = "Your question here";
const query = "Your query here";

// 使用 SerpAPILoader 加载网络搜索结果
const loader = new SerpAPILoader({ q: query, apiKey });
const docs = await loader.load();

// 使用 MemoryVectorStore 将加载的文档存储在内存中
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's questions based on the below context:\n\n{context}",
  ],
  ["human", "{input}"],
]);

const combineDocsChain = await createStuffDocumentsChain({
  llm,
  prompt: questionAnsweringPrompt,
});

const chain = await createRetrievalChain({
  retriever: vectorStore.asRetriever(),
  combineDocsChain,
});

const res = await chain.invoke({
  input: question,
});

console.log(res.answer);
```

在此示例中，`SerpAPILoader` 用于加载网络搜索结果，然后使用 `MemoryVectorStore` 将其存储在内存中。随后使用一个检索链（retrieval chain）从内存中检索最相关的文档，并基于这些文档回答问题。这展示了 `SerpAPILoader` 如何简化加载和处理网络搜索结果的过程。
