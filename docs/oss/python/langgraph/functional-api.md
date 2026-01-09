---
title: 函数式 API 概览 (Functional API overview)
sidebarTitle: 函数式 API (Functional API)
---

**函数式 API (Functional API)** 允许您以最小的代码改动，为您的应用程序添加 LangGraph 的关键特性——[持久化 (persistence)](/oss/langgraph/persistence)、[记忆 (memory)](/oss/langgraph/add-memory)、[人机交互 (human-in-the-loop)](/oss/langgraph/interrupts) 和 [流式处理 (streaming)](/oss/langgraph/streaming)。

它旨在将这些特性集成到可能使用标准语言原语（如 `if` 语句、`for` 循环和函数调用）进行分支和控制流的现有代码中。与许多需要将代码重构为显式管道或 DAG 的数据编排框架不同，函数式 API 允许您在不强制使用严格执行模型的情况下集成这些功能。

函数式 API 使用两个关键构建块：

* **`@entrypoint`** – 将一个函数标记为工作流的起点，封装逻辑并管理执行流，包括处理长时间运行的任务和中断。
* **<a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.task" target="_blank" rel="noreferrer" class="link"><code>@task</code></a>** – 表示一个离散的工作单元，例如 API 调用或数据处理步骤，可以在入口点内异步执行。任务返回一个类似 future 的对象，可以同步等待或解析。

这为构建具有状态管理和流式处理功能的工作流提供了一个最小的抽象层。

<Tip>

有关如何使用函数式 API 的信息，请参阅[使用函数式 API (Use Functional API)](/oss/langgraph/use-functional-api)。

</Tip>

## 函数式 API 与图 API 对比 (Functional API vs. Graph API)

对于更喜欢声明式方法的用户，LangGraph 的[图 API (Graph API)](/oss/langgraph/graph-api) 允许您使用图范式定义工作流。两个 API 共享相同的底层运行时，因此您可以在同一个应用程序中一起使用它们。

以下是一些关键区别：

