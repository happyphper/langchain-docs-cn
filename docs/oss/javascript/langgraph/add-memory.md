---
title: 内存
---
AI应用需要[记忆](/oss/concepts/memory)来在多次交互间共享上下文。在LangGraph中，您可以添加两种类型的记忆：

* [添加短期记忆](#添加短期记忆)作为您智能体[状态](/oss/langgraph/graph-api#state)的一部分，以实现多轮对话。
* [添加长期记忆](#添加长期记忆)以跨会话存储用户特定或应用级别的数据。

## 添加短期记忆

**短期**记忆（线程级[持久化](/oss/langgraph/persistence)）使智能体能够跟踪多轮对话。要添加短期记忆：

```typescript
import { MemorySaver, StateGraph } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const builder = new StateGraph(...);
const graph = builder.compile({ checkpointer });

await graph.invoke(
  { messages: [{ role: "user", content: "hi! i am Bob" }] },
  { configurable: { thread_id: "1" } }
);
```

### 在生产环境中使用

在生产环境中，使用由数据库支持的检查点：

```typescript
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable";
const checkpointer = PostgresSaver.fromConnString(DB_URI);

const builder = new StateGraph(...);
const graph = builder.compile({ checkpointer });
```

:::: details 示例：使用Postgres检查点

```
npm install @langchain/langgraph-checkpoint-postgres
```

<Tip>

首次使用Postgres检查点时，需要调用 `checkpointer.setup()`

</Tip>

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { StateGraph, MessagesZodMeta, START } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const MessagesZodState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

const model = new ChatAnthropic({ model: "claude-haiku-4-5-20251001" });

const DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable";
const checkpointer = PostgresSaver.fromConnString(DB_URI);
// await checkpointer.setup();

const builder = new StateGraph(MessagesZodState)
  .addNode("call_model", async (state) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  })
  .addEdge(START, "call_model");

const graph = builder.compile({ checkpointer });

const config = {
  configurable: {
    thread_id: "1"
  }
};

for await (const chunk of await graph.stream(
  { messages: [{ role: "user", content: "hi! I'm bob" }] },
  { ...config, streamMode: "values" }
)) {
  console.log(chunk.messages.at(-1)?.content);
}

for await (const chunk of await graph.stream(
  { messages: [{ role: "user", content: "what's my name?" }] },
  { ...config, streamMode: "values" }
)) {
  console.log(chunk.messages.at(-1)?.content);
}
```

::::

### 在子图中使用

如果您的图包含[子图](/oss/langgraph/use-subgraphs)，您只需在编译父图时提供检查点。LangGraph会自动将检查点传播到子图。

```typescript
import { StateGraph, START, MemorySaver } from "@langchain/langgraph";
import * as z from "zod";

const State = z.object({ foo: z.string() });

const subgraphBuilder = new StateGraph(State)
  .addNode("subgraph_node_1", (state) => {
    return { foo: state.foo + "bar" };
  })
  .addEdge(START, "subgraph_node_1");
const subgraph = subgraphBuilder.compile();

const builder = new StateGraph(State)
  .addNode("node_1", subgraph)
  .addEdge(START, "node_1");

const checkpointer = new MemorySaver();
const graph = builder.compile({ checkpointer });
```

如果您希望子图拥有自己的记忆，可以使用适当的检查点选项编译它。这在[多智能体](/oss/langchain/multi-agent)系统中非常有用，如果您希望智能体跟踪其内部消息历史记录。

```typescript
const subgraphBuilder = new StateGraph(...);
const subgraph = subgraphBuilder.compile({ checkpointer: true });  // [!code highlight]
```

## 添加长期记忆

使用长期记忆跨对话存储用户特定或应用特定的数据。

```typescript
import { InMemoryStore, StateGraph } from "@langchain/langgraph";

const store = new InMemoryStore();

const builder = new StateGraph(...);
const graph = builder.compile({ store });
```

### 在生产环境中使用

在生产环境中，使用由数据库支持的存储：

```typescript
import { PostgresStore } from "@langchain/langgraph-checkpoint-postgres/store";

const DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable";
const store = PostgresStore.fromConnString(DB_URI);

const builder = new StateGraph(...);
const graph = builder.compile({ store });
```

:::: details 示例：使用Postgres存储

```
npm install @langchain/langgraph-checkpoint-postgres
```

<Tip>

首次使用Postgres存储时，需要调用 `store.setup()`

</Tip>

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { StateGraph, MessagesZodMeta, START, LangGraphRunnableConfig } from "@langchain/langgraph";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { PostgresStore } from "@langchain/langgraph-checkpoint-postgres/store";
import { BaseMessage } from "@langchain/core/messages";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";

const MessagesZodState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

const model = new ChatAnthropic({ model: "claude-haiku-4-5-20251001" });

const DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable";

const store = PostgresStore.fromConnString(DB_URI);
const checkpointer = PostgresSaver.fromConnString(DB_URI);
// await store.setup();
// await checkpointer.setup();

const callModel = async (
  state: z.infer<typeof MessagesZodState>,
  config: LangGraphRunnableConfig,
) => {
  const userId = config.configurable?.userId;
  const namespace = ["memories", userId];
  const memories = await config.store?.search(namespace, { query: state.messages.at(-1)?.content });
  const info = memories?.map(d => d.value.data).join("\n") || "";
  const systemMsg = `You are a helpful assistant talking to the user. User info: ${info}`;

  // Store new memories if the user asks the model to remember
  const lastMessage = state.messages.at(-1);
  if (lastMessage?.content?.toLowerCase().includes("remember")) {
    const memory = "User name is Bob";
    await config.store?.put(namespace, uuidv4(), { data: memory });
  }

  const response = await model.invoke([
    { role: "system", content: systemMsg },
    ...state.messages
  ]);
  return { messages: [response] };
};

const builder = new StateGraph(MessagesZodState)
  .addNode("call_model", callModel)
  .addEdge(START, "call_model");

const graph = builder.compile({
  checkpointer,
  store,
});

const config = {
  configurable: {
    thread_id: "1",
    userId: "1",
  }
};

for await (const chunk of await graph.stream(
  { messages: [{ role: "user", content: "Hi! Remember: my name is Bob" }] },
  { ...config, streamMode: "values" }
)) {
  console.log(chunk.messages.at(-1)?.content);
}

const config2 = {
  configurable: {
    thread_id: "2",
    userId: "1",
  }
};

for await (const chunk of await graph.stream(
  { messages: [{ role: "user", content: "what is my name?" }] },
  { ...config2, streamMode: "values" }
)) {
  console.log(chunk.messages.at(-1)?.content);
}
```

::::

### 使用语义搜索

在图的内存存储中启用语义搜索，让图智能体能够通过语义相似性搜索存储中的项目。

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { InMemoryStore } from "@langchain/langgraph";

// Create store with semantic search enabled
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
const store = new InMemoryStore({
  index: {
    embeddings,
    dims: 1536,
  },
});

await store.put(["user_123", "memories"], "1", { text: "I love pizza" });
await store.put(["user_123", "memories"], "2", { text: "I am a plumber" });

const items = await store.search(["user_123", "memories"], {
  query: "I'm hungry",
  limit: 1,
});
```

:::: details 具有语义搜索的长期记忆

```typescript
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, MessagesZodMeta, InMemoryStore } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const MessagesZodState = z.object({
    messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

// Create store with semantic search enabled
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
const store = new InMemoryStore({
    index: {
    embeddings,
    dims: 1536,
    }
});

await store.put(["user_123", "memories"], "1", { text: "I love pizza" });
await store.put(["user_123", "memories"], "2", { text: "I am a plumber" });

const chat = async (state: z.infer<typeof MessagesZodState>, config) => {
    // Search based on user's last message
    const items = await config.store.search(
    ["user_123", "memories"],
    { query: state.messages.at(-1)?.content, limit: 2 }
    );
    const memories = items.map(item => item.value.text).join("\n");
    const memoriesText = memories ? `## Memories of user\n${memories}` : "";

    const response = await model.invoke([
    { role: "system", content: `You are a helpful assistant.\n${memoriesText}` },
    ...state.messages,
    ]);

    return { messages: [response] };
};

const builder = new StateGraph(MessagesZodState)
    .addNode("chat", chat)
    .addEdge(START, "chat");
const graph = builder.compile({ store });

for await (const [message, metadata] of await graph.stream(
    { messages: [{ role: "user", content: "I'm hungry" }] },
    { streamMode: "messages" }
)) {
    if (message.content) {
    console.log(message.content);
    }
}
```

::::

## 管理短期记忆

启用[短期记忆](#添加短期记忆)后，长对话可能会超出LLM的上下文窗口。常见的解决方案有：

* [修剪消息](#修剪消息)：移除前N条或后N条消息（在调用LLM之前）
* [删除消息](#删除消息)：从LangGraph状态中永久删除消息
* [总结消息](#总结消息)：总结历史中的早期消息并用摘要替换它们
* [管理检查点](#管理检查点)：存储和检索消息历史记录
* 自定义策略（例如，消息过滤等）

这使智能体能够跟踪对话，而不会超出LLM的上下文窗口。

### 修剪消息

大多数LLM都有最大支持的上下文窗口（以令牌为单位）。决定何时截断消息的一种方法是计算消息历史记录中的令牌数，并在接近该限制时进行截断。如果您使用LangChain，可以使用修剪消息工具，指定要从列表中保留的令牌数量，以及用于处理边界的`strategy`（例如，保留最后`maxTokens`个）。

要修剪消息历史记录，请使用[`trimMessages`](https://js.langchain.com/docs/how_to/trim_messages/)函数：

```typescript
import { trimMessages } from "@langchain/core/messages";

const callModel = async (state: z.infer<typeof MessagesZodState>) => {
  const messages = trimMessages(state.messages, {
    strategy: "last",
    maxTokens: 128,
    startOn: "human",
    endOn: ["human", "tool"],
  });
  const response = await model.invoke(messages);
  return { messages: [response] };
};

const builder = new StateGraph(MessagesZodState)
  .addNode("call_model", callModel);
// ...
```

:::: details 完整示例：修剪消息

```typescript
import { trimMessages, BaseMessage } from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { StateGraph, START, MessagesZodMeta, MemorySaver } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const MessagesZodState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

const model = new ChatAnthropic({ model: "claude-3-5-sonnet-20241022" });

const callModel = async (state: z.infer<typeof MessagesZodState>) => {
  const messages = trimMessages(state.messages, {
    strategy: "last",
    maxTokens: 128,
    startOn: "human",
    endOn: ["human", "tool"],
    tokenCounter: model,
  });
  const response = await model.invoke(messages);
  return { messages: [response] };
};

const checkpointer = new MemorySaver();
const builder = new StateGraph(MessagesZodState)
  .addNode("call_model", callModel)
  .addEdge(START, "call_model");
const graph = builder.compile({ checkpointer });

const config = { configurable: { thread_id: "1" } };
await graph.invoke({ messages: [{ role: "user", content: "hi, my name is bob" }] }, config);
await graph.invoke({ messages: [{ role: "user", content: "write a short poem about cats" }] }, config);
await graph.invoke({ messages: [{ role: "user", content: "now do the same but for dogs" }] }, config);
const finalResponse = await graph.invoke({ messages: [{ role: "user", content: "what's my name?" }] }, config);

console.log(finalResponse.messages.at(-1)?.content);
```

```
Your name is Bob, as you mentioned when you first introduced yourself.
```

::::

### 删除消息

您可以从图状态中删除消息以管理消息历史记录。这在您想要删除特定消息或清除整个消息历史记录时非常有用。

要从图状态中删除消息，可以使用`RemoveMessage`。要使`RemoveMessage`生效，您需要使用带有<a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.messagesStateReducer.html" target="_blank" rel="noreferrer" class="link"><code>messagesStateReducer</code></a>[reducer](/oss/langgraph/graph-api#reducers)的状态键，例如`MessagesZodState`。

要删除特定消息：

```typescript
import { RemoveMessage } from "@langchain/core/messages";

const deleteMessages = (state) => {
  const messages = state.messages;
  if (messages.length > 2) {
    // remove the earliest two messages
    return {
      messages: messages
        .slice(0, 2)
        .map((m) => new RemoveMessage({ id: m.id })),
    };
  }
};
```

<Warning>

删除消息时，<strong>请确保</strong>生成的消息历史记录是有效的。检查您使用的LLM提供商的限制。例如：

* 某些提供商期望消息历史记录以`user`消息开头
* 大多数提供商要求带有工具调用的`assistant`消息后跟相应的`tool`结果消息。

</Warning>

:::: details 完整示例：删除消息

```typescript
import { RemoveMessage, BaseMessage } from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { StateGraph, START, MemorySaver, MessagesZodMeta } from "@langchain/langgraph";
import * as z from "zod";
import { registry } from "@langchain/langgraph/zod";

const MessagesZodState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
});

