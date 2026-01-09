---
title: 在 Azure 上自托管
sidebarTitle: Azure
icon: microsoft
---
在 [Microsoft Azure](https://azure.microsoft.com/) 上运行 LangSmith 时，您可以设置为[完全自托管](/langsmith/self-hosted)或[混合](/langsmith/hybrid)模式。完全自托管模式部署一个完整的 LangSmith 平台，包含可观测性功能以及创建智能体（agent）部署的选项。混合模式则仅包含在您云环境的数据平面中运行智能体所需的基础设施，而我们的 SaaS 提供控制平面和可观测性功能。

本页提供了特定于 Azure 的架构模式、服务建议以及在 Azure 上部署和运行 LangSmith 的最佳实践。

<Note>

LangChain 提供了专门用于 Azure 的 Terraform 模块，以帮助为 LangSmith 配置基础设施。这些模块可以快速设置 AKS 集群、Azure Database for PostgreSQL、Azure Managed Redis、Blob 存储和网络资源。

查看 [Azure Terraform 模块](https://github.com/langchain-ai/terraform/tree/main/modules/azure) 以获取文档和示例。

</Note>

## 参考架构

我们建议使用 Azure 的托管服务来提供一个可扩展、安全且具有弹性的平台。以下架构适用于自托管和混合部署：

![显示 Azure 与 LangSmith 服务关系的架构图](/langsmith/images/azure-architecture-self-hosted.png)

- **客户端接口**：用户通过 Web 浏览器或 LangChain SDK 与 LangSmith 交互。所有流量在 [Azure 负载均衡器](https://azure.microsoft.com/en-us/products/load-balancer/) 处终止，并被路由到 [AKS](https://azure.microsoft.com/en-us/products/kubernetes-service/) 集群内的前端（NGINX），然后根据需要路由到集群内的其他服务。
- **存储服务**：该平台需要用于跟踪记录、元数据和缓存的持久存储。在 Azure 上，推荐的服务是：
    - <Icon icon="database" /> **[Azure Database for PostgreSQL（灵活服务器）](https://azure.microsoft.com/en-us/products/postgresql/)** 用于事务性数据（例如，运行记录、项目）。Azure 的高可用性选项会在另一个可用区配置一个备用副本；数据会同步提交到主服务器和备用服务器。LangSmith 要求 PostgreSQL 版本 14 或更高。
    - <Icon icon="database" /> **[Azure Managed Redis](https://azure.microsoft.com/en-us/products/managed-redis/)** 用于队列和缓存。最佳实践包括存储小值、将大对象拆分为多个键、使用流水线操作以最大化吞吐量，并确保客户端和服务器位于同一区域。您也可以使用 [Azure Cache for Redis](https://azure.microsoft.com/en-us/products/cache)，以单实例或集群模式运行。LangSmith 要求 Redis OSS 版本 5 或更高。
    - <Icon icon="chart-line" /> **ClickHouse** 用于跟踪记录的大容量分析。我们建议使用[外部托管的 ClickHouse 解决方案](/langsmith/self-host-external-clickhouse)。如果出于安全或合规原因无法使用，请使用开源 Operator 在 AKS 上部署 ClickHouse 集群。确保跨[可用区](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview)进行复制以保证持久性。混合部署不需要 ClickHouse。
    - <Icon icon="cube" /> **[Azure Blob 存储](https://azure.microsoft.com/en-us/products/storage/blobs/)** 用于大型工件。使用冗余存储配置，例如读取访问异地冗余存储（RA-GRS）或异地区域冗余存储（RA-GZRS），并设计应用程序以便在发生中断时从次要区域读取。

## Azure 上的计算和网络

### Azure Kubernetes 服务 (AKS)

[AKS](https://azure.microsoft.com/en-us/products/kubernetes-service/) 是生产部署推荐的计算平台。本节概述了规划设置时的关键考虑因素。

#### 网络模型

生产集群使用 [Azure CNI](https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni) 网络。此模型将集群集成到现有的虚拟网络中，为每个 Pod 和节点分配 IP 地址，并允许直接连接到本地或其他 Azure 服务。确保子网有足够的 IP 地址用于节点和 Pod，避免地址范围重叠，并为横向扩展事件分配额外的 IP 空间。

#### 入口和负载均衡

使用 Kubernetes Ingress 资源和控制器来分发 HTTP/HTTPS 流量。Ingress 控制器在第 7 层运行，可以根据 URL 路径路由流量并处理 TLS 终止。与第 4 层负载均衡器相比，它们减少了公共 IP 地址的数量。使用[应用程序路由附加组件](https://learn.microsoft.com/en-us/azure/aks/app-routing)来获取与 [Azure DNS](https://azure.microsoft.com/en-us/products/dns/) 和 [Key Vault](https://azure.microsoft.com/en-us/products/key-vault/)（用于 SSL 证书）集成的托管 NGINX Ingress 控制器。

#### Web 应用程序防火墙 (WAF)

为了提供额外的攻击防护，部署一个 [WAF](https://learn.microsoft.com/en-us/azure/web-application-firewall/overview)，例如 [Azure 应用程序网关](https://azure.microsoft.com/en-us/products/application-gateway/)。WAF 使用 OWASP 规则过滤流量，并可以在流量到达您的 AKS 集群之前终止 TLS。

#### 网络策略

应用 [Kubernetes 网络策略](https://learn.microsoft.com/en-us/azure/aks/use-network-policies) 来限制 Pod 到 Pod 的流量，并减少受损工作负载的影响。创建集群时启用网络策略支持，并根据应用程序连接性设计规则。

#### 高可用性

跨[可用区](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview)配置节点池，并为所有部署使用 Pod 中断预算（PDB）和多个副本。设置 Pod 资源请求和限制；[AKS 资源管理最佳实践](https://learn.microsoft.com/en-us/azure/aks/developer-best-practices-resource-management)建议设置 CPU 和内存限制，以防止 Pod 消耗所有资源。使用[集群自动扩缩器](https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler)和[垂直 Pod 自动扩缩器](https://learn.microsoft.com/en-us/azure/aks/vertical-pod-autoscaler)来自动扩缩节点池和调整 Pod 资源。

### 网络和身份

#### 虚拟网络集成

将 AKS 部署到其自己的[虚拟网络](https://azure.microsoft.com/en-us/products/virtual-network/)中，并为集群、数据库、Redis 和存储端点创建单独的子网。使用[专用链接](https://azure.microsoft.com/en-us/products/private-link/)和[服务端点](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview)将流量保持在您的虚拟网络内，避免暴露在公共互联网上。

#### 身份验证

将 LangSmith 与 [Microsoft Entra ID](https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id)（Azure AD）集成以实现单点登录。使用 Azure AD OAuth2 获取承载令牌，并分配角色以控制对 UI 和 API 的访问。

## 存储和数据服务

### Azure Database for PostgreSQL

#### 高可用性

使用具有高可用性模式的[灵活服务器](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/overview)。Azure 会在同一可用区内（区域冗余）或跨可用区（区域冗余）配置一个备用副本。数据会同步提交到主服务器和备用服务器，确保已提交的数据不会丢失。区域冗余配置将备用副本放在不同的可用区，以防止可用区中断，但可能会增加写入延迟。

#### 备份和灾难恢复

启用[自动备份](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-backup-restore)并配置异地冗余备份存储，以防止整个区域范围的中断。对于关键应用程序，在次要区域创建只读副本。

#### 扩展

选择与您的工作负载匹配的合适 SKU；灵活服务器允许独立扩展计算和存储。通过 [Azure Monitor](https://azure.microsoft.com/en-us/products/monitor/) 监控指标并配置警报。

### Azure Managed Redis

#### 持久性和冗余

选择提供复制和持久性的层级。为持久性配置 Redis 持久化或数据备份。对于高可用性，根据层级使用[主动异地复制](https://learn.microsoft.com/en-us/azure/redis/how-to-active-geo-replication)或区域冗余缓存。

### Azure 上的 ClickHouse

ClickHouse 用于分析工作负载（跟踪记录和反馈）。如果您无法使用外部托管的解决方案，请使用 Helm 或官方 Operator 在 AKS 上部署 ClickHouse 集群。为了弹性，跨节点和可用区复制数据。考虑使用 [Azure 磁盘](https://azure.microsoft.com/en-us/products/storage/disks/) 作为本地存储，并将其挂载为 StatefulSet。

### Azure Blob 存储

#### 冗余

根据您的恢复目标选择冗余配置。使用[读取访问异地冗余存储（RA-GRS）或异地区域冗余存储（RA-GZRS）](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy)，并设计应用程序以便在主区域中断期间将读取切换到次要区域。

#### 命名和分区

使用命名约定来改善跨分区的负载均衡，并为最大并发客户端数量做好规划。保持在 Azure 的可扩展性和容量目标范围内，并在必要时跨多个存储账户分区数据。

#### 网络

通过[专用端点](https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints)访问 Blob 存储，或使用 SAS 令牌和 CORS 规则来启用直接客户端访问。

## 安全性和访问控制

### Azure Key Vault

#### 每个应用程序和环境使用单独的保管库

将数据库连接字符串和 API 密钥等机密存储在 [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault/) 中。为每个应用程序和环境（开发、测试、生产）使用专用的保管库，以限制安全漏洞的影响。

#### 访问控制

使用 [RBAC 权限模型](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide) 在保管库范围分配角色，并限制对所需主体的访问。使用专用链接和防火墙限制网络访问。

#### 数据保护和日志记录

启用[软删除和清除保护](https://learn.microsoft.com/en-us/azure/key-vault/general/soft-delete-overview) 以防止意外删除。开启日志记录并为 Key Vault 访问事件配置警报。

### 网络安全

#### 入口隔离

仅通过 Ingress 控制器或 WAF 公开前端服务。其他服务应为内部服务，并通过集群网络进行通信。

#### RBAC 和 Pod 安全

使用 [Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) 来控制谁可以部署、修改或读取资源。启用 [Pod 安全准入](https://kubernetes.io/docs/concepts/security/pod-security-admission/) 以强制执行基线、受限或特权配置文件。

#### 机密管理

使用 [CSI Secret Store](https://learn.microsoft.com/en-us/azure/aks/csi-secrets-store-driver) 将 Key Vault 中的机密挂载到 Pod 中。避免将机密存储在环境变量或配置文件中。

## 可观测性和监控

配置您的 LangSmith 实例以[导出遥测数据](/langsmith/export-backend)，以便您可以使用 Azure 的服务对其进行监控。

### Azure Monitor

使用 [Azure Monitor](https://azure.microsoft.com/en-us/products/monitor/) 进行指标、日志和警报。主动监控涉及对关键信号（如节点 CPU/内存利用率、Pod 状态和服务延迟）配置警报。当超过预定义阈值时，Azure Monitor 警报会通知您。

### 托管 Prometheus 和 Grafana

启用 [Azure Monitor 托管 Prometheus](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/prometheus-metrics-overview) 以收集 Kubernetes 指标。将其与 [Grafana 仪表板](https://azure.microsoft.com/en-us/products/managed-grafana/) 结合使用以进行可视化。定义服务级别目标（SLO）并相应地配置警报。

### Container Insights

安装 [Container Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-overview) 以捕获来自 AKS 节点和 Pod 的日志和指标。使用 [Azure Log Analytics 工作区](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview) 来查询和分析日志。

### 应用程序日志记录

确保 LangSmith 服务将日志输出到 stdout/stderr，并通过 [Fluent Bit](https://fluentbit.io/) 或 Azure Monitor 代理转发它们。

## 持续集成
- 管理 [LangSmith 部署](/langsmith/deployments) 的首选方法是创建一个 CI 流程，该流程构建 [Agent Server](/langsmith/agent-server) 镜像并将其推送到 [Azure 容器注册表](https://azure.microsoft.com/en-us/products/container-registry)。在将新修订版部署到预生产或生产环境之前，为拉取请求创建一个测试部署，并在 PR 合并后进行部署。
