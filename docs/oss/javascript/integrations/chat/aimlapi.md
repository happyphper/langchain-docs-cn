---
title: ChatAimlapi
---
本指南将帮助您开始使用 AI/ML API 的[聊天模型](/oss/javascript/langchain/models)。有关 `ChatAimlapi` 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/aimlapi/chat_models/langchain_aimlapi.chat_models.ChatAimlapi.html)。

[AI/ML API](https://aimlapi.com/app/?utm_source=langchain&utm_medium=github&utm_campaign=integration) 提供了对数百个托管基础模型的统一访问，具备高可用性和高吞吐量。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| [ChatAimlapi](https://python.langchain.com/api_reference/aimlapi/chat_models/langchain_aimlapi.chat_models.ChatAimlapi.html) | [langchain-aimlapi](https://python.langchain.com/api_reference/aimlapi/index.html) | beta | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-aimlapi?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-aimlapi?style=flat-square&label=%20) |

### 模型特性

| [工具调用](/oss/javascript/langchain/tools) | [结构化输出](/oss/javascript/langchain/structured-output) | [图像输入](/oss/javascript/langchain/messages#multimodal) | 音频输入 | 视频输入 | [Token 级流式传输](/oss/javascript/langchain/streaming/) | 原生异步 | [Token 使用量](/oss/javascript/langchain/models#token-usage) | [对数概率](/oss/javascript/langchain/models#log-probabilities) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## 设置

要访问 AI/ML API 模型，您需要创建一个账户、获取一个 API 密钥，并安装 `langchain-aimlapi` 集成包。

### 凭证

前往 [aimlapi.com](https://aimlapi.com/app/?utm_source=langchain&utm_medium=github&utm_campaign=integration) 注册并生成一个 API 密钥。完成后，请设置 `AIMLAPI_API_KEY` 环境变量：

```python
import getpass
import os

if not os.getenv("AIMLAPI_API_KEY"):
    os.environ["AIMLAPI_API_KEY"] = getpass.getpass("Enter your AI/ML API key: ")
```

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

LangChain AI/ML API 集成位于 `langchain-aimlapi` 包中：

```python
pip install -qU langchain-aimlapi
```

## 实例化

现在我们可以实例化我们的模型对象并生成聊天补全：

```python
from langchain_aimlapi import ChatAimlapi

llm = ChatAimlapi(
    model="meta-llama/Llama-3-70b-chat-hf",
    temperature=0.7,
    max_tokens=512,
    timeout=30,
    max_retries=3,
)
```

## 调用

```python
messages = [
    ("system", "You are a helpful assistant that translates English to French."),
    ("human", "I love programming."),
]
ai_msg = llm.invoke(messages)
ai_msg
```

```text
AIMessage(content="J'adore la programmation.", response_metadata={'token_usage': {'completion_tokens': 9, 'prompt_tokens': 23, 'total_tokens': 32}, 'model_name': 'meta-llama/Llama-3-70b-chat-hf'}, id='run-...')
```

```python
print(ai_msg.content)
```

```text
J'adore la programmation.
```

## 流式调用

您也可以按 Token 流式获取响应：

```python
for chunk in llm.stream("List top 5 programming languages in 2025 with reasons."):
    print(chunk.content, end="", flush=True)
```

---

## API 参考

有关 ChatAimlapi 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/aimlapi/chat_models/langchain_aimlapi.chat_models.ChatAimlapi.html)。
