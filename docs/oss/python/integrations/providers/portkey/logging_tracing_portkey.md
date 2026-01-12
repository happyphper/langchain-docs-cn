---
title: 日志、追踪与监控
---
在使用 LangChain 构建应用或智能体时，通常需要发起多个 API 调用来完成单个用户请求。然而，当您想要分析这些请求时，它们之间并没有关联。通过 [**Portkey**](/oss/python/integrations/providers/portkey/)，来自单个用户请求的所有嵌入、补全和其他请求都将被记录并追踪到一个共同的 ID，使您能够全面了解用户交互情况。

本笔记本将作为分步指南，展示如何在您的 LangChain 应用中使用 `Portkey` 来记录、追踪和监控 LangChain 的 LLM 调用。

首先，导入 Portkey、OpenAI 和 Agent 工具

```python
import os

from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_openai import ChatOpenAI
from portkey_ai import PORTKEY_GATEWAY_URL, createHeaders
```

在下方粘贴您的 OpenAI API 密钥。[(您可以在此处找到它)](https://platform.openai.com/account/api-keys)

```python
os.environ["OPENAI_API_KEY"] = "..."
```

## 获取 Portkey API 密钥

1. 在此处注册 [Portkey](https://app.portkey.ai/signup)
2. 在您的 [仪表板](https://app.portkey.ai/) 上，点击左下角的个人资料图标，然后点击“复制 API 密钥”
3. 将其粘贴在下方

```python
PORTKEY_API_KEY = "..."  # 在此处粘贴您的 Portkey API 密钥
```

## 设置追踪 ID

1. 在下方为您的请求设置追踪 ID
2. 对于源自单个请求的所有 API 调用，可以使用相同的追踪 ID

```python
TRACE_ID = "uuid-trace-id"  # 在此处设置追踪 ID
```

## 生成 Portkey 请求头

```python
portkey_headers = createHeaders(
    api_key=PORTKEY_API_KEY, provider="openai", trace_id=TRACE_ID
)
```

定义提示词和要使用的工具

```python
from langchain_classic import hub
from langchain.tools import tool

prompt = hub.pull("hwchase17/openai-tools-agent")

@tool
def multiply(first_int: int, second_int: int) -> int:
    """Multiply two integers together."""
    return first_int * second_int

@tool
def exponentiate(base: int, exponent: int) -> int:
    "Exponentiate the base to the exponent power."
    return base**exponent

tools = [multiply, exponentiate]
```

像往常一样运行您的智能体。**唯一** 的更改是，我们现在将在请求中 **包含上述请求头**。

```python
model = ChatOpenAI(
    base_url=PORTKEY_GATEWAY_URL, default_headers=portkey_headers, temperature=0
)

# 构建 OpenAI 工具智能体
agent = create_openai_tools_agent(model, tools, prompt)

# 通过传入智能体和工具来创建智能体执行器
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

agent_executor.invoke(
    {
        "input": "Take 3 to the fifth power and multiply that by thirty six, then square the result"
    }
)
```

```text
> Entering new AgentExecutor chain...

Invoking: `exponentiate` with `{'base': 3, 'exponent': 5}`

243
Invoking: `multiply` with `{'first_int': 243, 'second_int': 36}`

8748
Invoking: `exponentiate` with `{'base': 8748, 'exponent': 2}`

76527504The result of taking 3 to the fifth power, multiplying it by 36, and then squaring the result is 76,527,504.

> Finished chain.
```

```text
{'input': 'Take 3 to the fifth power and multiply that by thirty six, then square the result',
 'output': 'The result of taking 3 to the fifth power, multiplying it by 36, and then squaring the result is 76,527,504.'}
```

## Portkey 上的日志记录与追踪机制

**日志记录**

- 通过 Portkey 发送请求可确保默认记录所有请求
- 每个请求日志包含 `时间戳`、`模型名称`、`总成本`、`请求时间`、`请求 JSON`、`响应 JSON` 以及 Portkey 的附加功能

**[追踪](https://portkey.ai/docs/product/observability-modern-monitoring-for-llms/traces)**

- 追踪 ID 会随每个请求一起传递，并可在 Portkey 仪表板的日志中查看
- 您也可以根据需要为每个请求设置 **不同的追踪 ID**
- 您还可以将用户反馈附加到追踪 ID。[更多信息请参阅此处](https://portkey.ai/docs/product/observability-modern-monitoring-for-llms/feedback)

对于上述请求，您将能够查看完整的日志追踪，如下所示
![在 Portkey 上查看 LangChain 追踪](https://assets.portkey.ai/docs/agent_tracing.gif)

## 高级 LLMOps 功能 - 缓存、标记、重试

除了日志记录和追踪，Portkey 还提供了更多功能，为您的现有工作流增添生产级能力：

**缓存**

从缓存中响应先前已服务过的客户查询，而不是再次发送给 OpenAI。支持精确字符串匹配或语义相似字符串匹配。缓存可以节省成本，并将延迟降低高达 20 倍。[文档](https://portkey.ai/docs/product/ai-gateway-streamline-llm-integrations/cache-simple-and-semantic)

**重试**

自动重新处理任何不成功的 API 请求，**最多 `5`** 次。采用 **`指数退避`** 策略，间隔重试尝试以防止网络过载。[文档](https://portkey.ai/docs/product/ai-gateway-streamline-llm-integrations)

**标记**

使用预定义的标记，以高粒度跟踪和审计每次用户交互。[文档](https://portkey.ai/docs/product/observability-modern-monitoring-for-llms/metadata)
