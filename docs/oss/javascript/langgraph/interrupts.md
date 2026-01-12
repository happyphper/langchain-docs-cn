---
title: 中断
---
中断机制允许您在特定节点暂停图执行，并在继续前等待外部输入。这实现了人机协同模式，即需要外部输入才能继续执行。当中断触发时，LangGraph 会使用其[持久化](/oss/javascript/langgraph/persistence)层保存图状态，并无限期等待，直到您恢复执行。

中断通过在图的节点中任意位置调用 `interrupt()` 函数实现。该函数接受任何可 JSON 序列化的值，该值会返回给调用者。当您准备好继续时，通过使用 `Command` 重新调用图来恢复执行，该值随后会成为节点内部 `interrupt()` 调用的返回值。

与静态断点（在特定节点之前或之后暂停）不同，中断是**动态的**——它们可以放置在代码中的任何位置，并且可以根据应用程序逻辑有条件地触发。

- **检查点保存执行位置：** 检查点器会精确写入图状态，以便您稍后恢复，即使在错误状态下也能恢复。
- **`thread_id` 是指针：** 使用 `{ configurable: { thread_id: ... } }` 作为 `invoke` 方法的选项来告知检查点器加载哪个状态。
- **中断负载以 `__interrupt__` 形式返回：** 传递给 `interrupt()` 的值会在 `__interrupt__` 字段中返回给调用者，以便您了解图正在等待什么。

您选择的 `thread_id` 实际上就是您的持久化游标。重用它会恢复同一个检查点；使用新值则会启动一个具有全新状态的新线程。

## 使用 `interrupt` 暂停

<a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 函数会暂停图执行并向调用者返回一个值。当您在节点内调用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 时，LangGraph 会保存当前图状态并等待您输入以恢复执行。

要使用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a>，您需要：
1. 一个用于持久化图状态的**检查点器**（在生产环境中使用持久化检查点器）
2. 配置中的**线程 ID**，以便运行时知道从哪个状态恢复
3. 在您想要暂停的位置调用 `interrupt()`（负载必须是可 JSON 序列化的）

```typescript
import { interrupt } from "@langchain/langgraph";

async function approvalNode(state: State) {
    // Pause and ask for approval
    const approved = interrupt("Do you approve this action?");

    // Command({ resume: ... }) provides the value returned into this variable
    return { approved };
}
```

当您调用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 时，会发生以下情况：

1. **图执行在 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 被调用的确切位置被挂起**
2. **状态被保存**，使用检查点器以便稍后恢复执行。在生产环境中，这应该是一个持久化检查点器（例如，由数据库支持）
3. **值在 `__interrupt__` 下返回给调用者**；它可以是任何可 JSON 序列化的值（字符串、对象、数组等）
4. **图无限期等待**，直到您提供响应恢复执行
5. **当您恢复时，响应被传递回节点**，成为 `interrupt()` 调用的返回值

## 恢复中断

中断暂停执行后，您可以通过再次调用图并附带包含恢复值的 `Command` 来恢复图。恢复值会传递回 `interrupt` 调用，允许节点继续执行并处理外部输入。

```typescript
import { Command } from "@langchain/langgraph";

// Initial run - hits the interrupt and pauses
// thread_id is the durable pointer back to the saved checkpoint
const config = { configurable: { thread_id: "thread-1" } };
const result = await graph.invoke({ input: "data" }, config);

// Check what was interrupted
// __interrupt__ mirrors every payload you passed to interrupt()
console.log(result.__interrupt__);
// [{ value: 'Do you approve this action?', ... }]

// Resume with the human's response
// Command({ resume }) returns that value from interrupt() in the node
await graph.invoke(new Command({ resume: true }), config);
```

**关于恢复的关键点：**

- 恢复时必须使用与中断发生时**相同的线程 ID**
- 传递给 `Command(resume=...)` 的值成为 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用的返回值
- 恢复时，节点会从调用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 的节点开头重新开始，因此 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 之前的任何代码都会再次运行
- 您可以传递任何可 JSON 序列化的值作为恢复值

## 常见模式

中断解锁的关键能力是能够暂停执行并等待外部输入。这对于多种用例非常有用，包括：