const model = new ChatAnthropic({ model: "claude-3-5-sonnet-20241022" });

const deleteMessages = (state: z.infer<typeof MessagesZodState>) => {
  const messages = state.messages;
  if (messages.length > 2) {
    // remove the earliest two messages
    return { messages: messages.slice(0, 2).map(m => new RemoveMessage({ id: m.id })) };
  }
  return {};
};

const callModel = async (state: z.infer<typeof MessagesZodState>) => {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};

const builder = new StateGraph(MessagesZodState)
  .addNode("call_model", callModel)
  .addNode("delete_messages", deleteMessages)
  .addEdge(START, "call_model")
  .addEdge("call_model", "delete_messages");

const checkpointer = new MemorySaver();
const app = builder.compile({ checkpointer });

const config = { configurable: { thread_id: "1" } };

for await (const event of await app.stream(
  { messages: [{ role: "user", content: "hi! I'm bob" }] },
  { ...config, streamMode: "values" }
)) {
  console.log(event.messages.map(message => [message.getType(), message.content]));
}

for await (const event of await app.stream(
  { messages: [{ role: "user", content: "what's my name?" }] },
  { ...config, streamMode: "values" }
)) {
  console.log(event.messages.map(message => [message.getType(), message.content]));
}
```

```
[['human', "hi! I'm bob"]]
[['human', "hi! I'm bob"], ['ai', 'Hi Bob! How are you doing today? Is there anything I can help you with?']]
[['human', "hi! I'm bob"], ['ai', 'Hi Bob! How are you doing today? Is there anything I can help you with?'], ['human', "what's my name?"]]
[['human', "hi! I'm bob"], ['ai', 'Hi Bob! How are you doing today? Is there anything I can help you with?'], ['human', "what's my name?"], ['ai', 'Your name is Bob.']]
[['human', "what's my name?"], ['ai', 'Your name is Bob.']]
```

::::

### 总结消息

如上所示，修剪或删除消息的问题在于，您可能会因消息队列的删减而丢失信息。因此，一些应用程序受益于使用聊天模型总结消息历史记录的更复杂方法。

![总结](/oss/images/summary.png)

可以使用提示和编排逻辑来总结消息历史记录。例如，在LangGraph中，您可以在状态中包含一个`summary`键，与`messages`键一起：

```typescript
import { BaseMessage } from "@langchain/core/messages";
import { MessagesZodMeta } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

