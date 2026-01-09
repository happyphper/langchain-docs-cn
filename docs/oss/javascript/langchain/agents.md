---
title: 智能体
---
智能体（Agents）将语言模型与[工具](/oss/langchain/tools)相结合，构建出能够推理任务、决定使用哪些工具，并迭代式地寻找解决方案的系统。

`createAgent()` 提供了一个可用于生产环境的智能体实现。

[LLM 智能体通过循环运行工具来实现目标](https://simonwillison.net/2025/Sep/18/agents/)。
智能体会持续运行，直到满足停止条件——即模型产生最终输出或达到迭代限制。

```mermaid
%%{
  init: {
    "fontFamily": "monospace",
    "flowchart": {
      "curve": "curve"
    },
    "themeVariables": {"edgeLabelBackground": "transparent"}
  }
}%%
graph TD
  %% Outside the agent
  QUERY([input])
  LLM{model}
  TOOL(tools)
  ANSWER([output])

  %% Main flows (no inline labels)
  QUERY --> LLM
  LLM --"action"--> TOOL
  TOOL --"observation"--> LLM
  LLM --"finish"--> ANSWER

  classDef blueHighlight fill:#0a1c25,stroke:#0a455f,color:#bae6fd;
  classDef greenHighlight fill:#0b1e1a,stroke:#0c4c39,color:#9ce4c4;
  class QUERY blueHighlight;
  class ANSWER blueHighlight;
```

<Info>

`createAgent()` 使用 [LangGraph](/oss/langgraph/overview) 构建一个基于<strong>图</strong>的智能体运行时。图由节点（步骤）和边（连接）组成，定义了智能体处理信息的方式。智能体在这个图中移动，执行诸如模型节点（调用模型）、工具节点（执行工具）或中间件等节点。

了解更多关于 [Graph API](/oss/langgraph/graph-api) 的信息。

</Info>

## 核心组件

### 模型

[模型](/oss/langchain/models) 是智能体的推理引擎。可以通过多种方式指定，支持静态和动态模型选择。

#### 静态模型

静态模型在创建智能体时配置一次，并在整个执行过程中保持不变。这是最常见且最直接的方法。

要从 <Tooltip tip="遵循 `provider:model` 格式的字符串（例如 openai:gpt-5）" cta="查看映射" href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model(model)">模型标识符字符串</Tooltip> 初始化静态模型：

```ts [wrap]
import { createAgent } from "langchain";

const agent = createAgent({
  model: "openai:gpt-5",
  tools: []
});
```

模型标识符字符串使用 `provider:model` 格式（例如 `"openai:gpt-5"`）。您可能希望对模型配置有更多控制，在这种情况下，可以直接使用提供者包初始化模型实例：

```ts [wrap]
import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.1,
  maxTokens: 1000,
  timeout: 30
});

const agent = createAgent({
  model,
  tools: []
});
```

模型实例让您可以完全控制配置。当您需要设置特定参数（如 `temperature`、`max_tokens`、`timeouts`）或配置 API 密钥、`base_url` 以及其他提供者特定的设置时，请使用它们。请参阅 [API 参考](/oss/integrations/providers/)以查看模型上可用的参数和方法。

#### 动态模型

动态模型在 <Tooltip tip="智能体的执行环境，包含在整个智能体执行过程中持久存在的不可变配置和上下文数据（例如，用户 ID、会话详情或应用程序特定配置）。">运行时</Tooltip> 根据当前的 <Tooltip tip="流经智能体执行的数据，包括消息、自定义字段以及任何需要在处理过程中跟踪和可能修改的信息（例如，用户偏好或工具使用统计）。">状态</Tooltip> 和上下文进行选择。这实现了复杂的路由逻辑和成本优化。

要使用动态模型，请使用 `wrapModelCall` 创建中间件，以修改请求中的模型：

```ts
import { ChatOpenAI } from "@langchain/openai";
import { createAgent, createMiddleware } from "langchain";

const basicModel = new ChatOpenAI({ model: "gpt-4o-mini" });
const advancedModel = new ChatOpenAI({ model: "gpt-4o" });

const dynamicModelSelection = createMiddleware({
  name: "DynamicModelSelection",
  wrapModelCall: (request, handler) => {
    // 根据对话复杂性选择模型
    const messageCount = request.messages.length;

    return handler({
        ...request,
        model: messageCount > 10 ? advancedModel : basicModel,
    });
  },
});

const agent = createAgent({
  model: "gpt-4o-mini", // 基础模型（当 messageCount ≤ 10 时使用）
  tools,
  middleware: [dynamicModelSelection],
});
```

有关中间件和高级模式的更多详细信息，请参阅 [中间件文档](/oss/langchain/middleware)。

<Tip>

有关模型配置的详细信息，请参阅 [模型](/oss/langchain/models)。有关动态模型选择模式，请参阅 [中间件中的动态模型](/oss/langchain/middleware#dynamic-model)。

</Tip>

### 工具

工具赋予智能体执行操作的能力。智能体超越了简单的仅模型工具绑定，能够实现：

- 按顺序进行多次工具调用（由单个提示触发）
- 在适当时进行并行工具调用
- 基于先前结果的动态工具选择
- 工具重试逻辑和错误处理
- 跨工具调用的状态持久性

更多信息，请参阅 [工具](/oss/langchain/tools)。

#### 定义工具

向智能体传递一个工具列表。

```ts [wrap]
import * as z from "zod";
import { createAgent, tool } from "langchain";

const search = tool(
  ({ query }) => `Results for: ${query}`,
  {
    name: "search",
    description: "Search for information",
    schema: z.object({
      query: z.string().describe("The query to search for"),
    }),
  }
);

const getWeather = tool(
  ({ location }) => `Weather in ${location}: Sunny, 72°F`,
  {
    name: "get_weather",
    description: "Get weather information for a location",
    schema: z.object({
      location: z.string().describe("The location to get weather for"),
    }),
  }
);

const agent = createAgent({
  model: "gpt-4o",
  tools: [search, getWeather],
});
```

如果提供空的工具列表，智能体将只包含一个 LLM 节点，不具备工具调用能力。

#### 工具错误处理

要自定义工具错误的处理方式，请在自定义中间件中使用 `wrapToolCall` 钩子：

```ts [wrap]
import { createAgent, createMiddleware, ToolMessage } from "langchain";

const handleToolErrors = createMiddleware({
  name: "HandleToolErrors",
  wrapToolCall: async (request, handler) => {
    try {
      return await handler(request);
    } catch (error) {
      // 向模型返回自定义错误消息
      return new ToolMessage({
        content: `Tool error: Please check your input and try again. (${error})`,
        tool_call_id: request.toolCall.id!,
      });
    }
  },
});

const agent = createAgent({
  model: "gpt-4o",
  tools: [
    /* ... */
  ],
  middleware: [handleToolErrors],
});
```

当工具失败时，智能体将返回一个带有自定义错误消息的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>。

#### ReAct 循环中的工具使用

智能体遵循 ReAct（"推理 + 行动"）模式，在简短推理步骤与针对性工具调用之间交替进行，并将结果观察反馈到后续决策中，直到能够给出最终答案。

:::: details ReAct 循环示例

<strong>提示：</strong> 识别当前最受欢迎的无线耳机并验证其可用性。

```
================================ Human Message =================================

Find the most popular wireless headphones right now and check if they're in stock
```

* <strong>推理</strong>："流行度是随时间变化的，我需要使用提供的搜索工具。"
* <strong>行动</strong>：调用 `search_products("wireless headphones")`

```
================================== Ai Message ==================================
Tool Calls:
  search_products (call_abc123)
 Call ID: call_abc123
  Args:
    query: wireless headphones
```
```
================================= Tool Message =================================

Found 5 products matching "wireless headphones". Top 5 results: WH-1000XM5, ...
```

* <strong>推理</strong>："在回答之前，我需要确认排名第一的商品的可用性。"
* <strong>行动</strong>：调用 `check_inventory("WH-1000XM5")`

```
================================== Ai Message ==================================
Tool Calls:
  check_inventory (call_def456)
 Call ID: call_def456
  Args:
    product_id: WH-1000XM5
```
```
================================= Tool Message =================================

Product WH-1000XM5: 10 units in stock
```

* <strong>推理</strong>："我已经有了最受欢迎的型号及其库存状态。现在可以回答用户的问题了。"
* <strong>行动</strong>：生成最终答案

```
================================== Ai Message ==================================

I found wireless headphones (model WH-1000XM5) with 10 units in stock...
```

::::

<Tip>

要了解更多关于工具的信息，请参阅 [工具](/oss/langchain/tools)。

</Tip>

### 系统提示

您可以通过提供提示来塑造智能体处理任务的方式。`systemPrompt` 参数可以作为字符串提供：

```ts [wrap]
const agent = createAgent({
  model,
  tools,
  systemPrompt: "You are a helpful assistant. Be concise and accurate.",
});
```

当未提供 `systemPrompt` 时，智能体将直接从消息推断其任务。

`systemPrompt` 参数接受 `string` 或 `SystemMessage`。使用 `SystemMessage` 可以让您更好地控制提示结构，这对于特定提供者的功能（如 [Anthropic 的提示缓存](/oss/integrations/chat/anthropic#prompt-caching)）非常有用：

```ts [wrap]
import { createAgent } from "langchain";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const literaryAgent = createAgent({
  model: "anthropic:claude-sonnet-4-5",
  systemPrompt: new SystemMessage({
    content: [
      {
        type: "text",
        text: "You are an AI assistant tasked with analyzing literary works.",
      },
      {
        type: "text",
        text: "<the entire contents of 'Pride and Prejudice'>",
        cache_control: { type: "ephemeral" }
      }
    ]
  })
});

const result = await literaryAgent.invoke({
  messages: [new HumanMessage("Analyze the major themes in 'Pride and Prejudice'.")]
});
```

带有 `{ type: "ephemeral" }` 的 `cache_control` 字段告诉 Anthropic 缓存该内容块，从而减少使用相同系统提示的重复请求的延迟和成本。

#### 动态系统提示

对于需要根据运行时上下文或智能体状态修改系统提示的更高级用例，您可以使用 [中间件](/oss/langchain/middleware)。

:::python

@[`@dynamic_prompt`] 装饰器创建基于模型请求生成系统提示的中间件：

```python wrap
from typing
