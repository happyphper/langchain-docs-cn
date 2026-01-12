---
title: HuggingFace Transformers
---
`TransformerEmbeddings` 类使用 [Transformers.js](https://huggingface.co/docs/transformers.js/index) 包来为给定文本生成嵌入向量。

它可以在本地运行，甚至可以直接在浏览器中运行，使您能够创建内置嵌入功能的 Web 应用。

## 安装

您需要安装 [@huggingface/transformers](https://www.npmjs.com/package/@huggingface/transformers) 包作为 peer dependency：

<Tip>

<strong>兼容性说明</strong>

如果您使用的 community 版本低于 0.3.21，请安装较旧的 `@xenova/transformers` 包，并从下面的 `"@langchain/community/embeddings/hf_transformers"` 导入嵌入向量。

</Tip>

```bash [npm]
npm install @huggingface/transformers
```

<Tip>

有关安装 LangChain 包的通用说明，请参阅 [此部分](/oss/python/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core
```

## 示例

请注意，如果您在浏览器环境中使用，您可能希望将所有与推理相关的代码放在 Web Worker 中，以避免阻塞主线程。

关于如何设置您的项目，请参阅 [本指南](https://huggingface.co/docs/transformers.js/tutorials/next) 以及 Transformers.js 文档中的其他资源。

```typescript
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

const model = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
});

/* 嵌入查询 */
const res = await model.embedQuery(
  "What would be a good company name for a company that makes colorful socks?"
);
console.log({ res });
/* 嵌入文档 */
const documentRes = await model.embedDocuments(["Hello world", "Bye bye"]);
console.log({ documentRes });
```

## 相关链接

- 嵌入模型 [概念指南](/oss/python/integrations/text_embedding)
- 嵌入模型 [操作指南](/oss/python/integrations/text_embedding)
