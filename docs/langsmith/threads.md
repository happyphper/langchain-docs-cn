---
title: 配置线程
sidebarTitle: Threads
---
许多 LLM 应用都具备类似聊天机器人的界面，用户与 LLM 应用之间会进行多轮对话。为了追踪这些对话，您可以使用 LangSmith 中的 `Threads`（线程）功能。

## 将追踪记录分组到线程中

一个 `Thread`（线程）是代表单次对话的一系列追踪记录。每个响应都表示为它自己的追踪记录，但这些追踪记录通过属于同一个线程而链接在一起。

要将追踪记录关联在一起，您需要传入一个特殊的 `metadata` 键，其值是该线程的唯一标识符。键名应为以下之一：

- `session_id`
- `thread_id`
- `conversation_id`

值可以是您想要的任何字符串，但我们建议使用 UUID，例如 `f47ac10b-58cc-4372-a567-0e02b2c3d479`。请查看[本指南](./add-metadata-tags)了解如何向追踪记录添加元数据。

### 示例

此示例演示了如何使用结构化的消息格式来记录和检索对话历史，以维持长时间的聊天会话。

::: code-group

```python [Python]
import os
from typing import List, Dict, Any, Optional

import openai
from langsmith import traceable, Client
import langsmith as ls
from langsmith.wrappers import wrap_openai

# 初始化客户端
client = wrap_openai(openai.Client())
langsmith_client = Client()

# 配置
LANGSMITH_PROJECT = "project-with-threads"
THREAD_ID = "thread-id-1"
langsmith_extra={"project_name": LANGSMITH_PROJECT, "metadata":{"session_id": THREAD_ID}}

# 获取线程中所有 LLM 调用的历史记录以构建对话历史
def get_thread_history(thread_id: str, project_name: str):
    # 按特定线程和项目筛选运行记录
    filter_string = f'and(in(metadata_key, ["session_id","conversation_id","thread_id"]), eq(metadata_value, "{thread_id}"))'
    # 仅获取 LLM 运行记录
    runs = [r for r in langsmith_client.list_runs(project_name=project_name, filter=filter_string, run_type="llm")]

    # 按开始时间排序以获取最近的交互
    runs = sorted(runs, key=lambda run: run.start_time, reverse=True)

    # 重建对话状态
    latest_run = runs[0]
    return latest_run.inputs['messages'] + [latest_run.outputs['choices'][0]['message']]

@traceable(name="Chat Bot")
def chat_pipeline(messages: list, get_chat_history: bool = False):
    # 是继续现有线程还是开始新线程
    if get_chat_history:
        run_tree = ls.get_current_run_tree()
        # 获取现有对话历史并追加新消息
        history_messages = get_thread_history(run_tree.extra["metadata"]["session_id"], run_tree.session_name)
        all_messages = history_messages + messages
        # 为了追踪，在输入中包含完整的对话
        input_messages = all_messages
    else:
        all_messages = messages
        input_messages = messages

    # 调用模型
    chat_completion = client.chat.completions.create(
        model="gpt-4o-mini", messages=all_messages
    )

    # 返回包含输入和响应的完整对话
    response_message = chat_completion.choices[0].message
    return {
        "messages": input_messages + [response_message]
    }

# 格式化消息
messages = [
    {
        "content": "Hi, my name is Sally",
        "role": "user"
    }
]
get_chat_history = False

# 调用聊天管道
result = chat_pipeline(messages, get_chat_history, langsmith_extra=langsmith_extra)
```

```typescript [TypeScript]
import 'dotenv/config';
import OpenAI from 'openai';
import { traceable, getCurrentRunTree } from 'langsmith/traceable';
import { Client } from 'langsmith';
import { wrapOpenAI } from 'langsmith/wrappers';

// 初始化客户端
const openai = new OpenAI();
const client = wrapOpenAI(openai);
const langsmithClient = new Client();

// 配置
const LANGSMITH_PROJECT = "project-with-threads";
const THREAD_ID = "thread-id-1";
const langsmithExtra = {
  project_name: LANGSMITH_PROJECT,
  metadata: { session_id: THREAD_ID }
};

// 消息类型定义
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  messages: Message[];
}

interface ChatInput {
  get_chat_history: boolean;
  messages: Message[];
}

// 获取线程中所有 LLM 调用的历史记录以构建对话历史
async function getThreadHistory(threadId: string, projectName: string): Promise<Message[]> {
  // 按特定线程和项目筛选运行记录
  const filterString = `and(in(metadata_key, ["session_id","conversation_id","thread_id"]), eq(metadata_value, "${threadId}"))`;

  // 仅获取 LLM 运行记录
  const runs: any[] = [];
  for await (const run of langsmithClient.listRuns({
    projectName: projectName,
    filter: filterString,
    runType: "llm"
  })) {
    if (run.run_type === "llm") {
      runs.push(run);
    }
  }

  // 按开始时间排序以获取最近的交互
  runs.sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  // 检查是否有任何运行记录
  if (runs.length === 0) {
    return [];
  }

  // 对话的当前状态
  const latestRun = runs[0];
  const inputMessages = latestRun.inputs.messages as Message[];
  const outputMessage = latestRun.outputs.choices[0].message as Message;

  return [...inputMessages, outputMessage];
}

// 更新后的聊天管道，接受 JSON 输入格式
const chatPipeline = traceable(async (input: ChatInput): Promise<ChatResponse> => {
  const { messages, get_chat_history } = input;
  let allMessages: Message[];
  let inputMessages: Message[];

  // 是继续现有线程还是开始新线程
  if (get_chat_history) {
    const runTree = getCurrentRunTree();
    // 获取现有对话历史并追加新消息
    const sessionId = runTree.extra?.metadata?.session_id || THREAD_ID;
    const historyMessages = await getThreadHistory(
      sessionId,
      runTree.project_name
    );
    allMessages = historyMessages.concat(messages);
    // 为了追踪，在输入中包含完整的对话
    inputMessages = allMessages;
  } else {
    allMessages = messages;
    inputMessages = messages;
  }

  // 调用模型
  const chatCompletion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: allMessages
  });

  // 返回包含输入和响应的完整对话
  const responseMessage = chatCompletion.choices[0].message as Message;
  return {
    messages: [...inputMessages, responseMessage]
  };
}, { name: "Chat Bot" });

// 请求的 JSON 格式的示例输入
const input: ChatInput = {
  get_chat_history: false,
  messages: [
    {
      content: "Hi, my name is Sally",
      role: "user"
    }
  ]
};

// 调用聊天管道
const result = await chatPipeline(input);
```

