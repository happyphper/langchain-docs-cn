---
title: Alchemyst AI 检索器
description: 将 Alchemyst AI 检索器集成到您的生成式 AI 应用程序中
---
# Alchemyst AI 检索器

[**Alchemyst AI 检索器**](https://getalchemystai.com) 使您的生成式 AI 应用能够检索相关的上下文和知识。它从 Alchemyst 平台获取这些信息。它提供了一个统一的接口，用于访问、搜索和检索数据，以增强 LLM 和智能体的响应。

## 设置

1. 如果您还没有账户，请在 [Alchemyst 平台](https://platform.getalchemystai.com/signup) 上注册一个新账户。
2. 登录后，前往 [**Alchemyst 平台设置**](https://platform.getalchemystai.com/settings) 获取您的 API 密钥。

<Tip>

有关安装 LangChain 包的通用说明，请参阅 [此部分](/oss/javascript/langchain/install)。

</Tip>

::: code-group

```sh [npm]
npm i @alchemystai/langchain-js
```

```sh [yarn]
yarn add @alchemystai/langchain-js
```

```sh [pnpm]
pnpm add @alchemystai/langchain-js
```

```sh [bun]
bun add @alchemystai/langchain-js
```

:::

## 使用方法

```typescript
import { AlchemystRetriever } from "@alchemystai/langchain-js";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";

dotenv.config();

// 使用您的 API 密钥和可选配置实例化检索器
const retriever = new AlchemystRetriever({
  apiKey: process.env.ALCHEMYST_AI_API_KEY!,
  similarityThreshold: 0.8,
  minimumSimilarityThreshold: 0.5,
  scope: "internal"
});

// 示例：在 LangChain 管道中使用检索器
async function main() {
  // 创建一个简单的管道，用于检索文档并输出其内容
  const pipeline = RunnableSequence.from([
    async (input: string) => {
      const docs = await retriever.getRelevantDocuments(input);
      return docs.map(doc => doc.pageContent).join("\n---\n");
    }
  ]);

  const query = "Show me the latest HR policies"; // 在此处输入您的业务/实际查询
  const result = await pipeline.invoke(query);

  console.log("Retrieved Documents:\n", result);
}

main().catch(console.error);
```

## 支持与反馈
如需支持、反馈或报告问题，请访问 [Alchemyst AI 文档](https://docs.getalchemystai.com)，您可以在其中找到最新的联系方式和社区信息。
