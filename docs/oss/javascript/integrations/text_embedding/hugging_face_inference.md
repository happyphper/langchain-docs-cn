---
title: HuggingFace 推理
---
该嵌入集成使用 HuggingFace Inference API 为给定文本生成嵌入，默认使用 `BAAI/bge-base-en-v1.5` 模型。您可以通过向构造函数传递不同的模型名称来使用其他模型。

## 安装

首先需要安装 [`@langchain/community`](https://www.npmjs.com/package/@langchain/community) 包及其必需的 peer 依赖：

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core @huggingface/inference@4
```

## 使用

```typescript
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: "YOUR-API-KEY", // 默认为 process.env.HUGGINGFACEHUB_API_KEY
  model: "MODEL-NAME", // 如果未提供，默认为 `BAAI/bge-base-en-v1.5`
  provider: "MODEL-PROVIDER", // 如果未提供，将回退到 Hugging Face Inference API 内的自动选择机制
});
```

> **注意：**
> 如果您未提供 `model`，将会记录警告并使用默认模型 `BAAI/bge-base-en-v1.5`。
> 如果您未提供 `provider`，Hugging Face 将默认使用 `auto` 选择，这将根据您在 https://hf.co/settings/inference-providers 的设置，为该模型选择第一个可用的提供商。

> **提示：**
> `hf-inference` 是 Hugging Face 直接托管的模型的提供商名称。

## 相关

- 嵌入模型[概念指南](/oss/integrations/text_embedding)
- 嵌入模型[操作指南](/oss/integrations/text_embedding)
