---
title: JigsawStack 提示引擎
---
LangChain.js 支持调用 JigsawStack [Prompt Engine](https://docs.jigsawstack.com/api-reference/prompt-engine/run-direct) LLMs。

## 设置

- 设置一个[账户](https://jigsawstack.com/dashboard)（免费开始使用）
- 创建并获取您的 [API 密钥](https://jigsawstack.com/dashboard)

## 凭证

```bash
export JIGSAWSTACK_API_KEY="your-api-key"
```

## 用法

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/python/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/jigsawstack
```

```ts
import { JigsawStackPromptEngine } from "@langchain/jigsawstack";

export const run = async () => {
  const model = new JigsawStackPromptEngine();
  const res = await model.invoke(
    "Tell me about the leaning tower of pisa?\nAnswer:"
  );
  console.log({ res });
};
```

## 相关链接

- [模型指南](/oss/python/langchain/models)
