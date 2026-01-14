---
title: 短期记忆 (Short-term memory)
---

## 概述 (Overview)

记忆（Memory）是一个能够记住先前交互信息的系统。对于 AI 智能体（Agent）而言，记忆至关重要，因为它能让智能体记住之前的交互、从反馈中学习并适应用户偏好。随着智能体处理涉及大量用户交互的复杂任务，这种能力对于效率和用户满意度都变得至关重要。

短期记忆（Short-term memory）让你的应用程序能够记住单个线程（Thread）或对话中的先前交互。

<Note>

线程（Thread）在一个会话中组织多次交互，类似于电子邮件将消息分组到单个对话中的方式。

</Note>

对话历史（Conversation history）是最常见的短期记忆形式。长对话对当今的 LLM 构成了挑战；完整的历史记录可能无法放入 LLM 的上下文窗口（Context Window），从而导致上下文丢失或错误。

即使你的模型支持完整的上下文长度，大多数 LLM 在处理长上下文时表现仍然不佳。它们会被过时或离题的内容“分散注意力”，同时还会遭受响应时间变慢和成本更高的困扰。

聊天模型使用[消息（Messages）](/oss/javascript/langchain/messages)来接受上下文，这些消息包括指令（系统消息）和输入（人类消息）。在聊天应用中，消息在人类输入和模型响应之间交替，导致消息列表随时间推移而变长。由于上下文窗口有限，许多应用可以通过使用技术来移除或“遗忘”过时信息而受益。

## 使用方法 (Usage)

要为智能体添加短期记忆（线程级持久化），你需要在创建智能体时指定一个 `checkpointer`。

<Info>

LangChain 的智能体将短期记忆作为智能体状态（State）的一部分进行管理。

通过将这些信息存储在图（Graph）的状态中，智能体可以访问给定对话的完整上下文，同时保持不同线程之间的隔离。

状态通过检查点（Checkpointer）持久化到数据库（或内存）中，因此线程可以在任何时候恢复。

短期记忆在智能体被调用或步骤（如工具调用）完成时更新，状态在每个步骤开始时被读取。

</Info>

```ts {highlight={2,4, 9,14}}
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [],
    checkpointer,
});

await agent.invoke(
    { messages: [{ role: "user", content: "你好！我叫小明。" }] },
    { configurable: { thread_id: "1" } }
);
```

### 在生产环境中 (In production)

在生产环境中，使用由数据库支持的检查点（Checkpointer）：

```ts
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable";
const checkpointer = PostgresSaver.fromConnString(DB_URI);
```

## 自定义智能体记忆 (Customizing agent memory)

你可以通过创建带有状态模式（State Schema）的自定义中间件（Middleware）来扩展智能体状态。自定义状态模式可以通过中间件中的 `stateSchema` 参数传递。

```typescript
import * as z from "zod";
import { createAgent, createMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const customStateSchema = z.object({  // [!code highlight]
    userId: z.string(),  // [!code highlight]
    preferences: z.record(z.string(), z.any()),  // [!code highlight]
});  // [!code highlight]

const stateExtensionMiddleware = createMiddleware({
    name: "StateExtension",
    stateSchema: customStateSchema,  // [!code highlight]
});

const checkpointer = new MemorySaver();
const agent = createAgent({
    model: "gpt-5",
    tools: [],
    middleware: [stateExtensionMiddleware],  // [!code highlight]
    checkpointer,
});

// 可以在 invoke 时传入自定义状态
const result = await agent.invoke({
    messages: [{ role: "user", content: "你好" }],
    userId: "user_123",  // [!code highlight]
    preferences: { theme: "dark" },  // [!code highlight]
});
```

## 常见模式 (Common patterns)

启用[短期记忆](#add-short-term-memory)后，长对话可能会超出 LLM 的上下文窗口。常见的解决方案有：

<CardGroup :cols="2">

<Card title="修剪消息" icon="scissors" href="#trim-messages" arrow>

在调用 LLM 之前移除前 N 条或最后 N 条消息

</Card>

<Card title="删除消息" icon="trash" href="#delete-messages" arrow>

从 LangGraph 状态中永久删除消息

</Card>

<Card title="总结消息" icon="layer-group" href="#summarize-messages" arrow>

总结历史中较早的消息，并用摘要内容替换它们

</Card>

<Card title="自定义策略" icon="gears">

自定义策略（例如：消息过滤等）

</Card>

</CardGroup>

这使得智能体能够跟踪对话，而不会超出 LLM 的上下文窗口。

### 修剪消息 (Trim messages)

大多数 LLM 都有最大支持的上下文窗口（以 Token 为计量单位）。

决定何时截断消息的一种方法是计算消息历史中的 Token 数量，并在接近限制时启动截断。如果你使用 LangChain，可以使用修剪消息工具，并指定要从列表中保留的 Token 数量，以及用于处理边界的 `strategy`（例如：保留最后 `maxTokens` 个 Token）。

要在智能体中修剪消息历史，请使用带有 `beforeModel` 钩子的 <a href="https://reference.langchain.com/javascript/functions/langchain.index.createMiddleware.html" target="_blank" rel="noreferrer" class="link"><code>createMiddleware</code></a>：

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware } from "langchain";
import { MemorySaver, REMOVE_ALL_MESSAGES } from "@langchain/langgraph";

