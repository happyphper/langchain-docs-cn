---
title: Agent Builder 设置
description: 为 Agent Builder 使用的模型和工具添加所需的工作空间密钥。
sidebarTitle: Setup
---
本页面列出了在使用 Agent Builder 前需要添加的工作区密钥。请在 LangSmith 工作区设置的 Secrets 部分添加这些密钥。请将密钥值限定在工作区内，避免将凭证放置在提示词或代码中。

## 如何添加工作区密钥

在 [LangSmith UI](https://smith.langchain.com) 中，请确保您已将 LLM API 密钥设置为 [工作区密钥](/langsmith/administration-overview#workspace-secrets)（可以是 Anthropic 或 OpenAI API 密钥）。

1.  导航到 <Icon icon="gear" /> **设置**，然后切换到 **密钥** 标签页。
1.  选择 **添加密钥**，在 **名称** 字段中输入 `OPENAI_API_KEY` 或 `ANTHROPIC_API_KEY`，并在 **值** 字段中输入您的 API 密钥。
1.  选择 **保存密钥**。

<Note>
在 LangSmith UI 中添加工作区密钥时，请确保密钥名称与您的模型提供商所期望的环境变量名称匹配。
</Note>

## 必需的模型密钥

为了让 Agent Builder 能够向 LLM 发起 API 调用，您需要将 OpenAI 或 Anthropic API 密钥设置为工作区密钥。智能体图（agent graphs）会从工作区密钥中加载此密钥以进行推理。

<Note icon="wand-magic-sparkles" iconType="regular">

Agent Builder 支持为每个智能体配置自定义模型。更多信息请参阅 [自定义模型](/langsmith/agent-builder-essentials#custom-models)。

</Note>

## Agent Builder 专用密钥

在 Agent Builder 内部，以 `AGENT_BUILDER_` 为前缀的密钥优先级高于工作区密钥。这样，您可以更好地追踪 Agent Builder 与 LangSmith 其他使用相同密钥部分的使用情况。

如果您同时拥有 `OPENAI_API_KEY` 和 `AGENT_BUILDER_OPENAI_API_KEY`，则将使用 `AGENT_BUILDER_OPENAI_API_KEY` 这个密钥。

## 可选工具密钥

为您启用的任何工具添加密钥。这些密钥在运行时从工作区密钥中读取。

- `EXA_API_KEY`：Exa 搜索工具（通用网页和 LinkedIn 个人资料搜索）所需。
- `TAVILY_API_KEY`：Tavily 网页搜索所需。
- `TWITTER_API_KEY` 和 `TWITTER_API_KEY_SECRET`：Twitter/X 读取操作（仅应用承载令牌）所需。发帖/媒体上传功能未启用。

## MCP 服务器配置

Agent Builder 可以从一个或多个远程 [模型上下文协议 (MCP)](https://modelcontextprotocol.io/) 服务器拉取工具。请在您的 [工作区](/langsmith/administration-overview#workspaces) 设置中配置 MCP 服务器和请求头。Agent Builder 会自动发现工具，并在调用它们时应用配置的请求头。

有关使用远程 MCP 服务器的更多详细信息，请参阅 [MCP 框架](/langsmith/agent-builder-mcp-framework#using-remote-mcp-servers) 页面。
