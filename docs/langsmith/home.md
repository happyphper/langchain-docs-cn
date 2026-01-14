---
title: LangSmith 文档
sidebarTitle: Overview
mode: wide
---
**LangSmith 提供用于开发、调试和部署 LLM 应用程序的工具。**
它帮助您在一个地方追踪请求、评估输出、测试提示词并管理部署。
LangSmith 是框架无关的，因此您可以搭配或不搭配 LangChain 的开源库 [`langchain`](/oss/langchain/overview) 和 [`langgraph`](/oss/langgraph/overview) 使用它。
先在本地进行原型设计，然后借助集成的监控和评估功能转向生产环境，以构建更可靠的 AI 系统。

<Callout icon="bullhorn" color="#DFC5FE" iconType="regular">

LangGraph Platform 现已更名为 [LangSmith Deployment](/langsmith/deployments)。欲了解更多信息，请查看 [更新日志](https://changelog.langchain.com/announcements/product-naming-changes-langsmith-deployment-and-langsmith-studio)。

</Callout>

## 开始使用

<Steps>

<Step title="创建账户" icon="user-plus">

在 [smith.langchain.com](https://smith.langchain.com) 注册（无需信用卡）。
您可以使用 <strong>Google</strong>、<strong>GitHub</strong> 或 <strong>邮箱</strong> 登录。

</Step>

<Step title="创建 API 密钥" icon="key">

前往您的 [设置页面](https://smith.langchain.com/settings) → <strong>API Keys</strong> → <strong>Create API Key</strong>。
复制密钥并安全保存。

</Step>

</Steps>

准备好您的账户和 API 密钥后，选择一个快速入门指南开始使用 LangSmith 进行构建：

<Columns :cols="3">

<Card
title="可观测性"
icon="magnifying-glass"
href="/langsmith/observability-quickstart"
arrow="true"
cta="开始追踪"
>

洞察应用程序的每一步，以更快地调试并提高可靠性。

</Card>

<Card
title="评估"
icon="chart-line"
href="/langsmith/evaluation-quickstart"
arrow="true"
cta="评估您的应用"
>

随时间推移测量和跟踪质量，确保您的 AI 应用程序保持一致性和可信度。

</Card>

<Card
title="部署"
icon="cloud-arrow-up"
iconType="solid"
href="/langsmith/deployments"
arrow="true"
cta="部署您的智能体"
>

将您的智能体部署为 Agent Servers，为生产环境扩展做好准备。

</Card>

</Columns>

### 更多构建方式

<Columns :cols="2">

<Card
title="平台设置"
icon="server"
iconType="solid"
href="/langsmith/platform-setup"
arrow="true"
cta="选择如何设置 LangSmith"
>

使用托管云、自托管环境或混合模式来设置 LangSmith，以满足您的基础设施和合规性需求。

</Card>

<Card
title="Studio"
icon="window"
href="/langsmith/quick-start-studio"
arrow="true"
cta="使用 Studio 进行开发"
>

使用可视化界面端到端地设计、测试和完善应用程序。

</Card>

<Card
title="提示词测试"
icon="flask"
href="/langsmith/prompt-engineering-quickstart"
arrow="true"
cta="测试您的提示词"
>

利用内置的版本控制和协作功能迭代提示词，更快地交付改进。

</Card>

<Card
title="智能体构建器"
icon="sparkles"
href="/langsmith/agent-builder"
arrow="true"
cta="构建一个智能体"
>

通过无代码界面可视化地设计和部署 AI 智能体——非常适合快速原型设计和无需编写代码即可上手。

</Card>

</Columns>

<Callout icon="lock" color="#DFC5FE" iconType="regular">

LangSmith 符合 HIPAA、SOC 2 Type 2 和 GDPR 标准，满足数据安全和隐私的最高要求。欲了解更多信息，请参阅 [信任中心](https://trust.langchain.com/)。

</Callout>

## 工作流

LangSmith 将可观测性、评估、部署和平台设置整合到一个集成的工作流中——从本地开发到生产环境。

<img src="/langsmith/images/overview-light.svg" alt="图表展示了 LangSmith 如何将可观测性、评估、部署和平台设置集成到从开发到生产的单一工作流中。" />

<img src="/langsmith/images/overview-dark.svg" alt="图表展示了 LangSmith 如何将可观测性、评估、部署和平台设置集成到从开发到生产的单一工作流中。" />
