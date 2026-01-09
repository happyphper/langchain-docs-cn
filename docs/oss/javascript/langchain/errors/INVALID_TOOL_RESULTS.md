---
title: 无效工具结果
---

<Note>

目前仅在 `langchainjs`（JavaScript/TypeScript）中使用。

</Note>

此错误发生在工具调用操作期间，向模型传递不匹配、不足或过多的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a> 对象时。

该错误源于一个基本要求：带有 `tool_calls` 的助手消息（assistant message）之后，必须跟随响应每个 `tool_call_id` 的工具消息。

当模型返回一个带有工具调用的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 时，您必须为每个工具调用提供恰好一个对应的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>，并且 `tool_call_id` 值必须匹配。

## 常见原因

* **响应不足**：如果模型请求执行两个工具，但您只提供了一个响应消息，模型会拒绝不完整的消息链。
* **重复响应**：为同一个工具调用 ID 提供多个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a> 对象会导致拒绝，未匹配的 ID 也会导致同样的问题。
* **孤立的工具消息**：发送一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>，而前面没有包含工具调用的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a>，这违反了协议要求。

以下是一个有问题的模式示例：

```javascript
// 模型请求两个工具调用
responseMessage.tool_calls // 返回 2 个调用

// 但只提供了一个 ToolMessage
chatHistory.push({
  role: "tool",
  content: toolResponse,
  tool_call_id: responseMessage.tool_calls[0].id
});

await modelWithTools.invoke(chatHistory); // 失败并提示 INVALID_TOOL_RESULTS
```

## 故障排除

要解决此错误：

* **匹配计数**：确保在前一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 中的每个工具调用都对应一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>。
* **验证 ID**：确认每个 `ToolMessage.tool_call_id` 都匹配一个实际的工具调用标识符。
