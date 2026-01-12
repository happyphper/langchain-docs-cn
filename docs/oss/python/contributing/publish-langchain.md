---
title: 发布一个集成
sidebarTitle: Publish
---
**让你的集成对社区可用。**

<Warning>

<strong>重要提示：新的集成应该是独立的包，而不是提交到 LangChain 单仓库的 PR。</strong>

虽然 LangChain 在主仓库中维护了一小部分第一方和高使用率的集成（如 OpenAI、Anthropic 和 Ollama），但<strong>新的集成应该作为单独的 PyPI 包和仓库发布</strong>（例如 `langchain-yourservice`），用户需要与核心 LangChain 包一起安装。你<strong>不应该</strong>提交 PR 来直接将你的集成添加到主 LangChain 仓库。

</Warning>

现在你的包已经实现并测试完毕，你可以发布它并添加文档，使其能够被社区发现。

## 发布你的包

<Info>

本指南假设你已经实现了你的包并为其编写了测试。如果还没有，请参考[实现指南](/oss/python/contributing/implement-langchain)和[测试指南](/oss/python/contributing/standard-tests-langchain)。

</Info>

在本指南中，我们将使用 PyPI 作为包注册表。你也可以选择发布到其他注册表；具体说明会有所不同。

### 设置凭据

首先，确保你有一个 PyPI 账户：

:::: details <Icon icon="key" style="margin-right: 8px; vertical-align: middle;" /> 如何创建 PyPI 令牌

<Steps>

<Step title="创建账户">

访问 [PyPI 网站](https://pypi.org/) 并创建一个账户

</Step>

<Step title="验证邮箱">

点击 PyPI 发送给你的邮件中的链接来验证你的邮箱地址

</Step>

<Step title="启用 2FA">

进入你的账户设置，点击"生成恢复代码"以启用双因素认证。要生成 API 令牌，你<strong>必须</strong>启用 2FA

</Step>

<Step title="生成令牌">

进入你的账户设置，[生成一个新的 API 令牌](https://pypi.org/manage/account/token/)

</Step>

</Steps>

::::

### 构建和发布

<Card
title="如何发布一个包"
icon="upload"
href="https://docs.astral.sh/uv/guides/package/"
arrow
>

来自 `uv` 的有用指南，介绍如何构建包并发布到 PyPI。

</Card>

## 添加文档

要将你的包的文档添加到本网站的[集成选项卡](/oss/python/integrations/providers/overview)下，你需要创建相关的文档页面，并在 [LangChain 文档仓库](https://github.com/langchain-ai/docs) 中提交一个 PR。

### 编写文档

根据你构建的集成类型，你需要创建不同类型的文档页面。LangChain 为不同类型的集成提供了模板，帮助你快速上手。

<CardGroup>

<Card title="聊天模型" icon="message" href="https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/chat/TEMPLATE.mdx" arrow/>
<Card title="工具/工具包" icon="wrench" href="https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/tools/TEMPLATE.mdx" arrow/>
<Card title="检索器" icon="magnifying-glass" href="https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/retrievers/TEMPLATE.mdx" arrow/>
<Card title="向量存储" icon="database" href="https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/vectorstores/TEMPLATE.mdx" arrow/>
<Card title="嵌入模型" icon="layer-group" href="https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/text_embedding/TEMPLATE.mdx" arrow/>

</CardGroup>

<Tip>

要参考现有文档，你可以查看[集成列表](/oss/python/integrations/providers/overview)并找到与你类似的集成。

要以原始 Markdown 格式查看某个文档页面，请使用页面右上角"复制页面"旁边的下拉按钮，并选择"以 Markdown 查看"。

</Tip>

### 提交 PR

在个人 GitHub 账户下 Fork [LangChain 文档仓库](https://github.com/langchain-ai/docs)，并在本地克隆它。为你的集成创建一个新的分支。复制模板并使用你喜欢的 Markdown 文本编辑器进行修改。在编写文档时，请务必参考并遵循[文档指南](/oss/python/contributing/documentation)。

<Warning>

在以下情况下，我们可能会拒绝 PR 或要求修改：
    - CI 检查失败
    - 存在严重的语法错误或拼写错误
    - [Mintlify 组件](/oss/python/contributing/documentation#mintlify-components) 使用不正确
    - 页面缺少 [frontmatter](/oss/python/contributing/documentation#page-structure)
    - 缺少 [本地化](/oss/python/contributing/documentation#localization)（如适用）
    - [代码示例](/oss/python/contributing/documentation#in-code-documentation) 无法运行或有错误
    - 未达到 [质量标准](/oss/python/contributing/documentation#quality-standards)

</Warning>

请耐心等待，因为我们处理的 PR 数量很大。我们会尽快审查你的 PR 并提供反馈或合并它。**请不要反复标记维护者询问你的 PR。**

---

## 后续步骤
**恭喜！** 你的集成现已发布并完成文档编写，可供整个 LangChain 社区使用。

<Card title="联合营销" icon="bullhorn" href="/oss/contributing/comarketing" arrow>

联系 LangChain 营销团队，探索联合营销机会。

</Card>

