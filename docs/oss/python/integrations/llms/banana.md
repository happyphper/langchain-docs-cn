---
title: 香蕉
---
[Banana](https://www.banana.dev/about-us) 专注于构建机器学习基础设施。

本示例将介绍如何使用 LangChain 与 Banana 模型进行交互。

```python
## 安装使用该集成所需的 langchain 包
pip install -qU  langchain-community
```

```python
# 安装包 https://docs.banana.dev/banana-docs/core-concepts/sdks/python
pip install -qU  banana-dev
```

```python
# 获取新令牌：https://app.banana.dev/
# 我们需要三个参数来调用 Banana.dev API：
# * 团队 API 密钥
# * 模型的唯一密钥
# * 模型的 URL 别名

import os

# 您可以从主仪表板获取此信息
# 地址：https://app.banana.dev
os.environ["BANANA_API_KEY"] = "YOUR_API_KEY"
# 或者
# BANANA_API_KEY = getpass()
```

```python
from langchain_classic.chains import LLMChain
from langchain_community.llms import Banana
from langchain_core.prompts import PromptTemplate
```

```python
template = """问题：{question}

答案：让我们一步步思考。"""

prompt = PromptTemplate.from_template(template)
```

```python
# 这两个参数都可以在您模型的详情页找到
# 地址：https://app.banana.dev
llm = Banana(model_key="YOUR_MODEL_KEY", model_url_slug="YOUR_MODEL_URL_SLUG")
```

```python
llm_chain = LLMChain(prompt=prompt, llm=llm)
```

```python
question = "贾斯汀·比伯出生那年，哪支 NFL 球队赢得了超级碗？"

llm_chain.run(question)
```
