---
title: 多子图
---
你在单个启用了检查点的 LangGraph 节点内多次调用子图。

由于子图检查点命名空间的内部限制，目前不允许这样做。

## 故障排除

以下方法可能有助于解决此错误：

* 如果你不需要从子图中断/恢复，在编译时传递 `checkpointer: false`，像这样：`.compile({ checkpointer: false })`

* 不要在同一节点中强制多次调用图，而是使用 [`Send`](/oss/javascript/langgraph/graph-api#send) API。
