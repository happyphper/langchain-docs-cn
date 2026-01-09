---
title: LangSmith 部署
sidebarTitle: Deployment
---

当你准备好将你的 LangChain 智能体部署到生产环境时，LangSmith 提供了一个专为智能体工作负载设计的托管平台。传统的托管平台是为无状态、短生命周期的 Web 应用程序构建的，而 LangGraph 则是**专为需要持久状态和后台执行的有状态、长时间运行的智能体**而构建的。LangSmith 负责处理基础设施、扩展和运维问题，因此你可以直接从你的代码仓库进行部署。

## 前提条件

开始之前，请确保你具备以下条件：

- 一个 [GitHub 账户](https://github.com/)
- 一个 [LangSmith 账户](https://smith.langchain.com/)（免费注册）

## 部署你的智能体

### 1. 在 GitHub 上创建仓库

你的应用程序代码必须存放在 GitHub 仓库中，才能在 LangSmith 上部署。支持公共和私有仓库。对于本快速入门，请首先按照[本地服务器设置指南](/oss/langchain/studio#setup-local-agent-server)确保你的应用程序与 LangGraph 兼容。然后，将你的代码推送到仓库。

<!--@include: @/snippets/javascript/oss/deploy.md-->
