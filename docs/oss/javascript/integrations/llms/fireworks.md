---
title: Fireworks
---

<Warning>

<strong>您当前正在查看的是关于将 Fireworks 模型用作文本补全模型的文档页面。Fireworks 上提供的许多热门模型是[聊天补全模型](/oss/javascript/langchain/models)。</strong>

您可能正在寻找[这个页面](/oss/javascript/integrations/chat/fireworks/)。

</Warning>

[Fireworks AI](https://fireworks.ai/) 是一个用于运行和定制模型的 AI 推理平台。有关 Fireworks 提供的所有模型列表，请参阅 [Fireworks 文档](https://fireworks.ai/models)。

本文将帮助您开始使用 LangChain 处理 Fireworks 补全模型（LLMs）。有关 `Fireworks` 功能和配置选项的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_community_llms_fireworks.Fireworks.html)。

## 概述

### 集成详情

| 类 | 包 | 本地 | 可序列化 | [Python 支持](https://python.langchain.com/docs/integrations/llms/fireworks) | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: | :---: |
| [Fireworks](https://api.js.langchain.com/classes/langchain_community_llms_fireworks.Fireworks.html) | [@langchain/community](https://api.js.langchain.com/modules/langchain_community_llms_fireworks.html) | ❌ | ✅ | ✅ | ![NPM - Downloads](https://img.shields.io/npm/dm/@langchain/community?style=flat-square&label=%20&) | ![NPM - Version](https://img.shields.io/npm/v/@langchain/community?style=flat-square&label=%20&) |

## 设置

要访问 Fireworks 模型，您需要创建一个 Fireworks 账户，获取一个 API 密钥，并安装 `@langchain/community` 集成包。

### 凭证

前往 [fireworks.ai](https://fireworks.ai/) 注册 Fireworks 并生成一个 API 密钥。完成后，设置 `FIREWORKS_API_KEY` 环境变量：

```bash
export FIREWORKS_API_KEY="your-api-key"
```

如果您希望自动追踪模型调用，还可以通过取消注释以下内容来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain 的 Fireworks 集成位于 `@langchain/community` 包中：

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

现在我们可以实例化我们的模型对象并生成文本补全：

```typescript
import { Fireworks } from "@langchain/community/llms/fireworks"

const llm = new Fireworks({
  model: "accounts/fireworks/models/llama-v3-70b-instruct",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  // 其他参数...
})
```

## 调用

```typescript
const inputText = "Fireworks is an AI company that "

const completion = await llm.invoke(inputText)
completion
```

```text
 helps businesses automate their customer support using AI-powered chatbots. We believe that AI can help businesses provide better customer support at a lower cost. Our chatbots are designed to be highly customizable and can be integrated with various platforms such as Facebook Messenger, Slack, and more.

We are looking for a talented and motivated **Machine Learning Engineer** to join our team. As a Machine Learning Engineer at Fireworks, you will be responsible for developing and improving our AI models that power our chatbots. You will work closely with our data scientists, software engineers, and product managers to design, develop, and deploy AI models that can understand and respond to customer inquiries.

**Responsibilities:**

* Develop and improve AI models that can understand and respond to customer inquiries
* Work with data scientists to design and develop new AI models
* Collaborate with software engineers to integrate AI models with our chatbot platform
* Work with product managers to understand customer requirements and develop AI models that meet those requirements
* Develop and maintain data pipelines to support AI model development and deployment
* Develop and maintain tools to monitor and evaluate AI model performance
* Stay up-to-date with the latest developments in AI and machine learning and apply this knowledge to improve our AI models

**Requirements:**

* Bachelor's
```

---

## API 参考

有关所有 Fireworks 功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain_community_llms_fireworks.Fireworks.html)。
