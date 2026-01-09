---
title: 提示工程概念
sidebarTitle: Concepts
---
传统软件应用通过编写代码构建，而 AI 应用通常从提示（prompt）中衍生其逻辑。

本指南将介绍 LangSmith 中提示工程的关键概念。

## 为什么需要提示工程？

提示为模型设定了场景，就像即兴表演中观众引导演员的下一个表演一样——它指导模型的行为，而不改变其底层能力。正如告诉演员“扮演海盗”决定了他们的表演方式，提示提供了指令、示例和上下文，塑造了模型的响应方式。

提示工程之所以重要，是因为它允许你改变模型的行为方式。虽然还有其他改变模型行为的方法（如微调），但提示工程通常是入门最简单且投资回报率最高的方法。

我们经常发现提示工程是多学科交叉的。有时最好的提示工程师并非构建应用的软件工程师，而是产品经理或其他领域专家。拥有合适的工具和基础设施来支持这种跨学科构建非常重要。

## 提示与提示模板

尽管我们经常互换使用这些术语，但理解“提示”和“提示模板”之间的区别很重要。

**提示**指的是传递给语言模型的消息。

**提示模板**指的是一种格式化信息的方式，以使提示包含你想要的信息。提示模板可以包含用于少样本示例、外部上下文或提示中所需的任何其他外部数据的变量。

![提示与提示模板](/langsmith/images/prompt-vs-prompt-template.png)

## LangSmith 中的提示

你可以在 LangSmith 中存储和版本化提示模板。理解提示模板有几个关键方面。

### 聊天式与补全式

有两种不同类型的提示：`chat` 风格提示和 `completion` 风格提示。

**聊天式提示**是一个**消息列表**。这是当今大多数模型 API 支持的提示风格，因此通常应优先使用。

**补全式提示**只是一个字符串。这是一种较旧的提示风格，主要因历史遗留原因而存在。

### F-string 与 Mustache

你可以使用 [f-string](https://realpython.com/python-f-strings/) 或 [mustache](https://mustache.github.io/mustache.5.html) 格式来格式化带有输入变量的提示。以下是一个使用 f-string 格式的提示示例：

```python
Hello, {name}!
```

这是一个使用 mustache 格式的示例：

```python
Hello, {{name}}!
```

要添加一个带条件的 mustache 提示：

```python
{{#is_logged_in}}  Welcome back, {{name}}!{{else}}  Please log in.{{/is_logged_in}}
```

* 游乐场 UI 会识别 `is_logged_in` 变量，但任何嵌套变量你需要自己指定。将以下内容粘贴到输入中以确保上述条件提示正常工作：

```json
{  "name": "Alice"}
```

<Check>

LangSmith 游乐场默认使用 `f-string` 作为模板格式，但你可以在提示设置/模板格式部分切换到 `mustache` 格式。`mustache` 在条件变量、循环和嵌套键方面提供了更大的灵活性。对于条件变量，你需要在“输入”部分手动添加 JSON 变量。阅读[文档](https://mustache.github.io/mustache.5.html)

</Check>

### 工具

工具是 LLM 用来与外部世界交互的接口。工具由名称、描述和用于调用该工具的参数 JSON 模式组成。

### 结构化输出

结构化输出是大多数先进 LLM 的一项功能，即它们不是输出原始文本，而是遵循指定的模式。这可能在底层使用[工具](#tools)，也可能不使用。

<Check>

结构化输出与工具类似，但在几个关键方面有所不同。使用工具时，LLM 选择调用哪个工具（或可能选择不调用任何工具）；使用结构化输出时，LLM **总是**以这种格式响应。使用工具时，LLM 可能选择**多个**工具；使用结构化输出时，只生成一个响应。

</Check>

### 模型

你可以选择将模型配置与提示模板一起存储。这包括模型名称和任何其他参数（温度等）。

## 提示版本控制

版本控制是在不同提示上进行迭代和协作的关键部分。

### 提交

对提示的每次保存更新都会创建一个具有唯一提交哈希的新提交。这允许你：

- 查看提示的完整更改历史。
- 查看早期版本。
- 如果需要，恢复到之前的状态。
- 在代码中使用提交哈希引用特定版本（例如，`client.pull_prompt("prompt_name:commit_hash")`）。

在 UI 中，你可以在**提交**选项卡的右上角切换**显示差异**来比较提交与其先前版本。

![提示的提交哈希列表及一个提交的差异对比](/langsmith/images/commit-diff.png)

### 标签

提交标签是指向提示历史中特定提交的人类可读标签。与提交哈希不同，标签可以移动以指向不同的提交，从而允许你更新代码引用的版本而无需更改代码本身。

提交标签的用例包括：

- **环境特定标签**：为 `production` 或 `staging` 环境标记提交，这允许你在不同版本之间切换而无需更改代码。
- **版本控制**：标记提示的稳定版本，例如 `v1`、`v2`，这允许你在代码中引用特定版本并跟踪随时间的变化。
- **协作**：标记准备就绪以供审查的版本，这使你能够与协作者共享特定版本并获得反馈。

<Note>

<strong>不要与资源标签混淆</strong>：提交标签引用特定的提示版本。[资源标签](/langsmith/set-up-resource-tags)是用于组织工作空间资源的键值对。

</Note>

有关创建和管理提交标签的详细信息，请参阅[管理提示](/langsmith/manage-prompts#commit-tags)。

## 提示游乐场

提示游乐场使迭代和测试提示的过程变得无缝。你可以从侧边栏或直接从已保存的提示进入游乐场。

在游乐场中，你可以：

* 更改使用的模型
* 更改使用的提示模板
* 更改输出模式
* 更改可用的工具
* 输入要通过提示模板运行的输入变量
* 通过模型运行提示
* 观察输出

<Callout type="info" icon="bird">

在游乐场中使用 <strong>[Polly](/langsmith/polly)</strong>，借助 AI 辅助优化提示、生成工具和创建输出模式。

</Callout>

## 测试多个提示

你可以向游乐场添加更多提示，以便轻松比较输出并决定哪个版本更好：

![向游乐场添加提示](/langsmith/images/add-prompt-to-playground.gif)

## 在数据集上测试

要在数据集上测试，只需从右上角选择数据集并按开始。你可以修改结果是否流式返回以及测试中的重复次数。

![在游乐场的数据集上测试](/langsmith/images/test-over-dataset-in-playground.gif)

你可以点击“查看实验”按钮，深入了解测试结果。

## 视频指南
<iframe
  className="w-full aspect-video rounded-xl"
  src="https://www.youtube.com/embed/h4f6bIWGkog?si=IVJFfhldC7M3HL4G"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
