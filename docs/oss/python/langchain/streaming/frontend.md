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

了解如何 [将你的智能体部署到 LangSmith](/oss/python/langchain/deploy)，以获得具备内置可观测性、身份验证和扩展能力的生产就绪托管服务。

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

当与通过 @[`createAgent`] 创建的智能体（agent）或使用 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 创建的图一起使用时，`useStream` 钩子支持完整的类型推断。将 `typeof agent` 或 `typeof graph` 作为类型参数传递，以自动推断工具调用类型。

### 使用 `createAgent`

当使用 @[`createAgent`] 时，工具调用类型会根据你注册到智能体（agent）的工具自动推断：

::: code-group

```python [agent.py]
from langchain import create_agent, tool

@tool
def get_weather(location: str) -> str:
    """Get weather for a location."""
    return f"Weather in {location}: Sunny, 72°F"

agent = create_agent(
    model="openai:gpt-4o-mini",
    tools=[get_weather],
)
```

```tsx [Chat.tsx]
import { useStream } from "@langchain/langgraph-sdk/react";
import type { AgentState } from "./types";

function Chat() {
  // 使用手动定义的状态类型
  const stream = useStream<AgentState>({
    assistantId: "agent",
    apiUrl: "http://localhost:2024",
  });

  // stream.toolCalls[0].call.name 的类型为 "get_weather"
  // stream.toolCalls[0].call.args 的类型为 { location: string }
}
```

```typescript [types.ts]
import type { Message } from "@langchain/langgraph-sdk";

// 定义工具调用类型以匹配你的 Python 智能体
export type GetWeatherToolCall = {
  name: "get_weather";
  args: { location: string };
  id?: string;
};

export type AgentToolCalls = GetWeatherToolCall;

export interface AgentState {
  messages: Message<AgentToolCalls>[];
}
```

:::

### 使用 `StateGraph`

对于自定义的 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 应用程序，状态类型是从图的注解中推断出来的：

::: code-group

```python [graph.py]
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from typing import TypedDict, Annotated

class State(TypedDict):
    messages: Annotated[list, add_messages]

model = ChatOpenAI(model="gpt-4o-mini")

async def agent(state: State) -> dict:
    response = await model.ainvoke(state["messages"])
    return {"messages": [response]}

workflow = StateGraph(State)
workflow.add_node("agent", agent)
workflow.add_edge(START, "agent")
workflow.add_edge("agent", END)

graph = workflow.compile()
```

```tsx [Chat.tsx]
import { useStream } from "@langchain/langgraph-sdk/react";
import type { GraphState } from "./types";

function Chat() {
  // 使用手动定义的状态类型
  const stream = useStream<GraphState>({
    assistantId: "my-graph",
    apiUrl: "http://localhost:2024",
  });

  // stream.values 的类型基于你定义的状态
}
```

```typescript [types.ts]
import type { Message } from "@langchain/langgraph-sdk";

// 定义状态以匹配你的 Python 图的 State TypedDict
export interface GraphState {
  messages: Message[];
}
```

:::

### 使用注解类型

如果你在使用 LangGraph.js，可以复用你图的注解类型。请确保只导入类型，以避免导入整个 LangGraph.js 运行时：

### 高级类型配置

你可以为中断、自定义事件和可配置选项指定额外的类型参数：

## 渲染工具调用

使用 `getToolCalls` 从 AI 消息中提取并渲染工具调用。工具调用包括调用详情、结果（如果已完成）和状态。

::: code-group

```python [agent.py]
from langchain import create_agent, tool

@tool
def get_weather(location: str) -> str:
    """获取指定地点的当前天气。"""
    return f'{{"status": "success", "content": "Weather in {location}: Sunny, 72°F"}}'

agent = create_agent(
    model="openai:gpt-4o-mini",
    tools=[get_weather],
)
```

