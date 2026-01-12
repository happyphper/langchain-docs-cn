---
title: ChatPrem
---
## 安装设置

1. 创建 Prem AI 账户并获取 API 密钥，请访问[此处](https://studio.premai.io/sign-up)。
2. 导出或内联设置你的 API 密钥。ChatPrem 类默认使用 `process.env.PREM_API_KEY`。

```bash
export PREM_API_KEY=your-api-key
```

你可以按如下方式使用 Prem AI 提供的模型：

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core
```

```typescript
import { ChatPrem } from "@langchain/community/chat_models/premai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatPrem({
  // 在 Node.js 中默认为 process.env.PREM_API_KEY
  apiKey: "YOUR-API-KEY",
  // 在 Node.js 中默认为 process.env.PREM_PROJECT_ID
  project_id: "YOUR-PROJECT_ID",
});

console.log(await model.invoke([new HumanMessage("Hello there!")]));
```

## 相关链接

- 聊天模型[概念指南](/oss/javascript/langchain/models)
- 聊天模型[操作指南](/oss/javascript/langchain/models)
