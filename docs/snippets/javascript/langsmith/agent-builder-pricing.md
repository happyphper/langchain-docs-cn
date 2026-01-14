## 什么是 Agent Builder 运行？

Agent Builder 运行是指对 Agent Builder 智能体的一次完整调用，由收到消息或事件触发，无论是自动触发还是手动发送。一次 Agent Builder 运行包括通过配置的触发器（包括第三方集成或其他连接服务）传递给智能体的任何消息，以及直接通过 Agent Builder 用户界面（例如，通过聊天界面）发送的消息。只要调用成功或被中断，就会计为一次 Agent Builder 运行。在人机协同（human-in-the-loop）中断后恢复执行，将构成一次单独的 Agent Builder 运行。执行失败不计为 Agent Builder 运行。

## Agent Builder 定价包含模型成本吗？

不包含。模型使用费用由您的模型提供商单独计费。Agent Builder 允许您选择所需的模型（例如，Anthropic、OpenAI、Gemini 或其他提供商），并使用您的提供商 API 密钥进行连接。有关配置模型的更多信息，请参阅 [Agent Builder 设置](/langsmith/agent-builder-setup#required-model-key) 页面。

## Agent Builder 定价包含智能体工具吗？

Agent Builder 包含内置工具，并支持通过远程 MCP 服务器连接第三方工具。第三方工具通常需要您使用自己的账户进行身份验证，任何费用或使用费均由第三方提供商计费。有关设置工具密钥的更多信息，请参阅 [Agent Builder 设置](/langsmith/agent-builder-setup#optional-tool-keys) 页面。

## Agent Builder 运行会自动在 LangSmith 中追踪吗？它们会计入账单吗？

是的。每次 Agent Builder 运行都会自动在 LangSmith 中追踪。这些追踪归属于用户账户，并根据客户的 LangSmith 计划计入基于使用量的计费。