```tsx [Chat.tsx]
import { useStream } from "@langchain/langgraph-sdk/react";
import type { AgentState, AgentToolCalls } from "./types";
import { ToolCallCard } from "./ToolCallCard";
import { MessageBubble } from "./MessageBubble";

function Chat() {
  const stream = useStream<AgentState>({
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
import type { ToolCallWithResult, ToolCallState } from "@langchain/langgraph-sdk/react";
import type { ToolMessage } from "@langchain/langgraph-sdk";
import type { AgentToolCalls, GetWeatherToolCall } from "./types";
import { parseToolResult } from "./utils";
import { WeatherCard } from "./WeatherCard";
import { GenericToolCallCard } from "./GenericToolCallCard";

export function ToolCallCard({
  toolCall,
}: {
  toolCall: ToolCallWithResult<AgentToolCalls>;
}) {
  const { call, result, state } = toolCall;

  if (call.name === "get_weather") {
    return <WeatherCard call={call} result={result} state={state} />;
  }

  return <GenericToolCallCard call={call} result={result} state={state} />;
}
```

```tsx [WeatherCard.tsx]
import type { ToolCallState } from "@langchain/langgraph-sdk/react";
import type { ToolMessage } from "@langchain/langgraph-sdk";
import type { GetWeatherToolCall } from "./types";
import { parseToolResult } from "./utils";

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
      <div className="absolute inset-0 bg-gradient-to-br from-sky-600 to-indigo-600" />
      <div className="relative p-4">
        <div className="flex items-center gap-2 text-white/80 text-xs mb-3">
          <span className="font-medium">{call.args.location}</span>
          {isLoading && <span className="ml-auto">Loading...</span>}
        </div>
        {parsedResult.status === "error" ? (
          <div className="bg-red-500/20 rounded-lg p-3 text-red-200 text-sm">
            {parsedResult.content}
          </div>
        ) : (
          <div className="text-white text-lg font-medium">
            {parsedResult.content || "Fetching weather..."}
          </div>
        )}
      </div>
    </div>
  );
}
```

```typescript [types.ts]
import type { Message } from "@langchain/langgraph-sdk";

// 定义工具调用类型以匹配你的 Python 智能体的工具
export type GetWeatherToolCall = {
  name: "get_weather";
  args: { location: string };
  id?: string;
};

// 你的智能体中所有工具调用的联合类型
export type AgentToolCalls = GetWeatherToolCall;

// 使用你的工具调用定义状态类型
export interface AgentState {
  messages: Message<AgentToolCalls>[];
}
```

```typescript [utils.ts]
import type { ToolMessage } from "@langchain/langgraph-sdk";

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

```python [agent.py]
import asyncio
import time
from langchain import create_agent, tool
from langchain.types import ToolRuntime

@tool
async def analyze_data(data_source: str, *, config: ToolRuntime) -> str:
    """分析数据并更新进度。"""
    steps = ["连接中...", "获取中...", "处理中...", "完成！"]

    for i, step in enumerate(steps):
        # 在执行过程中发出进度事件
        if config.writer:
            config.writer({
                "type": "progress",
                "id": f"analysis-{int(time.time() * 1000)}",
                "message": step,
                "progress": ((i + 1) / len(steps)) * 100,
            })
        await asyncio.sleep(0.5)

    return '{"result": "分析完成"}'

