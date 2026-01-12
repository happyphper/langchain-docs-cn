---
title: Llama.cpp
---
>[llama.cpp python](https://github.com/abetlen/llama-cpp-python) 库是 `@ggerganov` 的 [llama.cpp](https://github.com/ggerganov/llama.cpp) 的一个简单 Python 绑定。

此包提供：

- 通过 ctypes 接口对 C API 的低级访问。
- 用于文本补全的高级 Python API
  - 类似 `OpenAI` 的 API
  - `LangChain` 兼容性
  - `LlamaIndex` 兼容性
- OpenAI 兼容的 Web 服务器
  - 本地 Copilot 替代方案
  - 支持函数调用
  - 支持视觉 API
  - 多模型支持

## 概述

### 集成详情

| 类 | 包 | 可序列化 | JS 支持 |
| :--- | :--- | :---: |  :---: |
| [ChatLlamaCpp](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.llamacpp.ChatLlamaCpp.html) | [langchain-community](https://python.langchain.com/api_reference/community/index.html) | ❌ | ❌ |

### 模型特性

| [工具调用](/oss/python/langchain/tools) | [结构化输出](/oss/python/langchain/structured-output) | 图像输入 | 音频输入 | 视频输入 | [令牌级流式传输](/oss/python/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/python/langchain/models#token-usage) | [对数概率](/oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |

## 设置

要开始使用并体验下面展示的**所有**功能，我们建议使用一个为工具调用进行过微调的模型。

我们将使用 NousResearch 的 [Hermes-2-Pro-Llama-3-8B-GGUF](https://huggingface.co/NousResearch/Hermes-2-Pro-Llama-3-8B-GGUF)。

> Hermes 2 Pro 是 Nous Hermes 2 的升级版本，包含更新和清理过的 OpenHermes 2.5 数据集，以及新引入的内部开发的函数调用和 JSON 模式数据集。这个新版本的 Hermes 保持了其出色的通用任务和对话能力，同时在函数调用方面也表现出色。

请参阅我们关于本地模型的指南以深入了解：

- [本地运行 LLMs](https://python.langchain.com/v0.1/docs/guides/development/local_llms/)
- [在 RAG 中使用本地模型](https://python.langchain.com/v0.1/docs/use_cases/question_answering/local_retrieval_qa/)

### 安装

LangChain LlamaCpp 集成位于 `langchain-community` 和 `llama-cpp-python` 包中：

```python
pip install -qU langchain-community llama-cpp-python
```

## 实例化

现在我们可以实例化我们的模型对象并生成聊天补全：

```python
# 你的模型权重路径
local_model = "local/path/to/Hermes-2-Pro-Llama-3-8B-Q8_0.gguf"
```

```python
import multiprocessing

from langchain_community.chat_models import ChatLlamaCpp

llm = ChatLlamaCpp(
    temperature=0.5,
    model_path=local_model,
    n_ctx=10000,
    n_gpu_layers=8,
    n_batch=300,  # 应在 1 到 n_ctx 之间，考虑 GPU 的 VRAM 容量。
    max_tokens=512,
    n_threads=multiprocessing.cpu_count() - 1,
    repeat_penalty=1.5,
    top_p=0.5,
    verbose=True,
)
```

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

```python
print(ai_msg.content)
```

```text
J'aime programmer. (In France, "programming" is often used in its original sense of scheduling or organizing events.)

If you meant computer-programming:
Je suis amoureux de la programmation informatique.

(You might also say simply 'programmation', which would be understood as both meanings - depending on context).
```

## 工具调用

首先，它的工作方式与 OpenAI 函数调用基本相同。

OpenAI 有一个[工具调用](https://platform.openai.com/docs/guides/function-calling) API（我们在这里交替使用“工具调用”和“函数调用”），它允许你描述工具及其参数，并让模型返回一个 JSON 对象，其中包含要调用的工具和该工具的输入。工具调用对于构建使用工具的链和智能体，以及更普遍地从模型获取结构化输出非常有用。

通过 `ChatLlamaCpp.bind_tools`，我们可以轻松地将 Pydantic 类、字典模式、LangChain 工具甚至函数作为工具传递给模型。在底层，这些被转换为 OpenAI 工具模式，如下所示：

```
{
    "name": "...",
    "description": "...",
    "parameters": {...}  # JSONSchema
}
```

并在每次模型调用中传递。

但是，它不能自动触发函数/工具，我们需要通过指定 'tool_choice' 参数来强制它。此参数通常按以下格式设置。

`{"type": "function", "function": {"name": <<tool_name>>}}.`

```python
from langchain.tools import tool
from pydantic import BaseModel, Field

class WeatherInput(BaseModel):
        location: str = Field(description="The city and state, e.g. San Francisco, CA")
        unit: str = Field(enum=["celsius", "fahrenheit"])

@tool("get_current_weather", args_schema=WeatherInput)
def get_weather(location: str, unit: str):
    """Get the current weather in a given location"""
    return f"Now the weather in {location} is 22 {unit}"

llm_with_tools = llm.bind_tools(
        tools=[get_weather],
        tool_choice={"type": "function", "function": {"name": "get_current_weather"}},
)
```

```python
ai_msg = llm_with_tools.invoke(
    "what is the weather like in HCMC in celsius",
)
```

```python
ai_msg.tool_calls
```

```text
[{'name': 'get_current_weather',
  'args': {'location': 'Ho Chi Minh City', 'unit': 'celsius'},
  'id': 'call__0_get_current_weather_cmpl-394d9943-0a1f-425b-8139-d2826c1431f2'}]
```

```python
class MagicFunctionInput(BaseModel):
        magic_function_input: int = Field(description="The input value for magic function")

@tool("get_magic_function", args_schema=MagicFunctionInput)
def magic_function(magic_function_input: int):
    """Get the value of magic function for an input."""
    return magic_function_input + 2

llm_with_tools = llm.bind_tools(
        tools=[magic_function],
        tool_choice={"type": "function", "function": {"name": "get_magic_function"}},
)

ai_msg = llm_with_tools.invoke(
    "What is magic function of 3?",
)

ai_msg
```

```python
ai_msg.tool_calls
```

```text
[{'name': 'get_magic_function',
  'args': {'magic_function_input': 3},
  'id': 'call__0_get_magic_function_cmpl-cd83a994-b820-4428-957c-48076c68335a'}]
```

# 结构化输出

```python
from langchain_core.utils.function_calling import convert_to_openai_tool
from pydantic import BaseModel

class Joke(BaseModel):
    """A setup to a joke and the punchline."""

    setup: str
    punchline: str

dict_schema = convert_to_openai_tool(Joke)
structured_llm = llm.with_structured_output(dict_schema)
result = structured_llm.invoke("Tell me a joke about birds")
result
```

```python
result
```

```text
{'setup': '- Why did the chicken cross the playground?',
 'punchline': '\n\n- To get to its gilded cage on the other side!'}
```

# 流式传输

```python
for chunk in llm.stream("what is 25x5"):
        print(chunk.content, end="\n", flush=True)
```

---

## API 参考

有关 ChatLlamaCpp 所有功能和配置的详细文档，请访问 API 参考：[python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.llamacpp.ChatLlamaCpp.html](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.llamacpp.ChatLlamaCpp.html)
