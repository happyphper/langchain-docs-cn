---
title: 快速入门
description: 从模板构建智能体（agent）
---
在本快速入门中，您将使用预定义的**邮件助手**[模板](/langsmith/agent-builder-templates)，该模板将为您整理和管理收件箱。
- 选择其他模板。

<Callout icon="comment" color="#8B5CF6" iconType="regular">

您将通过聊天与您的智能体（agent）互动，就像给一位乐于助人的助手发短信一样。

</Callout>

## 开始之前

您需要：
- 一个 LangSmith 账户（[在此注册](https://smith.langchain.com/agents?skipOnboarding=true)）。
- 一个 Gmail 账户。
- 一个 Google 日历。
- 一个 OpenAI 或 Anthropic 的 API 密钥（第 1 步将向您展示如何获取）。

## 1. 获取您的模型 API 密钥

您的智能体需要一个 API 密钥来连接 AI 模型。AI 模型是让您的智能体能够理解和响应您请求的关键。

<Tabs>

<Tab title="OpenAI (ChatGPT)">

1. 访问 [platform.openai.com/api-keys](https://platform.openai.com/api-keys)。
1. 点击 **Create new secret key**。
1. 为其命名，例如 "Agent Builder"。
1. 复制密钥（以 `sk-` 开头）。
1. 将其保存在安全的地方，您将在第 2 步中用到它。

</Tab>

<Tab title="Anthropic (Claude)">

1. 访问 [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)。
2. 点击 **Create Key**。
3. 为其命名，例如 "Agent Builder"。
4. 复制密钥（以 `sk-ant-` 开头）。
5. 将其保存在安全的地方，您将在第 2 步中用到它。

</Tab>

</Tabs>

<Warning>

两种服务均按使用量收费。

</Warning>

## 2. 将您的 API 密钥添加到 LangSmith

现在，您需要将 API 密钥添加到 LangSmith，以便您的智能体可以使用它：

<Steps>

<Step title="打开设置">

1. 访问 [smith.langchain.com](https://smith.langchain.com)。
2. 点击左下角的 <Icon icon="gear" /> <strong>Settings</strong> 图标。

</Step>

<Step title="转到密钥">

点击顶部的 <strong>Secrets</strong> 选项卡。

</Step>

<Step title="添加您的密钥">

1. 点击 <strong>Add secret</strong>。
2. 对于 <strong>Key</strong>，输入：
   - `OPENAI_API_KEY`（如果使用 OpenAI）
   - `ANTHROPIC_API_KEY`（如果使用 Anthropic）
3. 对于 <strong>Value</strong>，粘贴您在第 1 步复制的 API 密钥。
4. 点击 <strong>Save secret</strong>。

</Step>

</Steps>

<Callout type="success" icon="check" color="#10B981" iconType="regular">

您的智能体现在已能访问 AI 模型来理解和响应您的请求。接下来，您将创建您的智能体。

</Callout>

## 3. 创建您的智能体

<Steps>

<Step title="导航到 Agent Builder">

1. 在 [LangSmith UI](https://smith.langchain.com) 中，点击左侧导航栏顶部的 <Icon icon="mouse-pointer"/> <strong>Switch to Agent Builder</strong>。

</Step>

<Step title="选择一个模板">

1. 在左侧导航栏中选择 <strong>Templates</strong>。
1. 选择 <strong>Email Assistant</strong> 模板。
1. 点击 <strong>Use this template</strong>。

<Tip>

如果您不想从模板开始，还有另外两个选项。在 <strong>+ New Agent</strong> 页面：
- <strong>Chat</strong>：使用聊天界面描述您的智能体，它将逐步帮助您创建。
- <strong>Manually</strong>：选择 <strong>Create manually instead</strong>，在配置页面上无需任何预填充的响应来构建您的智能体。

</Tip>

</Step>

<Step title="授权账户">

您的智能体会要求您连接您的 Google 账户：

1. 点击 <strong>Connect</strong>。
2. 使用您的 Google 账户登录。
3. 查看权限并点击 <strong>Allow</strong>。
4. 您将被重定向回 LangSmith，您的智能体将在那里被创建。

</Step>

</Steps>

<Info>

您的智能体仅在处理您分配的任务时访问您的账户。您可以随时在 Google 账户设置中撤销访问权限。

</Info>

## 4. 查看智能体模板

<Steps>

<Step title="查看并自定义模板">

此时，您可以查看邮件助手的模板指令。如果需要，您可以对指令进行调整。

如果您进行了任何更改，请点击 <strong>Save changes</strong>。

</Step>

<Step title="开始测试聊天">

1. 在配置页面的右侧面板中，选择 <strong>测试聊天</strong> 标签页。
2. 在聊天界面中试用电子邮件助手，例如：

> _为我收到的、需要我进行某种审核的邮件应用“审核”标签_

</Step>

<Step title="智能体开始工作">

您的智能体将开始工作，并为每个需要您批准的步骤提供一个 <strong>继续</strong> 选项。

<img src="/langsmith/images/agent-builder-response.png" alt="测试聊天输出视图，其中包含对 Gmail 工具的批准响应。" />

<img src="/langsmith/images/agent-builder-response-dark.png" alt="测试聊天输出视图，其中包含对 Gmail 工具的批准响应。" />

3. 在测试智能体时，您可以编辑指令，或添加您可能需要的工具。当您对结果满意时，点击 <strong>保存更改</strong>。

</Step>

</Steps>

## 编辑您的智能体

您可能希望更新智能体的指令或包含更多工具。您可以直接与您的智能体聊天以请求更新，或者您可以：

1. 在左侧导航栏的 **我的智能体** 中，选择您要编辑的智能体。
1. 选择 <Icon icon="pencil"/> **编辑智能体**。

在智能体的编辑页面，您可以：

- 使用 **+ 添加工具** 来连接更多应用程序和服务，如 Slack、GitHub 或 Linear。
- 使用 **+ 添加子智能体** 来添加更多助手，将复杂任务分解为专门的子任务。
- 请求在现有工具上暂停以进行审核。
- 修改现有工具。
- 探索可以触发您的智能体开始任务的功能。

## 后续步骤

现在您已经创建了第一个智能体，以下是接下来可以探索的内容：

<CardGroup :cols="2">

<Card title="尝试更多模板" icon="shapes" href="/langsmith/agent-builder-templates">

探索针对常见任务的预构建智能体

</Card>

<Card title="添加自动化" icon="bolt" href="/langsmith/agent-builder-essentials#triggers">

通过触发器（Slack、电子邮件、计划）自动运行您的智能体

</Card>

<Card title="连接更多工具" icon="puzzle-piece" href="/langsmith/agent-builder-tools">

添加 Slack、GitHub、Linear 等

</Card>

<Card title="构建复杂智能体" icon="sitemap" href="/langsmith/agent-builder-essentials#sub-agents">

使用子智能体来分解大型任务

</Card>

</CardGroup>

