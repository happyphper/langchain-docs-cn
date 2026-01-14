---
title: 用户管理
sidebarTitle: User management
---
本页面涵盖 LangSmith 中的用户管理功能，包括访问控制、身份验证和自动化用户配置：

- [设置访问控制](#set-up-access-control)：配置基于角色的访问控制（RBAC）以管理工作区内的用户权限，包括创建自定义角色并将其分配给用户。
- [SAML 单点登录（企业版计划）](#set-up-saml-sso-for-your-organization)：使用 SAML 2.0 为企业客户设置单点登录身份验证，包括为常用身份提供商进行配置。
- [SCIM 用户配置（企业版计划）](#set-up-scim-for-your-organization)：使用 SCIM 在您的身份提供商和 LangSmith 之间自动化用户配置和取消配置。

## 设置访问控制

<Note>

RBAC（基于角色的访问控制）是一项仅面向企业客户的功能。如果您对此功能感兴趣，[请联系我们的销售团队](https://www.langchain.com/contact-sales)。其他计划默认对所有用户使用 [`Admin` 角色](/langsmith/administration-overview)。

</Note>

<Check>

在设置访问控制之前，您可能会发现阅读[管理概述](/langsmith/administration-overview)页面会有所帮助。

</Check>

LangSmith 依赖 RBAC 来管理[工作区](/langsmith/administration-overview#workspaces)内的用户权限。这使您可以控制谁可以访问您的 LangSmith 工作区以及他们在其中可以执行的操作。只有拥有 `workspace:manage` 权限的用户才能管理工作区的访问控制设置。

有关工作区角色及其权限的完整参考，请参阅[基于角色的访问控制](/langsmith/rbac#workspace-roles)指南。有关每个角色可以执行的具体操作，请参阅[组织和 workspace 操作参考](/langsmith/organization-workspace-operations)。

### 创建角色

默认情况下，LangSmith 附带一组系统角色：

- `Admin`：对工作区内的所有资源拥有完全访问权限。
- `Viewer`：对工作区内的所有资源拥有只读访问权限。
- `Editor`：拥有除工作区管理（添加/移除用户、更改角色、配置服务密钥）之外的所有权限。

如果这些角色不符合您的访问模型，`Organization Admins` 可以创建自定义角色以满足您的需求。

要创建角色，请导航至[组织设置页面](https://smith.langchain.com/settings)的 **Members and roles** 部分中的 **Roles** 选项卡。请注意，您创建的新角色将在您组织内的所有工作区中可用。

点击 **Create Role** 按钮以创建新角色。将打开一个 **Create role** 表单。

![Create Role](/langsmith/images/create-role.png)

为您想要控制访问权限的不同 LangSmith 资源分配权限。

### 为用户分配角色

设置好角色后，您可以将它们分配给用户。要将角色分配给用户，请导航至[组织设置页面](https://smith.langchain.com/settings)的 `Workspaces` 部分中的 `Workspace members` 选项卡。

每个用户都会有一个 **Role** 下拉菜单，您可以使用它来为他们分配角色。

![Assign Role](/langsmith/images/assign-role.png)

您还可以邀请具有特定角色的新用户。

![Invite User](/langsmith/images/invite-user.png)

## 为您的组织设置 SAML 单点登录

单点登录（SSO）功能**适用于企业云**客户，可通过单一身份验证源访问 LangSmith。这使管理员能够集中管理团队访问权限，并使信息更加安全。

LangSmith 的 SSO 配置基于 SAML（安全断言标记语言）2.0 标准构建。SAML 2.0 支持将身份提供商（IdP）连接到您的组织，以实现更简单、更安全的登录体验。

单点登录（SSO）服务允许用户使用一组凭据（例如，用户名或电子邮件地址和密码）访问多个应用程序。该服务仅对最终用户进行一次身份验证，即可访问用户被授予权限的所有应用程序，并在同一会话期间用户切换应用程序时消除进一步的提示。SSO 的好处包括：

- 为组织所有者简化跨系统的用户管理。
- 使组织能够强制执行自己的安全策略（例如，多因素认证）。
- 消除了最终用户记住和管理多个密码的需要。通过允许在多个应用程序的单一接入点登录，简化了最终用户体验。

### 即时（JIT）配置

LangSmith 在使用 SAML SSO 时支持即时配置。这允许通过 SAML SSO 登录的用户自动作为成员加入组织并进入选定的工作空间。

<Note>

JIT 配置仅对新用户运行，即尚未通过[其他登录方式](/langsmith/authentication-methods#cloud)使用相同电子邮件地址访问该组织的用户。

</Note>

### 登录方式与访问权限

为组织完成 SAML SSO 配置后，用户将能够通过 SAML SSO 以及[其他登录方式](/langsmith/authentication-methods#cloud)（例如用户名/密码或 Google 身份验证）登录：

- 通过 SAML SSO 登录时，用户只能访问配置了 SAML SSO 的相应组织。
- 仅将 SAML SSO 作为其唯一登录方式的用户没有[个人组织](/langsmith/administration-overview#organizations)。
- 通过任何其他方式登录时，用户可以访问配置了 SAML SSO 的组织以及他们所属的任何其他组织。

### 强制仅使用 SAML SSO

<Note>

在强制仅使用 SAML SSO 的组织中不支持用户邀请。初始工作空间成员资格和角色由 JIT 配置决定，之后的更改可以在 UI 中管理。
为了在自动化用户管理方面获得更大的灵活性，LangSmith 支持 SCIM。

</Note>

为确保用户只能在使用 SAML SSO 登录时访问组织，而不能使用其他方式，请勾选 **仅通过 SSO 登录** 复选框并点击 **保存**。一旦完成此操作，通过非 SSO 登录方式登录并访问该组织的用户将被要求使用 SAML SSO 重新登录。可以通过取消勾选该复选框并点击 **保存** 来切换回允许所有登录方式。

<Note>

您必须通过 SAML SSO 登录才能将此设置更新为 `仅 SAML SSO`。这是为了确保 SAML 设置有效，并避免用户被锁定在您的组织之外。

</Note>

如需故障排除，请参阅 [SAML SSO 常见问题解答](/langsmith/faq#saml-sso-faqs)。如果在设置 SAML SSO 时遇到问题，请通过 [support.langchain.com](https://support.langchain.com) 联系 LangChain 支持团队。

### 先决条件

<Note>

SAML SSO 适用于[企业版计划](https://www.langchain.com/pricing-langsmith)的组织。请[联系销售](https://www.langchain.com/contact-sales)了解更多信息。

</Note>

- 您的组织必须处于企业版计划。
- 您的身份提供商（IdP）必须支持 SAML 2.0 标准。
- 只有[`组织管理员`](/langsmith/organization-workspace-operations#sso-and-authentication)可以配置 SAML SSO。

有关将 SCIM 与 SAML 结合使用进行用户配置和取消配置的说明，请参阅 [SCIM 设置](#set-up-scim-for-your-organization)。

### 初始配置

<Note>

有关特定 IdP 的配置步骤，请参阅以下之一：

- [Entra ID](#entra-id-azure)
- [Google](#google)
- [Okta](#okta)

</Note>

1.  在您的 IdP 中：使用以下详细信息配置 SAML 应用程序，然后复制元数据 URL 或 XML 用于步骤 3。

<Note>

以下 URL 在美国和欧盟区域不同。请确保选择正确的链接。

</Note>

1.  单点登录 URL（或 ACS URL）：
    - 美国：[https://auth.langchain.com/auth/v1/sso/saml/acs](https://auth.langchain.com/auth/v1/sso/saml/acs)
    - 欧盟：[https://eu.auth.langchain.com/auth/v1/sso/saml/acs](https://eu.auth.langchain.com/auth/v1/sso/saml/acs)
2.  受众 URI（或 SP 实体 ID）：
    - 美国：[https://auth.langchain.com/auth/v1/sso/saml/metadata](https://auth.langchain.com/auth/v1/sso/saml/metadata)
    - 欧盟：[https://eu.auth.langchain.com/auth/v1/sso/saml/metadata](https://eu.auth.langchain.com/auth/v1/sso/saml/metadata)
3.  Name ID 格式：电子邮件地址。
4.  应用程序用户名：电子邮件地址。
5.  必需声明：`sub` 和 `email`。

2.  在 LangSmith 中：转到 **设置** -> **成员和角色** -> **SSO 配置**。填写所需信息并提交以激活 SSO 登录：

    1.  填写 `SAML 元数据 URL` 或 `SAML 元数据 XML`。
    2.  选择 `默认工作区角色` 和 `默认工作区`。通过 SSO 登录的新用户将被添加到指定的工作区并分配所选角色。

- `默认工作区角色` 和 `默认工作区` 是可编辑的。更新的设置仅适用于新用户，不适用于现有用户。
- （即将推出）`SAML 元数据 URL` 和 `SAML 元数据 XML` 是可编辑的。这通常仅在加密密钥轮换/过期或元数据 URL 更改但仍使用同一 IdP 时才需要。

### Entra ID (Azure)

更多信息，请参阅 Microsoft 的[文档](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/add-application-portal-setup-sso)。

<div id="create-application-entra-id">

</div>

**步骤 1：创建新的 Entra ID 应用程序集成**

1.  使用特权角色（例如，`全局管理员`）登录 [Azure 门户](https://portal.azure.com/#home)。在左侧导航窗格中，选择 `Entra ID` 服务。
2.  导航到 **企业应用程序**，然后选择 **所有应用程序**。
3.  点击 **创建你自己的应用程序**。
4.  在 **创建你自己的应用程序** 窗口中：
    1.  输入应用程序的名称（例如，`LangSmith`）。
    2.  选择 **集成在库中未找到的任何其他应用程序（非库）**。
5.  点击 **创建**。

**步骤 2：配置 Entra ID 应用程序并获取 SAML 元数据**

1.  打开您创建的企业应用程序。
2.  在左侧导航中，选择 **管理** > **单点登录**。
3.  在单点登录页面上，点击 **SAML**。
4.  更新 **基本 SAML 配置**：
    1.  `标识符（实体 ID）`：
 - 美国：[https://auth.langchain.com/auth/v1/sso/saml/metadata](https://auth.langchain.com/auth/v1/sso/saml/metadata)
 - 欧盟：[https://eu.auth.langchain.com/auth/v1/sso/saml/metadata](https://eu.auth.langchain.com/auth/v1/sso/saml/metadata)
    2.  `回复 URL（断言消费者服务 URL）`：
 - 美国：[https://auth.langchain.com/auth/v1/sso/saml/acs](https://auth.langchain.com/auth/v1/sso/saml/acs)
 - 欧盟：[https://eu.auth.langchain.com/auth/v1/sso/saml/acs](https://eu.auth.langchain.com/auth/v1/sso/saml/acs)
    3.  将 `中继状态`、`注销 URL` 和 `登录 URL` 留空。
    4.  点击 **保存**。
5.  确保存在必需的声明，其 **命名空间** 为：`http://schemas.xmlsoap.org/ws/2005/05/identity/claims`：
    1.  `sub`：`user.objectid`。
    2.  `emailaddress`：`user.userprincipalname` 或 `user.mail`（如果使用后者，请确保所有用户在 `联系信息` 下的 `电子邮件` 字段都已填写）。
    3.  （可选）对于 SCIM，请参阅[设置文档](/langsmith/user-management)以获取关于 `唯一用户标识符（Name ID）` 的具体说明。
6.  在基于 SAML 的登录页面上，在 **SAML 证书** 下，复制 **应用联合元数据 URL**。

**步骤 3：设置 LangSmith SSO 配置**

按照 [初始配置](#initial-configuration) 中 `填写所需信息` 步骤下的说明，使用上一步获取的元数据 URL 进行操作。

**步骤 4：验证 SSO 设置**

1.  在 Entra ID 中将应用程序分配给用户/组：
    1.  选择 **管理** > **用户和组**。
    2.  点击 **添加用户/组**。
    3.  在 **添加分配** 窗口中：
 1.  在 **用户** 下，点击 **未选择**。
 2.  搜索要分配给企业应用程序的用户，然后点击 **选择**。
 3.  确认用户已选中，然后点击 **分配**。

2.  让用户通过 **SSO 配置** 页面上的唯一登录 URL 登录，或者转到 **管理** > **单一登录** 并选择 **测试 (应用程序名称) 的单一登录**。

### Google

更多信息，请参阅 Google 的 [文档](https://support.google.com/a/answer/6087519)。

**步骤 1：创建并配置 Google Workspace SAML 应用程序**

1.  确保您已使用具有适当权限的管理员帐户登录。
2.  在管理控制台中，转到 **菜单** -> **应用** -> **网络和移动应用**。
3.  点击 **添加应用**，然后点击 **添加自定义 SAML 应用**。
4.  输入应用名称，并可选择上传图标。点击 **继续**。
5.  在 Google 身份提供商详细信息页面，下载 **IDP 元数据** 并保存以备步骤 2 使用。点击 **继续**。
6.  在 `服务提供商详细信息` 窗口中，输入：
    1.  `ACS URL`：
 - 美国区：[https://auth.langchain.com/auth/v1/sso/saml/acs](https://auth.langchain.com/auth/v1/sso/saml/acs)
 - 欧盟区：[https://eu.auth.langchain.com/auth/v1/sso/saml/acs](https://eu.auth.langchain.com/auth/v1/sso/saml/acs)
    2.  `实体 ID`：
 - 美国区：[https://auth.langchain.com/auth/v1/sso/saml/metadata](https://auth.langchain.com/auth/v1/sso/saml/metadata)
 - 欧盟区：[https://eu.auth.langchain.com/auth/v1/sso/saml/metadata](https://eu.auth.langchain.com/auth/v1/sso/saml/metadata)
    3.  将 `起始 URL` 和 `签名响应` 复选框留空。
    4.  将 `名称 ID` 格式设置为 `EMAIL`，并将 `名称 ID` 保留为默认值 (`基本信息 > 主要电子邮件`)。
    5.  点击 `继续`。
7.  使用 `添加映射` 确保所需的声明存在：
    1.  `基本信息 > 主要电子邮件` -> `email`

**步骤 2：设置 LangSmith SSO 配置**

按照 [初始配置](#initial-configuration) 中 `填写所需信息` 步骤下的说明，使用上一步的 `IDP 元数据` 作为元数据 XML。

**步骤 3：在 Google 中启用 SAML 应用**

1.  在 `菜单 -> 应用 -> 网络和移动应用` 下选择 SAML 应用。
2.  点击 `用户访问`。
3.  开启服务：
    1.  要为组织中的所有人开启服务，请点击 `为所有人开启`，然后点击 `保存`。
    2.  要为某个组织单位开启服务：
 1.  在左侧，选择组织单位，然后选择 `开启`。
 2.  如果服务状态设置为 `继承`，并且您希望保留更新的设置（即使父级设置更改），请点击 `覆盖`。
 3.  如果服务状态设置为 `已覆盖`，可以点击 `继承` 以恢复为与其父级相同的设置，或者点击 `保存` 以保留新设置（即使父级设置更改）。
    3.  要为跨组织单位或在组织单位内的一组用户开启服务，请选择一个访问组。有关详细信息，请转到 [使用群组自定义服务访问权限](https://support.google.com/a/answer/9050643)。
4.  确保您的用户用于登录 LangSmith 的电子邮件地址与他们用于登录您的 Google 域的电子邮件地址相匹配。

**步骤 4：验证 SSO 设置**

让具有访问权限的用户通过 **SSO 配置** 页面上的唯一登录 URL 登录，或者转到 Google 中的 SAML 应用程序页面并点击 **测试 SAML 登录**。

### Okta

#### 支持的功能

-   IdP 发起的 SSO（单点登录）
-   SP 发起的 SSO
-   即时（Just-In-Time）配置
-   强制仅使用 SSO

#### 配置步骤

更多信息，请参阅 Okta 的[文档](https://help.okta.com/en-us/content/topics/apps/apps_app_integration_wizard_saml.htm)。

**步骤 1：创建并配置 Okta SAML 应用程序**

<div id="via-okta-integration-network">

<b>通过 Okta 集成网络（推荐）</b>

</div>

1.  登录 [Okta](https://login.okta.com/)。
2.  在右上角，选择 **Admin**。在管理区域该按钮不可见。
3.  选择 `Browse App Integration Catalog`。
4.  找到并选择 LangSmith 应用程序。
5.  在应用程序概览页面，选择 **Add Integration**。
6.  将 `ApiUrlBase` 留空。
7.  填写 `AuthHost`：
    *   美国区：`auth.langchain.com`
    *   欧盟区：`eu.auth.langchain.com`
8.  （可选，如果计划同时使用 [SCIM](#set-up-scim-for-your-organization)）填写 `LangSmithUrl`：
    *   美国区：`api.smith.langchain.com`
    *   欧盟区：`eu.api.smith.langchain.com`
9.  在 **Application Visibility** 下，保持复选框未选中状态。
10. 选择 **Next**。
11. 选择 `SAML 2.0`。
12. 填写 `Sign-On Options`：
    *   `Application username format`：`Email`
    *   `Update application username on`：`Create and update`
    *   `Allow users to securely see their password`：保持**未选中**。
13. 从 **Sign On Options** 页面复制 **Metadata URL**，以便在下一步中使用。

**通过自定义应用程序集成**

<Warning>

SCIM 与此配置方法不兼容。请参考 [<strong>通过 Okta 集成网络</strong>](#via-okta-integration-network)。

</Warning>

1.  以管理员身份登录 Okta，并进入 **Okta Admin console**。
2.  在 **Applications** > **Applications** 下，点击 **Create App Integration**。
3.  选择 **SAML 2.0**。
4.  输入 `App name`（例如，`LangSmith`），并可选择性地添加 **App logo**，然后点击 **Next**。
5.  在 **Configure SAML** 页面输入以下信息：
    1.  `Single sign-on URL` (`ACS URL`)。保持 `Use this for Recipient URL and Destination URL` 为选中状态：
 *   美国区：[https://auth.langchain.com/auth/v1/sso/saml/acs](https://auth.langchain.com/auth/v1/sso/saml/acs)
 *   欧盟区：[https://eu.auth.langchain.com/auth/v1/sso/saml/acs](https://eu.auth.langchain.com/auth/v1/sso/saml/acs)
    2.  `Audience URI (SP Entity ID)`：
 *   美国区：[https://auth.langchain.com/auth/v1/sso/saml/metadata](https://auth.langchain.com/auth/v1/sso/saml/metadata)
 *   欧盟区：[https://eu.auth.langchain.com/auth/v1/sso/saml/metadata](https://eu.auth.langchain.com/auth/v1/sso/saml/metadata)
    3.  `Name ID format`：**Persistent**。
    4.  `Application username`：`email`。
    5.  其余字段留空或保持默认值。
    6.  点击 **Next**。
6.  点击 **Finish**。
7.  从 **Sign On** 页面复制 **Metadata URL**，以便在下一步中使用。

**步骤 2：设置 LangSmith SSO 配置**

按照 **填写所需信息** 步骤中 [初始配置](#initial-configuration) 下的说明，使用上一步中的元数据 URL。

**步骤 3：在 Okta 中将用户分配给 LangSmith**

1.  在 **Applications** > **Applications** 下，选择在步骤 1 中创建的 SAML 应用程序。
2.  在 **Assignments** 选项卡下，点击 **Assign**，然后选择 **Assign to People** 或 **Assign to Groups**。
3.  进行所需的选择，然后点击 **Assign** 和 **Done**。

**步骤 4：验证 SSO 设置**

让拥有访问权限的用户通过 `SSO Configuration` 页面上的唯一登录 URL 登录，或者让用户从其 Okta 仪表板中选择该应用程序。

#### SP 发起的 SSO

一旦配置了服务提供商发起的 SSO，用户就可以使用唯一的登录 URL 登录。您可以在 LangSmith UI 的 **Organization members and roles** 下的 **SSO configuration** 中找到此 URL。

## 为您的组织设置 SCIM

跨域身份管理系统（SCIM）是一个开放标准，允许自动化用户配置。使用 SCIM，您可以在 LangSmith [组织和工作空间](/langsmith/administration-overview) 中自动配置和取消配置用户，使用户访问权限与您组织的身份提供者保持同步。

<Note>

SCIM 适用于 [企业版计划](https://www.langchain.com/pricing) 的组织。[联系销售](https://www.langchain.com/contact-sales) 以了解更多信息。

SCIM 在 Helm chart 版本 0.10.41（应用程序版本 0.10.108）及更高版本上可用。

SCIM 支持仅为 API 级别（请参阅以下说明）。

</Note>

SCIM 消除了手动管理用户的需要，并确保用户访问权限始终与您组织的身份系统保持同步。这可以实现：

- **自动化用户管理**：根据用户在您 IdP 中的状态，自动在 LangSmith 中添加、更新和移除用户。
- **减少管理开销**：无需在多个系统中手动管理用户访问权限。
- **提高安全性**：离开您组织的用户会自动从 LangSmith 中取消配置。
- **一致的访问控制**：用户属性和组成员资格在系统之间同步。
- **扩展团队访问控制**：高效管理拥有多个工作空间和自定义角色的大型团队。
- **角色分配**：为用户组选择特定的 [组织角色](/langsmith/rbac#organization-roles) 和 [工作空间角色](/langsmith/rbac#workspace-roles)。

### 要求

#### 先决条件

- 您的组织必须采用企业版计划。
- 您的身份提供者（IdP）必须支持 SCIM 2.0。
- 只有 [组织管理员](/langsmith/administration-overview#organization-roles) 可以配置 SCIM。
- 对于云客户：您的组织必须能够配置 [SAML SSO](#set-up-saml-sso-for-your-organization)。
- 对于自托管客户：必须启用 [使用客户端密钥的 OAuth](/langsmith/self-host-sso#with-secret) 认证模式。
- 对于自托管客户，必须允许从身份提供者到 LangSmith 的网络流量：
  - Microsoft Entra ID 支持允许列出 IP 范围或基于代理的解决方案来提供连接性。
（[详情](https://learn.microsoft.com/en-us/entra/identity/app-provisioning/use-scim-to-provision-users-and-groups#ip-ranges)）。
  - Okta 支持允许列出 IP 或域名（[详情](https://help.okta.com/en-us/content/topics/security/ip-address-allow-listing.htm)）
或基于代理的解决方案（[详情](https://help.okta.com/en-us/content/topics/provisioning/opp/opp-main.htm)）来提供连接性。

<Note>

SCIM 连接通常需要 HTTP/1.1 或更高版本。如果您的客户端使用 HTTP/1.0，您可能会遇到 `426 Upgrade Required` 错误。

</Note>

#### 角色优先级

当用户属于同一工作空间的多个组时，适用以下优先级：

1. **组织管理员组** 具有最高优先级。这些组中的用户将在所有工作空间中拥有 `Admin` 权限。
2. **最近创建的工作空间特定组** 优先于其他工作空间组。

<Note>

当组被删除或用户从组中移除时，他们的访问权限将根据其剩余的组成员资格，按照优先级规则进行更新。

SCIM 组成员资格将覆盖手动分配的角色或通过即时（JIT）配置分配的角色。我们建议禁用 JIT 配置以避免冲突。

</Note>

#### 电子邮件验证

仅在云环境中，使用 SCIM 创建新用户会向该用户发送一封电子邮件。
他们必须通过点击此电子邮件中的链接来验证其电子邮件地址。
该链接在 24 小时后过期，如果需要，可以通过 SCIM 移除并重新添加用户来重新发送。

### 属性和映射

#### 组命名约定

<Warning>

通过 SCIM 重命名群组<strong>不</strong>受支持。群组名称是持久性的，因为它们必须与 LangSmith 中的角色名称和/或工作空间名称匹配。

</Warning>

群组成员关系通过特定的命名约定映射到 LangSmith 工作空间成员关系和工作空间角色：

**组织管理员群组**

格式：`<可选前缀>Organization Admin` 或 `<可选前缀>Organization Admins`

示例：

- `LS:Organization Admins`
- `Groups-Organization Admins`
- `Organization Admin`

**特定工作空间群组**

格式：`<可选前缀><组织角色名称>:<工作空间名称>:<工作空间角色名称>`

示例：

- `LS:Organization User:Production:Annotators`
- `Groups-Organization User:Engineering:Developers`
- `Organization User:Marketing:Viewers`

### 映射关系

虽然具体操作可能因身份提供商而异，但这些映射关系展示了 LangSmith SCIM 集成所支持的内容：

#### 用户属性

| **LangSmith 应用属性**         | **身份提供商属性**                       | **匹配优先级** |
| ------------------------------ | ---------------------------------------- | -------------- |
| `userName`<sup>1</sup>         | 电子邮件地址                             |                |
| `active`                       | `!deactivated`                           |                |
| `emails[type eq "work"].value` | 电子邮件地址<sup>2</sup>                 |                |
| `name.formatted`               | `displayName` 或 `givenName + familyName`<sup>3</sup> |                |
| `givenName`                    | `givenName`                              |                |
| `familyName`                   | `familyName`                             |                |
| `externalId`                   | `sub`<sup>4</sup>                        | 1              |

1. LangSmith 不要求 `userName`
1. 电子邮件地址是必需的
1. 如果您的 `displayName` 不符合 `Firstname Lastname` 格式，请使用计算表达式
1. 为避免不一致，对于云客户，此值应与 SAML `NameID` 断言匹配；对于自托管客户，应与 OAuth2.0 声明 `sub` 匹配。

#### 群组属性

| **LangSmith 应用属性** | **身份提供商属性** | **匹配优先级** |
| ---------------------- | ------------------ | -------------- |
| `displayName`          | `displayName`<sup>1</sup> | 1              |
| `externalId`           | `objectId`         |                |
| `members`              | `members`          |                |

1. 群组必须遵循[群组命名约定](#group-naming-convention)部分描述的命名约定。
   如果您的公司有群组命名策略，则应改为从身份提供商的 `description` 属性进行映射，并根据[群组命名约定](#group-naming-convention)部分设置描述。

### 步骤 1 - 配置 SAML SSO（仅限云）

[SAML SSO](#set-up-saml-sso-for-your-organization) 配置有两种情况：

1. 如果您的组织已配置 SAML SSO，则应跳过最初添加应用程序的步骤（[从 Okta 集成网络添加应用程序](#add-application-okta-oin) 或 [创建新的 Entra ID 应用程序集成](#create-application-entra-id)），因为您已经配置了一个应用程序，只需启用配置即可。
1. 如果您是首次配置 SAML SSO 并同时配置 SCIM，请先按照说明[设置 SAML SSO](#set-up-saml-sso-for-your-organization)，*然后*按照此处的说明启用 SCIM。

#### NameID 格式

LangSmith 使用 SAML NameID 来识别用户。NameID 是 SAML 响应中的必填字段，且不区分大小写。

NameID 必须满足以下条件：

1. 对每个用户保持唯一性。
2. 是一个永不更改的持久性值，例如随机生成的唯一用户 ID。
3. 在每次登录尝试中精确匹配。它不应依赖于用户输入。

NameID 不应是电子邮件地址或用户名，因为电子邮件地址和用户名更有可能随时间变化，并且可能区分大小写。

除非您使用的字段（如电子邮件）需要不同的格式，否则 NameID 格式必须为 `Persistent`。

### 步骤 2 - 禁用 JIT 预配

在启用 SCIM 之前，请禁用[即时（JIT）预配](/langsmith/user-management#just-in-time-jit-provisioning)，以防止自动和手动用户预配之间发生冲突。

#### 为云环境禁用 JIT

使用 `PATCH /orgs/current/info` [端点](https://api.smith.langchain.com/redoc#tag/orgs/operation/update_current_organization_info_api_v1_orgs_current_info_patch)：

```bash
curl -X PATCH $LANGCHAIN_ENDPOINT/orgs/current/info \
  -H "X-Api-Key: $LANGCHAIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jit_provisioning_enabled": false}'
```

#### 为自托管环境禁用 JIT

从 LangSmith chart 版本 **0.11.14** 开始，您可以为使用 SSO 的自托管组织禁用 JIT 预配。要禁用，请设置以下值：

```yaml
commonEnv:
  - name: SELF_HOSTED_JIT_PROVISIONING_ENABLED
    value: "false"
```

### 步骤 3 - 生成 SCIM 承载令牌

<Note>

在自托管环境中，下面的完整 URL 可能类似于 `https://langsmith.yourdomain.com/api/v1/platform/orgs/current/scim/tokens`（无子域名，注意 `/api/v1` 路径前缀）或 `https://langsmith.yourdomain.com/subdomain/api/v1/platform/orgs/current/scim/tokens`（有子域名）- 更多详情请参阅[入口文档](/langsmith/self-host-ingress)。

</Note>

为您的组织生成一个 SCIM 承载令牌。此令牌将由您的 IdP 用于验证 SCIM API 请求。确保环境变量设置正确，例如：

```bash
curl -X POST $LANGCHAIN_ENDPOINT/v1/platform/orgs/current/scim/tokens \
  -H "X-Api-Key: $LANGCHAIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"description": "Your description here"}'
```

请注意，SCIM 承载令牌的值仅在此请求的响应中可用。还存在以下附加端点：

- `GET /v1/platform/orgs/current/scim/tokens`
- `GET /v1/platform/orgs/current/scim/tokens/{scim_token_id}`
- `PATCH /v1/platform/orgs/current/scim/tokens/{scim_token_id}`（仅支持 `description` 字段）
- `DELETE /v1/platform/orgs/current/scim/tokens/{scim_token_id}`

### 步骤 4 - 配置您的身份提供商

<Note>

如果您使用 Azure Entra ID（原 Azure AD）或 Okta，则有特定的身份提供商设置说明（请参阅 [Azure Entra ID](#azure-entra-id-configuration-steps)、[Okta](#okta)）。上述要求和步骤适用于所有身份提供商。

</Note>

#### Azure Entra ID 配置步骤

更多信息，请参阅 Microsoft 的[文档](https://learn.microsoft.com/en-us/entra/identity/app-provisioning/user-provisioning)。

<Note>

在自托管安装中，`oid` JWT 声明被用作 `sub`。
更多详情请参阅[此 Microsoft Learn 链接](https://learn.microsoft.com/en-us/answers/questions/5546297/how-to-link-oidc-users-with-scim)
和[相关配置说明](/langsmith/self-host-sso#override-sub-claim)。

</Note>

**步骤 1：在您的企业应用程序中配置 SCIM**

1.  使用特权角色（例如 `Global Administrator`）登录 [Azure 门户](https://portal.azure.com/#home)。
2.  导航到您现有的 LangSmith 企业应用程序。
3.  在左侧导航栏中，选择 **管理** > **预配**。
4.  点击 **开始使用**。

**步骤 2：配置管理员凭据**

1.  在 **管理员凭据** 下：
    - **租户 URL**：

- 美国：`https://api.smith.langchain.com/scim/v2`
- 欧盟：`https://eu.api.smith.langchain.com/scim/v2`
- 自托管：`<langsmith_url>/scim/v2`

- **密钥令牌**：输入在步骤 3 中生成的 SCIM 承载令牌。

2. 点击 **测试连接** 以验证配置。

3. 点击 **保存**。

**步骤 3：配置属性映射**

在 `映射` 下配置以下属性映射：

**用户属性**

将 **目标对象操作** 设置为 `创建` 和 `更新`（为安全起见，开始时禁用 `删除`）：

| **LangSmith 应用属性**         | **Microsoft Entra ID 属性**                     | **匹配优先级** |
| :-----------------------------: | :---------------------------------------------: | :-------------: |
| `userName`                     | `userPrincipalName`                            |                |
| `active`                       | `Not([IsSoftDeleted])`                         |                |
| `emails[type eq "work"].value` | `mail`1                                        |                |
| `name.formatted`               | `displayName` 或 `Join(" ", [givenName], [surname])`2 |                |
| `externalId`                   | `objectId`3                                    | 1              |

1. 用户的电子邮件地址必须存在于 Entra ID 中。
2. 如果您的 `displayName` 与 `名 姓` 的格式不匹配，请使用 `Join` 表达式。
3. 为避免不一致，这应与 SAML NameID 断言和 `sub` OAuth2.0 声明匹配。对于云中的 SAML SSO，所需的 `唯一用户标识符 (Name ID)` 声明应为 `user.objectID`，且 `名称标识符格式` 应为 `persistent`。

**组属性**

将 **目标对象操作** 仅设置为 `创建` 和 `更新`（为安全起见，开始时禁用 `删除`）：

| **LangSmith 应用属性** | **Microsoft Entra ID 属性** | **匹配优先级** |
| :---------------------: | :-------------------------: | :-------------: |
| `displayName`           | `displayName`1             | 1              |
| `externalId`            | `objectId`                 |                |
| `members`               | `members`                  |                |

1. 组必须遵循 [组命名约定](#group-naming-convention) 部分中描述的命名约定。
   如果您的公司有组命名策略，则应从 `description` Microsoft Entra ID 属性进行映射，并根据 [组命名约定](#group-naming-convention) 部分设置描述。

**步骤 4：分配用户和组**

1. 在 **应用程序** > **应用程序** 下，选择您的 LangSmith 企业应用程序。
2. 在 **分配** 选项卡下，点击 **分配**，然后选择 **分配给人员** 或 **分配给组**。
3. 进行所需的选择，然后点击 **分配** 和 **完成**。

**步骤 5：启用配置**

1. 在 **配置** 下，将 **配置状态** 设置为 `开启`。
2. 监控初始同步，确保用户和组配置正确。
3. 验证无误后，为用户和组映射启用 `删除` 操作。

如需故障排除，请参阅 [SAML SSO 常见问题解答](/langsmith/faq#saml-sso-faqs)。如果在设置 SCIM 时遇到问题，请通过 [support.langchain.com](https://support.langchain.com) 联系 LangChain 支持团队。

#### Okta 配置步骤

<Note>

您必须使用 [Okta 生命周期管理](https://www.okta.com/products/lifecycle-management/) 产品。此产品层级是在 Okta 上使用 SCIM 所必需的。

</Note>

<div id="supported-features">

<b>支持的功能</b>

</div>

- 创建用户
- 更新用户属性
- 停用用户
- 组推送（**不支持组重命名**）
- 导入用户
- 导入组

<div id="add-application-okta-oin">

<b>步骤 1：从 Okta 集成网络添加应用程序</b>

</div>

<Note>

如果您已通过 SAML（云端）或 OAuth2.0 with OIDC（自托管）配置了 SSO 登录，请跳过此步骤。

</Note>

云端配置请参阅 [SAML SSO 设置](#okta)，自托管配置请参阅 [OAuth2.0 设置](/langsmith/self-host-sso#okta-idp-setup)。

**步骤 2：配置 API 集成**

1.  在“常规”选项卡中，确保 `LangSmithUrl` 已根据 [步骤 1](#add-application-okta-oin) 的说明填写。
2.  在“配置”选项卡中，选择 `Integration`。
3.  选择 `Edit`，然后选择 `Enable API integration`。
4.  在 API Token 字段中，粘贴您[在上面生成的](#step-3-generate-scim-bearer-token) SCIM 令牌。
5.  保持 `Import Groups` 为选中状态。
6.  要验证配置，请选择 Test API Credentials。
7.  选择 Save。
8.  保存 API 集成详细信息后，左侧会出现新的设置选项卡。选择 `To App`。
9.  选择 Edit。
10. 为 Create Users、Update Users 和 Deactivate Users 选中 Enable 复选框。
11. 选择 Save。
12. 在 Assignments 选项卡中分配用户和/或组。已分配的用户将在您的 LangSmith 群组中创建和管理。

**步骤 3：配置用户配置设置**

1.  配置配置：在 `Provisioning > To App > Provisioning to App` 下，点击 `Edit`，然后勾选 `Create Users`、`Update User Attributes` 和 `Deactivate Users`。
2.  在 `<application_name> Attribute Mappings` 下，按如下所示设置用户属性映射，并删除其余部分：

![SCIM Okta 用户属性映射](/langsmith/images/scim_okta_user_attributes.png)

**步骤 4：推送群组**

<Note>

Okta 除了群组名称本身外，不支持群组属性，因此群组名称*必须*遵循[群组命名约定](#group-naming-convention)部分中描述的命名约定。

</Note>

按照 Okta 的[启用群组推送](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-enable-group-push.htm)说明，配置按名称或按规则推送的群组。

#### 其他身份提供商

其他身份提供商尚未经过测试，但根据其 SCIM 实现情况，可能可以正常工作。
