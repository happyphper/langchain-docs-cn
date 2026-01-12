---
title: 缺失检查点器
---
你正在尝试使用 LangGraph 内置的持久化功能，但没有提供检查点（checkpointer）。

当 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 或 <a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint" target="_blank" rel="noreferrer" class="link"><code>@entrypoint</code></a> 的 `compile()` 方法中缺少 `checkpointer` 时，会发生此错误。

## 故障排除

以下方法可能有助于解决此错误：

-   初始化一个检查点（checkpointer）并将其传递给 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 或 <a href="https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint" target="_blank" rel="noreferrer" class="link"><code>@entrypoint</code></a> 的 `compile()` 方法。

```python
from langgraph.checkpoint.memory import InMemorySaver
checkpointer = InMemorySaver()

# Graph API
graph = StateGraph(...).compile(checkpointer=checkpointer)

# Functional API
@entrypoint(checkpointer=checkpointer)
def workflow(messages: list[str]) -> str:
    ...
```

-   使用 LangGraph API，这样你就不需要手动实现或配置检查点（checkpointer）。API 会为你处理所有持久化基础设施。

## 相关链接

-   阅读更多关于[持久化](/oss/python/langgraph/persistence)的信息。