const State = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
  summary: z.string().optional(),
});
```

然后，您可以生成聊天历史记录的摘要，使用任何现有的摘要作为下一个摘要的上下文。这个`summarizeConversation`节点可以在`messages`状态键中累积了一定数量的消息后被调用。

```typescript
import { RemoveMessage, HumanMessage } from "@langchain/core/messages";

const summarizeConversation = async (state: z.infer<typeof State>) => {
  // First, we get any existing summary
  const summary = state.summary || "";

  // Create our summarization prompt
  let summaryMessage: string;
  if (summary) {
    // A summary already exists
    summaryMessage =
      `This is a summary of the conversation to date: ${summary}\n\n` +
      "Extend the summary by taking into account the new messages above:";
  } else {
    summaryMessage = "Create a summary of the conversation above:";
  }

  // Add prompt to our history
  const messages = [
    ...state.messages,
    new HumanMessage({ content: summaryMessage })
  ];
  const response = await model.invoke(messages);

  // Delete all but the 2 most recent messages
  const deleteMessages = state.messages
    .slice(0, -2)
    .map(m => new RemoveMessage({ id: m.id }));

  return {
    summary: response.content,
    messages: deleteMessages
  };
};
```

:::: details 完整示例：总结消息

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import {
  SystemMessage,
  HumanMessage,
  RemoveMessage,
  type BaseMessage
} from "@langchain/core/messages";
import {
  MessagesZodMeta,
  StateGraph,
  START,
  END,
  MemorySaver,
} from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";

const memory = new MemorySaver();

// We will add a `summary` attribute (in addition to `messages` key,
// which MessagesZodState already has)
const GraphState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
  summary: z.string().default(""),
});

// We will use this model for both the conversation and the summarization
const model = new ChatAnthropic({ model: "claude-haiku-4-5-20251001" });

// Define the logic to call the model
const callModel = async (state: z.infer<typeof GraphState>) => {
  // If a summary exists, we add this in as a system message
  const { summary } = state;
  let { messages } = state;
  if (summary) {
    const systemMessage = new SystemMessage({
      id: uuidv4(),
      content: `Summary of conversation earlier: ${summary}`,
    });
    messages = [systemMessage, ...messages];
  }
  const response = await model.invoke(messages);
  // We return an object, because this will get added to the existing state
  return { messages: [response] };
};

// We now define the logic for determining whether to end or summarize the conversation
const shouldContinue = (state: z.infer<typeof GraphState>) => {
  const messages = state.messages;
  // If there are more than six messages, then we summarize the conversation
  if (messages.length > 6) {
    return "summarize_conversation";
  }
  // Otherwise we can just end
  return END;
};

const summarizeConversation = async (state: z.infer<typeof GraphState>) => {
  // First, we summarize the conversation
  const { summary, messages } = state;
  let summaryMessage: string;
  if (summary) {
    // If a summary already exists, we use a different system prompt
    // to summarize it than if one didn't
    summaryMessage =
      `This is summary of the conversation to date: ${summary}\n\n` +
      "Extend the summary by taking into account the new messages above:";
  } else {
    summaryMessage = "Create a summary of the conversation above:";
  }

  const allMessages = [
    ...messages,
    new HumanMessage({ id: uuidv4(), content: summaryMessage }),
  ];

  const response = await model.invoke(allMessages);

  // We now need to delete messages that we no longer want to show up
  // I will delete all but the last two messages, but you can change this
  const deleteMessages = messages
    .slice(0, -2)
    .map((m) => new RemoveMessage({ id: m.id! }));

  if (typeof response.content !== "string") {
    throw new Error("Expected a string response from the model");
  }

  return { summary: response.content, messages: deleteMessages };
};

// Define a new graph
const workflow = new StateGraph(GraphState)
  // Define the conversation node and the summarize node
  .addNode("conversation", callModel)
  .addNode("summarize_conversation", summarizeConversation)
  // Set the entrypoint as conversation
  .addEdge(START, "conversation")
  // We now add a conditional edge
  .addConditionalEdges(
    // First, we define the start node. We use `conversation`.
    // This means these are the edges taken after the `conversation` node is called.
    "conversation",
    // Next, we pass in the function that will determine which node is called next.
    shouldContinue,
  )
  // We now add a normal edge from `summarize_conversation` to END.
  // This means that after `summarize_conversation` is called, we end.
  .addEdge("summarize_conversation", END);

// Finally, we compile it!
const app = workflow.compile({ checkpointer: memory });
```

