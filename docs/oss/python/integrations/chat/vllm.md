---
title: vLLM Chat
---
vLLM 可以部署为模拟 OpenAI API 协议的服务器。这使得 vLLM 可以作为使用 OpenAI API 的应用程序的直接替代品。可以按照与 OpenAI API 相同的格式查询此服务器。

## 概述

本文将帮助您开始使用 vLLM [聊天模型](/oss/python/langchain/models)，它利用了 `langchain-openai` 包。有关 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html)。

### 集成详情

| 类 | 包 | 可序列化 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [ChatOpenAI](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html) | [langchain_openai](https://python.langchain.com/api_reference/openai/) | beta | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain_openai?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain_openai?style=flat-square&label=%20) |

### 模型特性

具体的模型特性，例如工具调用、多模态输入支持、令牌级流式支持等，将取决于托管模型。

## 设置

请参阅 vLLM 文档 [此处](https://docs.vllm.ai/en/latest/)。

要通过 LangChain 访问 vLLM 模型，您需要安装 `langchain-openai` 集成包。

### 凭证

身份验证将取决于推理服务器的具体细节。

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### 安装

LangChain vLLM 集成可以通过 `langchain-openai` 包访问：

```python
pip install -qU langchain-openai
```

## 实例化

现在我们可以实例化我们的模型对象并生成聊天补全：

```python
from langchain.messages import HumanMessage, SystemMessage
from langchain_core.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain_openai import ChatOpenAI
```

```python
inference_server_url = "http://localhost:8000/v1"

llm = ChatOpenAI(
    model="mosaicml/mpt-7b",
    openai_api_key="EMPTY",
    openai_api_base=inference_server_url,
    max_tokens=5,
    temperature=0,
)
```

## 调用

```python
messages = [
    SystemMessage(
        content="You are a helpful assistant that translates English to Italian."
    ),
    HumanMessage(
        content="Translate the following sentence from English to Italian: I love programming."
    ),
]
llm.invoke(messages)
```

```text
AIMessage(content=' Io amo programmare', additional_kwargs={}, example=False)
```

---

## API 参考

有关通过 `langchain-openai` 公开的所有功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html)

也请参考 vLLM [文档](https://docs.vllm.ai/en/latest/)。
