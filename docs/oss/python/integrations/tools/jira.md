---
title: Jira 工具包
---
本笔记本将介绍如何使用 `Jira` 工具包。

`Jira` 工具包允许代理与指定的 Jira 实例进行交互，执行诸如搜索问题和创建问题等操作。该工具封装了 atlassian-python-api 库，更多信息请参阅：[atlassian-python-api.readthedocs.io/jira.html](https://atlassian-python-api.readthedocs.io/jira.html)

## 安装与设置

要使用此工具，您必须首先设置以下环境变量：
JIRA_INSTANCE_URL,
JIRA_CLOUD

您可以选择两种身份验证方法之一：

- API 令牌认证：设置 JIRA_API_TOKEN（以及 JIRA_USERNAME，如果需要）环境变量
- OAuth2.0 认证：将 JIRA_OAUTH2 环境变量设置为一个字典，包含 "client_id" 和 "token" 字段，其中 "token" 是一个至少包含 "access_token" 和 "token_type" 的字典

```python
pip install -qU  atlassian-python-api
```

```python
pip install -qU langchain-community langchain-openai
```

```python
import os

from langchain.agents import AgentType, initialize_agent
from langchain_community.agent_toolkits.jira.toolkit import JiraToolkit
from langchain_community.utilities.jira import JiraAPIWrapper
from langchain_openai import OpenAI
```

使用 API 令牌进行身份验证

```python
os.environ["JIRA_API_TOKEN"] = "abc"
os.environ["JIRA_USERNAME"] = "123"
os.environ["JIRA_INSTANCE_URL"] = "https://jira.atlassian.com"
os.environ["OPENAI_API_KEY"] = "xyz"
os.environ["JIRA_CLOUD"] = "True"
```

使用 Oauth2.0 进行身份验证

```python
os.environ["JIRA_OAUTH2"] = (
    '{"client_id": "123", "token": {"access_token": "abc", "token_type": "bearer"}}'
)
os.environ["JIRA_INSTANCE_URL"] = "https://jira.atlassian.com"
os.environ["OPENAI_API_KEY"] = "xyz"
os.environ["JIRA_CLOUD"] = "True"
```

```python
llm = OpenAI(temperature=0)
jira = JiraAPIWrapper()
toolkit = JiraToolkit.from_jira_api_wrapper(jira)
```

## 工具使用

让我们看看 Jira 工具包中有哪些独立的工具：

```python
[(tool.name, tool.description) for tool in toolkit.get_tools()]
```

```json
[('JQL Query',
  '\n    此工具是对 atlassian-python-api 的 Jira jql API 的封装，当您需要搜索 Jira 问题时非常有用。\n    此工具的输入是一个 JQL 查询字符串，它将传递给 atlassian-python-api 的 Jira `jql` 函数。\n    例如，要查找项目 "Test" 中分配给我的所有问题，您可以传入以下字符串：\n    project = Test AND assignee = currentUser()\n    或者要查找摘要中包含单词 "test" 的问题，您可以传入以下字符串：\n    summary ~ \'test\'\n    '),
 ('Get Projects',
  "\n    此工具是对 atlassian-python-api 的 Jira project API 的封装，\n    当您需要获取用户有权访问的所有项目、了解有多少个项目，或者作为涉及按项目搜索的中间步骤时非常有用。\n    此工具没有输入。\n    "),
 ('Create Issue',
  '\n    此工具是对 atlassian-python-api 的 Jira issue_create API 的封装，当您需要创建 Jira 问题时非常有用。\n    此工具的输入是一个指定 Jira 问题字段的字典，它将传递给 atlassian-python-api 的 Jira `issue_create` 函数。\n    例如，要创建一个名为 "test issue"、描述为 "test description" 的低优先级任务，您可以传入以下字典：\n    {{"summary": "test issue", "description": "test description", "issuetype": {{"name": "Task"}}, "priority": {{"name": "Low"}}}}\n    '),
 ('Catch all Jira API call',
  '\n    此工具是对 atlassian-python-api 的 Jira API 的封装。\n    有专门用于获取所有项目、创建和搜索问题的其他工具，\n    如果您需要执行 atlassian-python-api Jira API 允许的任何其他操作，请使用此工具。\n    此工具的输入是一个字典，指定 atlassian-python-api 的 Jira API 中的一个函数，\n    以及要传递给该函数的参数列表和关键字参数字典。\n    例如，要获取组中的所有用户，同时将最大结果数增加到 100，您可以\n    传入以下字典：{{"function": "get_all_users_from_group", "args": ["group"], "kwargs": {{"limit":100}} }}\n    或者要了解 Jira 实例中有多少项目，您可以传入以下字符串：\n    {{"function": "projects"}}\n    有关 Jira API 的更多信息，请参阅 https://atlassian-python-api.readthedocs.io/jira.html\n    '),
 ('Create confluence page',
  '此工具是对 atlassian-python-api 的 Confluence \natlassian-python-api API 的封装，当您需要创建 Confluence 页面时非常有用。此工具的输入是一个字典，\n指定 Confluence 页面的字段，它将传递给 atlassian-python-api 的 Confluence `create_page` \n函数。例如，要在 DEMO 空间中创建一个标题为 "This is the title"、正文为 "This is the body. You can use \n<strong>HTML tags</strong>!" 的页面，您可以传入以下字典：{{"space": "DEMO", "title":"This is the \ntitle","body":"This is the body. You can use <strong>HTML tags</strong>!"}} ')]
```

```python
agent = initialize_agent(
    toolkit.get_tools(), llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)
```

```python
agent.run("make a new issue in project PW to remind me to make more fried rice")
```

```text
> Entering new AgentExecutor chain...
 我需要在项目 PW 中创建一个问题
Action: Create Issue
Action Input: {"summary": "Make more fried rice", "description": "Reminder to make more fried rice", "issuetype": {"name": "Task"}, "priority": {"name": "Low"}, "project": {"key": "PW"}}
Observation: None
Thought: 我现在知道最终答案了
Final Answer: 已在项目 PW 中创建了一个新问题，摘要为 "Make more fried rice"，描述为 "Reminder to make more fried rice"。

> Finished chain.
```

```text
'已在项目 PW 中创建了一个新问题，摘要为 "Make more fried rice"，描述为 "Reminder to make more fried rice"。'
```
