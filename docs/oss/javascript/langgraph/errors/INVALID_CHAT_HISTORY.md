---
title: 无效聊天历史记录
---


当 `callModel` 图节点接收到格式错误的消息列表时，预构建的 <a href="https://reference.langchain.com/javascript/functions/langchain.index.createAgent.html" target="_blank" rel="noreferrer" class="link"><code>createAgent</code></a> 会引发此错误。具体来说，当存在带有 `tool_calls`（LLM 请求调用工具）的 `AIMessage`s，但没有对应的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>（要返回给 LLM 的工具调用结果）时，消息列表格式即为错误。

您看到此错误可能有以下几个原因：

1. 您在调用图时手动传递了格式错误的消息列表，例如 `graph.invoke({messages: [new AIMessage({..., tool_calls: [...]})]})`
2. 图在从 `tools` 节点（即一组 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>）接收更新之前被中断，并且您使用了一个非 null 或非 ToolMessage 的输入来调用它，例如 `graph.invoke({messages: [new HumanMessage(...)]}, config)`。
此中断可能由以下方式之一触发：
    * 您在 `createAgent` 中手动设置了 `interruptBefore: ['tools']`
    * 某个工具引发了未被 <a href="https://reference.langchain.com/javascript/classes/_langchain_langgraph.prebuilt.ToolNode.html" target="_blank" rel="noreferrer" class="link"><code>ToolNode</code></a> (`"tools"`) 处理的错误

## 故障排除

要解决此问题，您可以执行以下操作之一：

1. 不要使用格式错误的消息列表来调用图
2. 在发生中断（手动或由于错误）的情况下，您可以：

* 提供与现有工具调用匹配的 `ToolMessage` 对象，并调用 `graph.invoke({messages: [new ToolMessage(...)]})`。
  **注意**：这会将消息追加到历史记录中，并从 START 节点开始运行图。
  * 手动更新状态并从中断处恢复图：
    1. 使用 `graph.getState(config)` 从图状态获取最新的消息列表
    2. 修改消息列表，要么从 AIMessages 中移除未应答的工具调用

要么添加 `toolCallId`s 与未应答工具调用匹配的 `ToolMessage` 对象 3. 使用修改后的消息列表调用 `graph.updateState(config, {messages: ...})` 4. 恢复图，例如调用 `graph.invoke(null, config)`

