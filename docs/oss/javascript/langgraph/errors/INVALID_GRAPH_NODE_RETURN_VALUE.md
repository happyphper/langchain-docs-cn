---
title: 无效的图节点返回值
---


LangGraph 的 [`StateGraph`](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) 收到了来自节点的一个非对象返回类型。示例如下：

```typescript
import * as z from "zod";
import { StateGraph } from "@langchain/langgraph";

const State = z.object({
  someKey: z.string(),
});

const badNode = (state: z.infer<typeof State>) => {
  // 应该返回一个包含 "someKey" 值的对象，而不是数组
  return ["whoops"];
};

const builder = new StateGraph(State).addNode("badNode", badNode);
// ...

const graph = builder.compile();
```

调用上述图将导致如下错误：

```typescript
await graph.invoke({ someKey: "someval" });
```

```
InvalidUpdateError: Expected object, got ['whoops']
For troubleshooting, visit: https://langchain-ai.github.io/langgraphjs/troubleshooting/errors/INVALID_GRAPH_NODE_RETURN_VALUE
```

图中的节点必须返回一个对象，其中包含在你的状态中定义的一个或多个键。

## 故障排除

以下方法可能有助于解决此错误：

* 如果你的节点中包含复杂逻辑，请确保所有代码路径都返回一个适合你定义状态的对象。

