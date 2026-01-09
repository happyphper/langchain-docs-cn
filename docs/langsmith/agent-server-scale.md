---
title: 配置 LangSmith 代理服务器以实现扩展
sidebarTitle: Configure Agent Server for scale
---
LangSmith Agent Server 的默认配置旨在处理各种不同工作负载下的高读写负载。通过遵循以下最佳实践，您可以针对特定工作负载优化 Agent Server 的性能。本页描述了 Agent Server 的扩展注意事项，并提供了配置部署的示例。

有关一些自托管配置的示例，请参阅[大规模示例 Agent Server 配置](#example-agent-server-configurations-for-scale)部分。

## 针对写入负载进行扩展

写入负载主要由以下因素驱动：

- 创建新的[运行](/langsmith/background-run)
- 运行执行期间创建新的检查点
- 写入长期记忆
- 创建新的[线程](/langsmith/use-threads)
- 创建新的[助手](/langsmith/assistants)
- 删除运行、检查点、线程、助手和定时任务

以下组件主要负责处理写入负载：

- API 服务器：处理初始请求并将数据持久化到数据库。
- 队列工作器：处理运行的执行。
- Redis：处理正在进行的运行相关临时数据的存储。
- Postgres：处理所有数据的存储，包括运行、线程、助手、定时任务、检查点和长期记忆。

### 扩展写入路径的最佳实践

#### 根据助手特性调整 `N_JOBS_PER_WORKER`

[`N_JOBS_PER_WORKER`](/langsmith/env-var#n-jobs-per-worker) 的默认值为 10。您可以根据助手的特性更改此值，以调整单个队列工作器一次可以执行的最大运行数量。

调整 `N_JOBS_PER_WORKER` 的一些通用指南：

- 如果您的助手受 CPU 限制，默认值 10 可能就足够了。如果您注意到队列工作器的 CPU 使用率过高或运行执行延迟，可以降低 `N_JOBS_PER_WORKER`。
- 如果您的助手受 IO 限制，请增加 `N_JOBS_PER_WORKER` 以允许每个工作器处理更多并发运行。

`N_JOBS_PER_WORKER` 没有上限。但是，队列工作器在获取新运行时是贪婪的，这意味着它们会尝试获取尽可能多的运行（只要可用作业数允许）并立即开始执行。在流量突发的环境中将 `N_JOBS_PER_WORKER` 设置得过高，可能导致工作器利用率不均和运行执行时间增加。

#### 避免同步阻塞操作

在代码中避免同步阻塞操作，优先使用异步操作。长时间的同步操作会阻塞主事件循环，导致请求和运行执行时间变长，并可能引发超时。

例如，考虑一个需要休眠 1 秒的应用程序。不要使用这样的同步代码：

```python
import time

def my_function():
    time.sleep(1)
```

应优先使用这样的异步代码：

```python
import asyncio

async def my_function():
    await asyncio.sleep(1)
```

如果助手需要执行同步阻塞操作，请将 [`BG_JOB_ISOLATED_LOOPS`](/langsmith/env-var#bg-job-isolated-loops) 设置为 `True`，以便在单独的事件循环中执行每个运行。

#### 最小化冗余检查点

通过将 [`durability`](/oss/langgraph/durable-execution#durability-modes) 设置为确保数据持久性所需的最小值，来最小化冗余检查点。

默认的持久性模式是 `"async"`，这意味着检查点会在每个步骤后异步写入。如果助手只需要持久化运行的最终状态，可以将 `durability` 设置为 `"exit"`，仅存储运行的最终状态。这可以在创建运行时设置：

```python
from langgraph_sdk import get_client

client = get_client(url=<DEPLOYMENT_URL>)
thread = await client.threads.create()
run = await client.runs.create(
    thread_id=thread["thread_id"],
    assistant_id="agent",
    durability="exit"
)
```

#### 自托管

<Note>

这些设置仅适用于[自托管](/langsmith/self-hosted)部署。默认情况下，[云端](/langsmith/cloud)部署已启用这些最佳实践。

</Note>

##### 启用队列工作器

默认情况下，API 服务器管理队列且不使用队列工作器。您可以通过将 `queue.enabled` 配置设置为 `true` 来启用队列工作器。

```yaml
queue:
  enabled: true
```

这将允许 API 服务器将队列管理卸载给队列工作器，显著减轻 API 服务器的负载，使其专注于处理请求。

##### 支持与预期吞吐量相匹配的作业数量

并行执行的运行越多，处理负载所需的作业就越多。扩展可用作业有两个主要参数：

- `number_of_queue_workers`：配置的队列工作器数量。
- `N_JOBS_PER_WORKER`：单个队列工作器一次可以执行的运行数量。默认为 10。

您可以使用以下公式计算可用作业数：
```
available_jobs = number_of_queue_workers * `N_JOBS_PER_WORKER`
```

吞吐量则是可用作业每秒可以执行的运行数量：
```
throughput_per_second = available_jobs / average_run_execution_time_seconds
```

因此，为支持预期稳态吞吐量，您应配置的最小队列工作器数量为：
```
number_of_queue_workers = throughput_per_second * average_run_execution_time_seconds / `N_JOBS_PER_WORKER`
```

##### 为突发工作负载配置自动扩缩容

默认情况下自动扩缩容是禁用的，但对于突发工作负载应进行配置。使用与[上一节](#support-a-number-of-jobs-equal-to-expected-throughput)相同的计算，您可以根据最大预期吞吐量确定自动扩缩器应扩展到的最大队列工作器数量。

## 针对读取负载进行扩展

读取负载主要由以下因素驱动：

- 获取[运行](/langsmith/background-run)的结果
- 获取[线程](/langsmith/use-threads)的状态
- 搜索[运行](/langsmith/background-run)、[线程](/langsmith/use-threads)、[定时任务](/langsmith/cron-jobs)和[助手](/langsmith/assistants)
- 检索检查点和长期记忆

以下组件主要负责处理读取负载：

- API 服务器：处理请求并从数据库直接检索数据。
- Postgres：处理所有数据的存储，包括运行、线程、助手、定时任务、检查点和长期记忆。
- Redis：处理正在进行的运行相关临时数据的存储，包括从队列工作器到 API 服务器的流式消息。

### 扩展读取路径的最佳实践

#### 使用过滤减少每个请求返回的资源数量

[Agent Server](/langsmith/agent-server) 为每种资源类型提供了搜索 API。这些 API 默认实现分页，并提供许多过滤选项。使用过滤可以减少每个请求返回的资源数量，从而提高性能。

#### 设置 TTL 以自动删除旧数据

在[线程上设置 TTL](/langsmith/configure-ttl) 以自动清理旧数据。当关联的线程被删除时，运行和检查点也会自动删除。

#### 避免轮询，使用 /join 监控运行状态

避免通过轮询来获取运行状态，应使用 `/join` API 端点。此方法在运行完成后返回运行的最终状态。

如果您需要实时监控运行的输出，请使用 `/stream` API 端点。此方法会流式传输运行输出，包括运行的最终状态。

#### 自托管

<Note>

这些设置仅适用于[自托管](/langsmith/self-hosted)部署。默认情况下，[云端](/langsmith/cloud)部署已启用这些最佳实践。

</Note>

##### 为突发工作负载配置自动扩缩容

默认情况下自动扩缩容是禁用的，但对于突发工作负载应进行配置。您可以根据最大预期吞吐量确定自动扩缩器应扩展到的最大 API 服务器数量。[云端](/langsmith/cloud)部署的默认最大 API 服务器数量为 10。

## 自托管 Agent Server 配置示例

<Note>

确切的最佳配置取决于您的应用程序复杂性、请求模式和数据需求。请结合前面章节的信息以及您的具体使用情况，参考以下示例来更新您的部署配置。如有任何疑问，请通过 [support.langchain.com](https://support.langchain.com) 联系支持团队。

</Note>

下表概述了针对不同负载模式（每秒读取请求数 / 每秒写入请求数）和标准助手特性（平均运行执行时间为 1 秒，CPU 和内存使用率适中）的各种 LangSmith Agent Server 配置的比较：

|  | **[低读取 / 低写入](#low-reads-low-writes)** | **[低读取 / 高写入](#low-reads-high-writes)** | **[高读取 / 低写入](#high-reads-low-writes)** | [中读取 / 中写入](#medium-reads-medium-writes) | [高读取 / 高写入](#high-reads-high-writes) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| <Tooltip tip="部署每秒处理的写入请求数量">每秒写入请求数</Tooltip> | 5 | 5 | 500 | 50 | 500 |
| <Tooltip tip="部署每秒处理的读取请求数量">每秒读取请求数</Tooltip> | 5 | 500 | 5 | 50 | 500 |
| **API 服务器**<br />(每台服务器 1 CPU, 2Gi) | 1 (默认) | 6 | 10 | 3 | 15 |
| **队列工作器**<br />(每个工作器 1 CPU, 2Gi) | 1 (默认) | 10 | 1 (默认) | 5 | 10 |
| **`N_JOBS_PER_WORKER`** | 10 (默认) | 50 | 10 | 10 | 50 |
| **Redis 资源** | 2 Gi (默认) | 2 Gi (默认) | 2 Gi (默认) | 2 Gi (默认) | 2 Gi (默认) |
| **Postgres 资源** | 2 CPU<br />8 Gi (默认) | 4 CPU<br />16 Gi 内存 | 4 CPU<br />16 Gi | 4 CPU<br />16 Gi 内存 | 8 CPU<br />32 Gi 内存 |

以下示例配置启用了上述每种设置。负载级别定义如下：

- 低：大约每秒 5 个请求
- 中：大约每秒 50 个请求
- 高：大约每秒 500 个请求

### 低读取，低写入 <a name="low-reads-low-writes"></a>

默认的 [LangSmith 部署](/langsmith/deployments) 配置将处理此负载。此处无需自定义资源配置。

### 低读取，高写入 <a name="low-reads-high-writes"></a>

您的部署处理大量写入请求（每秒 500 个），但读取请求相对较少（每秒 5 个）。

为此，我们推荐如下配置：

```yaml
# 低读取、高写入示例配置（每秒 5 个读取/500 个写入请求）
api:
  replicas: 6
  resources:
    requests:
      cpu: "1"
      memory: "2Gi"
    limits:
      cpu: "2"
      memory: "4Gi"

queue:
  replicas: 10
  resources:
    requests:
      cpu: "1"
      memory: "2Gi"
    limits:
      cpu: "2"
      memory: "4Gi"

config:
  numberOfJobsPerWorker: 50

redis:
  resources:
    requests:
      memory: "2Gi"
    limits:
      memory: "2Gi"

postgres:
  resources:
    requests:
      cpu: "4"
      memory: "16Gi"
    limits:
      cpu: "8"
      memory: "32Gi"
```

### 高读取，低写入 <a name="high-reads-low-writes"></a>

您有大量读取请求（每秒 500 个），但写入请求相对较少（每秒 5 个）。

为此，我们推荐如下配置：

```yaml
# 高读取、低写入示例配置（每秒 500 个读取/5 个写入请求）
api:
  replicas: 10
  resources:
    requests:
      cpu: "1"
      memory: "2Gi"
    limits:
      cpu: "2"
      memory: "4Gi"

queue:
  replicas: 1  # 默认值，写入负载最小
  resources:
    requests:
      cpu: "1"
      memory: "2Gi"
    limits:
      cpu: "2"
      memory: "4Gi"

redis:
  resources:
    requests:
      memory: "2Gi"
    limits:
      memory: "2Gi"

postgres:
  resources:
    requests:
      cpu: "4"
      memory: "16Gi"
    limits:
      cpu: "8"
      memory: "32Gi"
  # 对于高读取场景，考虑使用只读副本
  readReplicas: 2
```

### 中读取，中写入 <a name="medium-reads-medium-writes"></a>

这是一种平衡配置，应能处理中等程度的读写负载（每秒 50 个读取/50 个写入请求）。

为此，我们推荐如下配置：

```yaml
# 中读取、中写入示例配置（每秒 50 个读取/50 个写入请求）
api:
  replicas: 3
  resources:
    requests:
      cpu: "1"
      memory: "2Gi"
    limits:
      cpu: "2"
      memory: "4Gi"

queue:
  replicas: 5
  resources:
    requests:
      cpu: "1"
      memory: "2Gi"
    limits:
      cpu: "2"
      memory: "4Gi"

redis:
  resources:
    requests:
      memory: "2Gi"
    limits:
      memory: "2Gi"

postgres:
  resources:
    requests:
      cpu: "4"
      memory: "16Gi"
    limits:
      cpu: "8"
      memory: "32Gi"
```

### 高读取，高写入 <a name="high-reads-high-writes"></a>

您同时有大量的读取和写入请求（每秒 500 个读取/500 个写入请求）。

为此，我们推荐如下配置：

```yaml
# 高读取、高写入示例配置（每秒 500 个读取/500 个写入请求）
api:
  replicas: 15
  resources:
    requests:
      cpu: "1"
      memory: "2Gi"
    limits:
      cpu: "2"
      memory: "4Gi"

queue:
  replicas: 10
  resources:
    requests:
      cpu: "1"
      memory: "2Gi"
    limits:
      cpu: "2"
      memory: "4Gi"

config:
  numberOfJobsPerWorker: 50

redis:
  resources:
    requests:
      memory: "2Gi"
    limits:
      memory: "2Gi"

postgres:
  resources:
    requests:
      cpu: "8"
      memory: "32Gi"
    limits:
      cpu: "16"
      memory: "64Gi"
```

### 自动扩缩容

如果您的部署遇到突发流量，可以启用自动扩缩容，以扩展 API 服务器和队列工作器的数量来处理负载。

以下是为高读取和高写入配置自动扩缩容的示例：

```yaml
api:
  autoscaling:
    enabled: true
    minReplicas: 15
    maxReplicas: 25

queue:
  autoscaling:
    enabled: true
    minReplicas: 10
    maxReplicas: 20
```

<Note>

确保您的部署环境有足够的资源扩展到推荐的大小。监控您的应用程序和基础设施以确保最佳性能。考虑实施监控和告警来跟踪资源使用情况和应用程序性能。

</Note>

