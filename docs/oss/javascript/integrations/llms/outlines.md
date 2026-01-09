---
title: 大纲
---
这将帮助您开始使用 Outlines LLM。有关所有 Outlines 功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/llms/langchain_community.llms.outlines.Outlines.html)。

[Outlines](https://github.com/outlines-dev/outlines) 是一个用于约束语言生成的库。它允许您使用具有不同后端的大语言模型 (LLMs)，同时对生成的输出应用约束。

## 概述

### 集成详情

| 类 | 包 | 本地 | 可序列化 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: | :---: |
| [Outlines](https://python.langchain.com/api_reference/community/llms/langchain_community.llms.outlines.Outlines.html) | [langchain-community](https://python.langchain.com/api_reference/community/index.html) | ✅ | beta | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-community?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-community?style=flat-square&label=%20) |

## 设置

要访问 Outlines 模型，您需要连接互联网以下载 huggingface 上的模型权重。根据所需的后端，您需要安装相应的依赖项（参见 [Outlines 文档](https://dottxt-ai.github.io/outlines/latest/installation/)）。

### 凭证

Outlines 没有内置的身份验证机制。

## 安装

LangChain 的 Outlines 集成位于 `langchain-community` 包中，并需要 `outlines` 库：

```python
pip install -qU langchain-community outlines
```

## 实例化

现在我们可以实例化模型对象并生成聊天补全：

```python
from langchain_community.llms import Outlines

# 用于 llamacpp 后端
model = Outlines(model="microsoft/Phi-3-mini-4k-instruct", backend="llamacpp")

# 用于 vllm 后端（Mac 上不可用）
model = Outlines(model="microsoft/Phi-3-mini-4k-instruct", backend="vllm")

# 用于 mlxlm 后端（仅在 Mac 上可用）
model = Outlines(model="microsoft/Phi-3-mini-4k-instruct", backend="mlxlm")

# 用于 huggingface transformers 后端
model = Outlines(
    model="microsoft/Phi-3-mini-4k-instruct"
)  # 默认为 backend="transformers"
```

## 调用

```python
model.invoke("Hello how are you?")
```

## 链式调用

```python
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template("How to say {input} in {output_language}:\n")

chain = prompt | model
chain.invoke(
    {
        "output_language": "German",
        "input": "I love programming.",
    }
)
```

### 流式传输

Outlines 支持令牌的流式传输：

```python
for chunk in model.stream("Count to 10 in French:"):
    print(chunk, end="", flush=True)
```

### 约束生成

Outlines 允许您对生成的输出应用各种约束：

#### 正则表达式约束

```python
model.regex = r"((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)"
response = model.invoke("What is the IP address of Google's DNS server?")

response
```

### 类型约束

```python
model.type_constraints = int
response = model.invoke("What is the answer to life, the universe, and everything?")
```

#### JSON 模式

```python
from pydantic import BaseModel

class Person(BaseModel):
    name: str

model.json_schema = Person
response = model.invoke("Who is the author of LangChain?")
person = Person.model_validate_json(response)

person
```

#### 语法约束

```python
model.grammar = """
?start: expression
?expression: term (("+" | "-") term)
?term: factor (("" | "/") factor)
?factor: NUMBER | "-" factor | "(" expression ")"
%import common.NUMBER
%import common.WS
%ignore WS
"""
response = model.invoke("Give me a complex arithmetic expression:")

response
```

---

## API 参考

有关所有 ChatOutlines 功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.outlines.ChatOutlines.html](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.outlines.ChatOutlines.html)

## Outlines 文档

[dottxt-ai.github.io/outlines/latest/](https://dottxt-ai.github.io/outlines/latest/)
