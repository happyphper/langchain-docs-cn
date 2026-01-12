---
title: Baseten
---
>[Baseten](https://baseten.co) 提供部署和提供 ML 模型所需的所有基础设施，确保高性能、可靠性和可扩展性。

>作为模型推理平台，`Baseten` 是 LangChain 生态系统中的一个 `Provider`。
`Baseten` 集成目前实现了 `Chat Models` 和 `Embeddings` 组件。

>`Baseten` 允许您通过指定 `model` [slug](https://docs.baseten.co/development/model-apis/overview#supported-models) 来访问开源模型（如 Kimi K2 或 GPT OSS）的模型 API，并通过指定 `model_url` 在专用 GPU 上运行专有或微调模型的专用部署。

## 安装与设置

要在 LangChain 中使用 Baseten 模型，您需要两样东西：

* 一个 [Baseten 账户](https://baseten.co)
* 一个 [API 密钥](https://docs.baseten.co/observability/api-keys)

将您的 API 密钥导出为名为 `BASETEN_API_KEY` 的环境变量。

```sh
export BASETEN_API_KEY="paste_your_api_key_here"
```

## 聊天模型（模型 API 与专用部署）

查看[使用示例](/oss/python/integrations/chat/baseten)。

```python
from langchain_baseten import ChatBaseten
```

## 嵌入模型（仅限专用部署）

查看[使用示例](/oss/python/integrations/text_embedding/baseten)。

```python
from langchain_baseten import BasetenEmbeddings
```
