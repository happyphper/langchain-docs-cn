---
title: LLMonitor
---
>[LLMonitor](https://llmonitor.com?utm_source=langchain&utm_medium=py&utm_campaign=docs) 是一个开源的观测平台，提供成本和用量分析、用户追踪、链路追踪和评估工具。

<video controls width='100%' >
    <source src='https://llmonitor.com/videos/demo-annotated.mp4'/>
</video>

## 设置

在 [llmonitor.com](https://llmonitor.com?utm_source=langchain&utm_medium=py&utm_campaign=docs) 上创建一个账户，然后复制您新应用的 `tracking id`。

获取后，通过运行以下命令将其设置为环境变量：

```bash
export LLMONITOR_APP_ID="..."
```

如果您不希望设置环境变量，也可以在初始化回调处理器时直接传入密钥：

```python
from langchain_community.callbacks.llmonitor_callback import LLMonitorCallbackHandler

handler = LLMonitorCallbackHandler(app_id="...")
```

## 与 LLM/聊天模型一起使用

```python
from langchain_openai import OpenAI
from langchain_openai import ChatOpenAI

handler = LLMonitorCallbackHandler()

llm = OpenAI(
    callbacks=[handler],
)

chat = ChatOpenAI(callbacks=[handler])

llm("Tell me a joke")
```

## 与链和智能体一起使用

请确保将回调处理器传递给 `run` 方法，以便正确追踪所有相关的链和 LLM 调用。

同时建议在元数据中传递 `agent_name`，以便在仪表板中区分不同的智能体。

示例：

```python
from langchain_openai import ChatOpenAI
from langchain_community.callbacks.llmonitor_callback import LLMonitorCallbackHandler
from langchain.messages import SystemMessage, HumanMessage
from langchain.agents import OpenAIFunctionsAgent, AgentExecutor, tool

llm = ChatOpenAI(temperature=0)

handler = LLMonitorCallbackHandler()

@tool
def get_word_length(word: str) -> int:
    """Returns the length of a word."""
    return len(word)

tools = [get_word_length]

prompt = OpenAIFunctionsAgent.create_prompt(
    system_message=SystemMessage(
        content="You are very powerful assistant, but bad at calculating lengths of words."
    )
)

agent = OpenAIFunctionsAgent(llm=llm, tools=tools, prompt=prompt, verbose=True)
agent_executor = AgentExecutor(
    agent=agent, tools=tools, verbose=True, metadata={"agent_name": "WordCount"}  # <- 推荐，分配一个自定义名称
)
agent_executor.run("how many letters in the word educa?", callbacks=[handler])
```

另一个示例：

```python
import os

from langchain_community.agent_toolkits.load_tools import load_tools
from langchain_community.callbacks.llmonitor_callback import LLMonitorCallbackHandler
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent

os.environ["LLMONITOR_APP_ID"] = ""
os.environ["OPENAI_API_KEY"] = ""
os.environ["SERPAPI_API_KEY"] = ""

handler = LLMonitorCallbackHandler()
llm = ChatOpenAI(temperature=0, callbacks=[handler])
tools = load_tools(["serpapi", "llm-math"], llm=llm)
agent = create_agent("gpt-4.1-mini", tools)

input_message = {
    "role": "user",
    "content": "What's the weather in SF?",
}

agent.invoke({"messages": [input_message]})
```

## 用户追踪

用户追踪功能允许您识别用户、追踪其成本、对话记录等。

```python
from langchain_community.callbacks.llmonitor_callback import LLMonitorCallbackHandler, identify

with identify("user-123"):
    llm.invoke("Tell me a joke")

with identify("user-456", user_props={"email": "user456@test.com"}):
    agent.invoke(...)
```

## 支持

关于集成方面的任何问题或疑问，您可以通过 [Discord](http://discord.com/invite/8PafSG58kK) 或 [电子邮件](mailto:vince@llmonitor.com) 联系 LLMonitor 团队。
