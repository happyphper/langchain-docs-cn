---
title: 2Markdown
---
# 2Markdown

>[2markdown](https://2markdown.com/) 服务可将网站内容转换为结构化的 Markdown 文件。

```python
# 你需要获取自己的 API 密钥。请访问 https://2markdown.com/login

api_key = ""
```

```python
from langchain_community.document_loaders import ToMarkdownLoader
```

```python
loader = ToMarkdownLoader(url="/docs/get_started/introduction", api_key=api_key)
```

```python
docs = loader.load()
```

```python
print(docs[0].page_content)
```

```text
**LangChain** 是一个用于开发由语言模型驱动的应用程序的框架。它支持构建以下类型的应用程序：

- **具备上下文感知能力**：将语言模型连接到上下文源（提示指令、少量示例、用于支撑其响应的内容等）。
- **能够推理**：依赖语言模型进行推理（如何根据提供的上下文回答问题、采取什么行动等）。

该框架由以下几个部分组成。

- **LangChain 库**：Python 和 JavaScript 库。包含众多组件的接口和集成，一个用于将这些组件组合成链（chains）和智能体（agents）的基本运行时，以及开箱即用的链和智能体实现。
- **[LangChain 模板](/docs/templates)**：一个易于部署的参考架构集合，适用于各种任务。
- **[LangServe](/docs/langserve)**：一个用于将 LangChain 链部署为 REST API 的库。
- **[LangSmith](https://docs.smith.langchain.com)**：一个开发者平台，允许您调试、测试、评估和监控基于任何 LLM 框架构建的链，并与 LangChain 无缝集成。

![描述 LangChain 框架分层组织结构的示意图，展示了跨多个层的相互关联部分。](https://python.langchain.com/assets/images/langchain_stack-f21828069f74484521f38199910007c1.svg)

这些产品共同简化了整个应用程序生命周期：

- **开发**：使用 LangChain/LangChain.js 编写应用程序。参考模板快速上手。
- **产品化**：使用 LangSmith 检查、测试和监控您的链，以便您可以持续改进并充满信心地进行部署。
- **部署**：使用 LangServe 将任何链转换为 API。

## LangChain 库 [​](\#langchain-libraries "Direct link to LangChain Libraries")

LangChain 包的主要价值主张是：

1.  **组件**：用于处理语言模型的可组合工具和集成。组件是模块化且易于使用的，无论您是否使用 LangChain 框架的其余部分。
2.  **开箱即用的链**：用于完成高级任务的内置组件集合。

开箱即用的链让入门变得容易。组件让定制现有链和构建新链变得容易。

LangChain 库本身由几个不同的包组成。

- **`langchain-core`**：基础抽象和 LangChain 表达式语言。
- **`langchain-community`**：第三方集成。
- **`langchain`**：构成应用程序认知架构的链、智能体和检索策略。

## 开始使用 [​](\#get-started "Direct link to Get started")

[这里](/docs/installation)介绍了如何安装 LangChain、设置环境并开始构建。

我们建议按照我们的[快速入门](/oss/tutorials/llm_chain)指南，通过构建您的第一个 LangChain 应用程序来熟悉该框架。

注意

本文档主要关注 Python LangChain 库。有关 JavaScript LangChain 库的文档，请[点击此处](https://js.langchain.com)。

## 模块 [​](\#modules "Direct link to Modules")

LangChain 为以下模块提供了标准、可扩展的接口和集成：

#### [模型 I/O](/docs/modules/model_io/) [​](\#model-io "Direct link to model-io")

与语言模型交互

#### [检索](/docs/modules/data_connection/) [​](\#retrieval "Direct link to retrieval")

与特定于应用程序的数据交互

#### [智能体](/oss/langchain/agents) [​](\#agents "Direct link to agents")

让模型根据高级指令选择要使用的工具

## 示例、生态系统和资源 [​](\#examples-ecosystem-and-resources "Direct link to Examples, ecosystem, and resources")

### [用例](/oss/langchain/rag) [​](\#use-cases "Direct link to use-cases")

常见端到端用例的演练和技术，例如：

- [文档问答](/oss/langchain/rag)
- [聊天机器人](/docs/use_cases/chatbots/)
- [分析结构化数据](/docs/how_to#qa-over-sql--csv)
- 以及更多...

### [集成](/oss/integrations/providers/) [​](\#integrations "Direct link to integrations")

LangChain 是一个丰富的工具生态系统的一部分，这些工具与我们的框架集成并构建在其之上。查看我们不断增长的[集成](/oss/integrations/providers/)列表。

### [指南](/oss/how-to/debugging) [​](\#guides "Direct link to guides")

使用 LangChain 进行开发的最佳实践。

### [API 参考](https://python.langchain.com/api_reference/) [​](\#api-reference "Direct link to api-reference")

前往参考部分，查看 LangChain 和 LangChain Experimental Python 包中所有类和方法的完整文档。

### [开发者指南](/docs/contributing) [​](\#developers-guide "Direct link to developers-guide")

查看开发者指南，了解贡献指南以及如何设置开发环境。

前往[社区导航器](/docs/community)，寻找提问、分享反馈、结识其他开发者以及畅想 LLM 未来的地方。
```

```python

```
