---
title: Slack
---
本笔记本展示了如何使用 Slack 聊天加载器。该类帮助将导出的 Slack 对话映射到 LangChain 聊天消息。

该过程包含三个步骤：

1. 按照[此处说明](https://slack.com/help/articles/1500001548241-Request-to-export-all-conversations)导出所需的对话线程。
2. 创建 `SlackChatLoader`，并将文件路径指向 JSON 文件或 JSON 文件目录。
3. 调用 `loader.load()`（或 `loader.lazy_load()`）以执行转换。可选择使用 `merge_chat_runs` 来合并同一发送者连续发送的消息，和/或使用 `map_ai_messages` 将指定发送者的消息转换为 "AIMessage" 类。

## 1. 创建消息转储

目前（2023/08/23），此加载器最佳支持从 Slack 导出私信对话生成的 zip 文件目录格式。请遵循 Slack 的最新说明进行操作。

我们在 LangChain 仓库中提供了一个示例。

```python
import requests

permalink = "https://raw.githubusercontent.com/langchain-ai/langchain/342087bdfa3ac31d622385d0f2d09cf5e06c8db3/libs/langchain/tests/integration_tests/examples/slack_export.zip"
response = requests.get(permalink)
with open("slack_dump.zip", "wb") as f:
    f.write(response.content)
```

## 2. 创建聊天加载器

向加载器提供 zip 目录的文件路径。您可以选择指定映射到 AI 消息的用户 ID，以及配置是否合并消息序列。

```python
from langchain_community.chat_loaders.slack import SlackChatLoader
```

```python
loader = SlackChatLoader(
    path="slack_dump.zip",
)
```

## 3. 加载消息

`load()`（或 `lazy_load`）方法返回一个 "ChatSessions" 列表，目前每个加载的对话仅包含一个消息列表。

```python
from typing import List

from langchain_community.chat_loaders.utils import (
    map_ai_messages,
    merge_chat_runs,
)
from langchain_core.chat_sessions import ChatSession

raw_messages = loader.lazy_load()
# 将同一发送者的连续消息合并为一条消息
merged_messages = merge_chat_runs(raw_messages)
# 将来自 "U0500003428" 的消息转换为 AI 消息
messages: List[ChatSession] = list(
    map_ai_messages(merged_messages, sender="U0500003428")
)
```

### 后续步骤

然后，您可以按需使用这些消息，例如微调模型、进行少样本示例选择，或直接预测下一条消息。

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI()

for chunk in llm.stream(messages[1]["messages"]):
    print(chunk.content, end="", flush=True)
```

```text
Hi,

I hope you're doing well. I wanted to reach out and ask if you'd be available to meet up for coffee sometime next week. I'd love to catch up and hear about what's been going on in your life. Let me know if you're interested and we can find a time that works for both of us.

Looking forward to hearing from you!

Best, [Your Name]
```
