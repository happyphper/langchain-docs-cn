---
title: Prem AI
---
`PremEmbeddings` 类使用 Prem AI API 为给定文本生成嵌入向量。

## 设置

要使用 Prem API，您需要一个 API 密钥。您可以注册一个 Prem 账户并在此处创建 API 密钥。

您首先需要安装 [`@langchain/community`](https://www.npmjs.com/package/@langchain/community) 包：

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core
```

## 用法

```typescript
import { PremEmbeddings } from "@langchain/community/embeddings/premai";

const embeddings = new PremEmbeddings({
  // 在 Node.js 中默认为 process.env.PREM_API_KEY
  apiKey: "YOUR-API-KEY",
  // 在 Node.js 中默认为 process.env.PREM_PROJECT_ID
  project_id: "YOUR-PROJECT_ID",
  model: "@cf/baai/bge-small-en-v1.5", // 用于生成嵌入向量的模型
});

const res = await embeddings.embedQuery(
  "What would be a good company name a company that makes colorful socks?"
);
console.log({ res });
```

## 相关链接

- 嵌入模型[概念指南](/oss/integrations/text_embedding)
- 嵌入模型[操作指南](/oss/integrations/text_embedding)
