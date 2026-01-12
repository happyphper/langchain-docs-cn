---
title: 内置中间件
description: 适用于常见代理用例的预构建中间件
---
LangChain 为常见用例提供了预构建的中间件。每个中间件都是生产就绪的，并且可以根据您的具体需求进行配置。

## 与提供商无关的中间件

以下中间件适用于任何 LLM 提供商：

| 中间件 | 描述 |
|------------|-------------|
| [摘要](#summarization) | 在接近令牌限制时自动总结对话历史。 |
| [人在回路](#human-in-the-loop) | 暂停执行以等待人工批准工具调用。 |
| [模型调用限制](#model-call-limit) | 限制模型调用次数以防止成本过高。 |
| [工具调用限制](#tool-call-limit) | 通过限制调用次数来控制工具执行。 |
| [模型回退](#model-fallback) | 当主模型失败时自动回退到备用模型。 |
| [PII 检测](#pii-detection) | 检测和处理个人身份信息 (PII)。 |
| [待办事项列表](#to-do-list) | 为智能体配备任务规划和跟踪能力。 |
| [LLM 工具选择器](#llm-tool-selector) | 在调用主模型之前使用 LLM 选择相关工具。 |
| [工具重试](#tool-retry) | 使用指数退避自动重试失败的工具调用。 |
| [模型重试](#model-retry) | 使用指数退避自动重试失败的模型调用。 |
| [LLM 工具模拟器](#llm-tool-emulator) | 使用 LLM 模拟工具执行以进行测试。 |
| [上下文编辑](#context-editing) | 通过修剪或清除工具使用来管理对话上下文。 |
| [Shell 工具](#shell-tool) | 向智能体暴露一个持久的 shell 会话以执行命令。 |
| [文件搜索](#file-search) | 提供对文件系统文件的 Glob 和 Grep 搜索工具。 |

### 摘要

在接近令牌限制时自动总结对话历史，保留最近的消息同时压缩较旧的上下文。摘要适用于以下情况：
- 超出上下文窗口的长时间运行对话。
- 具有大量历史记录的多轮对话。
- 需要保留完整对话上下文的应用。

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.SummarizationMiddleware" target="_blank" rel="noreferrer" class="link"><code>SummarizationMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[your_weather_tool, your_calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-4o-mini",
            trigger=("tokens", 4000),
            keep=("messages", 20),
        ),
    ],
)
```

:::: details 配置选项

<Tip>

如果使用 `langchain>=1.1`，`trigger` 和 `keep` 的 `fraction` 条件（如下所示）依赖于聊天模型的[配置文件数据](/oss/python/langchain/models#model-profiles)。如果数据不可用，请使用其他条件或手动指定：

```python
from langchain.chat_models import init_chat_model

custom_profile = {
    "max_input_tokens": 100_000,
    # ...
}
model = init_chat_model("gpt-4o", profile=custom_profile)
```

</Tip>

<ParamField body="model" type="string | BaseChatModel" required>

用于生成摘要的模型。可以是模型标识符字符串（例如，`'openai:gpt-4o-mini'`）或 `BaseChatModel` 实例。更多信息请参见 <a href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model(model)" target="_blank" rel="noreferrer" class="link"><code>init_chat_model</code></a>。

</ParamField>

<ParamField body="trigger" type="ContextSize | list[ContextSize] | None">

触发摘要的条件。可以是：

- 单个 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize" target="_blank" rel="noreferrer" class="link"><code>ContextSize</code></a> 元组（必须满足指定的条件）
- <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize" target="_blank" rel="noreferrer" class="link"><code>ContextSize</code></a> 元组列表（必须满足任一条件 - OR 逻辑）

条件应为以下之一：

- `fraction` (float)：模型上下文大小的比例 (0-1)
- `tokens` (int)：绝对令牌计数
- `messages` (int)：消息计数

必须至少指定一个条件。如果未提供，摘要将不会自动触发。

更多信息请参见 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize" target="_blank" rel="noreferrer" class="link"><code>ContextSize</code></a> 的 API 参考。

</ParamField>

<ParamField body="keep" type="ContextSize" default="('messages', 20)">

摘要后保留多少上下文。请指定以下之一：

- `fraction` (float)：保留的模型上下文大小比例 (0-1)
- `tokens` (int)：保留的绝对令牌计数
- `messages` (int)：保留的最近消息数量

更多信息请参见 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize" target="_blank" rel="noreferrer" class="link"><code>ContextSize</code></a> 的 API 参考。

</ParamField>

<ParamField body="token_counter" type="function">

自定义令牌计数函数。默认为基于字符的计数。

</ParamField>

<ParamField body="summary_prompt" type="string">

用于摘要的自定义提示模板。如果未指定，则使用内置模板。模板应包含 `{messages}` 占位符，对话历史将插入其中。

</ParamField>

<ParamField body="trim_tokens_to_summarize" type="number" default="4000">

生成摘要时要包含的最大令牌数。在摘要之前，消息将被修剪以适应此限制。

</ParamField>

<ParamField body="summary_prefix" type="string">

添加到摘要消息的前缀。如果未提供，则使用默认前缀。

</ParamField>

<ParamField body="max_tokens_before_summary" type="number" deprecated>

<strong>已弃用：</strong> 请改用 `trigger: {"tokens": value}`。触发摘要的令牌阈值。

</ParamField>

<ParamField body="messages_to_keep" type="number" deprecated>

<strong>已弃用：</strong> 请改用 `keep: {"messages": value}`。要保留的最近消息。

</ParamField>

::::

:::: details 完整示例

摘要中间件监控消息令牌计数，并在达到阈值时自动总结较早的消息。

<strong>触发条件</strong> 控制何时运行摘要：
- 单个条件对象（必须满足指定的条件）
- 条件数组（必须满足任一条件 - OR 逻辑）
- 每个条件可以使用 `fraction`（模型上下文大小的比例）、`tokens`（绝对计数）或 `messages`（消息计数）

<strong>保留条件</strong> 控制保留多少上下文（请指定以下之一）：
- `fraction` - 保留的模型上下文大小比例
- `tokens` - 保留的绝对令牌计数
- `messages` - 保留的最近消息数量

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware

# Single condition: trigger if tokens >= 4000
agent = create_agent(
    model="gpt-4o",
    tools=[your_weather_tool, your_calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-4o-mini",
            trigger=("tokens", 4000),
            keep=("messages", 20),
        ),
    ],
)

# Multiple conditions: trigger if number of tokens >= 3000 OR messages >= 6
agent2 = create_agent(
    model="gpt-4o",
    tools=[your_weather_tool, your_calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-4o-mini",
            trigger=[
                ("tokens", 3000),
                ("messages", 6),
            ],
            keep=("messages", 20),
        ),
    ],
)

# Using fractional limits
agent3 = create_agent(
    model="gpt-4o",
    tools=[your_weather_tool, your_calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-4o-mini",
            trigger=("fraction", 0.8),
            keep=("fraction", 0.3),
        ),
    ],
)
```

::::

### 人在回路

在工具调用执行之前，暂停智能体执行以等待人工批准、编辑或拒绝。[人在回路](/oss/python/langchain/human-in-the-loop) 适用于以下情况：

- 需要人工批准的高风险操作（例如数据库写入、金融交易）。
- 强制要求人工监督的合规工作流。
- 人工反馈指导智能体的长时间运行对话。

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.HumanInTheLoopMiddleware" target="_blank" rel="noreferrer" class="link"><code>HumanInTheLoopMiddleware</code></a>

<Warning>

人在回路中间件需要一个[检查点器](/oss/python/langgraph/persistence#checkpoints)来在中断期间维护状态。

</Warning>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import InMemorySaver

def read_email_tool(email_id: str) -> str:
    """Mock function to read an email by its ID."""
    return f"Email content for ID: {email_id}"

def send_email_tool(recipient: str, subject: str, body: str) -> str:
    """Mock function to send an email."""
    return f"Email sent to {recipient} with subject '{subject}'"

agent = create_agent(
    model="gpt-4o",
    tools=[your_read_email_tool, your_send_email_tool],
    checkpointer=InMemorySaver(),
    middleware=[
        HumanInTheLoopMiddleware(
            interrupt_on={
                "your_send_email_tool": {
                    "allowed_decisions": ["approve", "edit", "reject"],
                },
                "your_read_email_tool": False,
            }
        ),
    ],
)
```

<Tip>

有关完整示例、配置选项和集成模式，请参阅[人在回路文档](/oss/python/langchain/human-in-the-loop)。

</Tip>

<Callout icon="circle-play" iconType="solid">

观看此[视频指南](https://www.youtube.com/watch?v=SpfT6-YAVPk)，演示人在回路中间件的行为。

</Callout>

### 模型调用限制

限制模型调用次数以防止无限循环或成本过高。模型调用限制适用于以下情况：

- 防止失控的智能体进行过多的 API 调用。
- 在生产部署中强制执行成本控制。
- 在特定调用预算内测试智能体行为。

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelCallLimitMiddleware" target="_blank" rel="noreferrer" class="link"><code>ModelCallLimitMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelCallLimitMiddleware
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    model="gpt-4o",
    checkpointer=InMemorySaver(),  # Required for thread limiting
    tools=[],
    middleware=[
        ModelCallLimitMiddleware(
            thread_limit=10,
            run_limit=5,
            exit_behavior="end",
        ),
    ],
)
```

<Callout icon="circle-play" iconType="solid">

观看此[视频指南](https://www.youtube.com/watch?v=nJEER0uaNkE)，演示模型调用限制中间件的行为。

</Callout>

:::: details 配置选项

<ParamField body="thread_limit" type="number">

线程中所有运行的最大模型调用次数。默认为无限制。

</ParamField>

<ParamField body="run_limit" type="number">

单次调用的最大模型调用次数。默认为无限制。

</ParamField>

<ParamField body="exit_behavior" type="string" default="end">

达到限制时的行为。选项：`'end'`（优雅终止）或 `'error'`（引发异常）

</ParamField>

::::

### 工具调用限制

通过限制工具调用次数来控制智能体执行，可以全局限制所有工具，也可以限制特定工具。工具调用限制适用于以下情况：

- 防止对昂贵的外部 API 进行过多调用。
- 限制网络搜索或数据库查询。
- 对特定工具使用强制执行速率限制。
- 防止失控的智能体循环。

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ToolCallLimitMiddleware" target="_blank" rel="noreferrer" class="link"><code>ToolCallLimitMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ToolCallLimitMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, database_tool],
    middleware=[
        # Global limit
        ToolCallLimitMiddleware(thread_limit=20, run_limit=10),
        # Tool-specific limit
        ToolCallLimitMiddleware(
            tool_name="search",
            thread_limit=5,
            run_limit=3,
        ),
    ],
)
```

<Callout icon="circle-play" iconType="solid">

观看此[视频指南](https://www.youtube.com/watch?v=6gYlaJJ8t0w)，演示工具调用限制中间件的行为。

</Callout>

:::: details 配置选项

<ParamField body="tool_name" type="string">

要限制的特定工具名称。如果未提供，限制将<strong>全局应用于所有工具</strong>。

</ParamField>

<ParamField body="thread_limit" type="number">

线程（对话）中所有运行的最大工具调用次数。在具有相同线程 ID 的多次调用中持续存在。需要检查点器来维护状态。`None` 表示无线程限制。

</ParamField>

<ParamField body="run_limit" type="number">

单次调用（一个用户消息 → 响应周期）的最大工具调用次数。每次新的用户消息时重置。`None` 表示无运行限制。

<strong>注意：</strong> 必须至少指定 `thread_limit` 或 `run_limit` 中的一个。

</ParamField>

<ParamField body="exit_behavior" type="string" default="continue">

达到限制时的行为：

- `'continue'` (默认) - 用错误消息阻止超限的工具调用，让其他工具和模型继续。模型根据错误消息决定何时结束。
- `'error'` - 引发 `ToolCallLimitExceededError` 异常，立即停止执行
- `'end'` - 立即停止执行，并为超限的工具调用生成 `ToolMessage` 和 AI 消息。仅在限制单个工具时有效；如果其他工具有待处理的调用，则会引发 `NotImplementedError`。

</ParamField>

::::

:::: details 完整示例

使用以下方式指定限制：
- <strong>线程限制</strong> - 对话中所有运行的最大调用次数（需要检查点）
- <strong>运行限制</strong> - 每次调用的最大调用次数（每轮重置）

退出行为：
- `'continue'`（默认）- 用错误消息阻止超出的调用，代理继续运行
- `'error'` - 立即引发异常
- `'end'` - 使用 ToolMessage + AI 消息停止（仅适用于单工具场景）

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ToolCallLimitMiddleware

global_limiter = ToolCallLimitMiddleware(thread_limit=20, run_limit=10)
search_limiter = ToolCallLimitMiddleware(tool_name="search", thread_limit=5, run_limit=3)
database_limiter = ToolCallLimitMiddleware(tool_name="query_database", thread_limit=10)
strict_limiter = ToolCallLimitMiddleware(tool_name="scrape_webpage", run_limit=2, exit_behavior="error")

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, database_tool, scraper_tool],
    middleware=[global_limiter, search_limiter, database_limiter, strict_limiter],
)
```

::::

### 模型回退

当主模型失败时，自动回退到备用模型。模型回退适用于以下场景：

- 构建能够处理模型中断的弹性代理。
- 通过回退到更便宜的模型来优化成本。
- 跨 OpenAI、Anthropic 等提供商实现冗余。

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelFallbackMiddleware" target="_blank" rel="noreferrer" class="link"><code>ModelFallbackMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelFallbackMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        ModelFallbackMiddleware(
            "gpt-4o-mini",
            "claude-3-5-sonnet-20241022",
        ),
    ],
)
```

<Callout icon="circle-play" iconType="solid">

观看此[视频指南](https://www.youtube.com/watch?v=8rCRO0DUeIM)，演示模型回退中间件的行为。

</Callout>

:::: details 配置选项

<ParamField body="first_model" type="string | BaseChatModel" required>

当主模型失败时首先尝试的回退模型。可以是模型标识符字符串（例如 `'openai:gpt-4o-mini'`）或 `BaseChatModel` 实例。

</ParamField>

<ParamField body="*additional_models" type="string | BaseChatModel">

如果之前的模型失败，按顺序尝试的额外回退模型

</ParamField>

::::

### PII 检测

使用可配置的策略检测和处理对话中的个人身份信息（PII）。PII 检测适用于以下场景：

- 具有合规性要求的医疗保健和金融应用。
- 需要清理日志的客户服务代理。
- 任何处理敏感用户数据的应用。

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.PIIMiddleware" target="_blank" rel="noreferrer" class="link"><code>PIIMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        PIIMiddleware("email", strategy="redact", apply_to_input=True),
        PIIMiddleware("credit_card", strategy="mask", apply_to_input=True),
    ],
)
```

#### 自定义 PII 类型

您可以通过提供 `detector` 参数创建自定义 PII 类型。这允许您检测超出内置类型的、特定于您用例的模式。

**创建自定义检测器的三种方式：**

1.  **正则表达式模式字符串** - 简单的模式匹配

1.  **自定义函数** - 带有验证的复杂检测逻辑

```python
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware
import re

# Method 1: Regex pattern string
agent1 = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        PIIMiddleware(
            "api_key",
            detector=r"sk-[a-zA-Z0-9]{32}",
            strategy="block",
        ),
    ],
)

# Method 2: Compiled regex pattern
agent2 = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        PIIMiddleware(
            "phone_number",
            detector=re.compile(r"\+?\d{1,3}[\s.-]?\d{3,4}[\s.-]?\d{4}"),
            strategy="mask",
        ),
    ],
)

# Method 3: Custom detector function
def detect_ssn(content: str) -> list[dict[str, str | int]]:
    """Detect SSN with validation.

    Returns a list of dictionaries with 'text', 'start', and 'end' keys.
    """
    import re
    matches = []
    pattern = r"\d{3}-\d{2}-\d{4}"
    for match in re.finditer(pattern, content):
        ssn = match.group(0)
        # Validate: first 3 digits shouldn't be 000, 666, or 900-999
        first_three = int(ssn[:3])
        if first_three not in [0, 666] and not (900 <= first_three <= 999):
            matches.append({
                "text": ssn,
                "start": match.start(),
                "end": match.end(),
            })
    return matches

agent3 = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        PIIMiddleware(
            "ssn",
            detector=detect_ssn,
            strategy="hash",
        ),
    ],
)
```

**自定义检测器函数签名：**

检测器函数必须接受一个字符串（内容）并返回匹配项：

返回一个包含 `text`、`start` 和 `end` 键的字典列表：

```python
def detector(content: str) -> list[dict[str, str | int]]:
    return [
        {"text": "matched_text", "start": 0, "end": 12},
        # ... more matches
    ]
```

<Tip>

对于自定义检测器：

    - 使用正则表达式字符串处理简单模式
    - 当您需要标志时使用 RegExp 对象（例如，不区分大小写的匹配）
    - 当您需要超出模式匹配的验证逻辑时使用自定义函数
    - 自定义函数让您完全控制检测逻辑，并可以实现复杂的验证规则

</Tip>

:::: details 配置选项

<ParamField body="pii_type" type="string" required>

要检测的 PII 类型。可以是内置类型（`email`、`credit_card`、`ip`、`mac_address`、`url`）或自定义类型名称。

</ParamField>

<ParamField body="strategy" type="string" default="redact">

如何处理检测到的 PII。选项：

- `'block'` - 检测到时引发异常
- `'redact'` - 替换为 `[REDACTED_{PII_TYPE}]`
- `'mask'` - 部分屏蔽（例如 `**<strong>-</strong><strong>-</strong>**-1234`）
- `'hash'` - 替换为确定性哈希值

</ParamField>

<ParamField body="detector" type="function | regex">

自定义检测器函数或正则表达式模式。如果未提供，则使用该 PII 类型的内置检测器。

</ParamField>

<ParamField body="apply_to_input" type="boolean" default="True">

在模型调用前检查用户消息

</ParamField>

<ParamField body="apply_to_output" type="boolean" default="False">

在模型调用后检查 AI 消息

</ParamField>

<ParamField body="apply_to_tool_results" type="boolean" default="False">

在执行后检查工具结果消息

</ParamField>

::::

### 待办事项列表

为代理配备任务规划和跟踪能力，以处理复杂的多步骤任务。待办事项列表适用于以下场景：

- 需要跨多个工具协调的复杂多步骤任务。
- 进度可见性很重要的长时间运行操作。

<Note>

此中间件自动为代理提供 `write_todos` 工具和系统提示，以指导有效的任务规划。

</Note>

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.TodoListMiddleware" target="_blank" rel="noreferrer" class="link"><code>TodoListMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import TodoListMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[read_file, write_file, run_tests],
    middleware=[TodoListMiddleware()],
)
```

<Callout icon="circle-play" iconType="solid">

观看此[视频指南](https://www.youtube.com/watch?v=yTWocbVKQxw)，演示待办事项列表中间件的行为。

</Callout>

:::: details 配置选项

<ParamField body="system_prompt" type="string">

用于指导待办事项使用的自定义系统提示。如果未指定，则使用内置提示。

</ParamField>

<ParamField body="tool_description" type="string">

`write_todos` 工具的自定义描述。如果未指定，则使用内置描述。

</ParamField>

::::

### LLM 工具选择器

在调用主模型之前，使用 LLM 智能选择相关工具。LLM 工具选择器适用于以下场景：

- 拥有许多工具（10+）且大多数工具与每个查询无关的代理。
- 通过过滤不相关的工具来减少令牌使用。
- 提高模型的专注度和准确性。

此中间件使用结构化输出来询问 LLM 哪些工具与当前查询最相关。结构化输出模式定义了可用的工具名称和描述。模型提供商通常会在后台将此结构化输出信息添加到系统提示中。

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.LLMToolSelectorMiddleware" target="_blank" rel="noreferrer" class="link"><code>LLMToolSelectorMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import LLMToolSelectorMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[tool1, tool2, tool3, tool4, tool5, ...],
    middleware=[
        LLMToolSelectorMiddleware(
            model="gpt-4o-mini",
            max_tools=3,
            always_include=["search"],
        ),
    ],
)
```

:::: details 配置选项

<ParamField body="model" type="string | BaseChatModel">

用于工具选择的模型。可以是模型标识符字符串（例如 `'openai:gpt-4o-mini'`）或 `BaseChatModel` 实例。有关更多信息，请参阅 <a href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model(model)" target="_blank" rel="noreferrer" class="link"><code>init_chat_model</code></a>。

默认为代理的主模型。

</ParamField>

<ParamField body="system_prompt" type="string">

选择模型的指令。如果未指定，则使用内置提示。

</ParamField>

<ParamField body="max_tools" type="number">

要选择的最大工具数量。如果模型选择了更多，则仅使用前 max_tools 个。如果未指定，则无限制。

</ParamField>

<ParamField body="always_include" type="list[string]">

无论选择如何，始终包含的工具名称。这些不计入 max_tools 限制。

</ParamField>

::::

### 工具重试

使用可配置的指数退避自动重试失败的工具调用。工具重试适用于以下场景：

- 处理外部 API 调用中的瞬时故障。
- 提高网络依赖工具的可靠性。
- 构建能够优雅处理临时错误的弹性代理。

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ToolRetryMiddleware" target="_blank" rel="noreferrer" class="link"><code>ToolRetryMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ToolRetryMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=3,
            backoff_factor=2.0,
            initial_delay=1.0,
        ),
    ],
)
```

:::: details 配置选项

<ParamField body="max_retries" type="number" default="2">

初始调用后的最大重试尝试次数（默认情况下总共 3 次尝试）

</ParamField>

<ParamField body="tools" type="list[BaseTool | str]">

要应用重试逻辑的可选工具或工具名称列表。如果为 `None`，则应用于所有工具。

</ParamField>

<ParamField body="retry_on" type="tuple[type[Exception], ...] | callable" default="(Exception,)">

要么是要重试的异常类型的元组，要么是接受异常并在应重试时返回 `True` 的可调用对象。

</ParamField>

<ParamField body="on_failure" type="string | callable" default="return_message">

所有重试耗尽时的行为。选项：
- `'return_message'` - 返回包含错误详情的 `ToolMessage`（允许 LLM 处理故障）
- `'raise'` - 重新引发异常（停止代理执行）
- 自定义可调用对象 - 接受异常并返回用于 `ToolMessage` 内容的字符串的函数

</ParamField>

<ParamField body="backoff_factor" type="number" default="2.0">

指数退避的乘数。每次重试等待 `initial_delay * (backoff_factor ** retry_number)` 秒。设置为 `0.0` 表示恒定延迟。

</ParamField>

<ParamField body="initial_delay" type="number" default="1.0">

第一次重试前的初始延迟（秒）

</ParamField>

<ParamField body="max_delay" type="number" default="60.0">

重试之间的最大延迟（秒）（限制指数退避增长）

</ParamField>

<ParamField body="jitter" type="boolean" default="true">

是否向延迟添加随机抖动（`±25%`）以避免惊群效应

</ParamField>

::::

:::: details 完整示例

该中间件使用指数退避自动重试失败的工具调用。

<strong>关键配置：</strong>
- `max_retries` - 重试尝试次数（默认值：2）
- `backoff_factor` - 指数退避的乘数因子（默认值：2.0）
- `initial_delay` - 初始延迟（秒）（默认值：1.0）
- `max_delay` - 延迟增长上限（默认值：60.0）
- `jitter` - 添加随机变化（默认值：True）

<strong>失败处理：</strong>
- `on_failure='return_message'` - 返回错误消息
- `on_failure='raise'` - 重新抛出异常
- 自定义函数 - 返回错误消息的函数

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ToolRetryMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, database_tool, api_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=3,
            backoff_factor=2.0,
            initial_delay=1.0,
            max_delay=60.0,
            jitter=True,
            tools=["api_tool"],
            retry_on=(ConnectionError, TimeoutError),
            on_failure="continue",
        ),
    ],
)
```

::::

### 模型重试

使用可配置的指数退避自动重试失败的模型调用。模型重试适用于以下场景：

- 处理模型 API 调用中的瞬时故障。
- 提高依赖网络的模型请求的可靠性。
- 构建能够优雅处理临时模型错误的弹性智能体。

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelRetryMiddleware" target="_blank" rel="noreferrer" class="link"><code>ModelRetryMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelRetryMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, database_tool],
    middleware=[
        ModelRetryMiddleware(
            max_retries=3,
            backoff_factor=2.0,
            initial_delay=1.0,
        ),
    ],
)
```

:::: details 配置选项

<ParamField body="max_retries" type="number" default="2">

初始调用后的最大重试尝试次数（默认情况下总共尝试 3 次）

</ParamField>

<ParamField body="retry_on" type="tuple[type[Exception], ...] | callable" default="(Exception,)">

要重试的异常类型元组，或者一个可调用对象，它接收一个异常并在应重试时返回 `True`。

</ParamField>

<ParamField body="on_failure" type="string | callable" default="continue">

所有重试耗尽时的行为。选项：
- `'continue'`（默认） - 返回包含错误详情的 `AIMessage`，允许智能体优雅地处理失败
- `'error'` - 重新抛出异常（停止智能体执行）
- 自定义可调用对象 - 接收异常并返回用于 `AIMessage` 内容的字符串的函数

</ParamField>

<ParamField body="backoff_factor" type="number" default="2.0">

指数退避的乘数因子。每次重试等待 `initial_delay * (backoff_factor ** retry_number)` 秒。设置为 `0.0` 表示恒定延迟。

</ParamField>

<ParamField body="initial_delay" type="number" default="1.0">

首次重试前的初始延迟（秒）

</ParamField>

<ParamField body="max_delay" type="number" default="60.0">

重试之间的最大延迟（秒）（限制指数退避增长）

</ParamField>

<ParamField body="jitter" type="boolean" default="true">

是否向延迟添加随机抖动（`±25%`）以避免惊群效应

</ParamField>

::::

:::: details 完整示例

该中间件使用指数退避自动重试失败的模型调用。

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelRetryMiddleware

# Basic usage with default settings (2 retries, exponential backoff)
agent = create_agent(
    model="gpt-4o",
    tools=[search_tool],
    middleware=[ModelRetryMiddleware()],
)

# Custom exception filtering
class TimeoutError(Exception):
    """Custom exception for timeout errors."""
    pass

class ConnectionError(Exception):
    """Custom exception for connection errors."""
    pass

# Retry specific exceptions only
retry = ModelRetryMiddleware(
    max_retries=4,
    retry_on=(TimeoutError, ConnectionError),
    backoff_factor=1.5,
)

def should_retry(error: Exception) -> bool:
    # Only retry on rate limit errors
    if isinstance(error, TimeoutError):
        return True
    # Or check for specific HTTP status codes
    if hasattr(error, "status_code"):
        return error.status_code in (429, 503)
    return False

retry_with_filter = ModelRetryMiddleware(
    max_retries=3,
    retry_on=should_retry,
)

# Return error message instead of raising
retry_continue = ModelRetryMiddleware(
    max_retries=4,
    on_failure="continue",  # Return AIMessage with error instead of raising
)

# Custom error message formatting
def format_error(error: Exception) -> str:
    return f"Model call failed: {error}. Please try again later."

retry_with_formatter = ModelRetryMiddleware(
    max_retries=4,
    on_failure=format_error,
)

# Constant backoff (no exponential growth)
constant_backoff = ModelRetryMiddleware(
    max_retries=5,
    backoff_factor=0.0,  # No exponential growth
    initial_delay=2.0,  # Always wait 2 seconds
)

# Raise exception on failure
strict_retry = ModelRetryMiddleware(
    max_retries=2,
    on_failure="error",  # Re-raise exception instead of returning message
)
```

::::

### LLM 工具模拟器

使用 LLM 模拟工具执行以进行测试，用 AI 生成的响应替换实际工具调用。LLM 工具模拟器适用于以下场景：

- 无需执行真实工具即可测试智能体行为。
- 在外部工具不可用或成本高昂时开发智能体。
- 在实现实际工具之前原型化智能体工作流。

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.LLMToolEmulator" target="_blank" rel="noreferrer" class="link"><code>LLMToolEmulator</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import LLMToolEmulator

agent = create_agent(
    model="gpt-4o",
    tools=[get_weather, search_database, send_email],
    middleware=[
        LLMToolEmulator(),  # Emulate all tools
    ],
)
```

:::: details 配置选项

<ParamField body="tools" type="list[str | BaseTool]">

要模拟的工具名称（str）或 BaseTool 实例列表。如果为 `None`（默认），将模拟所有工具。如果为空列表 `[]`，则不模拟任何工具。如果是包含工具名称/实例的数组，则仅模拟这些工具。

</ParamField>

<ParamField body="model" type="string | BaseChatModel">

用于生成模拟工具响应的模型。可以是模型标识符字符串（例如，`'anthropic:claude-sonnet-4-5-20250929'`）或 `BaseChatModel` 实例。如果未指定，则默认为智能体的模型。有关更多信息，请参阅 <a href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model(model)" target="_blank" rel="noreferrer" class="link"><code>init_chat_model</code></a>。

</ParamField>

::::

:::: details 完整示例

该中间件使用 LLM 为工具调用生成合理的响应，而不是执行实际工具。

```python
from langchain.agents import create_agent
from langchain.agents.middleware import LLMToolEmulator
from langchain.tools import tool

@tool
def get_weather(location: str) -> str:
    """Get the current weather for a location."""
    return f"Weather in {location}"

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email."""
    return "Email sent"

# Emulate all tools (default behavior)
agent = create_agent(
    model="gpt-4o",
    tools=[get_weather, send_email],
    middleware=[LLMToolEmulator()],
)

# Emulate specific tools only
agent2 = create_agent(
    model="gpt-4o",
    tools=[get_weather, send_email],
    middleware=[LLMToolEmulator(tools=["get_weather"])],
)

# Use custom model for emulation
agent4 = create_agent(
    model="gpt-4o",
    tools=[get_weather, send_email],
    middleware=[LLMToolEmulator(model="claude-sonnet-4-5-20250929")],
)
```

::::

### 上下文编辑

通过清除达到令牌限制时的旧工具调用输出来管理对话上下文，同时保留最近的结果。这有助于在包含许多工具调用的长对话中保持上下文窗口可控。上下文编辑适用于以下场景：

- 包含许多工具调用且超出令牌限制的长对话
- 通过删除不再相关的旧工具输出来降低令牌成本
- 在上下文中仅保留最近的 N 个工具结果

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ContextEditingMiddleware" target="_blank" rel="noreferrer" class="link"><code>ContextEditingMiddleware</code></a>, <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ClearToolUsesEdit" target="_blank" rel="noreferrer" class="link"><code>ClearToolUsesEdit</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ContextEditingMiddleware, ClearToolUsesEdit

agent = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        ContextEditingMiddleware(
            edits=[
                ClearToolUsesEdit(
                    trigger=100000,
                    keep=3,
                ),
            ],
        ),
    ],
)
```

:::: details 配置选项

<ParamField body="edits" type="list[ContextEdit]" default="[ClearToolUsesEdit()]">

要应用的 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ContextEdit" target="_blank" rel="noreferrer" class="link"><code>ContextEdit</code></a> 策略列表

</ParamField>

<ParamField body="token_count_method" type="string" default="approximate">

令牌计数方法。选项：`'approximate'` 或 `'model'`

</ParamField>

<strong><a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ClearToolUsesEdit" target="_blank" rel="noreferrer" class="link"><code>ClearToolUsesEdit</code></a> 选项：</strong>

<ParamField body="trigger" type="number" default="100000">

触发编辑的令牌计数。当对话超过此令牌计数时，将清除旧工具输出。

</ParamField>

<ParamField body="clear_at_least" type="number" default="0">

编辑运行时至少要回收的令牌数。如果设置为 0，则根据需要清除尽可能多的内容。

</ParamField>

<ParamField body="keep" type="number" default="3">

必须保留的最远工具结果数量。这些永远不会被清除。

</ParamField>

<ParamField body="clear_tool_inputs" type="boolean" default="False">

是否清除 AI 消息上的原始工具调用参数。当为 `True` 时，工具调用参数将替换为空对象。

</ParamField>

<ParamField body="exclude_tools" type="list[string]" default="()">

要排除在清除之外的工具名称列表。这些工具的输出永远不会被清除。

</ParamField>

<ParamField body="placeholder" type="string" default="[cleared]">

为已清除的工具输出插入的占位符文本。这将替换原始工具消息内容。

</ParamField>

::::

:::: details 完整示例

该中间件在达到令牌限制时应用上下文编辑策略。最常见的策略是 `ClearToolUsesEdit`，它在保留最近结果的同时清除旧工具结果。

<strong>工作原理：</strong>
1. 监控对话中的令牌计数
2. 达到阈值时，清除旧工具输出
3. 保留最近的 N 个工具结果
4. 可选地保留工具调用参数以供上下文使用

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ContextEditingMiddleware, ClearToolUsesEdit

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, your_calculator_tool, database_tool],
    middleware=[
        ContextEditingMiddleware(
            edits=[
                ClearToolUsesEdit(
                    trigger=2000,
                    keep=3,
                    clear_tool_inputs=False,
                    exclude_tools=[],
                    placeholder="[cleared]",
                ),
            ],
        ),
    ],
)
```

::::

### Shell 工具

向智能体公开一个持久的 Shell 会话以执行命令。Shell 工具中间件适用于以下场景：

- 需要执行系统命令的智能体
- 开发和部署自动化任务
- 测试和验证工作流
- 文件系统操作和脚本执行

<Warning>

<strong>安全考虑</strong>：使用适当的执行策略（`HostExecutionPolicy`、`DockerExecutionPolicy` 或 `CodexSandboxExecutionPolicy`）以匹配您部署的安全要求。

</Warning>

<Note>

<strong>限制</strong>：持久的 Shell 会话目前不适用于中断（人在回路中）。我们预计未来会添加对此的支持。

</Note>

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ShellToolMiddleware" target="_blank" rel="noreferrer" class="link"><code>ShellToolMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import (
    ShellToolMiddleware,
    HostExecutionPolicy,
)

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool],
    middleware=[
        ShellToolMiddleware(
            workspace_root="/workspace",
            execution_policy=HostExecutionPolicy(),
        ),
    ],
)
```

:::: details 配置选项

<ParamField body="workspace_root" type="str | Path | None">

Shell 会话的基目录。如果省略，则在智能体启动时创建临时目录，并在结束时删除。

</ParamField>

<ParamField body="startup_commands" type="tuple[str, ...] | list[str] | str | None">

会话启动后按顺序执行的可选命令

</ParamField>

<ParamField body="shutdown_commands" type="tuple[str, ...] | list[str] | str | None">

会话关闭前执行的可选命令

</ParamField>

<ParamField body="execution_policy" type="BaseExecutionPolicy | None">

控制超时、输出限制和资源配置的执行策略。选项：

- `HostExecutionPolicy` - 完全主机访问（默认）；最适合智能体已在容器或 VM 内运行的受信任环境
- `DockerExecutionPolicy` - 为每次智能体运行启动一个单独的 Docker 容器，提供更强的隔离性
- `CodexSandboxExecutionPolicy` - 重用 Codex CLI 沙箱以提供额外的系统调用/文件系统限制

</ParamField>

<ParamField body="redaction_rules" type="tuple[RedactionRule, ...] | list[RedactionRule] | None">

用于在将命令输出返回给模型之前对其进行清理的可选脱敏规则。

<Warning>

脱敏规则在事后应用，在使用 `HostExecutionPolicy` 时无法防止秘密或敏感数据的外泄。

</Warning>

</ParamField>

<ParamField body="tool_description" type="str | None">

已注册的 Shell 工具描述的可选覆盖

</ParamField>

<ParamField body="shell_command" type="Sequence[str] | str | None">

用于启动持久会话的可选 Shell 可执行文件（字符串）或参数序列。默认为 `/bin/bash`。

</ParamField>

<ParamField body="env" type="Mapping[str, Any] | None">

提供给 Shell 会话的可选环境变量。值在命令执行前被强制转换为字符串。

</ParamField>

::::

:::: details 完整示例

该中间件提供一个单一的持久 Shell 会话，智能体可以使用它来顺序执行命令。

<strong>执行策略：</strong>
- `HostExecutionPolicy`（默认） - 具有完全主机访问权限的本机执行
- `DockerExecutionPolicy` - 隔离的 Docker 容器执行
- `CodexSandboxExecutionPolicy` - 通过 Codex CLI 进行沙箱化执行

```python
from langchain.agents import create_agent
from langchain.agents.middleware import (
    ShellToolMiddleware,
    HostExecutionPolicy,
    DockerExecutionPolicy,
    RedactionRule,
)

# Basic shell tool with host execution
agent = create_agent(
    model="gpt-4o",
    tools=[search_tool],
    middleware=[
        ShellToolMiddleware(
            workspace_root="/workspace",
            execution_policy=HostExecutionPolicy(),
        ),
    ],
)

# Docker isolation with startup commands
agent_docker = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        ShellToolMiddleware(
            workspace_root="/workspace",
            startup_commands=["pip install requests", "export PYTHONPATH=/workspace"],
            execution_policy=DockerExecutionPolicy(
                image="python:3.11-slim",
                command_timeout=60.0,
            ),
        ),
    ],
)

# With output redaction (applied post execution)
agent_redacted = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        ShellToolMiddleware(
            workspace_root="/workspace",
            redaction_rules=[
                RedactionRule(pii_type="api_key", detector=r"sk-[a-zA-Z0-9]{32}"),
            ],
        ),
    ],
)
```

::::

### 文件搜索

提供基于文件系统的 Glob 和 Grep 搜索工具。文件搜索中间件适用于以下场景：

- 代码探索与分析
- 通过文件名模式查找文件
- 使用正则表达式搜索代码内容
- 需要文件发现的大型代码库

**API 参考：** <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.FilesystemFileSearchMiddleware" target="_blank" rel="noreferrer" class="link"><code>FilesystemFileSearchMiddleware</code></a>

```python
from langchain.agents import create_agent
from langchain.agents.middleware import FilesystemFileSearchMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        FilesystemFileSearchMiddleware(
            root_path="/workspace",
            use_ripgrep=True,
        ),
    ],
)
```

:::: details 配置选项

<ParamField body="root_path" type="str" required>

搜索的根目录。所有文件操作均相对于此路径。

</ParamField>

<ParamField body="use_ripgrep" type="bool" default="True">

是否使用 ripgrep 进行搜索。如果 ripgrep 不可用，则回退到 Python 正则表达式。

</ParamField>

<ParamField body="max_file_size_mb" type="int" default="10">

要搜索的最大文件大小（以 MB 为单位）。大于此大小的文件将被跳过。

</ParamField>

::::

:::: details 完整示例

该中间件为智能体添加了两个搜索工具：

<strong>Glob 工具</strong> - 快速文件模式匹配：
- 支持模式如 `**/*.py`、`src/**/*.ts`
- 返回按修改时间排序的匹配文件路径

<strong>Grep 工具</strong> - 使用正则表达式进行内容搜索：
- 支持完整的正则表达式语法
- 通过 `include` 参数按文件模式过滤
- 三种输出模式：`files_with_matches`、`content`、`count`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import FilesystemFileSearchMiddleware
from langchain.messages import HumanMessage

agent = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        FilesystemFileSearchMiddleware(
            root_path="/workspace",
            use_ripgrep=True,
            max_file_size_mb=10,
        ),
    ],
)

# Agent can now use glob_search and grep_search tools
result = agent.invoke({
    "messages": [HumanMessage("Find all Python files containing 'async def'")]
})

# The agent will use:
# 1. glob_search(pattern="**/*.py") to find Python files
# 2. grep_search(pattern="async def", include="*.py") to find async functions
```

::::

## 特定于提供商的中间件

这些中间件针对特定的 LLM 提供商进行了优化。有关完整详细信息和示例，请参阅每个提供商的文档。

<Columns :cols="2">

<Card title="Anthropic" href="/oss/integrations/middleware/anthropic" icon="anthropic" arrow>

适用于 Claude 模型的提示缓存、bash 工具、文本编辑器、内存和文件搜索中间件。

</Card>

    
<Card title="OpenAI" href="/oss/integrations/middleware/openai" icon="openai" arrow>

适用于 OpenAI 模型的内容审核中间件。

</Card>

</Columns>

