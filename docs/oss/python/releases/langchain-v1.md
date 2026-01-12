---
title: LangChain v1 有哪些新特性
sidebarTitle: LangChain v1
---
**LangChain v1 是一个专注于构建智能体（agent）的生产就绪基础框架。** 我们围绕三个核心改进简化了框架：

<CardGroup :cols="1">

<Card title="create_agent" icon="robot" href="#create-agent" arrow>

LangChain 中构建智能体的新标准，取代了 `langgraph.prebuilt.create_react_agent`。

</Card>

<Card title="标准内容块" icon="cube" href="#standard-content-blocks" arrow>

新的 `content_blocks` 属性，提供了跨供应商统一访问现代 LLM 功能的途径。

</Card>

<Card title="简化的命名空间" icon="sitemap" href="#simplified-package" arrow>

`langchain` 命名空间已简化，专注于智能体的核心构建模块，遗留功能已移至 `langchain-classic`。

</Card>

</CardGroup>

要升级，请执行：

::: code-group

```bash [pip]
pip install -U langchain
```

```bash [uv]
uv add langchain
```

:::

有关完整变更列表，请参阅 [迁移指南](/oss/python/migrate/langchain-v1)。

## `create_agent`

<a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 是 LangChain 1.0 中构建智能体的标准方式。它提供了比 <a href="https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent" target="_blank" rel="noreferrer" class="link"><code>langgraph.prebuilt.create_react_agent</code></a> 更简单的接口，同时通过使用 [中间件](#middleware) 提供了更大的自定义潜力。

```python
from langchain.agents import create_agent

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[search_web, analyze_data, send_email],
    system_prompt="You are a helpful research assistant."
)

result = agent.invoke({
    "messages": [
        {"role": "user", "content": "Research AI safety trends"}
    ]
})
```

在底层，<a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 构建于基本的智能体循环之上——调用模型，让它选择要执行的工具，然后在它不再调用工具时结束：

<img src="/oss/images/core_agent_loop.png" alt="核心智能体循环图" />

更多信息，请参阅 [智能体](/oss/python/langchain/agents)。

### 中间件

中间件是 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 的定义性功能。它提供了一个高度可定制的入口点，提升了你能构建的功能上限。

优秀的智能体需要 [上下文工程](/oss/python/langchain/context-engineering)：在正确的时间将正确的信息传递给模型。中间件通过一个可组合的抽象，帮助你控制动态提示、对话摘要、选择性工具访问、状态管理和防护栏。

#### 预构建中间件

LangChain 为常见模式提供了一些 [预构建中间件](/oss/python/langchain/middleware#built-in-middleware)，包括：

- <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.PIIMiddleware" target="_blank" rel="noreferrer" class="link"><code>PIIMiddleware</code></a>: 在发送给模型之前编辑敏感信息
- <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.SummarizationMiddleware" target="_blank" rel="noreferrer" class="link"><code>SummarizationMiddleware</code></a>: 当对话历史过长时进行压缩
- <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.HumanInTheLoopMiddleware" target="_blank" rel="noreferrer" class="link"><code>HumanInTheLoopMiddleware</code></a>: 要求对敏感工具调用进行人工批准

```python
from langchain.agents import create_agent
from langchain.agents.middleware import (
    PIIMiddleware,
    SummarizationMiddleware,
    HumanInTheLoopMiddleware
)

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[read_email, send_email],
    middleware=[
        PIIMiddleware("email", strategy="redact", apply_to_input=True),
        PIIMiddleware(
            "phone_number",
            detector=(
                r"(?:\+?\d{1,3}[\s.-]?)?"
                r"(?:\(?\d{2,4}\)?[\s.-]?)?"
                r"\d{3,4}[\s.-]?\d{4}"
			),
			strategy="block"
        ),
        SummarizationMiddleware(
            model="claude-sonnet-4-5-20250929",
            trigger={"tokens": 500}
        ),
        HumanInTheLoopMiddleware(
            interrupt_on={
                "send_email": {
                    "allowed_decisions": ["approve", "edit", "reject"]
                }
            }
        ),
    ]
)
```

#### 自定义中间件

你也可以构建自定义中间件以满足需求。中间件在智能体执行的每个步骤暴露钩子：

<img src="/oss/images/middleware_final.png" alt="中间件流程图" />

通过在 <a href="https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware" target="_blank" rel="noreferrer" class="link"><code>AgentMiddleware</code></a> 类的子类上实现以下任意钩子来构建自定义中间件：

| 钩子 | 运行时机 | 用例 |
|-------------------|--------------------------|-----------------------------------------|
| `before_agent` | 调用智能体之前 | 加载记忆，验证输入 |
| `before_model` | 每次 LLM 调用之前 | 更新提示，修剪消息 |
| `wrap_model_call` | 围绕每次 LLM 调用 | 拦截和修改请求/响应 |
| `wrap_tool_call` | 围绕每次工具调用 | 拦截和修改工具执行 |
| `after_model` | 每次 LLM 响应之后 | 验证输出，应用防护栏 |
| `after_agent` | 智能体完成之后 | 保存结果，清理 |

自定义中间件示例：

```python [expandable]
from dataclasses import dataclass
from typing import Callable

from langchain_openai import ChatOpenAI

from langchain.agents.middleware import (
    AgentMiddleware,
    ModelRequest
)
from langchain.agents.middleware.types import ModelResponse

@dataclass
class Context:
    user_expertise: str = "beginner"

class ExpertiseBasedToolMiddleware(AgentMiddleware):
    def wrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        user_level = request.runtime.context.user_expertise

        if user_level == "expert":
            # 更强大的模型
            model = ChatOpenAI(model="gpt-5")
            tools = [advanced_search, data_analysis]
        else:
            # 能力较弱的模型
            model = ChatOpenAI(model="gpt-5-nano")
            tools = [simple_search, basic_calculator]

        return handler(request.override(model=model, tools=tools))

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[
        simple_search,
        advanced_search,
        basic_calculator,
        data_analysis
    ],
    middleware=[ExpertiseBasedToolMiddleware()],
    context_schema=Context
)
```

更多信息，请参阅 [完整的中间件指南](/oss/python/langchain/middleware)。

### 基于 LangGraph 构建

因为 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 构建于 [LangGraph](/oss/langgraph) 之上，你自动获得对长期运行和可靠智能体的内置支持，包括：

<CardGroup :cols="2">

<Card title="持久化" icon="database">

通过内置检查点，对话自动跨会话持久化

</Card>

<Card title="流式传输" icon="water">

实时流式传输令牌、工具调用和推理轨迹

</Card>

<Card title="人在回路" icon="hand">

在敏感操作前暂停智能体执行以等待人工批准

</Card>

<Card title="时间旅行" icon="clock-rotate-left">

将对话回退到任意点，探索替代路径和提示

</Card>

</CardGroup>

你不需要学习 LangGraph 就能使用这些功能——它们开箱即用。

### 结构化输出

<a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 改进了结构化输出生成：

- **主循环集成**：结构化输出现在在主循环中生成，而不是需要额外的 LLM 调用
- **结构化输出策略**：模型可以在调用工具或使用供应商侧结构化输出生成之间进行选择
- **成本降低**：消除了额外 LLM 调用带来的额外费用

```python
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from pydantic import BaseModel

class Weather(BaseModel):
    temperature: float
    condition: str

def weather_tool(city: str) -> str:
    """Get the weather for a city."""
    return f"it's sunny and 70 degrees in {city}"

agent = create_agent(
    "gpt-4o-mini",
    tools=[weather_tool],
    response_format=ToolStrategy(Weather)
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "What's the weather in SF?"}]
})

print(repr(result["structured_response"]))
# results in `Weather(temperature=70.0, condition='sunny')`
```

**错误处理**：通过 `ToolStrategy` 的 `handle_errors` 参数控制错误处理：
- **解析错误**：模型生成的数据与所需结构不匹配
- **多个工具调用**：模型为结构化输出模式生成了 2 个或更多工具调用

---

## 标准内容块

<Note>

内容块支持目前仅适用于以下集成：

    - [`langchain-anthropic`](https://pypi.org/project/langchain-anthropic/)
    - [`langchain-aws`](https://pypi.org/project/langchain-aws/)
    - [`langchain-openai`](https://pypi.org/project/langchain-openai/)
    - [`langchain-google-genai`](https://pypi.org/project/langchain-google-genai/)
    - [`langchain-ollama`](https://pypi.org/project/langchain-ollama/)

对内容块的更广泛支持将逐步扩展到更多供应商。

</Note>

新的 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.messages.BaseMessage.content_blocks" target="_blank" rel="noreferrer" class="link"><code>content_blocks</code></a> 属性引入了一种适用于跨供应商的消息内容标准表示：

```python
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(model="claude-sonnet-4-5-20250929")
response = model.invoke("What's the capital of France?")

# 统一访问内容块
for block in response.content_blocks:
    if block["type"] == "reasoning":
        print(f"模型推理：{block['reasoning']}")
    elif block["type"] == "text":
        print(f"响应：{block['text']}")
    elif block["type"] == "tool_call":
        print(f"工具调用：{block['name']}({block['args']})")
```

### 优势

- **供应商无关**：无论供应商如何，都可以使用相同的 API 访问推理轨迹、引用、内置工具（网络搜索、代码解释器等）和其他功能
- **类型安全**：所有内容块类型都有完整的类型提示
- **向后兼容**：标准内容可以 [延迟加载](/oss/python/langchain/messages#standard-content-blocks)，因此没有相关的破坏性变更

更多信息，请参阅我们关于 [内容块](/oss/python/langchain/messages#standard-content-blocks) 的指南。

---

## 简化的包

LangChain v1 简化了 [`langchain`](https://pypi.org/project/langchain/) 包的命名空间，专注于智能体的核心构建模块。精炼后的命名空间暴露了最有用和最相关的功能：

### 命名空间

| 模块 | 可用内容 | 备注 |
|--------|------------------|-------|
| <a href="https://reference.langchain.com/python/langchain/agents" target="_blank" rel="noreferrer" class="link"><code>langchain.agents</code></a> | <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a>, <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState" target="_blank" rel="noreferrer" class="link"><code>AgentState</code></a> | 核心智能体创建功能 |
| <a href="https://reference.langchain.com/python/langchain/messages" target="_blank" rel="noreferrer" class="link"><code>langchain.messages</code></a> | 消息类型, <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.ContentBlock" target="_blank" rel="noreferrer" class="link">内容块</a>, <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.trim_messages" target="_blank" rel="noreferrer" class="link"><code>trim_messages</code></a> | 从 <a href="https://reference.langchain.com/python/langchain_core/" target="_blank" rel="noreferrer" class="link"><code>langchain-core</code></a> 重新导出 |
| <a href="https://reference.langchain.com/python/langchain/tools" target="_blank" rel="noreferrer" class="link"><code>langchain.tools</code></a> | <a href="https://reference.langchain.com/python/langchain/tools/#langchain.tools.tool" target="_blank" rel="noreferrer" class="link"><code>@tool</code></a>, <a href="https://reference.langchain.com/python/langchain/tools/#langchain.tools.BaseTool" target="_blank" rel="noreferrer" class="link"><code>BaseTool</code></a>, 注入辅助函数 | 从 <a href="https://reference.langchain.com/python/langchain_core/" target="_blank" rel="noreferrer" class="link"><code>langchain-core</code></a> 重新导出 |
| <a href="https://reference.langchain.com/python/langchain/models" target="_blank" rel="noreferrer" class="link"><code>langchain.chat_models</code></a> | <a href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model" target="_blank" rel="noreferrer" class="link"><code>init_chat_model</code></a>, <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel" target="_blank" rel="noreferrer" class="link"><code>BaseChatModel</code></a> | 统一的模型初始化 |
| <a href="https://reference.langchain.com/python/langchain/embeddings" target="_blank" rel="noreferrer" class="link"><code>langchain.embeddings</code></a> | <a href="https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings" target="_blank" rel="noreferrer" class="link"><code>Embeddings</code></a>, <a href="https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings" target="_blank" rel="noreferrer" class="link"><code>init_embeddings</code></a> | 嵌入模型 |

为了方便起见，其中大部分是从 `langchain-core` 重新导出的，这为你提供了一个专注于构建智能体的 API 表面。

```python
# 智能体构建
from langchain.agents import create_agent

# 消息和内容
from langchain.messages import AIMessage, HumanMessage

# 工具
from langchain.tools import tool

# 模型初始化
from langchain.chat_models import init_chat_model
from langchain.embeddings import init_embeddings
```

### `langchain-classic`

遗留功能已移至 [`langchain-classic`](https://pypi.org/project/langchain-classic)，以保持核心包的轻量和专注。

**`langchain-classic` 包含的内容：**

- 遗留链和链实现
- 检索器（例如 `MultiQueryRetriever` 或之前 `langchain.retrievers` 模块中的任何内容）
- 索引 API
- hub 模块（用于以编程方式管理提示）
- [`langchain-community`](https://pypi.org/project/langchain-community) 导出
- 其他已弃用的功能

如果你使用任何这些功能，请安装 [`langchain-classic`](https://pypi.org/project/langchain-classic)：

::: code-group

```bash [pip]
pip install langchain-classic
```

```bash [uv]
uv add langchain-classic
```

:::

然后更新你的导入：

```python
from langchain import ...  # [!code --]
from langchain_classic import ...  # [!code ++]

from langchain.chains import ...  # [!code --]
from langchain_classic.chains import ...  # [!code ++]

from langchain.retrievers import ...  # [!code --]
from langchain_classic.retrievers import ...  # [!code ++]

from langchain import hub  # [!code --]
from langchain_classic import hub  # [!code ++]
```

## 迁移指南

请参阅我们的 [迁移指南](/oss/python/migrate/langchain-v1) 以获取帮助，将你的代码更新到 LangChain v1。

## 报告问题

请在 [GitHub](https://github.com/langchain-ai/langchain/issues) 上报告发现的任何 1.0 版本的问题，并使用 `'v1'` [标签](https://github.com/langchain-ai/langchain/issues?q=state%3Aopen%20label%3Av1)。

## 其他资源

<CardGroup :cols="3">

<Card title="LangChain 1.0" icon="rocket" href="https://blog.langchain.com/langchain-langchain-1-0-alpha-releases/">

阅读公告

</Card>

<Card title="中间件指南" icon="puzzle-piece" href="https://blog.langchain.com/agent-middleware/">

深入中间件

</Card>

<Card title="智能体文档" icon="book" href="/oss/langchain/agents" arrow>

完整的智能体文档

</Card>

<Card title="消息内容" icon="message" href="/oss/langchain/messages#message-content" arrow>

新的内容块 API

</Card>

<Card title="迁移指南" icon="arrow-right-arrow-left" href="/oss/migrate/langchain-v1" arrow>

如何迁移到 LangChain v1

</Card>

<Card title="GitHub" icon="github" href="https://github.com/langchain-ai/langchain">

报告问题或贡献代码

</Card>

</CardGroup>

## 另请参阅

- [版本控制](/oss/versioning) – 理解版本号
- [发布策略](/oss/release-policy) – 详细的发布策略
