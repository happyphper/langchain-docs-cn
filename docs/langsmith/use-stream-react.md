---
title: 如何在 React 应用中集成 LangGraph
sidebarTitle: Integrate LangGraph into your React application
---

<Info>

<strong>先决条件</strong>
* [LangSmith](/langsmith/home)
* [Agent Server](/langsmith/agent-server)

</Info>

[`useStream()`](https://reference.langchain.com/javascript/functions/_langchain_langgraph-sdk.react.useStream.html) React Hook 提供了一种无缝的方式，将 LangGraph 集成到你的 React 应用程序中。它处理了流式传输、状态管理和分支逻辑的所有复杂性，让你可以专注于构建出色的聊天体验。

主要特性：

* 消息流式传输：处理消息块流以形成完整的消息
* 消息、中断、加载状态和错误的自动状态管理
* 对话分支：从聊天历史中的任意点创建替代对话路径
* 与 UI 无关的设计：使用你自己的组件和样式

让我们探索如何在你的 React 应用程序中使用 [`useStream()`](https://reference.langchain.com/javascript/functions/_langchain_langgraph-sdk.react.useStream.html)。

[`useStream()`](https://reference.langchain.com/javascript/functions/_langchain_langgraph-sdk.react.useStream.html) 为创建定制化的聊天体验奠定了坚实的基础。对于预构建的聊天组件和界面，我们也推荐查看 [CopilotKit](https://docs.copilotkit.ai/coagents/quickstart/langgraph) 和 [assistant-ui](https://www.assistant-ui.com/docs/runtimes/langgraph)。

## 安装 SDK

```bash
npm install @langchain/langgraph-sdk @langchain/core
```

## 示例

```tsx
"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";

export default function App() {
  const thread = useStream<{ messages: Message[] }>({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    messagesKey: "messages",
  });

  return (
    <div>
      <div>
        {thread.messages.map((message) => (
          <div key={message.id}>{message.content as string}</div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const message = new FormData(form).get("message") as string;

          form.reset();
          thread.submit({ messages: [{ type: "human", content: message }] });
        }}
      >
        <input type="text" name="message" />

        {thread.isLoading ? (
          <button key="stop" type="button" onClick={() => thread.stop()}>
            Stop
          </button>
        ) : (
          <button keytype="submit">Send</button>
        )}
      </form>
    </div>
  );
}
```

## 自定义你的 UI

[`useStream()`](https://reference.langchain.com/javascript/functions/_langchain_langgraph-sdk.react.useStream.html) Hook 在幕后处理了所有复杂的状态管理，为你提供了构建 UI 的简单接口。以下是开箱即用的功能：

* 线程状态管理
* 加载和错误状态
* 中断
* 消息处理和更新
* 分支支持

以下是一些如何有效使用这些功能的示例：

### 加载状态

`isLoading` 属性告诉你何时有流处于活动状态，使你能够：

* 显示加载指示器
* 在处理期间禁用输入字段
* 显示取消按钮

```tsx
export default function App() {
  const { isLoading, stop } = useStream<{ messages: Message[] }>({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    messagesKey: "messages",
  });

  return (
    <form>
      {isLoading && (
        <button key="stop" type="button" onClick={() => stop()}>
          Stop
        </button>
      )}
    </form>
  );
}
```

### 页面刷新后恢复流

[`useStream()`](https://reference.langchain.com/javascript/functions/_langchain_langgraph-sdk.react.useStream.html) Hook 可以通过设置 `reconnectOnMount: true` 在挂载时自动恢复正在进行的运行。这对于在页面刷新后继续流式传输非常有用，确保不会丢失停机期间生成的消息和事件。

```tsx
const thread = useStream<{ messages: Message[] }>({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
  reconnectOnMount: true,
});
```

默认情况下，创建的运行 ID 存储在 `window.sessionStorage` 中，可以通过在 `reconnectOnMount` 中传递自定义存储来替换。该存储用于持久化线程的正在运行的运行 ID（键为 `lg:stream:${threadId}`）。

```tsx
const thread = useStream<{ messages: Message[] }>({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
  reconnectOnMount: () => window.localStorage,
});
```

你也可以通过使用运行回调来持久化运行元数据，并使用 `joinStream` 函数来恢复流，从而手动管理恢复过程。确保在创建运行时传递 `streamResumable: true`；否则可能会丢失一些事件。

```tsx
import type { Message } from "@langchain/langgraph-sdk";
import { useStream } from "@langchain/langgraph-sdk/react";
import { useCallback, useState, useEffect, useRef } from "react";

export default function App() {
  const [threadId, onThreadId] = useSearchParam("threadId");

  const thread = useStream<{ messages: Message[] }>({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",

    threadId,
    onThreadId,

    onCreated: (run) => {
      window.sessionStorage.setItem(`resume:${run.thread_id}`, run.run_id);
    },
    onFinish: (_, run) => {
      window.sessionStorage.removeItem(`resume:${run?.thread_id}`);
    },
  });

  // 确保每个线程只加入流一次。
  const joinedThreadId = useRef<string | null>(null);
  useEffect(() => {
    if (!threadId) return;

    const resume = window.sessionStorage.getItem(`resume:${threadId}`);
    if (resume && joinedThreadId.current !== threadId) {
      thread.joinStream(resume);
      joinedThreadId.current = threadId;
    }
  }, [threadId]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const message = new FormData(form).get("message") as string;
        thread.submit(
          { messages: [{ type: "human", content: message }] },
          { streamResumable: true }
        );
      }}
    >
      <div>
        {thread.messages.map((message) => (
          <div key={message.id}>{message.content as string}</div>
        ))}
      </div>
      <input type="text" name="message" />
      <button type="submit">Send</button>
    </form>
  );
}

// 用于检索和持久化 URL 中搜索参数的实用方法
function useSearchParam(key: string) {
  const [value, setValue] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) ?? null;
  });

  const update = useCallback(
    (value: string | null) => {
      setValue(value);

      const url = new URL(window.location.href);
      if (value == null) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }

      window.history.pushState({}, "", url.toString());
    },
    [key]
  );

  return [value, update] as const;
}
```

### 线程管理

使用内置的线程管理来跟踪对话。你可以访问当前线程 ID，并在创建新线程时收到通知：

```tsx
const [threadId, setThreadId] = useState<string | null>(null);

const thread = useStream<{ messages: Message[] }>({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",

  threadId: threadId,
  onThreadId: setThreadId,
});
```

我们建议将 `threadId` 存储在 URL 的查询参数中，以便用户在页面刷新后可以恢复对话。

### 消息处理

[`useStream()`](https://reference.langchain.com/javascript/functions/_langchain_langgraph-sdk.react.useStream.html) Hook 将跟踪从服务器接收到的消息块，并将它们连接起来形成完整的消息。完成的消息块可以通过 `messages` 属性获取。

默认情况下，`messagesKey` 设置为 `messages`，新的消息块将附加到 `values["messages"]`。如果你将消息存储在不同的键中，可以更改 `messagesKey` 的值。

```tsx
import type { Message } from "@langchain/langgraph-sdk";
import { useStream } from "@langchain/langgraph-sdk/react";

export default function HomePage() {
  const thread = useStream<{ messages: Message[] }>({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    messagesKey: "messages",
  });

  return (
    <div>
      {thread.messages.map((message) => (
        <div key={message.id}>{message.content as string}</div>
      ))}
    </div>
  );
}
```

在底层，[`useStream()`](https://reference.langchain.com/javascript/functions/_langchain_langgraph-sdk.react.useStream.html) 自动订阅多个[流模式](/langsmith/streaming#supported-stream-modes)，以提供图执行的全貌。`messages` 属性专门使用 `messages-tuple` 模式来接收来自聊天模型调用的单个 LLM 令牌。在[流式传输](/langsmith/streaming#messages)指南中了解更多关于消息流式传输的信息。

### 访问完整的图状态

除了消息之外，你还可以通过 `values` 属性访问完整的图状态。这包括你的图维护的任何状态，而不仅仅是对话历史：

```tsx
const thread = useStream<{ messages: Message[]; context: string; metadata: Record<string, unknown> }>({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
  messagesKey: "messages",
});

// 访问完整状态
console.log(thread.values);
// { messages: [...], context: "...", metadata: {...} }
```

这是由底层的 `values` 流模式驱动的，它在每个图步骤之后流式传输完整状态。

### 中断

[`useStream()`](https://reference.langchain.com/javascript/functions/_langchain_langgraph-sdk.react.useStream.html) Hook 暴露了 `interrupt` 属性，该属性将填充线程中的最后一个中断。你可以使用中断来：

* 在执行节点之前渲染确认 UI
* 等待人工输入，允许代理向用户询问澄清性问题

在[如何处理中断](/oss/langgraph/interrupts#pause-using-interrupt)指南中了解更多关于中断的信息。

```tsx
const thread = useStream<{ messages: Message[] }, { InterruptType: string }>({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
  messagesKey: "messages",
});

if (thread.interrupt) {
  return (
    <div>
      Interrupted! {thread.interrupt.value}
      <button
        type="button"
        onClick={() => {
          // `resume` 可以是代理接受的任何值
          thread.submit(undefined, { command: { resume: true } });
        }}
      >
        Resume
      </button>
    </div>
  );
}
```

### 分支

对于每条消息，你可以使用 `getMessagesMetadata()` 来获取消息首次出现时的第一个检查点。然后，你可以从首次出现检查点之前的检查点创建一个新的运行，以在线程中创建一个新的分支。

可以通过以下方式创建分支：

1. 编辑之前的用户消息。
2. 请求重新生成之前的助手消息。

```tsx
"use client";

import type { Message } from "@langchain/langgraph-sdk";
import { useStream } from "@langchain/langgraph-sdk/react";
import { useState } from "react";

function BranchSwitcher({
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
        onClick={() => {
          const prevBranch = branchOptions[index - 1];
          if (!prevBranch) return;
          onSelect(prevBranch);
        }}
      >
        Prev
      </button>
      <span>
        {index + 1} / {branchOptions.length}
      </span>
      <button
        type="button"
        onClick={() => {
          const nextBranch = branchOptions[index + 1];
          if (!nextBranch) return;
          onSelect(nextBranch);
        }}
      >
        Next
      </button>
    </div>
  );
}

function EditMessage({
  message,
  onEdit,
}: {
  message: Message;
  onEdit: (message: Message) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <button type="button" onClick={() => setEditing(true)}>
        Edit
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const content = new FormData(form).get("content") as string;

        form.reset();
        onEdit({ type: "human", content });
        setEditing(false);
      }}
    >
      <input name="content" defaultValue={message.content as string} />
      <button type="submit">Save</button>
    </form>
  );
}

export default function App() {
  const thread = useStream({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    messagesKey: "messages",
  });

  return (
    <div>
      <div>
        {thread.messages.map((message) => {
          const meta = thread.getMessagesMetadata(message);
          const parentCheckpoint = meta?.firstSeenState?.parent_checkpoint;

          return (
            <div key={message.id}>
              <div>{message.content as string}</div>

              {message.type === "human" && (
                <EditMessage
                  message={message}
                  onEdit={(message) =>
                    thread.submit(
                      { messages: [message] },
                      { checkpoint: parentCheckpoint }
                    )
                  }
                />
              )}

              {message.type === "ai" && (
                <button
                  type="button"
                  onClick={() =>
                    thread.submit(undefined, { checkpoint: parentCheckpoint })
                  }
                >
                  <span>Regenerate</span>
                </button>
              )}

              <BranchSwitcher
                branch={meta?.branch}
                branchOptions={meta?.branchOptions}
                onSelect={(branch) => thread.setBranch(branch)}
              />
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const message = new FormData(form).get("message") as string;

          form.reset();
          thread.submit({ messages: [message] });
        }}
      >
        <input type="text" name="message" />

        {thread.isLoading ? (
          <button key="stop" type="button" onClick={() => thread.stop()}>
            Stop
          </button>
        ) : (
          <button key="submit" type="submit">
            Send
          </button>
        )}
      </form>
    </div>
  );
}
```

对于高级用例，你可以使用 `experimental_branchTree` 属性来获取线程的树形表示，这可用于为非基于消息的图渲染分支控件。

### 乐观更新

你可以在向代理执行网络请求之前乐观地更新客户端状态，从而允许你向用户提供即时反馈，例如在代理看到请求之前立即显示用户消息。

```tsx
const stream = useStream({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
  messagesKey: "messages",
});

const handleSubmit = (text: string) => {
  const newMessage = { type: "human" as const, content: text };

  stream.submit(
    { messages: [newMessage] },
    {
      optimisticValues(prev) {
        const prevMessages = prev.messages ?? [];
        const newMessages = [...prevMessages, newMessage];
        return { ...prev, messages: newMessages };
      },
    }
  );
};
```

### 缓存的线程显示

使用 `initialValues` 选项在从服务器加载历史记录时立即显示缓存的线程数据。这通过在导航到现有线程时立即显示缓存数据来改善用户体验。

```tsx
import { useStream } from "@langchain/langgraph-sdk/react";

const CachedThreadExample = ({ threadId, cachedThreadData }) => {
  const stream = useStream({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    threadId,
    // 在历史记录加载时立即显示缓存数据
    initialValues: cachedThreadData?.values,
    messagesKey: "messages",
  });

  return (
    <div>
      {stream.messages.map((message) => (
        <div key={message.id}>{message.content as string}</div>
      ))}
    </div>
  );
};
```

### 乐观的线程创建

在 `submit` 函数中使用 `threadId` 选项，以启用乐观 UI 模式，在这种模式下，你需要在线程实际创建之前知道线程 ID。

```tsx

const OptimisticThreadExample = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [optimisticThreadId] = useState(() => crypto.randomUUID());

  const stream = useStream({
apiUrl: "http://localhost:2024",
assistantId: "agent",
threadId,
onThreadId: setThreadId, // (3) 在线程创建后更新。
messagesKey: "messages",
  });

  const handleSubmit = (text: string) => {
// (1) 执行软导航到 /threads/${optimisticThreadId}
// 无需等待线程创建。
window.history.pushState({},
