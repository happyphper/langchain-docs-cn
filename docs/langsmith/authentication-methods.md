---
title: 认证方法
sidebarTitle: Authentication methods
---
LangSmith 支持多种身份验证方法，方便用户注册和登录。

## 云平台

### 邮箱/密码

用户可以使用邮箱地址和密码注册并登录 LangSmith。

### 社交登录提供商

用户也可以使用其 GitHub 或 Google 的凭据登录。

### SAML 单点登录

企业客户可以配置 [SAML 单点登录](/langsmith/user-management) 和 [SCIM](/langsmith/user-management)。

## 自托管

自托管客户对其用户如何登录 LangSmith 拥有更多控制权。有关配置选项的更深入介绍，请参阅 [自托管文档](/langsmith/self-hosted) 和 [Helm chart](https://github.com/langchain-ai/helm/tree/main/charts/langsmith)。

### 使用 OAuth 2.0 和 OIDC 的单点登录

生产环境安装应配置单点登录，以便使用外部身份提供商。这使得用户可以通过像 Auth0/Okta 这样的身份平台登录。LangSmith 支持几乎所有符合 OIDC 标准的提供商。在 [SSO 配置指南](/langsmith/self-host-sso) 中了解更多关于配置单点登录的信息。

### 邮箱/密码（又称基础认证）

此认证方法几乎不需要配置，因为它不需要外部身份提供商。它最适合用于自托管试用。在 [基础认证配置指南](/langsmith/self-host-basic-auth) 中了解更多信息。

### 无认证

<Warning>

此认证模式将在基础认证推出后被移除。

</Warning>

如果未启用任何身份验证方法，则自托管安装不需要任何登录/注册。此配置应仅用于在基础设施层面验证安装，因为在此模式下支持的功能集受到限制，仅支持单一组织和单一工作空间。