agent = create_agent(
    model="openai:gpt-4o-mini",
    tools=[analyze_data],
)
```

```tsx [Chat.tsx]
import { useState, useCallback } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";
import type { AgentState } from "./types";

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

  const stream = useStream<AgentState>({
    assistantId: "custom-streaming",
    apiUrl: "http://localhost:2024",
    onCustomEvent: handleCustomEvent,
  });

  return (
    <div>
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

```typescript [types.ts]
import type { Message } from "@langchain/langgraph-sdk";

// 定义工具调用以匹配您的 Python 智能体（agent）
export type AnalyzeDataToolCall = {
  name: "analyze_data";
  args: { data_source: string };
  id?: string;
};

export type AgentToolCalls = AnalyzeDataToolCall;

export interface AgentState {
  messages: Message<AgentToolCalls>[];
}
```

:::

<Card title="尝试自定义流式处理示例" icon="bolt" href="https://github.com/langchain-ai/langgraphjs/tree/main/examples/ui-react/src/examples/custom-streaming">

在 `custom-streaming` 示例中查看包含进度条、状态徽章和文件操作卡片的自定义事件的完整实现。

</Card>

## 事件处理

`useStream` 钩子提供了回调选项，让你可以访问不同类型的流式事件。你无需显式配置流模式——只需为你想要处理的事件类型传递回调函数：

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

<CodeGroup>

```python [agent.py]
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END, Send
from langgraph.graph.state import CompiledStateGraph
from langchain.messages import BaseMessage, AIMessage
from typing import TypedDict, Annotated
import operator

# 使用不同的模型实例以增加多样性
analytical_model = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
creative_model = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)
practical_model = ChatOpenAI(model="gpt-4o-mini", temperature=0.5)

class State(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    topic: str
    analytical_research: str
    creative_research: str
    practical_research: str

def fan_out_to_researchers(state: State) -> list[Send]:
    return [
        Send("researcher_analytical", state),
        Send("researcher_creative", state),
        Send("researcher_practical", state),
    ]

def dispatcher(state: State) -> dict:
    last_message = state["messages"][-1] if state["messages"] else None
    topic = last_message.content if last_message else ""
    return {"topic": topic}

async def researcher_analytical(state: State) -> dict:
    response = await analytical_model.ainvoke([
        {"role": "system", "content": "You are an analytical research expert."},
        {"role": "user", "content": f"Research: {state['topic']}"},
    ])
    return {
        "analytical_research": response.content,
        "messages": [AIMessage(content=response.content, name="researcher_analytical")],
    }

# 为创意型和实用型研究员定义类似的节点...

workflow = StateGraph(State)
workflow.add_node("dispatcher", dispatcher)
workflow.add_node("researcher_analytical", researcher_analytical)
workflow.add_node("researcher_creative", researcher_creative)
workflow.add_node("researcher_practical", researcher_practical)
workflow.add_edge(START, "dispatcher")
workflow.add_conditional_edges("dispatcher", fan_out_to_researchers)
workflow.add_edge("researcher_analytical", END)
workflow.add_edge("researcher_creative", END)
workflow.add_edge("researcher_practical", END)

agent: CompiledStateGraph = workflow.compile()
```

```tsx [Chat.tsx]
import { useStream } from "@langchain/langgraph-sdk/react";
import type { AgentState } from "./types";
import { MessageBubble } from "./MessageBubble";

// 用于视觉显示的节点配置
const NODE_CONFIG: Record<string, { label: string; color: string }> = {
  researcher_analytical: { label: "Analytical Research", color: "cyan" },
  researcher_creative: { label: "Creative Research", color: "purple" },
  researcher_practical: { label: "Practical Research", color: "emerald" },
};

function MultiAgentChat() {
  const stream = useStream<AgentState>({
    assistantId: "parallel-research",
    apiUrl: "http://localhost:2024",
  });

  return (
    <div className="flex flex-col gap-4">
      {stream.messages.map((message, idx) => {
        if (message.type !== "ai") {
          return <MessageBubble key={message.id ?? idx} message={message} />;
        }

        const metadata = stream.getMessagesMetadata?.(message);
        const nodeName =
          (metadata?.streamMetadata?.langgraph_node as string) ||
          (message as { name?: string }).name;

```typescript types.ts

// 状态与你的 Python 智能体的 State TypedDict 匹配

  topic: string;
  analytical_research: string;
  creative_research: string;
  practical_research: string;
}
```

</CodeGroup>
:::

:::js
<CodeGroup>

```tsx Chat.tsx

// 用于视觉显示的节点配置
const NODE_CONFIG: Record<string, { label: string; color: string }> = {
  researcher_analytical: { label: "分析研究", color: "cyan" },
  researcher_creative: { label: "创意研究", color: "purple" },
  researcher_practical: { label: "实用研究", color: "emerald" },
};

function MultiAgentChat() {
  const stream = useStream<typeof agent>({
assistantId: "parallel-research",
apiUrl: "http://localhost:2024",
  });

  return (
    
<div className="flex flex-col gap-4">

{stream.messages.map((message, idx) => {
  if (message.type !== "ai") {
return <MessageBubble :key="message.id ?? idx" :message="message" />;
  }

  // 获取流式元数据以识别源节点
  const metadata = stream.getMessagesMetadata?.(message);
  const nodeName =
(metadata?.streamMetadata?.langgraph_node as string) ||
(message as { name?: string }).name;

  const config = nodeName ? NODE_CONFIG[nodeName] : null;

  if (!config) {
return <MessageBubble :key="message.id ?? idx" :message="message" />;
  }

  return (
<div
:key="message.id ?? idx"
:className="`bg-${config.color"-950/30 border border-${config.color}-500/30 rounded-xl p-4`}
>
<div :className="`text-sm font-semibold text-${config.color"-400 mb-2`}>
{config.label}

</div>

 
<div className="text-neutral-200 whitespace-pre-wrap">

{typeof message.content === "string" ? message.content : ""}

</div>

 </div>
);
})}
    </div>
  );
}
```

```typescript agent.ts

// 使用不同的模型实例以获得多样性
const analyticalModel = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.3 });
const creativeModel = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.9 });
const practicalModel = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.5 });

