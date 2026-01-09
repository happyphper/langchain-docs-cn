---
title: 智能体中的上下文工程
sidebarTitle: Context engineering
---
## 概述

构建智能体（或任何 LLM 应用程序）的难点在于使其足够可靠。虽然它们可能在原型阶段有效，但在实际使用案例中常常失败。

### 智能体为何失败？

当智能体失败时，通常是因为智能体内部的 LLM 调用采取了错误的行动/没有达到我们的预期。LLM 失败的原因通常有以下两种：

1.  底层 LLM 能力不足
2.  没有将“正确的”上下文传递给 LLM

大多数情况下，实际上是第二个原因导致智能体不可靠。

**上下文工程** 是指以正确的格式提供正确的信息和工具，以便 LLM 能够完成任务。这是 AI 工程师的首要工作。缺乏“正确的”上下文是构建更可靠智能体的首要障碍，而 LangChain 的智能体抽象设计独特，旨在促进上下文工程。

<Tip>

不熟悉上下文工程？请从 [概念概述](/oss/concepts/context) 开始，了解不同类型的上下文及其使用时机。

</Tip>

### 智能体循环

典型的智能体循环包含两个主要步骤：

1.  **模型调用** - 使用提示词和可用工具调用 LLM，返回响应或执行工具的请求
2.  **工具执行** - 执行 LLM 请求的工具，返回工具结果

<img src="/oss/images/core_agent_loop.png" alt="核心智能体循环图" />

此循环持续进行，直到 LLM 决定结束。

### 您可以控制的内容

为了构建可靠的智能体，您需要控制智能体循环每个步骤中发生的事情，以及步骤之间发生的事情。

