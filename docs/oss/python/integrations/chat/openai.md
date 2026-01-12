---
title: ChatOpenAI
description: '开始使用 LangChain 中的 OpenAI [聊天模型](/oss/langchain/models)。'
---
您可以在 [OpenAI Platform](https://platform.openai.com) 文档中找到有关 OpenAI 最新模型、其成本、上下文窗口和受支持输入类型的信息。

<Tip>

<strong>API 参考</strong>

有关所有功能和配置选项的详细文档，请前往 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> API 参考。

</Tip>

<Note>

<strong>Chat Completions API 兼容性</strong>

`ChatOpenAI` 与 OpenAI 的 [Chat Completions API](https://platform.openai.com/docs/api-reference/chat) 完全兼容。如果您希望连接到支持 Chat Completions API 的其他模型提供商，也可以实现 – 请参阅 [说明](/oss/python/integrations/chat#chat-completions-api)。

</Note>

## 概述

### 集成详情

| 类 | 包 | 可序列化 | JS/TS 支持 | 下载量 | 最新版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> | <a href="https://reference.langchain.com/python/integrations/langchain_openai" target="_blank" rel="noreferrer" class="link"><code>langchain-openai</code></a> | beta | ✅ [(npm)](https://js.langchain.com/docs/integrations/chat/openai) | <a href="https://pypi.org/project/langchain-openai/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-openai/month" alt="Downloads per month" /></a> | <a href="https://pypi.org/project/langchain-openai/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-openai?style=flat-square&label=%20&color=orange" alt="PyPI - Latest version" /></a> |

### 模型特性

| [工具调用](/oss/python/langchain/tools) | [结构化输出](/oss/python/langchain/structured-output) | 图像输入 | 音频输入 | 视频输入 | [令牌级流式传输](/oss/python/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/python/langchain/models#token-usage) | [对数概率](/oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

## 设置

要访问 OpenAI 模型，您需要安装 `langchain-openai` 集成包并获取一个 [OpenAI Platform](https://platform.openai.com) API 密钥。

### 安装

::: code-group

```bash [pip]
pip install -U langchain-openai
```

```bash [uv]
uv add langchain-openai
```

:::

### 凭证

前往 [OpenAI Platform](https://platform.openai.com/docs/api-reference/authentication) 注册并生成 API 密钥。完成后，在您的环境中设置 `OPENAI_API_KEY` 环境变量：

```python
import getpass
import os

if not os.environ.get("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")
```

如果您希望自动跟踪模型调用，还可以设置您的 [LangSmith](/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

## 实例化

现在我们可以实例化模型对象并生成响应：

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-5-nano",
    # stream_usage=True,
    # temperature=None,
    # max_tokens=None,
    # timeout=None,
    # reasoning_effort="low",
    # max_retries=2,
    # api_key="...",  # If you prefer to pass api key in directly
    # base_url="...",
    # organization="...",
    # other params...
)
```

有关可用模型参数的完整列表，请参阅 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> API 参考。

<Note>

<strong>令牌参数弃用</strong>

OpenAI 于 2024 年 9 月弃用了 `max_tokens`，转而支持 `max_completion_tokens`。虽然为了向后兼容仍支持 `max_tokens`，但它会在内部自动转换为 `max_completion_tokens`。

</Note>

---

## 调用

```python
messages = [
    (
        "system",
        "You are a helpful assistant that translates English to French. Translate the user sentence.",
    ),
    ("human", "I love programming."),
]
ai_msg = llm.invoke(messages)
ai_msg
```

```text
AIMessage(content="J'adore la programmation.", additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 5, 'prompt_tokens': 31, 'total_tokens': 36}, 'model_name': 'gpt-4o-2024-05-13', 'system_fingerprint': 'fp_3aa7262c27', 'finish_reason': 'stop', 'logprobs': None}, id='run-63219b22-03e3-4561-8cc4-78b7c7c3a3ca-0', usage_metadata={'input_tokens': 31, 'output_tokens': 5, 'total_tokens': 36})
```

```python
print(ai_msg.text)
```

```text
J'adore la programmation.
```

---

## 流式使用元数据

OpenAI 的 Chat Completions API 默认不流式传输令牌使用统计信息（请参阅此处的 [API 参考](https://platform.openai.com/docs/api-reference/completions/create#completions-create-stream_options)）。

要在使用 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 或 `AzureChatOpenAI` 进行流式传输时恢复令牌计数，请将 `stream_usage=True` 设置为初始化参数或在调用时设置：

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4.1-mini", stream_usage=True)  # [!code highlight]
```

---

## 与 Azure OpenAI 一起使用

<Info>

<strong>Azure OpenAI v1 API 支持</strong>

从 `langchain-openai>=1.0.1` 开始，`ChatOpenAI` 可以使用新的 [v1 API](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/api-version-lifecycle?tabs=python#next-generation-api-1) 直接与 Azure OpenAI 端点一起使用。这提供了一种统一的方式来使用 OpenAI 模型，无论其托管在 OpenAI 还是 Azure 上。

对于传统的 Azure 特定实现，请继续使用 [`AzureChatOpenAI`](/oss/python/integrations/chat/azure_chat_openai/)。

</Info>

:::: details 使用 API 密钥配合 Azure OpenAI v1 API

要将 `ChatOpenAI` 与 Azure OpenAI 一起使用，请将 `base_url` 设置为您的 Azure 端点并附加 `/openai/v1/`：

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-5-mini",  # Your Azure deployment name
    base_url="https://{your-resource-name}.openai.azure.com/openai/v1/",
    api_key="your-azure-api-key"
)

response = llm.invoke("Hello, how are you?")
print(response.content)
```

::::

:::: details 使用 Microsoft Entra ID 配合 Azure OpenAI

v1 API 新增了对 [Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/managed-identity)（原 Azure AD）身份验证的原生支持，并支持自动令牌刷新。将一个令牌提供者可调用对象传递给 `api_key` 参数：

```python
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from langchain_openai import ChatOpenAI

# Create a token provider that handles automatic refresh
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)

llm = ChatOpenAI(
    model="gpt-5-mini",  # Your Azure deployment name
    base_url="https://{your-resource-name}.openai.azure.com/openai/v1/",
    api_key=token_provider  # Callable that handles token refresh
)

# Use the model as normal
messages = [
    ("system", "You are a helpful assistant."),
    ("human", "Translate 'I love programming' to French.")
]
response = llm.invoke(messages)
print(response.content)
```

令牌提供者是一个可调用对象，可自动检索和刷新身份验证令牌，无需手动管理令牌过期。

<Tip>

<strong>安装要求</strong>

要使用 Microsoft Entra ID 身份验证，请安装 Azure Identity 库：

```bash
pip install azure-identity
```

</Tip>

您也可以在异步函数中使用时，将令牌提供者可调用对象传递给 `api_key` 参数。您必须从 `azure.identity.aio` 导入 DefaultAzureCredential：

```python
from azure.identity.aio import DefaultAzureCredential
from langchain_openai import ChatOpenAI

credential = DefaultAzureCredential()

llm_async = ChatOpenAI(
    model="gpt-5-nano",
    api_key=credential
)

# Use async methods when using async callable
response = await llm_async.ainvoke("Hello!")
```

<Note>

当使用异步可调用对象作为 API 密钥时，您必须使用异步方法（`ainvoke`、`astream` 等）。同步方法将引发错误。

</Note>

::::

---

## 工具调用

OpenAI 有一个 [工具调用](https://platform.openai.com/docs/guides/function-calling)（此处我们交替使用“工具调用”和“函数调用”）API，允许您描述工具及其参数，并让模型返回一个 JSON 对象，其中包含要调用的工具及其输入。工具调用对于构建使用工具的链和智能体，以及更普遍地从模型获取结构化输出非常有用。

### 绑定工具

使用 `ChatOpenAI.bind_tools`，我们可以轻松地将 Pydantic 类、字典模式、LangChain 工具甚至函数作为工具传递给模型。在底层，这些被转换为 OpenAI 工具模式，如下所示：

```
{
    "name": "...",
    "description": "...",
    "parameters": {...}  # JSONSchema
}
```

...并在每次模型调用中传递。

```python
from pydantic import BaseModel, Field

class GetWeather(BaseModel):
    """Get the current weather in a given location"""

    location: str = Field(..., description="The city and state, e.g. San Francisco, CA")

llm_with_tools = llm.bind_tools([GetWeather])
```

```python
ai_msg = llm_with_tools.invoke(
    "what is the weather like in San Francisco",
)
ai_msg
```

```text
AIMessage(content='', additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 17, 'prompt_tokens': 68, 'total_tokens': 85}, 'model_name': 'gpt-4o-2024-05-13', 'system_fingerprint': 'fp_3aa7262c27', 'finish_reason': 'tool_calls', 'logprobs': None}, id='run-1617c9b2-dda5-4120-996b-0333ed5992e2-0', tool_calls=[{'name': 'GetWeather', 'args': {'location': 'San Francisco, CA'}, 'id': 'call_o9udf3EVOWiV4Iupktpbpofk', 'type': 'tool_call'}], usage_metadata={'input_tokens': 68, 'output_tokens': 17, 'total_tokens': 85})
```

### 严格模式

<Info>

<strong>需要 `langchain-openai>=0.1.21`</strong>

</Info>

自 2024 年 8 月 6 日起，OpenAI 在调用工具时支持 `strict` 参数，该参数将强制模型遵守工具参数模式。[了解更多](https://platform.openai.com/docs/guides/function-calling)。

<Note>

如果 `strict=True`，工具定义也将被验证，并且只接受 JSON 模式的子集。关键的是，模式不能有可选参数（那些有默认值的参数）。

阅读 [完整文档](https://platform.openai.com/docs/guides/structured-outputs/supported-schemas) 了解支持哪些类型的模式。

</Note>

```python
llm_with_tools = llm.bind_tools([GetWeather], strict=True)
ai_msg = llm_with_tools.invoke(
    "what is the weather like in San Francisco",
)
ai_msg
```

```text
AIMessage(content='', additional_kwargs={'tool_calls': [{'id': 'call_jUqhd8wzAIzInTJl72Rla8ht', 'function': {'arguments': '{"location":"San Francisco, CA"}', 'name': 'GetWeather'}, 'type': 'function'}], 'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 17, 'prompt_tokens': 68, 'total_tokens': 85}, 'model_name': 'gpt-4o-2024-05-13', 'system_fingerprint': 'fp_3aa7262c27', 'finish_reason': 'tool_calls', 'logprobs': None}, id='run-5e3356a9-132d-4623-8e73-dd5a898cf4a6-0', tool_calls=[{'name': 'GetWeather', 'args': {'location': 'San Francisco, CA'}, 'id': 'call_jUqhd8wzAIzInTJl72Rla8ht', 'type': 'tool_call'}], usage_metadata={'input_tokens': 68, 'output_tokens': 17, 'total_tokens': 85})
```

### 工具调用

请注意，AIMessage 有一个 `tool_calls` 属性。这包含一个标准化的 ToolCall 格式，该格式与模型提供商无关。

```python
ai_msg.tool_calls
```

```text
[{'name': 'GetWeather',
  'args': {'location': 'San Francisco, CA'},
  'id': 'call_jUqhd8wzAIzInTJl72Rla8ht',
  'type': 'tool_call'}]
```

有关绑定工具和工具调用输出的更多信息，请前往 [工具调用](/oss/python/langchain/tools) 文档。

### 结构化输出和工具调用

OpenAI 的 [结构化输出](https://platform.openai.com/docs/guides/structured-outputs) 功能可以与工具调用同时使用。模型将生成工具调用或符合所需模式的响应。请参见下面的示例：

```python
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

def get_weather(location: str) -> None:
    """Get weather at a location."""
    return "It's sunny."

class OutputSchema(BaseModel):
    """Schema for response."""

    answer: str
    justification: str

llm = ChatOpenAI(model="gpt-4.1")

structured_llm = llm.bind_tools(
    [get_weather],
    response_format=OutputSchema,
    strict=True,
)

# Response contains tool calls:
tool_call_response = structured_llm.invoke("What is the weather in SF?")

# structured_response.additional_kwargs["parsed"] contains parsed output
structured_response = structured_llm.invoke(
    "What weighs more, a pound of feathers or a pound of gold?"
)
```

### 自定义工具

<Info>

<strong>需要 `langchain-openai>=0.3.29`</strong>

</Info>

[自定义工具](https://platform.openai.com/docs/guides/function-calling#custom-tools) 支持具有任意字符串输入的工具。当您期望字符串参数很长或很复杂时，它们可能特别有用。

```python
from langchain_openai import ChatOpenAI, custom_tool
from langchain.agents import create_agent

@custom_tool
def execute_code(code: str) -> str:
    """Execute python code."""
    return "27"

llm = ChatOpenAI(model="gpt-5", use_responses_api=True)

agent = create_agent(llm, [execute_code])

input_message = {"role": "user", "content": "Use the tool to calculate 3^3."}
for step in agent.stream(
    {"messages": [input_message]},
    stream_mode="values",
):
    step["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

Use the tool to calculate 3^3.
================================== Ai Message ==================================

[{'id': 'rs_68b7336cb72081a080da70bf5e980e4e0d6082d28f91357a', 'summary': [], 'type': 'reasoning'}, {'call_id': 'call_qyKsJ4XlGRudbIJDrXVA2nQa', 'input': 'print(3**3)', 'name': 'execute_code', 'type': 'custom_tool_call', 'id': 'ctc_68b7336f718481a0b39584cd35fbaa5d0d6082d28f91357a', 'status': 'completed'}]
Tool Calls:
  execute_code (call_qyKsJ4XlGRudbIJDrXVA2nQa)
 Call ID: call_qyKsJ4XlGRudbIJDrXVA2nQa
  Args:
    __arg1: print(3**3)
================================= Tool Message =================================
Name: execute_code

[{'type': 'custom_tool_call_output', 'output': '27'}]
================================== Ai Message ==================================

[{'type': 'text', 'text': '27', 'annotations': [], 'id': 'msg_68b73371e9e081a0927f54f88f2cd7a20d6082d28f91357a'}]
```

:::: details 上下文无关文法

OpenAI 支持以 `lark` 或 `regex` 格式为自定义工具输入指定 [上下文无关文法](https://platform.openai.com/docs/guides/function-calling#context-free-grammars)。详情请参阅 [OpenAI 文档](https://platform.openai.com/docs/guides/function-calling#context-free-grammars)。`format` 参数可以传递给 `@custom_tool`，如下所示：

```python
from langchain_openai import ChatOpenAI, custom_tool
from langchain.agents import create_agent

grammar = """
start: expr
expr: term (SP ADD SP term)* -> add
| term
term: factor (SP MUL SP factor)* -> mul
| factor
factor: INT
SP: " "
ADD: "+"
MUL: "*"
%import common.INT
"""

format_ = {"type": "grammar", "syntax": "lark", "definition": grammar}

@custom_tool(format=format_)  # [!code highlight]
def do_math(input_string: str) -> str:
    """Do a mathematical operation."""
    return "27"

llm = ChatOpenAI(model="gpt-5", use_responses_api=True)

agent = create_agent(llm, [do_math])

input_message = {"role": "user", "content": "Use the tool to calculate 3^3."}
for step in agent.stream(
    {"messages": [input_message]},
    stream_mode="values",
):
    step["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

Use the tool to calculate 3^3.
================================== Ai Message ==================================

[{'id': 'rs_68b733f066a48194a41001c0cc1081760811f11b6f4bae47', 'summary': [], 'type': 'reasoning'}, {'call_id': 'call_7hTYtlTj9NgWyw8AQGqETtV9', 'input': '3 * 3 * 3', 'name': 'do_math', 'type': 'custom_tool_call', 'id': 'ctc_68b733f3a0a08194968b8338d33ad89f0811f11b6f4bae47', 'status': 'completed'}]
Tool Calls:
  do_math (call_7hTYtlTj9NgWyw8AQGqETtV9)
 Call ID: call_7hTYtlTj9NgWyw8AQGqETtV9
  Args:
    __arg1: 3 * 3 * 3
================================= Tool Message =================================
Name: do_math

[{'type': 'custom_tool_call_output', 'output': '27'}]
================================== Ai Message ==================================

[{'type': 'text', 'text': '27', 'annotations': [], 'id': 'msg_68b733f4bb008194937130796372bd0f0811f11b6f4bae47'}]
```

::::

---

## Responses API

<Info>

<strong>需要 `langchain-openai>=0.3.9`</strong>

</Info>

OpenAI 支持一个面向构建 [智能体](/oss/python/langchain/agents) 应用程序的 [Responses](https://platform.openai.com/docs/guides/responses-vs-chat-completions) API。它包括一套 [内置工具](https://platform.openai.com/docs/guides/tools?api-mode=responses)，包括网络和文件搜索。它还支持管理 [对话状态](https://platform.openai.com/docs/guides/conversation-state?api-mode=responses)，允许您继续对话线程而无需显式传递先前的消息，以及 [推理过程](https://platform.openai.com/docs/guides/reasoning?api-mode=responses) 的输出。

如果使用了这些功能之一，<a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 将路由到 Responses API。您也可以在实例化 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 时指定 `use_responses_api=True`。

### 网络搜索

要触发网络搜索，请将 `{"type": "web_search_preview"}` 像传递其他工具一样传递给模型。

<Tip>

<strong>您也可以将内置工具作为调用参数传递：</strong>

```python
llm.invoke("...", tools=[{"type": "web_search_preview"}])
```

</Tip>

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4.1-mini")

tool = {"type": "web_search_preview"}
llm_with_tools = llm.bind_tools([tool])

response = llm_with_tools.invoke("What was a positive news story from today?")
```

请注意，响应包含结构化的 [内容块](/oss/python/langchain/messages/#message-content)，其中既包含响应的文本，也包含 OpenAI 引用其来源的 [注释](https://platform.openai.com/docs/guides/tools-web-search?api-mode=responses#output-and-citations)。输出消息还将包含来自任何工具调用的信息：

```python
response.content_blocks
```

```text
[{'type': 'server_tool_call',
  'name': 'web_search',
  'args': {'query': 'positive news stories today', 'type': 'search'},
  'id': 'ws_68cd6f8d72e4819591dab080f4b0c340080067ad5ea8144a'},
 {'type': 'server_tool_result',
  'tool_call_id': 'ws_68cd6f8d72e4819591dab080f4b0c340080067ad5ea8144a',
  'status': 'success'},
 {'type': 'text',
  'text': 'Here are some positive news stories from today...',
  'annotations': [{'end_index': 410,
    'start_index': 337,
    'title': 'Positive News | Real Stories. Real Positive Impact',
    'type': 'citation',
    'url': 'https://www.positivenews.press/?utm_source=openai'},
   {'end_index': 969,
    'start_index': 798,
    'title': "From Green Innovation to Community Triumphs: Uplifting US Stories Lighting Up September 2025 | That's Great News",
    'type': 'citation',
    'url': 'https://info.thatsgreatnews.com/from-green-innovation-to-community-triumphs-uplifting-us-stories-lighting-up-september-2025/?utm_source=openai'},
  'id': 'msg_68cd6f8e8d448195a807b89f483a1277080067ad5ea8144a'}]
```

<Tip>

<strong>您可以通过使用 `response.text` 仅恢复响应的文本内容作为字符串。例如，要流式传输响应文本：</strong>

```python
for token in llm_with_tools.stream("..."):
    print(token.text, end="|")
```

有关更多详细信息，请参阅 [流式传输指南](/oss/python/langchain/streaming/)。

</Tip>

### 图像生成

<Info>

<strong>需要 `langchain-openai>=0.3.19`</strong>

</Info>

要触发图像生成，请将 `{"type": "image_generation"}` 像传递其他工具一样传递给模型。

<Tip>

您也可以将内置工具作为调用参数传递：

```python
llm.invoke("...", tools=[{"type": "image_generation"}])
```

</Tip>

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4.1-mini")

tool = {"type": "image_generation", "quality": "low"}

llm_with_tools = llm.bind_tools([tool])

ai_message = llm_with_tools.invoke(
    "Draw a picture of a cute fuzzy cat with an umbrella"
)
```

```python
import base64

from IPython.display import Image

image = next(
    item for item in ai_message.content_blocks if item["type"] == "image"
)
Image(base64.b64decode(image["base64"]), width=200)
```

<p>
    <img src="/images/cat.png" alt="" />
</p>

### 文件搜索

要触发文件搜索，请将 [文件搜索工具](https://platform.openai.com/docs/guides/tools-file-search) 像传递其他工具一样传递给模型。您需要填充一个 OpenAI 管理的向量存储，并在工具定义中包含向量存储 ID。详情请参阅 [OpenAI 文档](https://platform.openai.com/docs/guides/tools-file-search)。

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4.1-mini",
    include=["file_search_call.results"],  # optionally include search results
)

openai_vector_store_ids = [
    "vs_...",  # your IDs here
]

tool = {
    "type": "file_search",
    "vector_store_ids": openai_vector_store_ids,
}
llm_with_tools = llm.bind_tools([tool])

response = llm_with_tools.invoke("What is deep research by OpenAI?")
print(response.text)
```

```text
Deep Research by OpenAI is...
```

与 [网络搜索](#web-search) 一样，响应将包含带有引用的内容块：

```python
[block["type"] for block in response.content_blocks]
```

```python
['server_tool_call', 'server_tool_result', 'text']
```

```python
text_block = next(block for block in response.content_blocks if block["type"] == "text")

text_block["annotations"][:2]
```

```text
[{'type': 'citation',
  'title': 'deep_research_blog.pdf',
  'extras': {'file_id': 'file-3UzgX7jcC8Dt9ZAFzywg5k', 'index': 2712}},
 {'type': 'citation',
  'title': 'deep_research_blog.pdf',
  'extras': {'file_id': 'file-3UzgX7jcC8Dt9ZAFzywg5k', 'index': 2712}}]
```

它还将包含来自内置工具调用的信息：

```python
response.content_blocks[0]
```

```text
{'type': 'server_tool_call',
 'name': 'file_search',
 'id': 'fs_68cd704c191c81959281b3b2ec6b139908f8f7fb31b1123c',
 'args': {'queries': ['deep research by OpenAI']}}
```

### 计算机使用

<a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 支持 `"computer-use-preview"` 模型，这是一个专门用于内置计算机使用工具的模型。要启用，请像传递其他工具一样传递一个 [计算机使用工具](https://platform.openai.com/docs/guides/tools-computer-use)。

目前，计算机使用的工具输出存在于消息的 `content` 字段中。要回复计算机使用工具调用，请构造一个 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>，在其 `additional_kwargs` 中包含 `{"type": "computer_call_output"}`。消息的内容将是一个屏幕截图。下面，我们演示一个简单的示例。

首先，加载两个屏幕截图：

```python
import base64

def load_png_as_base64(file_path):
    with open(file_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
        return encoded_string.decode("utf-8")

screenshot_1_base64 = load_png_as_base64(
    "/path/to/screenshot_1.png"
)  # perhaps a screenshot of an application
screenshot_2_base64 = load_png_as_base64(
    "/path/to/screenshot_2.png"
)  # perhaps a screenshot of the Desktop
```

```python
from langchain_openai import ChatOpenAI

# Initialize model
llm = ChatOpenAI(model="computer-use-preview", truncation="auto")

# Bind computer-use tool
tool = {
    "type": "computer_use_preview",
    "display_width": 1024,
    "display_height": 768,
    "environment": "browser",
}
llm_with_tools = llm.bind_tools([tool])

# Construct input message
input_message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": (
                "Click the red X to close and reveal my Desktop. "
                "Proceed, no confirmation needed."
            ),
        },
        {
            "type": "input_image",
            "image_url": f"data:image/png;base64,{screenshot_1_base64}",
        },
    ],
}

# Invoke model
response = llm_with_tools.invoke(
    [input_message],
    reasoning={
        "generate_summary": "concise",
    },
)
```

响应将在其 `content` 中包含对计算机使用工具的调用：

```python
response.content
```

```text
[{'id': 'rs_685da051742c81a1bb35ce46a9f3f53406b50b8696b0f590',
  'summary': [{'text': "Clicking red 'X' to show desktop",
    'type': 'summary_text'}],
  'type': 'reasoning'},
 {'id': 'cu_685da054302481a1b2cc43b56e0b381706b50b8696b0f590',
  'action': {'button': 'left', 'type': 'click', 'x': 14, 'y': 38},
  'call_id': 'call_zmQerFBh4PbBE8mQoQHkfkwy',
  'pending_safety_checks': [],
  'status': 'completed',
  'type': 'computer_call'}]
```

接下来，我们构造一个具有以下属性的 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>：

1.  它有一个与计算机调用中的 `call_id` 匹配的 `tool_call_id`。
2.  它的 `additional_kwargs` 中包含 `{"type": "computer_call_output"}`。
3.  它的内容是 `image_url` 或 `input_image` 输出块（有关格式，请参阅 [OpenAI 文档](https://platform.openai.com/docs/guides/tools-computer-use#5-repeat)）。

```python
from langchain.messages import ToolMessage

tool_call_id = next(
    item["call_id"] for item in response.content if item["type"] == "computer_call"
)

tool_message = ToolMessage(
    content=[
        {
            "type": "input_image",
            "image_url": f"data:image/png;base64,{screenshot_2_base64}",
        }
    ],
    # content=f"data:image/png;base64,{screenshot_2_base64}",  # <-- also acceptable
    tool_call_id=tool_call_id,
    additional_kwargs={"type": "computer_call_output"},
)
```

现在我们可以使用消息历史记录再次调用模型：

```python
messages = [
    input_message,
    response,
    tool_message,
]

response_2 = llm_with_tools.invoke(
    messages,
    reasoning={
        "generate_summary": "concise",
    },
)
```

```python
response_2.text
```

```text
'VS Code has been closed, and the desktop is now visible.'
```

除了传回整个序列，我们也可以使用 [`previous_response_id`](#passing-previous_response_id)：

```python
previous_response_id = response.response_metadata["id"]

response_2 = llm_with_tools.invoke(
    [tool_message],
    previous_response_id=previous_response_id,
    reasoning={
        "generate_summary": "concise",
    },
)
```

```python
response_2.text
```

```text
'The VS Code window is closed, and the desktop is now visible. Let me know if you need any further assistance.'
```

### 代码解释器

OpenAI 实现了一个 [代码解释器](https://platform.openai.com/docs/guides/tools-code-interpreter) 工具，以支持沙盒化代码的生成和执行。

```python [Example use]
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4.1-mini",
    include=["code_interpreter_call.outputs"],  # optionally include outputs
)

llm_with_tools = llm.bind_tools(
    [
        {
            "type": "code_interpreter",
            # Create a new container
            "container": {"type": "auto"},
        }
    ]
)
response = llm_with_tools.invoke(
    "Write and run code to answer the question: what is 3^3?"
)
```

请注意，上述命令创建了一个新容器。我们也可以指定一个现有的容器 ID：

```python
code_interpreter_calls = [
    item for item in response.content if item["type"] == "code_interpreter_call"
]
assert len(code_interpreter_calls) == 1
container_id = code_interpreter_calls[0]["extras"]["container_id"]  # [!code highlight]

llm_with_tools = llm.bind_tools(
    [
        {
            "type": "code_interpreter",
            # Use an existing container
            "container": container_id,  # [!code highlight]
        }
    ]
)
```

### 远程 MCP

OpenAI 实现了一个 [远程 MCP](https://platform.openai.com/docs/guides/tools-remote-mcp) 工具，允许模型生成的调用连接到 MCP 服务器。

```python [Example use]
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4.1-mini")

llm_with_tools = llm.bind_tools(
    [
        {
            "type": "mcp",
            "server_label": "deepwiki",
            "server_url": "https://mcp.deepwiki.com/mcp",
            "require_approval": "never",
        }
    ]
)
response = llm_with_tools.invoke(
    "What transport protocols does the 2025-03-26 version of the MCP "
    "spec (modelcontextprotocol/modelcontextprotocol) support?"
)
```

:::: details MCP 审批

OpenAI 有时会在与远程 MCP 服务器共享数据之前请求批准。

在上面的命令中，我们指示模型永远不需要批准。我们也可以配置模型始终请求批准，或始终为特定工具请求批准：

```python
llm_with_tools = llm.bind_tools(
    [
        {
            "type": "mcp",
            "server_label": "deepwiki",
            "server_url": "https://mcp.deepwiki.com/mcp",
            "require_approval": {
                "always": {
                    "tool_names": ["read_wiki_structure"]
                }
            }
        }
    ]
)
response = llm_with_tools.invoke(
    "What transport protocols does the 2025-03-26 version of the MCP "
    "spec (modelcontextprotocol/modelcontextprotocol) support?"
)
```

响应随后可能包含类型为 `"mcp_approval_request"` 的块。

要为批准请求提交批准，请将其结构化为输入消息中的内容块：

```python
approval_message = {
    "role": "user",
    "content": [
        {
            "type": "mcp_approval_response",
            "approve": True,
            "approval_request_id": block["id"],
        }
        for block in response.content
        if block["type"] == "mcp_approval_request"
    ]
}

next_response = llm_with_tools.invoke(
    [approval_message],
    # continue existing thread
    previous_response_id=response.response_metadata["id"]
)
```

::::

### 管理对话状态

Responses API 支持管理 [对话状态](https://platform.openai.com/docs/guides/conversation-state?api-mode=responses)。

#### 手动管理状态

您可以像使用其他聊天模型一样，手动或使用 [LangGraph](/oss/python/langgraph/quickstart) 来管理状态：

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4.1-mini", use_responses_api=True)

first_query = "Hi, I'm Bob."
messages = [{"role": "user", "content": first_query}]

response = llm.invoke(messages)
print(response.text)
```

```text
Hi Bob! Nice to meet you. How can I assist you today?
```

```python
second_query = "What is my name?"

messages.extend(
    [
        response,
        {"role": "user", "content": second_query},
    ]
)
second_response = llm.invoke(messages)
print(second_response.text)
```

```text
You mentioned that your name is Bob. How can I assist you further, Bob?
```

<Tip>

<strong>您可以使用 [LangGraph](https://langchain-ai.github.io/langgraph/) 在各种后端（包括内存中和 Postgres）为您管理对话线程。请参阅 [本教程](/oss/python/langgraph/quickstart) 开始使用。</strong>

</Tip>

#### 传递 `previous_response_id`

使用 Responses API 时，LangChain 消息将在其元数据中包含一个 `"id"` 字段。将此 ID 传递给后续调用将继续对话。请注意，从计费角度来看，这与 [手动传递消息](https://platform.openai.com/docs/guides/conversation-state?api-mode=responses#openai-apis-for-conversation-state) 是等效的。

```python
second_response = llm.invoke(
    "What is my name?",
    previous_response_id=response.id,  # [!code highlight]
)
print(second_response.text)
```

```text
Your name is Bob. How can I help you today, Bob?
```

ChatOpenAI 也可以使用消息序列中的最后一个响应自动指定 `previous_response_id`：

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4.1-mini",
    use_previous_response_id=True,  # [!code highlight]
)
```

如果我们设置 `use_previous_response_id=True`，请求负载中直到最近一次响应之前的输入消息将被丢弃，并且 `previous_response_id` 将使用最近一次响应的 ID 来设置。

也就是说，

```python
llm.invoke(
    [
        HumanMessage("Hello"),
        AIMessage("Hi there!", id="resp_123"),
        HumanMessage("How are you?"),
    ]
)
```

...等同于：

```python
llm.invoke([HumanMessage("How are you?")], previous_response_id="resp_123")
```

### 推理输出

一些 OpenAI 模型会生成单独的文本内容来说明其推理过程。详情请参阅 OpenAI 的 [推理文档](https://platform.openai.com/docs/guides/reasoning?api-mode=responses)。

OpenAI 可以返回模型推理的摘要（尽管它不公开原始的推理标记）。要配置 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 以返回此摘要，请指定 `reasoning` 参数。如果设置了此参数，<a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 将自动路由到 Responses API。

```python
from langchain_openai import ChatOpenAI

reasoning = {
    "effort": "medium",  # 'low', 'medium', or 'high'
    "summary": "auto",  # 'detailed', 'auto', or None
}

llm = ChatOpenAI(model="gpt-5-nano", reasoning=reasoning)
response = llm.invoke("What is 3^3?")

# Output
response.text
```

```text
'3³ = 3 × 3 × 3 = 27.'
```

```python
# Reasoning
for block in response.content_blocks:
    if block["type"] == "reasoning":
        print(block["reasoning"])
```

```text
**Calculating the power of three**

The user is asking about 3 raised to the power of 3. That's a pretty simple calculation! I know that 3^3 equals 27, so I can say, "3 to the power of 3 equals 27." I might also include a quick explanation that it's 3 multiplied by itself three times: 3 × 3 × 3 = 27. So, the answer is definitely 27.
```

<Tip>

<strong>故障排除：推理模型返回空响应</strong>

如果您从 `gpt-5-nano` 等推理模型获得空响应，这很可能是由于严格的标记限制造成的。模型使用标记进行内部推理，可能没有剩余的标记用于最终输出。

请确保 `max_tokens` 设置为 `None` 或增加标记限制，以便为推理和输出生成提供足够的标记。

</Tip>

---

## 微调

您可以通过传入相应的 `modelName` 参数来调用经过微调的 OpenAI 模型。

这通常采用 `ft:{OPENAI_MODEL_NAME}:{ORG_NAME}::{MODEL_ID}` 的形式。例如：

```python
fine_tuned_model = ChatOpenAI(
    temperature=0, model_name="ft:gpt-3.5-turbo-0613:langchain::7qTVM5AR"
)

fine_tuned_model.invoke(messages)
```

```text
AIMessage(content="J'adore la programmation.", additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 8, 'prompt_tokens': 31, 'total_tokens': 39}, 'model_name': 'ft:gpt-3.5-turbo-0613:langchain::7qTVM5AR', 'system_fingerprint': None, 'finish_reason': 'stop', 'logprobs': None}, id='run-0f39b30e-c56e-4f3b-af99-5c948c984146-0', usage_metadata={'input_tokens': 31, 'output_tokens': 8, 'total_tokens': 39})
```

---

## 多模态输入（图像、PDF、音频）

OpenAI 拥有支持多模态输入的模型。您可以将图像、PDF 或音频传递给这些模型。有关如何在 LangChain 中执行此操作的更多信息，请参阅 [多模态输入](/oss/python/langchain/messages#multimodal) 文档。

您可以在 [OpenAI 的文档](https://platform.openai.com/docs/models) 中查看支持不同模态的模型列表。

对于所有模态，LangChain 既支持其跨提供商的标准化格式，也支持 OpenAI 的原生内容块格式。

要将多模态数据传入 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a>，请创建一个包含数据的 [内容块](/oss/python/langchain/messages/)，并将其合并到消息中，例如，如下所示：

```python
message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            # Update prompt as desired
            "text": "Describe the (image / PDF / audio...)",
        },
        content_block,  # [!code highlight]
    ],
}
```

有关内容块的示例，请参见下文。

:::: details 图像

请参阅此处操作指南中的示例 [这里](/oss/python/langchain/messages#multimodal)。

```python [URLs]
# LangChain format
content_block = {
    "type": "image",
    "url": url_string,
}

# OpenAI Chat Completions format
content_block = {
    "type": "image_url",
    "image_url": {"url": url_string},
}
```

```python [In-line base64 data]
# LangChain format
content_block = {
    "type": "image",
    "base64": base64_string,
    "mime_type": "image/jpeg",
}

# OpenAI Chat Completions format
content_block = {
    "type": "image_url",
    "image_url": {
        "url": f"data:image/jpeg;base64,{base64_string}",
    },
}
```

::::

:::: details PDF

注意：OpenAI 要求为 PDF 输入指定文件名。使用 LangChain 格式时，请包含 `filename` 键。

在此处阅读更多信息 [这里](/oss/python/langchain/messages#multimodal#example-openai-file-names)。

请参阅此处操作指南中的示例 [这里](/oss/python/langchain/messages#multimodal#documents-pdf)。

```python [In-line base64 data]
# LangChain format
content_block = {
    "type": "file",
    "base64": base64_string,
    "mime_type": "application/pdf",
    "filename": "my-file.pdf",  # [!code highlight]
}

# OpenAI Chat Completions format
content_block = {
    "type": "file",
    "file": {
        "filename": "my-file.pdf",
        "file_data": f"data:application/pdf;base64,{base64_string}",
    }
}
```

::::

:::: details 音频

请参阅 [支持的模型](https://platform.openai.com/docs/models)，例如 `"gpt-4o-audio-preview"`。

请参阅此处操作指南中的示例 [这里](/oss/python/langchain/messages#multimodal#audio)。

```python [In-line base64 data]
# LangChain format
content_block = {
    "type": "audio",
    "mime_type": "audio/wav",  # or appropriate mime-type
    "base64": base64_string,
}

# OpenAI Chat Completions format
content_block = {
    "type": "input_audio",
    "input_audio": {"data": base64_string, "format": "wav"},
}
```

::::

---

## 预测输出

<Info>

<strong>需要 `langchain-openai>=0.2.6`</strong>

</Info>

一些 OpenAI 模型（例如其 `gpt-4o` 和 `gpt-4o-mini` 系列）支持 [预测输出](https://platform.openai.com/docs/guides/latency-optimization#use-predicted-outputs)，这允许您提前传入 LLM 预期输出的已知部分以减少延迟。这对于编辑文本或代码等情况非常有用，因为只有模型输出的一小部分会发生变化。

以下是一个示例：

```python
code = """
/// <summary>
/// Represents a user with a first name, last name, and username.
/// </summary>
public class User
{
    /// <summary>
    /// Gets or sets the user's first name.
    /// </summary>
    public string FirstName { get; set; }

    /// <summary>
    /// Gets or sets the user's last name.
    /// </summary>
    public string LastName { get; set; }

    /// <summary>
    /// Gets or sets the user's username.
    /// </summary>
    public string Username { get; set; }
}
"""

llm = ChatOpenAI(model="gpt-4o")
query = (
    "Replace the Username property with an Email property. "
    "Respond only with code, and with no markdown formatting."
)
response = llm.invoke(
    [{"role": "user", "content": query}, {"role": "user", "content": code}],
    prediction={"type": "content", "content": code},
)
print(response.content)
print(response.response_metadata)
```

```python
/// <summary>
/// Represents a user with a first name, last name, and email.
/// </summary>
public class User
{
    /// <summary>
    /// Gets or sets the user's first name.
    /// </summary>
    public string FirstName { get; set; }

    /// <summary>
    /// Gets or sets the user's last name.
    /// </summary>
    public string LastName { get; set; }

    /// <summary>
    /// Gets or sets the user's email.
    /// </summary>
    public string Email { get; set; }
}
{'token_usage': {'completion_tokens': 226, 'prompt_tokens': 166, 'total_tokens': 392, 'completion_tokens_details': {'accepted_prediction_tokens': 49, 'audio_tokens': None, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 107}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}}, 'model_name': 'gpt-4o-2024-08-06', 'system_fingerprint': 'fp_45cf54deae', 'finish_reason': 'stop', 'logprobs': None}
```

<Note>

预测会作为额外的标记计费，可能会增加您的使用量和成本，以换取这种延迟的减少。

</Note>

## 音频生成（预览版）

<Info>

需要 `langchain-openai>=0.2.3`

</Info>

OpenAI 有一个新的 [音频生成功能](https://platform.openai.com/docs/guides/audio?audio-generation-quickstart-example=audio-out)，允许您将音频输入和输出与 `gpt-4o-audio-preview` 模型一起使用。

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o-audio-preview",
    temperature=0,
    model_kwargs={
        "modalities": ["text", "audio"],
        "audio": {"voice": "alloy", "format": "wav"},
    },
)

output_message = llm.invoke(
    [
        ("human", "Are you made by OpenAI? Just answer yes or no"),
    ]
)
```

`output_message.additional_kwargs['audio']` 将包含一个类似以下的字典：

```python
{
    'data': '<audio data b64-encoded',
    'expires_at': 1729268602,
    'id': 'audio_67127d6a44348190af62c1530ef0955a',
    'transcript': 'Yes.'
}
```

...并且格式将是 `model_kwargs['audio']['format']` 中传入的格式。

我们也可以在 openai 的 `expires_at` 到期之前，将此包含音频数据的消息作为消息历史的一部分传回给模型。

<Note>

<strong>输出音频存储在 `AIMessage.additional_kwargs` 的 `audio` 键下，但输入内容块在 `HumanMessage.content` 列表中是用 `input_audio` 类型和键来键入的。</strong>

更多信息，请参阅 OpenAI 的 [音频文档](https://platform.openai.com/docs/guides/audio)。

</Note>

```python
history = [
    ("human", "Are you made by OpenAI? Just answer yes or no"),
    output_message,
    ("human", "And what is your name? Just give your name."),
]
second_output_message = llm.invoke(history)
```

---

## 提示缓存

OpenAI 的 [提示缓存](https://platform.openai.com/docs/guides/prompt-caching) 功能会自动缓存超过 1024 个标记的提示，以降低成本并提高响应时间。此功能对所有近期模型（`gpt-4o` 及更新版本）均启用。

### 手动缓存

您可以使用 `prompt_cache_key` 参数来影响 OpenAI 的缓存并优化缓存命中率：

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")

# Use a cache key for repeated prompts
messages = [
    {"role": "system", "content": "You are a helpful assistant that translates English to French."},
    {"role": "user", "content": "I love programming."},
]

response = llm.invoke(
    messages,
    prompt_cache_key="translation-assistant-v1"
)

# Check cache usage
cache_read_tokens = response.usage_metadata.input_token_details.cache_read
print(f"Cached tokens used: {cache_read_tokens}")
```

<Warning>

缓存命中要求提示前缀完全匹配

</Warning>

### 缓存键策略

您可以根据应用程序的需求使用不同的缓存键策略：

```python
# Static cache keys for consistent prompt templates
customer_response = llm.invoke(
    messages,
    prompt_cache_key="customer-support-v1"
)

support_response = llm.invoke(
    messages,
    prompt_cache_key="internal-support-v1"
)

# Dynamic cache keys based on context
user_type = "premium"
cache_key = f"assistant-{user_type}-v1"
response = llm.invoke(messages, prompt_cache_key=cache_key)
```

### 模型级缓存

您还可以使用 `model_kwargs` 在模型级别设置默认缓存键：

```python
llm = ChatOpenAI(
    model="gpt-4o-mini",
    model_kwargs={"prompt_cache_key": "default-cache-v1"}
)

# Uses default cache key
response1 = llm.invoke(messages)

# Override with specific cache key
response2 = llm.invoke(messages, prompt_cache_key="override-cache-v1")
```

---

## 灵活处理

OpenAI 提供多种 [服务层级](https://platform.openai.com/docs/guides/flex-processing)。"flex" 层级为请求提供更便宜的价格，但代价是响应可能需要更长时间，并且资源可能并不总是可用。这种方法最适合非关键任务，包括模型测试、数据增强或可以异步运行的作业。

要使用它，请使用 `service_tier="flex"` 初始化模型：

```python
llm = ChatOpenAI(model="o4-mini", service_tier="flex")
```

请注意，这是一个仅适用于部分模型的测试版功能。更多详情请参阅 OpenAI [文档](https://platform.openai.com/docs/guides/flex-processing)。

---

## API 参考

有关所有功能和配置选项的详细文档，请前往 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> API 参考。