const trimMessages = createMiddleware({
  name: "TrimMessages",
  beforeModel: (state) => {
    const messages = state.messages;

    if (messages.length <= 3) {
      return; // 无需更改
    }

    const firstMsg = messages[0];
    const recentMessages =
      messages.length % 2 === 0 ? messages.slice(-3) : messages.slice(-4);
    const newMessages = [firstMsg, ...recentMessages];

    return {
      messages: [
        new RemoveMessage({ id: REMOVE_ALL_MESSAGES }),
        ...newMessages,
      ],
    };
  },
});

const checkpointer = new MemorySaver();
const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  middleware: [trimMessages],
  checkpointer,
});
```

### 删除消息 (Delete messages)

你可以从图（Graph）状态中删除消息来管理对话历史。

当你想要移除特定消息或清除整个消息历史时，这非常有用。

要从图状态中删除消息，你可以使用 `RemoveMessage`。为了让 `RemoveMessage` 生效，你需要使用带有 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.messagesStateReducer.html" target="_blank" rel="noreferrer" class="link"><code>messagesStateReducer</code></a> [归约器（Reducer）](/oss/javascript/langgraph/graph-api#reducers)的状态键，例如 `MessagesZodState`。

要移除特定消息：

```typescript
import { RemoveMessage } from "@langchain/core/messages";

const deleteMessages = (state) => {
    const messages = state.messages;
    if (messages.length > 2) {
        // 移除最早的两条消息
        return {
        messages: messages
            .slice(0, 2)
            .map((m) => new RemoveMessage({ id: m.id })),
        };
    }
};
```

<Warning>

删除消息时，<strong>务必确保</strong>生成的消息历史记录是有效的。请检查你所使用的 LLM 提供商的限制。例如：

* 某些提供商要求消息历史必须以 `user` 消息开始。
* 大多数提供商要求带有工具调用的 `assistant` 消息后面必须紧跟相应的 `tool` 结果消息。

</Warning>

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const deleteOldMessages = createMiddleware({
  name: "DeleteOldMessages",
  afterModel: (state) => {
    const messages = state.messages;
    if (messages.length > 2) {
      // 移除最早的两条消息
      return {
        messages: messages
          .slice(0, 2)
          .map((m) => new RemoveMessage({ id: m.id! })),
      };
    }
    return;
  },
});

const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  systemPrompt: "请简明扼要，直达重点。",
  middleware: [deleteOldMessages],
  checkpointer: new MemorySaver(),
});

const config = { configurable: { thread_id: "1" } };

const streamA = await agent.stream(
  { messages: [{ role: "user", content: "你好！我叫小明" }] },
  { ...config, streamMode: "values" }
);
for await (const event of streamA) {
  const messageDetails = event.messages.map((message) => [
    message.getType(),
    message.content,
  ]);
  console.log(messageDetails);
}

const streamB = await agent.stream(
  {
    messages: [{ role: "user", content: "我叫什么名字？" }],
  },
  { ...config, streamMode: "values" }
);
for await (const event of streamB) {
  const messageDetails = event.messages.map((message) => [
    message.getType(),
    message.content,
  ]);
  console.log(messageDetails);
}
```

```
[[ "human", "你好！我叫小明" ]]
[[ "human", "你好！我叫小明" ], [ "ai", "你好，小明！今天有什么我可以帮你的吗？" ]]
[[ "human", "你好！我叫小明" ], [ "ai", "你好，小明！今天有什么我可以帮你的吗？" ]]
[[ "human", "你好！我叫小明" ], [ "ai", "你好，小明！今天有什么我可以帮你的吗？" ], ["human", "我叫什么名字？" ]]
[[ "human", "你好！我叫小明" ], [ "ai", "你好，小明！今天有什么我可以帮你的吗？" ], ["human", "我叫什么名字？" ], [ "ai", "如你所说，你叫小明。我还能为你做什么？" ]]
[[ "human", "我叫什么名字？" ], [ "ai", "如你所说，你叫小明。我还能为你做什么？" ]]
```

