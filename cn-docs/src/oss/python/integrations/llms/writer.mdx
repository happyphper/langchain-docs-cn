---
title: WRITER LLM
---
[WRITER](https://writer.com/) 是一个用于生成多语言内容的平台。

本示例将介绍如何使用 LangChain 与 `WRITER` [模型](https://dev.writer.com/docs/models) 进行交互。

## 设置

要访问 WRITER 模型，您需要创建一个 WRITER 账户，获取 API 密钥，并安装 `writer-sdk` 和 `langchain-community` 包。

### 凭证

前往 [WRITER AI Studio](https://app.writer.com/aistudio/signup?utm_campaign=devrel) 注册 WRITER 并生成 API 密钥。完成后，请设置 WRITER_API_KEY 环境变量：

```python
import getpass
import os

if not os.environ.get("WRITER_API_KEY"):
    os.environ["WRITER_API_KEY"] = getpass.getpass("Enter your Writer API key:")
```

## 安装

LangChain 的 WRITER 集成位于 `langchain-community` 包中：

```python
pip install -qU langchain-community writer-sdk
```

现在我们可以初始化模型对象来与 writer 的 LLMs 交互：

```python
from langchain_community.llms import Writer as WriterLLM

llm = WriterLLM(
    temperature=0.7,
    max_tokens=1000,
    # 其他参数...
)
```

## 调用

```python
response_text = llm.invoke(input="Write a poem")
```

```python
print(response_text)
```

## 流式传输

```python
stream_response = llm.stream(input="Tell me a fairytale")
```

```python
for chunk in stream_response:
    print(chunk, end="")
```

## 异步

WRITER 通过 **ainvoke()** 和 **astream()** 方法支持异步调用。

---

## API 参考

有关 WRITER 所有功能的详细文档，请访问我们的 [API 参考](https://dev.writer.com/api-guides/api-reference/completion-api/text-generation#text-generation)。
