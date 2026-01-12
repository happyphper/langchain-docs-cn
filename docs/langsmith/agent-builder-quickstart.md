---
title: 从模板构建智能体 (Build an agent from a template)
sidebarTitle: 快速入门 (Quickstart)
---

循序渐进地创建您的第一个 AI 智能体（agent）。无需编程。在本快速入门中，您将使用预定义的 **邮件助手 (Email Assistant)** [模板](/langsmith/agent-builder-templates)，它可以为您组织和管理收件箱。

您可以跟随本示例进行操作，也可以：

- 根据您自己的智能体需求自定义指令和工具。
- 选择不同的模板。

<Callout icon="comment" color="#8B5CF6" iconType="regular">

您将通过聊天与智能体互动，就像给乐于助人的助手发短信一样。

</Callout>

## 在您开始之前 (Before you start)

您需要：
- 一个 LangSmith 账号 ([在此注册](https://smith.langchain.com))。
- 一个 Gmail 账号。
- 一个 Google 日历。
- 一个 OpenAI 或 Anthropic 的 API 密钥（步骤 1 将向您展示如何获取）。

## 1. 获取您的 API 密钥 (Get your API key)

您的智能体需要一个 API 密钥来连接到 AI 模型。AI 模型是让您的智能体理解并响应您的请求的核心。

<Tabs>

<Tab title="OpenAI (ChatGPT)">

1. 前往 [platform.openai.com/api-keys](https://platform.openai.com/api-keys)。
1. 点击 **Create new secret key**。
1. 给它起个名字，比如 "Agent Builder"。
1. 复制密钥（以 `sk-` 开头）。
1. 将其保存到安全的地方，您在步骤 2 中会用到它。

</Tab>

<Tab title="Anthropic (Claude)">

1. 前往 [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)。
2. 点击 **Create Key**。
3. 给它起个名字，比如 "Agent Builder"。
4. 复制密钥（以 `sk-ant-` 开头）。
5. 将其保存到安全的地方，您在步骤 2 中会用到它。

</Tab>

</Tabs>

<Info>

<strong>费用 (Cost):</strong> 两个服务都根据使用量收费。

</Info>

## 2. 将您的 API 密钥添加到 LangSmith (Add your API key to LangSmith)

现在，您将 API 密钥添加到 LangSmith，以便您的智能体可以使用它：

<Steps>

<Step title="打开设置 (Open Settings)">

1. 前往 [smith.langchain.com](https://smith.langchain.com)。
2. 点击左下角的 <Icon icon="gear" /> <strong>Settings</strong> 图标。

</Step>

<Step title="进入机密管理 (Go to Secrets)">

点击顶部的 <strong>Secrets</strong> 选项卡。

</Step>

<Step title="添加您的密钥 (Add your key)">

1. 点击 <strong>Add secret</strong>。
2. 对于 <strong>Key</strong>，输入：
   - `OPENAI_API_KEY` (如果使用 OpenAI)
   - `ANTHROPIC_API_KEY` (如果使用 Anthropic)
3. 对于 <strong>Value</strong>，粘贴您在步骤 1 中复制的 API 密钥。
4. 点击 <strong>Save secret</strong>。

</Step>

</Steps>

<Callout type="success" icon="check" color="#10B981" iconType="regular">

您的智能体现已获得 AI 模型的访问权限，可以理解并响应您的请求。接下来，您将创建您的智能体。

</Callout>

## 3. 创建您的智能体 (Create your agent)

<Steps>

<Step title="导航到智能体构建器 (Navigate to Agent Builder)">

1. 在 [LangSmith UI](https://smith.langchain.com) 中，点击左侧导航栏顶部的 <Icon icon="mouse-pointer"/> <strong>Switch to Agent Builder</strong>。

</Step>

<Step title="选择模板 (Choose a template)">

1. 在左侧导航栏中选择 <strong>Templates</strong>。
1. 选择 <strong>Email Assistant</strong> 模板。
1. 点击 <strong>Use this template</strong>。

<Tip>

如果您不想从模板开始，还有另外两个选择。在 <strong>+ New Agent</strong> 页面：
- <strong>聊天 (Chat)</strong>：使用聊天界面描述您的智能体，它将帮助您逐步创建。
- <strong>手动 (Manually)</strong>：选择 <strong>Create manually instead</strong>，在没有预填响应的情况下从头构建您的智能体。

</Tip>

</Step>

<Step title="授权账号 (Authorize accounts)">

您的智能体会要求您连接您的 Google 账号：

1. 点击 <strong>Connect</strong>。
2. 使用您的 Google 账号登录。
3. 查看权限并点击 <strong>Allow</strong>。
4. 您将被重定向回 LangSmith，您的智能体将在那里创建。

</Step>

</Steps>

<Info>

您的智能体仅在执行您给它的任务时才会访问您的账号。您可以随时在 Google 账号设置中撤销访问权限。

</Info>

## 4. 查看智能体模板 (View the agent template)

<Steps>

<Step title="查看并自定义模板 (View and customize the template)">

此时，您可以查看邮件助手的模板指令。如果需要，您可以对指令进行调整。

如果您进行了任何更改，请点击 <strong>Save changes</strong>。

</Step>

<Step title="开始测试聊天 (Start a test chat)">

1. 在配置页面的右侧面板中，选择 <strong>Test Chat</strong> 选项卡。
2. 在聊天界面中尝试使用邮件助手，例如：

> _为我收到的、需要我进行某种审核的邮件添加 "Review" 标签_

</Step>

<Step title="智能体开始工作 (Agent starts working)">

您的智能体将开始工作，并为每个需要您批准的步骤提供 <strong>Continue</strong> 选项。

<img src="/langsmith/images/agent-builder-response.png" alt="包含 Gmail 工具批准响应的测试聊天输出视图。" />

<img src="/langsmith/images/agent-builder-response-dark.png" alt="包含 Gmail 工具批准响应的测试聊天输出视图。" />

3. 当您测试智能体时，您可以修改指令或添加您可能需要的工具。当您对结果满意时，点击 <strong>Save changes</strong>。

</Step>

</Steps>

## 编辑您的智能体 (Edit your agent)

您可能希望更新智能体的指令或包含更多工具。您可以直接通过聊天要求智能体进行更新，或者：

1. 从左侧导航栏的 **My Agents** 中，选择您想要编辑的智能体。
1. 选择 <Icon icon="pencil"/> **Edit Agent**。

在智能体的编辑页面，您可以：

- 通过 **+ Add tool** 添加工具，连接更多应用和服务，如 Slack、GitHub 或 Linear。
- 通过 **+ Add sub-agent** 添加更多辅助智能体，将复杂任务拆分为专门的子任务。
- 对现有工具请求通过暂停来进行审核。
- 修改现有工具。
- 探索可以触发智能体开始任务的功能。

## 后续步骤 (Next steps)

既然您已经创建了第一个智能体，可以探索以下内容：

<CardGroup :cols="2">

<Card title="尝试更多模板" icon="shapes" href="/langsmith/agent-builder-templates">

探索适用于常见任务的预建智能体

</Card>

<Card title="添加自动化" icon="bolt" href="/langsmith/agent-builder-essentials#triggers">

使用触发器（Slack、邮件、定时任务）自动运行您的智能体

</Card>

<Card title="连接更多工具" icon="puzzle-piece" href="/langsmith/agent-builder-tools">

添加 Slack、GitHub、Linear 等

</Card>

<Card title="构建复杂的智能体" icon="sitemap" href="/langsmith/agent-builder-essentials#sub-agents">

使用子智能体拆分大型任务

</Card>

</CardGroup>

