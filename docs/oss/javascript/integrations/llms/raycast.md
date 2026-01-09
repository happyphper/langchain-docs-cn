---
title: RaycastAI
---
> **注意：** 这是一个社区构建的集成，并非由 Raycast 官方支持。

您可以在 [Raycast 环境](https://developers.raycast.com/api-reference/ai) 中使用 LangChain 的 RaycastAI 类，以利用 LangChain 的能力增强您的 Raycast 扩展。

- RaycastAI 类仅在 Raycast 环境中可用，并且截至 2023 年 8 月，仅对 [Raycast Pro](https://www.raycast.com/pro) 用户开放。您可以在此处查看如何为 Raycast 创建扩展。

- 每个 Raycast Pro 用户大约有每分钟 10 个请求的速率限制。如果超过此限制，您将收到错误。您可以通过向 `RaycastAI` 构造函数传递 `rateLimitPerMinute` 来设置您期望的 rpm 限制，如示例所示，因为此速率限制未来可能会更改。

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core
```

```ts
import { RaycastAI } from "@langchain/community/llms/raycast";

import { Tool } from "@langchain/core/tools";

const model = new RaycastAI({
  rateLimitPerMinute: 10, // 默认值为 10，因此您可以省略此行
  model: "<model_name>",
  creativity: 0, // `creativity` 是 Raycast 使用的一个术语，相当于其他一些 LLM 中的 `temperature`
});
```

## 相关链接

- [模型指南](/oss/langchain/models)
