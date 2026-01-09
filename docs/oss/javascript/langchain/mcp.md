---
title: 模型上下文协议 (MCP)
---

[模型上下文协议 (Model Context Protocol, MCP)](https://modelcontextprotocol.io/introduction) 是一个开放协议，它标准化了应用程序如何向大语言模型 (LLMs) 提供工具和上下文。LangChain 智能体可以使用 [`@langchain/mcp-adapters`](https://github.com/langchain-ai/langchainjs/tree/main/libs/langchain-mcp-adapters) 库来使用 MCP 服务器上定义的工具。

## 快速开始

安装 `@langchain/mcp-adapters` 库：

::: code-group

```bash [npm]
npm install @langchain/mcp-adapters
```

```bash [pnpm]
pnpm add @langchain/mcp-adapters
```

```bash [yarn]
yarn add @langchain/mcp-adapters
```

```bash [bun]
bun add @langchain/mcp-adapters
```

:::

`@langchain/mcp-adapters` 使智能体能够使用一个或多个 MCP 服务器上定义的工具。

<Note>

`MultiServerMCPClient` <strong>默认是无状态的</strong>。每次工具调用都会创建一个新的 MCP `ClientSession`，执行工具，然后进行清理。更多详情请参阅[有状态会话](#stateful-sessions)部分。

</Note>

```ts Accessing multiple MCP servers icon="server"
import { MultiServerMCPClient } from "@langchain/mcp-adapters";  // [!code highlight]
import { ChatAnthropic } from "@langchain/anthropic";
import { createAgent } from "langchain";

const client = new MultiServerMCPClient({  // [!code highlight]
    math: {
        transport: "stdio",  // 本地子进程通信
        command: "node",
        // 替换为你的 math_server.js 文件的绝对路径
        args: ["/path/to/math_server.js"],
    },
    weather: {
        transport: "http",  // 基于 HTTP 的远程服务器
        // 确保你的天气服务器在 8000 端口启动
        url: "http://localhost:8000/mcp",
    },
});

const tools = await client.getTools();  // [!code highlight]
const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools,  // [!code highlight]
});

const mathResponse = await agent.invoke({
    messages: [{ role: "user", content: "what's (3 + 5) x 12?" }],
});

const weatherResponse = await agent.invoke({
    messages: [{ role: "user", content: "what is the weather in nyc?" }],
});
```

## 自定义服务器

要创建你自己的 MCP 服务器，你可以使用 `@modelcontextprotocol/sdk` 库。该库提供了一种简单的方式来定义[工具](https://modelcontextprotocol.io/docs/learn/server-concepts#tools-ai-actions)并将其作为服务器运行。

::: code-group

```bash [npm]
npm install @modelcontextprotocol/sdk
```

```bash [pnpm]
pnpm add @modelcontextprotocol/sdk
```

```bash [yarn]
yarn add @modelcontextprotocol/sdk
```

```bash [bun]
bun add @modelcontextprotocol/sdk
```

:::

要使用 MCP 工具服务器测试你的智能体，请使用以下示例：

```typescript title="数学服务器 (stdio 传输)" icon="floppy-disk"
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
    {
        name: "math-server",
        version: "0.1.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
        {
            name: "add",
            description: "Add two numbers",
            inputSchema: {
                type: "object",
                properties: {
                    a: {
                        type: "number",
                        description: "First number",
                    },
                    b: {
                        type: "number",
                        description: "Second number",
                    },
                },
                required: ["a", "b"],
            },
        },
        {
            name: "multiply",
            description: "Multiply two numbers",
            inputSchema: {
                type: "object",
                properties: {
                    a: {
                        type: "number",
                        description: "First number",
                    },
                    b: {
                        type: "number",
                        description: "Second number",
                    },
                },
                required: ["a", "b"],
            },
        },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "add": {
            const { a, b } = request.params.arguments as { a: number; b: number };
            return {
                content: [
                {
                    type: "text",
                    text: String(a + b),
                },
                ],
            };
        }
        case "multiply": {
            const { a, b } = request.params.arguments as { a: number; b: number };
            return {
                content: [
                {
                    type: "text",
                    text: String(a * b),
                },
                ],
            };
        }
        default:
            throw new Error(`Unknown tool: ${request.params.name}`);
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Math MCP server running on stdio");
}

main();
```

```typescript title="天气服务器 (SSE 传输)" icon="wifi"
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";

const app = express();
app.use(express.json());

const server = new Server(
    {
        name: "weather-server",
        version: "0.1.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
        {
            name: "get_weather",
            description: "Get weather for location",
            inputSchema: {
            type: "object",
            properties: {
                location: {
                type: "string",
                description: "Location to get weather for",
                },
            },
            required: ["location"],
            },
        },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "get_weather": {
            const { location } = request.params.arguments as { location: string };
            return {
                content: [
                    {
                        type: "text",
                        text: `It's always sunny in ${location}`,
                    },
                ],
            };
        }
        default:
            throw new Error(`Unknown tool: ${request.params.name}`);
    }
});

