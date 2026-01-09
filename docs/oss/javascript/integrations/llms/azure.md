---
title: Azure OpenAI
---

<Warning>

<strong>您当前正在查阅的是 Azure OpenAI 文本补全模型的使用文档。最新且最受欢迎的 Azure OpenAI 模型是 [聊天补全模型](/oss/langchain/models)。</strong>

除非您明确在使用 `gpt-3.5-turbo-instruct`，否则您可能正在寻找 [此页面](/oss/integrations/chat/azure/)。

</Warning>

<Info>

<strong>此前，LangChain.js 使用专用的 [Azure OpenAI SDK](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai) 来支持与 Azure OpenAI 的集成。该 SDK 现已弃用，转而采用 OpenAI SDK 中新的 Azure 集成方案。新方案允许在 OpenAI 模型和功能发布当天即可访问，并能在 OpenAI API 和 Azure OpenAI 之间实现无缝切换。</strong>

如果您正在使用已弃用的 SDK 与 Azure OpenAI 集成，请参阅 [迁移指南](#migration-from-azure-openai-sdk) 以更新到新的 API。

</Info>

[Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/) 是微软 Azure 提供的一项服务，它提供了来自 OpenAI 的强大语言模型。

本文将帮助您开始使用 LangChain 的 AzureOpenAI 补全模型（LLMs）。关于 `AzureOpenAI` 功能和配置选项的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_openai.AzureOpenAI.html)。

## 概述

### 集成详情

