---
title: DeepInfra
---
[DeepInfra](https://deepinfra.com/?utm_source=langchain) 是一个无服务器推理即服务平台，提供对[多种大语言模型](https://deepinfra.com/models?utm_source=langchain)和[嵌入模型](https://deepinfra.com/models?type=embeddings&utm_source=langchain)的访问。本笔记本将介绍如何将 LangChain 与 DeepInfra 的语言模型结合使用。

## 设置环境 API 密钥

请确保从 DeepInfra 获取您的 API 密钥。您需要[登录](https://deepinfra.com/login?from=%2Fdash)并获取一个新的令牌。

您将获得 1 小时的免费无服务器 GPU 计算时间来测试不同的模型。（参见[此处](https://github.com/deepinfra/deepctl#deepctl)）
您可以使用 `deepctl auth token` 命令打印您的令牌。

```python
# 获取新令牌：https://deepinfra.com/login?from=%2Fdash

from getpass import getpass

DEEPINFRA_API_TOKEN = getpass()
```

```text
········
```

```python
import os

os.environ["DEEPINFRA_API_TOKEN"] = DEEPINFRA_API_TOKEN
```

## 创建 DeepInfra 实例

您也可以使用我们开源的 [deepctl 工具](https://github.com/deepinfra/deepctl#deepctl) 来管理您的模型部署。您可以在此处查看可用参数列表[此处](https://deepinfra.com/databricks/dolly-v2-12b#API)。

```python
from langchain_community.llms import DeepInfra

llm = DeepInfra(model_id="meta-llama/Llama-2-70b-chat-hf")
llm.model_kwargs = {
    "temperature": 0.7,
    "repetition_penalty": 1.2,
    "max_new_tokens": 250,
    "top_p": 0.9,
}
```

```python
# 通过包装器直接运行推理
llm("Who let the dogs out?")
```

```text
'This is a question that has puzzled many people'
```

```python
# 运行流式推理
for chunk in llm.stream("Who let the dogs out?"):
    print(chunk)
```

```text
 Will
 Smith
.
```

## 创建提示模板

我们将为问答创建一个提示模板。

```python
from langchain_core.prompts import PromptTemplate

template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)
```

## 初始化 LLMChain

```python
from langchain_classic.chains import LLMChain

llm_chain = LLMChain(prompt=prompt, llm=llm)
```

## 运行 LLMChain

提供一个问题并运行 LLMChain。

```python
question = "Can penguins reach the North pole?"

llm_chain.run(question)
```

```text
"Penguins are found in Antarctica and the surrounding islands, which are located at the southernmost tip of the planet. The North Pole is located at the northernmost tip of the planet, and it would be a long journey for penguins to get there. In fact, penguins don't have the ability to fly or migrate over such long distances. So, no, penguins cannot reach the North Pole. "
```

```python

```