::::

### 管理检查点

您可以查看和删除检查点存储的信息。

<a id="checkpoint"></a>
#### 查看线程状态

```typescript
const config = {
  configurable: {
    thread_id: "1",
    // optionally provide an ID for a specific checkpoint,
    // otherwise the latest checkpoint is shown
    // checkpoint_id: "1f029ca3-1f5b-6704-8004-820c16b69a5a"
  },
};
await graph.getState(config);
```

```
{
  values: { messages: [HumanMessage(...), AIMessage(...), HumanMessage(...), AIMessage(...)] },
  next: [],
  config: { configurable: { thread_id: '1', checkpoint_ns: '', checkpoint_id: '1f029ca3-1f5b-6704-8004-820c16b69a5a' } },
  metadata: {
    source: 'loop',
    writes: { call_model: { messages: AIMessage(...) } },
    step: 4,
    parents: {},
    thread_id: '1'
  },
  createdAt: '2025-05-05T16:01:24.680462+00:00',
  parentConfig: { configurable: { thread_id: '1', checkpoint_ns: '', checkpoint_id: '1f029ca3-1790-6b0a-8003-baf965b6a38f' } },
  tasks: [],
  interrupts: []
}
```

<a id="checkpoints"></a>
#### 查看线程的历史记录

```typescript
const config = {
  configurable: {
    thread_id: "1",
  },
};

const history = [];
for await (const state of graph.getStateHistory(config)) {
  history.push(state);
}
```

#### 删除线程的所有检查点

```typescript
const threadId = "1";
await checkpointer.deleteThread(threadId);
```

## 数据库管理

如果您使用任何数据库支持的持久化实现（例如Postgres或Redis）来存储短期和/或长期记忆，您需要在与数据库一起使用之前运行迁移以设置所需的模式。

按照惯例，大多数数据库特定的库在检查点或存储实例上定义了一个`setup()`方法，用于运行所需的迁移。但是，您应该检查您特定的<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph-checkpoint.BaseCheckpointSaver.html" target="_blank" rel="noreferrer" class="link"><code>BaseCheckpointSaver</code></a>或<a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph-checkpoint.BaseStore.html" target="_blank" rel="noreferrer" class="link"><code>BaseStore</code></a>实现，以确认确切的方法名称和用法。

我们建议将迁移作为专门的部署步骤运行，或者确保它们在服务器启动时运行。
