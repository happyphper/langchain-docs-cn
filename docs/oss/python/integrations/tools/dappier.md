---
title: Dappier
---
[Dappier](https://dappier.com) 将任何 LLM 或您的智能体 AI 连接到来自可信来源的实时、权利清晰、专有的数据，使您的 AI 成为任何领域的专家。我们的专业模型包括实时网络搜索、新闻、体育、金融股市数据、加密货币数据以及来自优质出版商的独家内容。在我们的市场 [marketplace.dappier.com](https://marketplace.dappier.com) 探索广泛的数据模型。

[Dappier](https://dappier.com) 提供经过丰富处理、即用且上下文相关的数据字符串，并针对与 LangChain 的无缝集成进行了优化。无论您是构建对话式 AI、推荐引擎还是智能搜索，Dappier 的 LLM 无关的 RAG 模型都能确保您的 AI 能够访问经过验证的最新数据，而无需构建和管理自己的检索管道的复杂性。

# Dappier 工具

本文将帮助您开始使用 Dappier [工具](/oss/python/langchain/tools)。有关 DappierRetriever 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/en/latest/tools/langchain_dappier.tools.Dappier.DappierRealTimeSearchTool.html)。

## 概述

DappierRealTimeSearchTool 和 DappierAIRecommendationTool 为 AI 应用提供实时数据和 AI 驱动的洞察。前者提供新闻、天气、旅行和金融市场的最新信息访问，而后者则通过来自新闻、金融、体育等多个领域的真实、优质内容为应用赋能，所有这些都由 Dappier 的预训练 RAG 模型和自然语言 API 提供支持。

### 设置

此工具位于 `langchain-dappier` 包中。

```python
pip install -qU langchain-dappier
```

### 凭证

我们还需要设置 Dappier API 凭证，这些凭证可以在 [Dappier 网站](https://platform.dappier.com/profile/api-keys) 生成。

```python
import getpass
import os

if not os.environ.get("DAPPIER_API_KEY"):
    os.environ["DAPPIER_API_KEY"] = getpass.getpass("Dappier API key:\n")
```

如果您希望从单个查询中获得自动化追踪，您也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

## DappierRealTimeSearchTool

访问实时 Google 搜索结果，包括最新新闻、天气、旅行和优惠，以及来自 polygon.io 的最新财经新闻、股票价格和交易信息，所有这些都由 AI 洞察提供支持，让您随时掌握信息。

### 实例化

- ai_model_id: str
用于查询的 AI 模型 ID。AI 模型 ID 始终以 "am_" 为前缀。

默认为 "am_01j06ytn18ejftedz6dyhz2b15"。

可用的 AI 模型 ID 有多个，可以在以下地址找到：
[marketplace.dappier.com/marketplace](https://marketplace.dappier.com/marketplace)

```python
from langchain_dappier import DappierRealTimeSearchTool

tool = DappierRealTimeSearchTool(
    # ai_model_id="...",     # 覆盖默认的 ai_model_id
    # name="...",            # 覆盖默认的工具名称
    # description="...",     # 覆盖默认的工具描述
    # args_schema=...,       # 覆盖默认的 args_schema: BaseModel
)
```

### 调用

#### [使用参数直接调用](/oss/python/langchain/tools)

`DappierRealTimeSearchTool` 接受一个 "query" 参数，该参数应为自然语言查询：

```python
tool.invoke({"query": "What happened at the last wimbledon"})
```

```text
"At the last Wimbledon in 2024, Carlos Alcaraz won the title by defeating Novak Djokovic. This victory marked Alcaraz's fourth Grand Slam title at just 21 years old! 🎉🏆🎾"
```

### [使用 ToolCall 调用](/oss/python/langchain/tools)

我们也可以使用模型生成的 ToolCall 来调用该工具，在这种情况下，将返回一个 ToolMessage：

```python
# 这通常由模型生成，但为了演示目的，我们将直接创建一个工具调用。
model_generated_tool_call = {
    "args": {"query": "euro 2024 host nation"},
    "id": "1",
    "name": "dappier",
    "type": "tool_call",
}
tool_msg = tool.invoke(model_generated_tool_call)

# 内容是一个 JSON 字符串形式的结果
print(tool_msg.content[:400])
```

```text
Euro 2024 is being hosted by Germany! 🇩🇪 The tournament runs from June 14 to July 14, 2024, featuring 24 teams competing across various cities like Berlin and Munich. It's going to be an exciting summer of football! ⚽️🏆
```

### 链式调用

我们可以通过先将工具绑定到一个 [工具调用模型](/oss/python/langchain/tools/)，然后在链中使用它：

<ChatModelTabs customVarName="llm" />

```python
# | output: false
# | echo: false

# !pip install -qU langchain langchain-openai
from langchain.chat_models import init_chat_model

model = init_chat_model(model="gpt-4o", model_provider="openai", temperature=0)
```

```python
import datetime

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableConfig, chain

today = datetime.datetime.today().strftime("%D")
prompt = ChatPromptTemplate(
    [
        ("system", f"You are a helpful assistant. The date today is {today}."),
        ("human", "{user_input}"),
        ("placeholder", "{messages}"),
    ]
)

# 指定 tool_choice 将强制模型调用此工具。
model_with_tools = model.bind_tools([tool])

model_chain = prompt | model_with_tools

@chain
def tool_chain(user_input: str, config: RunnableConfig):
    input_ = {"user_input": user_input}
    ai_msg = model_chain.invoke(input_, config=config)
    tool_msgs = tool.batch(ai_msg.tool_calls, config=config)
    return model_chain.invoke({**input_, "messages": [ai_msg, *tool_msgs]}, config=config)

tool_chain.invoke("who won the last womens singles wimbledon")
```

```text
AIMessage(content="Barbora Krejčíková won the women's singles title at Wimbledon 2024, defeating Jasmine Paolini in the final with a score of 6–2, 2–6, 6–4. This victory marked her first Wimbledon singles title and her second major singles title overall! 🎉🏆🎾", additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 69, 'prompt_tokens': 222, 'total_tokens': 291, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_name': 'gpt-4o-2024-08-06', 'system_fingerprint': 'fp_4691090a87', 'finish_reason': 'stop', 'logprobs': None}, id='run-87a385dd-103b-4344-a3be-2d6fd1dcfdf5-0', usage_metadata={'input_tokens': 222, 'output_tokens': 69, 'total_tokens': 291, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 0}})
```

## DappierAIRecommendationTool

利用 Dappier 的预训练 RAG 模型和自然语言 API 为您的 AI 应用赋能，提供来自新闻、金融、体育、天气等垂直领域优质内容提供商的真实且最新的响应。

### 实例化

- data_model_id: str
  用于推荐的数据模型 ID。数据模型 ID 始终以 "dm_" 为前缀。默认为 "dm_01j0pb465keqmatq9k83dthx34"。
  可用的数据模型 ID 有多个，可以在 [Dappier 市场](https://marketplace.dappier.com/marketplace) 找到。

- similarity_top_k: int
  基于相似性检索的顶部文档数量。默认为 "9"。

- ref: Optional[str]
  应显示 AI 推荐的网站域名。默认为 "None"。

- num_articles_ref: int
  从指定参考域 ("ref") 返回的最少文章数量。其余文章将来自 RAG 模型中的其他站点。默认为 "0"。

- search_algorithm: Literal["most_recent", "semantic", "most_recent_semantic", "trending"]
  用于检索文章的搜索算法。默认为 "most_recent"。

```python
from langchain_dappier import DappierAIRecommendationTool

tool = DappierAIRecommendationTool(
    data_model_id="dm_01j0pb465keqmatq9k83dthx34",
    similarity_top_k=3,
    ref="sportsnaut.com",
    num_articles_ref=2,
    search_algorithm="most_recent",
    # name="...",            # 覆盖默认的工具名称
    # description="...",     # 覆盖默认的工具描述
    # args_schema=...,       # 覆盖默认的 args_schema: BaseModel
)
```

### 调用

#### [使用参数直接调用](/oss/python/langchain/tools)

`DappierAIRecommendationTool` 接受一个 "query" 参数，该参数应为自然语言查询：

```python
tool.invoke({"query": "latest sports news"})
```

```text
[{'author': 'Matt Weaver',
  'image_url': 'https://images.dappier.com/dm_01j0pb465keqmatq9k83dthx34/Screenshot_20250117_021643_Gallery_.jpg?width=428&height=321',
  'pubdate': 'Fri, 17 Jan 2025 08:04:03 +0000',
  'source_url': 'https://sportsnaut.com/chili-bowl-thursday-bell-column/',
  'summary': "The article highlights the thrilling unpredictability of the Chili Bowl Midget Nationals, focusing on the dramatic shifts in fortune for drivers like Christopher Bell, Tanner Thorson, and Karter Sarff during Thursday's events. Key moments included Sarff's unfortunate pull-off and a last-lap crash that allowed Ryan Bernal to capitalize and improve his standing, showcasing the chaotic nature of the race and the importance of strategy and luck.\n\nAs the competition intensifies leading up to Championship Saturday, Bell faces the challenge of racing from a Last Chance Race, reflecting on the excitement and difficulties of the sport. The article emphasizes the emotional highs and lows experienced by racers, with insights from Bell and Bernal on the unpredictable nature of racing. Overall, it captures the camaraderie and passion that define the Chili Bowl, illustrating how each moment contributes to the event's narrative.",
  'title': 'Thursday proves why every lap of Chili Bowl is so consequential'},
 {'author': 'Matt Higgins',
  'image_url': 'https://images.dappier.com/dm_01j0pb465keqmatq9k83dthx34/Pete-Alonso-24524027_.jpg?width=428&height=321',
  'pubdate': 'Fri, 17 Jan 2025 02:48:42 +0000',
  'source_url': 'https://sportsnaut.com/new-york-mets-news-pete-alonso-rejected-last-ditch-contract-offer/',
  'summary': "The New York Mets are likely parting ways with star first baseman Pete Alonso after failing to finalize a contract agreement. Alonso rejected a last-minute three-year offer worth between $68 and $70 million, leading the Mets to redirect funds towards acquiring a top reliever. With Alonso's free-agent options dwindling, speculation arises about his potential signing with another team for the 2025 season, while the Mets plan to shift Mark Vientos to first base.\n\nIn a strategic move, the Mets are also considering a trade for Toronto Blue Jays' star first baseman Vladimir Guerrero Jr. This potential acquisition aims to enhance the Mets' competitiveness as they reshape their roster. Guerrero's impressive offensive stats make him a valuable target, and discussions are in the early stages. Fans and analysts are keenly watching the situation, as a trade involving such a prominent player could significantly impact both teams.",
  'title': 'MLB insiders reveal New York Mets’ last-ditch contract offer that Pete Alonso rejected'},
 {'author': 'Jim Cerny',
  'image_url': 'https://images.dappier.com/dm_01j0pb465keqmatq9k83dthx34/NHL-New-York-Rangers-at-Utah-25204492_.jpg?width=428&height=321',
  'pubdate': 'Fri, 17 Jan 2025 05:10:39 +0000',
  'source_url': 'https://www.foreverblueshirts.com/new-york-rangers-news/stirring-5-3-comeback-win-utah-close-road-trip/',
  'summary': "The New York Rangers achieved a thrilling 5-3 comeback victory against the Utah Hockey Club, showcasing their resilience after a prior overtime loss. The Rangers scored three unanswered goals in the third period, with key contributions from Reilly Smith, Chris Kreider, and Artemi Panarin, who sealed the win with an empty-net goal. This victory marked their first win of the season when trailing after two periods and capped off a successful road trip, improving their record to 21-20-3.\n\nIgor Shesterkin's strong performance in goal, along with Arthur Kaliyev's first goal for the team, helped the Rangers overcome an early deficit. The game featured multiple lead changes, highlighting the competitive nature of both teams. As the Rangers prepare for their next game against the Columbus Blue Jackets, they aim to close the gap in the playoff race, with the Blue Jackets currently holding a five-point lead in the Eastern Conference standings.",
  'title': 'Rangers score 3 times in 3rd period for stirring 5-3 comeback win against Utah to close road trip'}]
```

### [使用 ToolCall 调用](/oss/python/langchain/tools)

我们也可以使用模型生成的 ToolCall 来调用该工具，在这种情况下，将返回一个 ToolMessage：

```python
# 这通常由模型生成，但为了演示目的，我们将直接创建一个工具调用。
model_generated_tool_call = {
    "args": {"query": "top 3 news articles"},
    "id": "1",
    "name": "dappier",
    "type": "tool_call",
}
tool_msg = tool.invoke(model_generated_tool_call)

# 内容是一个 JSON 字符串形式的结果
print(tool_msg.content[:400])
```

```json
[{"author": "Matt Johnson", "image_url": "https://images.dappier.com/dm_01j0pb465keqmatq9k83dthx34/MLB-New-York-Mets-at-Colorado-Rockies-23948644_.jpg?width=428&height=321", "pubdate": "Fri, 17 Jan 2025 13:31:02 +0000", "source_url": "https://sportsnaut.com/new-york-mets-rumors-vladimir-guerrero-jr-news/", "summary": "The New York Mets are refocusing their strategy after failing to extend a contra
```

---

## API 参考

有关 DappierRealTimeSearchTool 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/tools/langchain_dappier.tools.dappier.tool.DappierRealTimeSearchTool.html)
