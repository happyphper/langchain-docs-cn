---
title: 创建一个提示
sidebarTitle: Create a prompt
---
在左侧边栏或应用主页中导航至。

![空白的 Playground](/langsmith/images/empty-playground.png)

## 编写提示词

左侧是提示词的可编辑视图。

提示词由多条消息组成，每条消息都有一个“角色”——包括 `system`、`human` 和 `ai`。

### 模板格式

默认的模板格式是 `f-string`，但你可以通过点击模型旁边的设置图标 -> 提示格式 -> 模板格式，将提示词模板格式更改为 `mustache`。了解更多关于模板格式的信息[请点击这里](/langsmith/prompt-engineering-concepts#f-string-vs-mustache)。
![模板格式](/langsmith/images/template-format.png)

### 添加模板变量

提示词的强大之处在于能够在提示词中使用变量。你可以使用变量为提示词添加动态内容。可以通过以下两种方式之一添加模板变量：

1.  在提示词中添加 <code v-pre>{{variable_name}}</code>（对于 `f-string` 格式，每边使用一个花括号；对于 `mustache` 格式，每边使用两个花括号）。![带变量的提示词](/langsmith/images/prompt-with-variable.png)

2.  高亮你想要模板化的文本，然后点击出现的工具提示按钮。输入变量名称并进行转换。![转换为变量](/langsmith/images/convert-to-variable.gif)

当我们添加一个变量时，会看到一个用于为提示词变量输入示例值的地方。填入这些值以测试提示词。![提示词输入](/langsmith/images/prompt-inputs.png)

### 结构化输出

为提示词添加输出模式（schema）将获得结构化的输出格式。了解更多关于结构化输出的信息[请点击这里](/langsmith/prompt-engineering-concepts#structured-output)。![结构化输出](/langsmith/images/structured-output.png)

### 工具

你也可以通过点击提示词编辑器底部的 `+ Tool` 按钮来添加工具。关于如何使用工具的更多信息，请参见[这里](/langsmith/use-tools)。

<Callout type="info" icon="bird">

在 Playground 中使用 <strong>[Polly](/langsmith/polly)</strong>，借助 AI 辅助生成工具、创建输出模式并优化你的提示词。

</Callout>

## 运行提示词

点击“开始”来运行提示词。

![创建提示词运行](/langsmith/images/create-a-prompt-run.png)

## 保存提示词

要保存你的提示词，请点击“保存”按钮，为提示词命名，并决定是设为“私有”还是“公开”。私有提示词仅对你的工作区可见，而公开提示词则对任何人可见。

你在 Playground 设置中选择的模型和配置将与提示词一起保存。当你重新打开提示词时，模型和配置将自动从保存的版本加载。![保存提示词](/langsmith/images/save-prompt.png)

<Check>

首次创建公开提示词时，系统会要求你设置一个 LangChain Hub 句柄。你所有的公开提示词都将链接到此句柄。在共享工作区中，此句柄将为整个工作区设置。

</Check>

![公开句柄](/langsmith/images/public-handle.png)

## 查看你的提示词

你已经创建了你的第一个提示词！在提示词标签页中查看你的提示词表格。

![提示词表格](/langsmith/images/prompt-table.png)

## 添加元数据

要为提示词添加元数据，请点击该提示词，然后点击名称旁边的“编辑”铅笔图标。这将带你到可以添加关于提示词的附加信息的地方，包括描述、README 和使用案例。对于公开提示词，这些信息将对在 LangChain Hub 中查看你提示词的任何人可见。

![铅笔图标](/langsmith/images/pencil.png) ![编辑提示词](/langsmith/images/edit-prompt.png)

# 后续步骤

现在你已经创建了一个提示词，可以在你的应用程序代码中使用它。请参阅[如何以编程方式拉取提示词](/langsmith/manage-prompts-programmatically#pull-a-prompt)。
