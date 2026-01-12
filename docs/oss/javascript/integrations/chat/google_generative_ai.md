---
title: ChatGoogleGenerativeAI
---
[Google AI](https://ai.google.dev/) 提供了多种不同的聊天模型，包括强大的 Gemini 系列。有关最新模型、其功能、上下文窗口等信息，请访问 [Google AI 文档](https://ai.google.dev/gemini-api/docs/models/gemini)。

本文将帮助您开始使用 `ChatGoogleGenerativeAI` [聊天模型](/oss/javascript/langchain/models)。有关 `ChatGoogleGenerativeAI` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_google_genai.ChatGoogleGenerativeAI.html)。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [PY 支持](https://python.langchain.com/docs/integrations/chat/google_generative_ai) | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [ChatGoogleGenerativeAI](https://api.js.langchain.com/classes/langchain_google_genai.ChatGoogleGenerativeAI.html) | [@langchain/google-genai](https://api.js.langchain.com/modules/langchain_google_genai.html) | ✅ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/google-genai?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/google-genai?style=flat-square&label=%20&) |

### 模型功能

有关如何使用特定功能的指南，请参阅下表标题中的链接。

| [工具调用](/oss/javascript/langchain/tools) | [结构化输出](/oss/javascript/langchain/structured-output) | [图像输入](/oss/javascript/langchain/messages#multimodal) | 音频输入 | 视频输入 | [Token 级流式传输](/oss/javascript/langchain/streaming/) | [Token 使用量](/oss/javascript/langchain/models#token-usage) | [Logprobs](/oss/javascript/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

## 设置

您可以通过 `@langchain/google-genai` 集成包中的 `ChatGoogleGenerativeAI` 类，在 LangChain 中访问 Google 的 `gemini` 和 `gemini-vision` 模型以及其他生成模型。

<Tip>

您也可以通过 LangChain 的 VertexAI 和 VertexAI-web 集成访问 Google 的 `gemini` 系列模型。点击[此处](/oss/javascript/integrations/chat/google_vertex_ai)阅读相关文档。

</Tip>

### 凭证

在此处获取 API 密钥：[https://ai.google.dev/tutorials/setup](https://ai.google.dev/tutorials/setup)

然后设置 `GOOGLE_API_KEY` 环境变量：

```bash
export GOOGLE_API_KEY="your-api-key"
```

如果您希望自动追踪模型调用，也可以通过取消注释以下内容来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain 的 `ChatGoogleGenerativeAI` 集成位于 `@langchain/google-genai` 包中：

::: code-group

```bash [npm]
npm install @langchain/google-genai @langchain/core
```

```bash [yarn]
yarn add @langchain/google-genai @langchain/core
```

```bash [pnpm]
pnpm add @langchain/google-genai @langchain/core
```

:::

## 实例化

现在我们可以实例化模型对象并生成聊天补全：

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    temperature: 0,
    maxRetries: 2,
    // other params...
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
  "content": "J'adore programmer. \n",
  "additional_kwargs": {
    "finishReason": "STOP",
    "index": 0,
    "safetyRatings": [
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "probability": "NEGLIGIBLE"
      }
    ]
  },
  "response_metadata": {
    "finishReason": "STOP",
    "index": 0,
    "safetyRatings": [
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "probability": "NEGLIGIBLE"
      }
    ]
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 21,
    "output_tokens": 5,
    "total_tokens": 26
  }
}
```

```typescript
console.log(aiMsg.content)
```

```text
J'adore programmer.
```

## 安全设置

Gemini 模型具有可以覆盖的默认安全设置。如果您从模型收到大量“安全警告”，可以尝试调整模型的 `safety_settings` 属性。例如，要关闭对危险内容的安全阻止，您可以从 `@google/generative-ai` 包导入枚举，然后按如下方式构建您的 LLM：

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const llmWithSafetySettings = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  temperature: 0,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
  // other params...
});
```

## 工具调用

