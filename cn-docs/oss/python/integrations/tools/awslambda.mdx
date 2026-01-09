---
title: AWS Lambda
---
>[`Amazon AWS Lambda`](https://aws.amazon.com/pm/lambda/) 是 `Amazon Web Services` (`AWS`) 提供的一项无服务器计算服务。它帮助开发人员构建和运行应用程序及服务，而无需预置或管理服务器。这种无服务器架构使您能够专注于编写和部署代码，而 AWS 会自动负责运行应用程序所需的扩展、修补和管理基础设施。

本笔记本将介绍如何使用 `AWS Lambda` 工具。

通过将 `AWS Lambda` 包含在提供给 Agent 的工具列表中，您可以授予您的 Agent 调用在您 AWS 云中运行的代码的能力，以满足您的任何需求。

当 Agent 使用 `AWS Lambda` 工具时，它将提供一个字符串类型的参数，该参数随后将通过 event 参数传递给 Lambda 函数。

首先，您需要安装 `boto3` Python 包。

```python
pip install -qU  boto3 > /dev/null
pip install -qU langchain-community
```

为了让 Agent 使用该工具，您必须为其提供与您 Lambda 函数逻辑功能相匹配的名称和描述。

您还必须提供您的函数名称。

请注意，由于此工具本质上只是 boto3 库的一个包装器，您需要运行 `aws configure` 才能使用该工具。更多详情，请参阅[此处](https://docs.aws.amazon.com/cli/index.html)

```python
from langchain.agents import AgentType, initialize_agent, load_tools
from langchain_openai import OpenAI

llm = OpenAI(temperature=0)

tools = load_tools(
    ["awslambda"],
    awslambda_tool_name="email-sender",
    awslambda_tool_description="sends an email with the specified content to test@testing123.com",
    function_name="testFunction1",
)

agent = initialize_agent(
    tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)

agent.run("Send an email to test@testing123.com saying hello world.")
```

```python

```
