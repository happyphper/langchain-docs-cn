---
title: Llama CPP
---

<Tip>

<strong>兼容性说明</strong>

仅适用于 Node.js 环境。

</Tip>

本模块基于 [llama.cpp](https://github.com/ggerganov/llama.cpp) 的 [node-llama-cpp](https://github.com/withcatai/node-llama-cpp) Node.js 绑定，允许您使用本地运行的 LLM。这使得您能够使用一个更小、经过量化的模型，该模型能够在笔记本电脑环境中运行，非常适合用于测试和初步构思，而无需产生任何费用！

## 安装设置

您需要安装主版本号为 `3` 的 [node-llama-cpp](https://github.com/withcatai/node-llama-cpp) 模块，以便与您的本地模型通信。

```bash [npm]
npm install -S node-llama-cpp@3
```

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/python/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core
```

您还需要一个本地的 Llama 3 模型（或 [node-llama-cpp](https://github.com/withcatai/node-llama-cpp) 支持的模型）。您需要将此模型的路径作为参数的一部分传递给 LlamaCpp 模块（参见示例）。

开箱即用的 `node-llama-cpp` 针对在 MacOS 平台上运行进行了优化，支持 Apple M 系列处理器的 Metal GPU。如果您需要关闭此功能或需要 CUDA 架构支持，请参阅 [node-llama-cpp](https://withcatai.github.io/node-llama-cpp/) 的文档。

关于获取和准备 `llama3` 模型的建议，请参阅本模块 LLM 版本的文档。

给 LangChain.js 贡献者的提示：如果您想运行与此模块相关的测试，需要将本地模型的路径放入环境变量 `LLAMA_PATH` 中。

## 使用方法

### 基本使用

我们需要提供本地 Llama3 模型的路径，此外，在本模块中 `embeddings` 属性始终设置为 `true`。

```typescript
import { LlamaCppEmbeddings } from "@langchain/community/embeddings/llama_cpp";

const llamaPath = "/Replace/with/path/to/your/model/gguf-llama3-Q4_0.bin";

const embeddings = await LlamaCppEmbeddings.initialize({
  modelPath: llamaPath,
});

const res = embeddings.embedQuery("Hello Llama!");

console.log(res);

/*
	[ 15043, 365, 29880, 3304, 29991 ]
*/
```

### 文档嵌入

```typescript
import { LlamaCppEmbeddings } from "@langchain/community/embeddings/llama_cpp";

const llamaPath = "/Replace/with/path/to/your/model/gguf-llama3-Q4_0.bin";

const documents = ["Hello World!", "Bye Bye!"];

const embeddings = await LlamaCppEmbeddings.initialize({
  modelPath: llamaPath,
});

const res = await embeddings.embedDocuments(documents);

console.log(res);

/*
	[ [ 15043, 2787, 29991 ], [ 2648, 29872, 2648, 29872, 29991 ] ]
*/
```

## 相关链接

- 嵌入模型[概念指南](/oss/python/integrations/text_embedding)
- 嵌入模型[操作指南](/oss/python/integrations/text_embedding)
