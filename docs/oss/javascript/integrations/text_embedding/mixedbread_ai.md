---
title: Mixedbread AI
---
`MixedbreadAIEmbeddings` 类使用 [Mixedbread AI](https://mixedbread.ai/) API 来生成文本嵌入向量。本指南将引导您完成 `MixedbreadAIEmbeddings` 类的设置和使用，帮助您有效地将其集成到项目中。

## 安装

要安装 `@langchain/mixedbread-ai` 包，请使用以下命令：

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/mixedbread-ai @langchain/core
```

## 初始化

首先，在 Mixedbread AI 网站上注册，并从[此处](https://mixedbread.ai/)获取您的 API 密钥。然后，您可以使用此密钥来初始化 `MixedbreadAIEmbeddings` 类。

您可以将 API 密钥直接传递给构造函数，或将其设置为环境变量 (`MXBAI_API_KEY`)。

### 基本用法

以下是创建 `MixedbreadAIEmbeddings` 实例的方法：

```typescript
import { MixedbreadAIEmbeddings } from "@langchain/mixedbread-ai";

const embeddings = new MixedbreadAIEmbeddings({
  apiKey: "YOUR_API_KEY",
  // 可选地指定模型
  // model: "mixedbread-ai/mxbai-embed-large-v1",
});
```

如果未提供 `apiKey`，它将从 `MXBAI_API_KEY` 环境变量中读取。

## 生成嵌入向量

### 嵌入单个查询

要为单个文本查询生成嵌入向量，请使用 `embedQuery` 方法：

```typescript
const embedding = await embeddings.embedQuery(
  "Represent this sentence for searching relevant passages: Is baking fun?"
);
console.log(embedding);
```

### 嵌入多个文档

要为多个文档生成嵌入向量，请使用 `embedDocuments` 方法。此方法会根据 `batchSize` 参数自动处理批处理：

```typescript
const documents = ["Baking bread is fun", "I love baking"];

const embeddingsArray = await embeddings.embedDocuments(documents);
console.log(embeddingsArray);
```

## 自定义请求

您可以通过传递额外的参数来自定义 SDK。

```typescript
const customEmbeddings = new MixedbreadAIEmbeddings({
  apiKey: "YOUR_API_KEY",
  baseUrl: "...",
  maxRetries: 6,
});
```

## 错误处理

如果未提供 API 密钥且无法在环境变量中找到，将抛出错误：

```typescript
try {
  const embeddings = new MixedbreadAIEmbeddings();
} catch (error) {
  console.error(error);
}
```

## 相关链接

- 嵌入模型[概念指南](/oss/javascript/integrations/text_embedding)
- 嵌入模型[操作指南](/oss/javascript/integrations/text_embedding)
