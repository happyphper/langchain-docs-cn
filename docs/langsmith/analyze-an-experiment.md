---
title: 分析实验
sidebarTitle: Analyze an experiment
---
本页介绍了在 LangSmith 中使用 [_实验_](/langsmith/evaluation-concepts#experiment) 时的一些基本任务：

- **[分析单个实验](#分析单个实验)**：查看和解释实验结果、自定义列、筛选数据以及比较运行。
- **[将实验结果下载为 CSV](#如何将实验结果下载为-csv)**：导出实验数据以供外部分析和共享。
- **[重命名实验](#如何重命名实验)**：在 Playground 和实验视图中更新实验名称。

## 分析单个实验

运行实验后，您可以使用 LangSmith 的实验视图来分析结果并获取关于实验性能的见解。

### 打开实验视图

要打开实验视图，请从 **数据集与实验** 页面选择相关的 [_数据集_](/langsmith/evaluation-concepts#datasets)，然后选择您要查看的实验。

![打开实验视图](/langsmith/images/select-experiment.png)

### 查看实验结果

#### 自定义列

默认情况下，实验视图会显示数据集中每个 [示例](/langsmith/evaluation-concepts#examples) 的输入、输出和参考输出，以及来自评估的反馈分数和实验指标（如成本、令牌数、延迟和状态）。

您可以使用 **显示** 按钮自定义列，以便更轻松地解释实验结果：

- **将输入、输出和参考输出中的字段拆分** 到各自的列中。如果您有较长的输入/输出/参考输出，并希望突出重要字段，这将特别有用。
- **隐藏和重新排序列** 以创建用于分析的聚焦视图。
- **控制反馈分数的小数精度**。默认情况下，LangSmith 以 2 位小数的精度显示数值反馈分数，但您可以将此设置自定义为最多 6 位小数。
- **为实验中的数值反馈分数设置热图阈值** 为高、中、低，这会影响分数芯片显示为红色或绿色的阈值：

![列热图配置](/langsmith/images/column-heat-map.png)

<Tip>

您可以为整个数据集设置默认配置，或仅为临时保存自己的设置。

</Tip>

#### 排序和筛选

要对反馈分数进行排序或筛选，可以使用列标题中的操作。

![排序和筛选](/langsmith/images/sort-filter.png)

#### 表格视图

根据对分析最有用的视图，您可以通过在紧凑视图、完整视图和差异视图之间切换来更改表格的格式。

- **紧凑** 视图将每次运行显示为一行，便于快速比较分数。
- **完整** 视图显示每次运行的完整输出，用于深入查看单个运行的详细信息。
- **差异** 视图显示参考输出与每次运行输出之间的文本差异。

![差异视图](/langsmith/images/diff-mode.png)

#### 查看追踪

将鼠标悬停在任意输出单元格上，然后单击追踪图标即可查看该次运行的追踪。这将在侧面板中打开一个追踪。

要查看整个追踪项目，请点击标题右上角的 **查看项目** 按钮。

![查看追踪](/langsmith/images/view-trace.png)

#### 查看评估器运行

对于评估器分数，您可以通过将鼠标悬停在评估器分数单元格上并单击箭头图标来查看源运行。这将在侧面板中打开一个追踪。如果您正在运行 [LLM-as-a-judge 评估器](/langsmith/llm-as-judge)，则可以在此次运行中查看用于评估器的提示。如果您的实验有 [重复运行](/langsmith/evaluation-concepts#repetitions)，您可以单击聚合平均分数以找到指向所有单独运行的链接。

![查看评估器运行](/langsmith/images/evaluator-run.png)

### 按元数据分组结果

您可以为示例添加元数据以对其进行分类和组织。例如，如果您正在评估问答数据集的事实准确性，元数据可能包括每个问题所属的主题领域。元数据可以通过 [UI](/langsmith/manage-datasets-in-application#edit-example-metadata) 或 [SDK](/langsmith/manage-datasets-programmatically#update-single-example) 添加。

要按元数据分析结果，请使用实验视图右上角的 **分组依据** 下拉菜单，并选择所需的元数据键。这将显示每个元数据组的平均反馈分数、延迟、总令牌数和成本。

<Info>

您只能对 2025 年 2 月 20 日之后创建的实验按示例元数据进行分组。该日期之前的任何实验仍然可以按元数据分组，但前提是元数据位于实验追踪本身。

</Info>

### 重复运行

如果您使用 [_重复运行_](/langsmith/evaluation-concepts#repetitions) 运行了实验，输出结果列中会出现箭头，以便您可以在表格中查看输出。要查看重复运行中的每次运行，请将鼠标悬停在输出单元格上并单击展开视图。

当您运行带有重复的实验时，LangSmith 会在表格中显示每个反馈分数的平均值。单击反馈分数可查看来自单独运行的反馈分数，或查看重复运行之间的标准差。

![重复运行](/langsmith/images/repetitions.png)

### 与另一个实验比较

在实验视图的右上角，您可以选择另一个实验进行比较。这将打开一个比较视图，您可以在其中查看两个实验的对比情况。要了解更多关于比较视图的信息，请参阅 [如何比较实验结果](/langsmith/compare-experiment-results)。

## 将实验结果下载为 CSV

LangSmith 允许您将实验结果下载为 CSV 文件，以便分析和共享您的结果。

要下载为 CSV，请单击实验视图顶部的下载图标。该图标位于 [紧凑切换按钮](/langsmith/compare-experiment-results#adjust-the-table-display) 的左侧。

![下载 CSV](/langsmith/images/download-experiment-results-as-csv.png)

## 重命名实验

<Note>

每个工作区中的实验名称必须是唯一的。

</Note>

您可以在 LangSmith UI 中重命名实验：

- 在 [Playground](#在-playground-中重命名实验) 中。在 Playground 中运行实验时，会自动分配一个格式为 `pg::prompt-name::model::uuid`（例如 `pg::gpt-4o-mini::897ee630`）的默认名称。

  您可以在运行实验后立即通过编辑 Playground 表格标题中的名称来重命名实验。

  ![在 Playground 中编辑名称](/langsmith/images/rename-in-playground.png)

- 在 [实验视图](#在实验视图中重命名实验) 中。在实验视图中查看结果时，您可以使用实验名称旁边的铅笔图标来重命名实验。

  ![在实验视图中编辑名称](/langsmith/images/rename-in-experiments-view.png)
