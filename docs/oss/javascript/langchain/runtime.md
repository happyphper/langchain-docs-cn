---
title: 运行时
---
## 概述

LangChain 的 `createAgent` 底层运行在 LangGraph 的运行时上。

LangGraph 暴露了一个 <a href="https://reference.langchain.com/javascript/interfaces/_langchain_langgraph.index.Runtime.html" target="_blank" rel="noreferrer" class="link"><code>Runtime</code></a> 对象，包含以下信息：

1.  **上下文**：静态信息，例如用户 ID、数据库连接或代理调用所需的其他依赖项。
2.  **存储**：一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph-checkpoint.BaseStore.html" target="_blank" rel="noreferrer" class="link">BaseStore</a> 实例，用于[长期记忆](/oss/javascript/langchain/long-term-memory)。
3.  **流写入器**：一个用于通过 `"custom"` 流模式流式传输信息的对象。

<Tip>

运行时上下文是你将数据传递到代理中的方式。你可以将值（如数据库连接、用户会话或配置）附加到上下文，并在工具和中间件内部访问它们，而不是将内容存储在全局状态中。这保持了无状态、可测试和可重用的特性。

</Tip>

你可以在[工具内部](#inside-tools)和[中间件内部](#inside-middleware)访问运行时信息。

## 访问

使用 `createAgent` 创建代理时，你可以指定一个 `contextSchema` 来定义存储在代理 <a href="https://reference.langchain.com/javascript/interfaces/_langchain_langgraph.index.Runtime.html" target="_blank" rel="noreferrer" class="link"><code>Runtime</code></a> 中的 `context` 的结构。

调用代理时，传递包含该次运行相关配置的 `context` 参数：

```ts
import * as z from "zod";
import { createAgent } from "langchain";

const contextSchema = z.object({ // [!code highlight]
  userName: z.string(), // [!code highlight]
}); // [!code highlight]

const agent = createAgent({
  model: "gpt-4o",
  tools: [
    /* ... */
  ],
  contextSchema, // [!code highlight]
});

const result = await agent.invoke(
  { messages: [{ role: "user", content: "What's my name?" }] },
  { context: { userName: "John Smith" } } // [!code highlight]
);
```

### 在工具内部

你可以在工具内部访问运行时信息，以便：

*   访问上下文
*   读取或写入长期记忆
*   写入[自定义流](/oss/javascript/langchain/streaming#custom-updates)（例如，工具进度/更新）

使用 `runtime` 参数在工具内部访问 <a href="https://reference.langchain.com/javascript/interfaces/_langchain_langgraph.index.Runtime.html" target="_blank" rel="noreferrer" class="link"><code>Runtime</code></a> 对象。

```ts
import * as z from "zod";
import { tool } from "langchain";
import { type ToolRuntime } from "@langchain/core/tools"; // [!code highlight]

const contextSchema = z.object({
  userName: z.string(),
});

const fetchUserEmailPreferences = tool(
  async (_, runtime: ToolRuntime<any, typeof contextSchema>) => { // [!code highlight]
    const userName = runtime.context?.userName; // [!code highlight]
    if (!userName) {
      throw new Error("userName is required");
    }

    let preferences = "The user prefers you to write a brief and polite email.";
    if (runtime.store) { // [!code highlight]
      const memory = await runtime.store?.get(["users"], userName); // [!code highlight]
      if (memory) {
        preferences = memory.value.preferences;
      }
    }
    return preferences;
  },
  {
    name: "fetch_user_email_preferences",
    description: "Fetch the user's email preferences.",
    schema: z.object({}),
  }
);
```

### 在中间件内部

你可以在中间件中访问运行时信息，以创建动态提示、修改消息或根据用户上下文控制代理行为。

使用 `runtime` 参数在中间件内部访问 <a href="https://reference.langchain.com/javascript/interfaces/_langchain_langgraph.index.Runtime.html" target="_blank" rel="noreferrer" class="link"><code>Runtime</code></a> 对象。

```ts
import * as z from "zod";
import { createAgent, createMiddleware, SystemMessage } from "langchain";

const contextSchema = z.object({
  userName: z.string(),
});

// 动态提示中间件
const dynamicPromptMiddleware = createMiddleware({
  name: "DynamicPrompt",
  contextSchema,
  beforeModel: (state, runtime) => { // [!code highlight]
    const userName = runtime.context?.userName; // [!code highlight]
    if (!userName) {
      throw new Error("userName is required");
    }

    const systemMsg = `You are a helpful assistant. Address the user as ${userName}.`;
    return {
      messages: [new SystemMessage(systemMsg), ...state.messages],
    };
  },
});

// 日志记录中间件
const loggingMiddleware = createMiddleware({
  name: "Logging",
  contextSchema,
  beforeModel: (state, runtime) => {  // [!code highlight]
    console.log(`Processing request for user: ${runtime.context?.userName}`);  // [!code highlight]
    return;
  },
  afterModel: (state, runtime) => {  // [!code highlight]
    console.log(`Completed request for user: ${runtime.context?.userName}`);  // [!code highlight]
    return;
  },
});

const agent = createAgent({
  model: "gpt-4o",
  tools: [
    /* ... */
  ],
  middleware: [dynamicPromptMiddleware, loggingMiddleware],  // [!code highlight]
  contextSchema,
});

const result = await agent.invoke(
  { messages: [{ role: "user", content: "What's my name?" }] },
  { context: { userName: "John Smith" } }
);
```

