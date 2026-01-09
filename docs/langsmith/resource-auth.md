---
title: 使对话私密化
sidebarTitle: Make conversations private
---
在本教程中，您将扩展[上一个教程中创建的聊天机器人](/langsmith/set-up-custom-auth)，为每个用户提供他们自己的私人对话。您将添加[资源级访问控制](/langsmith/auth#single-owner-resources)，使用户只能看到自己的对话线程。

![授权流程：认证后，授权处理器为每个资源标记 owner=user id，并返回一个过滤器，使用户只能看到自己的线程。](/langsmith/images/authorization.png)

## 先决条件

在开始本教程之前，请确保您[第一个教程中的机器人](/langsmith/set-up-custom-auth)能够正常运行且无错误。

## 1. 添加资源授权

回想一下，在上一个教程中，<a href="https://reference.langchain.com/python/langsmith/deployment/sdk/#langgraph_sdk.auth.Auth" target="_blank" rel="noreferrer" class="link"><code>Auth</code></a> 对象允许您注册一个[认证函数](/langsmith/auth#authentication)，LangSmith 使用它来验证传入请求中的承载令牌。现在，您将使用它来注册一个**授权**处理器。

授权处理器是在认证**成功后**运行的函数。这些处理器可以向资源添加[元数据](/langsmith/auth#filter-operations)（例如谁拥有它们），并过滤每个用户可以看到的内容。

更新您的 `src/security/auth.py` 并添加一个在每个请求上运行的授权处理器：

```python {highlight={29-39}} title="src/security/auth.py"
from langgraph_sdk import Auth

# 保留上一个教程中的测试用户
VALID_TOKENS = {
    "user1-token": {"id": "user1", "name": "Alice"},
    "user2-token": {"id": "user2", "name": "Bob"},
}

auth = Auth()

@auth.authenticate
async def get_current_user(authorization: str | None) -> Auth.types.MinimalUserDict:
    """我们上一个教程中的认证处理器。"""
    assert authorization
    scheme, token = authorization.split()
    assert scheme.lower() == "bearer"

    if token not in VALID_TOKENS:
        raise Auth.exceptions.HTTPException(status_code=401, detail="Invalid token")

    user_data = VALID_TOKENS[token]
    return {
        "identity": user_data["id"],
    }

@auth.on
async def add_owner(
    ctx: Auth.types.AuthContext,  # 包含当前用户的信息
    value: dict,  # 正在创建/访问的资源
):
    """使资源对其创建者私有。"""
    # 示例：
    # ctx: AuthContext(
    #     permissions=[],
    #     user=ProxyUser(
    #         identity='user1',
    #         is_authenticated=True,
    #         display_name='user1'
    #     ),
    #     resource='threads',
    #     action='create_run'
    # )
    # value:
    # {
    #     'thread_id': UUID('1e1b2733-303f-4dcd-9620-02d370287d72'),
    #     'assistant_id': UUID('fe096781-5601-53d2-b2f6-0d3403f7e9ca'),
    #     'run_id': UUID('1efbe268-1627-66d4-aa8d-b956b0f02a41'),
    #     'status': 'pending',
    #     'metadata': {},
    #     'prevent_insert_if_inflight': True,
    #     'multitask_strategy': 'reject',
    #     'if_not_exists': 'reject',
    #     'after_seconds': 0,
    #     'kwargs': {
    #         'input': {'messages': [{'role': 'user', 'content': 'Hello!'}]},
    #         'command': None,
    #         'config': {
    #             'configurable': {
    #                 'langgraph_auth_user': ... Your user object...
    #                 'langgraph_auth_user_id': 'user1'
    #             }
    #         },
    #         'stream_mode': ['values'],
    #         'interrupt_before': None,
    #         'interrupt_after': None,
    #         'webhook': None,
    #         'feedback_keys': None,
    #         'temporary': False,
    #         'subgraphs': False
    #     }
    # }

    # 做两件事：
    # 1. 将用户的 ID 添加到资源的元数据中。每个 LangGraph 资源都有一个 `metadata` 字典，随资源持久化。
    # 这个元数据对于读取和更新操作中的过滤很有用
    # 2. 返回一个过滤器，让用户只能看到自己的资源
    filters = {"owner": ctx.user.identity}
    metadata = value.setdefault("metadata", {})
    metadata.update(filters)

    # 只让用户看到自己的资源
    return filters
```

处理器接收两个参数：

1.  `ctx` (<a href="https://reference.langchain.com/python/langsmith/deployment/sdk/#langgraph_sdk.auth.types.AuthContext" target="_blank" rel="noreferrer" class="link">AuthContext</a>)：包含当前 `user` 的信息、用户的 `permissions`、`resource`（"threads"、"crons"、"assistants"）以及正在执行的 `action`（"create"、"read"、"update"、"delete"、"search"、"create_run"）
2.  `value` (`dict`)：正在创建或访问的数据。此字典的内容取决于正在访问的资源和操作。有关如何获得更精细范围访问控制的信息，请参阅下面的[添加范围化授权处理器](#scoped-authorization)。

请注意，这个简单的处理器做了两件事：

1.  将用户的 ID 添加到资源的元数据中。
2.  返回一个元数据过滤器，使用户只能看到他们拥有的资源。

## 2. 测试私人对话

测试您的授权。如果设置正确，您将看到所有 ✅ 消息。请确保您的开发服务器正在运行（运行 `langgraph dev`）：

```python
from langgraph_sdk import get_client

# 为两个用户创建客户端
alice = get_client(
    url="http://localhost:2024",
    headers={"Authorization": "Bearer user1-token"}
)

bob = get_client(
    url="http://localhost:2024",
    headers={"Authorization": "Bearer user2-token"}
)

# Alice 创建一个助手
alice_assistant = await alice.assistants.create()
print(f"✅ Alice created assistant: {alice_assistant['assistant_id']}")

# Alice 创建一个线程并聊天
alice_thread = await alice.threads.create()
print(f"✅ Alice created thread: {alice_thread['thread_id']}")

await alice.runs.create(
    thread_id=alice_thread["thread_id"],
    assistant_id="agent",
    input={"messages": [{"role": "user", "content": "Hi, this is Alice's private chat"}]}
)

# Bob 尝试访问 Alice 的线程
try:
    await bob.threads.get(alice_thread["thread_id"])
    print("❌ Bob shouldn't see Alice's thread!")
except Exception as e:
    print("✅ Bob correctly denied access:", e)

# Bob 创建自己的线程
bob_thread = await bob.threads.create()
await bob.runs.create(
    thread_id=bob_thread["thread_id"],
    assistant_id="agent",
    input={"messages": [{"role": "user", "content": "Hi, this is Bob's private chat"}]}
)
print(f"✅ Bob created his own thread: {bob_thread['thread_id']}")

# 列出线程 - 每个用户只能看到自己的
alice_threads = await alice.threads.search()
bob_threads = await bob.threads.search()
print(f"✅ Alice sees {len(alice_threads)} thread")
print(f"✅ Bob sees {len(bob_threads)} thread")
```

输出：

```bash
✅ Alice created assistant: fc50fb08-78da-45a9-93cc-1d3928a3fc37
✅ Alice created thread: 533179b7-05bc-4d48-b47a-a83cbdb5781d
✅ Bob correctly denied access: Client error '404 Not Found' for url 'http://localhost:2024/threads/533179b7-05bc-4d48-b47a-a83cbdb5781d'
For more information check: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
✅ Bob created his own thread: 437c36ed-dd45-4a1e-b484-28ba6eca8819
✅ Alice sees 1 thread
✅ Bob sees 1 thread
```

这意味着：

1.  每个用户都可以在自己的线程中创建和聊天
2.  用户无法看到彼此的线程
3.  列出线程只显示自己的线程

<a id="scoped-authorization"></a>
## 3. 添加范围化授权处理器

宽泛的 `@auth.on` 处理器匹配所有[授权事件](/langsmith/auth#supported-resources)。这很简洁，但也意味着 `value` 字典的内容没有明确的范围，并且相同的用户级访问控制应用于每个资源。如果您想更精细，也可以控制资源上的特定操作。

更新 `src/security/auth.py` 以添加针对特定资源类型的处理器：

```python
# 保留我们之前的处理器...

from langgraph_sdk import Auth

@auth.on.threads.create
async def on_thread_create(
    ctx: Auth.types.AuthContext,
    value: Auth.types.on.threads.create.value,
):
    """创建线程时添加所有者。

    此处理器在创建新线程时运行，并做两件事：
    1. 设置正在创建的线程的元数据以跟踪所有权
    2. 返回一个过滤器，确保只有创建者可以访问它
    """
    # 示例 value:
    #  {'thread_id': UUID('99b045bc-b90b-41a8-b882-dabc541cf740'), 'metadata': {}, 'if_exists': 'raise'}

    # 将所有者元数据添加到正在创建的线程
    # 此元数据随线程存储并持久化
    metadata = value.setdefault("metadata", {})
    metadata["owner"] = ctx.user.identity

    # 返回过滤器以限制仅创建者可以访问
    return {"owner": ctx.user.identity}

@auth.on.threads.read
async def on_thread_read(
    ctx: Auth.types.AuthContext,
    value: Auth.types.on.threads.read.value,
):
    """只让用户读取自己的线程。

    此处理器在读取操作时运行。我们不需要设置
    元数据，因为线程已经存在 - 我们只需要
    返回一个过滤器以确保用户只能看到自己的线程。
    """
    return {"owner": ctx.user.identity}

@auth.on.assistants
async def on_assistants(
    ctx: Auth.types.AuthContext,
    value: Auth.types.on.assistants.value,
):
    # 为了说明目的，我们将拒绝所有
    # 触及助手资源的请求
    # 示例 value:
    # {
    #     'assistant_id': UUID('63ba56c3-b074-4212-96e2-cc333bbc4eb4'),
    #     'graph_id': 'agent',
    #     'config': {},
    #     'metadata': {},
    #     'name': 'Untitled'
    # }
    raise Auth.exceptions.HTTPException(
        status_code=403,
        detail="User lacks the required permissions.",
    )

# 假设您按 (user_id, resource_type, resource_id) 组织存储中的信息
@auth.on.store()
async def authorize_store(ctx: Auth.types.AuthContext, value: dict):
    # 每个存储项的 "namespace" 字段是一个元组，您可以将其视为项的目录。
    namespace: tuple = value["namespace"]
    assert namespace[0] == ctx.user.identity, "Not authorized"
```

请注意，现在不是只有一个全局处理器，而是有针对以下操作的特定处理器：

1.  创建线程
2.  读取线程
3.  访问助手

前三个匹配每个资源上的特定**操作**（参见[资源操作](/langsmith/auth#resource-specific-handlers)），而最后一个（`@auth.on.assistants`）匹配 `assistants` 资源上的*任何*操作。对于每个请求，LangGraph 将运行与正在访问的资源和操作最匹配的处理器。这意味着上述四个处理器将运行，而不是范围宽泛的 "`@auth.on`" 处理器。

尝试将以下测试代码添加到您的测试文件中：

```python
# ... 与之前相同
# 尝试创建一个助手。这应该失败
try:
    await alice.assistants.create("agent")
    print("❌ Alice shouldn't be able to create assistants!")
except Exception as e:
    print("✅ Alice correctly denied access:", e)

# 尝试搜索助手。这也应该失败
try:
    await alice.assistants.search()
    print("❌ Alice shouldn't be able to search assistants!")
except Exception as e:
    print("✅ Alice correctly denied access to searching assistants:", e)

# Alice 仍然可以创建线程
alice_thread = await alice.threads.create()
print(f"✅ Alice created thread: {alice_thread['thread_id']}")
```

输出：

```bash
✅ Alice created thread: dcea5cd8-eb70-4a01-a4b6-643b14e8f754
✅ Bob correctly denied access: Client error '404 Not Found' for url 'http://localhost:2024/threads/dcea5cd8-eb70-4a01-a4b6-643b14e8f754'
For more information check: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
✅ Bob created his own thread: 400f8d41-e946-429f-8f93-4fe395bc3eed
✅ Alice sees 1 thread
✅ Bob sees 1 thread
✅ Alice correctly denied access:
For more information check: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
✅ Alice correctly denied access to searching assistants:
```

恭喜！您已经构建了一个聊天机器人，其中每个用户都有自己的私人对话。虽然此系统使用简单的基于令牌的认证，但这些授权模式将与实现任何真实的认证系统一起工作。在下一个教程中，您将使用 OAuth2 将测试用户替换为真实的用户账户。

## 后续步骤

现在您可以控制对资源的访问，您可能希望：

1.  继续学习[连接认证提供程序](/langsmith/add-auth-server)以添加真实的用户账户。
2.  阅读更多关于[授权模式](/langsmith/auth#authorization)的信息。
3.  查看 <a href="https://reference.langchain.com/python/langsmith/deployment/sdk/#langgraph_sdk.auth.Auth" target="_blank" rel="noreferrer" class="link">API 参考</a> 以获取本教程中使用的接口和方法的详细信息。
