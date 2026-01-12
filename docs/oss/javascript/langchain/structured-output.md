---
title: 结构化输出 (Structured output)
---


结构化输出（Structured output）允许智能体（agent）以特定、可预测的格式返回数据。你无需解析自然语言响应，而是可以直接获得类型化的结构化数据。

LangChain 的预构建 ReAct 智能体 `createAgent` 会自动处理结构化输出。用户设置他们期望的结构化输出模式（schema），当模型生成结构化数据时，它会被捕获、验证并返回到智能体状态的 `structuredResponse` 键中。

```ts
type ResponseFormat = (
    | ZodSchema<StructuredResponseT> // 一个 Zod 模式
    | Record<string, unknown> // 一个 JSON 模式
)

const agent = createAgent({
    // ...
    responseFormat: ResponseFormat | ResponseFormat[]
})
```

## 响应格式 (Response format)

控制智能体如何返回结构化数据。你可以提供 Zod 对象或 JSON 模式。默认情况下，智能体使用工具调用策略，即输出由一个额外的工具调用创建。某些模型支持原生结构化输出，在这种情况下，智能体将改用该策略。

你可以通过将 `ResponseFormat` 包装在 `toolStrategy` 或 `providerStrategy` 函数调用中来控制此行为：

```ts
import { toolStrategy, providerStrategy } from "langchain";

const agent = createAgent({
    // 如果模型支持，则使用提供商策略
    responseFormat: providerStrategy(z.object({ ... }))
    // 或强制使用工具策略
    responseFormat: toolStrategy(z.object({ ... }))
})
```

结构化响应会返回到智能体最终状态的 `structuredResponse` 键中。

<Tip>

