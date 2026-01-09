---
title: 设置自动化规则
sidebarTitle: Set up automation rules
---
虽然您可以手动筛选和处理 LLM 应用程序的生产日志，但随着应用程序扩展到更多用户，这通常会变得困难。
LangSmith 提供了一个名为 **自动化** 的强大功能，允许您对跟踪数据触发某些操作。
从高层次来看，自动化由 **过滤器**、**采样率** 和 **操作** 定义。

自动化规则可以触发以下操作：将跟踪添加到数据集、添加到标注队列、触发 Webhook（例如用于远程评估）或延长数据保留期。您可以设置的一些自动化示例如下：

- 将所有带有负面反馈的跟踪发送到标注队列进行人工审查
- 将所有跟踪的 10% 发送到标注队列进行人工审查，以抽查问题
- 将所有包含错误的跟踪升级以延长数据保留期

<Info>

要配置在线评估，请访问 [在线评估](/langsmith/online-evaluations) 页面。

</Info>

<Note>
如果自动化规则匹配跟踪中的任何运行，该跟踪将自动升级为 [延长数据保留期](/langsmith/administration-overview#data-retention-auto-upgrades)。此升级将影响跟踪定价，但确保符合您自动化标准（通常是对分析最有价值的跟踪）的跟踪得以保留以供调查。
</Note>

## 查看自动化规则

前往 **跟踪项目** 选项卡并选择一个跟踪项目。要查看该跟踪项目的现有自动化规则，请点击 **自动化** 选项卡。

![查看自动化规则](/langsmith/images/view-automation-rules.png)

## 创建规则

![标注队列抽查规则](/langsmith/images/aq-spot-check-rule.gif)

#### 1. 导航到规则创建

前往 **跟踪项目** 选项卡并选择一个跟踪项目。点击跟踪项目页面右上角的 **+ 新建**，然后点击 **新建自动化**。

#### 2. 命名您的规则

#### 3. 创建过滤器

自动化规则过滤器的工作方式与应用于项目中跟踪的过滤器相同。有关过滤器的更多信息，您可以参考 [本指南](./filter-traces-in-application)

#### 4. 配置采样率

配置采样率以控制触发自动化操作的已过滤运行的百分比。

您可以为自动化指定一个介于 0 和 1 之间的采样率。这将控制发送到自动化操作的已过滤运行的百分比。例如，如果您将采样率设置为 0.5，则通过过滤器的跟踪中有 50% 将被发送到操作。

#### 5. （可选）将规则应用于过去的运行

通过切换 **应用于过去的运行** 并输入“回填起始”日期，将规则应用于过去的运行。这仅在规则创建时可行。注意：回填作为后台作业处理，因此您不会立即看到结果。为了跟踪回填的进度，您可以 [查看自动化的日志](./rules#view-logs-for-your-automations)

#### 6. 选择应用规则时要触发的操作。

自动化规则可以执行四种操作：

- **添加到数据集**：将跟踪的输入和输出添加到 [数据集](/langsmith/evaluation-concepts#datasets)。
- **添加到标注队列**：将跟踪添加到 [标注队列](/langsmith/evaluation-concepts#annotation-queues)。
- **触发 Webhook**：使用跟踪数据触发 Webhook。有关 Webhook 的更多信息，您可以参考 [本指南](./webhooks)。
- **延长数据保留期**：延长使用基本保留期的匹配跟踪的数据保留期 [(详见数据保留文档)](/langsmith/administration-overview#data-retention)。
  请注意，所有其他规则也将通过前述数据保留文档中描述的自动升级机制延长匹配跟踪的数据保留期，但此规则不采取额外操作。

## 查看自动化的日志

日志可以让您确信您的规则按预期工作。您可以通过前往跟踪项目内的 **自动化** 选项卡并点击您创建的规则的 **日志** 按钮来查看自动化的日志。

日志选项卡允许您：

- 查看所选时间段内给定规则处理的所有运行
- 如果特定规则执行触发了错误，您可以通过悬停在错误图标上来查看错误消息
- 您可以通过筛选到规则的创建时间戳来监控回填作业的进度。这是因为回填从规则创建时开始。
- 使用 **查看运行** 按钮检查自动化规则所应用的运行。对于将运行为示例添加到数据集的规则，您可以查看生成的示例。

![日志动图](/langsmith/images/rule-logs.gif)

## 视频指南
<iframe
  className="w-full aspect-video rounded-xl"
  src="https://www.youtube.com/embed/z69cBXTJFZ0?si=GBKQ9_muHR1zllLl"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
