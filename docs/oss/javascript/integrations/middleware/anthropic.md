---
title: Anthropic 中间件
---
专为 Anthropic 的 Claude 模型设计的中间件。了解更多关于[中间件](/oss/javascript/langchain/middleware/overview)的信息。

| 中间件 | 描述 |
|------------|-------------|
| [提示词缓存](#prompt-caching) | 通过缓存重复的提示词前缀来降低成本 |

## 提示词缓存

通过在 Anthropic 的服务器上缓存静态或重复的提示内容（如系统提示、工具定义和对话历史记录），来降低成本和延迟。此中间件实现了**对话式缓存策略**，该策略会在最新消息之后放置缓存断点，从而允许整个对话历史记录（包括最新的用户消息）被缓存并在后续 API 调用中重复使用。

提示词缓存在以下场景中非常有用：

- 具有长且静态的系统提示，且在请求之间不会更改的应用程序
- 具有许多工具定义，且在多次调用中保持不变的智能体
- 早期消息历史记录在多轮对话中被重复使用的对话
- 高流量部署，其中降低 API 成本和延迟至关重要

<Info>

了解更多关于 [Anthropic 提示词缓存](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#cache-limitations)的策略和限制。

</Info>

```typescript
import { createAgent, anthropicPromptCachingMiddleware } from "langchain";

const agent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  prompt: "<Your long system prompt here>",
  middleware: [anthropicPromptCachingMiddleware({ ttl: "5m" })],
});
```

:::: details 配置选项

<ParamField body="ttl" type="string" default="5m">

缓存内容的生存时间。有效值：`'5m'` 或 `'1h'`

</ParamField>

::::

:::: details 完整示例

该中间件会缓存每个请求中直到并包括最新消息的内容。在 TTL 窗口（5 分钟或 1 小时）内的后续请求中，之前已见的内容将从缓存中检索，而不是重新处理，从而显著降低成本和延迟。

<strong>工作原理：</strong>
1.  第一个请求：系统提示、工具和用户消息 *"Hi, my name is Bob"* 被发送到 API 并进行缓存
2.  第二个请求：缓存的内容（系统提示、工具和第一条消息）从缓存中检索。只有新消息 *"What's my name?"* 需要处理，再加上模型对第一个请求的响应
3.  这种模式在每一轮对话中持续进行，每个请求都重复使用缓存的对话历史记录

```typescript
import { createAgent, HumanMessage, anthropicPromptCachingMiddleware } from "langchain";

const LONG_PROMPT = `
Please be a helpful assistant.

<Lots more context ...>
`;

const agent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  prompt: LONG_PROMPT,
  middleware: [anthropicPromptCachingMiddleware({ ttl: "5m" })],
});

// 第一次调用：创建包含系统提示、工具和 "Hi, my name is Bob" 的缓存
await agent.invoke({
  messages: [new HumanMessage("Hi, my name is Bob")]
});

// 第二次调用：重复使用缓存的系统提示、工具和之前的消息
// 仅处理新消息 "What's my name?" 和之前的 AI 响应
const result = await agent.invoke({
  messages: [new HumanMessage("What's my name?")]
});
```

::::

