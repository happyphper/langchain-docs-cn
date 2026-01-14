---
title: 设置层级结构
sidebarTitle: Set up hierarchy
---
本页面介绍如何设置和管理您的 LangSmith [_组织_](/langsmith/administration-overview#organizations) 和 [_工作空间_](/langsmith/administration-overview#workspaces)：

- [设置组织](#set-up-an-organization)：为团队协作创建和管理组织，包括用户管理和角色分配。
- [设置工作空间](#set-up-a-workspace)：设置和配置工作空间以组织您的 LangSmith 资源，管理工作空间成员，并为团队协作配置设置。
- [设置应用程序](#set-up-applications)：在工作空间内设置应用程序以进一步组织 LangSmith 资源，并利用 ABAC 权限管理。

<Check>

在阅读此设置页面之前，您可能会发现参考 [LangSmith 资源层次结构概述](/langsmith/administration-overview) 会有所帮助。

</Check>

## 设置组织

<Note>

如果您有兴趣以编程方式管理您的组织和工作空间，请参阅 [此操作指南](/langsmith/manage-organization-by-api)。

</Note>

### 创建组织

首次登录时，LangSmith 会自动为您创建一个个人组织。如果您想与他人协作，可以创建一个单独的组织并邀请您的团队成员加入。

为此，请点击左下角的个人资料图标打开组织抽屉，然后点击 **+ 新建**。共享组织在使用前需要绑定信用卡。您需要 [设置账单](/langsmith/billing#set-up-billing-for-your-account) 才能继续。

### 管理和导航工作空间

一旦您订阅了允许每个组织拥有多个用户的计划，您就可以设置 [工作空间](/langsmith/administration-overview#workspaces) 以更有效地协作，并在不同用户组之间隔离 LangSmith 资源。要在工作空间之间导航并访问每个工作空间内的资源（追踪项目、标注队列等），请在 LangSmith 左下角的选择器中选择所需的工作空间。

### 管理用户

在 [设置页面](https://smith.langchain.com/settings) 的 **成员和角色** 选项卡中管理您的共享组织的成员资格。在这里您可以：

- 邀请新用户加入您的组织，选择工作空间成员资格以及（如果启用了 RBAC）工作空间角色。
- 编辑用户的组织角色。
- 从您的组织中移除用户。

![组织成员和角色](/langsmith/images/organization-members-and-roles.png)

企业计划的组织可以在 **角色** 选项卡中设置自定义工作空间角色。有关更多详细信息，请参阅 [访问控制设置指南](/langsmith/user-management)。

#### 组织角色

组织范围的角色用于确定对组织设置的访问权限。所选角色也会影响工作空间成员资格：

- `组织管理员` 授予管理所有组织配置、用户、账单和工作空间的完全访问权限。任何 `组织管理员` 对组织中的所有工作空间都拥有 `管理员` 访问权限。
* `组织用户` 可以读取组织信息，但无法在组织级别执行任何写入操作。您可以将 `组织用户` 添加到一部分工作空间，并像往常一样分配工作空间角色（如果启用了 RBAC），这些角色指定了工作空间级别的权限。

<Info>

`组织用户` 角色仅在拥有多个工作空间计划的组织中可用。在仅限于单个工作空间的组织中，所有用户都是 `组织管理员`。自定义组织范围的角色不可用。

</Info>

有关每个角色关联的完整权限列表，请参阅 [管理概述](/langsmith/administration-overview#organization-roles) 页面。

## 设置工作空间

首次登录时，系统会在您的个人组织中为您创建一个默认的[工作区](/langsmith/administration-overview#workspaces)。工作区通常用于分隔不同团队或业务单元之间的资源，以在它们之间建立清晰的信任边界。在每个工作区内，基于角色的访问控制（RBAC）管理权限和访问级别，确保用户只能访问其角色所需的资源和设置。大多数 LangSmith 活动都在工作区的上下文中进行，每个工作区都有其自己的设置和访问控制。

关于如何为您的团队选择合适的工作区组织模型（每个团队一个工作区、每个工作区多个团队或每个团队多个工作区）的指导，请参阅[工作负载隔离](/langsmith/workload-isolation)。

### 创建工作区

要创建新工作区，请导航到共享组织的[设置页面](https://smith.langchain.com/settings)的**工作区**选项卡，然后单击**添加工作区**。创建工作区后，您可以通过在此页面上选择它来管理其成员和其他配置。

![创建工作区](/langsmith/images/create-workspace.png)

<Note>

不同计划对组织中可使用的工作区数量有不同的限制。更多信息，请参阅[定价页面](https://www.langchain.com/pricing-langsmith)。

</Note>

### 管理用户

<Info>

只有工作区`管理员`可以管理工作区成员资格，并且如果启用了 RBAC，可以更改用户的工作区角色。

</Info>

对于已经是组织成员的用户，工作区`管理员`可以在[工作区设置页面](https://smith.langchain.com/settings/workspaces)的**工作区成员**选项卡下将他们添加到工作区。用户在被[邀请加入组织](#manage-users)时，也可以直接受邀加入一个或多个工作区。

### 配置工作区设置

工作区配置位于[工作区设置页面](https://smith.langchain.com/settings/workspaces)选项卡中。选择要配置的工作区，然后选择所需的配置子选项卡。以下示例显示了**API 密钥**，其他配置选项（包括密钥、模型和共享 URL）也可在此处找到。

![工作区设置](/langsmith/images/workspace-settings.png)

### 删除工作区

<Warning>

删除工作区将永久删除该工作区及其所有关联数据。此操作无法撤销。

</Warning>

您可以通过 LangSmith UI 或通过 [API](https://api.smith.langchain.com/redoc?#tag/workspaces/operation/delete_workspace_api_v1_workspaces__workspace_id__delete) 删除工作区。您必须是工作区`管理员`才能删除工作区。

### 通过 UI 删除工作区

1.  导航到**设置**。
2.  选择要删除的工作区。
3.  点击屏幕右上角的**删除**。

![删除工作区](/langsmith/images/delete-workspace.png)

## 设置应用程序

可以在工作区内创建应用程序，以进一步组织工作区内的资源，例如追踪项目和数据集。一个工作区可以有零个或多个应用程序。

您可以通过选择`显示所有应用程序`来查看工作区内的所有资源；可以通过在设置页面的资源标签下将它们添加到`应用程序`标签，将资源标记到多个应用程序。

![示例应用程序选择器](/langsmith/images/sample-application-selector.png)