// 定义状态模式
const StateAnnotation = z.object({
  messages: withLangGraph(z.custom<BaseMessage[]>(), {
reducer: {
fn: (left: BaseMessage[], right: BaseMessage | BaseMessage[]) =>
Array.isArray(right) ? left.concat(right) : left.concat([right]),
},
default: () => [],
  }),
  topic: z.string().default(""),
  analyticalResearch: z.string().default(""),
  creativeResearch: z.string().default(""),
  practicalResearch: z.string().default(""),
});

type State = z.infer<typeof StateAnnotation>;

// 扇出到并行研究人员
function fanOutToResearchers(state: State): Send[] {
  return [
new Send("researcher_analytical", state),
new Send("researcher_creative", state),
new Send("researcher_practical", state),
  ];
}

async function dispatcherNode(state: State): Promise<Partial<State>> {
  const lastMessage = state.messages.at(-1);
  const topic = typeof lastMessage?.content === "string" ? lastMessage.content : "";
  return { topic };
}

async function analyticalResearcherNode(state: State): Promise<Partial<State>> {
  const response = await analyticalModel.invoke([
{ role: "system", content: "你是一位分析研究专家。专注于数据和证据。" },
{ role: "user", content: `研究主题: ${state.topic}` },
  ]);
  return {
analyticalResearch: response.content as string,
messages: [new AIMessage({ content: response.content as string, name: "researcher_analytical" })],
  };
}

// 创意型和实用型研究人员的类似节点...

// 构建支持并行执行的图
const workflow = new StateGraph(StateAnnotation)
  .addNode("dispatcher", dispatcherNode)
  .addNode("researcher_analytical", analyticalResearcherNode)
  .addNode("researcher_creative", creativeResearcherNode)
  .addNode("researcher_practical", practicalResearcherNode)
  .addEdge(START, "dispatcher")
  .addConditionalEdges("dispatcher", fanOutToResearchers)
  .addEdge("researcher_analytical", END)
  .addEdge("researcher_creative", END)
  .addEdge("researcher_practical", END);

```

</CodeGroup>
:::

<Card title="尝试并行研究示例" icon="users" href="https://github.com/langchain-ai/langgraphjs/tree/main/examples/ui-react/src/examples/parallel-research">
  在 `parallel-research` 示例中查看一个完整的多智能体流式处理实现，包含三个并行研究人员和独特的视觉样式。
</Card>

## 人机协同（Human-in-the-loop）

当智能体需要人工批准才能执行工具时，处理中断。在[如何处理中断](/oss/langgraph/interrupts#pause-using-interrupt)指南中了解更多信息。

:::python
<CodeGroup>

```python agent.py
from langchain import create_agent, tool, human_in_the_loop_middleware
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver

model = ChatOpenAI(model="gpt-4o-mini")

@tool
def send_email(to: str, subject: str, body: str) -> dict:
"""发送电子邮件。需要人工批准。"""
return {
"status": "success",
"content": f'已向 {to} 发送主题为 "{subject}" 的邮件',
}

@tool
def delete_file(path: str) -> dict:
"""删除文件。需要人工批准。"""
return {"status": "success", "content": f'文件 "{path}" 已删除'}

@tool
def read_file(path: str) -> dict:
"""读取文件内容。无需批准。"""
return {"status": "success", "content": f"{path} 的内容..."}

agent = create_agent(
model=model,
tools=[send_email, delete_file, read_file],
middleware=[
human_in_the_loop_middleware(
interrupt_on={
"send_email": {
"allowed_decisions": ["approve", "edit", "reject"],
"description": "📧 发送前审核邮件",
},
"delete_file": {
"allowed_decisions": ["approve", "reject"],
"description": "🗑️ 确认文件删除",
},
"read_file": False,  // 安全 - 自动批准
}
),
],
checkpointer=MemorySaver(),
)
```

```tsx Chat.tsx

