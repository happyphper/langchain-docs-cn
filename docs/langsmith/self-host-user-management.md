---
title: 自定义用户管理
sidebarTitle: Customize user management
---

<Note>

本指南假设您已阅读[管理员指南](/langsmith/administration-overview)和[组织设置指南](/langsmith/set-up-hierarchy#set-up-an-organization)。

</Note>

LangSmith 提供了使用功能标志进行用户管理的额外自定义功能。

## 功能

### 在工作区级别邀请用户加入组织

LangSmith 的默认行为要求用户必须是组织管理员才能邀请新用户加入组织。对于希望将此职责委派给工作区管理员的自托管客户，可以设置一个功能标志，使工作区管理员也能在**工作区级别**邀请新用户加入组织及其特定工作区。

通过下面的配置选项启用此功能后，工作区管理员可以在 `设置` > `工作区` 下的 `工作区成员` 选项卡中添加新用户。在工作区级别邀请时支持以下两种情况，而组织级别的邀请功能与之前相同。

1. 邀请**尚未**在组织中处于活动状态的用户：这会将用户作为待处理成员添加到组织和特定工作区。
2. 邀请**已经**在组织中处于活动状态的用户：直接将用户作为活动成员添加到工作区（无待处理状态）。

管理员可以同时为这两种情况邀请用户。

#### 配置

::: code-group

```yaml [Helm]
config:
  workspaceScopeOrgInvitesEnabled: true
```

```bash [Docker]
# 在您的 .env 文件中
WORKSPACE_SCOPE_ORG_INVITES_ENABLED="true"
```

:::

### SSO 新成员登录流程

自 Helm **v0.11.10** 起，使用 OAuth SSO 的自托管部署将不再需要手动在 LangSmith 设置中添加成员以使其加入。部署将拥有一个<b>默认</b>组织，新用户首次登录 LangSmith 时将自动加入该组织。

对于您的**默认**组织，您可以设置新成员被分配到哪个工作区以及工作区角色。对于**非默认**组织，邀请流程保持不变。
一旦用户加入一个组织，对其工作区或角色超出默认组织设置的任何更改，必须通过 LangSmith 设置（与之前相同）或通过 SCIM 进行管理。

<Note>

默认情况下，所有新用户都将以<strong>工作区编辑者</strong>角色添加到组织最初配置的工作区（默认为<strong>工作区 1</strong>）。

</Note>

![更新 SSO 成员设置](/langsmith/images/sso-member-settings-update.png)

<Note>

要更改您的默认组织，请在组织选择器下拉菜单中使用<strong>设为默认组织</strong>。（需要在源组织和目标组织中都拥有组织管理员权限。）

</Note>

### 禁用组织创建

默认情况下，任何用户都可以在 LangSmith 中创建组织。对于自托管客户，管理员可能希望在设置初始组织后限制此功能。此功能标志允许管理员禁用用户创建新组织的能力。

#### 配置

<Note>

对于使用[基本身份验证](/langsmith/self-host-basic-auth)或[SSO](/langsmith/self-host-sso)的组织，`userOrgCreationDisabled` 功能标志默认设置为 `true`。

</Note>

::: code-group

```yaml [Helm]
config:
  userOrgCreationDisabled: true
```

```bash [Docker]
# 在您的 .env 文件中
FF_ORG_CREATION_DISABLED="true"
```

:::

### 禁用个人组织

默认情况下，任何登录 LangSmith 的用户都会为其创建一个个人组织。对于自托管客户，管理员可能希望限制此功能。此功能标志允许管理员禁用用户创建个人组织的能力。

#### 配置

<Note>

对于使用[基本身份验证](/langsmith/self-host-basic-auth)或[SSO](/langsmith/self-host-sso)的组织，`personalOrgsDisabled` 功能标志默认设置为 `true`。

</Note>

::: code-group

```yaml [Helm]
config:
  personalOrgsDisabled: true
```

```bash [Docker]
# 在您的 .env 文件中
PERSONAL_ORGS_DISABLED="true"
```

:::

