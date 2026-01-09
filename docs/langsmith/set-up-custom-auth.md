---
title: 设置自定义身份验证
sidebarTitle: Set up custom authentication
---
在本教程中，我们将构建一个仅允许特定用户访问的聊天机器人。我们将从 LangGraph 模板开始，逐步添加基于令牌的安全性。最终，您将拥有一个在允许访问前检查有效令牌的工作聊天机器人。

这是我们的身份验证系列的第一部分：

1. 设置自定义身份验证（您在此处）- 控制谁可以访问您的机器人
2. [使对话私有化](/langsmith/resource-auth) - 让用户拥有私有对话
3. [连接身份验证提供程序](/langsmith/add-auth-server) - 添加真实用户账户并使用 OAuth2 进行生产环境验证

本指南假设您基本熟悉以下概念：

* [**身份验证与访问控制**](/langsmith/auth)
* [**LangSmith**](/langsmith/home)

<Note>

自定义身份验证仅适用于 LangSmith SaaS 部署或企业自托管部署。

</Note>

## 1. 创建您的应用

使用 LangGraph 入门模板创建一个新的聊天机器人：

::: code-group

```bash [pip]
pip install -U "langgraph-cli[inmem]"
langgraph new --template=new-langgraph-project-python custom-auth
cd custom-auth
```

```bash [uv]
uv add "langgraph-cli[inmem]"
langgraph new --template=new-langgraph-project-python custom-auth
cd custom-auth
```

:::

该模板为我们提供了一个占位符 LangGraph 应用。通过安装本地依赖项并运行开发服务器来尝试它：

::: code-group

```bash [pip]
pip install -e .
langgraph dev
```

```bash [uv]
uv add .
langgraph dev
```

```bash [npm]
npx @langchain/langgraph-cli dev
```

:::

服务器将启动并在您的浏览器中打开 [Studio](/langsmith/studio)：

```
> - 🚀 API: http://127.0.0.1:2024
> - 🎨 Studio UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024
> - 📚 API Docs: http://127.0.0.1:2024/docs
>
> 此内存服务器专为开发和测试设计。
> 生产环境请使用 LangSmith。
```

如果您将此应用自托管在公共互联网上，任何人都可以访问它。

![无身份验证：开发服务器可公开访问，如果暴露在互联网上，任何人都可以访问机器人。](/langsmith/images/no-auth.png)

## 2. 添加身份验证

现在您有了一个基础的 LangGraph 应用，接下来为其添加身份验证。

<Note>

在本教程中，您将从硬编码令牌开始，以便于示例说明。您将在第三个教程中实现“生产就绪”的身份验证方案。

</Note>

<a href="https://reference.langchain.com/python/langsmith/deployment/sdk/#langgraph_sdk.auth.Auth" target="_blank" rel="noreferrer" class="link">Auth</a> 对象允许您注册一个身份验证函数，LangSmith 部署将在每个请求上运行此函数。该函数接收每个请求并决定是接受还是拒绝。

创建一个新文件 `src/security/auth.py`。您的代码将放在这里，用于检查用户是否被允许访问您的机器人：

```python {highlight={10,15-16}} title="src/security/auth.py"
from langgraph_sdk import Auth

# 这是我们的玩具用户数据库。请勿在生产环境中这样做
VALID_TOKENS = {
    "user1-token": {"id": "user1", "name": "Alice"},
    "user2-token": {"id": "user2", "name": "Bob"},
}

# "Auth" 对象是一个容器，LangGraph 将用它来标记我们的身份验证函数
auth = Auth()

# `authenticate` 装饰器告诉 LangGraph 将此函数作为中间件调用
# 用于每个请求。这将决定请求是否被允许
@auth.authenticate
async def get_current_user(authorization: str | None) -> Auth.types.MinimalUserDict:
    """检查用户的令牌是否有效。"""
    assert authorization
    scheme, token = authorization.split()
    assert scheme.lower() == "bearer"
    # 检查令牌是否有效
    if token not in VALID_TOKENS:
        raise Auth.exceptions.HTTPException(status_code=401, detail="Invalid token")

    # 如果有效则返回用户信息
    user_data = VALID_TOKENS[token]
    return {
        "identity": user_data["id"],
    }
```

