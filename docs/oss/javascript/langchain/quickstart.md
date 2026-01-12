---
title: 快速入门 (Quickstart)
---

本快速入门将引导您在几分钟内从简单的设置到构建一个功能完整的 AI 智能体（agent）。

<Tip>

<strong>LangChain 文档 MCP 服务器</strong>

如果您正在使用 AI 编程助手或 IDE（例如 Claude Code 或 Cursor），您应该安装 [LangChain Docs MCP 服务器](/use-these-docs) 以充分利用它。这能确保您的智能体可以访问最新的 LangChain 文档和示例。

</Tip>

## 要求 (Requirements)

要运行这些示例，您需要：

* [安装 (Install)](/oss/javascript/langchain/install) LangChain 包
* 设置 [Claude (Anthropic)](https://www.anthropic.com/) 账户并获取 API 密钥
* 在您的终端中设置 `ANTHROPIC_API_KEY` 环境变量

虽然这些示例使用 Claude，但您也可以通过更改代码中的模型名称并设置相应的 API 密钥来使用[任何支持的模型](/oss/javascript/integrations/providers/overview)。

## 构建基础智能体 (Build a basic agent)

首先创建一个可以回答问题并调用工具的简单智能体。该智能体将使用 Claude Sonnet 4.5 作为其语言模型，一个基础的天气函数作为工具，以及一个简单的提示词来指导其行为。

```ts
import { createAgent, tool } from "langchain";
import * as z from "zod";

const getWeather = tool(
  (input) => `It's always sunny in ${input.city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);

const agent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  tools: [getWeather],
});

console.log(
  await agent.invoke({
    messages: [{ role: "user", content: "What's the weather in Tokyo?" }],
  })
);
```

<Tip>

要了解如何使用 LangSmith 追踪您的智能体，请参阅 [LangSmith 文档](/langsmith/trace-with-langchain)。

</Tip>

## 构建真实世界的智能体 (Build a real-world agent)

接下来，构建一个实用的天气预报智能体，演示关键的生产级概念：

1. **详细的系统提示词 (Detailed system prompts)** 以获得更好的智能体行为
2. **创建工具 (Create tools)** 以集成外部数据
3. **模型配置 (Model configuration)** 以获得一致的响应
4. **结构化输出 (Structured output)** 以获得可预测的结果
5. **对话记忆 (Conversational memory)** 以实现类似聊天的交互
6. **创建并运行智能体 (Create and run the agent)** 构建一个功能完整的智能体

让我们逐步完成每个步骤：

<Steps>

<Step title="定义系统提示词 (Define the system prompt)">

系统提示词定义了智能体的角色和行为。请保持其具体且具可操作性：

```ts
const systemPrompt = `You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location.`;
```

</Step>

<Step title="创建工具 (Create tools)">

[工具 (Tools)](/oss/javascript/langchain/tools) 是您的智能体可以调用的函数。通常，工具会希望连接到外部系统，并依赖运行时配置来实现。请注意这里的 `getUserLocation` 工具正是这样做的：

```ts
import { tool, type ToolRuntime } from "langchain";
import * as z from "zod";

const getWeather = tool(
  (input) => `It's always sunny in ${input.city}!`,
  {
    name: "get_weather_for_location",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);

type AgentRuntime = ToolRuntime<unknown, { user_id: string }>;

const getUserLocation = tool(
  (_, config: AgentRuntime) => {
    const { user_id } = config.context;
    return user_id === "1" ? "Florida" : "SF";
  },
  {
    name: "get_user_location",
    description: "Retrieve user information based on user ID",
  }
);
```

<Note>

[Zod](https://zod.dev/) 是一个用于验证和解析预定义模式的库。您可以使用它来定义工具的输入模式，以确保智能体仅使用正确的参数调用工具。

或者，您可以将 `schema` 属性定义为 [JSON 模式 (JSON schema)](https://json-schema.org/overview/what-is-jsonschema) 对象。请记住，JSON 模式<strong>不会</strong>在运行时进行验证。

:::: details 示例：使用 JSON 模式定义工具输入

```ts
const getWeather = tool(
  ({ city }) => `It's always sunny in ${city}!`,
  {
    name: "get_weather_for_location",
    description: "Get the weather for a given city",
    schema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city to get the weather for"
        }
      },
      required: ["city"]
    },
  }
);
```

::::

</Note>

</Step>

<Step title="配置模型 (Configure your model)">

根据您的用例，使用正确的参数设置您的[语言模型 (language model)](/oss/javascript/langchain/models)：

```ts
import { initChatModel } from "langchain";

