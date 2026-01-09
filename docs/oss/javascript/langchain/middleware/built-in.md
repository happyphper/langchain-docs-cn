---
title: 内置中间件
description: 适用于常见代理用例的预构建中间件
---
LangChain 为常见用例提供了预构建的中间件。每个中间件都是生产就绪的，并且可以根据您的具体需求进行配置。

## 与提供商无关的中间件

以下中间件适用于任何 LLM 提供商：

| 中间件 | 描述 |
|------------|-------------|
| [摘要](#summarization) | 在接近令牌限制时自动总结对话历史。 |
| [人在回路](#human-in-the-loop) | 暂停执行以等待人工批准工具调用。 |
| [模型调用限制](#model-call-limit) | 限制模型调用次数以防止成本过高。 |
| [工具调用限制](#tool-call-limit) | 通过限制调用次数来控制工具执行。 |
| [模型回退](#model-fallback) | 当主模型失败时自动回退到备用模型。 |
| [PII 检测](#pii-detection) | 检测和处理个人身份信息 (PII)。 |
| [待办事项列表](#to-do-list) | 为智能体配备任务规划和跟踪能力。 |
| [LLM 工具选择器](#llm-tool-selector) | 在调用主模型之前使用 LLM 选择相关工具。 |
| [工具重试](#tool-retry) | 使用指数退避自动重试失败的工具调用。 |
| [模型重试](#model-retry) | 使用指数退避自动重试失败的模型调用。 |
| [LLM 工具模拟器](#llm-tool-emulator) | 使用 LLM 模拟工具执行以进行测试。 |
| [上下文编辑](#context-editing) | 通过修剪或清除工具使用来管理对话上下文。 |

### 摘要

在接近令牌限制时自动总结对话历史，保留最近的消息同时压缩较旧的上下文。摘要适用于以下情况：
- 超出上下文窗口的长时间运行对话。
- 具有大量历史记录的多轮对话。
- 需要保留完整对话上下文的应用。

```typescript
import { createAgent, summarizationMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [weatherTool, calculatorTool],
  middleware: [
    summarizationMiddleware({
      model: "gpt-4o-mini",
      trigger: { tokens: 4000 },
      keep: { messages: 20 },
    }),
  ],
});
```

:::: details 配置选项

<Tip>

如果使用 `langchain@1.1.0`，`trigger` 和 `keep` 的 `fraction` 条件（如下所示）依赖于聊天模型的[配置文件数据](/oss/langchain/models#model-profiles)。如果数据不可用，请使用其他条件或手动指定：

```typescript
const customProfile: ModelProfile = {
    maxInputTokens: 100_000,
    // ...
}
model = await initChatModel("...", {
    profile: customProfile,
});
```

</Tip>

<ParamField body="model" type="string | BaseChatModel" required>

用于生成摘要的模型。可以是模型标识符字符串（例如，`'openai:gpt-4o-mini'`）或 `BaseChatModel` 实例。

</ParamField>

<ParamField body="trigger" type="object | object[]">

触发摘要的条件。可以是：

- 单个条件对象（必须满足所有属性 - AND 逻辑）
- 条件对象数组（必须满足任一条件 - OR 逻辑）

每个条件可以包括：
- `fraction` (number)：模型上下文大小的比例 (0-1)
- `tokens` (number)：绝对令牌计数
- `messages` (number)：消息计数

每个条件必须至少指定一个属性。如果未提供，摘要将不会自动触发。

</ParamField>

<ParamField body="keep" type="object" default="{messages: 20}">

摘要后保留多少上下文。请指定以下之一：

- `fraction` (number)：保留的模型上下文大小比例 (0-1)
- `tokens` (number)：保留的绝对令牌计数
- `messages` (number)：保留的最近消息数量

</ParamField>

<ParamField body="tokenCounter" type="function">

自定义令牌计数函数。默认为基于字符的计数。

</ParamField>

<ParamField body="summaryPrompt" type="string">

用于摘要的自定义提示模板。如果未指定，则使用内置模板。模板应包含 `{messages}` 占位符，对话历史将插入其中。

</ParamField>

<ParamField body="trimTokensToSummarize" type="number" default="4000">

生成摘要时要包含的最大令牌数。在摘要之前，消息将被修剪以适应此限制。

</ParamField>

<ParamField body="summaryPrefix" type="string">

添加到摘要消息的前缀。如果未提供，则使用默认前缀。

</ParamField>

<ParamField body="maxTokensBeforeSummary" type="number" deprecated>

<strong>已弃用：</strong> 请改用 `trigger: { tokens: value }`。触发摘要的令牌阈值。

</ParamField>

<ParamField body="messagesToKeep" type="number" deprecated>

<strong>已弃用：</strong> 请改用 `keep: { messages: value }`。要保留的最近消息。

</ParamField>

::::

:::: details 完整示例

摘要中间件监控消息令牌计数，并在达到阈值时自动总结较早的消息。

<strong>触发条件</strong> 控制何时运行摘要：
- 单个条件对象（必须满足指定的条件）
- 条件数组（必须满足任一条件 - OR 逻辑）
- 每个条件可以使用 `fraction`（模型上下文大小的比例）、`tokens`（绝对计数）或 `messages`（消息计数）

<strong>保留条件</strong> 控制保留多少上下文（请指定以下之一）：
- `fraction` - 保留的模型上下文大小比例
- `tokens` - 保留的绝对令牌计数
- `messages` - 保留的最近消息数量

```typescript
import { createAgent, summarizationMiddleware } from "langchain";

// Single condition
const agent = createAgent({
  model: "gpt-4o",
  tools: [weatherTool, calculatorTool],
  middleware: [
    summarizationMiddleware({
      model: "gpt-4o-mini",
      trigger: { tokens: 4000, messages: 10 },
      keep: { messages: 20 },
    }),
  ],
});

// Multiple conditions
const agent2 = createAgent({
  model: "gpt-4o",
  tools: [weatherTool, calculatorTool],
  middleware: [
    summarizationMiddleware({
      model: "gpt-4o-mini",
      trigger: [
        { tokens: 3000, messages: 6 },
      ],
      keep: { messages: 20 },
    }),
  ],
});

// Using fractional limits
const agent3 = createAgent({
  model: "gpt-4o",
  tools: [weatherTool, calculatorTool],
  middleware: [
    summarizationMiddleware({
      model: "gpt-4o-mini",
      trigger: { fraction: 0.8 },
      keep: { fraction: 0.3 },
    }),
  ],
});
```

::::

### 人在回路

在工具调用执行之前，暂停智能体执行以等待人工批准、编辑或拒绝。[人在回路](/oss/langchain/human-in-the-loop) 适用于以下情况：

- 需要人工批准的高风险操作（例如数据库写入、金融交易）。
- 强制要求人工监督的合规工作流。
- 人工反馈指导智能体的长时间运行对话。

<Warning>

人在回路中间件需要一个[检查点器](/oss/langgraph/persistence#checkpoints)来在中断期间维护状态。

</Warning>

```typescript
import { createAgent, humanInTheLoopMiddleware } from "langchain";

function readEmailTool(emailId: string): string {
  /** Mock function to read an email by its ID. */
  return `Email content for ID: ${emailId}`;
}

function sendEmailTool(recipient: string, subject: string, body: string): string {
  /** Mock function to send an email. */
  return `Email sent to ${recipient} with subject '${subject}'`;
}

const agent = createAgent({
  model: "gpt-4o",
  tools: [readEmailTool, sendEmailTool],
  middleware: [
    humanInTheLoopMiddleware({
      interruptOn: {
        sendEmailTool: {
          allowedDecisions: ["approve", "edit", "reject"],
        },
        readEmailTool: false,
      }
    })
  ]
});
```

<Tip>

有关完整示例、配置选项和集成模式，请参阅[人在回路文档](/oss/langchain/human-in-the-loop)。

</Tip>

<Callout icon="circle-play" iconType="solid">

观看此[视频指南](https://www.youtube.com/watch?v=tdOeUVERukA)，演示人在回路中间件的行为。

</Callout>

### 模型调用限制

限制模型调用次数以防止无限循环或成本过高。模型调用限制适用于以下情况：

- 防止失控的智能体进行过多的 API 调用。
- 在生产部署中强制执行成本控制。
- 在特定调用预算内测试智能体行为。

```typescript
import { createAgent, modelCallLimitMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const agent = createAgent({
  model: "gpt-4o",
  checkpointer: new MemorySaver(), // Required for thread limiting
  tools: [],
  middleware: [
    modelCallLimitMiddleware({
      threadLimit: 10,
      runLimit: 5,
      exitBehavior: "end",
    }),
  ],
});
```

<Callout icon="circle-play" iconType="solid">

观看此[视频指南](https://www.youtube.com/watch?v=x5jLQTFXR0Y)，演示模型调用限制中间件的行为。

</Callout>

:::: details 配置选项

<ParamField body="threadLimit" type="number">

线程中所有运行的最大模型调用次数。默认为无限制。

</ParamField>

<ParamField body="runLimit" type="number">

单次调用的最大模型调用次数。默认为无限制。

</ParamField>

<ParamField body="exitBehavior" type="string" default="end">

达到限制时的行为。选项：`'end'`（优雅终止）或 `'error'`（抛出异常）

</ParamField>

::::

### 工具调用限制

通过限制工具调用次数来控制智能体执行，可以全局限制所有工具，也可以限制特定工具。工具调用限制适用于以下情况：

- 防止对昂贵的外部 API 进行过多调用。
- 限制网络搜索或数据库查询。
- 对特定工具使用强制执行速率限制。
- 防止失控的智能体循环。

```typescript
import { createAgent, toolCallLimitMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool, databaseTool],
  middleware: [
    toolCallLimitMiddleware({ threadLimit: 20, runLimit: 10 }),
    toolCallLimitMiddleware({
      toolName: "search",
      threadLimit: 5,
      runLimit: 3,
    }),
  ],
});
```

<Callout icon="circle-play" iconType="solid">

观看此[视频指南](https://www.youtube.com/watch?v=oL6am5UqODY)，演示工具调用限制中间件的行为。

</Callout>

:::: details 配置选项

<ParamField body="toolName" type="string">

要限制的特定工具名称。如果未提供，限制将<strong>全局应用于所有工具</strong>。

</ParamField>

<ParamField body="threadLimit" type="number">

线程（对话）中所有运行的最大工具调用次数。在具有相同线程 ID 的多次调用中持续存在。需要检查点来维护状态。`undefined` 表示无线程限制。

</ParamField>

<ParamField body="runLimit" type="number">

每次调用（一个用户消息 → 响应周期）的最大工具调用次数。每次新的用户消息时重置。`undefined` 表示无运行限制。

<strong>注意：</strong> 必须指定 `threadLimit` 或 `runLimit` 中的至少一个。

</ParamField>

<ParamField body="exitBehavior" type="string" default="continue">

达到限制时的行为：

- `'continue'`（默认）- 用错误消息阻止超出的工具调用，让其他工具和模型继续运行。模型根据错误消息决定何时结束。
- `'error'` - 抛出 `ToolCallLimitExceededError` 异常，立即停止执行
- `'end'` - 立即停止执行，并为超出的工具调用生成 ToolMessage 和 AI 消息。仅在限制单个工具时有效；如果其他工具有待处理的调用，则抛出错误。

</ParamField>

::::

:::: details 完整示例

使用以下方式指定限制：
- <strong>线程限制</strong> - 对话中所有运行的最大调用次数（需要检查点）
- <strong>运行限制</strong> - 每次调用的最大调用次数（每轮重置）

退出行为：
- `'continue'`（默认）- 用错误消息阻止超出的调用，代理继续运行
- `'error'` - 立即引发异常
- `'end'` - 使用 ToolMessage + AI 消息停止（仅适用于单工具场景）

```typescript
import { createAgent, toolCallLimitMiddleware } from "langchain";

const globalLimiter = toolCallLimitMiddleware({ threadLimit: 20, runLimit: 10 });
const searchLimiter = toolCallLimitMiddleware({ toolName: "search", threadLimit: 5, runLimit: 3 });
const databaseLimiter = toolCallLimitMiddleware({ toolName: "query_database", threadLimit: 10 });
const strictLimiter = toolCallLimitMiddleware({ toolName: "scrape_webpage", runLimit: 2, exitBehavior: "error" });

const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool, databaseTool, scraperTool],
  middleware: [globalLimiter, searchLimiter, databaseLimiter, strictLimiter],
});
```

::::

### 模型回退

当主模型失败时，自动回退到备用模型。模型回退适用于以下场景：

- 构建能够处理模型中断的弹性代理。
- 通过回退到更便宜的模型来优化成本。
- 跨 OpenAI、Anthropic 等提供商实现冗余。

```typescript
import { createAgent, modelFallbackMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  middleware: [
    modelFallbackMiddleware(
      "gpt-4o-mini",
      "claude-3-5-sonnet-20241022"
    ),
  ],
});
```

:::: details 配置选项

该中间件接受可变数量的字符串参数，表示按顺序排列的回退模型：

<ParamField body="...models" type="string[]" required>

当主模型失败时，按顺序尝试的一个或多个回退模型字符串

```typescript
modelFallbackMiddleware(
  "first-fallback-model",
  "second-fallback-model",
  // ... more models
)
```

</ParamField>

::::

### PII 检测

使用可配置的策略检测和处理对话中的个人身份信息（PII）。PII 检测适用于以下场景：

- 具有合规性要求的医疗保健和金融应用。
- 需要清理日志的客户服务代理。
- 任何处理敏感用户数据的应用。

```typescript
import { createAgent, piiMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  middleware: [
    piiMiddleware("email", { strategy: "redact", applyToInput: true }),
    piiMiddleware("credit_card", { strategy: "mask", applyToInput: true }),
  ],
});
```

#### 自定义 PII 类型

您可以通过提供 `detector` 参数创建自定义 PII 类型。这允许您检测超出内置类型的、特定于您用例的模式。

**创建自定义检测器的三种方式：**

1.  **正则表达式模式字符串** - 简单的模式匹配
1.  **RegExp 对象** - 对正则表达式标志的更多控制

1.  **自定义函数** - 带有验证的复杂检测逻辑

```typescript
import { createAgent, piiMiddleware, type PIIMatch } from "langchain";

// Method 1: Regex pattern string
const agent1 = createAgent({
  model: "gpt-4o",
  tools: [],
  middleware: [
    piiMiddleware("api_key", {
      detector: "sk-[a-zA-Z0-9]{32}",
      strategy: "block",
    }),
  ],
});

// Method 2: RegExp object
const agent2 = createAgent({
  model: "gpt-4o",
  tools: [],
  middleware: [
    piiMiddleware("phone_number", {
      detector: /\+?\d{1,3}[\s.-]?\d{3,4}[\s.-]?\d{4}/,
      strategy: "mask",
    }),
  ],
});

// Method 3: Custom detector function
function detectSSN(content: string): PIIMatch[] {
  const matches: PIIMatch[] = [];
  const pattern = /\d{3}-\d{2}-\d{4}/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    const ssn = match[0];
    // Validate: first 3 digits shouldn't be 000, 666, or 900-999
    const firstThree = parseInt(ssn.substring(0, 3), 10);
    if (firstThree !== 0 && firstThree !== 666 && !(firstThree >= 900 && firstThree <= 999)) {
      matches.push({
        text: ssn,
        start: match.index ?? 0,
        end: (match.index ?? 0) + ssn.length,
      });
    }
  }
  return matches;
}

const agent3 = createAgent({
  model: "gpt-4o",
  tools: [],
  middleware: [
    piiMiddleware("ssn", {
      detector: detectSSN,
      strategy: "hash",
    }),
  ],
});
```

**自定义检测器函数签名：**

检测器函数必须接受一个字符串（内容）并返回匹配项：

返回一个 `PIIMatch` 对象数组：

```typescript
interface PIIMatch {
  text: string;    // The matched text
  start: number;   // Start index in content
  end: number;      // End index in content
}

function detector(content: string): PIIMatch[] {
  return [
    { text: "matched_text", start: 0, end: 12 },
    // ... more matches
  ];
}
```

<Tip>

对于自定义检测器：

    - 使用正则表达式字符串处理简单模式
    - 当您需要标志时使用 RegExp 对象（例如，不区分大小写的匹配）
    - 当您需要超出模式匹配的验证逻辑时使用自定义函数
    - 自定义函数让您完全控制检测逻辑，并可以实现复杂的验证规则

</Tip>

:::: details 配置选项

<ParamField body="piiType" type="string" required>

要检测的 PII 类型。可以是内置类型（`email`、`credit_card`、`ip`、`mac_address`、`url`）或自定义类型名称。

</ParamField>

<ParamField body="strategy" type="string" default="redact">

如何处理检测到的 PII。选项：

- `'block'` - 检测到时抛出错误
- `'redact'` - 替换为 `[REDACTED_TYPE]`
- `'mask'` - 部分屏蔽（例如 `**<strong>-</strong><strong>-</strong>**-1234`）
- `'hash'` - 替换为确定性哈希值（例如 `<email_hash:a1b2c3d4>`）

</ParamField>

<ParamField body="detector" type="RegExp | string | function">

自定义检测器。可以是：

- `RegExp` - 用于匹配的正则表达式模式
- `string` - 正则表达式模式字符串（例如 `"sk-[a-zA-Z0-9]{32}"`）
- `function` - 自定义检测器函数 `(content: string) => PIIMatch[]`

如果未提供，则使用该 PII 类型的内置检测器。

</ParamField>

<ParamField body="applyToInput" type="boolean" default="true">

在模型调用前检查用户消息

</ParamField>

<ParamField body="applyToOutput" type="boolean" default="false">

在模型调用后检查 AI 消息

</ParamField>

<ParamField body="applyToToolResults" type="boolean" default="false">

在执行后检查工具结果消息

</ParamField>

::::

### 待办事项列表

为代理配备任务规划和跟踪能力，以处理复杂的多步骤任务。待办事项列表适用于以下场景：

- 需要跨多个工具协调的复杂多步骤任务。
- 进度可见性很重要的长时间运行操作。

<Note>

此中间件自动为代理提供 `write_todos` 工具和系统提示，以指导有效的任务规划。

</Note>

```typescript
import { createAgent, todoListMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [readFile, writeFile, runTests],
  middleware: [todoListMiddleware()],
});
```

<Callout icon="circle-play" iconType="solid">

观看此[视频指南](https://www.youtube.com/watch?v=dwvhZ1z_Pas)，演示待办事项列表中间件的行为。

</Callout>

:::: details 配置选项

无可用配置选项（使用默认值）。

::::

### LLM 工具选择器

在调用主模型之前，使用 LLM 智能选择相关工具。LLM 工具选择器适用于以下场景：

- 拥有许多工具（10+）且大多数工具与每个查询无关的代理。
- 通过过滤不相关的工具来减少令牌使用。
- 提高模型的专注度和准确性。

此中间件使用结构化输出来询问 LLM 哪些工具与当前查询最相关。结构化输出模式定义了可用的工具名称和描述。模型提供商通常会在后台将此结构化输出信息添加到系统提示中。

```typescript
import { createAgent, llmToolSelectorMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [tool1, tool2, tool3, tool4, tool5, ...],
  middleware: [
    llmToolSelectorMiddleware({
      model: "gpt-4o-mini",
      maxTools: 3,
      alwaysInclude: ["search"],
    }),
  ],
});
```

:::: details 配置选项

<ParamField body="model" type="string | BaseChatModel">

用于工具选择的模型。可以是模型标识符字符串（例如 `'openai:gpt-4o-mini'`）或 `BaseChatModel` 实例。默认为代理的主模型。

</ParamField>

<ParamField body="systemPrompt" type="string">

选择模型的指令。如果未指定，则使用内置提示。

</ParamField>

<ParamField body="maxTools" type="number">

要选择的最大工具数量。如果模型选择了更多，则仅使用前 maxTools 个。如果未指定，则无限制。

</ParamField>

<ParamField body="alwaysInclude" type="string[]">

无论选择如何，始终包含的工具名称。这些不计入 maxTools 限制。

</ParamField>

::::

### 工具重试

使用可配置的指数退避自动重试失败的工具调用。工具重试适用于以下场景：

- 处理外部 API 调用中的瞬时故障。
- 提高网络依赖工具的可靠性。
- 构建能够优雅处理临时错误的弹性代理。

**API 参考：** <a href="https://reference.langchain.com/javascript/functions/langchain.index.toolRetryMiddleware.html" target="_blank" rel="noreferrer" class="link"><code>toolRetryMiddleware</code></a>

```typescript
import { createAgent, toolRetryMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool, databaseTool],
  middleware: [
    toolRetryMiddleware({
      maxRetries: 3,
      backoffFactor: 2.0,
      initialDelayMs: 1000,
    }),
  ],
});
```

:::: details 配置选项

<ParamField body="maxRetries" type="number" default="2">

初始调用后的最大重试尝试次数（默认情况下总共 3 次尝试）。必须 >= 0。

</ParamField>

<ParamField body="tools" type="(ClientTool | ServerTool | string)[]">

要应用重试逻辑的可选工具或工具名称数组。可以是 `BaseTool` 实例列表或工具名称字符串。如果为 `undefined`，则应用于所有工具。

</ParamField>

<ParamField body="retryOn" type="((error: Error) =>
boolean) | (new (...args: any[]) => Error)[]" default="() => true">
要么是要重试的错误构造函数的数组，要么是接受错误并在应重试时返回 `true` 的函数。默认是重试所有错误。

</ParamField>

<ParamField body="onFailure" type="'error' | 'continue' | ((error: Error) =>
string)" default="continue">
所有重试耗尽时的行为。选项：
- `'continue'`（默认）- 返回包含错误详情的 `ToolMessage`，允许 LLM 处理故障并可能恢复
- `'error'` - 重新抛出异常，停止代理执行
- 自定义函数 - 接受异常并返回用于 `ToolMessage` 内容的字符串的函数，允许自定义错误格式化

<strong>已弃用的值：</strong> `'raise'`（请改用 `'error'`）和 `'return_message'`（请改用 `'continue'`）。这些已弃用的值仍然有效，但会显示警告。

</ParamField>

<ParamField body="backoffFactor" type="number" default="2.0">

指数退避的乘数。每次重试等待 `initialDelayMs * (backoffFactor ** retryNumber)` 毫秒。设置为 `0.0` 表示恒定延迟。必须 >= 0。

</ParamField>

<ParamField body="initialDelayMs" type="number" default="1000">

第一次重试前的初始延迟（毫秒）。必须 >= 0。

</ParamField>

<ParamField body="maxDelayMs" type="number" default="60000">

重试之间的最大延迟（毫秒）（限制指数退避增长）。必须 >= 0。

</ParamField>

<ParamField body="jitter" type="boolean" default="true">

是否向延迟添加随机抖动（`±25%`）以避免惊群效应

</ParamField>

::::

:::: details 完整示例

该中间件使用指数退避自动重试失败的工具调用。

<strong>关键配置：</strong>
- `maxRetries` - 重试尝试次数（默认值：2）
- `backoffFactor` - 指数退避的乘数因子（默认值：2.0）
- `initialDelayMs` - 初始延迟（毫秒）（默认值：1000ms）
- `maxDelayMs` - 延迟增长上限（默认值：60000ms）
- `jitter` - 添加随机变化（默认值：true）

<strong>失败处理：</strong>
- `onFailure: "continue"`（默认） - 返回错误消息
- `onFailure: "error"` - 重新抛出异常
- 自定义函数 - 返回错误消息的函数

```typescript
import { createAgent, toolRetryMiddleware } from "langchain";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Basic usage with default settings (2 retries, exponential backoff)
const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool, databaseTool],
  middleware: [toolRetryMiddleware()],
});

// Retry specific exceptions only
const retry = toolRetryMiddleware({
  maxRetries: 4,
  retryOn: [TimeoutError, NetworkError],
  backoffFactor: 1.5,
});

// Custom exception filtering
function shouldRetry(error: Error): boolean {
  // Only retry on 5xx errors
  if (error.name === "HTTPError" && "statusCode" in error) {
    const statusCode = (error as any).statusCode;
    return 500 <= statusCode && statusCode < 600;
  }
  return false;
}

const retryWithFilter = toolRetryMiddleware({
  maxRetries: 3,
  retryOn: shouldRetry,
});

// Apply to specific tools with custom error handling
const formatError = (error: Error) =>
  "Database temporarily unavailable. Please try again later.";

const retrySpecificTools = toolRetryMiddleware({
  maxRetries: 4,
  tools: ["search_database"],
  onFailure: formatError,
});

// Apply to specific tools using BaseTool instances
const searchDatabase = tool(
  async ({ query }) => {
    // Search implementation
    return results;
  },
  {
    name: "search_database",
    description: "Search the database",
    schema: z.object({ query: z.string() }),
  }
);

const retryWithToolInstance = toolRetryMiddleware({
  maxRetries: 4,
  tools: [searchDatabase], // Pass BaseTool instance
});

// Constant backoff (no exponential growth)
const constantBackoff = toolRetryMiddleware({
  maxRetries: 5,
  backoffFactor: 0.0, // No exponential growth
  initialDelayMs: 2000, // Always wait 2 seconds
});

// Raise exception on failure
const strictRetry = toolRetryMiddleware({
  maxRetries: 2,
  onFailure: "error", // Re-raise exception instead of returning message
});
```

::::

### 模型重试

使用可配置的指数退避自动重试失败的模型调用。模型重试适用于以下场景：

- 处理模型 API 调用中的瞬时故障。
- 提高依赖网络的模型请求的可靠性。
- 构建能够优雅处理临时模型错误的弹性智能体。

**API 参考：** <a href="https://reference.langchain.com/javascript/functions/langchain.index.modelRetryMiddleware.html" target="_blank" rel="noreferrer" class="link"><code>modelRetryMiddleware</code></a>

```typescript
import { createAgent, modelRetryMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool, databaseTool],
  middleware: [
    modelRetryMiddleware({
      maxRetries: 3,
      backoffFactor: 2.0,
      initialDelayMs: 1000,
    }),
  ],
});
```

:::: details 配置选项

<ParamField body="maxRetries" type="number" default="2">

初始调用后的最大重试尝试次数（默认情况下总共尝试 3 次）。必须 >= 0。

</ParamField>

<ParamField body="retryOn" type="((error: Error) =>
boolean) | (new (...args: any[]) => Error)[]" default="() => true">
要重试的错误构造函数数组，或者一个接收错误并在应重试时返回 `true` 的函数。默认重试所有错误。

</ParamField>

<ParamField body="onFailure" type="'error' | 'continue' | ((error: Error) =>
string)" default="continue">
所有重试耗尽时的行为。选项：
- `'continue'`（默认） - 返回包含错误详情的 `AIMessage`，允许智能体优雅地处理失败
- `'error'` - 重新抛出异常，停止智能体执行
- 自定义函数 - 接收异常并返回用于 `AIMessage` 内容的字符串的函数，允许自定义错误格式化

</ParamField>

<ParamField body="backoffFactor" type="number" default="2.0">

指数退避的乘数因子。每次重试等待 `initialDelayMs * (backoffFactor ** retryNumber)` 毫秒。设置为 `0.0` 表示恒定延迟。必须 >= 0。

</ParamField>

<ParamField body="initialDelayMs" type="number" default="1000">

首次重试前的初始延迟（毫秒）。必须 >= 0。

</ParamField>

<ParamField body="maxDelayMs" type="number" default="60000">

重试之间的最大延迟（毫秒）（限制指数退避增长）。必须 >= 0。

</ParamField>

<ParamField body="jitter" type="boolean" default="true">

是否向延迟添加随机抖动（`±25%`）以避免惊群效应

</ParamField>

::::

:::: details 完整示例

该中间件使用指数退避自动重试失败的模型调用。

```typescript
import { createAgent, modelRetryMiddleware } from "langchain";

// Basic usage with default settings (2 retries, exponential backoff)
const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool],
  middleware: [modelRetryMiddleware()],
});

class TimeoutError extends Error {
    // ...
}
class NetworkError extends Error {
    // ...
}

// Retry specific exceptions only
const retry = modelRetryMiddleware({
  maxRetries: 4,
  retryOn: [TimeoutError, NetworkError],
  backoffFactor: 1.5,
});

// Custom exception filtering
function shouldRetry(error: Error): boolean {
  // Only retry on rate limit errors
  if (error.name === "RateLimitError") {
    return true;
  }
  // Or check for specific HTTP status codes
  if (error.name === "HTTPError" && "statusCode" in error) {
    const statusCode = (error as any).statusCode;
    return statusCode === 429 || statusCode === 503;
  }
  return false;
}

const retryWithFilter = modelRetryMiddleware({
  maxRetries: 3,
  retryOn: shouldRetry,
});

// Return error message instead of raising
const retryContinue = modelRetryMiddleware({
  maxRetries: 4,
  onFailure: "continue", // Return AIMessage with error instead of throwing
});

// Custom error message formatting
const formatError = (error: Error) =>
  `Model call failed: ${error.message}. Please try again later.`;

const retryWithFormatter = modelRetryMiddleware({
  maxRetries: 4,
  onFailure: formatError,
});

// Constant backoff (no exponential growth)
const constantBackoff = modelRetryMiddleware({
  maxRetries: 5,
  backoffFactor: 0.0, // No exponential growth
  initialDelayMs: 2000, // Always wait 2 seconds
});

// Raise exception on failure
const strictRetry = modelRetryMiddleware({
  maxRetries: 2,
  onFailure: "error", // Re-raise exception instead of returning message
});
```

::::

### LLM 工具模拟器

使用 LLM 模拟工具执行以进行测试，用 AI 生成的响应替换实际工具调用。LLM 工具模拟器适用于以下场景：

- 无需执行真实工具即可测试智能体行为。
- 在外部工具不可用或成本高昂时开发智能体。
- 在实现实际工具之前原型化智能体工作流。

```typescript
import { createAgent, toolEmulatorMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [getWeather, searchDatabase, sendEmail],
  middleware: [
    toolEmulatorMiddleware(), // Emulate all tools
  ],
});
```

:::: details 配置选项

<ParamField body="tools" type="(string | ClientTool | ServerTool)[]">

要模拟的工具名称（字符串）或工具实例列表。如果为 `undefined`（默认），将模拟所有工具。如果为空数组 `[]`，则不模拟任何工具。如果是包含工具名称/实例的数组，则仅模拟这些工具。

</ParamField>

<ParamField body="model" type="string | BaseChatModel">

用于生成模拟工具响应的模型。可以是模型标识符字符串（例如，`'anthropic:claude-sonnet-4-5-20250929'`）或 `BaseChatModel` 实例。如果未指定，则默认为智能体的模型。

</ParamField>

::::

:::: details 完整示例

该中间件使用 LLM 为工具调用生成合理的响应，而不是执行实际工具。

```typescript
import { createAgent, toolEmulatorMiddleware, tool } from "langchain";
import * as z from "zod";

const getWeather = tool(
  async ({ location }) => `Weather in ${location}`,
  {
    name: "get_weather",
    description: "Get the current weather for a location",
    schema: z.object({ location: z.string() }),
  }
);

const sendEmail = tool(
  async ({ to, subject, body }) => "Email sent",
  {
    name: "send_email",
    description: "Send an email",
    schema: z.object({
      to: z.string(),
      subject: z.string(),
      body: z.string(),
    }),
  }
);

// Emulate all tools (default behavior)
const agent = createAgent({
  model: "gpt-4o",
  tools: [getWeather, sendEmail],
  middleware: [toolEmulatorMiddleware()],
});

// Emulate specific tools by name
const agent2 = createAgent({
  model: "gpt-4o",
  tools: [getWeather, sendEmail],
  middleware: [
    toolEmulatorMiddleware({
      tools: ["get_weather"],
    }),
  ],
});

// Emulate specific tools by passing tool instances
const agent3 = createAgent({
  model: "gpt-4o",
  tools: [getWeather, sendEmail],
  middleware: [
    toolEmulatorMiddleware({
      tools: [getWeather],
    }),
  ],
});

// Use custom model for emulation
const agent5 = createAgent({
  model: "gpt-4o",
  tools: [getWeather, sendEmail],
  middleware: [
    toolEmulatorMiddleware({
      model: "claude-sonnet-4-5-20250929",
    }),
  ],
});
```

::::

### 上下文编辑

通过清除达到令牌限制时的旧工具调用输出来管理对话上下文，同时保留最近的结果。这有助于在包含许多工具调用的长对话中保持上下文窗口可控。上下文编辑适用于以下场景：

- 包含许多工具调用且超出令牌限制的长对话
- 通过删除不再相关的旧工具输出来降低令牌成本
- 在上下文中仅保留最近的 N 个工具结果

```typescript
import { createAgent, contextEditingMiddleware, ClearToolUsesEdit } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  middleware: [
    contextEditingMiddleware({
      edits: [
        new ClearToolUsesEdit({
          triggerTokens: 100000,
          keep: 3,
        }),
      ],
    }),
  ],
});
```

:::: details 配置选项

<ParamField body="edits" type="ContextEdit[]" default="[new ClearToolUsesEdit()]">

要应用的 <a href="https://reference.langchain.com/javascript/interfaces/langchain.index.ContextEdit.html" target="_blank" rel="noreferrer" class="link"><code>ContextEdit</code></a> 策略数组

</ParamField>

<strong><a href="https://reference.langchain.com/javascript/classes/langchain.index.ClearToolUsesEdit.html" target="_blank" rel="noreferrer" class="link"><code>ClearToolUsesEdit</code></a> 选项：</strong>

<ParamField body="triggerTokens" type="number" default="100000">

触发编辑的令牌计数。当对话超过此令牌计数时，将清除旧工具输出。

</ParamField>

<ParamField body="clearAtLeast" type="number" default="0">

编辑运行时至少要回收的令牌数。如果设置为 0，则根据需要清除尽可能多的内容。

</ParamField>

<ParamField body="keep" type="number" default="3">

必须保留的最远工具结果数量。这些永远不会被清除。

</ParamField>

<ParamField body="clearToolInputs" type="boolean" default="false">

是否清除 AI 消息上的原始工具调用参数。当为 `true` 时，工具调用参数将替换为空对象。

</ParamField>

<ParamField body="excludeTools" type="string[]" default="[]">

要排除在清除之外的工具名称列表。这些工具的输出永远不会被清除。

</ParamField>

<ParamField body="placeholder" type="string" default="[cleared]">

为已清除的工具输出插入的占位符文本。这将替换原始工具消息内容。

</ParamField>

::::

:::: details 完整示例

该中间件在达到令牌限制时应用上下文编辑策略。最常见的策略是 `ClearToolUsesEdit`，它在保留最近结果的同时清除旧工具结果。

<strong>工作原理：</strong>
1. 监控对话中的令牌计数
2. 达到阈值时，清除旧工具输出
3. 保留最近的 N 个工具结果
4. 可选地保留工具调用参数以供上下文使用

```typescript
import { createAgent, contextEditingMiddleware, ClearToolUsesEdit } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool, calculatorTool, databaseTool],
  middleware: [
    contextEditingMiddleware({
      edits: [
        new ClearToolUsesEdit({
          triggerTokens: 2000,
          keep: 3,
          clearToolInputs: false,
          excludeTools: [],
          placeholder: "[cleared]",
        }),
      ],
    }),
  ],
});
```

::::

## 特定于提供商的中间件

这些中间件针对特定的 LLM 提供商进行了优化。有关完整详细信息和示例，请参阅每个提供商的文档。

<Columns :cols="2">

<Card title="Anthropic" href="/oss/integrations/middleware/anthropic" icon="anthropic" arrow>

适用于 Claude 模型的提示缓存、bash 工具、文本编辑器、内存和文件搜索中间件。

</Card>

</Columns>

