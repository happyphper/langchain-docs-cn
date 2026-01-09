---
title: Friendli AI
---
> [FriendliAI](https://friendli.ai/) 通过可扩展、高效的部署选项，提升 AI 应用性能并优化成本节约，专为高需求的 AI 工作负载量身定制。

## 安装与设置

安装 `friendli-client` Python 包。

::: code-group

```bash [pip]
pip install -U langchain_community friendli-client
```

```bash [uv]
uv add langchain_community friendli-client
```

:::

登录 [Friendli Suite](https://suite.friendli.ai/) 创建个人访问令牌，并将其设置为 `FRIENDLI_TOKEN` 环境变量。

## 聊天模型

查看[使用示例](/oss/integrations/chat/friendli)。

```python
from langchain_community.chat_models.friendli import ChatFriendli

chat = ChatFriendli(model='meta-llama-3.1-8b-instruct')

for m in chat.stream("Tell me fun things to do in NYC"):
    print(m.content, end="", flush=True)
```

## 大语言模型

查看[使用示例](/oss/integrations/llms/friendli)。

```python
from langchain_community.llms.friendli import Friendli

llm = Friendli(model='meta-llama-3.1-8b-instruct')

print(llm.invoke("def bubble_sort(): "))
```
