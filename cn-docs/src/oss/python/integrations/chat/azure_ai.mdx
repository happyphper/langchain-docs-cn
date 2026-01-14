---
title: Azure AI 聊天补全模型
---
本文将帮助你开始使用 AzureAIChatCompletionsModel [聊天模型](/oss/langchain/models)。有关 AzureAIChatCompletionsModel 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/azure_ai/chat_models/langchain_azure_ai.chat_models.AzureAIChatCompletionsModel.html)。

AzureAIChatCompletionsModel 类使用 Azure AI Foundry SDK。AI Foundry 提供了多种聊天模型，包括 AzureOpenAI、Cohere、Llama、Phi-3/4 和 DeepSeek-R1 等。你可以在 [Azure 文档](https://learn.microsoft.com/azure/ai-studio/how-to/model-catalog-overview) 中找到有关其最新模型及其成本、上下文窗口和支持的输入类型的信息。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [JS 支持](https://v03.api.js.langchain.com/classes/_langchain_openai.AzureChatOpenAI.html) | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [AzureAIChatCompletionsModel](https://python.langchain.com/api_reference/azure_ai/chat_models/langchain_azure_ai.chat_models.AzureAIChatCompletionsModel.html) | [langchain-azure-ai](https://python.langchain.com/api_reference/langchain_azure_ai/index.html) | ✅ | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-azure-ai?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-azure-ai?style=flat-square&label=%20) |

### 模型功能

| [工具调用](/oss/langchain/tools) | [结构化输出](/oss/langchain/structured-output) | [图像输入](/oss/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/langchain/models#token-usage) | [对数概率](/oss/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅|

## 设置

要访问 AzureAIChatCompletionsModel 模型，你需要创建一个 [Azure 账户](https://azure.microsoft.com/pricing/purchase-options/azure-account)，获取 API 密钥，并安装 `langchain-azure-ai` 集成包。

### 凭据

请前往 [Azure 文档](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/develop/sdk-overview?tabs=sync&pivots=programming-language-python) 查看如何创建部署并生成 API 密钥。模型部署完成后，在 AI Foundry 中点击“获取端点”按钮。这将显示你的端点和 API 密钥。完成此操作后，设置 `AZURE_AI_CREDENTIAL` 和 `AZURE_AI_ENDPOINT` 环境变量：

```python
import getpass
import os

if not os.getenv("AZURE_AI_CREDENTIAL"):
    os.environ["AZURE_AI_CREDENTIAL"] = getpass.getpass(
        "Enter your AzureAIChatCompletionsModel API key: "
    )

if not os.getenv("AZURE_AI_ENDPOINT"):
    os.environ["AZURE_AI_ENDPOINT"] = getpass.getpass(
        "Enter your model endpoint: "
    )
```

如果你想自动追踪模型调用，还可以通过取消注释以下代码来设置你的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### 安装

LangChain AzureAIChatCompletionsModel 集成位于 `langchain-azure-ai` 包中：

```python
pip install -qU langchain-azure-ai
```

## 实例化

现在我们可以实例化模型对象并生成聊天补全：

```python
from langchain_azure_ai.chat_models import AzureAIChatCompletionsModel

llm = AzureAIChatCompletionsModel(
    model_name="gpt-4",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
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
AIMessage(content="J'adore programmer.", additional_kwargs={}, response_metadata={'model': 'gpt-4o-2024-05-13', 'token_usage': {'input_tokens': 31, 'output_tokens': 4, 'total_tokens': 35}, 'finish_reason': 'stop'}, id='run-c082dffd-b1de-4b3f-943f-863836663ddb-0', usage_metadata={'input_tokens': 31, 'output_tokens': 4, 'total_tokens': 35})
```

```python
print(ai_msg.content)
```

```text
J'adore programmer.
```

---

## API 参考

有关 AzureAIChatCompletionsModel 所有功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/azure_ai/chat_models/langchain_azure_ai.chat_models.AzureAIChatCompletionsModel.html](https://python.langchain.com/api_reference/azure_ai/chat_models/langchain_azure_ai.chat_models.AzureAIChatCompletionsModel.html)
