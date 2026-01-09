---
title: GRAPH_RECURSION_LIMIT
---
您的 LangGraph [`StateGraph`](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) 在达到停止条件之前，已经达到了最大步数限制。
这通常是由于类似以下示例代码引起的无限循环：

```python
class State(TypedDict):
    some_key: str

builder = StateGraph(State)
builder.add_node("a", ...)
builder.add_node("b", ...)
builder.add_edge("a", "b")
builder.add_edge("b", "a")
...

graph = builder.compile()
```

然而，复杂的图（graph）也可能自然地达到默认限制。

## 故障排除

* 如果您不期望您的图（graph）经历多次迭代，那么很可能存在循环。请检查您的逻辑是否存在无限循环。

* 如果您有一个复杂的图（graph），您可以在调用图（graph）时，向 `config` 对象传入一个更高的 `recursion_limit` 值，如下所示：

```python
graph.invoke({...}, {"recursion_limit": 100})
```

