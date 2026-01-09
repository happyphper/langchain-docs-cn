---
title: HuggingFaceInference
---
以下是一个将 HuggingFaceInference 模型作为 LLM 调用的示例：

```bash [npm]
npm install @langchain/community @langchain/core @huggingface/inference@4
```

<Tip>

我们正在统一所有包中的模型参数。现在建议使用 `model` 代替 `modelName`，并使用 `apiKey` 作为 API 密钥的参数名。

</Tip>

```typescript
import { HuggingFaceInference } from "@langchain/community/llms/hf";

const model = new HuggingFaceInference({
  model: "gpt2",
  apiKey: "YOUR-API-KEY", // 在 Node.js 中默认为 process.env.HUGGINGFACEHUB_API_KEY
});
const res = await model.invoke("1 + 1 =");
console.log({ res });
```

## 相关链接

- [模型指南](/oss/langchain/models)
