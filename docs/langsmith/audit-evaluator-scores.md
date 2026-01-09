---
title: 如何审核评估器分数
sidebarTitle: Audit evaluator scores
---
LLM 作为评判者（LLM-as-a-judge）的评估器并不总是完全准确。因此，人工手动审核评估器给出的分数并在必要时进行修正通常很有帮助。LangSmith 允许您在 UI 或 SDK 中对评估器分数进行修正。

## 在比较视图中

在比较视图中，您可以点击任意反馈标签以查看反馈详情。然后，点击右侧的“编辑”图标即可进入修正视图。接着，您可以在“进行修正”下方的文本框中输入您期望的分数。如果需要，您还可以为修正附上解释说明。如果您正在使用[少样本评估器](/langsmith/create-few-shot-evaluators)，这尤其有用，因为它会自动替换 `few_shot_explanation` 提示变量，并插入到您的少样本示例中。

![审核评估器比较视图](/langsmith/images/corrections-comparison-view.png)

## 在运行表中

在运行表中，找到“反馈”列并点击反馈标签以查看反馈详情。同样，点击右侧的“编辑”图标即可进入修正视图。

![审核评估器运行表](/langsmith/images/corrections-runs-table.png)

## 在 SDK 中

可以通过 SDK 的 `update_feedback` 函数配合 `correction` 字典进行修正。您必须指定一个 `score` 键，其值为数字，才能在 UI 中正确显示。

::: code-group

```python [Python]
import langsmith

client = langsmith.Client()

client.update_feedback(
    my_feedback_id,
    correction={
        "score": 1,
    },
)
```

```typescript [TypeScript]
import { Client } from 'langsmith';

const client = new Client();

await client.updateFeedback(
    myFeedbackId,
    {
        correction: {
            score: 1,
        }
    }
)
```

:::

