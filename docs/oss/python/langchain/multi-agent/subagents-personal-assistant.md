---
title: 构建一个带有子代理的个人助手
sidebarTitle: 'Subagents: Personal assistant'
---


## 概述

**监督者模式**是一种[多智能体](/oss/langchain/multi-agent)架构，其中一个中央监督者智能体协调专门的执行者智能体。当任务需要不同类型的专业知识时，这种方法表现出色。与其构建一个管理跨领域工具选择的智能体，不如创建由理解整体工作流程的监督者协调的、专注的专家。

在本教程中，你将构建一个个人助理系统，通过一个现实的工作流程来展示这些优势。该系统将协调两个职责根本不同的专家：

- 一个**日历智能体**，负责处理日程安排、可用性检查和事件管理。
- 一个**电子邮件智能体**，负责管理通信、起草消息和发送通知。

我们还将引入[人工介入审查](/oss/langchain/human-in-the-loop)，允许用户根据需要批准、编辑和拒绝操作（例如外发电子邮件）。

### 为什么使用监督者？

多智能体架构允许你将[工具](/oss/langchain/tools)划分给各个执行者，每个执行者都有自己的提示词或指令。考虑一个可以直接访问所有日历和电子邮件 API 的智能体：它必须从许多相似的工具中进行选择，理解每个 API 的确切格式，并同时处理多个领域。如果性能下降，将相关工具和关联的提示词分离到逻辑组中可能会有所帮助（部分是为了管理迭代改进）。

### 概念

我们将涵盖以下概念：

- [多智能体系统](/oss/langchain/multi-agent)
- [人工介入审查](/oss/langchain/human-in-the-loop)

## 设置

### 安装

本教程需要 `langchain` 包：

::: code-group

```bash [pip]
pip install langchain
```

```bash [conda]
conda install langchain -c conda-forge
```

:::

更多详情，请参阅我们的[安装指南](/oss/langchain/install)。

### LangSmith

