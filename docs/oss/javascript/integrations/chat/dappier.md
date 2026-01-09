---
title: Dappier AI
---
**Dappier：以动态实时数据模型驱动人工智能**

Dappier 提供了一个前沿平台，让开发者能够即时访问涵盖新闻、娱乐、金融、市场数据、天气等领域的广泛实时数据模型。借助我们预训练的数据模型，您可以增强 AI 应用的能力，确保其提供精确、最新的响应，并减少错误。

Dappier 数据模型帮助您利用来自世界领先品牌的可靠、最新内容构建下一代 LLM 应用。通过简单的 API，将可操作的专有数据注入任何 GPT 应用或 AI 工作流，释放您的创造力并增强其功能。用来自可信来源的专有数据增强您的 AI，是确保无论面对何种问题都能获得基于事实、最新且幻觉更少的响应的最佳方式。

**为开发者而生，由开发者打造**
Dappier 专为开发者设计，简化了从数据集成到变现的旅程，提供了清晰、直接的路径来部署您的 AI 模型并从中获利。在 **[dappier.com/](https://dappier.com/)** 体验新互联网变现基础设施的未来。

本示例将介绍如何使用 LangChain 与 Dappier AI 模型进行交互。

-----------------------------------------------------------------------------------

要使用我们的 Dappier AI 数据模型，您需要一个 API 密钥。请访问 Dappier 平台 ([platform.dappier.com/](https://platform.dappier.com/)) 登录，并在您的个人资料中创建 API 密钥。

您可以在 API 参考中找到更多详细信息：[docs.dappier.com/introduction](https://docs.dappier.com/introduction)

要使用我们的 Dappier 聊天模型，您可以在初始化类时通过名为 `dappier_api_key` 的参数直接传递密钥，或将其设置为环境变量。

```bash
export DAPPIER_API_KEY="..."
```

```python
from langchain_community.chat_models.dappier import ChatDappierAI
from langchain.messages import HumanMessage
```

```python
chat = ChatDappierAI(
    dappier_endpoint="https://api.dappier.com/app/datamodelconversation",
    dappier_model="dm_01hpsxyfm2fwdt2zet9cg6fdxt",
    dappier_api_key="...",
)
```

```python
messages = [HumanMessage(content="Who won the super bowl in 2024?")]
chat.invoke(messages)
```

```text
AIMessage(content='Hey there! The Kansas City Chiefs won Super Bowl LVIII in 2024. They beat the San Francisco 49ers in overtime with a final score of 25-22. It was quite the game! 🏈')
```

```python
await chat.ainvoke(messages)
```

```text
AIMessage(content='The Kansas City Chiefs won Super Bowl LVIII in 2024! 🏈')
```

```python
```

```python

```
