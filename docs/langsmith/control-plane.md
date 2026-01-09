---
title: LangSmith 控制平面
sidebarTitle: Control plane
---
**控制平面**是 LangSmith 中负责管理部署的部分。它包括控制平面 UI（用户在此创建和更新 [Agent Server](/langsmith/agent-server)）以及支持该 UI 并提供编程访问的控制平面 API。

当您通过控制平面进行更新时，更新会存储在控制平面状态中。[数据平面](/langsmith/data-plane) 的 "listener" 通过调用控制平面 API 来轮询这些更新。

## 控制平面 UI

通过控制平面 UI，您可以：

*   查看待处理部署的列表。
*   查看单个部署的详细信息。
*   创建新部署。
*   更新部署。
*   更新部署的环境变量。
*   查看部署的构建和服务器日志。
*   查看部署指标，如 CPU 和内存使用情况。
*   删除部署。

控制平面 UI 内嵌在 [LangSmith](https://docs.smith.langchain.com) 中。

## 控制平面 API

本节描述控制平面 API 的数据模型。该 API 用于创建、更新和删除部署。更多详情请参阅 [控制平面 API 参考](/langsmith/api-ref-control-plane)。

### 集成

集成是 `git` 仓库提供程序（例如 GitHub）的抽象。它包含连接和从 `git` 仓库部署所需的所有元数据。

### 部署

部署是 Agent Server 的一个实例。单个部署可以有许多修订版本。

### 修订版本

修订版本是部署的一次迭代。创建新部署时，会自动创建一个初始修订版本。要部署代码更改或更新部署的密钥，必须创建一个新的修订版本。

### 监听器

监听器是一个 ["listener" 应用程序](/langsmith/data-plane#”listener”-application) 的实例。监听器包含有关应用程序的元数据（例如版本）以及有关其可部署到的计算基础设施的元数据（例如 Kubernetes 命名空间）。

监听器数据模型仅适用于 [混合部署](/langsmith/hybrid) 和 [自托管部署](/langsmith/self-hosted)。

## 控制平面功能

本节介绍控制平面的各种功能。

### 部署类型

为简化起见，控制平面提供两种具有不同资源分配的部署类型：`Development` 和 `Production`。

| **部署类型** | **CPU/内存** | **扩缩容** | **数据库** |
| :--- | :--- | :--- | :--- |
| Development | 1 CPU, 1 GB RAM | 最多 1 个副本 | 10 GB 磁盘，无备份 |
| Production | 2 CPU, 2 GB RAM | 最多 10 个副本 | 自动扩缩磁盘，自动备份，高可用（多区域配置） |

CPU 和内存资源是每个副本的。

<Warning>

<strong>不可变的部署类型</strong>
部署创建后，其类型无法更改。

</Warning>

<Info>

<strong>自托管部署</strong>
[混合部署](/langsmith/hybrid) 和 [自托管部署](/langsmith/self-hosted) 的资源可以完全自定义。部署类型仅适用于 [云部署](/langsmith/cloud)。

</Info>

#### Production

`Production` 类型部署适用于 "生产" 工作负载。例如，对于关键路径中面向客户的应用程序，请选择 `Production`。

`Production` 类型部署的资源可以根据具体用例和容量限制，按个案手动增加。如需请求增加资源，请通过 [support.langchain.com](https://support.langchain.com) 联系支持团队。

#### Development

`Development` 类型部署适用于开发和测试。例如，对于内部测试环境，请选择 `Development`。`Development` 类型部署不适用于 "生产" 工作负载。

<Danger>

**可抢占式计算基础设施**
`Development` 类型部署（API 服务器、队列服务器和数据库）配置在可抢占式计算基础设施上。这意味着计算基础设施 **可能在任何时候被终止，且不另行通知**。这可能导致间歇性的...

*   Redis 连接超时/错误
*   Postgres 连接超时/错误
*   失败或重试的后台运行

这是预期行为。可抢占式计算基础设施 **显著降低了配置 `Development` 类型部署的成本**。Agent Server 在设计上是容错的。其实现会自动尝试从 Redis/Postgres 连接错误中恢复，并重试失败的后台运行。

`Production` 类型部署配置在持久性计算基础设施上，而非可抢占式计算基础设施。

</Danger>

`Development` 类型部署的数据库磁盘大小可以根据具体用例和容量限制，按个案手动增加。对于大多数用例，应配置 [TTLs](/langsmith/configure-ttl) 来管理磁盘使用量。如需请求增加资源，请通过 [support.langchain.com](https://support.langchain.com) 联系支持团队。

### 数据库配置

控制平面和 [数据平面](/langsmith/data-plane) 的 "listener" 应用程序协同工作，为每个部署自动创建一个 Postgres 数据库。该数据库作为部署的 [持久化层](/oss/langgraph/persistence#memory-store)。

在实现 LangGraph 应用程序时，开发人员无需配置 [检查点器](/oss/langgraph/persistence#checkpointer-libraries)。相反，系统会自动为图配置一个检查点器。为图配置的任何检查点器都将被自动配置的检查点器替换。

无法直接访问数据库。所有对数据库的访问都通过 [Agent Server](/langsmith/agent-server) 进行。

数据库在部署本身被删除之前永远不会被删除。

<Info>

可以为 [混合部署](/langsmith/hybrid) 和 [自托管部署](/langsmith/self-hosted) 配置自定义的 Postgres 实例。

</Info>

### 异步部署

部署和修订版本的基础设施是异步配置和部署的。它们不会在提交后立即部署。目前，部署可能需要长达几分钟的时间。

*   创建新部署时，会为该部署创建一个新数据库。数据库创建是一次性步骤。此步骤导致部署的初始修订版本的部署时间较长。
*   为部署创建后续修订版本时，没有数据库创建步骤。后续修订版本的部署时间比初始修订版本快得多。
*   每个修订版本的部署过程都包含一个构建步骤，该步骤可能需要几分钟。

控制平面和 [数据平面](/langsmith/data-plane) 的 "listener" 应用程序协同工作以实现异步部署。

### 监控

部署就绪后，控制平面会监控部署并记录各种指标，例如：

*   部署的 CPU 和内存使用情况。
*   容器重启次数。
*   副本数量（这会随着 [自动扩缩容](/langsmith/data-plane#autoscaling) 而增加）。
*   [PostgreSQL](/langsmith/data-plane#postgres) 的 CPU、内存使用情况和磁盘使用情况。
*   [Agent Server 队列](/langsmith/agent-server#persistence-and-task-queue) 的待处理/活动运行计数。
*   [Agent Server API](/langsmith/agent-server) 的成功响应计数、错误响应计数和延迟。

这些指标在控制平面 UI 中以图表形式显示。

### LangSmith 集成

系统会为每个部署自动创建一个 [LangSmith](/langsmith/home) 追踪项目。该追踪项目的名称与部署名称相同。创建部署时，无需指定 `LANGCHAIN_TRACING` 和 `LANGSMITH_API_KEY`/`LANGCHAIN_API_KEY` 环境变量；它们由控制平面自动设置。

删除部署时，追踪记录和追踪项目不会被删除。
