---
title: ChatLiteLLM 与 ChatLiteLLMRouter
---
[LiteLLM](https://github.com/BerriAI/litellm) 是一个简化调用 Anthropic、Azure、Huggingface、Replicate 等服务的库。

本文档涵盖了如何开始使用 LangChain + LiteLLM I/O 库。

此集成包含两个主要类：

- `ChatLiteLLM`: 用于基本使用 LiteLLM 的主要 LangChain 包装器（[文档](https://docs.litellm.ai/docs/)）。
- `ChatLiteLLMRouter`: 一个利用 LiteLLM 路由器功能的 `ChatLiteLLM` 包装器（[文档](https://docs.litellm.ai/docs/routing)）。

## 目录

1.  [概述](#概述)
    - [集成详情](#集成详情)
    - [模型特性](#模型特性)
2.  [设置](#设置)
3.  [凭证](#凭证)
4.  [安装](#安装)
5.  [实例化](#实例化)
    - [ChatLiteLLM](#chatlitellm)
    - [ChatLiteLLMRouter](#chatlitellmrouter)
6.  [调用](#调用)
7.  [异步和流式功能](#异步和流式功能)
8.  [API 参考](#api-参考)

## 概述

### 集成详情

| 类 | 包 | 可序列化 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| [ChatLiteLLM](https://python.langchain.com/docs/integrations/chat/litellm/#chatlitellm) | [langchain-litellm](https://pypi.org/project/langchain-litellm/) | ❌ | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-litellm?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-litellm?style=flat-square&label=%20) |
| [ChatLiteLLMRouter](https://python.langchain.com/docs/integrations/chat/litellm/#chatlitellmrouter) | [langchain-litellm](https://pypi.org/project/langchain-litellm/) | ❌ | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-litellm?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-litellm?style=flat-square&label=%20) |

### 模型特性

| [工具调用](/oss/javascript/langchain/tools) | [结构化输出](/oss/javascript/langchain/structured-output#structured-output) | 图像输入 | 音频输入 | 视频输入 | [令牌级流式传输](/oss/javascript/integrations/chat/litellm#async-and-streaming-functionality) | [原生异步](/oss/javascript/integrations/chat/litellm#async-and-streaming-functionalityy) | [令牌使用量](/oss/javascript/langchain/models#token-usage) | [对数概率](/oss/javascript/langchain/models#log-probabilities) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |

### 设置

要访问 `ChatLiteLLM` 和 `ChatLiteLLMRouter` 模型，你需要安装 `langchain-litellm` 包，并创建一个 OpenAI、Anthropic、Azure、Replicate、OpenRouter、Hugging Face、Together AI 或 Cohere 账户。然后，你必须获取一个 API 密钥并将其导出为环境变量。

## 凭证

你必须选择你想要的 LLM 提供商，并注册以获取他们的 API 密钥。

### 示例 - Anthropic

前往 [Claude 控制台](https://console.anthropic.com) 注册并生成 Claude API 密钥。完成后，设置 `ANTHROPIC_API_KEY` 环境变量：

### 示例 - OpenAI

前往 [platform.openai.com/api-keys](https://platform.openai.com/api-keys) 注册 OpenAI 并生成 API 密钥。完成后，设置 OPENAI_API_KEY 环境变量。

```python
## Set ENV variables
import os

os.environ["OPENAI_API_KEY"] = "your-openai-key"
os.environ["ANTHROPIC_API_KEY"] = "your-anthropic-key"
```

### 安装

LangChain LiteLLM 集成包含在 `langchain-litellm` 包中：

```python
pip install -qU langchain-litellm
```

## 实例化

### ChatLiteLLM

你可以通过提供一个 [LiteLLM 支持的](https://docs.litellm.ai/docs/providers) `model` 名称来实例化一个 `ChatLiteLLM` 模型。

```python
from langchain_litellm import ChatLiteLLM

llm = ChatLiteLLM(model="gpt-4.1-nano", temperature=0.1)
```

### ChatLiteLLMRouter

你也可以通过定义你的模型列表来利用 LiteLLM 的路由功能，具体定义方式见[此处](https://docs.litellm.ai/docs/routing)。

```python
from langchain_litellm import ChatLiteLLMRouter
from litellm import Router

model_list = [
    {
        "model_name": "gpt-4.1",
        "litellm_params": {
            "model": "azure/gpt-4.1",
            "api_key": "<your-api-key>",
            "api_version": "2024-10-21",
            "api_base": "https://<your-endpoint>.openai.azure.com/",
        },
    },
    {
        "model_name": "gpt-4o",
        "litellm_params": {
            "model": "azure/gpt-4o",
            "api_key": "<your-api-key>",
            "api_version": "2024-10-21",
            "api_base": "https://<your-endpoint>.openai.azure.com/",
        },
    },
]
litellm_router = Router(model_list=model_list)
llm = ChatLiteLLMRouter(router=litellm_router, model_name="gpt-4.1", temperature=0.1)
```

## 调用

无论你实例化的是 `ChatLiteLLM` 还是 `ChatLiteLLMRouter`，现在都可以通过 LangChain 的 API 使用该聊天模型。

```python
response = await llm.ainvoke(
    "Classify the text into neutral, negative or positive. Text: I think the food was okay. Sentiment:"
)
print(response)
```

```text
content='Neutral' additional_kwargs={} response_metadata={'token_usage': Usage(completion_tokens=2, prompt_tokens=30, total_tokens=32, completion_tokens_details=CompletionTokensDetailsWrapper(accepted_prediction_tokens=0, audio_tokens=0, reasoning_tokens=0, rejected_prediction_tokens=0, text_tokens=None), prompt_tokens_details=PromptTokensDetailsWrapper(audio_tokens=0, cached_tokens=0, text_tokens=None, image_tokens=None)), 'model': 'gpt-3.5-turbo', 'finish_reason': 'stop', 'model_name': 'gpt-3.5-turbo'} id='run-ab6a3b21-eae8-4c27-acb2-add65a38221a-0' usage_metadata={'input_tokens': 30, 'output_tokens': 2, 'total_tokens': 32}
```

## 异步和流式功能

`ChatLiteLLM` 和 `ChatLiteLLMRouter` 也支持异步和流式功能：

```python
async for token in llm.astream("Hello, please explain how antibiotics work"):
    print(token.text(), end="")
```

```text
Antibiotics are medications that fight bacterial infections in the body. They work by targeting specific bacteria and either killing them or preventing their growth and reproduction.

There are several different mechanisms by which antibiotics work. Some antibiotics work by disrupting the cell walls of bacteria, causing them to burst and die. Others interfere with the protein synthesis of bacteria, preventing them from growing and reproducing. Some antibiotics target the DNA or RNA of bacteria, disrupting their ability to replicate.

It is important to note that antibiotics only work against bacterial infections and not viral infections. It is also crucial to take antibiotics as prescribed by a healthcare professional and to complete the full course of treatment, even if symptoms improve before the medication is finished. This helps to prevent antibiotic resistance, where bacteria become resistant to the effects of antibiotics.
```

---

## API 参考

有关 `ChatLiteLLM` 和 `ChatLiteLLMRouter` 所有功能和配置的详细文档，请前往 API 参考：[github.com/Akshay-Dongare/langchain-litellm](https://github.com/Akshay-Dongare/langchain-litellm)
