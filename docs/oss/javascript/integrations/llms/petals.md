---
title: 花瓣
---
`Petals` 能够以 BitTorrent 风格在本地运行 100B+ 参数的语言模型。

本笔记本将介绍如何将 LangChain 与 [Petals](https://github.com/bigscience-workshop/petals) 结合使用。

## 安装 petals

使用 Petals API 需要 `petals` 包。请使用 `pip3 install petals` 安装 `petals`。

对于 Apple Silicon (M1/M2) 用户，请按照此指南 [https://github.com/bigscience-workshop/petals/issues/147#issuecomment-1365379642](https://github.com/bigscience-workshop/petals/issues/147#issuecomment-1365379642) 安装 petals。

```python
!pip3 install petals
```

## 导入

```python
import os

from langchain_classic.chains import LLMChain
from langchain_community.llms import Petals
from langchain_core.prompts import PromptTemplate
```

## 设置环境 API 密钥

请确保从 Huggingface 获取 [您的 API 密钥](https://huggingface.co/docs/api-inference/quicktour#get-your-api-token)。

```python
from getpass import getpass

HUGGINGFACE_API_KEY = getpass()
```

```text
········
```

```python
os.environ["HUGGINGFACE_API_KEY"] = HUGGINGFACE_API_KEY
```

## 创建 Petals 实例

您可以指定不同的参数，例如模型名称、最大新令牌数、温度等。

```python
# 下载大文件可能需要几分钟！

llm = Petals(model_name="bigscience/bloom-petals")
```

```text
Downloading:   1%|▏                        | 40.8M/7.19G [00:24<15:44, 7.57MB/s]
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
