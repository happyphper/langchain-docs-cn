---
title: 贡献文档
sidebarTitle: Documentation
---
无障碍文档是 LangChain 的重要组成部分。我们欢迎新功能和[集成](/oss/contributing/publish-langchain#adding-documentation)的文档，也欢迎社区对现有文档的改进。

<Note>

这些是我们开源项目的贡献指南，但它们也适用于 [LangSmith 文档](/langsmith/home)。

</Note>

## 贡献

### 快速编辑

对于快速更改，例如修复拼写错误或更改链接，您可以直接在 GitHub 上编辑，无需设置本地开发环境：

<Info>

<strong>前提条件：</strong>
- 一个 [GitHub](https://github.com/) 账户
- 对用于贡献的 [fork-and-pull 工作流](https://graphite.dev/guides/understanding-git-fork-pull-request-workflow)有基本了解

</Info>

1.  在您要编辑的页面底部，点击 **Edit this page on GitHub** 链接。
1.  GitHub 会提示您将仓库 fork 到您的账户。确保 fork 到您的 <Tooltip tip="如果您克隆到组织，维护者将无法进行编辑，这可能会延迟接受。">个人账户</Tooltip>。
1.  直接在 GitHub 的网页编辑器中修改。
1.  点击 **Commit changes...** 并为您的提交提供一个描述性标题，例如 `fix(docs): summary of change`。如果适用，请添加[扩展描述](https://www.gitkraken.com/learn/git/best-practices/git-commit-message#git-commit-message-structure)。
1.  GitHub 将重定向您以创建拉取请求（pull request）。给它一个标题（通常与提交相同）并遵循 PR 模板清单。

<Note>

文档 PR 通常会在几天内得到审核。请关注您的 PR 以处理维护者的任何反馈。

除非您有新的信息需要提供，否则不要催促 PR——维护者会在他们时间允许的情况下处理。

</Note>

### 较大的编辑和新增内容

对于较大的更改、新增内容或持续贡献，需要在您的机器上设置本地开发环境。我们的文档构建管道提供本地预览，这对于确保您的更改在提交前按预期显示非常重要。

#### 设置本地环境

在您处理此项目之前，请确保已安装以下内容：

**必需：**

- `python >= 3.13, < 4.0`
- [**`uv`**](https://docs.astral.sh/uv/) - Python 包管理器（用于依赖管理）
- [**Node.js**](https://nodejs.org/en) 和 [**`npm`**](https://www.npmjs.com/) - 用于 Mintlify CLI 和参考文档构建
- [**Make**](https://www.gnu.org/software/make/) - 用于运行构建命令
- [**Git**](https://git-scm.com/) - 用于版本控制

**可选但推荐：**

- **[`markdownlint-cli`](https://github.com/igorshubovych/markdownlint-cli)** - 用于对 markdown 文件进行代码检查

```bash
npm install -g markdownlint-cli
```
- **[`pnpm`](https://pnpm.io/)** - 仅当您处理参考文档时需要

```bash
npm install -g pnpm@10.14.0
```

- **[Mintlify MDX VSCode 扩展](https://www.mintlify.com/blog/mdx-vscode-extension)**

**设置步骤：**

1.  克隆 [`langchain-ai/docs`](https://github.com/langchain-ai/docs) 仓库。按照 [`IDE_SETUP.md`](https://github.com/langchain-ai/docs/blob/main/IDE_SETUP.md) 中概述的步骤操作。

2.  安装依赖项：

```bash
make install
```

此命令将：
    - 使用 `uv sync --all-groups` 安装 Python 依赖项
    - 通过 npm 全局安装 Mintlify CLI

3.  验证您的设置：

```bash
make build
```

这应该能无错误地构建文档。

安装后，您将可以使用 `docs` 命令：

```bash
docs --help
```

常用命令：

*   `docs dev` - 启动开发模式，支持文件监视和热重载
*   `docs build` - 构建文档

更多详情请参见[可用命令](#available-commands)。

#### 编辑文档

<Note>

<strong>仅编辑 `src/` 目录中的文件</strong> – `build/` 目录是自动生成的。

</Note>

1.  确保您的[环境已设置好](#set-up-local-environment)，并且您已按照 [`IDE_SETUP.md`](https://github.com/langchain-ai/docs/blob/main/IDE_SETUP.md) 中的步骤配置了您的 IDE/编辑器以自动应用正确的设置。

1.  编辑 `src/` 中的文件
    *   对 markdown 文件进行更改，构建系统将自动检测更改并重建受影响的文件。
    *   如果 OSS 内容在 Python 和 JavaScript/TypeScript 之间有所不同，请在[同一文件中添加两种语言的内容](#co-locate-python-and-javascripttypescript-oss-content)。否则，两种语言的内容将完全相同。
    *   使用 [Mintlify 语法](https://mintlify.com/docs)进行格式化。

1.  启动开发模式以在本地预览更改：

```bash
docs dev
```

这将在 `http://localhost:3000` 启动一个支持热重载的开发服务器。

1.  迭代

    *   继续编辑并立即看到更改反映出来。
    *   开发服务器仅重建已更改的文件，以获得更快的反馈。

1.  运行[质量检查](#run-quality-checks)以确保您的更改有效。
1.  获得相关审核者的批准。

LangChain 团队成员可以[生成可共享的预览构建](#create-a-sharable-preview-build)

1.  [发布到生产环境](#publish-to-prod)（仅限团队成员）。

#### 创建可共享的预览构建

<Note>

只有 LangChain 团队成员可以创建可共享的预览构建。

</Note>

:::: details 说明

预览对于与他人共享进行中的工作更改非常有用。

当您创建或更新 PR 时，会自动为您生成一个[预览分支/ID](https://github.com/langchain-ai/docs/actions/workflows/create-preview-branch.yml)。PR 上会留下一条包含该 ID 的评论，然后您可以使用该 ID 生成预览。（如果需要，您也可以手动运行此工作流。）

1.  从评论中复制预览分支的 ID。
1.  在 [Mintlify 仪表板](https://dashboard.mintlify.com/langchain-5e9cc07a/langchain-5e9cc07a?section=previews)中，点击 <strong>Create preview deployment</strong>。
1.  输入预览分支的 ID。
1.  点击 <strong>Create deployment</strong>。
<strong>手动更新</strong>将显示在 <strong>Previews</strong> 表中。
1.  选择预览并点击 <strong>Visit</strong> 以查看预览构建。

要使用最新更改重新部署预览构建，请在 Mintlify 仪表板上点击 <strong>Redeploy</strong>。

::::

#### 运行质量检查

在提交更改之前，请确保您的代码通过格式化和代码检查：

```bash
# 检查损坏的链接
make mint-broken-links

# 自动格式化代码
make format

# 检查代码检查问题
make lint

# 修复 markdown 问题
make lint_md_fix

# 运行测试以确保您的更改不会破坏现有功能
make test
```

更多详情，请参阅 `README` 中的[可用命令](https://github.com/langchain-ai/docs?tab=readme-ov-file#available-commands)部分。

<Important>

所有拉取请求都会由 CI/CD 自动检查。将强制执行相同的代码检查和格式化标准，如果这些检查失败，PR 将无法合并。

</Important>

#### 发布到生产环境

<Note>

只有内部团队成员可以发布到生产环境。

</Note>

:::: details 说明

一旦您的分支被合并到 `main`，您需要将更改推送到 `prod`，以便它们呈现在实时文档站点上。使用 [Publish documentation GH action](https://github.com/langchain-ai/docs/actions/workflows/publish.yml)：

1.  转到 [Publish documentation](https://github.com/langchain-ai/docs/actions/workflows/publish.yml)。
2.  点击 <strong>Run workflow</strong> 按钮。
3.  选择要部署的 <strong>main</strong> 分支。
4.  点击 <strong>Run workflow</strong>。

::::

## 文档类型

所有文档都属于以下四类之一：

<CardGroup :cols="2">

<Card title="操作指南" icon="wrench" href="#how-to-guides">

面向知道要完成什么任务的用户的任务导向说明。

</Card>

<Card title="概念指南" icon="lightbulb" href="#conceptual-guides">

提供更深层次理解和见解的解释。

</Card>

<Card title="参考" icon="book" href="#reference">

API 和实现细节的技术描述。

</Card>

<Card title="教程" icon="graduation-cap" href="#tutorials">

引导用户通过实践活动来建立理解的课程。

</Card>

</CardGroup>

<Note>

在适用的情况下，所有文档都必须同时包含 Python 和 JavaScript/TypeScript 内容。更多详情，请参见[共置 Python 和 JavaScript/TypeScript 内容](#co-locate-python-and-javascripttypescript-content)部分。

</Note>

### 操作指南

操作指南是面向知道要完成什么任务的用户的任务导向说明。操作指南的示例位于 [LangChain](/oss/langchain/overview) 和 [LangGraph](/oss/langgraph/overview) 选项卡上。

:::: details 特点

- <strong>任务导向</strong>：专注于特定任务或问题
- <strong>分步说明</strong>：将任务分解为更小的步骤
- <strong>实践性强</strong>：提供具体示例和代码片段

::::

:::: details 技巧

- 关注 <strong>如何做</strong> 而非 <strong>为什么</strong>
- 使用具体示例和代码片段
- 将任务分解为更小的步骤
- 链接到相关的概念指南和参考

::::

:::: details 示例

- [消息](/oss/langchain/messages)
- [工具](/oss/langchain/tools)
- [流式处理](/oss/langgraph/streaming)

::::

### 概念指南

概念指南抽象地涵盖核心概念，提供深入理解。

:::: details 特点

- <strong>理解导向</strong>：解释事物为何如此运作
- <strong>视角广阔</strong>：比其他类型更高、更广的视角
- <strong>设计导向</strong>：解释决策和权衡
- <strong>上下文丰富</strong>：使用类比和比较

::::

:::: details 技巧

- 关注 <strong>"为什么"</strong> 而非 "如何做"
- 提供不一定为使用功能所必需的补充信息
- 可以使用类比并参考替代方案
- 避免混入过多的参考内容
- 链接到相关的教程和操作指南

::::

:::: details 示例

- [记忆](/oss/concepts/memory)
- [上下文](/oss/concepts/context)
- [图 API](/oss/langgraph/graph-api)
- [函数式 API](/oss/langgraph/functional-api)

::::

### 参考

参考文档包含详细的、低层级的信息，准确描述存在哪些功能以及如何使用它们。

<CardGroup :cols="2">

<Card title="Python 参考" href="https://reference.langchain.com/python/" icon="python" arrow />
<Card title="JavaScript/TypeScript 参考" href="https://reference.langchain.com/javascript/" icon="js" arrow />

</CardGroup>

一个好的参考应该：
- 描述存在什么（所有参数、选项、返回值）
- 全面且结构清晰，便于查找
- 作为技术细节的权威来源

:::: details 贡献参考文档

请参阅 [JavaScript/TypeScript 参考文档](https://github.com/langchain-ai/docs/blob/main/reference/javascript/README.md)的贡献指南。

::::

:::: details LangChain 参考最佳实践

- <strong>保持一致</strong>；遵循特定于提供商的文档的现有模式
- 包括基本用法（代码片段）和常见的边缘情况/失败模式
- 注意功能何时需要特定版本

::::

:::: details 何时创建新的参考文档

- 新的集成或提供商需要专门的参考页面
- 复杂的配置选项需要详细解释
- API 变更引入了新参数或行为
- 社区经常询问有关特定功能的问题

::::

### 教程

教程是较长篇幅的分步指南，它建立在自身基础上，引导用户完成特定的实践活动以建立理解。教程通常位于 [Learn](/oss/learn) 选项卡上。

<Note>

我们通常不会在没有迫切需求的情况下合并来自外部贡献者的新教程。如果您认为某个主题在文档中缺失或覆盖不足，请[创建一个新 issue](https://github.com/langchain-ai/docs/issues)。

</Note>

:::: details 特点

- <strong>实践性强</strong>：专注于通过实践活动建立理解。
- <strong>分步说明</strong>：将活动分解为更小的步骤。
- <strong>动手操作</strong>：提供连续的、可运行的代码片段。
- <strong>补充性</strong>：提供不一定为使用功能所必需的额外上下文和信息。

::::

:::: details 技巧

- 如果用户按顺序遵循步骤，代码片段应该是连续且可运行的。
- 为活动提供一些上下文，但链接到相关的概念指南和参考以获取更详细的信息。

::::

:::: details 示例

- [语义搜索](/oss/langchain/knowledge-base)
- [RAG 代理](/oss/langchain/rag)

::::

## 编写标准

<Note>

参考文档有不同的标准 - 详情请参阅[参考文档贡献指南](https://github.com/langchain-ai/docs/blob/main/reference/javascript/README.md)。

</Note>

### Mintlify 组件

使用 [Mintlify 组件](https://mintlify.com/docs/text) 来增强可读性：

<Tabs>

<Tab title="标注框">

- `<Note>` 用于有用的补充信息
- `<Warning>` 用于重要的警告和破坏性变更
- `<Tip>` 用于最佳实践和建议
- `<Info>` 用于中立的上下文信息
- `<Check>` 用于成功确认

</Tab>

<Tab title="结构">

- `<Steps>` 用于概述顺序过程。<strong>不</strong>适用于长步骤列表或教程。
- `<Tabs>` 用于特定平台的内容。
- `` 和 `` 用于默认可以折叠的锦上添花的信息（例如，完整的代码示例）。
- `<CardGroup>` 和 `<Card>` 用于突出显示内容。

</Tab>

<Tab title="代码">

- `<CodeGroup>` 用于多语言示例。
- 始终在代码块上指定语言标签（例如，` ```python`, ` ```javascript`）。
- 代码块的标题（例如 `Success`, `Error Response`）

</Tab>

</Tabs>

### 页面结构

每个文档页面必须以 YAML frontmatter 开头：

```yaml
---
title: "清晰、具体的标题"
sidebarTitle: "侧边栏的简短标题（可选）"
---
```

### 共置 Python 和 JavaScript/TypeScript 内容

所有文档在可能的情况下都必须用 Python 和 JavaScript/TypeScript 两种语言编写。为此，我们使用自定义的内联语法来区分应出现在一种或两种语言中的部分：

```mdx
\:::python
Python 特定内容。在实际文档中，`python` 前面的反斜杠被省略。
\:::

\:::js
JavaScript/TypeScript 特定内容。在实际文档中，`js` 前面的反斜杠被省略。
\:::

两种语言的通用内容（未包装）
```

这将生成两个输出（每种语言一个），分别位于 `/oss/python/concepts/foo.mdx` 和 `/oss/javascript/concepts/foo.mdx`。每个输出的页面都需要添加到 `/src/docs.json` 文件中才能包含在导航中。

<Note>

我们不希望缺乏对等性阻碍贡献。如果某个功能仅在一个语言中可用，那么在该语言赶上之前，仅在该语言中提供文档是可以的。在这种情况下，请包含一个说明，指出该功能在另一种语言中尚不可用。

如果您需要帮助在 Python 和 JavaScript/TypeScript 之间翻译内容，请在[社区 Slack](https://www.langchain.com/join-community) 中提问或在您的 PR 中标记维护者。

</Note>

## 质量标准

### 通用指南

:::: details 避免重复

多个页面覆盖相同的材料难以维护并导致混淆。每个概念或功能应该只有一个规范页面。链接到其他指南，而不是重新解释。

::::

:::: details 频繁链接

文档部分不是孤立存在的。频繁链接到其他部分，以便用户了解不熟悉的主题。这包括链接到 API 参考和概念部分。

::::

:::: details 简洁明了

采取少即是多的方法。如果存在另一个解释良好的部分，请链接到它而不是重新解释，除非您的内容提供了新的角度。

::::

### 无障碍要求

确保文档对所有用户都是可访问的：

- 使用标题和列表构建内容，便于扫描
- 使用具体、
