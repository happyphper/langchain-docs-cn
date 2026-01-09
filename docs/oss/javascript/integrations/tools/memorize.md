---
title: 记忆
---
使用无监督学习对 LLM 本身进行微调以记忆信息。

此工具需要支持微调的 LLM。目前仅支持 `langchain.llms import GradientLLM`。

## 导入

```python
import os

from langchain.agents import AgentExecutor, AgentType, initialize_agent, load_tools
from langchain_classic.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain_community.llms import GradientLLM
```

## 设置环境 API 密钥

请确保从 Gradient AI 获取您的 API 密钥。您将获得 10 美元的免费额度，用于测试和微调不同的模型。

```python
from getpass import getpass

if not os.environ.get("GRADIENT_ACCESS_TOKEN", None):
    # 访问令牌位于 https://auth.gradient.ai/select-workspace
    os.environ["GRADIENT_ACCESS_TOKEN"] = getpass("gradient.ai access token:")
if not os.environ.get("GRADIENT_WORKSPACE_ID", None):
    # `ID` 列在 `$ gradient workspace list` 中
    # 登录后也会在 https://auth.gradient.ai/select-workspace 显示
    os.environ["GRADIENT_WORKSPACE_ID"] = getpass("gradient.ai workspace id:")
if not os.environ.get("GRADIENT_MODEL_ADAPTER_ID", None):
    # `ID` 列在 `$ gradient model list --workspace-id "$GRADIENT_WORKSPACE_ID"` 中
    os.environ["GRADIENT_MODEL_ID"] = getpass("gradient.ai model id:")
```

可选：验证您的环境变量 `GRADIENT_ACCESS_TOKEN` 和 `GRADIENT_WORKSPACE_ID` 以获取当前部署的模型。

## 创建 `GradientLLM` 实例

您可以指定不同的参数，例如模型名称、生成的最大令牌数、温度等。

```python
llm = GradientLLM(
    model_id=os.environ["GRADIENT_MODEL_ID"],
    # # 可选：设置新的凭据，它们默认为环境变量
    # gradient_workspace_id=os.environ["GRADIENT_WORKSPACE_ID"],
    # gradient_access_token=os.environ["GRADIENT_ACCESS_TOKEN"],
)
```

## 加载工具

```python
tools = load_tools(["memorize"], llm=llm)
```

## 初始化智能体

```python
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    # memory=ConversationBufferMemory(memory_key="chat_history", return_messages=True),
)
```

## 运行智能体

要求智能体记住一段文本。

```python
agent.run(
    "Please remember the fact in detail:\nWith astonishing dexterity, Zara Tubikova set a world record by solving a 4x4 Rubik's Cube variation blindfolded in under 20 seconds, employing only their feet."
)
```

```text
> Entering new AgentExecutor chain...
I should memorize this fact.
Action: Memorize
Action Input: Zara T
Observation: Train complete. Loss: 1.6853971333333335
Thought:I now know the final answer.
Final Answer: Zara Tubikova set a world

> Finished chain.
```

```text
'Zara Tubikova set a world'
```
