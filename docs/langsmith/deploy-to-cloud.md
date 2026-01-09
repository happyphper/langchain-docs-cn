---
title: 云端部署
sidebarTitle: Cloud
icon: cloud
iconType: solid
---
这是将应用程序部署到 LangSmith Cloud 的综合设置和管理指南。

<Callout icon="zap" color="#4F46E5" iconType="regular">

<strong>如果您想快速设置</strong>，请先尝试[快速入门指南](/langsmith/deployment-quickstart)。

</Callout>

在设置之前，请查看[云概述页面](/langsmith/cloud)以了解云托管模型。

## 先决条件

- 应用程序从 GitHub 仓库部署。请配置应用程序并将其上传到 GitHub 仓库。
- [验证 LangGraph API 是否能在本地运行](/langsmith/local-server)。如果 API 无法成功运行（即 `langgraph dev`），则部署到 LangSmith 也会失败。

<Note>

<strong>需要一次性设置</strong>：GitHub 组织所有者或管理员必须在 LangSmith UI 中完成 OAuth 流程，以授权 `hosted-langserve` GitHub 应用。每个工作区只需执行一次此操作。完成初始 OAuth 授权后，所有具有部署权限的开发人员都可以创建和管理部署，而无需 GitHub 管理员访问权限。

</Note>

## 创建新部署

