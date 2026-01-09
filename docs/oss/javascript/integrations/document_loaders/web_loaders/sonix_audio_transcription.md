---
title: Sonix Audio
---
<提示>
**兼容性说明**

仅在 Node.js 环境下可用。
</提示>

本文档介绍如何使用 [Sonix](https://sonix.ai/) API 从音频文件加载文档对象。

## 环境设置

要运行此加载器，您需要在 https://sonix.ai/ 上创建账户，并从 https://my.sonix.ai/api 页面获取认证密钥。

您还需要安装 `sonix-speech-recognition` 库：

```bash [npm]
npm install @langchain/community @langchain/core sonix-speech-recognition
```

## 使用方法

配置好认证密钥后，您可以使用加载器创建转录文本，然后将其转换为文档。
在 `request` 参数中，您可以通过设置 `audioFilePath` 指定本地文件，或使用 `audioUrl` 指定远程文件。
您还需要指定音频语言。支持的语言列表请参见[此处](https://sonix.ai/docs/api#languages)。

```typescript
import { SonixAudioTranscriptionLoader } from "@langchain/community/document_loaders/web/sonix_audio";

const loader = new SonixAudioTranscriptionLoader({
  sonixAuthKey: "SONIX_AUTH_KEY",
  request: {
    audioFilePath: "LOCAL_AUDIO_FILE_PATH",
    fileName: "FILE_NAME",
    language: "en",
  },
});

const docs = await loader.load();

console.log(docs);
```
