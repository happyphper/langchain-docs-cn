---
title: 使用仪表板监控项目
sidebarTitle: Monitor projects with dashboards
---
仪表盘为您提供追踪数据的高层洞察，帮助您发现趋势并监控应用程序的健康状况。仪表盘位于左侧边栏的 **监控（Monitoring）** 选项卡中。

LangSmith 提供两种仪表盘类型：

- **预置仪表盘**：为每个追踪项目自动生成。
- **自定义仪表盘**：完全可配置的图表集合，可根据您的需求定制。

## 预置仪表盘

预置仪表盘会为每个项目自动创建，涵盖关键指标，例如追踪数量、错误率、令牌使用量等。默认情况下，您可以通过追踪项目页面右上角的 **仪表盘（Dashboard）** 按钮访问该项目的预置仪表盘。

![预置仪表盘](/langsmith/images/prebuilt.gif)

<Note>
<strong>您无法修改预置仪表盘。未来，我们计划允许您克隆默认仪表盘，以便以此为基础进行自定义。</strong>
</Note>

### 仪表盘部分

预置仪表盘分为以下几个部分：

| 部分 | 显示内容 |
| :------ | :------------ |
| 追踪（Traces） | 追踪数量、延迟和错误率。一个[追踪（trace）](/langsmith/observability-concepts#traces)是与单个操作相关的一系列[运行（runs）](/langsmith/observability-concepts#runs)的集合。例如，如果用户请求触发了一个智能体（agent），那么该智能体调用中的所有运行都属于同一个追踪。 |
| LLM 调用（LLM Calls） | LLM 调用次数和延迟。包括所有运行类型为 "llm" 的运行。 |
| 成本与令牌（Cost & Tokens） | 总令牌数和每个追踪的令牌数及成本，按令牌类型细分。成本使用 [LangSmith 的成本追踪功能](/langsmith/log-llm-trace#manually-provide-token-counts) 进行测量。 |
| 工具（Tools） | 工具运行的运行次数、错误率和延迟统计，按工具名称细分。包括运行类型为 "tool" 的运行。限制为出现频率最高的前 5 个工具。 |
| 运行类型（Run Types） | 作为根运行直接子运行的运行次数、错误率和延迟统计。这有助于理解智能体的高层执行路径。限制为出现频率最高的前 5 个运行名称。请参考本表后的图片。 |
| 反馈分数（Feedback Scores） | 出现频率最高的前 5 种反馈类型的聚合统计。图表显示数值反馈的平均分数和分类反馈的类别计数。 |

例如，对于以下追踪，以下运行的深度为 1：

![运行深度解释](/langsmith/images/run-depth-explained.png)

### 分组依据

按[运行标签或元数据](/langsmith/add-metadata-tags)分组可用于根据对应用程序重要的属性拆分数据。全局分组依据设置出现在仪表盘的右上角。请注意，工具和运行类型图表已经应用了分组依据，因此全局分组依据不会生效；全局分组依据将应用于所有其他图表。

<Note>
向运行添加元数据时，我们建议在追踪以及特定运行（例如 LLM 调用）上使用相同的元数据。元数据和标签不会从父运行传播到子运行，反之亦然。因此，如果您希望看到例如追踪图表和 LLM 调用图表都按某个元数据键分组，那么您的追踪（根运行）和 LLM 运行都需要附加该元数据。
</Note>

## 自定义仪表盘

创建定制的图表集合，以跟踪对您的应用程序最重要的指标。

### 创建新仪表盘

1.  导航到左侧边栏的 **监控（Monitor）** 选项卡。
2.  点击 **+ 新建仪表盘（+ New Dashboard）** 按钮。
3.  为您的仪表盘指定名称和描述。
4.  点击 **创建（Create）**。

### 向仪表盘添加图表

1.  在仪表盘内，点击 **+ 新建图表（+ New Chart）** 按钮以打开图表创建面板。
2.  为您的图表指定名称和描述。
3.  配置图表。

### 图表配置

#### 选择追踪项目并筛选运行

-   选择一个或多个追踪项目来跟踪其指标。
-   使用 **图表筛选器（Chart filters）** 部分来细化匹配的运行。此筛选器适用于图表中的所有数据系列。有关筛选追踪的更多信息，请查看我们的指南：[在应用程序中筛选追踪](./filter-traces-in-application)。

#### 选择指标

-   从下拉菜单中选择一个指标来设置图表的 Y 轴。选择项目和指标后，您将看到图表的预览和匹配的运行。
-   对于某些指标（例如延迟、令牌使用量、成本），我们支持比较具有相同单位的多个指标。例如，您可能希望在一个图表中同时看到提示令牌和完成令牌。每个指标显示为单独的线条。

![多指标比较](/langsmith/images/compare-metrics.png)

#### 拆分数据

有两种方法可以在图表中创建多个系列（即在图表中创建多条线）：

1.  **分组依据（Group by）**：按[运行标签或元数据](/langsmith/add-metadata-tags)、运行名称或运行类型对运行进行分组。分组依据会根据所选字段自动将数据拆分为多个系列。请注意，分组依据限制为按频率排序的前 5 个元素。

2.  **数据系列（Data series）**：使用单独的筛选器手动定义多个系列。这对于在单个指标内比较细粒度数据非常有用。

![多数据系列](/langsmith/images/multiple-data-series.png)

#### 选择图表类型

-   选择折线图或条形图进行可视化。

### 保存和管理图表

-   点击 `保存（Save）` 将图表保存到仪表盘。
-   通过点击图表右上角的三点按钮来编辑或删除图表。
-   通过点击图表右上角的三横线按钮并选择 **+ 克隆（+ Clone）** 来克隆图表。这将打开一个新的图表创建面板，其配置与原始图表相同。

![更多操作栏](/langsmith/images/more-actions-bar.png)

![展开的图表](/langsmith/images/expanded-chart.png)

## 从追踪项目链接到仪表盘

您可以直接从追踪项目链接到任何仪表盘。默认情况下，会选中您追踪项目的预置仪表盘。如果您有一个想要链接的自定义仪表盘：

1.  在您的追踪项目中，点击 **仪表盘（Dashboard）** 按钮旁边的三个点。
2.  选择一个仪表盘设置为新的默认仪表盘。

![追踪项目到仪表盘](/langsmith/images/tracing-project-to-dashboard.png)

## 示例：用户旅程监控

使用监控图表来映射智能体在特定节点所做的决策。

考虑一个电子邮件助手智能体。在特定节点，它会对一封电子邮件做出决策：

-   回复邮件
-   通知用户
-   无需回复

我们可以创建一个图表来跟踪和可视化这些决策的细分情况。

**创建图表**

1.  **指标选择**：选择指标 `运行计数（Run count）`。
2.  **图表筛选器**：添加一个树筛选器，以包含所有名称为 `triage_input` 的追踪。这意味着我们只包含到达 `triage_input` 节点的追踪。同时添加一个图表筛选器，要求 `Is Root` 为 `true`，这样我们的计数就不会因追踪中的节点数量而膨胀。
![节点决策](/langsmith/images/chart-filters-for-node-decision.png)

3.  **数据系列**：为 `triage_input` 节点做出的每个决策创建一个数据系列。决策的输出存储在输出对象的 `triage.response` 字段中，决策的值是 `no`、`email` 或 `notify` 中的一个。每个决策都会在图表中生成一个单独的数据系列。
![节点决策](/langsmith/images/decision-at-node.png)

现在我们可以随时间可视化在 `triage_input` 节点做出的决策。

## 视频指南
<iframe
  className="w-full aspect-video rounded-xl"
  src="https://www.youtube.com/embed/VxsIvf9NdxI?si=7ksp9qyw-i0lcwxg"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
