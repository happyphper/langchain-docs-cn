---
title: 可观测性概念
sidebarTitle: Concepts
---
本页面涵盖了将追踪记录（traces）记录到 LangSmith 时需要理解的关键概念。

一次 [_追踪_](#traces) 记录了您的应用程序从接收输入、经过中间处理、到产生最终输出的步骤序列。追踪中的每个步骤由一个 [_运行_](#runs) 表示。多个追踪在一个 [_项目_](#projects) 中被分组在一起，而来自多轮对话的追踪可以作为一个 [_线程_](#threads) 链接在一起。

下图在一个简单的 RAG（检索增强生成）应用上下文中展示了这些概念，该应用从索引中检索文档并生成答案。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/primitives.png" alt="Primitives of LangSmith Project, Trace, Run in the context of a question and answer RAG app." />

<img src="/langsmith/images/primitives-dark.png" alt="Primitives of LangSmith Project, Trace, Run in the context of a question and answer RAG app." />

</div>

## 运行

一个 _运行_ 是一个跨度（span），代表您的 LLM 应用程序中的一个工作单元或操作。这可以是任何内容，从对 LLM 或链（chain）的单个调用，到提示词格式化调用，再到可运行 lambda 的调用。如果您熟悉 [OpenTelemetry](https://opentelemetry.io/)，可以将一个运行视为一个跨度。

![运行](/langsmith/images/run.png)

## 追踪

一个 _追踪_ 是单个操作的一系列运行的集合。例如，如果您有一个触发链的用户请求，该链调用了一个 LLM，然后调用了一个输出解析器，等等，那么所有这些运行都属于同一个追踪。如果您熟悉 [OpenTelemetry](https://opentelemetry.io/)，可以将 LangSmith 追踪视为一系列跨度的集合。运行通过唯一的追踪 ID 绑定到一个追踪。

![追踪](/langsmith/images/trace.png)

## 线程

一个 _线程_ 是代表单个对话的一系列追踪。许多 LLM 应用程序具有类似聊天机器人的界面，用户和 LLM 应用程序在其中进行多轮对话。对话中的每一轮都表示为其自己的追踪，但这些追踪通过属于同一个线程而链接在一起。线程中最新的追踪是最新的消息交换。

要将追踪分组到线程中，您需要传递一个特殊的元数据键（`session_id`、`thread_id` 或 `conversation_id`）以及一个唯一的标识符值，该值将追踪链接在一起。

[了解如何配置线程](/langsmith/threads)。

<img src="/langsmith/images/thread-overview-light.png" alt="Thread representing a sequence of traces in a multi-turn conversation." />

<img src="/langsmith/images/thread-overview-dark.png" alt="Thread representing a sequence of traces in a multi-turn conversation." />

<Callout type="info" icon="bird">

使用 <strong>[Polly](/langsmith/polly)</strong> 来分析追踪、运行和线程。Polly 帮助您理解智能体（agent）性能、调试问题并从对话线程中获得洞察，而无需手动挖掘数据。

</Callout>

## 项目

一个 _项目_ 是一系列追踪的集合。您可以将项目视为与单个应用程序或服务相关的所有追踪的容器。您可以拥有多个项目，每个项目可以包含多个追踪。

![项目](/langsmith/images/project.png)

## 反馈

_反馈_ 允许您根据特定标准对单个运行进行评分。每个反馈条目由一个反馈标签和反馈分数组成，并通过唯一的运行 ID 绑定到一个运行。反馈可以是连续的或离散的（分类的），您可以在组织内的不同运行中重复使用反馈标签。

您可以通过多种方式收集对运行的反馈：

1.  从 LLM 应用程序中 [与追踪一起发送](/langsmith/attach-user-feedback)。
2.  由用户在应用程序中 [内联](/langsmith/annotate-traces-inline) 或在 [标注队列](/langsmith/annotation-queues) 中生成。
3.  在 [离线评估](/langsmith/evaluate-llm-application) 期间由自动评估器生成。
4.  由 [在线评估器](/langsmith/online-evaluations) 生成。

要了解有关反馈在应用程序中如何存储的更多信息，请参阅 [反馈数据格式指南](/langsmith/feedback-data-format)。

![反馈](/langsmith/images/feedback.png)

## 标签

_标签_ 是可以附加到运行上的字符串集合。您可以在 LangSmith UI 中使用标签执行以下操作：

-   对运行进行分类以便于搜索。
-   过滤运行。
-   将运行分组以进行分析。

[了解如何将标签附加到您的追踪](/langsmith/add-metadata-tags)。

![标签](/langsmith/images/tags.png)

## 元数据

_元数据_ 是可以附加到运行上的键值对集合。您可以使用元数据存储有关运行的附加信息，例如生成运行的应用程序版本、运行生成的环境，或您希望与运行关联的任何其他信息。与标签类似，您可以使用元数据在 LangSmith UI 中过滤运行或将运行分组以进行分析。

[了解如何向您的追踪添加元数据](/langsmith/add-metadata-tags)。

![元数据](/langsmith/images/metadata.png)

## 数据存储与保留

对于 2024 年 5 月 22 日（星期三）或之后摄取的追踪，LangSmith（SaaS）将追踪数据保留最多 400 天，从追踪插入 LangSmith 追踪数据库的日期和时间算起。

400 天后，追踪将从 LangSmith 中永久删除，仅保留有限数量的元数据用于显示准确的统计数据，例如历史使用情况和成本。

<Note>

如果您希望将追踪数据保留超过数据保留期限，可以将其添加到数据集中。[数据集](/langsmith/manage-datasets) 允许您存储追踪的输入和输出（例如，作为键值数据集），并且将无限期持久保存，即使在追踪被删除之后。

</Note>

## 从 LangSmith 删除追踪

如果您需要在追踪过期日期之前将其从 LangSmith 中移除，可以通过删除包含该追踪的项目来实现。

您可以通过以下方式之一删除项目：

-   在 [LangSmith UI](https://smith.langchain.com) 中，选择项目溢出菜单中的 **删除** 选项。
-   使用 [`delete_tracer_sessions`](https://api.smith.langchain.com/redoc#tag/tracer-sessions/operation/delete_tracer_session_api_v1_sessions__session_id__delete) API 端点。
-   使用 LangSmith SDK 中的 `delete_project()` ([Python](https://reference.langchain.com/python/langsmith/observability/sdk/)) 或 `deleteProject()` ([JS/TS](https://reference.langchain.com/javascript/modules/langsmith.html))。

LangSmith 不支持自助删除单个追踪。

如果您需要在过期日期之前从 LangSmith 项目中删除单个追踪（或一组追踪），账户所有者应通过 [LangSmith 支持](https://support.langchain.com) 联系支持人员，并提供组织 ID 和追踪 ID。
