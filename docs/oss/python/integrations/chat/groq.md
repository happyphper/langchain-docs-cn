---
title: ChatGroq
---
[Groq](https://groq.com/) 是一家提供快速 AI 推理服务的公司，其核心是 LPU™ AI 推理技术，该技术能够提供快速、经济且节能的 AI 推理。

本文将帮助您开始使用 ChatGroq [聊天模型](/oss/langchain/models)。有关 ChatGroq 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_groq.ChatGroq.html)。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [Python 支持](https://python.langchain.com/docs/integrations/chat/groq) | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [ChatGroq](https://api.js.langchain.com/classes/langchain_groq.ChatGroq.html) | [`@langchain/groq`](https://www.npmjs.com/package/@langchain/groq) | ❌ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/groq?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/groq?style=flat-square&label=%20&) |

### 模型功能

有关如何使用特定功能的指南，请参阅下表标题中的链接。

| [工具调用](/oss/langchain/tools) | [结构化输出](/oss/langchain/structured-output) | [图像输入](/oss/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/langchain/streaming/) | [令牌使用量](/oss/langchain/models#token-usage) | [对数概率](/oss/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

## 设置

要访问 ChatGroq 模型，您需要创建一个 Groq 账户，获取一个 API 密钥，并安装 `@langchain/groq` 集成包。

### 凭证

要使用 Groq API，您需要一个 API 密钥。您可以在此处[注册](https://wow.groq.com/)一个 Groq 账户并创建 API 密钥。
然后，您可以在终端中将 API 密钥设置为环境变量：

```bash
export GROQ_API_KEY="your-api-key"
```

如果您希望自动追踪模型调用，还可以通过取消注释以下行来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain ChatGroq 集成位于 `@langchain/groq` 包中：

::: code-group

```bash [npm]
npm install @langchain/groq @langchain/core
```

```bash [yarn]
yarn add @langchain/groq @langchain/core
```

```bash [pnpm]
pnpm add @langchain/groq @langchain/core
```

:::

## 实例化

现在我们可以实例化模型对象并生成聊天补全：

```typescript
import { ChatGroq } from "@langchain/groq"

const llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
})
```

## 调用

```typescript
const aiMsg = await llm.invoke([
    {
      role: "system",
      content: "You are a helpful assistant that translates English to French. Translate the user sentence.",
    },
    { role: "user", content: "I love programming." },
])
aiMsg
```

```text
AIMessage {
  "content": "I enjoy programming. (The French translation is: \"J'aime programmer.\")\n\nNote: I chose to translate \"I love programming\" as \"J'aime programmer\" instead of \"Je suis amoureux de programmer\" because the latter has a romantic connotation that is not present in the original English sentence.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 73,
      "promptTokens": 31,
      "totalTokens": 104
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": []
}
```

```typescript
console.log(aiMsg.content)
```

```text
I enjoy programming. (The French translation is: "J'aime programmer.")

Note: I chose to translate "I love programming" as "J'aime programmer" instead of "Je suis amoureux de programmer" because the latter has a romantic connotation that is not present in the original English sentence.
```

## JSON 调用

```typescript
const messages = [
  {
    role: "system",
    content: "You are a math tutor that handles math exercises and makes output in json in format { result: number }.",
  },
  { role: "user",  content: "2 + 2 * 2" },
];

const aiInvokeMsg = await llm.invoke(messages, { response_format: { type: "json_object" } });

// 如果您不想在每次调用时都传递 response_format，可以将其绑定到实例上
const llmWithResponseFormat = llm.bind({ response_format: { type: "json_object" } });
const aiBindMsg = await llmWithResponseFormat.invoke(messages);

// 它们是相同的
console.log({ aiInvokeMsgContent: aiInvokeMsg.content, aiBindMsg: aiBindMsg.content });
```

```json
{
  aiInvokeMsgContent: '{\n"result": 6\n}',
  aiBindMsg: '{\n"result": 6\n}'
}
```

---

## API 参考

有关 ChatGroq 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_groq.ChatGroq.html)。
