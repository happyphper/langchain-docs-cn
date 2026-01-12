---
title: Slack 工具包
---
这将帮助您开始使用 Slack [工具包](/oss/javascript/langchain/tools#toolkits)。有关 SlackToolkit 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/agent_toolkits/langchain_community.agent_toolkits.slack.toolkit.SlackToolkit.html)。

## 设置

要使用此工具包，您需要按照 [Slack API 文档](https://api.slack.com/tutorials/tracks/getting-a-token) 中的说明获取令牌。获得 SLACK_USER_TOKEN 后，您可以将其作为环境变量输入。

```python
import getpass
import os

if not os.getenv("SLACK_USER_TOKEN"):
    os.environ["SLACK_USER_TOKEN"] = getpass.getpass("Enter your Slack user token: ")
```

要启用对单个工具的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

此工具包位于 `langchain-community` 包中。我们还需要 Slack SDK：

```python
pip install -qU langchain-community slack_sdk
```

可选地，我们可以安装 beautifulsoup4 来帮助解析 HTML 消息：

```python
pip install -qU beautifulsoup4 # 这是可选的，但对于解析 HTML 消息很有用
```

## 实例化

现在我们可以实例化我们的工具包：

```python
from langchain_community.agent_toolkits import SlackToolkit

toolkit = SlackToolkit()
```

## 工具

查看可用工具：

```python
tools = toolkit.get_tools()

tools
```

```text
[SlackGetChannel(client=<slack_sdk.web.client.WebClient object at 0x113caa8c0>),
 SlackGetMessage(client=<slack_sdk.web.client.WebClient object at 0x113caa4d0>),
 SlackScheduleMessage(client=<slack_sdk.web.client.WebClient object at 0x113caa440>),
 SlackSendMessage(client=<slack_sdk.web.client.WebClient object at 0x113caa410>)]
```

此工具包加载了以下工具：

- [SlackGetChannel](https://python.langchain.com/api_reference/community/tools/langchain_community.tools.slack.get_channel.SlackGetChannel.html)
- [SlackGetMessage](https://python.langchain.com/api_reference/community/tools/langchain_community.tools.slack.get_message.SlackGetMessage.html)
- [SlackScheduleMessage](https://python.langchain.com/api_reference/community/tools/langchain_community.tools.slack.schedule_message.SlackScheduleMessage.html)
- [SlackSendMessage](https://python.langchain.com/api_reference/community/tools/langchain_community.tools.slack.send_message.SlackSendMessage.html)

## 在代理中使用

让我们为代理配备 Slack 工具包，并查询有关频道的信息。

```python
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent

model = ChatOpenAI(model="gpt-4o-mini")

agent_executor = create_agent(model, tools)
```

```python
example_query = "When was the #general channel created?"

events = agent_executor.stream(
    {"messages": [("user", example_query)]},
    stream_mode="values",
)
for event in events:
    message = event["messages"][-1]
    if message.type != "tool":  # mask sensitive information
        event["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

When was the #general channel created?
================================== Ai Message ==================================
Tool Calls:
  get_channelid_name_dict (call_NXDkALjoOx97uF1v0CoZTqtJ)
 Call ID: call_NXDkALjoOx97uF1v0CoZTqtJ
  Args:
================================== Ai Message ==================================

The #general channel was created on timestamp 1671043305.
```

```python
example_query = "Send a friendly greeting to channel C072Q1LP4QM."

events = agent_executor.stream(
    {"messages": [("user", example_query)]},
    stream_mode="values",
)
for event in events:
    message = event["messages"][-1]
    if message.type != "tool":  # mask sensitive information
        event["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

Send a friendly greeting to channel C072Q1LP4QM.
================================== Ai Message ==================================
Tool Calls:
  send_message (call_xQxpv4wFeAZNZgSBJRIuaizi)
 Call ID: call_xQxpv4wFeAZNZgSBJRIuaizi
  Args:
    message: Hello! Have a great day!
    channel: C072Q1LP4QM
================================== Ai Message ==================================

I have sent a friendly greeting to the channel C072Q1LP4QM.
```

---

## API 参考

有关 `SlackToolkit` 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/agent_toolkits/langchain_community.agent_toolkits.slack.toolkit.SlackToolkit.html)。
