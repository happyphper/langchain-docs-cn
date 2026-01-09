---
title: ChatParallelWeb
description: '开始使用 LangChain 中的并行 [聊天模型](/oss/langchain/models)。'
---
Parallel 通过 OpenAI 兼容的聊天接口提供实时网络搜索能力，使您的 AI 应用程序能够访问网络上的最新信息。

<Tip>

<strong>API 参考</strong>

有关所有功能和配置选项的详细文档，请前往 <a href="https://reference.langchain.com/python/integrations/langchain_parallel/ChatParallelWeb" target="_blank" rel="noreferrer" class="link"><code>ChatParallelWeb</code></a> API 参考。

</Tip>

## 概述

### 集成详情

| 类 | 包 | 可序列化 | JS/TS 支持 | 下载量 | 最新版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| <a href="https://reference.langchain.com/python/integrations/langchain_parallel/ChatParallelWeb" target="_blank" rel="noreferrer" class="link"><code>ChatParallelWeb</code></a> | <a href="https://reference.langchain.com/python/integrations/langchain_parallel" target="_blank" rel="noreferrer" class="link"><code>langchain-parallel</code></a> | ✅ | ❌ | <a href="https://pypi.org/project/langchain-parallel/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-parallel/month" alt="Downloads per month" /></a> | <a href="https://pypi.org/project/langchain-parallel/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-parallel?style=flat-square&label=%20&color=orange" alt="PyPI - Latest version" /></a> |

### 模型特性