使用 Google AI 进行工具调用与[使用其他模型进行工具调用](/oss/javascript/langchain/tools)大致相同，但在模式（schema）上有一些限制。

Google AI API 不允许工具模式包含具有未知属性的对象。例如，以下 Zod 模式将抛出错误：

`const invalidSchema = z.object({ properties: z.record(z.unknown()) });`

和

`const invalidSchema2 = z.record(z.unknown());`

相反，您应该明确定义对象字段的属性。这是一个示例：

```typescript
import { tool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as z from "zod";

// 定义您的工具
const fakeBrowserTool = tool((_) => {
  return "The search result is xyz..."
}, {
  name: "browser_tool",
  description: "Useful for when you need to find something on the web or summarize a webpage.",
  schema: z.object({
    url: z.string().describe("The URL of the webpage to search."),
    query: z.string().optional().describe("An optional search query to use."),
  }),
})

const llmWithTool = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
}).bindTools([fakeBrowserTool]) // 将您的工具绑定到模型

const toolRes = await llmWithTool.invoke([
  [
    "human",
    "Search the web and tell me what the weather will be like tonight in new york. use a popular weather website",
  ],
]);

console.log(toolRes.tool_calls);
```

```text
[
  {
    name: 'browser_tool',
    args: {
      url: 'https://www.weather.com',
      query: 'weather tonight in new york'
    },
    type: 'tool_call'
  }
]
```

### 内置 Google 搜索检索

Google 还提供了一个内置的搜索工具，您可以使用它来将内容生成基于现实世界的信息。以下是如何使用它的示例：

```typescript
import { DynamicRetrievalMode, GoogleSearchRetrievalTool } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const searchRetrievalTool: GoogleSearchRetrievalTool = {
  googleSearchRetrieval: {
    dynamicRetrievalConfig: {
      mode: DynamicRetrievalMode.MODE_DYNAMIC,
      dynamicThreshold: 0.7, // 默认值为 0.7
    }
  }
};
const searchRetrievalModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  temperature: 0,
  maxRetries: 0,
}).bindTools([searchRetrievalTool]);

const searchRetrievalResult = await searchRetrievalModel.invoke("Who won the 2024 MLB World Series?");

console.log(searchRetrievalResult.content);
```

```text
The Los Angeles Dodgers won the 2024 World Series, defeating the New York Yankees in Game 5 on October 30, 2024, by a score of 7-6. This victory marks the Dodgers' eighth World Series title and their first in a full season since 1988.  They achieved this win by overcoming a 5-0 deficit, making them the first team in World Series history to win a clinching game after being behind by such a margin.  The Dodgers also became the first team in MLB postseason history to overcome a five-run deficit, fall behind again, and still win.  Walker Buehler earned the save in the final game, securing the championship for the Dodgers.
```

响应还包括有关搜索结果的元数据：

```typescript
console.dir(searchRetrievalResult.response_metadata?.groundingMetadata, { depth: null });
```

