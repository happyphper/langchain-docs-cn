---
title: GooseAI
---
`GooseAI` 是一个完全托管的 NLP 即服务，通过 API 提供。GooseAI 提供了对[这些模型](https://goose.ai/docs/models)的访问。

本笔记本介绍了如何将 LangChain 与 [GooseAI](https://goose.ai/) 结合使用。

## 安装 openai

使用 GooseAI API 需要 `openai` 包。使用 `pip install openai` 安装 `openai`。

```python
pip install -qU  langchain-openai
```

## 导入

```python
import os

from langchain_classic.chains import LLMChain
from langchain_community.llms import GooseAI
from langchain_core.prompts import PromptTemplate
```

## 设置环境 API 密钥

请确保从 GooseAI 获取您的 API 密钥。您将获得 10 美元的免费额度来测试不同的模型。

```python
from getpass import getpass

GOOSEAI_API_KEY = getpass()
```

```python
os.environ["GOOSEAI_API_KEY"] = GOOSEAI_API_KEY
```

## 创建 GooseAI 实例

您可以指定不同的参数，例如模型名称、生成的最大令牌数、温度等。

```python
llm = GooseAI()
```

## 创建提示模板

我们将为问答创建一个提示模板。

```python
template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)
```

## 初始化 LLMChain

```python
llm_chain = LLMChain(prompt=prompt, llm=llm)
```

## 运行 LLMChain

提供一个问题并运行 LLMChain。

```python
question = "What NFL team won the Super Bowl in the year Justin Beiber was born?"

llm_chain.run(question)
```
