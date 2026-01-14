---
title: LangSmith 获取
sidebarTitle: Retrieve traces via CLI
---
LangSmith Fetch 是一个命令行界面（CLI）工具，用于从您的 LangSmith 项目中检索追踪数据（[运行](/langsmith/observability-concepts#runs)、[追踪](/langsmith/observability-concepts#traces) 和 [线程](/langsmith/observability-concepts#threads)）。它允许您直接在终端和开发工作流中使用 LangSmith 的追踪和调试功能。

您可以将 LangSmith Fetch 用于以下用例：

-   即时调试：通过单个命令获取失败或意外部署运行的最新追踪。
-   批量导出以供分析：将大量追踪或整个对话线程导出为 JSON 文件，用于离线分析、构建[评估](/langsmith/evaluation-concepts)数据集或进行[回归测试](/langsmith/evaluation-types#regression-tests)。
-   基于终端的工作流：将追踪数据集成到您现有的工具中；例如，将输出通过管道传输到像 `jq` 这样的 Unix 实用程序，或将追踪数据输入 AI 编码助手进行自动分析。

## 安装

```bash
pip install langsmith-fetch
```

## 设置

1.  设置您的 [LangSmith API 密钥](/langsmith/create-account-api-key)：

```bash
export LANGSMITH_API_KEY=lsv2_...
```

2.  设置您的项目名称：

```bash
export LANGSMITH_PROJECT=your-project-name
```

CLI 将自动获取 `LANGSMITH_PROJECT` 中的追踪或线程。将 `your-project-name` 替换为您的 LangSmith 项目名称（如果项目不存在，将在首次使用时自动创建）。

要查找您的项目 UUID，请参阅 [查找项目和追踪 ID](#find-project-and-trace-ids)。

当您设置 `LANGSMITH_PROJECT` 环境变量时，`langsmith-fetch` 会自动查找项目 UUID 并将两者保存到 `~/.langsmith-cli/config.yaml`。默认情况下，您无需在 `langsmith-fetch` 中包含项目 UUID。但是，您可以通过 `--project-uuid` CLI 标志[指定不同的项目 UUID](#override-the-configured-tracing-project) 来覆盖已配置的项目。

<Note>

要获取线程，`langsmith-fetch` <strong>需要</strong> 项目 UUID。因此，请确保设置了 `LANGSMITH_PROJECT` 环境变量，或者在运行 [`langsmith-fetch thread <thread-id>`](#fetch-a-trace-or-thread) 时手动指定 `--project-uuid <project-id>`。

</Note>

### 与编码智能体一起使用

安装并设置好 `langsmith-fetch` 后，您可以使用您的编码智能体来询问类似以下的问题：

```
使用 langsmith-fetch 分析我 LangSmith 项目中的最后 3 个线程，以寻找潜在的改进点
```

许多智能体会使用 `langsmith-fetch --help` 命令来了解如何使用 CLI 并完成您的请求。

## 查找项目和追踪 ID

在大多数情况下，您不需要手动查找 ID（CLI 默认使用您[环境中的项目名称](#setup)和最新追踪）。但是，如果您想通过 ID 获取特定项目，可以在 [LangSmith UI](https://smith.langchain.com) 中找到这些 ID：

-   **项目 UUID**：每个项目都有一个唯一的 ID（UUID）。您可以在项目的 URL 中找到它，或者将鼠标悬停在项目名称旁边的 <Icon icon="link-simple"/> **ID** 上。此 UUID 可与 CLI 命令上的 `--project-uuid` 标志一起使用。
-   **追踪 ID**：每个追踪（单次执行）都有一个 ID。在 **运行** 视图中，单击特定运行以查看其追踪 ID（可从追踪详情面板复制）。如果您有该 ID，可以使用 `langsmith-fetch trace <trace-id>` 来检索该确切的追踪。

## 用法

安装和设置后，您可以使用 `langsmith-fetch` 命令来检索追踪或线程。一般用法是：

```bash
langsmith-fetch COMMAND [ARGUMENTS] [OPTIONS]
```

LangSmith Fetch 提供以下命令来获取单个项目或批量获取：

| 命令               | 获取内容                                    | 输出位置                                                                                                                                                      |
| --------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trace <id>`          | 通过 ID 获取特定的追踪记录                     | 打印到标准输出（或使用 `--file` 输出到文件）                                                                                                                        |
| `thread <id>`         | 通过 ID 获取特定的线程                    | 打印到标准输出（或使用 `--file` 输出到文件）                                                                                                                        |
| `traces [directory]`  | 从项目中获取最近的追踪记录（多个）  | 将每个追踪记录保存为指定目录下的 JSON 文件，如果未提供目录则打印到标准输出。**提示：** 建议使用目录进行[批量导出](#fetch-multiple)。 |
| `threads [directory]` | 从项目中获取最近的线程（多个） | 将每个线程保存为指定目录下的 JSON 文件，如果未提供目录则打印到标准输出。                                                            |

<Note>

追踪记录按时间顺序获取，最新的排在最前面。

</Note>

### 选项

这些命令支持额外的标志来过滤和格式化输出：

| 选项 / 标志               | 适用于                       | 描述                                                                                                                                                                   | 默认值                                 |
| --------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `-n, --limit <int>`         | `traces`, `threads`              | 要获取的追踪/线程的最大数量。使用此选项来限制检索的项目数量（例如，最后 5 条追踪）。                                                            | **1** (如果未指定)                |
| `--last-n-minutes <int>`    | `traces`, `threads`              | 仅获取过去 N 分钟内的项目。这对于获取近期数据很有用（例如，`--last-n-minutes 30` 表示过去半小时）。                                              | *(无时间过滤器)*                      |
| `--since <timestamp>`       | `traces`, `threads`              | 仅获取自特定时间以来的项目。提供一个 ISO 8601 时间戳（例如，`2025-12-01T00:00:00Z`）以获取该时间之后的数据。                                              | *(无时间过滤器)*                      |
| `--project-uuid <uuid>`     | `trace, thread, traces, threads` | 手动通过 UUID 指定项目以[覆盖 `LANGSMITH_PROJECT` 环境变量设置](#override-the-configured-tracing-project)。如果您想在不更改环境变量的情况下从其他项目获取数据，请使用此选项。   | 来自环境变量/配置                         |
| `--filename-pattern <text>` | `traces`, `threads`              | 保存多个文件时的输出文件名模式。您可以使用占位符，如 `{trace_id}`、`{thread_id}`、`{index}`。                                                | `{trace_id}.json` 或 `{thread_id}.json` |
| `--format <type>`           | **所有命令**                 | 输出格式：`pretty`、`json` 或 `raw`。（详情请参阅[输出格式](#output-formats)。）                                                                              | `pretty`                                |
| `--file <path>`             | `trace`, `thread`                | 将获取的追踪/线程保存到文件，而不是打印出来。                                                                                                               | *(标准输出)*                              |
| `--include-metadata`        | `traces` (批量获取)            | 在输出中包含运行元数据（例如使用的令牌数、执行时间、状态、成本）。这将在每条追踪的 JSON 中添加一个 `"metadata"` 部分。                           | *默认关闭*                        |
| `--include-feedback`        | `traces` (批量获取)            | 包含附加到运行的任何反馈条目。启用此选项将为每条追踪进行一次额外的 API 调用以获取反馈数据。                                           | *默认关闭*                        |
| `--max-concurrent <int>`    | `traces`, `threads`              | 最大并发获取请求数。如果您要获取大量项目，请调整此值；增加它可能会加快检索速度，但建议设置为 5–10 以避免 API 过载。 | **5**                                   |
| `--no-progress`             | `traces`, `threads`              | 禁用进度条输出。默认情况下，在获取多个项目时会显示进度指示器；使用此标志可以隐藏它（适用于非交互式脚本）。        | 进度条开启                         |

### 输出格式

`--format` 选项控制获取的数据如何显示：

- `pretty`（默认）：采用富文本格式的人类可读视图，便于在终端中检查。此格式非常适合快速调试单个追踪（trace）或线程（thread）。

默认情况下：

```bash
langsmith-fetch trace <trace-id>
```
显式指定格式：

```bash
langsmith-fetch trace <trace-id> --format pretty
```

- `json`：带有语法高亮的格式良好的 JSON 输出。如果您想检查原始数据结构或将其传输到 JSON 处理工具中，请使用此格式。

```bash
langsmith-fetch trace <trace-id> --format json
```

- `raw`：无额外空格的紧凑 JSON。这对于将输出传输到其他程序（例如，使用 `jq` 或直接保存）而无需额外格式化非常有用。

```bash
langsmith-fetch trace <trace-id> --format raw | jq '.[] | select(.role=="user")'
```

### 获取追踪或线程

您可以使用 ID 获取单个线程或追踪。默认情况下，该命令将输出到终端：

```bash
langsmith-fetch trace <trace-id>
```

要获取一个线程，`langsmith-fetch thread` 还需要一个项目 UUID。请确保已配置 [`LANGSMITH_PROJECT` 环境变量](#setup)，或使用 `--project-uuid` 标志来定义线程所属的项目：

```bash
langsmith-fetch thread <thread-id> --project-uuid <project-id>
```

![以默认 pretty 格式获取单个追踪的输出](/langsmith/images/langsmith-fetch-output-single.png)

您可以选择使用 `--file` 选项将线程或追踪数据重定向到文件。

### 获取多个

<Note>

对于批量获取追踪或线程，我们建议指定一个目标目录路径。每个获取的追踪或线程将作为单独的 JSON 文件保存在该文件夹中，便于后续浏览或处理。

</Note>

您可以为批量命令（`traces`/`threads`）指定一个目标目录。例如，以下命令将最近的 10 个追踪作为 JSON 文件保存在 `my-traces-data` 目录中：

```bash
langsmith-fetch traces ./my-traces-data --limit 10
```

```bash
langsmith-fetch threads ./my-thread-data --limit 10
```

如果您省略目录和 `--limit`，工具将把最近的一个追踪的结果输出到您的终端。

当发送到目录时，文件将按以下方式命名：

- 默认：按追踪 ID 命名文件（例如，`3b0b15fe-1e3a-4aef-afa8-48df15879cfe.json`）。
- 自定义模式：使用带有占位符的 `--filename-pattern`：
  - `{trace_id}`：追踪 ID（默认：`{trace_id}.json`）。
  - `{index}` 或 `{idx}`：从 1 开始的顺序号。
  - 支持格式说明符：例如 `{index:03d}` 用于零填充数字。

### 包含元数据和反馈

您可以包含与追踪关联的[运行元数据](/langsmith/observability-concepts#metadata)和任何[反馈](/langsmith/observability-concepts#feedback)：

```bash
langsmith-fetch traces --limit 1 --include-metadata --include-feedback
```
```
运行元数据
============================================================
状态：成功
开始时间：2025-12-12T18:05:47.558274
结束时间：2025-12-12T18:05:48.811072
持续时间：1252毫秒

令牌使用情况：
  提示：15
  补全：88
  总计：103

成本：
  总计：$0.00014
  提示：$0.00001
  补全：$0.00013

自定义元数据：
  LANGSMITH_PROJECT：weather-demo
  LANGSMITH_TRACING：true
  ls_run_depth：0

反馈统计：
  正确性：{'n': 1, 'avg': 1.0, 'stdev': 0.0, 'errors': 0, 'show_feedback_arrow': False, 'comments': [''], 'sources':
['{"type":"app","metadata":null,"user_id":"d5ee8d42-a274-4f32-9c35-b765287fe5ec","ls_user_id":"ac375f5f-0da0-44c1-82a2-0ecfd6ecac27"}'],
'session_min_score': 1.0, 'session_max_score': 1.0, 'values': {}, 'contains_thread_feedback': False}
  备注：{'n': 0, 'avg': None, 'stdev': None, 'errors': 0, 'show_feedback_arrow': False, 'comments': ['答案应更具体地说明降雨总量。'], 'sources':
['{"type":"app","metadata":null,"user_id":"d5ee8d42-a274-4f32-9c35-b765287fe5ec","ls_user_id":"ac375f5f-0da0-44c1-82a2-0ecfd6ecac27"}'],
'session_min_score': None, 'session_max_score': None, 'values': {}, 'contains_thread_feedback': False}
...
```

### 覆盖已配置的追踪项目

要从不同于 `LANGSMITH_PROJECT` 配置的项目中获取追踪记录，请使用 `--project-uuid`：

```bash
langsmith-fetch traces --project-uuid <project-id> --limit 3
```

运行此命令将仅从该项目获取追踪记录，不会修改 `~/.langsmith-cli/config.yaml` 中已配置的 [LangSmith 项目](#setup)。

您可能还需要获取与已配置的 `LANGSMITH_PROJECT` 不同的特定项目中的特定追踪记录。您可以通过在 `langsmith-fetch` 中包含 `trace-id` 和 `project-id` 来实现：

```bash
langsmith-fetch trace <trace-id> --project-uuid <project-id>
```

### 导出到文件

您可以获取追踪记录或完整线程并导出到文件：

```bash
langsmith-fetch threads ./my_threads --since 2025-12-01T00:00:00Z
```

此命令检索自 2025 年 12 月 1 日以来发生的所有线程，将每个对话保存为 `./my_threads` 下的 JSON 文件。这对于导出聊天记录或在多轮对话上构建回归测试非常有用。您也可以将 `--limit` 与线程一起使用以获取特定数量的最近线程，并且 `--last-n-minutes` 在此处同样适用。
