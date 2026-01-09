---
title: 设置代理身份验证（Beta）
description: 通过 Agent Auth，使用 OAuth 2.0 凭证为代理（agents）启用对任何系统的安全访问。
---

<Note>
代理身份验证仅适用于 [LangSmith 云部署](/langsmith/deploy-to-cloud)。
</Note>

<Note>
代理身份验证处于 <strong>Beta</strong> 阶段，正在积极开发中。如需提供反馈或使用此功能，请联系 [LangChain 团队](https://forum.langchain.com/c/help/langsmith/)。
</Note>

## 安装

从 PyPI 安装 Agent Auth 客户端库：

::: code-group

```bash [pip]
pip install langchain-auth
```

```bash [uv]
uv add langchain-auth
```

:::

## 快速开始

### 1. 初始化客户端

```python
from langchain_auth import Client

client = Client(api_key="your-langsmith-api-key")
```

### 2. 设置 OAuth 提供者

在代理可以进行身份验证之前，您需要使用以下流程配置一个 OAuth 提供者：

1.  为您的 OAuth 提供者选择一个在 LangChain 平台中使用的唯一标识符（例如，"github-local-dev"、"google-workspace-prod"）。
2.  前往您的 OAuth 提供者的开发者控制台，创建一个新的 OAuth 应用程序。
3.  使用以下结构在您的 OAuth 提供者中设置回调 URL：
```
https://smith.langchain.com/host-oauth-callback/{provider_id}
```
例如，如果您的 provider_id 是 "github-local-dev"，请使用：
```
https://smith.langchain.com/host-oauth-callback/github-local-dev
```
4.  使用 `client.create_oauth_provider()` 并传入您 OAuth 应用的凭据：

```python
new_provider = await client.create_oauth_provider(
    provider_id="{provider_id}", # 提供任何唯一的 ID。与提供者没有正式绑定关系。
    name="{provider_display_name}", # 提供任何显示名称
    client_id="{your_client_id}",
    client_secret="{your_client_secret}",
    auth_url="{auth_url_of_your_provider}",
    token_url="{token_url_of_your_provider}",
)
```

### 3. 从代理进行身份验证

客户端 `authenticate()` API 用于从预配置的提供者获取 OAuth 令牌。在首次调用时，它会引导调用者完成 OAuth 2.0 授权流程。

#### 在 LangGraph 上下文中

默认情况下，令牌使用 Assistant ID 参数限定在调用代理的范围内。

```python
auth_result = await client.authenticate(
    provider="{provider_id}",
    scopes=["scopeA"],
    user_id="your_user_id" # 任何唯一的标识符，用于将此令牌限定在人类调用者的范围内
)

# 或者，如果您想要一个可以被任何代理使用的令牌，请设置 agent_scoped=False
auth_result = await client.authenticate(
    provider="{provider_id}",
    scopes=["scopeA"],
    user_id="your_user_id",
    agent_scoped=False
)
```

在执行过程中，如果需要身份验证，SDK 将抛出一个 [中断](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/add-human-in-the-loop/#pause-using-interrupt)。代理执行暂停，并向用户显示 OAuth URL：

![显示 OAuth URL 的 Studio 中断](/images/langgraph-auth-interrupt.png)

用户完成 OAuth 身份验证并且我们从提供者收到回调后，他们将看到身份验证成功页面。

![GitHub OAuth 成功页面](/images/github-auth-success.png)

然后，代理将从其暂停的点恢复执行，并且该令牌可用于任何 API 调用。我们存储并刷新 OAuth 令牌，以便用户或代理将来使用该服务时无需再进行 OAuth 流程。

```python
token = auth_result.token
```

#### 在 LangGraph 上下文之外

向用户提供 `auth_url` 以进行带外 (out-of-band) OAuth 流程。

```python
# 默认：用户范围的令牌（适用于此用户下的任何代理）
auth_result = await client.authenticate(
    provider="{provider_id}",
    scopes=["scopeA"],
    user_id="your_user_id"
)

if auth_result.needs_auth:
    print(f"Complete OAuth at: {auth_result.auth_url}")
    # 等待完成
    completed_auth = await client.wait_for_completion(auth_result.auth_id)
    token = completed_auth.token
else:
    token = auth_result.token
```
