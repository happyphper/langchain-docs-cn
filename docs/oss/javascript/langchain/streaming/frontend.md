---
title: 前端
description: 利用 LangChain 智能体（agent）、LangGraph 图（graph）和自定义 API 的实时流式传输，构建生成式用户界面（UI）。
---
`useStream` React 钩子提供了与 LangGraph 流式处理能力的无缝集成。它处理了流式处理、状态管理和分支逻辑的所有复杂性，让你可以专注于构建出色的生成式 UI 体验。

主要特性：

* <Icon icon="messages" :size="16" /> **消息流式处理** — 处理消息块流以形成完整的消息
* <Icon icon="arrows-rotate" :size="16" /> **自动状态管理** — 用于消息、中断、加载状态和错误
* <Icon icon="code-branch" :size="16" /> **对话分支** — 从聊天历史中的任意点创建替代对话路径
* <Icon icon="palette" :size="16" /> **UI 无关设计** — 使用你自己的组件和样式

## 安装

安装 LangGraph SDK 以在你的 React 应用中使用 `useStream` 钩子：

```bash
npm install @langchain/langgraph-sdk
```

## 基本用法

`useStream` 钩子可以连接到任何 LangGraph 图，无论是从你自己的端点运行，还是使用 [LangSmith 部署](/langsmith/deployments) 部署的。

```tsx
import { useStream } from "@langchain/langgraph-sdk/react";

function Chat() {
  const stream = useStream({
    assistantId: "agent",
    // 本地开发
    apiUrl: "http://localhost:2024",
    // 生产部署（LangSmith 托管）
    // apiUrl: "https://your-deployment.us.langgraph.app"
  });

  const handleSubmit = (message: string) => {
    stream.submit({
      messages: [
        { content: message, type: "human" }
      ],
    });
  };

  return (
    <div>
      {stream.messages.map((message, idx) => (
        <div key={message.id ?? idx}>
          {message.type}: {message.content}
        </div>
      ))}

      {stream.isLoading && <div>Loading...</div>}
      {stream.error && <div>Error: {stream.error.message}</div>}
    </div>
  );
}
```

<Tip>

了解如何 [将你的智能体部署到 LangSmith](/oss/javascript/langchain/deploy)，以获得具备内置可观测性、身份验证和扩展能力的生产就绪托管服务。

</Tip>

:::: details `useStream` 参数

<ParamField body="assistantId" type="string" required>

要连接的智能体 ID。使用 LangSmith 部署时，此 ID 必须与部署仪表板中显示的智能体 ID 匹配。对于自定义 API 部署或本地开发，这可以是你的服务器用于标识智能体的任何字符串。

</ParamField>

<ParamField body="apiUrl" type="string">

LangGraph 服务器的 URL。本地开发时默认为 `http://localhost:2024`。

</ParamField>

<ParamField body="apiKey" type="string">

用于身份验证的 API 密钥。连接到 LangSmith 上已部署的智能体时需要。

</ParamField>

<ParamField body="threadId" type="string">

连接到现有线程而不是创建新线程。对于恢复对话很有用。

</ParamField>

<ParamField body="onThreadId" type="(id: string) =>
void">
创建新线程时调用的回调函数。使用此函数来持久化线程 ID 以供后续使用。

</ParamField>

<ParamField body="reconnectOnMount" type="boolean | (() =>
Storage)">
在组件挂载时自动恢复正在进行的运行。设置为 `true` 以使用会话存储，或提供自定义存储函数。

</ParamField>

<ParamField body="onCreated" type="(run: Run) =>
void">
创建新运行时调用的回调函数。对于持久化运行元数据以便恢复很有用。

</ParamField>

<ParamField body="onError" type="(error: Error) =>
void">
流式处理期间发生错误时调用的回调函数。

</ParamField>

<ParamField body="onFinish" type="(state: StateType, run?: Run) =>
void">
流成功完成并返回最终状态时调用的回调函数。

</ParamField>

