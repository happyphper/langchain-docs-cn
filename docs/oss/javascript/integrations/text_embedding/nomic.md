---
title: Nomic
---
`NomicEmbeddings` 类使用 Nomic AI API 为给定文本生成嵌入向量。

## 设置

要使用 Nomic API，您需要一个 API 密钥。
您可以注册一个 Nomic 账户并在此处创建 API 密钥 [here](https://atlas.nomic.ai/)。

首先，您需要安装 [`@langchain/nomic`](https://www.npmjs.com/package/@langchain/nomic) 包：

<Tip>

有关安装 LangChain 包的通用说明，请参阅 [此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/nomic @langchain/core
```

## 用法

```typescript
import { NomicEmbeddings } from "@langchain/nomic";

/* 嵌入查询 */
const nomicEmbeddings = new NomicEmbeddings();
const res = await nomicEmbeddings.embedQuery("Hello world");
console.log(res);
/* 嵌入文档 */
const documentRes = await nomicEmbeddings.embedDocuments([
  "Hello world",
  "Bye bye",
]);
console.log(documentRes);
```

## 相关链接

- 嵌入模型 [概念指南](/oss/javascript/integrations/text_embedding)
- 嵌入模型 [操作指南](/oss/javascript/integrations/text_embedding)
