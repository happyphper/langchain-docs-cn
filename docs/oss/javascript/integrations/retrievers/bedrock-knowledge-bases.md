---
title: Amazon Bedrock 知识库
---
## 概述

本文将帮助您开始使用 [AmazonKnowledgeBaseRetriever](/oss/javascript/langchain/retrieval)。有关 AmazonKnowledgeBaseRetriever 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_aws.AmazonKnowledgeBaseRetriever.html)。

Amazon Bedrock 知识库是亚马逊云科技 (AWS) 提供的对端到端 RAG 工作流的完全托管支持。
它提供了完整的摄取工作流，可将您的文档转换为嵌入向量，并将这些嵌入存储在专门的向量数据库中。
Amazon Bedrock 知识库支持流行的向量存储数据库，包括 Amazon OpenSearch Serverless 的向量引擎、Pinecone、Redis Enterprise Cloud、Amazon Aurora（即将推出）和 MongoDB（即将推出）。

### 集成详情

| 检索器 | 自托管 | 云服务 | 包 | [Python 支持](https://python.langchain.com/docs/integrations/retrievers/bedrock/) |
| :--- | :--- | :---: | :---: | :---: |
| [AmazonKnowledgeBaseRetriever](https://api.js.langchain.com/classes/langchain_aws.AmazonKnowledgeBaseRetriever.html) | 🟠 (详见下文) | ✅ | @langchain/aws | ✅ |

> AWS 知识库检索器可以在“自托管”的意义上运行，即您可以在自己的 AWS 基础设施上运行它。但是，无法在其他云提供商或本地环境中运行。

## 设置

为了使用 AmazonKnowledgeBaseRetriever，您需要拥有一个 AWS 账户，以便管理您的索引和文档。设置好账户后，请设置以下环境变量：

```bash
process.env.AWS_KNOWLEDGE_BASE_ID=your-knowledge-base-id
process.env.AWS_ACCESS_KEY_ID=your-access-key-id
process.env.AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

如果您希望从单个查询中获得自动化追踪，也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```typescript
// process.env.LANGSMITH_API_KEY = "<YOUR API KEY HERE>";
// process.env.LANGSMITH_TRACING = "true";
```

### 安装

此检索器位于 `@langchain/aws` 包中：

::: code-group

```bash [npm]
npm install @langchain/aws @langchain/core
```

```bash [yarn]
yarn add @langchain/aws @langchain/core
```

```bash [pnpm]
pnpm add @langchain/aws @langchain/core
```

:::

## 实例化

现在我们可以实例化我们的检索器：

```typescript
import { AmazonKnowledgeBaseRetriever } from "@langchain/aws";

const retriever = new AmazonKnowledgeBaseRetriever({
  topK: 10,
  knowledgeBaseId: process.env.AWS_KNOWLEDGE_BASE_ID,
  region: "us-east-2",
  clientOptions: {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
});
```

## 使用

```typescript
const query = "..."

await retriever.invoke(query);
```

---

## API 参考

有关 AmazonKnowledgeBaseRetriever 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_aws.AmazonKnowledgeBaseRetriever.html)。
