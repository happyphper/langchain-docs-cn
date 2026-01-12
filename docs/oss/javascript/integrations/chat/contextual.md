---
title: 聊天上下文
---
这将帮助您开始使用 Contextual AI 的 Grounded Language Model [聊天模型](/oss/javascript/langchain/models/)。

要了解更多关于 Contextual AI 的信息，请访问我们的[文档](https://docs.contextual.ai/)。

此集成需要 `contextual-client` Python SDK。了解更多信息请访问[这里](https://github.com/ContextualAI/contextual-client-python)。

## 概述

此集成用于调用 Contextual AI 的 Grounded Language Model。

### 集成详情

| 类 | 包 | 可序列化 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [ChatContextual](https://github.com/ContextualAI//langchain-contextual) | [langchain-contextual](https://pypi.org/project/langchain-contextual/) | beta | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-contextual?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-contextual?style=flat-square&label=%20) |

### 模型特性

| [工具调用](/oss/javascript/langchain/tools) | [结构化输出](/oss/javascript/langchain/structured-output) | [图像输入](/oss/javascript/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/javascript/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/javascript/langchain/models#token-usage) | [对数概率](/oss/javascript/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 设置

要访问 Contextual 模型，您需要创建一个 Contextual AI 账户，获取一个 API 密钥，并安装 `langchain-contextual` 集成包。

### 凭证

前往 [app.contextual.ai](https://app.contextual.ai) 注册 Contextual 并生成一个 API 密钥。完成后，设置 CONTEXTUAL_AI_API_KEY 环境变量：

```python
import getpass
import os

if not os.getenv("CONTEXTUAL_AI_API_KEY"):
    os.environ["CONTEXTUAL_AI_API_KEY"] = getpass.getpass(
        "Enter your Contextual API key: "
    )
```

如果您希望自动追踪模型调用，也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### 安装

LangChain Contextual 集成位于 `langchain-contextual` 包中：

```python
pip install -qU langchain-contextual
```

## 实例化

现在我们可以实例化我们的模型对象并生成聊天补全。

聊天客户端可以使用以下附加设置进行实例化：

| 参数 | 类型 | 描述 | 默认值 |
|-----------|------|-------------|---------|
| temperature | Optional[float] | 采样温度，影响响应的随机性。请注意，较高的温度值可能会降低 groundedness（基于事实的程度）。 | 0 |
| top_p | Optional[float] | 用于核心采样的参数，是温度采样的替代方案，同样影响响应的随机性。请注意，较高的 top_p 值可能会降低 groundedness。 | 0.9 |
| max_new_tokens | Optional[int] | 模型在响应中可以生成的最大令牌数。最小值为 1，最大值为 2048。 | 1024 |

```python
from langchain_contextual import ChatContextual

llm = ChatContextual(
    model="v1",  # 默认为 `v1`
    api_key="",
    temperature=0,  # 默认为 0
    top_p=0.9,  # 默认为 0.9
    max_new_tokens=1024,  # 默认为 1024
)
```

## 调用

Contextual Grounded Language Model 在调用 `ChatContextual.invoke` 方法时接受额外的 `kwargs` 参数。

这些额外的输入是：

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| knowledge | list[str] | 必需：一个字符串列表，包含 Grounded Language Model 在生成响应时可以使用的知识源。 |
| system_prompt | Optional[str] | 可选：模型在生成响应时应遵循的指令。请注意，我们不保证模型会完全遵循这些指令。 |
| avoid_commentary | Optional[bool] | 可选（默认为 `False`）：指示模型是否应避免在响应中提供额外评论的标志。评论本质上是对话性的，不包含可验证的主张；因此，评论并不严格基于可用上下文。然而，评论可能提供有用的上下文，从而提高响应的帮助性。 |

```python
# 包含一个系统提示（可选）
system_prompt = "You are a helpful assistant that uses all of the provided knowledge to answer the user's query to the best of your ability."

# 在此处以字符串数组的形式提供您知识库中的知识
knowledge = [
    "There are 2 types of dogs in the world: good dogs and best dogs.",
    "There are 2 types of cats in the world: good cats and best cats.",
]

# 创建您的消息
messages = [
    ("human", "What type of cats are there in the world and what are the types?"),
]

# 通过提供知识字符串、可选的系统提示来调用 GLM
# 如果您想关闭 GLM 的评论，请将 True 传递给 `avoid_commentary` 参数
ai_msg = llm.invoke(
    messages, knowledge=knowledge, system_prompt=system_prompt, avoid_commentary=True
)

print(ai_msg.content)
```

## 链式调用

我们可以将 Contextual Model 与输出解析器进行链式调用。

```python
from langchain_core.output_parsers import StrOutputParser

chain = llm | StrOutputParser

chain.invoke(
    messages, knowledge=knowledge, systemp_prompt=system_prompt, avoid_commentary=True
)
```

---

## API 参考

有关 ChatContextual 所有功能和配置的详细文档，请前往 GitHub 页面：[github.com/ContextualAI//langchain-contextual](https://github.com/ContextualAI//langchain-contextual)