function HumanInTheLoopChat() {
  const stream = useStream<AgentState, { InterruptType: HITLRequest }>({
assistantId: "human-in-the-loop",
apiUrl: "http://localhost:2024",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const hitlRequest = stream.interrupt?.value as HITLRequest | undefined;

  const handleApprove = async (index: number) => {
if (!hitlRequest) return;
setIsProcessing(true);

try {
const decisions: HITLResponse["decisions"] =
hitlRequest.actionRequests.map((_, i) =>
i === index ? { type: "approve" } : { type: "approve" }
);

await stream.submit(null, {
command: { resume: { decisions } as HITLResponse },
});
} finally {
setIsProcessing(false);
}
  };

  const handleReject = async (index: number, reason: string) => {
if (!hitlRequest) return;
setIsProcessing(true);

try {
const decisions: HITLResponse["decisions"] =
hitlRequest.actionRequests.map((_, i) =>
i === index
? { type: "reject", message: reason }
: { type: "reject", message: "Rejected along with other actions" }
);

await stream.submit(null, {
command: { resume: { decisions } as HITLResponse },
});
} finally {
setIsProcessing(false);
}
  };

  return (
    <div>
{stream.messages.map((message, idx) => (
 <MessageBubble :key="message.id ?? idx" :message="message" />
))}

{hitlRequest && hitlRequest.actionRequests.length > 0 && (
 <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 mt-4">
 <h3 className="text-amber-400 font-semibold mb-4">
操作需要批准
 </h3>

{hitlRequest.actionRequests.map((action, idx) => (
 <div :key="idx" className="bg-neutral-900 rounded-lg p-4 mb-4 last:mb-0">
 <div className="text-sm font-mono text-white mb-2">{action.name}</div>
 <pre className="text-xs bg-black rounded p-2 mb-3 overflow-x-auto">
{JSON.stringify(action.args, null, 2)}
 </pre>
 
<div className="flex gap-2">

<button
  onClick={() => handleApprove(idx)}
  disabled={isProcessing}
  className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg"
>
  批准
</button>
<button
  onClick={() => handleReject(idx, "用户已拒绝")}
  disabled={isProcessing}
  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg"
>
  拒绝
</button>

</div>

 </div>
))}
 </div>
)}
    </div>
  );
}
```

```typescript types.ts

// 与您的 Python 智能体匹配的工具调用类型

  name: "send_email";
  args: { to: string; subject: string; body: string };
  id?: string;
};

  name: "delete_file";
  args: { path: string };
  id?: string;
};

  name: "read_file";
  args: { path: string };
  id?: string;
};

}

// 人机协同（HITL）类型

args: Record<string, unknown>;
  }>;
}

    | { type: "edit"; newArgs: Record<string, unknown> }
  >;
}
```

</CodeGroup>
:::

:::js
<CodeGroup>

```tsx Chat.tsx

