---
title: ChatTogetherAI
---
[Together AI](https://www.together.ai/) 提供了一个 API，只需几行代码即可查询 [50 多个领先的开源模型](https://docs.together.ai/docs/inference-models)。

本指南将帮助您开始使用 `ChatTogetherAI` [聊天模型](/oss/python/langchain/models)。有关 `ChatTogetherAI` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_community_chat_models_togetherai.ChatTogetherAI.html)。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [PY 支持](https://python.langchain.com/docs/integrations/chat/togetherai) | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [ChatTogetherAI](https://api.js.langchain.com/classes/langchain_community_chat_models_togetherai.ChatTogetherAI.html) | [`@langchain/community`](https://www.npmjs.com/package/@langchain/community) | ✅ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/community?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/community?style=flat-square&label=%20&) |

### 模型功能

有关如何使用特定功能的指南，请参阅下表标题中的链接。

| [工具调用](/oss/python/langchain/tools) | [结构化输出](/oss/python/langchain/structured-output) | [图像输入](/oss/python/langchain/messages#multimodal) | 音频输入 | 视频输入 | [Token 级流式传输](/oss/python/langchain/streaming/) | [Token 使用量](/oss/python/langchain/models#token-usage) | [Logprobs](/oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## 设置

要访问 `ChatTogetherAI` 模型，您需要创建一个 Together 账户，在[此处](https://api.together.xyz/)获取 API 密钥，并安装 `@langchain/community` 集成包。

### 凭据

前往 [api.together.ai](https://api.together.ai/) 注册 TogetherAI 并生成 API 密钥。完成后，设置 `TOGETHER_AI_API_KEY` 环境变量：

```bash
export TOGETHER_AI_API_KEY="your-api-key"
```

如果您希望自动追踪模型调用，也可以通过取消注释以下行来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain ChatTogetherAI 集成位于 `@langchain/community` 包中：

::: code-group

```bash [npm]
npm install @langchain/community @langchain/core
```

```bash [yarn]
yarn add @langchain/community @langchain/core
```

```bash [pnpm]
pnpm add @langchain/community @langchain/core
```

:::

## 实例化

现在我们可以实例化模型对象并生成聊天补全：

```typescript
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai"

const llm = new ChatTogetherAI({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    temperature: 0,
    // 其他参数...
})
```

## 调用

```typescript
const aiMsg = await llm.invoke([
    [
        "system",
        "You are a helpful assistant that translates English to French. Translate the user sentence.",
    ],
    ["human", "I love programming."],
])
aiMsg
```

```text
AIMessage {
  "id": "chatcmpl-9rT9qEDPZ6iLCk6jt3XTzVDDH6pcI",
  "content": "J'adore la programmation.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 8,
      "promptTokens": 31,
      "totalTokens": 39
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 31,
    "output_tokens": 8,
    "total_tokens": 39
  }
}
```

```typescript
console.log(aiMsg.content)
```

```text
J'adore la programmation.
```

---

## API 参考

有关 ChatTogetherAI 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_community_chat_models_togetherai.ChatTogetherAI.html)。
