---
title: ChatGPT 插件检索器
---

<Warning>

此模块已被弃用，不再受支持。以下文档在 0.2.0 或更高版本中将无法使用。

</Warning>

此示例展示了如何在 LangChain 中使用 ChatGPT 检索插件。

要设置 ChatGPT 检索插件，请按照[此处](https://github.com/openai/chatgpt-retrieval-plugin)的说明进行操作。

## 使用方法

```typescript
import { ChatGPTPluginRetriever } from "@langchain/classic/retrievers/remote";

const retriever = new ChatGPTPluginRetriever({
  url: "http://0.0.0.0:8000",
  auth: {
    bearer: "super-secret-jwt-token-with-at-least-32-characters-long",
  },
});

const docs = await retriever.invoke("hello world");

console.log(docs);
```

## 相关链接

- [检索指南](/oss/python/langchain/retrieval)
