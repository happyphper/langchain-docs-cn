---
title: 如何比较实验结果
sidebarTitle: Compare experiment results
---
当您迭代优化 LLM 应用（例如更改模型或提示词）时，您可能希望比较不同[_实验_](/langsmith/evaluation-concepts#experiment)的结果。

LangSmith 支持对比视图，让您能够聚焦于不同实验之间的关键差异、性能回退和改进之处。

## 打开对比视图

1. 要访问实验对比视图，请导航至 **数据集与实验** 页面。
1. 选择一个数据集，这将打开 **实验** 标签页。
1. 选择两个或更多实验，然后点击 **对比**。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/compare-select-light.png" alt="UI 中的实验视图，选中了 3 个实验并高亮了对比按钮，浅色模式。" />

<img src="/langsmith/images/compare-select-dark.png" alt="UI 中的实验视图，选中了 3 个实验并高亮了对比按钮，深色模式。" />

</div>

## 调整表格显示

您可以在 **对比实验** 页面右侧的边栏中切换不同的显示选项。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/comparison-table-display-light.png" alt="表格显示选项，浅色模式。" />

<img src="/langsmith/images/comparison-table-display-dark.png" alt="表格显示选项，深色模式。" />

</div>

### 筛选器

您可以对实验对比视图应用筛选器，以缩小到特定的示例。筛选器的常见示例包括：

- 包含特定 `input` / `output` 的示例。
- 状态为 `success` 或 `error` 的运行。
- `latency` 超过 x 秒的运行。
- 特定的 `metadata`、`tag` 或 `feedback`。

除了在整个实验视图上应用筛选器外，您还可以在单个列上应用筛选器。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/column-filter-light.png" alt="在特定列上进行筛选，浅色模式。" />

<img src="/langsmith/images/column-filter-dark.png" alt="在特定列上进行筛选，深色模式。" />

</div>

### 列

您可以在 **列** 设置中选择和隐藏单个反馈键或单个指标，以便在对比视图中隔离您需要的信息。

### **完整** 视图与 **紧凑** 视图

- **完整**：切换 **完整** 将显示每次运行的输入、输出和参考输出的完整文本。如果输出过长无法在表格中显示，您可以点击 **展开** 查看完整内容。
- **紧凑**：**紧凑** 视图显示每个示例的实验结果预览。

### 显示类型

系统内置了三种实验视图，涵盖多种显示类型：**默认**、**YAML**、**JSON**。

## 查看性能回退与改进

在对比视图中，相对于您的基线实验，在任何反馈键上出现*性能回退*的运行将以红色高亮显示，而出现*改进*的运行将以绿色高亮显示。在每个反馈列的顶部，您可以找到该实验中比基线实验表现更好和更差的运行数量。

点击每列顶部的回退或改进按钮，可以筛选出在该特定实验中发生回退或改进的运行。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/regression-view-light.png" alt="对比视图，比较了 3 个实验，性能回退和改进分别以红色和绿色高亮显示，浅色模式。" />

<img src="/langsmith/images/regression-view-dark.png" alt="对比视图，比较了3个实验，回归和改进分别以红色和绿色高亮显示，深色模式。" />

</div>

## 更新基线实验和指标

为了跟踪实验间的回归情况，您可以：

1.  在对比视图顶部，将鼠标悬停在实验图标上，您可以选择任意实验作为**基线**进行比较。您也可以添加或移除实验。默认情况下，第一个选中的实验会被选为基线。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/comparison-baseline-light.png" alt="在下拉菜单中配置基线实验，浅色模式。" />

<img src="/langsmith/images/comparison-baseline-dark.png" alt="在下拉菜单中配置基线实验，深色模式。" />

</div>

2.  在**反馈**列中，您可以配置每个反馈键（feedback key）是否分数越高越好。此偏好将被保存。默认情况下，假定分数越高越好。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/comparison-feedback-higher-score-light.png" alt="反馈指标列的下拉菜单，配置分数是否越高越好，浅色模式。" />

<img src="/langsmith/images/comparison-feedback-higher-score-dark.png" alt="反馈指标列的下拉菜单，配置分数是否越高越好，深色模式。" />

</div>

## 打开追踪记录

如果您正在评估的示例来自已摄取的[运行](/langsmith/observability-concepts#runs)，您可以将鼠标悬停在输出单元格上，然后单击追踪图标以打开该运行的追踪视图。这将在侧边面板中打开一个追踪记录。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/open-trace-light.png" alt="来自已摄取运行的“查看追踪”图标高亮显示，浅色模式。" />

<img src="/langsmith/images/open-trace-dark.png" alt="来自已摄取运行的“查看追踪”图标高亮显示，深色模式。" />

</div>

## 展开详细视图

您可以单击任意单元格，以打开该特定示例输入的实验结果的详细视图，同时显示反馈键和分数。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/expanded-view-light.png" alt="“比较实验”视图中展开的示例，浅色模式。" />

<img src="/langsmith/images/expanded-view-dark.png" alt="“比较实验”视图中展开的示例，深色模式。" />

</div>

## 使用实验元数据作为图表标签

您可以基于[实验元数据](/langsmith/filter-experiments-ui#background-add-metadata-to-your-experiments)配置图表的X轴标签。

在**图表**下拉菜单中选择一个元数据键来更改X轴标签。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/metadata-in-charts-light.png" alt="X轴下拉菜单高亮显示，列出了附加到实验的元数据，浅色模式。" />

<img src="/langsmith/images/metadata-in-charts-dark.png" alt="X轴下拉菜单高亮显示，列出了附加到实验的元数据，深色模式。" />

</div>

