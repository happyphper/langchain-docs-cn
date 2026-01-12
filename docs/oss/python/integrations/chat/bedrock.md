---
title: ChatBedrock
---
本文档将帮助您开始使用 AWS Bedrock [聊天模型](/oss/python/langchain/models)。Amazon Bedrock 是一项完全托管的服务，通过单一 API 提供来自领先 AI 公司（如 AI21 Labs、Anthropic、Cohere、Meta、Stability AI 和 Amazon）的高性能基础模型（FMs）选择，以及构建具有安全性、隐私性和负责任 AI 的生成式 AI 应用程序所需的一系列广泛功能。使用 Amazon Bedrock，您可以轻松地针对您的用例试验和评估顶级 FMs，使用微调和检索增强生成（RAG）等技术利用您的数据对其进行私有化定制，并构建利用您的企业系统和数据源执行任务的智能体。由于 Amazon Bedrock 是无服务器的，您无需管理任何基础设施，并且可以使用您已经熟悉的 AWS 服务，安全地将生成式 AI 功能集成并部署到您的应用程序中。

AWS Bedrock 维护一个 [Converse API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)，它为 Bedrock 模型提供了统一的对话接口。此 API 目前尚不支持自定义模型。您可以在此处查看所有[支持的模型列表](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html)。

<Info>

