---
title: Discord
---
> [Discord](https://discord.com/) 是一个即时通讯、语音和视频交流平台，被各类社区广泛使用。

## 安装与设置

安装 `langchain-discord-shikenso` 包：

::: code-group

```bash [pip]
pip install langchain-discord-shikenso
```

```bash [uv]
uv add langchain-discord-shikenso
```

:::

你必须通过环境变量提供一个机器人令牌，以便工具能够通过 Discord API 进行身份验证：

```bash
export DISCORD_BOT_TOKEN="your-discord-bot-token"
```

如果未设置 `DISCORD_BOT_TOKEN`，工具在实例化时会抛出 `ValueError` 错误。

---

## 工具

以下代码片段展示了如何在 Discord 中读取和发送消息。更多详细信息，请参阅 [Discord 工具文档](/oss/integrations/tools/discord)。

```python
from langchain_discord.tools.discord_read_messages import DiscordReadMessages
from langchain_discord.tools.discord_send_messages import DiscordSendMessage

# 创建工具实例
read_tool = DiscordReadMessages()
send_tool = DiscordSendMessage()

# 示例：从频道 1234567890 读取最后 3 条消息
read_result = read_tool({"channel_id": "1234567890", "limit": 3})
print(read_result)

# 示例：向频道 1234567890 发送一条消息
send_result = send_tool({"channel_id": "1234567890", "message": "Hello from Markdown example!"})
print(send_result)
```

---

## 工具包

`DiscordToolkit` 将多个与 Discord 相关的工具分组到一个统一的接口中。使用示例请参阅 [Discord 工具包文档](/oss/integrations/tools/discord)。

```python
from langchain_discord.toolkits import DiscordToolkit

toolkit = DiscordToolkit()
tools = toolkit.get_tools()

read_tool = tools[0]  # DiscordReadMessages
send_tool = tools[1]  # DiscordSendMessage
```

---

## 未来集成

未来可能会为 Discord 添加更多集成（例如，文档加载器、聊天加载器）。
更多信息请查阅 [Discord 开发者文档](https://discord.com/developers/docs/intro)，并关注 [langchain_discord GitHub 仓库](https://github.com/Shikenso-Analytics/langchain-discord) 的更新或高级用法示例。
