---
title: Zapier 自然语言操作
---
**已弃用** 此 API 将于 2023-11-17 停止服务：[nla.zapier.com/start/](https://nla.zapier.com/start/)

>[Zapier Natural Language Actions](https://nla.zapier.com/start/) 通过一个自然语言 API 接口，让你能够访问 Zapier 平台上的 5000+ 个应用和 20000+ 个操作。
>
>NLA 支持 `Gmail`、`Salesforce`、`Trello`、`Slack`、`Asana`、`HubSpot`、`Google Sheets`、`Microsoft Teams` 等应用以及数千个其他应用：[zapier.com/apps](https://zapier.com/apps)
>`Zapier NLA` 处理所有底层的 API 身份验证，并将自然语言 --> 底层 API 调用 --> 为 LLM 返回简化输出。其核心思想是，你或你的用户可以通过一个类似 OAuth 的设置窗口公开一组操作，然后你可以通过 REST API 查询和执行这些操作。

NLA 提供 API 密钥和 OAuth 两种方式来签署 NLA API 请求。

1. **服务器端（API 密钥）**：适用于快速入门、测试以及生产场景，其中 LangChain 仅使用开发者 Zapier 账户中公开的操作（并将使用开发者在 Zapier.com 上连接的账户）。

2. **面向用户（Oauth）**：适用于生产场景，你正在部署一个面向最终用户的应用程序，并且 LangChain 需要访问最终用户公开的操作及其在 Zapier.com 上连接的账户。

为简洁起见，本快速入门主要关注服务器端用例。跳转到 [使用 OAuth 访问令牌的示例](#oauth) 查看一个简短的示例，了解如何为面向用户的情况设置 Zapier。请查阅 [完整文档](https://nla.zapier.com/start/) 以获取完整的面向用户的 OAuth 开发者支持。

本示例将介绍如何将 Zapier 集成与 `SimpleSequentialChain` 以及 `Agent` 结合使用。
代码如下：

```python
import os

# 从 https://platform.openai.com/ 获取
os.environ["OPENAI_API_KEY"] = os.environ.get("OPENAI_API_KEY", "")

# 登录后从 https://nla.zapier.com/docs/authentication/ 获取：
os.environ["ZAPIER_NLA_API_KEY"] = os.environ.get("ZAPIER_NLA_API_KEY", "")
```

## 使用 Agent 的示例

Zapier 工具可以与 Agent 一起使用。请参见下面的示例。

```python
from langchain.agents import AgentType, initialize_agent
from langchain_community.agent_toolkits import ZapierToolkit
from langchain_community.utilities.zapier import ZapierNLAWrapper
from langchain_openai import OpenAI
```

```python
## 步骤 0. 公开 Gmail 的“查找邮件”和 Slack 的“发送频道消息”操作

# 首先访问此处，登录，公开（启用）这两个操作：https://nla.zapier.com/demo/start -- 对于此示例，所有字段可以保留为“让 AI 猜测”
# 在 OAuth 场景中，你将获得自己的 <provider> id（而不是 'demo'），你需要首先引导用户通过该 id
```

```python
llm = OpenAI(temperature=0)
zapier = ZapierNLAWrapper()
toolkit = ZapierToolkit.from_zapier_nla_wrapper(zapier)
agent = initialize_agent(
    toolkit.get_tools(), llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)
```

```python
agent.run(
    "Summarize the last email I received regarding Silicon Valley Bank. Send the summary to the #test-zapier channel in slack."
)
```

```text
> Entering new AgentExecutor chain...
 I need to find the email and summarize it.
Action: Gmail: Find Email
Action Input: Find the latest email from Silicon Valley Bank
Observation: {"from__name": "Silicon Valley Bridge Bank, N.A.", "from__email": "sreply@svb.com", "body_plain": "Dear Clients, After chaotic, tumultuous & stressful days, we have clarity on path for SVB, FDIC is fully insuring all deposits & have an ask for clients & partners as we rebuild. Tim Mayopoulos <https://eml.svb.com/NjEwLUtBSy0yNjYAAAGKgoxUeBCLAyF_NxON97X4rKEaNBLG", "reply_to__email": "sreply@svb.com", "subject": "Meet the new CEO Tim Mayopoulos", "date": "Tue, 14 Mar 2023 23:42:29 -0500 (CDT)", "message_url": "https://mail.google.com/mail/u/0/#inbox/186e393b13cfdf0a", "attachment_count": "0", "to__emails": "ankush@langchain.dev", "message_id": "186e393b13cfdf0a", "labels": "IMPORTANT, CATEGORY_UPDATES, INBOX"}
Thought: I need to summarize the email and send it to the #test-zapier channel in Slack.
Action: Slack: Send Channel Message
Action Input: Send a slack message to the #test-zapier channel with the text "Silicon Valley Bank has announced that Tim Mayopoulos is the new CEO. FDIC is fully insuring all deposits and they have an ask for clients and partners as they rebuild."
Observation: {"message__text": "Silicon Valley Bank has announced that Tim Mayopoulos is the new CEO. FDIC is fully insuring all deposits and they have an ask for clients and partners as they rebuild.", "message__permalink": "https://langchain.slack.com/archives/C04TSGU0RA7/p1678859932375259", "channel": "C04TSGU0RA7", "message__bot_profile__name": "Zapier", "message__team": "T04F8K3FZB5", "message__bot_id": "B04TRV4R74K", "message__bot_profile__deleted": "false", "message__bot_profile__app_id": "A024R9PQM", "ts_time": "2023-03-15T05:58:52Z", "message__bot_profile__icons__image_36": "https://avatars.slack-edge.com/2022-08-02/3888649620612_f864dc1bb794cf7d82b0_36.png", "message__blocks[]block_id": "kdZZ", "message__blocks[]elements[]type": "['rich_text_section']"}
Thought: I now know the final answer.
Final Answer: I have sent a summary of the last email from Silicon Valley Bank to the #test-zapier channel in Slack.

> Finished chain.
```

```text
'I have sent a summary of the last email from Silicon Valley Bank to the #test-zapier channel in Slack.'
```

## 使用 SimpleSequentialChain 的示例

如果你需要更明确的控制，可以使用链，如下所示。

```python
from langchain_classic.chains import LLMChain, SimpleSequentialChain, TransformChain
from langchain_community.tools.zapier.tool import ZapierNLARunAction
from langchain_community.utilities.zapier import ZapierNLAWrapper
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI
```

```python
## 步骤 0. 公开 Gmail 的“查找邮件”和 Slack 的“发送直接消息”操作

# 首先访问此处，登录，公开（启用）这两个操作：https://nla.zapier.com/demo/start -- 对于此示例，所有字段可以保留为“让 AI 猜测”
# 在 OAuth 场景中，你将获得自己的 <provider> id（而不是 'demo'），你需要首先引导用户通过该 id

actions = ZapierNLAWrapper().list()
```

```python
## 步骤 1. Gmail 查找邮件

GMAIL_SEARCH_INSTRUCTIONS = "Grab the latest email from Silicon Valley Bank"

def nla_gmail(inputs):
    action = next(
        (a for a in actions if a["description"].startswith("Gmail: Find Email")), None
    )
    return {
        "email_data": ZapierNLARunAction(
            action_id=action["id"],
            zapier_description=action["description"],
            params_schema=action["params"],
        ).run(inputs["instructions"])
    }

gmail_chain = TransformChain(
    input_variables=["instructions"],
    output_variables=["email_data"],
    transform=nla_gmail,
)
```

```python
## 步骤 2. 生成回复草稿

template = """You are an assisstant who drafts replies to an incoming email. Output draft reply in plain text (not JSON).

Incoming email:
{email_data}

Draft email reply:"""

prompt_template = PromptTemplate(input_variables=["email_data"], template=template)
reply_chain = LLMChain(llm=OpenAI(temperature=0.7), prompt=prompt_template)
```

```python
## 步骤 3. 通过 Slack 直接消息发送回复草稿

SLACK_HANDLE = "@Ankush Gola"

def nla_slack(inputs):
    action = next(
        (
            a
            for a in actions
            if a["description"].startswith("Slack: Send Direct Message")
        ),
        None,
    )
    instructions = f"Send this to {SLACK_HANDLE} in Slack: {inputs['draft_reply']}"
    return {
        "slack_data": ZapierNLARunAction(
            action_id=action["id"],
            zapier_description=action["description"],
            params_schema=action["params"],
        ).run(instructions)
    }

slack_chain = TransformChain(
    input_variables=["draft_reply"],
    output_variables=["slack_data"],
    transform=nla_slack,
)
```

```python
## 最后，执行

overall_chain = SimpleSequentialChain(
    chains=[gmail_chain, reply_chain, slack_chain], verbose=True
)
overall_chain.run(GMAIL_SEARCH_INSTRUCTIONS)
```

```text
> Entering new SimpleSequentialChain chain...
{"from__name": "Silicon Valley Bridge Bank, N.A.", "from__email": "sreply@svb.com", "body_plain": "Dear Clients, After chaotic, tumultuous & stressful days, we have clarity on path for SVB, FDIC is fully insuring all deposits & have an ask for clients & partners as we rebuild. Tim Mayopoulos <https://eml.svb.com/NjEwLUtBSy0yNjYAAAGKgoxUeBCLAyF_NxON97X4rKEaNBLG", "reply_to__email": "sreply@svb.com", "subject": "Meet the new CEO Tim Mayopoulos", "date": "Tue, 14 Mar 2023 23:42:29 -0500 (CDT)", "message_url": "https://mail.google.com/mail/u/0/#inbox/186e393b13cfdf0a", "attachment_count": "0", "to__emails": "ankush@langchain.dev", "message_id": "186e393b13cfdf0a", "labels": "IMPORTANT, CATEGORY_UPDATES, INBOX"}

Dear Silicon Valley Bridge Bank,

Thank you for your email and the update regarding your new CEO Tim Mayopoulos. We appreciate your dedication to keeping your clients and partners informed and we look forward to continuing our relationship with you.

Best regards,
[Your Name]
{"message__text": "Dear Silicon Valley Bridge Bank, \n\nThank you for your email and the update regarding your new CEO Tim Mayopoulos. We appreciate your dedication to keeping your clients and partners informed and we look forward to continuing our relationship with you. \n\nBest regards, \n[Your Name]", "message__permalink": "https://langchain.slack.com/archives/D04TKF5BBHU/p1678859968241629", "channel": "D04TKF5BBHU", "message__bot_profile__name": "Zapier", "message__team": "T04F8K3FZB5", "message__bot_id": "B04TRV4R74K", "message__bot_profile__deleted": "false", "message__bot_profile__app_id": "A024R9PQM", "ts_time": "2023-03-15T05:59:28Z", "message__blocks[]block_id": "p7i", "message__blocks[]elements[]elements[]type": "[['text']]", "message__blocks[]elements[]type": "['rich_text_section']"}

> Finished chain.
```

```text
'{"message__text": "Dear Silicon Valley Bridge Bank, \\n\\nThank you for your email and the update regarding your new CEO Tim Mayopoulos. We appreciate your dedication to keeping your clients and partners informed and we look forward to continuing our relationship with you. \\n\\nBest regards, \\n[Your Name]", "message__permalink": "https://langchain.slack.com/archives/D04TKF5BBHU/p1678859968241629", "channel": "D04TKF5BBHU", "message__bot_profile__name": "Zapier", "message__team": "T04F8K3FZB5", "message__bot_id": "B04TRV4R74K", "message__bot_profile__deleted": "false", "message__bot_profile__app_id": "A024R9PQM", "ts_time": "2023-03-15T05:59:28Z", "message__blocks[]block_id": "p7i", "message__blocks[]elements[]elements[]type": "[[\'text\']]", "message__blocks[]elements[]type": "[\'rich_text_section\']"}'
```

## 使用 OAuth 访问令牌的示例

下面的代码片段展示了如何使用获取到的 OAuth 访问令牌初始化包装器。请注意传入的参数，而不是设置环境变量。请查阅 [身份验证文档](https://nla.zapier.com/docs/authentication/#oauth-credentials) 以获取完整的面向用户的 OAuth 开发者支持。

开发者需要负责处理 OAuth 握手以获取和刷新访问令牌。

```python
llm = OpenAI(temperature=0)
zapier = ZapierNLAWrapper(zapier_nla_oauth_access_token="<fill in access token here>")
toolkit = ZapierToolkit.from_zapier_nla_wrapper(zapier)
agent = initialize_agent(
    toolkit.get_tools(), llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)

agent.run(
    "Summarize the last email I received regarding Silicon Valley Bank. Send the summary to the #test-zapier channel in slack."
)
```
