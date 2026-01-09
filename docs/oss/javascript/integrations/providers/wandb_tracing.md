---
title: Weights & Biases 追踪
---
有两种推荐的方法来追踪你的 LangChain 应用：

1. 将 `LANGCHAIN_WANDB_TRACING` 环境变量设置为 "true"。
2. 使用带有 `tracing_enabled()` 的上下文管理器来追踪特定的代码块。

**注意**：如果设置了环境变量，所有代码都将被追踪，无论其是否在上下文管理器内部。

```python
import os

from langchain_community.callbacks import wandb_tracing_enabled

os.environ["LANGCHAIN_WANDB_TRACING"] = "true"

# wandb 关于使用环境变量配置 wandb 的文档
# https://docs.wandb.ai/guides/track/advanced/environment-variables
# 这里我们配置 wandb 项目名称
os.environ["WANDB_PROJECT"] = "langchain-tracing"

from langchain.agents import AgentType, initialize_agent, load_tools
from langchain_openai import OpenAI
```

```python
# 启用追踪的智能体运行。确保正确设置了 OPENAI_API_KEY 以运行此示例。

llm = OpenAI(temperature=0)
tools = load_tools(["llm-math"], llm=llm)
```

```python
agent = initialize_agent(
    tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)

agent.run("What is 2 raised to .123243 power?")  # 此行应被追踪
# 你的控制台应打印出类似以下的追踪会话链接：
# https://wandb.ai/<wandb_entity>/<wandb_project>/runs/<run_id>
# 该链接可用于在 wandb 中查看追踪会话。
```

```python
# 现在，我们取消设置环境变量并使用上下文管理器。
if "LANGCHAIN_WANDB_TRACING" in os.environ:
    del os.environ["LANGCHAIN_WANDB_TRACING"]

# 使用上下文管理器启用追踪
with wandb_tracing_enabled():
    agent.run("What is 5 raised to .123243 power?")  # 此行应被追踪

agent.run("What is 2 raised to .123243 power?")  # 此行不应被追踪
```

```text
> Entering new AgentExecutor chain...
 I need to use a calculator to solve this.
Action: Calculator
Action Input: 5^.123243
Observation: Answer: 1.2193914912400514
Thought: I now know the final answer.
Final Answer: 1.2193914912400514

> Finished chain.

> Entering new AgentExecutor chain...
 I need to use a calculator to solve this.
Action: Calculator
Action Input: 2^.123243
Observation: Answer: 1.0891804557407723
Thought: I now know the final answer.
Final Answer: 1.0891804557407723

> Finished chain.
```

```text
'1.0891804557407723'
```
