---
title: 持久化执行
---
**持久化执行**是一种技术，通过该技术，流程或工作流在关键点保存其进度，使其能够暂停并在之后从停止处精确恢复。这在需要[人机协同](/oss/javascript/langgraph/interrupts)的场景中尤其有用，用户可以在继续之前检查、验证或修改流程；同时，它也适用于可能遇到中断或错误（例如，调用大语言模型超时）的长时间运行任务。通过保留已完成的工作，持久化执行使得流程能够在不重新处理先前步骤的情况下恢复——即使在经历显著延迟（例如，一周后）之后。

LangGraph 内置的[持久化](/oss/javascript/langgraph/persistence)层为工作流提供了持久化执行功能，确保每个执行步骤的状态都保存到持久化存储中。此功能保证了如果工作流被中断——无论是由于系统故障还是为了进行[人机协同](/oss/javascript/langgraph/interrupts)交互——它都可以从最后记录的状态恢复。

<Tip>

如果您在使用带有检查点（checkpointer）的 LangGraph，那么您已经启用了持久化执行。您可以在任何点暂停和恢复工作流，即使在中断或故障之后也是如此。
为了充分利用持久化执行，请确保您的工作流被设计为[确定性的](#determinism-and-consistent-replay)和[幂等的](#determinism-and-consistent-replay)，并将任何副作用或非确定性操作包装在[任务（tasks）](/oss/javascript/langgraph/functional-api#task)中。您可以在[StateGraph（Graph API）](/oss/javascript/langgraph/graph-api)和[Functional API](/oss/javascript/langgraph/functional-api)中使用[任务（tasks）](/oss/javascript/langgraph/functional-api#task)。

</Tip>

## 要求

为了在 LangGraph 中利用持久化执行，您需要：

1.  通过指定一个将保存工作流进度的[检查点（checkpointer）](/oss/javascript/langgraph/persistence#checkpointer-libraries)来在工作流中启用[持久化（persistence）](/oss/javascript/langgraph/persistence)。
2.  在执行工作流时指定一个[线程标识符（thread identifier）](/oss/javascript/langgraph/persistence#threads)。这将跟踪特定工作流实例的执行历史。

1. 将任何非确定性操作（例如，随机数生成）或具有副作用的操作（例如，文件写入、API 调用）包装在 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.task.html" target="_blank" rel="noreferrer" class="link">tasks</a> 中，以确保当工作流恢复时，这些操作不会在特定运行中重复执行，而是从持久化层检索它们的结果。更多信息，请参阅[确定性与一致重放](#determinism-and-consistent-replay)。

## 确定性与一致重放

当您恢复一个工作流运行时，代码**不会**从执行停止的**同一行代码**处恢复；相反，它将确定一个合适的[起始点](#starting-points-for-resuming-workflows)来从中断处继续。这意味着工作流将从[起始点](#starting-points-for-resuming-workflows)开始重放所有步骤，直到到达它被停止的点。

因此，当您为持久化执行编写工作流时，必须将任何非确定性操作（例如，随机数生成）和任何具有副作用的操作（例如，文件写入、API 调用）包装在[任务（tasks）](/oss/javascript/langgraph/functional-api#task)或[节点（nodes）](/oss/javascript/langgraph/graph-api#nodes)中。

为确保您的工作流是确定性的并且可以一致地重放，请遵循以下准则：

* **避免重复工作**：如果一个[节点](/oss/javascript/langgraph/graph-api#nodes)包含多个具有副作用（例如，日志记录、文件写入或网络调用）的操作，请将每个操作包装在单独的**任务**中。这确保了当工作流恢复时，操作不会重复执行，并且它们的结果会从持久化层中检索。
* **封装非确定性操作**：将任何可能产生非确定性结果的代码（例如，随机数生成）包装在**任务**或**节点**内部。这确保了在恢复时，工作流遵循完全相同的记录步骤序列，并产生相同的结果。
* **使用幂等操作**：在可能的情况下，确保副作用（例如，API调用、文件写入）是幂等的。这意味着，如果工作流失败后重试某个操作，它将产生与第一次执行时相同的效果。这对于导致数据写入的操作尤其重要。如果某个**任务**启动但未能成功完成，工作流的恢复将重新运行该**任务**，并依赖记录的结果来保持一致性。使用幂等性密钥或验证现有结果，以避免意外的重复，确保工作流执行顺畅且可预测。

有关需要避免的常见陷阱示例，请参阅功能 API 中的[常见陷阱](/oss/javascript/langgraph/functional-api#common-pitfalls)部分，该部分展示了如何使用**任务**来构建代码以避免这些问题。同样的原则也适用于 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.StateGraph.html" target="_blank" rel="noreferrer" class="link">StateGraph (Graph API)</a>。

## 持久性模式

LangGraph 支持三种持久性模式，允许您根据应用程序的需求在性能和数据一致性之间进行权衡。更高的持久性模式会增加工作流执行的开销。您可以在调用任何图执行方法时指定持久性模式：

```typescript
graph.stream(
    {"input": "test"},
    durability="sync"
)
```

持久性模式，从最不持久到最持久，如下所示：

* `"exit"`：LangGraph 仅在图执行成功退出、因错误退出或因人工干预（human-in-the-loop）中断退出时持久化更改。这为长时间运行的图提供了最佳性能，但也意味着中间状态不会被保存，因此您无法从执行过程中发生的系统故障（如进程崩溃）中恢复。
* `"async"`：LangGraph 在下一步执行时异步持久化更改。这提供了良好的性能和持久性，但存在一个很小的风险，即如果进程在执行期间崩溃，LangGraph 可能不会写入检查点。
* `"sync"`：LangGraph 在下一步开始之前同步持久化更改。这确保了 LangGraph 在继续执行之前写入每个检查点，以一定的性能开销为代价提供了高持久性。

## 在节点中使用任务

如果一个[节点](/oss/javascript/langgraph/graph-api#nodes)包含多个操作，您可能会发现将每个操作转换为一个**任务**比将这些操作重构为单独的节点更容易。

<Tabs>

<Tab title="Original">

```typescript
import { StateGraph, START, END } from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

// 定义一个 Zod 模式来表示状态
const State = z.object({
  url: z.string(),
  result: z.string().optional(),
});

const callApi = async (state: z.infer<typeof State>) => {
  const response = await fetch(state.url);  // [!code highlight]
  const text = await response.text();
  const result = text.slice(0, 100); // 副作用
  return {
    result,
  };
};

// 创建 StateGraph 构建器，并为 callApi 函数添加节点
const builder = new StateGraph(State)
  .addNode("callApi", callApi)
  .addEdge(START, "callApi")
  .addEdge("callApi", END);

// 指定一个检查点
const checkpointer = new MemorySaver();

// 使用检查点编译图
const graph = builder.compile({ checkpointer });

// 定义一个包含线程 ID 的配置
const threadId = uuidv4();
const config = { configurable: { thread_id: threadId } };
```typescript
// 调用图
await graph.invoke({ url: "https://www.example.com" }, config);
```
</Tab>
<Tab title="使用任务">

```typescript

// 定义一个 Zod 模式来表示状态
const State = z.object({
urls: z.array(z.string()),
results: z.array(z.string()).optional(),
});

const makeRequest = task("makeRequest", async (url: string) => {
const response = await fetch(url);  // [!code highlight]
const text = await response.text();
return text.slice(0, 100);
});

const callApi = async (state: z.infer<typeof State>) => {
const requests = state.urls.map((url) => makeRequest(url));  // [!code highlight]
const results = await Promise.all(requests);
return {
results,
};
};

// 创建一个 StateGraph 构建器，并为 callApi 函数添加一个节点
const builder = new StateGraph(State)
.addNode("callApi", callApi)
.addEdge(START, "callApi")
.addEdge("callApi", END);

// 指定一个检查点保存器
const checkpointer = new MemorySaver();

// 使用检查点保存器编译图
const graph = builder.compile({ checkpointer });

// 定义一个包含线程 ID 的配置。
const threadId = uuidv4();
const config = { configurable: { thread_id: threadId } };

// 调用图
await graph.invoke({ urls: ["https://www.example.com"] }, config);
```

</Tab>

</Tabs>

## 恢复工作流

一旦你在工作流中启用了持久化执行，你就可以在以下场景中恢复执行：

* **暂停和恢复工作流：** 使用 <a href="https://reference.langchain.com/javascript/functions/_langchain_langgraph.index.interrupt.html" target="_blank" rel="noreferrer" class="link">interrupt</a> 函数在特定点暂停工作流，并使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.index.Command.html" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 原语以更新后的状态恢复它。更多详情请参阅 [**中断**](/oss/javascript/langgraph/interrupts)。
* **从故障中恢复：** 在发生异常（例如，LLM 提供商中断）后，自动从最后一个成功的检查点恢复工作流。这涉及通过提供 `null` 作为输入值，使用相同的线程标识符执行工作流（请参阅使用功能 API 的此 [示例](/oss/javascript/langgraph/use-functional-api#resuming-after-an-error)）。

## 恢复工作流的起始点

* 如果您使用的是 [StateGraph (Graph API)](/oss/javascript/langgraph/graph-api)，起始点是执行停止的 [**节点**](/oss/javascript/langgraph/graph-api#nodes) 的开头。
* 如果您在节点内部调用子图，起始点将是调用被暂停子图的 **父** 节点。
  在子图内部，起始点将是执行停止的特定 [**节点**](/oss/javascript/langgraph/graph-api#nodes)。
* 如果您使用的是 Functional API，起始点是执行停止的 [**入口点**](/oss/javascript/langgraph/functional-api#entrypoint) 的开头。
