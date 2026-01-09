---
title: 自定义中间件
---
通过实现钩子（hooks）在智能体执行流程的特定节点运行，来构建自定义中间件。

## 钩子

中间件提供了两种风格的钩子来拦截智能体执行：

<CardGroup :cols="2">

<Card title="节点式钩子" icon="share-nodes" href="#node-style-hooks">

在特定的执行节点顺序运行。

</Card>

<Card title="包装式钩子" icon="container-storage" href="#wrap-style-hooks">

围绕每个模型或工具调用运行。

</Card>

</CardGroup>

### 节点式钩子

在特定的执行节点顺序运行。用于日志记录、验证和状态更新。

**可用钩子：**

- `beforeAgent` - 在智能体启动前（每次调用一次）
- `beforeModel` - 在每次模型调用前
- `afterModel` - 在每次模型响应后
- `afterAgent` - 在智能体完成后（每次调用一次）

**示例：**

```typescript
import { createMiddleware, AIMessage } from "langchain";

const createMessageLimitMiddleware = (maxMessages: number = 50) => {
  return createMiddleware({
    name: "MessageLimitMiddleware",
    beforeModel: (state) => {
      if (state.messages.length === maxMessages) {
        return {
          messages: [new AIMessage("Conversation limit reached.")],
          jumpTo: "end",
        };
      }
      return;
    },
    afterModel: (state) => {
      const lastMessage = state.messages[state.messages.length - 1];
      console.log(`Model returned: ${lastMessage.content}`);
      return;
    },
  });
};
```

### 包装式钩子

拦截执行并控制何时调用处理器。用于重试、缓存和转换。

你可以决定处理器被调用零次（短路）、一次（正常流程）或多次（重试逻辑）。

**可用钩子：**

- `wrapModelCall` - 围绕每次模型调用
- `wrapToolCall` - 围绕每次工具调用

**示例：**

```typescript
import { createMiddleware } from "langchain";

const createRetryMiddleware = (maxRetries: number = 3) => {
  return createMiddleware({
    name: "RetryMiddleware",
    wrapModelCall: (request, handler) => {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return handler(request);
        } catch (e) {
          if (attempt === maxRetries - 1) {
            throw e;
          }
          console.log(`Retry ${attempt + 1}/${maxRetries} after error: ${e}`);
        }
      }
      throw new Error("Unreachable");
    },
  });
};
```

## 创建中间件

使用 `createMiddleware` 函数定义自定义中间件：

```typescript
import { createMiddleware } from "langchain";

const loggingMiddleware = createMiddleware({
  name: "LoggingMiddleware",
  beforeModel: (state) => {
    console.log(`About to call model with ${state.messages.length} messages`);
    return;
  },
  afterModel: (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    console.log(`Model returned: ${lastMessage.content}`);
    return;
  },
});
```

## 自定义状态模式

中间件可以使用自定义属性扩展智能体的状态。这使得中间件能够：

- **跨执行跟踪状态**：维护在整个智能体执行生命周期中持续存在的计数器、标志或其他值

- **在钩子间共享数据**：将信息从 `beforeModel` 传递到 `afterModel`，或在不同的中间件实例之间传递

- **实现横切关注点**：添加如速率限制、使用情况跟踪、用户上下文或审计日志等功能，而无需修改核心智能体逻辑
- **做出条件决策**：使用累积的状态来决定是否继续执行、跳转到不同节点或动态修改行为

```typescript
import { createMiddleware, createAgent, HumanMessage } from "langchain";
import * as z from "zod";

const callCounterMiddleware = createMiddleware({
  name: "CallCounterMiddleware",
  stateSchema: z.object({
    modelCallCount: z.number().default(0),
    userId: z.string().optional(),
  }),
  beforeModel: (state) => {
    if (state.modelCallCount > 10) {
      return { jumpTo: "end" };
    }
    return;
  },
  afterModel: (state) => {
    return { modelCallCount: state.modelCallCount + 1 };
  },
});

const agent = createAgent({
  model: "gpt-4o",
  tools: [...],
  middleware: [callCounterMiddleware],
});

const result = await agent.invoke({
  messages: [new HumanMessage("Hello")],
  modelCallCount: 0,
  userId: "user-123",
});
```

状态字段可以是公共的或私有的。以下划线 (`_`) 开头的字段被视为私有字段，不会包含在智能体的结果中。只有公共字段（那些没有前导下划线的字段）会被返回。

这对于存储不应暴露给调用者的内部中间件状态非常有用，例如临时跟踪变量或内部标志：

```typescript
const middleware = createMiddleware({
  name: "ExampleMiddleware",
  stateSchema: z.object({
    // 公共字段 - 包含在调用结果中
    publicCounter: z.number().default(0),
    // 私有字段 - 从调用结果中排除
    _internalFlag: z.boolean().default(false),
  }),
  afterModel: (state) => {
    // 两个字段在执行期间都可访问
    if (state._internalFlag) {
      return { publicCounter: state.publicCounter + 1 };
    }
    return { _internalFlag: true };
  },
});

const result = await agent.invoke({
  messages: [new HumanMessage("Hello")],
  publicCounter: 0
});

// result 只包含 publicCounter，不包含 _internalFlag
console.log(result.publicCounter); // 1
console.log(result._internalFlag); // undefined
```

:::js
## 自定义上下文

中间件可以定义自定义上下文模式来访问每次调用的元数据。与状态不同，上下文是只读的，不会在调用之间持久化。这使其非常适合：

- **用户信息**：传递在执行期间不会改变的用户 ID、角色或偏好设置
- **配置覆盖**：提供每次调用的设置，如速率限制或功能标志
- **租户/工作空间上下文**：为多租户应用程序包含组织特定的数据
- **请求元数据**：传递中间件所需的请求 ID、API 密钥或其他元数据

使用 Zod 定义上下文模式，并通过中间件钩子中的 `runtime.context` 访问它。上下文模式中的必填字段将在 TypeScript 级别强制执行，确保在调用 `agent.invoke()` 时必须提供它们。

```typescript
import { createAgent, createMiddleware, HumanMessage } from "langchain";
import * as z from "zod";

const contextSchema = z.object({
  userId: z.string(),
  tenantId: z.string(),
  apiKey: z.string().optional(),
});

const userContextMiddleware = createMiddleware({
  name: "UserContextMiddleware",
  contextSchema,
  wrapModelCall: (request, handler) => {
    // 从运行时访问上下文
    const { userId, tenantId } = request.runtime.context;

    // 将用户上下文添加到系统消息
    const contextText = `User ID: ${userId}, Tenant: ${tenantId}`;
    const newSystemMessage = request.systemMessage.concat(contextText);

    return handler({
      ...request,
      systemMessage: newSystemMessage,
    });
  },
});

const agent = createAgent({
  model: "gpt-4o",
  middleware: [userContextMiddleware],
  tools: [],
  contextSchema,
});

const result = await agent.invoke(
  { messages: [new HumanMessage("Hello")] },
  // 必须提供必填字段 (userId, tenantId)
  {
    context: {
      userId: "user-123",
      tenantId: "acme-corp",
    },
  }
);
```

**必填上下文字段
