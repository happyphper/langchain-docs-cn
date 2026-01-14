---
title: JinaChat
---
本笔记本介绍如何开始使用 JinaChat 聊天模型。

```python
from langchain_community.chat_models import JinaChat
from langchain.messages import HumanMessage, SystemMessage
from langchain_core.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
```

```python
chat = JinaChat(temperature=0)
```

```python
messages = [
    SystemMessage(
        content="You are a helpful assistant that translates English to French."
    ),
    HumanMessage(
        content="Translate this sentence from English to French. I love programming."
    ),
]
chat(messages)
```

```text
AIMessage(content="J'aime programmer.", additional_kwargs={}, example=False)
```

你可以通过使用 `MessagePromptTemplate` 来利用模板功能。你可以从一个或多个 `MessagePromptTemplate` 构建一个 `ChatPromptTemplate`。你可以使用 `ChatPromptTemplate` 的 `format_prompt` 方法——这会返回一个 `PromptValue`，你可以将其转换为字符串或 Message 对象，具体取决于你是否想将格式化后的值用作 llm 或聊天模型的输入。

为了方便起见，模板上公开了一个 `from_template` 方法。如果你要使用这个模板，它看起来会像这样：

```python
template = (
    "You are a helpful assistant that translates {input_language} to {output_language}."
)
system_message_prompt = SystemMessagePromptTemplate.from_template(template)
human_template = "{text}"
human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
```

```python
chat_prompt = ChatPromptTemplate.from_messages(
    [system_message_prompt, human_message_prompt]
)

# 从格式化后的消息中获取聊天完成结果
chat(
    chat_prompt.format_prompt(
        input_language="English", output_language="French", text="I love programming."
    ).to_messages()
)
```

```text
AIMessage(content="J'aime programmer.", additional_kwargs={}, example=False)
```

```python

```
