---
title: Dall-E 工具
---
```typescript
/* eslint-disable no-process-env */
import { DallEAPIWrapper } from "@langchain/openai";

const tool = new DallEAPIWrapper({
  n: 1, // 默认值
  model: "dall-e-3", // 默认值
  apiKey: process.env.OPENAI_API_KEY, // 默认值
});

const imageURL = await tool.invoke("a painting of a cat");

console.log(imageURL);
```

## 相关链接

- 工具 [概念指南](/oss/langchain/tools)
- 工具 [操作指南](/oss/langchain/tools)
