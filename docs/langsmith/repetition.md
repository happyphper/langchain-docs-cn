---
title: 如何通过重复进行评估
sidebarTitle: Evaluate with repetitions
---
运行多次重复可以更准确地评估系统性能，因为大语言模型（LLM）的输出具有非确定性。不同重复之间的输出可能存在差异。重复是一种减少高变异性系统（例如智能体）中噪声的方法。

## 在实验中配置重复次数

在 `evaluate` / `aevaluate` 函数中添加可选的 `num_repetitions` 参数（[Python](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._runner.evaluate), [TypeScript](https://docs.smith.langchain.com/reference/js/interfaces/evaluation.EvaluateOptions#numrepetitions)），以指定对数据集中每个示例进行评估的次数。例如，如果数据集中有 5 个示例，并设置 `num_repetitions=5`，则每个示例将运行 5 次，总共进行 25 次运行。

::: code-group

```python [Python]
from langsmith import evaluate

results = evaluate(
    lambda inputs: label_text(inputs["text"]),
    data=dataset_name,
    evaluators=[correct_label],
    experiment_prefix="Toxic Queries",
    num_repetitions=3,
)
```

```typescript [TypeScript]
import { evaluate } from "langsmith/evaluation";

await evaluate((inputs) => labelText(inputs["input"]), {
  data: datasetName,
  evaluators: [correctLabel],
  experimentPrefix: "Toxic Queries",
  numRepetitions: 3,
});
```

:::

## 查看带重复运行的实验结果

如果您使用[重复](/langsmith/evaluation-concepts#repetitions)运行了实验，输出结果列中会出现箭头，以便您在表格中查看输出。要查看每次重复的运行结果，请将鼠标悬停在输出单元格上并点击展开视图。当您运行带重复的实验时，LangSmith 会在表格中显示每个反馈分数的平均值。点击反馈分数可以查看单次运行的反馈分数，或查看重复之间的标准差。

![重复](/langsmith/images/repetitions.png)