function HumanInTheLoopChat() {
  const stream = useStream<typeof agent, { InterruptType: HITLRequest }>({
assistantId: "human-in-the-loop",
apiUrl: "http://localhost:2024",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // 对中断值的类型断言
  const hitlRequest = stream.interrupt?.value as HITLRequest | undefined;

  const handleApprove = async (index: number) => {
if (!hitlRequest) return;
setIsProcessing(true);

try {
const decisions: HITLResponse["decisions"] =
hitlRequest.actionRequests.map((_, i) =>
i === index ? { type: "approve" } : { type: "approve" }
);

await stream.submit(null, {
command: {
resume: { decisions } as HITLResponse,
},
});
} finally {
setIsProcessing(false);
}
  };

  const handleReject = async (index: number, reason: string) => {
if (!hitlRequest) return;
setIsProcessing(true);

try {
const decisions: HITLResponse["decisions"] =
hitlRequest.actionRequests.map((_, i) =>
i === index
? { type: "reject", message: reason }
: { type: "reject", message: "Rejected along with other actions" }
);

await stream.submit(null, {
command: {
resume: { decisions } as HITLResponse,
},
});
} finally {
setIsProcessing(false);
}
  };

  return (
    <div>
 
{stream.messages.map((message, idx) => (
 <MessageBubble :key="message.id ?? idx" :message="message" />
))}

 
{hitlRequest && hitlRequest.actionRequests.length > 0 && (
 <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 mt-4">
 <h3 className="text-amber-400 font-semibold mb-4">
操作需要审批
 </h3>

{hitlRequest.actionRequests.map((action, idx) => (
 <div
:key="idx"
className="bg-neutral-900 rounded-lg p-4 mb-4 last:mb-0"
>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-sm font-mono text-white">
{action.name}
 </span>
 </div>

 <pre className="text-xs bg-black rounded p-2 mb-3 overflow-x-auto">
{JSON.stringify(action.args, null, 2)}
 </pre>

 
<div className="flex gap-2">

<button
  onClick={() => handleApprove(idx)}
  disabled={isProcessing}
  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded disabled:opacity-50"
>
  批准
</button>
<button
  onClick={() => handleReject(idx, "User rejected")}
  disabled={isProcessing}
  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded disabled:opacity-50"
>
  拒绝
</button>

</div>

 </div>
))}
 </div>
)}
    </div>
  );
}
```

```typescript agent.ts

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

// 需要人工批准的工具
const sendEmail = tool(
  async ({ to, subject, body }) => {
return {
status: "success",
content: `Email sent to ${to} with subject "${subject}"`,
};
  },
  {
name: "send_email",
description: "发送电子邮件。需要人工批准。",
schema: z.object({
to: z.string().describe("收件人邮箱地址"),
subject: z.string().describe("邮件主题"),
body: z.string().describe("邮件正文"),
}),
  }
);

// 需要批准且选项有限的工具
const deleteFile = tool(
  async ({ path }) => {
return { status: "success", content: `File "${path}" deleted` };
  },
  {
name: "delete_file",
description: "删除文件。需要人工批准。",
schema: z.object({
path: z.string().describe("要删除的文件路径"),
}),
  }
);

// 安全工具 - 无需批准
const readFile = tool(
  async ({ path }) => {
return { status: "success", content: `Contents of ${path}...` };
  },
  {
name: "read_file",
description: "读取文件内容。无需批准。",
schema: z.object({
path: z.string().describe("要读取的文件路径"),
}),
  }
);

// 创建带有人机协同（human-in-the-loop）中间件的智能体（agent）

  model,
  tools: [sendEmail, deleteFile, readFile],
  middleware: [
humanInTheLoopMiddleware({
interruptOn: {
// 电子邮件需要所有决策类型
send_email: {
allowedDecisions: ["approve", "edit", "reject"],
description: "📧 发送前审核邮件",
},
// 删除操作仅允许批准/拒绝
delete_file: {
allowedDecisions: ["approve", "reject"],
description: "🗑️ 确认文件删除",
},
// 读取操作是安全的 - 自动批准
read_file: false,
},
}),
  ],
  // 人机协同（human-in-the-loop）必需 - 在中断期间持久化状态
  checkpointer: new MemorySaver(),
});
```

</CodeGroup>
:::

<Card title="尝试人机协同（human-in-the-loop）示例" icon="hand" href="https://github.com/langchain-ai/langgraphjs/tree/main/examples/ui-react/src/examples/human-in-the-loop">
  在 `human-in-the-loop` 示例中查看包含批准、拒绝和编辑操作的完整审批工作流实现。
</Card>

## 推理模型

<Warning>
扩展推理/思考支持目前处于实验阶段。推理令牌（reasoning tokens）的流式接口因提供商（OpenAI 与 Anthropic）而异，并可能随着抽象层的开发而改变。
</Warning>

当使用具有扩展推理能力的模型（如 OpenAI 的推理模型或 Anthropic 的扩展思考）时，思考过程会嵌入到消息内容中。您需要单独提取并显示它。

:::python
<CodeGroup>

```python agent.py
from langchain import create_agent
from langchain_openai import ChatOpenAI

# 使用具备推理能力的模型
# OpenAI: o1, o1-mini, o1-preview
# Anthropic: 启用扩展思考的 claude-sonnet-4-20250514
model = ChatOpenAI(model="o1-mini")

agent = create_agent(
model=model,
tools=[],  # 推理模型最适合复杂的推理任务
)
```

```tsx Chat.tsx

