---
title: 自托管部署故障排除
sidebarTitle: Troubleshooting
---
本页面提供诊断步骤，帮助您在联系支持团队之前，排查自托管 [LangSmith 部署](/langsmith/deployments) 的问题。请系统地遵循这些步骤，以识别和解决常见的部署问题。

<Callout icon="headset" iconType="solid" color="#9333ea">

如果您完成了这些诊断步骤后仍需要帮助，请参考本指南末尾的 [支持](#support) 部分，了解在联系支持前需要收集哪些信息。

</Callout>

## 前提条件

在开始诊断步骤之前，请确保您具备：

- 对您的 Kubernetes 集群拥有 `kubectl` 访问权限。
- 拥有查看 Pod、Deployment、Service 等的适当权限。
- 熟悉您的 [Helm Chart 配置](/langsmith/kubernetes#configure-your-helm-charts:)。

## 步骤 1. 了解您的部署

验证已部署的内容并了解系统的基础状态。这有助于您识别正常运行时的状态，并在问题发生时发现异常。

运行以下命令以查看所有已部署的 Kubernetes 资源。

<Note>

运行本节中的命令时，请确保您处于正确的命名空间中。或者，使用 `-n` 标志明确指定命名空间。例如：`kubectl get deployments -n langsmith`。

</Note>

列出所有 Deployment：

```bash
kubectl get deployments
```

列出所有 Pod：

```bash
kubectl get pods
```

列出所有 Service：

```bash
kubectl get services
```

列出所有 `lgps` 资源（仅在创建 [Agent Server](/langsmith/agent-server) 后存在）：

```bash
kubectl get lgps
```

### 关键部署组件

您的部署包含以下核心组件：

- **`langsmith-frontend`**：LangSmith 前端 UI，您在此处创建 Agent Server 部署。此应用程序向 `langsmith-host-backend` 发起 API 调用。属于 [控制平面](/langsmith/control-plane)。
- **`langsmith-host-backend`**：LangSmith 部署的 [控制平面](/langsmith/control-plane)，接收来自 `langsmith-frontend` 的请求，并将部署请求持久化到控制平面的 Postgres 数据库。
- **`langsmith-listener`**：LangSmith 部署 [数据平面](/langsmith/data-plane) 的一部分。通过 HTTP API 轮询 `langsmith-host-backend` 以获取需要创建、更新或删除的部署。将任务加入队列供工作进程处理。
- **`langsmith-redis`**：作为 `langsmith-listener` 任务队列的 [Redis](/langsmith/data-plane#redis) 实例。监听器在此处入队任务，工作进程从此队列拉取任务。
- **`langsmith-operator`**：`lgps` Kubernetes Operator，负责协调 `lgps` 资源的底层 Kubernetes 资源。属于数据平面基础设施。

<Note>

根据您的配置，部署中可能存在其他组件。有关概述，请参阅 [LangSmith 部署组件](/langsmith/components)。

</Note>

## 步骤 2. 启用调试日志记录

排查问题时，第一步通常是启用调试级别的日志记录，以收集有关系统运行情况的更详细信息。

### 对于控制平面或数据平面部署

如果您遇到控制平面部署（例如 `langsmith-host-backend`）或数据平面部署（例如 `langsmith-listener`）的问题，请使用 `LOG_LEVEL=DEBUG` 环境变量重新安装 Helm Chart。将以下内容添加到您的 `values.yaml` 文件中：

```yaml
extraEnv:
  - name: LOG_LEVEL
    value: DEBUG
```

### 对于 Agent Server 部署

如果问题出现在单个 Agent Server 部署上：

1.  导航到 [LangSmith UI](https://smith.langchain.com) 中的 **Deployments** 选项卡。
2.  在部署详情页面上，选择 **+ New Revision**。
3.  添加一个新的环境变量 `LOG_LEVEL` 并将其设置为 `DEBUG`。

<Note>

您也可以在 UI 中某个部署的详情页面上找到调试日志，点击 <strong>Server Logs</strong>，然后在 <strong>Log level: Info</strong> 下拉菜单中选择 <strong>Debug</strong>。

</Note>

### 对于普遍性问题

如果您不确定问题的根源，请在所有地方（控制平面、数据平面和所有 Agent Server 部署）启用 `DEBUG` 日志记录。

### 查看应用程序日志

跟踪每个 Pod 的日志以了解其基线行为：

```bash
kubectl logs -f <pod_name>
```

然后查找以下日志行：

- **`langsmith-listener`**：`Reconciling projects...`（每 10 秒出现一次）
- **`langsmith-operator`**：`Starting reconciliation`（定期出现）

在健康的部署中，您不应看到任何错误。所有日志都应显示正常且例行。

### 解读调试日志

查找以下问题指示器：

- 异常或堆栈跟踪。
- 错误消息（包含单词 `"ERROR"`）。
- 与正常操作不同的异常模式。

根据您发现的错误：

- **配置问题**：如果您怀疑是配置问题，请向运行 [`helm install`](/langsmith/kubernetes) 的人员提出此问题。
- **用户代码错误**：如果您怀疑是用户代码中的错误（例如，LangGraph OSS 图实现），请向创建 [`langgraph.json`](/langsmith/application-structure#configuration-file) 文件的 Agent Server 应用程序所有者提出此问题。

## 步骤 3. 描述 Deployment 和 Pod

描述 Kubernetes 资源可以揭示可能不会出现在应用程序日志中的错误事件和状态。这些错误通常由配置或基础设施问题引起，而非应用程序代码错误。描述资源还会显示其配置（例如环境变量），这对调试很有帮助。

运行以下命令来描述您的资源。

描述一个 Kubernetes Deployment：

```bash
kubectl describe deployment <deployment_name>
```

描述一个 Kubernetes Pod：

```bash
kubectl describe pod <pod_name>
```

描述一个 `lgps` 资源（仅在创建 Agent Server 后相关）：

```bash
kubectl describe lgps <lgps_name>
```

### 解读结果

查看输出的 `Events:` 部分，并验证一切是否正常。出现的常见问题包括：

- 存活或就绪探针失败
- 镜像拉取错误
- 资源限制（CPU、内存）
- 卷挂载问题
- 配置错误

确保没有错误事件，并且所有事件都表明运行状况良好。

## 其他资源

有关更多故障排除信息，请参阅：

- [故障排除](/langsmith/troubleshooting)：通用故障排除指南，包含常见问题的解决方案。
- [架构概述](/langsmith/architectural-overview)：关于系统架构和组件交互的详细信息。
- [自托管文档](/langsmith/self-hosted)

## 支持

如果您已遵循这些诊断步骤但仍需要帮助，请在联系支持团队之前收集以下信息：

- [诊断步骤](#step-1-understand-your-deployment) 的输出。
- 您的 Helm Chart 配置。
- 相关的错误消息和日志。
- 问题发生时您正在尝试执行的操作描述。

准备好这些信息将有助于 [支持团队](mailto:support@langchain.dev) 更快地诊断和解决您的问题。
