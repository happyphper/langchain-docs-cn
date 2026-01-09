---
title: Deep Agents 概述
sidebarTitle: Overview
description: 构建能够规划任务、使用子代理并利用文件系统处理复杂任务的智能代理
---
[`deepagents`](https://pypi.org/project/deepagents/) 是一个独立的库，用于构建能够处理复杂、多步骤任务的智能体（agent）。它基于 LangGraph 构建，并受到 Claude Code、Deep Research 和 Manus 等应用的启发。深度智能体（deep agent）具备规划能力、用于上下文管理的文件系统以及生成子智能体（subagent）的能力。

## 何时使用深度智能体

当你需要智能体能够处理以下情况时，请使用深度智能体：
- **处理复杂、多步骤的任务**，这些任务需要规划和分解
- **通过文件系统工具管理大量上下文**
- **将工作委派**给专门的子智能体以实现上下文隔离
- **在对话和线程之间持久化记忆**

对于更简单的用例，请考虑使用 LangChain 的 [`create_agent`](/oss/langchain/agents) 或构建自定义的 [LangGraph](/oss/langgraph/overview) 工作流。

## 核心能力

<Card title="规划与任务分解" icon="timeline">

深度智能体包含一个内置的 `write_todos` 工具，使智能体能够将复杂任务分解为离散的步骤、跟踪进度，并在新信息出现时调整计划。

</Card>

<Card title="上下文管理" icon="scissors">

文件系统工具（`ls`、`read_file`、`write_file`、`edit_file`）允许智能体将大量上下文卸载到内存中，防止上下文窗口溢出，并能够处理可变长度的工具结果。

</Card>

<Card title="子智能体生成" icon="people-group">

内置的 `task` 工具使智能体能够生成专门的子智能体以实现上下文隔离。这可以保持主智能体的上下文清洁，同时又能深入处理特定的子任务。

</Card>

<Card title="长期记忆" icon="database">

使用 LangGraph 的 Store 扩展智能体，实现跨线程的持久化记忆。智能体可以保存和检索先前对话中的信息。

</Card>

## 与 LangChain 生态系统的关系

深度智能体构建于以下基础之上：
- [LangGraph](/oss/langgraph/overview) - 提供底层的图执行和状态管理
- [LangChain](/oss/langchain/overview) - 工具和模型集成与深度智能体无缝协作
- [LangSmith](/langsmith/home) - 可观测性、评估和部署

深度智能体应用程序可以通过 [LangSmith Deployment](/langsmith/deployments) 进行部署，并使用 [LangSmith Observability](/langsmith/observability) 进行监控。

## 开始使用

<CardGroup :cols="2">

<Card title="快速开始" icon="rocket" href="/oss/deepagents/quickstart">

构建你的第一个深度智能体

</Card>

<Card title="自定义" icon="sliders" href="/oss/deepagents/customization">

了解自定义选项

</Card>

<Card title="中间件" icon="layer-group" href="/oss/deepagents/middleware">

理解中间件架构

</Card>

<Card title="参考文档" icon="arrow-up-right-from-square" href="https://reference.langchain.com/python/deepagents/">

查看 `deepagents` API 参考

</Card>

</CardGroup>

