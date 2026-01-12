---
title: ChatLlamaCpp
---

<Tip>

<strong>兼容性说明</strong>

仅适用于 Node.js 环境。

</Tip>

该模块基于 [llama.cpp](https://github.com/ggerganov/llama.cpp) 的 [node-llama-cpp](https://github.com/withcatai/node-llama-cpp) Node.js 绑定，允许您与本地运行的 LLM 进行交互。这使您能够使用一个更小、经过量化的模型，该模型能够在笔记本电脑环境中运行，非常适合用于测试和初步构思，而无需产生任何费用！

## 安装设置

您需要安装主版本号为 `3` 的 [node-llama-cpp](https://github.com/withcatai/node-llama-cpp) 模块，以便与您的本地模型通信。

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install -S node-llama-cpp@3 @langchain/community @langchain/core
```

您还需要一个本地的 Llama 3 模型（或 [node-llama-cpp](https://github.com/withcatai/node-llama-cpp) 支持的模型）。您需要将此模型的路径作为参数的一部分传递给 LlamaCpp 模块（参见示例）。

开箱即用的 `node-llama-cpp` 针对在 MacOS 平台上运行进行了优化，支持 Apple M 系列处理器的 Metal GPU。如果您需要关闭此功能或需要 CUDA 架构支持，请参阅 [node-llama-cpp](https://withcatai.github.io/node-llama-cpp/) 的文档。

关于获取和准备 `llama3` 模型的建议，请参阅此模块 LLM 版本的文档。

给 LangChain.js 贡献者的说明：如果您想运行与此模块相关的测试，需要将本地模型的路径放入环境变量 `LLAMA_PATH` 中。

## 使用方法

### 基本使用

在这种情况下，我们传入一个包装为消息的提示（prompt），并期望得到一个响应。

```typescript
import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { HumanMessage } from "@langchain/core/messages";

const llamaPath = "/Replace/with/path/to/your/model/gguf-llama3-Q4_0.bin";

const model = await ChatLlamaCpp.initialize({ modelPath: llamaPath });

const response = await model.invoke([
  new HumanMessage({ content: "My name is John." }),
]);
console.log({ response });

/*
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: 'Hello John.',
      additional_kwargs: {}
    },
    lc_namespace: [ 'langchain', 'schema' ],
    content: 'Hello John.',
    name: undefined,
    additional_kwargs: {}
  }
*/
```

### 系统消息

我们也可以提供系统消息，请注意，使用 `llama_cpp` 模块时，系统消息将导致创建一个新的会话。

```typescript
import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const llamaPath = "/Replace/with/path/to/your/model/gguf-llama3-Q4_0.bin";

const model = await ChatLlamaCpp.initialize({ modelPath: llamaPath });

const response = await model.invoke([
  new SystemMessage(
    "You are a pirate, responses must be very verbose and in pirate dialect, add 'Arr, m'hearty!' to each sentence."
  ),
  new HumanMessage("Tell me where Llamas come from?"),
]);
console.log({ response });

/*
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "Arr, m'hearty! Llamas come from the land of Peru.",
      additional_kwargs: {}
    },
    lc_namespace: [ 'langchain', 'schema' ],
    content: "Arr, m'hearty! Llamas come from the land of Peru.",
    name: undefined,
    additional_kwargs: {}
  }
*/
```

### 链式调用

此模块也可以与链（chains）一起使用，请注意，使用更复杂的链将需要相应更强大的 `llama3` 版本，例如 70B 版本。

```typescript
import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { LLMChain } from "@langchain/classic/chains";
import { PromptTemplate } from "@langchain/core/prompts";

const llamaPath = "/Replace/with/path/to/your/model/gguf-llama3-Q4_0.bin";

const model = await ChatLlamaCpp.initialize({
  modelPath: llamaPath,
  temperature: 0.5,
});

const prompt = PromptTemplate.fromTemplate(
  "What is a good name for a company that makes {product}?"
);
const chain = new LLMChain({ llm: model, prompt });

const response = await chain.invoke({ product: "colorful socks" });

console.log({ response });

/*
  {
  text: `I'm not sure what you mean by "colorful socks" but here are some ideas:\n` +
    '\n' +
    '- Sock-it to me!\n' +
    '- Socks Away\n' +
    '- Fancy Footwear'
  }
*/
```

### 流式输出

我们也可以使用 Llama CPP 进行流式输出，这可以使用原始的“单提示”字符串：

```typescript
import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";

const llamaPath = "/Replace/with/path/to/your/model/gguf-llama3-Q4_0.bin";

const model = await ChatLlamaCpp.initialize({
  modelPath: llamaPath,
  temperature: 0.7,
});

const stream = await model.stream("Tell me a short story about a happy Llama.");

for await (const chunk of stream) {
  console.log(chunk.content);
}

/*

  Once
   upon
   a
   time
  ,
   in
   a
   green
   and
   sunny
   field
  ...
*/
```

或者，您可以提供多条消息，请注意，这会接收输入，然后将一个 Llama3 格式的提示提交给模型。

```typescript
import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const llamaPath = "/Replace/with/path/to/your/model/gguf-llama3-Q4_0.bin";

const llamaCpp = await ChatLlamaCpp.initialize({
  modelPath: llamaPath,
  temperature: 0.7,
});

const stream = await llamaCpp.stream([
  new SystemMessage(
    "You are a pirate, responses must be very verbose and in pirate dialect."
  ),
  new HumanMessage("Tell me about Llamas?"),
]);

for await (const chunk of stream) {
  console.log(chunk.content);
}

/*

  Ar
  rr
  r
  ,
   me
   heart
  y
  !

   Ye
   be
   ask
  in
  '
   about
   llam
  as
  ,
   e
  h
  ?
  ...
*/
```

使用 `invoke` 方法，我们也可以实现流式生成，并使用 `signal` 来中止生成。

```typescript
import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const llamaPath = "/Replace/with/path/to/your/model/gguf-llama3-Q4_0.bin";

const model = await ChatLlamaCpp.initialize({
  modelPath: llamaPath,
  temperature: 0.7,
});

const controller = new AbortController();

setTimeout(() => {
  controller.abort();
  console.log("Aborted");
}, 5000);

await model.invoke(
  [
    new SystemMessage(
      "You are a pirate, responses must be very verbose and in pirate dialect."
    ),
    new HumanMessage("Tell me about Llamas?"),
  ],
  {
    signal: controller.signal,
    callbacks: [
      {
        handleLLMNewToken(token) {
          console.log(token);
        },
      },
    ],
  }
);
/*

  Once
   upon
   a
   time
  ,
   in
   a
   green
   and
   sunny
   field
  ...
  Aborted

  AbortError

*/
```

## 相关链接

- 聊天模型[概念指南](/oss/javascript/langchain/models)
- 聊天模型[操作指南](/oss/javascript/langchain/models)