如果使用 `langchain>=1.1`，对原生结构化输出功能的支持会从模型的[配置文件数据](/oss/javascript/langchain/models#model-profiles)中动态读取。如果数据不可用，请使用其他条件或手动指定：
```typescript
const customProfile: ModelProfile = {
    structuredOutput: true,
    // ...
}
const model = await initChatModel("...", { profile: customProfile });
```
如果指定了工具，模型必须同时支持工具和结构化输出。

</Tip>

## 提供商策略 (Provider strategy)

一些模型提供商通过其 API 原生支持结构化输出（例如 OpenAI、xAI (Grok)、Gemini、Anthropic (Claude)）。当可用时，这是最可靠的方法。

要使用此策略，请配置一个 `ProviderStrategy`：

```ts
function providerStrategy<StructuredResponseT>(
    schema: ZodSchema<StructuredResponseT> | JsonSchemaFormat
): ProviderStrategy<StructuredResponseT>
```

<ParamField path="schema" required>

定义结构化输出格式的模式。支持：
    - <strong>Zod 模式</strong>：一个 Zod 模式
    - <strong>JSON 模式</strong>：一个 JSON 模式对象

</ParamField>

当你直接将模式类型传递给 `createAgent.responseFormat` 并且模型支持原生结构化输出时，LangChain 会自动使用 `ProviderStrategy`：

::: code-group

```ts [Zod Schema]
import * as z from "zod";
import { createAgent, providerStrategy } from "langchain";

const ContactInfo = z.object({
    name: z.string().describe("人员姓名"),
    email: z.string().describe("人员的电子邮件地址"),
    phone: z.string().describe("人员的电话号码"),
});

const agent = createAgent({
    model: "gpt-5",
    tools: [],
    responseFormat: providerStrategy(ContactInfo)
});

const result = await agent.invoke({
    messages: [{"role": "user", "content": "从以下内容提取联系信息：John Doe, john@example.com, (555) 123-4567"}]
});

console.log(result.structuredResponse);
// { name: "John Doe", email: "john@example.com", phone: "(555) 123-4567" }
```

```ts [JSON Schema]
import { createAgent, providerStrategy } from "langchain";

const contactInfoSchema = {
    "type": "object",
    "description": "人员的联系信息。",
    "properties": {
        "name": {"type": "string", "description": "人员姓名"},
        "email": {"type": "string", "description": "人员的电子邮件地址"},
        "phone": {"type": "string", "description": "人员的电话号码"}
    },
    "required": ["name", "email", "phone"]
}

const agent = createAgent({
    model: "gpt-5",
    tools: [],
    responseFormat: providerStrategy(contactInfoSchema)
});

const result = await agent.invoke({
    messages: [{"role": "user", "content": "从以下内容提取联系信息：John Doe, john@example.com, (555) 123-4567"}]
});

console.log(result.structuredResponse);
// { name: "John Doe", email: "john@example.com", phone: "(555) 123-4567" }
```

:::

提供商原生结构化输出提供了高可靠性和严格的验证，因为模型提供商会强制执行模式。在可用时请使用它。

<Note>

如果提供商原生支持你选择的模型的结构化输出，那么写 `responseFormat: contactInfoSchema` 与写 `responseFormat: providerStrategy(contactInfoSchema)` 在功能上是等效 of.

无论哪种情况，如果不支持结构化输出，智能体将回退到工具调用策略。

</Note>

## 工具调用策略 (Tool calling strategy)

对于不支持原生结构化输出的模型，LangChain 使用工具调用来实现相同的结果。这适用于所有支持工具调用的模型（大多数现代模型）。

要使用此策略，请配置一个 `ToolStrategy`：

```ts
function toolStrategy<StructuredResponseT>(
    responseFormat:
        | JsonSchemaFormat
        | ZodSchema<StructuredResponseT>
        | (ZodSchema<StructuredResponseT> | JsonSchemaFormat)[]
    options?: ToolStrategyOptions
): ToolStrategy<StructuredResponseT>
```

<ParamField path="schema" required>

定义结构化输出格式的模式。支持：
    - <strong>Zod 模式</strong>：一个 Zod 模式
    - <strong>JSON 模式</strong>：一个 JSON 模式对象

</ParamField>

<ParamField path="options.toolMessageContent">

生成结构化输出时返回的工具消息的自定义内容。
如果未提供，则默认为显示结构化响应数据的消息。

</ParamField>

<ParamField path="options.handleError">

包含可选 `handleError` 参数的选项对象，用于自定义错误处理策略。

    - <strong>`true`</strong>：捕获所有错误并使用默认错误模板（默认）
    - <strong>`False`</strong>：不重试，让异常传播
    - <strong>`(error: ToolStrategyError) => string | Promise<string>`</strong>：使用提供的消息进行重试或抛出错误

</ParamField>

::: code-group

```ts [Zod Schema]
import * as z from "zod";
import { createAgent, toolStrategy } from "langchain";

const ProductReview = z.object({
    rating: z.number().min(1).max(5).optional(),
    sentiment: z.enum(["positive", "negative"]),
    keyPoints: z.array(z.string()).describe("评论的要点。小写，每个1-3个词。"),
});

const agent = createAgent({
    model: "gpt-5",
    tools: [],
    responseFormat: toolStrategy(ProductReview)
})

const result = await agent.invoke({
    "messages": [{"role": "user", "content": "分析此评论：'很棒的产品：5星。发货快，但价格贵'"}]
})

console.log(result.structuredResponse);
// { "rating": 5, "sentiment": "positive", "keyPoints": ["fast shipping", "expensive"] }
```

```ts [JSON Schema]
import { createAgent, toolStrategy } from "langchain";

const productReviewSchema = {
    "type": "object",
    "description": "产品评论分析。",
    "properties": {
        "rating": {
            "type": ["integer", "null"],
            "description": "产品评分 (1-5)",
            "minimum": 1,
            "maximum": 5
        },
        "sentiment": {
            "type": "string",
            "enum": ["positive", "negative"],
            "description": "评论的情感倾向"
        },
        "key_points": {
            "type": "array",
            "items": {"type": "string"},
            "description": "评论的要点"
        }
    },
    "required": ["sentiment", "key_points"]
}

const agent = createAgent({
    model: "gpt-5",
    tools: [],
    responseFormat: toolStrategy(productReviewSchema)
});

const result = await agent.invoke({
    messages: [{"role": "user", "content": "分析此评论：'很棒的产品：5星。发货快，但价格贵'"}]
})

console.log(result.structuredResponse);
// { "rating": 5, "sentiment": "positive", "keyPoints": ["fast shipping", "expensive"] }
```

```ts [Union Types]
import * as z from "zod";
import { createAgent, toolStrategy } from "langchain";

const ProductReview = z.object({
    rating: z.number().min(1).max(5).optional(),
    sentiment: z.enum(["positive", "negative"]),
    keyPoints: z.array(z.string()).describe("评论的要点。小写，每个1-3个词。"),
});

const CustomerComplaint = z.object({
    issueType: z.enum(["product", "service", "shipping", "billing"]),
    severity: z.enum(["low", "medium", "high"]),
    description: z.string().describe("投诉的简要说明"),
});

const agent = createAgent({
    model: "gpt-5",
    tools: [],
    responseFormat: toolStrategy([ProductReview, CustomerComplaint])
});

const result = await agent.invoke({
    messages: [{"role": "user", "content": "分析此评论：'很棒的产品：5星。发货快，但价格贵'"}]
})

console.log(result.structuredResponse);
// { "rating": 5, "sentiment": "positive", "keyPoints": ["fast shipping", "expensive"] }
```

:::

### 自定义工具消息内容 (Custom tool message content)

`toolMessageContent` 参数允许你自定义生成结构化输出时出现在对话历史中的消息：

```ts
import * as z from "zod";
import { createAgent, toolStrategy } from "langchain";

const MeetingAction = z.object({
    task: z.string().describe("要完成的具体任务"),
    assignee: z.string().describe("负责该任务的人员"),
    priority: z.enum(["low", "medium", "high"]).describe("优先级"),
});

const agent = createAgent({
    model: "gpt-5",
    tools: [],
    responseFormat: toolStrategy(MeetingAction, {
        toolMessageContent: "操作项已捕获并添加到会议记录中！"
    })
});

const result = await agent.invoke({
    messages: [{"role": "user", "content": "来自我们的会议：Sarah 需要尽快更新项目时间表"}]
});

console.log(result);
/**
 * {
 *   messages: [
 *     { role: "user", content: "来自我们的会议：Sarah 需要尽快更新项目时间表" },
 *     { role: "assistant", content: "操作项已捕获并添加到会议记录中！", tool_calls: [ { name: "MeetingAction", args: { task: "更新项目时间表", assignee: "Sarah", priority: "high" }, id: "call_456" } ] },
 *     { role: "tool", content: "操作项已捕获并添加到会议记录中！", tool_call_id: "call_456", name: "MeetingAction" }
 *   ],
 *   structuredResponse: { task: "更新项目时间表", assignee: "Sarah", priority: "high" }
 * }
 */
```

如果没有 `toolMessageContent`，我们会看到：

```ts
# console.log(result);
/**
 * {
 *   messages: [
 *     ...
 *     { role: "tool", content: "Returning structured response: {'task': 'update the project timeline', 'assignee': 'Sarah', 'priority': 'high'}", tool_call_id: "call_456", name: "MeetingAction" }
 *   ],
 *   structuredResponse: { task: "update the project timeline", assignee: "Sarah", priority: "high" }
 * }
 */
```

## 错误处理 (Error handling)

模型通过工具调用生成结构化输出时可能会出错。LangChain 提供了智能重试机制来自动处理这些错误。

#### 多个结构化输出错误 (Multiple structured outputs error)

当模型错误地调用了多个结构化输出工具时，智能体会提供 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a> 形式的错误反馈，并提示模型重试：

```ts
import * as z from "zod";
import { createAgent, toolStrategy } from "langchain";

const ContactInfo = z.object({
    name: z.string().describe("人员姓名"),
    email: z.string().describe("电子邮件地址"),
});

const EventDetails = z.object({
    event_name: z.string().describe("活动名称"),
    date: z.string().describe("活动日期"),
});

const agent = createAgent({
    model: "gpt-5",
    tools: [],
    responseFormat: toolStrategy([ContactInfo, EventDetails]),
});

const result = await agent.invoke({
    messages: [
        {
        role: "user",
        content:
            "提取信息：John Doe (john@email.com) 正在组织 3 月 15 日的技术会议",
        },
    ],
});

console.log(result);

/**
 * {
 *   messages: [
 *     { role: "user", content: "提取信息：John Doe (john@email.com) 正在组织 3 月 15 日的技术会议" },
 *     { role: "assistant", content: "", tool_calls: [ { name: "ContactInfo", args: { name: "John Doe", email: "john@email.com" }, id: "call_1" }, { name: "EventDetails", args: { event_name: "技术会议", date: "March 15th" }, id: "call_2" } ] },
 *     { role: "tool", content: "Error: 模型错误地返回了多个结构化响应 (ContactInfo, EventDetails)，而预期只有一个。\n 请纠正你的错误。", tool_call_id: "call_1", name: "ContactInfo" },
 *     { role: "tool", content: "Error: 模型错误地返回了多个结构化响应 (ContactInfo, EventDetails)，而预期只有一个。\n 请纠正你的错误。", tool_call_id: "call_2", name: "EventDetails" },
 *     { role: "assistant", content: "", tool_calls: [ { name: "ContactInfo", args: { name: "John Doe", email: "john@email.com" }, id: "call_3" } ] },
 *     { role: "tool", content: "Returning structured response: {'name': 'John Doe', 'email': 'john@email.com'}", tool_call_id: "call_3", name: "ContactInfo" }
 *   ],
 *   structuredResponse: { name: "John Doe", email: "john@email.com" }
 * }
 */
```

#### Schema validation error

When structured output doesn't match the expected schema, the agent provides specific error feedback:

```ts
import * as z from "zod";
import { createAgent, toolStrategy } from "langchain";

const ProductRating = z.object({
    rating: z.number().min(1).max(5).describe("1-5 之间的评分"),
    comment: z.string().describe("评论内容"),
});

const agent = createAgent({
    model: "gpt-5",
    tools: [],
    responseFormat: toolStrategy(ProductRating),
});

const result = await agent.invoke({
    messages: [
        {
        role: "user",
        content: "解析此内容：Amazing product, 10/10!",
        },
    ],
});

console.log(result);

/**
 * {
 *   messages: [
 *     { role: "user", content: "解析此内容：Amazing product, 10/10!" },
 *     { role: "assistant", content: "", tool_calls: [ { name: "ProductRating", args: { rating: 10, comment: "Amazing product" }, id: "call_1" } ] },
 *     { role: "tool", content: "Error: 解析工具 'ProductRating' 的结构化输出失败：1 validation error for ProductRating\nrating\n  Input should be less than or equal to 5 [type=less_than_equal, input_value=10, input_type=int].\n 请纠正你的错误。", tool_call_id: "call_1", name: "ProductRating" },
 *     { role: "assistant", content: "", tool_calls: [ { name: "ProductRating", args: { rating: 5, comment: "Amazing product" }, id: "call_2" } ] },
 *     { role: "tool", content: "Returning structured response: {'rating': 5, 'comment': 'Amazing product'}", tool_call_id: "call_2", name: "ProductRating" }
 *   ],
 *   structuredResponse: { rating: 5, comment: "Amazing product" }
 * }
 */
```

#### 错误处理策略 (Error handling strategies)

你可以使用 `handleErrors` 参数自定义错误的处​​理方式：

**自定义错误消息：**

```ts
const responseFormat = toolStrategy(ProductRating, {
    handleError: "请提供 1-5 之间的有效评分并包含评论。"
})

// 错误消息变为：
// { role: "tool", content: "请提供 1-5 之间的有效评分并包含评论。" }
```

**仅处理特定异常：**

```ts
import { ToolInputParsingException } from "@langchain/core/tools";

const responseFormat = toolStrategy(ProductRating, {
    handleError: (error: ToolStrategyError) => {
        if (error instanceof ToolInputParsingException) {
        return "请提供 1-5 之间的有效评分并包含评论。";
        }
        return error.message;
    }
})

// 仅验证错误会使用默认消息重试：
// { role: "tool", content: "Error: 解析工具 'ProductRating' 的结构化输出失败：...\n 请纠正你的错误。" }
```

**处理多种异常类型：**

```ts
const responseFormat = toolStrategy(ProductRating, {
    handleError: (error: ToolStrategyError) => {
        if (error instanceof ToolInputParsingException) {
        return "请提供 1-5 之间的有效评分并包含评论。";
        }
        if (error instanceof CustomUserError) {
        return "这是一个自定义用户错误。";
        }
        return error.message;
    }
})
```

**无错误处理：**

```ts
const responseFormat = toolStrategy(ProductRating, {
    handleError: false  // 抛出所有错误
})
```

