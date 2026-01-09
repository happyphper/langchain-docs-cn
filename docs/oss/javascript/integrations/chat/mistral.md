---
title: ChatMistralAI
---
[Mistral AI](https://mistral.ai/) 是一个提供其强大[开源模型](https://docs.mistral.ai/getting-started/models/)托管服务的平台。

本文将帮助你开始使用 ChatMistralAI [聊天模型](/oss/langchain/models)。有关 ChatMistralAI 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_mistralai.ChatMistralAI.html)。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [PY 支持](https://python.langchain.com/docs/integrations/chat/mistralai) | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [ChatMistralAI](https://api.js.langchain.com/classes/langchain_mistralai.ChatMistralAI.html) | [`@langchain/mistralai`](https://www.npmjs.com/package/@langchain/mistralai) | ❌ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/mistralai?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/mistralai?style=flat-square&label=%20&) |

### 模型功能

请参阅下表标题中的链接，了解如何使用特定功能的指南。

| [工具调用](/oss/langchain/tools) | [结构化输出](/oss/langchain/structured-output) | [图像输入](/oss/langchain/messages#multimodal) | 音频输入 | 视频输入 | [Token 级流式传输](/oss/langchain/streaming/) | [Token 使用量](/oss/langchain/models#token-usage) | [Logprobs](/oss/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |

## 设置

要访问 Mistral AI 模型，你需要创建一个 Mistral AI 账户，获取 API 密钥，并安装 `@langchain/mistralai` 集成包。

### 凭证

请前往[此处](https://console.mistral.ai/)注册 Mistral AI 并生成 API 密钥。完成后，设置 `MISTRAL_API_KEY` 环境变量：

```bash
export MISTRAL_API_KEY="your-api-key"
```

如果你想自动追踪模型调用，也可以通过取消注释以下行来设置你的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain ChatMistralAI 集成位于 `@langchain/mistralai` 包中：

::: code-group

```bash [npm]
npm install @langchain/mistralai @langchain/core
```

```bash [yarn]
yarn add @langchain/mistralai @langchain/core
```

```bash [pnpm]
pnpm add @langchain/mistralai @langchain/core
```

:::

## 实例化

现在我们可以实例化我们的模型对象并生成聊天补全：

```typescript
import { ChatMistralAI } from "@langchain/mistralai"

const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
    // other params...
})
```

## 调用

向 Mistral 发送聊天消息时，需要遵循一些要求：

- 第一条消息 _*不能*_ 是助手 (ai) 消息。
- 消息 _*必须*_ 在用户和助手 (ai) 消息之间交替。
- 消息 _*不能*_ 以助手 (ai) 或系统消息结尾。

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
  "content": "J'adore la programmation.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 9,
      "promptTokens": 27,
      "totalTokens": 36
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 27,
    "output_tokens": 9,
    "total_tokens": 36
  }
}
```

```typescript
console.log(aiMsg.content)
```

```text
J'adore la programmation.
```

## 工具调用

Mistral 的 API 支持其部分模型的[工具调用](/oss/langchain/tools)。你可以在[此页面](https://docs.mistral.ai/capabilities/function_calling/)查看哪些模型支持工具调用。

以下示例演示了如何使用它：

```typescript
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as z from "zod";
import { tool } from "@langchain/core/tools";

const calculatorSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The type of operation to execute."),
  number1: z.number().describe("The first number to operate on."),
  number2: z.number().describe("The second number to operate on."),
});

const calculatorTool = tool((input) => {
  return JSON.stringify(input);
}, {
  name: "calculator",
  description: "A simple calculator tool",
  schema: calculatorSchema,
});

// Bind the tool to the model
const modelWithTool = new ChatMistralAI({
  model: "mistral-large-latest",
}).bindTools([calculatorTool]);

const calcToolPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant who always needs to use a calculator.",
  ],
  ["human", "{input}"],
]);

// Chain your prompt, model, and output parser together
const chainWithCalcTool = calcToolPrompt.pipe(modelWithTool);

const calcToolRes = await chainWithCalcTool.invoke({
  input: "What is 2 + 2?",
});
console.log(calcToolRes.tool_calls);
```

```text
[
  {
    name: 'calculator',
    args: { operation: 'add', number1: 2, number2: 2 },
    type: 'tool_call',
    id: 'DD9diCL1W'
  }
]
```

## 钩子

Mistral AI 支持三个事件的自定义钩子：`beforeRequest`、`requestError` 和 `response`。每种钩子类型的函数签名示例如下：

```typescript
const beforeRequestHook = (req: Request): Request | void | Promise<Request | void> => {
    // Code to run before a request is processed by Mistral
};

const requestErrorHook = (err: unknown, req: Request): void | Promise<void> => {
    // Code to run when an error occurs as Mistral is processing a request
};

const responseHook = (res: Response, req: Request): void | Promise<void> => {
    // Code to run before Mistral sends a successful response
};
```

要将这些钩子添加到聊天模型中，可以将它们作为参数传递，它们会自动添加：

```typescript
import { ChatMistralAI } from "@langchain/mistralai"

const modelWithHooks = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
    beforeRequestHooks: [ beforeRequestHook ],
    requestErrorHooks: [ requestErrorHook ],
    responseHooks: [ responseHook ],
    // other params...
});
```

或者在实例化后手动分配和添加它们：

```typescript
import { ChatMistralAI } from "@langchain/mistralai"

const model = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
    // other params...
});

model.beforeRequestHooks = [ ...model.beforeRequestHooks, beforeRequestHook ];
model.requestErrorHooks = [ ...model.requestErrorHooks, requestErrorHook ];
model.responseHooks = [ ...model.responseHooks, responseHook ];

model.addAllHooksToHttpClient();
```

`addAllHooksToHttpClient` 方法会清除当前添加的所有钩子，然后分配整个更新后的钩子列表，以避免钩子重复。

可以逐个移除钩子，也可以一次性清除模型中的所有钩子。

```typescript
model.removeHookFromHttpClient(beforeRequestHook);

model.removeAllHooksFromHttpClient();
```

---

## API 参考

有关 ChatMistralAI 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_mistralai.ChatMistralAI.html)。
