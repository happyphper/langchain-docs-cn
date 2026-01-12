---
title: 工具 (Tools)
---

工具扩展了[智能体 (agents)](/oss/javascript/langchain/agents)的能力——让它们能够获取实时数据、执行代码、查询外部数据库，并在现实世界中采取行动。

在底层，工具是具有明确定义输入和输出的可调用函数，它们会被传递给[聊天模型 (chat model)](/oss/javascript/langchain/models)。模型根据对话上下文决定何时调用工具，以及提供哪些输入参数。

<Tip>

有关模型如何处理工具调用的详细信息，请参阅[工具调用 (Tool calling)](/oss/javascript/langchain/models#tool-calling)。

</Tip>

## 创建工具 (Create tools)

### 基础工具定义 (Basic tool definition)

创建工具最简单的方法是从 `langchain` 包中导入 `tool` 函数。你可以使用 [zod](https://zod.dev/) 来定义工具的输入模式：

```ts
import * as z from "zod"
import { tool } from "langchain"

const searchDatabase = tool(
  ({ query, limit }) => `Found ${limit} results for '${query}'`,
  {
    name: "search_database",
    description: "Search the customer database for records matching the query.",
    schema: z.object({
      query: z.string().describe("要查找的搜索词"),
      limit: z.number().describe("要返回的最大结果数"),
    }),
  }
);
```

<Note>

<strong>服务端工具使用 (Server-side tool use)</strong>

一些聊天模型（例如 [OpenAI](/oss/javascript/integrations/chat/openai)、[Anthropic](/oss/javascript/integrations/chat/anthropic) 和 [Gemini](/oss/javascript/integrations/chat/google_generative_ai)）具有[内置工具 (built-in tools)](/oss/javascript/langchain/models#server-side-tool-use)，这些工具在服务端执行，例如网络搜索和代码解释器。请参阅[提供商概览 (provider overview)](/oss/javascript/integrations/providers/overview)以了解如何通过你特定的聊天模型访问这些工具。

</Note>

## 访问上下文 (Accessing context)

<Info>

<strong>为什么这很重要：</strong> 当工具能够访问智能体状态、运行时上下文和长期记忆时，它们的功能最为强大。这使得工具能够做出上下文感知的决策、个性化响应，并在对话间维护信息。

运行时上下文提供了一种结构化的方式来向工具提供运行时数据，例如数据库连接、用户 ID 或配置。这避免了全局状态，并保持工具的可测试性和可重用性。

</Info>

#### 上下文 (Context)

工具可以通过 `config` 参数访问智能体的运行时上下文：

```ts
import * as z from "zod"
import { ChatOpenAI } from "@langchain/openai"
import { createAgent } from "langchain"

const getUserName = tool(
  (_, config) => {
    return config.context.user_name
  },
  {
    name: "get_user_name",
    description: "获取用户的姓名。",
    schema: z.object({}),
  }
);

const contextSchema = z.object({
  user_name: z.string(),
});

const agent = createAgent({
  model: new ChatOpenAI({ model: "gpt-4o" }),
  tools: [getUserName],
  contextSchema,
});

const result = await agent.invoke(
  {
    messages: [{ role: "user", content: "我的名字叫什么？" }]
  },
  {
    context: { user_name: "John Smith" }
  }
);
```

#### 记忆 (存储) (Memory (Store))

使用存储 (Store) 访问跨对话的持久数据。存储通过 `config.store` 访问，允许你保存和检索用户特定或应用程序特定的数据。

```ts [expandable]
import * as z from "zod";
import { createAgent, tool } from "langchain";
import { InMemoryStore } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

const store = new InMemoryStore();

// 访问记忆 (Memory)
const getUserInfo = tool(
  async ({ user_id }) => {
    const value = await store.get(["users"], user_id);
    console.log("get_user_info", user_id, value);
    return value;
  },
  {
    name: "get_user_info",
    description: "查找用户信息。",
    schema: z.object({
      user_id: z.string(),
    }),
  }
);

// 更新记忆 (Memory)
const saveUserInfo = tool(
  async ({ user_id, name, age, email }) => {
    console.log("save_user_info", user_id, name, age, email);
    await store.put(["users"], user_id, { name, age, email });
    return "Successfully saved user info.";
  },
  {
    name: "save_user_info",
    description: "保存用户信息。",
    schema: z.object({
      user_id: z.string(),
      name: z.string(),
      age: z.number(),
      email: z.string(),
    }),
  }
);

const agent = createAgent({
  model: new ChatOpenAI({ model: "gpt-4o" }),
  tools: [getUserInfo, saveUserInfo],
  store,
});

// 第一个会话：保存用户信息
await agent.invoke({
  messages: [
    {
      role: "user",
      content: "保存以下用户：userid: abc123, name: Foo, age: 25, email: foo@langchain.dev",
    },
  ],
});

// 第二个会话：获取用户信息
const result = await agent.invoke({
  messages: [
    { role: "user", content: "获取 ID 为 'abc123' 的用户信息" },
  ],
});

console.log(result);
// 以下是 ID 为 "abc123" 的用户信息：
// - Name: Foo
// - Age: 25
// - Email: foo@langchain.dev
```

#### 流写入器 (Stream writer)

使用 `config.streamWriter` 在工具执行时流式传输自定义更新。这对于向用户提供关于工具正在做什么的实时反馈非常有用。

```ts
import * as z from "zod";
import { tool, ToolRuntime } from "langchain";

const getWeather = tool(
  ({ city }, config: ToolRuntime) => {
    const writer = config.writer;

    // 在工具执行时流式传输自定义更新
    if (writer) {
      writer(`正在查询城市数据：${city}`);
      writer(`已获取城市数据：{city}`);
    }

    return `It's always sunny in ${city}!`;
  },
  {
    name: "get_weather",
    description: "获取指定城市的天气。",
    schema: z.object({
      city: z.string(),
    }),
  }
);
```

