---
title: Discord（社区加载器）
---
>[Discord](https://discord.com/) 是一个 VoIP 和即时通讯社交平台。用户能够通过语音通话、视频通话、文本消息、媒体和文件在私聊中或作为称为“服务器”的社区的一部分进行交流。服务器是一个由持久聊天室和语音频道组成的集合，可以通过邀请链接访问。

## 安装与设置

::: code-group

```bash [pip]
pip install pandas
```

```bash [uv]
uv add pandas
```

:::

按照以下步骤下载你的 `Discord` 数据：

1.  进入你的 **用户设置**
2.  然后进入 **隐私与安全**
3.  找到 **请求我的所有数据** 并点击 **请求数据** 按钮

你可能需要等待 30 天才能收到你的数据。你将在 Discord 注册的邮箱地址收到一封电子邮件。该邮件将包含一个下载按钮，你可以通过它下载你的个人 Discord 数据。

## 文档加载器

查看 [使用示例](/oss/python/integrations/document_loaders/discord)。

**注意：** `DiscordChatLoader` 不是 `ChatLoader`，而是一个 `DocumentLoader`。它用于从 `Discord` 数据转储中加载数据。关于 `ChatLoader`，请参阅下面的聊天加载器部分。

```python
from langchain_community.document_loaders import DiscordChatLoader
```
