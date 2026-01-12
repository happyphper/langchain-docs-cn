---
title: Composio
description: 通过 Composio 的统一 API 平台，为 AI 智能体接入 500 多种工具与集成，提供 OAuth 处理、事件驱动工作流和多用户支持。
---
[Composio](https://composio.dev) 是一个集成平台，提供对 500 多种工具的访问，涵盖 GitHub、Slack、Notion 等流行应用程序。它使 AI 智能体能够通过统一的 API 与外部服务交互，处理身份验证、权限和事件驱动的工作流。

## 概述

### 集成详情

| 类别 | 包 | 可序列化 | [Python 支持](/oss/javascript/integrations/tools/composio) | 版本 |
|:---|:---|:---:|:---:|:---:|
| Composio | [@composio/langchain](https://www.npmjs.com/package/@composio/langchain) | ❌ | ✅ | ![npm version](https://img.shields.io/npm/v/@composio/langchain?style=flat-square&label=%20) |

### 工具特性

- **500+ 工具访问**：为 GitHub、Slack、Gmail、Jira、Notion 等提供预构建集成
- **身份验证管理**：处理 OAuth 流程、API 密钥和身份验证状态
- **事件驱动的工作流**：基于外部事件（新的 Slack 消息、GitHub 问题等）触发智能体
- **细粒度权限**：按用户控制工具访问和数据暴露
- **自定义工具支持**：添加专有 API 和内部工具

## 设置

该集成位于 `@composio/langchain` 包中。

```bash
npm install @composio/langchain @composio/core
```

或使用其他包管理器：

```bash
yarn add @composio/langchain @composio/core
# 或
pnpm add @composio/langchain @composio/core
```

### 凭证

您需要一个 Composio API 密钥。在 [composio.dev](https://composio.dev) 免费注册以获取您的 API 密钥。

```typescript [Set API key]
import * as dotenv from 'dotenv';
dotenv.config();

// Set your Composio API key
process.env.COMPOSIO_API_KEY = 'your_api_key_here';
```

设置 [LangSmith](https://docs.langchain.com/langsmith/home) 以进行追踪也很有帮助：

```typescript [Enable tracing]
// process.env.LANGSMITH_API_KEY = 'your_langsmith_key';
// process.env.LANGSMITH_TRACING = 'true';
```

## 实例化

使用 LangChain 提供程序初始化 Composio，并从特定的工具包中获取工具。每个工具包代表一个服务（例如 GitHub、Slack），其中包含多个工具（您可以执行的操作）。

```typescript [Initialize Composio]
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';

// Initialize Composio with LangChain provider
const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY,
    provider: new LangchainProvider(),
});

// Get tools from specific toolkits
const tools = await composio.tools.get('default', 'GITHUB');

console.log(`Loaded ${tools.length} tools from GitHub toolkit`);
```

### 可用的工具包

Composio 为各种服务提供工具包：

**生产力**：GitHub、Slack、Gmail、Jira、Notion、Asana、Trello、ClickUp
**通信**：Discord、Telegram、WhatsApp、Microsoft Teams
**开发**：GitLab、Bitbucket、Linear、Sentry
**数据与分析**：Google Sheets、Airtable、HubSpot、Salesforce
**以及 100 多种更多...**

## 调用

### 从多个工具包获取工具

您可以从多个服务加载工具：

```typescript
// Get tools from multiple toolkits
const tools = await composio.tools.get('default', ['GITHUB', 'SLACK', 'GMAIL']);
```

### 获取特定工具

您可以加载特定工具，而不是整个工具包：

```typescript
// Get specific tools by name
const tools = await composio.tools.get('default', {
    tools: ['GITHUB_CREATE_ISSUE', 'SLACK_SEND_MESSAGE']
});
```

### 用户特定工具

Composio 支持具有用户特定身份验证的多用户场景：

```typescript
// Get tools for a specific user
// This user must have authenticated their accounts first
const tools = await composio.tools.get('user_123', 'GITHUB');
```

## 在智能体中使用

这是一个使用 Composio 工具与 LangGraph 智能体交互以与 HackerNews 交互的完整示例：

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';

// Initialize Composio
const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY,
    provider: new LangchainProvider(),
});

// Fetch the tools
console.log('🔄 Fetching the tools...');
const tools = await composio.tools.get('default', 'HACKERNEWS_GET_USER');

// Define the tools for the agent to use
const toolNode = new ToolNode(tools);

// Create a model and give it access to the tools
const model = new ChatOpenAI({
    model: 'gpt-5',
}).bindTools(tools);

// Define the function that determines whether to continue or not
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
        return 'tools';
    }

    // Otherwise, we stop (reply to the user)
    return '__end__';
}

