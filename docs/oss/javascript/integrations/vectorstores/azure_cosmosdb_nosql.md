---
title: Azure Cosmos DB for NoSQL
---
> [Azure Cosmos DB for NoSQL](https://learn.microsoft.com/azure/cosmos-db/nosql/) 支持查询具有灵活模式的数据项，并原生支持 JSON。它现在提供了向量索引和搜索功能。此功能旨在处理高维向量，能够在任何规模下实现高效且准确的向量搜索。您现在可以将向量直接存储在文档中，与您的数据放在一起。数据库中的每个文档不仅可以包含传统的无模式数据，还可以包含高维向量作为文档的其他属性。

从[此页面](https://learn.microsoft.com/azure/cosmos-db/nosql/vector-search)了解如何利用 Azure Cosmos DB for NoSQL 的向量搜索功能。如果您没有 Azure 账户，可以[创建一个免费账户](https://azure.microsoft.com/free/)开始使用。

## 设置

您首先需要安装 [`@langchain/azure-cosmosdb`](https://www.npmjs.com/package/@langchain/azure-cosmosdb) 包：

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/azure-cosmosdb @langchain/core
```
您还需要运行一个 Azure Cosmos DB for NoSQL 实例。您可以按照[本指南](https://learn.microsoft.com/azure/cosmos-db/nosql/quickstart-portal)在 Azure 门户上免费部署一个版本。

一旦您的实例运行起来，请确保您拥有连接字符串。您可以在 Azure 门户中，在实例的“设置 / 密钥”部分找到它们。然后您需要设置以下环境变量：

```bash [.env example]
# 使用连接字符串进行身份验证
AZURE_COSMOSDB_NOSQL_CONNECTION_STRING=

# 使用托管标识进行身份验证
AZURE_COSMOSDB_NOSQL_ENDPOINT=
```

### 使用 Azure 托管标识

如果您使用 Azure 托管标识，可以像这样配置凭据：

```typescript
import { AzureCosmosDBNoSQLVectorStore } from "@langchain/azure-cosmosdb";
import { OpenAIEmbeddings } from "@langchain/openai";

// 创建 Azure Cosmos DB 向量存储
const store = new AzureCosmosDBNoSQLVectorStore(new OpenAIEmbeddings(), {
  // 或使用环境变量 AZURE_COSMOSDB_NOSQL_ENDPOINT
  endpoint: "https://my-cosmosdb.documents.azure.com:443/",

  // 数据库和容器必须已存在
  databaseName: "my-database",
  containerName: "my-container",
});
```

<Info>

<strong>当使用 Azure 托管标识和基于角色的访问控制时，您必须确保数据库和容器已预先创建。RBAC 不提供创建数据库和容器的权限。您可以在 [Azure Cosmos DB 文档](https://learn.microsoft.com/azure/cosmos-db/how-to-setup-rbac#permission-model) 中获取有关权限模型的更多信息。</strong>

</Info>

### 使用过滤器时的安全考虑

<Warning>

<strong>如果数据未经过适当清理，将用户提供的输入与过滤器一起使用可能存在安全风险。请遵循以下建议以防止潜在的安全问题。</strong>

</Warning>

允许将原始用户输入连接到类似 SQL 的子句（例如 `WHERE ${userFilter}`）中，会带来 SQL 注入攻击的关键风险，可能暴露意外数据或损害系统的完整性。为了缓解此风险，请始终使用 Azure Cosmos DB 的参数化查询机制，传入 `@param` 占位符，从而将查询逻辑与用户提供的输入清晰地分开。

以下是不安全代码的示例：

```typescript
import { AzureCosmosDBNoSQLVectorStore } from "@langchain/azure-cosmosdb";

const store = new AzureCosmosDBNoSQLVectorStore(embeddings, {});

// 不安全：用户控制的输入被注入到查询中
const userId = req.query.userId; // 例如 "123' OR 1=1"
const unsafeQuerySpec = {
  query: `SELECT * FROM c WHERE c.metadata.userId = '${userId}'`,
};

await store.delete({ filter: unsafeQuerySpec });
```
如果攻击者提供 `123 OR 1=1`，那么查询将变为 `SELECT * FROM c WHERE c.metadata.userId = '123' OR 1=1`，这会强制条件始终为真，导致其绕过预期的过滤器并删除所有文档。

为了防止这种注入风险，您可以定义一个占位符，如 `@userId`，然后 Cosmos DB 将用户输入作为参数单独绑定，确保它被严格视为数据而不是可执行的查询逻辑，如下所示。

```typescript
import { SqlQuerySpec } from "@azure/cosmos";

const safeQuerySpec: SqlQuerySpec = {
  query: "SELECT * FROM c WHERE c.metadata.userId = @userId",
  parameters: [{ name: "@userId", value: userId }],
};

await store.delete({ filter: safeQuerySpec });
```

现在，如果攻击者输入 `123 OR 1=1`，该输入将被视为要匹配的字面字符串值，而不是查询结构的一部分。

请参阅关于 [Azure Cosmos DB for NoSQL 中的参数化查询](https://learn.microsoft.com/azure/cosmos-db/nosql/query/parameterized-queries) 的官方文档，以获取更多使用示例和最佳实践。

## 使用示例

以下是一个示例，演示了如何在 Azure Cosmos DB for NoSQL 中索引来自文件的文档，运行向量搜索查询，最后使用链基于检索到的文档以自然语言回答问题。

```typescript
import { AzureCosmosDBNoSQLVectorStore } from "@langchain/azure-cosmosdb";
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

// 创建 Azure Cosmos DB 向量存储
const store = await AzureCosmosDBNoSQLVectorStore.fromDocuments(
  documents,
  new OpenAIEmbeddings(),
  {
    databaseName: "langchain",
    containerName: "documents",
  }
);

// 执行相似性搜索
const resultDocuments = await store.similaritySearch(
  "What did the president say about Ketanji Brown Jackson?"
);

console.log("相似性搜索结果：");
console.log(resultDocuments[0].pageContent);
/*
  今晚。我呼吁参议院：通过《投票自由法案》。通过《约翰·刘易斯投票权法案》。同时，通过《披露法案》，以便美国人能够知道谁在资助我们的选举。

  今晚，我想向一位毕生致力于服务这个国家的人致敬：斯蒂芬·布雷耶大法官——一位陆军退伍军人、宪法学者，以及即将退休的美国最高法院大法官。布雷耶大法官，感谢您的服务。

  总统最严肃的宪法职责之一就是提名某人担任美国最高法院大法官。

  我在四天前做到了这一点，当时我提名了联邦上诉法院法官凯坦吉·布朗·杰克逊。她是我们国家顶尖的法律人才之一，将继续传承布雷耶大法官的卓越传统。
*/

// 将存储用作链的一部分
const model = new ChatOpenAI({ model: "gpt-3.5-turbo-1106" });
const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "根据以下上下文回答用户的问题：\n\n{context}",
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

const res = await chain.invoke({
  input: "What is the president's top priority regarding prices?",
});

console.log("链式响应：");
console.log(res.answer);
/*
  总统的首要任务是控制物价。
*/

// 清理
await store.delete();
```

## 相关

- 向量存储 [概念指南](/oss/javascript/integrations/vectorstores)
- 向量存储 [操作指南](/oss/javascript/integrations/vectorstores)
