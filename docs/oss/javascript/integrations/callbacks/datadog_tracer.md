---
title: Datadog LLM 可观测性
---

<Warning>

LLM 可观测性功能目前处于公开测试阶段，其 API 可能会发生变化。

</Warning>

借助 [Datadog LLM 可观测性](https://docs.datadoghq.com/llm_observability/)，您可以监控、排查和评估由 LLM 驱动的应用程序（例如聊天机器人）。您可以调查问题的根本原因，监控运行性能，并评估 LLM 应用程序的质量、隐私和安全性。

这是一个实验性的社区实现，并非由 Datadog 官方支持。它基于 [Datadog LLM 可观测性 API](https://docs.datadoghq.com/llm_observability/api)。

## 安装

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core
```

## 使用方法

```typescript
import { OpenAI } from "@langchain/openai";
import { DatadogLLMObsTracer } from "@langchain/community/experimental/callbacks/handlers/datadog";

/**
 * 此示例演示了如何将 DatadogLLMObsTracer 与 OpenAI 模型一起使用。
 * 它将在 meta 字段内生成一个包含模型输入和输出的 "llm" span。
 *
 * 要运行此示例，您需要拥有有效的 Datadog API 密钥和 OpenAI API 密钥。
 */
export const run = async () => {
  const model = new OpenAI({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 1000,
    maxRetries: 5,
  });

  const res = await model.invoke(
    "Question: What would be a good company name a company that makes colorful socks?\nAnswer:",
    {
      callbacks: [
        new DatadogLLMObsTracer({
          mlApp: "my-ml-app",
        }),
      ],
    }
  );

  console.log({ res });
};
```
