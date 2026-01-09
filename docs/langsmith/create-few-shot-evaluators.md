---
title: 如何通过少量示例提升评估器性能
sidebarTitle: Improve your evaluator with few-shot examples
---
当无法通过编程方式评估系统时，使用 LLM-as-a-judge 评估器会非常有帮助。然而，其有效性取决于评估器的质量以及与人类评审反馈的对齐程度。LangSmith 提供了使用少量示例（few-shot examples）来提升 LLM-as-a-judge 评估器与人类偏好对齐的能力。

通过少量示例技术，人工修正会被自动插入到评估器的提示词中。少量示例技术灵感来源于 [少量示例提示](https://www.promptingguide.ai/techniques/fewshot)，它通过少量高质量示例来引导模型的输出。

本指南将介绍如何将少量示例设置为 LLM-as-a-judge 评估器的一部分，并将修正应用于反馈分数。

## 少量示例的工作原理

*   少量示例通过 <code v-pre>{{Few-shot examples}}</code> 变量添加到评估器提示词中。
*   创建带有少量示例的评估器时，系统会自动为您创建一个数据集。一旦您开始进行修正，该数据集将自动填充少量示例。
*   在运行时，这些示例将被插入到评估器中，作为其输出的指导——这将帮助评估器更好地与人类偏好对齐。

## 配置您的评估器

<Note>

目前，使用提示中心的 LLM-as-a-judge 评估器不支持少量示例，该功能仅兼容使用 Mustache 格式的提示词。

</Note>

在启用少量示例之前，请先设置好您的 LLM-as-a-judge 评估器。如果尚未完成，请按照 [LLM-as-a-judge 评估器指南](/langsmith/llm-as-judge) 中的步骤操作。

### 1. 配置变量映射

每个少量示例都根据配置中指定的变量映射进行格式化。少量示例的变量映射应包含与主提示词相同的变量，外加一个 `few_shot_explanation` 变量和一个 `score` 变量，该 `score` 变量应与您的反馈键（feedback key）同名。

例如，如果您的主提示词包含变量 `question` 和 `response`，并且您的评估器输出一个 `correctness` 分数，那么您的少量示例提示词应包含变量 `question`、`response`、`few_shot_explanation` 和 `correctness`。

### 2. 指定要使用的少量示例数量

您还可以指定要使用的少量示例数量。默认值为 5。如果您的示例非常长，您可能需要将此数字设置得更低以节省令牌（tokens）；而如果您的示例通常较短，您可以设置更高的数字，以便为评估器提供更多学习示例。如果您的数据集中有超过此数量的示例，系统将为您随机选择。

## 进行修正

<Info>

[审核评估器分数](/langsmith/audit-evaluator-scores)

</Info>

当您开始记录追踪（traces）或运行实验时，您可能会对评估器给出的某些分数持有不同意见。当您 [对这些分数进行修正](/langsmith/audit-evaluator-scores) 时，您将开始看到修正数据集中填充了示例。在进行修正时，请务必附上解释——这些解释将填充到评估器提示词中，替代 `few_shot_explanation` 变量。

少量示例的输入将来自您的链/数据集的输入、输出和参考（如果这是一个离线评估器）中的相关字段。输出将是修正后的评估器分数以及您在留下修正时创建的解释。您可以随意编辑这些内容以满足您的需求。以下是一个修正数据集中少量示例的示例：

![少量示例](/langsmith/images/few-shot-example.png)

请注意，修正可能需要一两分钟才能填充到您的少量示例数据集中。一旦填充完成，评估器的后续运行将在提示词中包含它们！

## 查看您的修正数据集

要查看您的修正数据集：

*   **在线评估器**：选择您的运行规则（run rule），然后点击 **编辑规则**。
*   **离线评估器**：选择您的评估器，然后点击 **编辑评估器**。

![编辑评估器](/langsmith/images/edit-evaluator.png)

前往 **使用少量示例提高评估器准确性** 部分中链接的修正数据集。您可以在数据集中查看和更新您的少量示例。

![查看少量示例数据集](/langsmith/images/view-few-shot-ds.png)
