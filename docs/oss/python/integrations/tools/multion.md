---
title: MultiOn 工具包
---
[MultiON](https://www.multion.ai/blog/multion-building-a-brighter-future-for-humanity-with-ai-agents) 构建了一个能够与广泛的网络服务和应用程序交互的 AI 智能体。

本笔记本将引导您如何将 LangChain 连接到您浏览器中的 `MultiOn` 客户端。

这使得能够利用 MultiON 智能体的能力，实现自定义的智能体工作流。

要使用此工具包，您需要在浏览器中添加 `MultiOn 扩展`：

* 创建一个 [MultiON 账户](https://app.multion.ai/login?callbackUrl=%2Fprofile)。
* 添加 [Chrome 版 MultiOn 扩展](https://multion.notion.site/Download-MultiOn-ddddcfe719f94ab182107ca2612c07a5)。

```python
pip install -qU  multion langchain -q
```

```python
pip install -qU langchain-community
```

```python
from langchain_community.agent_toolkits import MultionToolkit

toolkit = MultionToolkit()
toolkit
```

```text
MultionToolkit()
```

```python
tools = toolkit.get_tools()
tools
```

```text
[MultionCreateSession(), MultionUpdateSession(), MultionCloseSession()]
```

## MultiOn 设置

创建账户后，请在 [app.multion.ai/](https://app.multion.ai/) 创建一个 API 密钥。

登录以建立与您浏览器扩展的连接。

```python
# 授权连接到您的浏览器扩展
import multion

multion.login()
```

```text
Logged in.
```

## 在智能体中使用 Multion 工具包

这将使用 MultiON Chrome 扩展来执行所需的操作。

我们可以运行下面的代码，并查看 [trace](https://smith.langchain.com/public/34aaf36d-204a-4ce3-a54e-4a0976f09670/r) 来了解：

* 智能体使用了 `create_multion_session` 工具
* 然后它使用 MultiON 来执行查询

```python
from langchain_classic import hub
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
```

```python
# 提示词
instructions = """You are an assistant."""
base_prompt = hub.pull("langchain-ai/openai-functions-template")
prompt = base_prompt.partial(instructions=instructions)
```

```python
# LLM
llm = ChatOpenAI(temperature=0)
```

```python
# 智能体
agent = create_openai_functions_agent(llm, toolkit.get_tools(), prompt)
agent_executor = AgentExecutor(
    agent=agent,
    tools=toolkit.get_tools(),
    verbose=False,
)
```

```python
agent_executor.invoke(
    {
        "input": "Use multion to explain how AlphaCodium works, a recently released code language model."
    }
)
```

```text
WARNING: 'new_session' is deprecated and will be removed in a future version. Use 'create_session' instead.
WARNING: 'update_session' is deprecated and will be removed in a future version. Use 'step_session' instead.
WARNING: 'update_session' is deprecated and will be removed in a future version. Use 'step_session' instead.
WARNING: 'update_session' is deprecated and will be removed in a future version. Use 'step_session' instead.
WARNING: 'update_session' is deprecated and will be removed in a future version. Use 'step_session' instead.
```

```text
{'input': 'Use multion to how AlphaCodium works, a recently released code language model.',
 'output': 'AlphaCodium is a recently released code language model that is designed to assist developers in writing code more efficiently. It is based on advanced machine learning techniques and natural language processing. AlphaCodium can understand and generate code in multiple programming languages, making it a versatile tool for developers.\n\nThe model is trained on a large dataset of code snippets and programming examples, allowing it to learn patterns and best practices in coding. It can provide suggestions and auto-complete code based on the context and the desired outcome.\n\nAlphaCodium also has the ability to analyze code and identify potential errors or bugs. It can offer recommendations for improving code quality and performance.\n\nOverall, AlphaCodium aims to enhance the coding experience by providing intelligent assistance and reducing the time and effort required to write high-quality code.\n\nFor more detailed information, you can visit the official AlphaCodium website or refer to the documentation and resources available online.\n\nI hope this helps! Let me know if you have any other questions.'}
```
