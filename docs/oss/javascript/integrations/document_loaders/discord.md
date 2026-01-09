---
title: Discord
---
>[Discord](https://discord.com/) 是一个 VoIP 和即时通讯社交平台。用户可以通过语音通话、视频通话、文本消息、媒体和文件在私聊中或作为名为“服务器”的社区的一部分进行交流。服务器是一组持久的聊天室和语音频道，可以通过邀请链接访问。

请按照以下步骤下载您的 `Discord` 数据：

1.  前往您的 **用户设置**
2.  然后进入 **隐私与安全**
3.  找到 **请求我的所有数据** 并点击 **请求数据** 按钮

您可能需要等待 30 天才能收到您的数据。您将在与 Discord 注册的邮箱地址收到一封电子邮件。该邮件将包含一个下载按钮，您可以使用它来下载您的个人 Discord 数据。

```python
import os

import pandas as pd
```

```python
path = input('Please enter the path to the contents of the Discord "messages" folder: ')
li = []
for f in os.listdir(path):
    expected_csv_path = os.path.join(path, f, "messages.csv")
    csv_exists = os.path.isfile(expected_csv_path)
    if csv_exists:
        df = pd.read_csv(expected_csv_path, index_col=None, header=0)
        li.append(df)

df = pd.concat(li, axis=0, ignore_index=True, sort=False)
```

```python
from langchain_community.document_loaders.discord import DiscordChatLoader
```

```python
loader = DiscordChatLoader(df, user_id_col="ID")
print(loader.load())
```
