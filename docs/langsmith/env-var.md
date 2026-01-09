---
title: 环境变量
sidebarTitle: Agent Server environment variables
---
Agent Server 支持特定的环境变量来配置部署。

## `BG_JOB_ISOLATED_LOOPS`

将 `BG_JOB_ISOLATED_LOOPS` 设置为 `True`，以便在与服务 API 事件循环隔离的独立事件循环中执行后台运行。

如果图/节点的实现包含同步代码，则应将此环境变量设置为 `True`。在这种情况下，同步代码会阻塞服务 API 事件循环，可能导致 API 不可用。API 不可用的一个症状是由于健康检查失败而导致应用程序持续重启。

默认为 `False`。

## `BG_JOB_SHUTDOWN_GRACE_PERIOD_SECS`

指定服务器在队列收到关闭信号后，等待后台作业完成的时长（以秒为单位）。超过此期限后，服务器将强制终止。默认为 `180` 秒。最大值为 `3600` 秒。设置此值以确保作业在关闭期间有足够的时间干净地完成。在 `langgraph-api==0.2.16` 版本中添加。

## `BG_JOB_TIMEOUT_SECS`

可以增加后台运行的超时时间。但是，云部署的基础设施对 API 请求强制执行 1 小时的超时限制。这意味着客户端和服务器之间的连接将在 1 小时后超时。这是不可配置的。

后台运行可以执行超过 1 小时，但如果运行时间超过 1 小时，客户端必须重新连接到服务器（例如，通过 `POST /threads/{thread_id}/runs/{run_id}/stream` 加入流）以从运行中检索输出。

默认为 `3600`。

## `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`

