---
title: Composio
description: 通过 Composio 的统一 API 平台，为 AI 智能体提供 500 多种工具和集成，支持 OAuth 处理、事件驱动工作流和多用户协作。
---
[Composio](https://composio.dev) 是一个集成平台，提供对 500 多种工具的访问，涵盖 GitHub、Slack、Notion 等流行应用程序。它使 AI 智能体能够通过统一的 API 与外部服务交互，处理身份验证、权限和事件驱动的工作流。

## 概述

### 集成详情

| 类别 | 包 | 可序列化 | [JS 支持](https://js.langchain.com/docs/integrations/tools/composio) | 版本 |
|:---|:---|:---:|:---:|:---:|
| Composio | [composio-langchain](https://pypi.org/project/composio-langchain/) | ❌ | ✅ | ![PyPI - Version](https://img.shields.io/pypi/v/composio-langchain?style=flat-square&label=%20) |

### 工具特性

- **500+ 工具访问**：为 GitHub、Slack、Gmail、Jira、Notion 等提供预构建集成
- **身份验证管理**：处理 OAuth 流程、API 密钥和身份验证状态
- **事件驱动的工作流**：基于外部事件（新的 Slack 消息、GitHub 问题等）触发智能体
- **细粒度权限**：按用户控制工具访问和数据暴露
- **自定义工具支持**：添加专有 API 和内部工具

## 设置

该集成位于 `composio-langchain` 包中。

::: code-group

```python [pip]
pip install -U composio-langchain
```

```python [uv]
uv add composio-langchain
```

:::

### 凭证

您需要一个 Composio API 密钥。在 [composio.dev](https://composio.dev) 免费注册以获取您的 API 密钥。

```python Set API key icon="key"
import getpass
import os

if not os.environ.get("COMPOSIO_API_KEY"):
    os.environ["COMPOSIO_API_KEY"] = getpass.getpass("Enter your Composio API key: ")
```

设置 [LangSmith](https://docs.langchain.com/langsmith/home) 以进行追踪也很有帮助：

```python Enable tracing icon="flask"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
# os.environ["LANGSMITH_TRACING"] = "true"
```

## 实例化

使用 LangChain 提供程序初始化 Composio，并从特定的工具包中获取工具。每个工具包代表一个服务（例如 GitHub、Slack），其中包含多个工具（您可以执行的操作）。

```python Initialize Composio icon="robot"
from composio import Composio
from composio_langchain import LangchainProvider

# 使用 LangChain 提供程序初始化 Composio
composio = Composio(provider=LangchainProvider())

# 从特定工具包获取工具
# 您可以指定一个或多个工具包
tools = composio.tools.get(
    user_id="default",
    toolkits=["GITHUB"]
)

print(f"Loaded {len(tools)} tools from GitHub toolkit")
```

### 可用工具包

Composio 为各种服务提供工具包：

**生产力**：GitHub、Slack、Gmail、Jira、Notion、Asana、Trello、ClickUp
**通信**：Discord、Telegram、WhatsApp、Microsoft Teams
**开发**：GitLab、Bitbucket、Linear、Sentry
**数据与分析**：Google Sheets、Airtable、HubSpot、Salesforce
**以及 100 多种更多...**

## 调用

### 从多个工具包获取工具

您可以一次性从多个服务加载工具：

```python
# 从多个工具包获取工具
tools = composio.tools.get(
    user_id="default",
    toolkits=["GITHUB", "SLACK", "GMAIL"]
)
```

### 获取特定工具

您可以加载特定工具，而不是整个工具包：

```python
# 按名称获取特定工具
tools = composio.tools.get(
    user_id="default",
    tools=["GITHUB_CREATE_ISSUE", "SLACK_SEND_MESSAGE"]
)
```

### 用户特定工具

Composio 支持具有用户特定身份验证的多用户场景：

```python
# 为特定用户获取工具
# 此用户必须先验证其账户
tools = composio.tools.get(
    user_id="user_123",
    toolkits=["GITHUB"]
)
```

## 在智能体中使用

这是一个使用 Composio 工具与 LangChain 智能体交互以操作 GitHub 的完整示例：

<ChatModelTabs customVarName="llm" />

```python
import os
import getpass

if not os.environ.get("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")
```

```python
# | output: false
# | echo: false

from langchain.chat_models import init_chat_model

llm = init_chat_model(model="gpt-5", model_provider="openai")
```

```python Agent with Composio tools icon="robot"
from composio import Composio
from composio_langchain import LangchainProvider
from langchain import hub
from langchain.agents import AgentExecutor, create_openai_functions_agent

# 拉取提示模板
prompt = hub.pull("hwchase17/openai-functions-agent")

# 初始化 Composio
composio = Composio(provider=LangchainProvider())

# 获取 GitHub 工具
tools = composio.tools.get(user_id="default", toolkits=["GITHUB"])

# 定义任务
task = "Star a repo composiohq/composio on GitHub"

# 创建智能体
agent = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# 使用 agent_executor 执行
agent_executor.invoke({"input": task})
```

### 事件驱动的工作流

Composio 支持基于外部事件触发智能体。当连接的应用中发生事件时（如新的 GitHub 提交或 Slack 消息），触发器会自动将结构化负载发送到您的应用程序。

#### 创建触发器

首先，为您想要监控的事件创建一个触发器：

```python
from composio import Composio

composio = Composio(api_key="your_api_key")
user_id = "user_123"

# 检查触发器需要什么配置
trigger_type = composio.triggers.get_type("GITHUB_COMMIT_EVENT")
print(trigger_type.config)

# 使用所需配置创建触发器
trigger = composio.triggers.create(
    slug="GITHUB_COMMIT_EVENT",
    user_id=user_id,
    trigger_config={
        "owner": "composiohq",
        "repo": "composio"
    }
)

print(f"Trigger created: {trigger.trigger_id}")
```

#### 订阅触发器（开发）

对于本地开发和原型设计，您可以直接订阅触发器：

```python
from composio import Composio

composio = Composio(api_key="your_api_key")

# 订阅触发器事件
subscription = composio.triggers.subscribe()

# 定义事件处理器
@subscription.handle(trigger_id="your_trigger_id")
def handle_github_commit(data):
    print(f"New commit detected: {data}")
    # 使用您的智能体处理事件
    # ... 使用任务调用您的智能体

# 注意：对于生产环境，请使用 webhook
```

#### Webhook（生产）

对于生产环境，请在 [Composio 仪表板](https://platform.composio.dev/settings/events) 中配置 webhook：

```python
from fastapi import FastAPI, Request
import json

app = FastAPI()

@app.post("/webhook")
async def webhook_handler(request: Request):
    # 获取 webhook 负载
    payload = await request.json()

    print("Received trigger event:")
    print(json.dumps(payload, indent=2))

    # 使用您的智能体处理事件
    if payload.get("triggerSlug") == "GITHUB_COMMIT_EVENT":
        commit_data = payload.get("payload")
        # ... 使用 commit_data 调用您的智能体

    return {"status": "success"}
```

更多详情，请参阅 [Composio 触发器文档](https://docs.composio.dev/docs/using-triggers)

## 身份验证设置

在使用需要身份验证的工具之前，用户需要连接他们的账户：

```python
from composio import Composio

composio = Composio()

# 获取用户的身份验证 URL
auth_connection = composio.integrations.create(
    user_id="user_123",
    integration="github"
)

print(f"Authenticate at: {auth_connection.redirect_url}")

# 身份验证后，用户的连接账户将可用
# 并且工具将使用他们的凭证工作
```

## 多用户场景

对于具有多个用户的应用程序：

```python
# 每个用户验证自己的账户
tools_user_1 = composio.tools.get(user_id="user_1", toolkits=["GITHUB"])
tools_user_2 = composio.tools.get(user_id="user_2", toolkits=["GITHUB"])

# 工具将使用相应用户的凭证
# 用户 1 的智能体将在用户 1 的 GitHub 账户上操作
agent_1 = create_agent(llm, tools_user_1)

# 用户 2 的智能体将在用户 2 的 GitHub 账户上操作
agent_2 = create_agent(llm, tools_user_2)
```

## 高级功能

### 自定义工具

Composio 允许您创建可以与内置工具一起使用的自定义工具。有两种类型：

#### 独立工具

不需要身份验证的简单工具：

```python
from pydantic import BaseModel, Field
from composio import Composio

composio = Composio()

class AddTwoNumbersInput(BaseModel):
    a: int = Field(..., description="The first number to add")
    b: int = Field(..., description="The second number to add")

# 函数名将用作工具 slug
@composio.tools.custom_tool
def add_two_numbers(request: AddTwoNumbersInput) -> int:
    """Add two numbers."""
    return request.a + request.b

# 与您的智能体一起使用
tools = composio.tools.get(user_id="default", toolkits=["GITHUB"])
tools.append(add_two_numbers)
```

#### 基于工具包的工具

需要身份验证并可以使用工具包凭证的工具：

```python
from composio.types import ExecuteRequestFn

class GetIssueInfoInput(BaseModel):
    issue_number: int = Field(
        ..., description="The number of the issue to get information about"
    )

@composio.tools.custom_tool(toolkit="github")
def get_issue_info(
    request: GetIssueInfoInput,
    execute_request: ExecuteRequestFn,
    auth_credentials: dict,
) -> dict:
    """Get information about a GitHub issue."""
    response = execute_request(
        endpoint=f"/repos/composiohq/composio/issues/{request.issue_number}",
        method="GET",
        parameters=[
            {
                "name": "Accept",
                "value": "application/vnd.github.v3+json",
                "type": "header",
            },
            {
                "name": "Authorization",
                "value": f"Bearer {auth_credentials['access_token']}",
                "type": "header",
            },
        ],
    )
    return {"data": response.data}
```

执行自定义工具：

```python
response = composio.tools.execute(
    user_id="default",
    slug="get_issue_info",  # 使用函数名作为 slug
    arguments={"issue_number": 1},
)
```

更多详情，请参阅 [Composio 自定义工具文档](https://docs.composio.dev/docs/custom-tools)

### 细粒度权限

控制工具可以执行的操作：

```python
# 获取具有特定权限的工具
tools = composio.tools.get(
    user_id="default",
    toolkits=["GITHUB"],
    # 限制为只读操作
    permissions=["read"]
)
```

---

## API 参考

有关所有 Composio 功能和配置的详细文档，请访问：
- [Composio 文档](https://docs.composio.dev)
- [LangChain 提供程序指南](https://docs.composio.dev/providers/langchain)
- [可用工具与操作](https://docs.composio.dev/toolkits/introduction)
