---
title: 代理服务器更新日志
sidebarTitle: Agent Server changelog
rss: true
---

<Callout icon="rss" color="#DFC5FE" iconType="regular">

<strong>订阅</strong>：我们的更新日志包含一个 [RSS 源](https://docs.langchain.com/langsmith/agent-server-changelog/rss.xml)，可与 [Slack](https://slack.com/help/articles/218688467-Add-RSS-feeds-to-Slack)、[电子邮件](https://zapier.com/apps/email/integrations/rss/1441/send-new-rss-feed-entries-via-email)、Discord 机器人（如 [Readybot](https://readybot.io/) 或 [RSS Feeds to Discord Bot](https://rss.app/en/bots/rssfeeds-discord-bot)）以及其他订阅工具集成。

</Callout>

[Agent Server](/langsmith/agent-server) 是一个用于创建和管理基于智能体的应用程序的 API 平台。它提供内置的持久化、任务队列，并支持大规模部署、配置和运行助手（智能体工作流）。此更新日志记录了 Agent Server 版本的所有重要更新、功能和修复。

<Update label="2026-01-08" :tags="['agent-server']">

## v0.6.27

- 修复了处理空线程元数据时的回归问题。

</Update>

<Update label="2026-01-08" :tags="['agent-server']">

## v0.6.26

- 修复了持久化 gRPC 服务器的端口配置问题。

</Update>

<Update label="2026-01-08" :tags="['agent-server']">

## v0.6.25

- 在执行器层运行 core-api gRPC 服务器以支持图中的回环 API 调用，并移除了用于禁用该服务器的不必要配置。

</Update>

<Update label="2026-01-07" :tags="['agent-server']">

## v0.6.24

- 修复了执行器层中存活探针的行为，解决了版本 0.6.23 中的问题。

</Update>

<Update label="2026-01-07" :tags="['agent-server']">

## v0.6.23

- 将 gRPC 服务器健康检查与存活探针中的 `/ok` 端点集成，以确保正确的启动协调。
- 撤销了之前禁用检查点的更改，并添加了一个条件，仅在测试期间启用 RemoteCheckpointer。
- 在检查点元数据中抑制了 `langgraph_auth_*` 和 `langgraph_request_id` 字段，以防止包含临时用户数据。

</Update>

<Update label="2026-01-06" :tags="['agent-server']">

## v0.6.22

- 解决了在使用仅 blob 自定义加密时因缺少加密上下文而导致的错误，确保功能正常运行无误。

</Update>

<Update label="2026-01-06" :tags="['agent-server']">

## v0.6.21

- 引入了用于运行操作的 Python gRPC 客户端，包括 `Search`、`Get`、`Delete`、`Cancel`、`Stats` 和 `Sweep`，并更新了 API 实现，以及用于枚举映射的新单元测试套件。

</Update>

<Update label="2026-01-06" :tags="['agent-server']">

## v0.6.19

- 在引擎服务器中复制了 `get_state` 和 `update_state` 的 OSS 实现，并重新启用了 `test_weather_subgraph`。

</Update>

<Update label="2026-01-05" :tags="['agent-server']">

## v0.6.18

- 增加了为自托管企业用户强制执行特定许可证声明的功能，支持远程禁用 Agent Builder 产品。
- 添加了新的 Prune 端点以改进资源管理。
- 在 Pregel 中将图配置与调用配置合并，优先使用调用设置。
- 向 GET /threads/{id} 端点引入了 `include=ttl` 查询参数，用于可选地检索 TTL 信息，而不影响标准读取性能。
- 引入了 `keep_latest` TTL 策略，以保留最新状态，同时通过核心 API 清理较旧的检查点。

</Update>

<Update label="2025-12-31" :tags="['agent-server']">

## v0.6.17

- 确保在删除智能体时停止正在进行的运行，以防止残留进程。

</Update>

<Update label="2025-12-30" :tags="['agent-server']">

## v0.6.16

- 在 Go 持久化层中简化和整合了运行操作，提高了跨包的效率和一致性。

</Update>

<Update label="2025-12-26" :tags="['agent-server']">

## v0.6.15

- 改进了将自定义路由文档字符串转换为 OpenAPI 模式内容的实用程序，在解析文档字符串时添加了错误处理，适用于拥有自定义 Starlette 应用程序的用户。

</Update>

<Update label="2025-12-23" :tags="['agent-server']">

## v0.6.12

- 改进了 resolve_embeddings 的健壮性，支持多次调用而无错误。
- 将 `@langchain/langgraph` 从版本 1.0.4 更新到 1.0.7，增加了对远程图上 resumableStreams 的支持，并取消了对 toolsCondition 的弃用。
- 实现了 `RemoteCheckpointer` 以支持子图检查点，增强了任务执行的可靠性。

</Update>

<Update label="2025-12-20" :tags="['agent-server']">

## v0.6.11

- 使最大重试次数可配置，以增强自定义能力。

</Update>

<Update label="2025-12-20" :tags="['agent-server']">

## v0.6.10

- 确保运行取消仅处理 'message' 类型的 Redis 事件，提高了 pubsub 客户端的可靠性。
- 为 Store API 的 `value` 字段添加了自定义加密，允许用户选择加密哪些密钥以增强安全性。
- 通过更新 TeeStream 以分别处理事件类型，启用了子图自定义事件的流式传输。

</Update>

<Update label="2025-12-18" :tags="['agent-server']">

## v0.6.9

- 强制执行稳定的 JSON 密钥用于自定义加密，移除了特定于模型类型的自定义 JSON 函数，并改进了对双重加密场景的错误处理。

</Update>

<Update label="2025-12-18" :tags="['agent-server']">

## v0.6.8

- 添加了性能分析功能，以增强性能分析和监控。

</Update>

<Update label="2025-12-18" :tags="['agent-server']">

## v0.6.7

- 记录了服务器启动时间，以改进监控和诊断。

</Update>

<Update label="2025-12-17" :tags="['agent-server']">

## v0.6.5

- 添加了在导入时触发的警告日志，以提高可见性。

</Update>

<Update label="2025-12-16" :tags="['agent-server']">

## v0.6.4

- 通过并行化元数据和配置处理增强了自定义加密，为 thread.config 和一些检查点添加了加密，改进了测试和模式一致性。
- 确保 Go 服务器在队列入口点以 `core-api` 启动，以实现一致的运行时行为。

</Update>

<Update label="2025-12-15" :tags="['agent-server']">

## v0.6.2

- 解决了在指定 `mount_prefix` 时导致中间件重复调用的问题。

</Update>

<Update label="2025-12-15" :tags="['agent-server']">

## v0.6.0

此次要版本更新了流式 API `/join-stream` 和 `/stream` 关于 `last-event-id` 参数的行为，以符合 SSE 规范。以前，传递一个 last-event-id 会返回该消息以及之后的任何消息。今后，这些 API 将只返回提供的 last-event-id 之后的新消息。例如，对于以下流，以前传递 last-event-id 为 `2` 会返回 id 为 `2` 和 `3` 的消息，但现在只会返回 id 为 `3` 的消息：

```json
{
    "id": 1,
    "event": "message",
    "data": {
        "content": "Excluded"
    }
},
{
    "id": 2,
    "event": "message",
    "data": {
        "content": "Passed last-event-id"
    }
},
{
    "id": 3,
    "event": "message",
    "data": {
        "content": "Included"
    }
}
```

此版本还包括一些修复，包括一个在运行流中暴露意外内部事件的错误。

</Update>

<Update label="2025-12-12" :tags="['agent-server']">

## v0.5.42

- 修改了 Go 服务器，使其仅依赖 CLI 的 `-service` 标志来确定服务模式，忽略全局设置的 `FF_USE_CORE_API`，以实现更好的部署特异性。

</Update>

<Update label="2025-12-11" :tags="['agent-server']">

## v0.5.41

通过确保正确初始化 ENTERPRISE_SAAS 全局标志，修复了混合模式下 cron 作业的问题。

</Update>

<Update label="2025-12-10" :tags="['agent-server']">

## v0.5.39

- 完成了对运行和 cron 的自定义加密实现，并简化了加密流程。
- 引入了对 `values` 和 `updates` 两种流模式下子图事件流式传输的支持。

</Update>

<Update label="2025-12-10" :tags="['agent-server']">

## v0.5.38

- 实现了线程的完整自定义加密，确保所有线程数据得到适当保护和加密。
- 确保 Redis 尝试标志被一致地过期，以防止数据过时。
- 添加了核心身份验证和对 OR/AND 过滤器的支持，增强了安全性和灵活性。

</Update>

<Update label="2025-12-09" :tags="['agent-server']">

## v0.5.37

为助手计数 API 添加了 `name` 参数，以提高搜索灵活性。

</Update>

<Update label="2025-12-09" :tags="['agent-server']">

## v0.5.36

- 引入了可配置的 webhook 支持，允许用户自定义提交的 webhook 和标头。
- 在根目录添加了 `/ok` 端点，以便于健康检查和简化配置。

</Update>

<Update label="2025-12-08" :tags="['agent-server']">

## v0.5.34

引入了自定义加密中间件，允许用户定义自己的加密方法以增强数据保护。

</Update>

<Update label="2025-12-08" :tags="['agent-server']">

## v0.5.33

将 Uvicorn 的 keep-alive 超时设置为 75 秒，以防止偶尔的 502 错误并改进连接处理。

</Update>

<Update label="2025-12-06" :tags="['agent-server']">

## v0.5.32

引入了 OpenTelemetry 遥测代理，支持 New Relic 集成。

</Update>

<Update label="2025-12-05" :tags="['agent-server']">

## v0.5.31

添加了 Py-Spy 性能分析功能，以改进部署性能分析，但在覆盖率方面存在一些限制。

</Update>

<Update label="2025-12-05" :tags="['agent-server']">

## v0.5.30

- 始终配置回环传输客户端以增强可靠性。
- 确保在 JS 中为远程非流式方法传递身份验证标头。

</Update>

<Update label="2025-12-04" :tags="['agent-server']">

## v0.5.28

- 引入了更快的、基于 Rust 的 uuid7 实现以提高性能，现在用于 langsmith 和 langchain-core。
- 在 PostgreSQL 身份验证过滤器中添加了对 `$or` 和 `$and` 的支持，以在身份验证检查中启用复杂逻辑。
- 限制了 psycopg 和 psycopg-pool 的版本，以防止启动时无限等待。

</Update>

<Update label="2025-11-26" :tags="['agent-server']">

## v0.5.27

- 确保带过滤器的 `runs.list` 仅返回运行字段，防止包含不正确的状态数据。
- (JS) 将 `uuid` 从版本 10.0.0 更新到 13.0.0，并将 `exit-hook` 从版本 4.0.0 更新到 5.0.1。

</Update>

<Update label="2025-11-24" :tags="['agent-server']">

## v0.5.26

解决了在 JavaScript 环境中使用 `store.put` 时未使用 AsyncBatchedStore 的问题。

</Update>

<Update label="2025-11-22" :tags="['agent-server']">

## v0.5.25

- 引入了通过新端点按助手 `name` 搜索助手的能力。
- 在 JavaScript 中将 store_get 返回类型转换为元组，以确保类型一致性。

</Update>

<Update label="2025-11-21" :tags="['agent-server']">

## v0.5.24

- 为 Datadog 添加了执行器指标，并增强了核心流 API 指标以改进性能跟踪。
- 禁用了 Redis Go 维护通知，以防止在 Redis 版本低于 8 时因不支持的命令而导致启动错误。

</Update>

<Update label="2025-11-20" :tags="['agent-server']">

## v0.5.20

解决了执行器服务在处理大消息时出现的错误。

</Update>

<Update label="2025-11-19" :tags="['agent-server']">

## v0.5.19

将内置的 langchain-core 升级到版本 1.0.7，以解决提示格式化漏洞。

</Update>

<Update label="2025-11-19" :tags="['agent-server']">

## v0.5.18

引入了具有 `on_run_completed: {keep,delete}` 选项的持久化 cron 线程，以增强 cron 管理和检索选项。

</Update>

<Update label="2025-11-19" :tags="['agent-server']">

## v0.5.17

增强了任务处理能力以支持多次中断，与开源功能保持一致。

</Update>

<Update label="2025-11-18" :tags="['agent-server']">

## v0.5.15

为 `Resume` 和 `Goto` 命令添加了自定义 JSON 解组，以修复映射式 null resume 解释问题。

</Update>

<Update label="2025-11-14" :tags="['agent-server']">

## v0.5.14

确保 `pg make start` 命令在启用 core-api 时正常运行。

</Update>

<Update label="2025-11-13" :tags="['agent-server']">

## v0.5.13

支持 `include` 和 `exclude`（`includes` 和 `excludes` 的复数形式键），因为文档错误地声称支持该形式。现在服务器接受任一形式。

</Update>

<Update label="2025-11-10" :tags="['agent-server']">

## v0.5.11

- 确保在流式传输线程时一致地应用身份验证处理程序，与最近的安全实践保持一致。
- 将 `undici` 依赖项从版本 6.21.3 升级到 7.16.0，引入了各种性能改进和错误修复。
- 将 `p-queue` 从版本 8.0.1 更新到 9.0.0，引入了新功能和破坏性更改，包括移除了 `throwOnTimeout` 选项。

</Update>

<Update label="2025-11-10" :tags="['agent-server']">

## v0.5.10

在队列 /ok 处理程序中实现了健康检查调用，以提高与 Kubernetes 存活性和就绪性探针的兼容性。

</Update>

<Update label="2025-11-09" :tags="['agent-server']">

## v0.5.9

- 解决了在 SIGINT 中断期间导致 `elapsed` 变量出现“未绑定局部错误”的问题。
- 将“interrupted”状态映射到 A2A 的“input-required”状态，以更好地对齐任务状态。

</Update>

<Update label="2025-11-07" :tags="['agent-server']">

## v0.5.8

- 确保在启动 langgraph-ui 时将环境变量作为字典传递，以兼容 `uvloop`。
- 在 Go 中实现了运行的 CRUD 操作，简化了 JSON 合并并提高了事务可读性，以 PostgreSQL 为参考。

</Update>

<Update label="2025-11-07" :tags="['agent-server']">

## v0.5.7

将无重试的 Redis 客户端替换为重试客户端，以更有效地处理连接错误，并降低了相应日志的严重性。

</Update>

<Update label="2025-11-06" :tags="['agent-server']">

## v0.5.6

- 添加了待处理时间指标，以更好地了解任务等待时间。
- 用 `ChannelValue` 替换了 `pb.Value`，以简化代码结构。

</Update>

<Update label="2025-11-05" :tags="['agent-server']">

## v0.5.5

使 Redis 的 `health_check_interval` 更频繁且可配置，以更好地处理空闲连接。

</Update>

<Update label="2025-11-05" :tags="['agent-server']">

## v0.5.4

实现了带有 `OPT_REPLACE_SURROGATES` 的 `ormsgpack`，并更新以兼容最新的 FastAPI 版本，该版本影响了自定义身份验证依赖项。

</Update>

<Update label="2025-11-03" :tags="['agent-server']">

## v0.5.2

为 PostgreSQL 连接在启动时添加了重试逻辑，以增强部署可靠性，并改进了错误日志记录以便于调试。

</Update>

<Update label="2025-11-03" :tags="['agent-server']">

## v0.5.1

- 解决了持久化功能与 LangChain.js 的 createAgent 功能无法正常工作的问题。
- 通过改进数据库连接池和 gRPC 客户端重用，优化了助手 CRUD 性能，减少了大型负载的延迟。

</Update>

<Update label="2025-10-31" :tags="['agent-server']">

## v0.5.0

此次要版本现在要求 langgraph-checkpoint 版本高于 3.0，以防止早期版本 langgraph-checkpoint 库中的反序列化漏洞。
`langgraph-checkpoint` 库与 `langgraph` 次要版本 0.4、0.5、0.6 和 1.0 兼容。

此版本移除了对使用"json"类型保存的负载进行反序列化的默认支持，该类型从未是默认选项。
默认情况下，对象使用 msgpack 进行序列化。在某些不常见的情况下，负载使用较旧的"json"模式进行序列化。如果这些负载包含自定义 Python 对象，除非您提供 `serde` 配置，否则它们将不再可反序列化：

```json
{
    "checkpointer": {
        "serde": {
            "allowed_json_modules": [
                ["my_agent", "my_file", "SomeType"],
            ]
        }
    }
}
```

</Update>

<Update label="2025-10-29" :tags="['agent-server']">

## v0.4.47

- 使用 TypeAdapter 验证并自动校正环境配置类型。
- 添加了对 LangChain.js 和 LangGraph.js 1.x 版本的支持，确保兼容性。
- 将 hono 库从版本 4.9.7 更新至 4.10.3，解决了 CORS 中间件安全问题并增强了 JWT 受众验证。
- 引入了模块化基准测试框架，添加了对助手和流的支持，并改进了现有的斜坡基准测试方法。
- 为核心线程 CRUD 操作引入了 gRPC API，并更新了 Python 和 TypeScript 客户端。
- 将 `hono` 包从版本 4.9.7 更新至 4.10.2，包括针对 JWT 受众验证的安全改进。
- 将 `hono` 依赖从版本 4.9.7 更新至 4.10.3，以修复安全问题并改进 CORS 中间件处理。
- 引入了线程的基本 CRUD 操作，包括创建、获取、修补、删除、搜索、计数和复制，并支持 Go、gRPC 服务器以及 Python 和 TypeScript 客户端。

</Update>

<Update label="2025-10-21" :tags="['agent-server']">

## v0.4.46

添加了启用子图事件消息流的选项，使用户能更好地控制事件通知。

</Update>

<Update label="2025-10-21" :tags="['agent-server']">

## v0.4.45

- 实现了对自定义路由的授权支持，由 `enable_custom_route_auth` 标志控制。
- 默认关闭追踪以提高性能并简化调试。

</Update>

<Update label="2025-10-18" :tags="['agent-server']">

## v0.4.44

为许可证相关键使用 Redis 键前缀，以防止与现有设置冲突。

</Update>

<Update label="2025-10-16" :tags="['agent-server']">

## v0.4.43

实现了 Redis 连接的健康检查，以防止其空闲超时。

</Update>

<Update label="2025-10-15" :tags="['agent-server']">

## v0.4.40

- 通过解决竞态条件并添加测试以确保行为一致，防止了可恢复运行和线程流中的重复消息。
- 确保在确认发布/订阅订阅之前不启动运行，以防止启动时消息丢失。
- 重命名平台名称以提升清晰度和品牌识别度。
- 使用后重置 PostgreSQL 连接以防止锁持有，并改进了事务问题的错误报告。

</Update>

<Update label="2025-10-10" :tags="['agent-server']">

## v0.4.39

- 将 `hono` 从版本 4.7.6 升级至 4.9.7，解决了与 `bodyLimit` 中间件相关的安全问题。
- 允许自定义基础认证 URL 以增强灵活性。
- 使用 'uv' 将 'ty' 依赖固定到稳定版本，以防止意外的 lint 失败。

</Update>

<Update label="2025-10-08" :tags="['agent-server']">

## v0.4.38

- 将 `LANGSMITH_API_KEY` 替换为 `LANGSMITH_CONTROL_PLANE_API_KEY`，以支持需要许可证验证的混合部署。
- 引入了自托管日志摄取支持，可通过 `SELF_HOSTED_LOGS_ENABLED` 和 `SELF_HOSTED_LOGS_ENDPOINT` 环境变量进行配置。

</Update>

<Update label="2025-10-06" :tags="['agent-server']">

## v0.4.37

要求复制线程时具备创建权限，以确保适当的授权。

</Update>

<Update label="2025-10-03" :tags="['agent-server']">

## v0.4.36

- 改进了错误处理，并为扫描循环添加了延迟，以便在 Redis 停机或取消错误期间实现更平稳的操作。
- 更新了队列入口点，当启用 `FF_USE_CORE_API` 时启动核心 API gRPC 服务器。
- 引入了对助手端点中无效配置的检查，以确保与其他端点的一致性。

</Update>

<Update label="2025-10-02" :tags="['agent-server']">

## v0.4.35

- 解决了核心 API 中的时区问题，确保准确的时间数据检索。
- 引入了新的 `middleware_order` 设置，以便在自定义中间件之前应用认证中间件，从而更精细地控制受保护路由的配置。
- 在 Redis 客户端创建期间发生错误时记录 Redis URL。
- 改进了 Go 引擎/运行时上下文传播，以确保一致的执行流程。
- 从执行器入口点移除了不必要的 `assistants.put` 调用以简化流程。

</Update>

<Update label="2025-10-01" :tags="['agent-server']">

## v0.4.34

阻止未经授权的用户更新线程 TTL 设置以增强安全性。

</Update>

<Update label="2025-10-01" :tags="['agent-server']">

## v0.4.33

- 通过记录 `LockNotOwnedError` 并将初始池迁移锁超时延长至 60 秒，改进了 Redis 锁的错误处理。
- 更新了 BaseMessage 模式以与最新的 langchain-core 版本保持一致，并同步了构建依赖项以确保本地开发的一致性。

</Update>

<Update label="2025-09-30" :tags="['agent-server']">

## v0.4.32

- 向 API 镜像添加了 GO 持久层，支持 GRPC 服务器操作和 PostgreSQL 支持，并增强了可配置性。
- 发生超时时将状态设置为错误以改进错误处理。

</Update>

<Update label="2025-09-30" :tags="['agent-server']">

## v0.4.30

- 添加了对使用 `stream_mode="events"` 时的上下文支持，并为此功能添加了新测试。
- 添加了使用 `$LANGGRAPH_SERVER_PORT` 覆盖服务器端口的支持，并移除了 Dockerfile 中不必要的 `ARG` 以简化配置。
- 将授权过滤器应用于线程删除 CTE 中的所有表引用以增强安全性。
- 引入了自托管指标摄取能力，当设置相应的环境变量时，允许每分钟将指标发送到 OTLP 收集器。
- 确保 `set_latest` 函数正确更新版本的名称和描述。

</Update>

<Update label="2025-09-26" :tags="['agent-server']">

## v0.4.29

确保在所有场景下正确清理 redis 发布/订阅连接。

</Update>

<Update label="2025-09-25" :tags="['agent-server']">

## v0.4.28

- 向队列指标服务器添加了格式参数以增强自定义能力。
- 在 CLI 中更正了 `MOUNT_PREFIX` 环境变量的使用，以与文档保持一致并防止混淆。
- 添加了一项功能，当消息因无订阅者而被丢弃时记录警告，可通过功能标志控制。
- 在 Node 镜像中添加了对 Bookworm 和 Bullseye 发行版的支持。
- 通过将执行器定义从 `langgraph-go` 仓库移入，整合了执行器定义，提高了可管理性，并更新了用于服务器迁移的检查点设置方法。
- 确保为 a2a 发送正确的响应头，提高了兼容性和通信效果。
- 整合了 PostgreSQL 检查点实现，为 `/core` 目录添加了 CI 测试，修复了 RemoteStore 测试错误，并通过事务增强了 Store 实现。
- 向队列服务器添加了 PostgreSQL 迁移，以防止在执行迁移之前添加图时出现错误。

</Update>

<Update label="2025-09-23" :tags="['agent-server']">

## v0.4.27

将 `coredis` 替换为 `redis-py`，以改善高流量负载下的连接处理和可靠性。

</Update>

<Update label="2025-09-22" :tags="['agent-server']">

## v0.4.24

- 根据 A2A 规范，添加了为 A2A 调用返回完整消息历史记录的功能。
- 向 Dockerfiles 添加了 `LANGGRAPH_SERVER_HOST` 环境变量，以支持双栈模式的自定义主机设置。

</Update>

<Update label="2025-09-22" :tags="['agent-server']">

## v0.4.23

为 redis 流使用更快的消息编解码器。

</Update>

<Update label="2025-09-19" :tags="['agent-server']">

## v0.4.22

将长流处理移植到运行流、加入和取消端点，以改进流管理。

</Update>

<Update label="2025-09-18" :tags="['agent-server']">

## v0.4.21

- 添加了 A2A 流功能，并使用 A2A SDK 增强了测试。
- 添加了 Prometheus 指标以跟踪图中、中间件和认证中的语言使用情况，以改进洞察力。
- 修复了开源软件中与块消息转换相关的错误。
- 从发布/订阅订阅中移除了 await 以减少集群测试中的不稳定性，并在关闭套件中添加了重试以增强 API 稳定性。

</Update>

<Update label="2025-09-11" :tags="['agent-server']">

## v0.4.20

优化了 Pubsub 初始化以防止开销并解决订阅时序问题，确保运行执行更顺畅。

</Update>

<Update label="2025-09-11" :tags="['agent-server']">

## v0.4.19

通过解决版本 3.2.10 中引入的函数检查，移除了 psycopg 的警告。

</Update>

<Update label="2025-09-11" :tags="['agent-server']">

## v0.4.17

过滤掉带有挂载前缀的日志以减少日志输出中的噪音。

</Update>

<Update label="2025-09-10" :tags="['agent-server']">

## v0.4.16

- 添加了对 a2a 中隐式线程创建的支持以简化操作。
- 改进了分布式运行时流中的错误序列化和发送，支持更全面的测试。

</Update>

<Update label="2025-09-09" :tags="['agent-server']">

## v0.4.13

- 在健康端点中监控队列状态，以确保在 PostgreSQL 初始化失败时行为正确。
- 解决了扫描 ID 长度不相等的问题以提高日志清晰度。
- 通过避免重新序列化 DR 负载，使用 msgpack 字节检查进行类似 json 的解析，增强了流输出。

</Update>

<Update label="2025-09-04" :tags="['agent-server']">

## v0.4.12

- 确保即使在遇到数据库连接问题时也返回指标。
- 优化了更新流以防止不必要的数据传输。
- 将 `storage_postgres/langgraph-api-server` 中的 `hono` 从版本 4.9.2 升级至 4.9.6，以改进 URL 路径解析安全性。
- 为 LangSmith 访问调用添加了重试和内存缓存，以提高对单次故障的恢复能力。

</Update>

<Update label="2025-09-04" :tags="['agent-server']">

## v0.4.11

添加了对线程更新中 TTL（生存时间）的支持。

</Update>

<Update label="2025-09-04" :tags="['agent-server']">

## v0.4.10

在分布式运行时中，更新最终检查点 -> 线程设置的序列化/反序列化逻辑。

</Update>

<Update label="2025-09-02" :tags="['agent-server']">

## v0.4.9

- 添加了对在搜索端点中按 ID 过滤搜索结果的支持，以实现更精确的查询。
- 为助手端点包含了可配置的请求头以增强请求自定义能力。
- 实现了一个简单的 A2A 端点，支持代理卡检索、任务创建和任务管理。

</Update>

<Update label="2025-08-30" :tags="['agent-server']">

## v0.4.7

停止包含 x-api-key 以增强安全性。

</Update>

<Update label="2025-08-29" :tags="['agent-server']">

## v0.4.6

修复了加入流时的竞态条件，防止重复的开始事件。

</Update>

<Update label="2025-08-29" :tags="['agent-server']">

## v0.4.5

- 确保检查点在队列之前正确启动和停止，以提高关闭和启动效率。
- 解决了当队列被取消时工作线程被过早取消的问题。
- 通过为 Redis 无法唤醒工作线程的情况添加回退，防止了队列终止。

</Update>

<Update label="2025-08-28" :tags="['agent-server']">

## v0.4.4

- 将自定义认证 thread_id 设置为 None 用于无状态运行以防止冲突。
- 通过添加唤醒工作线程和 Redis 锁实现，并更新扫描逻辑，改进了 Go 运行时中的 Redis 信号机制。

</Update>

<Update label="2025-08-27" :tags="['agent-server']">

## v0.4.3

- 向线程流添加了流模式以改进数据处理。
- 向运行添加了持久性参数以改进数据持久性。

</Update>

<Update label="2025-08-27" :tags="['agent-server']">

## v0.4.2

确保在创建运行之前初始化发布/订阅，以防止因消息丢失而导致的错误。

</Update>

<Update label="2025-08-25" :tags="['agent-server']">

## v0.4.0

次要版本 0.4 带来了一系列改进以及一些破坏性变更。

- 在线程流中正确发送了尝试消息。
- 通过在集群映射中仅使用线程 ID 进行哈希处理，并优先使用 stream_thread_cache 提高效率，减少了集群冲突。
- 引入了线程的流端点，以跟踪跨顺序执行运行的所有输出。
- 使 PostgreSQL 中的过滤器查询构建器对格式错误的表达式更加健壮，并改进了验证以防止潜在的安全风险。

此次要版本还包括一些破坏性变更，以改进服务的可用性和安全性：

- 在此次要版本中，我们停止了将请求头自动包含为运行中可配置值的做法。您可以通过在代理服务器配置中设置 **configurable_headers** 来选择加入特定模式。
- 运行流事件 ID（用于可恢复流）现在的格式为 `ms-seq`，而不是之前的格式。我们保留对旧格式的向后兼容性，但建议新代码使用新格式。

</Update>

<Update label="2025-08-25" :tags="['agent-server']">

## v0.3.4

- 为 Redis/PG 连接池添加了自定义 Prometheus 指标，并将队列服务器切换为 Uvicorn/Starlette 以改进监控。
- 通过更正 shell 命令格式并添加了用于 nginx 测试的 Makefile 目标，恢复了 Wolfi 镜像构建。

</Update>

<Update label="2025-08-22" :tags="['agent-server']">

## v0.3.3

- 为特定的 Redis 调用添加了超时，以防止工作线程保持活动状态。
- 更新了 Golang 运行时，并为不支持的功能添加了 pytest 跳过，包括传递存储到节点和消息流的初始支持。
- 引入了用于服务组合 Python 和 Node.js 图的反向代理设置，由 nginx 处理服务器路由，以促进 Node.js API 服务器的 Postgres/Redis 后端。

</Update>

<Update label="2025-08-21" :tags="['agent-server']">

## v0.3.1

向连接池添加了语句超时以防止长时间运行的查询。

</Update>

<Update label="2025-08-21" :tags="['agent-server']">

## v0.3.0

- 设置默认的15分钟语句超时，并实施对长时间运行查询的监控，以确保系统效率。
- 停止将可运行配置值传播到线程配置，因为如果您指定了checkpoint_id，这可能会导致后续运行出现问题。这是一个**轻微的行为破坏性变更**，因为线程值将不再自动反映最近运行的联合配置。但我们认为这种行为更直观。
- 通过在ops.py中处理通道名称内的事件数据，增强与旧版worker的兼容性。

</Update>

<Update label="2025-08-20" :tags="['agent-server']">

## v0.2.137

修复了一个未绑定的局部变量错误，并改进了线程中断或错误的日志记录，同时进行了类型更新。

</Update>

<Update label="2025-08-20" :tags="['agent-server']">

## v0.2.136

- 增加了增强的日志记录，以帮助调试元视图问题。
- 将执行器和运行时升级到最新版本，以提高性能和稳定性。

</Update>

<Update label="2025-08-19" :tags="['agent-server']">

## v0.2.135

确保异步协程被正确等待，以防止潜在的运行时错误。

</Update>

<Update label="2025-08-18" :tags="['agent-server']">

## v0.2.134

增强搜索功能，通过允许用户为查询结果选择特定列来提高性能。

</Update>

<Update label="2025-08-18" :tags="['agent-server']">

## v0.2.133

- 为cron、线程和助手添加了计数端点，以增强数据跟踪 (#1132)。
- 改进了SSH功能，以提高可靠性和稳定性。
- 将@langchain/langgraph-api更新到版本0.0.59，以修复无效的状态模式问题。

</Update>

<Update label="2025-08-15" :tags="['agent-server']">

## v0.2.132

- 添加了Go语言镜像，以增强项目兼容性和功能。
- 打印JS worker的内部PID，以便通过SIGUSR1信号进行进程检查。
- 解决了尝试插入重复运行记录时出现的`run_pkey`错误。
- 添加了`ty run`命令，并切换到使用uuid7生成运行ID。
- 实现了初始的Golang运行时，以扩展语言支持。

</Update>

<Update label="2025-08-14" :tags="['agent-server']">

## v0.2.131

在JS中添加了对带有描述的`object agent spec`的支持。

</Update>

<Update label="2025-08-13" :tags="['agent-server']">

## v0.2.130

- 添加了一个功能标志（FF_RICH_THREADS=false），用于在运行创建时禁用线程更新，减少锁争用并简化线程状态处理。
- 为`aput`和`apwrite`操作使用现有连接以提高性能。
- 改进了对解码问题的错误处理，以增强数据处理的可靠性。
- 从日志中排除标头以提高安全性，同时保持运行时功能。
- 修复了阻止将插槽映射到单个节点的错误。
- 添加了调试日志以跟踪JS部署中的节点执行，以改进问题诊断。
- 将默认的多任务策略更改为入队，通过消除在插入新运行时获取正在运行的任务的需求来提高吞吐量。
- 优化了`Runs.next`和`Runs.sweep`的数据库操作，以减少冗余查询并提高效率。
- 通过跳过不必要的正在运行的任务查询，提高了运行创建速度。

</Update>

<Update label="2025-08-11" :tags="['agent-server']">

## v0.2.129

- 停止将内部LGP字段传递给上下文，以防止破坏类型检查。
- 公开content-location标头，以确保API中正确的可恢复行为。

</Update>

<Update label="2025-08-08" :tags="['agent-server']">

## v0.2.128

确保助手中的`configurable`和`context`之间的同步更新，防止设置错误并支持更平滑的版本过渡。

</Update>

<Update label="2025-08-08" :tags="['agent-server']">

## v0.2.127

从可恢复流中排除未请求的流模式，以优化功能。

</Update>

<Update label="2025-08-08" :tags="['agent-server']">

## v0.2.126

- 使访问日志记录器标头可配置，以增强日志记录的灵活性。
- 对Runs.stats函数进行防抖处理，以减少昂贵调用的频率并提高性能。
- 为清理器引入了防抖机制，以提高性能和效率 (#1147)。
- 为TTL清理获取锁，以防止在横向扩展操作期间数据库被刷屏。

</Update>

<Update label="2025-08-06" :tags="['agent-server']">

## v0.2.125

更新了追踪上下文副本以使用新格式，确保兼容性。

</Update>

<Update label="2025-08-06" :tags="['agent-server']">

## v0.2.123

为队列副本添加了一个入口点，以改进部署管理。

</Update>

<Update label="2025-08-06" :tags="['agent-server']">

## v0.2.122

在`join`中使用持久化的中断状态，以确保在完成后正确处理用户的中断状态。

</Update>

<Update label="2025-08-06" :tags="['agent-server']">

## v0.2.121

- 将事件合并到单个通道，以防止竞态条件并优化启动性能。
- 确保在队列worker上调用自定义生命周期以进行正确设置，并添加了测试。

</Update>

<Update label="2025-08-04" :tags="['agent-server']">

## v0.2.120

- 恢复了运行的原始流行为，确保根据`stream_mode`设置一致地包含中断事件。
- 优化了`Runs.next`查询，将平均执行时间从约14.43毫秒减少到约2.42毫秒，提高了性能。
- 添加了对流模式"tasks"和"checkpoints"的支持，规范了UI命名空间，并升级了`@langchain/langgraph-api`以增强功能。

</Update>

<Update label="2025-07-31" :tags="['agent-server']">

## v0.2.117

在threads上添加了复合索引，以加快基于所有者的身份验证搜索，并将默认排序顺序更新为`updated_at`以提高查询性能。

</Update>

<Update label="2025-07-31" :tags="['agent-server']">

## v0.2.116

将默认的历史检查点数量从10个减少到1个，以优化性能。

</Update>

<Update label="2025-07-31" :tags="['agent-server']">

## v0.2.115

优化了缓存重用，以增强应用程序性能和效率。

</Update>

<Update label="2025-07-30" :tags="['agent-server']">

## v0.2.113

通过更新响应标头中的`X-Pagination-Total`和`X-Pagination-Next`，改进了线程搜索分页，以便更好地导航。

</Update>

<Update label="2025-07-30" :tags="['agent-server']">

## v0.2.112

- 确保同步日志记录方法被等待，并添加了一个linter以防止将来发生。
- 修复了JavaScript任务未正确填充到JS图中的问题。

</Update>

<Update label="2025-07-29" :tags="['agent-server']">

## v0.2.111

通过在连接打开时立即启动心跳，修复了JS图流失败的问题。

</Update>

<Update label="2025-07-29" :tags="['agent-server']">

## v0.2.110

在保留流行为的同时，将中断添加为join操作的默认值。

</Update>

<Update label="2025-07-28" :tags="['agent-server']">

## v0.2.109

修复了当`config_type`未设置时配置模式缺失的问题，确保配置更可靠。

</Update>

<Update label="2025-07-28" :tags="['agent-server']">

## v0.2.108

为LangGraph v0.6兼容性做准备，支持新的上下文API并修复了错误。

</Update>

<Update label="2025-07-27" :tags="['agent-server']">

## v0.2.107

- 实现了身份验证过程的缓存，以提高性能和效率。
- 通过合并计数和选择查询，优化了数据库性能。

</Update>

<Update label="2025-07-27" :tags="['agent-server']">

## v0.2.106

使日志流可恢复，增强了可靠性，并改善了重新连接时的用户体验。

</Update>

<Update label="2025-07-27" :tags="['agent-server']">

## v0.2.105

添加了一个heapdump端点，用于将内存堆信息保存到文件中。

</Update>

<Update label="2025-07-25" :tags="['agent-server']">

## v0.2.103

使用正确的元数据端点来解决数据检索问题。

</Update>

<Update label="2025-07-24" :tags="['agent-server']">

## v0.2.102

- 在wait方法中捕获中断事件，以保留langgraph 0.5.0的先前行为。
- 在JavaScript环境中添加了对SDK structlog的支持，以增强日志记录能力。

</Update>

<Update label="2025-07-24" :tags="['agent-server']">

## v0.2.101

更正了自托管部署的元数据端点。

</Update>

<Update label="2025-07-22" :tags="['agent-server']">

## v0.2.99

- 通过添加内存缓存并更有效地处理Redis连接错误，改进了许可证检查。
- 重新加载助手以保留手动创建的助手，同时丢弃从配置文件中删除的助手。
- 恢复了更改，以确保生成UI的UI命名空间是有效的JavaScript属性名。
- 确保生成UI的UI命名空间是有效的JavaScript属性名，提高了API合规性。
- 改进了错误处理，为无法处理的实体请求返回422状态码。

</Update>

<Update label="2025-07-19" :tags="['agent-server']">

## v0.2.98

向langgraph节点添加上下文，以改进日志过滤和追踪可见性。

</Update>

<Update label="2025-07-19" :tags="['agent-server']">

## v0.2.97

- 改进了与主循环上的ckpt摄取worker的互操作性，以防止任务调度问题。
- 延迟队列worker的启动，直到迁移完成后，以防止过早执行。
- 通过添加特定元数据并改进响应代码，增强了线程状态错误处理，以便在创建期间状态更新失败时提供更清晰的提示。
- 在检索线程状态时公开中断ID，以提高API透明度。

</Update>

<Update label="2025-07-17" :tags="['agent-server']">

## v0.2.96

为可配置的标头模式添加了回退机制，以更有效地处理排除/包含设置。

</Update>

<Update label="2025-07-17" :tags="['agent-server']">

## v0.2.95

- 避免在future已经完成时设置它，以防止冗余操作。
- 通过将`typing.TypedDict`切换为`typing_extensions.TypedDict`，解决了CI中的兼容性错误，适用于Python 3.12以下的版本。

</Update>

<Update label="2025-07-16" :tags="['agent-server']">

## v0.2.94

- 通过省略langgraph 0.5及以上版本的待发送数据，提高了性能。
- 改进了服务器启动日志，当设置了DD_API_KEY环境变量时提供更清晰的警告。

</Update>

<Update label="2025-07-16" :tags="['agent-server']">

## v0.2.93

移除了运行元数据的GIN索引以提高性能。

</Update>

<Update label="2025-07-16" :tags="['agent-server']">

## v0.2.92

启用了blob和检查点的复制功能，提高了数据管理的灵活性。

</Update>

<Update label="2025-07-16" :tags="['agent-server']">

## v0.2.91

通过内联小值（null、数字、字符串等），减少了对`checkpoint_blobs`表的写入。这意味着我们不需要为尚未更新的通道存储额外的值。

</Update>

<Update label="2025-07-16" :tags="['agent-server']">

## v0.2.90

通过节点本地后台队列改进检查点写入。

</Update>

<Update label="2025-07-15" :tags="['agent-server']">

## v0.2.89

通过移除外键，将检查点写入与线程/运行状态解耦，并更新了记录器以防止超时相关的失败。

</Update>

<Update label="2025-07-14" :tags="['agent-server']">

## v0.2.88

移除了`run`表中`thread`的外键约束，以简化数据库模式。

</Update>

<Update label="2025-07-14" :tags="['agent-server']">

## v0.2.87

为Redis worker信号添加了更详细的日志，以改进调试。

</Update>

<Update label="2025-07-11" :tags="['agent-server']">

## v0.2.86

在`/mcp`端点中遵循工具描述，以符合预期功能。

</Update>

<Update label="2025-07-10" :tags="['agent-server']">

## v0.2.85

为`runs/wait`添加了对`on_disconnect`字段的支持，并包含了断开连接日志以便更好地调试。

</Update>

<Update label="2025-07-09" :tags="['agent-server']">

## v0.2.84

移除了不必要的状态更新以简化线程处理，并将版本更新为0.2.84。

</Update>

<Update label="2025-07-09" :tags="['agent-server']">

## v0.2.83

- 将可恢复流的默认生存时间减少到2分钟。
- 增强了数据提交逻辑，根据许可证配置将数据发送到Beacon和LangSmith实例。
- 当配置了端点时，启用了将自托管数据提交到LangSmith实例。

</Update>

<Update label="2025-07-03" :tags="['agent-server']">

## v0.2.82

通过在CTE中使用join实现锁，解决了后台运行中的竞态条件问题，确保了跨CTE的可靠执行。

</Update>

<Update label="2025-07-03" :tags="['agent-server']">

## v0.2.81

通过减少初始等待时间优化了运行流，提高了对旧运行或不存在的运行的响应速度。

</Update>

<Update label="2025-07-03" :tags="['agent-server']">

## v0.2.80

更正了`logger.ainfo()` API调用中的参数传递，以解决TypeError。

</Update>

<Update label="2025-07-02" :tags="['agent-server']">

## v0.2.79

- 通过正确进行JSON序列化以正确处理尾部斜杠，修复了远程图检查点中的JsonDecodeError。
- 引入了一个配置标志，以全局禁用所有路由的webhook。

</Update>

<Update label="2025-07-02" :tags="['agent-server']">

## v0.2.78

- 为webhook调用添加了超时重试，以提高可靠性。
- 添加了HTTP请求指标，包括请求计数和延迟直方图，以增强监控能力。

</Update>

<Update label="2025-07-02" :tags="['agent-server']">

## v0.2.77

- 添加了HTTP指标以改进性能监控。
- 更改了Redis缓存分隔符，以减少与子图消息名称的冲突，并更新了缓存行为。

</Update>

<Update label="2025-07-01" :tags="['agent-server']">

## v0.2.76

更新了Redis缓存分隔符，以防止与子图消息冲突。

</Update>

<Update label="2025-06-30" :tags="['agent-server']">

## v0.2.74

在隔离的循环中调度webhook，以确保线程安全操作，并防止出现PYTHONASYNCIODEBUG=1时的错误。

</Update>

<Update label="2025-06-27" :tags="['agent-server']">

## v0.2.73

- 修复了无限帧循环问题，并移除了dict_parser，因为structlog的行为不符合预期。
- 在运行取消期间发生死锁时抛出409错误，以优雅地处理锁冲突。

</Update>

<Update label="2025-06-27" :tags="['agent-server']">

## v0.2.72

- 确保与未来langgraph版本的兼容性。
- 实现了409响应状态以处理取消期间的死锁问题。

</Update>

<Update label="2025-06-26" :tags="['agent-server']">

## v0.2.71

改进了日志记录，使日志类型更清晰、更详细。

</Update>

<Update label="2025-06-26" :tags="['agent-server']">

## v0.2.70

改进了错误处理，以更好地区分和记录由用户引起的超时错误与内部运行超时。

</Update>

<Update label="2025-06-26" :tags="['agent-server']">

## v0.2.69

为 crons API 添加了排序和分页功能，并更新了模式定义以提高准确性。

</Update>

<Update label="2025-06-26" :tags="['agent-server']">

## v0.2.66

修复了在使用 `on_not_exist="create"` 时，为相同 `thread_id` 创建多个运行会引发 404 错误的问题。

</Update>

<Update label="2025-06-25" :tags="['agent-server']">

## v0.2.65

- 确保仅在必要时返回来自 `assistant_versions` 的字段。
- 确保内存中和 PostgreSQL 用户的数据类型一致，改进了内部身份验证处理。

</Update>

<Update label="2025-06-24" :tags="['agent-server']">

## v0.2.64

为版本条目添加了描述，以提高清晰度。

</Update>

<Update label="2025-06-23" :tags="['agent-server']">

## v0.2.62

- 改进了 JS Studio 中自定义身份验证的用户处理。
- 在指标端点添加了 Prometheus 格式的运行统计信息，以便更好地监控。
- 在指标端点添加了 Prometheus 格式的运行统计信息。

</Update>

<Update label="2025-06-20" :tags="['agent-server']">

## v0.2.61

为 Redis 连接设置了最大空闲时间，以防止不必要的连接保持打开状态。

</Update>

<Update label="2025-06-20" :tags="['agent-server']">

## v0.2.60

- 增强了错误日志记录，包含字典操作的追溯详情。
- 添加了 `/metrics` 端点，以暴露队列工作器指标供监控使用。

</Update>

<Update label="2025-06-18" :tags="['agent-server']">

## v0.2.57

- 从可重试异常中移除了 CancelledError，以允许本地中断，同时保持工作器的可重试性。
- 引入了中间件，以便在收到 SIGINT 信号后，优雅地关闭服务器，完成正在处理的请求。
- 减少了检查点中存储的元数据，仅包含必要信息。
- 改进了 join runs 中的错误处理，在存在错误时返回错误详情。

</Update>

<Update label="2025-06-17" :tags="['agent-server']">

## v0.2.56

通过添加 SIGTERM 信号处理器，提高了应用程序的稳定性。

</Update>

<Update label="2025-06-17" :tags="['agent-server']">

## v0.2.55

- 改进了队列入口点中的取消处理。
- 改进了队列入口点中的取消处理。

</Update>

<Update label="2025-06-16" :tags="['agent-server']">

## v0.2.54

- 增强了许可证验证期间 LuaLock 超时的错误信息。
- 修复了自定义身份验证中的 `$contains` 过滤器，要求显式的 `::text` 类型转换，并相应更新了测试。
- 确保项目和租户 ID 格式化为 UUID 以保持一致性。

</Update>

<Update label="2025-06-13" :tags="['agent-server']">

## v0.2.53

- 解决了一个时序问题，确保队列仅在图注册完成后启动。
- 通过单次查询设置线程和运行状态，并增强了检查点写入时的错误处理，从而提高了性能。
- 将默认的后台宽限期减少到 3 分钟。

</Update>

<Update label="2025-06-12" :tags="['agent-server']">

## v0.2.52

- 现在当图被省略时，会记录预期的图以提高可追溯性。
- 为可恢复流实现了生存时间（TTL）功能。
- 通过添加唯一索引和优化行锁定，提高了查询效率和一致性。

</Update>

<Update label="2025-06-12" :tags="['agent-server']">

## v0.2.51

- 通过将任务标记为准备重试来处理 `CancelledError`，改进了工作进程中的错误管理。
- 在元数据和日志中添加了 LG API 版本和请求 ID，以便更好地跟踪。
- 在元数据和日志中添加了 LG API 版本和请求 ID，以提高可追溯性。
- 通过并发创建索引提高了数据库性能。
- 确保仅在设置 Redis 运行标记后才提交 PostgreSQL 写入，以防止竞态条件。
- 通过在线程ID/运行状态上添加唯一索引、优化行锁以及确保确定性的运行选择，提高了查询效率和可靠性。
- 通过确保仅在设置 Redis 运行标记后才进行 PostgreSQL 更新，解决了一个竞态条件。

</Update>

<Update label="2025-06-07" :tags="['agent-server']">

## v0.2.46

在 Threads 状态的 `update()` 和 `bulk()` 命令中，为每个操作引入了新的连接，同时保留了事务特性。

</Update>

<Update label="2025-06-05" :tags="['agent-server']">

## v0.2.45

- 通过整合追踪上下文增强了流式传输功能。
- 从 Crons.search 函数中移除了一个不必要的查询。
- 解决了为多个 cron 作业调度下一次运行时连接重用的问题。
- 移除了 Crons.search 函数中一个不必要的查询以提高效率。
- 通过改进连接重用，解决了调度下一次 cron 运行的问题。

</Update>

<Update label="2025-06-04" :tags="['agent-server']">

## v0.2.44

- 增强了工作器逻辑，当达到 Redis 消息限制时，在继续之前退出管道。
- 为 Redis 消息大小引入了上限，并提供了跳过大于 128 MB 消息的选项以提高性能。
- 确保管道始终正确关闭，以防止资源泄漏。

</Update>

<Update label="2025-06-04" :tags="['agent-server']">

## v0.2.43

- 通过在元数据调用中省略日志并确保值流式传输中的输出模式合规性，提高了性能。
- 确保连接在使用后正确关闭。
- 使输出格式严格遵循指定的模式。
- 停止在元数据请求中发送内部日志以提高隐私性。

</Update>

<Update label="2025-06-04" :tags="['agent-server']">

## v0.2.42

- 添加了时间戳以跟踪请求运行的开始和结束时间。
- 在配置设置中添加了追踪器信息。
- 添加了对带有追踪上下文的流式传输的支持。

</Update>

<Update label="2025-06-03" :tags="['agent-server']">

## v0.2.41

添加了锁定机制，以防止管道化执行中的错误。

</Update>

