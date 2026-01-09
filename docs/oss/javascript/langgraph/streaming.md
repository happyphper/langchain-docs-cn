---
title: 流式传输
---
LangGraph 实现了流式处理系统，以提供实时更新。流式处理对于提升基于 LLM 构建的应用程序的响应能力至关重要。通过逐步显示输出，甚至在完整响应准备就绪之前，流式处理能显著改善用户体验，尤其是在处理 LLM 的延迟时。

LangGraph 流式处理可实现的功能：

* <Icon icon="share-nodes" :size="16" /> [**流式传输图状态**](#stream-graph-state) — 通过 `updates` 和 `values` 模式获取状态更新/值。
* <Icon icon="square-poll-horizontal" :size="16" /> [**流式传输子图输出**](#stream-subgraph-outputs) — 包含父图和任何嵌套子图的输出。
* <Icon icon="square-binary" :size="16" /> [**流式传输 LLM 令牌**](#messages) — 从节点、子图或工具内部捕获令牌流。
* <Icon icon="table" :size="16" /> [**流式传输自定义数据**](#stream-custom-data) — 直接从工具函数发送自定义更新或进度信号。
* <Icon icon="layer-plus" :size="16" /> [**使用多种流模式**](#stream-multiple-modes) — 从 `values`（完整状态）、`updates`（状态增量）、`messages`（LLM 令牌 + 元数据）、`custom`（任意用户数据）或 `debug`（详细跟踪）中选择。

## 支持的流模式

将一个或多个以下流模式作为列表传递给 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.CompiledStateGraph.html#stream" target="_blank" rel="noreferrer" class="link"><code>stream</code></a> 方法：

| 模式       | 描述                                                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `values`   | 在图执行的每一步之后流式传输状态的完整值。                                                                                                                   |
| `updates`  | 在图执行的每一步之后流式传输状态的更新。如果在同一步骤中进行了多次更新（例如，运行了多个节点），这些更新将分别流式传输。 |
| `custom`   | 从图节点内部流式传输自定义数据。                                                                                                                                   |
| `messages` | 从任何调用 LLM 的图节点流式传输 2 元组（LLM 令牌，元数据）。                                                                                                |
| `debug`    | 在图执行过程中流式传输尽可能多的信息。                                                                                                      |

## 基本用法示例

LangGraph 图暴露了 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.pregel.Pregel.html#stream" target="_blank" rel="noreferrer" class="link"><code>stream</code></a> 方法，以迭代器的形式产生流式输出。

```typescript
for await (const chunk of await graph.stream(inputs, {
  streamMode: "updates",
})) {
  console.log(chunk);
}
```

:::: details 扩展示例：流式传输更新

```typescript
import { StateGraph, START, END } from "@langchain/langgraph";
import * as z from "zod";

const State = z.object({
  topic: z.string(),
  joke: z.string(),
});

const graph = new StateGraph(State)
  .addNode("refineTopic", (state) => {
    return { topic: state.topic + " and cats" };
  })
  .addNode("generateJoke", (state) => {
    return { joke: `This is a joke about ${state.topic}` };
  })
  .addEdge(START, "refineTopic")
  .addEdge("refineTopic", "generateJoke")
  .addEdge("generateJoke", END)
  .compile();

for await (const chunk of await graph.stream(
  { topic: "ice cream" },
  // Set streamMode: "updates" to stream only the updates to the graph state after each node
  // Other stream modes are also available. See supported stream modes for details
  { streamMode: "updates" }
)) {
  console.log(chunk);
}
```

```python
{'refineTopic': {'topic': 'ice cream and cats'}}
{'generateJoke': {'joke': 'This is a joke about ice cream and cats'}}
```

::::

## 流式传输多种模式

你可以传递一个数组作为 `streamMode` 参数，以同时流式传输多种模式。

流式输出将是 `[mode, chunk]` 元组，其中 `mode` 是流模式的名称，`chunk` 是该模式流式传输的数据。

```typescript
for await (const [mode, chunk] of await graph.stream(inputs, {
  streamMode: ["updates", "custom"],
})) {
  console.log(chunk);
}
```

## 流式传输图状态

使用流模式 `updates` 和 `values` 来流式传输图执行时的状态。

* `updates` 流式传输图每一步之后状态的**更新**。
* `values` 流式传输图每一步之后状态的**完整值**。

```typescript
import { StateGraph, START, END } from "@langchain/langgraph";
import * as z from "zod";

const State = z.object({
  topic: z.string(),
  joke: z.string(),
});

const graph = new StateGraph(State)
  .addNode("refineTopic", (state) => {
    return { topic: state.topic + " and cats" };
  })
  .addNode("generateJoke", (state) => {
    return { joke: `This is a joke about ${state.topic}` };
  })
  .addEdge(START, "refineTopic")
  .addEdge("refineTopic", "generateJoke")
  .addEdge("generateJoke", END)
  .compile();
```

<Tabs>

<Tab title="updates">

使用此模式仅流式传输节点每一步之后返回的**状态更新**。流式输出包括节点名称以及更新内容。

```typescript
for await (const chunk of await graph.stream(
  { topic: "ice cream" },
  { streamMode: "updates" }
)) {
  console.log(chunk);
}
```

</Tab>

<Tab title="values">

使用此模式流式传输每一步之后图的**完整状态**。

```typescript
for await (const chunk of await graph.stream(
  { topic: "ice cream" },
  { streamMode: "values" }
)) {
  console.log(chunk);
}
```

</Tab>

</Tabs>

## 流式传输子图输出

要在流式输出中包含[子图](/oss/langgraph/use-subgraphs)的输出，可以在父图的 `.stream()` 方法中设置 `subgraphs: true`。这将同时流式传输父图和任何子图的输出。

输出将作为元组 `[namespace, data]` 流式传输，其中 `namespace` 是一个元组，包含调用子图的节点路径，例如 `["parent_node:<task_id>", "child_node:<task_id>"]`。

```typescript
for await (const chunk of await graph.stream(
  { foo: "foo" },
  {
    // Set subgraphs: true to stream outputs from subgraphs
    subgraphs: true,
    streamMode: "updates",
  }
)) {
  console.log(chunk);
}
```

:::: details 扩展示例：从子图流式传输

```typescript
import { StateGraph, START } from "@langchain/langgraph";
import * as z from "zod";

// Define subgraph
const SubgraphState = z.object({
  foo: z.string(), // note that this key is shared with the parent graph state
  bar: z.string(),
});

const subgraphBuilder = new StateGraph(SubgraphState)
  .addNode("subgraphNode1", (state) => {
    return { bar: "bar" };
  })
  .addNode("subgraphNode2", (state) => {
    return { foo: state.foo + state.bar };
  })
  .addEdge(START, "subgraphNode1")
  .addEdge("subgraphNode1", "subgraphNode2");
const subgraph = subgraphBuilder.compile();

// Define parent graph
const ParentState = z.object({
  foo: z.string(),
});

const builder = new StateGraph(ParentState)
  .addNode("node1", (state) => {
    return { foo: "hi! " + state.foo };
  })
  .addNode("node2", subgraph)
  .addEdge(START, "node1")
  .addEdge("node1", "node2");
const graph = builder.compile();

for await (const chunk of await graph.stream(
  { foo: "foo" },
  {
    streamMode: "updates",
    // Set subgraphs: true to stream outputs from subgraphs
    subgraphs: true,
  }
)) {
  console.log(chunk);
}
```

```
[[], {'node1': {'foo': 'hi! foo'}}]
[['node2:dfddc4ba-c3c5-6887-5012-a243b5b377c2'], {'subgraphNode1': {'bar': 'bar'}}]
[['node2:dfddc4ba-c3c5-6887-5012-a243b5b377c2'], {'subgraphNode2': {'foo': 'hi! foobar'}}]
[[], {'node2': {'foo': 'hi! foobar'}}]
```

<strong>注意</strong>，我们接收到的不仅仅是节点更新，还包括命名空间，这些命名空间告诉我们正在从哪个图（或子图）进行流式传输。

::::

<a id="debug"></a>
### 调试

使用 `debug` 流模式在图执行过程中流式传输尽可能多的信息。流式输出包括节点名称以及完整状态。

```typescript
for await (const chunk of await graph.stream(
  { topic: "ice cream" },
  { streamMode: "debug" }
)) {
  console.log(chunk);
}
```

<a id="messages"></a>
## LLM 令牌

使用 `messages` 流模式从图的任何部分（包括节点、工具、子图或任务）**逐令牌**流式传输大语言模型输出。

来自 [`messages` 模式](#supported-stream-modes) 的流式输出是一个元组 `[message_chunk, metadata]`，其中：

* `message_chunk`：来自 LLM 的令牌或消息片段。
* `metadata`：包含图节点和 LLM 调用详细信息的字典。

> 如果你的 LLM 不作为 LangChain 集成提供，你可以改用 `custom` 模式流式传输其输出。详情请参阅[与任何 LLM 一起使用](#use-with-any-llm)。

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START } from "@langchain/langgraph";
import * as z from "zod";

const MyState = z.object({
  topic: z.string(),
  joke: z.string().default(""),
});

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

const callModel = async (state: z.infer<typeof MyState>) => {
  // Call the LLM to generate a joke about a topic
  // Note that message events are emitted even when the LLM is run using .invoke rather than .stream
  const modelResponse = await model.invoke([
    { role: "user", content: `Generate a joke about ${state.topic}` },
  ]);
  return { joke: modelResponse.content };
};

const graph = new StateGraph(MyState)
  .addNode("callModel", callModel)
  .addEdge(START, "callModel")
  .compile();

// The "messages" stream mode returns an iterator of tuples [messageChunk, metadata]
// where messageChunk is the token streamed by the LLM and metadata is a dictionary
// with information about the graph node where the LLM was called and other information
for await (const [messageChunk, metadata] of await graph.stream(
  { topic: "ice cream" },
  { streamMode: "messages" }
)) {
  if (messageChunk.content) {
    console.log(messageChunk.content + "|");
  }
}
```

#### 按 LLM 调用过滤

你可以为 LLM 调用关联 `tags`，以按 LLM 调用过滤流式传输的令牌。

```typescript
import { ChatOpenAI } from "@langchain/openai";

// model1 is tagged with "joke"
const model1 = new ChatOpenAI({
  model: "gpt-4o-mini",
  tags: ['joke']
});
// model2 is tagged with "poem"
const model2 = new ChatOpenAI({
  model: "gpt-4o-mini",
  tags: ['poem']
});

const graph = // ... define a graph that uses these LLMs

// The streamMode is set to "messages" to stream LLM tokens
// The metadata contains information about the LLM invocation, including the tags
for await (const [msg, metadata] of await graph.stream(
  { topic: "cats" },
  { streamMode: "messages" }
)) {
  // Filter the streamed tokens by the tags field in the metadata to only include
  // the tokens from the LLM invocation with the "joke" tag
  if (metadata.tags?.includes("joke")) {
    console.log(msg.content + "|");
  }
}
```

:::: details 扩展示例：按标签过滤

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START } from "@langchain/langgraph";
import * as z from "zod";

// The jokeModel is tagged with "joke"
const jokeModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  tags: ["joke"]
});
// The poemModel is tagged with "poem"
const poemModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  tags: ["poem"]
});

const State = z.object({
  topic: z.string(),
  joke: z.string(),
  poem: z.string(),
});

const graph = new StateGraph(State)
  .addNode("callModel", async (state) => {
    const topic = state.topic;
    console.log("Writing joke...");

    const jokeResponse = await jokeModel.invoke([
      { role: "user", content: `Write a joke about ${topic}` }
    ]);

    console.log("\n\nWriting poem...");
    const poemResponse = await poemModel.invoke([
      { role: "user", content: `Write a short poem about ${topic}` }
    ]);

    return {
      joke: jokeResponse.content,
      poem: poemResponse.content
    };
  })
  .addEdge(START, "callModel")
  .compile();

// The streamMode is set to "messages" to stream LLM tokens
// The metadata contains information about the LLM invocation, including the tags
for await (const [msg, metadata] of await graph.stream(
  { topic: "cats" },
  { streamMode: "messages" }
)) {
  // Filter the streamed tokens by the tags field in the metadata to only include
  // the tokens from the LLM invocation with the "joke" tag
  if (metadata.tags?.includes("joke")) {
    console.log(msg.content + "|");
  }
}
```

::::

#### 按节点过滤

要仅从特定节点流式传输令牌，请使用 `stream_mode="messages"` 并通过流式元数据中的 `langgraph_node` 字段过滤输出：

```typescript
// The "messages" stream mode returns a tuple of [messageChunk, metadata]
// where messageChunk is the token streamed by the LLM and metadata is a dictionary
// with information about the graph node where the LLM was called and other information
for await (const [msg, metadata] of await graph.stream(
  inputs,
  { streamMode: "messages" }
)) {
  // Filter the streamed tokens by the langgraph_node field in the metadata
  // to only include the tokens from the specified node
  if (msg.content && metadata.langgraph_node === "some_node_name") {
    // ...
  }
}
```

:::: details 扩展示例：从特定节点流式传输 LLM 令牌

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START } from "@langchain/langgraph";
import * as z from "zod";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

const State = z.object({
  topic: z.string(),
  joke: z.string(),
  poem: z.string(),
});

const graph = new StateGraph(State)
  .addNode("writeJoke", async (state) => {
    const topic = state.topic;
    const jokeResponse = await model.invoke([
      { role: "user", content: `Write a joke about ${topic}` }
    ]);
    return { joke: jokeResponse.content };
  })
  .addNode("writePoem", async (state) => {
    const topic = state.topic;
    const poemResponse = await model.invoke([
      { role: "user", content: `Write a short poem about ${topic}` }
    ]);
    return { poem: poemResponse.content };
  })
  // write both the joke and the poem concurrently
  .addEdge(START, "writeJoke")
  .addEdge(START, "writePoem")
  .compile();

// The "messages" stream mode returns a tuple of [messageChunk, metadata]
// where messageChunk is the token streamed by the LLM and metadata is a dictionary
// with information about the graph node where the LLM was called and other information
for await (const [msg, metadata] of await graph.stream(
  { topic: "cats" },
  { streamMode: "messages" }
)) {
  // Filter the streamed tokens by the langgraph_node field in the metadata
  // to only include the tokens from the writePoem node
  if (msg.content && metadata.langgraph_node === "writePoem") {
    console.log(msg.content + "|");
  }
}
```

::::

## 流式传输自定义数据

要从 LangGraph 节点或工具内部发送**自定义用户定义的数据**，请按照以下步骤操作：

1. 使用 `LangGraphRunnableConfig` 中的 `writer` 参数发出自定义数据。
2. 调用 `.stream()` 时设置 `streamMode: "custom"` 以在流中获取自定义数据。你可以组合多种模式（例如 `["updates", "custom"]`），但至少有一种必须是 `"custom"`。

<Tabs>

<Tab title="节点">

```typescript
import { StateGraph, START, LangGraphRunnableConfig } from "@langchain/langgraph";
import * as z from "zod";

const State = z.object({
  query: z.string(),
  answer: z.string(),
});

const graph = new StateGraph(State)
  .addNode("node", async (state, config) => {
    // Use the writer to emit a custom key-value pair (e.g., progress update)
    config.writer({ custom_key: "Generating custom data inside node" });
    return { answer: "some data" };
  })
  .addEdge(START, "node")
  .compile();

const inputs = { query: "example" };

// Set streamMode: "custom" to receive the custom data in the stream
for await (const chunk of await graph.stream(inputs, { streamMode: "custom" })) {
  console.log(chunk);
}
```

</Tab>

<Tab title="工具">

```typescript
import { tool } from "@langchain/core/tools";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import * as z from "zod";

const queryDatabase = tool(
  async (input, config: LangGraphRunnableConfig) => {
    // Use the writer to emit a custom key-value pair (e.g., progress update)
    config.writer({ data: "Retrieved 0/100 records", type: "progress" });
    // perform query
    // Emit another custom key-value pair
    config.writer({ data: "Retrieved 100/100 records", type: "progress" });
    return "some-answer";
  },
  {
    name: "query_database",
    description: "Query the database.",
    schema: z.object({
      query: z.string().describe("The query to execute."),
    }),
  }
);

const graph = // ... define a graph that uses this tool

// Set streamMode: "custom" to receive the custom data in the stream
for await (const chunk of await graph.stream(inputs, { streamMode: "custom" })) {
  console.log(chunk);
}
```

</Tab>

</Tabs>

## 与任何 LLM 一起使用

你可以使用 `streamMode: "custom"` 从**任何 LLM API** 流式传输数据——即使该 API **没有**实现 LangChain 聊天模型接口。

这让你可以集成原始的 LLM 客户端或提供自己流式接口的外部服务，使 LangGraph 在自定义设置中具有高度灵活性。

```typescript
import { LangGraphRunnableConfig } from "@langchain/langgraph";

const callArbitraryModel = async (
  state: any,
  config: LangGraphRunnableConfig
) => {
  // Example node that calls an arbitrary model and streams the output
  // Assume you have a streaming client that yields chunks
  // Generate LLM tokens using your custom streaming client
  for await (const chunk of yourCustomStreamingClient(state.topic)) {
    // Use the writer to send custom data to the stream
    config.writer({ custom_llm_chunk: chunk });
  }
  return { result: "completed" };
};

const graph = new StateGraph(State)
  .addNode("callArbitraryModel", callArbitraryModel)
  // Add other nodes and edges as needed
  .compile();

// Set streamMode: "custom" to receive the custom data in the stream
for await (const chunk of await graph.stream(
  { topic: "cats" },
  { streamMode: "custom" }
)) {
  // The chunk will contain the custom data streamed from the llm
  console.log(chunk);
}
```

:::: details 扩展示例：流式传输任意聊天模型

```typescript
import { StateGraph, START, MessagesZodMeta, LangGraphRunnableConfig } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";
import OpenAI from "openai";

const openaiClient = new OpenAI();
const modelName = "gpt-4o-mini";

async function* streamTokens(modelName: string, messages: any[]) {
  const response = await openaiClient.chat.completions.create({
    messages,
    model: modelName,
    stream: true,
  });

  let role: string | null = null;
  for await (const chunk of response) {
    const delta = chunk.choices[0]?.delta;

    if (delta?.role) {
      role = delta.role;
    }

    if (delta?.content) {
      yield { role, content: delta.content };
    }
  }
}

// this is our tool
const getItems = tool(
  async (input, config: LangGraphRunnableConfig) => {
    let response = "";
    for await (const msgChunk of streamTokens(
      modelName,
      [
        {
          role: "user",
          content: `Can you tell me what kind of items i might find in the following place: '${input.place}'. List at least 3 such items separating them by a comma. And include a brief description of each item.`,
        },
      ]
    )) {
      response += msgChunk.content;
      config.writer?.(msgChunk);
    }
    return response;
  },
  {
    name: "get_items",
    description: "Use this tool to list items one might find in a place you're asked about.",
    schema: z.object({
      place: z.string().describe("The place to look up items for."),
    }),
  }
);

const State = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

const graph = new StateGraph(State)
  // this is the tool-calling graph node
  .addNode("callTool", async (state) => {
    const aiMessage = state.messages.at(-1);
    const toolCall = aiMessage.tool_calls?.at(-1);

    const functionName = toolCall?.function?.name;
    if (functionName !== "get_items") {
      throw new Error(`Tool ${functionName} not supported`);
    }

    const functionArguments = toolCall?.function?.arguments;
    const args = JSON.parse(functionArguments);

    const functionResponse = await getItems.invoke(args);
    const toolMessage = {
      tool_call_id: toolCall.id,
      role: "tool",
      name: functionName,
      content: functionResponse,
    };
    return { messages: [toolMessage] };
  })
  .addEdge(START, "callTool")
  .compile();
```

让我们用一个包含工具调用的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 来调用图：

```typescript
const inputs = {
  messages: [
    {
      content: null,
      role: "assistant",
      tool_calls: [
        {
          id: "1",
          function: {
            arguments: '{"place":"bedroom"}',
            name: "get_items",
          },
          type: "function",
        }
      ],
    }
  ]
};

for await (const chunk of await graph.stream(
  inputs,
  { streamMode: "custom" }
)) {
  console.log(chunk.content + "|");
}
```

::::

## 为特定聊天模型禁用流式传输

如果你的应用程序混合了支持流式传输和不支持流式传输的模型，你可能需要为不支持流式传输的模型显式禁用流式传输。

初始化模型时设置 `streaming: false`。

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "o1-preview",
  // Set streaming: false to disable streaming for the chat model
  streaming: false,
});
```

<Note>

并非所有聊天模型集成都支持 `streaming` 参数。如果你的模型不支持，请改用 `disableStreaming: true`。此参数可通过基类在所有聊天模型上使用。

</Note>

