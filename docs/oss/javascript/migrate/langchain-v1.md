---
title: LangChain v1 迁移指南
sidebarTitle: LangChain v1
---

本迁移指南概述了 LangChain v1 中的主要变更。要了解更多关于 v1 新特性的信息,请参阅[介绍文章](/oss/releases/langchain-v1)。

要升级,请执行以下操作:

::: code-group

```bash [npm]
npm install langchain@latest @langchain/core@latest
```

```bash [pnpm]
pnpm install langchain@latest @langchain/core@latest
```

```bash [yarn]
yarn add langchain@latest @langchain/core@latest
```

```bash [bun]
bun add langchain@latest @langchain/core@latest
```

:::

## `createAgent`

在 v1 中,react agent 预构建功能现在位于 langchain 包中。下表概述了功能变更:

| 部分 | 变更内容 |
|---------|--------------|
| [导入路径](#导入路径) | 包从 `@langchain/langgraph/prebuilts` 移至 `langchain` |
| [提示词](#提示词) | 参数重命名为 `systemPrompt`,动态提示词使用中间件 |
| [模型前钩子](#模型前钩子) | 被带有 `beforeModel` 方法的中间件取代 |
| [模型后钩子](#模型后钩子) | 被带有 `afterModel` 方法的中间件取代 |
| [自定义状态](#自定义状态) | 在中间件中定义,仅限 zod 对象 |
| [模型](#模型) | 通过中间件动态选择,不支持预绑定模型 |
| [工具](#工具) | 工具错误处理移至带有 `wrapToolCall` 的中间件 |
| [结构化输出](#结构化输出) | 移除了提示式输出,使用 `toolStrategy`/`providerStrategy` |
| [流式节点名称](#流式节点名称重命名) | 节点名称从 `"agent"` 更改为 `"model"` |
| [运行时上下文](#运行时上下文) | 使用 `context` 属性替代 `config.configurable` |
| [命名空间](#简化包) | 精简以专注于智能体构建块,遗留代码移至 `@langchain/classic` |

### 导入路径

react agent 预构建功能的导入路径已从 `@langchain/langgraph/prebuilts` 更改为 `langchain`。函数名称已从 `createReactAgent` 更改为 `createAgent`:

```typescript
import { createReactAgent } from "@langchain/langgraph/prebuilts"; // [!code --]
import { createAgent } from "langchain"; // [!code ++]
```

### 提示词

#### 静态提示词重命名

`prompt` 参数已重命名为 `systemPrompt`:

::: code-group

```typescript [v1 (新)]
import { createAgent } from "langchain";

agent = createAgent({
  model,
  tools,
  systemPrompt: "You are a helpful assistant.", // [!code highlight]
});
```

```typescript [v0 (旧)]
import { createReactAgent } from "@langchain/langgraph/prebuilts";

const agent = createReactAgent({
  model,
  tools,
  prompt: "You are a helpful assistant.", // [!code highlight]
});
```

:::

#### `SystemMessage`

如果在系统提示词中使用 `SystemMessage` 对象,现在直接使用其字符串内容:

::: code-group

```typescript [v1 (新)]
import { SystemMessage, createAgent } from "langchain";

const agent = createAgent({
  model,
  tools,
  systemPrompt: "You are a helpful assistant.", // [!code highlight]
});
```

```typescript [v0 (旧)]
import { createReactAgent } from "@langchain/langgraph/prebuilts";

const agent = createReactAgent({
  model,
  tools,
  prompt: new SystemMessage(content: "You are a helpful assistant."), // [!code highlight]
});
```

:::

#### 动态提示词

动态提示词是一种核心的上下文工程模式——它们根据当前对话状态调整你告诉模型的内容。为此,请使用 `dynamicSystemPromptMiddleware`:

::: code-group

```typescript [v1 (新)]
import { createAgent, dynamicSystemPromptMiddleware } from "langchain";
import * as z from "zod";

const contextSchema = z.object({
  userRole: z.enum(["expert", "beginner"]).default("beginner"),
});

const userRolePrompt = dynamicSystemPromptMiddleware<z.infer<typeof contextSchema>>( // [!code highlight]
    (_state, runtime) => {
        const userRole = runtime.context.userRole;
        const basePrompt = "You are a helpful assistant.";

        if (userRole === "expert") {
            return `${basePrompt} Provide detailed technical responses.`;
        } else if (userRole === "beginner") {
            return `${basePrompt} Explain concepts simply and avoid jargon.`;
        }
        return basePrompt; // [!code highlight]
    }
);

const agent = createAgent({
  model,
  tools,
  middleware: [userRolePrompt],
  contextSchema,
});

await agent.invoke(
  {
    messages: [new HumanMessage("Explain async programming")],
  },
  {
    context: {
      userRole: "expert",
    },
  }
);
```

```typescript [v0 (旧)]
import { createReactAgent } from "@langchain/langgraph/prebuilts";

const contextSchema = z.object({
  userRole: z.enum(["expert", "beginner"]),
});

const agent = createReactAgent({
  model,
  tools,
  prompt: (state) => {
    const userRole = state.context.userRole;
    const basePrompt = "You are a helpful assistant.";

    if (userRole === "expert") {
      return `${basePrompt} Provide detailed technical responses.`;
    } else if (userRole === "beginner") {
      return `${basePrompt} Explain concepts simply and avoid jargon.`;
    }
    return basePrompt;
  },
  contextSchema,
});

// 通过 config.configurable 使用上下文
await agent.invoke(
  {
    messages: [new HumanMessage("Explain async programming")],
  },
  {
    config: {
      configurable: { userRole: "expert" },
    },
  }
);
```

:::

### 模型前钩子

模型前钩子现在通过带有 `beforeModel` 方法的中间件实现。这种模式更具扩展性——你可以定义多个在模型调用前运行的中间件,并在多个智能体间复用它们。

常见用例包括:
- 总结对话历史
- 修剪消息
- 输入护栏,如 PII 脱敏

v1 包含内置的总结中间件:

::: code-group

```typescript [v1 (新)]
import { createAgent, summarizationMiddleware } from "langchain";

const agent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  tools,
  middleware: [
    summarizationMiddleware({
      model: "claude-sonnet-4-5-20250929",
      trigger: { tokens: 1000 },
    }),
  ],
});
```

```typescript [v0 (旧)]
import { createReactAgent } from "@langchain/langgraph/prebuilts";

function customSummarization(state) {
  // 消息总结的自定义逻辑
}

const agent = createReactAgent({
  model: "claude-sonnet-4-5-20250929",
  tools,
  preModelHook: customSummarization,
});
```

:::

### 模型后钩子

模型后钩子现在通过带有 `afterModel` 方法的中间件实现。这允许你在模型响应后组合多个处理器。

常见用例包括:
- 人工介入审批
- 输出护栏

v1 包含内置的人工介入中间件:

::: code-group

```typescript [v1 (新)]
import { createAgent, humanInTheLoopMiddleware } from "langchain";

const agent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  tools: [readEmail, sendEmail],
  middleware: [
    humanInTheLoopMiddleware({
      interruptOn: {
        sendEmail: { allowedDecisions: ["approve", "edit", "reject"] },
      },
    }),
  ],
});
```

```typescript [v0 (旧)]
import { createReactAgent } from "@langchain/langgraph/prebuilts";

function customHumanInTheLoopHook(state) {
  // 自定义审批逻辑
}

const agent = createReactAgent({
  model: "claude-sonnet-4-5-20250929",
  tools: [readEmail, sendEmail],
  postModelHook: customHumanInTheLoopHook,
});
```

:::

### 自定义状态

自定义状态现在通过中间件的 `stateSchema` 属性定义。使用 Zod 声明在智能体运行过程中携带的额外状态字段。

::: code-group

```typescript [v1 (新)]
import * as z from "zod";
import { createAgent, createMiddleware, tool } from "langchain";

const UserState = z.object({
  userName: z.string(),
});

const userState = createMiddleware({
  name: "UserState",
  stateSchema: UserState,
  beforeModel: (state) => {
    // 访问自定义状态属性
    const name = state.userName;
    // 可选地根据状态修改消息/系统提示词
    return;
  },
});

const greet = tool(
  async () => {
    return "Hello!";
  },
  {
    name: "greet",
    description: "Greet the user",
    schema: z.object({}),
  }
);

const agent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  tools: [greet],
  middleware: [userState],
});

await agent.invoke({
  messages: [{ role: "user", content: "Hi" }],
  userName: "Ada",
});
```

```typescript [v0 (旧)]
import { getCurrentTaskInput } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilts";
import * as z from "zod";

const UserState = z.object({
  userName: z.string(),
});

const greet = tool(
  async () => {
    const state = await getCurrentTaskInput();
    const userName = state.userName;
    return `Hello ${userName}!`;
  },
);

// 自定义状态通过智能体级别的状态模式提供或在钩子中临时访问
const agent = createReactAgent({
  model: "claude-sonnet-4-5-20250929",
  tools: [greet],
  stateSchema: UserState,
});
```

:::

### 模型

动态模型选择现在通过中间件进行。使用 `wrapModelCall` 根据状态或运行时上下文交换模型(和工具)。在 `createReactAgent` 中,这是通过传递给 `model` 参数的函数完成的。

此功能在 v1 中已移植到中间件接口。

#### 动态模型选择

::: code-group

```typescript [v1 (新)]
import { createAgent, createMiddleware } from "langchain";

const dynamicModel = createMiddleware({
  name: "DynamicModel",
  wrapModelCall: (request, handler) => {
    const messageCount = request.state.messages.length;
    const model = messageCount > 10 ? "openai:gpt-5" : "openai:gpt-5-nano";
    return handler({ ...request, model });
  },
});

const agent = createAgent({
  model: "gpt-5-nano",
  tools,
  middleware: [dynamicModel],
});
```

```typescript [v0 (旧)]
import { createReactAgent } from "@langchain/langgraph/prebuilts";

function selectModel(state) {
  return state.messages.length > 10 ? "openai:gpt-5" : "openai:gpt-5-nano";
}

const agent = createReactAgent({
  model: selectModel,
  tools,
});
```

:::

#### 预绑定模型

为了更好地支持结构化输出,`createAgent` 应接收一个普通模型(字符串或实例)和一个单独的 `tools` 列表。使用结构化输出时,避免传递预绑定工具的模型。

```typescript
// 不再支持
// const modelWithTools = new ChatOpenAI({ model: "gpt-4o-mini" }).bindTools([someTool]);
// const agent = createAgent({ model: modelWithTools, tools: [] });

// 请改用
const agent = createAgent({ model: "gpt-4o-mini", tools: [someTool] });
```

### 工具

`createAgent` 的 `tools` 参数接受:

- 使用 `tool` 创建的函数
- LangChain 工具实例
- 表示内置提供者工具的对象

#### 处理工具错误

你现在可以通过实现 `wrapToolCall` 方法的中间件来配置工具错误的处理。

::: code-group

```typescript [v1 (新)]
import { createAgent, createMiddleware, ToolMessage } from "langchain";

const handleToolErrors = createMiddleware({
  name: "HandleToolErrors",
  wrapToolCall: async (request, handler) => {
    try {
      return await handler(request);
    } catch (error) {
      // 仅处理由于无效输入(通过模式验证但在运行时失败,例如无效的 SQL 语法)导致的工具执行期间发生的错误。
      // 请勿处理:
      // - 网络故障(请改用工具重试中间件)
      // - 错误的工具实现错误(应向上冒泡)
      // - 模式不匹配错误(已由框架自动处理)
      //
      // 向模型返回自定义错误消息
      return new ToolMessage({
        content: `Tool error: Please check your input and try again. (${error})`,
        tool_call_id: request.toolCall.id!,
      });
    }
  },
});

const agent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  tools: [checkWeather, searchWeb],
  middleware: [handleToolErrors],
});
```

```typescript [v0 (旧)]
import { createReactAgent, ToolNode } from "@langchain/langgraph/prebuilts";

const agent = createReactAgent({
  model: "claude-sonnet-4-5-20250929",
  tools: new ToolNode(
    [checkWeather, searchWeb],
    { handleToolErrors: true } // [!code highlight]
  ),
});
```

:::

### 结构化输出

#### 节点变更

结构化输出过去是在与主智能体分离的单独节点中生成的。现在情况已不再如此。结构化输出在主循环中生成(无需额外的 LLM 调用),从而降低了成本和延迟。

#### 工具和提供者策略

在 v1 中,有两种策略:

- `toolStrategy` 使用人工工具调用来生成结构化输出
- `providerStrategy` 使用提供者原生的结构化输出生成

::: code-group

```typescript [v1 (新)]
import { createAgent, toolStrategy } from "langchain";
import * as z from "zod";

const OutputSchema = z.object({
  summary: z.string(),
  sentiment: z.string(),
});

const agent = createAgent({
  model: "gpt-4o-mini",
  tools,
  // 显式使用工具策略
  responseFormat: toolStrategy(OutputSchema), // [!code highlight]
});
```

```typescript [v0 (旧)]
import { createReactAgent } from "@langchain/langgraph/prebuilts";
import * as z from "zod";

const OutputSchema = z.object({
  summary: z.string(),
  sentiment: z.string(),
});

const agent = createReactAgent({
  model: "gpt-4o-mini",
  tools,
  // 结构化输出主要通过工具调用驱动,选项较少
  responseFormat: OutputSchema,
});
```

:::

#### 移除了提示式输出

通过 `responseFormat` 中的自定义指令进行的提示式输出已被移除,转而支持上述策略。

### 流式节点名称重命名

当从智能体流式传输事件时,节点名称已从 `"agent"` 更改为 `"model"`,以更好地反映节点的用途。

### 运行时上下文

调用智能体时,通过 `context` 配置参数传递静态的、只读的配置。这取代了使用 `config.configurable` 的模式。

::: code-group

```typescript [v1 (新)]
import { createAgent, HumanMessage } from "langchain";
import * as z from "zod";

const agent = createAgent({
  model: "gpt-4o",
  tools,
  contextSchema: z.object({ userId: z.string(), sessionId: z.string() }),
});

const result = await agent.invoke(
  { messages: [new HumanMessage("Hello")] },
  { context: { userId: "123", sessionId: "abc" } }, // [!code highlight]
);
```

```typescript [v0 (旧)]
import { createReactAgent, HumanMessage } from "@langchain/langgraph/prebuilts";

const agent = createReactAgent({ model, tools });

// 通过 config.configurable 传递上下文
const result = await agent.invoke(
  { messages: [new HumanMessage("Hello")] },
  {
    config: { // [!code highlight]
      configurable: { userId: "123", sessionId: "abc" }, // [!code highlight]
    }, // [!code highlight]
  }
);
```

:::

<Note>

旧的 `config.configurable` 模式为了向后兼容仍然有效,但对于新应用程序或迁移到 v1 的应用程序,建议使用新的 `context` 参数。

</Note>

---

## 标准内容

在 v1 中,消息获得了与提供者无关的标准内容块。通过 `message.contentBlocks` 访问它们,以获得跨提供者的一致、类型化视图。现有的 `message.content` 字段对于字符串或提供者原生结构保持不变。

### 变更内容

- 消息上新增 `contentBlocks` 属性用于规范化内容。
- 新增 `ContentBlock` 下的 TypeScript 类型以实现强类型。
- 通过 `LC_OUTPUT_VERSION=v1` 或 `outputVersion: "v1"` 可选地将标准块序列化到 `content` 中。

### 读取标准化内容

::: code-group

```typescript [v1 (新)]
import { initChatModel } from "langchain";

const model = await initChatModel("gpt-5-nano");
const response = await model.invoke("Explain AI");

for (const block of response.contentBlocks) {
  if (block.type === "reasoning") {
    console.log(block.reasoning);
  } else if (block.type === "text") {
    console.log(block.text);
  }
}
```

```typescript [v0 (旧)]
// 提供者原生格式各不相同;你需要针对每个提供者进行处理。
const response = await model.invoke("Explain AI");
for (const item of response.content as any[]) {
  if (item.type === "reasoning") {
    // OpenAI 风格的推理
  } else if (item.type === "thinking") {
    // Anthropic 风格的思考
  } else if (item.type === "text") {
    // 文本
  }
}
```

:::

### 创建多模态消息

::: code-group

```typescript [v1 (新)]
import { HumanMessage } from "langchain";

const message = new HumanMessage({
  contentBlocks: [
    { type: "text", text: "Describe this image." },
    { type: "image", url: "https://example.com/image.jpg" },
  ],
});
const res = await model.invoke([message]);
```

```typescript [v0 (旧)]
import { HumanMessage } from "langchain";

const message = new HumanMessage({
  // 提供者原生结构
  content: [
    { type: "text", text: "Describe this image." },
    { type: "image_url", image_url: { url: "https://example.com/image.jpg" } },
  ],
});
const res = await model.invoke([message]);
```

:::

### 示例块类型

```typescript
import { ContentBlock } from "langchain";

const textBlock: ContentBlock.Text = {
  type: "text",
  text: "Hello world",
};

const imageBlock: ContentBlock.Multimodal.Image = {
  type: "image",
  url: "https://example.com/image.png",
  mimeType: "image/png",
};
```

查看内容块[参考文档](/oss/langchain/messages#content-block-reference)了解更多详情。

### 序列化标准内容

默认情况下,标准内容块**不会序列化**到 `content` 属性中。如果你需要在 `content` 属性中访问标准内容块(例如,将消息发送到客户端时),可以选择将它们序列化到 `content` 中。

::: code-group

```bash
export LC_OUTPUT_VERSION=v1
```

```typescript
import { initChatModel } from "langchain";

const model = await initChatModel("gpt-5-nano", {
  outputVersion: "v1",
});
```

:::

<Note>

了解更多:[消息](/oss/langchain/messages#message-content)和[标准内容块](/oss/langchain/messages#standard-content-blocks)。查看[多模态](/oss/langchain/messages#multimodal)了解输入示例。

</Note>

---

## 简化包

`langchain` 包命名空间已精简,专注于智能体构建块。遗留功能已移至 `@langchain/classic`。新包仅公开最有用和最相关的功能。

### 导出

v1 包包括:

| 模块 | 可用内容 | 说明 |
|--------|------------------|-------|
| Agents | `createAgent`, `AgentState` | 核心智能体创建功能 |
| Messages | 消息类型、内容块、`trimMessages` | 从 `@langchain/core` 重新导出 |
| Tools | `tool`、工具类 | 从 `@langchain/core` 重新导出 |
| Chat models | `initChatModel`, `BaseChatModel` | 统一模型初始化 |

### `@langchain/classic`

如果你使用遗留链、索引 API 或之前从 `@langchain/community` 重新导出的功能,请安装 `@langchain/classic` 并更新导入:

::: code-group

```bash [npm]
npm install @langchain/classic
```

```bash [pnpm]
pnpm install @langchain/classic
```

```bash [yarn]
yarn add @langchain/classic
```

```bash [bun]
bun add @langchain/classic
```

:::

```typescript
// v1 (新)
import { ... } from "@langchain/classic";
import { ... } from "@langchain/classic/chains";

// v0 (旧)
import { ... } from "langchain";
import { ... } from "langchain/chains";
```

---

## 破坏性变更

### 放弃 Node 18 支持

所有 LangChain 包现在都需要 **Node.js 20 或更高版本**。Node.js 18 已于 2025 年 3 月[停止维护](https://nodejs.org/en/about/releases/)。

### 新的构建输出

所有 langchain 包的构建现在使用基于打包器的方法,而不是使用原始的 TypeScript 输出。如果你从 `dist/` 目录导入文件(不推荐),你需要更新导入以使用新的模块系统。

### 遗留代码移至 `@langchain/classic`

标准接口和智能体焦点之外的遗留功能已移至 [`@langchain/classic`](https://www.npmjs.com/package/@langchain/classic) 包。查看[简化包](#简化包)部分了解核心 `langchain` 包中可用的内容以及移至 `@langchain/classic` 的内容。

### 移除已弃用的 API

已弃用并计划在 1.0 中移除的方法、函数和其他对象已被删除。

:::: details 查看已移除的已弃用 API

以下已弃用的 API 已在 v1 中移除:

#### 核心功能
- `TraceGroup` - 请改用 LangSmith 追踪
- `BaseDocumentLoader.loadAndSplit` - 使用 `.load()` 后跟文本分割器
- `RemoteRunnable` - 不再支持

#### 提示词
- `BasePromptTemplate.serialize` 和 `.deserialize` - 直接使用 JSON 序列化
- `ChatPromptTemplate.fromPromptMessages` - 使用 `ChatPromptTemplate.fromMessages`

#### 检索器
- `BaseRetrieverInterface.getRelevantDocuments` - 使用 `.invoke()` 替代

#### Runnables
- `Runnable.bind` - 使用 `.bindTools()` 或其他特定的绑定方法
- `Runnable.map` - 使用 `.batch()` 替代
- `RunnableBatchOptions.maxConcurrency` - 在配置对象中使用 `maxConcurrency`

#### 聊天模型
- `BaseChatModel.predictMessages` - 使用 `.invoke()` 替代
- `BaseChatModel.predict` - 使用 `.invoke()` 替代
- `BaseChatModel.serialize` - 直接使用 JSON 序列化
- `BaseChatModel.callPrompt` - 使用 `.invoke()` 替代
- `BaseChatModel.call` - 使用 `.invoke()` 替代

#### LLMs
- `BaseLLMParams.concurrency` - 在配置对象中使用 `maxConcurrency`
- `BaseLLM.call` - 使用 `.invoke()` 替代
- `BaseLLM.predict` - 使用 `.invoke()` 替代
- `BaseLLM.predictMessages` - 使用 `.invoke()` 替代
- `BaseLLM.serialize` - 直接使用 JSON 序列化

#### 流式传输
- `createChatMessageChunkEncoderStream` - 直接使用 `.stream()` 方法

#### 追踪
- `BaseTracer.runMap` - 使用 LangSmith 追踪 API
- `getTracingCallbackHandler` - 使用 LangSmith 追踪
- `getTracingV2CallbackHandler` - 使用 LangSmith 追踪
- `LangChainTracerV1` - 使用 LangSmith 追踪

#### 内存和存储
- `BaseListChatMessageHistory.addAIChatMessage` - 使用 `.addMessage()` 配合 `AIMessage`
- `BaseStoreInterface` - 使用特定的存储实现

#### 实用工具
- `getRuntimeEnvironmentSync` - 使用异步的 `getRuntimeEnvironment()`

::::