<strong>对于不需要使用自定义模型的用户，我们推荐使用 Converse API。可以通过 [ChatBedrockConverse](https://python.langchain.com/api_reference/aws/chat_models/langchain_aws.chat_models.bedrock_converse.ChatBedrockConverse.html) 访问。</strong>

</Info>

有关所有 Bedrock 功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/aws/chat_models/langchain_aws.chat_models.bedrock_converse.ChatBedrockConverse.html)。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [JS 支持](https://js.langchain.com/docs/integrations/chat/bedrock) | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [ChatBedrock](https://python.langchain.com/api_reference/aws/chat_models/langchain_aws.chat_models.bedrock.ChatBedrock.html) | [langchain-aws](https://python.langchain.com/api_reference/aws/index.html) | beta | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-aws?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-aws?style=flat-square&label=%20) |
| [ChatBedrockConverse](https://python.langchain.com/api_reference/aws/chat_models/langchain_aws.chat_models.bedrock_converse.ChatBedrockConverse.html) | [langchain-aws](https://python.langchain.com/api_reference/aws/index.html) | beta | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-aws?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-aws?style=flat-square&label=%20) |

### 模型功能

以下内容适用于 `ChatBedrock` 和 `ChatBedrockConverse`。

| [工具调用](/oss/python/langchain/tools) | [结构化输出](/oss/python/langchain/structured-output) | [图像输入](/oss/python/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/python/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/python/langchain/models#token-usage) | [对数概率](/oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |

## 设置

要访问 Bedrock 模型，您需要创建一个 AWS 账户，设置 Bedrock API 服务，获取访问密钥 ID 和密钥，并安装 `langchain-aws` 集成包。

### 凭证

请前往 [AWS 文档](https://docs.aws.amazon.com/bedrock/latest/userguide/setting-up.html) 注册 AWS 并设置您的凭证。

或者，`ChatBedrockConverse` 默认会从以下环境变量中读取：

```python
# os.environ["AWS_ACCESS_KEY_ID"] = "..."
# os.environ["AWS_SECRET_ACCESS_KEY"] = "..."

# 除非使用临时凭证，否则不需要。
# os.environ["AWS_SESSION_TOKEN"] = "..."
```

您还需要为您的账户启用模型访问权限，您可以按照[这些说明](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html)进行操作。

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

LangChain Bedrock 集成位于 `langchain-aws` 包中：

```python
pip install -qU langchain-aws
```

## 实例化

现在我们可以实例化我们的模型对象并生成聊天补全：

```python
from langchain_aws import ChatBedrockConverse

llm = ChatBedrockConverse(
    model_id="anthropic.claude-3-5-sonnet-20240620-v1:0",
    # region_name=...,
    # aws_access_key_id=...,
    # aws_secret_access_key=...,
    # aws_session_token=...,
    # temperature=...,
    # max_tokens=...,
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
AIMessage(content="J'adore la programmation.", additional_kwargs={}, response_metadata={'ResponseMetadata': {'RequestId': 'b07d1630-06f2-44b1-82bf-e82538dd2215', 'HTTPStatusCode': 200, 'HTTPHeaders': {'date': 'Wed, 16 Apr 2025 19:35:34 GMT', 'content-type': 'application/json', 'content-length': '206', 'connection': 'keep-alive', 'x-amzn-requestid': 'b07d1630-06f2-44b1-82bf-e82538dd2215'}, 'RetryAttempts': 0}, 'stopReason': 'end_turn', 'metrics': {'latencyMs': [488]}, 'model_name': 'anthropic.claude-3-5-sonnet-20240620-v1:0'}, id='run-d09ed928-146a-4336-b1fd-b63c9e623494-0', usage_metadata={'input_tokens': 29, 'output_tokens': 11, 'total_tokens': 40, 'input_token_details': {'cache_creation': 0, 'cache_read': 0}})
```

```python
print(ai_msg.content)
```

```text
J'adore la programmation.
```

### 流式传输

请注意，`ChatBedrockConverse` 在流式传输时会发出内容块：

```python
for chunk in llm.stream(messages):
    print(chunk)
```

```text
content=[] additional_kwargs={} response_metadata={} id='run-d0e0836e-7146-4c3d-97c7-ad23dac6febd'
content=[{'type': 'text', 'text': 'J', 'index': 0}] additional_kwargs={} response_metadata={} id='run-d0e0836e-7146-4c3d-97c7-ad23dac6febd'
content=[{'type': 'text', 'text': "'adore la", 'index': 0}] additional_kwargs={} response_metadata={} id='run-d0e0836e-7146-4c3d-97c7-ad23dac6febd'
content=[{'type': 'text', 'text': ' programmation.', 'index': 0}] additional_kwargs={} response_metadata={} id='run-d0e0836e-7146-4c3d-97c7-ad23dac6febd'
content=[{'index': 0}] additional_kwargs={} response_metadata={} id='run-d0e0836e-7146-4c3d-97c7-ad23dac6febd'
content=[] additional_kwargs={} response_metadata={'stopReason': 'end_turn'} id='run-d0e0836e-7146-4c3d-97c7-ad23dac6febd'
content=[] additional_kwargs={} response_metadata={'metrics': {'latencyMs': 600}, 'model_name': 'anthropic.claude-3-5-sonnet-20240620-v1:0'} id='run-d0e0836e-7146-4c3d-97c7-ad23dac6febd' usage_metadata={'input_tokens': 29, 'output_tokens': 11, 'total_tokens': 40, 'input_token_details': {'cache_creation': 0, 'cache_read': 0}}
```

您可以使用输出上的 [.text](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html#langchain_core.messages.ai.AIMessage.text) 属性过滤出文本：

```python
for chunk in llm.stream(messages):
    print(chunk.text, end="|")
```

```text
|J|'adore la| programmation.||||
```

## 扩展思考

本指南重点介绍如何使用 AWS Bedrock 和 LangChain 的 `ChatBedrockConverse` 集成来实现扩展思考。

### 支持的模型

扩展思考可用于 AWS Bedrock 上的以下 Claude 模型：

| 模型 | 模型 ID |
|-------|----------|
| **Claude Opus 4** | `anthropic.claude-opus-4-20250514-v1:0` |
| **Claude Sonnet 4** | `us.anthropic.claude-sonnet-4-20250514-v1:0` |
| **Claude 3.7 Sonnet** | `us.anthropic.claude-3-7-sonnet-20250219-v1:0` |

```python
from langchain_aws import ChatBedrockConverse

llm = ChatBedrockConverse(
    model_id="us.anthropic.claude-sonnet-4-20250514-v1:0",
    region_name="us-west-2",
    max_tokens=4096,
    additional_model_request_fields={
        "thinking": {"type": "enabled", "budget_tokens": 1024},
    },
)

ai_msg = llm.invoke(messages)
ai_msg.content_blocks
```

```text
[{'type': 'reasoning',
  'reasoning': 'The user wants me to translate "I love programming" from English to French.\n\n"I love" translates to "J\'aime" in French.\n"Programming" translates to "la programmation" in French.\n\nSo the full translation would be "J\'aime la programmation."',
  'extras': {'signature': 'EpkDCkgIBxABGAIqQGI0KGz8LoVaFwqSAYPN7N+FecI1ZGtb0zpfPr5F8Sb1yxtQHQlmbKUS8JByenWCFGpRKigNaQh1+rLZ59GEX/sSDB+6gxZAT24DJrq4pxoMySVhzwALI6FEC+1UIjDcozOIznjRTYlDWPcYUNYvpt8rwF9IHE38Ha2uqVY8ROJa1tjOMk3OEnbSoV13Pa8q/gETsz+1UwxNX5tgxOa+38jLEryhdFyyAk2JDLrmluZBM6TMrtyzALQvVbZqjpkKAXdtcVCrsz8zUo/LZT1B/92Ukux2dE0O1ZOdcW3tORK+NFLSBaWuqigcFUTDH9XNQoHd2WpQNhl+ypnCItbL2wDRscN/tEBkgGMQugvPmL0LAuLKBmsRKStKRi/RMYGJb3Ft2yEDsRnYNJBJ6TtgxXFvjDwqc/UaI9cIcTxdoVVlsPFsYccpVwirzwAOiz6CSQ1oOQTYJVT90eQ71QW74n1ubbFIZAvDBKk0KG8jK1FGx4FpuuZyFhBpXtfrgOCdrlVSAO/EE9fKCbP9FlhPbRgB'}},
 {'type': 'text', 'text': "J'aime la programmation."}]
```

### 扩展思考的工作原理

当启用扩展思考时，Claude 会创建思考内容块，在其中输出其内部推理。Claude 在构建最终响应之前会结合这些推理的见解。API 响应将包含思考内容块，然后是文本内容块。

```python
next_messages = messages + [("ai", ai_msg.content), ("human", "I love AI")]

ai_msg = llm.invoke(next_messages)
ai_msg.content_blocks
```

```text
[{'type': 'reasoning',
  'reasoning': 'The user wants me to translate "I love AI" from English to French. \n\n"I love" translates to "J\'aime" in French.\n"AI" stands for "Artificial Intelligence" which in French is "Intelligence Artificielle" or "IA" (the French abbreviation).\n\nSo the translation would be "J\'aime l\'IA" or "J\'aime l\'intelligence artificielle".\n\nI think using the abbreviation "IA" would be more natural and concise, similar to how the user used "AI" in English.',
  'extras': {'signature': 'EuAECkgIBxABGAIqQLWbkzJ8RzfxhVN1BhfRj5+On8/M9Utt0yH9kvj9P2zlQkO5xloq6I/AiEeArwwdJeqJVcLRjqLtinh6HIBbSDwSDFwt0GL409TqjSZNBhoMPQtJdZmx/uiPrLHUIjCJXyyjgSK3vzbcSEnsvo7pdpoo+waUFrAPDCGL/CIN5u7c8ueLCuCn8W0qGGc+BNgqxQO6UbV11RnMdnUyFmVgTPJErfzBr6U6KyUHd5dJmFWIUVpbbxT2C9vawpbKMPThaRW3BhItEafWGUpPqztzFhqJpSegXtXehIn5iY4yHzTUZ5FPdkNIuAmTsFNNGxiKr9H/gqknvQ2B7I4ushRHLg+drU4cH18EGZlAo5Tu1O9yH5GbweIEew4Uv7oWje+R8TIku0OFVhrbnQqqqukBicMV2JRifUYuz6dYM1UDYS8SfxQ1MmcVY5t1L9LDpoL4F/CtpL8/6YDsB/FosU37Qc1qm+D+pKEPTYnyxaP5tRXqTBfqUIiNJGqr9Egl17Akoy6NIv234rPfuf8HjTcu5scZoPGhOreG5rWxJ7AbTCIXgGWqpcf2TqDtniOac3jW4OtnlID9fsloKNq6Y5twgXHDR47c4Jh6vWmucZiIlL6hkklQzt5To6vOnqcTOGUtuCis8Y2wRzlNGeR2d8A+ocYm7mBvR/Y5DvDgstJwB/vCLoQlIL+jm6+h8k6EX/24GqOsh5hxsS5IsNIob/p8tr4TBbc9noCoUSYkMhbQPi2xpRrNML9GUIo7Skbh1ni67uqeShj1xuUrFG+cN6x4yzDaRb59LCAYAQ=='}},
 {'type': 'text', 'text': "J'aime l'IA."}]
```

## 提示词缓存

Bedrock 支持对提示词元素（包括消息和工具）进行[缓存](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)。这允许您重用大型文档、指令、[少样本文档](/langsmith/create-few-shot-evaluators)和其他数据，以减少延迟和成本。

<Note>

<strong>并非所有模型都支持提示词缓存。请在此处查看[支持的模型](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html#prompt-caching-models)。</strong>

</Note>

要在提示词的某个元素上启用缓存，请使用 `cachePoint` 键标记其关联的内容块。请参见下面的示例：

```python
import requests
from langchain_aws import ChatBedrockConverse

llm = ChatBedrockConverse(model="us.anthropic.claude-sonnet-4-5-20250929-v1:0")

# 拉取
