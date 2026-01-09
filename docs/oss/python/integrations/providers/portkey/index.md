---
title: Portkey
---
[Portkey](https://portkey.ai) 是 AI 应用的控制面板。凭借其流行的 AI 网关和可观测性套件，数百个团队能够构建**可靠**、**经济高效**且**快速**的应用。

## 面向 LangChain 的 LLMOps

Portkey 为 LangChain 带来了生产就绪能力。通过 Portkey，您可以：

- [x] 通过统一的 API 连接 150 多个模型，
- [x] 查看所有请求的 42 多项**指标和日志**，
- [x] 启用**语义缓存**以降低延迟和成本，
- [x] 为失败的请求实施自动**重试和回退**，
- [x] 为请求添加**自定义标签**以便更好地跟踪和分析，以及[更多功能](https://portkey.ai/docs)。

## 快速入门 - Portkey & LangChain

由于 Portkey 与 OpenAI 签名完全兼容，您可以通过 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 接口连接到 Portkey AI 网关。

- 将 `base_url` 设置为 `PORTKEY_GATEWAY_URL`
- 使用 `createHeaders` 辅助方法添加 `default_headers` 以包含 Portkey 所需的头部信息。

首先，请通过[在此注册](https://app.portkey.ai/signup)获取您的 Portkey API 密钥。（点击左下角的个人资料图标，然后点击"复制 API 密钥"），或者在[您自己的环境](https://github.com/Portkey-AI/gateway/blob/main/docs/installation-deployments.md)中部署开源 AI 网关。

接下来，安装 Portkey SDK：

```python
pip install -U portkey_ai
```

现在，我们可以通过更新 LangChain 中的 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 模型来连接到 Portkey AI 网关：

```python
from langchain_openai import ChatOpenAI
from portkey_ai import createHeaders, PORTKEY_GATEWAY_URL

PORTKEY_API_KEY = "..." # 当您自行托管网关时不需要此项
PROVIDER_API_KEY = "..." # 添加正在使用的 AI 提供商的 API 密钥

portkey_headers = createHeaders(api_key=PORTKEY_API_KEY,provider="openai")

llm = ChatOpenAI(api_key=PROVIDER_API_KEY, base_url=PORTKEY_GATEWAY_URL, default_headers=portkey_headers)

llm.invoke("What is the meaning of life, universe and everything?")
```

请求将通过您的 Portkey AI 网关路由到指定的 `provider`。Portkey 还会开始记录您账户中的所有请求，这使得调试变得极其简单。

![在 Portkey 中查看来自 LangChain 的日志](https://assets.portkey.ai/docs/langchain-logs.gif)

## 通过 AI 网关使用 150 多个模型

当您能够使用上述代码片段通过 AI 网关连接到 20 多个提供商支持的 150 多个模型时，AI 网关的强大功能才得以体现。

让我们修改上面的代码，调用 Anthropic 的 `claude-3-opus-20240229` 模型。

Portkey 支持 **[虚拟密钥](https://docs.portkey.ai/docs/product/ai-gateway-streamline-llm-integrations/virtual-keys)**，这是一种在安全保险库中存储和管理 API 密钥的简便方法。让我们尝试使用虚拟密钥进行 LLM 调用。您可以在 Portkey 中导航到"虚拟密钥"选项卡，为 Anthropic 创建一个新密钥。

`virtual_key` 参数用于设置正在使用的 AI 提供商的身份验证和提供商信息。在我们的例子中，我们使用的是 Anthropic 虚拟密钥。

> 请注意，`api_key` 可以留空，因为该身份验证不会被使用。

```python
from langchain_openai import ChatOpenAI
from portkey_ai import createHeaders, PORTKEY_GATEWAY_URL

PORTKEY_API_KEY = "..."
VIRTUAL_KEY = "..." # 我们上面复制的 Anthropic 虚拟密钥

portkey_headers = createHeaders(api_key=PORTKEY_API_KEY,virtual_key=VIRTUAL_KEY)

llm = ChatOpenAI(api_key="X", base_url=PORTKEY_GATEWAY_URL, default_headers=portkey_headers, model="claude-3-opus-20240229")

llm.invoke("What is the meaning of life, universe and everything?")
```

Portkey AI 网关将对 Anthropic 的 API 请求进行身份验证，并以 OpenAI 格式返回响应供您使用。

AI 网关扩展了 LangChain 的 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 类，使其成为调用任何提供商和任何模型的单一接口。

## 高级路由 - 负载均衡、回退、重试

Portkey AI 网关通过配置优先的方法，为 LangChain 带来了负载均衡、回退、实验和金丝雀测试等功能。

让我们看一个**例子**：我们可能希望将流量在 `gpt-4` 和 `claude-opus` 之间按 50:50 的比例分配，以测试这两个大型模型。此场景的网关配置如下所示：

```python
config = {
    "strategy": {
         "mode": "loadbalance"
    },
    "targets": [{
        "virtual_key": "openai-25654", # OpenAI 的虚拟密钥
        "override_params": {"model": "gpt4"},
        "weight": 0.5
    }, {
        "virtual_key": "anthropic-25654", # Anthropic 的虚拟密钥
        "override_params": {"model": "claude-3-opus-20240229"},
        "weight": 0.5
    }]
}
```

然后，我们可以在从 LangChain 发出的请求中使用此配置。

```python
portkey_headers = createHeaders(
    api_key=PORTKEY_API_KEY,
    config=config
)

llm = ChatOpenAI(api_key="X", base_url=PORTKEY_GATEWAY_URL, default_headers=portkey_headers)

llm.invoke("What is the meaning of life, universe and everything?")
```

当调用 LLM 时，Portkey 将按照定义的权重比例将请求分发给 `gpt-4` 和 `claude-3-opus-20240229`。

您可以在[此处](https://docs.portkey.ai/docs/api-reference/config-object#examples)找到更多配置示例。

## **追踪链与智能体**

Portkey 的 LangChain 集成让您能够完全洞察智能体的运行情况。让我们以[一个流行的智能体工作流](https://python.langchain.com/docs/use_cases/tool_use/quickstart/#agents)为例。

我们只需要像上面那样修改 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 类以使用 AI 网关。

```python
from langchain_classic import hub
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_openai import ChatOpenAI
from langchain.tools import tool
from portkey_ai import PORTKEY_GATEWAY_URL, createHeaders

prompt = hub.pull("hwchase17/openai-tools-agent")

portkey_headers = createHeaders(
    api_key=PORTKEY_API_KEY,
    virtual_key=OPENAI_VIRTUAL_KEY,
    trace_id="uuid-uuid-uuid-uuid"
)

@tool
def multiply(first_int: int, second_int: int) -> int:
    """Multiply two integers together."""
    return first_int * second_int

@tool
def exponentiate(base: int, exponent: int) -> int:
    "Exponentiate the base to the exponent power."
    return base**exponent

tools = [multiply, exponentiate]

model = ChatOpenAI(api_key="X", base_url=PORTKEY_GATEWAY_URL, default_headers=portkey_headers, temperature=0)

# 构建 OpenAI 工具智能体
agent = create_openai_tools_agent(model, tools, prompt)

# 通过传入智能体和工具来创建智能体执行器
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

agent_executor.invoke({
    "input": "Take 3 to the fifth power and multiply that by thirty six, then square the result"
})
```

**您可以在 Portkey 仪表板上看到带有追踪 ID 的请求日志：**
![Portkey 上的 LangChain 智能体日志](https://assets.portkey.ai/docs/agent_tracing.gif)

其他文档可在此处获取：

- 可观测性 - [portkey.ai/docs/product/observability-modern-monitoring-for-llms](https://portkey.ai/docs/product/observability-modern-monitoring-for-llms)
- AI 网关 - [portkey.ai/docs/product/ai-gateway-streamline-llm-integrations](https://portkey.ai/docs/product/ai-gateway-streamline-llm-integrations)
- 提示词库 - [portkey.ai/docs/product/prompt-library](https://portkey.ai/docs/product/prompt-library)

您可以在此处查看我们流行的开源 AI 网关 - [github.com/portkey-ai/gateway](https://github.com/portkey-ai/gateway)

有关每个功能的详细信息以及如何使用，[请参阅 Portkey 文档](https://portkey.ai/docs)。如果您有任何问题或需要进一步帮助，[请在 Twitter 上联系我们](https://twitter.com/portkeyai) 或发送邮件至我们的[支持邮箱](mailto:hello@portkey.ai)。
