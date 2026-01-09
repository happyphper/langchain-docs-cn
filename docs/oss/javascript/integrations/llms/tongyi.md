---
title: 通义千问
---
通义千问（Tongyi Qwen）是由阿里巴巴达摩院开发的大规模语言模型。它能够通过自然语言理解和语义分析来理解用户意图，基于用户输入的自然语言，在不同领域和任务中为用户提供服务与协助。通过提供清晰、详细的指令，您可以获得更符合预期的结果。

## 环境设置

```python
# 安装包
pip install -qU  langchain-community dashscope
```

```python
# 获取新令牌：https://help.aliyun.com/document_detail/611472.html?spm=a2c4g.2399481.0.0
from getpass import getpass

DASHSCOPE_API_KEY = getpass()
```

```text
········
```

```python
import os

os.environ["DASHSCOPE_API_KEY"] = DASHSCOPE_API_KEY
```

```python
from langchain_community.llms import Tongyi
```

```python
Tongyi().invoke("What NFL team won the Super Bowl in the year Justin Bieber was born?")
```

```text
'Justin Bieber was born on March 1, 1994. The Super Bowl that took place in the same year was Super Bowl XXVIII, which was played on January 30, 1994. The winner of that Super Bowl was the Dallas Cowboys, who defeated the Buffalo Bills with a score of 30-13.'
```

## 在链中使用

```python
from langchain_core.prompts import PromptTemplate
```

```python
llm = Tongyi()
```

```python
template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)
```

```python
chain = prompt | llm
```

```python
question = "What NFL team won the Super Bowl in the year Justin Bieber was born?"

chain.invoke({"question": question})
```

```text
'Justin Bieber was born on March 1, 1994. The Super Bowl that took place in the same calendar year was Super Bowl XXVIII, which was played on January 30, 1994. The winner of Super Bowl XXVIII was the Dallas Cowboys, who defeated the Buffalo Bills with a score of 30-13.'
```