function ReasoningChat() {
  const stream = useStream<AgentState>({
assistantId: "reasoning-agent",
apiUrl: "http://localhost:2024",
  });

  return (
    
<div className="flex flex-col gap-4">

{stream.messages.map((message, idx) => {
  if (message.type === "ai") {
const reasoning = getReasoningFromMessage(message);
const textContent = getTextContent(message);

return (
<div :key="message.id ?? idx">
{reasoning && (
<div className="mb-4">
<div className="text-xs font-medium text-amber-400/80 mb-2">
推理过程

</div>

 
<div className="bg-amber-950/50 border border-amber-500/20 rounded-2xl px-4 py-3">

<div className="text-sm text-amber-100/90 whitespace-pre-wrap">
  {reasoning}

</div>

 </div>
 </div>
)}

{textContent && (
 
<div className="text-neutral-100 whitespace-pre-wrap">

{textContent}

</div>

)}
 </div>
);
}

return <MessageBubble :key="message.id ?? idx" :message="message" />;
})}

{stream.isLoading && (
 
<div className="flex items-center gap-2 text-amber-400/70">

<span className="text-sm">思考中...</span>

</div>

)}
    </div>
  );
}
```

```typescript types.ts

}
```

```typescript utils.ts

/**
 * 从 AI 消息中提取推理/思考内容。
 * 同时支持 OpenAI 推理和 Anthropic 扩展思考。
 */

additional_kwargs?: {
reasoning?: {
summary?: Array<{ type: string; text: string }>;
};
};
contentBlocks?: Array<{ type: string; thinking?: string }>;
  };

  const msg = message as MessageWithExtras;

  // 检查 additional_kwargs 中是否存在 OpenAI 推理
  if (msg.additional_kwargs?.reasoning?.summary) {
const content = msg.additional_kwargs.reasoning.summary
.filter((item) => item.type === "summary_text")
.map((item) => item.text)
.join("");
if (content.trim()) return content;
  }

  // 检查 contentBlocks 中是否存在 Anthropic 思考
  if (msg.contentBlocks?.length) {
const thinking = msg.contentBlocks
.filter((b) => b.type === "thinking" && b.thinking)
.map((b) => b.thinking)
.join("\n");
if (thinking) return thinking;
  }

  // 检查 message.content 数组中是否存在思考内容
  if (Array.isArray(msg.content)) {
const thinking = msg.content
.filter((b): b is { type: "thinking"; thinking: string } =>
typeof b === "object" && b?.type === "thinking" && "thinking" in b
)
.map((b) => b.thinking)
.join("\n");
if (thinking) return thinking;
  }

  return undefined;
}

/**
 * 从消息中提取文本内容。
 */

  if (Array.isArray(message.content)) {
return message.content
.filter((c): c is { type: "text"; text: string } => c.type === "text")
.map((c) => c.text)
.join("");
  }
  return "";
}
```

</CodeGroup>
:::

:::js
<CodeGroup>

```tsx Chat.tsx

function ReasoningChat() {
  const stream = useStream<typeof agent>({
assistantId: "reasoning-agent",
apiUrl: "http://localhost:2024",
  });

  return (
    
<div className="flex flex-col gap-4">

{stream.messages.map((message, idx) => {
  if (message.type === "ai") {
const reasoning = getReasoningFromMessage(message);
const textContent = getTextContent(message);

return (
<div :key="message.id ?? idx">

{reasoning && (
<div className="mb-4">
<div className="text-xs font-medium text-amber-400/80 mb-2">
推理

</div>

 
<div className="bg-amber-950/50 border border-amber-500/20 rounded-2xl px-4 py-3">

<div className="text-sm text-amber-100/90 whitespace-pre-wrap">
  {reasoning}

</div>

 </div>
 </div>
)}

    
{textContent && (
 
<div className="text-neutral-100 whitespace-pre-wrap">

{textContent}

</div>

)}
  </div>
);
}

return <MessageBubble :key="message.id ?? idx" :message="message" />;
})}

{stream.isLoading && (

<div className="flex items-center gap-2 text-amber-400/70">

<span className="text-sm">思考中...</span>

</div>

)}
</div>
);
}
```

```typescript utils.ts

/**
 * 从 AI 消息中提取推理/思考内容。
 * 同时支持 OpenAI 推理 (additional_kwargs.reasoning.summary)
 * 和 Anthropic 扩展思考 (类型为 "thinking" 的内容块)。
 */

