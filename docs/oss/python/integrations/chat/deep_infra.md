---
title: ChatDeepInfra
---
LangChain 通过 `ChatDeepInfra` 包装器支持由 [Deep Infra](https://deepinfra.com/) 托管的聊天模型。

首先，您需要安装 `@langchain/community` 包：

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/python/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core
```

您需要获取一个 API 密钥，并将其设置为名为 `DEEPINFRA_API_TOKEN` 的环境变量（或将其传递给构造函数），然后按如下方式调用模型：

```typescript
import { ChatDeepInfra } from "@langchain/community/chat_models/deepinfra";
import { HumanMessage } from "@langchain/core/messages";

const apiKey = process.env.DEEPINFRA_API_TOKEN;

const model = "meta-llama/Meta-Llama-3-70B-Instruct";

const chat = new ChatDeepInfra({
  model,
  apiKey,
});

const messages = [new HumanMessage("Hello")];

const res = await chat.invoke(messages);

console.log(res);
```

## 相关链接

- 聊天模型[概念指南](/oss/python/langchain/models)
- 聊天模型[操作指南](/oss/python/langchain/models)