请注意，您的 <a href="https://reference.langchain.com/python/langsmith/deployment/sdk/#langgraph_sdk.auth.Auth.authenticate" target="_blank" rel="noreferrer" class="link">Auth.authenticate</a> 处理程序做了两件重要的事情：

1. 检查请求的 [Authorization 头部](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) 中是否提供了有效令牌
2. 返回用户的 <a href="https://reference.langchain.com/python/langsmith/deployment/sdk/#langgraph_sdk.auth.types.MinimalUserDict" target="_blank" rel="noreferrer" class="link">MinimalUserDict</a>

现在，通过将以下内容添加到 <a href="https://reference.langchain.com/python/cloud/reference/cli/#configuration-file" target="_blank" rel="noreferrer" class="link">langgraph.json</a> 配置中，告诉 LangGraph 使用身份验证：

```json {highlight={7-9}} title="langgraph.json"
{
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/agent/graph.py:graph"
  },
  "env": ".env",
  "auth": {
    "path": "src/security/auth.py:auth"
  }
}
```

## 3. 测试您的机器人

再次启动服务器以测试所有功能：

```bash
langgraph dev --no-browser
```

如果您没有添加 `--no-browser`，Studio UI 将在浏览器中打开。默认情况下，即使使用自定义身份验证，我们也允许从 Studio 访问。这使得在 Studio 中开发和测试您的机器人更加容易。您可以通过在身份验证配置中设置 `disable_studio_auth: true` 来移除此替代身份验证选项：

```json
{
    "auth": {
        "path": "src/security/auth.py:auth",
        "disable_studio_auth": true
    }
}
```

## 4. 与您的机器人聊天

现在，您应该只有在请求头部提供有效令牌时才能访问机器人。然而，在您在本教程下一部分添加 [资源授权处理程序](/langsmith/auth#resource-specific-handlers) 之前，用户仍然能够访问彼此的资源。

![身份验证门允许带有有效令牌的请求通过，但尚未应用每个资源的过滤器——因此用户在下一步添加授权处理程序之前共享可见性。](/langsmith/images/authentication.png)

在文件或笔记本中运行以下代码：

```python
from langgraph_sdk import get_client

# 尝试不使用令牌（应该失败）
client = get_client(url="http://localhost:2024")
try:
    thread = await client.threads.create()
    print("❌ Should have failed without token!")
except Exception as e:
    print("✅ Correctly blocked access:", e)

# 尝试使用有效令牌
client = get_client(
    url="http://localhost:2024", headers={"Authorization": "Bearer user1-token"}
)

# 创建线程并聊天
thread = await client.threads.create()
print(f"✅ Created thread as Alice: {thread['thread_id']}")

response = await client.runs.create(
    thread_id=thread["thread_id"],
    assistant_id="agent",
    input={"messages": [{"role": "user", "content": "Hello!"}]},
)
print("✅ Bot responded:")
print(response)
```

您应该看到：

1. 没有有效令牌，我们无法访问机器人
2. 使用有效令牌，我们可以创建线程并聊天

恭喜！您已经构建了一个仅允许“已认证”用户访问的聊天机器人。虽然该系统（尚未）实现生产就绪的安全方案，但我们已经学习了如何控制对机器人访问的基本机制。在下一个教程中，我们将学习如何为每个用户提供他们自己的私有对话。

## 后续步骤

现在您可以控制谁可以访问您的机器人，您可能希望：

1. 继续教程，前往 [使对话私有化](/langsmith/resource-auth) 以了解资源授权。
2. 阅读更多关于 [身份验证概念](/langsmith/auth) 的内容。
3. 查看 <a href="https://reference.langchain.com/python/langsmith/deployment/sdk/#langgraph_sdk.auth.Auth" target="_blank" rel="noreferrer" class="link">Auth</a>、<a href="https://reference.langchain.com/python/langsmith/deployment/sdk/#langgraph_sdk.auth.Auth.authenticate" target="_blank" rel="noreferrer" class="link">Auth.authenticate</a> 和 <a href="https://reference.langchain.com/python/langsmith/deployment/sdk/#langgraph_sdk.auth.types.MinimalUserDict" target="_blank" rel="noreferrer" class="link">MinimalUserDict</a> 的 API 参考以获取更多身份验证详细信息。
