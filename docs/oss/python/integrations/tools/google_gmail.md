---
title: Gmail 工具包
---
这将帮助你开始使用 Gmail [工具包](/oss/python/langchain/tools#toolkits)。该工具包与 Gmail API 交互，用于读取邮件、草拟和发送邮件等。有关 GmailToolkit 所有功能和配置的详细文档，请前往 [API 参考](https://python.langchain.com/api_reference/google_community/gmail/langchain_google_community.gmail.toolkit.GmailToolkit.html)。

## 设置

要使用此工具包，你需要按照 [Gmail API 文档](https://developers.google.com/gmail/api/quickstart/python#authorize_credentials_for_a_desktop_application) 中的说明设置你的凭据。下载 `credentials.json` 文件后，你就可以开始使用 Gmail API 了。

### 安装

此工具包位于 `langchain-google-community` 包中。我们需要 `gmail` 额外依赖项：

```python
pip install -qU langchain-google-community\[gmail\]
```

要启用单个工具的自动追踪，请设置你的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

## 实例化

默认情况下，工具包会读取本地的 `credentials.json` 文件。你也可以手动提供一个 `Credentials` 对象。

```python
from langchain_google_community import GmailToolkit

toolkit = GmailToolkit()
```

### 自定义身份验证

在后台，会使用以下方法创建一个 `googleapi` 资源。你可以手动构建一个 `googleapi` 资源以获得更多的身份验证控制。

```python
from langchain_google_community.gmail.utils import (
    build_resource_service,
    get_gmail_credentials,
)

# 可以在此处查看作用域 https://developers.google.com/gmail/api/auth/scopes
# 例如，只读作用域是 'https://www.googleapis.com/auth/gmail.readonly'
credentials = get_gmail_credentials(
    token_file="token.json",
    scopes=["https://mail.google.com/"],
    client_secrets_file="credentials.json",
)
api_resource = build_resource_service(credentials=credentials)
toolkit = GmailToolkit(api_resource=api_resource)
```

## 工具

查看可用工具：

```python
tools = toolkit.get_tools()
tools
```

```text
[GmailCreateDraft(api_resource=<googleapiclient.discovery.Resource object at 0x1094509d0>),
 GmailSendMessage(api_resource=<googleapiclient.discovery.Resource object at 0x1094509d0>),
 GmailSearch(api_resource=<googleapiclient.discovery.Resource object at 0x1094509d0>),
 GmailGetMessage(api_resource=<googleapiclient.discovery.Resource object at 0x1094509d0>),
 GmailGetThread(api_resource=<googleapiclient.discovery.Resource object at 0x1094509d0>)]
```

- [GmailCreateDraft](https://python.langchain.com/api_reference/google_community/gmail/langchain_google_community.gmail.create_draft.GmailCreateDraft.html)
- [GmailSendMessage](https://python.langchain.com/api_reference/google_community/gmail/langchain_google_community.gmail.send_message.GmailSendMessage.html)
- [GmailSearch](https://python.langchain.com/api_reference/google_community/gmail/langchain_google_community.gmail.search.GmailSearch.html)
- [GmailGetMessage](https://python.langchain.com/api_reference/google_community/gmail/langchain_google_community.gmail.get_message.GmailGetMessage.html)
- [GmailGetThread](https://python.langchain.com/api_reference/google_community/gmail/langchain_google_community.gmail.get_thread.GmailGetThread.html)

## 在代理中使用

下面我们将展示如何将工具包集成到 [代理](/oss/python/langchain/agents) 中。

我们需要一个 LLM 或聊天模型：

<ChatModelTabs customVarName="llm" />

```python
# | output: false
# | echo: false

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
```

```python
from langchain.agents import create_agent

agent_executor = create_agent(llm, tools)
```

```python
example_query = "Draft an email to fake@fake.com thanking them for coffee."

events = agent_executor.stream(
    {"messages": [("user", example_query)]},
    stream_mode="values",
)
for event in events:
    event["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

Draft an email to fake@fake.com thanking them for coffee.
================================== Ai Message ==================================
Tool Calls:
  create_gmail_draft (call_slGkYKZKA6h3Mf1CraUBzs6M)
 Call ID: call_slGkYKZKA6h3Mf1CraUBzs6M
  Args:
    message: Dear Fake,

I wanted to take a moment to thank you for the coffee yesterday. It was a pleasure catching up with you. Let's do it again soon!

Best regards,
[Your Name]
    to: ['fake@fake.com']
    subject: Thank You for the Coffee
================================= Tool Message =================================
Name: create_gmail_draft

Draft created. Draft Id: r-7233782721440261513
================================== Ai Message ==================================

I have drafted an email to fake@fake.com thanking them for the coffee. You can review and send it from your email draft with the subject "Thank You for the Coffee".
```

---

## API 参考

有关 `GmailToolkit` 所有功能和配置的详细文档，请前往 [API 参考](https://python.langchain.com/api_reference/community/agent_toolkits/langchain_community.agent_toolkits.gmail.toolkit.GmailToolkit.html)。
