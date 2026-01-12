---
title: WebLLM
---

<Tip>

<strong>兼容性说明</strong>

仅在 Web 环境中可用。

</Tip>

你可以使用 LangChain 的 [WebLLM](https://webllm.mlc.ai) 集成，直接在 Web 浏览器中运行 LLM。

## 安装设置

你需要安装 [WebLLM SDK](https://www.npmjs.com/package/@mlc-ai/web-llm) 模块来与你的本地模型通信。

<Tip>

关于安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install -S @mlc-ai/web-llm @langchain/community @langchain/core
```

## 使用方法

请注意，首次调用模型时，WebLLM 会下载该模型的完整权重。这可能达到数 GB，并且根据你的应用程序最终用户的网络连接和计算机配置，可能无法完成下载。
虽然浏览器会缓存该模型未来的调用，但我们建议使用尽可能小的模型。

我们还建议在调用和加载模型时使用[独立的 Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)，以避免阻塞执行。

```typescript
// 必须在 Web 环境中运行，例如 Web Worker

import { ChatWebLLM } from "@langchain/community/chat_models/webllm";
import { HumanMessage } from "@langchain/core/messages";

// 使用模型记录和聊天选项初始化 ChatWebLLM 模型。
// 请注意，如果设置了 appConfig 字段，模型记录列表必须包含引擎所选的模型记录。

// 你可以在此处导入默认可用的模型列表：
// https://github.com/mlc-ai/web-llm/blob/main/src/config.ts
//
// 或者通过以下方式导入：
// import { prebuiltAppConfig } from "@mlc-ai/web-llm";
const model = new ChatWebLLM({
  model: "Phi-3-mini-4k-instruct-q4f16_1-MLC",
  chatOptions: {
    temperature: 0.5,
  },
});

await model.initialize((progress: Record<string, unknown>) => {
  console.log(progress);
});

// 使用消息调用模型并等待响应。
const response = await model.invoke([
  new HumanMessage({ content: "What is 1 + 1?" }),
]);

console.log(response);

/*
AIMessage {
  content: ' 2\n',
}
*/
```

也支持流式传输。

## 示例

要查看完整的端到端示例，请查看[此项目](https://github.com/jacoblee93/fully-local-pdf-chatbot)。

## 相关链接

- 聊天模型[概念指南](/oss/javascript/langchain/models)
- 聊天模型[操作指南](/oss/javascript/langchain/models)
