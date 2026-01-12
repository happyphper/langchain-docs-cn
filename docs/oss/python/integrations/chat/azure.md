---
title: AzureChatOpenAI
---
Azure OpenAI 是微软 Azure 的一项服务，提供来自 OpenAI 的强大语言模型。

本文将帮助你开始使用 AzureChatOpenAI [聊天模型](/oss/python/langchain/models)。有关 AzureChatOpenAI 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_openai.AzureChatOpenAI.html)。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [PY 支持](https://python.langchain.com/docs/integrations/chat/azure_chat_openai) | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [AzureChatOpenAI](https://api.js.langchain.com/classes/langchain_openai.AzureChatOpenAI.html) | [`@langchain/openai`](https://www.npmjs.com/package/@langchain/openai) | ✅ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/openai?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/openai?style=flat-square&label=%20&) |

### 模型功能

请参阅下表标题中的链接，了解如何使用特定功能的指南。

| [工具调用](/oss/python/langchain/tools) | [结构化输出](/oss/python/langchain/structured-output) | [图像输入](/oss/python/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/python/langchain/streaming/) | [令牌使用量](/oss/python/langchain/models#token-usage) | [对数概率](/oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |

## 设置

[Azure OpenAI](https://azure.microsoft.com/products/ai-services/openai-service/) 是一项云服务，可帮助你利用来自 OpenAI、Meta 及其他公司的多样化预构建和精选模型，快速开发生成式 AI 体验。

LangChain.js 通过 [OpenAI SDK](https://github.com/openai/openai-node) 中的新 Azure 集成，支持与 [Azure OpenAI](https://azure.microsoft.com/products/ai-services/openai-service/) 集成。

你可以在[此页面](https://learn.microsoft.com/azure/ai-services/openai/overview)上了解更多关于 Azure OpenAI 及其与 OpenAI API 的区别。

### 凭据

如果你没有 Azure 账户，可以[创建一个免费账户](https://azure.microsoft.com/free/)开始使用。

你还需要部署一个 Azure OpenAI 实例。你可以按照[本指南](https://learn.microsoft.com/azure/ai-services/openai/how-to/create-resource?pivots=web-portal)在 Azure 门户中部署一个版本。

一旦你的实例运行起来，请确保你拥有实例名称和密钥。你可以在 Azure 门户中，实例的“密钥和终结点”部分找到密钥。然后，如果使用 Node.js，你可以将凭据设置为环境变量：

```bash
AZURE_OPENAI_API_INSTANCE_NAME=<YOUR_INSTANCE_NAME>
AZURE_OPENAI_API_DEPLOYMENT_NAME=<YOUR_DEPLOYMENT_NAME>
AZURE_OPENAI_API_KEY=<YOUR_KEY>
AZURE_OPENAI_API_VERSION="2024-02-01"
```

如果你想自动追踪模型调用，也可以通过取消注释以下内容来设置你的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain AzureChatOpenAI 集成位于 `@langchain/openai` 包中：

::: code-group

```bash [npm]
npm install @langchain/openai @langchain/core
```

```bash [yarn]
yarn add @langchain/openai @langchain/core
```

```bash [pnpm]
pnpm add @langchain/openai @langchain/core
```

:::

## 实例化

现在我们可以实例化我们的模型对象并生成聊天补全：

```typescript
import { AzureChatOpenAI } from "@langchain/openai"

const llm = new AzureChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME, // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION, // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_VERSION
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
  "id": "chatcmpl-9qrWKByvVrzWMxSn8joRZAklHoB32",
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

## 使用 Azure 托管标识

如果你使用 Azure 托管标识，可以像这样配置凭据：

```typescript
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import { AzureChatOpenAI } from "@langchain/openai";

const credentials = new DefaultAzureCredential();
const azureADTokenProvider = getBearerTokenProvider(
  credentials,
  "https://cognitiveservices.azure.com/.default"
);

const llmWithManagedIdentity = new AzureChatOpenAI({
  azureADTokenProvider,
  azureOpenAIApiInstanceName: "<your_instance_name>",
  azureOpenAIApiDeploymentName: "<your_deployment_name>",
  azureOpenAIApiVersion: "<api_version>",
});
```

## 使用不同的域

如果你的实例托管在默认 `openai.azure.com` 以外的域下，你需要使用替代的 `AZURE_OPENAI_BASE_PATH` 环境变量。
例如，以下是如何连接到域 `https://westeurope.api.microsoft.com/openai/deployments/{DEPLOYMENT_NAME}`：

```typescript
import { AzureChatOpenAI } from "@langchain/openai";

const llmWithDifferentDomain = new AzureChatOpenAI({
  temperature: 0.9,
  azureOpenAIApiKey: "<your_key>", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_KEY
  azureOpenAIApiDeploymentName: "<your_deployment_name>", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
  azureOpenAIApiVersion: "<api_version>", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_VERSION
  azureOpenAIBasePath:
    "https://westeurope.api.microsoft.com/openai/deployments", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_BASE_PATH
});
```

## 自定义请求头

你可以通过传入 `configuration` 字段来指定自定义请求头：

```typescript
import { AzureChatOpenAI } from "@langchain/openai";

const llmWithCustomHeaders = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_KEY
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_INSTANCE_NAME
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME, // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION, // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_VERSION
  configuration: {
    defaultHeaders: {
      "x-custom-header": `SOME_VALUE`,
    },
  },
});

await llmWithCustomHeaders.invoke("Hi there!");
```

`configuration` 字段也接受官方 SDK 接受的其他 `ClientOptions` 参数。

**注意：** 特定的请求头 `api-key` 目前无法以这种方式覆盖，它将传递来自 `azureOpenAIApiKey` 的值。

## 从 Azure OpenAI SDK 迁移

如果你正在使用已弃用的 Azure OpenAI SDK 和 `@langchain/azure-openai` 包，你可以按照以下步骤更新代码以使用新的 Azure 集成：

1. 安装新的 `@langchain/openai` 包并移除之前的 `@langchain/azure-openai` 包：

::: code-group

```bash [npm]
npm install @langchain/openai
```

```bash [yarn]
yarn add @langchain/openai
```

```bash [pnpm]
pnpm add @langchain/openai
```

:::

```bash
npm uninstall @langchain/azure-openai
```

2. 更新你的导入，以使用来自 `@langchain/openai` 包的新 <a href="https://reference.langchain.com/python/integrations/langchain_openai/AzureChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>AzureChatOpenAI</code></a> 类：

```typescript
import { AzureChatOpenAI } from "@langchain/openai";
```

3. 更新你的代码以使用新的 <a href="https://reference.langchain.com/python/integrations/langchain_openai/AzureChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>AzureChatOpenAI</code></a> 类并传递所需的参数：

```typescript
const model = new AzureChatOpenAI({
  azureOpenAIApiKey: "<your_key>",
  azureOpenAIApiInstanceName: "<your_instance_name>",
  azureOpenAIApiDeploymentName: "<your_deployment_name>",
  azureOpenAIApiVersion: "<api_version>",
});
```

   请注意，构造函数现在需要 `azureOpenAIApiInstanceName` 参数而不是 `azureOpenAIEndpoint` 参数，并添加了 `azureOpenAIApiVersion` 参数来指定 API 版本。

   - 如果你之前使用 Azure 托管标识，现在需要向构造函数传递 `azureADTokenProvider` 参数而不是 `credentials`，有关更多详细信息，请参阅 [Azure 托管标识](#using-azure-managed-identity) 部分。

   - 如果你之前使用环境变量，现在必须设置 `AZURE_OPENAI_API_INSTANCE_NAME` 环境变量而不是 `AZURE_OPENAI_API_ENDPOINT`，并添加 `AZURE_OPENAI_API_VERSION` 环境变量来指定 API 版本。

---

## API 参考

有关 AzureChatOpenAI 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_openai.AzureChatOpenAI.html)。
