---
title: ChatAnthropicVertex
description: '开始通过 LangChain 中的 Vertex AI 使用 Anthropic [聊天模型](/oss/langchain/models)。'
---
> [Anthropic Claude 3](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) 模型在 Vertex AI 上提供完全托管和无服务器模型作为 API。要在 Vertex AI 上使用 Claude 模型，请直接向 Vertex AI API 端点发送请求。由于 Anthropic Claude 3 模型使用托管 API，因此无需配置或管理基础设施。

注意：Vertex 上的 Anthropic 模型通过 `ChatAnthropicVertex` 类实现为聊天模型。

```python
!pip install -U langchain-google-vertexai anthropic[vertex]
```

```python
from langchain.messages import (
    AIMessage,
    AIMessageChunk,
    HumanMessage,
    SystemMessage,
)
from langchain_core.outputs import LLMResult
from langchain_google_vertexai.model_garden import ChatAnthropicVertex
```

注意：请指定正确的 [Claude 3 模型版本](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude#claude-opus)

我们不建议使用不包含以 @ 符号开头的后缀的 Anthropic Claude 3 模型版本（claude-3-opus、claude-3-sonnet 或 claude-3-haiku）。

```python
# TODO：将以下内容替换为您的项目 ID 和区域
project = "<project_id>"
location = "<region>"

# 初始化模型
model = ChatAnthropicVertex(
    model_name="claude-3-haiku@20240307",
    project=project,
    location=location,
)
```

```python
# 为模型准备输入数据
raw_context = (
    "My name is Peter. You are my personal assistant. My favorite movies "
    "are Lord of the Rings and Hobbit."
)
question = (
    "Hello, could you recommend a good movie for me to watch this evening, please?"
)
context = SystemMessage(content=raw_context)
message = HumanMessage(content=question)
```

```python
# 调用模型
response = model.invoke([context, message])
print(response.content)
```

```text
Since your favorite movies are the Lord of the Rings and Hobbit trilogies, I would recommend checking out some other epic fantasy films that have a similar feel:

1. The Chronicles of Narnia series - These films are based on the beloved fantasy novels by C.S. Lewis and have a great blend of adventure, magic, and memorable characters.

2. Stardust - This 2007 fantasy film, based on the Neil Gaiman novel, has an excellent cast and a charming, whimsical tone.

3. The Golden Compass - The first film adaptation of Philip Pullman's His Dark Materials series, with stunning visuals and a compelling story.

4. Pan's Labyrinth - Guillermo del Toro's dark, fairy tale-inspired masterpiece set against the backdrop of the Spanish Civil War.

5. The Princess Bride - A classic fantasy adventure film with humor, romance, and unforgettable characters.

Let me know if any of those appeal to you or if you'd like me to suggest something else! I'm happy to provide more personalized recommendations.
```

```python
# 您也可以在调用方法上初始化/覆盖模型名称
response = model.invoke([context, message], model_name="claude-3-sonnet@20240229")
print(response.content)
```

```text
Sure, I'd be happy to recommend a movie for you! Since you mentioned that The Lord of the Rings and The Hobbit are among your favorite movies, I'll suggest some other epic fantasy/adventure films you might enjoy:

1. The Princess Bride (1987) - A classic fairy tale with adventure, romance, and a lot of wit and humor. It has an all-star cast and very quotable lines.

2. Willow (1988) - A fun fantasy film produced by George Lucas with fairies, dwarves, and brownies going on an epic quest. Has a similar tone to the Lord of the Rings movies.

3. Stardust (2007) - An underrated fantasy adventure based on the Neil Gaiman novel about a young man entering a magical kingdom to retrieve a fallen star. Great cast and visuals.

4. The Chronicles of Narnia series - The Lion, The Witch and The Wardrobe is the best known, but the other Narnia films are also very well done fantasy epics.

5. The Golden Compass (2007) - First installment of the His Dark Materials trilogy, set in a parallel universe with armored polar bears and truth-seeking devices.

Let me know if you'd like any other suggestions or have a particular style of movie in mind! I aimed for entertaining fantasy/adventure flicks similar to Lord of the Rings.
```

```python
# 使用流式响应
sync_response = model.stream([context, message], model_name="claude-3-haiku@20240307")
for chunk in sync_response:
    print(chunk.content)
```