| [工具调用](/oss/langchain/tools) | [结构化输出](/oss/langchain/structured-output) | 图像输入 | 音频输入 | 视频输入 | [令牌级流式传输](/oss/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/langchain/models#token-usage) | [对数概率](/oss/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |

## 设置

要访问 Parallel 模型，您需要安装 `langchain-parallel` 集成包并获取一个 [Parallel](https://platform.parallel.ai) API 密钥。

### 安装

::: code-group

```bash [pip]
pip install -U langchain-parallel
```
```bash [uv]
uv add langchain-parallel
```

:::

### 凭证

前往 [Parallel](https://platform.parallel.ai) 注册并生成 API 密钥。完成后，在您的环境中设置 `PARALLEL_API_KEY` 环境变量：

```python
import getpass
import os

if not os.environ.get("PARALLEL_API_KEY"):
    os.environ["PARALLEL_API_KEY"] = getpass.getpass("Enter your Parallel API key: ")
```

## 实例化

现在我们可以实例化模型对象并生成响应。默认模型是 `"speed"`，它提供快速响应：

```python
from langchain_parallel import ChatParallelWeb

llm = ChatParallelWeb(
    model="speed",
    # temperature=0.7,
    # max_tokens=None,
    # timeout=None,
    # max_retries=2,
    # api_key="...",  # 如果您希望直接传入 API 密钥
    # base_url="https://api.parallel.ai",
    # other params...
)
```

有关可用模型参数的完整列表，请参阅 <a href="https://reference.langchain.com/python/integrations/langchain_parallel/ChatParallelWeb" target="_blank" rel="noreferrer" class="link"><code>ChatParallelWeb</code></a> API 参考。

<Note>

<strong>OpenAI 兼容性</strong>

Parallel 支持许多 OpenAI 兼容的参数以便于迁移（例如 `response_format`、`tools`、`top_p`），但大多数参数会被 Parallel API 忽略。更多详情请参阅 [OpenAI 兼容性](#openai-compatibility) 部分。

</Note>

---

## 调用

```python
messages = [
    (
        "system",
        "You are a helpful assistant with access to real-time web information.",
    ),
    ("human", "What are the latest developments in AI?"),
]
ai_msg = llm.invoke(messages)
ai_msg
```

```text
AIMessage(content='Here\'s a summary of the latest AI news and breakthroughs as of ...', additional_kwargs={}, response_metadata={'model': 'speed', 'finish_reason': 'stop', 'created': 1764043410}, id='run--3866fa98-6ac9-4585-8d23-99c5542b582b-0')
```

```python
print(ai_msg.content)
```

```text
Here's a summary of the latest AI news and breakthroughs as of...
```

---

## 链式调用

我们可以像这样将模型与提示模板链式调用：

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate(
    [
        (
            "system",
            "You are a helpful research assistant with access to real-time web information. "
            "Provide comprehensive answers about {topic} with current data.",
        ),
        ("human", "{question}"),
    ]
)

chain = prompt | llm
chain.invoke(
    {
        "topic": "artificial intelligence",
        "question": "What are the most significant AI breakthroughs in 2025?",
    }
)
```

```text
AIMessage(content="Based on the provided search results, here's a summary of the significant AI breakthroughs and trends...", additional_kwargs={}, response_metadata={'model': 'speed', 'finish_reason': 'stop', 'created': 1764043419}, id='run--9c521362-6724-4299-9e65-0565ec13d997-0')
```
---

## 流式传输

ChatParallelWeb 支持流式响应以实现实时输出：

```python
for chunk in llm.stream(messages):
    print(chunk.content, end="")
```

---

## 异步操作

您也可以使用异步操作：

```python
# 异步调用
ai_msg = await llm.ainvoke(messages)

# 异步流式传输
async for chunk in llm.astream(messages):
    print(chunk.content, end="")
```

---

## 令牌使用量

<Note>

<strong>无令牌使用量跟踪</strong>

Parallel 目前不提供令牌使用量元数据。`usage_metadata` 字段将为 `None`。

</Note>

```python
ai_msg = llm.invoke(messages)
print(ai_msg.usage_metadata)
```

```text
None
```

---

## 响应元数据

从 API 访问响应元数据：

```python
ai_msg = llm.invoke(messages)
print(ai_msg.response_metadata)
```

```python
{'model': 'speed', 'finish_reason': 'stop', 'created': 1703123456}
```

---

## 错误处理

该集成为常见场景提供了增强的错误处理：

```python
from langchain_parallel import ChatParallelWeb

try:
    llm = ChatParallelWeb(api_key="invalid-key")
    response = llm.invoke([("human", "Hello")])
except ValueError as e:
    if "Authentication failed" in str(e):
        print("Invalid API key provided")
    elif "Rate limit exceeded" in str(e):
        print("API rate limit exceeded, please try again later")
```

---

## OpenAI 兼容性

<Info>

<strong>OpenAI 兼容的 API</strong>

ChatParallelWeb 与许多 [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat) 参数完全兼容，使得迁移无缝进行。然而，大多数高级参数（如 `response_format`、`tools`、`top_p`）会被 Parallel API 接受但忽略。

</Info>

```python
llm = ChatParallelWeb(
    model="speed",
    # 这些参数会被 Parallel 接受但忽略
    response_format={"type": "json_object"},
    tools=[{"type": "function", "function": {"name": "example"}}],
    tool_choice="auto",
    top_p=1.0,
    frequency_penalty=0.0,
    presence_penalty=0.0,
    logit_bias={},
    seed=42,
    user="user-123"
)
```

---

## 消息处理

该集成会自动处理消息格式，并合并相同类型的连续消息以满足 API 要求：

```python
from langchain.messages import HumanMessage, SystemMessage

# 这些连续的系统消息将被自动合并
messages = [
    SystemMessage("You are a helpful assistant."),
    SystemMessage("Always be polite and concise."),
    HumanMessage("What is the weather like today?")
]

# 在 API 调用前自动合并为单个系统消息
response = llm.invoke(messages)
```

---

## API 参考

有关所有功能和配置选项的详细文档，请前往 <a href="https://reference.langchain.com/python/integrations/langchain_parallel/ChatParallelWeb" target="_blank" rel="noreferrer" class="link"><code>ChatParallelWeb</code></a> API 参考或 [Parallel 聊天 API 快速入门](https://docs.parallel.ai/chat-api/chat-quickstart)。
