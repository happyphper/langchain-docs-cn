---
title: 目标
---
Aim 让 LangChain 执行的可视化和调试变得极其简单。Aim 能够追踪 LLM 和工具的输入输出，以及智能体（agent）的行为。

使用 Aim，你可以轻松调试和检查单个执行过程：

![227784778 06b806c7 74a1 4d15 ab85 9ece09b458aa](https://user-images.githubusercontent.com/13848158/227784778-06b806c7-74a1-4d15-ab85-9ece09b458aa.png)

此外，你还可以选择并排比较多个执行过程：

![227784994 699b24b7 e69b 48f9 9ffa e6a6142fd719](https://user-images.githubusercontent.com/13848158/227784994-699b24b7-e69b-48f9-9ffa-e6a6142fd719.png)

Aim 是完全开源的，在 GitHub 上[了解更多](https://github.com/aimhubio/aim)关于 Aim 的信息。

让我们继续，看看如何启用和配置 Aim 回调。

<h3>使用 Aim 追踪 LangChain 执行过程</h3>

在本笔记本中，我们将探索三种使用场景。首先，我们将安装必要的包并导入一些模块。随后，我们将配置两个环境变量，这些变量可以在 Python 脚本内设置，也可以通过终端设置。

```python
pip install -qU  aim
pip install -qU  langchain
pip install -qU  langchain-openai
pip install -qU  google-search-results
```

```python
import os
from datetime import datetime

from langchain_community.callbacks import AimCallbackHandler
from langchain_core.callbacks import StdOutCallbackHandler
from langchain_openai import OpenAI
```

我们的示例使用 GPT 模型作为 LLM，OpenAI 为此提供了 API。你可以从以下链接获取密钥：[platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)。

我们将使用 SerpApi 从 Google 获取搜索结果。要获取 SerpApi 密钥，请访问 [serpapi.com/manage-api-key](https://serpapi.com/manage-api-key)。

```python
os.environ["OPENAI_API_KEY"] = "..."
os.environ["SERPAPI_API_KEY"] = "..."
```

`AimCallbackHandler` 的事件方法接受 LangChain 模块或智能体作为输入，并至少将提示词、生成结果以及 LangChain 模块的序列化版本记录到指定的 Aim 运行（run）中。

```python
session_group = datetime.now().strftime("%m.%d.%Y_%H.%M.%S")
aim_callback = AimCallbackHandler(
    repo=".",
    experiment_name="scenario 1: OpenAI LLM",
)

callbacks = [StdOutCallbackHandler(), aim_callback]
llm = OpenAI(temperature=0, callbacks=callbacks)
```

`flush_tracker` 函数用于在 Aim 上记录 LangChain 资产。默认情况下，会话（session）会被重置而不是直接终止。

<h3>场景 1</h3> 在第一个场景中，我们将使用 OpenAI LLM。

```python
# scenario 1 - LLM
llm_result = llm.generate(["Tell me a joke", "Tell me a poem"] * 3)
aim_callback.flush_tracker(
    langchain_asset=llm,
    experiment_name="scenario 2: Chain with multiple SubChains on multiple generations",
)
```

<h3>场景 2</h3> 场景二涉及跨多代（generations）的、包含多个子链（SubChains）的链式调用。

```python
from langchain_classic.chains import LLMChain
from langchain_core.prompts import PromptTemplate
```

```python
# scenario 2 - Chain
template = """You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
Title: {title}
Playwright: This is a synopsis for the above play:"""
prompt_template = PromptTemplate(input_variables=["title"], template=template)
synopsis_chain = LLMChain(llm=llm, prompt=prompt_template, callbacks=callbacks)

test_prompts = [
    {
        "title": "documentary about good video games that push the boundary of game design"
    },
    {"title": "the phenomenon behind the remarkable speed of cheetahs"},
    {"title": "the best in class mlops tooling"},
]
synopsis_chain.apply(test_prompts)
aim_callback.flush_tracker(
    langchain_asset=synopsis_chain, experiment_name="scenario 3: Agent with Tools"
)
```

<h3>场景 3</h3> 第三个场景涉及一个带有工具的智能体。

```python
from langchain.agents import AgentType, initialize_agent, load_tools
```

```python
# scenario 3 - Agent with Tools
tools = load_tools(["serpapi", "llm-math"], llm=llm, callbacks=callbacks)
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    callbacks=callbacks,
)
agent.run(
    "Who is Leo DiCaprio's girlfriend? What is her current age raised to the 0.43 power?"
)
aim_callback.flush_tracker(langchain_asset=agent, reset=False, finish=True)
```

```text
> Entering new AgentExecutor chain...
 I need to find out who Leo DiCaprio's girlfriend is and then calculate her age raised to the 0.43 power.
Action: Search
Action Input: "Leo DiCaprio girlfriend"
Observation: Leonardo DiCaprio seemed to prove a long-held theory about his love life right after splitting from girlfriend Camila Morrone just months ...
Thought: I need to find out Camila Morrone's age
Action: Search
Action Input: "Camila Morrone age"
Observation: 25 years
Thought: I need to calculate 25 raised to the 0.43 power
Action: Calculator
Action Input: 25^0.43
Observation: Answer: 3.991298452658078

Thought: I now know the final answer
Final Answer: Camila Morrone is Leo DiCaprio's girlfriend and her current age raised to the 0.43 power is 3.991298452658078.

> Finished chain.
```
