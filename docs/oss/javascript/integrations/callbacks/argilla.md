---
title: Argilla
---
>[Argilla](https://argilla.io/) 是一个面向大语言模型（LLM）的开源数据管理平台。
> 通过 Argilla，每个人都可以利用人类和机器的反馈，通过更快的数据管理来构建稳健的语言模型。
> 我们为 MLOps 周期的每一步提供支持，从数据标注到模型监控。

<a target="_blank" href="https://colab.research.google.com/github/langchain-ai/langchain/blob/v0.3/docs/docs/integrations/callbacks/argilla.ipynb">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" />
</a>

在本指南中，我们将演示如何使用 `ArgillaCallbackHandler` 来跟踪您 LLM 的输入和响应，从而在 Argilla 中生成数据集。

跟踪 LLM 的输入和输出对于生成用于未来微调的数据集非常有用。当您使用 LLM 为特定任务（如问答、摘要或翻译）生成数据时，这一点尤其有用。

## 安装与设置

```python
pip install -qU  langchain langchain-openai argilla
```

### 获取 API 凭证

要获取 Argilla API 凭证，请按照以下步骤操作：

1.  进入您的 Argilla UI。
2.  点击您的个人资料图片，然后进入 "My settings"。
3.  复制 API 密钥。

在 Argilla 中，API URL 将与您的 Argilla UI 的 URL 相同。

要获取 OpenAI API 凭证，请访问 [platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)

```python
import os

os.environ["ARGILLA_API_URL"] = "..."
os.environ["ARGILLA_API_KEY"] = "..."

os.environ["OPENAI_API_KEY"] = "..."
```

### 设置 Argilla

要使用 `ArgillaCallbackHandler`，我们需要在 Argilla 中创建一个新的 `FeedbackDataset` 来跟踪您的 LLM 实验。为此，请使用以下代码：

```python
import argilla as rg
```

```python
from packaging.version import parse as parse_version

if parse_version(rg.__version__) < parse_version("1.8.0"):
    raise RuntimeError(
        "`FeedbackDataset` is only available in Argilla v1.8.0 or higher, please "
        "upgrade `argilla` as `pip install argilla --upgrade`."
    )
```

```python
dataset = rg.FeedbackDataset(
    fields=[
        rg.TextField(name="prompt"),
        rg.TextField(name="response"),
    ],
    questions=[
        rg.RatingQuestion(
            name="response-rating",
            description="How would you rate the quality of the response?",
            values=[1, 2, 3, 4, 5],
            required=True,
        ),
        rg.TextQuestion(
            name="response-feedback",
            description="What feedback do you have for the response?",
            required=False,
        ),
    ],
    guidelines="You're asked to rate the quality of the response and provide feedback.",
)

rg.init(
    api_url=os.environ["ARGILLA_API_URL"],
    api_key=os.environ["ARGILLA_API_KEY"],
)

dataset.push_to_argilla("langchain-dataset")
```

> 📌 注意：目前，仅支持将提示-响应对作为 `FeedbackDataset.fields`，因此 `ArgillaCallbackHandler` 将仅跟踪提示（即 LLM 输入）和响应（即 LLM 输出）。

## 跟踪

要使用 `ArgillaCallbackHandler`，您可以使用以下代码，或者直接重现后续章节中展示的任一示例。

```python
from langchain_community.callbacks.argilla_callback import ArgillaCallbackHandler

argilla_callback = ArgillaCallbackHandler(
    dataset_name="langchain-dataset",
    api_url=os.environ["ARGILLA_API_URL"],
    api_key=os.environ["ARGILLA_API_KEY"],
)
```

### 场景 1：跟踪一个 LLM

首先，让我们运行一个单独的 LLM 几次，并在 Argilla 中捕获生成的提示-响应对。

```python
from langchain_core.callbacks.stdout import StdOutCallbackHandler
from langchain_openai import OpenAI

argilla_callback = ArgillaCallbackHandler(
    dataset_name="langchain-dataset",
    api_url=os.environ["ARGILLA_API_URL"],
    api_key=os.environ["ARGILLA_API_KEY"],
)
callbacks = [StdOutCallbackHandler(), argilla_callback]

llm = OpenAI(temperature=0.9, callbacks=callbacks)
llm.generate(["Tell me a joke", "Tell me a poem"] * 3)
```

```text
LLMResult(generations=[[Generation(text='\n\nQ: What did the fish say when he hit the wall? \nA: Dam.', generation_info={'finish_reason': 'stop', 'logprobs': None})], [Generation(text='\n\nThe Moon \n\nThe moon is high in the midnight sky,\nSparkling like a star above.\nThe night so peaceful, so serene,\nFilling up the air with love.\n\nEver changing and renewing,\nA never-ending light of grace.\nThe moon remains a constant view,\nA reminder of life’s gentle pace.\n\nThrough time and space it guides us on,\nA never-fading beacon of hope.\nThe moon shines down on us all,\nAs it continues to rise and elope.', generation_info={'finish_reason': 'stop', 'logprobs': None})], [Generation(text='\n\nQ. What did one magnet say to the other magnet?\nA. "I find you very attractive!"', generation_info={'finish_reason': 'stop', 'logprobs': None})], [Generation(text="\n\nThe world is charged with the grandeur of God.\nIt will flame out, like shining from shook foil;\nIt gathers to a greatness, like the ooze of oil\nCrushed. Why do men then now not reck his rod?\n\nGenerations have trod, have trod, have trod;\nAnd all is seared with trade; bleared, smeared with toil;\nAnd wears man's smudge and shares man's smell: the soil\nIs bare now, nor can foot feel, being shod.\n\nAnd for all this, nature is never spent;\nThere lives the dearest freshness deep down things;\nAnd though the last lights off the black West went\nOh, morning, at the brown brink eastward, springs —\n\nBecause the Holy Ghost over the bent\nWorld broods with warm breast and with ah! bright wings.\n\n~Gerard Manley Hopkins", generation_info={'finish_reason': 'stop', 'logprobs': None})], [Generation(text='\n\nQ: What did one ocean say to the other ocean?\nA: Nothing, they just waved.', generation_info={'finish_reason': 'stop', 'logprobs': None})], [Generation(text="\n\nA poem for you\n\nOn a field of green\n\nThe sky so blue\n\nA gentle breeze, the sun above\n\nA beautiful world, for us to love\n\nLife is a journey, full of surprise\n\nFull of joy and full of surprise\n\nBe brave and take small steps\n\nThe future will be revealed with depth\n\nIn the morning, when dawn arrives\n\nA fresh start, no reason to hide\n\nSomewhere down the road, there's a heart that beats\n\nBelieve in yourself, you'll always succeed.", generation_info={'finish_reason': 'stop', 'logprobs': None})]], llm_output={'token_usage': {'completion_tokens': 504, 'total_tokens': 528, 'prompt_tokens': 24}, 'model_name': 'text-davinci-003'})
```

![Argilla UI with LangChain LLM input-response](https://docs.argilla.io/en/latest/_images/llm.png)

### 场景 2：在链中跟踪 LLM

然后，我们可以使用提示模板创建一个链，并在 Argilla 中跟踪初始提示和最终响应。

```python
from langchain_classic.chains import LLMChain
from langchain_core.callbacks.stdout import StdOutCallbackHandler
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI

argilla_callback = ArgillaCallbackHandler(
    dataset_name="langchain-dataset",
    api_url=os.environ["ARGILLA_API_URL"],
    api_key=os.environ["ARGILLA_API_KEY"],
)
callbacks = [StdOutCallbackHandler(), argilla_callback]
llm = OpenAI(temperature=0.9, callbacks=callbacks)

template = """You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
Title: {title}
Playwright: This is a synopsis for the above play:"""
prompt_template = PromptTemplate(input_variables=["title"], template=template)
synopsis_chain = LLMChain(llm=llm, prompt=prompt_template, callbacks=callbacks)

test_prompts = [{"title": "Documentary about Bigfoot in Paris"}]
synopsis_chain.apply(test_prompts)
```

```text
> Entering new LLMChain chain...
Prompt after formatting:
You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
Title: Documentary about Bigfoot in Paris
Playwright: This is a synopsis for the above play:

> Finished chain.
```

```text
[{'text': "\n\nDocumentary about Bigfoot in Paris focuses on the story of a documentary filmmaker and their search for evidence of the legendary Bigfoot creature in the city of Paris. The play follows the filmmaker as they explore the city, meeting people from all walks of life who have had encounters with the mysterious creature. Through their conversations, the filmmaker unravels the story of Bigfoot and finds out the truth about the creature's presence in Paris. As the story progresses, the filmmaker learns more and more about the mysterious creature, as well as the different perspectives of the people living in the city, and what they think of the creature. In the end, the filmmaker's findings lead them to some surprising and heartwarming conclusions about the creature's existence and the importance it holds in the lives of the people in Paris."}]
```

![Argilla UI with LangChain Chain input-response](https://docs.argilla.io/en/latest/_images/chain.png)

### 场景 3：使用带有工具的智能体

最后，作为一个更高级的工作流，您可以创建一个使用某些工具的智能体。这样，`ArgillaCallbackHandler` 将跟踪输入和输出，但不跟踪中间步骤/思考过程，因此对于给定的提示，我们会记录原始提示和该提示的最终响应。

> 请注意，对于此场景，我们将使用 Google Search API (Serp API)，因此您需要安装 `google-search-results` (`pip install google-search-results`)，并设置 Serp API 密钥为 `os.environ["SERPAPI_API_KEY"] = "..."`（您可以在 [serpapi.com/dashboard](https://serpapi.com/dashboard) 找到它），否则下面的示例将无法工作。

```python
from langchain.agents import AgentType, initialize_agent, load_tools
from langchain_core.callbacks.stdout import StdOutCallbackHandler
from langchain_openai import OpenAI

argilla_callback = ArgillaCallbackHandler(
    dataset_name="langchain-dataset",
    api_url=os.environ["ARGILLA_API_URL"],
    api_key=os.environ["ARGILLA_API_KEY"],
)
callbacks = [StdOutCallbackHandler(), argilla_callback]
llm = OpenAI(temperature=0.9, callbacks=callbacks)

tools = load_tools(["serpapi"], llm=llm, callbacks=callbacks)
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    callbacks=callbacks,
)
agent.run("Who was the first president of the United States of America?")
```

```text
> Entering new AgentExecutor chain...
 I need to answer a historical question
Action: Search
Action Input: "who was the first president of the United States of America"
Observation: George Washington
Thought: George Washington was the first president
Final Answer: George Washington was the first president of the United States of America.

> Finished chain.
```

```text
'George Washington was the first president of the United States of America.'
```

![Argilla UI with LangChain Agent input-response](https://docs.argilla.io/en/latest/_images/agent.png)
