---
title: 远程 MCP 服务器
description: 将 Agent Builder 连接到流行的远程 MCP 服务器
---
您可以将 Agent Builder 连接到远程 MCP 服务器，以使用额外的工具和集成来扩展您的智能体。本页介绍如何添加自定义 MCP 服务器，并提供流行远程服务器的配置详情。

一个 [_MCP（模型上下文协议）服务器_](https://modelcontextprotocol.io/docs/getting-started/intro) 会暴露智能体在运行时可以调用的工具。

远程 MCP 服务器：

- 在 LangSmith 外部运行（通常通过 HTTPS）。
- 拥有自己的身份验证和授权机制。
- 充当您的智能体与外部系统之间的桥梁。

LangSmith Agent Builder 本身不执行这些工具，而是将请求转发给 MCP 服务器，并将结果返回给智能体。

### 工作原理

- Agent Builder 通过标准的 MCP 协议从远程 MCP 服务器发现工具。
- 在获取工具或调用工具时，会自动附加您在工作区中配置的请求头。请求头是随每个发送到 MCP 服务器的 HTTP 请求一起发送的键值对。它们通常用于身份验证（如 API 密钥或承载令牌），但也可以提供配置信息、内容类型或自定义元数据。
- 来自远程服务器的工具在 Agent Builder 中与内置工具一起可用。

**运行时**：Agent Builder 会自动连接到您的 MCP 服务器并使用其工具。

```mermaid
sequenceDiagram
    participant Agent as Agent Builder
    participant MCP as Remote MCP Server

    Agent->>MCP: 发现可用工具<br/>(附带配置的请求头)
    MCP-->>Agent: 返回工具列表

    Note over Agent,MCP: 稍后，当智能体需要工具时...

    Agent->>MCP: 调用工具<br/>(附带配置的请求头)
    MCP-->>Agent: 返回结果
```

以下部分向您展示如何将远程 MCP 服务器连接到 Agent Builder：

- [通用配置](#general-configuration)：为任何带有身份验证请求头的远程 MCP 服务器提供分步连接说明。如果您熟悉 MCP 服务器并希望快速参考，请使用此部分。
- [示例：连接自定义 MCP 服务器](#example-connecting-a-custom-mcp-server)：以基于 GitHub 的 MCP 服务器为例，提供详细的演练。如果您想查看包含特定身份验证详情的完整端到端示例，请使用此部分。

## 添加远程 MCP 服务器

在您的 LangSmith [工作区](/langsmith/administration-overview#workspaces) 中配置远程 MCP 服务器：

<Steps>

<Step title="导航到 MCP 服务器设置">

在 [LangSmith UI](https://smith.langchain.com) 中，选择左下角侧边栏的 <strong>Settings</strong>，然后选择 <strong>MCP Servers</strong> 选项卡。

</Step>

<Step title="添加服务器">

点击 <strong>Add server</strong> 并输入：
- <strong>Name</strong>：服务器的描述性名称
- <strong>URL</strong>：MCP 服务器的端点 URL

</Step>

<Step title="配置身份验证">

根据服务器的要求选择一种身份验证类型：

- <strong>Headers</strong>：添加随每个请求发送的键值对。最常见的模式是使用 Authorization 承载令牌：
    - <strong>Key</strong>：`Authorization`
    - <strong>Value</strong>：`Bearer API_KEY`

<Info>

如果您的 MCP 服务器需要额外的身份验证或配置参数，您可以添加多个请求头。每个请求头键值对都会随发送到服务器的每个请求一起发送。

</Info>

- <strong>OAuth 2.1 (Auto)</strong>：对于支持通过动态客户端注册进行 OAuth 的服务器，请选择此项。系统将提示您使用该服务的帐户登录。
- <strong>OAuth 2.1 (Manual)</strong>：对于支持 OAuth 但需要预先指定客户端 ID/密钥的服务器，请选择此项。在此流程中使用的 OAuth 提供商必须启用 <strong>PKCE</strong>。

<Tip>

有关特定的身份验证详情，请参阅每个 [受支持服务器](#supported-servers) 的配置详情。

</Tip>

</Step>

<Step title="保存并验证">

点击<strong>保存服务器</strong>。Agent Builder 将自动从您的 MCP 服务器发现可用工具，并使它们在您的智能体（agent）中可用。配置的标头将同时应用于工具发现请求和工具执行请求。

</Step>

</Steps>

## 更新您的 MCP 服务器 URL

<Warning>

更改自定义 MCP 服务器的 URL 将破坏任何使用该服务器工具的智能体（agent）。

</Warning>

Agent Builder 通过 MCP 服务器 URL 存储工具引用。如果您更新了自定义 MCP 服务器的 URL，现有智能体（agent）在尝试调用这些工具时将失败，因为存储的 URL 不再匹配。

要更新 MCP 服务器 URL：

1.  在工作区设置中更新您的 MCP 服务器 URL。
2.  对于每个使用该服务器工具的智能体（agent）：
    *   从智能体（agent）配置中移除受影响的工具。
    *   重新添加这些工具（它们现在将引用新的 URL）。
3.  测试智能体（agent）以确认工具正常工作。

## 示例：连接自定义 MCP 服务器

这是一个将 Agent Builder 连接到需要身份验证的 GitHub MCP 服务器的实际示例：

<Steps>

<Step title="创建 GitHub 授权令牌">

MCP 服务器需要获得代表您访问 GitHub 的权限。您将使用 <strong>GitHub 个人访问令牌（PAT）</strong> 来实现这一点。

1.  转到 <strong>GitHub → 设置 → 开发者设置</strong>。
1.  打开 <strong>个人访问令牌</strong>。
1.  创建一个 <strong>细粒度令牌</strong>（推荐）。

授予 <strong>只读</strong> 权限：
*   <strong>内容</strong>：读取
*   <strong>议题</strong>：读取
*   <strong>拉取请求</strong>：读取

创建后，<strong>复制令牌</strong>。您将无法再次看到它。

<Tip>
请将此令牌视为密码。您可以随时轮换或撤销它，而无需更改您的智能体（agent）。
</Tip>

</Step>

<Step title="了解所需的标头">

远程 MCP 服务器通常使用 HTTP 标头进行身份验证。

对于 GitHub MCP 服务器，所需的标头如下所示：

```http
Authorization: Bearer ghp_xxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
User-Agent: langsmith-agent-builder
```

*   Authorization 证明您的身份。
*   MCP 服务器验证令牌。
*   来自智能体（agent）的每个工具调用都包含这些标头。

Agent Builder 在配置后将自动附加这些标头。

</Step>

<Step title="将令牌存储为工作区密钥">

在 [LangSmith UI](https://smith.langchain.com) 中：

1.  导航到 <strong>设置</strong> > <strong>工作区</strong> > <strong>密钥</strong>。
1.  点击 <strong>添加密钥</strong>。
1.  名称：`GITHUB_TOKEN`（或任何描述性名称）。
1.  值：您的身份验证令牌。
1.  保存密钥。

</Step>

<Step title="配置 MCP 服务器">

在 <strong>设置</strong> > <strong>MCP 服务器</strong> 中：

1.  点击 <strong>添加服务器</strong>。
1.  为 MCP 服务器添加一个 <strong>名称</strong>。
1.  <strong>URL</strong>：输入您的 MCP 服务器 URL（例如，`https://mcp-github.example.com`）
1.  添加身份验证标头：
    *   键：`Authorization`
    *   值：<code v-pre>Bearer {{GITHUB_TOKEN}}</code>
1.  保存配置。

</Step>

<Step title="在您的智能体（agent）中使用工具">

您的 MCP 服务器中的工具现在在 Agent Builder 中可用。当您创建或编辑智能体（agent）时，您将看到这些工具与内置工具一起列出。所有对您 MCP 服务器的请求都将自动包含身份验证标头。

连接后，此示例的工作流程如下所示：

1.  智能体（agent）决定需要 GitHub 数据。
1.  它选择由 MCP 服务器公开的工具。
1.  LangSmith 将请求转发到远程 MCP 服务器。
1.  服务器使用您的令牌进行身份验证。
1.  获取并返回 GitHub 数据。
1.  智能体（agent）接收结构化结果并继续推理。

</Step>

</Steps>

<Info>

不同的 MCP 服务器可能使用不同的身份验证方法：
*   <code v-pre>Authorization: Bearer {{TOKEN}}</code>（最常见）
*   <code v-pre>X-API-Key: {{API_KEY}}</code>
*   特定于您实现的自定义标头
*   用于身份验证的多个标头

</Info>

请务必查阅您的 MCP 服务器文档，以获取正确的身份验证标头格式。
</Info>

## 支持的服务器

### Arcade

[Arcade](https://arcade.dev) 提供了一个用于连接各种工具和服务的网关。

**配置详情**

| 设置项 | 值 |
|---------|-------|
| **URL** | 动态生成。在您的 [Arcade 控制面板](https://arcade.dev) 中创建一个 MCP 网关，选择您需要的工具，然后复制生成的 URL。 |
| **认证类型** | 标头或 OAuth 2.1（自动）。具体细节见下文。 |

**选项 1：标头认证**

添加以下标头：

| 标头 | 值 |
|--------|-------|
| `Authorization` | `Bearer ARCADE_API_KEY` |
| `Arcade-User-Id` | 您的电子邮件地址 |

**选项 2：OAuth 认证**

1.  添加服务器时，选择 **OAuth 2.1（自动）** 作为认证类型。
1.  在提示时使用您的 Arcade 账户登录。

要了解更多关于 Arcade MCP 集成的信息，请参阅 [Arcade 文档](https://docs.arcade.dev/en/resources/integrations)。

### Parallel

[Parallel](https://parallel.ai) 提供搜索和任务自动化工具。

**配置详情**

| 设置项 | 值 |
|---------|-------|
| **URL** | `https://search-mcp.parallel.ai/mcp` |
| **认证类型** | 标头 |

添加以下标头：

| 标头 | 值 |
|--------|-------|
| `Authorization` | `Bearer PARALLEL_API_KEY` |

更多信息，请参阅 [Parallel 关于搜索 MCP 的文档](https://docs.parallel.ai/integrations/mcp/search-mcp) 和 [任务 MCP 的文档](https://docs.parallel.ai/integrations/mcp/task-mcp)。

### Notion

[Notion](https://notion.com) 提供用于与您的 Notion 工作空间交互的工具。

**配置详情**

| 设置项 | 值 |
|---------|-------|
| **URL** | `https://mcp.notion.com/mcp` |
| **认证类型** | OAuth 2.1（自动） |

1.  添加服务器时，选择 **OAuth 2.1（自动）** 作为认证类型。
1.  在提示时使用您的 Notion 账户登录。

更多信息，请参阅 [Notion MCP 文档](https://developers.notion.com/docs/mcp)。
