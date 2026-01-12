---
title: 贡献代码
sidebarTitle: Code
---
我们始终欢迎代码贡献！无论是修复错误、添加功能还是改进性能，您的贡献都能帮助成千上万的开发者获得更好的开发体验。

## 开始之前

<Note>

在提交大型的<strong>新功能或重构</strong>之前，请先在[论坛](https://forum.langchain.com/)中讨论您的想法。这有助于确保与项目目标保持一致，并避免重复工作。

这不适用于错误修复或小的改进，您可以直接通过拉取请求（pull request）贡献这些内容。请参阅下面的快速入门指南。

</Note>

### 快速修复：提交错误修复

对于简单的错误修复，您可以立即开始：

<Steps>

<Step title="复现问题">

创建一个能演示该错误的最小化测试用例。维护者和其他贡献者应该能够运行此测试并看到失败，而无需额外的设置或修改。

</Step>

<Step title="Fork 仓库">

将 [LangChain](https://github.com/langchain-ai/langchain) 或 [LangGraph](https://github.com/langchain-ai/langgraph) 仓库 Fork 到您的<Tooltip tip="如果 Fork 到组织账户，维护者将无法进行编辑。">个人 GitHub 账户</Tooltip>。

</Step>

<Step title="克隆与设置">

```bash
git clone https://github.com/your-username/name-of-forked-repo.git

# 例如，对于 LangChain：
git clone https://github.com/parrot123/langchain.git

# 对于 LangGraph：
git clone https://github.com/parrot123/langgraph.git
```

```bash
# 在您的仓库内，安装依赖
uv sync --all-groups
```

如果您之前没有安装过 [`uv`](https://docs.astral.sh/uv/)，则需要安装。

</Step>

<Step title="创建分支">

为您的修复创建一个新分支。这有助于组织您的更改，并方便后续提交拉取请求。

```bash
git checkout -b your-username/short-bugfix-name
```

</Step>

<Step title="编写失败的测试">

添加[单元测试](#test-writing-guidelines)，这些测试在没有您的修复时会失败。这使我们能够验证错误是否已解决，并防止回归。

</Step>

<Step title="进行更改">

在遵循我们的[代码质量标准](#code-quality-standards)的同时修复错误。进行<strong>解决此问题所需的最小更改</strong>。我们强烈建议贡献者在开始编码前在相关问题上发表评论。例如：

*"我想处理这个问题。我打算采用的方法是 [...简要描述...]。这符合维护者的期望吗？"*

如果您的初始方法有误，30秒的评论通常可以避免浪费精力。

</Step>

<Step title="验证修复">

确保测试通过且没有引入回归。在提交 PR 之前，确保所有测试在本地通过。

```bash
make lint
make test

# 对于涉及集成的错误修复，还需运行：
make integration_tests
# （您可能需要设置 API 测试凭据）
```

</Step>

<Step title="记录变更">

如果行为发生变化，请更新文档字符串（docstrings）；对于复杂逻辑，请添加注释。

</Step>

<Step title="提交拉取请求">

遵循提供的 PR 模板。如果适用，请使用[关闭关键词](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)（例如 `Fixes #ISSUE_NUMBER`）引用您正在修复的问题，以便在您的 PR 合并时自动关闭该问题。

</Step>

</Steps>

### 完整的开发设置

对于持续开发或较大的贡献：

1.  查看我们的[贡献指南](#contribution-guidelines)，了解功能、错误修复和集成方面的要求。
2.  按照下面的[设置指南](#development-environment)配置您的环境。
3.  了解[仓库结构](#repository-structure)和包组织。
4.  学习我们的[开发工作流程](#development-workflow)，包括测试和代码检查。

---

## 贡献指南

在开始为 LangChain 做贡献之前，请花点时间思考一下您为什么要这样做。如果您的唯一目标是在简历上添加“首次贡献”（或者您只是想快速获得一次成功），那么参加训练营或在线教程可能是更好的选择。

为开源项目做贡献需要时间和精力，但它也能帮助您成为更好的开发者并学习新技能。然而，重要的是要明白，这可能比参加培训课程更困难、更慢。也就是说，如果您愿意花时间把事情做好，为开源做贡献是值得的。

### 向后兼容性

<Warning>

除非是关键的安全修复，否则不允许对公共 API 进行破坏性更改。

有关主要版本发布的详细信息，请参阅我们的[版本控制策略](/oss/versioning)。

</Warning>

通过以下方式保持兼容性：

:::: details 稳定接口

<strong>始终保留</strong>：
- 函数签名和参数名称
- 类接口和方法名称
- 返回值结构和类型
- 公共 API 的导入路径

::::

:::: details 安全更改

<strong>可接受的修改</strong>：
- 添加新的可选参数

- 向类添加新方法
- 在不改变行为的情况下提高性能
- 添加新模块或函数

::::

:::: details 进行更改前

- <strong>这会破坏现有的用户代码吗？</strong>
- 检查您的目标是否是公开的
- 如果需要，它是否在 `__init__.py` 中导出？

- 测试中是否存在现有的使用模式？

::::

### 新功能

我们的目标是为新功能设置较高的门槛。通常，如果没有一个现有问题证明外部贡献者提出的新核心抽象存在迫切需求，我们不会接受。这也适用于基础设施和依赖项的更改。

一般来说，功能贡献要求包括：

<Steps>

<Step title="设计讨论">

创建一个问题来描述：

- 您要解决的问题
- 提议的 API 设计
- 预期的使用模式

</Step>

<Step title="实现">

- 遵循现有的代码模式
- 包含全面的测试和文档
- 考虑安全影响

</Step>

<Step title="集成考虑">

- 这与现有功能如何交互？
- 是否存在性能影响？
- 这会引入新的依赖项吗？

我们可能会拒绝可能导致安全漏洞或报告的功能。

</Step>

</Steps>

### 安全指南

<Warning>

安全至关重要。切勿引入漏洞或不安全的模式。

</Warning>

安全检查清单：

:::: details 输入验证

- 验证并清理所有用户输入
- 在模板和查询中正确转义数据
- 切勿对用户数据使用 `eval()`、`exec()` 或 `pickle`，因为这可能导致任意代码执行漏洞。

::::

:::: details 错误处理

- 使用特定的异常类型
- 不要在错误消息中暴露敏感信息
- 实现适当的资源清理

::::

:::: details 依赖项

- 避免添加硬依赖
- 保持可选依赖项最少
- 审查第三方包的安全问题

::::

---

## 开发环境

<Warning>

我们的 Python 项目使用 [`uv`](https://docs.astral.sh/uv/getting-started/installation/) 进行依赖管理。请确保您已安装最新版本。

</Warning>

在您查看了[贡献指南](#contribution-guidelines)之后，为您正在处理的包设置开发环境。

<Tabs>

<Tab title="LangChain" icon="link">

:::: details 核心抽象

对于 `langchain-core` 的更改：

```bash
cd libs/core
uv sync --all-groups
make test  # 确保在开始开发前测试通过
```

::::

:::: details 主包

对于 `langchain` 的更改：

```bash
cd libs/langchain
uv sync --all-groups
make test  # 确保在开始开发前测试通过
```

::::

:::: details 合作伙伴包

对于[合作伙伴集成](/oss/python/integrations/providers/overview)的更改：

```bash
cd libs/partners/langchain-{partner}
uv sync --all-groups
make test  # 确保在开始开发前测试通过
```

::::

:::: details 社区包

对于社区集成（位于[单独的仓库](https://github.com/langchain-ai/langchain-community)）的更改：

```bash
cd libs/community/langchain_community/path/to/integration
uv sync --all-groups
make test  # 确保在开始开发前测试通过
```

::::

</Tab>

<Tab title="LangGraph" icon="circle-nodes">

进行中 - 即将推出！在此期间，请遵循 LangChain 的说明。

</Tab>

</Tabs>

---

## 仓库结构

<Tabs>

<Tab title="LangChain" icon="link">

LangChain 组织为一个包含多个包的 monorepo：

:::: details 核心包

- <strong>[`langchain`](https://github.com/langchain-ai/langchain/tree/master/libs/langchain#readme)</strong>（位于 `libs/langchain/`）：包含链（chains）、代理（agents）和检索逻辑的主包。
- <strong>[`langchain-core`](https://github.com/langchain-ai/langchain/tree/master/libs/core#readme)</strong>（位于 `libs/core/`）：基础接口和核心抽象。

::::

:::: details 合作伙伴包

位于 `libs/partners/`，这些是针对特定集成的独立版本包。例如：
- <strong>[`langchain-openai`](https://github.com/langchain-ai/langchain/tree/master/libs/partners/openai#readme)</strong>：[OpenAI](/oss/python/integrations/providers/openai) 集成
- <strong>[`langchain-anthropic`](https://github.com/langchain-ai/langchain/tree/master/libs/partners/anthropic#readme)</strong>：[Anthropic](/oss/python/integrations/providers/anthropic) 集成
- <strong>[`langchain-google-genai`](https://github.com/langchain-ai/langchain-google/)</strong>：[Google Generative AI](/oss/python/integrations/chat/google_generative_ai) 集成

许多合作伙伴包位于外部仓库中。请查看[集成列表](/oss/python/integrations/providers/overview)了解详情。

::::

:::: details 支持包

- <strong>[`langchain-text-splitters`](https://github.com/langchain-ai/langchain/tree/master/libs/text-splitters#readme)</strong>：文本分割工具
- <strong>[`langchain-standard-tests`](https://github.com/langchain-ai/langchain/tree/master/libs/standard-tests#readme)</strong>：集成的标准测试套件
- <strong>[`langchain-cli`](https://github.com/langchain-ai/langchain/tree/master/libs/cli#readme)</strong>：命令行界面
- <strong>[`langchain-community`](https://github.com/langchain-ai/langchain-community)</strong>：社区维护的集成（位于单独的仓库）

::::

</Tab>

<Tab title="LangGraph" icon="circle-nodes">

进行中 - 即将推出！在此期间，请遵循 LangChain 的说明。

</Tab>

</Tabs>

---

## 开发工作流程

### 测试要求

<Info>

目录是相对于您正在处理的包而言的。

</Info>

每个代码变更都必须包含全面的测试。

#### 单元测试

**位置**：`tests/unit_tests/`

**要求**：
- 不允许网络调用
- 测试所有代码路径，包括边界情况
- 使用模拟（mocks）处理外部依赖

```bash
make test

# 或直接运行：
uv run --group test pytest tests/unit_tests
```

:::js

```bash
# 运行整个测试套件
pn
