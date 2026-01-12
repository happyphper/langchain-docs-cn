---
title: ChatGroq
sidebarTitle: Groq
description: '开始使用 LangChain 中的 Groq [聊天模型](/oss/langchain/models)。'
---

<Warning>

本页面提及 [Groq](https://console.groq.com/docs/overview)，这是一家 AI 硬件和软件公司。关于如何使用 Grok 模型（由 [xAI](https://docs.x.ai/docs/overview) 提供）的信息，请参阅 [xAI 供应商页面](/oss/python/integrations/providers/xai)。

</Warning>

<Tip>

<strong>API 参考</strong>

有关所有功能和配置选项的详细文档，请前往 <a href="https://reference.langchain.com/python/integrations/langchain_groq/#langchain_groq.ChatGroq" target="_blank" rel="noreferrer" class="link"><code>ChatGroq</code></a> API 参考。

</Tip>

有关所有 Groq 模型的列表，请访问其 [文档](https://console.groq.com/docs/models?utm_source=langchain)。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [JS 支持](https://js.langchain.com/docs/integrations/chat/groq) | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| <a href="https://reference.langchain.com/python/integrations/langchain_groq/#langchain_groq.ChatGroq" target="_blank" rel="noreferrer" class="link"><code>ChatGroq</code></a> | <a href="https://reference.langchain.com/python/integrations/langchain_groq" target="_blank" rel="noreferrer" class="link"><code>langchain-groq</code></a> | beta | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-groq?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-groq?style=flat-square&label=%20) |

### 模型特性

| [工具调用](/oss/python/langchain/tools) | [结构化输出](/oss/python/langchain/structured-output) | [图像输入](/oss/python/langchain/messages#multimodal) | 音频输入 | 视频输入 | [Token 级流式传输](/oss/python/langchain/streaming#llm-tokens) | 原生异步 | [Token 使用量](/oss/python/langchain/models#token-usage) | [Logprobs](/oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |

## 设置

要访问 Groq 模型，您需要创建一个 Groq 账户，获取一个 API 密钥，并安装 `langchain-groq` 集成包。

### 凭证

前往 [Groq 控制台](https://console.groq.com/login?utm_source=langchain&utm_content=chat_page) 注册 Groq 并生成一个 API 密钥。完成后，设置 GROQ_API_KEY 环境变量：

```python
import getpass
import os

if "GROQ_API_KEY" not in os.environ:
    os.environ["GROQ_API_KEY"] = getpass.getpass("Enter your Groq API key: ")
```

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

LangChain Groq 集成位于 `langchain-groq` 包中：

```python
pip install -qU langchain-groq
```

## 实例化

现在我们可以实例化我们的模型对象并生成聊天补全。

<Note>

<strong>推理格式</strong>

如果您选择设置 `reasoning_format`，必须确保您使用的模型支持它。您可以在 [Groq 文档](https://console.groq.com/docs/reasoning) 中找到支持的模型列表。

</Note>

```python
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="qwen/qwen3-32b",
    temperature=0,
    max_tokens=None,
    reasoning_format="parsed",
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
AIMessage(content="J'aime la programmation.", additional_kwargs={'reasoning_content': 'Okay, so I need to translate the sentence "I love programming." into French. Let me think about how to approach this. \n\nFirst, I know that "I" in French is "Je." That\'s straightforward. Now, the verb "love" in French is "aime" when referring to oneself. So, "I love" would be "J\'aime." \n\nNext, the word "programming." In French, programming is "la programmation." But wait, in French, when you talk about loving an activity, you often use the definite article. So, it would be "la programmation." \n\nPutting it all together, "I love programming" becomes "J\'aime la programmation." That sounds right. I think that\'s the correct translation. \n\nI should double-check to make sure I\'m not missing anything. Maybe I can think of similar phrases. For example, "I love reading" is "J\'aime lire," but when it\'s a noun, like "I love music," it\'s "J\'aime la musique." So, yes, using "la programmation" makes sense here. \n\nI don\'t think I need to change anything else. The sentence structure in French is Subject-Verb-Object, just like in English, so "J\'aime la programmation" should be correct. \n\nI guess another way to say it could be "J\'adore la programmation," using "adore" instead of "aime," but "aime" is more commonly used in this context. So, sticking with "J\'aime la programmation" is probably the best choice.\n'}, response_metadata={'token_usage': {'completion_tokens': 346, 'prompt_tokens': 23, 'total_tokens': 369, 'completion_time': 1.447541218, 'prompt_time': 0.000983386, 'queue_time': 0.009673684, 'total_time': 1.448524604}, 'model_name': 'deepseek-r1-distill-llama-70b', 'system_fingerprint': 'fp_e98d30d035', 'finish_reason': 'stop', 'logprobs': None}, id='run--5679ae4f-f4e8-4931-bcd5-7304223832c0-0', usage_metadata={'input_tokens': 23, 'output_tokens': 346, 'total_tokens': 369})
```

```python
print(ai_msg.content)
```

```text
J'aime la programmation.
```

---

## API 参考

有关 ChatGroq 所有功能和配置的详细文档，请前往 [API 参考](https://python.langchain.com/api_reference/groq/chat_models/langchain_groq.chat_models.ChatGroq.html)。