从 [LangSmith UI](https://smith.langchain.com) 开始，在左侧导航面板中选择 **Deployments**，然后选择 **Deployments**。在右上角，选择 **+ New Deployment** 以创建新部署：

1. 在 **Create New Deployment** 面板中，填写必填字段。对于 **Deployment details**：
    1. 选择 **Import from GitHub** 并按照 GitHub OAuth 工作流程安装并授权 LangChain 的 `hosted-langserve` GitHub 应用以访问选定的仓库。安装完成后，返回 **Create New Deployment** 面板，并从下拉菜单中选择要部署的 GitHub 仓库。

<Note>
安装 LangChain `hosted-langserve` GitHub 应用的 GitHub 用户必须是组织或账户的[所有者](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization#organization-owners)。此授权每个 LangSmith 工作区只需完成一次——后续部署可由任何具有部署权限的用户创建。
</Note>

    1. 为部署指定一个名称。
    1. 指定所需的 **Git Branch**。部署与一个分支相关联。创建新修订版时，将部署关联分支的代码。分支稍后可以在[部署设置](#deployment-settings)中更新。
    1. 指定 [LangGraph API 配置文件](/langsmith/cli#configuration-file)的完整路径，包括文件名。例如，如果文件 `langgraph.json` 位于仓库根目录，则指定 `langgraph.json`。
    1. 使用复选框选择 **Automatically update deployment on push to branch**。如果选中，当更改推送到指定的 **Git Branch** 时，部署将自动更新。您可以在[UI](https://smith.langchain.com) 的[部署设置](#deployment-settings)中启用或禁用此设置。
对于 **Deployment Type**：
 - 开发部署适用于非生产用例，并配置了最少的资源。
 - 生产部署每秒最多可处理 500 个请求，并配置了具有自动备份功能的高可用存储。
    1. 确定部署是否应 **Shareable through Studio**。
 1. 如果未选中，则只有拥有该[工作区](/langsmith/administration-overview#workspaces)有效 LangSmith API 密钥的用户才能访问该部署。
 1. 如果选中，则任何 LangSmith 用户都可以通过 [Studio](/langsmith/studio) 访问该部署。将提供一个指向该部署 Studio 的直接 URL，以便与其他 LangSmith 用户共享。
    1. 指定 **Environment Variables** 和密钥。要为部署配置其他变量，请参阅[环境变量参考](/langsmith/env-var)。
 1. 敏感值（如 API 密钥，例如 `OPENAI_API_KEY`）应指定为密钥。
 1. 也可以指定其他非机密环境变量。
    1. 系统会自动创建一个新的 LangSmith [追踪项目](/langsmith/observability)，其名称与部署名称相同。
1. 在右上角，选择 **Submit**。几秒钟后，将出现 **Deployment** 视图，新部署将进入队列等待配置。

## 创建新修订版

[创建新部署](#create-new-deployment)时，默认会创建一个新修订版。您可以创建后续修订版来部署新的代码更改。

从 [LangSmith UI](https://smith.langchain.com) 开始，在左侧导航面板中选择 **Deployments**。选择一个现有部署以为其创建新修订版。

1. 在 **Deployment** 视图中，在右上角选择 **+ New Revision**。
1. 在 **New Revision** 模态框中，填写必填字段。
    1. 指定 [API 配置文件](/langsmith/cli#configuration-file)的完整路径，包括文件名。例如，如果文件 `langgraph.json` 位于仓库根目录，则指定 `langgraph.json`。
    1. 确定部署是否应 **Shareable through Studio**。
 - 如果未选中，则只有拥有该[工作区](/langsmith/administration-overview#workspaces)有效 LangSmith API 密钥的用户才能访问该部署。
 - 如果选中，则任何 LangSmith 用户都可以通过 [Studio](/langsmith/studio) 访问该部署。将提供一个指向该部署 Studio 的直接 URL，以便与其他 LangSmith 用户共享。
    1. 指定 **Environment Variables** 和密钥。现有的密钥和环境变量会预先填充。要为修订版配置其他变量，请参阅[环境变量参考](/langsmith/env-var)。
 1. 添加新的密钥或环境变量。
 1. 移除现有的密钥或环境变量。
 1. 更新现有密钥或环境变量的值。
1. 选择 **Submit**。几秒钟后，**New Revision** 模态框将关闭，新修订版将进入队列等待部署。

## 查看构建和服务器日志

每个修订版都提供构建和服务器日志。

从 **Deployments** 视图开始：

1. 从 **Revisions** 表中选择所需的修订版。一个面板将从右侧滑出，默认选中 **Build** 选项卡，该选项卡显示该修订版的构建日志。
1. 在面板中，选择 **Server** 选项卡以查看该修订版的服务器日志。服务器日志仅在修订版部署后才可用。
1. 在 **Server** 选项卡内，根据需要调整日期/时间范围选择器。默认情况下，日期/时间范围选择器设置为 **Last 7 days**。

## 查看部署指标

从 [LangSmith UI](https://smith.langchain.com) 开始：

1. 在左侧导航面板中，选择 **Deployments**。
1. 选择一个要监控的现有部署。
1. 选择 **Monitoring** 选项卡以查看部署指标。请参阅[所有可用指标](/langsmith/control-plane#monitoring)的列表。
1. 在 **Monitoring** 选项卡内，根据需要调整日期/时间范围选择器。默认情况下，日期/时间范围选择器设置为 **Last 15 minutes**。

## 中断修订版

中断修订版将停止该修订版的部署。

<Warning>

<strong>未定义行为</strong>
中断的修订版具有未定义的行为。这仅在您需要部署新修订版，而现有修订版"卡住"无法完成时有用。未来可能会移除此功能。

</Warning>

从 **Deployments** 视图开始：

1. 在 **Revisions** 表中，找到所需修订版所在行的右侧，选择菜单图标（三个点）。
1. 从菜单中选择 **Interrupt**。
1. 将出现一个模态框。查看确认信息。选择 **Interrupt revision**。

## 删除部署

从 [LangSmith UI](https://smith.langchain.com) 开始：

1. 在左侧导航面板中，选择 **Deployments**，其中包含现有部署的列表。
1. 在所需部署所在行的右侧，选择菜单图标（三个点），然后选择 **Delete**。
1. 将出现一个 **Confirmation** 模态框。选择 **Delete**。

## 部署设置

从 **Deployments** 视图开始：

1. 在右上角，选择齿轮图标 (**Deployment Settings**)。
1. 将 `Git Branch` 更新为所需的分支。
1. 勾选/取消勾选 **Automatically update deployment on push to branch** 复选框。
    1. 分支创建/删除和标签创建/删除事件不会触发更新。只有推送到现有分支才会触发更新。
    1. 快速连续推送到一个分支将排队后续更新。一旦一个构建完成，最新的提交将开始构建，其他排队的构建将被跳过。

## 添加或移除 GitHub 仓库

安装并授权 LangChain 的 `hosted-langserve` GitHub 应用后，可以修改该应用的仓库访问权限，以添加新仓库或移除现有仓库。如果创建了新仓库，可能需要显式添加。

1. 从 GitHub 个人资料页面，导航到 **Settings** > **Applications** > `hosted-langserve` > 点击 **Configure**。
1. 在 **Repository access** 下，选择 **All repositories** 或 **Only select repositories**。如果选择了 **Only select repositories**，则必须显式添加新仓库。
1. 点击 **Save**。
1. 创建新部署时，下拉菜单中的 GitHub 仓库列表将更新以反映仓库访问权限的更改。

## 允许列表 IP 地址

2025 年 1 月 6 日之后创建的所有 LangSmith 部署的流量都将通过 NAT 网关。
此 NAT 网关将根据您部署的区域拥有多个静态 IP 地址。请参考下表以获取需要加入允许列表的 IP 地址：

| US             | EU              |
|----------------|-----------------|
| 35.197.29.146  | 34.90.213.236   |
| 34.145.102.123 | 34.13.244.114   |
| 34.169.45.153  | 34.32.180.189   |
| 34.82.222.17   | 34.34.69.108    |
| 35.227.171.135 | 34.32.145.240   |
| 34.169.88.30   | 34.90.157.44    |
| 34.19.93.202   | 34.141.242.180  |
| 34.19.34.50    | 34.32.141.108   |
| 34.59.244.194  |                 |
| 34.9.99.224    |                 |
| 34.68.27.146   |                 |
| 34.41.178.137  |                 |
| 34.123.151.210 |                 |
| 34.135.61.140  |                 |
| 34.121.166.52  |                 |
| 34.31.121.70   |                 |