| 上下文类型 | 您控制的内容 | 瞬态或持久 |
|--------------|------------------|-------------------------|
| **[模型上下文](#model-context)** | 模型调用的输入内容（指令、消息历史、工具、响应格式） | 瞬态 |
| **[工具上下文](#tool-context)** | 工具可以访问和产生的内容（对状态、存储、运行时上下文的读写） | 持久 |
| **[生命周期上下文](#life-cycle-context)** | 模型调用和工具调用之间发生的事情（摘要、护栏、日志记录等） | 持久 |

<CardGroup>

<Card title="瞬态上下文" icon="bolt" iconType="duotone">

LLM 在单次调用中看到的内容。您可以修改消息、工具或提示词，而无需更改保存在状态中的内容。

</Card>

<Card title="持久上下文" icon="database" iconType="duotone">

在多个轮次间保存在状态中的内容。生命周期钩子和工具写入会永久修改此内容。

</Card>

</CardGroup>

### 数据源

在整个过程中，您的智能体会访问（读取/写入）不同的数据源：

| 数据源 | 亦称 | 作用域 | 示例 |
|-------------|---------------|-------|----------|
| **运行时上下文** | 静态配置 | 会话作用域 | 用户 ID、API 密钥、数据库连接、权限、环境设置 |
| **状态** | 短期记忆 | 会话作用域 | 当前消息、上传的文件、认证状态、工具结果 |
| **存储** | 长期记忆 | 跨会话 | 用户偏好、提取的见解、记忆、历史数据 |

### 工作原理

LangChain 的 [中间件](/oss/langchain/middleware) 是底层机制，使得使用 LangChain 的开发者能够实际进行上下文工程。

中间件允许您钩入智能体生命周期的任何步骤，并：

*   更新上下文
*   跳转到智能体生命周期中的不同步骤

在本指南中，您将频繁看到使用中间件 API 作为实现上下文工程目标的手段。

## 模型上下文

控制每次模型调用的输入内容——指令、可用工具、使用哪个模型以及输出格式。这些决策直接影响可靠性和成本。

<CardGroup :cols="2">

<Card title="系统提示词" icon="message-lines" href="#system-prompt">

开发者提供给 LLM 的基础指令。

</Card>

<Card title="消息" icon="comments" href="#messages">

发送给 LLM 的完整消息列表（对话历史）。

</Card>

<Card title="工具" icon="wrench" href="#tools">

智能体可以访问以执行操作的实用程序。

</Card>

<Card title="模型" icon="brain-circuit" href="#model">

要调用的实际模型（包括配置）。

</Card>

<Card title="响应格式" icon="brackets-curly" href="#response-format">

模型最终响应的模式规范。

</Card>

</CardGroup>

所有这些类型的模型上下文都可以从 **状态**（短期记忆）、**存储**（长期记忆）或 **运行时上下文**（静态配置）中获取。

### 系统提示词

系统提示词设定了 LLM 的行为和能力。不同的用户、上下文或对话阶段需要不同的指令。成功的智能体会利用记忆、偏好和配置，为对话的当前状态提供正确的指令。

<Tabs>

<Tab title="状态">

从状态访问消息计数或对话上下文：

```typescript
import { createAgent } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [...],
  middleware: [
    dynamicSystemPromptMiddleware((state) => {
      // Read from State: check conversation length
      const messageCount = state.messages.length;

      let base = "You are a helpful assistant.";

      if (messageCount > 10) {
        base += "\nThis is a long conversation - be extra concise.";
      }

      return base;
    }),
  ],
});
```

</Tab>

<Tab title="存储">

从长期记忆中访问用户偏好：

```typescript
import * as z from "zod";
import { createAgent, dynamicSystemPromptMiddleware } from "langchain";

const contextSchema = z.object({
  userId: z.string(),
});

type Context = z.infer<typeof contextSchema>;

const agent = createAgent({
  model: "gpt-4o",
  tools: [...],
  contextSchema,
  middleware: [
    dynamicSystemPromptMiddleware<Context>(async (state, runtime) => {
      const userId = runtime.context.userId;

      // Read from Store: get user preferences
      const store = runtime.store;
      const userPrefs = await store.get(["preferences"], userId);

      let base = "You are a helpful assistant.";

      if (userPrefs) {
        const style = userPrefs.value?.communicationStyle || "balanced";
        base += `\nUser prefers ${style} responses.`;
      }

      return base;
    }),
  ],
});
```

</Tab>

<Tab title="运行时上下文">

从运行时上下文访问用户 ID 或配置：

```typescript
import * as z from "zod";
import { createAgent, dynamicSystemPromptMiddleware } from "langchain";

const contextSchema = z.object({
  userRole: z.string(),
  deploymentEnv: z.string(),
});

type Context = z.infer<typeof contextSchema>;

const agent = createAgent({
  model: "gpt-4o",
  tools: [...],
  contextSchema,
  middleware: [
    dynamicSystemPromptMiddleware<Context>((state, runtime) => {
      // Read from Runtime Context: user role and environment
      const userRole = runtime.context.userRole;
      const env = runtime.context.deploymentEnv;

      let base = "You are a helpful assistant.";

      if (userRole === "admin") {
        base += "\nYou have admin access. You can perform all operations.";
      } else if (userRole === "viewer") {
        base += "\nYou have read-only access. Guide users to read operations only.";
      }

      if (env === "production") {
        base += "\nBe extra careful with any data modifications.";
      }

      return base;
    }),
  ],
});
```

</Tab>

</Tabs>

### 消息

消息构成了发送给 LLM 的提示词。
管理消息内容至关重要，以确保 LLM 拥有正确的信息来做出良好响应。

<Tabs>

<Tab title="状态">

当与当前查询相关时，从状态注入上传的文件上下文：

```typescript
    import { createMiddleware } from "langchain";

    const injectFileContext = createMiddleware({
      name: "InjectFileContext",
      wrapModelCall: (request, handler) => {
        // request.state is a shortcut for request.state.messages
        const uploadedFiles = request.state.uploadedFiles || [];  // [!code highlight]

        if (uploadedFiles.length > 0) {
          // Build context about available files
          const fileDescriptions = uploadedFiles.map(file =>
            `- ${file.name} (${file.type}): ${file.summary}`
          );

          const fileContext = `Files you have access to in this conversation:
${fileDescriptions.join("\n")}

Reference these files when answering questions.`;

          // Inject file context before recent messages
          const messages = [  // [!code highlight]
            ...request.messages,  // Rest of conversation
            { role: "user", content: fileContext }
          ];
          request = request.override({ messages });  // [!code highlight]
        }

        return handler(request);
      },
    });

    const agent = createAgent({
      model: "gpt-4o",
      tools: [...],
      middleware: [injectFileContext],
    });
```

</Tab>

<Tab title="存储">

从存储中注入用户的电子邮件写作风格以指导起草：

```typescript
    import * as z from "zod";
    import { createMiddleware } from "langchain";

    const contextSchema = z.object({
      userId: z.string(),
    });

    const injectWritingStyle = createMiddleware({
      name: "InjectWritingStyle",
      contextSchema,
      wrapModelCall: async (request, handler) => {
        const userId = request.runtime.context.userId;  // [!code highlight]

        // Read from Store: get user's writing style examples
        const store = request.runtime.store;  // [!code highlight]
        const writingStyle = await store.get(["writing_style"], userId);  // [!code highlight]

        if (writingStyle) {
          const style = writingStyle.value;
          // Build style guide from stored examples
          const styleContext = `Your writing style:
- Tone: ${style.tone || 'professional'}
- Typical greeting: "${style.greeting || 'Hi'}"
- Typical sign-off: "${style.signOff || 'Best'}"
- Example email you've written:
${style.exampleEmail || ''}`;

          // Append at end - models pay more attention to final messages
          const messages = [
            ...request.messages,
            { role: "user", content: styleContext }
          ];
          request = request.override({ messages });  // [!code highlight]
        }

        return handler(request);
      },
    });
```

</Tab>

<Tab title="运行时上下文">

根据用户的管辖区域，从运行时上下文注入合规规则：

```typescript
    import * as z from "zod";
    import { createMiddleware } from "langchain";

    const contextSchema = z.object({
      userJurisdiction: z.string(),
      industry: z.string(),
      complianceFrameworks: z.array(z.string()),
    });

    type Context = z.infer<typeof contextSchema>;

    const injectComplianceRules = createMiddleware<Context>({
      name: "InjectComplianceRules",
      contextSchema,
      wrapModelCall: (request, handler) => {
        // Read from Runtime Context: get compliance requirements
        const { userJurisdiction, industry, complianceFrameworks } = request.runtime.context;  // [!code highlight]

        // Build compliance constraints
        const rules = [];
        if (complianceFrameworks.includes("GDPR")) {
          rules.push("- Must obtain explicit consent before processing personal data");
          rules.push("- Users have right to data deletion");
        }
        if (complianceFrameworks.includes("HIPAA")) {
          rules.push("- Cannot share patient health information without authorization");
          rules.push("- Must use secure, encrypted communication");
        }
        if (industry === "finance") {
          rules.push("- Cannot provide financial advice without proper disclaimers");
        }

        if (rules.length > 0) {
          const complianceContext = `Compliance requirements for ${userJurisdiction}:
${rules.join("\n")}`;

          // Append at end - models pay more attention to final messages
          const messages = [
            ...request.messages,
            { role: "user", content: complianceContext }
          ];
          request = request.override({ messages });  // [!code highlight]
        }

        return handler(request);
      },
    });
```

</Tab>

</Tabs>

<Note>

<strong>瞬态与持久消息更新：</strong>

上面的示例使用 `wrap_model_call` 进行 <strong>瞬态</strong> 更新——修改单次调用中发送给模型的消息，而不更改保存在状态中的内容。

对于修改状态的 <strong>持久</strong> 更新（如 [生命周期上下文](#summarization) 中的摘要示例），请使用 `before_model` 或 `after_model` 等生命周期钩子来永久更新对话历史。更多详情请参阅 [中间件文档](/oss/langchain/middleware)。

</Note>

### 工具

工具让模型能够与数据库、API 和外部系统交互。您定义和选择工具的方式直接影响模型是否能有效完成任务。

#### 定义工具

每个工具都需要清晰的名称、描述、参数名称和参数描述。这些不仅仅是元数据——它们指导模型关于何时以及如何使用该工具的推理。

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const searchOrders = tool(
  async ({ userId, status, limit }) => {
    // Implementation here
  },
  {
    name: "search_orders",
    description: `Search for user orders by status.

    Use this when the user asks about order history or wants to check
    order status. Always filter by the provided status.`,
    schema: z.object({
      userId: z.string().describe("Unique identifier for the user"),
      status: z.enum(["pending", "shipped", "delivered"]).describe("Order status to filter by"),
      limit: z.number().default(10).describe("Maximum number of results to return"),
    }),
  }
);
```

#### 选择工具

并非每个工具都适用于所有情况。工具过多可能会使模型不堪重负（上下文过载）并增加错误；工具过少则会限制能力。动态工具选择基于认证状态、用户权限、功能标志或对话阶段来调整可用工具集。

<Tabs>

<Tab title="状态">

仅在达到特定对话里程碑后启用高级工具：

```typescript
import { createMiddleware } from "langchain";

const stateBasedTools = createMiddleware({
  name: "StateBasedTools",
  wrapModelCall: (request, handler) => {
    // Read from State: check authentication and conversation length
    const state = request.state;  // [!code highlight]
    const isAuthenticated = state.authenticated || false;  // [!code highlight]
    const messageCount = state.messages.length;

    let filteredTools = request.tools;

    // Only enable sensitive tools after authentication
    if (!isAuthenticated) {
      filteredTools = request.tools.filter(t => t.name.startsWith("public_"));  // [!code highlight]
    } else if (messageCount < 5) {
      filteredTools = request.tools.filter(t => t.name !== "advanced_search");  // [!code highlight]
    }

    return handler({ ...request, tools: filteredTools });  // [!code highlight]
  },
});
```

</Tab>

<Tab title="存储">

根据存储中的用户偏好或功能标志过滤工具：

```typescript
import * as z from "zod";
import { createMiddleware } from "langchain";

const contextSchema = z.object({
  userId: z.string(),
});

const storeBasedTools = createMiddleware({
  name: "StoreBasedTools",
  contextSchema,
  wrapModelCall: async (request, handler) => {
    const userId = request.runtime.context.userId;  // [!code highlight]

    // Read from Store: get user's enabled features
    const store = request.runtime.store;  // [!code highlight]
    const featureFlags = await store.get(["features"], userId);  // [!code highlight]

    let filteredTools = request.tools;

    if (featureFlags) {
      const enabledFeatures = featureFlags.value?.enabledTools || [];
      filteredTools = request.tools.filter(t => enabledFeatures.includes(t.name));  // [!code highlight]
    }

    return handler({ ...request, tools: filteredTools });  // [!code highlight]
  },
});
```

</Tab>

<Tab title="运行时上下文">

根据运行时上下文中的用户权限过滤工具：

```typescript
import * as z from "zod";
import { createMiddleware } from "langchain";

const contextSchema = z.object({
  userRole: z.string(),
});

const contextBasedTools = createMiddleware({
  name: "ContextBasedTools",
  contextSchema,
  wrapModelCall: (request, handler) => {
    // Read from Runtime Context: get user role
    const userRole = request.runtime.context.userRole;  // [!code highlight]

    let filteredTools = request.tools;

    if (userRole === "admin") {
      // Admins get all tools
    } else if (userRole === "editor") {
      filteredTools = request.tools.filter(t => t.name !== "delete_data");  // [!code highlight]
    } else {
      filteredTools = request.tools.filter(t => t.name.startsWith("read_"));  // [!code highlight]
    }

    return handler({ ...request, tools: filteredTools });  // [!code highlight]
  },
});
```

</Tab>

</Tabs>

更多示例请参见 [动态选择工具](/oss/langchain/middleware#dynamically-selecting-tools)。

### 模型

不同的模型有不同的优势、成本和上下文窗口。为当前任务选择合适的模型，这在智能体运行期间可能会发生变化。

<Tabs>

<Tab title="状态">

根据状态中的对话长度使用不同的模型：

```typescript
import { createMiddleware, initChatModel } from "langchain";

// Initialize models once outside the middleware
const largeModel = initChatModel("claude-sonnet-4-5-20250929");
const standardModel = initChatModel("gpt-4o");
const efficientModel = initChatModel("gpt-4o-mini");

const stateBasedModel = createMiddleware({
  name: "StateBasedModel",
  wrapModelCall: (request, handler) => {
    // request.messages is a shortcut for request.state.messages
    const messageCount = request.messages.length;  // [!code highlight]
    let model;

    if (messageCount > 20) {
      model = largeModel;
    } else if (messageCount > 10) {
      model = standardModel;
    } else {
      model = efficientModel;
    }

    return handler({ ...request, model });  // [!code highlight]
  },
});
```

</Tab>

<Tab title="存储">

使用存储中用户偏好的模型：

```typescript
import * as z from "zod";
import { createMiddleware, initChatModel } from "langchain";

const contextSchema = z.object({
  userId: z.string(),
});

// Initialize available models once
const MODEL_MAP = {
  "gpt-4o": initChatModel("gpt-4o"),
  "gpt-4o-mini": initChatModel("gpt-4o-mini"),
  "claude-sonnet": initChatModel("claude-sonnet-4-5-20250929"),
};

const storeBasedModel = createMiddleware({
  name: "StoreBasedModel",
  contextSchema,
  wrapModelCall: async (request, handler) => {
    const userId = request.runtime.context.userId;  // [!code highlight]

    // Read from Store: get user's preferred model
    const store = request.runtime.store;  // [!code highlight]
    const userPrefs = await store.get(["preferences"], userId);  // [!code highlight]

    let model = request.model;

    if (userPrefs) {
      const preferredModel = userPrefs.value?.preferredModel;
      if (preferredModel && MODEL_MAP[preferredModel]) {
        model = MODEL_MAP[preferredModel];  // [!code highlight]
      }
    }

    return handler({ ...request, model });  // [!code highlight]
  },
});
```

</Tab>

<Tab title="运行时上下文">

根据运行时上下文中的成本限制或环境选择模型：

```typescript
import * as z from "zod";
import { createMiddleware, initChatModel } from "langchain";

const contextSchema = z.object({
  costTier: z.string(),
  environment: z.string(),
});

// Initialize models once outside the middleware
const premiumModel = initChatModel("claude-sonnet-4-5-20250929");
const standardModel = initChatModel("gpt-4o");
const budgetModel = initChatModel("gpt-4o-mini");

const contextBasedModel = createMiddleware({
  name: "ContextBasedModel",
  contextSchema,
  wrapModelCall: (request, handler) => {
    // Read from Runtime Context: cost tier and environment
    const costTier = request.runtime.context.costTier;  // [!code highlight]
    const environment = request.runtime.context.environment;  // [!code highlight]

    let model;

    if (environment === "production" && costTier === "premium") {
      model = premiumModel;
    } else if (costTier === "budget") {
      model = budgetModel;
    } else {
      model = standardModel;
    }

    return handler({ ...request, model });  // [!code highlight]
  },
});
```

</Tab>

</Tabs>

更多示例请参见 [动态模型](/oss/langchain/agents#dynamic-model)。

### 响应格式

结构化输出将非结构化文本转换为经过验证的结构化数据。当提取特定字段或为下游系统返回数据时，自由格式的文本是不够的。

**工作原理：** 当您提供一个模式作为响应格式时，模型的最终响应保证符合该模式。智能体运行模型/工具调用循环，直到模型完成工具调用，然后将最终响应强制转换为提供的格式。

#### 定义格式

模式定义指导模型。字段名称、类型和描述精确指定了输出应遵循的格式。

```typescript
import { z } from "zod";

const customerSupportTicket = z.object({
  category: z.enum(["billing", "technical", "account", "product"]).describe(
    "Issue category"
  ),
  priority: z.enum(["low", "medium", "high", "critical"]).describe(
    "Urgency level"
  ),
  summary: z.string().describe(
    "One-sentence summary of the customer's issue"
  ),
  customerSentiment: z.enum(["frustrated", "neutral", "satisfied"]).describe(
    "Customer's emotional tone"
  ),
}).describe("Structured ticket information extracted from customer message");
```

#### 选择格式

动态响应格式选择根据用户偏好、对话阶段或角色调整模式——早期返回简单格式，随着复杂性增加返回详细格式。

<Tabs>

<Tab title="状态">

根据对话状态配置结构化输出：

```typescript
import { createMiddleware } from "langchain";
import { z } from "zod";

const simpleResponse = z.object({
  answer: z.string().describe("A brief answer"),
});

const detailedResponse = z.object({
  answer: z.string().describe("A detailed answer"),
  reasoning: z.string().describe("Explanation of reasoning"),
  confidence: z.number().describe("Confidence score 0-1"),
});

const stateBasedOutput = createMiddleware({
  name: "StateBasedOutput",
  wrapModelCall: (request, handler) => {
    // request.state is a shortcut for request.state.messages
    const messageCount = request.messages.length;  // [!code highlight]

    let responseFormat;
    if (messageCount < 3) {
      // Early conversation - use simple format
      responseFormat = simpleResponse; // [!code highlight]
    } else {
      // Established conversation - use detailed format
      responseFormat = detailedResponse; // [!code highlight]
    }

    return handler({ ...request, responseFormat });
  },
});
```

</Tab>

<Tab title="存储">

根据存储中的用户偏好配置输出格式：

```typescript
import * as z from "zod";
import { createMiddleware } from "langchain";

const contextSchema = z.object({
  userId: z.string(),
});

const verboseResponse = z.object({
  answer: z.string().describe("Detailed answer"),
  sources: z.array(z.string()).describe("Sources used"),
});

const conciseResponse = z.object({
  answer: z.string().describe("Brief answer"),
});

const storeBasedOutput = createMiddleware({
  name: "StoreBasedOutput",
  wrapModelCall: async (request, handler) => {
    const userId = request.runtime.context.userId;  // [!code highlight]

    // Read from Store: get user's preferred response style
    const store = request.runtime.store;  // [!code highlight]
    const userPrefs = await store.get(["preferences"], userId);  // [!code highlight]

    if (userPrefs) {
      const style = userPrefs.value?.responseStyle || "concise";
      if (style === "verbose") {
        request.responseFormat = verboseResponse;  // [!code highlight]
      } else {
        request.responseFormat = conciseResponse;  // [!code highlight]
      }
    }

    return handler(request);
  },
});
```

</Tab>

<Tab title="运行时上下文">

根据运行时上下文（如用户角色或环境）配置输出格式：

```typescript
import * as z from "zod";
import { createMiddleware } from "langchain";

const contextSchema = z.object({
  userRole: z.string(),
  environment: z.string(),
});

const adminResponse = z.object({
  answer: z.string().describe("Answer"),
  debugInfo: z.record(z.any()).describe("Debug information"),
  systemStatus: z.string().describe("System status"),
});

const userResponse = z.object({
  answer: z.string().describe("Answer"),
});

const contextBasedOutput = createMiddleware({
  name: "ContextBasedOutput",
  wrapModelCall: (request, handler) => {
    // Read from Runtime Context: user role and environment
    const userRole = request.runtime.context.userRole;  // [!code highlight]
    const environment = request.runtime.context.environment;  // [!code highlight]

    let responseFormat;
    if (userRole === "admin" && environment === "production") {
      responseFormat = adminResponse;  // [!code highlight]
    } else {
      responseFormat = userResponse;  // [!code highlight]
    }

    return handler({ ...request, responseFormat });
  },
});
```

</Tab>

</Tabs>

## 工具上下文

工具的特殊之处在于它们既读取也写入上下文。

在最基本的情况下，当工具执行时，它接收 LLM 的请求参数并返回一个工具消息。工具完成其工作并产生结果。

工具还可以为模型获取重要信息，使其能够执行和完成任务。

### 读取

大多数现实世界的工具需要的不仅仅是 LLM 的参数。它们需要用户 ID 进行数据库查询、API 密钥访问外部服务，或者当前会话状态来做决策。工具从状态、存储和运行时上下文中读取以访问这些信息。

<Tabs>

<Tab title="状态">

从状态读取以检查当前会话信息：

```typescript
import * as z from "zod";
import { createAgent, tool, type ToolRuntime } from "langchain";

const checkAuthentication = tool(
  async (_, runtime: ToolRuntime) => {
    // Read from State: check current auth status
    const currentState = runtime.state;
    const isAuthenticated = currentState.authenticated || false;

    if (isAuthenticated) {
      return "User is authenticated";
    } else {
      return "User is not authenticated";
    }
  },
  {
    name: "check_authentication",
    description: "Check if user is authenticated",
    schema: z.object({}),
  }
);
```

</Tab>

<Tab title="存储">

从存储读取以访问持久化的用户偏好：

```typescript
import * as z from "zod";
import { createAgent, tool, type ToolRuntime } from "langchain";

const contextSchema = z.object({
  userId: z.string(),
});

const getPreference = tool(
  async ({ preferenceKey }, runtime: ToolRuntime) => {
    const userId = runtime.context.userId;

    // Read from Store: get existing preferences
    const store = runtime.store;
    const existingPrefs = await store.get(["preferences"], userId);

    if (existingPrefs) {
      const value = existingPrefs.value?.[preferenceKey];
      return value ? `${preferenceKey}: ${value}` : `No preference set for ${preferenceKey}`;
    } else {
      return "No preferences found";
    }
  },
  {
    name: "get_preference",
    description: "Get user preference from Store",
    schema: z.object({
      preferenceKey: z.string(),
    }),
  }
);
```

</Tab>

<Tab title="运行时上下文">

从运行时上下文读取配置，如 API 密钥和用户 ID：

```typescript
import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";

const contextSchema = z.object({
  userId: z.string(),
  apiKey: z.string(),
  dbConnection: z.string(),
});

const fetchUserData = tool(
  async ({ query }, runtime: ToolRuntime<any, typeof contextSchema>) => {
    // Read from Runtime Context: get API key and DB connection
    const { userId, apiKey, dbConnection } = runtime.context;

    // Use configuration to fetch data
    const results = await performDatabaseQuery(dbConnection, query, apiKey);

    return `Found ${results.length} results for user ${userId}`;
  },
  {
    name: "fetch_user_data",
    description: "Fetch data using Runtime Context configuration",
    schema: z.object({
      query: z.string(),
    }),
  }
);

const agent = createAgent({
  model: "gpt-4o",
  tools: [fetchUserData],
  contextSchema,
});
```

</Tab>

</Tabs>

### 写入

工具结果可用于帮助智能体完成给定任务。工具既可以直接将结果返回给模型，也可以更新智能体的记忆，使重要的上下文在后续步骤中可用。

<Tabs>

<Tab title="状态">

使用 Command 写入状态以跟踪会话特定信息：

```typescript
import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { Command } from "@langchain/langgraph";

const authenticateUser = tool(
  async ({ password }) => {
    // Perform authentication
    if (password === "correct") {
      // Write to State: mark as authenticated using Command
      return new Command({
        update: { authenticated: true },
      });
    } else {
      return new Command({ update: { authenticated: false } });
    }
  },
  {
    name: "authenticate_user",
    description: "Authenticate user and update State",
    schema: z.object({
      password: z.string(),
    }),
  }
);
```

</Tab>

<Tab title="存储">

写入存储以跨会话持久化数据：

```typescript
import * as z from "zod";
import { createAgent, tool, type ToolRuntime } from "langchain";

const savePreference = tool(
  async ({ preferenceKey, preferenceValue }, runtime: ToolRuntime<any, typeof contextSchema>) => {
    const userId = runtime.context.userId;

    // Read existing preferences
    const store = runtime.store;
    const existingPrefs = await store.get(["preferences"], userId);

    // Merge with new preference
    const prefs = existingPrefs?.value || {};
    prefs[preferenceKey] = preferenceValue;

    // Write to Store: save updated preferences
    await store.put(["preferences"], userId, prefs);

    return `Saved preference: ${preferenceKey} = ${preferenceValue}`;
  },
  {
    name: "save_preference",
    description: "Save user preference to Store",
    schema: z.object({
      preferenceKey: z.string(),
      preferenceValue: z.string(),
    }),
  }
);
```

</Tab>

</Tabs>

有关在工具中访问状态、存储和运行时上下文的全面示例，请参见 [工具](/oss/langchain/tools)。

## 生命周期上下文

控制 **核心智能体步骤之间** 发生的事情——拦截数据流以实现横切关注点，如摘要、护栏和日志记录。

正如您在 [模型上下文](#model-context) 和 [工具上下文](#tool-context) 中所见，[中间件](/oss/langchain/middleware) 是使上下文工程变得可行的机制。中间件允许您钩入智能体生命周期的任何步骤，并：

1.  **更新上下文** - 修改状态和存储以持久化更改、更新对话历史或保存见解
2.  **在生命周期中跳转** - 根据上下文移动到智能体循环中的不同步骤（例如，如果满足条件则跳过工具执行，使用修改后的上下文重复模型调用）

<img src="/oss/images/middleware_final.png" alt="智能体循环中的中间件钩子" />

### 示例：摘要

最常见的生命周期模式之一是在对话历史过长时自动压缩。与 [模型上下文](#messages) 中展示的瞬态消息修剪不同，摘要 **持久地更新状态**——永久地用摘要替换旧消息，该摘要将保存供未来所有轮次使用。

LangChain 为此提供了内置中间件：

```typescript
import { createAgent, summarizationMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [...],
  middleware: [
    summarizationMiddleware({
      model: "gpt-4o-mini",
      trigger: { tokens: 4000 },
      keep: { messages: 20 },
    }),
  ],
});
```

当对话超过令牌限制时，`SummarizationMiddleware` 会自动：
1.  使用单独的 LLM 调用总结较早的消息
2.  在状态中用摘要消息替换它们（永久地）
3.  保留最近的消息以保持上下文

摘要后的对话历史被永久更新——未来的轮次将看到摘要而不是原始消息。

<Note>

有关内置中间件的完整列表、可用钩子以及如何创建自定义中间件，请参阅 [中间件文档](/oss/langchain/middleware)。

</Note>

## 最佳实践

1. **从简单开始** - 先使用静态提示词和工具，仅在必要时添加动态元素
2. **逐步测试** - 每次只添加一个上下文工程功能
3. **监控性能** - 跟踪模型调用、令牌使用情况和延迟
4. **使用内置中间件** - 利用 [`SummarizationMiddleware`](/oss/langchain/middleware#summarization)、[`LLMToolSelectorMiddleware`](/oss/langchain/middleware#llm-tool-selector) 等
5. **记录上下文策略** - 明确说明传递了哪些上下文及其原因
6. **理解临时性与持久性**：模型上下文更改是临时的（每次调用），而生命周期上下文更改会持久保存到状态中

## 相关资源

- [上下文概念概述](/oss/concepts/context) - 了解上下文类型及其使用时机
- [中间件](/oss/langchain/middleware) - 完整的中间件指南
- [工具](/oss/langchain/tools) - 工具创建和上下文访问
- [记忆](/oss/concepts/memory) - 短期和长期记忆模式
- [智能体](/oss/langchain/agents) - 核心智能体概念

