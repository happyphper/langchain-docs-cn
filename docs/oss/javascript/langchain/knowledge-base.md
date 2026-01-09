---
title: 使用 LangChain 构建语义搜索引擎
sidebarTitle: Semantic search
---


## 概述

本教程将帮助你熟悉 LangChain 的[文档加载器](/oss/langchain/retrieval#document-loaders)、[嵌入模型](/oss/langchain/retrieval#embedding-models)和[向量存储](/oss/langchain/retrieval#vector-store)抽象。这些抽象旨在支持从（向量）数据库和其他来源检索数据，以便与 LLM 工作流集成。对于需要获取数据以进行推理的应用程序（例如检索增强生成或 [RAG](/oss/langchain/retrieval)）来说，它们非常重要。

在这里，我们将基于一个 PDF 文档构建一个搜索引擎。这将允许我们检索 PDF 中与输入查询相似的段落。本指南还包括在搜索引擎之上实现一个最小的 RAG 应用。

### 概念

本指南侧重于文本数据的检索。我们将涵盖以下概念：

- [文档和文档加载器](/oss/integrations/document_loaders)；
- [文本分割器](/oss/integrations/splitters)；
- [嵌入模型](/oss/integrations/text_embedding)；
- [向量存储](/oss/integrations/vectorstores) 和 [检索器](/oss/integrations/retrievers)。

## 设置

### 安装

本指南需要 `@langchain/community` 和 `pdf-parse`：

::: code-group

```bash [npm]
npm i @langchain/community pdf-parse
```

```bash [yarn]
yarn add @langchain/community pdf-parse
```

```bash [pnpm]
pnpm add @langchain/community pdf-parse
```

:::

更多详情，请参阅我们的[安装指南](/oss/langchain/install)。

### LangSmith

使用 LangChain 构建的许多应用程序将包含多个步骤和多次 LLM 调用。随着这些应用程序变得越来越复杂，能够检查链或代理内部究竟发生了什么变得至关重要。最好的方法是使用 [LangSmith](https://smith.langchain.com)。

在上述链接注册后，请确保设置环境变量以开始记录追踪：

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."
```

## 1. 文档和文档加载器

LangChain 实现了 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link">Document</a> 抽象，旨在表示一个文本单元及其关联的元数据。它有三个属性：

- `pageContent`：表示内容的字符串；
- `metadata`：包含任意元数据的字典；
- `id`：（可选）文档的字符串标识符。

`metadata` 属性可以捕获文档来源的信息、与其他文档的关系以及其他信息。请注意，单个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象通常代表较大文档的一个片段。

我们可以根据需要生成示例文档：

```typescript
import { Document } from "@langchain/core/documents";

const documents = [
  new Document({
    pageContent:
      "Dogs are great companions, known for their loyalty and friendliness.",
    metadata: { source: "mammal-pets-doc" },
  }),
  new Document({
    pageContent: "Cats are independent pets that often enjoy their own space.",
    metadata: { source: "mammal-pets-doc" },
  }),
];
```

然而，LangChain 生态系统实现了[文档加载器](/oss/langchain/retrieval#document-loaders)，这些加载器[与数百个常见来源集成](/oss/integrations/document_loaders/)。这使得将来自这些来源的数据整合到你的 AI 应用程序中变得容易。

### 加载文档

让我们将一个 PDF 加载到一系列 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象中。[这里是一个示例 PDF](https://github.com/langchain-ai/langchain/blob/v0.3/docs/docs/example_data/nke-10k-2023.pdf) —— 耐克 2023 年的 10-K 文件。我们可以查阅 LangChain 文档以了解[可用的 PDF 文档加载器](/oss/integrations/document_loaders/#pdfs)。

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("../../data/nke-10k-2023.pdf");

const docs = await loader.load();
console.log(docs.length);
```

```text
107
```

`PDFLoader` 为每个 PDF 页面加载一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象。对于每个对象，我们可以轻松访问：

- 页面的字符串内容；
- 包含文件名和页码的元数据。

```typescript
console.log(docs[0].pageContent.slice(0, 200));
```

```text
Table of Contents
UNITED STATES
SECURITIES AND EXCHANGE COMMISSION
Washington, D.C. 20549
FORM 10-K
(Mark One)
☑ ANNUAL REPORT PURSUANT TO SECTION 13 OR 15(D) OF THE SECURITIES EXCHANGE ACT OF 1934
FO
```

```typescript
console.log(docs[0].metadata);
```

```javascript
{
  source: '../../data/nke-10k-2023.pdf',
  pdf: {
    version: '1.10.100',
    info: {
      PDFFormatVersion: '1.4',
      IsAcroFormPresent: false,
      IsXFAPresent: false,
      Title: '0000320187-23-000039',
      Author: 'EDGAR Online, a division of Donnelley Financial Solutions',
      Subject: 'Form 10-K filed on 2023-07-20 for the period ending 2023-05-31',
      Keywords: '0000320187-23-000039; ; 10-K',
      Creator: 'EDGAR Filing HTML Converter',
      Producer: 'EDGRpdf Service w/ EO.Pdf 22.0.40.0',
      CreationDate: "D:20230720162200-04'00'",
      ModDate: "D:20230720162208-04'00'"
    },
    metadata: null,
    totalPages: 107
  },
  loc: { pageNumber: 1 }
}
```

### 分割

对于信息检索和下游的问答目的，一个页面可能是一个过于粗糙的表示。我们的最终目标是检索能够回答输入查询的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象，进一步分割我们的 PDF 将有助于确保文档相关部分的意义不会被周围的文本“冲淡”。

我们可以为此使用[文本分割器](/oss/langchain/retrieval#text_splitters)。这里我们将使用一个基于字符进行分割的简单文本分割器。我们将文档分割成 1000 个字符的块，块之间有 200 个字符的重叠。重叠有助于减轻将语句与其重要上下文分离的可能性。我们使用 `RecursiveCharacterTextSplitter`，它将使用常见分隔符（如换行符）递归地分割文档，直到每个块达到适当的大小。这是通用文本用例的推荐文本分割器。

```typescript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const allSplits = await textSplitter.splitDocuments(docs);

console.log(allSplits.length);
```

```text
514
```

## 2. 嵌入模型

向量搜索是存储和搜索非结构化数据（如非结构化文本）的常见方法。其思想是存储与文本关联的数字向量。给定一个查询，我们可以将其[嵌入](/oss/langchain/retrieval#embedding_models)为相同维度的向量，并使用向量相似度度量（如余弦相似度）来识别相关文本。

LangChain 支持[数十个提供商的嵌入模型](/oss/integrations/text_embedding/)。这些模型指定了如何将文本转换为数字向量。让我们选择一个模型：

<!--@include: @/snippets/javascript/embeddings-tabs-js.md-->

```typescript
const vector1 = await embeddings.embedQuery(allSplits[0].pageContent);
const vector2 = await embeddings.embedQuery(allSplits[1].pageContent);

assert vector1.length === vector2.length;
console.log(`Generated vectors of length ${vector1.length}\n`);
console.log(vector1.slice(0, 10));
```

```text
Generated vectors of length 1536

[-0.008586574345827103, -0.03341241180896759, -0.008936782367527485, -0.0036674530711025, 0.010564599186182022, 0.009598285891115665, -0.028587326407432556, -0.015824200585484505, 0.0030416189692914486, -0.012899317778646946]
```
有了生成文本嵌入的模型，接下来我们可以将它们存储在支持高效相似性搜索的特殊数据结构中。

## 3. 向量存储

LangChain 的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.vectorstores.VectorStore.html" target="_blank" rel="noreferrer" class="link">VectorStore</a> 对象包含将文本和 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象添加到存储中的方法，以及使用各种相似性度量进行查询的方法。它们通常使用[嵌入模型](/oss/langchain/retrieval#embedding_models)进行初始化，该模型决定了文本数据如何转换为数字向量。

LangChain 包含一系列与不同向量存储技术的[集成](/oss/integrations/vectorstores)。一些向量存储由提供商托管（例如，各种云提供商），需要使用特定的凭据；一些（如 [Postgres](/oss/integrations/vectorstores/pgvector)）运行在可以本地运行或通过第三方运行的独立基础设施中；其他一些可以内存运行以处理轻量级工作负载。让我们选择一个向量存储：

<!--@include: @/snippets/javascript/vectorstore-tabs-js.md-->

实例化向量存储后，我们现在可以对文档建立索引。

```typescript
await vectorStore.addDocuments(allSplits);
```

请注意，大多数向量存储实现都允许你连接到现有的向量存储——例如，通过提供客户端、索引名称或其他信息。有关更多详细信息，请参阅特定[集成](/oss/integrations/vectorstores)的文档。

一旦我们实例化了一个包含文档的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.vectorstores.VectorStore.html" target="_blank" rel="noreferrer" class="link"><code>VectorStore</code></a>，我们就可以查询它。<a href="https://reference.langchain.com/javascript/classes/_langchain_core.vectorstores.VectorStore.html" target="_blank" rel="noreferrer" class="link">VectorStore</a> 包含用于查询的方法：
- 同步和异步；
- 通过字符串查询和向量查询；
- 返回和不返回相似性分数；
- 通过相似性和 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.vectorstores.VectorStore.html#maxMarginalRelevanceSearch" target="_blank" rel="noreferrer" class="link">最大边际相关性</a>（以平衡查询相似性与检索结果的多样性）。

这些方法通常在其输出中包含一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link">Document</a> 对象列表。

**用法**

嵌入模型通常将文本表示为“密集”向量，使得具有相似含义的文本在几何上接近。这使我们只需传入一个问题即可检索相关信息，而无需了解文档中使用的任何特定关键词。

根据与字符串查询的相似性返回文档：

```typescript
const results1 = await vectorStore.similaritySearch(
  "When was Nike incorporated?"
);

console.log(results1[0]);
```

```javascript
Document {
    pageContent: 'direct to consumer operations sell products...',
    metadata: {'page': 4, 'source': '../example_data/nke-10k-2023.pdf', 'start_index': 3125}
}
```

返回分数：

:::python

```python
# 请注意，不同提供商实现的分数不同；这里的分数是一个距离度量，与相似性成反比。

results = vector_store.similarity_search_with_score("What was Nike's revenue in 2023?")
doc, score = results[0]
print(f"Score: {score}\n")
print(doc)
```

```python
Score: 0.23699893057346344

page_content='Table of Contents
FISCAL 2023 NIKE BRAND REVENUE HIGHLIGHTS
The following tables present NIKE Brand revenues disaggregated by reportable operating segment, distribution channel and major product line:
FISCAL 2023 COMPARED TO FISCAL 2022
•NIKE, Inc. Revenues were $51.2 billion in fiscal 2023, which increased 10% and 16% compared to fiscal 2022 on a reported and currency-neutral basis, respectively.
The increase was due to higher revenues in North America, Europe, Middle East & Africa ("EMEA"), APLA and Greater China, which contributed approximately 7, 6,
2 and 1 percentage points to NIKE, Inc. Revenues, respectively.
•NIKE Brand revenues, which represented over 90% of NIKE, Inc. Revenues, increased 10% and 16% on a reported and currency-neutral basis, respectively. This
increase was primarily due to higher revenues in Men's, the Jordan Brand, Women's and Kids' which grew 17%, 35%,11% and 10%, respectively, on a wholesale
equivalent basis.' metadata={'
