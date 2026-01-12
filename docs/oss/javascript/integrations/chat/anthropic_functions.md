---
title: （已弃用）实验性 Anthropic 工具封装器
---

<Warning>

<strong>Anthropic API 现已正式支持工具调用功能，因此不再需要此变通方案。请使用 [ChatAnthropic](/oss/javascript/integrations/chat/anthropic) 并确保 `langchain-anthropic>=0.1.15`。</strong>

</Warning>

本笔记本展示了如何使用一个实验性的 Anthropic 模型包装器，该包装器为其提供了工具调用和结构化输出能力。它遵循 Anthropic 的指南 [此处](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)。

该包装器可通过 `langchain-anthropic` 包获得，并且还需要可选的依赖项 `defusedxml` 来解析来自 LLM 的 XML 输出。

注意：这是一个测试版功能，将被 Anthropic 官方的工具调用实现所取代，但目前对于测试和实验非常有用。

```python
pip install -qU langchain-anthropic defusedxml
from langchain_anthropic.experimental import ChatAnthropicTools
```

## 工具绑定

`ChatAnthropicTools` 公开了一个 `bind_tools` 方法，允许你将 Pydantic 模型或 BaseTools 传递给 LLM。

```python
from pydantic import BaseModel

class Person(BaseModel):
    name: str
    age: int

model = ChatAnthropicTools(model="claude-3-opus-20240229").bind_tools(tools=[Person])
model.invoke("I am a 27 year old named Erick")
```

```text
AIMessage(content='', additional_kwargs={'tool_calls': [{'function': {'name': 'Person', 'arguments': '{"name": "Erick", "age": "27"}'}, 'type': 'function'}]})
```

## 结构化输出

`ChatAnthropicTools` 也实现了 [`with_structured_output` 规范](/oss/javascript/langchain/structured-output) 用于提取值。注意：这可能不如明确提供工具调用的模型稳定。

```python
chain = ChatAnthropicTools(model="claude-3-opus-20240229").with_structured_output(
    Person
)
chain.invoke("I am a 27 year old named Erick")
```

```text
Person(name='Erick', age=27)
```
