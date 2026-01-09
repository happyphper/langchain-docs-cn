---
title: 无效提示输入
---

当 [提示模板](https://github.com/langchain-ai/langchain/blob/v0.3/docs/docs/concepts/prompt_templates.mdx) 接收到缺失或无效的输入变量时发生。

## 故障排除

要解决此错误，你可以：

1.  检查你的提示模板是否正确。使用 f-string 格式时，确保正确转义花括号：
    *   在 f-strings 中使用 <code v-pre>{{</code> 表示单个花括号
    *   在 f-strings 中使用 <code v-pre>{{{{</code> 表示双花括号
2.  使用 `MessagesPlaceholder` 组件时，确认你传递的是消息数组或类似消息的对象。如果使用简写元组，请将变量名用花括号包裹，如 `["placeholder", "{messages}"]`
3.  通过使用 [LangSmith](/langsmith/home) 或日志记录来检查提示模板的实际输入，以验证它们是否符合预期
4.  如果从 LangChain [Prompt Hub](https://smith.langchain.com/prompts) 获取提示，请使用示例输入隔离并测试提示，以确保其按预期工作
