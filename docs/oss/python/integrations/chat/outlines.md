---
title: 聊天大纲
---
这将帮助您开始使用 Outlines [聊天模型](/oss/python/langchain/models/)。有关 ChatOutlines 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.outlines.ChatOutlines.html)。

[Outlines](https://github.com/outlines-dev/outlines) 是一个用于约束语言生成的库。它允许您在使用各种后端的大型语言模型 (LLM) 时，对生成的输出应用约束。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [ChatOutlines](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.outlines.ChatOutlines.html) | [langchain-community](https://python.langchain.com/api_reference/community/index.html) | ❌ | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-community?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-community?style=flat-square&label=%20) |

### 模型功能

| [工具调用](/oss/python/langchain/tools) | [结构化输出](/oss/python/langchain/structured-output) | [图像输入](/oss/python/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/python/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/python/langchain/models#token-usage) | [对数概率](/oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

## 设置

要访问 Outlines 模型，您需要互联网连接以下载 huggingface 上的模型权重。根据所需的后端，您需要安装相应的依赖项（参见 [Outlines 文档](https://dottxt-ai.github.io/outlines/latest/installation/)）。

### 凭证

Outlines 没有内置的身份验证机制。

### 安装

LangChain 的 Outlines 集成位于 `langchain-community` 包中，并需要 `outlines` 库：

```python
pip install -qU langchain-community outlines
```

## 实例化

现在我们可以实例化模型对象并生成聊天补全：

```python
from langchain_community.chat_models.outlines import ChatOutlines

# 对于 llamacpp 后端
model = ChatOutlines(model="TheBloke/phi-2-GGUF/phi-2.Q4_K_M.gguf", backend="llamacpp")

# 对于 vllm 后端（Mac 上不可用）
model = ChatOutlines(model="meta-llama/Llama-3.2-1B", backend="vllm")

# 对于 mlxlm 后端（仅在 Mac 上可用）
model = ChatOutlines(model="mistralai/Ministral-8B-Instruct-2410", backend="mlxlm")

# 对于 huggingface transformers 后端
model = ChatOutlines(model="microsoft/phi-2")  # 默认为 transformers 后端
```

## 调用

```python
from langchain.messages import HumanMessage

messages = [HumanMessage(content="What will the capital of mars be called?")]
response = model.invoke(messages)

response.content
```

## 流式传输

ChatOutlines 支持令牌的流式传输：

```python
messages = [HumanMessage(content="Count to 10 in French:")]

for chunk in model.stream(messages):
    print(chunk.content, end="", flush=True)
```

## 链式调用

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant that translates {input_language} to {output_language}.",
        ),
        ("human", "{input}"),
    ]
)

chain = prompt | model
chain.invoke(
    {
        "input_language": "English",
        "output_language": "German",
        "input": "I love programming.",
    }
)
```

## 约束生成

ChatOutlines 允许您对生成的输出应用各种约束：

### 正则表达式约束

```python
model.regex = r"((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)"

response = model.invoke("What is the IP address of Google's DNS server?")

response.content
```

### 类型约束

```python
model.type_constraints = int
response = model.invoke("What is the answer to life, the universe, and everything?")

response.content
```

### Pydantic 和 JSON 模式

```python
from pydantic import BaseModel

class Person(BaseModel):
    name: str

model.json_schema = Person
response = model.invoke("Who are the main contributors to LangChain?")
person = Person.model_validate_json(response.content)

person
```

### 上下文无关文法

```python
model.grammar = """
?start: expression
?expression: term (("+" | "-") term)*
?term: factor (("*" | "/") factor)*
?factor: NUMBER | "-" factor | "(" expression ")"
%import common.NUMBER
%import common.WS
%ignore WS
"""
response = model.invoke("Give me a complex arithmetic expression:")

response.content
```

## LangChain 的结构化输出

您也可以将 LangChain 的结构化输出与 ChatOutlines 一起使用：

```python
from pydantic import BaseModel

class AnswerWithJustification(BaseModel):
    answer: str
    justification: str

_model = model.with_structured_output(AnswerWithJustification)
result = _model.invoke("What weighs more, a pound of bricks or a pound of feathers?")

result
```

---

## API 参考

有关 ChatOutlines 所有功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.outlines.ChatOutlines.html](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.outlines.ChatOutlines.html)

## 完整的 Outlines 文档

[dottxt-ai.github.io/outlines/latest/](https://dottxt-ai.github.io/outlines/latest/)
