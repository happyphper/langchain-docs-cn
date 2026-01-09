---
title: 常见问题
sidebarTitle: FAQs
---
## 可观测性

### *我无法在 UI 中创建 API 密钥或管理用户，怎么回事？*

* 您很可能在没有设置 SSO 的情况下部署了 LangSmith。LangSmith 需要 SSO 来管理用户和 API 密钥。您可以在[配置部分](/langsmith/self-host-sso)找到有关设置 SSO 的更多信息。

### *负载均衡/入口（ingress）如何工作？*

* 您需要将前端容器/服务暴露给您的应用程序/用户。这将处理到所有下游服务的路由。
* 您需要在入口级别终止 SSL。我们建议使用托管服务，如 AWS ALB、GCP 负载均衡器或 Nginx。

### *我们如何对应用程序进行身份验证？*

* 目前，我们的自托管解决方案支持使用 OAuth2.0 和 OIDC 作为身份验证解决方案的 SSO。请注意，我们确实提供无身份验证的解决方案，但强烈建议在生产环境使用前设置 OAuth。

您可以在[配置部分](/langsmith/self-host-sso)找到有关设置 SSO 的更多信息。

### *我可以使用外部存储服务吗？*

* 您可以配置 LangSmith 以使用所有存储服务的外部版本。在生产环境中，我们强烈建议使用外部存储服务。查看[配置部分](/langsmith/self-hosted)以获取更多信息。

### *我的应用程序是否需要出站（egress）访问才能正常运行？*

我们的部署仅需要为少数几项内容进行出站访问（其中大部分可以驻留在您的 VPC 内）：

* 获取镜像（如果镜像已本地化，则可能不需要）
* 与任何 LLM 端点通信
* 与您可能配置的任何外部存储服务通信
* 获取 OAuth 信息
* 订阅指标和操作元数据（如果未在离线模式下运行）
  * 需要出站访问 `https://beacon.langchain.com`
  * 有关更多信息，请参阅[出站访问](/langsmith/self-host-egress)

您的 VPC 可以设置规则来限制任何其他访问。注意：我们需要允许 `X-Organization-Id` 和 `X-Tenant-Id` 标头传递到后端服务。这些标头用于确定请求是针对哪个组织和哪个工作空间（以前称为"租户"）的。

### *应用程序的资源要求？*

* 在 Kubernetes 中，我们建议的最小 Helm 配置可以在[此处](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/examples/medium_size.yaml)找到。对于 Docker，我们建议至少 16GB RAM 和 4 个 CPU。
* 对于 Postgres，我们建议至少 8GB RAM 和 2 个 CPU。
* 对于 Redis，我们建议 4GB RAM 和 2 个 CPU。
* 对于 Clickhouse，我们建议 32GB RAM 和 8 个 CPU。

### SAML SSO 常见问题

#### *如何更改 SAML SSO 用户的电子邮件地址？*

某些身份提供者在更改电子邮件时会保留原始的 `User ID`，而其他则不会，因此我们建议您按照以下步骤操作，以避免在 LangSmith 中出现重复用户：