- <Icon icon="check-circle" /> [审批工作流](#approve-or-reject)：在执行关键操作（API 调用、数据库更改、金融交易）之前暂停
- <Icon icon="pencil" /> [审查和编辑](#review-and-edit-state)：让人类在继续之前审查和修改 LLM 输出或工具调用
- <Icon icon="wrench" /> [中断工具调用](#interrupts-in-tools)：在执行工具调用之前暂停，以便在执行前审查和编辑工具调用
- <Icon icon="shield-check" /> [验证人工输入](#validating-human-input)：在继续下一步之前暂停以验证人工输入

### 批准或拒绝

中断最常见的用途之一是在关键操作之前暂停并请求批准。例如，您可能希望让人类批准 API 调用、数据库更改或任何其他重要决策。

```typescript
import { interrupt, Command } from "@langchain/langgraph";

function approvalNode(state: State): Command {
  // Pause execution; payload surfaces in result.__interrupt__
  const isApproved = interrupt({
    question: "Do you want to proceed?",
    details: state.actionDetails
  });

  // Route based on the response
  if (isApproved) {
    return new Command({ goto: "proceed" }); // Runs after the resume payload is provided
  } else {
    return new Command({ goto: "cancel" });
  }
}
```

当您恢复图时，传递 `true` 表示批准，`false` 表示拒绝：

```typescript
// To approve
await graph.invoke(new Command({ resume: true }), config);

// To reject
await graph.invoke(new Command({ resume: false }), config);
```

:::: details 完整示例

```typescript
import {
  Command,
  MemorySaver,
  START,
  END,
  StateGraph,
  interrupt,
} from "@langchain/langgraph";
import * as z from "zod";

const State = z.object({
  actionDetails: z.string(),
  status: z.enum(["pending", "approved", "rejected"]).nullable(),
});

const graphBuilder = new StateGraph(State)
  .addNode("approval", async (state) => {
    // Expose details so the caller can render them in a UI
    const decision = interrupt({
      question: "Approve this action?",
      details: state.actionDetails,
    });
    return new Command({ goto: decision ? "proceed" : "cancel" });
  }, { ends: ['proceed', 'cancel'] })
  .addNode("proceed", () => ({ status: "approved" }))
  .addNode("cancel", () => ({ status: "rejected" }))
  .addEdge(START, "approval")
  .addEdge("proceed", END)
  .addEdge("cancel", END);

// Use a more durable checkpointer in production
const checkpointer = new MemorySaver();
const graph = graphBuilder.compile({ checkpointer });

const config = { configurable: { thread_id: "approval-123" } };
const initial = await graph.invoke(
  { actionDetails: "Transfer $500", status: "pending" },
  config,
);
console.log(initial.__interrupt__);
// [{ value: { question: ..., details: ... } }]

// Resume with the decision; true routes to proceed, false to cancel
const resumed = await graph.invoke(new Command({ resume: true }), config);
console.log(resumed.status); // -> "approved"
```

::::

### 审查和编辑状态

有时您希望让人类在继续之前审查和编辑图状态的一部分。这对于纠正 LLM、添加缺失信息或进行调整非常有用。

```typescript
import { interrupt } from "@langchain/langgraph";

function reviewNode(state: State) {
  // Pause and show the current content for review (surfaces in result.__interrupt__)
  const editedContent = interrupt({
    instruction: "Review and edit this content",
    content: state.generatedText
  });

  // Update the state with the edited version
  return { generatedText: editedContent };
}
```

恢复时，提供编辑后的内容：

```typescript
await graph.invoke(
  new Command({ resume: "The edited and improved text" }), // Value becomes the return from interrupt()
  config
);
```

:::: details 完整示例

```typescript
import {
  Command,
  MemorySaver,
  START,
  END,
  StateGraph,
  interrupt,
} from "@langchain/langgraph";
import * as z from "zod";

const State = z.object({
  generatedText: z.string(),
});

const builder = new StateGraph(State)
  .addNode("review", async (state) => {
    // Ask a reviewer to edit the generated content
    const updated = interrupt({
      instruction: "Review and edit this content",
      content: state.generatedText,
    });
    return { generatedText: updated };
  })
  .addEdge(START, "review")
  .addEdge("review", END);

const checkpointer = new MemorySaver();
const graph = builder.compile({ checkpointer });

const config = { configurable: { thread_id: "review-42" } };
const initial = await graph.invoke({ generatedText: "Initial draft" }, config);
console.log(initial.__interrupt__);
// [{ value: { instruction: ..., content: ... } }]

// Resume with the edited text from the reviewer
const finalState = await graph.invoke(
  new Command({ resume: "Improved draft after review" }),
  config,
);
console.log(finalState.generatedText); // -> "Improved draft after review"
```

::::

### 工具中的中断

您也可以将中断直接放置在工具函数内部。这使得工具本身在被调用时暂停等待批准，并允许在执行前对工具调用进行人工审查和编辑。

首先，定义一个使用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 的工具：

```typescript
import { tool } from "@langchain/core/tools";
import { interrupt } from "@langchain/langgraph";
import * as z from "zod";

const sendEmailTool = tool(
  async ({ to, subject, body }) => {
    // Pause before sending; payload surfaces in result.__interrupt__
    const response = interrupt({
      action: "send_email",
      to,
      subject,
      body,
      message: "Approve sending this email?",
    });

    if (response?.action === "approve") {
      // Resume value can override inputs before executing
      const finalTo = response.to ?? to;
      const finalSubject = response.subject ?? subject;
      const finalBody = response.body ?? body;
      return `Email sent to ${finalTo} with subject '${finalSubject}'`;
    }
    return "Email cancelled by user";
  },
  {
    name: "send_email",
    description: "Send an email to a recipient",
    schema: z.object({
      to: z.string(),
      subject: z.string(),
      body: z.string(),
    }),
  },
);
```

当您希望审批逻辑与工具本身共存，使其在图的各个部分可重用时，这种方法非常有用。LLM 可以自然地调用该工具，而中断会在工具被调用时暂停执行，允许您批准、编辑或取消操作。

:::: details 完整示例

```typescript
import { tool } from "@langchain/core/tools";
import { ChatAnthropic } from "@langchain/anthropic";
import {
  Command,
  MemorySaver,
  START,
  END,
  StateGraph,
  interrupt,
} from "@langchain/langgraph";
import * as z from "zod";

const sendEmailTool = tool(
  async ({ to, subject, body }) => {
    // Pause before sending; payload surfaces in result.__interrupt__
    const response = interrupt({
      action: "send_email",
      to,
      subject,
      body,
      message: "Approve sending this email?",
    });

    if (response?.action === "approve") {
      const finalTo = response.to ?? to;
      const finalSubject = response.subject ?? subject;
      const finalBody = response.body ?? body;
      console.log("[sendEmailTool]", finalTo, finalSubject, finalBody);
      return `Email sent to ${finalTo}`;
    }
    return "Email cancelled by user";
  },
  {
    name: "send_email",
    description: "Send an email to a recipient",
    schema: z.object({
      to: z.string(),
      subject: z.string(),
      body: z.string(),
    }),
  },
);

const model = new ChatAnthropic({ model: "claude-sonnet-4-5-20250929" }).bindTools([sendEmailTool]);

const Message = z.object({
  role: z.enum(["user", "assistant", "tool"]),
  content: z.string(),
});

const State = z.object({
  messages: z.array(Message),
});

const graphBuilder = new StateGraph(State)
  .addNode("agent", async (state) => {
    // LLM may decide to call the tool; interrupt pauses before sending
    const response = await model.invoke(state.messages);
    return { messages: [...state.messages, response] };
  })
  .addEdge(START, "agent")
  .addEdge("agent", END);

const checkpointer = new MemorySaver();
const graph = graphBuilder.compile({ checkpointer });

const config = { configurable: { thread_id: "email-workflow" } };
const initial = await graph.invoke(
  {
    messages: [
      { role: "user", content: "Send an email to alice@example.com about the meeting" },
    ],
  },
  config,
);
console.log(initial.__interrupt__); // -> [{ value: { action: 'send_email', ... } }]

// Resume with approval and optionally edited arguments
const resumed = await graph.invoke(
  new Command({
    resume: { action: "approve", subject: "Updated subject" },
  }),
  config,
);
console.log(resumed.messages.at(-1)); // -> Tool result returned by send_email
```

::::

### 验证人工输入

有时您需要验证来自人类的输入，并在无效时再次询问。您可以使用循环中的多个 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用来实现这一点。

```typescript
import { interrupt } from "@langchain/langgraph";

function getAgeNode(state: State) {
  let prompt = "What is your age?";

  while (true) {
    const answer = interrupt(prompt); // payload surfaces in result.__interrupt__

    // Validate the input
    if (typeof answer === "number" && answer > 0) {
      // Valid input - continue
      return { age: answer };
    } else {
      // Invalid input - ask again with a more specific prompt
      prompt = `'${answer}' is not a valid age. Please enter a positive number.`;
    }
  }
}
```

每次您使用无效输入恢复图时，它都会以更清晰的消息再次询问。一旦提供了有效输入，节点就会完成，图继续执行。

:::: details 完整示例

```typescript
import {
  Command,
  MemorySaver,
  START,
  END,
  StateGraph,
  interrupt,
} from "@langchain/langgraph";
import * as z from "zod";

const State = z.object({
  age: z.number().nullable(),
});

const builder = new StateGraph(State)
  .addNode("collectAge", (state) => {
    let prompt = "What is your age?";

    while (true) {
      const answer = interrupt(prompt); // payload surfaces in result.__interrupt__

      if (typeof answer === "number" && answer > 0) {
        return { age: answer };
      }

      prompt = `'${answer}' is not a valid age. Please enter a positive number.`;
    }
  })
  .addEdge(START, "collectAge")
  .addEdge("collectAge", END);

const checkpointer = new MemorySaver();
const graph = builder.compile({ checkpointer });

const config = { configurable: { thread_id: "form-1" } };
const first = await graph.invoke({ age: null }, config);
console.log(first.__interrupt__); // -> [{ value: "What is your age?", ... }]

// Provide invalid data; the node re-prompts
const retry = await graph.invoke(new Command({ resume: "thirty" }), config);
console.log(retry.__interrupt__); // -> [{ value: "'thirty' is not a valid age...", ... }]

// Provide valid data; loop exits and state updates
const final = await graph.invoke(new Command({ resume: 30 }), config);
console.log(final.age); // -> 30
```

::::

## 中断规则

当您在节点内调用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 时，LangGraph 会通过引发一个通知运行时暂停的异常来挂起执行。此异常会通过调用栈向上传播，并被运行时捕获，运行时随后通知图保存当前状态并等待外部输入。

当执行恢复时（在您提供请求的输入之后），运行时**会从头开始重新启动整个节点**——它不会从调用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 的确切行恢复。这意味着在 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 之前运行的任何代码都会再次执行。因此，在使用中断时，需要遵循一些重要规则以确保其行为符合预期。

### 不要在 try/catch 中包装 `interrupt` 调用

<a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 通过在调用点抛出特殊异常来暂停执行。如果您将 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用包装在 try/catch 块中，您将捕获此异常，中断将不会传递回图。

* ✅ 将 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用与易出错的代码分开
* ✅ 如果需要，有条件地捕获错误

::: code-group

```typescript [Separating logic]
async function nodeA(state: State) {
    // ✅ Good: interrupting first, then handling error conditions separately
    const name = interrupt("What's your name?");
    try {
        await fetchData(); // This can fail
    } catch (err) {
        console.error(error);
    }
    return state;
}
```

```typescript [Conditionally handling errors]
async function nodeA(state: State) {
    // ✅ Good: re-throwing the exception will
    // allow the interrupt to be passed back to
    // the graph
    try {
        const name = interrupt("What's your name?");
        await fetchData(); // This can fail
    } catch (err) {
        if (error instanceof NetworkError) {
            console.error(error);
        }
        throw error;
    }
    return state;
}
```

:::

* 🔴 不要在裸 try/catch 块中包装 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用

```typescript
async function nodeA(state: State) {
    // ❌ Bad: wrapping interrupt in bare try/catch will catch the interrupt exception
    try {
        const name = interrupt("What's your name?");
    } catch (err) {
        console.error(error);
    }
    return state;
}
```

### 不要在节点内重新排序 `interrupt` 调用

在单个节点中使用多个中断很常见，但如果不小心处理，可能会导致意外行为。

当一个节点包含多个中断调用时，LangGraph 会为执行该节点的任务维护一个特定的恢复值列表。每当执行恢复时，它都从节点的开头开始。对于遇到的每个中断，LangGraph 会检查任务恢复列表中是否存在匹配的值。匹配是**严格基于索引的**，因此节点内中断调用的顺序很重要。

* ✅ 保持节点执行间 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用的一致性

```typescript
async function nodeA(state: State) {
    // ✅ Good: interrupt calls happen in the same order every time
    const name = interrupt("What's your name?");
    const age = interrupt("What's your age?");
    const city = interrupt("What's your city?");

    return {
        name,
        age,
        city
    };
}
```

* 🔴 不要有条件地跳过节点内的 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用
* 🔴 不要使用在执行间非确定性的逻辑来循环 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用

::: code-group

```typescript [Skipping interrupts]
async function nodeA(state: State) {
    // ❌ Bad: conditionally skipping interrupts changes the order
    const name = interrupt("What's your name?");

    // On first run, this might skip the interrupt
    // On resume, it might not skip it - causing index mismatch
    if (state.needsAge) {
        const age = interrupt("What's your age?");
    }

    const city = interrupt("What's your city?");

    return { name, city };
}
```

```typescript [Looping interrupts]
async function nodeA(state: State) {
    // ❌ Bad: looping based on non-deterministic data
    // The number of interrupts changes between executions
    const results = [];
    for (const item of state.dynamicList || []) {  // List might change between runs
        const result = interrupt(`Approve ${item}?`);
        results.push(result);
    }

    return { results };
}
```

:::

### 不要在 `interrupt` 调用中返回复杂值

根据所使用的检查点器，复杂值可能无法序列化（例如，您无法序列化一个函数）。为了使您的图能够适应任何部署环境，最佳实践是仅使用可以合理序列化的值。

* ✅ 向 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 传递简单的、可 JSON 序列化的类型
* ✅ 传递包含简单值的字典/对象

::: code-group

```typescript [Simple values]
async function nodeA(state: State) {
    // ✅ Good: passing simple types that are serializable
    const name = interrupt("What's your name?");
    const count = interrupt(42);
    const approved = interrupt(true);

    return { name, count, approved };
}
```

```typescript [Structured data]
async function nodeA(state: State) {
    // ✅ Good: passing objects with simple values
    const response = interrupt({
        question: "Enter user details",
        fields: ["name", "email", "age"],
        currentValues: state.user || {}
    });

    return { user: response };
}
```

:::

* 🔴 不要向 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 传递函数、类实例或其他复杂对象

::: code-group

```typescript [Functions]
function validateInput(value: string): boolean {
    return value.length > 0;
}

async function nodeA(state: State) {
    // ❌ Bad: passing a function to interrupt
    // The function cannot be serialized
    const response = interrupt({
        question: "What's your name?",
        validator: validateInput  // This will fail
    });
    return { name: response };
}
```

```typescript [Class instances]
class DataProcessor {
    constructor(private config: any) {}
}

async function nodeA(state: State) {
    const processor = new DataProcessor({ mode: "strict" });

    // ❌ Bad: passing a class instance to interrupt
    // The instance cannot be serialized
    const response = interrupt({
        question: "Enter data to process",
        processor: processor  // This will fail
    });
    return { result: response };
}
```

:::

### 在 `interrupt` 之前调用的副作用必须是幂等的

因为中断通过重新运行它们被调用的节点来工作，所以在 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 之前调用的副作用应该（理想情况下）是幂等的。上下文中的幂等性意味着同一操作可以多次应用，而不会改变初始执行之外的结果。

例如，您可能有一个在节点内部更新记录的 API 调用。如果在进行该调用之后调用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a>，则在节点恢复时将多次重新运行，可能会覆盖初始更新或创建重复记录。

* ✅ 在 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 之前使用幂等操作
* ✅ 将副作用放在 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用之后
* ✅ 尽可能将副作用分离到单独的节点中

::: code-group

```typescript [Idempotent operations]
async function nodeA(state: State) {
    // ✅ Good: using upsert operation which is idempotent
    // Running this multiple times will have the same result
    await db.upsertUser({
        userId: state.userId,
        status: "pending_approval"
    });

    const approved = interrupt("Approve this change?");

    return { approved };
}
```

```typescript [Side effects after interrupt]
async function nodeA(state: State) {
    // ✅ Good: placing side effect after the interrupt
    // This ensures it only runs once after approval is received
    const approved = interrupt("Approve this change?");

    if (approved) {
        await db.createAuditLog({
            userId: state.userId,
            action: "approved"
        });
    }

    return { approved };
}
```

```typescript [Separating into different nodes]
async function approvalNode(state: State) {
    // ✅ Good: only handling the interrupt in this node
    const approved = interrupt("Approve this change?");

    return { approved };
}

async function notificationNode(state: State) {
    // ✅ Good: side effect happens in a separate node
    // This runs after approval, so it only executes once
    if (state.approved) {
        await sendNotification({
            userId: state.userId,
            status: "approved"
        });
    }

    return state;
}
```

:::

* 🔴 不要在 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 之前执行非幂等操作
* 🔴 不要在不检查是否存在的情况下创建新记录

::: code-group

```typescript [Creating records]
async function nodeA(state: State) {
    // ❌ Bad: creating a new record before interrupt
    // This will create duplicate records on each resume
    const auditId = await db.createAuditLog({
        userId: state.userId,
        action: "pending_approval",
        timestamp: new Date()
    });

    const approved = interrupt("Approve this change?");

    return { approved, auditId };
}
```

```typescript [Appending to arrays]
async function nodeA(state: State) {
    // ❌ Bad: appending to an array before interrupt
    // This will add duplicate entries on each resume
    await db.appendToHistory(state.userId, "approval_requested");

    const approved = interrupt("Approve this change?");

    return { approved };
}
```

:::

## 与作为函数调用的子图一起使用

当在节点内调用子图时，父图将从**调用子图并触发 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 的节点开头**恢复执行。同样，**子图**也将从调用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 的节点开头恢复。

```typescript
async function nodeInParentGraph(state: State) {
    someCode(); // <-- This will re-execute when resumed
    // Invoke a subgraph as a function.
    // The subgraph contains an `interrupt` call.
    const subgraphResult = await subgraph.invoke(someInput);
    // ...
}

async function nodeInSubgraph(state: State) {
    someOtherCode(); // <-- This will also re-execute when resumed
    const result = interrupt("What's your name?");
    // ...
}
```

## 使用中断进行调试

要调试和测试图，您可以使用静态中断作为断点，逐步执行图，一次一个节点。静态中断在定义的点触发，要么在节点执行之前，要么在之后。您可以通过在编译图时指定 `interruptBefore` 和 `interruptAfter` 来设置这些断点。

<Note>

静态中断<strong>不</strong>推荐用于人机协同工作流。请改用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 函数。

</Note>

<Tabs>

<Tab title="在编译时">

```typescript
const graph = builder.compile({
    interruptBefore: ["node_a"],  // [!code highlight]
    interruptAfter: ["node_b", "node_c"],  // [!code highlight]
    checkpointer,
});

// Pass a thread ID to the graph
const config = {
    configurable: {
        thread_id: "some_thread"
    }
};

// Run the graph until the breakpoint
await graph.invoke(inputs, config);# [!code highlight]

await graph.invoke(null, config);  # [!code highlight]
```

1. 断点在 `compile` 时设置。
2. `interruptBefore` 指定在节点执行之前应暂停执行的节点。
3. `interruptAfter` 指定在节点执行之后应暂停执行的节点。
4. 需要检查点器才能启用断点。
5. 图运行直到遇到第一个断点。
6. 通过传入 `null` 作为输入来恢复图。这将运行图直到遇到下一个断点。

</Tab>

<Tab title="在运行时">

```typescript
// Run the graph until the breakpoint
graph.invoke(inputs, {
    interruptBefore: ["node_a"],  // [!code highlight]
    interruptAfter: ["node_b", "node_c"],  // [!code highlight]
    configurable: {
        thread_id: "some_thread"
    }
});

// Resume the graph
await graph.invoke(null, config);  // [!code highlight]
```

1. 调用 `graph.invoke` 时传入 `interruptBefore` 和 `interruptAfter` 参数。这是运行时配置，每次调用时都可以更改。
2. `interruptBefore` 指定在执行节点前应暂停执行的节点。
3. `interruptAfter` 指定在执行节点后应暂停执行的节点。
4. 运行图直到遇到第一个断点。
5. 通过传入 `null` 作为输入来恢复图的执行。这将运行图直到遇到下一个断点。

</Tab>

</Tabs>

### 使用 LangGraph Studio

您可以使用 [LangGraph Studio](/langsmith/studio) 在运行图之前在 UI 中设置静态中断。您还可以使用 UI 在执行过程中的任何点检查图的状态。

![image](/oss/images/static-interrupt.png)