:::

等待几秒钟后，您可以进行以下调用来继续对话。通过传递 `get_chat_history=True,`/`getChatHistory: true`，您可以从上次中断的地方继续对话。这意味着 LLM 将接收整个消息历史记录并对其进行响应，而不仅仅是响应最新的消息。

::: code-group

```python [Python]
# 继续对话。
messages = [
    {
        "content": "What is my name?",
        "role": "user"
    }
]
get_chat_history = True

chat_pipeline(messages, get_chat_history, langsmith_extra=langsmith_extra)
```

```typescript [TypeScript]
// 继续对话。
const input: ChatInput = {
  get_chat_history: true,
  messages: [
    {
      content: "What is my name?",
      role: "user"
    }
  ]
};

await chatPipeline(input);
```

:::

继续对话。由于包含了过去的消息，LLM 将记住对话内容。

::: code-group

```python [Python]
# 继续对话。
messages = [
    {
        "content": "What was the first message I sent you?",
        "role": "user"
    }
]
get_chat_history = True

chat_pipeline(messages, get_chat_history, langsmith_extra=langsmith_extra)
```

```typescript [TypeScript]
// 继续对话。
const input: ChatInput = {
  get_chat_history: true,
  messages: [
    {
      content: "What was the first message I sent you?",
      role: "user"
    }
  ]
};

await chatPipeline(input);
```

:::

## 查看线程

您可以在任何项目详情页面中点击 **Threads** 选项卡来查看线程。然后您将看到所有线程的列表，按最近的活动排序。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/threads-tab-light.png" alt="LangSmith UI showing the threads table." />

<img src="/langsmith/images/threads-tab-dark.png" alt="LangSmith UI showing the threads table." />

</div>

<Callout type="info" icon="bird">

在线程视图中使用 <strong>[Polly](/langsmith/polly)</strong> 来分析对话线程、理解用户情绪、识别痛点并跟踪问题是否得到解决。

</Callout>

### 查看线程

然后您可以点击进入特定的线程。这将打开特定线程的历史记录。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/thread-overview-light.png" alt="LangSmith UI showing the threads table." />

<img src="/langsmith/images/thread-overview-dark.png" alt="LangSmith UI showing the threads table." />

</div>

线程可以以两种不同的方式查看：

- [线程概览](/langsmith/threads#thread-overview)
- [追踪视图](/langsmith/threads#trace-view)

您可以使用页面顶部的按钮在两种视图之间切换，或使用键盘快捷键 `T` 在两种视图之间切换。

#### 线程概览

线程概览页面向您展示了一个类似聊天机器人的用户界面，您可以在其中看到对话每一轮的输入和输出。您可以配置在概览中显示输入和输出的哪些字段，或者通过点击 **Configure** 按钮显示多个字段。

输入和输出的 JSON 路径支持负索引，因此您可以使用 `-1` 来访问数组的最后一个元素。例如，`inputs.messages[-1].content` 将访问 `messages` 数组中的最后一条消息。

#### 追踪视图

这里的追踪视图与查看单个运行时的追踪视图类似，不同之处在于您可以轻松访问线程中每一轮的所有运行记录。

### 查看反馈

查看线程时，在页面顶部您会看到一个名为 `Feedback` 的部分。在这里，您可以查看构成线程的每个运行的反馈。此反馈是聚合的，因此如果您为线程的每个运行评估相同的标准，您将看到所有运行的平均分数。您还可以在此处看到留下的[线程级反馈](/langsmith/online-evaluations#configure-multi-turn-online-evaluators)。

### 保存线程级过滤器

与在项目级别保存过滤器类似，您也可以在线程级别保存常用的过滤器。要在线程表上保存过滤器，请使用过滤器按钮设置过滤器，然后点击 **Save filter** 按钮。

您可以通过分别点击 `Annotate` 和 `Open trace`，在侧面板中打开追踪记录或对其进行注释。
