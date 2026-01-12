---
title: 使用图形 API
sidebarTitle: Use the graph API
---

本指南演示了 LangGraph Graph API 的基础知识。它将引导您了解[状态](#define-and-update-state)，以及构建常见的图结构，例如[序列](#create-a-sequence-of-steps)、[分支](#create-branches)和[循环](#create-and-control-loops)。它还涵盖了 LangGraph 的控制功能，包括用于 map-reduce 工作流的[Send API](#map-reduce-and-the-send-api)，以及用于将状态更新与跨节点"跳转"相结合的[Command API](#combine-control-flow-and-state-updates-with-command)。

## 设置

安装 `langgraph`：

```bash
npm install @langchain/langgraph
```

<Tip>

<strong>设置 LangSmith 以获得更好的调试体验</strong>

注册 [LangSmith](https://smith.langchain.com) 以快速发现问题并提升 LangGraph 项目的性能。LangSmith 允许您使用追踪数据来调试、测试和监控使用 LangGraph 构建的 LLM 应用——更多关于如何开始的信息，请参阅[文档](/langsmith/observability)。

</Tip>

## 定义和更新状态

这里我们将展示如何在 LangGraph 中定义和更新[状态](/oss/javascript/langgraph/graph-api#state)。我们将演示：

1. 如何使用状态定义图的[模式](/oss/javascript/langgraph/graph-api#schema)
2. 如何使用[归约器](/oss/javascript/langgraph/graph-api#reducers)来控制状态更新的处理方式。

### 定义状态

LangGraph 中的[状态](/oss/javascript/langgraph/graph-api#state)可以使用 Zod 模式定义。下面我们将使用 Zod。有关使用替代方法的详细信息，请参阅[此部分](#alternative-state-definitions)。

默认情况下，图将具有相同的输入和输出模式，状态决定了该模式。有关如何定义不同的输入和输出模式，请参阅[此部分](#define-input-and-output-schemas)。

让我们考虑一个使用[消息](/oss/javascript/langgraph/graph-api#messagesstate)的简单示例。这代表了许多 LLM 应用状态的通用表示形式。更多细节请参阅我们的[概念页面](/oss/javascript/langgraph/graph-api#working-with-messages-in-graph-state)。

```typescript
import { BaseMessage } from "@langchain/core/messages";
import { MessagesZodMeta } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const State = z.object({
  messages: z.array(z.custom<BaseMessage>()).register(registry, MessagesZodMeta),
  extraField: z.number(),
});
```

此状态跟踪一个[消息](https://js.langchain.com/docs/concepts/messages/)对象列表，以及一个额外的整数字段。

### 更新状态

让我们构建一个包含单个节点的示例图。我们的[节点](/oss/javascript/langgraph/graph-api#nodes)只是一个 TypeScript 函数，它读取图的状态并对其进行更新。此函数的第一个参数始终是状态：

```typescript
import { AIMessage } from "@langchain/core/messages";

const node = (state: z.infer<typeof State>) => {
  const messages = state.messages;
  const newMessage = new AIMessage("Hello!");
  return { messages: messages.concat([newMessage]), extraField: 10 };
};
```

此节点只是将一条消息附加到我们的消息列表，并填充一个额外的字段。

<Warning>

节点应直接返回对状态的更新，而不是改变状态。

</Warning>

接下来让我们定义一个包含此节点的简单图。我们使用 [`StateGraph`](/oss/javascript/langgraph/graph-api#stategraph) 来定义一个在此状态上操作的图。然后我们使用 [`addNode`](/oss/javascript/langgraph/graph-api#nodes) 来填充我们的图。

```typescript
import { StateGraph } from "@langchain/langgraph";

const graph = new StateGraph(State)
  .addNode("node", node)
  .addEdge("__start__", "node")
  .compile();
```

LangGraph 提供了内置工具来可视化您的图。让我们检查一下我们的图。有关可视化的详细信息，请参阅[此部分](#visualize-your-graph)。

```typescript
import * as fs from "node:fs/promises";

const drawableGraph = await graph.getGraphAsync();
const image = await drawableGraph.drawMermaidPng();
const imageBuffer = new Uint8Array(await image.arrayBuffer());

await fs.writeFile("graph.png", imageBuffer);
```

在这种情况下，我们的图只执行单个节点。让我们继续一个简单的调用：

```typescript
import { HumanMessage } from "@langchain/core/messages";

const result = await graph.invoke({ messages: [new HumanMessage("Hi")], extraField: 0 });
console.log(result);
```

```
{ messages: [HumanMessage { content: 'Hi' }, AIMessage { content: 'Hello!' }], extraField: 10 }
```

请注意：

* 我们通过更新状态的单个键来启动调用。
* 我们在调用结果中接收到完整的状态。

为了方便起见，我们经常通过日志记录来检查[消息对象](https://js.langchain.com/docs/concepts/messages/)的内容：

```typescript
for (const message of result.messages) {
  console.log(`${message.getType()}: ${message.content}`);
}
```

```
human: Hi
ai: Hello!
```

### 使用归约器处理状态更新

状态中的每个键都可以有自己的独立[归约器](/oss/javascript/langgraph/graph-api#reducers)函数，它控制如何应用来自节点的更新。如果没有明确指定归约器函数，则假定对该键的所有更新都应覆盖它。

对于 Zod 状态模式，我们可以通过在模式字段上使用特殊的 `.langgraph.reducer()` 方法来定义归约器。

在前面的示例中，我们的节点通过向其附加一条消息来更新状态中的 `"messages"` 键。下面，我们为此键添加一个归约器，以便自动附加更新：

```typescript
import "@langchain/langgraph/zod";

const State = z.object({
  messages: z.array(z.custom<BaseMessage>()).langgraph.reducer((x, y) => x.concat(y)),  // [!code highlight]
  extraField: z.number(),
});
```

现在我们的节点可以简化：

```typescript
const node = (state: z.infer<typeof State>) => {
  const newMessage = new AIMessage("Hello!");
  return { messages: [newMessage], extraField: 10 };  // [!code highlight]
};
```

```typescript
import { START } from "@langchain/langgraph";

const graph = new StateGraph(State)
  .addNode("node", node)
  .addEdge(START, "node")
  .compile();

const result = await graph.invoke({ messages: [new HumanMessage("Hi")] });

for (const message of result.messages) {
  console.log(`${message.getType()}: ${message.content}`);
}
```

```
human: Hi
ai: Hello!
```

#### MessagesState

实际上，更新消息列表还有其他考虑因素：

* 我们可能希望更新状态中的现有消息。
* 我们可能希望接受[消息格式](/oss/javascript/langgraph/graph-api#using-messages-in-your-graph)的简写，例如 [OpenAI 格式](https://python.langchain.com/docs/concepts/messages/#openai-format)。

LangGraph 包含一个内置的 `MessagesZodMeta` 来处理这些考虑因素：

```typescript
import { MessagesZodMeta } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const State = z.object({  // [!code highlight]
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
  extraField: z.number(),
});

const graph = new StateGraph(State)
  .addNode("node", (state) => {
    const newMessage = new AIMessage("Hello!");
    return { messages: [newMessage], extraField: 10 };
  })
  .addEdge(START, "node")
  .compile();
```

```typescript
const inputMessage = { role: "user", content: "Hi" };  // [!code highlight]

const result = await graph.invoke({ messages: [inputMessage] });

for (const message of result.messages) {
  console.log(`${message.getType()}: ${message.content}`);
}
```

```
human: Hi
ai: Hello!
```

这是涉及[聊天模型](https://js.langchain.com/docs/concepts/chat_models/)的应用状态的通用表示形式。LangGraph 包含这个预构建的 `MessagesZodMeta` 以方便使用，这样我们就可以有：

```typescript
import { MessagesZodMeta } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const State = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
  extraField: z.number(),
});
```

### 定义输入和输出模式

默认情况下，`StateGraph` 使用单一模式操作，所有节点都期望使用该模式进行通信。但是，也可以为图定义不同的输入和输出模式。

当指定了不同的模式时，节点之间的通信仍将使用内部模式。输入模式确保提供的输入符合预期结构，而输出模式则根据定义的输出模式过滤内部数据，仅返回相关信息。

下面，我们将看到如何定义不同的输入和输出模式。

```typescript
import { StateGraph, START, END } from "@langchain/langgraph";
import * as z from "zod";

// Define the schema for the input
const InputState = z.object({
  question: z.string(),
});

// Define the schema for the output
const OutputState = z.object({
  answer: z.string(),
});

// Define the overall schema, combining both input and output
const OverallState = InputState.merge(OutputState);

// Build the graph with input and output schemas specified
const graph = new StateGraph({
  input: InputState,
  output: OutputState,
  state: OverallState,
})
  .addNode("answerNode", (state) => {
    // Example answer and an extra key
    return { answer: "bye", question: state.question };
  })
  .addEdge(START, "answerNode")
  .addEdge("answerNode", END)
  .compile();

// Invoke the graph with an input and print the result
console.log(await graph.invoke({ question: "hi" }));
```

```
{ answer: 'bye' }
```

请注意，invoke 的输出仅包含输出模式。

### 在节点之间传递私有状态

在某些情况下，您可能希望节点交换对中间逻辑至关重要但不需要成为图主模式一部分的信息。这些私有数据与图的整体输入/输出无关，应仅在特定节点之间共享。

下面，我们将创建一个由三个节点（node_1、node_2 和 node_3）组成的示例顺序图，其中私有数据在前两个步骤（node_1 和 node_2）之间传递，而第三个步骤（node_3）只能访问公共的整体状态。

```typescript
import { StateGraph, START, END } from "@langchain/langgraph";
import * as z from "zod";

// The overall state of the graph (this is the public state shared across nodes)
const OverallState = z.object({
  a: z.string(),
});

// Output from node1 contains private data that is not part of the overall state
const Node1Output = z.object({
  privateData: z.string(),
});

// The private data is only shared between node1 and node2
const node1 = (state: z.infer<typeof OverallState>): z.infer<typeof Node1Output> => {
  const output = { privateData: "set by node1" };
  console.log(`Entered node 'node1':\n\tInput: ${JSON.stringify(state)}.\n\tReturned: ${JSON.stringify(output)}`);
  return output;
};

// Node 2 input only requests the private data available after node1
const Node2Input = z.object({
  privateData: z.string(),
});

const node2 = (state: z.infer<typeof Node2Input>): z.infer<typeof OverallState> => {
  const output = { a: "set by node2" };
  console.log(`Entered node 'node2':\n\tInput: ${JSON.stringify(state)}.\n\tReturned: ${JSON.stringify(output)}`);
  return output;
};

// Node 3 only has access to the overall state (no access to private data from node1)
const node3 = (state: z.infer<typeof OverallState>): z.infer<typeof OverallState> => {
  const output = { a: "set by node3" };
  console.log(`Entered node 'node3':\n\tInput: ${JSON.stringify(state)}.\n\tReturned: ${JSON.stringify(output)}`);
  return output;
};

// Connect nodes in a sequence
// node2 accepts private data from node1, whereas
// node3 does not see the private data.
const graph = new StateGraph(OverallState)
  .addNode("node1", node1)
  .addNode("node2", node2, { input: Node2Input })
  .addNode("node3", node3)
  .addEdge(START, "node1")
  .addEdge("node1", "node2")
  .addEdge("node2", "node3")
  .addEdge("node3", END)
  .compile();

// Invoke the graph with the initial state
const response = await graph.invoke({ a: "set at start" });

console.log(`\nOutput of graph invocation: ${JSON.stringify(response)}`);
```

```
Entered node 'node1':
	Input: {"a":"set at start"}.
	Returned: {"privateData":"set by node1"}
Entered node 'node2':
	Input: {"privateData":"set by node1"}.
	Returned: {"a":"set by node2"}
Entered node 'node3':
	Input: {"a":"set by node2"}.
	Returned: {"a":"set by node3"}

Output of graph invocation: {"a":"set by node3"}
```

### 替代状态定义

虽然 Zod 模式是推荐的方法，但 LangGraph 也支持其他定义状态模式的方式：

```typescript
import { BaseMessage } from "@langchain/core/messages";
import { StateGraph } from "@langchain/langgraph";

interface WorkflowChannelsState {
  messages: BaseMessage[];
  question: string;
  answer: string;
}

const workflowWithChannels = new StateGraph<WorkflowChannelsState>({
  channels: {
    messages: {
      reducer: (currentState, updateValue) => currentState.concat(updateValue),
      default: () => [],
    },
    question: null,
    answer: null,
  },
});
```

## 添加运行时配置

有时您希望在调用图时能够配置它。例如，您可能希望在运行时指定使用哪个 LLM 或系统提示，_而不让这些参数污染图状态_。

要添加运行时配置：

1. 为您的配置指定一个模式
2. 将配置添加到节点或条件边的函数签名中
3. 将配置传递到图中。

请参见下面的简单示例：

```typescript
import { StateGraph, END, START } from "@langchain/langgraph";
import * as z from "zod";

// 1. Specify config schema
const ContextSchema = z.object({
  myRuntimeValue: z.string(),
});

// 2. Define a graph that accesses the config in a node
const StateSchema = z.object({
  myStateValue: z.number(),
});

const graph = new StateGraph(StateSchema, ContextSchema)
  .addNode("node", (state, runtime) => {
    if (runtime?.context?.myRuntimeValue === "a") {  // [!code highlight]
      return { myStateValue: 1 };
    } else if (runtime?.context?.myRuntimeValue === "b") {  // [!code highlight]
      return { myStateValue: 2 };
    } else {
      throw new Error("Unknown values.");
    }
  })
  .addEdge(START, "node")
  .addEdge("node", END)
  .compile();

// 3. Pass in configuration at runtime:
console.log(await graph.invoke({}, { context: { myRuntimeValue: "a" } }));  // [!code highlight]
console.log(await graph.invoke({}, { context: { myRuntimeValue: "b" } }));  // [!code highlight]
```

```
{ myStateValue: 1 }
{ myStateValue: 2 }
```

:::: details 扩展示例：在运行时指定 LLM

下面我们演示一个实际示例，其中我们在运行时配置使用哪个 LLM。我们将同时使用 OpenAI 和 Anthropic 模型。

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseMessage } from "@langchain/core/messages";
import { MessagesZodMeta, StateGraph, START, END } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import { RunnableConfig } from "@langchain/core/runnables";
import * as z from "zod";

const ConfigSchema = z.object({
  modelProvider: z.string().default("anthropic"),
});

const MessagesZodState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

const MODELS = {
  anthropic: new ChatAnthropic({ model: "claude-haiku-4-5-20251001" }),
  openai: new ChatOpenAI({ model: "gpt-4o-mini" }),
};

const graph = new StateGraph(MessagesZodState, ConfigSchema)
  .addNode("model", async (state, config) => {
    const modelProvider = config?.configurable?.modelProvider || "anthropic";
    const model = MODELS[modelProvider as keyof typeof MODELS];
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  })
  .addEdge(START, "model")
  .addEdge("model", END)
  .compile();

// Usage
const inputMessage = { role: "user", content: "hi" };
// With no configuration, uses default (Anthropic)
const response1 = await graph.invoke({ messages: [inputMessage] });
// Or, can set OpenAI
const response2 = await graph.invoke(
  { messages: [inputMessage] },
  { configurable: { modelProvider: "openai" } },
);

console.log(response1.messages.at(-1)?.response_metadata?.model);
console.log(response2.messages.at(-1)?.response_metadata?.model);
```

```
claude-haiku-4-5-20251001
gpt-4o-mini-2024-07-18
```

::::

:::: details 扩展示例：在运行时指定模型和系统消息

下面我们演示一个实际示例，其中我们在运行时配置两个参数：要使用的 LLM 和系统消息。

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { SystemMessage, BaseMessage } from "@langchain/core/messages";
import { MessagesZodMeta, StateGraph, START, END } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const ConfigSchema = z.object({
  modelProvider: z.string().default("anthropic"),
  systemMessage: z.string().optional(),
});

const MessagesZodState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

const MODELS = {
  anthropic: new ChatAnthropic({ model: "claude-haiku-4-5-20251001" }),
  openai: new ChatOpenAI({ model: "gpt-4o-mini" }),
};

const graph = new StateGraph(MessagesZodState, ConfigSchema)
  .addNode("model", async (state, config) => {
    const modelProvider = config?.configurable?.modelProvider || "anthropic";
    const systemMessage = config?.configurable?.systemMessage;

    const model = MODELS[modelProvider as keyof typeof MODELS];
    let messages = state.messages;

    if (systemMessage) {
      messages = [new SystemMessage(systemMessage), ...messages];
    }

    const response = await model.invoke(messages);
    return { messages: [response] };
  })
  .addEdge(START, "model")
  .addEdge("model", END)
  .compile();

// Usage
const inputMessage = { role: "user", content: "hi" };
const response = await graph.invoke(
  { messages: [inputMessage] },
  {
    configurable: {
      modelProvider: "openai",
      systemMessage: "Respond in Italian."
    }
  }
);

for (const message of response.messages) {
  console.log(`${message.getType()}: ${message.content}`);
}
```

```
human: hi
ai: Ciao! Come posso aiutarti oggi?
```

::::

## 添加重试策略

在许多用例中，您可能希望节点具有自定义的重试策略，例如，如果您正在调用 API、查询数据库或调用 LLM 等。LangGraph 允许您向节点添加重试策略。

要配置重试策略，请将 `retryPolicy` 参数传递给 [`addNode`](https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Graph.html#addnode)。`retryPolicy` 参数接受一个 `RetryPolicy` 对象。下面我们使用默认参数实例化一个 `RetryPolicy` 对象并将其与一个节点关联：

```typescript
import { RetryPolicy } from "@langchain/langgraph";

const graph = new StateGraph(State)
  .addNode("nodeName", nodeFunction, { retryPolicy: {} })
  .compile();
```

默认情况下，重试策略会对任何异常进行重试，但以下异常除外：

* `TypeError`
* `SyntaxError`
* `ReferenceError`

:::: details 扩展示例：自定义重试策略

考虑一个我们从 SQL 数据库读取数据的示例。下面我们向节点传递两种不同的重试策略：

```typescript
import Database from "better-sqlite3";
import { ChatAnthropic } from "@langchain/anthropic";
import { StateGraph, START, END, MessagesZodMeta } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import * as z from "zod";

const MessagesZodState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

// Create an in-memory database
const db: typeof Database.prototype = new Database(":memory:");

const model = new ChatAnthropic({ model: "claude-3-5-sonnet-20240620" });

const callModel = async (state: z.infer<typeof MessagesZodState>) => {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};

const queryDatabase = async (state: z.infer<typeof MessagesZodState>) => {
  const queryResult: string = JSON.stringify(
    db.prepare("SELECT * FROM Artist LIMIT 10;").all(),
  );

  return { messages: [new AIMessage({ content: "queryResult" })] };
};

const workflow = new StateGraph(MessagesZodState)
  // Define the two nodes we will cycle between
  .addNode("call_model", callModel, { retryPolicy: { maxAttempts: 5 } })
  .addNode("query_database", queryDatabase, {
    retryPolicy: {
      retryOn: (e: any): boolean => {
        if (e instanceof Database.SqliteError) {
          // Retry on "SQLITE_BUSY" error
          return e.code === "SQLITE_BUSY";
        }
        return false; // Don't retry on other errors
      },
    },
  })
  .addEdge(START, "call_model")
  .addEdge("call_model", "query_database")
  .addEdge("query_database", END);

const graph = workflow.compile();
```

::::

## 创建步骤序列

<Info>

<strong>先决条件</strong>
本指南假设您熟悉上面关于[状态](#define-and-update-state)的部分。

</Info>

这里我们将演示如何构建一个简单的步骤序列。我们将展示：

1. 如何构建一个顺序图
2. 用于构建类似图的内置简写。

要添加节点序列，我们使用图的 `.addNode` 和 `.addEdge` 方法：

```typescript
import { START, StateGraph } from "@langchain/langgraph";

const builder = new StateGraph(State)
  .addNode("step1", step1)
  .addNode("step2", step2)
  .addNode("step3", step3)
  .addEdge(START, "step1")
  .addEdge("step1", "step2")
  .addEdge("step2", "step3");
```

:::: details 为什么使用 LangGraph 将应用程序步骤拆分为序列？

LangGraph 使得为您的应用程序添加底层持久层变得容易。
这允许在节点执行之间对状态进行检查点保存，因此您的 LangGraph 节点控制着：

* 状态更新如何[检查点保存](/oss/javascript/langgraph/persistence)
* 在[人机交互](/oss/javascript/langgraph/interrupts)工作流中如何恢复中断
* 如何使用 LangGraph 的[时间旅行](/oss/javascript/langgraph/use-time-travel)功能"回滚"和分支执行

它们还决定了执行步骤如何[流式传输](/oss/javascript/langgraph/streaming)，以及如何使用 [Studio](/langsmith/studio) 可视化和调试您的应用程序。

让我们演示一个端到端的示例。我们将创建一个包含三个步骤的序列：

1. 在状态的键中填充一个值
2. 更新相同的值
3. 填充一个不同的值

首先定义我们的[状态](/oss/javascript/langgraph/graph-api#state)。这控制着[图的模式](/oss/javascript/langgraph/graph-api#schema)，并且还可以指定如何应用更新。更多细节请参见[本节](#process-state-updates-with-reducers)。

在我们的例子中，我们将只跟踪两个值：

```typescript
import * as z from "zod";

const State = z.object({
  value1: z.string(),
  value2: z.number(),
});
```

我们的[节点](/oss/javascript/langgraph/graph-api#nodes)只是读取图状态并对其进行更新的 TypeScript 函数。该函数的第一个参数始终是状态：

```typescript
const step1 = (state: z.infer<typeof State>) => {
  return { value1: "a" };
};

const step2 = (state: z.infer<typeof State>) => {
  const currentValue1 = state.value1;
  return { value1: `${currentValue1} b` };
};

const step3 = (state: z.infer<typeof State>) => {
  return { value2: 10 };
};
```

<Note>

请注意，当向状态发出更新时，每个节点只需指定它希望更新的键的值。

默认情况下，这将<strong>覆盖</strong>相应键的值。您也可以使用[归约器](/oss/javascript/langgraph/graph-api#reducers)来控制如何处理更新——例如，您可以向键追加连续的更新而不是覆盖。更多细节请参见[本节](#process-state-updates-with-reducers)。

</Note>

最后，我们定义图。我们使用 [StateGraph](/oss/javascript/langgraph/graph-api#stategraph) 来定义一个在此状态上操作的图。

然后我们将使用 [addNode](/oss/javascript/langgraph/graph-api#nodes) 和 [addEdge](/oss/javascript/langgraph/graph-api#edges) 来填充我们的图并定义其控制流。

```typescript
import { START, StateGraph } from "@langchain/langgraph";

const graph = new StateGraph(State)
  .addNode("step1", step1)
  .addNode("step2", step2)
  .addNode("step3", step3)
  .addEdge(START, "step1")
  .addEdge("step1", "step2")
  .addEdge("step2", "step3")
  .compile();
```

<Tip>

<strong>指定自定义名称</strong>
您可以使用 `.addNode` 为节点指定自定义名称：

```typescript
const graph = new StateGraph(State)
.addNode("myNode", step1)
.compile();
```

</Tip>

请注意：

* `.addEdge` 接受节点名称，对于函数，默认使用 `node.name`。
* 我们必须指定图的入口点。为此，我们添加一条与 [START 节点](/oss/javascript/langgraph/graph-api#start-node) 的边。
* 当没有更多节点要执行时，图停止。

接下来我们[编译](/oss/javascript/langgraph/graph-api#compiling-your-graph)我们的图。这提供了对图结构的一些基本检查（例如，识别孤立节点）。如果我们通过[检查点保存器](/oss/javascript/langgraph/persistence)向应用程序添加持久性，它也会在这里传递。

LangGraph 提供了内置工具来可视化您的图。让我们检查我们的序列。有关可视化的详细信息，请参见[本指南](#visualize-your-graph)。

```typescript
import * as fs from "node:fs/promises";

const drawableGraph = await graph.getGraphAsync();
const image = await drawableGraph.drawMermaidPng();
const imageBuffer = new Uint8Array(await image.arrayBuffer());

await fs.writeFile("graph.png", imageBuffer);
```

让我们进行一个简单的调用：

```typescript
const result = await graph.invoke({ value1: "c" });
console.log(result);
```

```
{ value1: 'a b', value2: 10 }
```

请注意：

* 我们通过为单个状态键提供一个值来启动调用。我们必须始终为至少一个键提供一个值。
* 我们传入的值被第一个节点覆盖。
* 第二个节点更新了该值。
* 第三个节点填充了一个不同的值。

::::

## 创建分支

节点的并行执行对于加速整体图操作至关重要。LangGraph 原生支持节点的并行执行，可以显著提高基于图的工作流的性能。这种并行化是通过扇出和扇入机制实现的，利用标准边和 [conditional_edges](https://langchain-ai.github.io/langgraph/reference/graphs.md#langgraph.graph.MessageGraph.add_conditional_edges)。以下是一些示例，展示了如何添加创建适用于您的分支数据流。

### 并行运行图节点

在这个示例中，我们从 `Node A` 扇出到 `B 和 C`，然后扇入到 `D`。对于我们的状态，[我们指定归约器 add 操作](/oss/javascript/langgraph/graph-api#reducers)。这将组合或累积状态中特定键的值，而不是简单地覆盖现有值。对于列表，这意味着将新列表与现有列表连接起来。有关使用归约器更新状态的更多详细信息，请参见上面关于[状态归约器](#process-state-updates-with-reducers)的部分。

```typescript
import { StateGraph, START, END } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const State = z.object({
  // The reducer makes this append-only
  aggregate: z.array(z.string()).register(registry, {
    reducer: {
      fn: (x, y) => x.concat(y),
    },
    default: () => [] as string[],
  }),
});

const nodeA = (state: z.infer<typeof State>) => {
  console.log(`Adding "A" to ${state.aggregate}`);
  return { aggregate: ["A"] };
};

const nodeB = (state: z.infer<typeof State>) => {
  console.log(`Adding "B" to ${state.aggregate}`);
  return { aggregate: ["B"] };
};

const nodeC = (state: z.infer<typeof State>) => {
  console.log(`Adding "C" to ${state.aggregate}`);
  return { aggregate: ["C"] };
};

const nodeD = (state: z.infer<typeof State>) => {
  console.log(`Adding "D" to ${state.aggregate}`);
  return { aggregate: ["D"] };
};

const graph = new StateGraph(State)
  .addNode("a", nodeA)
  .addNode("b", nodeB)
  .addNode("c", nodeC)
  .addNode("d", nodeD)
  .addEdge(START, "a")
  .addEdge("a", "b")
  .addEdge("a", "c")
  .addEdge("b", "d")
  .addEdge("c", "d")
  .addEdge("d", END)
  .compile();
```

```typescript
import * as fs from "node:fs/promises";

const drawableGraph = await graph.getGraphAsync();
const image = await drawableGraph.drawMermaidPng();
const imageBuffer = new Uint8Array(await image.arrayBuffer());

await fs.writeFile("graph.png", imageBuffer);
```

使用归约器，您可以看到每个节点中添加的值都被累积了。

```typescript
const result = await graph.invoke({
  aggregate: [],
});
console.log(result);
```

```
Adding "A" to []
Adding "B" to ['A']
Adding "C" to ['A']
Adding "D" to ['A', 'B', 'C']
{ aggregate: ['A', 'B', 'C', 'D'] }
```

<Note>

在上面的示例中，节点 `"b"` 和 `"c"` 在同一个[超步](/oss/javascript/langgraph/graph-api#graphs)中并发执行。因为它们在同一个步骤中，节点 `"d"` 在 `"b"` 和 `"c"` 都完成后执行。

重要的是，来自并行超步的更新可能不会保持一致的顺序。如果您需要并行超步的更新具有一致的、预定的顺序，您应该将输出写入状态中的一个单独字段，并附带一个用于排序的值。

</Note>

:::: details 异常处理？

LangGraph 在[超步](/oss/javascript/langgraph/graph-api#graphs)内执行节点，这意味着虽然并行分支是并行执行的，但整个超步是<strong>事务性的</strong>。如果这些分支中的任何一个引发异常，<strong>所有</strong>更新都不会应用到状态（整个超步出错）。

重要的是，当使用[检查点保存器](/oss/javascript/langgraph/persistence)时，超步内成功节点的结果会被保存，并且在恢复时不会重复。

如果您有容易出错的节点（可能希望处理不稳定的 API 调用），LangGraph 提供了两种方法来解决这个问题：

1. 您可以在节点内编写常规的 python 代码来捕获和处理异常。
2. 您可以设置一个 <strong>[retry_policy](https://langchain-ai.github.io/langgraph/reference/types/#langgraph.types.RetryPolicy)</strong> 来指示图重试引发某些类型异常的节点。只有失败的分支会被重试，因此您无需担心执行冗余工作。

总之，这些让您可以执行并行执行并完全控制异常处理。

::::

<Tip>

<strong>设置最大并发数</strong>
您可以通过在调用图时在[配置](https://reference.langchain.com/javascript/interfaces/_langchain_langgraph.index.LangGraphRunnableConfig.html)中设置 `max_concurrency` 来控制最大并发任务数。

```typescript
const result = await graph.invoke({ value1: "c" }, {configurable: {max_concurrency: 10}});
```

</Tip>

### 条件分支

如果您的扇出应在运行时根据状态而变化，您可以使用 [`addConditionalEdges`](https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html#addconditionaledges) 来选择一条或多条路径。请参见下面的示例，其中节点 `a` 生成一个状态更新，该更新决定了下一个节点。

```typescript
import { StateGraph, START, END } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const State = z.object({
  aggregate: z.array(z.string()).register(registry, {
    reducer: {
      fn: (x, y) => x.concat(y),
    },
    default: () => [] as string[],
  }),
  // Add a key to the state. We will set this key to determine
  // how we branch.
  which: z.string().register(registry, {  // [!code highlight]
    reducer: {
      fn: (x, y) => y ?? x,
    },
  }),
});

const nodeA = (state: z.infer<typeof State>) => {
  console.log(`Adding "A" to ${state.aggregate}`);
  return { aggregate: ["A"], which: "c" };
};

const nodeB = (state: z.infer<typeof State>) => {
  console.log(`Adding "B" to ${state.aggregate}`);
  return { aggregate: ["B"] };
};

const nodeC = (state: z.infer<typeof State>) => {
  console.log(`Adding "C" to ${state.aggregate}`);
  return { aggregate: ["C"] };  // [!code highlight]
};

const conditionalEdge = (state: z.infer<typeof State>): "b" | "c" => {
  // Fill in arbitrary logic here that uses the state
  // to determine the next node
  return state.which as "b" | "c";
};

const graph = new StateGraph(State)
  .addNode("a", nodeA)
  .addNode("b", nodeB)
  .addNode("c", nodeC)
  .addEdge(START, "a")
  .addEdge("b", END)
  .addEdge("c", END)
  .addConditionalEdges("a", conditionalEdge)
  .compile();
```

```typescript
import * as fs from "node:fs/promises";

const drawableGraph = await graph.getGraphAsync();
const image = await drawableGraph.drawMermaidPng();
const imageBuffer = new Uint8Array(await image.arrayBuffer());

await fs.writeFile("graph.png", imageBuffer);
```

```typescript
const result = await graph.invoke({ aggregate: [] });
console.log(result);
```

```
Adding "A" to []
Adding "C" to ['A']
{ aggregate: ['A', 'C'], which: 'c' }
```

<Tip>

您的条件边可以路由到多个目标节点。例如：

```typescript
const routeBcOrCd = (state: z.infer<typeof State>): string[] => {
if (state.which === "cd") {
return ["c", "d"];
}
return ["b", "c"];
};
```

</Tip>

## Map-Reduce 和 Send API

LangGraph 使用 Send API 支持 map-reduce 和其他高级分支模式。以下是如何使用它的示例：

```typescript
import { StateGraph, START, END, Send } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const OverallState = z.object({
  topic: z.string(),
  subjects: z.array(z.string()),
  jokes: z.array(z.string()).register(registry, {
    reducer: {
      fn: (x, y) => x.concat(y),
    },
  }),
  bestSelectedJoke: z.string(),
});

const generateTopics = (state: z.infer<typeof OverallState>) => {
  return { subjects: ["lions", "elephants", "penguins"] };
};

const generateJoke = (state: { subject: string }) => {
  const jokeMap: Record<string, string> = {
    lions: "Why don't lions like fast food? Because they can't catch it!",
    elephants: "Why don't elephants use computers? They're afraid of the mouse!",
    penguins: "Why don't penguins like talking to strangers at parties? Because they find it hard to break the ice."
  };
  return { jokes: [jokeMap[state.subject]] };
};

const continueToJokes = (state: z.infer<typeof OverallState>) => {
  return state.subjects.map((subject) => new Send("generateJoke", { subject }));
};

const bestJoke = (state: z.infer<typeof OverallState>) => {
  return { bestSelectedJoke: "penguins" };
};

const graph = new StateGraph(OverallState)
  .addNode("generateTopics", generateTopics)
  .addNode("generateJoke", generateJoke)
  .addNode("bestJoke", bestJoke)
  .addEdge(START, "generateTopics")
  .addConditionalEdges("generateTopics", continueToJokes)
  .addEdge("generateJoke", "bestJoke")
  .addEdge("bestJoke", END)
  .compile();
```

```typescript
import * as fs from "node:fs/promises";

const drawableGraph = await graph.getGraphAsync();
const image = await drawableGraph.drawMermaidPng();
const imageBuffer = new Uint8Array(await image.arrayBuffer());

await fs.writeFile("graph.png", imageBuffer);
```

```typescript
// Call the graph: here we call it to generate a list of jokes
for await (const step of await graph.stream({ topic: "animals" })) {
  console.log(step);
}
```

```
{ generateTopics: { subjects: [ 'lions', 'elephants', 'penguins' ] } }
{ generateJoke: { jokes: [ "Why don't lions like fast food? Because they can't catch it!" ] } }
{ generateJoke: { jokes: [ "Why don't elephants use computers? They're afraid of the mouse!" ] } }
{ generateJoke: { jokes: [ "Why don't penguins like talking to strangers at parties? Because they find it hard to break the ice." ] } }
{ bestJoke: { bestSelectedJoke: 'penguins' } }
```

## 创建和控制循环

当创建带有循环的图时，我们需要一种终止执行的机制。这通常通过添加一个[条件边](/oss/javascript/langgraph/graph-api#conditional-edges)来实现，该边在达到某个终止条件时路由到 [END](/oss/javascript/langgraph/graph-api#end-node) 节点。

您还可以在调用或流式传输图时设置图递归限制。递归限制设置了图在执行引发错误之前允许执行的[超步](/oss/javascript/langgraph/graph-api#graphs)数。有关递归限制概念的更多信息，请参见[此处](/oss/javascript/langgraph/graph-api#recursion-limit)。

让我们考虑一个带有循环的简单图，以更好地理解这些机制的工作原理。

<Tip>

要返回状态的最后一个值而不是收到递归限制错误，请参见[下一节](#impose-a-recursion-limit)。

</Tip>

创建循环时，可以包含一个指定终止条件的条件边：

```typescript
const graph = new StateGraph(State)
  .addNode("a", nodeA)
  .addNode("b", nodeB)
  .addEdge(START, "a")
  .addConditionalEdges("a", route)
  .addEdge("b", "a")
  .compile();

const route = (state: z.infer<typeof State>): "b" | typeof END => {
  if (terminationCondition(state)) {
    return END;
  } else {
    return "b";
  }
};
```

要控制递归限制，请在配置中指定 `"recursionLimit"`。这将引发一个 `GraphRecursionError`，您可以捕获并处理它：

```typescript
import { GraphRecursionError } from "@langchain/langgraph";

try {
  await graph.invoke(inputs, { recursionLimit: 3 });
} catch (error) {
  if (error instanceof GraphRecursionError) {
    console.log("Recursion Error");
  }
}
```

让我们定义一个带有简单循环的图。注意，我们使用条件边来实现终止条件。

```typescript
import { StateGraph, START, END } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const State = z.object({
  // The reducer makes this append-only
  aggregate: z.array(z.string()).register(registry, {
    reducer: {
      fn: (x, y) => x.concat(y),
    },
    default: () => [] as string[],
  }),
});

const nodeA = (state: z.infer<typeof State>) => {
  console.log(`Node A sees ${state.aggregate}`);
  return { aggregate: ["A"] };
};

const nodeB = (state: z.infer<typeof State>) => {
  console.log(`Node B sees ${state.aggregate}`);
  return { aggregate: ["B"] };
};

// Define edges
const route = (state: z.infer<typeof State>): "b" | typeof END => {
  if (state.aggregate.length < 7) {
    return "b";
  } else {
    return END;
  }
};

const graph = new StateGraph(State)
  .addNode("a", nodeA)
  .addNode("b", nodeB)
  .addEdge(START, "a")
  .addConditionalEdges("a", route)
  .addEdge("b", "a")
  .compile();
```

```typescript
import * as fs from "node:fs/promises";

const drawableGraph = await graph.getGraphAsync();
const image = await drawableGraph.drawMermaidPng();
const imageBuffer = new Uint8Array(await image.arrayBuffer());

await fs.writeFile("graph.png", imageBuffer);
```

这种架构类似于 [ReAct 智能体](/oss/javascript/langgraph/workflows-agents)，其中节点 `"a"` 是一个工具调用模型，节点 `"b"` 代表工具。

在我们的 `route` 条件边中，我们指定当状态中的 `"aggregate"` 列表长度超过阈值后应该结束。

调用该图，我们看到在达到终止条件之前，我们在节点 `"a"` 和 `"b"` 之间交替执行。

```typescript
const result = await graph.invoke({ aggregate: [] });
console.log(result);
```

```
Node A sees []
Node B sees ['A']
Node A sees ['A', 'B']
Node B sees ['A', 'B', 'A']
Node A sees ['A', 'B', 'A', 'B']
Node B sees ['A', 'B', 'A', 'B', 'A']
Node A sees ['A', 'B', 'A', 'B', 'A', 'B']
{ aggregate: ['A', 'B', 'A', 'B', 'A', 'B', 'A'] }
```

### 强制递归限制

在某些应用中，我们可能无法保证会达到给定的终止条件。在这些情况下，我们可以设置图的 [递归限制](/oss/javascript/langgraph/graph-api#recursion-limit)。这将在给定数量的 [超步](/oss/javascript/langgraph/graph-api#graphs) 后引发 `GraphRecursionError`。然后我们可以捕获并处理这个异常：

```typescript
import { GraphRecursionError } from "@langchain/langgraph";

try {
  await graph.invoke({ aggregate: [] }, { recursionLimit: 4 });
} catch (error) {
  if (error instanceof GraphRecursionError) {
    console.log("Recursion Error");
  }
}
```

```
Node A sees []
Node B sees ['A']
Node A sees ['A', 'B']
Node B sees ['A', 'B', 'A']
Node A sees ['A', 'B', 'A', 'B']
Recursion Error
```

## 使用 `Command` 结合控制流和状态更新

将控制流（边）和状态更新（节点）结合起来可能很有用。例如，您可能希望在同一个节点中既执行状态更新又决定下一步去哪个节点。LangGraph 提供了一种方法，通过从节点函数返回 [Command](https://langchain-ai.github.io/langgraph/reference/types/#langgraph.types.Command) 对象来实现：

```typescript
import { Command } from "@langchain/langgraph";

const myNode = (state: State): Command => {
  return new Command({
    // state update
    update: { foo: "bar" },
    // control flow
    goto: "myOtherNode"
  });
};
```

我们在下面展示一个端到端的示例。让我们创建一个包含 3 个节点的简单图：A、B 和 C。我们将首先执行节点 A，然后根据节点 A 的输出决定下一步是去节点 B 还是节点 C。

```typescript
import { StateGraph, START, Command } from "@langchain/langgraph";
import * as z from "zod";

// Define graph state
const State = z.object({
  foo: z.string(),
});

// Define the nodes

const nodeA = (state: z.infer<typeof State>): Command => {
  console.log("Called A");
  const value = Math.random() > 0.5 ? "b" : "c";
  // this is a replacement for a conditional edge function
  const goto = value === "b" ? "nodeB" : "nodeC";

  // note how Command allows you to BOTH update the graph state AND route to the next node
  return new Command({
    // this is the state update
    update: { foo: value },
    // this is a replacement for an edge
    goto,
  });
};

const nodeB = (state: z.infer<typeof State>) => {
  console.log("Called B");
  return { foo: state.foo + "b" };
};

const nodeC = (state: z.infer<typeof State>) => {
  console.log("Called C");
  return { foo: state.foo + "c" };
};
```

现在我们可以用上面的节点创建 `StateGraph`。注意，该图没有用于路由的 [条件边](/oss/javascript/langgraph/graph-api#conditional-edges)！这是因为控制流是在 `nodeA` 内部用 `Command` 定义的。

```typescript
const graph = new StateGraph(State)
  .addNode("nodeA", nodeA, {
    ends: ["nodeB", "nodeC"],
  })
  .addNode("nodeB", nodeB)
  .addNode("nodeC", nodeC)
  .addEdge(START, "nodeA")
  .compile();
```

<Warning>

您可能已经注意到我们使用了 `ends` 来指定 `nodeA` 可以导航到哪些节点。这对于图渲染是必要的，并告诉 LangGraph `nodeA` 可以导航到 `nodeB` 和 `nodeC`。

</Warning>

```typescript
import * as fs from "node:fs/promises";

const drawableGraph = await graph.getGraphAsync();
const image = await drawableGraph.drawMermaidPng();
const imageBuffer = new Uint8Array(await image.arrayBuffer());

await fs.writeFile("graph.png", imageBuffer);
```

如果我们多次运行该图，我们会看到它根据节点 A 中的随机选择采取不同的路径（A -> B 或 A -> C）。

```typescript
const result = await graph.invoke({ foo: "" });
console.log(result);
```

```
Called A
Called C
{ foo: 'cc' }
```

### 导航到父图中的节点

如果您正在使用 [子图](/oss/javascript/langgraph/use-subgraphs)，您可能希望从子图内的节点导航到不同的子图（即父图中的不同节点）。为此，您可以在 `Command` 中指定 `graph=Command.PARENT`：

```typescript
const myNode = (state: State): Command => {
  return new Command({
    update: { foo: "bar" },
    goto: "otherSubgraph",  // where `otherSubgraph` is a node in the parent graph
    graph: Command.PARENT
  });
};
```

让我们使用上面的示例来演示这一点。我们将把上面示例中的 `nodeA` 更改为一个单节点图，然后将其作为子图添加到我们的父图中。

<Warning>

<strong>使用 `Command.PARENT` 进行状态更新</strong>
当您从子图节点向父图节点发送更新，且该键由父图和子图的 [状态模式](/oss/javascript/langgraph/graph-api#schema) 共享时，您<strong>必须</strong>在父图状态中为您正在更新的键定义一个 [归约器](/oss/javascript/langgraph/graph-api#reducers)。请参见下面的示例。

</Warning>

```typescript
import { StateGraph, START, Command } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const State = z.object({
  // NOTE: we define a reducer here
  foo: z.string().register(registry, {  // [!code highlight]
    reducer: {
      fn: (x, y) => x + y,
    },
  }),
});

const nodeA = (state: z.infer<typeof State>) => {
  console.log("Called A");
  const value = Math.random() > 0.5 ? "nodeB" : "nodeC";

  // note how Command allows you to BOTH update the graph state AND route to the next node
  return new Command({
    update: { foo: "a" },  // [!code highlight]
    goto: value,
    // this tells LangGraph to navigate to nodeB or nodeC in the parent graph
    // NOTE: this will navigate to the closest parent graph relative to the subgraph
    graph: Command.PARENT,
  });
};

const subgraph = new StateGraph(State)
  .addNode("nodeA", nodeA, { ends: ["nodeB", "nodeC"] })
  .addEdge(START, "nodeA")
  .compile();

const nodeB = (state: z.infer<typeof State>) => {
  console.log("Called B");  // [!code highlight]
  // NOTE: since we've defined a reducer, we don't need to manually append
  // new characters to existing 'foo' value. instead, reducer will append these
  // automatically
  return { foo: "b" };
};  // [!code highlight]

const nodeC = (state: z.infer<typeof State>) => {
  console.log("Called C");
  return { foo: "c" };
};

const graph = new StateGraph(State)
  .addNode("subgraph", subgraph, { ends: ["nodeB", "nodeC"] })
  .addNode("nodeB", nodeB)
  .addNode("nodeC", nodeC)
  .addEdge(START, "subgraph")
  .compile();
```

```typescript
const result = await graph.invoke({ foo: "" });
console.log(result);
```

```
Called A
Called C
{ foo: 'ac' }
```

### 在工具内部使用

一个常见的用例是从工具内部更新图状态。例如，在客户支持应用程序中，您可能希望在对话开始时根据客户的账号或 ID 查找客户信息。要从工具更新图状态，您可以从工具返回 `Command(update={"my_custom_key": "foo", "messages": [...]})`：

```typescript
import { tool } from "@langchain/core/tools";
import { Command } from "@langchain/langgraph";
import * as z from "zod";

const lookupUserInfo = tool(
  async (input, config) => {
    const userId = config.configurable?.userId;
    const userInfo = getUserInfo(userId);
    return new Command({
      update: {
        // update the state keys
        userInfo: userInfo,
        // update the message history
        messages: [{
          role: "tool",
          content: "Successfully looked up user information",
          tool_call_id: config.toolCall.id
        }]
      }
    });
  },
  {
    name: "lookupUserInfo",
    description: "Use this to look up user information to better assist them with their questions.",
    schema: z.object({}),
  }
);
```

<Warning>

当从工具返回 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 时，您<strong>必须</strong>在 `Command.update` 中包含 `messages`（或用于消息历史的任何状态键），并且 `messages` 中的消息列表<strong>必须</strong>包含一个 `ToolMessage`。这对于生成的消息历史有效是必要的（LLM 提供商要求带有工具调用的 AI 消息后面必须跟着工具结果消息）。

</Warning>

如果您正在使用通过 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 更新状态的工具，我们建议使用预构建的 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.prebuilt.ToolNode.html" target="_blank" rel="noreferrer" class="link"><code>ToolNode</code></a>，它会自动处理返回 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 对象的工具，并将其传播到图状态。如果您正在编写调用工具的自定义节点，则需要手动将工具返回的 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 对象作为节点的更新进行传播。

## 可视化您的图

这里我们演示如何可视化您创建的图。

您可以可视化任何任意的 [Graph](https://langchain-ai.github.io/langgraph/reference/graphs/)，包括 [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph)。

让我们创建一个简单的示例图来演示可视化。

```typescript
import { StateGraph, START, END, MessagesZodMeta } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const State = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
  value: z.number().register(registry, {
    reducer: {
      fn: (x, y) => x + y,
    },
  }),
});

const app = new StateGraph(State)
  .addNode("node1", (state) => {
    return { value: state.value + 1 };
  })
  .addNode("node2", (state) => {
    return { value: state.value * 2 };
  })
  .addEdge(START, "node1")
  .addConditionalEdges("node1", (state) => {
    if (state.value < 10) {
      return "node2";
    }
    return END;
  })
  .addEdge("node2", "node1")
  .compile();
```

### Mermaid

我们还可以将图类转换为 Mermaid 语法。

```typescript
const drawableGraph = await app.getGraphAsync();
console.log(drawableGraph.drawMermaid());
```

```
%%{init: {'flowchart': {'curve': 'linear'}}}%%
graph TD;
    tart__([<p>__start__</p>]):::first
    e1(node1)
    e2(node2)
    nd__([<p>__end__</p>]):::last
    tart__ --> node1;
    e1 -.-> node2;
    e1 -.-> __end__;
    e2 --> node1;
    ssDef default fill:#f2f0ff,line-height:1.2
    ssDef first fill-opacity:0
    ssDef last fill:#bfb6fc
```

### PNG

如果愿意，我们可以将图渲染为 `.png`。这使用 Mermaid.ink API 生成图表。

```typescript
import * as fs from "node:fs/promises";

const drawableGraph = await app.getGraphAsync();
const image = await drawableGraph.drawMermaidPng();
const imageBuffer = new Uint8Array(await image.arrayBuffer());

await fs.writeFile("graph.png", imageBuffer);
```

