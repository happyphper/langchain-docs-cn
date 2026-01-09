---
title: Azure AI Search
---
[Azure AI Search](https://azure.microsoft.com/products/ai-services/ai-search)（原名 Azure Search 和 Azure Cognitive Search）是一个分布式、RESTful 搜索引擎，针对 Azure 上生产规模工作负载的速度和相关性进行了优化。它还支持使用 [k-最近邻](https://en.wikipedia.org/wiki/Nearest_neighbor_search) (kNN) 算法进行向量搜索以及[语义搜索](https://learn.microsoft.com/azure/search/semantic-search-overview)。

此向量存储集成支持全文搜索、向量搜索和[混合搜索以获得最佳排名性能](https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167)。

请从[此页面](https://learn.microsoft.com/azure/search/vector-search-overview)了解如何利用 Azure AI Search 的向量搜索功能。如果您没有 Azure 账户，可以[创建一个免费账户](https://azure.microsoft.com/free/)开始使用。

## 设置

您首先需要安装 `@azure/search-documents` SDK 和 [`@langchain/community`](https://www.npmjs.com/package/@langchain/community) 包：

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install -S @langchain/community @langchain/core @azure/search-documents
```

您还需要有一个正在运行的 Azure AI Search 实例。您可以按照[本指南](https://learn.microsoft.com/azure/search/search-create-service-portal)在 Azure 门户上免费部署一个免费版本。

一旦您的实例运行起来，请确保您拥有端点和管理员密钥（查询密钥仅可用于搜索文档，不能用于索引、更新或删除）。端点是您实例的 URL，您可以在 Azure 门户中实例的“概述”部分找到。管理员密钥可以在实例的“密钥”部分找到。然后您需要设置以下环境变量：

```bash [.env vars]
# Azure AI Search 连接设置
AZURE_AISEARCH_ENDPOINT=
AZURE_AISEARCH_KEY=

# 如果您使用 Azure OpenAI API，则需要设置这些变量
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_API_INSTANCE_NAME=
AZURE_OPENAI_API_DEPLOYMENT_NAME=
AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME=
AZURE_OPENAI_API_VERSION=

# 或者您可以直接使用 OpenAI API
OPENAI_API_KEY=
```

## 关于混合搜索

混合搜索是一项结合了全文搜索和向量搜索优势以提供最佳排名性能的功能。它在 Azure AI Search 向量存储中默认启用，但您可以在创建向量存储时通过设置 `search.type` 属性来选择不同的搜索查询类型。

您可以在[官方文档](https://learn.microsoft.com/azure/search/hybrid-search-overview)中阅读更多关于混合搜索以及它如何改善搜索结果的信息。

在某些场景下，如检索增强生成 (RAG)，您可能希望在混合搜索之外启用**语义排名**以提高搜索结果的相关性。您可以在创建向量存储时将 `search.type` 属性设置为 `AzureAISearchQueryType.SemanticHybrid` 来启用语义排名。
请注意，语义排名功能仅在基本版及更高定价层中可用，并受[区域可用性](https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/?products=search)限制。

您可以在[这篇博客文章](https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167)中阅读更多关于使用语义排名与混合搜索的性能信息。

## 示例：索引文档、向量搜索和 LLM 集成

以下是一个示例，它将文件中的文档索引到 Azure AI Search 中，运行混合搜索查询，最后使用一个链（chain）基于检索到的文档以自然语言回答问题。

```typescript
import {
  AzureAISearchVectorStore,
  AzureAISearchQueryType,
} from "@langchain/community/vectorstores/azure_aisearch";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// 从文件加载文档
const loader = new TextLoader("./state_of_the_union.txt");
const rawDocuments = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 0,
});
const documents = await splitter.splitDocuments(rawDocuments);

// 创建 Azure AI Search 向量存储
const store = await AzureAISearchVectorStore.fromDocuments(
  documents,
  new OpenAIEmbeddings(),
  {
    search: {
      type: AzureAISearchQueryType.SimilarityHybrid,
    },
  }
);

// 首次运行时，将创建索引。
// 您可能需要等待一段时间才能执行搜索，或者可以提前手动创建索引。

// 执行相似性搜索
const resultDocuments = await store.similaritySearch(
  "What did the president say about Ketanji Brown Jackson?"
);

console.log("Similarity search results:");
console.log(resultDocuments[0].pageContent);
/*
  Tonight. I call on the Senate to: Pass the Freedom to Vote Act. Pass the John Lewis Voting Rights Act. And while you’re at it, pass the Disclose Act so Americans can know who is funding our elections.

  Tonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service.

  One of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.

  And I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.
*/

// 将存储用作链的一部分
const model = new ChatOpenAI({ model: "gpt-3.5-turbo-1106" });
const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's questions based on the below context:\n\n{context}",
  ],
  ["human", "{input}"],
]);

const combineDocsChain = await createStuffDocumentsChain({
  llm: model,
  prompt: questionAnsweringPrompt,
});

const chain = await createRetrievalChain({
  retriever: store.asRetriever(),
  combineDocsChain,
});

const response = await chain.invoke({
  input: "What is the president's top priority regarding prices?",
});

console.log("Chain response:");
console.log(response.answer);
/*
  The president's top priority is getting prices under control.
*/
```

## 相关链接

- 向量存储[概念指南](/oss/integrations/vectorstores)
- 向量存储[操作指南](/oss/integrations/vectorstores)
