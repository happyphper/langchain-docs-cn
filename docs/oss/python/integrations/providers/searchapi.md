---
title: SearchApi
---
本页介绍如何在 LangChain 中使用 [SearchApi](https://www.searchapi.io/) Google 搜索 API。SearchApi 是一个实时搜索引擎结果页（SERP）API，便于进行 SERP 数据抓取。

## 设置

- 访问 [https://www.searchapi.io/](https://www.searchapi.io/) 注册免费账户
- 获取 API 密钥并将其设置为环境变量（`SEARCHAPI_API_KEY`）

## 封装器

### 实用工具

SearchApiAPIWrapper 是一个封装了此 API 的实用工具。导入该工具的方法如下：

```python
from langchain_community.utilities import SearchApiAPIWrapper
```

您可以将其用作 Self Ask 链的一部分：

```python
from langchain_community.utilities import SearchApiAPIWrapper
from langchain_openai import OpenAI
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType

import os

os.environ["SEARCHAPI_API_KEY"] = ""
os.environ['OPENAI_API_KEY'] = ""

llm = OpenAI(temperature=0)
search = SearchApiAPIWrapper()
tools = [
    Tool(
        name="Intermediate Answer",
        func=search.run,
        description="useful for when you need to ask with search"
    )
]

self_ask_with_search = initialize_agent(tools, llm, agent=AgentType.SELF_ASK_WITH_SEARCH, verbose=True)
self_ask_with_search.run("Who lived longer: Plato, Socrates, or Aristotle?")
```

#### 输出

```
> Entering new AgentExecutor chain...
 Yes.
Follow up: How old was Plato when he died?
Intermediate answer: eighty
Follow up: How old was Socrates when he died?
Intermediate answer: | Socrates |
| -------- |
| Born | c. 470 BC Deme Alopece, Athens |
| Died | 399 BC (aged approximately 71) Athens |
| Cause of death | Execution by forced suicide by poisoning |
| Spouse(s) | Xanthippe, Myrto |

Follow up: How old was Aristotle when he died?
Intermediate answer: 62 years
So the final answer is: Plato

> Finished chain.
'Plato'
```

### 工具

您也可以轻松将此封装器加载为工具（以便与智能体配合使用）。
可以通过以下方式实现：

```python
from langchain_community.agent_toolkits.load_tools import load_tools
tools = load_tools(["searchapi"])
```

有关工具的更多信息，请参阅[此页面](/oss/python/integrations/tools)。