设置 [LangSmith](https://smith.langchain.com) 以检查智能体内部发生的情况。然后设置以下环境变量：

::: code-group

```bash [bash]
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."
```

```python [python]
import getpass
import os

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass()
```

:::

### 组件

我们需要从 LangChain 的集成套件中选择一个聊天模型：

<!--@include: @/snippets/python/chat-model-tabs.md-->

## 1. 定义工具

首先定义需要结构化输入的工具。在实际应用中，这些工具会调用真实的 API（Google Calendar、SendGrid 等）。在本教程中，你将使用存根来演示该模式。

```python
from langchain.tools import tool

@tool
def create_calendar_event(
    title: str,
    start_time: str,       # ISO format: "2024-01-15T14:00:00"
    end_time: str,         # ISO format: "2024-01-15T15:00:00"
    attendees: list[str],  # email addresses
    location: str = ""
) -> str:
    """Create a calendar event. Requires exact ISO datetime format."""
    # Stub: In practice, this would call Google Calendar API, Outlook API, etc.
    return f"Event created: {title} from {start_time} to {end_time} with {len(attendees)} attendees"

@tool
def send_email(
    to: list[str],  # email addresses
    subject: str,
    body: str,
    cc: list[str] = []
) -> str:
    """Send an email via email API. Requires properly formatted addresses."""
    # Stub: In practice, this would call SendGrid, Gmail API, etc.
    return f"Email sent to {', '.join(to)} - Subject: {subject}"

@tool
def get_available_time_slots(
    attendees: list[str],
    date: str,  # ISO format: "2024-01-15"
    duration_minutes: int
) -> list[str]:
    """Check calendar availability for given attendees on a specific date."""
    # Stub: In practice, this would query calendar APIs
    return ["09:00", "14:00", "16:00"]
```

## 2. 创建专门的子智能体

接下来，我们将创建处理每个领域的专门子智能体。

### 创建日历智能体

日历智能体理解自然语言日程安排请求，并将其转换为精确的 API 调用。它处理日期解析、可用性检查和事件创建。

```python
from langchain.agents import create_agent

CALENDAR_AGENT_PROMPT = (
    "You are a calendar scheduling assistant. "
    "Parse natural language scheduling requests (e.g., 'next Tuesday at 2pm') "
    "into proper ISO datetime formats. "
    "Use get_available_time_slots to check availability when needed. "
    "Use create_calendar_event to schedule events. "
    "Always confirm what was scheduled in your final response."
)

calendar_agent = create_agent(
    model,
    tools=[create_calendar_event, get_available_time_slots],
    system_prompt=CALENDAR_AGENT_PROMPT,
)
```

测试日历智能体，看看它如何处理自然语言日程安排：

```python
query = "Schedule a team meeting next Tuesday at 2pm for 1 hour"

for step in calendar_agent.stream(
    {"messages": [{"role": "user", "content": query}]}
):
    for update in step.values():
        for message in update.get("messages", []):
            message.pretty_print()
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

该智能体将“下周二下午 2 点”解析为 ISO 格式（"2024-01-16T14:00:00"），计算结束时间，调用 `create_calendar_event`，并返回自然语言确认。

### 创建电子邮件智能体

电子邮件智能体处理消息撰写和发送。它专注于提取收件人信息、制作适当的主题行和正文文本，以及管理电子邮件通信。

```python
EMAIL_AGENT_PROMPT = (
    "You are an email assistant. "
    "Compose professional emails based on natural language requests. "
    "Extract recipient information and craft appropriate subject lines and body text. "
    "Use send_email to send the message. "
    "Always confirm what was sent in your final response."
)

email_agent = create_agent(
    model,
    tools=[send_email],
    system_prompt=EMAIL_AGENT_PROMPT,
)
```

使用自然语言请求测试电子邮件智能体：

```python
query = "Send the design team a reminder about reviewing the new mockups"

for step in email_agent.stream(
    {"messages": [{"role": "user", "content": query}]}
):
    for update in step.values():
        for message in update.get("messages", []):
            message.pretty_print()
```

```
================================== Ai Message ==================================
Tool Calls:
  send_email (call_OMl51FziTVY6CRZvzYfjYOZr)
 Call ID: call_OMl51FziTVY6CRZvzYfjYOZr
  Args:
    to: ['design-team@example.com']
    subject: Reminder: Please Review the New Mockups
    body: Hi Design Team,

This is a friendly reminder to review the new mockups at your earliest convenience. Your feedback is important to ensure that we stay on track with our project timeline.

Please let me know if you have any questions or need additional information.

Thank you!

Best regards,
================================= Tool Message =================================
Name: send_email

Email sent to design-team@example.com - Subject: Reminder: Please Review the New Mockups
================================== Ai Message ==================================

I've sent a reminder to the design team asking them to review the new mockups. If you need any further communication on this topic, just let me know!
```

该智能体从非正式请求中推断出收件人，制作专业的主题行和正文，调用 `send_email`，并返回确认信息。每个子智能体都有狭窄的焦点和特定领域的工具及提示词，使其能够在特定任务上表现出色。

## 3. 将子智能体包装为工具

现在将每个子智能体包装为监督者可以调用的工具。这是创建分层系统的关键架构步骤。监督者将看到高级工具，如 "schedule_event"，而不是低级工具，如 "create_calendar_event"。

```python
@tool
def schedule_event(request: str) -> str:
    """Schedule calendar events using natural language.

    Use this when the user wants to create, modify, or check calendar appointments.
    Handles date/time parsing, availability checking, and event creation.

    Input: Natural language scheduling request (e.g., 'meeting with design team
    next Tuesday at 2pm')
    """
    result = calendar_agent.invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text

@tool
def manage_email(request: str) -> str:
    """Send emails using natural language.

    Use this when the user wants to send notifications, reminders, or any email
    communication. Handles recipient extraction, subject generation, and email
    composition.

    Input: Natural language email request (e.g., 'send them a reminder about
    the meeting')
    """
    result = email_agent.invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text
```

工具描述有助于监督者决定何时使用每个工具，因此请使其清晰具体。我们只返回子智能体的最终响应，因为监督者不需要看到中间推理或工具调用。

## 4. 创建监督者智能体

现在创建协调子智能体的监督者。监督者只看到高级工具，并在领域级别而非单个 API 级别做出路由决策。

```python
SUPERVISOR_PROMPT = (
    "You are a helpful personal assistant. "
    "You can schedule calendar events and send emails. "
    "Break down user requests into appropriate tool calls and coordinate the results. "
    "When a request involves multiple actions, use multiple tools in sequence."
)

supervisor_agent = create_agent(
    model,
    tools=[schedule_event, manage_email],
    system_prompt=SUPERVISOR_PROMPT,
)
```

## 5. 使用监督者

现在使用需要跨多个领域协调的复杂请求来测试你的完整系统：

### 示例 1：简单的单领域请求

```python
query = "Schedule a team standup for tomorrow at 9am"

for step in supervisor_agent.stream(
    {"messages": [{"role": "user", "content": query}]}
):
    for update in step.values():
        for message in update.get("messages", []):
            message.pretty_print()
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

监督者将其识别为日历任务，调用 `schedule_event`，然后日历智能体处理日期解析和事件创建。

<Tip>

要完全了解信息流，包括每次聊天模型调用的提示词和响应，请查看上述运行的 [LangSmith 追踪](https://smith.langchain.com/public/91a9a95f-fba9-4e84-aff0-371861ad2f4a/r)。

</Tip>

### 示例 2：复杂的多领域请求

```python
query = (
    "Schedule a meeting with the design team next Tuesday at 2pm for 1 hour, "
    "and send them an email reminder about reviewing the new mockups."
)

for step in supervisor_agent.stream(
    {"messages": [{"role": "user", "content": query}]}
):
    for update in step.values():
        for message in update.get("messages", []):
            message.pretty_print()
```

```
================================== Ai Message ==================================
Tool Calls:
  schedule_event (call_YA68mqF0koZItCFPx0kGQfZi)
 Call ID: call_YA68mqF0koZItCFPx0kGQfZi
  Args:
    request: meeting with the design team next Tuesday at 2pm for 1 hour
  manage_email (call_XxqcJBvVIuKuRK794ZIzlLxx)
 Call ID: call_XxqcJBvVIuKuRK794ZIzlLxx
  Args:
    request: send the design team an email reminder about reviewing the new mockups
================================= Tool Message =================================
Name: schedule_event

Your meeting with the design team is scheduled for next Tuesday, June 18th, from 2:00pm to 3:00pm. Let me know if you need to add more details or make any changes!
================================= Tool Message =================================
Name: manage_email

I've sent an email reminder to the design team requesting them to review the new mockups. If you need to include more information or recipients, just let me know!
================================== Ai Message ==================================

Your meeting with the design team is scheduled for next Tuesday, June 18th, from 2:00pm to 3:00pm.

I've also sent an email reminder to the design team, asking them to review the new mockups.

Let me know if you'd like to add more details to the meeting or include additional information in the email!
```

监督者识别出这需要日历和电子邮件操作，为会议调用 `schedule_event`，然后为提醒调用 `manage_email`。每个子智能体完成其任务，监督者将两个结果综合成一个连贯的响应。

<Tip>

请参阅 [LangSmith 追踪](https://smith.langchain.com/public/95cd00a3-d1f9-4dba-9731-7bf733fb6a3c/r) 以查看上述运行的详细信息流，包括各个聊天模型的提示词和响应。

</Tip>

### 完整工作示例

以下是一个可运行脚本中的所有内容：

<Expandable title="查看完整代码" :defaultOpen="false">

```python
"""
Personal Assistant Supervisor Example

This example demonstrates the tool calling pattern for multi-agent systems.
A supervisor agent coordinates specialized sub-agents (calendar and email)
that are wrapped as tools.
"""

from langchain.tools import tool
from langchain.agents import create_agent
from langchain.chat_models import init_chat_model

# ============================================================================
# Step 1: Define low-level API tools (stubbed)
# ============================================================================

@tool
def create_calendar_event(
    title: str,
    start_time: str,  # ISO format: "2024-01-15T14:00:00"
    end_time: str,    # ISO format: "2024-01-15T15:00:00"
    attendees: list[str],  # email addresses
    location: str = ""
) -> str:
    """Create a calendar event. Requires exact ISO datetime format."""
    return f"Event created: {title} from {start_time} to {end_time} with {len(attendees)} attendees"

@tool
def send_email(
    to: list[str],      # email addresses
    subject: str,
    body: str,
    cc: list[str] = []
) -> str:
    """Send an email via email API. Requires properly formatted addresses."""
    return f"Email sent to {', '.join(to)} - Subject: {subject}"

@tool
def get_available_time_slots(
    attendees: list[str],
    date: str,  # ISO format: "2024-01-15"
    duration_minutes: int
) -> list[str]:
    """Check calendar availability for given attendees on a specific date."""
    return ["09:00", "14:00", "16:00"]

# ============================================================================
# Step 2: Create specialized sub-agents
# ============================================================================

model = init_chat_model("claude-haiku-4-5-20251001")  # for example

calendar_agent = create_agent(
    model,
    tools=[create_calendar_event, get_available_time_slots],
    system_prompt=(
        "You are a calendar scheduling assistant. "
        "Parse natural language scheduling requests (e.g., 'next Tuesday at 2pm') "
        "into proper ISO datetime formats. "
        "Use get_available_time_slots to check availability when needed. "
        "Use create_calendar_event to schedule events. "
        "Always confirm what was scheduled in your final response."
    )
)

email_agent = create_agent(
    model,
    tools=[send_email],
    system_prompt=(
        "You are an email assistant. "
        "Compose professional emails based on natural language requests. "
        "Extract recipient information and craft appropriate subject lines and body text. "
        "Use send_email to send the message. "
        "Always confirm what was sent in your final response."
    )
)

# ============================================================================
# Step 3: Wrap sub-agents as tools for the supervisor
# ============================================================================

@tool
def schedule_event(request: str) -> str:
    """Schedule calendar events using natural language.

    Use this when the user wants to create, modify, or check calendar appointments.
    Handles date/time parsing, availability checking, and event creation.

    Input: Natural language scheduling request (e.g., 'meeting with design team
    next Tuesday at 2pm')
    """
    result = calendar_agent.invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text

@tool
def manage_email(request: str) -> str:
    """Send emails using natural language.

    Use this when the user wants to send notifications, reminders, or any email
    communication. Handles recipient extraction, subject generation, and email
    composition.

    Input: Natural language email request (e.g., 'send them a reminder about
    the meeting')
    """
    result = email_agent.invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text

# ============================================================================
# Step 4: Create the supervisor agent
# ============================================================================

supervisor_agent = create_agent(
    model,
    tools=[schedule_event, manage_email],
    system_prompt=(
        "You are a helpful personal assistant. "
        "You can schedule calendar events and send emails. "
        "Break down user requests into appropriate tool calls and coordinate the results. "
        "When a request involves multiple actions, use multiple tools in sequence."
    )
)

# ============================================================================
# Step 5: Use the supervisor
# ============================================================================

if __name__ == "__main__":
    # Example: User request requiring both calendar and email coordination
    user_request = (
        "Schedule a meeting with the design team next Tuesday at 2pm for 1 hour, "
        "and send them an email reminder about reviewing the new mockups."
    )

    print("User Request:", user_request)
    print("\n" + "="*80 + "\n")

    for step in supervisor_agent.stream(
        {"messages": [{"role": "user", "content": user_request}]}
    ):
        for update in step.values():
            for message in update.get("messages", []):
                message.pretty_print()
```

</Expandable>

### 理解架构

你的系统有三层。底层包含需要精确格式的严格 API 工具。中间层包含接受自然语言、将其转换为结构化 API 调用并返回自然语言确认的子智能体。顶层包含监督者，它路由到高级功能并综合结果。

这种关注点分离提供了几个好处：每一层都有明确的职责，你可以添加新领域而不影响现有领域，并且可以独立测试和迭代每一层。

## 6. 添加人工介入审查

对敏感操作进行[人工介入审查](/oss/langchain/human-in-the-loop)可能是审慎的做法。LangChain 包含[内置中间件](/oss/langchain/human-in-the-loop#configuring-interrupts)来审查工具调用，在本例中是子智能体调用的工具。

让我们为两个子智能体添加人工介入审查：
- 我们将 `create_calendar_event` 和 `send_email` 工具配置为中断，允许所有[响应类型](/oss/langchain/human-in-the-loop)（`approve`、`edit`、`reject`）
- 我们添加一个[检查点](/oss/langchain/short-term-memory)**仅到顶层智能体**。这是暂停和恢复执行所必需的。

```python
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware # [!code highlight]
from langgraph.checkpoint.memory import InMemorySaver # [!code highlight]

calendar_agent = create_agent(
    model,
    tools=[create_calendar_event, get_available_time_slots],
    system_prompt=CALENDAR_AGENT_PROMPT,
    middleware=[ # [!code highlight]
        HumanInTheLoopMiddleware( # [!code highlight]
            interrupt_on={"create_calendar_event": True}, # [!code highlight]
            description_prefix="Calendar event pending approval", # [!code highlight]
        ), # [!code highlight]
    ], # [!code highlight]
)

email_agent = create_agent(
    model,
    tools=[send_email],
    system_prompt=EMAIL_AGENT_PROMPT,
    middleware=[ # [!code highlight]
        HumanInTheLoopMiddleware( # [!code highlight]
            interrupt_on={"send_email": True}, # [!code highlight]
            description_prefix="Outbound email pending approval", # [!code highlight]
        ), # [!code highlight]
    ], # [!code highlight]
)

supervisor_agent = create_agent(
    model,
    tools=[schedule_event, manage_email],
    system_prompt=SUPERVISOR_PROMPT,
    checkpointer=InMemorySaver(), # [!code highlight]
)
```

让我们重复查询。注意，我们将中断事件收集到一个列表中以便后续访问：

```python
query = (
    "Schedule a meeting with the design team next Tuesday at 2pm for 1 hour, "
    "and send them an email reminder about reviewing the new mockups."
)

config = {"configurable": {"thread_id": "6"}}

interrupts = []
for step in supervisor_agent.stream(
    {"messages": [{"role": "user", "content": query}]},
    config,
):
    for update in step.values():
        if isinstance(update, dict):
            for message in update.get("messages", []):
                message.pretty_print()
        else:
            interrupt_ = update[0]
            interrupts.append(interrupt_)
            print(f"\nINTERRUPTED: {interrupt_.id}")
```

```
================================== Ai Message ==================================
Tool Calls:
  schedule_event (call_t4Wyn32ohaShpEZKuzZbl83z)
 Call ID: call_t4Wyn32ohaShpEZKuzZbl83z
  Args:
    request: Schedule a meeting with the design team next Tuesday at 2pm for 1 hour.
  manage_email (call_JWj4vDJ5VMnvkySymhCBm4IR)
 Call ID: call_JWj4vDJ5VMnvkySymhCBm4IR
  Args:
    request: Send an email reminder to the design team about reviewing the new mockups before our meeting next Tuesday at 2pm.

INTERRUPTED: 4f994c9721682a292af303ec1a46abb7

INTERRUPTED: 2b56f299be313ad8bc689eff02973f16
```

这次我们中断了执行。让我们检查中断事件：

```python
for interrupt_ in interrupts:
    for request in interrupt_.value["action_requests"]:
        print(f"INTERRUPTED: {interrupt_.id}")
        print(f"{request['description']}\n")
```

```
INTERRUPTED: 4f994c9721682a292af303ec1a46abb7
Calendar event pending approval

Tool: create_calendar_event
Args: {'title': 'Meeting with the Design Team', 'start_time': '2024-06-18T14:00:00', 'end_time': '2024-06-18T15:00:00', 'attendees': ['design team']}

INTERRUPTED: 2b56f299be313ad8bc689eff02973f16
Outbound email pending approval

Tool: send_email
Args: {'to': ['designteam@example.com'], 'subject': 'Reminder: Review New Mockups Before Meeting Next Tuesday at 2pm', 'body': "Hello Team,\n\nThis is a reminder to review the new mockups ahead of our meeting scheduled for next Tuesday at 2pm. Your feedback and insights will be valuable for our discussion and next steps.\n\nPlease ensure you've gone through the designs and are ready to share your thoughts during the meeting.\n\nThank you!\n\nBest regards,\n[Your Name]"}
```

我们可以通过使用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 引用其 ID 来为每个中断指定决策。有关更多详细信息，请参阅[人工介入指南](/oss/langchain/human-in-the-loop)。出于演示目的，这里我们将接受日历事件，但编辑外发电子邮件的主题：

```python
from langgraph.types import Command # [!code highlight]

resume = {}
for interrupt_ in interrupts:
    if interrupt_.id == "2b56f299be313ad8bc689eff02973f16":
        # Edit email
        edited_action = interrupt_.value["action_requests"][0].copy()
        edited_action["arguments"]["subject"] = "Mockups reminder"
        resume[interrupt_.id] = {
            "decisions": [{"type": "edit", "edited_action": edited_action}]
        }
    else:
        resume[interrupt_.id] = {"decisions": [{"type": "approve"}]}

interrupts = []
for step in supervisor_agent.stream(
    Command(resume=resume), # [!code highlight]
    config,
):
    for update in step.values():
        if isinstance(update, dict):
            for message in update.get("messages", []):
                message.pretty_print()
        else:
            interrupt_ = update[0]
            interrupts.append(interrupt_)
            print(f"\nINTERRUPTED: {interrupt_.id}")
```

```
================================= Tool Message =================================
Name: schedule_event

Your meeting with the design team has been scheduled for next Tuesday, June 18th, from 2:00 pm to 3:00 pm.
================================= Tool Message =================================
Name: manage_email

Your email reminder to the design team has been sent. Here’s what was sent:

- Recipient: designteam@example.com
- Subject: Mockups reminder
- Body: A reminder to review the new mockups before the meeting next Tuesday at 2pm, with a request for feedback and readiness for discussion.

Let me know if you need any further assistance!
================================== Ai Message ==================================

- Your meeting with the design team has been scheduled for next Tuesday, June 18th, from 2:00 pm to 3:00 pm.
- An email reminder has been sent to the design team about reviewing the new mockups before the meeting.

Let me know if you need any further assistance!
```

运行根据我们的输入继续进行。

## 7. 高级：控制信息流

默认情况下，子智能体只接收来自监督者的请求字符串。你可能希望传递额外的上下文，例如对话历史记录或用户偏好。

### 向子智能体传递额外的对话上下文

```python
from langchain.tools import tool, ToolRuntime

@tool
def schedule_event(
    request: str,
    runtime: ToolRuntime
) -> str:
    """Schedule calendar events using natural language."""
    # Customize context received by sub-agent
    original_user_message = next(
        message for message in runtime.state["messages"]
        if message.type == "human"
    )
    prompt = (
        "You are assisting with the following user inquiry:\n\n"
        f"{original_user_message.text}\n\n"
        "You are tasked with the following sub-request:\n\n"
        f"{request}"
    )
    result = calendar_agent.invoke({
        "messages": [{"role": "user", "content": prompt}],
    })
    return result["messages"][-1].text
```

这允许子智能体看到完整的对话上下文，这对于解决歧义很有用，例如“安排到明天同一时间”（引用之前的对话）。

<Tip>

你可以在 LangSmith 追踪的[聊天模型调用](https://smith.langchain.com/public/c7d54882-afb8-4039-9c5a-4112d0f458b0/r/6803571e-af78-4c68-904a-ecf55771084d)中看到子智能体接收到的完整上下文。

</Tip>

### 控制监督者接收的内容

你还可以自定义返回给监督者的信息：

```python
import json

@tool
def schedule_event(request: str) -> str:
    """Schedule calendar events using natural language."""
    result = calendar_agent.invoke({
        "messages": [{"role": "user", "content": request}]
    })

    # Option 1: Return just the confirmation message
    return result["messages"][-1].text

    # Option 2: Return structured data
    # return json.dumps({
    #     "status": "success",
    #     "event_id": "evt_123",
    #     "summary": result["messages"][-1].text
    # })
```

**重要：** 确保子智能体的提示词强调其最终消息应包含所有相关信息。一个常见的故障模式是子智能体执行了工具调用，但没有在最终响应中包含结果。

## 8. 关键要点

监督者模式创建了抽象层，每一层都有明确的职责。在设计监督者系统时，从清晰的领域边界开始，并为每个子智能体提供专注的工具和提示词。为监督者编写清晰的工具描述，在集成前独立测试每一层，并根据你的具体需求控制信息流。

<Tip>

<strong>何时使用监督者模式</strong>

当你有多个不同的领域（日历、电子邮件、CRM、数据库），每个领域都有多个工具或复杂逻辑，你希望集中控制工作流程，并且子智能体不需要直接与用户对话时，请使用监督者模式。

对于只有少数工具的简单情况，请使用单个智能体。当智能体需要与用户对话时，请改用[交接](/oss/langchain/multi-agent/handoffs)。对于智能体之间的点对点协作，请考虑其他多智能体模式。

</Tip>

## 后续步骤

了解用于智能体间对话的[交接](/oss/langchain/multi-agent/handoffs)，探索[上下文工程](/oss/langchain/context-engineering)以微调信息流，阅读[多智能体概述](/oss/langchain/multi-agent)以比较不同模式，并使用 [LangSmith](https://smith.langchain.com) 来调试和监控你的多智能体系统。