指定 `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` 来为部署配置 OpenTelemetry APM 追踪。指定其他 [`OTEL_*` 环境变量](https://opentelemetry.io/docs/collector/configuration/) 来配置追踪、日志记录和其他检测。

```shell
# 如果设置了 OTEL_EXPORTER_OTLP_TRACES_ENDPOINT 或 OTEL_EXPORTER_OTLP_ENDPOINT，
# 服务器将启用 OpenTelemetry 检测后启动。
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=<目标追踪接收端点>
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.nr-data.net
OTEL_SERVICE_NAME=MY_LANGSMITH_DEPLOYMENT
OTEL_EXPORTER_OTLP_HEADERS=api-key=<YOUR_INGEST_LICENSE_KEY>
# 常见的 OTEL 设置
OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT=4095
OTEL_EXPORTER_OTLP_COMPRESSION=gzip
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=delta
# 可选：OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED=true
```

例如，要将 OpenTelemetry 追踪提交到 [New Relic 的美国区域](https://docs.newrelic.com/docs/opentelemetry/best-practices/opentelemetry-otlp/)，请设置以下内容：

```shell
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=https://otlp.nr-data.net/v1/traces
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.nr-data.net
OTEL_EXPORTER_OTLP_HEADERS=api-key=<YOUR_INGEST_LICENSE_KEY>
```

<Note>

OTel 追踪在 Agent Server 版本 `0.5.32` 中添加，目前处于 Alpha 阶段。

</Note>

## `DD_API_KEY`

指定 `DD_API_KEY`（您的 [Datadog API 密钥](https://docs.datadoghq.com/account_management/api-app-keys/)）以自动为部署启用 Datadog 追踪。指定其他 [`DD_*` 环境变量](https://ddtrace.readthedocs.io/en/stable/configuration.html) 来配置追踪检测。

如果指定了 `DD_API_KEY`，应用程序进程将包装在 [`ddtrace-run` 命令](https://ddtrace.readthedocs.io/en/stable/installation_quickstart.html) 中。通常需要其他 `DD_*` 环境变量（例如 `DD_SITE`、`DD_ENV`、`DD_SERVICE`、`DD_TRACE_ENABLED`）来正确配置追踪检测。有关更多详细信息，请参阅 [`DD_*` 环境变量](https://ddtrace.readthedocs.io/en/stable/configuration.html)。您可以启用 `DD_TRACE_DEBUG=true` 并设置 `DD_LOG_LEVEL=debug` 来进行故障排除。

<Note>

启用 `DD_API_KEY`（从而启用 `ddtrace-run`）可能会覆盖或干扰您可能已检测到应用程序代码中的其他自动检测解决方案（例如 OpenTelemetry）。

</Note>

## `LANGCHAIN_TRACING_SAMPLING_RATE`

发送到 LangSmith 的追踪的采样率。有效值：`0` 到 `1` 之间的任意浮点数。

有关更多详细信息，请参阅 [为追踪设置采样率](/langsmith/sample-traces)。

## `LANGGRAPH_AUTH_TYPE`

Agent Server 部署的身份验证类型。有效值：`langsmith`、`noop`。

对于部署到 LangSmith 的情况，此环境变量会自动设置。对于本地开发或在外部处理身份验证的部署（例如自托管），请将此环境变量设置为 `noop`。

## `LANGGRAPH_POSTGRES_POOL_MAX_SIZE`

从 langgraph-api 版本 `0.2.12` 开始，可以使用 `LANGGRAPH_POSTGRES_POOL_MAX_SIZE` 环境变量控制 Postgres 连接池（每个副本）的最大大小。通过设置此变量，您可以确定服务器将与 Postgres 数据库建立的同时连接数的上限。

例如，如果部署扩展到 10 个副本，并且 `LANGGRAPH_POSTGRES_POOL_MAX_SIZE` 配置为 `150`，则最多可以建立 `1500` 个到 Postgres 的连接。这对于数据库资源有限（或更充足）的部署，或者出于性能或扩展原因需要调整连接行为的部署特别有用。

默认为 `150` 个连接。

## `LANGSMITH_API_KEY`

仅适用于 [自托管 LangSmith](/langsmith/self-hosted) 的部署。

要将追踪发送到自托管的 LangSmith 实例，请将 `LANGSMITH_API_KEY` 设置为从自托管实例创建的 API 密钥。

## `LANGSMITH_ENDPOINT`

仅适用于 [自托管 LangSmith](/langsmith/self-hosted) 的部署。

要将追踪发送到自托管的 LangSmith 实例，请将 `LANGSMITH_ENDPOINT` 设置为自托管实例的主机名。

## `LANGSMITH_TRACING`

将 `LANGSMITH_TRACING` 设置为 `false` 以禁用向 LangSmith 发送追踪。

默认为 `true`。

## `LOG_COLOR`

这主要在使用 `langgraph dev` 命令通过开发服务器时相关。将 `LOG_COLOR` 设置为 `true` 以在使用默认控制台渲染器时启用 ANSI 彩色控制台输出。通过将此变量设置为 `false` 来禁用彩色输出会产生单色日志。默认为 `true`。

## `LOG_LEVEL`

配置 [日志级别](https://docs.python.org/3/library/logging.html#logging-levels)。默认为 `INFO`。

## `LOG_JSON`

将 `LOG_JSON` 设置为 `true`，以使用配置的 `JSONRenderer` 将所有日志消息呈现为 JSON 对象。这会生成结构化日志，便于日志管理系统解析或摄取。默认为 `false`。

## `MOUNT_PREFIX`

<Info>

<strong>仅允许在自托管部署中使用</strong>
`MOUNT_PREFIX` 环境变量仅允许在自托管部署模型中使用，LangSmith SaaS 将不允许此环境变量。

</Info>

设置 `MOUNT_PREFIX` 以在特定路径前缀下提供 Agent Server 服务。这对于服务器位于需要特定路径前缀的反向代理或负载均衡器后面的部署非常有用。

例如，如果服务器要在 `https://example.com/langgraph` 下提供服务，请将 `MOUNT_PREFIX` 设置为 `/langgraph`。

## `N_JOBS_PER_WORKER`

Agent Server 任务队列的每个工作器的作业数。默认为 `10`。

## `POSTGRES_URI_CUSTOM`

<Info>

<strong>仅适用于混合和自托管部署</strong>
自定义 Postgres 实例仅适用于 [混合](/langsmith/hybrid) 和 [自托管](/langsmith/self-hosted) 部署。

</Info>

指定 `POSTGRES_URI_CUSTOM` 以使用自定义 Postgres 实例。`POSTGRES_URI_CUSTOM` 的值必须是有效的 [Postgres 连接 URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING-URIS)。

Postgres 要求：

* 版本 15.8 或更高。
* 必须存在初始数据库，并且连接 URI 必须引用该数据库。

控制平面功能：

* 如果指定了 `POSTGRES_URI_CUSTOM`，控制平面将不会为服务器配置数据库。
* 如果删除了 `POSTGRES_URI_CUSTOM`，控制平面将不会为服务器配置数据库，也不会删除外部管理的 Postgres 实例。
* 如果删除了 `POSTGRES_URI_CUSTOM`，修订版的部署将不会成功。一旦指定了 `POSTGRES_URI_CUSTOM`，在部署的整个生命周期中必须始终设置它。
* 如果删除了部署，控制平面将不会删除外部管理的 Postgres 实例。
* `POSTGRES_URI_CUSTOM` 的值可以更新。例如，可以更新 URI 中的密码。

数据库连接性：

* Agent Server 必须能够访问自定义 Postgres 实例。用户负责确保连接性。

## `REDIS_CLUSTER`

<Warning>

此功能处于 Alpha 阶段。

</Warning>

<Info>

<strong>仅允许在自托管部署中使用</strong>
Redis 集群模式仅在自托管部署模型中可用，LangSmith SaaS 默认会为您配置一个 redis 实例。

</Info>

将 `REDIS_CLUSTER` 设置为 `True` 以启用 Redis 集群模式。启用后，系统将使用集群模式连接到 Redis。这在连接到 Redis 集群部署时非常有用。

默认为 `False`。

## `REDIS_KEY_PREFIX`

<Info>

<strong>在 API Server 版本 0.1.9+ 中可用</strong>
此环境变量在 API Server 版本 0.1.9 及更高版本中受支持。

</Info>

指定 Redis 键的前缀。这允许多个 Agent Server 实例通过使用不同的键前缀来共享同一个 Redis 实例。

默认为 `''`。

## `REDIS_URI_CUSTOM`

<Info>

<strong>仅适用于混合和自托管部署</strong>
自定义 Redis 实例仅适用于 [混合](/langsmith/hybrid) 和 [自托管](/langsmith/self-hosted) 部署。

</Info>

指定 `REDIS_URI_CUSTOM` 以使用自定义 Redis 实例。`REDIS_URI_CUSTOM` 的值必须是有效的 [Redis 连接 URI](https://redis-py.readthedocs.io/en/stable/connections.html#redis.Redis.from_url)。

## `REDIS_MAX_CONNECTIONS`

可以使用 `REDIS_MAX_CONNECTIONS` 环境变量控制 Redis 连接池（每个副本）的最大大小。通过设置此变量，您可以确定服务器将与 Redis 实例建立的同时连接数的上限。

例如，如果部署扩展到 10 个副本，并且 `REDIS_MAX_CONNECTIONS` 配置为 `150`，则最多可以建立 `1500` 个到 Redis 的连接。

默认为 `2000`。

## `RESUMABLE_STREAM_TTL_SECONDS`

Redis 中可恢复流数据的生存时间（以秒为单位）。

当创建一个运行并流式传输其输出时，可以将流配置为可恢复的（例如 `stream_resumable=True`）。如果流是可恢复的，流的输出会临时存储在 Redis 中。此数据的 TTL 可以通过设置 `RESUMABLE_STREAM_TTL_SECONDS` 来配置。

有关如何实现可恢复流的更多详细信息，请参阅 <a href="https://reference.langchain.com/python/langsmith/deployment/sdk/#langgraph_sdk.client.RunsClient.stream" target="_blank" rel="noreferrer" class="link">Python</a> 和 [JS/TS](https://langchain-ai.github.io/langgraphjs/reference/classes/sdk_client.RunsClient.html#stream) SDK。

默认为 `120` 秒。

<Note>

为 `RESUMABLE_STREAM_TTL_SECONDS` 设置非常高的值，当存在许多具有大量或频繁流式输出的并发运行时，可能会导致大量的 Redis 内存使用。请将此值设置为最小值，以便在网络中断期间启用恢复，并优先使用检查点来实现长期持久性和执行快照。

</Note>

