---
title: 设置 LangSmith
sidebarTitle: Set up LangSmith
mode: wide
---
本节介绍如何托管和管理 LangSmith 基础设施。您可以设置 LangSmith 以实现[可观测性](/langsmith/observability)、[评估](/langsmith/evaluation)和[提示工程](/langsmith/prompt-engineering)，或通过 [LangSmith 部署](/langsmith/deployments) 使用完整的平台体验，通过 UI 部署和管理您的应用程序。

<Callout icon="building" color="#2563EB" iconType="regular">

<strong>如果您正在设置或维护 LangSmith 基础设施，请从这里开始。</strong>

如果您想部署一个智能体应用程序，[部署部分](/langsmith/deployments) 涵盖了应用程序结构和部署配置。

</Callout>

## 选择 LangSmith 的设置方式

您可以通过以下三种模式之一部署 LangSmith：
- [**云托管**](/langsmith/cloud)：完全由 LangChain 管理
- [**混合模式**](/langsmith/hybrid)：LangChain 管理 <Tooltip tip="用于管理部署的 LangSmith UI 和 API。">控制平面</Tooltip>；您托管 <Tooltip tip="您的 Agent Server 和智能体执行的运行时环境。">数据平面</Tooltip>
- [**自托管**](/langsmith/self-hosted)：您在自己的基础设施内管理完整的技术栈

<Columns :cols="3">

<Card
  title="云托管"
  icon="cloud"
  iconType="solid"
  href="/langsmith/cloud"
  cta="开始使用"
>

完全托管的可观测性、评估、提示工程和应用程序部署。通过自动化的 CI/CD 从 GitHub 部署。

</Card>

<Card
  title="混合模式"
  icon="cloud"
  href="/langsmith/hybrid"
  cta="设置混合模式"
>

**(企业版)** 可观测性、评估、提示工程和应用程序部署，您的应用程序在您的基础设施中运行。

</Card>

<Card
  title="自托管"
  icon="server"
  iconType="solid"
  href="/langsmith/self-hosted"
  cta="运行自托管"
>

**(企业版)** 完全控制，包含可观测性、评估和提示工程。通过启用 LangSmith 部署获得完整的平台体验，或运行独立的服务器。

</Card>

</Columns>

### 对比

请参考下表进行比较：

| 功能特性 | **云托管** | **混合模式** | **自托管** |
|---------|-----------|------------|-----------------|
| **基础设施位置** | LangChain 云 | 分离式：控制平面在 LangChain 云，数据平面在您的云 | 您的云 |
| **谁负责更新** | LangChain | LangChain (控制平面)，您 (数据平面) | 您 |
| **谁管理您应用的 CI/CD** | LangChain | 您 | 您 |
| **可以部署应用程序吗？** | ✅ 是 | ✅ 是 | ✅ 是 (需启用 LangSmith 部署) |
| **可观测性数据位置** | LangChain 云 | LangChain 云 | 您的云 |
| **[定价](https://www.langchain.com/plans)** | Plus 套餐 | 企业版 | 企业版 |
| **最适合** | 快速设置，托管式基础设施 | 数据驻留要求 + 托管的控制平面 | 完全控制，数据隔离 |

<Tip>

您可以[免费在本地运行 Agent Server](/langsmith/local-server) 进行测试和开发。

</Tip>

### 相关链接

- [套餐计划](https://langchain.com/pricing)
- [定价](https://www.langchain.com/plans)
- [可观测性](/langsmith/observability)