// Define the function that calls the model
async function callModel(state: typeof MessagesAnnotation.State) {
    console.log('🔄 Calling the model...');
    const response = await model.invoke(state.messages);
    return { messages: [response] };
}

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
    .addNode('agent', callModel)
    .addEdge('__start__', 'agent')
    .addNode('tools', toolNode)
    .addEdge('tools', 'agent')
    .addConditionalEdges('agent', shouldContinue);

// Compile the graph
const app = workflow.compile();

// Use the agent
const finalState = await app.invoke({
    messages: [new HumanMessage('Find the details of the user `pg` on HackerNews')]
});

console.log('✅ Message received from the model');
console.log(finalState.messages[finalState.messages.length - 1].content);

// Continue the conversation
const nextState = await app.invoke({
    messages: [...finalState.messages, new HumanMessage('what about haxzie')]
});

console.log('✅ Message received from the model');
console.log(nextState.messages[nextState.messages.length - 1].content);
```

### 使用 GitHub 工具包

这是一个为 GitHub 仓库加星标的示例：

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';

// Initialize Composio
const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY,
    provider: new LangchainProvider(),
});

// Get GitHub tools
const tools = await composio.tools.get('default', 'GITHUB');

// Create model
const model = new ChatOpenAI({
    model: 'gpt-5',
});

// Create agent
const agent = createReactAgent({
    llm: model,
    tools: tools,
});

// Execute task
const result = await agent.invoke({
    messages: [
        {
            role: 'user',
            content: 'Star the repository composiohq/composio on GitHub'
        }
    ]
});

console.log(result.messages[result.messages.length - 1].content);
```

## 身份验证设置

在使用需要身份验证的工具之前，用户需要连接他们的账户：

```typescript
import { Composio } from '@composio/core';

const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY
});

// Get authentication URL for a user
const authConnection = await composio.integrations.create({
    userId: 'user_123',
    integration: 'github'
});

console.log(`Authenticate at: ${authConnection.redirectUrl}`);

// After authentication, the user's connected account will be available
// and tools will work with their credentials
```

## 多用户场景

对于具有多个用户的应用程序：

```typescript
// Each user authenticates their own accounts
const toolsUser1 = await composio.tools.get('user_1', 'GITHUB');
const toolsUser2 = await composio.tools.get('user_2', 'GITHUB');

// Tools will use the respective user's credentials
// User 1's agent will act on User 1's GitHub account
const agent1 = createAgent(model, toolsUser1);

// User 2's agent will act on User 2's GitHub account
const agent2 = createAgent(model, toolsUser2);
```

## 事件驱动的工作流

Composio 支持基于外部事件触发智能体。当已连接应用程序中发生事件（如新的 GitHub 提交或 Slack 消息）时，触发器会自动将结构化有效负载发送到您的应用程序。

### 创建触发器

首先，为您想要监控的事件创建一个触发器：

```typescript
import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: 'your_api_key' });
const userId = 'user_123';

// Check what configuration is required for the trigger
const triggerType = await composio.triggers.getType('GITHUB_COMMIT_EVENT');
console.log(triggerType.config);

// Create trigger with required configuration
const trigger = await composio.triggers.create(
    userId,
    'GITHUB_COMMIT_EVENT',
    {
        triggerConfig: {
            owner: 'composiohq',
            repo: 'composio'
        }
    }
);

console.log(`Trigger created: ${trigger.triggerId}`);
```

### 订阅触发器（开发）

对于本地开发和原型设计，您可以直接订阅触发器：

```typescript
import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: 'your_api_key' });

// Subscribe to trigger events
composio.triggers.subscribe(
    (data) => {
        console.log(`New commit detected:`, data);
        // Process the event with your agent
        // ... invoke your agent with the task
    },
    {
        triggerId: 'your_trigger_id',
        // You can also filter by:
        // userId: 'user@acme.com',
        // toolkits: ['github', 'slack'],
        // triggerSlug: ["GITHUB_COMMIT_EVENT"],
        // authConfigId: "ac_1234567890"
    }
);

// Note: For production, use webhooks instead
```

