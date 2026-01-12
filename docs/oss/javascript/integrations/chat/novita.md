---
title: ChatNovita
---
提供一个经济实惠、可靠且简单的推理平台，用于运行顶级大语言模型（LLM）。

您可以在此处找到我们支持的所有模型：[Novita AI 精选模型](https://novita.ai/models/llm?utm_source=github_langchain&utm_medium=github_readme&utm_campaign=link)，或请求 [Models API](https://novita.ai/docs/guides/llm-models?utm_source=github_langchain&utm_medium=github_readme&utm_campaign=link) 以获取所有可用模型。

立即尝试 [Novita AI DeepSeek R1 API 演示](https://novita.ai/models/llm/deepseek-deepseek-r1?utm_source=github_langchain&utm_medium=github_readme&utm_campaign=link)！

## 概述

### 模型特性

| [工具调用](/oss/javascript/langchain/tools) | [结构化输出](/oss/javascript/langchain/structured-output) | [图像输入](/oss/javascript/langchain/messages#multimodal) | 音频输入 | 视频输入 | [Token 级流式传输](/oss/javascript/langchain/streaming/) | 原生异步 | [Token 使用量](/oss/javascript/langchain/models#token-usage) | [Logprobs](/oss/javascript/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

## 设置

要访问 Novita AI 模型，您需要创建一个 Novita 账户并获取一个 API 密钥。

### 凭证

前往[此页面](https://novita.ai/settings#key-management?utm_source=github_langchain&utm_medium=github_readme&utm_campaign=link)注册 Novita AI 并生成一个 API 密钥。完成后，请设置 `NOVITA_API_KEY` 环境变量：

```bash
export NOVITA_API_KEY="your-api-key"
```

### 安装

LangChain 的 Novita 集成位于 `@langchain-community` 包中：

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

现在我们可以实例化我们的模型对象并生成聊天补全。立即尝试 [Novita AI DeepSeek R1 API 演示](https://novita.ai/models/llm/deepseek-deepseek-r1?utm_source=github_langchain&utm_medium=github_readme&utm_campaign=link)！

```python
import { ChatNovitaAI } from "@langchain/community/chat_models/novita";

const llm = new ChatNovitaAI({
  model: "deepseek/deepseek-r1",
  temperature: 0,
  // 其他参数...
})
```

## 调用

```python
const aiMsg = await llm.invoke([
  {
    role: "system",
    content: "You are a helpful assistant that translates English to French. Translate the user sentence.",
  },
  {
    role: "human",
    content: "I love programming."
  },
]);
```

```python
console.log(aiMsg.content)
```

---

## API 参考

有关 Novita AI LLM API 的详细文档，请访问 [Novita AI LLM API 参考](https://novita.ai/docs/guides/llm-api?utm_source=github_langchain&utm_medium=github_readme&utm_campaign=link)
