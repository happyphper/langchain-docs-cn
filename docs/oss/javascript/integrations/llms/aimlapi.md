---
title: AimlapiLLM
---

<Warning>

<strong>您当前正在查阅的是关于将 AI/ML API 模型用作文本补全模型的文档。许多最新和最受欢迎的 AI/ML API 模型是 [聊天补全模型](/oss/langchain/models)。</strong>

您可能正在寻找 [这个页面](/oss/integrations/chat/aimlapi)。

</Warning>

本页面帮助您开始使用 AI/ML API 文本补全模型。有关 `AimlapiLLM` 所有功能和配置的详细文档，请前往 [API 参考](https://python.langchain.com/api_reference/aimlapi/llms/langchain_aimlapi.llms.AimlapiLLM.html)。

## 概述

### 集成详情

| 类 | 包 | 本地 | 可序列化 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| [AimlapiLLM](https://python.langchain.com/api_reference/aimlapi/llms/langchain_aimlapi.llms.AimlapiLLM.html) | [langchain-aimlapi](https://python.langchain.com/api_reference/aimlapi/index.html) | ❌ | beta | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-aimlapi?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-aimlapi?style=flat-square&label=%20) |

### 模型特性

| [工具调用](/oss/langchain/tools) | [结构化输出](/oss/langchain/structured-output) | [图像输入](/oss/langchain/messages#multimodal) | 音频输入 | 视频输入 | [Token 级流式传输](/oss/langchain/streaming/) | 原生异步 | [Token 使用量](/oss/langchain/models#token-usage) | [对数概率](/oss/langchain/models#log-probabilities) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## 设置

要访问 AI/ML API 模型，您需要创建一个账户，获取一个 API 密钥，并安装 `langchain-aimlapi` 集成包。

### 凭证

前往 [aimlapi.com](https://aimlapi.com/app/?utm_source=langchain&utm_medium=github&utm_campaign=integration) 注册并生成一个 API 密钥。完成后，设置 `AIMLAPI_API_KEY` 环境变量：

```python
import getpass
import os

if not os.getenv("AIMLAPI_API_KEY"):
    os.environ["AIMLAPI_API_KEY"] = getpass.getpass("Enter your AI/ML API key: ")
```

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### 安装

LangChain AI/ML API 集成位于 `langchain-aimlapi` 包中：

```python
pip install -qU langchain-aimlapi
```

## 实例化

现在我们可以实例化我们的模型对象并生成文本补全：

```python
from langchain_aimlapi import AimlapiLLM

llm = AimlapiLLM(
    model="gpt-3.5-turbo-instruct",
    temperature=0.5,
    max_tokens=256,
)
```

## 调用

```python
response = llm.invoke("Explain the bubble sort algorithm in Python.")
print(response)
```

```text
Bubble sort is a simple sorting algorithm that repeatedly steps through a list, compares adjacent items, and swaps them when they are out of order. The process repeats until the entire list is sorted. While easy to understand and implement, bubble sort is inefficient on large datasets because it has quadratic time complexity.
```

## 流式调用

您也可以逐 Token 流式获取响应：

```python
llm = AimlapiLLM(
    model="gpt-3.5-turbo-instruct",
)

for chunk in llm.stream("List top 5 programming languages in 2025 with reasons."):
    print(chunk, end="", flush=True)
```

---

## API 参考

有关 AimlapiLLM 所有功能和配置的详细文档，请前往 [API 参考](https://python.langchain.com/api_reference/aimlapi/llms/langchain_aimlapi.llms.AimlapiLLM.html)。
