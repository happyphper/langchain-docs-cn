---
title: ChatVertexAI
---
[Google Vertex](https://cloud.google.com/vertex-ai) 是一项服务，它提供了 Google Cloud 中所有可用的基础模型，例如 `gemini-2.5-pro`、`gemini-2.5-flash` 等。
它还提供了一些非 Google 的模型，例如 [Anthropic 的 Claude](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude)。

本文将帮助您开始使用 `ChatVertexAI` [聊天模型](/oss/langchain/models)。有关 `ChatVertexAI` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_google_vertexai.ChatVertexAI.html)。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | PY 支持 | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [ChatVertexAI](https://api.js.langchain.com/classes/langchain_google_vertexai.ChatVertexAI.html) | [`@langchain/google-vertexai`](https://www.npmjs.com/package/@langchain/google-vertexai) | ✅ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/google-vertexai?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/google-vertexai?style=flat-square&label=%20&) |

### 模型功能

有关如何使用特定功能的指南，请参阅下表标题中的链接。

| [工具调用](/oss/langchain/tools) | [结构化输出](/oss/langchain/structured-output) | [图像输入](/oss/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/langchain/streaming/) | [令牌使用量](/oss/langchain/models#token-usage) | [Logprobs](/oss/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

请注意，虽然支持 logprobs，但 Gemini 对其使用有相当严格的限制。

## 设置

LangChain.js 根据您是在 Node.js 环境还是 Web 环境中运行，支持两种不同的身份验证方法。它还支持使用任一包的 Vertex AI Express Mode 所使用的身份验证方法。

要访问 `ChatVertexAI` 模型，您需要在 Google Cloud Platform (GCP) 账户中设置 Google VertexAI，保存凭据文件，并安装 `@langchain/google-vertexai` 集成包。

### 凭据

前往您的 [GCP 账户](https://console.cloud.google.com/) 并生成一个凭据文件。完成后，设置 `GOOGLE_APPLICATION_CREDENTIALS` 环境变量：

```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/credentials.json"
```

如果在 Web 环境中运行，您应该将 `GOOGLE_VERTEX_AI_WEB_CREDENTIALS` 环境变量设置为 JSON 字符串化的对象，并安装 `@langchain/google-vertexai-web` 包：

```bash
GOOGLE_VERTEX_AI_WEB_CREDENTIALS={"type":"service_account","project_id":"YOUR_PROJECT-12345",...}
```

如果您使用 Vertex AI Express Mode，可以安装 `@langchain/google-vertexai` 或 `@langchain/google-vertexai-web` 包。
然后，您可以前往 [Express Mode](https://console.cloud.google.com/vertex-ai/studio) API 密钥页面，并在 `GOOGLE_API_KEY` 环境变量中设置您的 API 密钥：

```bash
export GOOGLE_API_KEY="api_key_value"
```

如果您希望自动追踪模型调用，也可以通过取消注释以下行来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain 的 `ChatVertexAI` 集成位于 `@langchain/google-vertexai` 包中：

::: code-group

```bash [npm]
npm install @langchain/google-vertexai @langchain/core
```

```bash [yarn]
yarn add @langchain/google-vertexai @langchain/core
```

```bash [pnpm]
pnpm add @langchain/google-vertexai @langchain/core
```

:::

如果在 Web 环境（如 [Vercel Edge 函数](https://vercel.com/blog/edge-functions-generally-available)）中使用：

::: code-group

```bash [npm]
npm install @langchain/google-vertexai-web @langchain/core
```

```bash [yarn]
yarn add @langchain/google-vertexai-web @langchain/core
```

```bash [pnpm]
pnpm add @langchain/google-vertexai-web @langchain/core
```

:::

## 实例化

现在我们可以实例化我们的模型对象并生成聊天补全：

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai"
// 如果在 Web 环境中运行，请取消注释以下行：
// import { ChatVertexAI } from "@langchain/google-vertexai-web"

const llm = new ChatVertexAI({
    model: "gemini-2.5-flash",
    temperature: 0,
    maxRetries: 2,
    // 对于 Web 环境，使用 authOptions.credentials
    // authOptions: { ... }
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
AIMessageChunk {
  "content": "J'adore programmer. \n",
  "additional_kwargs": {},
  "response_metadata": {},
  "tool_calls": [],
  "tool_call_chunks": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 20,
    "output_tokens": 7,
    "total_tokens": 27
  }
}
```

```typescript
console.log(aiMsg.content)
```

```text
J'adore programmer.
```

## 使用 Google 搜索检索进行工具调用

可以调用带有 Google 搜索工具的模型，您可以使用它来[基于](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/grounding)真实世界信息生成内容，并减少幻觉。

`gemini-2.0-flash-exp` 目前不支持基于。

您可以选择使用 Google 搜索或使用自定义数据存储进行基于。以下是两者的示例：

### Google 搜索检索

使用 Google 搜索的基于示例：

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai"

const searchRetrievalTool = {
  googleSearchRetrieval: {
    dynamicRetrievalConfig: {
      mode: "MODE_DYNAMIC", // 使用动态检索
      dynamicThreshold: 0.7, // 动态检索阈值的默认值
    },
  },
};

const searchRetrievalModel = new ChatVertexAI({
  model: "gemini-2.5-pro",
  temperature: 0,
  maxRetries: 0,
}).bindTools([searchRetrievalTool]);

const searchRetrievalResult = await searchRetrievalModel.invoke("Who won the 2024 NBA Finals?");

console.log(searchRetrievalResult.content);
```

```text
The Boston Celtics won the 2024 NBA Finals, defeating the Dallas Mavericks 4-1 in the series to claim their 18th NBA championship. This victory marked their first title since 2008 and established them as the team with the most NBA championships, surpassing the Los Angeles Lakers' 17 titles.
```

### 使用数据存储的 Google 搜索检索

首先，设置您的数据存储（这是一个示例数据存储的模式）：

|    ID   |     Date     |    Team 1   |   Score  |   Team 2   |
|:-------:|:------------:|:-----------:|:--------:|:----------:|
|  3001   |  2023-09-07  |  Argentina  |  1 - 0   |  Ecuador   |
|  3002   |  2023-09-12  |  Venezuela  |  1 - 0   |  Paraguay  |
|  3003   |  2023-09-12  |  Chile      |  0 - 0   |  Colombia  |
|  3004   |  2023-09-12  |  Peru       |  0 - 1   |  Brazil    |
|  3005   |  2024-10-15  |  Argentina  |  6 - 0   |  Bolivia   |

然后，在下面提供的示例中使用此数据存储：

（注意，您必须使用自己的 `projectId` 和 `datastoreId` 变量）

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const projectId = "YOUR_PROJECT_ID";
const datastoreId = "YOUR_DATASTORE_ID";

const searchRetrievalToolWithDataset = {
  retrieval: {
    vertexAiSearch: {
      datastore: `projects/${projectId}/locations/global/collections/default_collection/dataStores/${datastoreId}`,
    },
    disableAttribution: false,
  },
};

const searchRetrievalModelWithDataset = new ChatVertexAI({
  model: "gemini-2.5-pro",
  temperature: 0,
  maxRetries: 0,
}).bindTools([searchRetrievalToolWithDataset]);

const searchRetrievalModelResult = await searchRetrievalModelWithDataset.invoke(
  "What is the score of Argentina vs Bolivia football game?"
);

console.log(searchRetrievalModelResult.content);
```

```text
Argentina won against Bolivia with a score of 6-0 on October 15, 2024.
```

现在，您应该会得到基于您提供的数据存储中数据的结果。

## 上下文缓存

Vertex AI 提供上下文缓存功能，通过跨多个 API 请求存储和重用长消息内容块来帮助优化成本。当您有冗长的对话历史记录或消息片段在交互中频繁出现时，这尤其有用。

要使用此功能，请首先按照[此官方指南](https://cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-create)创建上下文缓存。

创建缓存后，您可以将其 ID 作为运行时参数传入，如下所示：

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const modelWithCachedContent = new ChatVertexAI({
  model: "gemini-2.5-pro-002",
  location: "us-east5",
});

await modelWithCachedContent.invoke("What is in the content?", {
  cachedContent:
    "projects/PROJECT_NUMBER/locations/LOCATION/cachedContents/CACHE_ID",
});
```

您也可以将此字段直接绑定到模型实例上：

```typescript
const modelWithBoundCachedContent = new ChatVertexAI({
  model: "gemini-2.5-pro-002",
  location: "us-east5",
}).bind({
  cachedContent:
    "projects/PROJECT_NUMBER/locations/LOCATION/cachedContents/CACHE_ID",
});
```

请注意，并非所有模型目前都支持上下文缓存。

---

## API 参考

有关 ChatVertexAI 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_google_vertexai.ChatVertexAI.html)。