```javascript
{
  searchEntryPoint: {
renderedContent: '<style>\n' +
'.container {\n' +
'  align-items: center;\n' +
'  border-radius: 8px;\n' +
'  display: flex;\n' +
'  font-family: Google Sans, Roboto, sans-serif;\n' +
'  font-size: 14px;\n' +
'  line-height: 20px;\n' +
'  padding: 8px 12px;\n' +
'}\n' +
'.chip {\n' +
'  display: inline-block;\n' +
'  border: solid 1px;\n' +
'  border-radius: 16px;\n' +
'  min-width: 14px;\n' +
'  padding: 5px 16px;\n' +
'  text-align: center;\n' +
'  user-select: none;\n' +
'  margin: 0 8px;\n' +
'  -webkit-tap-highlight-color: transparent;\n' +
'}\n' +
'.carousel {\n' +
'  overflow: auto;\n' +
'  scrollbar-width: none;\n' +
'  white-space: nowrap;\n' +
'  margin-right: -12px;\n' +
'}\n' +
'.headline {\n' +
'  display: flex;\n' +
'  margin-right: 4px;\n' +
'}\n' +
'.gradient-container {\n' +
'  position: relative;\n' +
'}\n' +
'.gradient {\n' +
'  position: absolute;\n' +
'  transform: translate(3px, -9px);\n' +
'  height: 36px;\n' +
'  width: 9px;\n' +
'}\n' +
'@media (prefers-color-scheme: light) {\n' +
'  .container {\n' +
'    background-color: #fafafa;\n' +
'    box-shadow: 0 0 0 1px #0000000f;\n' +
'  }\n' +
'  .headline-label {\n' +
'    color: #1f1f1f;\n' +
'  }\n' +
'  .chip {\n' +
'    background-color: #ffffff;\n' +
'    border-color: #d2d2d2;\n' +
'    color: #5e5e5e;\n' +
'    text-decoration: none;\n' +
'  }\n' +
'  .chip:hover {\n' +
'    background-color: #f2f2f2;\n' +
'  }\n' +
'  .chip:focus {\n' +
'    background-color: #f2f2f2;\n' +
'  }\n' +
'  .chip:active {\n' +
'    background-color: #d8d8d8;\n' +
'    border-color: #b6b6b6;\n' +
'  }\n' +
'  .logo-dark {\n' +
'    display: none;\n' +
'  }\n' +
'  .gradient {\n' +
'    background: linear-gradient(90deg, #fafafa 15%, #fafafa00 100%);\n' +
'  }\n' +
'}\n' +
'@media (prefers-color-scheme: dark) {\n' +
'  .container {\n' +
'    background-color: #1f1f1f;\n' +
'    box-shadow: 0 0 0 1px #ffffff26;\n' +
'  }\n' +
'  .headline-label {\n' +
'    color: #fff;\n' +
'  }\n' +
'  .chip {\n' +
'    background-color: #2c2c2c;\n' +
'    border-color: #3c4043;\n' +
'    color: #fff;\n' +
'    text-decoration: none;\n' +
'  }\n' +
'  .chip:hover {\n' +
'    background-color: #353536;\n' +
'  }\n' +
'  .chip:focus {\n' +
'    background-color: #353536;\n' +
'  }\n' +
'  .chip:active {\n' +
'    background-color: #464849;\n' +
'    border-color: #53575b;\n' +
'  }\n' +
'  .logo-light {\n' +
'    display: none;\n' +
'  }\n' +
'  .gradient {\n' +
'    background: linear-gradient(90deg, #1f1f1f 15%, #1f1f1f00 100%);\n' +
'  }\n' +
'}\n' +
'</style>\n' +
'<div class="container">\n' +
'  <div class="headline">\n' +
'    <svg class="logo-light" width="18" height="18" viewBox="9 9 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
'      <path fill-rule="evenodd" clip-rule="evenodd" d="M42.8622 27.0064C42.8622 25.7839 42.7525 24.6084 42.5487 23.4799H26.3109V30.1568H35.5897C35.1821 32.3041 33.9596 34.1222 32.1258 35.3448V39.6864H37.7213C40.9814 36.677 42.8622 32.2571 42.8622 27.0064V27.0064Z" fill="#4285F4"/>\n' +
'      <path fill-rule="evenodd" clip-rule="evenodd" d="M26.3109 43.8555C30.9659 43.8555 34.8687 42.3195 37.7213 39.6863L32.1258 35.3447C30.5898 36.3792 28.6306 37.0061 26.3109 37.0061C21.8282 37.0061 18.0195 33.9811 16.6559 29.906H10.9194V34.3573C13.7563 39.9841 19.5712 43.8555 26.3109 43.8555V43.8555Z" fill="#34A853"/>\n' +
'      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.6559 29.8904C16.3111 28.8559 16.1074 27.7588 16.1074 26.6146C16.1074 25.4704 16.3111 24.3733
