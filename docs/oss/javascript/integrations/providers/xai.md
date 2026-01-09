---
title: xAI
---

<Warning>

本页面提及的是由 [xAI](https://docs.x.ai/docs/overview) 提供的 Grok 模型——请勿与另一家独立的 AI 硬件和软件公司 [Groq](https://console.groq.com/docs/overview) 混淆。详情请参阅 [Groq 供应商页面](/oss/integrations/providers/groq)。

</Warning>

[xAI](https://console.x.ai) 提供了与 Grok 模型交互的 API。本示例将介绍如何使用 LangChain 与 xAI 模型进行交互。

## 安装

```python
pip install -U langchain-xai
```

## 环境配置

要使用 xAI，您需要 [创建一个 API 密钥](https://console.x.ai/)。该 API 密钥可以作为初始化参数 `xai_api_key` 传入，或设置为环境变量 `XAI_API_KEY`。

## 示例

有关详细信息和受支持的功能，请参阅 [ChatXAI 文档](/oss/integrations/chat/xai)。

```python
# 使用 xAI 查询聊天模型

from langchain_xai import ChatXAI

chat = ChatXAI(
    # xai_api_key="YOUR_API_KEY",
    model="grok-4",
)

# 从模型流式获取响应
for m in chat.stream("Tell me fun things to do in NYC"):
    print(m.content, end="", flush=True)

# 如果您不想使用流式传输，可以使用 invoke 方法
# chat.invoke("Tell me fun things to do in NYC")
```
