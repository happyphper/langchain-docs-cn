---
title: WolframAlpha 工具
---
WolframAlpha 工具可将您的智能体和链（chains）连接到 WolframAlpha 先进的智能计算引擎。

## 安装设置

您需要在 [WolframAlpha 开发者门户](https://developer.wolframalpha.com/) 创建一个应用并获取 `appid`。

## 使用方法

```typescript
import { WolframAlphaTool } from "@langchain/community/tools/wolframalpha";

const tool = new WolframAlphaTool({
  appid: "YOUR_APP_ID",
});

const res = await tool.invoke("What is 2 * 2?");

console.log(res);
```

## 相关链接

- 工具 [概念指南](/oss/javascript/langchain/tools)
- 工具 [使用指南](/oss/javascript/langchain/tools)