app.post("/mcp", async (req, res) => {
    const transport = new SSEServerTransport("/mcp", res);
    await server.connect(transport);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Weather MCP server running on port ${PORT}`);
});
```

## 传输方式

MCP 支持不同的传输机制用于客户端-服务器通信。

### HTTP

`http` 传输（也称为 `streamable-http`）使用 HTTP 请求进行客户端-服务器通信。更多详情请参阅 [MCP HTTP 传输规范](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http)。

```typescript
const client = new MultiServerMCPClient({
    weather: {
        transport: "sse",
        url: "http://localhost:8000/mcp",
    },
});
```

#### 传递请求头

#### 身份验证

### stdio

客户端将服务器作为子进程启动，并通过标准输入/输出进行通信。适用于本地工具和简单设置。

<Note>

与 HTTP 传输不同，`stdio` 连接本质上是<strong>有状态的</strong>——子进程在客户端连接的整个生命周期内持续存在。然而，当使用没有显式会话管理的 `MultiServerMCPClient` 时，每次工具调用仍然会创建一个新会话。有关管理持久连接的信息，请参阅[有状态会话](#stateful-sessions)。

</Note>

```typescript
const client = new MultiServerMCPClient({
    math: {
        transport: "stdio",
        command: "node",
        args: ["/path/to/math_server.js"],
    },
});
```

## 核心功能

### 工具

[工具](https://modelcontextprotocol.io/docs/concepts/tools)允许 MCP 服务器公开可执行的函数，LLMs 可以调用这些函数来执行操作——例如查询数据库、调用 API 或与外部系统交互。LangChain 将 MCP 工具转换为 LangChain [工具](/oss/langchain/tools)，使它们可以直接在任何 LangChain 智能体或工作流中使用。

#### 加载工具

使用 `client.get_tools()` 从 MCP 服务器检索工具，并将它们传递给你的智能体：

```typescript
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createAgent } from "langchain";

const client = new MultiServerMCPClient({...});
const tools = await client.getTools();  // [!code highlight]
const agent = createAgent({ model: "claude-sonnet-4-5-20250929", tools });
```

:::python

#### 结构化内容

MCP 工具除了人类可读的文本响应外，还可以返回[结构化内容](https://modelcontextprotocol.io/specification/2025-03-26/server/tools#structured-content)。当工具除了需要显示给模型的文本外，还需要返回机器可解析的数据（如 JSON）时，这很有用。

当 MCP 工具返回 `structuredContent` 时，适配器会将其包装在 [`MCPToolArtifact`](/docs/reference/langchain-mcp-adapters#MCPToolArtifact) 中，并将其作为工具的工件返回。你可以通过 `ToolMessage` 上的 `artifact` 字段访问它。你也可以使用[拦截器](#tool-interceptors)来自动处理或转换结构化内容。

**从工件中提取结构化内容**

调用智能体后，你可以从响应中的工具消息访问结构化内容：

```python
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent
from langchain.messages import ToolMessage

client = MultiServerMCP
