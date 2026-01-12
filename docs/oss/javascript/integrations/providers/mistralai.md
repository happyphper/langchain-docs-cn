---
title: MistralAI
---
>[Mistral AI](https://docs.mistral.ai/api/) 是一个提供其强大开源模型托管服务的平台。

## 安装与设置

需要一个有效的 [API 密钥](https://console.mistral.ai/users/api-keys/) 才能与 API 进行通信。

您还需要安装 `langchain-mistralai` 包：

::: code-group

```bash [pip]
pip install langchain-mistralai
```

```bash [uv]
uv add langchain-mistralai
```

:::

## 聊天模型

### ChatMistralAI

查看 [使用示例](/oss/javascript/integrations/chat/mistralai)。

```python
from langchain_mistralai.chat_models import ChatMistralAI
```

## 嵌入模型

### MistralAIEmbeddings

查看 [使用示例](/oss/javascript/integrations/text_embedding/mistralai)。

```python
from langchain_mistralai import MistralAIEmbeddings
```
