---
title: AWSKendraRetriever
---
## 概述

[Amazon Kendra](https://aws.amazon.com/kendra/) 是亚马逊网络服务（AWS）提供的一项智能搜索服务。
它利用先进的自然语言处理（NLP）和机器学习算法，为组织内的各种数据源提供强大的搜索能力。
Kendra 旨在帮助用户快速准确地找到所需信息，从而提高生产力和决策效率。

借助 Kendra，用户可以跨多种内容类型进行搜索，包括文档、常见问题解答、知识库、手册和网站。
它支持多种语言，并能理解复杂的查询、同义词和上下文含义，以提供高度相关的搜索结果。

本文将帮助您开始使用 Amazon Kendra [`retriever`](/oss/python/langchain/retrieval)。有关 `AWSKendraRetriever` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_aws.AmazonKendraRetriever.html)。

### 集成详情

| 检索器 | 数据源 | 包 |
| :--- | :--- | :---: |
[AWSKendraRetriever](https://api.js.langchain.com/classes/langchain_aws.AmazonKendraRetriever.html) | 各种 AWS 资源 | [`@langchain/aws`](https://www.npmjs.com/package/@langchain/aws) |

## 设置

您需要一个 AWS 账户和一个 Amazon Kendra 实例才能开始。有关更多信息，请参阅 AWS 的这篇[教程](https://docs.aws.amazon.com/kendra/latest/dg/getting-started.html)。

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
import { AmazonKendraRetriever } from "@langchain/aws";

const retriever = new AmazonKendraRetriever({
  topK: 10,
  indexId: "YOUR_INDEX_ID",
  region: "us-east-2", // 您的区域
  clientOptions: {
    credentials: {
      accessKeyId: "YOUR_ACCESS_KEY_ID",
      secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
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

有关 `AmazonKendraRetriever` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_aws.AmazonKendraRetriever.html)。
