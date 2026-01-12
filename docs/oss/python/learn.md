---
title: 学习
description: 教程、概念指南和资源，助您快速入门。
---
在文档的 **学习** 部分，您将找到一系列教程、概念概述和其他资源，帮助您使用 LangChain 和 LangGraph 构建强大的应用程序。

## 使用案例

以下是按框架组织的常见使用案例教程。

### LangChain

[LangChain](/oss/python/langchain/overview) 的 [agent](/oss/python/langchain/agents) 实现使得大多数用例都能轻松上手。

<Card title="语义搜索" icon="magnifying-glass" href="/oss/langchain/knowledge-base" horizontal>

使用 LangChain 组件构建一个基于 PDF 的语义搜索引擎。

</Card>

<Card title="RAG Agent" icon="user-magnifying-glass" href="/oss/langchain/rag" horizontal>

创建一个检索增强生成 (RAG) 智能体。

</Card>

<Card title="SQL Agent" icon="database" href="/oss/langchain/sql-agent" horizontal>

构建一个 SQL 智能体，以人机协同的方式与数据库交互。

</Card>

<Card title="语音 Agent" icon="microphone" href="/oss/langchain/voice-agent" horizontal>

构建一个可以与之对话和聆听的智能体。

</Card>

### LangGraph

LangChain 的 [agent](/oss/python/langchain/agents) 实现使用了 [LangGraph](/oss/python/langgraph/overview) 的原语。
如果需要更深度的定制，可以直接在 LangGraph 中实现智能体。

<Card title="自定义 RAG Agent" icon="user-magnifying-glass" href="/oss/langgraph/agentic-rag" horizontal>

使用 LangGraph 原语构建一个 RAG 智能体，以获得细粒度的控制。

</Card>

<Card title="自定义 SQL Agent" icon="database" href="/oss/langgraph/sql-agent" horizontal>

直接在 LangGraph 中实现一个 SQL 智能体，以获得最大的灵活性。

</Card>

### 多智能体

这些教程演示了 [多智能体模式](/oss/python/langchain/multi-agent)，将 LangChain 智能体与 LangGraph 工作流相结合。

<Card title="子智能体：个人助理" icon="sitemap" href="/oss/langchain/multi-agent/subagents-personal-assistant" horizontal>

构建一个可以委派任务给子智能体的个人助理。

</Card>

<Card title="交接：客户支持" icon="people-arrows" href="/oss/langchain/multi-agent/handoffs-customer-support" horizontal>

构建一个客户支持工作流，其中单个智能体在不同状态间转换。

</Card>

<Card title="路由器：知识库" icon="share-nodes" href="/oss/langchain/multi-agent/router-knowledge-base" horizontal>

构建一个多源知识库，将查询路由到专门的智能体。

</Card>

<Card title="技能：SQL 助手" icon="wand-magic-sparkles" href="/oss/langchain/multi-agent/skills-sql-assistant" horizontal>

构建一个智能体，使用按需上下文加载逐步加载专门的技能。

</Card>

## 概念概述

这些指南解释了 LangChain 和 LangGraph 的核心概念和 API。

<Card title="记忆" icon="brain" href="/oss/concepts/memory" horizontal>

了解线程内和跨线程交互的持久化。

</Card>

<Card title="上下文工程" icon="book-open" href="/oss/concepts/context" horizontal>

学习为 AI 应用程序提供正确信息和工具以完成任务的方法。

</Card>

<Card title="图 API" icon="chart-network" href="/oss/langgraph/graph-api" horizontal>

探索 LangGraph 的声明式图构建 API。

</Card>

<Card title="函数式 API" icon="code" href="/oss/langgraph/functional-api" horizontal>

将智能体构建为单一函数。

</Card>

## 其他资源

<Card title="LangChain 学院" icon="graduation-cap" href="https://academy.langchain.com/" horizontal>

提升您 LangChain 技能的课程和练习。

</Card>

<Card title="案例研究" icon="screen-users" href="/oss/langgraph/case-studies" horizontal>

了解团队如何在生产环境中使用 LangChain 和 LangGraph。

</Card>

