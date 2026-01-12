---
title: IBM watsonx.ai
---
本文将帮助您开始使用 LangChain 集成 IBM watsonx.ai 的[嵌入模型](/oss/javascript/integrations/text_embedding)。关于 `IBM watsonx.ai` 功能的详细文档和配置选项，请参阅 [API 参考](https://api.js.langchain.com/modules/_langchain_community.embeddings_ibm.html)。

## 概述

### 集成详情

| 类 | 包 | 本地 | [Python 支持](https://python.langchain.com/docs/integrations/text_embedding/ibm_watsonx/) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: |
| [`WatsonxEmbeddings`](https://api.js.langchain.com/classes/_langchain_community.embeddings_ibm.WatsonxEmbeddings.html) | [@langchain/community](https://www.npmjs.com/package/@langchain/community)| ❌ | ✅  | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/community?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/community?style=flat-square&label=%20&) |

## 设置

要访问 IBM WatsonxAI 嵌入模型，您需要创建一个 IBM watsonx.ai 账户，获取一个 API 密钥或其他类型的凭据，并安装 `@langchain/community` 集成包。

### 凭据

前往 [IBM Cloud](https://cloud.ibm.com/login) 注册 IBM watsonx.ai 并生成 API 密钥，或提供如下所示的其他身份验证形式。

#### IAM 身份验证

```bash
export WATSONX_AI_AUTH_TYPE=iam
export WATSONX_AI_APIKEY=<YOUR-APIKEY>
```

#### Bearer token 身份验证

```bash
export WATSONX_AI_AUTH_TYPE=bearertoken
export WATSONX_AI_BEARER_TOKEN=<YOUR-BEARER-TOKEN>
```

#### IBM watsonx.ai 软件身份验证

```bash
export WATSONX_AI_AUTH_TYPE=cp4d
export WATSONX_AI_USERNAME=<YOUR_USERNAME>
export WATSONX_AI_PASSWORD=<YOUR_PASSWORD>
export WATSONX_AI_URL=<URL>
```

一旦这些值被设置到您的环境变量中，并且对象被初始化，身份验证将自动进行。

也可以通过将这些值作为参数传递给新实例来完成身份验证。

## IAM 身份验证

```typescript
import { WatsonxEmbeddings } from "@langchain/community/embeddings/ibm";

const props = {
  version: "YYYY-MM-DD",
  serviceUrl: "<SERVICE_URL>",
  projectId: "<PROJECT_ID>",
  watsonxAIAuthType: "iam",
  watsonxAIApikey: "<YOUR-APIKEY>",
};
const instance = new WatsonxEmbeddings(props);
```

## Bearer token 身份验证

```typescript
import { WatsonxEmbeddings } from "@langchain/community/embeddings/ibm";

const props = {
  version: "YYYY-MM-DD",
  serviceUrl: "<SERVICE_URL>",
  projectId: "<PROJECT_ID>",
  watsonxAIAuthType: "bearertoken",
  watsonxAIBearerToken: "<YOUR-BEARERTOKEN>",
};
const instance = new WatsonxEmbeddings(props);
```

### IBM watsonx.ai 软件身份验证

```typescript
import { WatsonxEmbeddings } from "@langchain/community/embeddings/ibm";

const props = {
  version: "YYYY-MM-DD",
  serviceUrl: "<SERVICE_URL>",
  projectId: "<PROJECT_ID>",
  watsonxAIAuthType: "cp4d",
  watsonxAIUsername: "<YOUR-USERNAME>",
  watsonxAIPassword: "<YOUR-PASSWORD>",
  watsonxAIUrl: "<url>",
};
const instance = new WatsonxEmbeddings(props);
```

如果您希望自动追踪您的模型调用，也可以通过取消注释以下内容来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain IBM watsonx.ai 集成位于 `@langchain/community` 包中：

::: code-group

```bash [npm]
npm install @langchain/community @langchain/core
```

```bash [yarn]
yarn add @langchain/community @langchain/core
```

```bash [pnpm]
pnpm add @langchain/community @langchain/core
```

:::

## 实例化

现在我们可以实例化我们的模型对象并嵌入文本：

```javascript
import { WatsonxEmbeddings } from "@langchain/community/embeddings/ibm";

const embeddings = new WatsonxEmbeddings({
  version: "YYYY-MM-DD",
  serviceUrl: process.env.API_URL,
  projectId: "<PROJECT_ID>",
  spaceId: "<SPACE_ID>",
  model: "<MODEL_ID>",
});
```

注意：

- 您必须提供 `spaceId` 或 `projectId` 才能继续。
- 根据您预配的服务实例所在区域，使用正确的 serviceUrl。

### 模型网关

```typescript
import { WatsonxEmbeddings } from "@langchain/community/embeddings/ibm";

const instance = new WatsonxEmbeddings({
  version: "YYYY-MM-DD",
  serviceUrl: process.env.API_URL,
  model: "<ALIAS_MODEL_ID>",
  modelGateway: true,
});
```

## 索引与检索

嵌入模型通常用于检索增强生成 (RAG) 流程中，既用于索引数据，也用于后续检索。更详细的说明，请参阅 [**学习** 标签页](/oss/javascript/learn/)下的 RAG 教程。

下面，我们将展示如何使用上面初始化的 `embeddings` 对象来索引和检索数据。在此示例中，我们将使用演示用的 [`MemoryVectorStore`](/oss/javascript/integrations/vectorstores/memory) 来索引和检索一个示例文档。

```javascript
// 使用示例文本创建向量存储
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const text = "LangChain is the framework for building context-aware reasoning applications";

const vectorstore = await MemoryVectorStore.fromDocuments(
  [{ pageContent: text, metadata: {} }],
  embeddings,
);

// 将向量存储用作返回单个文档的检索器
const retriever = vectorstore.asRetriever(1);

// 检索最相似的文本
const retrievedDocuments = await retriever.invoke("What is LangChain?");

retrievedDocuments[0].pageContent;
```

```text
LangChain is the framework for building context-aware reasoning applications
```

## 直接使用

在底层，向量存储和检索器的实现分别调用 `embeddings.embedDocument(...)` 和 `embeddings.embedQuery(...)` 来为 `fromDocuments` 中使用的文本和检索器的 `invoke` 操作创建嵌入向量。

您可以直接调用这些方法来获取嵌入向量，以满足您自己的用例。

### 嵌入单个文本

您可以使用 `embedQuery` 嵌入查询以进行搜索。这会生成特定于查询的向量表示：

```javascript
const singleVector = await embeddings.embedQuery(text);
singleVector.slice(0, 10);
```

```text
[
   -0.017436018,  -0.01469498,
   -0.015685871, -0.013543149,
  -0.0011519607, -0.008123747,
    0.015286108, -0.023845721,
    -0.02454774,   0.07235078
]
```

### 嵌入多个文本

您可以使用 `embedDocuments` 嵌入多个文本以进行索引。此方法内部使用的机制可能（但不一定）与嵌入查询不同：

```javascript
const text2 = "LangGraph is a library for building stateful, multi-actor applications with LLMs";

const vectors = await embeddings.embedDocuments([text, text2]);

console.log(vectors[0].slice(0, 10));
console.log(vectors[1].slice(0, 10));
```

```text
[
  -0.017436024, -0.014695002,
   -0.01568589, -0.013543164,
  -0.001151976, -0.008123703,
   0.015286064, -0.023845702,
  -0.024547677,   0.07235076
]
[
     0.03278884, -0.017893745,
  -0.0027520044,  0.016506646,
    0.028271576,  -0.01284331,
    0.014344065, -0.007968607,
    -0.03899479,  0.039327156
]
```

---

## API 参考

关于所有 __module_name__ 功能和配置的详细文档，请前往 API 参考：__api_ref_module__
