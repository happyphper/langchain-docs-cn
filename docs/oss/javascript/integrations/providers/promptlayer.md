---
title: PromptLayer
---
>[PromptLayer](https://docs.promptlayer.com/introduction) 是一个用于提示词工程的平台。
> 它还能通过可视化请求、版本化提示词和追踪使用情况来帮助实现 LLM 的可观测性。
>
>虽然 `PromptLayer` 确实有直接与 LangChain 集成的 LLM（例如
> [`PromptLayerOpenAI`](https://docs.promptlayer.com/languages/langchain)），
> 但使用回调函数是 `PromptLayer` 与 LangChain 集成的推荐方式。

## 安装与设置

要使用 `PromptLayer`，我们需要：
- 创建一个 `PromptLayer` 账户
- 创建一个 API 令牌，并将其设置为环境变量 (`PROMPTLAYER_API_KEY`)

安装 Python 包：

::: code-group

```bash [pip]
pip install promptlayer
```

```bash [uv]
uv add promptlayer
```

:::

## 回调函数

查看[使用示例](/oss/javascript/integrations/callbacks/promptlayer)。

```python
import promptlayer  # 别忘了这个导入！
from langchain.callbacks import PromptLayerCallbackHandler
```

## LLM

查看[使用示例](/oss/javascript/integrations/llms/promptlayer_openai)。

```python
from langchain_community.llms import PromptLayerOpenAI
```

## 聊天模型

查看[使用示例](/oss/javascript/integrations/chat/promptlayer_chatopenai)。

```python
from langchain_community.chat_models import PromptLayerChatOpenAI
```
