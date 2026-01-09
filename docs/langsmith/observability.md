---
title: LangSmith 可观测性
sidebarTitle: Overview
mode: wide
---

以下部分将帮助您设置和使用追踪、监控与可观测性功能：

<Columns :cols="3">

<Card
title="设置追踪"
icon="gear"
href="/langsmith/observability-quickstart"
arrow="true"
>

通过基础选项、框架集成或高级设置来配置追踪，以获得完全控制。

</Card>

<Card
title="查看追踪"
icon="route"
href="/langsmith/filter-traces-in-application"
arrow="true"
>

通过 UI 或 API 访问和管理追踪，使用筛选、导出、共享和比较工具。

</Card>

<Card
title="监控性能"
icon="chart-area"
href="/langsmith/dashboards"
arrow="true"
>

创建仪表盘并设置告警，以跟踪性能并在问题出现时获得通知。

</Card>

<Card
title="配置自动化"
icon="robot"
href="/langsmith/rules"
arrow="true"
>

使用规则、Webhook 和在线评估来简化可观测性工作流。

</Card>

<Card
title="收集反馈"
icon="users"
href="/langsmith/attach-user-feedback"
arrow="true"
>

使用队列和内联标注来收集和管理输出上的标注。

</Card>

<Card
title="追踪 RAG 应用"
icon="book-open"
href="/langsmith/observability-llm-tutorial"
arrow="true"
>

按照分步教程，从头到尾追踪一个检索增强生成（RAG）应用程序。

</Card>

</Columns>

有关术语定义和核心概念，请参阅[可观测性概念](/langsmith/observability-concepts)。

<Callout type="info" icon="bird">

使用 <strong>[Polly](/langsmith/polly)</strong>，LangSmith 的 AI 助手，来分析追踪并获取关于应用程序性能的 AI 驱动洞察。

</Callout>

<!--@include: @/snippets/python/langsmith/platform-setup-note.md-->
