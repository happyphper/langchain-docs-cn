---
title: 自托管 LangSmith 更新日志
sidebarTitle: Self-hosted changelog
rss: true
---

<Callout icon="rss" color="#DFC5FE" iconType="regular">

<strong>订阅</strong>：我们的更新日志包含一个 [RSS feed](https://docs.langchain.com/langsmith/self-hosted-changelog/rss.xml)，可以与 [Slack](https://slack.com/help/articles/218688467-Add-RSS-feeds-to-Slack)、[电子邮件](https://zapier.com/apps/email/integrations/rss/1441/send-new-rss-feed-entries-via-email)、Discord 机器人（如 [Readybot](https://readybot.io/) 或 [RSS Feeds to Discord Bot](https://rss.app/en/bots/rssfeeds-discord-bot)）以及其他订阅工具集成。

</Callout>

[自托管 LangSmith](/langsmith/self-hosted) 是企业版计划的一个附加组件，专为我们规模最大、最注重安全的客户设计。更多详情，请参阅[定价](https://www.langchain.com/pricing)。如果您希望获取许可证密钥以在您的环境中试用 LangSmith，请[联系我们的销售团队](https://www.langchain.com/contact-sales)。

<Update label="2026-01-09" :tags="['self-hosted']">

## langsmith-0.12.36

- 在 Agent Builder 中增加了对带有 OAuth 的自定义 MCP 服务器的支持
- 增加了在 Agent Builder 中查看和编辑记忆（memory）文件的功能
- 在前端增加了对附件的支持
- 改进了追踪查看器中的流式树性能
- 修复了追踪树中的滚动行为
- 修复了追踪显示中的 Unicode 截断问题
- 修复了当存在运行记录时引导界面错误显示的问题
- 将每个工作空间的最大自动化规则数增加到 200

**下载 Helm 图表：** [`langsmith-0.12.36.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.36/langsmith-0.12.36.tgz)

</Update>

<Update label="2026-01-08" :tags="['self-hosted']">

## langsmith-0.12.35

- 在实验中为反馈图表增加了按条高亮功能
- 增加了 Agent Builder 活动动态
- 将实验标签改为悬停卡片以提升可用性
- 修复了智能体（agent）在侧边栏随机位置出现的问题
- 修复了 Playground 中工具模态框的嵌套问题
- 修复了对比页面上的差异模式回退问题
- 修复了 OAuth 认证请求中的竞态条件
- 新增了“细粒度用量”标签页，用于按工作空间、项目、用户和 API 密钥报告计费用量（通过在 `commonEnv` 中设置环境变量 `DEFAULT_ORG_FEATURE_ENABLE_GRANULAR_USAGE_REPORTING=true` 和 `GRANULAR_USAGE_TABLE_ENABLED=true` 来启用）

**下载 Helm 图表：** [`langsmith-0.12.35.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.35/langsmith-0.12.35.tgz)

</Update>

<Update label="2026-12-26" :tags="['self-hosted']">

## langsmith-0.12.34

- 增加了对 GCP 和 Azure 的 Redis IAM 认证支持
- 增加了 OCSF 格式的自助审计日志
- 在实验输出标题中增加了隐藏列选项
- 在工具服务器中增加了 `message_user` 工具
- 提高了追踪树的加载速度
- 允许通过 API 在基础认证安装中禁用邀请
- 修复了导航中的租户 ID 处理
- 修复了 Agent Builder 模板视图中的滚动问题
- 修复了 Gmail 账户连接限制的工具提示
- 修复了页面加载时用户视图偏好的持久化问题
- 修复了 UI 中的标签页换行问题
- 默认显示反馈图表
- 使 SCIM 组名匹配不区分大小写

**下载 Helm 图表：** [`langsmith-0.12.34.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.34/langsmith-0.12.34.tgz)

</Update>

<Update label="2025-12-20" :tags="['self-hosted']">

## langsmith-0.12.33

- 安全修复：通过要求用户定义允许的来源，修复了 Studio 对恶意 `baseUrl` 参数的漏洞
- 允许在 SSO 中同时启用邀请和 JIT 配置（仅限使用客户端密钥模式的 OAuth）
- 增加了管理操作的自助审计日志（私有预览版）

**下载 Helm 图表：** [`langsmith-0.12.33.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.33/langsmith-0.12.33.tgz)

</Update>

<Update label="2025-12-12" :tags="['self-hosted']">

## langsmith-0.12.32

- 为 PostgreSQL 新增 IAM 连接支持（仅限 AWS）。
- 在 playground 中新增 GPT-5.2 模型支持。
- 新增对执行器 Pod 设置内存限制的支持。

**下载 Helm chart：** [`langsmith-0.12.32.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.32/langsmith-0.12.32.tgz)

</Update>

<Update label="2025-12-11" :tags="['self-hosted']">

## langsmith-0.12.31

- 改进了基本身份验证配置错误时的错误信息。
- 新增组织操作员角色支持。
- 修复了流式数据集端点的问题。

**下载 Helm chart：** [`langsmith-0.12.31.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.31/langsmith-0.12.31.tgz)

</Update>

<Update label="2025-12-09" :tags="['self-hosted']">

## langsmith-0.12.30

- 修复了在使用子路径时，API 文档按钮未重定向到正确 URL 的问题。
- 性能改进和错误修复。

**下载 Helm chart：** [`langsmith-0.12.30.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.30/langsmith-0.12.30.tgz)

</Update>

<Update label="2025-12-08" :tags="['self-hosted']">

## langsmith-0.12.29

- 为 ClickHouse 连接新增 mTLS（双向 TLS）支持，以增强数据库通信的安全性。

**下载 Helm chart：** [`langsmith-0.12.29.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.29/langsmith-0.12.29.tgz)

</Update>

<Update label="2025-12-05" :tags="['self-hosted']">

## langsmith-0.12.28

- 为 PostgreSQL 连接新增 mTLS（双向 TLS）支持，以增强数据库通信的安全性。
- 为 ClickHouse 客户端新增 mTLS 支持。
- 修复了在自托管部署中禁用时，Agent Builder 引导和侧边导航可见性的问题。

**下载 Helm chart：** [`langsmith-0.12.28.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.28/langsmith-0.12.28.tgz)

</Update>

<Update label="2025-12-04" :tags="['self-hosted']">

## langsmith-0.12.27

- 为 Redis 连接新增 mTLS（双向 TLS）支持，以增强安全性。
- 在自托管部署中新增对空触发器服务器配置的支持。
- 改进了事件横幅的样式和内容。

**下载 Helm chart：** [`langsmith-0.12.27.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.27/langsmith-0.12.27.tgz)

</Update>

<Update label="2025-12-01" :tags="['self-hosted']">

## langsmith-0.12.25

- 为自托管部署启用了 Agent Builder UI 功能标志。
- 新增 Redis 集群支持，以提高可扩展性和高可用性。

**下载 Helm chart：** [`langsmith-0.12.25.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.25/langsmith-0.12.25.tgz)

</Update>

<Update label="2025-11-27" :tags="['self-hosted']">

## langsmith-0.12.24

- 为所有 SAQ（简单异步队列）队列新增出队超时设置，以提高可靠性。
- 性能改进和错误修复。

**下载 Helm chart：** [`langsmith-0.12.24.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.24/langsmith-0.12.24.tgz)

</Update>

<Update label="2025-11-26" :tags="['self-hosted']">

## langsmith-0.12.22

- 在 playground 中新增 Claude Opus 4.5 模型支持。
- 更新了数据平面操作员版本。
- 在配置了 basePath 时，新增了 `LANGCHAIN_ENDPOINT` 环境变量。

**下载 Helm chart：** [`langsmith-0.12.22.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.22/langsmith-0.12.22.tgz)

</Update>

<Update label="2025-11-26" :tags="['self-hosted']">

## langsmith-0.12.21

- 为操作员部署模板新增了显式的 `revisionHistoryLimit` 配置。

**下载 Helm chart：** [`langsmith-0.12.21.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.21/langsmith-0.12.21.tgz)

</Update>

<Update label="2025-11-24" :tags="['self-hosted']">

## langsmith-0.12.20

- 新增支持自托管客户选择加入成对标注队列功能。
- 在 LangSmith 和数据平面图表中将 operator 更新至版本 0.1.21。

**下载 Helm 图表：** [`langsmith-0.12.20.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.20/langsmith-0.12.20.tgz)

</Update>

<Update label="2025-11-24" :tags="['self-hosted']">

## langsmith-0.12.19

- 修复了 playground 环境配置，以使用正确的默认设置。

**下载 Helm 图表：** [`langsmith-0.12.19.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.19/langsmith-0.12.19.tgz)

</Update>

<Update label="2025-11-20" :tags="['self-hosted']">

## langsmith-0.12.18

- 内部更新与维护。

**下载 Helm 图表：** [`langsmith-0.12.18.tgz`](https://github.com/langchain-ai/helm/releases/download/langsmith-0.12.18/langsmith-0.12.18.tgz)

</Update>

<Note>

更多 Helm 图表版本可在 [`langchain-ai/helm` GitHub 仓库](https://github.com/langchain-ai/helm/releases) 中获取。

</Note>

