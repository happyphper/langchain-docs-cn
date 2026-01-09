---
title: LangGraph CLI
sidebarTitle: LangGraph CLI
---

**LangGraph CLI** 是一个命令行工具，用于在本地构建和运行 [Agent Server](/langsmith/agent-server)。生成的服务器公开了用于运行（runs）、线程（threads）、助手（assistants）等的所有 API 端点，并包含支持服务，例如用于检查点（checkpointing）和存储的托管数据库。

## 安装

1. 确保已安装 Docker（例如，`docker --version`）。
2. 安装 CLI：

::: code-group

```bash [Python (pip)]
pip install langgraph-cli
```
```bash [JavaScript]
# 按需使用最新版本
npx @langchain/langgraph-cli

# 或全局安装（安装后可以作为 `langgraphjs` 运行）
npm install -g @langchain/langgraph-cli
```

:::

3. 验证安装

::: code-group

```bash [Python (pip)]
langgraph --help
```
```bash [JavaScript]
npx @langchain/langgraph-cli --help
```

:::

### 快捷命令

| 命令 | 功能说明 |
| --- | --- |
| [`langgraph dev`](#dev) | 启动轻量级本地开发服务器（无需 Docker），非常适合快速测试。 |
| [`langgraph build`](#build) | 为部署构建 LangGraph API 服务器的 Docker 镜像。 |
| [`langgraph dockerfile`](#dockerfile) | 根据您的配置生成相应的 Dockerfile，用于自定义构建。 |
| [`langgraph up`](#up) | 在 Docker 中本地启动 LangGraph API 服务器。本地开发需要 Docker 运行及 LangSmith API 密钥；生产环境需要许可证。 |

对于 JS，请使用 `npx @langchain/langgraph-cli <command>`（如果已全局安装，则使用 `langgraphjs`）。

## 配置文件

为了构建和运行有效的应用程序，LangGraph CLI 需要一个遵循此 [schema](https://raw.githubusercontent.com/langchain-ai/langgraph/refs/heads/main/libs/cli/schemas/schema.json) 的 JSON 配置文件。它包含以下属性：

<Note>
LangGraph CLI 默认使用当前目录下名为 <strong>langgraph.json</strong> 的配置文件。
</Note>

<Tabs>

<Tab title="Python">

| 键 | 描述 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span :style="{ whiteSpace: 'nowrap' }">`dependencies`</span>     | **必需**。LangSmith API 服务器的依赖项数组。依赖项可以是以下之一： <ul><li>单个点号（`"."`），这将在当前目录下寻找本地 Python 包。</li><li>`pyproject.toml`、`setup.py` 或 `requirements.txt` 所在的目录路径。<br></br>例如，如果 `requirements.txt` 位于项目目录的根目录，请指定 `"./"`。如果它位于名为 `local_package` 的子目录中，请指定 `"./local_package"`。不要直接指定字符串 `"requirements.txt"` 本身。</li><li>一个 Python 包名称。</li></ul> |
| <span :style="{ whiteSpace: 'nowrap' }">`graphs`</span>           | **必需**。从图 ID（graph ID）到定义已编译图（compiled graph）或创建图的函数的路径映射。示例： <ul><li>`./your_package/your_file.py:variable`，其中 `variable` 是 `langgraph.graph.state.CompiledStateGraph` 的实例</li><li>`./your_package/your_file.py:make_graph`，其中 `make_graph` 是一个接受配置字典（`langchain_core.runnables.RunnableConfig`）并返回 `langgraph.graph.state.StateGraph` 或 `langgraph.graph.state.CompiledStateGraph` 实例的函数。有关更多详细信息，请参阅 [如何在运行时重建图](/langsmith/graph-rebuild)。</li></ul>                                    |
| <span :style="{ whiteSpace: 'nowrap' }">`auth`</span>             | _(v0.0.11 中添加)_ 包含身份验证处理程序（authentication handler）路径的身份验证配置。示例：`./your_package/auth.py:auth`，其中 `auth` 是 `langgraph_sdk.Auth` 的实例。有关详细信息，请参阅 [身份验证指南](/langsmith/auth)。 |
| <span :style="{ whiteSpace: 'nowrap' }">`base_image`</span>       | 可选。用于 LangGraph API 服务器的基础镜像。默认为 `langchain/langgraph-api` 或 `langchain/langgraphjs-api`。使用此选项将构建固定到特定版本的 langgraph API，例如 `"langchain/langgraph-server:0.2"`。有关更多详细信息，请参阅 https://hub.docker.com/r/langchain/langgraph-server/tags。（在 `langgraph-cli==0.2.8` 中添加） |
| <span :style="{ whiteSpace: 'nowrap' }">`image_distro`</span>     | 可选。基础镜像的 Linux 发行版。必须是 `"debian"`、`"wolfi"`、`"bookworm"` 或 `"bullseye"` 之一。如果省略，默认使用 `"debian"`。可在 `langgraph-cli>=0.2.11` 中使用。|
| <span :style="{ whiteSpace: 'nowrap' }">`env`</span>              | `.env` 文件的路径，或者一个从环境变量名到其值的映射。 |
| <span :style="{ whiteSpace: 'nowrap' }">`store`</span>            | 该配置用于向 BaseStore 添加语义搜索和/或生存时间（TTL）。包含以下字段： <ul><li>`index`（可选）：语义搜索索引配置，包含 `embed`、`dims` 字段及可选的 `fields`。</li><li>`ttl`（可选）：项目过期配置。包含可选字段的对象：`refresh_on_read`（布尔值，默认为 `true`）、`default_ttl`（浮点数，生存时间以**分钟**为单位；仅应用于新创建的项目；现有项目保持不变；默认为不过期）和 `sweep_interval_minutes`（整数，检查过期项目的频率，默认为不执行扫描）。</li></ul> |
| <span :style="{ whiteSpace: 'nowrap' }">`ui`</span>               | 可选。Agent 发出的 UI 组件的命名定义，每个定义指向一个 JS/TS 文件。（在 `langgraph-cli==0.1.84` 中添加） |
| <span :style="{ whiteSpace: 'nowrap' }">`python_version`</span>   | `3.11`、`3.12` 或 `3.13`。默认为 `3.11`。 |
| <span :style="{ whiteSpace: 'nowrap' }">`node_version`</span>     | 指定 `node_version: 20` 以使用 LangGraph.js。 |
| <span :style="{ whiteSpace: 'nowrap' }">`pip_config_file`</span>  | `pip` 配置文件路径。 |
| <span :style="{ whiteSpace: 'nowrap' }">`pip_installer`</span> | _(v0.3 中添加)_ 可选。Python 包安装器选择。可以设置为 `"auto"`、`"pip"` 或 `"uv"`。从版本 0.3 开始，默认策略是运行 `uv pip`，这通常能提供更快的构建速度且可直接替换。在 `uv` 无法处理您的依赖图或 `pyproject.toml` 结构的不常见情况下，请指定 `"pip"` 以恢复之前的行为。 |
| <span :style="{ whiteSpace: 'nowrap' }">`keep_pkg_tools`</span> | _(v0.3.4 中添加)_ 可选。控制是否在最终镜像中保留 Python 打包工具（`pip`、`setuptools`、`wheel`）。可选值： <ul><li><code>true</code> ：保留这三个工具（跳过卸载）。</li><li><code>false</code> / 省略 ：卸载这三个工具（默认行为）。</li><li><code>list[str]</code> ：**需要保留**的工具名称列表。每个值必须是 "pip"、"setuptools"、"wheel" 之一。</li></ul>。默认情况下，这三个工具都会被卸载。 |
| <span :style="{ whiteSpace: 'nowrap' }">`dockerfile_lines`</span> | 从父镜像导入（import）后，要添加到 Dockerfile 的额外指令行数组。 |
| <span :style="{ whiteSpace: 'nowrap' }">`checkpointer`</span>   | 检查点（checkpointer）配置。支持： <ul><li>`ttl`（可选）：包含 `strategy`、`sweep_interval_minutes`、`default_ttl` 的对象，用于控制检查点过期。</li><li>`serde`（可选，0.5+）：包含 `allowed_json_modules` 和 `pickle_fallback` 的对象，用于调整反序列化行为。</li></ul> |
| <span :style="{ whiteSpace: 'nowrap' }">`http`</span>            | HTTP 服务器配置，包含以下字段： <ul><li>`app`：自定义 Starlette/FastAPI 应用的路径（例如，`"./src/agent/webapp.py:app"`）。请参阅 [自定义路由指南](/langsmith/custom-routes)。</li><li>`cors`：CORS 配置，包含 `allow_origins`、`allow_methods`、`allow_headers`、`allow_credentials`、`allow_origin_regex`、`expose_headers` 和 `max_age` 字段。</li><li>`configurable_headers`：定义哪些请求头要通过 `includes` / `excludes` 模式暴露为可配置值。</li><li>`logging_headers`：`configurable_headers` 的镜像，用于从日志中排除敏感头信息。</li><li>`middleware_order`：选择自定义中间件和身份验证（auth）如何交互。`auth_first` 在自定义中间件之前运行身份验证钩子，而 `middleware_first`（默认）首先运行您的中间件。</li><li>`enable_custom_route_auth`：对通过 `app` 添加的路由应用身份验证检查。</li><li>`disable_assistants`、`disable_mcp`、`disable_a2a`、`disable_meta`、`disable_runs`、`disable_store`、`disable_threads`、`disable_ui`、`disable_webhooks`：禁用内置路由或钩子。</li><li>`mount_prefix`：挂载路由的前缀（例如，"/my-deployment/api"）。</li></ul> |
| <span :style="{ whiteSpace: 'nowrap' }">`webhooks`</span>        | _(v0.5.36 中添加)_ 出站 Webhook 传递配置。包含： <ul><li>`env_prefix`：头模板中引用的环境变量所需的必需前缀（默认为 `LG_WEBHOOK_`）。</li><li>`headers`：包含在 Webhook 请求中的静态头。值可以包含像 <code v-pre>${{ env.VAR }}</code> 这样的模板。</li><li>`url`：URL 验证策略，包含 `allowed_domains`、`allowed_ports`、`require_https`、`disable_loopback` 和 `max_url_length`。</li></ul> |
| <span :style="{ whiteSpace: 'nowrap' }">`api_version`</span>     | _(v0.3.7 中添加)_ 指定要使用的 LangGraph API 服务器语义版本（例如 `"0.3"`）。默认为最新版本。请查看服务器 [更新日志](/langsmith/agent-server-changelog) 了解每个版本的详细信息。 |

</Tab>

<Tab title="JS">

| 键 | 描述 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span :style="{ whiteSpace: 'nowrap' }">`graphs`</span>           | **必需**。从图 ID 到定义已编译图或创建图的函数的路径映射。示例： <ul><li>`./src/graph.ts:variable`，其中 `variable` 是 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph" target="_blank" rel="noreferrer" class="link"><code>CompiledStateGraph</code></a> 的实例</li><li>`./src/graph.ts:makeGraph`，其中 `makeGraph` 是一个接受配置字典（`LangGraphRunnableConfig`）并返回 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph" target="_blank" rel="noreferrer" class="link"><code>StateGraph</code></a> 或 <a href="https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph" target="_blank" rel="noreferrer" class="link"><code>CompiledStateGraph</code></a> 实例的函数。有关更多详细信息，请参阅 [如何在运行时重建图](/langsmith/graph-rebuild)。</li></ul>                                    |
| <span :style="{ whiteSpace: 'nowrap' }">`env`</span>              | `.env` 文件路径或环境变量映射。 |
| <span :style="{ whiteSpace: 'nowrap' }">`store`</span>            | 语义搜索和/或生存时间（TTL）配置。包含以下字段： <ul><li>`index`（可选）：语义搜索索引配置。</li><li>`ttl`（可选）：项目过期配置。包含：`refresh_on_read`（默认 `true`）、`default_ttl`（**分钟**为单位；默认为不过期）和 `sweep_interval_minutes`（清理频率）。</li></ul> |
| <span :style="{ whiteSpace: 'nowrap' }">`node_version`</span>     | 指定 `node_version: 20` 以使用 LangGraph.js。 |
| <span :style="{ whiteSpace: 'nowrap' }">`dockerfile_lines`</span> | 添加到 Dockerfile 的额外行数组。 |
| <span :style="{ whiteSpace: 'nowrap' }">`checkpointer`</span>   | 检查点配置。支持 `ttl`（控制过期）和 `serde`（0.5+；调整反序列化行为）。 |
| <span :style="{ whiteSpace: 'nowrap' }">`http`</span>            | HTTP 服务器配置，镜像 Python 选项： <ul><li>具有 `allow_origins` 等字段的 `cors`。</li><li>`configurable_headers` 和 `logging_headers` 模式列表。</li><li>`middleware_order`（`auth_first` 或 `middleware_first`）。</li><li>`enable_custom_route_auth` 及内置路由开关。</li></ul> |
| <span :style="{ whiteSpace: 'nowrap' }">`webhooks`</span>        | _(v0.5.36 中添加)_ 出站 Webhook 传递配置。包含：`env_prefix`、`headers` 和 `url` 验证策略。 |
| <span :style="{ whiteSpace: 'nowrap' }">`api_version`</span>     | _(v0.3.7 中添加)_ 指定 LangGraph API 服务器语义版本（例如 `"0.3"`）。 |

</Tab>

</Tabs>

### 示例

<Tabs>

<Tab title="Python">

#### 基本配置

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "dependencies": ["."],
  "graphs": {
    "chat": "chat.graph:graph"
  }
}
```

#### 使用 Wolfi 基础镜像

您可以使用 `image_distro` 字段指定基础镜像的 Linux 发行版。有效选项包括 `debian`、`wolfi`、`bookworm` 或 `bullseye`。推荐使用 Wolfi，因为它提供的镜像更小、更安全。此选项在 `langgraph-cli>=0.2.11` 中可用。

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "dependencies": ["."],
  "graphs": {
    "chat": "chat.graph:graph"
  },
  "image_distro": "wolfi"
}
```

#### 为存储添加语义搜索

所有部署都附带一个基于数据库的 BaseStore。在您的 `langgraph.json` 中添加 "index" 配置将为您的部署中的 BaseStore 启用 [语义搜索](/langsmith/semantic-search)。

`index.fields` 配置决定了要嵌入文档的哪些部分：

* 如果省略或设置为 `["$"]`，将嵌入整个文档
* 要嵌入特定字段，请使用 JSON 路径表示法：`["metadata.title", "content.text"]`
* 缺少指定字段的文档仍将被存储，但不会为这些字段生成嵌入
* 您仍然可以在 `put` 时通过 `index` 参数覆盖特定项目要嵌入的字段

```json
{
  "dependencies": ["."],
  "graphs": {
    "memory_agent": "./agent/graph.py:graph"
  },
  "store": {
    "index": {
      "embed": "openai:text-embedding-3-small",
      "dims": 1536,
      "fields": ["$"]
    }
  }
}
```

<Note>

<strong>常用模型维度</strong>
* `openai:text-embedding-3-large`: 3072
* `openai:text-embedding-3-small`: 1536
* `openai:text-embedding-ada-002`: 1536
* `cohere:embed-english-v3.0`: 1024
* `cohere:embed-english-light-v3.0`: 384
* `cohere:embed-multilingual-v3.0`: 1024
* `cohere:embed-multilingual-light-v3.0`: 384

</Note>

#### 使用自定义嵌入函数进行语义搜索

如果您想使用自定义嵌入函数进行语义搜索，可以传递自定义嵌入函数的路径：

```json
{
  "dependencies": ["."],
  "graphs": {
    "memory_agent": "./agent/graph.py:graph"
  },
  "store": {
    "index": {
      "embed": "./embeddings.py:embed_texts",
      "dims": 768,
      "fields": ["text", "summary"]
    }
  }
}
```

存储配置中的 `embed` 字段可以引用一个自定义函数，该函数接收字符串列表并返回嵌入向量列表。示例实现：

```python
# embeddings.py
def embed_texts(texts: list[str]) -> list[list[float]]:
    """用于语义搜索的自定义嵌入函数。"""
    # 使用您偏好的嵌入模型进行实现
    return [[0.1, 0.2, ...] for _ in texts]  # dims 维向量
```

#### 添加自定义身份验证

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "dependencies": ["."],
  "graphs": {
    "chat": "chat.graph:graph"
  },
  "auth": {
    "path": "./auth.py:auth",
    "openapi": {
      "securitySchemes": {
        "apiKeyAuth": {
          "type": "apiKey",
          "in": "header",
          "name": "X-API-Key"
        }
      },
      "security": [{ "apiKeyAuth": [] }]
    },
    "disable_studio_auth": false
  }
}
```

有关详细信息，请参阅 [身份验证概念指南](/langsmith/auth)，以及 [设置自定义身份验证](/langsmith/set-up-custom-auth) 指南，了解该过程的实际操作。

<a id="ttl"></a>
#### 配置存储项目生存时间 (TTL)

您可以使用 `store.ttl` 键为 BaseStore 中的项目/记忆配置默认数据过期时间。这决定了项目在最后一次访问后保留多长时间（读取操作可能会根据 `refresh_on_read` 刷新计时器）。请注意，可以通过在 `get`、`search` 等调用中修改相应参数来覆盖这些默认值。

`ttl` 配置是一个包含可选字段的对象：

* `refresh_on_read`：如果为 `true`（默认），通过 `get` 或 `search` 访问项目会重置其过期计时器。设置为 `false` 则仅在写入（`put`）时刷新 TTL。
* `default_ttl`：项目的默认生存时间，以**分钟**为单位。仅应用于新创建的项目；现有项目不会改变。如果未设置，项目默认不会过期。
* `sweep_interval_minutes`：系统运行后台进程删除过期项目的频率（以分钟为单位）。如果未设置，则不会自动执行。

以下是一个启用 7 天 TTL（10080 分钟）、在读取时刷新、且每小时清理一次的示例：

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "dependencies": ["."],
  "graphs": {
    "memory_agent": "./agent/graph.py:graph"
  },
  "store": {
    "ttl": {
      "refresh_on_read": true,
      "sweep_interval_minutes": 60,
      "default_ttl": 10080
    }
  }
}
```

<a id="ttl"></a>
#### 配置检查点生存时间 (TTL)

您可以使用 `checkpointer` 键配置检查点的生存时间（TTL）。这决定了检查点数据在根据指定策略（如删除）自动处理之前保留多长时间。支持两个可选的子对象：

* `ttl`：包含 `strategy`、`sweep_interval_minutes` 和 `default_ttl`，共同设置检查点的过期规则。
* `serde` _(Agent server 0.5+)_ ：允许控制检查点负载的反序列化行为。

以下是一个设置默认 TTL 为 30 天（43200 分钟）的示例：

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "dependencies": ["."],
  "graphs": {
    "chat": "chat.graph:graph"
  },
  "checkpointer": {
    "ttl": {
      "strategy": "delete",
      "sweep_interval_minutes": 10,
      "default_ttl": 43200
    }
  }
}
```

在此示例中，超过 30 天的检查点将被删除，系统每 10 分钟检查一次。

#### 配置 checkpointer serde

`checkpointer.serde` 对象决定了反序列化的方式：

* `allowed_json_modules` 定义了一个白名单，用于存放您希望服务器能够从以 "json" 模式保存的负载中反序列化的自定义 Python 对象。这是一个 `[path, to, module, file, symbol]` 序列的列表。如果省略，则只允许 LangChain 安全的默认值。您可以不安全地将其设置为 `true` 以允许反序列化任何模块。
* `pickle_fallback`：当 JSON 解码失败时，是否回退到使用 pickle 进行反序列化。

```json
{
  "checkpointer": {
    "serde": {
      "allowed_json_modules": [
        ["my_agent", "auth", "SessionState"]
      ]
    }
  }
}
```

#### 自定义 HTTP 中间件和请求头

`http` 块允许您微调请求处理：

* `middleware_order`：选择 `"auth_first"` 在您的中间件之前运行身份验证，或选择 `"middleware_first"`（默认）以颠倒该顺序。
* `enable_custom_route_auth`：对通过 `http.app` 挂载的路由应用身份验证。
* `configurable_headers` / `logging_headers`：每个都接收一个具有可选 `includes` 和 `excludes` 数组的对象；支持通配符，排除优先级高于包含。
* `cors`：除 `allow_origins`、`allow_methods` 和 `allow_headers` 外，还可以设置 `allow_credentials`、`allow_origin_regex`、`expose_headers` 和 `max_age` 以进行详细的浏览器控制。

#### 配置 Webhooks

您可以为出站 Webhook 请求配置自定义头信息和 URL 限制限制：

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "dependencies": ["."],
  "graphs": {
    "chat": "chat.graph:graph"
  },
  "webhooks": {
    "headers": {
      "Authorization": "Bearer ${{ env.LG_WEBHOOK_TOKEN }}"
    },
    "url": {
      "allowed_domains": ["*.mycompany.com"],
      "require_https": true
    }
  }
}
```

参阅 [使用 Webhooks](/langsmith/use-webhooks#add-headers-to-webhook-requests) 以了解有关头配置、环境变量模板化和 URL 限制的详细信息。

<a id="api-version"></a>
#### 固定 API 版本

_(在 v0.3.7 中添加)_

您可以通过使用 `api_version` 键来固定 Agent Server 的 API 版本。如果您希望确保服务器使用特定版本的 API，这非常有用。
默认情况下，云端外部部署中的构建将使用服务器的最新稳定版本。这可以通过将 `api_version` 设置为特定版本来固定。

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "dependencies": ["."],
  "graphs": {
    "chat": "chat.graph:graph"
  },
  "api_version": "0.2"
}
```

</Tab>

<Tab title="JS">

#### 基本配置

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "graphs": {
    "chat": "./src/graph.ts:graph"
  }
}
```

<a id="api-version"></a>
#### 固定 API 版本

_(在 v0.3.7 中添加)_

您可以通过使用 `api_version` 键来固定 Agent Server 的 API 版本。如果您想确保服务器使用特定版本的 API，这很有用。
默认情况下，云端部署中的构建使用服务器的最新稳定版本。这可以通过将 `api_version` 键设置为特定版本来固定。

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "dependencies": ["."],
  "graphs": {
    "chat": "./src/chat/graph.ts:graph"
  },
  "api_version": "0.2"
}
```

</Tab>

</Tabs>

## 命令

**用法**

<Tabs>

<Tab title="Python">

LangGraph CLI 的基础命令是 `langgraph`。

```bash
langgraph [OPTIONS] COMMAND [ARGS]
```

</Tab>

<Tab title="JS">

LangGraph.js CLI 的基础命令是 `langgraphjs`。

```bash
npx @langchain/langgraph-cli [OPTIONS] COMMAND [ARGS]
```

推荐使用 `npx` 以确保始终使用最新版本的 CLI。

</Tab>

</Tabs>

### `dev`

<Tabs>

<Tab title="Python">

以开发模式运行 LangGraph API 服务器，支持热重载（hot reloading）和调试功能。此轻量级服务器无需安装 Docker，适用于开发和测试。状态将持久化到本地目录。

<Note>
目前 CLI 仅支持 Python >= 3.11。
</Note>

    **安装**

此命令需要安装 "inmem" 额外组件：

```bash
pip install -U "langgraph-cli[inmem]"
```

    **用法**

```bash
langgraph dev [OPTIONS]
```

    **选项**

| 选项 | 默认值 | 描述 |
| ----------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| `-c, --config FILE`           | `langgraph.json` | 声明依赖项、图和环境变量的配置文件路径 |
| `--host TEXT`                 | `127.0.0.1`      | 服务器绑定的主机名 |
| `--port INTEGER`              | `2024`           | 服务器绑定的端口 |
| `--no-reload`                 |                  | 禁用自动重载 |
| `--n-jobs-per-worker INTEGER` |                  | 每个工作进程的任务数。默认为 10 |
| `--debug-port INTEGER`        |                  | 调试器监听的端口 |
| `--wait-for-client`           | `False`          | 在启动服务器前等待调试客户端连接到调试端口 |
| `--no-browser`                |                  | 服务器启动时跳过自动打开浏览器 |
| `--studio-url TEXT`           |                  | 要连接的 Studio 实例 URL。默认为 https://smith.langchain.com |
| `--allow-blocking`            | `False`          | 对代码中的同步 I/O 阻塞操作不要抛出错误（在 `0.2.6` 中添加） |
| `--tunnel`                    | `False`          | 通过公共隧道（Cloudflare）暴露本地服务器以便远程前端访问。这可以避免 Safari 等浏览器或网络环境阻塞 localhost 连接的问题 |
| `--help`                      |                  | 显示命令文档 |

</Tab>

<Tab title="JS">

以开发模式运行 LangGraph API 服务器，支持热重载功能。此轻量级服务器无需安装 Docker，适用于开发和测试。状态将持久化到本地目录。

    **用法**

```bash
npx @langchain/langgraph-cli dev [OPTIONS]
```

    **选项**

| 选项 | 默认值 | 描述 |
| ----------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| `-c, --config FILE`           | `langgraph.json` | 声明依赖项、图和环境变量的配置文件路径 |
| `--host TEXT`                 | `127.0.0.1`      | 服务器绑定的主机名 |
| `--port INTEGER`              | `2024`           | 服务器绑定的端口 |
| `--no-reload`                 |                  | 禁用自动重载 |
| `--n-jobs-per-worker INTEGER` |                  | 每个工作进程的任务数。默认为 10 |
| `--debug-port INTEGER`        |                  | 调试器监听的端口 |
| `--wait-for-client`           | `False`          | 在启动服务器前等待调试客户端连接到调试端口 |
| `--no-browser`                |                  | 服务器启动时跳过自动打开浏览器 |
| `--studio-url TEXT`           |                  | 要连接的 Studio 实例 URL。默认为 https://smith.langchain.com |
| `--allow-blocking`            | `False`          | 对代码中的同步 I/O 阻塞操作不要抛出错误 |
| `--tunnel`                    | `False`          | 通过公共隧道（Cloudflare）暴露本地服务器以便远程前端访问。这可以避免浏览器或网络系统阻塞 localhost 连接的问题 |
| `--help`                      |                  | 显示命令文档 |

</Tab>

</Tabs>

### `build`

<Tabs>

<Tab title="Python">

构建 LangSmith API 服务器 Docker 镜像。

    **用法**

```bash
langgraph build [OPTIONS]
```

    **选项**

| 选项 | 默认值 | 描述 |
| -------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `--platform TEXT`    |                  | 构建 Docker 镜像的目标平台。示例：`langgraph build --platform linux/amd64,linux/arm64` |
| `-t, --tag TEXT`     |                  | **必需**。Docker 镜像标签。示例：`langgraph build -t my-image` |
| `--pull / --no-pull` | `--pull`         | 使用最新的远程 Docker 镜像进行构建。使用 `--no-pull` 则使用本地构建的镜像运行服务器。 |
| `-c, --config FILE`  | `langgraph.json` | 声明依赖项、图和环境变量的配置文件路径。 |
| `--build-command TEXT`<sup>*</sup> |  | 要运行的构建命令。在 `langgraph.json` 所在目录执行。示例：`langgraph build --build-command "yarn run turbo build"` |
| `--install-command TEXT`<sup>*</sup> |  | 要运行的安装命令。在调用 `langgraph build` 的目录执行。示例：`langgraph build --install-command "yarn install"` |
| `--help`             |                  | 显示命令文档。 |

    <sup>*</sup>仅支持 JS 部署，对 Python 部署没有影响。

</Tab>

<Tab title="JS">

构建 LangSmith API 服务器 Docker 镜像。

    **用法**

```bash
npx @langchain/langgraph-cli build [OPTIONS]
```

    **选项**

| 选项 | 默认值 | 描述 |
| -------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `--platform TEXT`    |                  | 构建 Docker 镜像的目标平台。示例：`langgraph build --platform linux/amd64,linux/arm64` |
| `-t, --tag TEXT`     |                  | **必需**。Docker 镜像标签。示例：`langgraph build -t my-image` |
| `--no-pull`          |                  | 使用本地构建的镜像。默认为 `false`（即使用远程最新镜像）。 |
| `-c, --config FILE`  | `langgraph.json` | 声明依赖项、图和环境变量的配置文件路径。 |
| `--help`             |                  | 显示命令文档。 |

</Tab>

</Tabs>

### `up`

<Tabs>

<Tab title="Python">

启动 LangGraph API 服务器。本地测试需要具有 LangSmith 访问权限的 API 密钥。生产环境需要许可证密钥。

    **用法**

```bash
langgraph up [OPTIONS]
```

    **选项**

| 选项 | 默认值 | 描述 |
| ---------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `--wait`                     |                           | 等待服务启动后再返回。隐含 --detach 参数。 |
| `--base-image TEXT`          | `langchain/langgraph-api`  | LangGraph API 服务器使用的基础镜像。可以通过版本标签固定到特定版本。 |
| `--image TEXT`               |                           | langgraph-api 服务使用的 Docker 镜像。如果指定，则跳过构建并直接使用此镜像。 |
| `--postgres-uri TEXT`        | 本地数据库 | 数据库使用的 Postgres URI。 |
| `--watch`                    |                           | 文件更改时重启服务。 |
| `--debugger-base-url TEXT`   | `http://127.0.0.1:[PORT]` | 调试器访问 LangGraph API 使用的 URL。 |
| `--debugger-port INTEGER`    |                           | 在本地拉取调试器镜像并在指定端口提供 UI 服务。 |
| `--verbose`                  |                           | 显示更多服务器日志输出。 |
| `-c, --config FILE`          | `langgraph.json`          | 声明依赖项、图和环境变量的配置文件路径。 |
| `-d, --docker-compose FILE`  |                           | 具有额外服务的 docker-compose.yml 文件路径。 |
| `-p, --port INTEGER`         | `8123`                    | 暴露端口。例如：`langgraph up --port 8000` |
| `--pull / --no-pull`         | `pull`                    | 拉取最新镜像。使用 `--no-pull` 以使用本地构建的镜像运行服务器。例如：`langgraph up --no-pull` |
| `--recreate / --no-recreate` | `no-recreate`             | 即使容器配置和镜像没变，也重新创建容器。 |
| `--help`                     |                           | 显示命令文档。 |

</Tab>

<Tab title="JS">

启动 LangGraph API 服务器。本地测试需要具有 LangSmith 访问权限的 API 密钥。生产环境需要许可证密钥。

    **用法**

```bash
npx @langchain/langgraph-cli up [OPTIONS]
```

    **选项**

| 选项 | 默认值 | 描述 |
| ---------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| <span :style="{ whiteSpace: 'nowrap' }">`--wait`</span>                     |                           | 等待服务启动后再返回。隐含 --detach 参数。 |
| <span :style="{ whiteSpace: 'nowrap' }">`--base-image TEXT`</span>          | <span :style="{ whiteSpace: 'nowrap' }">`langchain/langgraph-api`</span> | 服务器基础镜像。使用版本标签固定特定版本。 |
| <span :style="{ whiteSpace: 'nowrap' }">`--image TEXT`</span>               |                           | 使用的 Docker 镜像。指定则跳过构建。 |
| <span :style="{ whiteSpace: 'nowrap' }">`--postgres-uri TEXT`</span>        | 本地数据库 | 数据库 Postgres URI。 |
| <span :style="{ whiteSpace: 'nowrap' }">`--watch`</span>                    |                           | 文件更改时重启。 |
| <span :style="{ whiteSpace: 'nowrap' }">`-c, --config FILE`</span>          | `langgraph.json`          | 配置文件路径。 |
| <span :style="{ whiteSpace: 'nowrap' }">`-d, --docker-compose FILE`</span>  |                           | 附带服务的 docker-compose.yml 路径。 |
| <span :style="{ whiteSpace: 'nowrap' }">`-p, --port INTEGER`</span>         | `8123`                    | 暴露端口。 |
| <span :style="{ whiteSpace: 'nowrap' }">`--no-pull`</span>                  |                           | 使用本地构建镜像。默认 `false`（即远程拉取）。 |
| <span :style="{ whiteSpace: 'nowrap' }">`--recreate`</span>                 |                           | 强制重新创建容器。 |
| <span :style="{ whiteSpace: 'nowrap' }">`--help`</span>                     |                           | 显示命令文档。 |

</Tab>

</Tabs>

### `dockerfile`

<Tabs>

<Tab title="Python">

生成用于构建 LangSmith API 服务器 Docker 镜像的 Dockerfile。

    **用法**

```bash
langgraph dockerfile [OPTIONS] SAVE_PATH
```

    **选项**

| 选项 | 默认值 | 描述 |
| ------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `-c, --config FILE` | `langgraph.json` | 声明依赖项、图和环境变量的 [配置文件](#configuration-file) 路径。 |
| `--help` | | 显示此消息并退出。 |

示例：

```bash
langgraph dockerfile -c langgraph.json Dockerfile
```

这将生成一个类似于以下的 Dockerfile：

```dockerfile
FROM langchain/langgraph-api:3.11

ADD ./pipconf.txt /pipconfig.txt

RUN PIP_CONFIG_FILE=/pipconfig.txt PYTHONDONTWRITEBYTECODE=1 pip install --no-cache-dir -c /api/constraints.txt langchain_community langchain_anthropic langchain_openai wikipedia scikit-learn

ADD ./graphs /deps/__outer_graphs/src
RUN set -ex && \
    for line in '[project]' \
                'name = "graphs"' \
                'version = "0.1"' \
                '[tool.setuptools.package-data]' \
                '"*" = ["**/*"]'; do \
        echo "$line" >> /deps/__outer_graphs/pyproject.toml; \
    done

RUN PIP_CONFIG_FILE=/pipconfig.txt PYTHONDONTWRITEBYTECODE=1 pip install --no-cache-dir -c /api/constraints.txt -e /deps/*

ENV LANGSERVE_GRAPHS='{"agent": "/deps/__outer_graphs/src/agent.py:graph", "storm": "/deps/__outer_graphs/src/storm.py:graph"}'
```

<Note>
`langgraph dockerfile` 命令将 `langgraph.json` 文件中的所有配置转换为 Dockerfile 指令。使用此命令时，每当更新 `langgraph.json` 文件，您都必须重新运行该命令。否则，您的更改将不会在构建或运行 Dockerfile 时体现出来。
</Note>

</Tab>

<Tab title="JS">

生成用于构建 LangSmith API 服务器 Docker 镜像的 Dockerfile。

    **用法**

```bash
npx @langchain/langgraph-cli dockerfile [OPTIONS] SAVE_PATH
```

    **选项**

| 选项 | 默认值 | 描述 |
| ------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `-c, --config FILE` | `langgraph.json` | 声明依赖项、图和环境变量的 [配置文件](#configuration-file) 路径。 |
| `--help` | | 显示此消息并退出。 |

示例：

```bash
npx @langchain/langgraph-cli dockerfile -c langgraph.json Dockerfile
```

这将生成一个类似于以下的 Dockerfile：

```dockerfile
FROM langchain/langgraphjs-api:20

ADD . /deps/agent

RUN cd /deps/agent && yarn install

ENV LANGSERVE_GRAPHS='{"agent":"./src/react_agent/graph.ts:graph"}'

WORKDIR /deps/agent

RUN (test ! -f /api/langgraph_api/js/build.mts && echo "Prebuild script not found, skipping") || tsx /api/langgraph_api/js/build.mts
```

<Note>
`npx @langchain/langgraph-cli dockerfile` 命令将 `langgraph.json` 文件中的所有配置转换为 Dockerfile 指令。使用此命令时，每当更新 `langgraph.json` 文件，您都必须重新运行该命令。否则，您的更改将不会在构建或运行 Dockerfile 时体现出来。
</Note>

</Tab>

</Tabs>

