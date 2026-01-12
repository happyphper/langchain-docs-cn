---
title: OpenAI
---

<Warning>

<strong>您当前正在查阅的是 OpenAI 文本补全模型的使用文档。最新且最受欢迎的 OpenAI 模型是 [聊天补全模型](/oss/javascript/langchain/models)。</strong>

除非您明确在使用 `gpt-3.5-turbo-instruct`，否则您可能应该查看 [这个页面](/oss/javascript/integrations/chat/openai/)。

</Warning>

[OpenAI](https://en.wikipedia.org/wiki/OpenAI) 是一个人工智能（AI）研究实验室。

本文将帮助您开始使用 LangChain 集成 OpenAI 的补全模型（LLMs）。关于 OpenAI 功能和配置选项的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_openai.OpenAI.html)。

## 概述

### 集成详情

| 类 | 包 | 本地 | 可序列化 | [Python 支持](https://python.langchain.com/docs/integrations/llms/openai) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: | :---: |
| [OpenAI](https://api.js.langchain.com/classes/langchain_openai.OpenAI.html) | [@langchain/openai](https://www.npmjs.com/package/@langchain/openai) | ❌ | ✅ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/openai?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/openai?style=flat-square&label=%20&) |

## 设置

要访问 OpenAI 模型，您需要创建一个 OpenAI 账户，获取一个 API 密钥，并安装 `@langchain/openai` 集成包。

### 凭证

前往 [platform.openai.com](https://platform.openai.com/) 注册 OpenAI 并生成 API 密钥。完成后，请设置 `OPENAI_API_KEY` 环境变量：

```bash
export OPENAI_API_KEY="your-api-key"
```

如果您希望自动追踪模型调用，也可以通过取消下方注释来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain 的 OpenAI 集成位于 `@langchain/openai` 包中：

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

现在我们可以实例化我们的模型对象并生成补全结果：

```typescript
import { OpenAI } from "@langchain/openai"

const llm = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  apiKey: process.env.OPENAI_API_KEY,
  // 其他参数...
})
```

## 调用

```typescript
const inputText = "OpenAI is an AI company that "

const completion = await llm.invoke(inputText)
completion
```

```text
develops and promotes friendly AI for the benefit of humanity. It was founded in 2015 by Elon Musk, Sam Altman, Greg Brockman, Ilya Sutskever, Wojciech Zaremba, John Schulman, and Chris Olah. The company's mission is to create and promote artificial general intelligence (AGI) that is safe and beneficial to humanity.

OpenAI conducts research in various areas of AI, including deep learning, reinforcement learning, robotics, and natural language processing. The company also develops and releases open-source tools and platforms for AI research, such as the GPT-3 language model and the Gym toolkit for reinforcement learning.

One of the main goals of OpenAI is to ensure that the development of AI is aligned with human values and does not pose a threat to humanity. To this end, the company has established a set of principles for safe and ethical AI development, and it actively collaborates with other organizations and researchers in the field.

OpenAI has received funding from various sources, including tech giants like Microsoft and Amazon, as well as individual investors. It has also partnered with companies and organizations such as Google, IBM, and the United Nations to advance its research and promote responsible AI development.

In addition to its research and development
```

## 自定义 URL

您可以通过传递 `configuration` 参数来自定义 SDK 发送请求的基础 URL，如下所示：

```typescript
const llmCustomURL = new OpenAI({
  temperature: 0.9,
  configuration: {
    baseURL: "https://your_custom_url.com",
  },
});
```

您也可以传递官方 SDK 接受的其他 `ClientOptions` 参数。

如果您使用的是 Azure OpenAI 托管服务，请参阅 [专用页面](/oss/javascript/integrations/llms/azure)。

---

## API 参考

关于所有 OpenAI 功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain_openai.OpenAI.html)。
