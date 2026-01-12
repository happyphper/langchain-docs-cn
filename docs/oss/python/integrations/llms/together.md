---
title: Together AI
---

<Warning>

<strong>您当前正在查看的是关于将 Together AI 模型用作文本补全模型的文档页面。许多流行的 Together AI 模型是 [聊天补全模型](/oss/python/langchain/models)。</strong>

您可能正在寻找 [这个页面](/oss/python/integrations/chat/together/)。

</Warning>

[Together AI](https://www.together.ai/) 提供了一个 API，可以用几行代码查询 [50 多个领先的开源模型](https://docs.together.ai/docs/inference-models)。

本示例将介绍如何使用 LangChain 与 Together AI 模型进行交互。

## 安装

```python
pip install -U langchain-together
```

## 环境设置

要使用 Together AI，您需要一个 API 密钥，您可以在此处找到：
[api.together.ai/settings/api-keys](https://api.together.ai/settings/api-keys)。该密钥可以作为初始化参数 `together_api_key` 传入，或设置为环境变量 `TOGETHER_API_KEY`。

## 示例

```python
# 使用 Together AI 查询聊天模型

from langchain_together import ChatTogether

# 从我们的 50 多个模型中选择：https://docs.together.ai/docs/inference-models
chat = ChatTogether(
    # together_api_key="YOUR_API_KEY",
    model="meta-llama/Llama-3-70b-chat-hf",
)

# 从模型流式返回响应
for m in chat.stream("Tell me fun things to do in NYC"):
    print(m.content, end="", flush=True)

# 如果您不想使用流式处理，可以使用 invoke 方法
# chat.invoke("Tell me fun things to do in NYC")
```

```python
# 使用 Together AI 查询代码和语言模型

from langchain_together import Together

llm = Together(
    model="codellama/CodeLlama-70b-Python-hf",
    # together_api_key="..."
)

print(llm.invoke("def bubble_sort(): "))
```