### 类型安全的触发器处理

为了更好的类型安全，定义有效负载类型：

```typescript
import { TriggerEvent } from '@composio/core';

// Define type-safe payload
export type GitHubStarAddedEventPayload = {
    action: 'created';
    repository_id: number;
    repository_name: string;
    repository_url: string;
    starred_at: string;
    starred_by: string;
};

// Type-safe handler
function handleGitHubStarAddedEvent(event: TriggerEvent<GitHubStarAddedEventPayload>) {
    console.log(`⭐ ${event.data.repository_name} starred by ${event.data.starred_by}`);
}
```

### Webhooks（生产环境）

对于生产环境，请在 [Composio 仪表板](https://platform.composio.dev/settings/events) 中配置 webhooks：

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload = req.body;

        console.log('Received trigger event:', payload);

        // Process the event with your agent
        if (payload.triggerSlug === 'GITHUB_COMMIT_EVENT') {
            const commitData = payload.payload;
            // ... invoke your agent with commitData
        }

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
```

更多详情，请参阅 [Composio 触发器文档](https://docs.composio.dev/docs/using-triggers)

## 高级功能

### 自定义工具

Composio 允许您创建可与内置工具一起使用的自定义工具。有两种类型：

#### 独立工具

不需要身份验证的简单工具：

```typescript
import { Composio } from '@composio/core';
import { z } from 'zod';

const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY
});

const tool = await composio.tools.createCustomTool({
    slug: 'CALCULATE_SQUARE',
    name: 'Calculate Square',
    description: 'Calculates the square of a number',
    inputParams: z.object({
        number: z.number().describe('The number to calculate the square of'),
    }),
    execute: async input => {
        const { number } = input;
        return {
            data: { result: number * number },
            error: null,
            successful: true,
        };
    },
});

// Use with your agent
const allTools = [...tools, tool];
```

#### 基于工具包的工具

需要身份验证并可以使用工具包凭证的工具：

```typescript
import { Composio } from '@composio/core';
import { z } from 'zod';

const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY
});

const tool = await composio.tools.createCustomTool({
    slug: 'GITHUB_STAR_COMPOSIOHQ_REPOSITORY',
    name: 'Github star composio repositories',
    toolkitSlug: 'github',
    description: 'Star any specified repo of `composiohq` user',
    inputParams: z.object({
        repository: z.string().describe('The repository to star'),
        page: z.number().optional().describe('Pagination page number'),
        customHeader: z.string().optional().describe('Custom header'),
    }),
    execute: async (input, connectionConfig, executeToolRequest) => {
        // This method makes authenticated requests to the relevant API
        // Composio will automatically inject the baseURL
        const result = await executeToolRequest({
            endpoint: `/user/starred/composiohq/${input.repository}`,
            method: 'PUT',
            body: {},
            // Add custom headers or query parameters
            parameters: [
                // Add query parameters
                {
                    name: 'page',
                    value: input.page?.toString() || '1',
                    in: 'query',
                },
                // Add custom headers
                {
                    name: 'x-custom-header',
                    value: input.customHeader || 'default-value',
                    in: 'header',
                },
            ],
        });
        return result;
    },
});
```

执行自定义工具：

```typescript
import { Composio } from '@composio/core';

const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY
});

const result = await composio.tools.execute('TOOL_SLUG', {
    arguments: {
        // Tool input parameters
    },
    userId: 'user-id',
    connectedAccountId: 'optional-account-id', // Required for toolkit-based tools
});
```

更多详情，请参阅 [Composio 自定义工具文档](https://docs.composio.dev/docs/custom-tools)

### 细粒度权限

控制工具可以执行的操作：

```typescript
// Get tools with specific permissions
const tools = await composio.tools.get('default', 'GITHUB', {
    // Limit to read-only operations
    permissions: ['read']
});
```

---

## API 参考

有关所有 Composio 功能和配置的详细文档，请访问：
- [Composio 文档](https://docs.composio.dev)
- [LangChain 提供程序指南](https://docs.composio.dev/providers/langchain)
- [可用工具与操作](https://docs.composio.dev/toolkits/introduction)
