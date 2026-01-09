---
title: LangSmith 可观测性
sidebarTitle: Observability
---

在使用 LangChain 构建和运行智能体（agent）时，你需要了解其行为细节：它调用了哪些[工具](/oss/langchain/tools)、生成了什么提示（prompt）以及如何做出决策。使用 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 构建的 LangChain 智能体自动支持通过 [LangSmith](/langsmith/home) 进行追踪。LangSmith 是一个用于捕获、调试、评估和监控 LLM 应用行为的平台。

[_追踪记录_](/langsmith/observability-concepts#traces) 会记录智能体执行的每一步，从初始用户输入到最终响应，包括所有工具调用、模型交互和决策点。这些执行数据有助于你调试问题、评估不同输入下的性能，并监控生产环境中的使用模式。

本指南将向你展示如何为 LangChain 智能体启用追踪，并使用 LangSmith 分析其执行过程。

## 先决条件

开始之前，请确保满足以下条件：

- **LangSmith 账户**：在 [smith.langchain.com](https://smith.langchain.com) 注册（免费）或登录。
- **LangSmith API 密钥**：请遵循[创建 API 密钥](/langsmith/create-account-api-key#create-an-api-key)指南。

## 启用追踪

所有 LangChain 智能体都自动支持 LangSmith 追踪。要启用它，请设置以下环境变量：

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=<your-api-key>
```

## 快速开始

无需额外代码即可将追踪记录到 LangSmith。只需像往常一样运行你的智能体代码：

```python
from langchain.agents import create_agent

def send_email(to: str, subject: str, body: str):
    """Send an email to a recipient."""
    # ... email sending logic
    return f"Email sent to {to}"

def search_web(query: str):
    """Search the web for information."""
    # ... web search logic
    return f"Search results for: {query}"

agent = create_agent(
    model="gpt-4o",
    tools=[send_email, search_web],
    system_prompt="You are a helpful assistant that can send emails and search the web."
)

# Run the agent - all steps will be traced automatically
response = agent.invoke({
    "messages": [{"role": "user", "content": "Search for the latest AI news and email a summary to john@example.com"}]
})
```

默认情况下，追踪记录将记录到名为 `default` 的项目中。要配置自定义项目名称，请参阅[记录到项目](#log-to-a-project)。

<!--@include: @/snippets/python/oss/observability.md-->
