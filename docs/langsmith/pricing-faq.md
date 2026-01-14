---
title: 常见问题解答
sidebarTitle: Pricing FAQ
---


<Info>

查看我们的[定价](https://www.langchain.com/pricing)页面，了解更多关于我们定价计划的信息。

</Info>

## 在定价对新用户生效之前，我就已经在使用 LangSmith 了。定价何时会对我的账户生效？

如果您已经在使用 LangSmith，您的使用将从 2024 年 7 月开始计费。届时，如果您想增加席位或使用超过每月免费追踪额度，您将需要在 LangSmith 中添加信用卡或联系销售。如果您对具有更高速率限制和特殊部署选项的企业版计划感兴趣，可以通过[联系我们的销售团队](https://www.langchain.com/contact-sales)了解更多信息或进行购买。

## 哪个计划适合我？

如果您是个人开发者，开发者计划是小型项目的绝佳选择。

对于希望在 LangSmith 中协作的团队，请查看 Plus 计划。**如果您是构建 AI 应用程序的早期初创公司**，您可能有资格享受我们的初创公司计划，该计划提供折扣价格和慷慨的每月免费追踪额度。请通过我们的[初创公司联系表](https://airtable.com/app8ZrGLtHAtFVO1o/pagfLAmdTz4ep7TGu/form)了解更多详情。

如果您需要更高级的管理、身份验证和授权、部署选项、支持或年度发票，企业版计划适合您。请通过我们的[销售联系表](https://www.langchain.com/contact-sales)了解更多详情。

## 什么是席位？

席位是您组织内的一个独立用户。我们根据用户总数（包括受邀用户）来确定计费的席位数量。

## 什么是追踪？

追踪是您的应用程序链或智能体（agent）、评估器运行或 Playground 运行的一次完整调用。这是一个[示例](https://smith.langchain.com/public/17c24270-9f74-47e7-b70c-d508afc448fa/r)。

## 什么是部署运行？

部署运行是通过 LangSmith 部署部署的 LangGraph 智能体的一次端到端调用。单个智能体执行中的节点和子图不会单独计费。对其他 LangGraph 智能体的调用（通过 RemoteGraph 或 LangGraph SDK 或直接通过 API）会单独计费，费用计入托管被调用智能体的部署。人机协同（human-in-the-loop）的中断在恢复时会创建一个单独的部署运行。

部署运行每次计费 0.005 美元。对于高使用量，请[联系我们的销售团队](https://www.langchain.com/contact-sales)讨论自定义定价选项。

## 什么是摄取的事件？

摄取的事件是发送到 LangSmith 的任何独立的、与追踪相关的数据。这包括：

*   在追踪内运行步骤开始时发送的输入、输出和元数据
*   在追踪内运行步骤结束时发送的输入、输出和元数据
*   对运行步骤或追踪的反馈

## 我达到了速率或使用限制。我该怎么办？

当您首次注册 LangSmith 账户时，您会获得一个个人组织，每月限制为 5000 次追踪。在达到此限制后要继续发送追踪，请通过添加信用卡升级到开发者或 Plus 计划。前往[计划和账单](https://smith.langchain.com/settings/payments)进行升级。

同样，如果您达到了当前计划的速率限制，您可以升级到更高级别的计划以获得更高的限制，或者通过 [support.langchain.com](https://support.langchain.com) 联系支持人员咨询问题。

## 我有一个开发者账户，可以将我的账户升级到 Plus 或企业版计划吗？

是的，开发者计划用户可以轻松地在[计划和账单](https://smith.langchain.com/settings/payments)页面上升级到 Plus 计划。对于企业版计划，请[联系我们的销售团队](https://www.langchain.com/contact-sales)讨论您的需求。

## 计费是如何运作的？

**席位**

席位按月计费，每月第一天出账。月中新增的席位将按比例计费，并在购买后一天内出账。月中移除的席位不予退款。

**追踪记录**

只要您的账户中存有信用卡信息，我们将处理您的追踪记录，并在每月第一天为您上个月提交的追踪记录出账。您可以选择设置使用量限制，以控制任何给定月份可能产生的最高费用。

## 我可以限制追踪功能的花费吗？

您可以在[使用量配置](https://smith.langchain.com/settings/payments)页面设置每月可发送至 LangSmith 的追踪记录数量上限。

<Note>

为了方便起见，我们确实会向您展示使用量限制对应的美元金额，但此限制是根据追踪记录数量而非美元金额来评估的。例如，如果您获批我们的初创企业计划层级，该层级会提供大量免费追踪记录额度，您的使用量限制不会自动更改。

目前您无法在产品中设置支出限额。

</Note>

## 如何查看本月至今的使用情况？

在您组织的设置部分，您会看到**使用量**子版块。在那里，您可以查看过去 30、60 或 90 天内每日可计费的 LangSmith 追踪记录数量图表。请注意，此数据有 1-2 小时的延迟，因此当天的数据可能略低于您的实际运行次数。

## 我对账单有疑问...

开发者和增强版计划的客户应通过 [support.langchain.com](https://support.langchain.com) 联系支持团队。企业版计划的客户应直接联系其销售代表。

企业版计划客户按年度发票计费。

## 我能获得怎样的支持？

在开发者计划中，可通过 [LangChain 社区 Slack](https://www.langchain.com/join-community) 获得社区支持。

在增强版计划中，您还将通过 [support.langchain.com](https://support.langchain.com) 获得针对 LangSmith 相关问题的优先支持，我们将尽力在下一个工作日内回复。

在企业版计划中，您将获得全方位支持，包括 Slack 频道、专属客户成功经理以及每月例会，讨论 LangSmith 和 LangChain 相关问题。我们可以协助解决从调试、智能体（agent）和 RAG 技术、评估方法到认知架构审查等各种问题。如果您购买了附加服务以在您的环境中运行 LangSmith，我们的基础设施工程团队还将随时待命，支持部署和新版本发布。

## 我的数据存储在哪里？

您可以选择在美国或欧盟地区注册。更多详情请参阅[云架构参考](/langsmith/cloud#cloud-architecture-and-scalability)。如果您是企业版计划客户，我们可以将 LangSmith 部署到您在 AWS、GCP 或 Azure 上的 Kubernetes 集群中运行，确保数据永不离开您的环境。

## LangSmith 符合哪些安全框架？

我们符合 SOC 2 Type II、GDPR 和 HIPAA 标准。

您可以在 [trust.langchain.com](https://trust.langchain.com) 请求获取有关我们安全政策和状况的更多信息。请注意，我们仅与企业版计划的客户签订业务伙伴协议（BAA）。

## 你们会使用我发送给 LangSmith 的数据进行训练吗？

我们不会使用您的数据进行训练，您拥有数据的所有权利。更多信息请参阅 [LangSmith 服务条款](https://langchain.dev/terms-of-service)。

<!--@include: @/snippets/python/langsmith/agent-builder-pricing.md-->
