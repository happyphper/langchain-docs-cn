---
title: Nebula (Symbl.ai)
---
本笔记本介绍如何开始使用 [Nebula](https://docs.symbl.ai/docs/nebula-llm) —— Symbl.ai 的聊天模型。

### 集成详情

请前往 [API 参考](https://docs.symbl.ai/reference/nebula-chat) 查看详细文档。

### 模型特性：待办事项

## 设置

### 凭证

要开始使用，请申请一个 [Nebula API 密钥](https://platform.symbl.ai/#/login) 并设置 `NEBULA_API_KEY` 环境变量：

```python
import getpass
import os

os.environ["NEBULA_API_KEY"] = getpass.getpass()
```

### 安装

该集成设置在 `langchain-community` 包中。

## 实例化

```python
from langchain_community.chat_models.symblai_nebula import ChatNebula
from langchain.messages import AIMessage, HumanMessage, SystemMessage
```

```python
chat = ChatNebula(max_tokens=1024, temperature=0.5)
```

## 调用

```python
messages = [
    SystemMessage(
        content="You are a helpful assistant that answers general knowledge questions."
    ),
    HumanMessage(content="What is the capital of France?"),
]
chat.invoke(messages)
```

```text
AIMessage(content=[{'role': 'human', 'text': 'What is the capital of France?'}, {'role': 'assistant', 'text': 'The capital of France is Paris.'}])
```

### 异步调用

```python
await chat.ainvoke(messages)
```

```text
AIMessage(content=[{'role': 'human', 'text': 'What is the capital of France?'}, {'role': 'assistant', 'text': 'The capital of France is Paris.'}])
```

### 流式调用

```python
for chunk in chat.stream(messages):
    print(chunk.content, end="", flush=True)
```

```text
The capital of France is Paris.
```

### 批量调用

```python
chat.batch([messages])
```

```text
[AIMessage(content=[{'role': 'human', 'text': 'What is the capital of France?'}, {'role': 'assistant', 'text': 'The capital of France is Paris.'}])]
```

## 链式调用

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("Tell me a joke about {topic}")
chain = prompt | chat
```

```python
chain.invoke({"topic": "cows"})
```

```text
AIMessage(content=[{'role': 'human', 'text': 'Tell me a joke about cows'}, {'role': 'assistant', 'text': "Sure, here's a joke about cows:\n\nWhy did the cow cross the road?\n\nTo get to the udder side!"}])
```

---

## API 参考

查看 [API 参考](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.symblai_nebula.ChatNebula.html) 获取更多详细信息。
