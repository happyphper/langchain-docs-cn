---
title: 无效的图节点返回值
---
LangGraph 的 [`StateGraph`](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) 收到了来自节点的一个非字典返回类型。示例如下：

```python
class State(TypedDict):
    some_key: str

def bad_node(state: State):
    # 应该返回一个包含 "some_key" 值的字典，而不是列表
    return ["whoops"]

builder = StateGraph(State)
builder.add_node(bad_node)
...

graph = builder.compile()
```

调用上述图将导致如下错误：

```python
graph.invoke({ "some_key": "someval" });
```

```
InvalidUpdateError: Expected dict, got ['whoops']
For troubleshooting, visit: https://python.langchain.com/docs/troubleshooting/errors/INVALID_GRAPH_NODE_RETURN_VALUE
```

图中的节点必须返回一个字典，其中包含在你的状态中定义的一个或多个键。

## 故障排除

以下方法可能有助于解决此错误：

* 如果你的节点中包含复杂逻辑，请确保所有代码路径都返回一个适合你定义状态的字典。

