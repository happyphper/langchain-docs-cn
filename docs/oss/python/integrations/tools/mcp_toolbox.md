---
title: 数据库 MCP 工具箱
---
使用 MCP Toolbox 将您的数据库与 LangChain 智能体集成。

## 概述

[MCP Toolbox for Databases](https://github.com/googleapis/genai-toolbox) 是一个用于数据库的开源 MCP 服务器。它的设计考虑了企业级和生产质量。通过处理连接池、身份验证等复杂性，它使您能够更轻松、更快速、更安全地开发工具。

Toolbox 工具可以无缝集成到 LangChain 应用程序中。有关[快速入门](https://googleapis.github.io/genai-toolbox/getting-started/local_quickstart/)或[配置](https://googleapis.github.io/genai-toolbox/getting-started/configure/) MCP Toolbox 的更多信息，请参阅[文档](https://googleapis.github.io/genai-toolbox/getting-started/introduction/)。

![架构图](https://raw.githubusercontent.com/googleapis/genai-toolbox/refs/heads/main/docs/en/getting-started/introduction/architecture.png)

## 设置

本指南假设您已完成以下操作：

1.  已安装 [Python 3.9+](https://wiki.python.org/moin/BeginnersGuide/Download) 和 [pip](https://pip.pypa.io/en/stable/installation/)。
2.  已安装 [PostgreSQL 16+ 和 `psql` 命令行客户端](https://www.postgresql.org/download/)。

### 1. 设置您的数据库

首先，让我们设置一个 PostgreSQL 数据库。我们将创建一个新数据库、一个专用于 MCP Toolbox 的用户，以及一个包含一些示例数据的 `hotels` 表。

使用 `psql` 命令连接到 PostgreSQL。您可能需要根据您的 PostgreSQL 设置调整命令（例如，如果需要指定主机或不同的超级用户）。

```bash
psql -U postgres
```

现在，运行以下 SQL 命令来创建用户、数据库并授予必要的权限：

```sql
CREATE USER toolbox_user WITH PASSWORD 'my-password';
CREATE DATABASE toolbox_db;
GRANT ALL PRIVILEGES ON DATABASE toolbox_db TO toolbox_user;
ALTER DATABASE toolbox_db OWNER TO toolbox_user;
```

使用新用户连接到新创建的数据库：

```sql
\c toolbox_db toolbox_user
```

最后，创建 `hotels` 表并插入一些数据：

```sql
CREATE TABLE hotels(
  id            INTEGER NOT NULL PRIMARY KEY,
  name          VARCHAR NOT NULL,
  location      VARCHAR NOT NULL,
  price_tier    VARCHAR NOT NULL,
  booked        BIT     NOT NULL
);

INSERT INTO hotels(id, name, location, price_tier, booked)
VALUES
  (1, 'Hilton Basel', 'Basel', 'Luxury', B'0'),
  (2, 'Marriott Zurich', 'Zurich', 'Upscale', B'0'),
  (3, 'Hyatt Regency Basel', 'Basel', 'Upper Upscale', B'0');
```

现在，您可以输入 `\q` 退出 `psql`。

### 2. 安装 MCP Toolbox

接下来，我们将安装 MCP Toolbox，在 `tools.yaml` 配置文件中定义我们的工具，并运行 MCP Toolbox 服务器。

对于 **macOS** 用户，最简单的安装方式是使用 [Homebrew](https://formulae.brew.sh/formula/mcp-toolbox)：

```bash
brew install mcp-toolbox
```

对于其他平台，[请下载适用于您操作系统和架构的最新 MCP Toolbox 二进制文件。](https://github.com/googleapis/genai-toolbox/releases)

创建一个 `tools.yaml` 文件。此文件定义了 MCP Toolbox 可以连接的数据源以及它可以向您的智能体公开的工具。对于生产用途，请始终使用环境变量来存储密钥。

```yaml
sources:
  my-pg-source:
    kind: postgres
    host: 127.0.0.1
    port: 5432
    database: toolbox_db
    user: toolbox_user
    password: my-password

tools:
  search-hotels-by-location:
    kind: postgres-sql
    source: my-pg-source
    description: Search for hotels based on location.
    parameters:
      - name: location
        type: string
        description: The location of the hotel.
    statement: SELECT id, name, location, price_tier FROM hotels WHERE location ILIKE '%' || $1 || '%';
  book-hotel:
    kind: postgres-sql
    source: my-pg-source
    description: >-
        Book a hotel by its ID. If the hotel is successfully booked, returns a confirmation message.
    parameters:
      - name: hotel_id
        type: integer
        description: The ID of the hotel to book.
    statement: UPDATE hotels SET booked = B'1' WHERE id = $1;

toolsets:
  hotel_toolset:
    - search-hotels-by-location
    - book-hotel
```

现在，在另一个终端窗口中，启动 MCP Toolbox 服务器。如果您通过 Homebrew 安装，只需运行 `toolbox`。如果您手动下载了二进制文件，则需要从保存它的目录运行 `./toolbox`：

```bash
toolbox --tools-file "tools.yaml"
```

MCP Toolbox 默认将在 `http://127.0.0.1:5000` 上启动，并且如果您对 `tools.yaml` 文件进行更改，它将热重载。

## 实例化

```python
!pip install toolbox-langchain
```

```python
from toolbox_langchain import ToolboxClient

with ToolboxClient("http://127.0.0.1:5000") as client:
    search_tool = await client.aload_tool("search-hotels-by-location")
```

## 调用

```python
from toolbox_langchain import ToolboxClient

with ToolboxClient("http://127.0.0.1:5000") as client:
    search_tool = await client.aload_tool("search-hotels-by-location")
    results = search_tool.invoke({"location": "Basel"})
    print(results)
```

```json
[{"id":1,"location":"Basel","name":"Hilton Basel","price_tier":"Luxury"},{"id":3,"location":"Basel","name":"Hyatt Regency Basel","price_tier":"Upper Upscale"}]
```

## 在智能体中使用

现在是有趣的部分！我们将安装所需的 LangChain 包，并创建一个可以使用我们在 MCP Toolbox 中定义的工具的智能体。

```python
pip install -qU toolbox-langchain langgraph langchain-google-vertexai
```

安装好包后，我们就可以定义我们的智能体了。我们将使用 `ChatVertexAI` 作为模型，使用 `ToolboxClient` 来加载我们的工具。来自 `langchain.agents` 的 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 创建一个强大的智能体，可以推理调用哪些工具。

**注意：** 在执行以下代码之前，请确保您的 MCP Toolbox 服务器正在单独的终端中运行。

```python
from langchain.agents import create_agent
from langchain_google_vertexai import ChatVertexAI
from langgraph.checkpoint.memory import MemorySaver
from toolbox_langchain import ToolboxClient

prompt = """
You're a helpful hotel assistant. You handle hotel searching and booking.
When the user searches for a hotel, list the full details for each hotel found: id, name, location, and price tier.
Always use the hotel ID for booking operations.
For any bookings, provide a clear confirmation message.
Don't ask for clarification or confirmation from the user; perform the requested action directly.
"""

async def run_queries(agent_executor):
    config = {"configurable": {"thread_id": "hotel-thread-1"}}

    # --- Query 1: Search for hotels ---
    query1 = "I need to find a hotel in Basel."
    print(f'\n--- USER: "{query1}" ---')
    inputs1 = {"messages": [("user", prompt + query1)]}
    async for event in agent_executor.astream_events(
        inputs1, config=config, version="v2"
    ):
        if event["event"] == "on_chat_model_end" and event["data"]["output"].content:
            print(f"--- AGENT: ---\n{event['data']['output'].content}")

    # --- Query 2: Book a hotel ---
    query2 = "Great, please book the Hyatt Regency Basel for me."
    print(f'\n--- USER: "{query2}" ---')
    inputs2 = {"messages": [("user", query2)]}
    async for event in agent_executor.astream_events(
        inputs2, config=config, version="v2"
    ):
        if event["event"] == "on_chat_model_end" and event["data"]["output"].content:
            print(f"--- AGENT: ---\n{event['data']['output'].content}")
```

## 运行智能体

```python
async def main():
    await run_hotel_agent()

async def run_hotel_agent():
    model = ChatVertexAI(model_name="gemini-2.5-flash")

    # Load the tools from the running MCP Toolbox server
    async with ToolboxClient("http://127.0.0.1:5000") as client:
        tools = await client.aload_toolset("hotel_toolset")

        agent = create_agent(model, tools, checkpointer=MemorySaver())

        await run_queries(agent)

await main()
```

您已成功使用 MCP Toolbox 将 LangChain 智能体连接到本地数据库！🥳

---

## API 参考

此集成的主要类是 `ToolboxClient`。

有关更多信息，请参阅以下资源：

-   [Toolbox 官方文档](https://googleapis.github.io/genai-toolbox/)
-   [Toolbox GitHub 仓库](https://github.com/googleapis/genai-toolbox)
-   [Toolbox LangChain SDK](https://github.com/googleapis/mcp-toolbox-python-sdk/tree/main/packages/toolbox-langchain)

MCP Toolbox 具有多种功能，使为数据库开发 Gen AI 工具变得无缝：

-   [认证参数](https://googleapis.github.io/genai-toolbox/resources/tools/#authenticated-parameters)：自动将工具输入绑定到 OIDC 令牌中的值，从而轻松运行敏感查询而不会潜在泄露数据
-   [授权调用](https://googleapis.github.io/genai-toolbox/resources/tools/#authorized-invocations)：根据用户的身份验证令牌限制对工具的使用访问
-   [OpenTelemetry](https://googleapis.github.io/genai-toolbox/how-to/export_telemetry/)：通过 [OpenTelemetry](https://opentelemetry.io/docs/) 从 MCP Toolbox 获取指标和追踪

# 社区与支持

我们鼓励您参与社区：

-   ⭐️ 前往 [GitHub 仓库](https://github.com/googleapis/genai-toolbox) 开始使用并关注更新。
-   📚 深入阅读 [官方文档](https://googleapis.github.io/genai-toolbox/getting-started/introduction/) 以了解更高级的功能和配置。
-   💬 加入我们的 [Discord 服务器](https://discord.com/invite/a4XjGqtmnG) 与社区联系并提问。
