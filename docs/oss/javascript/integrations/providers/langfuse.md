---
title: Langfuse
---
> **什么是 Langfuse？** [Langfuse](https://langfuse.com) 是一个开源的 LLM 工程平台，帮助团队追踪 API 调用、监控性能并调试其 AI 应用中的问题。

## 追踪 LangChain

[Langfuse Tracing](https://langfuse.com/docs/tracing) 通过 LangChain 回调函数（[Python](https://python.langchain.com/docs/how_to/#callbacks)、[JS](https://js.langchain.com/docs/how_to/#callbacks)）与 LangChain 集成。因此，Langfuse SDK 会自动为你的 LangChain 应用的每次运行创建一个嵌套的追踪（trace）。这使你能够记录、分析和调试你的 LangChain 应用。

你可以通过 (1) 构造函数参数或 (2) 环境变量来配置此集成。通过在 [cloud.langfuse.com](https://cloud.langfuse.com) 注册或[自行托管 Langfuse](https://langfuse.com/self-hosting) 来获取你的 Langfuse 凭证。

### 构造函数参数

```python
pip install langfuse
```

```python
from langfuse import Langfuse, get_client
from langfuse.langchain import CallbackHandler
from langchain_openai import ChatOpenAI  # Example LLM
from langchain_core.prompts import ChatPromptTemplate

# 使用构造函数参数初始化 Langfuse 客户端
Langfuse(
    public_key="your-public-key",
    secret_key="your-secret-key",
    host="https://cloud.langfuse.com"  # 可选：默认为 https://cloud.langfuse.com
)

# 获取已配置的客户端实例
langfuse = get_client()

# 初始化 Langfuse 处理器
langfuse_handler = CallbackHandler()

# 创建你的 LangChain 组件
llm = ChatOpenAI(model_name="gpt-4o")
prompt = ChatPromptTemplate.from_template("Tell me a joke about {topic}")
chain = prompt | llm

# 使用 Langfuse 追踪运行你的链
response = chain.invoke({"topic": "cats"}, config={"callbacks": [langfuse_handler]})
print(response.content)

# 在短生命周期的应用中，将事件刷新到 Langfuse
langfuse.flush()
```

### 环境变量

```bash filename=".env"
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_PUBLIC_KEY="pk-lf-..."
# 🇪🇺 欧盟区域
LANGFUSE_HOST="https://cloud.langfuse.com"
# 🇺🇸 美国区域
# LANGFUSE_HOST="https://us.cloud.langfuse.com"
```

```python
# 初始化 Langfuse 处理器
from langfuse.langchain import CallbackHandler
langfuse_handler = CallbackHandler()

# 你的 LangChain 代码

# 将 Langfuse 处理器添加为回调（经典方式和 LCEL 方式）
chain.invoke({"input": "<user_input>"}, config={"callbacks": [langfuse_handler]})
```

要了解如何将此集成与其他 Langfuse 功能结合使用，请查看[此端到端示例](https://langfuse.com/docs/integrations/langchain/example-python)。

## 追踪 LangGraph

这部分演示了 [Langfuse](https://langfuse.com/docs) 如何通过 [LangChain 集成](https://langfuse.com/docs/integrations/langchain/tracing) 帮助你调试、分析和迭代你的 LangGraph 应用。

### 初始化 Langfuse

**注意：** 你需要至少运行 Python 3.11（[GitHub Issue](https://github.com/langfuse/langfuse/issues/1926)）。

使用你在 Langfuse UI 项目设置中的 [API 密钥](https://langfuse.com/faq/all/where-are-langfuse-api-keys) 初始化 Langfuse 客户端，并将它们添加到你的环境中。

```python
pip install langfuse
pip install langchain langgraph langchain_openai langchain_community
```

```python
import os

# 从 https://cloud.langfuse.com 获取你项目的密钥
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-***"
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-***"
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 欧盟数据区域
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 美国数据区域

# 你的 openai 密钥
os.environ["OPENAI_API_KEY"] = "***"
```

### 使用 LangGraph 构建简单的聊天应用

**本节我们将做什么：**

*   在 LangGraph 中构建一个能够回答常见问题的支持聊天机器人
*   使用 Langfuse 追踪聊天机器人的输入和输出

我们将从一个基本的聊天机器人开始，并在下一节构建一个更高级的多智能体设置，同时介绍关键的 LangGraph 概念。

#### 创建智能体

首先创建一个 `StateGraph`。`StateGraph` 对象将我们的聊天机器人结构定义为一个状态机。我们将添加节点来表示 LLM 和聊天机器人可以调用的函数，并添加边来指定机器人在这些函数之间如何转换。

```python
from typing import Annotated

from langchain_openai import ChatOpenAI
from langchain.messages import HumanMessage
from typing_extensions import TypedDict

from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages

class State(TypedDict):
    # Messages 的类型是 "list"。注解中的 `add_messages` 函数定义了应如何更新此状态键
    # （在这种情况下，它会将消息追加到列表中，而不是覆盖它们）
    messages: Annotated[list, add_messages]

graph_builder = StateGraph(State)

llm = ChatOpenAI(model = "gpt-4o", temperature = 0.2)

# 聊天机器人节点函数将当前 State 作为输入，并返回更新后的消息列表。这是所有 LangGraph 节点函数的基本模式。
def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}

# 添加一个 "chatbot" 节点。节点代表工作单元。它们通常是常规的 python 函数。
graph_builder.add_node("chatbot", chatbot)

# 添加入口点。这告诉我们的图每次运行时从哪里开始工作。
graph_builder.set_entry_point("chatbot")

# 设置完成点。这指示图"任何时候运行此节点，你都可以退出。"
graph_builder.set_finish_point("chatbot")

# 为了能够运行我们的图，在 graph builder 上调用 "compile()"。这会创建一个我们可以用来调用状态的 "CompiledGraph"。
graph = graph_builder.compile()
```

#### 将 Langfuse 作为回调添加到调用中

现在，我们将添加 [Langfuse 的 LangChain 回调处理器](https://langfuse.com/docs/integrations/langchain/tracing) 来追踪我们应用的步骤：`config={"callbacks": [langfuse_handler]}`

```python
from langfuse.langchain import CallbackHandler

# 初始化 Langfuse 的 LangChain 回调处理器（用于追踪）
langfuse_handler = CallbackHandler()

for s in graph.stream({"messages": [HumanMessage(content = "What is Langfuse?")]},
                      config={"callbacks": [langfuse_handler]}):
    print(s)
```

```
{'chatbot': {'messages': [AIMessage(content='Langfuse is a tool designed to help developers monitor and observe the performance of their Large Language Model (LLM) applications. It provides detailed insights into how these applications are functioning, allowing for better debugging, optimization, and overall management. Langfuse offers features such as tracking key metrics, visualizing data, and identifying potential issues in real-time, making it easier for developers to maintain and improve their LLM-based solutions.', response_metadata={'token_usage': {'completion_tokens': 86, 'prompt_tokens': 13, 'total_tokens': 99}, 'model_name': 'gpt-4o-2024-05-13', 'system_fingerprint': 'fp_400f27fa1f', 'finish_reason': 'stop', 'logprobs': None}, id='run-9a0c97cb-ccfe-463e-902c-5a5900b796b4-0', usage_metadata={'input_tokens': 13, 'output_tokens': 86, 'total_tokens': 99})]}}
```

#### 在 Langfuse 中查看追踪

Langfuse 中的追踪示例：https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/d109e148-d188-4d6e-823f-aac0864afbab

![Langfuse 中聊天应用的追踪视图](https://langfuse.com/images/cookbook/integration-langgraph/integration_langgraph_chatapp_trace.png)

- 查看[完整笔记本](https://langfuse.com/docs/integrations/langchain/example-python-langgraph)以查看更多示例。
- 要了解如何评估你的 LangGraph 应用性能，请查看 [LangGraph 评估指南](https://langfuse.com/docs/integrations/langchain/example-langgraph-agents)。
