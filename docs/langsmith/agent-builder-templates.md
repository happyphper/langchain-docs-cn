---
title: 模板
description: 通过精选的智能体构建器模板快速启动，并自定义工具、提示和触发器。
---
Agent Builder 包含[入门模板](https://www.langchain.com/templates)，可帮助您快速创建智能体（agent）。这些模板为常见用例提供了预定义的指令、[工具](/langsmith/agent-builder-tools)和[触发器](/langsmith/agent-builder-essentials#triggers)（如适用）。您可以直接使用模板，或将其作为自定义的基准。

<Tip>

如果您是 Agent Builder 的新手，请从分步[快速入门](/langsmith/agent-builder-quickstart)开始，使用模板构建您的第一个智能体。

</Tip>

## 功能特性

模板是为特定用例设计的预配置智能体。每个模板包含以下组件：

### 预配置工具

模板附带一套精选的[工具](/langsmith/agent-builder-essentials#tools)，使智能体能够执行特定操作。例如，电子邮件助手模板包含用于阅读、发送和组织邮件的工具。这些工具通过 OAuth 认证连接到外部服务，允许您的智能体与 Gmail、Slack 或 Linear 等应用交互。完整列表请参阅[支持的工具](/langsmith/agent-builder-tools)。

### 系统指令

每个模板都包含一个*系统提示*（也称为*指令*），用于定义智能体的行为、个性和能力。系统提示指导智能体如何解释用户请求并使用其可用工具。您可以自定义这些指令以满足您的特定需求。

### 触发器（可选）

某些模板包含[触发器](/langsmith/agent-builder-essentials#triggers)，允许智能体自动响应外部事件。例如，Slack 机器人模板可能包含一个触发器，当有人在频道中提及该智能体时激活。触发器使智能体能够超越基于聊天的交互，实现主动行为。

### 克隆与自定义

模板可作为起点，您可以通过克隆来创建自己的智能体。克隆模板时，您会创建一个独立的副本，可以对其进行自定义而不会影响原始模板。您可以修改提示、添加或删除工具、附加不同的触发器以及切换模型，以根据您的要求定制智能体。

## 可用模板

<CardGroup :cols="2">

<Card title="每日日历简报" icon="calendar">

一个每日运行的智能体，扫描您的日历并提供包含会议详情和重要背景的简明简报。

</Card>

<Card title="电子邮件助手" icon="envelope">

通过智能体自动化邮件分类，标记重要邮件、起草和发送回复以及安排会议。

</Card>

<Card title="LinkedIn 招聘专员" icon="users">

通过智能体自动化招聘流程，消化候选人要求、适应反馈并输出候选人列表。

</Card>

<Card title="社交媒体 AI 监控器" icon="newspaper">

一个跟踪 X 列表和 Hacker News 上热门 AI 讨论的智能体，并通过 Slack 每日发送包含重要更新的消息。

</Card>

</CardGroup>

<Info>

更多信息，请参阅[模板](https://www.langchain.com/templates)。

</Info>

