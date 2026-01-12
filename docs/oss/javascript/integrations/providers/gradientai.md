---
title: DigitalOcean Gradient AI 平台
---
这将帮助您开始使用 DigitalOcean Gradient [聊天模型](/oss/javascript/langchain/models)。

## 概述
### 集成详情

| 类 | 包 | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |
| [ChatGradient](https://python.langchain.com/api_reference/langchain-gradient/chat_models/langchain_gradient.chat_models.ChatGradient.html) | [langchain-gradient](https://python.langchain.com/api_reference/langchain-gradient/) | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-gradient?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-gradient?style=flat-square&label=%20) |

## 设置

langchain-gradient 使用 DigitalOcean Gradient 平台。

在 DigitalOcean 上创建一个账户，从 Gradient 平台获取一个 `DIGITALOCEAN_INFERENCE_KEY` API 密钥，并安装 `langchain-gradient` 集成包。

### 凭证

前往 [DigitalOcean Gradient](https://www.digitalocean.com/products/gradient)

1.  注册/登录 DigitalOcean 云控制台
2.  进入 Gradient 平台并导航到 Serverless Inference。
3.  点击 Create model access key，输入一个名称，然后创建密钥。

完成此操作后，设置 `DIGITALOCEAN_INFERENCE_KEY` 环境变量：

```python
import os
os.environ["DIGITALOCEAN_INFERENCE_KEY"] = "your-api-key"
```

### 安装

LangChain Gradient 集成位于 `langchain-gradient` 包中：

::: code-group

```bash [pip]
pip install -qU langchain-gradient
```

```bash [uv]
uv add langchain-gradient
```

:::

## 实例化

```python
from langchain_gradient import ChatGradient

llm = ChatGradient(
    model="llama3.3-70b-instruct",
    api_key=os.environ.get("DIGITALOCEAN_INFERENCE_KEY")
)
```

## 调用

```python
messages = [
    (
        "system",
        "You are a creative storyteller. Continue any story prompt you receive in an engaging and imaginative way.",
    ),
    ("human", "Once upon a time, in a village at the edge of a mysterious forest, a young girl named Mira found a glowing stone..."),
]
ai_msg = llm.invoke(messages)
ai_msg
print(ai_msg.content)
```

## 链式调用

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate(
    [
        (
            "system",
            "You are a knowledgeable assistant. Carefully read the provided context and answer the user's question. If the answer is present in the context, cite the relevant sentence. If not, reply with \"Not found in context.\"",
        ),
        ("human", "Context: {context}\nQuestion: {question}"),
    ]
)

chain = prompt | llm
chain.invoke(
    {
        "context": (
            "The Eiffel Tower is located in Paris and was completed in 1889. "
            "It was designed by Gustave Eiffel's engineering company. "
            "The tower is one of the most recognizable structures in the world. "
            "The Statue of Liberty was a gift from France to the United States."
        ),
        "question": "Who designed the Eiffel Tower and when was it completed?"
    }
)
```
