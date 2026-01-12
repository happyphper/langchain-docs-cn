---
title: 智能体聊天界面
---

<!--@include: @/snippets/javascript/oss/agent-chat-ui.md-->

### 连接到您的智能体

Agent Chat UI 可以连接到[本地](/oss/javascript/langchain/studio#setup-local-agent-server)和[已部署的智能体](/oss/javascript/langchain/deploy)。

启动 Agent Chat UI 后，您需要配置它以连接到您的智能体：

1.  **图 ID**：输入您的图名称（在您的 `langgraph.json` 文件中的 `graphs` 下找到此信息）
2.  **部署 URL**：您的智能体服务器的端点（例如，本地开发使用 `http://localhost:2024`，或您已部署智能体的 URL）
3.  **LangSmith API 密钥（可选）**：添加您的 LangSmith API 密钥（如果您使用的是本地智能体服务器，则不需要）

配置完成后，Agent Chat UI 将自动获取并显示来自您智能体的任何中断线程。

<Tip>

Agent Chat UI 开箱即用地支持渲染工具调用和工具结果消息。要自定义显示哪些消息，请参阅[在聊天中隐藏消息](https://github.com/langchain-ai/agent-chat-ui?tab=readme-ov-file#hiding-messages-in-the-chat)。

</Tip>

