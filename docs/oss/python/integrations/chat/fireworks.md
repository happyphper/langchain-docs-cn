---
title: ChatFireworks
---
本文档将帮助您开始使用 Fireworks AI 的[聊天模型](/oss/python/langchain/models)。如需了解 ChatFireworks 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/fireworks/chat_models/langchain_fireworks.chat_models.ChatFireworks.html)。

Fireworks AI 是一个用于运行和定制模型的 AI 推理平台。有关 Fireworks 提供的所有模型列表，请参阅 [Fireworks 文档](https://fireworks.ai/models)。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [JS 支持](https://js.langchain.com/docs/integrations/chat/fireworks) | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [`ChatFireworks`](https://docs.langchain.com/oss/python/integrations/chat/fireworks) | [`langchain-fireworks`](https://pypi.org/project/langchain-fireworks/) | beta | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-fireworks?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-fireworks?style=flat-square&label=%20) |

### 模型特性

| [工具调用](/oss/python/langchain/tools) | [结构化输出](/oss/python/langchain/structured-output) | [图像输入](/oss/python/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/python/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/python/langchain/models#token-usage) | [对数概率](/oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |

## 设置

要访问 Fireworks 模型，您需要创建一个 Fireworks 账户，获取 API 密钥，并安装 `langchain-fireworks` 集成包。

### 凭证

前往 ([fireworks.ai/login](https://fireworks.ai/login) 注册 Fireworks 并生成 API 密钥。完成后，设置 `FIREWORKS_API_KEY` 环境变量：

```python
import getpass
import os

if "FIREWORKS_API_KEY" not in os.environ:
    os.environ["FIREWORKS_API_KEY"] = getpass.getpass("Enter your Fireworks API key: ")
```

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

LangChain Fireworks 集成位于 `langchain-fireworks` 包中：

```python
pip install -qU langchain-fireworks
```

## 实例化

现在我们可以实例化模型对象并生成聊天补全：

- TODO: 使用相关参数更新模型实例化。

```python
from langchain_fireworks import ChatFireworks

llm = ChatFireworks(
    model="accounts/fireworks/models/kimi-k2-instruct-0905", # 模型库位于: https://app.fireworks.ai/models
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # 其他参数...
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

```text
AIMessage(content="J'adore la programmation.", additional_kwargs={}, response_metadata={'token_usage': {'prompt_tokens': 31, 'total_tokens': 41, 'completion_tokens': 10}, 'system_fingerprint': '', 'finish_reason': 'stop', 'logprobs': None, 'model_provider': 'fireworks', 'model_name': 'accounts/fireworks/models/kimi-k2-instruct-0905'}, id='lc_run--a2bdeca3-6394-4c80-97ad-2fc8db9f54bb-0', usage_metadata={'input_tokens': 31, 'output_tokens': 10, 'total_tokens': 41})
```

```python
print(ai_msg.content)
```

```text
J'adore la programmation.
```

## API 参考

有关 ChatFireworks 所有功能和配置的详细文档，请参阅 [API 参考](https://reference.langchain.com/python/integrations/langchain_fireworks/)

要使用 `langchain-fireworks` 包，请按照以下安装步骤操作：

```bash
pip install langchain-fireworks
```

## 基本用法

### 设置

1.  登录 [Fireworks AI](http://fireworks.ai/) 以获取访问模型的 API 密钥，并确保将其设置为 `FIREWORKS_API_KEY` 环境变量。

登录并获取 API 密钥后，请按照以下步骤设置 `FIREWORKS_API_KEY` 环境变量：
    - **Linux/macOS:** 打开终端并执行以下命令：

```bash
export FIREWORKS_API_KEY='your_api_key'
```

    **注意：** 要使此环境变量在终端会话中持久化，请将上述行添加到您的 `~/.bashrc`、`~/.bash_profile` 或 `~/.zshrc` 文件中。

    - **Windows:** 对于命令提示符，请使用：

```cmd
set FIREWORKS_API_KEY=your_api_key
```

2.  使用模型 ID 设置您的模型。如果未设置模型，则默认模型为 `fireworks-llama-v2-7b-chat`。请参阅 [fireworks.ai](https://app.fireworks.ai/models) 上完整且最新的模型列表。

```python
import getpass
import os
from langchain_fireworks import ChatFireworks

# 初始化 Fireworks 模型
llm = ChatFireworks(
    model="accounts/fireworks/models/llama-v3p1-8b-instruct",
    base_url="https://api.fireworks.ai/inference/v1/completions",
)
```

### 直接调用模型

您可以直接使用字符串提示调用模型以获取补全。

```python
# 单个提示
output = llm.invoke("Who's the best quarterback in the NFL?")
print(output)
```

```python
# 调用多个提示
output = llm.generate(
    [
        "Who's the best cricket player in 2016?",
        "Who's the best basketball player in the league?",
    ]
)
print(output.generations)
```

## 高级用法

### 工具使用：LangChain Agent + Fireworks 函数调用模型

请查看[此笔记本](https://github.com/fw-ai/cookbook/blob/main/learn/function-calling/notebooks_langchain/fireworks_langchain_tool_usage.ipynb)，了解如何教 Fireworks 函数调用模型使用计算器。

Fireworks 专注于为快速模型推理和工具使用提供最佳体验。您可以查看[我们的博客](https://fireworks.ai/blog/firefunction-v1-gpt-4-level-function-calling)了解更多关于其与 GPT-4 比较的详细信息，要点是它在函数调用用例方面与 GPT-4 相当，但速度更快且成本更低。

### RAG：LangChain agent + Fireworks 函数调用模型 + MongoDB + Nomic AI 嵌入

请查看[此处的 cookbook](https://github.com/fw-ai/cookbook/blob/main/integrations/MongoDB/project_rag_with_mongodb/mongodb_agent.ipynb) 以了解端到端流程。