| 类 | 包 | 本地 | 可序列化 | [PY 支持](https://python.langchain.com/docs/integrations/llms/azure_openai) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: | :---: |
| [AzureOpenAI](https://api.js.langchain.com/classes/langchain_openai.AzureOpenAI.html) | [@langchain/openai](https://api.js.langchain.com/modules/langchain_openai.html) | ❌ | ✅ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/openai?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/openai?style=flat-square&label=%20&) |

## 设置

要访问 AzureOpenAI 模型，您需要创建一个 Azure 账户，获取一个 API 密钥，并安装 `@langchain/openai` 集成包。

### 凭证

前往 [azure.microsoft.com](https://azure.microsoft.com/) 注册 AzureOpenAI 并生成 API 密钥。

您还需要部署一个 Azure OpenAI 实例。您可以按照 [此指南](https://learn.microsoft.com/azure/ai-services/openai/how-to/create-resource?pivots=web-portal) 在 Azure 门户中部署一个版本。

一旦您的实例运行起来，请确保您拥有实例名称和密钥。您可以在 Azure 门户中，在实例的“密钥和终结点”部分找到密钥。

如果您使用 Node.js，可以定义以下环境变量来使用该服务：

```bash
AZURE_OPENAI_API_INSTANCE_NAME=<YOUR_INSTANCE_NAME>
AZURE_OPENAI_API_DEPLOYMENT_NAME=<YOUR_DEPLOYMENT_NAME>
AZURE_OPENAI_API_KEY=<YOUR_KEY>
AZURE_OPENAI_API_VERSION="2024-02-01"
```

或者，您也可以直接将值传递给 `AzureOpenAI` 构造函数。

如果您希望自动追踪模型调用，还可以通过取消注释以下内容来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain 的 AzureOpenAI 集成位于 `@langchain/openai` 包中：

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

现在我们可以实例化我们的模型对象并生成补全内容：

```typescript
import { AzureOpenAI } from "@langchain/openai"

const llm = new AzureOpenAI({
  model: "gpt-3.5-turbo-instruct",
  azureOpenAIApiKey: "<your_key>", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_KEY
  azureOpenAIApiInstanceName: "<your_instance_name>", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_INSTANCE_NAME
  azureOpenAIApiDeploymentName: "<your_deployment_name>", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
  azureOpenAIApiVersion: "<api_version>", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_VERSION
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  // 其他参数...
})
```

## 调用

```typescript
const inputText = "AzureOpenAI is an AI company that "

const completion = await llm.invoke(inputText)
completion
```

```text
provides AI solutions to businesses. They offer a range of services including natural language processing, computer vision, and machine learning. Their solutions are designed to help businesses automate processes, gain insights from data, and improve decision-making. AzureOpenAI also offers consulting services to help businesses identify and implement the best AI solutions for their specific needs. They work with a variety of industries, including healthcare, finance, and retail. With their expertise in AI and their partnership with Microsoft Azure, AzureOpenAI is a trusted provider of AI solutions for businesses looking to stay ahead in the rapidly evolving world of technology.
```

## 使用 Azure 托管身份

如果您使用 Azure 托管身份，可以像这样配置凭证：

```typescript
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import { AzureOpenAI } from "@langchain/openai";

const credentials = new DefaultAzureCredential();
const azureADTokenProvider = getBearerTokenProvider(
  credentials,
  "https://cognitiveservices.azure.com/.default"
);

const managedIdentityLLM = new AzureOpenAI({
  azureADTokenProvider,
  azureOpenAIApiInstanceName: "<your_instance_name>",
  azureOpenAIApiDeploymentName: "<your_deployment_name>",
  azureOpenAIApiVersion: "<api_version>",
});
```

## 使用不同的域名

如果您的实例托管在默认 `openai.azure.com` 以外的域名下，您需要使用替代的 `AZURE_OPENAI_BASE_PATH` 环境变量。
例如，以下是如何连接到域名 `https://westeurope.api.microsoft.com/openai/deployments/{DEPLOYMENT_NAME}`：

```typescript
import { AzureOpenAI } from "@langchain/openai";

const differentDomainLLM = new AzureOpenAI({
  azureOpenAIApiKey: "<your_key>", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_KEY
  azureOpenAIApiDeploymentName: "<your_deployment_name>", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
  azureOpenAIApiVersion: "<api_version>", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_API_VERSION
  azureOpenAIBasePath:
    "https://westeurope.api.microsoft.com/openai/deployments", // 在 Node.js 中默认为 process.env.AZURE_OPENAI_BASE_PATH
});
```

## 从 Azure OpenAI SDK 迁移

如果您正在使用已弃用的 Azure OpenAI SDK 和 `@langchain/azure-openai` 包，您可以按照以下步骤更新代码以使用新的 Azure 集成：

1.  安装新的 `@langchain/openai` 包并移除之前的 `@langchain/azure-openai` 包：

```bash
npm install @langchain/openai
npm uninstall @langchain/azure-openai
```

2.  更新您的导入语句，使用来自 `@langchain/openai` 包的新 `AzureOpenAI` 和 <a href="https://reference.langchain.com/javascript/classes/_langchain_openai.AzureChatOpenAI.html" target="_blank" rel="noreferrer" class="link"><code>AzureChatOpenAI</code></a> 类：

```typescript
import { AzureOpenAI } from "@langchain/openai";
```

3.  更新您的代码以使用新的 `AzureOpenAI` 和 <a href="https://reference.langchain.com/javascript/classes/_langchain_openai.AzureChatOpenAI.html" target="_blank" rel="noreferrer" class="link"><code>AzureChatOpenAI</code></a> 类，并传递所需的参数：

```typescript
const model = new AzureOpenAI({
  azureOpenAIApiKey: "<your_key>",
  azureOpenAIApiInstanceName: "<your_instance_name>",
  azureOpenAIApiDeploymentName: "<your_deployment_name>",
  azureOpenAIApiVersion: "<api_version>",
});
```

请注意，构造函数现在需要 `azureOpenAIApiInstanceName` 参数而不是 `azureOpenAIEndpoint` 参数，并添加了 `azureOpenAIApiVersion` 参数来指定 API 版本。

    -   如果您之前使用 Azure 托管身份，现在需要向构造函数传递 `azureADTokenProvider` 参数而不是 `credentials`，更多详情请参阅 [Azure 托管身份](#using-azure-managed-identity) 部分。

    -   如果您之前使用环境变量，现在必须设置 `AZURE_OPENAI_API_INSTANCE_NAME` 环境变量而不是 `AZURE_OPENAI_API_ENDPOINT`，并添加 `AZURE_OPENAI_API_VERSION` 环境变量来指定 API 版本。

---

## API 参考

关于所有 AzureOpenAI 功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain_openai.AzureOpenAI.html)。
