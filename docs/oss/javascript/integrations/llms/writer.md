---
title: WRITER
---
LangChain.js 支持调用 [WRITER](https://writer.com/) 大语言模型。

## 设置

首先，您需要在 https://writer.com/ 上注册一个账户。创建一个服务账户并记下您的 API 密钥。

接下来，您需要安装官方包作为对等依赖项：

```bash [npm]
yarn add @writerai/writer-sdk
```

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core
```

## 用法

```typescript
import { Writer } from "@langchain/community/llms/writer";

const model = new Writer({
  maxTokens: 20,
  apiKey: "YOUR-API-KEY", // 在 Node.js 中默认为 process.env.WRITER_API_KEY
  orgId: "YOUR-ORGANIZATION-ID", // 在 Node.js 中默认为 process.env.WRITER_ORG_ID
});
const res = await model.invoke(
  "What would be a good company name a company that makes colorful socks?"
);
console.log({ res });
```

## 相关链接

- [模型指南](/oss/javascript/langchain/models)
