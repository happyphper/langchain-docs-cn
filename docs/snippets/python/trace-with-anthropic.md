Python 中的 `wrap_anthropic` 方法允许你包装 Anthropic 客户端，以便自动记录追踪信息——无需使用装饰器或函数包装！使用此包装器可以确保消息（包括工具调用和多模态内容块）能在 LangSmith 中良好地呈现。该包装器与 `@traceable` 装饰器或 `traceable` 函数无缝协作，你可以在同一个应用程序中同时使用它们。

<Note>

即使在使用 `wrap_anthropic` 时，也必须将 `LANGSMITH_TRACING` 环境变量设置为 `'true'`，才能将追踪信息记录到 LangSmith。这允许你在不更改代码的情况下开启或关闭追踪功能。

此外，你需要将 `LANGSMITH_API_KEY` 环境变量设置为你的 API 密钥（更多信息请参阅[设置](/)）。

如果你的 LangSmith API 密钥关联了多个工作区，请设置 `LANGSMITH_WORKSPACE_ID` 环境变量来指定要使用的工作区。

默认情况下，追踪信息将记录到名为 `default` 的项目中。要将追踪信息记录到其他项目，请参阅[此部分](/langsmith/log-traces-to-project)。

</Note>

```python
import anthropic
from langsmith import traceable
from langsmith.wrappers import wrap_anthropic

client = wrap_anthropic(anthropic.Anthropic())

# 你也可以包装异步客户端
# async_client = wrap_anthropic(anthropic.AsyncAnthropic())

@traceable(run_type="tool", name="Retrieve Context")
def my_tool(question: str) -> str:
    return "During this morning's meeting, we solved all world conflict."

@traceable(name="Chat Pipeline")
def chat_pipeline(question: str):
    context = my_tool(question)
    messages = [
        { "role": "user", "content": f"Question: {question}\nContext: {context}"}
    ]
    messages = client.messages.create(
      model="claude-sonnet-4-5-20250929",
      messages=messages,
      max_tokens=1024,
      system="You are a helpful assistant. Please respond to the user's request only based on the given context."
    )
    return messages

chat_pipeline("Can you summarize this morning's meetings?")
```
