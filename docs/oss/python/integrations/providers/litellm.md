---
title: LiteLLM
---
>[LiteLLM](https://github.com/BerriAI/litellm) 是一个简化调用 Anthropic、Azure、Huggingface、Replicate 等服务的库。

## 安装与设置

::: code-group

```bash [pip]
pip install langchain-litellm
```

```bash [uv]
uv add langchain-litellm
```

:::

## 聊天模型

```python
from langchain_litellm import ChatLiteLLM
```

```python
from langchain_litellm import ChatLiteLLMRouter
```
更多详细信息请参阅指南[此处](/oss/python/integrations/chat/litellm)。

---

## API 参考
有关 `ChatLiteLLM` 和 `ChatLiteLLMRouter` 所有功能与配置的详细文档，请访问 API 参考：https://github.com/Akshay-Dongare/langchain-litellm
