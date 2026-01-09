---
title: Mixedbread AI 重排序
---
## 概述

本指南将帮助您集成并使用 [Mixedbread AI](https://mixedbread.ai/) 的重新排序（reranking）API。该重新排序 API 允许您根据给定的查询对文档列表进行重新排序，从而提高搜索结果或任何排名列表的相关性。

## 安装

首先，安装 `@langchain/mixedbread-ai` 包：

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。

</Tip>

```bash
npm install @langchain/mixedbread-ai
```

## 认证

通过在 [Mixedbread AI](https://mixedbread.ai/) 注册获取您的 API 密钥。然后，您可以将 `MXBAI_API_KEY` 环境变量设置为您的 Mixedbread AI API 密钥，或者在构造类时直接将其作为 `apiKey` 选项传入。

## 使用重新排序

`MixedbreadAIReranker` 类提供了对重新排序 API 的访问。使用方法如下：

1.  **导入类**：首先，从包中导入 `MixedbreadAIReranker` 类。

```typescript
import { MixedbreadAIReranker } from "@langchain/mixedbread-ai";
```

2.  **实例化类**：使用您的 API 密钥创建一个 `MixedbreadAIReranker` 实例。

```typescript
const reranker = new MixedbreadAIReranker({ apiKey: "your-api-key" });
```

3.  **重新排序文档**：使用 `rerankDocuments` 方法根据查询对文档进行重新排序。

```typescript
const documents = [
  { pageContent: "To bake bread you need flour" },
  { pageContent: "To bake bread you need yeast" },
  { pageContent: "To eat bread you need nothing but good taste" },
];
const query = "What do you need to bake bread?";
const result = await reranker.compressDocuments(documents, query);
console.log(result);
```

## 其他资源

更多信息，请参阅 [重新排序 API 文档](https://www.mixedbread.ai/docs/reranking/overview)。