<ParamField body="onCustomEvent" type="(data: unknown, context: { mutate }) =>
void">
使用 `writer` 处理从你的智能体发出的自定义事件。请参阅 [自定义流式处理事件](#custom-streaming-events)。

</ParamField>

<ParamField body="onUpdateEvent" type="(data: unknown, context: { mutate }) =>
void">
处理每个图步骤后的状态更新事件。

</ParamField>

<ParamField body="onMetadataEvent" type="(metadata: { run_id, thread_id }) =>
void">
处理包含运行和线程信息的元数据事件。

</ParamField>

<ParamField body="messagesKey" type="string" default="messages">

图状态中包含消息数组的键。

</ParamField>

<ParamField body="throttle" type="boolean" default="true">

批量处理状态更新以获得更好的渲染性能。禁用此选项可立即更新。

</ParamField>

<ParamField body="initialValues" type="StateType | null">

在第一个流加载时显示的初始状态值。对于立即显示缓存的线程数据很有用。

</ParamField>

::::

:::: details `useStream` 返回值

<ParamField body="messages" type="Message[]">

当前线程中的所有消息，包括人类和 AI 消息。

</ParamField>

<ParamField body="values" type="StateType">

当前的图状态值。类型从智能体或图类型参数推断。

</ParamField>

<ParamField body="isLoading" type="boolean">

当前是否有流正在进行。使用此值来显示加载指示器。

</ParamField>

<ParamField body="error" type="Error | null">

流式传输期间发生的任何错误。无错误时为 `null`。

</ParamField>

<ParamField body="interrupt" type="Interrupt | undefined">

当前需要用户输入的中断，例如人机协同（human-in-the-loop）的批准请求。

</ParamField>

<ParamField body="toolCalls" type="ToolCallWithResult[]">

所有消息中的所有工具调用，包含其结果和状态（`pending`、`completed` 或 `error`）。

</ParamField>

<ParamField body="submit" type="(input, options?) =>
Promise<void>">
向智能体提交新的输入。当从中断恢复并带有命令时，将 `null` 作为输入传递。选项包括用于分支的 `checkpoint`、用于乐观更新的 `optimisticValues` 以及用于乐观线程创建的 `threadId`。

</ParamField>

<ParamField body="stop" type="() =>
void">
立即停止当前流。

</ParamField>

<ParamField body="joinStream" type="(runId: string) =>
void">
通过运行 ID 恢复现有的流。与 `onCreated` 一起使用以手动恢复流。

</ParamField>

<ParamField body="setBranch" type="(branch: string) =>
void">
切换到对话历史中的不同分支。

</ParamField>

<ParamField body="getToolCalls" type="(message) =>
ToolCall[]">
获取特定 AI 消息的所有工具调用。

</ParamField>

<ParamField body="getMessagesMetadata" type="(message) =>
MessageMetadata">
获取消息的元数据，包括流信息，例如用于识别源节点的 `langgraph_node`，以及用于分支的 `firstSeenState`。

</ParamField>

<ParamField body="experimental_branchTree" type="BranchTree">

线程的树状表示，用于在非基于消息的图中进行高级分支控制。

</ParamField>

::::

## 线程管理

通过内置的线程管理来跟踪对话。您可以访问当前线程 ID，并在新线程创建时收到通知：

```tsx
import { useState } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";

function Chat() {
  const [threadId, setThreadId] = useState<string | null>(null);

  const stream = useStream({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    threadId: threadId,
    onThreadId: setThreadId,
  });

  // threadId 在新线程创建时更新
  // 将其存储在 URL 参数或 localStorage 中以实现持久化
}
```

我们建议存储 `threadId`，以便用户在页面刷新后能够恢复对话。

### 页面刷新后恢复

`useStream` 钩子可以通过设置 `reconnectOnMount: true` 在挂载时自动恢复正在进行的运行。这对于在页面刷新后继续流式传输非常有用，确保在停机期间生成的消息和事件不会丢失。

```tsx
const stream = useStream({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
  reconnectOnMount: true,
});
```

默认情况下，创建的运行 ID 存储在 `window.sessionStorage` 中，可以通过传递自定义存储函数来替换：

```tsx
const stream = useStream({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
  reconnectOnMount: () => window.localStorage,
});
```

要手动控制恢复过程，请使用运行回调来持久化元数据，并使用 `joinStream` 来恢复：

```tsx
import { useStream } from "@langchain/langgraph-sdk/react";
import { useEffect, useRef } from "react";

function Chat({ threadId }: { threadId: string | null }) {
  const stream = useStream({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    threadId,
    onCreated: (run) => {
      // 流开始时持久化运行 ID
      window.sessionStorage.setItem(`resume:${run.thread_id}`, run.run_id);
    },
    onFinish: (_, run) => {
      // 流完成时清理
      window.sessionStorage.removeItem(`resume:${run?.thread_id}`);
    },
  });

  // 如果存在存储的运行 ID，则在挂载时恢复流
  const joinedThreadId = useRef<string | null>(null);
  useEffect(() => {
    if (!threadId) return;
    const runId = window.sessionStorage.getItem(`resume:${threadId}`);
    if (runId && joinedThreadId.current !== threadId) {
      stream.joinStream(runId);
      joinedThreadId.current = threadId;
    }
  }, [threadId]);

  const handleSubmit = (text: string) => {
    // 使用 streamResumable 确保事件不会丢失
    stream.submit(
      { messages: [{ type: "human", content: text }] },
      { streamResumable: true }
    );
  };
}
```

<Card title="尝试会话持久化示例" icon="rotate" href="https://github.com/langchain-ai/langgraphjs/tree/main/examples/ui-react/src/examples/session-persistence">

在 `session-persistence` 示例中查看使用 `reconnectOnMount` 和线程持久化实现流恢复的完整实现。

</Card>

## 乐观更新

您可以在执行网络请求之前乐观地更新客户端状态，为用户提供即时反馈：

```tsx
const stream = useStream({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
});

const handleSubmit = (text: string) => {
  const newMessage = { type: "human" as const, content: text };

  stream.submit(
    { messages: [newMessage] },
    {
      optimisticValues(prev) {
        const prevMessages = prev.messages ?? [];
        return { ...prev, messages: [...prevMessages, newMessage] };
      },
    }
  );
};
```

### 乐观线程创建

在 `submit` 中使用 `threadId` 选项，以实现在线程创建之前需要知道线程 ID 的乐观 UI 模式：

```tsx
import { useState } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";

function Chat() {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [optimisticThreadId] = useState(() => crypto.randomUUID());

  const stream = useStream({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    threadId,
    onThreadId: setThreadId,
  });

  const handleSubmit = (text: string) => {
    // 立即导航，无需等待线程创建
    window.history.pushState({}, "", `/threads/${optimisticThreadId}`);

    // 使用预定的 ID 创建线程
    stream.submit(
      { messages: [{ type: "human", content: text }] },
      { threadId: optimisticThreadId }
    );
  };
}
```

### 缓存线程显示

使用 `initialValues` 选项在从服务器加载历史记录时立即显示缓存的线程数据：

```tsx
function Chat({ threadId, cachedData }) {
  const stream = useStream({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    threadId,
    initialValues: cachedData?.values,
  });

  // 立即显示缓存的消息，然后在服务器响应时更新
}
```

## 分支

通过编辑先前的消息或重新生成 AI 响应，可以创建替代的对话路径。使用 `getMessagesMetadata()` 来访问用于分支的检查点信息：

::: code-group

```tsx [Chat.tsx]
import { useStream } from "@langchain/langgraph-sdk/react";
import { BranchSwitcher } from "./BranchSwitcher";

function Chat() {
  const stream = useStream({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
  });

  return (
    <div>
      {stream.messages.map((message) => {
        const meta = stream.getMessagesMetadata(message);
        const parentCheckpoint = meta?.firstSeenState?.parent_checkpoint;

        return (
          <div key={message.id}>
            <div>{message.content as string}</div>

            {/* 编辑人类消息 */}
            {message.type === "human" && (
              <button
                onClick={() => {
                  const newContent = prompt("编辑消息:", message.content as string);
                  if (newContent) {
                    stream.submit(
                      { messages: [{ type: "human", content: newContent }] },
                      { checkpoint: parentCheckpoint }
                    );
                  }
                }}
              >
                编辑
              </button>
            )}

            {/* 重新生成 AI 消息 */}
            {message.type === "ai" && (
              <button
                onClick={() => stream.submit(undefined, { checkpoint: parentCheckpoint })}
              >
                重新生成
              </button>
            )}

            {/* 在分支之间切换 */}
            <BranchSwitcher
              branch={meta?.branch}
              branchOptions={meta?.branchOptions}
              onSelect={(branch) => stream.setBranch(branch)}
            />
          </div>
        );
      })}
    </div>
  );
}
```

```tsx [BranchSwitcher.tsx]
/**
 * 用于在对话分支之间导航的组件。
 * 显示当前分支位置并允许在备选分支之间切换。
 */
export function BranchSwitcher({
  branch,
  branchOptions,
  onSelect,
}: {
  branch: string | undefined;
  branchOptions: string[] | undefined;
  onSelect: (branch: string) => void;
}) {
  if (!branchOptions || !branch) return null;
  const index = branchOptions.indexOf(branch);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={index <= 0}
        onClick={() => onSelect(branchOptions[index - 1])}
      >
        ←
      </button>
      <span>{index + 1} / {branchOptions.length}</span>
      <button
        type="button"
        disabled={index >= branchOptions.length - 1}
        onClick={() => onSelect(branchOptions[index + 1])}
      >
        →
      </button>
    </div>
  );
}
```

:::

对于高级用例，使用 `experimental_branchTree` 属性来获取线程的树形表示，适用于非基于消息的图。

<Card title="尝试分支示例" icon="code-branch" href="https://github.com/langchain-ai/langgraphjs/tree/main/examples/ui-react/src/examples/branching-chat">

在 `branching-chat` 示例中查看对话分支的完整实现，包括编辑、重新生成和分支切换功能。

</Card>

## 类型安全的流式处理

当与通过 <a href="https://reference.langchain.com/javascript/functions/langchain.index.createAgent.html" target="_blank" rel="noreferrer" class="link"><code>createAgent</code></a> 创建的智能体（agent）或使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 创建的图一起使用时，`useStream` 钩子支持完整的类型推断。将 `typeof agent` 或 `typeof graph` 作为类型参数传递，以自动推断工具调用类型。

### 使用 `createAgent`

当使用 <a href="https://reference.langchain.com/javascript/functions/langchain.index.createAgent.html" target="_blank" rel="noreferrer" class="link"><code>createAgent</code></a> 时，工具调用类型会根据你注册到智能体（agent）的工具自动推断：

::: code-group

```typescript [agent.ts]
import { createAgent, tool } from "langchain";
import { z } from "zod";

const getWeather = tool(
  async ({ location }) => `Weather in ${location}: Sunny, 72°F`,
  {
    name: "get_weather",
    description: "Get weather for a location",
    schema: z.object({
      location: z.string().describe("The city to get weather for"),
    }),
  }
);

export const agent = createAgent({
  model: "openai:gpt-4o-mini",
  tools: [getWeather],
});
```

```tsx [Chat.tsx]
import { useStream } from "@langchain/langgraph-sdk/react";
import type { agent } from "./agent";

function Chat() {
  // 工具调用类型会自动从智能体的工具中推断出来
  const stream = useStream<typeof agent>({
    assistantId: "agent",
    apiUrl: "http://localhost:2024",
  });

  // stream.toolCalls[0].call.name 的类型为 "get_weather"
  // stream.toolCalls[0].call.args 的类型为 { location: string }
}
```

:::

### 使用 `StateGraph`

对于自定义的 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 应用程序，状态类型是从图的注解中推断出来的：

::: code-group

```typescript [graph.ts]
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", async (state) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  })
  .addEdge(START, "agent")
  .addEdge("agent", END);

export const graph = workflow.compile();
```

```tsx [Chat.tsx]
import { useStream } from "@langchain/langgraph-sdk/react";
import type { graph } from "./graph";

function Chat() {
  // 状态类型会根据图自动推断
  const stream = useStream<typeof graph>({
    assistantId: "my-graph",
    apiUrl: "http://localhost:2024",
  });

  // stream.values 的类型基于图的 state 注解
}
```

:::

### 使用注解类型

如果你在使用 LangGraph.js，可以复用你图的注解类型。请确保只导入类型，以避免导入整个 LangGraph.js 运行时：

```tsx
import {
  Annotation,
  MessagesAnnotation,
  type StateType,
  type UpdateType,
} from "@langchain/langgraph/web";

const AgentState = Annotation.Root({
  ...MessagesAnnotation.spec,
  context: Annotation<string>(),
});

const stream = useStream<
  StateType<typeof AgentState.spec>,
  { UpdateType: UpdateType<typeof AgentState.spec> }
>({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
});
```

### 高级类型配置

你可以为中断、自定义事件和可配置选项指定额外的类型参数：

```tsx
import type { Message } from "@langchain/langgraph-sdk";

type State = { messages: Message[]; context?: string };

const stream = useStream<
  State,
  {
    UpdateType: { messages: Message[] | Message; context?: string };
    InterruptType: string;
    CustomEventType: { type: "progress" | "debug"; payload: unknown };
    ConfigurableType: { model: string };
  }
>({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
});

// stream.interrupt 的类型为 string | undefined
// onCustomEvent 接收类型化的事件
```

## 渲染工具调用

使用 `getToolCalls` 从 AI 消息中提取并渲染工具调用。工具调用包括调用详情、结果（如果已完成）和状态。

::: code-group

```tsx [Chat.tsx]
import { useStream } from "@langchain/langgraph-sdk/react";
import type { agent } from "./agent";
import { ToolCallCard } from "./ToolCallCard";
import { MessageBubble } from "./MessageBubble";

function Chat() {
  const stream = useStream<typeof agent>({
    assistantId: "agent",
    apiUrl: "http://localhost:2024",
  });

  return (
    <div className="flex flex-col gap-4">
      {stream.messages.map((message, idx) => {
        if (message.type === "ai") {
          const toolCalls = stream.getToolCalls(message);

          if (toolCalls.length > 0) {
            return (
              <div key={message.id ?? idx} className="flex flex-col gap-2">
                {toolCalls.map((toolCall) => (
                  <ToolCallCard key={toolCall.id} toolCall={toolCall} />
                ))}
              </div>
            );
          }
        }

        return <MessageBubble key={message.id ?? idx} message={message} />;
      })}
    </div>
  );
}
```

```tsx [ToolCallCard.tsx]
import type {
  ToolCallWithResult,
  ToolCallFromTool,
  ToolCallState,
  InferAgentToolCalls,
} from "@langchain/langgraph-sdk/react";
import type { ToolMessage } from "@langchain/langgraph-sdk";
import type { agent } from "./agent";
import type { getWeather } from "./tools";
import { parseToolResult } from "./utils";
import { WeatherCard } from "./WeatherCard";

/**
 * 为此组件定义工具调用类型。
 * 对于智能体使用 InferAgentToolCalls，对于单个工具使用 ToolCallFromTool。
 */
type AgentToolCalls = InferAgentToolCalls<typeof agent>;

/**
 * 渲染工具调用及其结果的组件。
 * 使用类型化的 ToolCallWithResult 进行可辨识联合类型收窄。
 */
export function ToolCallCard({
  toolCall,
}: {
  toolCall: ToolCallWithResult<AgentToolCalls>;
}) {
  const { call, result, state } = toolCall;

// 当 call.name 是字面量类型时，类型收窄生效
  if (call.name === "get_weather") {
    return <WeatherCard call={call} result={result} state={state} />;
  }

  // 其他工具的兜底处理
  return <GenericToolCallCard call={call} result={result} state={state} />;
}
```

```tsx [GenericToolCallCard.tsx]
import type { ToolCallState } from "@langchain/langgraph-sdk/react";
import type { ToolMessage } from "@langchain/langgraph-sdk";
import { parseToolResult } from "./utils";

/**
 * 用于未知或未处理工具的通用兜底组件。
 * 使用一个适用于任何工具调用的简单类型。
 */
export function GenericToolCallCard({
  call,
  result,
  state,
}: {
  call: { name: string; args: Record<string, unknown> };
  result?: ToolMessage;
  state: ToolCallState;
}) {
  const isLoading = state === "pending";
  const parsedResult = parseToolResult(result);

  return (
    <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <div className="text-sm font-medium text-white font-mono">
            {call.name}
          </div>
          <div className="text-xs text-neutral-500">
            {isLoading ? "处理中..." : "已完成"}
          </div>
        </div>
      </div>
      <pre className="text-xs bg-black rounded p-2 mb-2 overflow-x-auto">
        {JSON.stringify(call.args, null, 2)}
      </pre>
      {result && (
        <div className="text-sm rounded-lg p-3 bg-black text-neutral-300">
          {parsedResult.content}
        </div>
      )}
    </div>
  );
}
```

```tsx [WeatherCard.tsx]
import type { ToolCallFromTool, ToolCallState } from "@langchain/langgraph-sdk/react";
import type { ToolMessage } from "@langchain/langgraph-sdk";
import type { getWeather } from "./tools";
import { parseToolResult } from "./utils";

// 直接从工具定义推断工具调用类型
type GetWeatherToolCall = ToolCallFromTool<typeof getWeather>;

/**
 * 天气专用的工具卡片，具有丰富的 UI。
 * 使用 ToolCallFromTool 从工具模式推断 args 类型。
 */
export function WeatherCard({
  call,
  result,
  state,
}: {
  call: GetWeatherToolCall;
  result?: ToolMessage;
  state: ToolCallState;
}) {
  const isLoading = state === "pending";
  const parsedResult = parseToolResult(result);

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* 天空渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-600 to-indigo-600" />

      <div className="relative p-4">
        <div className="flex items-center gap-2 text-white/80 text-xs mb-3">
          {/* call.args 根据工具模式被类型化为 { location: string } */}
          <span className="font-medium">{call.args.location}</span>
          {isLoading && <span className="ml-auto">加载中...</span>}
        </div>

        {parsedResult.status === "error" ? (
          <div className="bg-red-500/20 rounded-lg p-3 text-red-200 text-sm">
            {parsedResult.content}
          </div>
        ) : (
          <div className="text-white text-lg font-medium">
            {parsedResult.content || "正在获取天气..."}
          </div>
        )}
      </div>
    </div>
  );
}
```

```typescript [tools.ts]
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// 使用 Zod 模式定义天气工具
export const getWeather = tool(
  async ({ location }) => {
    // 工具实现
    return JSON.stringify({ status: "success", content: `Weather in ${location}: Sunny, 72°F` });
  },
  {
    name: "get_weather",
    description: "获取指定位置的当前天气",
    schema: z.object({
      location: z.string().describe("城市和州，例如：San Francisco, CA"),
    }),
  }
);
```

```typescript [utils.ts]
import type { ToolMessage } from "@langchain/langgraph-sdk";

/**
 * 安全解析工具结果的辅助函数。
 * 工具结果可能是 JSON 字符串或纯文本。
 */
export function parseToolResult(result?: ToolMessage): {
  status: string;
  content: string;
} {
  if (!result) return { status: "pending", content: "" };
  try {
    return JSON.parse(result.content as string);
  } catch {
    return { status: "success", content: result.content as string };
  }
}
```

:::

<Card title="尝试工具调用示例" icon="hammer" href="https://github.com/langchain-ai/langgraphjs/tree/main/examples/ui-react/src/examples/tool-calling-agent">

在 `tool-calling-agent` 示例中查看包含天气、计算器和笔记工具的完整工具调用渲染实现。

</Card>

## 自定义流式事件

使用工具或节点中的 `writer` 从您的智能体（agent）流式传输自定义数据。在 UI 中使用 `onCustomEvent` 回调处理这些事件。

::: code-group

```typescript [agent.ts]
import { tool, type ToolRuntime } from "langchain";
import { z } from "zod";

// 定义自定义事件类型
interface ProgressData {
  type: "progress";
  id: string;
  message: string;
  progress: number;
}

const analyzeDataTool = tool(
  async ({ dataSource }, config: ToolRuntime) => {
    const steps = ["Connecting...", "Fetching...", "Processing...", "Done!"];

    for (let i = 0; i < steps.length; i++) {
      // 在执行期间发出进度事件
      config.writer?.({
        type: "progress",
        id: `analysis-${Date.now()}`,
        message: steps[i],
        progress: ((i + 1) / steps.length) * 100,
      } satisfies ProgressData);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return JSON.stringify({ result: "Analysis complete" });
  },
  {
    name: "analyze_data",
    description: "Analyze data with progress updates",
    schema: z.object({
      dataSource: z.string().describe("Data source to analyze"),
    }),
  }
);
```

```tsx [Chat.tsx]
import { useState, useCallback } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";
import type { agent } from "./agent";

interface ProgressData {
  type: "progress";
  id: string;
  message: string;
  progress: number;
}

function isProgressData(data: unknown): data is ProgressData {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as ProgressData).type === "progress"
  );
}

function CustomStreamingUI() {
  const [progressData, setProgressData] = useState<Map<string, ProgressData>>(
    new Map()
  );

  const handleCustomEvent = useCallback((data: unknown) => {
    if (isProgressData(data)) {
      setProgressData((prev) => {
        const updated = new Map(prev);
        updated.set(data.id, data);
        return updated;
      });
    }
  }, []);

  const stream = useStream<typeof agent>({
    assistantId: "custom-streaming",
    apiUrl: "http://localhost:2024",
    onCustomEvent: handleCustomEvent,
  });

  return (
    <div>
      {/* 渲染进度卡片 */}
      {Array.from(progressData.values()).map((data) => (
        <div key={data.id} className="bg-neutral-800 rounded-lg p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white">{data.message}</span>
            <span className="text-xs text-neutral-400">{data.progress}%</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

:::

<Card title="尝试自定义流式处理示例" icon="bolt" href="https://github.com/langchain-ai/langgraphjs/tree/main/examples/ui-react/src/examples/custom-streaming">

在 `custom-streaming` 示例中查看包含进度条、状态徽章和文件操作卡片的自定义事件的完整实现。

</Card>

## 事件处理

`useStream` 钩子提供了回调选项，让你可以访问不同类型的流式事件。你无需显式配置流模式——只需为你想要处理的事件类型传递回调函数：

```tsx
const stream = useStream({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",

  // 在每个图步骤后处理状态更新
  onUpdateEvent: (update, options) => {
    console.log("Graph update:", update);
  },

  // 处理从你的图流式传输的自定义事件
  onCustomEvent: (event, options) => {
    console.log("Custom event:", event);
  },

  // 处理包含运行/线程信息的元数据事件
  onMetadataEvent: (metadata) => {
    console.log("Run ID:", metadata.run_id);
    console.log("Thread ID:", metadata.thread_id);
  },

  onError: (error) => {
    console.error("Stream error:", error);
  },

  onFinish: (state, options) => {
    console.log("Stream finished with final state:", state);
  },
});
```

### 可用的回调

| 回调函数 | 描述 | 流模式 |
|----------|-------------|-------------|
| `onUpdateEvent` | 在每个图步骤后接收到状态更新时调用 | `updates` |
| `onCustomEvent` | 从你的图中接收到自定义事件时调用 | `custom` |
| `onMetadataEvent` | 接收到运行和线程元数据时调用 | `metadata` |
| `onError` | 发生错误时调用 | - |
| `onFinish` | 流完成时调用 | - |

## 多智能体流式处理

在处理多智能体系统或具有多个节点的图时，使用消息元数据来识别每条消息是由哪个节点生成的。当多个 LLM 并行运行，并且你希望以不同的视觉样式显示它们的输出时，这尤其有用。

## 相关

- [流式处理概述](/oss/javascript/langchain/streaming/overview) — 使用 LangChain 智能体进行服务器端流式处理
- [useStream API 参考](https://reference.langchain.com/javascript/functions/_langchain_langgraph-sdk.react.useStream.html) — 完整的 API 文档
- [智能体聊天界面](/oss/javascript/langchain/ui) — LangGraph 智能体的预构建聊天界面
- [人机协同](/oss/javascript/langchain/human-in-the-loop) — 配置人工审核的中断
- [多智能体系统](/oss/javascript/langchain/multi-agent) — 构建使用多个 LLM 的智能体
