---
title: Minimax
---
[Minimax](https://api.minimax.chat) 是一家中国初创公司，为企业和个人提供自然语言处理模型。

本示例演示了如何使用 LangChain 与 Minimax 进行交互。

# 环境设置

要运行此笔记本，您需要一个 [Minimax 账户](https://api.minimax.chat)、一个 [API 密钥](https://api.minimax.chat/user-center/basic-information/interface-key) 以及一个 [Group ID](https://api.minimax.chat/user-center/basic-information)。

# 单次模型调用

```python
from langchain_community.llms import Minimax
```

```python
# 加载模型
minimax = Minimax(minimax_api_key="YOUR_API_KEY", minimax_group_id="YOUR_GROUP_ID")
```

```python
# 向模型提问
minimax("What is the difference between panda and bear?")
```

# 链式模型调用

```python
# 获取 api_key 和 group_id: https://api.minimax.chat/user-center/basic-information
# 我们需要 `MINIMAX_API_KEY` 和 `MINIMAX_GROUP_ID`

import os

os.environ["MINIMAX_API_KEY"] = "YOUR_API_KEY"
os.environ["MINIMAX_GROUP_ID"] = "YOUR_GROUP_ID"
```

```python
from langchain_classic.chains import LLMChain
from langchain_community.llms import Minimax
from langchain_core.prompts import PromptTemplate
```

```python
template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)
```

```python
llm = Minimax()
```

```python
llm_chain = LLMChain(prompt=prompt, llm=llm)
```

```python
question = "What NBA team won the Championship in the year Jay Zhou was born?"

llm_chain.run(question)
```
