---
title: 更新日志
sidebarTitle: Changelog
description: JavaScript/TypeScript 包更新与改进日志
rss: true
---

<Callout icon="rss" color="#DFC5FE" iconType="regular">

<strong>订阅</strong>：我们的更新日志包含一个 [RSS 源](https://docs.langchain.com/oss/javascript/releases/changelog/rss.xml)，可以集成到 [Slack](https://slack.com/help/articles/218688467-Add-RSS-feeds-to-Slack)、[电子邮件](https://zapier.com/apps/email/integrations/rss/1441/send-new-rss-feed-entries-via-email)、Discord 机器人（如 [Readybot](https://readybot.io/) 或 [RSS Feeds to Discord Bot](https://rss.app/en/bots/rssfeeds-discord-bot)）以及其他订阅工具中。

</Callout>

<Update label="2025年12月12日" :tags="['langchain', '@langchain/openai', '@langchain/anthropic', '@langchain/ollama', '@langchain/community', '@langchain/xai', '@langchain/tavily', '@langchain/mongodb', '@langchain/mcp-adapters', '@langchain/google-common', '@langchain/core']">

## v1.2.0
### `langchain`
* [结构化输出](/oss/javascript/langchain/structured-output)：在使用 `providerStrategy` 进行结构化输出时，增加了手动设置 `strict` 模式的能力。

### `@langchain/openai`
* **新增提供商内置工具：** 支持[文件搜索](/oss/javascript/langchain/tools#file-search)、[网络搜索](/oss/javascript/langchain/tools#web-search)、[代码解释器](/oss/javascript/langchain/tools#code-interpreter)、[图像生成](/oss/javascript/langchain/tools#image-generation)、[计算机使用](/oss/javascript/langchain/tools#computer-use)、[Shell](/oss/javascript/langchain/tools#shell) 和 [MCP 连接器](/oss/javascript/langchain/tools#mcp) 工具。
* **内容审核：** `ChatOpenAI` 新增 `moderateContent` 选项，用于检测和处理不安全内容。
* 对于 GPT-5.2 Pro 模型，优先使用 responses API。

## v1.3.0
### `@langchain/anthropic`
* **新增提供商内置工具：** 支持[文本编辑器](/oss/javascript/langchain/tools#text-editor)、[网页抓取](/oss/javascript/langchain/tools#web-fetch)、[计算机使用](/oss/javascript/langchain/tools#computer-use-1)、[工具搜索](/oss/javascript/langchain/tools#tool-search) 和 [MCP 工具集](/oss/javascript/langchain/tools#mcp-toolset) 工具。
* 公开了 `ChatAnthropicInput` 类型，以提升类型安全性。

## v1.1.0
### `@langchain/ollama`
* **原生结构化输出：** 通过 `withStructuredOutput` 增加了对原生结构化输出的支持。
* 支持自定义 `baseUrl` 配置。

## v1.0.0
### `@langchain/community`
* Jira 文档加载器更新为使用 v3 API。
* LanceDB：增加了 `similaritySearch()` 和 `similaritySearchWithScore()` 支持。
* Elasticsearch 混合搜索支持。
* 新增 `GoogleCalendarDeleteTool`。
* 针对 LlamaCppEmbeddings、PrismaVectorStore、IBM WatsonX 的各种错误修复和安全性改进。

### 其他包
* **@langchain/xai：** 原生 Live Search 支持。
* **@langchain/tavily：** 增加了 Tavily 的研究端点。
* **@langchain/mongodb：** 新的 MongoDB LLM 缓存。
* **@langchain/mcp-adapters：** 增加了 `onConnectionError` 选项。
* **@langchain/google-common：** `withStructuredOutput` 中支持 `jsonSchema` 方法。
* **@langchain/core：** 安全性修复，Mermaid 图中更好的子图嵌套，运行 ID 使用 UUID7。

</Update>

<Update label="2025年11月25日" :tags="['langchain']">

## v1.1.0

* [模型配置文件](/oss/javascript/langchain/models#model-profiles)：聊天模型现在通过 `.profile` getter 公开支持的功能和特性。这些数据来源于 [models.dev](https://models.dev)，这是一个提供模型能力数据的开源项目。
* [模型重试中间件](/oss/javascript/langchain/middleware/built-in#model-retry)：新的中间件，用于自动重试失败的模型调用，并支持可配置的指数退避，提高了智能体的可靠性。
* [内容审核中间件](/oss/javascript/langchain/middleware/built-in#content-moderation)：OpenAI 内容审核中间件，用于检测和处理智能体交互中的不安全内容。支持检查用户输入、模型输出和工具结果。
* [摘要中间件](/oss/javascript/langchain/middleware/built-in#summarization)：更新后支持使用模型配置文件进行灵活的触发点设置，实现上下文感知的摘要生成。
* [结构化输出](/oss/javascript/langchain/structured-output)：`ProviderStrategy` 支持（原生结构化输出）现在可以从模型配置文件中推断。
* [`createAgent` 的 `SystemMessage`](/oss/javascript/langchain/middleware/custom#working-with-system-messages)：支持将 `SystemMessage` 实例直接传递给 `createAgent` 的 `systemPrompt` 参数，并新增了用于扩展系统消息的 `concat` 方法。支持缓存控制和结构化内容块等高级功能。
* [动态系统提示中间件](/oss/javascript/langchain/agents#dynamic-system-prompt)：`dynamicSystemPromptMiddleware` 的返回值现在完全是附加性的。当返回 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.SystemMessage.html" target="_blank" rel="noreferrer" class="link"><code>SystemMessage</code></a> 或 `string` 时，它们会与现有的系统消息合并，而不是替换它们，这使得组合多个修改提示的中间件变得更加容易。
* **兼容性改进：** 修复了结构化输出和工具模式中 Zod v4 验证错误的处理，确保正确显示详细的错误信息。

</Update>

<Update label="2025年10月20日" :tags="['langchain', 'langgraph']">

## v1.0.0

### `langchain`
* [发布说明](/oss/javascript/releases/langchain-v1)
* [迁移指南](/oss/javascript/migrate/langchain-v1)

### `langgraph`
* [发布说明](/oss/javascript/releases/langgraph-v1)
* [迁移指南](/oss/javascript/migrate/langgraph-v1)

<Callout icon="bullhorn" color="#DFC5FE" iconType="regular">

如果您遇到任何问题或有反馈，请[提交一个 issue](https://github.com/langchain-ai/docs/issues/new?template=01-langchain.yml)，以便我们改进。要查看 v0.x 文档，[请访问存档内容](https://github.com/langchain-ai/langchainjs/tree/v0.3/docs/core_docs/docs)。

</Callout>

</Update>

