---
title: 中断
---
中断机制允许您在特定节点暂停图执行，并在继续前等待外部输入。这实现了人机协同模式，即需要外部输入才能继续执行。当中断触发时，LangGraph 会使用其[持久化](/oss/python/langgraph/persistence)层保存图状态，并无限期等待，直到您恢复执行。

中断通过在图的节点中任意位置调用 `interrupt()` 函数实现。该函数接受任何可 JSON 序列化的值，该值会返回给调用者。当您准备好继续时，通过使用 `Command` 重新调用图来恢复执行，该值随后会成为节点内部 `interrupt()` 调用的返回值。

与静态断点（在特定节点之前或之后暂停）不同，中断是**动态的**——它们可以放置在代码中的任何位置，并且可以根据应用程序逻辑有条件地触发。

- **检查点保存执行位置：** 检查点器会精确写入图状态，以便您稍后恢复，即使在错误状态下也能恢复。
- **`thread_id` 是指针：** 设置 `config={"configurable": {"thread_id": ...}}` 来告知检查点器加载哪个状态。
- **中断负载以 `__interrupt__` 形式返回：** 传递给 `interrupt()` 的值会在 `__interrupt__` 字段中返回给调用者，以便您了解图正在等待什么。

您选择的 `thread_id` 实际上就是您的持久化游标。重用它会恢复同一个检查点；使用新值则会启动一个具有全新状态的新线程。

## 使用 `interrupt` 暂停

<a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 函数会暂停图执行并向调用者返回一个值。当您在节点内调用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 时，LangGraph 会保存当前图状态并等待您输入以恢复执行。

要使用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a>，您需要：
1. 一个用于持久化图状态的**检查点器**（在生产环境中使用持久化检查点器）
2. 配置中的**线程 ID**，以便运行时知道从哪个状态恢复
3. 在您想要暂停的位置调用 `interrupt()`（负载必须是可 JSON 序列化的）

```python
from langgraph.types import interrupt

def approval_node(state: State):
    # Pause and ask for approval
    approved = interrupt("Do you approve this action?")

    # When you resume, Command(resume=...) returns that value here
    return {"approved": approved}
```

当您调用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 时，会发生以下情况：

1. **图执行在 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 被调用的确切位置被挂起**
2. **状态被保存**，使用检查点器以便稍后恢复执行。在生产环境中，这应该是一个持久化检查点器（例如，由数据库支持）
3. **值在 `__interrupt__` 下返回给调用者**；它可以是任何可 JSON 序列化的值（字符串、对象、数组等）
4. **图无限期等待**，直到您提供响应恢复执行
5. **当您恢复时，响应被传递回节点**，成为 `interrupt()` 调用的返回值

## 恢复中断

中断暂停执行后，您可以通过再次调用图并附带包含恢复值的 `Command` 来恢复图。恢复值会传递回 `interrupt` 调用，允许节点继续执行并处理外部输入。

```python
from langgraph.types import Command

# Initial run - hits the interrupt and pauses
# thread_id is the persistent pointer (stores a stable ID in production)
config = {"configurable": {"thread_id": "thread-1"}}
result = graph.invoke({"input": "data"}, config=config)

# Check what was interrupted
# __interrupt__ contains the payload that was passed to interrupt()
print(result["__interrupt__"])
# > [Interrupt(value='Do you approve this action?')]

# Resume with the human's response
# The resume payload becomes the return value of interrupt() inside the node
graph.invoke(Command(resume=True), config=config)
```

**关于恢复的关键点：**

- 恢复时必须使用与中断发生时**相同的线程 ID**
- 传递给 `Command(resume=...)` 的值成为 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用的返回值
- 恢复时，节点会从调用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 的节点开头重新开始，因此 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 之前的任何代码都会再次运行
- 您可以传递任何可 JSON 序列化的值作为恢复值

## 常见模式

中断解锁的关键能力是能够暂停执行并等待外部输入。这对于多种用例非常有用，包括：

