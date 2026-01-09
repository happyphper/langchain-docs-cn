---
title: IFTTT WebHooks
---
本笔记本展示了如何使用 IFTTT Webhooks。

来自 [github.com/SidU/teams-langchain-js/wiki/Connecting-IFTTT-Services](https://github.com/SidU/teams-langchain-js/wiki/Connecting-IFTTT-Services)。

## 创建 Webhook

- 访问 [ifttt.com/create](https://ifttt.com/create)

## 配置 "If This"（如果这样）

- 在 IFTTT 界面中点击 "If This" 按钮。
- 在搜索栏中搜索 "Webhooks"。
- 选择第一个选项："Receive a web request with a JSON payload"（接收带有 JSON 负载的 Web 请求）。
- 选择一个与你计划连接的服务相关的特定事件名称。
  这将使你更容易管理 Webhook URL。
  例如，如果你要连接到 Spotify，可以使用 "Spotify" 作为事件名称。
- 点击 "Create Trigger" 按钮保存设置并创建你的 Webhook。

## 配置 "Then That"（那么就那样）

- 在 IFTTT 界面中点击 "Then That" 按钮。
- 搜索你想要连接的服务，例如 Spotify。
- 从该服务中选择一个操作，例如 "Add track to a playlist"（将曲目添加到播放列表）。
- 通过指定必要的详细信息来配置操作，例如播放列表名称（例如："Songs from AI"）。
- 在你的操作中引用 Webhook 接收到的 JSON 负载。对于 Spotify 场景，选择 <code v-pre>{{JsonPayload}}</code> 作为你的搜索查询。
- 点击 "Create Action" 按钮保存你的操作设置。
- 配置完操作后，点击 "Finish" 按钮完成设置。
- 恭喜！你已成功将 Webhook 连接到所需的服务，可以开始接收数据并触发操作了 🎉

## 完成设置

- 要获取你的 Webhook URL，请访问 [ifttt.com/maker_webhooks/settings](https://ifttt.com/maker_webhooks/settings)
- 从那里复制 IFTTT 密钥值。URL 的格式为 [maker.ifttt.com/use/YOUR_IFTTT_KEY](https://maker.ifttt.com/use/YOUR_IFTTT_KEY)。获取 YOUR_IFTTT_KEY 值。

```python
pip install -qU  langchain-community
```

```python
from langchain_community.tools.ifttt import IFTTTWebhook
```

```python
import os

key = os.environ["IFTTTKey"]
url = f"https://maker.ifttt.com/trigger/spotify/json/with/key/{key}"
tool = IFTTTWebhook(
    name="Spotify", description="Add a song to spotify playlist", url=url
)
```

```python
tool.run("taylor swift")
```

```text
"Congratulations! You've fired the spotify JSON event"
```

```python

```
