---
title: 阿里巴巴通义
---
`AlibabaTongyiEmbeddings` 类使用阿里巴巴通义 API 为给定文本生成嵌入向量。

## 设置

你需要注册一个阿里巴巴 API 密钥，并将其设置为名为 `ALIBABA_API_KEY` 的环境变量。

然后，你需要安装 [`@langchain/community`](https://www.npmjs.com/package/@langchain/community) 包：

<Tip>

关于安装 LangChain 包的通用说明，请参阅[此部分](/oss/python/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core
```

## 用法

```typescript
import { AlibabaTongyiEmbeddings } from "@langchain/community/embeddings/alibaba_tongyi";

const model = new AlibabaTongyiEmbeddings({});
const res = await model.embedQuery(
  "What would be a good company name a company that makes colorful socks?"
);
console.log({ res });
```

## 相关链接

- 嵌入模型[概念指南](/oss/python/integrations/text_embedding)
- 嵌入模型[操作指南](/oss/python/integrations/text_embedding)
