---
title: CerebriumAI
---
`Cerebrium` 是 AWS Sagemaker 的一个替代方案。它也提供了对[多个 LLM 模型](https://docs.cerebrium.ai/cerebrium/prebuilt-models/deployment)的 API 访问。

本笔记本将介绍如何将 LangChain 与 [CerebriumAI](https://docs.cerebrium.ai/introduction) 结合使用。

## 安装 cerebrium

使用 `CerebriumAI` API 需要 `cerebrium` 包。使用 `pip3 install cerebrium` 安装 `cerebrium`。

```python
# 安装包
!pip3 install cerebrium
```

## 导入

```python
import os

from langchain_classic.chains import LLMChain
from langchain_community.llms import CerebriumAI
from langchain_core.prompts import PromptTemplate
```

## 设置环境 API 密钥

请确保从 CerebriumAI 获取您的 API 密钥。参见[此处](https://dashboard.cerebrium.ai/login)。您将获得 1 小时的无服务器 GPU 计算免费额度，用于测试不同的模型。

```python
os.environ["CEREBRIUMAI_API_KEY"] = "YOUR_KEY_HERE"
```

## 创建 CerebriumAI 实例

您可以指定不同的参数，例如模型端点 URL、最大长度、温度等。您必须提供一个端点 URL。

```python
llm = CerebriumAI(endpoint_url="YOUR ENDPOINT URL HERE")
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
