---
title: 使用 LangChain 构建 RAG 代理
sidebarTitle: RAG agent
---


## 概述

由大语言模型（LLM）实现的最强大应用之一是复杂的问答（Q&A）聊天机器人。这些应用能够回答关于特定源信息的问题。它们使用一种称为检索增强生成（Retrieval Augmented Generation，简称 [RAG](/oss/javascript/langchain/retrieval/)）的技术。

本教程将展示如何基于非结构化文本数据源构建一个简单的问答应用。我们将演示：

1.  一个使用简单工具执行搜索的 RAG [智能体](#rag-agents)。这是一个很好的通用实现。
2.  一个两步 RAG [链](#rag-chains)，每个查询仅使用一次 LLM 调用。对于简单查询，这是一种快速有效的方法。

### 概念

我们将涵盖以下概念：

-   **索引**：从源摄取数据并为其建立索引的流水线。*这通常在一个独立的进程中完成。*
-   **检索与生成**：实际的 RAG 过程，它在运行时接收用户查询，从索引中检索相关数据，然后将其传递给模型。

一旦我们为数据建立了索引，我们将使用一个[智能体](/oss/javascript/langchain/agents)作为编排框架来实现检索和生成步骤。

<Note>

本教程的索引部分将主要遵循[语义搜索教程](/oss/javascript/langchain/knowledge-base)。

如果你的数据已经可供搜索（即，你有一个执行搜索的函数），或者你已经熟悉该教程的内容，可以跳过并直接阅读[检索与生成](#2-retrieval-and-generation)部分。

</Note>

### 预览

在本指南中，我们将构建一个回答关于网站内容问题的应用。我们将使用的具体网站是 Lilian Weng 的 [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) 博客文章，这允许我们就文章内容提问。

我们可以创建一个简单的索引流水线和 RAG 链，用大约 40 行代码完成这项工作。完整代码片段如下：

:::: details 展开查看完整代码片段

```typescript
import "cheerio";
import { createAgent, tool } from "langchain";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import * as z from "zod";

// 加载并分块博客内容
const pTagSelector = "p";
const cheerioLoader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/",
  {
    selector: pTagSelector
  }
);

const docs = await cheerioLoader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
});
const allSplits = await splitter.splitDocuments(docs);

// 索引分块
await vectorStore.addDocuments(allSplits)

// 构建用于检索上下文的工具
const retrieveSchema = z.object({ query: z.string() });

const retrieve = tool(
  async ({ query }) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 2);
    const serialized = retrievedDocs
      .map(
        (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
      )
      .join("\n");
    return [serialized, retrievedDocs];
  },
  {
    name: "retrieve",
    description: "Retrieve information related to a query.",
    schema: retrieveSchema,
    responseFormat: "content_and_artifact",
  }
);

const agent = createAgent({ model: "gpt-5", tools: [retrieve] });
```

```typescript
let inputMessage = `What is Task Decomposition?`;

let agentInputs = { messages: [{ role: "user", content: inputMessage }] };

for await (const step of await agent.stream(agentInputs, {
  streamMode: "values",
})) {
  const lastMessage = step.messages[step.messages.length - 1];
  prettyPrint(lastMessage);
  console.log("-----\n");
}
```

查看 [LangSmith 追踪记录](https://smith.langchain.com/public/a117a1f8-c96c-4c16-a285-00b85646118e/r)。

::::

## 环境设置

### 安装

本教程需要以下 langchain 依赖项：

::: code-group

```bash [npm]
npm i langchain @langchain/community @langchain/textsplitters
```

```bash [yarn]
yarn add langchain @langchain/community @langchain/textsplitters
```

```bash [pnpm]
pnpm add langchain @langchain/community @langchain/textsplitters
```

:::

更多详情，请参阅我们的[安装指南](/oss/javascript/langchain/install)。

### LangSmith

使用 LangChain 构建的许多应用将包含多个步骤和多次 LLM 调用。随着这些应用变得越来越复杂，能够检查链或智能体内部究竟发生了什么变得至关重要。最好的方法是使用 [LangSmith](https://smith.langchain.com)。

在上述链接注册后，请确保设置环境变量以开始记录追踪：

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."
```

### 组件

我们需要从 LangChain 的集成套件中选择三个组件。

选择一个聊天模型：

<!--@include: @/snippets/javascript/chat-model-tabs-js.md-->

选择一个嵌入模型：

<!--@include: @/snippets/javascript/embeddings-tabs-js.md-->

选择一个向量存储：

<!--@include: @/snippets/javascript/vectorstore-tabs-js.md-->

## 1. 索引

<Note>

<strong>本节是[语义搜索教程](/oss/javascript/langchain/knowledge-base)内容的精简版。</strong>

如果你的数据已经建立索引并可供搜索（即，你有一个执行搜索的函数），或者你熟悉[文档加载器](/oss/javascript/langchain/retrieval#document_loaders)、[嵌入](/oss/javascript/langchain/retrieval#embedding_models)和[向量存储](/oss/javascript/langchain/retrieval#vectorstores)，可以跳过本节，直接阅读下一节关于[检索与生成](/oss/javascript/langchain/rag#2-retrieval-and-generation)的内容。

</Note>

索引通常按以下方式工作：

1.  **加载**：首先我们需要加载数据。这通过[文档加载器](/oss/javascript/langchain/retrieval#document_loaders)完成。
2.  **分割**：[文本分割器](/oss/javascript/langchain/retrieval#text_splitters)将大的 `Document` 分割成更小的块。这对于索引数据和将其传递给模型都很有用，因为大块内容更难搜索，并且可能无法放入模型的有限上下文窗口。
3.  **存储**：我们需要一个地方来存储和索引我们的分割块，以便以后可以搜索它们。这通常使用[向量存储](/oss/javascript/langchain/retrieval#vectorstores)和[嵌入](/oss/javascript/langchain/retrieval#embedding_models)模型来完成。

![索引示意图](/images/rag_indexing.png)

### 加载文档

我们首先需要加载博客文章的内容。我们可以使用[文档加载器](/oss/javascript/langchain/retrieval#document_loaders)，这些对象从源加载数据并返回一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link">Document</a> 对象列表。

```typescript
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const pTagSelector = "p";
const cheerioLoader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/",
  {
    selector: pTagSelector,
  }
);

const docs = await cheerioLoader.load();

console.assert(docs.length === 1);
console.log(`Total characters: ${docs[0].pageContent.length}`);
```
```
Total characters: 22360
```

```typescript
console.log(docs[0].pageContent.slice(0, 500));
```
```
Building agents with LLM (large language model) as its core controller is...
```

**深入了解**

`DocumentLoader`：从源加载数据作为 `Document` 列表的对象。

-   [集成](/oss/javascript/integrations/document_loaders/)：160+ 个集成可供选择。
-   <a href="https://reference.langchain.com/javascript/classes/_langchain_core.document_loaders_base.BaseDocumentLoader.html" target="_blank" rel="noreferrer" class="link"><code>BaseLoader</code></a>：基础接口的 API 参考。

### 分割文档

我们加载的文档超过 42k 个字符，这对于许多模型的上下文窗口来说太长了。即使对于那些能够将整篇文章放入其上下文窗口的模型，模型也可能难以在非常长的输入中找到信息。

为了解决这个问题，我们将把 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 分割成块以进行嵌入和向量存储。这应该有助于我们在运行时仅检索博客文章中最相关的部分。

与[语义搜索教程](/oss/javascript/langchain/knowledge-base)中一样，我们使用 `RecursiveCharacterTextSplitter`，它将使用换行符等常见分隔符递归地分割文档，直到每个块达到合适的大小。这是通用文本用例推荐的文本分割器。

```typescript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const allSplits = await splitter.splitDocuments(docs);
console.log(`Split blog post into ${allSplits.length} sub-documents.`);
```
```
Split blog post into 29 sub-documents.
```

### 存储文档

现在我们需要索引我们的 66 个文本块，以便在运行时可以搜索它们。遵循[语义搜索教程](/oss/javascript/langchain/knowledge-base)，我们的方法是[嵌入](/oss/javascript/langchain/retrieval#embedding_models/)每个文档分割块的内容，并将这些嵌入插入到[向量存储](/oss/javascript/langchain/retrieval#vectorstores/)中。给定一个输入查询，我们就可以使用向量搜索来检索相关文档。

我们可以使用在[教程开始](/oss/javascript/langchain/rag#components)时选择的向量存储和嵌入模型，通过一个命令嵌入和存储所有文档分割块。

```typescript
await vectorStore.addDocuments(allSplits);
```

**深入了解**

`Embeddings`：文本嵌入模型的包装器，用于将文本转换为嵌入向量。

-   [集成](/oss/javascript/integrations/text_embedding/)：30+ 个集成可供选择。
-   <a href="https://reference.langchain.com/javascript/classes/_langchain_core.embeddings.Embeddings.html" target="_blank" rel="noreferrer" class="link">接口</a>：基础接口的 API 参考。

`VectorStore`：向量数据库的包装器，用于存储和查询嵌入向量。

-   [集成](/oss/javascript/integrations/vectorstores/)：40+ 个集成可供选择。
-   [接口](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.base.VectorStore.html)：基础接口的 API 参考。

这就完成了流水线的**索引**部分。此时，我们拥有一个包含博客文章分块内容的可查询向量存储。给定一个用户问题，我们理想情况下应该能够返回回答该问题的博客文章片段。

## 2. 检索与生成

RAG 应用通常按以下方式工作：

1.  **检索**：给定用户输入，使用[检索器](/oss/javascript/langchain/retrieval#retrievers)从存储中检索相关的分割块。
2.  **生成**：[模型](/oss/javascript/langchain/models)使用一个包含问题和检索到的数据的提示来生成答案。

![检索示意图](/images/rag_
