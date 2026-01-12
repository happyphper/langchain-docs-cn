---
title: ChatNetmind
---
这将帮助您开始使用 Netmind [聊天模型](https://www.netmind.ai/)。有关所有 ChatNetmind 功能和配置的详细文档，请参阅 [API 参考](https://github.com/protagolabs/langchain-netmind)。

- 查看 [www.netmind.ai/](https://www.netmind.ai/) 以获取示例。

## 概述

### 集成详情

| 类                                                                                        | 包 | 可序列化 | [JS 支持](https://js.langchain.com/docs/integrations/chat/) | 下载量 | 版本 |
|:---------------------------------------------------------------------------------------------| :--- |:------------:|:--------------------------------------------------------------:| :---: | :---: |
| [ChatNetmind](https://python.langchain.com/api_reference/) | [langchain-netmind](https://python.langchain.com/api_reference/) |      ❌       |                               ❌                                | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-netmind?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-netmind?style=flat-square&label=%20) |

### 模型功能

| [工具调用](/oss/python/langchain/tools) | [结构化输出](/oss/python/langchain/structured-output) | [图像输入](/oss/python/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/python/langchain/streaming#llm-tokens) | 原生异步 | [令牌使用量](/oss/python/langchain/models#token-usage) | [对数概率](/oss/python/langchain/models#log-probabilities) |
|:-----------------------------------------------:|:---------------------------------------------------------:|:---------------------------------------------------:|:-----------:|:-----------:|:----------------------------------------------------------:|:------------:|:-----------------------------------------------------------:|:---------------------------------------:|
|                        ✅                        |                             ✅                             |                          ❌                          |      ❌      |      ❌      |                             ✅                              |      ✅       |                              ✅                              |                    ✅                    |

## 设置

要访问 Netmind 模型，您需要创建一个 Netmind 账户，获取 API 密钥，并安装 `langchain-netmind` 集成包。

### 凭证

前往 [www.netmind.ai/](https://www.netmind.ai/) 注册 Netmind 并生成 API 密钥。完成后，设置 NETMIND_API_KEY 环境变量：

```python
import getpass
import os

if not os.getenv("NETMIND_API_KEY"):
    os.environ["NETMIND_API_KEY"] = getpass.getpass("Enter your Netmind API key: ")
```

如果您希望自动追踪模型调用，也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
# os.environ["LANGCHAIN_TRACING_V2"] = "true"
# os.environ["LANGCHAIN_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### 安装

LangChain Netmind 集成位于 `langchain-netmind` 包中：

```python
pip install -qU langchain-netmind
```

## 实例化

现在我们可以实例化模型对象并生成聊天补全：

```python
from langchain_netmind import ChatNetmind

llm = ChatNetmind(
    model="deepseek-ai/DeepSeek-V3",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
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
AIMessage(content="J'adore programmer.", additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 13, 'prompt_tokens': 31, 'total_tokens': 44, 'completion_tokens_details': None, 'prompt_tokens_details': None}, 'model_name': 'deepseek-ai/DeepSeek-V3', 'system_fingerprint': None, 'finish_reason': 'stop', 'logprobs': None}, id='run-ca6c2010-844d-4bf6-baac-6e248491b000-0', usage_metadata={'input_tokens': 31, 'output_tokens': 13, 'total_tokens': 44, 'input_token_details': {}, 'output_token_details': {}})
```

```python
print(ai_msg.content)
```

```text
J'adore programmer.
```

---

## API 参考

有关所有 ChatNetmind 功能和配置的详细文档，请参阅 API 参考：
- [API 参考](https://python.langchain.com/api_reference/)
- [langchain-netmind](https://github.com/protagolabs/langchain-netmind)
- [pypi](https://pypi.org/project/langchain-netmind/)
