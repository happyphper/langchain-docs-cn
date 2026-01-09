---
title: 贡献指南
sidebarTitle: Overview
---
**欢迎！感谢您对贡献感兴趣。**

LangChain 已帮助形成了生成式 AI 领域最大的开发者社区，我们始终欢迎新的贡献者。无论是修复错误、添加功能、改进文档还是分享反馈，您的参与都有助于让 LangChain 和 LangGraph 对每个人来说都变得更好 🦜❤️

## 贡献方式

:::: details <Icon icon="bug" style="margin-right: 8px; vertical-align: middle;" /> 报告错误

发现了错误？请按照以下步骤帮助我们修复它：

<Steps>

<Step title="搜索">

检查相应仓库的 GitHub Issues 中是否已存在该问题：

<Columns :cols="2">

<Card title="LangChain" icon="link" href="https://github.com/langchain-ai/langchain/issues">
Issues
</Card>

<Card title="LangGraph" icon="circle-nodes" href="https://github.com/langchain-ai/langgraph/issues">
Issues
</Card>

</Columns>

</Step>

<Step title="创建 Issue">

如果不存在相关 Issue，请创建一个新的。撰写时，请务必遵循提供的模板，并包含一个[最小化、可复现的示例](https://stackoverflow.com/help/minimal-reproducible-example)。Issue 创建后，请为其附加任何相关的标签。如果项目维护者无法复现该问题，则不太可能及时处理。

</Step>

<Step title="等待">

项目维护者将对 Issue 进行分类，并可能要求提供更多信息。由于我们处理的 Issue 数量庞大，请耐心等待。除非您有新的信息需要提供，否则请不要在 Issue 中催促。

</Step>

</Steps>

如果您要添加一个 Issue，请尽量使其专注于单一主题。如果两个 Issue 相关或存在阻塞关系，请[链接它们](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)，而不是将它们合并。例如：

```text
This issue is blocked by #123 and related to #456.
```

::::

:::: details <Icon icon="wand-magic-sparkles" style="margin-right: 8px; vertical-align: middle;" /> 建议功能

对新功能或增强功能有想法？

<Steps>

<Step title="搜索">

在相应仓库的 Issues 中搜索现有的功能请求：

<Columns :cols="2">

<Card title="LangChain" icon="link" href="https://github.com/langchain-ai/langchain/issues?q=state%3Aopen%20label%3A%22feature%20request%22">
Issues
</Card>

<Card title="LangGraph" icon="circle-nodes" href="https://github.com/langchain-ai/langgraph/issues?q=state%3Aopen%20label%3Aenhancement">
Issues
</Card>

</Columns>

</Step>

<Step title="讨论">

如果没有相关请求，请在[相关类别](https://forum.langchain.com/c/help/langchain/14)下发起新的讨论，以便项目维护者和社区提供反馈。

</Step>

<Step title="描述">

请务必描述用例以及它为何对他人有价值。如果可能，请提供示例或适用的模型图。概述应通过的测试用例。

</Step>

</Steps>

::::

:::: details <Icon icon="book" style="margin-right: 8px; vertical-align: middle;" /> 改进文档

文档改进总是受欢迎的！我们努力保持文档清晰全面，您的视角可以带来很大的不同。

<Card title="如何提议文档更改" href="/oss/contributing/documentation" arrow>
指南
</Card>

::::

:::: details <Icon icon="code" style="margin-right: 8px; vertical-align: middle;" /> 贡献代码

拥有庞大的用户群，我们的小团队很难跟上所有的功能请求和错误修复。如果您有技能和时间，我们非常欢迎您的帮助！

<Card title="如何创建您的第一个 Pull Request" href="/oss/contributing/code" arrow>
指南
</Card>

如果您开始处理某个 Issue，请将其分配给自己或请维护者分配。这有助于避免重复工作。

如果您正在寻找可以着手的工作，请查看我们仓库中标记为 "good first issue" 或 "help wanted" 的 Issues：

<Columns :cols="2">

<Card title="LangChain" icon="link" href="https://github.com/langchain-ai/langchain/labels">
Labels
</Card>

<Card title="LangGraph" icon="circle-nodes" href="https://github.com/langchain-ai/langgraph/labels">
Labels
</Card>

</Columns>

::::

:::: details <Icon icon="plug-circle-plus" style="margin-right: 8px; vertical-align: middle;" /> 添加新集成

<Card title="LangChain" icon="link" href="/oss/contributing/integrations-langchain" arrow>
添加新 LangChain 集成指南
</Card>

::::

## LLM 的可接受用途

生成式 AI 对贡献者来说可能是一个有用的工具，但像任何工具一样，使用时需要批判性思维和良好的判断力。

当贡献者的全部工作（代码更改、文档更新、Pull Request 描述）都由 LLM 生成时，我们会感到困扰。这些"路过式"的贡献通常本意良好，但在上下文相关性、准确性和质量方面往往不尽如人意。

我们将关闭那些没有成效的 Pull Requests 和 Issues，以便将维护者的精力集中在其他地方。
