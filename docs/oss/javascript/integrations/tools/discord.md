---
title: Discord
---
本指南提供了在 [langchain_discord](/oss/javascript/integrations/tools/) 中使用 Discord 工具的快速入门概览。关于每个工具和配置的更多细节，请参阅您仓库中的文档字符串或相关文档页面。

## 概述

### 集成详情

| 类                                | 包                                                                 | 可序列化 | [JS 支持](https://js.langchain.com/docs/integrations/tools/langchain_discord) |                                             Version                                              |
| :---                                 |:------------------------------------------------------------------------| :---:        | :---:                                                                           |:-------------------------------------------------------------------------------------------------------:|
| `DiscordReadMessages`, `DiscordSendMessage` | [langchain-discord-shikenso](https://github.com/Shikenso-Analytics/langchain-discord) | N/A          | TBD                                                                             | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-discord-shikenso?style=flat-square&label=%20) |

### 工具特性

- **`DiscordReadMessages`**: 从指定频道读取消息。
- **`DiscordSendMessage`**: 向指定频道发送消息。

## 设置

该集成由 `langchain-discord-shikenso` 包提供。按如下方式安装：

```python
pip install --quiet -U langchain-discord-shikenso
```

### 凭证

此集成要求您将 `DISCORD_BOT_TOKEN` 设置为环境变量，以便通过 Discord API 进行身份验证。

```bash
export DISCORD_BOT_TOKEN="your-bot-token"
```

```python
import getpass
import os

# 如果尚未设置令牌，设置令牌的示例提示：
# if not os.environ.get("DISCORD_BOT_TOKEN"):
#     os.environ["DISCORD_BOT_TOKEN"] = getpass.getpass("DISCORD Bot Token:\n")
```

您可以选择性地设置 [LangSmith](https://smith.langchain.com/) 以进行追踪或可观测性：

```python
os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()
```

## 实例化

以下示例展示了如何在 `langchain_discord` 中实例化 Discord 工具。请根据您的具体使用情况进行调整。

```python
from langchain_discord.tools.discord_read_messages import DiscordReadMessages
from langchain_discord.tools.discord_send_messages import DiscordSendMessage

read_tool = DiscordReadMessages()
send_tool = DiscordSendMessage()

# 使用示例：
# response = read_tool({"channel_id": "1234567890", "limit": 5})
# print(response)
#
# send_result = send_tool({"message": "Hello from notebook!", "channel_id": "1234567890"})
# print(send_result)
```

## 调用

### 使用参数直接调用

以下是一个使用字典中的关键字参数调用工具的简单示例。

```python
invocation_args = {"channel_id": "1234567890", "limit": 3}
response = read_tool(invocation_args)
response
```

### 使用 ToolCall 调用

如果您有一个模型生成的 `ToolCall`，请按如下所示的格式将其传递给 `tool.invoke()`。

```python
tool_call = {
    "args": {"channel_id": "1234567890", "limit": 2},
    "id": "1",
    "name": read_tool.name,
    "type": "tool_call",
}

tool.invoke(tool_call)
```

## 链式调用

以下是一个更完整的示例，展示了如何在链或智能体（agent）中与 LLM 结合使用 `DiscordReadMessages` 和 `DiscordSendMessage` 工具。此示例假设您有一个函数（如 @[`create_agent`]）可以设置一个能够在适当时调用工具的 LangChain 风格智能体。

```python
# 示例：在智能体中使用 Discord 工具

from langchain.agents import create_agent
from langchain_discord.tools.discord_read_messages import DiscordReadMessages
from langchain_discord.tools.discord_send_messages import DiscordSendMessage

# 1. 实例化或配置您的语言模型
# (替换为您的实际 LLM，例如 ChatOpenAI(temperature=0))
model = ...

# 2. 创建 Discord 工具的实例
read_tool = DiscordReadMessages()
send_tool = DiscordSendMessage()

# 3. 构建一个可以访问这些工具的智能体
agent_executor = create_agent(model, [read_tool, send_tool])

# 4. 构建一个可能调用一个或两个工具的用户查询
example_query = "Please read the last 5 messages in channel 1234567890"

# 5. 以流式模式（或根据您的代码结构）执行智能体
events = agent_executor.stream(
    {"messages": [("user", example_query)]},
    stream_mode="values",
)

# 6. 打印模型响应（以及任何工具输出）
for event in events:
    event["messages"][-1].pretty_print()
```

---

## API 参考

请参阅以下文件中的文档字符串以获取使用详情、参数和高级配置：

- [discord_read_messages.py](https://github.com/Shikenso-Analytics/langchain-discord/blob/main/langchain_discord/tools/discord_read_messages.py)
- [discord_send_messages.py](https://github.com/Shikenso-Analytics/langchain-discord/blob/main/langchain_discord/tools/discord_send_messages.py)
- [toolkits.py](https://github.com/Shikenso-Analytics/langchain-discord/blob/main/langchain_discord/toolkits.py)
