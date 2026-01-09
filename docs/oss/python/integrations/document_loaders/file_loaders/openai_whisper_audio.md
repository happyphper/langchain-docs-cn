---
title: Open AI Whisper 音频
---
<提示>
**兼容性说明**

仅适用于 Node.js 环境。
</提示>

本文档介绍如何使用 [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text) API 从音频文件中加载文档对象。

## 环境设置

要运行此加载器，您需要在 OpenAI 上创建一个账户，并从 https://platform.openai.com/account 页面获取一个认证密钥。

## 使用方法

配置好认证密钥后，您可以使用该加载器创建转录文本，然后将其转换为文档。

```typescript
import { OpenAIWhisperAudio } from "@langchain/community/document_loaders/fs/openai_whisper_audio";

const filePath = "./src/document_loaders/example_data/test.mp3";

const loader = new OpenAIWhisperAudio(filePath, {
  transcriptionCreateParams: {
    language: "en",
  },
});

const docs = await loader.load();

console.log(docs);
```