- <Icon icon="check-circle" /> [审批工作流](#approve-or-reject)：在执行关键操作（API 调用、数据库更改、金融交易）之前暂停
- <Icon icon="pencil" /> [审查和编辑](#review-and-edit-state)：让人类在继续之前审查和修改 LLM 输出或工具调用
- <Icon icon="wrench" /> [中断工具调用](#interrupts-in-tools)：在执行工具调用之前暂停，以便在执行前审查和编辑工具调用
- <Icon icon="shield-check" /> [验证人工输入](#validating-human-input)：在继续下一步之前暂停以验证人工输入

### 批准或拒绝

中断最常见的用途之一是在关键操作之前暂停并请求批准。例如，您可能希望让人类批准 API 调用、数据库更改或任何其他重要决策。

```python
from typing import Literal
from langgraph.types import interrupt, Command

def approval_node(state: State) -> Command[Literal["proceed", "cancel"]]:
    # Pause execution; payload shows up under result["__interrupt__"]
    is_approved = interrupt({
        "question": "Do you want to proceed with this action?",
        "details": state["action_details"]
    })

    # Route based on the response
    if is_approved:
        return Command(goto="proceed")  # Runs after the resume payload is provided
    else:
        return Command(goto="cancel")
```

当您恢复图时，传递 `true` 表示批准，`false` 表示拒绝：

```python
# To approve
graph.invoke(Command(resume=True), config=config)

# To reject
graph.invoke(Command(resume=False), config=config)
```

:::: details 完整示例

```python
from typing import Literal, Optional, TypedDict

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt

class ApprovalState(TypedDict):
    action_details: str
    status: Optional[Literal["pending", "approved", "rejected"]]

def approval_node(state: ApprovalState) -> Command[Literal["proceed", "cancel"]]:
    # Expose details so the caller can render them in a UI
    decision = interrupt({
        "question": "Approve this action?",
        "details": state["action_details"],
    })

    # Route to the appropriate node after resume
    return Command(goto="proceed" if decision else "cancel")

def proceed_node(state: ApprovalState):
    return {"status": "approved"}

def cancel_node(state: ApprovalState):
    return {"status": "rejected"}

builder = StateGraph(ApprovalState)
builder.add_node("approval", approval_node)
builder.add_node("proceed", proceed_node)
builder.add_node("cancel", cancel_node)
builder.add_edge(START, "approval")
builder.add_edge("proceed", END)
builder.add_edge("cancel", END)

# Use a more durable checkpointer in production
checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "approval-123"}}
initial = graph.invoke(
    {"action_details": "Transfer $500", "status": "pending"},
    config=config,
)
print(initial["__interrupt__"])  # -> [Interrupt(value={'question': ..., 'details': ...})]

# Resume with the decision; True routes to proceed, False to cancel
resumed = graph.invoke(Command(resume=True), config=config)
print(resumed["status"])  # -> "approved"
```

::::

### 审查和编辑状态

有时您希望让人类在继续之前审查和编辑图状态的一部分。这对于纠正 LLM、添加缺失信息或进行调整非常有用。

```python
from langgraph.types import interrupt

def review_node(state: State):
    # Pause and show the current content for review (surfaces in result["__interrupt__"])
    edited_content = interrupt({
        "instruction": "Review and edit this content",
        "content": state["generated_text"]
    })

    # Update the state with the edited version
    return {"generated_text": edited_content}
```

恢复时，提供编辑后的内容：

```python
graph.invoke(
    Command(resume="The edited and improved text"),  # Value becomes the return from interrupt()
    config=config
)
```

:::: details 完整示例

```python
import sqlite3
from typing import TypedDict

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt

class ReviewState(TypedDict):
    generated_text: str

def review_node(state: ReviewState):
    # Ask a reviewer to edit the generated content
    updated = interrupt({
        "instruction": "Review and edit this content",
        "content": state["generated_text"],
    })
    return {"generated_text": updated}

builder = StateGraph(ReviewState)
builder.add_node("review", review_node)
builder.add_edge(START, "review")
builder.add_edge("review", END)

checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "review-42"}}
initial = graph.invoke({"generated_text": "Initial draft"}, config=config)
print(initial["__interrupt__"])  # -> [Interrupt(value={'instruction': ..., 'content': ...})]

# Resume with the edited text from the reviewer
final_state = graph.invoke(
    Command(resume="Improved draft after review"),
    config=config,
)
print(final_state["generated_text"])  # -> "Improved draft after review"
```

::::

### 工具中的中断

您也可以将中断直接放置在工具函数内部。这使得工具本身在被调用时暂停等待批准，并允许在执行前对工具调用进行人工审查和编辑。

首先，定义一个使用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 的工具：

```python
from langchain.tools import tool
from langgraph.types import interrupt

@tool
def send_email(to: str, subject: str, body: str):
    """Send an email to a recipient."""

    # Pause before sending; payload surfaces in result["__interrupt__"]
    response = interrupt({
        "action": "send_email",
        "to": to,
        "subject": subject,
        "body": body,
        "message": "Approve sending this email?"
    })

    if response.get("action") == "approve":
        # Resume value can override inputs before executing
        final_to = response.get("to", to)
        final_subject = response.get("subject", subject)
        final_body = response.get("body", body)
        return f"Email sent to {final_to} with subject '{final_subject}'"
    return "Email cancelled by user"
```

当您希望审批逻辑与工具本身共存，使其在图的各个部分可重用时，这种方法非常有用。LLM 可以自然地调用该工具，而中断会在工具被调用时暂停执行，允许您批准、编辑或取消操作。

:::: details 完整示例

```python
import sqlite3
from typing import TypedDict

from langchain.tools import tool
from langchain_anthropic import ChatAnthropic
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt

class AgentState(TypedDict):
    messages: list[dict]

@tool
def send_email(to: str, subject: str, body: str):
    """Send an email to a recipient."""

    # Pause before sending; payload surfaces in result["__interrupt__"]
    response = interrupt({
        "action": "send_email",
        "to": to,
        "subject": subject,
        "body": body,
        "message": "Approve sending this email?",
    })

    if response.get("action") == "approve":
        final_to = response.get("to", to)
        final_subject = response.get("subject", subject)
        final_body = response.get("body", body)

        # Actually send the email (your implementation here)
        print(f"[send_email] to={final_to} subject={final_subject} body={final_body}")
        return f"Email sent to {final_to}"

    return "Email cancelled by user"

model = ChatAnthropic(model="claude-sonnet-4-5-20250929").bind_tools([send_email])

def agent_node(state: AgentState):
    # LLM may decide to call the tool; interrupt pauses before sending
    result = model.invoke(state["messages"])
    return {"messages": state["messages"] + [result]}

builder = StateGraph(AgentState)
builder.add_node("agent", agent_node)
builder.add_edge(START, "agent")
builder.add_edge("agent", END)

checkpointer = SqliteSaver(sqlite3.connect("tool-approval.db"))
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "email-workflow"}}
initial = graph.invoke(
    {
        "messages": [
            {"role": "user", "content": "Send an email to alice@example.com about the meeting"}
        ]
    },
    config=config,
)
print(initial["__interrupt__"])  # -> [Interrupt(value={'action': 'send_email', ...})]

# Resume with approval and optionally edited arguments
resumed = graph.invoke(
    Command(resume={"action": "approve", "subject": "Updated subject"}),
    config=config,
)
print(resumed["messages"][-1])  # -> Tool result returned by send_email
```

::::

### 验证人工输入

有时您需要验证来自人类的输入，并在无效时再次询问。您可以使用循环中的多个 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用来实现这一点。

```python
from langgraph.types import interrupt

def get_age_node(state: State):
    prompt = "What is your age?"

    while True:
        answer = interrupt(prompt)  # payload surfaces in result["__interrupt__"]

        # Validate the input
        if isinstance(answer, int) and answer > 0:
            # Valid input - continue
            break
        else:
            # Invalid input - ask again with a more specific prompt
            prompt = f"'{answer}' is not a valid age. Please enter a positive number."

    return {"age": answer}
```

每次您使用无效输入恢复图时，它都会以更清晰的消息再次询问。一旦提供了有效输入，节点就会完成，图继续执行。

:::: details 完整示例

```python
import sqlite3
from typing import TypedDict

from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt

class FormState(TypedDict):
    age: int | None

def get_age_node(state: FormState):
    prompt = "What is your age?"

    while True:
        answer = interrupt(prompt)  # payload surfaces in result["__interrupt__"]

        if isinstance(answer, int) and answer > 0:
            return {"age": answer}

        prompt = f"'{answer}' is not a valid age. Please enter a positive number."

builder = StateGraph(FormState)
builder.add_node("collect_age", get_age_node)
builder.add_edge(START, "collect_age")
builder.add_edge("collect_age", END)

checkpointer = SqliteSaver(sqlite3.connect("forms.db"))
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "form-1"}}
first = graph.invoke({"age": None}, config=config)
print(first["__interrupt__"])  # -> [Interrupt(value='What is your age?', ...)]

# Provide invalid data; the node re-prompts
retry = graph.invoke(Command(resume="thirty"), config=config)
print(retry["__interrupt__"])  # -> [Interrupt(value="'thirty' is not a valid age...", ...)]

# Provide valid data; loop exits and state updates
final = graph.invoke(Command(resume=30), config=config)
print(final["age"])  # -> 30
```

::::

## 中断规则

当您在节点内调用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 时，LangGraph 会通过引发一个通知运行时暂停的异常来挂起执行。此异常会通过调用栈向上传播，并被运行时捕获，运行时随后通知图保存当前状态并等待外部输入。

当执行恢复时（在您提供请求的输入之后），运行时**会从头开始重新启动整个节点**——它不会从调用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 的确切行恢复。这意味着在 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 之前运行的任何代码都会再次执行。因此，在使用中断时，需要遵循一些重要规则以确保其行为符合预期。

### 不要在 try/except 中包装 `interrupt` 调用

<a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 通过在调用点抛出特殊异常来暂停执行。如果您将 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用包装在 try/except 块中，您将捕获此异常，中断将不会传递回图。

* ✅ 将 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用与易出错的代码分开
* ✅ 在 try/except 块中使用特定的异常类型

::: code-group

```python [Separating logic]
def node_a(state: State):
    # ✅ Good: interrupting first, then handling
    # error conditions separately
    interrupt("What's your name?")
    try:
        fetch_data()  # This can fail
    except Exception as e:
        print(e)
    return state
```

```python [Explicit exception handling]
def node_a(state: State):
    # ✅ Good: catching specific exception types
    # will not catch the interrupt exception
    try:
        name = interrupt("What's your name?")
        fetch_data()  # This can fail
    except NetworkException as e:
        print(e)
    return state
```

:::

* 🔴 不要在裸 try/except 块中包装 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用

```python
def node_a(state: State):
    # ❌ Bad: wrapping interrupt in bare try/except
    # will catch the interrupt exception
    try:
        interrupt("What's your name?")
    except Exception as e:
        print(e)
    return state
```

### 不要在节点内重新排序 `interrupt` 调用

在单个节点中使用多个中断很常见，但如果不小心处理，可能会导致意外行为。

当一个节点包含多个中断调用时，LangGraph 会为执行该节点的任务维护一个特定的恢复值列表。每当执行恢复时，它都从节点的开头开始。对于遇到的每个中断，LangGraph 会检查任务恢复列表中是否存在匹配的值。匹配是**严格基于索引的**，因此节点内中断调用的顺序很重要。

* ✅ 保持节点执行间 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用的一致性

```python
def node_a(state: State):
    # ✅ Good: interrupt calls happen in the same order every time
    name = interrupt("What's your name?")
    age = interrupt("What's your age?")
    city = interrupt("What's your city?")

    return {
        "name": name,
        "age": age,
        "city": city
    }
```

* 🔴 不要有条件地跳过节点内的 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用
* 🔴 不要使用在执行间非确定性的逻辑来循环 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用

::: code-group

```python [Skipping interrupts]
def node_a(state: State):
    # ❌ Bad: conditionally skipping interrupts changes the order
    name = interrupt("What's your name?")

    # On first run, this might skip the interrupt
    # On resume, it might not skip it - causing index mismatch
    if state.get("needs_age"):
        age = interrupt("What's your age?")

    city = interrupt("What's your city?")

    return {"name": name, "city": city}
```

```python [Looping interrupts]
def node_a(state: State):
    # ❌ Bad: looping based on non-deterministic data
    # The number of interrupts changes between executions
    results = []
    for item in state.get("dynamic_list", []):  # List might change between runs
        result = interrupt(f"Approve {item}?")
        results.append(result)

    return {"results": results}
```

:::

### 不要在 `interrupt` 调用中返回复杂值

根据所使用的检查点器，复杂值可能无法序列化（例如，您无法序列化一个函数）。为了使您的图能够适应任何部署环境，最佳实践是仅使用可以合理序列化的值。

* ✅ 向 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 传递简单的、可 JSON 序列化的类型
* ✅ 传递包含简单值的字典/对象

::: code-group

```python [Simple values]
def node_a(state: State):
    # ✅ Good: passing simple types that are serializable
    name = interrupt("What's your name?")
    count = interrupt(42)
    approved = interrupt(True)

    return {"name": name, "count": count, "approved": approved}
```

```python [Structured data]
def node_a(state: State):
    # ✅ Good: passing dictionaries with simple values
    response = interrupt({
        "question": "Enter user details",
        "fields": ["name", "email", "age"],
        "current_values": state.get("user", {})
    })

    return {"user": response}
```

:::

* 🔴 不要向 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 传递函数、类实例或其他复杂对象

::: code-group

```python [Functions]
def validate_input(value):
    return len(value) > 0

def node_a(state: State):
    # ❌ Bad: passing a function to interrupt
    # The function cannot be serialized
    response = interrupt({
        "question": "What's your name?",
        "validator": validate_input  # This will fail
    })
    return {"name": response}
```

```python [Class instances]
class DataProcessor:
    def __init__(self, config):
        self.config = config

def node_a(state: State):
    processor = DataProcessor({"mode": "strict"})

    # ❌ Bad: passing a class instance to interrupt
    # The instance cannot be serialized
    response = interrupt({
        "question": "Enter data to process",
        "processor": processor  # This will fail
    })
    return {"result": response}
```

:::

### 在 `interrupt` 之前调用的副作用必须是幂等的

因为中断通过重新运行它们被调用的节点来工作，所以在 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 之前调用的副作用应该（理想情况下）是幂等的。上下文中的幂等性意味着同一操作可以多次应用，而不会改变初始执行之外的结果。

例如，您可能有一个在节点内部更新记录的 API 调用。如果在进行该调用之后调用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a>，则在节点恢复时将多次重新运行，可能会覆盖初始更新或创建重复记录。

* ✅ 在 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 之前使用幂等操作
* ✅ 将副作用放在 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用之后
* ✅ 尽可能将副作用分离到单独的节点中

::: code-group

```python [Idempotent operations]
def node_a(state: State):
    # ✅ Good: using upsert operation which is idempotent
    # Running this multiple times will have the same result
    db.upsert_user(
        user_id=state["user_id"],
        status="pending_approval"
    )

    approved = interrupt("Approve this change?")

    return {"approved": approved}
```

```python [Side effects after interrupt]
def node_a(state: State):
    # ✅ Good: placing side effect after the interrupt
    # This ensures it only runs once after approval is received
    approved = interrupt("Approve this change?")

    if approved:
        db.create_audit_log(
            user_id=state["user_id"],
            action="approved"
        )

    return {"approved": approved}
```

```python [Separating into different nodes]
def approval_node(state: State):
    # ✅ Good: only handling the interrupt in this node
    approved = interrupt("Approve this change?")

    return {"approved": approved}

def notification_node(state: State):
    # ✅ Good: side effect happens in a separate node
    # This runs after approval, so it only executes once
    if (state.approved):
        send_notification(
            user_id=state["user_id"],
            status="approved"
        )

    return state
```

:::

* 🔴 不要在 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 之前执行非幂等操作
* 🔴 不要在不检查是否存在的情况下创建新记录

::: code-group

```python [Creating records]
def node_a(state: State):
    # ❌ Bad: creating a new record before interrupt
    # This will create duplicate records on each resume
    audit_id = db.create_audit_log({
        "user_id": state["user_id"],
        "action": "pending_approval",
        "timestamp": datetime.now()
    })

    approved = interrupt("Approve this change?")

    return {"approved": approved, "audit_id": audit_id}
```

```python [Appending to lists]
def node_a(state: State):
    # ❌ Bad: appending to a list before interrupt
    # This will add duplicate entries on each resume
    db.append_to_history(state["user_id"], "approval_requested")

    approved = interrupt("Approve this change?")

    return {"approved": approved}
```

:::

## 与作为函数调用的子图一起使用

当在节点内调用子图时，父图将从**调用子图并触发 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 的节点开头**恢复执行。同样，**子图**也将从调用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 的节点开头恢复。

```python
def node_in_parent_graph(state: State):
    some_code()  # <-- This will re-execute when resumed
    # Invoke a subgraph as a function.
    # The subgraph contains an `interrupt` call.
    subgraph_result = subgraph.invoke(some_input)
    # ...

def node_in_subgraph(state: State):
    some_other_code()  # <-- This will also re-execute when resumed
    result = interrupt("What's your name?")
    # ...
```

## 使用中断进行调试

要调试和测试图，您可以使用静态中断作为断点，逐步执行图，一次一个节点。静态中断在定义的点触发，要么在节点执行之前，要么在之后。您可以通过在编译图时指定 `interrupt_before` 和 `interrupt_after` 来设置这些断点。

<Note>

静态中断<strong>不</strong>推荐用于人机协同工作流。请改用 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 函数。

</Note>

<Tabs>

<Tab title="在编译时">

```python
graph = builder.compile(
    interrupt_before=["node_a"],  # [!code highlight]
    interrupt_after=["node_b", "node_c"],  # [!code highlight]
    checkpointer=checkpointer,
)

# Pass a thread ID to the graph
config = {
    "configurable": {
        "thread_id": "some_thread"
    }
}

# Run the graph until the breakpoint
graph.invoke(inputs, config=config)  # [!code highlight]

# Resume the graph
graph.invoke(None, config=config)  # [!code highlight]
```

1. 断点在 `compile` 时设置。
2. `interrupt_before` 指定在节点执行之前应暂停执行的节点。
3. `interrupt_after` 指定在节点执行之后应暂停执行的节点。
4. 需要检查点器才能启用断点。
5. 图运行直到遇到第一个断点。
6. 通过传入 `None` 作为输入来恢复图。这将运行图直到遇到下一个断点。

</Tab>

<Tab title="在运行时">

```python
config = {
    "configurable": {
        "thread_id": "some_thread"
    }
}

# Run the graph until the breakpoint
graph.invoke(
    inputs,
    interrupt_before=["node_a"],  # [!code highlight]
    interrupt_after=["node_b", "node_c"],  # [!code highlight]
    config=config,
)

# Resume the graph
graph.invoke(None, config=config)  # [!code highlight]
```

1. 调用 `graph.invoke` 时传入 `interrupt_before` 和 `interrupt_after` 参数。这是运行时配置，每次调用时都可以更改。
2. `interrupt_before` 指定在执行节点前应暂停执行的节点。
3. `interrupt_after` 指定在执行节点后应暂停执行的节点。
4. 运行图直到遇到第一个断点。
5. 通过传入 `None` 作为输入来恢复图的执行。这将运行图直到遇到下一个断点。

</Tab>

</Tabs>

### 使用 LangGraph Studio

您可以使用 [LangGraph Studio](/langsmith/studio) 在运行图之前在 UI 中设置静态中断。您还可以使用 UI 在执行过程中的任何点检查图的状态。

![image](/oss/images/static-interrupt.png)