additional_kwargs?: {
reasoning?: {
summary?: Array<{ type: string; text: string }>;
};
};
contentBlocks?: Array<{ type: string; thinking?: string }>;
  };

  const msg = message as MessageWithExtras;

  // 检查 additional_kwargs 中是否存在 OpenAI 推理
  if (msg.additional_kwargs?.reasoning?.summary) {
const content = msg.additional_kwargs.reasoning.summary
.filter((item) => item.type === "summary_text")
.map((item) => item.text)
.join("");

if (content.trim()) return content;
  }

  // 检查 contentBlocks 中是否存在 Anthropic 思考
  if (msg.contentBlocks?.length) {
const thinking = msg.contentBlocks
.filter((b) => b.type === "thinking" && b.thinking)
.map((b) => b.thinking)
.join("\n");

if (thinking) return thinking;
  }

  // 检查 message.content 数组中是否存在思考内容
  if (Array.isArray(msg.content)) {
const thinking = msg.content
.filter((b): b is { type: "thinking"; thinking: string } =>
typeof b === "object" && b?.type === "thinking" && "thinking" in b
)
.map((b) => b.thinking)
.join("\n");

if (thinking) return thinking;
  }

  return undefined;
}

/**
 * 从消息中提取文本内容。
 */

  if (Array.isArray(message.content)) {
return message.content
.filter((c): c is { type: "text"; text: string } => c.type === "text")
.map((c) => c.text)
.join("");
  }

  return "";
}
```

</CodeGroup>
:::

<Card title="尝试推理示例" icon="brain" href="https://github.com/langchain-ai/langgraphjs/tree/main/examples/ui-react/src/examples/reasoning-agent">
  在 `reasoning-agent` 示例中查看使用 OpenAI 和 Anthropic 模型展示推理令牌的完整实现。
</Card>

## 自定义状态类型

对于自定义的 LangGraph 应用程序，请将您的工具调用类型嵌入到状态的 messages 属性中。

:::js

```tsx

// 将您的工具调用类型定义为可辨识联合类型
type MyToolCalls =
  | { name: "search"; args: { query: string }; id?: string }
  | { name: "calculate"; args: { expression: string }; id?: string };

// 在状态消息中嵌入工具调用类型
interface MyGraphState {
  messages: Message<MyToolCalls>[];
  context?: string;
}

function CustomGraphChat() {
  const stream = useStream<MyGraphState>({
assistantId: "my-graph",
apiUrl: "http://localhost:2024",
  });

  // stream.values 被类型化为 MyGraphState
  // stream.toolCalls[0].call.name 被类型化为 "search" | "calculate"
}
```

你也可以为中断（interrupts）和可配置选项指定额外的类型配置：

```tsx
interface MyGraphState {
  messages: Message<MyToolCalls>[];
}

function CustomGraphChat() {
  const stream = useStream<
MyGraphState,
{
InterruptType: { question: string };
ConfigurableType: { userId: string };
}
  >({
assistantId: "my-graph",
apiUrl: "http://localhost:2024",
  });

  // stream.interrupt 被类型化为 { question: string } | undefined
}
```
:::

## 自定义传输

对于自定义 API 端点或非标准部署，可以使用 `transport` 选项配合 `FetchStreamTransport` 来连接到任何流式 API。

:::js

```tsx

function CustomAPIChat({ apiKey }: { apiKey: string }) {
  // 创建带有自定义请求处理的传输器
  const transport = useMemo(() => {
return new FetchStreamTransport({
apiUrl: "/api/my-agent",
onRequest: async (url: string, init: RequestInit) => {
// 将 API 密钥或其他自定义数据注入请求
const customBody = JSON.stringify({
...(JSON.parse(init.body as string) || {}),
apiKey,
});

return {
...init,
body: customBody,
headers: {
...init.headers,
"X-Custom-Header": "value",
},
};
},
});
  }, [apiKey]);

  const stream = useStream({
transport,
  });

  // 正常使用 stream
  return (
    <div>
{stream.messages.map((message, idx) => (
 <MessageBubble :key="message.id ?? idx" :message="message" />
))}
    </div>
  );
}
```

## 相关

- [流式处理概述](/oss/python/langchain/streaming/overview) — 使用 LangChain 智能体进行服务器端流式处理
- [useStream API 参考](https://reference.langchain.com/javascript/functions/_langchain_langgraph-sdk.react.useStream.html) — 完整的 API 文档
- [智能体聊天界面](/oss/python/langchain/ui) — LangGraph 智能体的预构建聊天界面
- [人机协同](/oss/python/langchain/human-in-the-loop) — 配置人工审核的中断
- [多智能体系统](/oss/python/langchain/multi-agent) — 构建使用多个 LLM 的智能体
