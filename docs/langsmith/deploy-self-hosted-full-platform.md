---
title: 启用 LangSmith 部署
sidebarTitle: Enable deployment
icon: server
---
本指南将展示如何在您的[自托管 LangSmith 实例](/langsmith/kubernetes)上启用 **LangSmith Deployment**。这将添加一个[控制平面](/langsmith/control-plane)和一个[数据平面](/langsmith/data-plane)，让您可以直接通过 LangSmith UI 来部署、扩展和管理智能体（agent）与应用程序。

完成本指南后，您将可以使用 LangSmith 的[可观测性](/langsmith/observability)、[评估](/langsmith/evaluation)和[部署](/langsmith/deployments)功能。

<Info>
<strong>重要</strong><br></br> 启用 LangSmith Deployment 需要一个[企业版](https://langchain.com/pricing)计划。
</Info>

<Note>

<strong>此设置页面用于在现有的 LangSmith 实例上启用 [LangSmith Deployment](/langsmith/deployments)。</strong>

请查阅[自托管选项](/langsmith/self-hosted)以了解：
- [LangSmith（可观测性）](/langsmith/self-hosted#langsmith)：您应该首先安装的部分。
- [LangSmith Deployment](/langsmith/self-hosted#langsmith-deployment)：本指南将启用的功能。
- [独立服务器](/langsmith/self-hosted#standalone-server)：不含 UI 的轻量级替代方案。

</Note>

## 概述

本指南建立在 [Kubernetes 安装指南](/langsmith/kubernetes) 的基础之上。**在继续之前，您必须先完成该指南**。本页面涵盖了启用 LangSmith Deployment 所需的额外设置步骤：
- 安装 LangGraph operator
- 配置您的 Ingress
- 连接到控制平面

## 先决条件

1.  您正在使用 Kubernetes。
2.  您有一个正在运行的[自托管 LangSmith](/langsmith/kubernetes) 实例。
3.  您的集群上已安装 `KEDA`。

```bash
helm repo add kedacore https://kedacore.github.io/charts
helm install keda kedacore/keda --namespace keda --create-namespace
```

<Info>

KEDA 用于根据队列大小自动扩展部署系统。

</Info>

4.  Ingress 配置
    1.  您必须为您的 LangSmith 实例设置一个 Ingress、Gateway 或使用 Istio。所有智能体都将作为 Kubernetes 服务部署在此 Ingress 之后。请使用此指南为您的实例[设置 Ingress](/langsmith/self-host-ingress)。要启用 LangSmith Deployment，您需要在 `values.yaml` 中提供一个 `hostname`。
5.  您的集群中必须有足够的空间来容纳多个部署。建议使用 `Cluster-Autoscaler` 来自动配置新节点。
6.  集群上有一个有效的动态 PV 供应器或可用的 PV。您可以通过运行以下命令来验证：

```bash
kubectl get storageclass
```
7.  您的网络可以出站访问 `https://beacon.langchain.com`。如果未在隔离（air-gapped）模式下运行，则需要进行许可证验证和使用情况报告。更多详情请参阅[出站访问文档](/langsmith/self-host-egress)。

## 设置

1.  作为配置自托管 LangSmith 实例的一部分，您需要启用 `deployment` 选项。这将配置几个关键资源。
    1.  `listener`：这是一个服务，用于监听[控制平面](/langsmith/control-plane)对您部署的更改，并创建/更新下游的 CRD。
    2.  `LangGraphPlatform CRD`：用于 LangSmith Deployment 的 CRD。它包含了管理 LangSmith 部署实例的规范。
    3.  `operator`：此 operator 处理对 LangSmith CRD 的更改。
    4.  `host-backend`：这是[控制平面](/langsmith/control-plane)。

<Note>

从 v0.12.0 版本开始，`langgraphPlatform` 选项已弃用。对于 v0.12.0 之后的任何版本，请使用 `config.deployment`。

</Note>

2.  该 Chart 将使用两个额外的镜像。请使用最新版本中指定的镜像。

```bash
hostBackendImage:
  repository: "docker.io/langchain/hosted-langserve-backend"
  pullPolicy: IfNotPresent
operatorImage:
  repository: "docker.io/langchain/langgraph-operator"
  pullPolicy: IfNotPresent
```
3.  在您的 LangSmith 配置文件（通常是 `langsmith_config.yaml`）中，启用 `deployment` 选项。请注意，您还必须有一个有效的 Ingress 设置：

```bash
config:
  deployment:
    enabled: true
  # 从 v0.12.0 开始，此部分已弃用。对于 v0.12.0 之后的任何版本，请使用 config.deployment。
  langgraphPlatform:
    enabled: true
    langgraphPlatformLicenseKey: "YOUR_LANGGRAPH_PLATFORM_LICENSE_KEY"
```
4.  在您的 `values.yaml` 文件中，配置 `hostBackendImage` 和 `operatorImage` 选项（如果您需要镜像镜像）。如果您使用的是需要身份验证的私有容器注册表，则还必须配置 `imagePullSecrets`，请参阅[为私有注册表配置身份验证](#optional-configure-authentication-for-private-registries)。

5.  您还可以通过覆盖[此处](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/values.yaml#L898)的基础模板来为您的智能体配置基础模板。

现在，您的自托管基础设施已准备好创建部署。

## （可选）配置额外的数据平面

除了在上述步骤中已创建的现有数据平面之外，您还可以创建更多位于不同 Kubernetes 集群或同一集群不同命名空间中的数据平面。

### 先决条件

1.  阅读[混合部署文档](/langsmith/hybrid#listeners)中的集群组织指南，以了解如何根据您的用例最佳地组织此操作。
2.  验证[混合部署](/langsmith/deploy-hybrid#prerequisites)部分中提到的先决条件是否已为新集群满足。请注意，在[此部分](/langsmith/deploy-hybrid#prerequisites)的第 5 步中，您需要启用对您的[自托管 LangSmith 实例](/langsmith/self-host-usage#configuring-the-application-you-want-to-use-with-langsmith)的出站访问，而不是 https://api.host.langchain.com 和 https://api.smith.langchain.com。
3.  针对您的 LangSmith Postgres 实例运行以下命令以启用此功能。这是您的自托管 LangSmith 设置附带的 [Postgres 实例](/langsmith/kubernetes#validate-your-deployment%3A)。
```
update organizations set config = config || '{"enable_lgp_listeners_page": true}' where id = '<org id here>';
update tenants set config = config || '{"langgraph_remote_reconciler_enabled": true}' where id = '<workspace id here>';
```
记下您选择的工作空间 ID，因为在后续步骤中您将需要它。

### 部署到不同的集群

1.  按照[混合设置指南](/langsmith/deploy-hybrid#setup)中的步骤 2-6 操作。`config.langsmithWorkspaceId` 值应设置为在先决条件中记下的工作空间 ID。
2.  要将多个数据平面部署到同一集群，请遵循[此处](/langsmith/deploy-hybrid#configuring-additional-data-planes-in-the-same-cluster)列出的规则。

### 部署到同一集群的不同命名空间

1.  您需要对在[上述设置说明](/langsmith/deploy-self-hosted-full-platform#setup)第 3 步中创建的 `langsmith_config.yaml` 文件进行一些修改：
    - 将 `operator.watchNamespaces` 字段设置为您的自托管 LangSmith 实例当前运行的命名空间。这是为了防止与将作为新数据平面一部分添加的 operator 发生冲突。
    - 必须使用 [Gateway API](/langsmith/self-host-ingress#option-2%3A-gateway-api) 或 [Istio Gateway](/langsmith/self-host-ingress#option-3%3A-istio-gateway)。请相应地调整您的 `langsmith_config.yaml` 文件。
2.  运行 `helm upgrade` 以使用新配置更新您的自托管 LangSmith 实例。
3.  按照[混合设置指南](/langsmith/deploy-hybrid#setup)中的步骤 2-6 操作。`config.langsmithWorkspaceId` 值应设置为在先决条件中记下的工作空间 ID。请记住，`config.watchNamespaces` 应设置为与现有数据平面使用的命名空间不同的命名空间！

## （可选）为私有注册表配置身份验证

如果您的 [Agent Server 部署](/langsmith/agent-server) 将使用来自私有容器注册表（例如，AWS ECR、Azure ACR、GCP Artifact Registry、私有 Docker 注册表）的镜像，请配置镜像拉取密钥（image pull secrets）。这是一次性的基础设施配置，允许所有部署自动与您的私有注册表进行身份验证。

**步骤 1：创建 Kubernetes 镜像拉取密钥**

```bash
kubectl create secret docker-registry langsmith-registry-secret \
    --docker-server=myregistry.com \
    --docker-username=your-username \
    --docker-password=your-password \
    --docker-email=your-email@example.com \
    -n langsmith
```

将值替换为您的注册表凭据：
- `myregistry.com`：您的注册表 URL
- `your-username`：您的注册表用户名
- `your-password`：您的注册表密码或访问令牌
- `langsmith`：安装 LangSmith 的 Kubernetes 命名空间

**步骤 2：在 `values.yaml` 中配置部署模板**

要使 Agent Server 部署能够使用私有注册表密钥，您必须在 operator 的部署模板中添加 `imagePullSecrets`：

```yaml {21-22}
operator:
  templates:
    deployment: |
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: ${name}
        namespace: ${namespace}
      spec:
        replicas: ${replicas}
        revisionHistoryLimit: 10
        selector:
          matchLabels:
            app: ${name}
        template:
          metadata:
            labels:
              app: ${name}
          spec:
            enableServiceLinks: false
            imagePullSecrets:
            - name: langsmith-registry-secret
            containers:
            - name: api-server
              image: ${image}
              ports:
              - name: api-server
                containerPort: 8000
                protocol: TCP
              livenessProbe:
                httpGet:
                  path: /ok
                  port: 8000
                periodSeconds: 15
                timeoutSeconds: 5
                failureThreshold: 6
              readinessProbe:
                httpGet:
                  path: /ok
                  port: 8000
                periodSeconds: 15
                timeoutSeconds: 5
                failureThreshold: 6
```

**步骤 3：在 Helm 安装/升级期间应用**

当您使用 Helm 部署或升级 LangSmith 实例时，此配置将被应用。通过 LangSmith UI 创建的所有用户部署都将自动继承这些注册表凭据。

对于特定注册表的身份验证方法（AWS ECR、Azure ACR、GCP Artifact Registry 等），请参阅 [Kubernetes 关于从私有注册表拉取镜像的文档](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)。

## 后续步骤

一旦您的基础设施设置完成，就可以开始部署应用程序了。请参阅[部署选项卡](/langsmith/deployments)中的部署指南，了解如何构建和部署您的应用程序。
