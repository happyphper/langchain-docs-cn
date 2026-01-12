---
title: Layerup 安全
---
[Layerup Security](https://uselayerup.com) 集成允许您保护对任何 LangChain LLM、LLM 链或 LLM 代理的调用。该 LLM 对象包装了任何现有的 LLM 对象，从而在您的用户和 LLM 之间提供了一个安全层。

虽然 Layerup Security 对象被设计为一个 LLM，但它本身实际上并不是一个 LLM，它只是包装了一个 LLM，使其能够适配底层 LLM 的相同功能。

## 设置
首先，您需要在 Layerup [网站](https://uselayerup.com) 上注册一个 Layerup Security 账户。

接下来，通过 [仪表板](https://dashboard.uselayerup.com) 创建一个项目，并复制您的 API 密钥。我们建议将您的 API 密钥放在项目的环境变量中。

安装 Layerup Security SDK：

::: code-group

```bash [pip]
pip install LayerupSecurity
```

```bash [uv]
uv add LayerupSecurity
```

:::

并安装 LangChain Community：

::: code-group

```bash [pip]
pip install langchain-community
```

```bash [uv]
uv add langchain-community
```

:::

现在，您就可以开始使用 Layerup Security 来保护您的 LLM 调用了！

```python
from langchain_community.llms.layerup_security import LayerupSecurity
from langchain_openai import OpenAI

# 创建您喜欢的 LLM 实例
openai = OpenAI(
    model_name="gpt-3.5-turbo",
    openai_api_key="OPENAI_API_KEY",
)

# 配置 Layerup Security
layerup_security = LayerupSecurity(
    # 指定 Layerup Security 将要包装的 LLM
    llm=openai,

    # Layerup API 密钥，来自 Layerup 仪表板
    layerup_api_key="LAYERUP_API_KEY",

    # 自定义基础 URL，如果是自托管
    layerup_api_base_url="https://api.uselayerup.com/v1",

    # 在调用 LLM 之前对提示词运行的护栏列表
    prompt_guardrails=[],

    # 对来自 LLM 的响应运行的护栏列表
    response_guardrails=["layerup.hallucination"],

    # 是否在将提示词发送给 LLM 之前，对其中的 PII 和敏感数据进行脱敏
    mask=False,

    # 用于滥用追踪、客户追踪和范围追踪的元数据。
    metadata={"customer": "example@uselayerup.com"},

    # 提示词护栏违规的处理程序
    handle_prompt_guardrail_violation=(
        lambda violation: {
            "role": "assistant",
            "content": (
                "There was sensitive data! I cannot respond. "
                "Here's a dynamic canned response. Current date: {}"
            ).format(datetime.now())
        }
        if violation["offending_guardrail"] == "layerup.sensitive_data"
        else None
    ),

    # 响应护栏违规的处理程序
    handle_response_guardrail_violation=(
        lambda violation: {
            "role": "assistant",
            "content": (
                "Custom canned response with dynamic data! "
                "The violation rule was {}."
            ).format(violation["offending_guardrail"])
        }
    ),
)

response = layerup_security.invoke(
    "Summarize this message: my name is Bob Dylan. My SSN is 123-45-6789."
)
```