* **控制流 (Control flow)**：函数式 API 不需要考虑图结构。您可以使用标准的 Python 结构来定义工作流。这通常会减少您需要编写的代码量。
* **短期记忆 (Short-term memory)**：**图 API (Graph API)** 需要声明一个[**状态 (State)**](/oss/langgraph/graph-api#state)，并且可能需要定义[**归约器 (reducers)**](/oss/langgraph/graph-api#reducers)来管理图状态的更新。`@entrypoint` 和 `@tasks` 不需要显式的状态管理，因为它们的状态作用域限定在函数内，并且不在函数间共享。
* **检查点 (Checkpointing)**：两个 API 都会生成和使用检查点。在 **图 API** 中，每个[超步 (superstep)](/oss/langgraph/graph-api) 之后都会生成一个新的检查点。在 **函数式 API** 中，当任务执行时，它们的结果会保存到与给定入口点关联的现有检查点中，而不是创建新的检查点。
* **可视化 (Visualization)**：图 API 可以轻松地将工作流可视化为图，这对于调试、理解工作流和与他人共享非常有用。函数式 API 不支持可视化，因为图是在运行时动态生成的。

## 示例 (Example)

下面我们演示一个简单的应用程序，它撰写一篇论文并[中断 (interrupts)](/oss/langgraph/interrupts) 以请求人工审核。

```python
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.func import entrypoint, task
from langgraph.types import interrupt

@task
def write_essay(topic: str) -> str:
    """撰写关于给定主题的论文。"""
    time.sleep(1) # 长时间运行任务的占位符。
    return f"An essay about topic: {topic}"

@entrypoint(checkpointer=InMemorySaver())
def workflow(topic: str) -> dict:
    """撰写论文并请求审核的简单工作流。"""
    essay = write_essay("cat").result()
    is_approved = interrupt({
        # 提供给 interrupt 作为参数的任何 json 可序列化负载。
        # 当从工作流流式传输数据时，它将作为 Interrupt 出现在客户端。
        "essay": essay, # 我们想要审核的论文。
        # 我们可以添加任何需要的额外信息。
        # 例如，引入一个名为 "action" 的键并提供一些指令。
        "action": "Please approve/reject the essay",
    })

    return {
        "essay": essay, # 生成的论文
        "is_approved": is_approved, # 来自 HIL 的响应
    }
```

:::: details 详细解释 (Detailed Explanation)

此工作流将撰写一篇关于“cat”主题的论文，然后暂停以获取人工审核。工作流可以无限期中断，直到提供审核为止。

当工作流恢复时，它会从头开始执行，但由于 `writeEssay` 任务的结果已经保存，任务结果将从检查点加载，而不是重新计算。

```python
import time
import uuid
from langgraph.func import entrypoint, task
from langgraph.types import interrupt
from langgraph.checkpoint.memory import InMemorySaver

@task
def write_essay(topic: str) -> str:
    """撰写关于给定主题的论文。"""
    time.sleep(1)  # 这是长时间运行任务的占位符。
    return f"An essay about topic: {topic}"

@entrypoint(checkpointer=InMemorySaver())
def workflow(topic: str) -> dict:
    """撰写论文并请求审核的简单工作流。"""
    essay = write_essay("cat").result()
    is_approved = interrupt(
        {
            # 提供给 interrupt 作为参数的任何 json 可序列化负载。
            # 当从工作流流式传输数据时，它将作为 Interrupt 出现在客户端。
            "essay": essay,  # 我们想要审核的论文。
            # 我们可以添加任何需要的额外信息。
            # 例如，引入一个名为 "action" 的键并提供一些指令。
            "action": "Please approve/reject the essay",
        }
    )
    return {
        "essay": essay,  # 生成的论文
        "is_approved": is_approved,  # 来自 HIL 的响应
    }

thread_id = str(uuid.uuid4())
config = {"configurable": {"thread_id": thread_id}}
for item in workflow.stream("cat", config):
    print(item)
# > {'write_essay': 'An essay about topic: cat'}
# > {
# >     '__interrupt__': (
# >        Interrupt(
# >            value={
# >                'essay': 'An essay about topic: cat',
# >                'action': 'Please approve/reject the essay'
# >            },
# >            id='b9b2b9d788f482663ced6dc755c9e981'
# >        ),
# >    )
# > }
```

论文已撰写完成，准备审核。一旦提供审核，我们就可以恢复工作流：

```python
from langgraph.types import Command

# 从用户处获取审核（例如，通过 UI）
# 在这种情况下，我们使用布尔值，但这可以是任何 JSON 可序列化的值。
human_review = True

for item in workflow.stream(Command(resume=human_review), config):
    print(item)
```

```pycon
{'workflow': {'essay': 'An essay about topic: cat', 'is_approved': False}}
```

工作流已完成，审核已添加到论文中。

::::

## 入口点 (Entrypoint)

[`@entrypoint`] 装饰器可用于从函数创建工作流。它封装工作流逻辑并管理执行流，包括处理 *长时间运行的任务* 和 [中断 (interrupts)](/oss/langgraph/interrupts)。

### 定义 (Definition)

**入口点 (Entrypoint)** 通过使用 `@entrypoint` 装饰器装饰一个函数来定义。

该函数 **必须接受一个位置参数**，作为工作流的输入。如果需要传递多个数据，请使用字典作为第一个参数的输入类型。

用 `entrypoint` 装饰函数会产生一个 <a href="https://reference.langchain.com/python/langgraph/pregel/#langgraph.pregel.Pregel.stream" target="_blank" rel="noreferrer" class="link"><code>Pregel</code></a> 实例，它有助于管理工作流的执行（例如，处理流式传输、恢复和检查点）。

您通常希望将 **检查点器 (checkpointer)** 传递给 `@entrypoint` 装饰器，以启用持久化并使用 **人机交互 (human-in-the-loop)** 等功能。

<Tabs>

<Tab title="同步 (Sync)">

```python
from langgraph.func import entrypoint

@entrypoint(checkpointer=checkpointer)
def my_workflow(some_input: dict) -> int:
    # 一些可能涉及长时间运行任务（如 API 调用）的逻辑，
    # 并且可能因人机交互而中断。
    ...
    return result
```

</Tab>

<Tab title="异步 (Async)">

```python
from langgraph.func import entrypoint

@entrypoint(checkpointer=checkpointer)
async def my_workflow(some_input: dict) -> int:
    # 一些可能涉及长时间运行任务（如 API 调用）的逻辑，
    # 并且可能因人机交互而中断。
    ...
    return result
```

</Tab>

</Tabs>

<Warning>

<strong>序列化 (Serialization)</strong>
入口点的 <strong>输入</strong> 和 <strong>输出</strong> 必须是 JSON 可序列化的，以支持检查点。请参阅 [序列化 (#serialization)](#serialization) 部分了解更多详情。

</Warning>

### 可注入参数 (Injectable parameters)

声明 `entrypoint` 时，您可以请求访问将在运行时自动注入的附加参数。这些参数包括：

| 参数 (Parameter) | 描述 (Description) |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`previous`** | 访问给定线程的上一个 `checkpoint` 关联的状态。请参阅 [短期记忆 (#short-term-memory)](#short-term-memory)。 |
| **`store`** | [BaseStore][langgraph.store.base.BaseStore] 的一个实例。对于 [长期记忆 (long-term memory)](/oss/langgraph/use-functional-api#long-term-memory) 很有用。 |
| **`writer`** | 在使用 Async Python < 3.11 时，用于访问 StreamWriter。有关详细信息，请参阅 [使用函数式 API 进行流式处理 (streaming with functional API for details)](/oss/langgraph/use-functional-api#streaming)。 |
| **`config`** | 用于访问运行时间配置。有关信息，请参阅 [RunnableConfig](https://python.langchain.com/docs/concepts/runnables/#runnableconfig)。 |

<Warning>

请使用适当的名称和类型注解声明参数。

</Warning>

:::: details 请求可注入参数 (Requesting Injectable Parameters)

```python
from langchain_core.runnables import RunnableConfig
from langgraph.func import entrypoint
from langgraph.store.base import BaseStore
from langgraph.store.memory import InMemoryStore
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import StreamWriter

in_memory_checkpointer = InMemorySaver(...)
in_memory_store = InMemoryStore(...)  # 用于长期记忆的 InMemoryStore 实例

@entrypoint(
    checkpointer=in_memory_checkpointer,  # 指定检查点器
    store=in_memory_store  # 指定存储
)
def my_workflow(
    some_input: dict,  # 输入（例如，通过 `invoke` 传递）
    *,
    previous: Any = None, # 用于短期记忆
    store: BaseStore,  # 用于长期记忆
    writer: StreamWriter,  # 用于流式传输自定义数据
    config: RunnableConfig  # 用于访问传递给入口点的配置
) -> ...:
```

::::

### 执行 (Executing)

使用 [`@entrypoint`](#entrypoint) 将产生一个 <a href="https://reference.langchain.com/python/langgraph/pregel/#langgraph.pregel.Pregel.stream" target="_blank" rel="noreferrer" class="link"><code>Pregel</code></a> 对象，可以使用 `invoke`、`ainvoke`、`stream` 和 `astream` 方法执行。

<Tabs>

<Tab title="调用 (Invoke)">

```python
config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}
my_workflow.invoke(some_input, config)  # 同步等待结果
```

</Tab>

<Tab title="异步调用 (Async Invoke)">

```python
config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}
await my_workflow.ainvoke(some_input, config)  # 异步等待结果
```

</Tab>

<Tab title="流式处理 (Stream)">

```python
config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

for chunk in my_workflow.stream(some_input, config):
    print(chunk)
```

</Tab>

<Tab title="异步流式处理 (Async Stream)">

```python
config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

async for chunk in my_workflow.astream(some_input, config):
    print(chunk)
```

</Tab>

</Tabs>

### 恢复 (Resuming)

在 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link">interrupt</a> 之后恢复执行可以通过向 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command" target="_blank" rel="noreferrer" class="link"><code>Command</code></a> 原语传递 **resume** 值来完成。

<Tabs>

<Tab title="调用 (Invoke)">

```python
from langgraph.types import Command

config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

my_workflow.invoke(Command(resume=some_resume_value), config)
```

</Tab>

<Tab title="异步调用 (Async Invoke)">

```python
from langgraph.types import Command

config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

await my_workflow.ainvoke(Command(resume=some_resume_value), config)
```

</Tab>

<Tab title="流式处理 (Stream)">

```python
from langgraph.types import Command

config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

for chunk in my_workflow.stream(Command(resume=some_resume_value), config):
    print(chunk)
```

</Tab>

<Tab title="异步流式处理 (Async Stream)">

```python
from langgraph.types import Command

config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

async for chunk in my_workflow.astream(Command(resume=some_resume_value), config):
    print(chunk)
```

</Tab>

</Tabs>

**在错误后恢复 (Resuming after an error)**

要在错误后恢复，请使用 `None` 和相同的 **线程 ID (thread id)** (config) 运行 `entrypoint`。

这假设底层的 **错误 (error)** 已得到解决，执行可以成功进行。

<Tabs>

<Tab title="调用 (Invoke)">

```python

config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

my_workflow.invoke(None, config)
```

</Tab>

<Tab title="异步调用 (Async Invoke)">

```python

config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

await my_workflow.ainvoke(None, config)
```

</Tab>

<Tab title="流式处理 (Stream)">

```python

config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

for chunk in my_workflow.stream(None, config):
    print(chunk)
```

</Tab>

<Tab title="异步流式处理 (Async Stream)">

```python

config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

async for chunk in my_workflow.astream(None, config):
    print(chunk)
```

</Tab>

</Tabs>

### 短期记忆 (Short-term memory)

当 `entrypoint` 定义了 `checkpointer` 时，它会在 [检查点 (checkpoints)](/oss/langgraph/persistence#checkpoints) 中存储同一 **线程 ID (thread id)** 连续调用之间的信息。

这允许使用 `previous` 参数访问上一次调用的状态。

默认情况下，`previous` 参数是上一次调用的返回值。

```python
@entrypoint(checkpointer=checkpointer)
def my_workflow(number: int, *, previous: Any = None) -> int:
    previous = previous or 0
    return number + previous

config = {
    "configurable": {
        "thread_id": "some_thread_id"
    }
}

my_workflow.invoke(1, config)  # 1 (previous 为 None)
my_workflow.invoke(2, config)  # 3 (previous 为上一次调用的 1)
```

#### `entrypoint.final`

<a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint.final" target="_blank" rel="noreferrer" class="link"><code>entrypoint.final</code></a> 是一个特殊的原语，可以从入口点返回，它允许 **解耦 (decoupling)** **保存在检查点中** 的值与 **入口点的返回值**。

第一个值是入口点的返回值，第二个值是将被保存在检查点中的值。类型注解为 `entrypoint.final[return_type, save_type]`。

```python
@entrypoint(checkpointer=checkpointer)
def my_workflow(number: int, *, previous: Any = None) -> entrypoint.final[int, int]:
    previous = previous or 0
    # 这将向调用者返回 previous 值，并将 2 * number 保存到检查点，
    # 该值将在下一次调用中用作 `previous` 参数。
    return entrypoint.final(value=previous, save=2 * number)

config = {
    "configurable": {
        "thread_id": "1"
    }
}

my_workflow.invoke(3, config)  # 0 (previous 为 None)
my_workflow.invoke(1, config)  # 6 (previous 为上一次调用的 3 * 2)
```

## 任务 (Task)

**任务 (Task)** 表示一个离散的工作单元，例如 API 调用或数据处理步骤。它有两个关键特征：

* **异步执行 (Asynchronous Execution)**：任务旨在异步执行，允许并发运行多个操作而不会阻塞。
* **检查点 (Checkpointing)**：任务结果保存在检查点中，从而可以从上次保存的状态恢复工作流。（有关更多详细信息，请参阅 [持久化 (persistence)](/oss/langgraph/persistence)）。

### 定义 (Definition)

任务使用 `@task` 装饰器定义，它包装了一个常规的 Python 函数。

```python
from langgraph.func import task

@task()
def slow_computation(input_value):
    # 模拟长时间运行的操作
    ...
    return result
```

<Warning>

<strong>序列化 (Serialization)</strong>
任务的 <strong>输出</strong> 必须是 JSON 可序列化的，以支持检查点。

</Warning>

### 执行 (Execution)

**任务 (Tasks)** 只能从 **入口点 (entrypoint)**、另一个 **任务 (task)** 或 [状态图节点 (state graph node)](/oss/langgraph/graph-api#nodes) 内部调用。

任务 *不能* 直接从主应用程序代码中调用。

当您调用一个 **任务 (task)** 时，它会 *立即* 返回一个 future 对象。future 是稍后可用的结果的占位符。

要获取 **任务 (task)** 的结果，您可以同步等待（使用 `result()`）或异步等待（使用 `await`）。

<Tabs>

<Tab title="同步调用 (Synchronous Invocation)">

```python
@entrypoint(checkpointer=checkpointer)
def my_workflow(some_input: int) -> int:
    future = slow_computation(some_input)
    return future.result()  # 同步等待结果
```

</Tab>

<Tab title="异步调用 (Asynchronous Invocation)">

```python
@entrypoint(checkpointer=checkpointer)
async def my_workflow(some_input: int) -> int:
    return await slow_computation(some_input)  # 异步等待结果
```

</Tab>

</Tabs>

## 何时使用任务 (When to use a task)

**任务 (Tasks)** 在以下场景中非常有用：

*   **检查点 (Checkpointing)**：当您需要将长时间运行操作的结果保存到检查点时，这样在恢复工作流时就不需要重新计算它。
*   **人机交互 (Human-in-the-loop)**：如果您正在构建一个需要人工干预的工作流，您必须使用 **任务 (tasks)** 来封装任何随机性（例如 API 调用），以确保工作流可以正确恢复。有关更多详细信息，请参阅 [确定性 (#determinism)](#determinism) 部分。
*   **并行执行 (Parallel Execution)**：对于 I/O 密集型任务，**任务 (tasks)** 可以实现并行执行，允许并发运行多个操作而不会阻塞（例如，调用多个 API）。
*   **可观测性 (Observability)**：将操作包装在 **任务 (tasks)** 中提供了一种跟踪工作流进度并使用 [LangSmith](https://docs.langchain.com/langsmith/home) 监控单个操作执行情况的方法。
*   **可重试工作 (Retryable Work)**：当工作需要重试以处理失败或不一致时，**任务 (tasks)** 提供了一种封装和管理重试逻辑的方法。

## 序列化 (Serialization)

LangGraph 中的序列化有两个关键方面：

1.  `entrypoint` 的输入和输出必须是 JSON 可序列化的。
2.  `task` 的输出必须是 JSON 可序列化的。

这些要求对于启用检查点和工作流恢复是必要的。使用 Python 原语（如字典、列表、字符串、数字和布尔值）以确保您的输入和输出是可序列化的。

序列化确保工作流状态（如任务结果和中间值）可以可靠地保存和恢复。这对于启用人机交互、容错和并行执行至关重要。

如果为配置了检查点器的工作流提供不可序列化的输入或输出，将导致运行时错误。

## 确定性 (Determinism)

为了利用 **人机交互 (human-in-the-loop)** 等功能，任何随机性都应该封装在 **任务 (tasks)** 内部。这保证了当执行停止（例如因人机交互停止）并恢复时，即使 **任务 (task)** 结果是非确定性的，它也会遵循相同的 *步骤序列 (sequence of steps)*。

LangGraph 通过在 **任务 (task)** 和 [**子图 (subgraph)**](/oss/langgraph/use-subgraphs) 执行时对结果进行持久化来实现此行为。一个精心设计的工作流可确保恢复执行遵循 *相同的步骤序列*，从而允许正确检索以前计算的结果而无需重新执行它们。这对于长时间运行的 **任务 (tasks)** 或具有非确定性结果的 **任务 (tasks)** 特别有用，因为它避免了重复已完成的工作并允许从基本相同的位置恢复。

虽然工作流的不同运行可以产生不同的结果，但恢复 *特定* 运行应始终遵循相同的记录步骤序列。这使得 LangGraph 能够有效地查找在图中断之前执行的 **任务 (task)** 和 **子图 (subgraph)** 结果，并避免重新计算它们。

## 幂等性 (Idempotency)

幂等性确保多次运行相同操作会产生相同的结果。这有助于防止在由于失败而重新运行某个步骤时出现重复的 API 调用和冗余处理。始终将 API 调用放在 **任务 (tasks)** 函数中以便进行检查点操作，并将其设计为在重新执行的情况下是幂等的。如果 **任务 (task)** 开始但未成功完成，则可能会发生重新执行。然后，如果工作流恢复，该 **任务 (task)** 将再次运行。使用幂等键或验证现有结果以避免重复。

## 常见陷阱 (Common pitfalls)

### 处理副作用 (Handling side effects)

将副作用（例如写入文件、发送电子邮件）封装在任务中，以确保在恢复工作流时它们不会被执行多次。

<Tabs>

<Tab title="不正确 (Incorrect)">

在这个例子中，副作用（写入文件）直接包含在工作流中，因此在恢复工作流时它将被第二次执行。

```python
@entrypoint(checkpointer=checkpointer)
def my_workflow(inputs: dict) -> int:
    # 恢复工作流时，此代码将第二次执行。
    # 这可能不是您想要的。
    with open("output.txt", "w") as f:  # [!code highlight]
        f.write("Side effect executed")  # [!code highlight]
    value = interrupt("question")
    return value
```

</Tab>

<Tab title="正确 (Correct)">

在这个例子中，副作用被封装在一个任务中，确保在恢复时执行的一致性。

```python
from langgraph.func import task

@task  # [!code highlight]
def write_to_file():  # [!code highlight]
    with open("output.txt", "w") as f:
        f.write("Side effect executed")

@entrypoint(checkpointer=checkpointer)
def my_workflow(inputs: dict) -> int:
    # 副作用现在被封装在一个任务中。
    write_to_file().result()
    value = interrupt("question")
    return value
```

</Tab>

</Tabs>

### 非确定性控制流 (Non-deterministic control flow)

每次可能给出不同结果的操作（如获取当前时间或随机数）都应封装在 **任务 (tasks)** 中，以确保在恢复时返回相同的结果。

*   在任务中：获取随机数 (5) → 中断 (interrupt) → 恢复 (resume) →（再次返回 5）→ ...
*   不在任务中：获取随机数 (5) → 中断 (interrupt) → 恢复 (resume) → 获取新随机数 (7) → ...

当使用具有多个中断调用的 **人机交互 (human-in-the-loop)** 工作流时，这一点尤为重要。LangGraph 为每个任务/入口点保留一个恢复值列表。当遇到中断时，它会与相应的恢复值匹配。这种匹配严格基于 **索引 (index-based)**，因此恢复值的顺序应与中断的顺序相匹配。

如果在恢复时未保持执行顺序，则一个 <a href="https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt" target="_blank" rel="noreferrer" class="link"><code>interrupt</code></a> 调用可能会与错误的 `resume` 值匹配，从而导致错误的结果。

请阅读 [确定性 (#determinism)](#determinism) 部分了解更多详情。

<Tabs>

<Tab title="不正确 (Incorrect)">

在这个例子中，工作流使用当前时间来确定要执行哪个任务。这是非确定性的，因为工作流的结果取决于其执行的时间。

```python
from langgraph.func import entrypoint

@entrypoint(checkpointer=checkpointer)
def my_workflow(inputs: dict) -> int:
    t0 = inputs["t0"]
    t1 = time.time()  # [!code highlight]

    delta_t = t1 - t0

    if delta_t > 1:
        result = slow_task(1).result()
        value = interrupt("question")
    else:
        result = slow_task(2).result()
        value = interrupt("question")

    return {
        "result": result,
        "value": value
    }
```

</Tab>

<Tab title="正确 (Correct)">

在这个例子中，工作流使用输入 `t0` 来确定要执行哪个任务。这是确定性的，因为工作流的结果仅取决于输入。

```python
import time

from langgraph.func import task

@task  # [!code highlight]
def get_time() -> float:  # [!code highlight]
    return time.time()

@entrypoint(checkpointer=checkpointer)
def my_workflow(inputs: dict) -> int:
    t0 = inputs["t0"]
    t1 = get_time().result()  # [!code highlight]

    delta_t = t1 - t0

    if delta_t > 1:
        result = slow_task(1).result()
        value = interrupt("question")
    else:
        result = slow_task(2).result()
        value = interrupt("question")

    return {
        "result": result,
        "value": value
    }
```

</Tab>

</Tabs>

