---
title: 构建一个包含子智能体的个人助手
sidebarTitle: 'Subagents: Personal assistant'
---


## 概述

**监督者模式（supervisor pattern）** 是一种[多智能体](/oss/javascript/langchain/multi-agent)架构，其中一个中央监督者智能体（supervisor agent）负责协调多个专业的工作者智能体（worker agents）。当任务需要不同类型的专业知识时，这种方法表现出色。与其构建一个管理跨领域工具选择的智能体，不如创建由理解整体工作流程的监督者协调的专注型专家。

在本教程中，您将构建一个个人助理系统，通过一个现实的工作流程来展示这些优势。该系统将协调两个职责根本不同的专家：

- 一个**日历智能体**，负责处理日程安排、可用性检查和事件管理。
- 一个**电子邮件智能体**，负责管理通信、起草消息和发送通知。

我们还将整合[人机协同（human-in-the-loop）审查](/oss/javascript/langchain/human-in-the-loop)，允许用户根据需要批准、编辑和拒绝操作（例如外发电子邮件）。

### 为什么使用监督者？

多智能体架构允许您将[工具](/oss/javascript/langchain/tools)划分给不同的工作者，每个工作者都有自己的提示词或指令。考虑一个可以直接访问所有日历和电子邮件 API 的智能体：它必须从许多相似的工具中进行选择，理解每个 API 的确切格式，并同时处理多个领域。如果性能下降，将相关工具和关联的提示词分离成逻辑组可能会有所帮助（部分是为了管理迭代改进）。

### 概念

我们将涵盖以下概念：

- [多智能体系统](/oss/javascript/langchain/multi-agent)
- [人机协同（human-in-the-loop）审查](/oss/javascript/langchain/human-in-the-loop)

## 设置

### 安装

本教程需要 `langchain` 包：

::: code-group

```bash [npm]
npm install langchain
```

```bash [yarn]
yarn add langchain
```

```bash [pnpm]
pnpm add langchain
```

:::

更多详情，请参阅我们的[安装指南](/oss/javascript/langchain/install)。

### LangSmith