### 总结消息 (Summarize messages)

如上所述，修剪或删除消息的问题在于，你可能会因为剔除消息队列而丢失重要信息。
因此，某些应用程序会受益于更高级的方法：使用聊天模型对对话历史进行总结。

![总结](/oss/images/summary.png)

要总结智能体中的消息历史，请使用内置的 [`summarizationMiddleware`](/oss/javascript/langchain/middleware#summarization)：

```typescript
import { createAgent, summarizationMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  middleware: [
    summarizationMiddleware({
      model: "gpt-4o-mini",
      trigger: { tokens: 4000 }, // 触发条件
      keep: { messages: 20 },     // 保留消息数
    }),
  ],
  checkpointer,
});

const config = { configurable: { thread_id: "1" } };
await agent.invoke({ messages: "你好，我叫小明" }, config);
await agent.invoke({ messages: "写一首关于猫的短诗" }, config);
await agent.invoke({ messages: "现在也为狗写一首" }, config);
const finalResponse = await agent.invoke({ messages: "我叫什么名字？" }, config);

console.log(finalResponse.messages.at(-1)?.content);
// 你叫小明！
```

有关更多配置选项，请参阅 [`summarizationMiddleware`](/oss/javascript/langchain/middleware#summarization)。

## 访问记忆 (Access memory)

你可以通过多种方式访问和修改智能体的短期记忆（状态）：

### 工具 (Tools)

#### 在工具中读取短期记忆

使用 `runtime` 参数（类型为 `ToolRuntime`）在工具中访问短期记忆（状态）。

`runtime` 参数在工具签名中是隐藏的（因此模型看不见它），但工具可以通过它访问状态。

```typescript
import * as z from "zod";
import { createAgent, tool, type ToolRuntime } from "langchain";

const stateSchema = z.object({
  userId: z.string(),
});

const getUserInfo = tool(
  async (_, config: ToolRuntime<z.infer<typeof stateSchema>>) => {
    const userId = config.state.userId;
    return userId === "user_123" ? "张三" : "未知用户";
  },
  {
    name: "get_user_info",
    description: "获取用户信息",
    schema: z.object({}),
  }
);

const agent = createAgent({
  model: "gpt-5-nano",
  tools: [getUserInfo],
  stateSchema,
});

const result = await agent.invoke(
  {
    messages: [{ role: "user", content: "我叫什么名字？" }],
    userId: "user_123",
  },
  {
    context: {},
  }
);

console.log(result.messages.at(-1)?.content);
// 输出："你的名字是张三。"
```

#### 从工具中写入短期记忆

要在执行期间修改智能体的短期记忆（状态），你可以直接从工具返回状态更新。

这对于持久化中间结果或使信息可被后续工具或提示词访问非常有用。

```typescript
import * as z from "zod";
import { tool, createAgent, ToolMessage, type ToolRuntime } from "langchain";
import { Command } from "@langchain/langgraph";

const CustomState = z.object({
  userId: z.string().optional(),
});

const updateUserInfo = tool(
  async (_, config: ToolRuntime<typeof CustomState>) => {
    const userId = config.state.userId;
    const name = userId === "user_123" ? "张三" : "未知用户";
    return new Command({
      update: {
        userName: name,
        // 更新对话历史
        messages: [
          new ToolMessage({
            content: "成功查询到用户信息",
            tool_call_id: config.toolCall?.id ?? "",
          }),
        ],
      },
    });
  },
  {
    name: "update_user_info",
    description: "查询并更新用户信息。",
    schema: z.object({}),
  }
);

const greet = tool(
  async (_, config) => {
    const userName = config.context?.userName;
    return `你好，${userName}！`;
  },
  {
    name: "greet",
    description: "一旦查询到用户信息，就用它来问候用户。",
    schema: z.object({}),
  }
);

const agent = createAgent({
  model: "openai:gpt-5-mini",
  tools: [updateUserInfo, greet],
  stateSchema: CustomState,
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "问候用户" }],
  userId: "user_123",
});

console.log(result.messages.at(-1)?.content);
// 输出："你好！很高兴为您服务——您今天想做什么？"
```

### 提示词 (Prompt)

在中间件（Middleware）中访问短期记忆（状态），以便根据对话历史或自定义状态字段创建动态提示词。

```typescript
import * as z from "zod";
import { createAgent, tool, dynamicSystemPromptMiddleware } from "langchain";

const contextSchema = z.object({
  userName: z.string(),
});
type ContextSchema = z.infer<typeof contextSchema>;

const getWeather = tool(
  async ({ city }) => {
    return `${city} 的天气总是晴朗的！`;
  },
  {
    name: "get_weather",
    description: "获取用户信息",
    schema: z.object({
      city: z.string(),
    }),
  }
);

const agent = createAgent({
  model: "gpt-5-nano",
  tools: [getWeather],
  contextSchema,
  middleware: [
    dynamicSystemPromptMiddleware<ContextSchema>((_, config) => {
      return `你是一个得力的助手。请称呼用户为 ${config.context?.userName}。`;
    }),
  ],
});

const result = await agent.invoke(
  {
    messages: [{ role: "user", content: "旧金山的天气怎么样？" }],
  },
  {
    context: {
      userName: "张三",
    },
  }
);

for (const message of result.messages) {
  console.log(message);
}
/**
 * HumanMessage {
 *   "content": "旧金山的天气怎么样？",
 *   // ...
 * }
 * AIMessage {
 *   // ...
 *   "tool_calls": [
 *     {
 *       "name": "get_weather",
 *       "args": {
 *         "city": "San Francisco"
 *       },
 *       "type": "tool_call",
 *       "id": "call_tCidbv0apTpQpEWb3O2zQ4Yx"
 *     }
 *   ],
 *   // ...
 * }
 * ToolMessage {
 *   "content": "旧金山的天气总是晴朗的！",
 *   "tool_call_id": "call_tCidbv0apTpQpEWb3O2zQ4Yx"
 *   // ...
 * }
 * AIMessage {
 *   "content": "张三，以下是最新情况：旧金山的天气总是晴朗的！\n\n如果您想了解更多细节（温度、风力、湿度）或未来几天的预测，我可以为您查询。您有什么需求？",
 *   // ...
 * }
 */
```

### 模型调用前 (Before model)

```mermaid
%%{
    init: {
        "fontFamily": "monospace",
        "flowchart": {
        "curve": "basis"
        },
        "themeVariables": {"edgeLabelBackground": "transparent"}
    }
}%%
graph TD
    S(["开始 (__start__)"])
    PRE(模型调用前 before_model)
    MODEL(模型 model)
    TOOLS(工具 tools)
    END(["结束 (__end__)"])
    S --> PRE
    PRE --> MODEL
    MODEL -.-> TOOLS
    MODEL -.-> END
    TOOLS --> PRE
    classDef blueHighlight fill:#0a1c25,stroke:#0a455f,color:#bae6fd;
    class S blueHighlight;
    class END blueHighlight;
```

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware, trimMessages } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { REMOVE_ALL_MESSAGES } from "@langchain/langgraph";

const trimMessageHistory = createMiddleware({
  name: "TrimMessages",
  beforeModel: async (state) => {
    const trimmed = await trimMessages(state.messages, {
      maxTokens: 384,
      strategy: "last",
      startOn: "human",
      endOn: ["human", "tool"],
      tokenCounter: (msgs) => msgs.length,
    });
    return {
      messages: [new RemoveMessage({ id: REMOVE_ALL_MESSAGES }), ...trimmed],
    };
  },
});

const checkpointer = new MemorySaver();
const agent = createAgent({
  model: "gpt-5-nano",
  tools: [],
  middleware: [trimMessageHistory],
  checkpointer,
});
```

### 模型调用后 (After model)

```mermaid
%%{
    init: {
        "fontFamily": "monospace",
        "flowchart": {
        "curve": "basis"
        },
        "themeVariables": {"edgeLabelBackground": "transparent"}
    }
}%%
graph TD
    S(["开始 (__start__)"])
    MODEL(模型 model)
    POST(模型调用后 after_model)
    TOOLS(工具 tools)
    END(["结束 (__end__)"])
    S --> MODEL
    MODEL --> POST
    POST -.-> END
    POST -.-> TOOLS
    TOOLS --> MODEL
    classDef blueHighlight fill:#0a1c25,stroke:#0a455f,color:#bae6fd;
    class S blueHighlight;
    class END blueHighlight;
    class POST greenHighlight;
```

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware } from "langchain";
import { REMOVE_ALL_MESSAGES } from "@langchain/langgraph";

const validateResponse = createMiddleware({
  name: "ValidateResponse",
  afterModel: (state) => {
    const lastMessage = state.messages.at(-1)?.content;
    if (
      typeof lastMessage === "string" &&
      lastMessage.toLowerCase().includes("机密")
    ) {
      return {
        messages: [
          new RemoveMessage({ id: REMOVE_ALL_MESSAGES }), // 这是一个严重的示例，可能需要更精细的处理
          ...state.messages,
        ],
      };
    }
    return;
  },
});

const agent = createAgent({
  model: "gpt-5-nano",
  tools: [],
  middleware: [validateResponse],
});
```

