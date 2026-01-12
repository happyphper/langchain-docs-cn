---
title: Weights & Biases 追踪
---
本笔记本将介绍如何将您的 LangChain 实验跟踪到一个集中的 `Weights and Biases` 仪表板中。

要了解更多关于提示工程和回调的信息，请参考以下笔记本，其中解释了这两者以及您可以预期看到的仪表板结果：

<a href="https://colab.research.google.com/drive/1DXH4beT4HFaRKy_Vm4PoxhXVDRf7Ym8L?usp=sharing" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" /></a>

在 [W&B 文章](https://wandb.ai/a-sh0ts/langchain_callback_demo/reports/Prompt-Engineering-LLMs-with-LangChain-and-W-B--VmlldzozNjk1NTUw#👋-how-to-build-a-callback-in-langchain-for-better-prompt-engineering
) 中查看详细描述和示例。

**注意**：_`WandbCallbackHandler` 正在被弃用，转而支持 `WandbTracer`_。未来请使用 `WandbTracer`，因为它更灵活，允许更细粒度的日志记录。

要了解更多关于 `WandbTracer` 的信息，请参考 [agent_with_wandb_tracing](/oss/javascript/integrations/providers/wandb_tracing) 笔记本或使用以下 [colab notebook](http://wandb.me/prompts-quickstart)。

要了解更多关于 Weights & Biases Prompts 的信息，请参考以下 [prompts 文档](https://docs.wandb.ai/guides/prompts)。

```python
pip install -qU  wandb
pip install -qU  pandas
pip install -qU  textstat
pip install -qU  spacy
!python -m spacy download en_core_web_sm
```

```python
import os

os.environ["WANDB_API_KEY"] = ""
# os.environ["OPENAI_API_KEY"] = ""
# os.environ["SERPAPI_API_KEY"] = ""
```

```python
from datetime import datetime

from langchain_community.callbacks import WandbCallbackHandler
from langchain_core.callbacks import StdOutCallbackHandler
from langchain_openai import OpenAI
```

```
记录到 Weights and Biases 的回调处理器。

参数：
    job_type (str): 作业类型。
    project (str): 要记录到的项目。
    entity (str): 要记录到的实体。
    tags (list): 要记录的标签。
    group (str): 要记录到的组。
    name (str): 运行的名称。
    notes (str): 要记录的备注。
    visualize (bool): 是否可视化运行。
    complexity_metrics (bool): 是否记录复杂度指标。
    stream_logs (bool): 是否将回调操作流式传输到 W&B
```

```
WandbCallbackHandler(...) 的默认值

visualize: bool = False,
complexity_metrics: bool = False,
stream_logs: bool = False,
```

注意：对于测试版工作流，我们默认使用 textstat 进行分析，并使用 spacy 进行可视化。

```python
"""主函数。

此函数用于尝试回调处理器。
场景：
1. OpenAI LLM
2. 包含多个子链和多次生成的链
3. 带有工具的代理
"""
session_group = datetime.now().strftime("%m.%d.%Y_%H.%M.%S")
wandb_callback = WandbCallbackHandler(
    job_type="inference",
    project="langchain_callback_demo",
    group=f"minimal_{session_group}",
    name="llm",
    tags=["test"],
)
callbacks = [StdOutCallbackHandler(), wandb_callback]
llm = OpenAI(temperature=0, callbacks=callbacks)
```

```text
wandb: Currently logged in as: harrison-chase. Use `wandb login --relogin` to force relogin
```

```html
Tracking run with wandb version 0.14.0
```

```html
Run data is saved locally in <code>/Users/harrisonchase/workplace/langchain/docs/ecosystem/wandb/run-20230318_150408-e47j1914</code>
```

```html
Syncing run <strong><a href='https://wandb.ai/harrison-chase/langchain_callback_demo/runs/e47j1914' target="_blank">llm</a></strong> to <a href='https://wandb.ai/harrison-chase/langchain_callback_demo' target="_blank">Weights & Biases</a> (<a href='https://wandb.me/run' target="_blank">docs</a>)<br/>
```

```html
View project at <a href='https://wandb.ai/harrison-chase/langchain_callback_demo' target="_blank">https://wandb.ai/harrison-chase/langchain_callback_demo</a>
```

```html
View run at <a href='https://wandb.ai/harrison-chase/langchain_callback_demo/runs/e47j1914' target="_blank">https://wandb.ai/harrison-chase/langchain_callback_demo/runs/e47j1914</a>
```

```text
wandb: WARNING The wandb callback is currently in beta and is subject to change based on updates to `langchain`. Please report any issues to https://github.com/wandb/wandb/issues with the tag `langchain`.
```

```
# WandbCallbackHandler.flush_tracker(...) 的默认值

reset: bool = True,
finish: bool = False,
```

`flush_tracker` 函数用于将 LangChain 会话记录到 Weights & Biases。它接收 LangChain 模块或代理，并至少将提示和生成内容以及 LangChain 模块的序列化形式记录到指定的 Weights & Biases 项目中。默认情况下，我们会重置会话，而不是直接结束会话。

## 使用场景

### 与 LLM 一起使用

```python
# 场景 1 - LLM
llm_result = llm.generate(["Tell me a joke", "Tell me a poem"] * 3)
wandb_callback.flush_tracker(llm, name="simple_sequential")
```

```html
Waiting for W&B process to finish... <strong style="color:green">(success).</strong>
```

```html
View run <strong style="color:#cdcd00">llm</strong> at: <a href='https://wandb.ai/harrison-chase/langchain_callback_demo/runs/e47j1914' target="_blank">https://wandb.ai/harrison-chase/langchain_callback_demo/runs/e47j1914</a><br/>Synced 5 W&B file(s), 2 media file(s), 5 artifact file(s) and 0 other file(s)
```

```html
Find logs at: <code>./wandb/run-20230318_150408-e47j1914/logs</code>
```

```text
VBox(children=(Label(value='Waiting for wandb.init()...\r'), FloatProgress(value=0.016745895149999985, max=1.0…
```

```html
Tracking run with wandb version 0.14.0
```

```html
Run data is saved locally in <code>/Users/harrisonchase/workplace/langchain/docs/ecosystem/wandb/run-20230318_150534-jyxma7hu</code>
```

```html
Syncing run <strong><a href='https://wandb.ai/harrison-chase/langchain_callback_demo/runs/jyxma7hu' target="_blank">simple_sequential</a></strong> to <a href='https://wandb.ai/harrison-chase/langchain_callback_demo' target="_blank">Weights & Biases</a> (<a href='https://wandb.me/run' target="_blank">docs</a>)<br/>
```

```html
View project at <a href='https://wandb.ai/harrison-chase/langchain_callback_demo' target="_blank">https://wandb.ai/harrison-chase/langchain_callback_demo</a>
```

```html
View run at <a href='https://wandb.ai/harrison-chase/langchain_callback_demo/runs/jyxma7hu' target="_blank">https://wandb.ai/harrison-chase/langchain_callback_demo/runs/jyxma7hu</a>
```

### 在链中使用

```python
from langchain_classic.chains import LLMChain
from langchain_core.prompts import PromptTemplate
```

```python
# 场景 2 - 链
template = """You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
Title: {title}
Playwright: This is a synopsis for the above play:"""
prompt_template = PromptTemplate(input_variables=["title"], template=template)
synopsis_chain = LLMChain(llm=llm, prompt=prompt_template, callbacks=callbacks)

test_prompts = [
    {
        "title": "documentary about good video games that push the boundary of game design"
    },
    {"title": "cocaine bear vs heroin wolf"},
    {"title": "the best in class mlops tooling"},
]
synopsis_chain.apply(test_prompts)
wandb_callback.flush_tracker(synopsis_chain, name="agent")
```

```html
Waiting for W&B process to finish... <strong style="color:green">(success).</strong>
```

```html
View run <strong style="color:#cdcd00">simple_sequential</strong> at: <a href='https://wandb.ai/harrison-chase/langchain_callback_demo/runs/jyxma7hu' target="_blank">https://wandb.ai/harrison-chase/langchain_callback_demo/runs/jyxma7hu</a><br/>Synced 4 W&B file(s), 2 media file(s), 6 artifact file(s) and 0 other file(s)
```

```html
Find logs at: <code>./wandb/run-20230318_150534-jyxma7hu/logs</code>
```

```text
VBox(children=(Label(value='Waiting for wandb.init()...\r'), FloatProgress(value=0.016736786816666675, max=1.0…
```

```html
Tracking run with wandb version 0.14.0
```

```html
Run data is saved locally in <code>/Users/harrisonchase/workplace/langchain/docs/ecosystem/wandb/run-20230318_150550-wzy59zjq</code>
```

```html
Syncing run <strong><a href='https://wandb.ai/harrison-chase/langchain_callback_demo/runs/wzy59zjq' target="_blank">agent</a></strong> to <a href='https://wandb.ai/harrison-chase/langchain_callback_demo' target="_blank">Weights & Biases</a> (<a href='https://wandb.me/run' target="_blank">docs</a>)<br/>
```

```html
View project at <a href='https://wandb.ai/harrison-chase/langchain_callback_demo' target="_blank">https://wandb.ai/harrison-chase/langchain_callback_demo</a>
```

```html
View run at <a href='https://wandb.ai/harrison-chase/langchain_callback_demo/runs/wzy59zjq' target="_blank">https://wandb.ai/harrison-chase/langchain_callback_demo/runs/wzy59zjq</a>
```

### 与代理一起使用

```python
from langchain.agents import AgentType, initialize_agent, load_tools
```

```python
# 场景 3 - 带有工具的代理
tools = load_tools(["serpapi", "llm-math"], llm=llm)
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
)
agent.run(
    "Who is Leo DiCaprio's girlfriend? What is her current age raised to the 0.43 power?",
    callbacks=callbacks,
)
wandb_callback.flush_tracker(agent, reset=False, finish=True)
```

```text
> Entering new AgentExecutor chain...
 I need to find out who Leo DiCaprio's girlfriend is and then calculate her age raised to the 0.43 power.
Action: Search
Action Input: "Leo DiCaprio girlfriend"
Observation: DiCaprio had a steady girlfriend in Camila Morrone. He had been with the model turned actress for nearly five years, as they were first said to be dating at the end of 2017. And the now 26-year-old Morrone is no stranger to Hollywood.
Thought: I need to calculate her age raised to the 0.43 power.
Action: Calculator
Action Input: 26^0.43
Observation: Answer: 4.059182145592686

Thought: I now know the final answer.
Final Answer: Leo DiCaprio's girlfriend is Camila Morrone and her current age raised to the 0.43 power is 4.059182145592686.

> Finished chain.
```

```html
Waiting for W&B process to finish... <strong style="color:green">(success).</strong>
```

```html
View run <strong style="color:#cdcd00">agent</strong> at: <a href='https://wandb.ai/harrison-chase/langchain_callback_demo/runs/wzy59zjq' target="_blank">https://wandb.ai/harrison-chase/langchain_callback_demo/runs/wzy59zjq</a><br/>Synced 5 W&B file(s), 2 media file(s), 7 artifact file(s) and 0 other file(s)
```

```html
Find logs at: <code>./wandb/run-20230318_150550-wzy59zjq/logs</code>
```

```python

```
