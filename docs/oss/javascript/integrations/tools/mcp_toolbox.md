---
title: MCP 数据库工具箱
---
[MCP Toolbox for Databases](https://github.com/googleapis/genai-toolbox) 是一个开源的 MCP 服务器，专为数据库设计。它旨在满足企业级和生产质量的要求。通过处理连接池、身份验证等复杂问题，它使您能够更轻松、更快速、更安全地开发工具。

Toolbox 工具可以无缝集成到 LangChain 应用程序中。有关[快速入门](https://googleapis.github.io/genai-toolbox/getting-started/local_quickstart_js/)或[配置](https://googleapis.github.io/genai-toolbox/getting-started/configure/) Toolbox 的更多信息，请参阅[文档](https://googleapis.github.io/genai-toolbox/getting-started/introduction/)。

### 配置与部署

Toolbox 是一个开源服务器，需要您自行部署和管理。有关部署和配置的更多说明，请参阅官方 Toolbox 文档：

- [安装服务器](https://googleapis.github.io/genai-toolbox/getting-started/introduction/#installing-the-server)
- [配置 Toolbox](https://googleapis.github.io/genai-toolbox/getting-started/configure/)

### 安装客户端 SDK

LangChain 依赖 `@toolbox-sdk/core` node 包来使用 Toolbox。请在开始前安装此包：

```shell
npm install @toolbox-sdk/core
```

### 加载 Toolbox 工具

一旦您的 Toolbox 服务器配置完毕并运行起来，您就可以使用 SDK 从您的服务器加载工具：

```javascript
import { ChatVertexAI } from "@langchain/google-vertexai"
import { ToolboxClient } from "@toolbox-sdk/core";
import { tool } from "@langchain/core/tools";
import { createAgent } from "@langchain/classic";

const model = new ChatVertexAI({
    model: "gemini-2.5-flash-lite",
    temperature: 0,
    maxRetries: 2,
});

// 替换为您的 Toolbox 服务器 URL
const URL = 'http://127.0.0.1:5000';

let client = ToolboxClient(URL);
toolboxTools = await client.loadToolset('toolsetName');

const getTool = (toolboxTool) => tool(toolboxTool, {
    name: toolboxTool.getName(),
    description: toolboxTool.getDescription(),
    schema: toolboxTool.getParamSchema()
});
const tools = toolboxTools.map(getTool);

const agent = createAgent({ llm: model, tools });
let inputs = { messages: [{ role: "user", content: Some query" }] };
let response = await agent.invoke(inputs);
console.log(response);
```

### 高级 Toolbox 功能

Toolbox 提供了多种功能，使为数据库开发 Gen AI 工具变得无缝。欲了解更多信息，请阅读以下内容：

- [认证参数](https://googleapis.github.io/genai-toolbox/resources/tools/#authenticated-parameters)：自动将工具输入绑定到 OIDC 令牌中的值，从而轻松运行敏感查询而不会潜在泄露数据。
- [授权调用](https://googleapis.github.io/genai-toolbox/resources/tools/#authorized-invocations)：根据用户的身份验证令牌限制对工具的使用访问。
- [OpenTelemetry](https://googleapis.github.io/genai-toolbox/how-to/export_telemetry/)：通过 [OpenTelemetry](https://opentelemetry.io/docs/) 从 Toolbox 获取指标和追踪信息。
