---
title: 快速入门 (Quickstart)
---

本快速入门演示了如何使用 LangGraph 的 Graph API 或 Functional API 构建一个计算器智能体。

- 如果您倾向于将智能体定义为节点和边的图，请[使用 Graph API](#use-the-graph-api)。
- 如果您倾向于将智能体定义为单个函数，请[使用 Functional API](#use-the-functional-api)。

有关概念性信息，请参阅 [Graph API 概述](/oss/javascript/langgraph/graph-api) 和 [Functional API 概述](/oss/javascript/langgraph/functional-api)。

<Info>

对于此示例，您需要设置一个 [Claude (Anthropic)](https://www.anthropic.com/) 账户并获取 API 密钥。然后，在您的终端中设置 `ANTHROPIC_API_KEY` 环境变量。

</Info>

<Tabs>

<Tab title="使用 Graph API (Use the Graph API)">

## 1. 定义工具和模型 (Define tools and model)

在此示例中，我们将使用 Claude Sonnet 4.5 模型，并定义用于加法、乘法和除法的工具。

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-5-20250929",
  temperature: 0,
});

// 定义工具
const add = tool(({ a, b }) => a + b, {
  name: "add",
  description: "Add two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const multiply = tool(({ a, b }) => a * b, {
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const divide = tool(({ a, b }) => a / b, {
  name: "divide",
  description: "Divide two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

// 为 LLM 绑定工具
const toolsByName = {
  [add.name]: add,
  [multiply.name]: multiply,
  [divide.name]: divide,
};
const tools = Object.values(toolsByName);
const modelWithTools = model.bindTools(tools);
```

## 2. 定义状态 (Define state)

图的状态用于存储消息和 LLM 调用次数。

<Tip>

LangGraph 中的状态在智能体执行期间持续存在。

`MessagesAnnotation` 常量包含一个用于追加消息的内置归约器。`llmCalls` 字段使用 `(x, y) => x + y` 来累加计数。

</Tip>

```typescript
import { StateGraph, START, END, MessagesAnnotation, Annotation } from "@langchain/langgraph";

const MessagesState = Annotation.Root({
  ...MessagesAnnotation.spec,
  llmCalls: Annotation<number>({
    reducer: (x, y) => x + y,
    default: () => 0,
  }),
});

// 提取状态类型用于函数签名
type MessagesStateType = typeof MessagesState.State;
```

## 3. 定义模型节点 (Define model node)

模型节点用于调用 LLM 并决定是否调用工具。

```typescript
import { SystemMessage } from "@langchain/core/messages";
async function llmCall(state: MessagesStateType) {
  return {
    messages: [await modelWithTools.invoke([
      new SystemMessage(
        "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
      ),
      ...state.messages,
    ])],
    llmCalls: 1,
  };
}
```

## 4. 定义工具节点 (Define tool node)

工具节点用于调用工具并返回结果。

```typescript
import { AIMessage, ToolMessage } from "@langchain/core/messages";
async function toolNode(state: MessagesStateType) {
  const lastMessage = state.messages.at(-1);

  if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
    return { messages: [] };
  }

  const result: ToolMessage[] = [];
  for (const toolCall of lastMessage.tool_calls ?? []) {
    const tool = toolsByName[toolCall.name];
    const observation = await tool.invoke(toolCall);
    result.push(observation);
  }

  return { messages: result };
}
```

## 5. 定义结束逻辑 (Define end logic)

条件边函数用于根据 LLM 是否进行了工具调用来路由到工具节点或结束。

```typescript
async function shouldContinue(state: MessagesStateType) {
  const lastMessage = state.messages.at(-1);

  // 在访问 tool_calls 之前检查它是否是 AIMessage
  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return END;
  }

  // 如果 LLM 进行了工具调用，则执行操作
  if (lastMessage.tool_calls?.length) {
    return "toolNode";
  }

  // 否则，我们停止（回复用户）
  return END;
}
```

## 6. 构建并编译智能体 (Build and compile the agent)

智能体使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 类构建，并使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html#compile" target="_blank" rel="noreferrer" class="link"><code>compile</code></a> 方法编译。

```typescript
const agent = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
  .addEdge("toolNode", "llmCall")
  .compile();

// 调用
import { HumanMessage } from "@langchain/core/messages";
const result = await agent.invoke({
  messages: [new HumanMessage("Add 3 and 4.")],
});

for (const message of result.messages) {
  console.log(`[${message.type}]: ${message.text}`);
}
```

<Tip>

要了解如何使用 LangSmith 追踪您的智能体，请参阅 [LangSmith 文档](/langsmith/trace-with-langgraph)。

</Tip>

恭喜！您已使用 LangGraph Graph API 构建了您的第一个智能体。

:::: details 完整代码示例 (Full code example)

```typescript
// 步骤 1: 定义工具和模型

import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-5-20250929",
  temperature: 0,
});

// 定义工具
const add = tool(({ a, b }) => a + b, {
  name: "add",
  description: "Add two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const multiply = tool(({ a, b }) => a * b, {
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const divide = tool(({ a, b }) => a / b, {
  name: "divide",
  description: "Divide two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

// 为 LLM 绑定工具
const toolsByName = {
  [add.name]: add,
  [multiply.name]: multiply,
  [divide.name]: divide,
};
const tools = Object.values(toolsByName);
const modelWithTools = model.bindTools(tools);

// 步骤 2: 定义状态

import { StateGraph, START, END, MessagesAnnotation, Annotation } from "@langchain/langgraph";

const MessagesState = Annotation.Root({
  ...MessagesAnnotation.spec,
  llmCalls: Annotation<number>({
    reducer: (x, y) => x + y,
    default: () => 0,
  }),
});

// 提取状态类型用于函数签名
type MessagesStateType = typeof MessagesState.State;

// 步骤 3: 定义模型节点

import { SystemMessage } from "@langchain/core/messages";

async function llmCall(state: MessagesStateType) {
  return {
    messages: [await modelWithTools.invoke([
      new SystemMessage(
        "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
      ),
      ...state.messages,
    ])],
    llmCalls: 1,
  };
}

// 步骤 4: 定义工具节点

import { AIMessage, ToolMessage } from "@langchain/core/messages";

async function toolNode(state: MessagesStateType) {
  const lastMessage = state.messages.at(-1);

  if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
    return { messages: [] };
  }

  const result: ToolMessage[] = [];
  for (const toolCall of lastMessage.tool_calls ?? []) {
    const tool = toolsByName[toolCall.name];
    const observation = await tool.invoke(toolCall);
    result.push(observation);
  }

  return { messages: result };
}

// 步骤 5: 定义决定是否结束的逻辑

async function shouldContinue(state: MessagesStateType) {
  const lastMessage = state.messages.at(-1);

  // 在访问 tool_calls 之前检查它是否是 AIMessage
  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return END;
  }

  // 如果 LLM 进行了工具调用，则执行操作
  if (lastMessage.tool_calls?.length) {
    return "toolNode";
  }

  // 否则，我们停止（回复用户）
  return END;
}

// 步骤 6: 构建并编译智能体

const agent = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
  .addEdge("toolNode", "llmCall")
  .compile();

// 调用
import { HumanMessage } from "@langchain/core/messages";
const result = await agent.invoke({
  messages: [new HumanMessage("Add 3 and 4.")],
});

for (const message of result.messages) {
  console.log(`[${message.type}]: ${message.text}`);
}
```

::::

</Tab>

<Tab title="使用 Functional API (Use the Functional API)">

## 1. 定义工具和模型 (Define tools and model)

在此示例中，我们将使用 Claude Sonnet 4.5 模型，并定义用于加法、乘法和除法的工具。

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-5-20250929",
  temperature: 0,
});

// 定义工具
const add = tool(({ a, b }) => a + b, {
  name: "add",
  description: "Add two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const multiply = tool(({ a, b }) => a * b, {
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const divide = tool(({ a, b }) => a / b, {
  name: "divide",
  description: "Divide two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

// 为 LLM 绑定工具
const toolsByName = {
  [add.name]: add,
  [multiply.name]: multiply,
  [divide.name]: divide,
};
const tools = Object.values(toolsByName);
const modelWithTools = model.bindTools(tools);
```

## 2. 定义模型节点 (Define model node)

模型节点用于调用 LLM 并决定是否调用工具。

```typescript
import { task, entrypoint } from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";
const callLlm = task({ name: "callLlm" }, async (messages: BaseMessage[]) => {
  return modelWithTools.invoke([
    new SystemMessage(
      "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
    ),
    ...messages,
  ]);
});
```

## 3. 定义工具节点 (Define tool node)

工具节点用于调用工具并返回结果。

```typescript
import type { ToolCall } from "@langchain/core/messages/tool";
const callTool = task({ name: "callTool" }, async (toolCall: ToolCall) => {
  const tool = toolsByName[toolCall.name];
  return tool.invoke(toolCall);
});
```

## 4. 定义智能体 (Define agent)

```typescript
import { addMessages } from "@langchain/langgraph";
import { type BaseMessage } from "@langchain/core/messages";

const agent = entrypoint({ name: "agent" }, async (messages: BaseMessage[]) => {
  let modelResponse = await callLlm(messages);

  while (true) {
    if (!modelResponse.tool_calls?.length) {
      break;
    }

    // 执行工具
    const toolResults = await Promise.all(
      modelResponse.tool_calls.map((toolCall) => callTool(toolCall))
    );
    messages = addMessages(messages, [modelResponse, ...toolResults]);
    modelResponse = await callLlm(messages);
  }

  return messages;
});

// 调用
import { HumanMessage } from "@langchain/core/messages";

const result = await agent.invoke([new HumanMessage("Add 3 and 4.")]);

for (const message of result) {
  console.log(`[${message.getType()}]: ${message.text}`);
}
```

<Tip>

要了解如何使用 LangSmith 追踪您的智能体，请参阅 [LangSmith 文档](/langsmith/trace-with-langgraph)。

</Tip>

恭喜！您已使用 LangGraph Functional API 构建了您的第一个智能体。

:::: details <Icon icon="code" style="margin-right: 8px; vertical-align: middle;" /> 完整代码示例 (Full code example)

```typescript
// 步骤 1: 定义工具和模型

import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-5-20250929",
  temperature: 0,
});

// 定义工具
const add = tool(({ a, b }) => a + b, {
  name: "add",
  description: "Add two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const multiply = tool(({ a, b }) => a * b, {
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const divide = tool(({ a, b }) => a / b, {
  name: "divide",
  description: "Divide two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

// 为 LLM 绑定工具
const toolsByName = {
  [add.name]: add,
  [multiply.name]: multiply,
  [divide.name]: divide,
};
const tools = Object.values(toolsByName);
const modelWithTools = model.bindTools(tools);

// 步骤 2: 定义模型节点

import { task, entrypoint } from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";
const callLlm = task({ name: "callLlm" }, async (messages: BaseMessage[]) => {
  return modelWithTools.invoke([
    new SystemMessage(
      "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
    ),
    ...messages,
  ]);
});

// 步骤 3: 定义工具节点

import type { ToolCall } from "@langchain/core/messages/tool";
const callTool = task({ name: "callTool" }, async (toolCall: ToolCall) => {
  const tool = toolsByName[toolCall.name];
  return tool.invoke(toolCall);
});

// 步骤 4: 定义智能体
import { addMessages } from "@langchain/langgraph";
import { type BaseMessage } from "@langchain/core/messages";
const agent = entrypoint({ name: "agent" }, async (messages: BaseMessage[]) => {
  let modelResponse = await callLlm(messages);

  while (true) {
    if (!modelResponse.tool_calls?.length) {
      break;
    }

    // 执行工具
    const toolResults = await Promise.all(
      modelResponse.tool_calls.map((toolCall) => callTool(toolCall))
    );
    messages = addMessages(messages, [modelResponse, ...toolResults]);
    modelResponse = await callLlm(messages);
  }

  return messages;
});

// 调用
import { HumanMessage } from "@langchain/core/messages";
const result = await agent.invoke([new HumanMessage("Add 3 and 4.")]);

for (const message of result) {
  console.log(`[${message.type}]: ${message.text}`);
}
```

::::

</Tab>

</Tabs>

