---
title: ChatBaseten
---
本指南提供了快速入门 Baseten [聊天模型](/oss/langchain/models) 的概述。如需查看 ChatBaseten 所有功能、参数和配置的详细列表，请前往 [ChatBaseten API 参考](https://python.langchain.com/api_reference/baseten/chat_models/langchain_baseten.chat_models.ChatBaseten.html)。

Baseten 提供专为生产应用设计的推理服务。这些 API 构建在 Baseten 推理栈之上，为领先的开源或自定义模型提供企业级的性能和可靠性：https://www.baseten.co/library/。

## 概述

### 详情

| 类 | 包 | 可序列化 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [ChatBaseten](https://python.langchain.com/api_reference/baseten/chat_models/langchain_baseten.chat_models.ChatBaseten.html) | [langchain-baseten](https://python.langchain.com/api_reference/baseten/index.html) | beta | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-baseten?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-baseten?style=flat-square&label=%20) |

### 功能

| [工具调用](/oss/langchain/tools) | [结构化输出](/oss/langchain/structured-output) | [图像输入](/oss/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/langchain/models#token-usage) | [对数概率](/oss/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |

模型 API 仅支持文本输入，而某些专用部署根据模型可能支持图像和音频输入。详情请查看 Baseten 模型库：https://www.baseten.co/library/

---

## 设置

要访问 Baseten 模型，您需要创建一个 Baseten 账户，获取 API 密钥，并安装 `langchain-baseten` 集成包。

前往 [此页面](https://app.baseten.co) 创建 Baseten 账户并生成 API 密钥。完成后，设置 BASETEN_API_KEY 环境变量：

### 凭证

```python Set API key icon="key"
import getpass
import os

if "BASETEN_API_KEY" not in os.environ:
    os.environ["BASETEN_API_KEY"] = getpass.getpass("Enter your Baseten API key: ")
```

要启用模型调用的自动化 <Tooltip tip="记录模型执行的每一步以进行调试和改进">追踪</Tooltip>，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python Enable tracing icon="flask"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

LangChain Baseten 集成位于 `langchain-baseten` 包中：

::: code-group

```python [pip]
pip install -U langchain-baseten
```
```python [uv]
uv add langchain-baseten
```

:::

---

## 实例化

Baseten 提供两种访问聊天模型的方式：

1.  **模型 API**：用于访问最新、最受欢迎的开源模型。
2.  **专用 URL**：使用具有专用资源的特定模型部署。

两种方式都支持自动端点规范化。

```python Initialize with model slug icon="robot"
from langchain_baseten import ChatBaseten

# 选项 1：使用模型 API 和模型标识符
model = ChatBaseten(
    model="moonshotai/Kimi-K2-Instruct-0905",  # 从可用的模型标识符中选择：https://docs.baseten.co/development/model-apis/overview#supported-models
    api_key="your-api-key",  # 或设置 BASETEN_API_KEY 环境变量
)
```

```python Initialize with model URL icon="link"
from langchain_baseten import ChatBaseten

# 选项 2：使用专用部署和模型 URL
model = ChatBaseten(
    model_url="https://model-<id>.api.baseten.co/environments/production/predict",
    api_key="your-api-key",  # 或设置 BASETEN_API_KEY 环境变量
)
```

---

## 调用

```python Basic invocation icon="play"
# 使用聊天模型
response = model.invoke("Hello, how are you?")
print(response.content)
```

```text
content="Hello! I'm doing well, thank you for asking! How about you?" additional_kwargs={} response_metadata={'finish_reason': 'stop'} id='run--908651ec-00d7-4992-a320-864397c14e37-0'
```

您也可以使用消息对象进行更复杂的对话：

::: code-group

```python Dictionary format icon="book"
messages = [
    {"role": "system", "content": "You are a poetry expert"},
    {"role": "user", "content": "Write a haiku about spring"},
]
response = model.invoke(messages)
print(response)
```

:::

```text
content='Buds yawn open wide—  \na robin stitches the hush  \nwith threads of first light.' additional_kwargs={} response_metadata={'finish_reason': 'stop'} id='run--6f7d1db7-daae-4628-a40a-2ab7323e8f15-0'
```

<Tip>

关于 [聊天模型调用类型](/oss/langchain/models#invocation)、[消息类型](/oss/langchain/messages#message-types) 和 [内容块](/oss/langchain/messages#standard-content-blocks) 的完整指南可供查阅。

</Tip>

---

## API 参考

有关 ChatBaseten 所有功能和配置的详细文档，请前往 [API 参考](https://python.langchain.com/api_reference/baseten/chat_models/langchain_baseten.chat_models.ChatBaseten.html)。