设置 [LangSmith](https://smith.langchain.com) 以检查您的智能体内部发生的情况。然后设置以下环境变量：

::: code-group

```bash [bash]
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."
```

```typescript [typescript]
process.env.LANGSMITH_TRACING = "true";
process.env.LANGSMITH_API_KEY = "...";
```

:::

### 组件

我们需要从 LangChain 的集成套件中选择一个聊天模型：

<!--@include: @/snippets/javascript/chat-model-tabs-js.md-->

## 1. 定义工具

首先定义需要结构化输入的工具。在实际应用中，这些工具会调用真实的 API（如 Google Calendar、SendGrid 等）。在本教程中，您将使用存根（stubs）来演示该模式。

```typescript
import { tool } from "langchain";
import { z } from "zod";

const createCalendarEvent = tool(
  async ({ title, startTime, endTime, attendees, location }) => {
    // 存根：实际应用中，这将调用 Google Calendar API、Outlook API 等。
    return `事件已创建: ${title} 从 ${startTime} 到 ${endTime}，有 ${attendees.length} 位与会者`;
  },
  {
    name: "create_calendar_event",
    description: "创建日历事件。需要精确的 ISO 日期时间格式。",
    schema: z.object({
      title: z.string(),
      startTime: z.string().describe("ISO 格式: '2024-01-15T14:00:00'"),
      endTime: z.string().describe("ISO 格式: '2024-01-15T15:00:00'"),
      attendees: z.array(z.string()).describe("电子邮件地址"),
      location: z.string().optional(),
    }),
  }
);

const sendEmail = tool(
  async ({ to, subject, body, cc }) => {
    // 存根：实际应用中，这将调用 SendGrid、Gmail API 等。
    return `邮件已发送至 ${to.join(', ')} - 主题: ${subject}`;
  },
  {
    name: "send_email",
    description: "通过电子邮件 API 发送邮件。需要正确格式化的地址。",
    schema: z.object({
      to: z.array(z.string()).describe("电子邮件地址"),
      subject: z.string(),
      body: z.string(),
      cc: z.array(z.string()).optional(),
    }),
  }
);

const getAvailableTimeSlots = tool(
  async ({ attendees, date, durationMinutes }) => {
    // 存根：实际应用中，这将查询日历 API
    return ["09:00", "14:00", "16:00"];
  },
  {
    name: "get_available_time_slots",
    description: "在特定日期检查给定与会者的日历可用性。",
    schema: z.object({
      attendees: z.array(z.string()),
      date: z.string().describe("ISO 格式: '2024-01-15'"),
      durationMinutes: z.number(),
    }),
  }
);
```

## 2. 创建专门的子智能体

接下来，我们将创建处理每个领域的专门子智能体。

### 创建日历智能体

日历智能体理解自然语言调度请求，并将其转换为精确的 API 调用。它处理日期解析、可用性检查和事件创建。

```typescript
import { createAgent } from "langchain";

const CALENDAR_AGENT_PROMPT = `
你是一个日历调度助手。
将自然语言调度请求（例如，'下周二下午2点'）解析为正确的 ISO 日期时间格式。
需要时使用 get_available_time_slots 检查可用性。
使用 create_calendar_event 来安排事件。
始终在最终响应中确认已安排的内容。
`.trim();

const calendarAgent = createAgent({
  model: llm,
  tools: [createCalendarEvent, getAvailableTimeSlots],
  systemPrompt: CALENDAR_AGENT_PROMPT,
});
```

测试日历智能体，观察其如何处理自然语言日程安排：

```typescript
const query = "Schedule a team meeting next Tuesday at 2pm for 1 hour";

const stream = await calendarAgent.stream({
  messages: [{ role: "user", content: query }]
});

for await (const step of stream) {
  for (const update of Object.values(step)) {
    if (update && typeof update === "object" && "messages" in update) {
      for (const message of update.messages) {
        console.log(message.toFormattedString());
      }
    }
  }
}
```

```
================================== Ai Message ==================================
Tool Calls:
  get_available_time_slots (call_EIeoeIi1hE2VmwZSfHStGmXp)
 Call ID: call_EIeoeIi1hE2VmwZSfHStGmXp
  Args:
    attendees: []
    date: 2024-06-18
    duration_minutes: 60
================================= Tool Message =================================
Name: get_available_time_slots

["09:00", "14:00", "16:00"]
================================== Ai Message ==================================
Tool Calls:
  create_calendar_event (call_zgx3iJA66Ut0W8S3NpT93kEB)
 Call ID: call_zgx3iJA66Ut0W8S3NpT93kEB
  Args:
    title: Team Meeting
    start_time: 2024-06-18T14:00:00
    end_time: 2024-06-18T15:00:00
    attendees: []
================================= Tool Message =================================
Name: create_calendar_event

Event created: Team Meeting from 2024-06-18T14:00:00 to 2024-06-18T15:00:00 with 0 attendees
================================== Ai Message ==================================

The team meeting has been scheduled for next Tuesday, June 18th, at 2:00 PM and will last for 1 hour. If you need to add attendees or a location, please let me know!
```

该智能体将"下周二下午2点"解析为ISO格式（"2024-01-16T14:00:00"），计算结束时间，调用`create_calendar_event`，并返回自然语言确认信息。

### 创建邮件智能体

邮件智能体处理邮件撰写和发送。它专注于提取收件人信息、撰写合适的主题行和正文内容，并管理邮件通信。

```typescript
const EMAIL_AGENT_PROMPT = `
You are an email assistant.
Compose professional emails based on natural language requests.
Extract recipient information and craft appropriate subject lines and body text.
Use send_email to send the message.
Always confirm what was sent in your final response.
`.trim();

const emailAgent = createAgent({
  model: llm,
  tools: [sendEmail],
  systemPrompt: EMAIL_AGENT_PROMPT,
});
```

使用自然语言请求测试邮件智能体：

```typescript
const query = "Send the design team a reminder about reviewing the new mockups";

const stream = await emailAgent.stream({
  messages: [{ role: "user", content: query }]
});

```javascript
for await (const step of stream) {
  for (const update of Object.values(step)) {
if (update && typeof update === "object" && "messages" in update) {
for (const message of update.messages) {
console.log(message.toFormattedString());
}
}
  }
}
```
:::
```
================================== Ai Message ==================================
工具调用:
  send_email (call_OMl51FziTVY6CRZvzYfjYOZr)
 调用 ID: call_OMl51FziTVY6CRZvzYfjYOZr
  参数:
to: ['design-team@example.com']
subject: Reminder: Please Review the New Mockups
body: 设计团队，您好：

这是一封友好提醒，请您在方便时尽早审阅新的设计稿。您的反馈对于确保我们按项目时间线推进至关重要。

如果您有任何疑问或需要更多信息，请随时告知。

谢谢！

此致，
================================= Tool Message =================================
名称: send_email

邮件已发送至 design-team@example.com - 主题: Reminder: Please Review the New Mockups
================================== Ai Message ==================================

我已向设计团队发送了提醒，请他们审阅新的设计稿。如果您需要就此主题进行进一步沟通，请随时告知！
```

智能体从非正式的请求中推断出收件人，精心设计了专业的主题行和正文，调用了 `send_email` 工具，并返回了确认信息。每个子智能体都有其专注的领域，配备了特定领域的工具和提示，使其能够在特定任务上表现出色。

## 3. 将子智能体包装为工具

现在将每个子智能体包装成一个可供监督者调用的工具。这是创建分层系统的关键架构步骤。监督者将看到诸如 "schedule_event" 这样的高级工具，而不是 "create_calendar_event" 这样的低级工具。

:::python

```python
@tool
def schedule_event(request: str) -> str:
"""使用自然语言安排日历事件。

当用户想要创建、修改或查看日历预约时使用此工具。
处理日期/时间解析、可用性检查和事件创建。

输入：自然语言调度请求（例如，'下周二下午2点与设计团队开会'）
"""
result = calendar_agent.invoke({
"messages": [{"role": "user", "content": request}]
})
return result["messages"][-1].text

@tool
def manage_email(request: str) -> str:
"""使用自然语言发送电子邮件。

当用户想要发送通知、提醒或任何电子邮件通信时使用此工具。
处理收件人提取、主题生成和邮件撰写。

输入：自然语言邮件请求（例如，'给他们发送一个关于会议的提醒'）
"""
result = email_agent.invoke({
"messages": [{"role": "user", "content": request}]
})
return result["messages"][-1].text
```
:::

:::js

```typescript
const scheduleEvent = tool(
  async ({ request }) => {
const result = await calendarAgent.invoke({
messages: [{ role: "user", content: request }]
});
const lastMessage = result.messages[result.messages.length - 1];
return lastMessage.text;
  },
  {
name: "schedule_event",
description: `
使用自然语言安排日历事件。

当用户想要创建、修改或查看日历预约时使用此工具。
处理日期/时间解析、可用性检查和事件创建。

输入：自然语言调度请求（例如，'下周二下午2点与设计团队开会'）
`.trim(),
schema: z.object({
request: z.string().describe("自然语言调度请求"),
}),
  }
);
```

const manageEmail = tool(
  async ({ request }) => {
    const result = await emailAgent.invoke({
      messages: [{ role: "user", content: request }]
    });
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.text;
  },
  {
    name: "manage_email",
    description: `
使用自然语言发送电子邮件。

当用户想要发送通知、提醒或任何电子邮件通信时使用此工具。
处理收件人提取、主题生成和邮件内容撰写。

输入：自然语言电子邮件请求（例如，“给他们发送一个关于会议的提醒”）
    `.trim(),
    schema: z.object({
      request: z.string().describe("自然语言电子邮件请求"),
    }),
  }
);
```

工具描述有助于监督者决定何时使用每个工具，因此请确保它们清晰且具体。我们只返回子智能体的最终响应，因为监督者不需要看到中间推理或工具调用过程。

## 4. 创建监督者智能体

现在创建用于协调子智能体的监督者。监督者只看到高级工具，并在领域层面做出路由决策，而不是在单个 API 层面。

```typescript
const SUPERVISOR_PROMPT = `
你是一个有用的个人助手。
你可以安排日历事件和发送电子邮件。
将用户请求分解为适当的工具调用并协调结果。
当请求涉及多个操作时，按顺序使用多个工具。
`.trim();

const supervisorAgent = createAgent({
  model: llm,
  tools: [scheduleEvent, manageEmail],
  systemPrompt: SUPERVISOR_PROMPT,
});
```

## 5. 使用监督者

现在，使用需要跨多个领域协调的复杂请求来测试你的完整系统：

### 示例 1：简单的单领域请求

```typescript
const query = "Schedule a team standup for tomorrow at 9am";

const stream = await supervisorAgent.stream({
  messages: [{ role: "user", content: query }]
});

for await (const step of stream) {
  for (const update of Object.values(step)) {
    if (update && typeof update === "object" && "messages" in update) {
      for (const message of update.messages) {
        console.log(message.toFormattedString());
      }
    }
  }
}
```

```
================================== Ai Message ==================================
Tool Calls:
  schedule_event (call_mXFJJDU8bKZadNUZPaag8Lct)
 Call ID: call_mXFJJDU8bKZadNUZPaag8Lct
  Args:
    request: Schedule a team standup for tomorrow at 9am with Alice and Bob.
================================= Tool Message =================================
Name: schedule_event

The team standup has been scheduled for tomorrow at 9:00 AM with Alice and Bob. If you need to make any changes or add more details, just let me know!
================================== Ai Message ==================================

The team standup with Alice and Bob is scheduled for tomorrow at 9:00 AM. If you need any further arrangements or adjustments, please let me know!
```

监督者将此识别为日历任务，调用 `schedule_event`，然后日历智能体处理日期解析和事件创建。

<提示>
要全面了解信息流，包括每次聊天模型调用的提示和响应，请查看上述运行的 [LangSmith 追踪](https://smith.langchain.com/public/91a9a95f-fba9-4e84-aff0-371861ad2f4a/r)。
</提示>

### 示例 2：复杂的多领域请求

```typescript
const query =
  "Schedule a meeting with the design team next Tuesday at 2pm for 1 hour, " +
  "and send them an email reminder about reviewing the new mockups.";

const stream = await supervisorAgent.stream({
  messages: [{ role: "user", content: query }]
});

for await (const step of stream) {
  for (const update of Object.values(step)) {
    if (update && typeof update === "object" && "messages" in update) {
      for (const message of update.messages) {
        console.log(message.toFormattedString());
      }
    }
  }
}
```

```
================================== Ai 消息 ==================================
工具调用:
  schedule_event (call_YA68mqF0koZItCFPx0kGQfZi)
 调用 ID: call_YA68mqF0koZItCFPx0kGQfZi
  参数:
    request: meeting with the design team next Tuesday at 2pm for 1 hour
  manage_email (call_XxqcJBvVIuKuRK794ZIzlLxx)
 调用 ID: call_XxqcJBvVIuKuRK794ZIzlLxx
  参数:
    request: send the design team an email reminder about reviewing the new mockups
================================= 工具消息 =================================
名称: schedule_event

您与设计团队的会议已安排在下周二，6月18日，下午2:00至3:00。如果您需要添加更多细节或进行任何更改，请告诉我！
================================= 工具消息 =================================
名称: manage_email

我已向设计团队发送了一封电子邮件提醒，请他们审阅新的设计稿。如果您需要包含更多信息或收件人，请告诉我！
================================== Ai 消息 ==================================

您与设计团队的会议已安排在下周二，6月18日，下午2:00至3:00。

我还向设计团队发送了一封电子邮件提醒，请他们审阅新的设计稿。

如果您想为会议添加更多细节或在电子邮件中包含更多信息，请告诉我！
```

监督者（supervisor）识别出这需要日历和电子邮件两种操作，首先调用 `schedule_event` 安排会议，然后调用 `manage_email` 发送提醒。每个子智能体（sub-agent）完成其任务，监督者将两个结果综合成一个连贯的响应。

<提示>
请参考 [LangSmith 追踪](https://smith.langchain.com/public/95cd00a3-d1f9-4dba-9731-7bf733fb6a3c/r) 查看上述运行的详细信息流，包括各个聊天模型的提示和响应。
</提示>

### 完整可运行示例

以下是一个包含所有内容的可运行脚本：

<Expandable title="查看完整代码" :defaultOpen="false">

```typescript
import { Command } from "@langchain/langgraph"; // [!code highlight]

const resume: Record<string, any> = {};
for (const interrupt of interrupts) {
  const actionRequest = interrupt.value.actionRequests[0];
  if (actionRequest.name === "send_email") {
    // Edit email
    const editedAction = { ...actionRequest };
    editedAction.arguments.subject = "Mockups reminder";
    resume[interrupt.id] = {
      decisions: [{ type: "edit", editedAction }]
    };
  } else {
    resume[interrupt.id] = { decisions: [{ type: "approve" }] };
  }
}

const resumeStream = await supervisorAgent.stream(
  new Command({ resume }), // [!code highlight]
  config
);

for await (const step of resumeStream) {
  for (const update of Object.values(step)) {
    if (update && typeof update === "object" && "messages" in update) {
      for (const message of update.messages) {
        console.log(message.toFormattedString());
      }
    }
  }
}
```

```
================================= 工具消息 =================================
名称: schedule_event

您与设计团队的会议已安排在下周二，6月18日，下午2:00至3:00。
================================= 工具消息 =================================
名称: manage_email

您发送给设计团队的邮件提醒已发出。以下是发送内容：

- 收件人: designteam@example.com
- 主题: Mockups reminder
- 正文: 提醒在下周二下午2点的会议前审阅新的设计稿，并请求反馈和为讨论做好准备。

如有任何进一步需求，请告知！
================================== AI 消息 ==================================

- 您与设计团队的会议已安排在下周二，6月18日，下午2:00至3:00。
- 已向设计团队发送了一封关于在会议前审阅新设计稿的邮件提醒。

如有任何进一步需求，请告知！
```
运行过程根据我们的输入继续进行。

## 7. 进阶：控制信息流

默认情况下，子智能体仅接收来自监督者的请求字符串。您可能希望传递额外的上下文，例如对话历史或用户偏好。

### 向子智能体传递额外的对话上下文

```typescript
import { getCurrentTaskInput } from "@langchain/langgraph";
import { type BuiltInState, HumanMessage } from "langchain";

const scheduleEvent = tool(
  async ({ request }, config) => {
    // 自定义子智能体接收的上下文
    // 从配置中访问完整的线程消息
    const currentMessages = getCurrentTaskInput<BuiltInState>(config).messages;
    const originalUserMessage = currentMessages.find(HumanMessage.isInstance);
    const prompt = `
您正在协助处理以下用户查询：
```

${originalUserMessage?.content || "无上下文可用"}

您被分配了以下子请求：

${request}
`.trim();

const result = await calendarAgent.invoke({
messages: [{ role: "user", content: prompt }],
});
const lastMessage = result.messages[result.messages.length - 1];
return lastMessage.text;
  },
  {
name: "schedule_event",
description: "使用自然语言安排日历事件。",
schema: z.object({
request: z.string().describe("自然语言日程安排请求"),
}),
  }
);
```
:::

这允许子智能体看到完整的对话上下文，这对于解决诸如“明天同一时间安排它”（引用之前的对话）之类的歧义非常有用。

<Tip>
您可以在 LangSmith 跟踪的 [聊天模型调用](https://smith.langchain.com/public/c7d54882-afb8-4039-9c5a-4112d0f458b0/r/6803571e-af78-4c68-904a-ecf55771084d) 中查看子智能体接收到的完整上下文。
</Tip>

### 控制监督者接收的内容

您还可以自定义哪些信息流回监督者：

:::python

```python
import json

@tool
def schedule_event(request: str) -> str:
"""使用自然语言安排日历事件。"""
result = calendar_agent.invoke({
"messages": [{"role": "user", "content": request}]
})

    # 选项 1：仅返回确认消息
return result["messages"][-1].text

    # 选项 2：返回结构化数据
    # return json.dumps({
    #     "status": "success",
    #     "event_id": "evt_123",
    #     "summary": result["messages"][-1].text
    # })
```
:::

:::js

```typescript
const scheduleEvent = tool(
  async ({ request }) => {
const result = await calendarAgent.invoke({
messages: [{ role: "user", content: request }]
});

const lastMessage = result.messages[result.messages.length - 1];

// 选项 1：仅返回确认消息
return lastMessage.text;

// 选项 2：返回结构化数据
// return JSON.stringify({
//   status: "success",
//   event_id: "evt_123",
//   summary: lastMessage.text
// });
  },
  {
name: "schedule_event",
description: "使用自然语言安排日历事件。",
schema: z.object({
request: z.string().describe("自然语言日程安排请求"),
}),
  }
);
```

**重要：** 确保子智能体的提示强调其最终消息应包含所有相关信息。一个常见的失败模式是子智能体执行了工具调用，但没有将结果包含在其最终响应中。

<Tip>

要查看一个完整的工作示例，该示例演示了包含人机协同（human-in-the-loop）审查和高级信息流控制的完整监督者模式，请查看 LangChain.js 示例中的 [`supervisor_complete.ts`](https://github.com/langchain-ai/langchainjs/blob/main/examples/src/createAgent/supervisor_complete.ts)。

</Tip>

## 8. 关键要点

监督者模式创建了具有明确职责的抽象层。在设计监督者系统时，从清晰的领域边界开始，并为每个子智能体提供专注的工具和提示。为监督者编写清晰的工具描述，在集成前独立测试每一层，并根据您的具体需求控制信息流。

<Tip>

<strong>何时使用监督者模式</strong>

当您拥有多个不同的领域（日历、电子邮件、CRM、数据库），每个领域都有多个工具或复杂逻辑，您希望集中控制工作流，并且子智能体不需要直接与用户对话时，请使用监督者模式。

对于只有少数工具的简单情况，请使用单个智能体。当智能体需要与用户对话时，请改用 [交接](/oss/javascript/langchain/multi-agent/handoffs)。对于智能体之间的点对点协作，请考虑其他多智能体模式。

</Tip>

## 后续步骤

了解[交接](/oss/javascript/langchain/multi-agent/handoffs)以实现智能体间对话，探索[上下文工程](/oss/javascript/langchain/context-engineering)以优化信息流，阅读[多智能体概述](/oss/javascript/langchain/multi-agent)以比较不同模式，并使用[LangSmith](https://smith.langchain.com)来调试和监控您的多智能体系统。
