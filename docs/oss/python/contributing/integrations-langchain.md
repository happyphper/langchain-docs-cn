---
title: 贡献集成
sidebarTitle: Guide
---
**集成是 LangChain 的核心组成部分。**

LangChain 为构建 LLM 应用程序至关重要的几个不同组件（语言模型、向量存储等）提供了标准接口。贡献一个集成有助于扩展 LangChain 的生态系统，并使您的服务能够被数百万开发者发现。

## 为什么要向 LangChain 贡献集成？

<Card title="可发现性" icon="magnifying-glass">

LangChain 是构建 LLM 应用程序最常用的框架，每月下载量超过 2000 万次。

</Card>

<Card title="互操作性" icon="arrows-rotate">

LangChain 组件暴露了一个标准接口，允许开发者轻松地将它们相互替换。如果您实现了一个 LangChain 集成，任何使用不同组件的开发者都能轻松地替换成您的组件。

</Card>

<Card title="最佳实践" icon="star">

通过其标准接口，LangChain 组件鼓励并促进了最佳实践（流式传输、异步等），从而改善了开发者体验和应用程序性能。

</Card>

## 可集成的组件

虽然任何组件都可以集成到 LangChain 中，但我们更鼓励集成特定类型的组件：

**建议集成这些 ✅**：
- [**聊天模型**](/oss/python/integrations/chat)：最活跃使用的组件类型
- [**工具/工具包**](/oss/python/integrations/tools)：支持智能体（Agent）能力
- [**检索器**](/oss/python/integrations/retrievers)：RAG 应用程序的核心
- [**嵌入模型**](/oss/python/integrations/text_embedding)：向量操作的基础
- [**向量存储**](/oss/python/integrations/vectorstores)：语义搜索的关键

**不建议集成这些 ❌**：
- **LLMs（文本补全模型）**：已弃用，建议使用[聊天模型](/oss/python/integrations/chat)
- [**文档加载器**](/oss/python/integrations/document_loaders)：维护负担高
- [**键值存储**](/oss/python/integrations/stores)：使用有限
- **文档转换器**：小众用例
- **模型缓存**：基础设施问题
- **图**：复杂抽象
- **消息历史记录**：存储抽象
- **回调**：系统级组件
- **聊天加载器**：需求有限
- **适配器**：边缘情况工具

## 如何贡献一个集成

<Steps>

<Step title="确认资格">

请确认您的集成在我们当前接受的[鼓励集成的组件](#components-to-integrate)列表中。

</Step>

<Step title="实现您的包">

<Card title="如何实现一个 LangChain 集成" icon="link" href="/oss/contributing/implement-langchain" arrow />

</Step>

<Step title="通过标准测试">

如果适用，请为您的集成实现 LangChain [标准测试](/oss/python/contributing/standard-tests-langchain)套件的支持，并成功运行它们。

</Step>

<Step title="发布集成">

<Card title="如何发布一个集成" icon="upload" href="/oss/contributing/publish-langchain" arrow />

</Step>

<Step title="添加文档">

提交一个 PR，将您的集成文档添加到官方的 LangChain 文档中。

:::: details <Icon icon="book" style="margin-right: 8px; vertical-align: middle;" /> 集成文档指南

一个集成的价值取决于其文档。为了确保用户获得一致的体验，所有新集成都需要提供文档。我们为每种类型的集成提供了标准的起始模板，供您复制和修改。

在 LangChain [文档仓库](https://github.com/langchain-ai/docs) 中提交一个新的 PR，使用相应的模板文件在 `src/oss/python/integrations/<component_type>/integration_name.mdx` 下的相关目录中创建一个新文件：

- [聊天模型](https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/chat/TEMPLATE.mdx)
- [工具和工具包](https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/tools/TEMPLATE.mdx)
- [检索器](https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/retrievers/TEMPLATE.mdx)
- 文本分割器 - 即将推出
- 嵌入模型 - 即将推出
- [向量存储](https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/vectorstores/TEMPLATE.mdx)
- 文档加载器 - 即将推出
- 键值存储 - 即将推出

对于参考文档，请在仓库上提交一个 issue，以便维护人员添加它们。

::::

</Step>

<Step title="联合营销" icon="megaphone">

（可选）与 LangChain 团队合作进行[联合营销](/oss/python/contributing/comarketing)。

</Step>

</Steps>