1. 从组织中移除该用户（参见[此处](/langsmith/set-up-hierarchy#manage-users)）
2. 在 IdP 中更改他们的电子邮件地址
3. 让他们通过 SAML SSO 再次登录 LangSmith - 这将触发通常的[即时（JIT）配置](#just-in-time-jit-provisioning)流程，并使用他们的新电子邮件地址

目前不支持通过 SCIM 或其他方式更改具有多个关联登录方法的用户的电子邮件地址。会显示此错误消息：`email update not supported with linked login methods`。例如，如果用户之前通过电子邮件/密码或 Google 社交登录登录，然后通过 SSO 以相同的电子邮件地址被添加，则不支持更改其电子邮件地址。这适用于自托管和云端。

#### *我可以更改身份提供者吗？*

请通过我们的门户网站 [https://support.langchain.com](https://support.langchain.com) 联系 LangChain 支持团队以获取迁移支持。

#### *如何修复"405 方法不允许"错误？*

确保您使用的是正确的 ACS URL：[https://auth.langchain.com/auth/v1/sso/saml/acs](https://auth.langchain.com/auth/v1/sso/saml/acs)

### SCIM 常见问题

#### *我可以在没有 SAML SSO 的情况下使用 SCIM 吗？*

* **云端**：不可以，云端部署中 SCIM 需要 SAML SSO
* **自托管**：可以，SCIM 可与使用客户端密钥（Client Secret）身份验证模式的 OAuth 配合工作

#### *如果我同时启用了 JIT 配置和 SCIM 会怎样？*

JIT 配置和 SCIM 可能会相互冲突。我们建议在启用 SCIM 之前禁用 JIT 配置，以确保用户配置行为的一致性。

#### *如何更改用户的角色或工作空间访问权限？*

在您的 IdP 中更新用户的组成员身份。更改将根据[角色优先级规则](#role-precedence)同步到 LangSmith。

#### *当用户从所有组中移除时会发生什么？*

根据您的 IdP 的取消配置设置，该用户将从您的 LangSmith 组织中取消配置。

#### *我可以使用自定义组名吗？*

可以。如果您的身份提供者支持将备用字段同步到 `displayName` 组属性，您可以使用备用属性（如 `description`）作为 LangSmith 中的 `displayName`，并完全保留身份提供者组名的可定制性。否则，组必须遵循[组命名约定](#group-naming-convention)部分中描述的特定命名约定，才能正确映射到 LangSmith 角色和工作空间。

#### _为什么我的 Okta 集成不工作？_

请参阅 Okta 的故障排除指南：[https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-group-push-troubleshoot.htm](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-group-push-troubleshoot.htm)。

## 部署

### 我需要使用 LangChain 才能使用 LangGraph 吗？它们有什么区别？

不需要。LangGraph 是一个用于复杂智能体（agentic）系统的编排框架，比 LangChain 的智能体更底层、更可控。LangChain 提供了一个与模型和其他组件交互的标准接口，对于简单的链和检索流程很有用。

### LangGraph 与其他智能体框架有何不同？

其他智能体框架可以处理简单的通用任务，但对于公司特定需求的复杂任务则力有不逮。LangGraph 提供了一个更具表现力的框架来处理公司独特的任务，而不会将用户限制在单一的黑盒认知架构中。

### LangGraph 会影响我的应用程序性能吗？

LangGraph 不会给您的代码增加任何开销，并且是专门为流式工作流设计的。

### LangGraph 是开源的吗？它是免费的吗？

是的。LangGraph 是一个 MIT 许可的开源库，可以免费使用。

### LangGraph 和 LangSmith 有什么不同？

LangGraph 是一个有状态的编排框架，为智能体工作流带来了额外的控制能力。LangSmith 是一项用于部署和扩展智能体应用程序的服务，它提供了一个用于构建智能体用户体验的约定式 API，以及一个集成的开发者 UI。

| 特性 | LangGraph (开源) | LangSmith |
|---------------------|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| 描述 | 用于智能体应用程序的有状态编排框架 | 用于部署 LangGraph 应用程序的可扩展基础设施 |
| SDK | Python 和 JavaScript | Python 和 JavaScript |
| HTTP API | 无 | 有 - 对于检索和更新状态或长期记忆，或创建可配置的助手很有用 |
| 流式传输 | 基础 | 专用于逐令牌消息的模式 |
| 检查点 | 社区贡献 | 开箱即用支持 |
| 持久层 | 自我管理 | 托管的 Postgres，具有高效存储 |
| 部署 | 自我管理 | • 云端 <br /> • 免费自托管 <br /> • 企业版（付费自托管） |
| 可扩展性 | 自我管理 | 任务队列和服务器的自动扩展 |
| 容错性 | 自我管理 | 自动重试 |
| 并发控制 | 简单线程 | 支持双重文本处理 |
| 调度 | 无 | Cron 调度 |
| 监控 | 无 | 与 LangSmith 集成以实现可观测性 |
| IDE 集成 | Studio | Studio |

### LangSmith 是开源的吗？

不是。LangSmith 是专有软件。

有一个免费的自托管版本 LangSmith，可以访问基本功能。云端部署选项和自托管部署选项是付费服务。[联系我们的销售团队](https://www.langchain.com/contact-sales)以了解更多信息。

有关更多信息，请参阅我们的 [LangSmith 定价页面](https://www.langchain.com/pricing)。

### LangGraph 是否适用于不支持工具调用（tool calling）的 LLM？

是的！您可以将 LangGraph 与任何 LLM 一起使用。我们使用支持工具调用的 LLM 的主要原因是，这通常是让 LLM 决定下一步做什么最方便的方式。如果您的 LLM 不支持工具调用，您仍然可以使用它 - 您只需要编写一些逻辑来将原始的 LLM 字符串响应转换为关于下一步做什么的决定。

### LangGraph 是否适用于开源 LLM？

是的！LangGraph 完全不在意底层使用什么 LLM。我们在大多数教程中使用闭源 LLM 的主要原因是它们无缝支持工具调用，而开源 LLM 通常不支持。但工具调用并非必需（参见[此部分](#does-langgraph-work-with-llms-that-dont-support-tool-calling)），因此您完全可以搭配开源 LLM 使用 LangGraph。

### 我可以在不登录 LangSmith 的情况下使用 Studio 吗？

可以！您可以使用[Agent Server 的开发版本](/langsmith/local-server)在本地运行后端。
这将连接到作为 LangSmith 一部分托管的 Studio 前端。
如果您设置环境变量 `LANGSMITH_TRACING=false`，则不会向 LangSmith 发送任何追踪记录。

### 什么是智能体运行（Agent Run）？

智能体运行是通过 LangSmith 部署的 LangGraph 智能体的一次端到端调用。节点和子图不会单独计费。对其他 LangGraph 智能体的调用（通过 RemoteGraph 或 LangGraph SDK 或直接通过 API）会单独计费，费用由托管被调用智能体的部署承担。人机交互（human-in-the-loop）的中断在恢复时会创建一个单独的智能体运行。