const model = await initChatModel(
  "claude-sonnet-4-5-20250929",
  { temperature: 0.5, timeout: 10, maxTokens: 1000 }
);
```

根据所选模型和提供商的不同，初始化参数可能会有所不同；请参阅其参考页面以获取详细信息。

</Step>

<Step title="定义响应格式 (Define response format)">

可选地，如果您需要智能体的响应符合特定的模式，可以定义结构化响应格式。

```ts
const responseFormat = z.object({
  punny_response: z.string(),
  weather_conditions: z.string().optional(),
});
```

</Step>

<Step title="添加记忆 (Add memory)">

为您的智能体添加[记忆 (memory)](/oss/javascript/langchain/short-term-memory)，以在多次交互之间保持状态。这允许智能体记住之前的对话和上下文。

```ts
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();
```

<Info>

在生产环境中，请使用将数据保存到数据库的持久化检查点加载器。详见[添加和管理记忆](/oss/javascript/langgraph/add-memory#manage-short-term-memory)。

</Info>

</Step>

<Step title="创建并运行智能体 (Create and run the agent)">

现在，用所有的组件组装您的智能体并运行它！

```ts
import { createAgent } from "langchain";

const agent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  systemPrompt: systemPrompt,
  tools: [getUserLocation, getWeather],
  responseFormat,
  checkpointer,
});

// `thread_id` 是给定对话的唯一标识符。
const config = {
  configurable: { thread_id: "1" },
  context: { user_id: "1" },
};

const response = await agent.invoke(
  { messages: [{ role: "user", content: "what is the weather outside?" }] },
  config
);
console.log(response.structuredResponse);
// {
//   punny_response: "Florida is still having a 'sun-derful' day ...",
//   weather_conditions: "It's always sunny in Florida!"
// }

// 请注意，我们可以使用相同的 `thread_id` 继续对话。
const thankYouResponse = await agent.invoke(
  { messages: [{ role: "user", content: "thank you!" }] },
  config
);
console.log(thankYouResponse.structuredResponse);
// {
//   punny_response: "You're 'thund-erfully' welcome! ...",
//   weather_conditions: undefined
// }
```

</Step>

</Steps>

<Expandable title="完整示例代码 (Full example code)">

```ts
import { createAgent, tool, initChatModel, type ToolRuntime } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import * as z from "zod";

// 定义系统提示词
const systemPrompt = `You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location.`;

// 定义工具
const getWeather = tool(
  ({ city }) => `It's always sunny in ${city}!`,
  {
    name: "get_weather_for_location",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string(),
    }),
  }
);

type AgentRuntime = ToolRuntime<unknown, { user_id: string }>;

const getUserLocation = tool(
  (_, config: AgentRuntime) => {
    const { user_id } = config.context;
    return user_id === "1" ? "Florida" : "SF";
  },
  {
    name: "get_user_location",
    description: "Retrieve user information based on user ID",
    schema: z.object({}),
  }
);

// 配置模型
const model = await initChatModel(
  "claude-sonnet-4-5-20250929",
  { temperature: 0 }
);

// 定义响应格式
const responseFormat = z.object({
  punny_response: z.string(),
  weather_conditions: z.string().optional(),
});

// 设置记忆
const checkpointer = new MemorySaver();

// 创建智能体
const agent = createAgent({
  model,
  systemPrompt,
  responseFormat,
  checkpointer,
  tools: [getUserLocation, getWeather],
});

// 运行智能体
// `thread_id` 是给定对话的唯一标识符。
const config = {
  configurable: { thread_id: "1" },
  context: { user_id: "1" },
};

const response = await agent.invoke(
  { messages: [{ role: "user", content: "what is the weather outside?" }] },
  config
);
console.log(response.structuredResponse);

// 请注意，我们可以使用相同的 `thread_id` 继续对话。
const thankYouResponse = await agent.invoke(
  { messages: [{ role: "user", content: "thank you!" }] },
  config
);
console.log(thankYouResponse.structuredResponse);
```

</Expandable>

<Tip>

要了解如何使用 LangSmith 追踪您的智能体，请参阅 [LangSmith 文档](/langsmith/trace-with-langchain)。

</Tip>

恭喜！您现在拥有了一个 AI 智能体，它可以：

- **理解上下文**并记住对话
- **智能使用多种工具**
- **以一致的格式提供结构化响应**
- **通过上下文处理特定用户的信息**
- **在交互过程中维护对话状态**
