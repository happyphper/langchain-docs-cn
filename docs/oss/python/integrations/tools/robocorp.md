---
title: Robocorp 工具包
---
本笔记本介绍如何开始使用 [Robocorp Action Server](https://github.com/robocorp/robocorp) 动作工具包和 LangChain。

Robocorp 是通过自定义动作扩展 AI 代理、助手和副驾能力的最简单方式。

## 安装

首先，请查看 [Robocorp 快速入门](https://github.com/robocorp/robocorp#quickstart)，了解如何设置 `Action Server` 并创建您的动作。

在您的 LangChain 应用程序中，安装 `langchain-robocorp` 包：

```python
# 安装包
pip install -qU langchain-robocorp
```

当您按照上述快速入门创建新的 `Action Server` 时，它将创建一个包含文件的目录，其中包括 `action.py`。

我们可以按照[此处](https://github.com/robocorp/robocorp/tree/master/actions#describe-your-action)所示添加 Python 函数作为动作。

让我们向 `action.py` 添加一个虚拟函数。

```python
@action
def get_weather_forecast(city: str, days: int, scale: str = "celsius") -> str:
    """
    返回指定城市的天气预报。

    参数:
        city (str): 要获取天气状况的目标城市
        days: 要返回多少天的预报
        scale (str): 使用的温度单位，应为 "celsius" 或 "fahrenheit" 之一

    返回:
        str: 请求的天气预报
    """
    return "75F and sunny :)"
```

然后我们启动服务器：

```bash
action-server start
```

我们可以看到：

```
发现新动作：get_weather_forecast
```

通过访问运行在 `http://localhost:8080` 的服务器并使用 UI 运行函数来进行本地测试。

## 环境设置

您可以选择设置以下环境变量：

- `LANGSMITH_TRACING=true`：启用 LangSmith 运行追踪，该追踪也可以绑定到相应的 Action Server 动作运行日志。更多信息请参阅 [LangSmith 文档](https://docs.langchain.com/langsmith/observability-quickstart#log-runs)。

## 使用

我们已经在 `http://localhost:8080` 上启动了本地动作服务器。

```python
from langchain.agents import AgentExecutor, OpenAIFunctionsAgent
from langchain.messages import SystemMessage
from langchain_openai import ChatOpenAI
from langchain_robocorp import ActionServerToolkit

# 初始化 LLM 聊天模型
llm = ChatOpenAI(model="gpt-4", temperature=0)

# 初始化 Action Server 工具包
toolkit = ActionServerToolkit(url="http://localhost:8080", report_trace=True)
tools = toolkit.get_tools()

# 初始化代理
system_message = SystemMessage(content="你是一个乐于助人的助手")
prompt = OpenAIFunctionsAgent.create_prompt(system_message)
agent = OpenAIFunctionsAgent(llm=llm, prompt=prompt, tools=tools)

executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

executor.invoke("旧金山今天当前的天气（华氏度）是多少？")
```

```text
> 进入新的 AgentExecutor 链...

调用：`robocorp_action_server_get_weather_forecast`，参数为 `{'city': 'San Francisco', 'days': 1, 'scale': 'fahrenheit'}`

"75F and sunny :)"旧金山今天当前的天气是 75 华氏度，晴朗。

> 链完成。
```

```text
{'input': 'What is the current weather today in San Francisco in fahrenheit?',
 'output': 'The current weather today in San Francisco is 75F and sunny.'}
```

### 单输入工具

默认情况下，`toolkit.get_tools()` 会将动作作为结构化工具返回。

要返回单输入工具，请传递一个用于处理输入的聊天模型。

```python
# 初始化单输入 Action Server 工具包
toolkit = ActionServerToolkit(url="http://localhost:8080")
tools = toolkit.get_tools(llm=llm)
```
