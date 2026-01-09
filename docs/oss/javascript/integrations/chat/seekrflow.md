---
title: ChatSeekrFlow
---
> [Seekr](https://www.seekr.com/) 提供 AI 驱动的解决方案，旨在实现结构化、可解释且透明的 AI 交互。

本指南提供了使用 Seekr [聊天模型](/oss/langchain/models) 的快速入门概览。有关 `ChatSeekrFlow` 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.seekrflow.ChatSeekrFlow.html)。

## 概述

`ChatSeekrFlow` 类封装了托管在 SeekrFlow 上的聊天模型端点，使其能够与 LangChain 应用程序无缝集成。

### 集成详情

| 类 | 包 | 可序列化 | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: |
| [ChatSeekrFlow](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.seekrflow.ChatSeekrFlow.html) | [seekrai](https://python.langchain.com/docs/integrations/providers/seekr/) | beta | ![PyPI - Downloads](https://img.shields.io/pypi/dm/seekrai?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/seekrai?style=flat-square&label=%20) |

### 模型特性

| [工具调用](/oss/langchain/tools/) | [结构化输出](/oss/langchain/structured-output) | [图像输入](/oss/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/langchain/models#token-usage) | [对数概率](/oss/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |

### 支持的方法

`ChatSeekrFlow` 支持 `ChatModel` 的所有方法，**但不包括异步 API**。

### 端点要求

`ChatSeekrFlow` 所封装的 serving 端点**必须**具有 OpenAI 兼容的聊天输入/输出格式。它可以用于：

1.  **微调的 Seekr 模型**
2.  **自定义的 SeekrFlow 模型**
3.  **使用 Seekr 检索系统的 RAG 增强模型**

关于异步使用，请参考 `AsyncChatSeekrFlow`（即将推出）。

# 在 LangChain 中使用 ChatSeekrFlow 入门

本笔记本介绍如何在 LangChain 中将 SeekrFlow 用作聊天模型。

## 设置

确保已安装必要的依赖项：

```bash
pip install seekrai langchain langchain-community
```

您还必须拥有来自 Seekr 的 API 密钥以验证请求。

```python
# Standard library
import getpass
import os

# Third-party
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage
from langchain_core.runnables import RunnableSequence

# OSS SeekrFlow integration
from langchain_seekrflow import ChatSeekrFlow
from seekrai import SeekrFlow
```

## API 密钥设置

您需要将 API 密钥设置为环境变量以验证请求。

运行下面的单元格。

或者在运行查询前手动分配：

```python
SEEKR_API_KEY = "your-api-key-here"
```

```python
os.environ["SEEKR_API_KEY"] = getpass.getpass("Enter your Seekr API key:")
```

## 实例化

```python
os.environ["SEEKR_API_KEY"]
seekr_client = SeekrFlow(api_key=SEEKR_API_KEY)

llm = ChatSeekrFlow(
    client=seekr_client, model_name="meta-llama/Meta-Llama-3-8B-Instruct"
)
```

## 调用

```python
response = llm.invoke([HumanMessage(content="Hello, Seekr!")])
print(response.content)
```

```text
Hello there! I'm Seekr, nice to meet you! What brings you here today? Do you have a question, or are you looking for some help with something? I'm all ears (or rather, all text)!
```

## 链式调用

```python
prompt = ChatPromptTemplate.from_template("Translate to French: {text}")

chain: RunnableSequence = prompt | llm
result = chain.invoke({"text": "Good morning"})
print(result)
```

```text
content='The translation of "Good morning" in French is:\n\n"Bonne journée"' additional_kwargs={} response_metadata={}
```

```python
def test_stream():
    """Test synchronous invocation in streaming mode."""
    print("\n🔹 Testing Sync `stream()` (Streaming)...")

    for chunk in llm.stream([HumanMessage(content="Write me a haiku.")]):
        print(chunk.content, end="", flush=True)

# ✅ Ensure streaming is enabled
llm = ChatSeekrFlow(
    client=seekr_client,
    model_name="meta-llama/Meta-Llama-3-8B-Instruct",
    streaming=True,  # ✅ Enable streaming
)

# ✅ Run sync streaming test
test_stream()
```

```text
🔹 Testing Sync `stream()` (Streaming)...
Here is a haiku:

Golden sunset fades
Ripples on the quiet lake
Peaceful evening sky
```

## 错误处理与调试

```python
# Define a minimal mock SeekrFlow client
class MockSeekrClient:
    """Mock SeekrFlow API client that mimics the real API structure."""

    class MockChat:
        """Mock Chat object with a completions method."""

        class MockCompletions:
            """Mock Completions object with a create method."""

            def create(self, *args, **kwargs):
                return {
                    "choices": [{"message": {"content": "Mock response"}}]
                }  # Mimic API response

        completions = MockCompletions()

    chat = MockChat()

def test_initialization_errors():
    """Test that invalid ChatSeekrFlow initializations raise expected errors."""

    test_cases = [
        {
            "name": "Missing Client",
            "args": {"client": None, "model_name": "seekrflow-model"},
            "expected_error": "SeekrFlow client cannot be None.",
        },
        {
            "name": "Missing Model Name",
            "args": {"client": MockSeekrClient(), "model_name": ""},
            "expected_error": "A valid model name must be provided.",
        },
    ]

    for test in test_cases:
        try:
            print(f"Running test: {test['name']}")
            faulty_llm = ChatSeekrFlow(**test["args"])

            # If no error is raised, fail the test
            print(f"❌ Test '{test['name']}' failed: No error was raised!")
        except Exception as e:
            error_msg = str(e)
            assert test["expected_error"] in error_msg, f"Unexpected error: {error_msg}"
            print(f"✅ Expected Error: {error_msg}")

# Run test
test_initialization_errors()
```

```text
Running test: Missing Client
✅ Expected Error: SeekrFlow client cannot be None.
Running test: Missing Model Name
✅ Expected Error: A valid model name must be provided.
```

---

## API 参考

- `ChatSeekrFlow` 类: [`langchain_seekrflow.ChatSeekrFlow`](https://github.com/benfaircloth/langchain-seekrflow/blob/main/langchain_seekrflow/seekrflow.py)
- PyPI 包: [`langchain-seekrflow`](https://pypi.org/project/langchain-seekrflow/)
