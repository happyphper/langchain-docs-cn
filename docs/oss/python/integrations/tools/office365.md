---
title: Office365 工具包
---
>[Microsoft 365](https://www.office.com/) 是 `Microsoft` 旗下的一套生产力软件、协作和基于云服务的产品系列。

> 注意：`Office 365` 已更名为 `Microsoft 365`。

本笔记本将介绍如何将 LangChain 连接到 `Office365` 电子邮件和日历。

要使用此工具包，您需要按照 [Microsoft Graph 身份验证和授权概述](https://learn.microsoft.com/en-us/graph/auth/) 中的说明设置您的凭据。一旦您获得了 CLIENT_ID 和 CLIENT_SECRET，就可以在下面将它们设置为环境变量。

您也可以使用[这里的身份验证说明](https://o365.github.io/python-o365/latest/getting_started.html#oauth-setup-pre-requisite)。

```python
pip install -qU  O365
pip install -qU  beautifulsoup4  # 这是可选的，但对于解析 HTML 消息很有用
pip install -qU langchain-community
```

## 设置环境变量

工具包将读取 `CLIENT_ID` 和 `CLIENT_SECRET` 环境变量来验证用户身份，因此您需要在此处设置它们。稍后使用代理时，您还需要设置 `OPENAI_API_KEY`。

```python
# 在此处设置环境变量
```

## 创建工具包并获取工具

首先，您需要创建工具包，以便稍后访问其工具。

```python
from langchain_community.agent_toolkits import O365Toolkit

toolkit = O365Toolkit()
tools = toolkit.get_tools()
tools
```

```text
[O365SearchEvents(name='events_search', description=" Use this tool to search for the user's calendar events. The input must be the start and end datetimes for the search query. The output is a JSON list of all the events in the user's calendar between the start and end times. You can assume that the user can  not schedule any meeting over existing meetings, and that the user is busy during meetings. Any times without events are free for the user. ", args_schema=<class 'langchain_community.tools.office365.events_search.SearchEventsInput'>, return_direct=False, verbose=False, callbacks=None, callback_manager=None, handle_tool_error=False, account=Account Client Id: f32a022c-3c4c-4d10-a9d8-f6a9a9055302),
 O365CreateDraftMessage(name='create_email_draft', description='Use this tool to create a draft email with the provided message fields.', args_schema=<class 'langchain_community.tools.office365.create_draft_message.CreateDraftMessageSchema'>, return_direct=False, verbose=False, callbacks=None, callback_manager=None, handle_tool_error=False, account=Account Client Id: f32a022c-3c4c-4d10-a9d8-f6a9a9055302),
 O365SearchEmails(name='messages_search', description='Use this tool to search for email messages. The input must be a valid Microsoft Graph v1.0 $search query. The output is a JSON list of the requested resource.', args_schema=<class 'langchain_community.tools.office365.messages_search.SearchEmailsInput'>, return_direct=False, verbose=False, callbacks=None, callback_manager=None, handle_tool_error=False, account=Account Client Id: f32a022c-3c4c-4d10-a9d8-f6a9a9055302),
 O365SendEvent(name='send_event', description='Use this tool to create and send an event with the provided event fields.', args_schema=<class 'langchain_community.tools.office365.send_event.SendEventSchema'>, return_direct=False, verbose=False, callbacks=None, callback_manager=None, handle_tool_error=False, account=Account Client Id: f32a022c-3c4c-4d10-a9d8-f6a9a9055302),
 O365SendMessage(name='send_email', description='Use this tool to send an email with the provided message fields.', args_schema=<class 'langchain_community.tools.office365.send_message.SendMessageSchema'>, return_direct=False, verbose=False, callbacks=None, callback_manager=None, handle_tool_error=False, account=Account Client Id: f32a022c-3c4c-4d10-a9d8-f6a9a9055302)]
```

## 在代理中使用

```python
from langchain.agents import AgentType, initialize_agent
from langchain_openai import OpenAI
```

```python
llm = OpenAI(temperature=0)
agent = initialize_agent(
    tools=toolkit.get_tools(),
    llm=llm,
    verbose=False,
    agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
)
```

```python
agent.run(
    "Create an email draft for me to edit of a letter from the perspective of a sentient parrot"
    " who is looking to collaborate on some research with her"
    " estranged friend, a cat. Under no circumstances may you send the message, however."
)
```

```text
'The draft email was created correctly.'
```

```python
agent.run(
    "Could you search in my drafts folder and let me know if any of them are about collaboration?"
)
```

```text
"I found one draft in your drafts folder about collaboration. It was sent on 2023-06-16T18:22:17+0000 and the subject was 'Collaboration Request'."
```

```python
agent.run(
    "Can you schedule a 30 minute meeting with a sentient parrot to discuss research collaborations on October 3, 2023 at 2 pm Easter Time?"
)
```

```text
/home/vscode/langchain-py-env/lib/python3.11/site-packages/O365/utils/windows_tz.py:639: PytzUsageWarning: The zone attribute is specific to pytz's interface; please migrate to a new time zone provider. For more details on how to do so, see https://pytz-deprecation-shim.readthedocs.io/en/latest/migration.html
  iana_tz.zone if isinstance(iana_tz, tzinfo) else iana_tz)
/home/vscode/langchain-py-env/lib/python3.11/site-packages/O365/utils/utils.py:463: PytzUsageWarning: The zone attribute is specific to pytz's interface; please migrate to a new time zone provider. For more details on how to do so, see https://pytz-deprecation-shim.readthedocs.io/en/latest/migration.html
  timezone = date_time.tzinfo.zone if date_time.tzinfo is not None else None
```

```text
'I have scheduled a meeting with a sentient parrot to discuss research collaborations on October 3, 2023 at 2 pm Easter Time. Please let me know if you need to make any changes.'
```

```python
agent.run(
    "Can you tell me if I have any events on October 3, 2023 in Eastern Time, and if so, tell me if any of them are with a sentient parrot?"
)
```

```text
"Yes, you have an event on October 3, 2023 with a sentient parrot. The event is titled 'Meeting with sentient parrot' and is scheduled from 6:00 PM to 6:30 PM."
```
