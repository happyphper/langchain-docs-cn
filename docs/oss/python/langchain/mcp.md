---
title: 模型上下文协议 (MCP)
---
[模型上下文协议 (Model Context Protocol, MCP)](https://modelcontextprotocol.io/introduction) 是一个开放协议，它标准化了应用程序如何向大语言模型 (LLMs) 提供工具和上下文。LangChain 智能体可以使用 [`langchain-mcp-adapters`](https://github.com/langchain-ai/langchain-mcp-adapters) 库来使用 MCP 服务器上定义的工具。

## 快速开始

安装 `langchain-mcp-adapters` 库：

::: code-group

```bash [pip]
pip install langchain-mcp-adapters
```

```bash [uv]
uv add langchain-mcp-adapters
```

:::

`langchain-mcp-adapters` 使智能体能够使用一个或多个 MCP 服务器上定义的工具。

<Note>

`MultiServerMCPClient` <strong>默认是无状态的</strong>。每次工具调用都会创建一个新的 MCP `ClientSession`，执行工具，然后进行清理。更多详情请参阅[有状态会话](#stateful-sessions)部分。

</Note>

```python Accessing multiple MCP servers icon="server"
from langchain_mcp_adapters.client import MultiServerMCPClient  # [!code highlight]
from langchain.agents import create_agent

client = MultiServerMCPClient(  # [!code highlight]
    {
        "math": {
            "transport": "stdio",  # 本地子进程通信
            "command": "python",
            # 你的 math_server.py 文件的绝对路径
            "args": ["/path/to/math_server.py"],
        },
        "weather": {
            "transport": "http",  # 基于 HTTP 的远程服务器
            # 确保你的天气服务器在 8000 端口启动
            "url": "http://localhost:8000/mcp",
        }
    }
)

tools = await client.get_tools()  # [!code highlight]
agent = create_agent(
    "claude-sonnet-4-5-20250929",
    tools  # [!code highlight]
)
math_response = await agent.ainvoke(
    {"messages": [{"role": "user", "content": "what's (3 + 5) x 12?"}]}
)
weather_response = await agent.ainvoke(
    {"messages": [{"role": "user", "content": "what is the weather in nyc?"}]}
)
```

## 自定义服务器

要创建自定义 MCP 服务器，请使用 [FastMCP](https://gofastmcp.com/getting-started/welcome) 库：

::: code-group

```bash [pip]
pip install fastmcp
```

```bash [uv]
uv add fastmcp
```

:::

要使用 MCP 工具服务器测试你的智能体，请使用以下示例：

::: code-group

```python title="数学服务器 (stdio 传输)" icon="floppy-disk"
from fastmcp import FastMCP

mcp = FastMCP("Math")

@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

@mcp.tool()
def multiply(a: int, b: int) -> int:
    """Multiply two numbers"""
    return a * b

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

```python title="天气服务器 (streamable HTTP 传输)" icon="wifi"
from fastmcp import FastMCP

mcp = FastMCP("Weather")

@mcp.tool()
async def get_weather(location: str) -> str:
    """Get weather for location."""
    return "It's always sunny in New York"

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

:::

## 传输方式

MCP 支持不同的传输机制用于客户端-服务器通信。

### HTTP

`http` 传输（也称为 `streamable-http`）使用 HTTP 请求进行客户端-服务器通信。更多详情请参阅 [MCP HTTP 传输规范](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http)。

```python
client = MultiServerMCPClient(
    {
        "weather": {
            "transport": "http",
            "url": "http://localhost:8000/mcp",
        }
    }
)
```

#### 传递请求头

通过 HTTP 连接到 MCP 服务器时，你可以使用连接配置中的 `headers` 字段包含自定义请求头（例如用于身份验证或追踪）。这适用于 `sse`（MCP 规范已弃用）和 `streamable_http` 传输。

```python [Passing headers with MultiServerMCPClient]
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent

client = MultiServerMCPClient(
    {
        "weather": {
            "transport": "http",
            "url": "http://localhost:8000/mcp",
            "headers": {  # [!code highlight]
                "Authorization": "Bearer YOUR_TOKEN",  # [!code highlight]
                "X-Custom-Header": "custom-value"  # [!code highlight]
            },  # [!code highlight]
        }
    }
)
tools = await client.get_tools()
agent = create_agent("openai:gpt-4.1", tools)
response = await agent.ainvoke({"messages": "what is the weather in nyc?"})
```

#### 身份验证

`langchain-mcp-adapters` 库底层使用了官方的 [MCP SDK](https://github.com/modelcontextprotocol/python-sdk)，它允许你通过实现 `httpx.Auth` 接口来提供自定义的身份验证机制。

```python
from langchain_mcp_adapters.client import MultiServerMCPClient

client = MultiServerMCPClient(
    {
        "weather": {
            "transport": "http",
            "url": "http://localhost:8000/mcp",
            "auth": auth, # [!code highlight]
        }
    }
)
```

* [自定义身份验证实现示例](https://github.com/modelcontextprotocol/python-sdk/blob/main/examples/clients/simple-auth-client/mcp_simple_auth_client/main.py)
* [内置 OAuth 流程](https://github.com/modelcontextprotocol/python-sdk/blob/main/src/mcp/client/auth.py#L179)

### stdio

客户端将服务器作为子进程启动，并通过标准输入/输出进行通信。适用于本地工具和简单设置。

<Note>

与 HTTP 传输不同，`stdio` 连接本质上是<strong>有状态的</strong>——子进程在客户端连接的整个生命周期内持续存在。然而，当使用没有显式会话管理的 `MultiServerMCPClient` 时，每次工具调用仍然会创建一个新会话。有关管理持久连接的信息，请参阅[有状态会话](#stateful-sessions)。

</Note>

```python
client = MultiServerMCPClient(
    {
        "math": {
            "transport": "stdio",
            "command": "python",
            "args": ["/path/to/math_server.py"],
        }
    }
)
```

## 有状态会话

默认情况下，`MultiServerMCPClient` 是**无状态的**——每次工具调用都会创建一个新的 MCP 会话，执行工具，然后进行清理。

如果你需要控制 MCP 会话的[生命周期](https://modelcontextprotocol.io/specification/2025-03-26/basic/lifecycle)（例如，当使用一个有状态的服务器，该服务器在多个工具调用之间维护上下文时），你可以使用 `client.session()` 创建一个持久的 `ClientSession`。

```python [Using MCP ClientSession for stateful tool usage]
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain.agents import create_agent

client = MultiServerMCPClient({...})

# 显式创建一个会话
async with client.session("server_name") as session:  # [!code highlight]
    # 将会话传递给加载工具、资源或提示
    tools = await load_mcp_tools(session)  # [!code highlight]
    agent = create_agent(
        "anthropic:claude-3-7-sonnet-latest",
        tools
    )
```

## 核心功能

### 工具

[工具](https://modelcontextprotocol.io/docs/concepts/tools)允许 MCP 服务器公开可执行的函数，LLMs 可以调用这些函数来执行操作——例如查询数据库、调用 API 或与外部系统交互。LangChain 将 MCP 工具转换为 LangChain [工具](/oss/python/langchain/tools)，使它们可以直接在任何 LangChain 智能体或工作流中使用。

#### 加载工具

使用 `client.get_tools()` 从 MCP 服务器检索工具，并将它们传递给你的智能体：

```python
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent

client = MultiServerMCPClient({...})
tools = await client.get_tools()  # [!code highlight]
agent = create_agent("claude-sonnet-4-5-20250929", tools)
```

:::python

#### 结构化内容

MCP 工具除了人类可读的文本响应外，还可以返回[结构化内容](https://modelcontextprotocol.io/specification/2025-03-26/server/tools#structured-content)。当工具除了需要显示给模型的文本外，还需要返回机器可解析的数据（如 JSON）时，这很有用。

当 MCP 工具返回 `structuredContent` 时，适配器会将其包装在 [`MCPToolArtifact`](/docs/reference/langchain-mcp-adapters#MCPToolArtifact) 中，并将其作为工具的工件返回。你可以通过 `ToolMessage` 上的 `artifact` 字段访问它。你也可以使用[拦截器](#tool-interceptors)来自动处理或转换结构化内容。

**从工件中提取结构化内容**

调用智能体后，你可以从响应中的工具消息访问结构化内容：

```python
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent
from langchain.messages import ToolMessage

client = MultiServerMCP
