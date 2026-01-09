---
title: 在 AWS 上自托管
sidebarTitle: AWS
icon: aws
---
在 [Amazon Web Services (AWS)](https://aws.amazon.com/) 上运行 LangSmith 时，您可以设置为[完全自托管](/langsmith/self-hosted)或[混合](/langsmith/hybrid)模式。完全自托管模式部署一个完整的 LangSmith 平台，包含可观测性功能以及创建智能体部署的选项。混合模式则仅包含在您云环境的数据平面内运行智能体所需的基础设施，而我们的 SaaS 提供控制平面和可观测性功能。

本页提供了特定于 AWS 的架构模式、服务推荐以及在 AWS 上部署和运行 LangSmith 的最佳实践。

<Note>

LangChain 专门为 AWS 提供了 Terraform 模块，以帮助为 LangSmith 配置基础设施。这些模块可以快速设置 EKS 集群、RDS、ElastiCache、S3 和网络资源。

查看 [AWS Terraform 模块](https://github.com/langchain-ai/terraform/tree/main/modules/aws) 以获取文档和示例。

</Note>

## 参考架构

我们建议利用 AWS 的托管服务来提供一个可扩展、安全且具有弹性的平台。以下架构适用于自托管和混合模式，并符合 [AWS Well-Architected 框架](https://aws.amazon.com/architecture/well-architected/)：

![显示 AWS 与 LangSmith 服务关系的架构图](/langsmith/images/aws-architecture-self-hosted.png)

- <Icon icon="globe" /> **入口与网络**：请求通过您 [VPC](https://aws.amazon.com/vpc/) 内的 [Amazon Application Load Balancer (ALB)](https://aws.amazon.com/elasticloadbalancing/application-load-balancer/) 进入，并使用 [AWS WAF](https://aws.amazon.com/waf/) 和基于 [IAM](https://aws.amazon.com/iam/) 的身份验证进行保护。
- <Icon icon="cube" /> **前端与后端服务**：容器运行在 [Amazon EKS](https://aws.amazon.com/eks/) 上，在 ALB 后面进行编排。根据需要在集群内将请求路由到其他服务。
- <Icon icon="database" /> **存储与数据库**：
  - [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/) 或 [Aurora](https://aws.amazon.com/rds/aurora/)：用于元数据、项目、用户以及已部署智能体的短期和长期记忆。LangSmith 支持 PostgreSQL 14 或更高版本。
  - [Amazon ElastiCache (Redis)](https://aws.amazon.com/elasticache/redis/)：用于缓存和作业队列。ElastiCache 可以处于单实例或集群模式，运行 Redis OSS 5 或更高版本。
  - ClickHouse + [Amazon EBS](https://aws.amazon.com/ebs/)：用于分析和追踪存储。
    - 除非出于安全或合规性原因无法使用，否则我们建议使用[外部托管的 ClickHouse 解决方案](/langsmith/self-host-external-clickhouse)。
    - 混合部署不需要 ClickHouse。
  - [Amazon S3](https://aws.amazon.com/s3/)：用于追踪工件和遥测数据的对象存储。

- <Icon icon="sparkles" /> **LLM 集成**：可选地代理请求到 [Amazon Bedrock](https://aws.amazon.com/bedrock/) 或 [Amazon SageMaker](https://aws.amazon.com/sagemaker/) 进行 LLM 推理。
- <Icon icon="chart-line" /> **监控与可观测性**：与 [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) 集成。

## 计算选项

LangSmith 根据您的需求支持多种计算选项：

| 计算选项 | 描述 | 适用场景 |
|-----------------|-------------|--------------|
| **Elastic Kubernetes Service (首选)** | 高级扩展和多租户支持 | 大型企业 |
| **基于 EC2** | 完全控制，自带基础设施 | 受监管或隔离环境 |

## AWS Well-Architected 最佳实践

此参考设计旨在符合 AWS Well-Architected 框架的六大支柱：

### 卓越运营

- 使用 IaC ([CloudFormation](https://aws.amazon.com/cloudformation/) / [Terraform](https://www.terraform.io/)) 自动化部署。
- 使用 [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) 进行配置。
- 配置您的 LangSmith 实例以[导出遥测数据](/langsmith/export-backend)，并通过 [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) 持续监控。
- 管理 [LangSmith 部署](/langsmith/deployments) 的首选方法是创建一个 CI 流程，用于构建 [Agent Server](/langsmith/agent-server) 镜像并将其推送到 [ECR](https://aws.amazon.com/ecr/)。在 PR 合并后将新版本部署到预发布或生产环境之前，为拉取请求创建一个测试部署。

### 安全性

- 使用具有最小权限策略的 [IAM](https://aws.amazon.com/iam/) 角色。
- 启用静态加密 ([RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html)、[S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html)、ClickHouse 卷) 和传输中加密 (TLS 1.2+)。
- 与 [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) 集成以管理凭据。
- 将 [Amazon Cognito](https://aws.amazon.com/cognito/) 作为身份提供者 (IDP)，与 LangSmith 内置的身份验证和授权功能结合使用，以保护对智能体及其工具的访问。

### 可靠性

- 跨区域复制 LangSmith [数据平面](/langsmith/data-plane)：为 LangSmith 部署在不同区域的 Kubernetes 集群中部署相同的数据平面。跨 [多可用区 (Multi-AZ)](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/) 部署 [RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) 和 [ECS](https://aws.amazon.com/ecs/) 服务。
- 为后端工作器实施[自动扩展](https://aws.amazon.com/autoscaling/)。
- 使用 [Amazon Route 53](https://aws.amazon.com/route53/) 健康检查和故障转移策略。

### 性能效率

- 利用 [EC2](https://aws.amazon.com/ec2/) 实例进行优化计算。
- 对不常访问的追踪数据使用 [S3 Intelligent-Tiering](https://aws.amazon.com/s3/storage-classes/intelligent-tiering/)。

### 成本优化

- 使用 [Compute Savings Plans](https://aws.amazon.com/savingsplans/compute-pricing/) 合理调整 [EKS](https://aws.amazon.com/eks/) 集群规模。
- 使用 [AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) 仪表板监控成本关键绩效指标 (KPI)。

### 可持续性

- 使用按需计算最小化空闲工作负载。
- 将遥测数据存储在低延迟、低成本的层级中。
- 为非生产环境启用自动关机。

## 安全与合规

LangSmith 可以配置为：

- 仅限 [PrivateLink](https://aws.amazon.com/privatelink/) 访问（除了计费所需的出口流量外，不暴露于公共互联网）。
- 为 S3、RDS 和 EBS 使用基于 [KMS](https://aws.amazon.com/kms/) 的加密密钥。
- 将审计日志记录到 [CloudWatch](https://aws.amazon.com/cloudwatch/) 和 [AWS CloudTrail](https://aws.amazon.com/cloudtrail/)。

客户可以根据需要在 [GovCloud](https://aws.amazon.com/govcloud-us/)、ISO 或 HIPAA 区域进行部署。

## 监控与评估

使用 LangSmith 可以：

- 捕获运行在 [Bedrock](https://aws.amazon.com/bedrock/) 或 [SageMaker](https://aws.amazon.com/sagemaker/) 上的 LLM 应用的追踪数据。
- 通过 [LangSmith 数据集](/langsmith/manage-datasets) 评估模型输出。
- 跟踪延迟、令牌使用情况和成功率。

可与以下工具集成：

- [AWS CloudWatch](https://aws.amazon.com/cloudwatch/) 仪表板。
- [OpenTelemetry](https://opentelemetry.io/) 和 [Prometheus](https://prometheus.io/) 导出器。
