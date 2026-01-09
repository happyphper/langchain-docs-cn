---
title: 如何运行成对评估
sidebarTitle: Pairwise evaluation
---

<Info>

概念：[成对评估](/langsmith/evaluation-concepts#pairwise)

</Info>

LangSmith 支持以比较的方式评估**现有的**实验。您无需每次评估一个输出，而是可以将多个实验的输出相互比较评分。在本指南中，您将使用 [`evaluate()`](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._runner.evaluate) 函数，结合两个现有实验来[定义一个成对评估器](#define-a-pairwise-evaluator)并[运行成对评估](#run-a-pairwise-evaluation)。最后，您将使用 LangSmith UI 来[查看成对实验](#view-pairwise-experiments)。

## 先决条件

* 如果您还没有创建要比较的实验，请查看[快速入门](/langsmith/evaluation-quickstart)或[操作指南](/langsmith/evaluate-llm-application)以开始进行评估。
* 本指南要求 `langsmith` Python 版本 `>=0.2.0` 或 JS 版本 `>=0.2.9`。

<Info>

您也可以使用 [`evaluate_comparative()`](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._runner.evaluate_comparative) 来比较两个以上的现有实验。

</Info>

## `evaluate()` 的比较参数

最简单的形式下，`evaluate` / `aevaluate` 函数接受以下参数：

| 参数          | 描述                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `target`      | 一个包含两个**现有实验**的列表，您希望将它们相互评估。这些可以是 UUID 或实验名称。                                                  |
| `evaluators`  | 一个您希望附加到此评估的成对评估器列表。如何定义这些评估器，请参见下文。                                                             |

除了这些，您还可以传入以下可选参数：

| 参数                                      | 描述                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `randomize_order` / `randomizeOrder`      | 一个可选的布尔值，指示每个评估中输出的顺序是否应随机化。这是一种最小化提示中位置偏差的策略：通常，LLM 会根据顺序对其中一个回答产生偏好。这主要应通过提示工程来解决，但这是另一种可选的缓解措施。默认为 False。                                                                                                                              |
| `experiment_prefix` / `experimentPrefix`  | 附加到成对实验名称开头的字符串前缀。默认为 None。                                                                                                                                                                                                                                                                                                                         |
| `description`                             | 成对实验的描述。默认为 None。                                                                                                                                                                                                                                                                                                                                             |
| `max_concurrency` / `maxConcurrency`      | 要运行的最大并发评估数。默认为 5。                                                                                                                                                                                                                                                                                                                                         |
| `client`                                  | 要使用的 LangSmith 客户端。默认为 None。                                                                                                                                                                                                                                                                                                                                 |
| `metadata`                                | 附加到成对实验的元数据。默认为 None。                                                                                                                                                                                                                                                                                                                                     |
| `load_nested` / `loadNested`              | 是否加载实验的所有子运行。当为 False 时，只有根跟踪（trace）会传递给您的评估器。默认为 False。                                                                                                                                                                                                                                                                               |

## 定义一个成对评估器

成对评估器只是具有预期签名的函数。

### 评估器参数

自定义评估器函数必须具有特定的参数名称。它们可以接受以下参数的任意子集：

* `inputs: dict`：与数据集中单个示例对应的输入字典。
* `outputs: list[dict]`：一个包含两个元素的列表，每个元素是给定输入下每个实验产生的字典输出。
* `reference_outputs` / `referenceOutputs: dict`：与示例关联的参考输出字典（如果可用）。
* `runs: list[Run]`：一个包含两个元素的列表，每个元素是给定示例下两个实验生成的完整 [Run](/langsmith/run-data-format) 对象。如果您需要访问每个运行的中间步骤或元数据，请使用此参数。
* `example: Example`：完整的数据集 [Example](/langsmith/example-data-format)，包括示例输入、输出（如果可用）和元数据（如果可用）。

对于大多数用例，您只需要 `inputs`、`outputs` 和 `reference_outputs` / `referenceOutputs`。`runs` 和 `example` 仅在您需要应用程序实际输入和输出之外的一些额外跟踪或示例元数据时才有用。

### 评估器输出

自定义评估器应返回以下类型之一：

Python 和 JS/TS

* `dict`：包含以下键的字典：
  * `key`：表示将被记录的反馈键（feedback key）。
  * `scores`：从运行 ID 到该运行分数的映射。
  * `comment`：一个字符串。最常用于模型推理。

目前仅限 Python

* `list[int | float | bool]`：一个包含两个分数的列表。假定该列表的顺序与 `runs` / `outputs` 评估器参数的顺序相同。评估器函数名称用作反馈键。

请注意，您应选择一个与运行上标准反馈不同的反馈键。我们建议在成对反馈键前加上 `pairwise_` 或 `ranked_` 前缀。

## 运行成对评估

以下示例使用了一个[提示词](https://smith.langchain.com/hub/langchain-ai/pairwise-evaluation-2)，该提示词要求 LLM 在两个 AI 助手回答之间决定哪个更好。它使用结构化输出来解析 AI 的响应：0、1 或 2。

<Info>

在下面的 Python 示例中，我们从 [LangChain Hub](/langsmith/manage-prompts#public-prompt-hub) 拉取[这个结构化提示词](https://smith.langchain.com/hub/langchain-ai/pairwise-evaluation-2)，并将其与 LangChain 聊天模型包装器一起使用。

<strong>LangChain 的使用完全是可选的。</strong> 为了说明这一点，TypeScript 示例直接使用了 OpenAI SDK。

</Info>

- Python：需要 `langsmith>=0.2.0`
- TypeScript：需要 `langsmith>=0.2.9`

::: code-group

```python [Python]
from langchain_classic import hub
from langchain.chat_models import init_chat_model
from langsmith import evaluate

# 查看提示词：https://smith.langchain.com/hub/langchain-ai/pairwise-evaluation-2
prompt = hub.pull("langchain-ai/pairwise-evaluation-2")
model = init_chat_model("gpt-4o")
chain = prompt | model

def ranked_preference(inputs: dict, outputs: list[dict]) -> list:
    # 假设示例输入有 'question' 键，实验输出有 'answer' 键。
    response = chain.invoke({
        "question": inputs["question"],
        "answer_a": outputs[0].get("answer", "N/A"),
        "answer_b": outputs[1].get("answer", "N/A"),
    })
    if response["Preference"] == 1:
        scores = [1, 0]
    elif response["Preference"] == 2:
        scores = [0, 1]
    else:
        scores = [0, 0]
    return scores

evaluate(
    ("experiment-1", "experiment-2"),  # 替换为您的实验名称/ID
    evaluators=[ranked_preference],
    randomize_order=True,
    max_concurrency=4,
)
```

```typescript [TypeScript]
import { evaluate} from "langsmith/evaluation";
import { Run } from "langsmith/schemas";
import { wrapOpenAI } from "langsmith/wrappers";
import OpenAI from "openai";
import { z } from "zod";

const openai = wrapOpenAI(new OpenAI());

async function rankedPreference({
  inputs,
  runs,
}: {
  inputs: Record<string, any>;
  runs: Run[];
}) {
  const scores: Record<string, number> = {};
  const [runA, runB] = runs;
  if (!runA || !runB) throw new Error("Expected at least two runs");

  const payload = {
    question: inputs.question,
    answer_a: runA?.outputs?.output ?? "N/A",
    answer_b: runB?.outputs?.output ?? "N/A",
  };

  const output = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: [
          "请扮演一个公正的裁判，评估两个 AI 助手对下面显示的用户问题所提供回答的质量。",
          "您应该选择那个更好地遵循用户指令并回答用户问题的助手。",
          "您的评估应考虑诸如回答的有用性、相关性、准确性、深度、创造性和详细程度等因素。",
          "通过比较两个回答开始您的评估，并提供简短的解释。",
          "避免任何位置偏见，并确保回答的呈现顺序不会影响您的决定。",
          "不要让回答的长度影响您的评估。不要偏爱某些助手的名字。尽可能客观。",
        ].join(" "),
      },
      {
        role: "user",
        content: [
          `[用户问题] ${payload.question}`,
          `[助手 A 回答的开始] ${payload.answer_a} [助手 A 回答的结束]`,
          `[助手 B 回答的开始] ${payload.answer_b} [助手 B 回答的结束]`,
        ].join("\n\n"),
      },
    ],
    tool_choice: {
      type: "function",
      function: { name: "Score" },
    },
    tools: [
      {
        type: "function",
        function: {
          name: "Score",
          description: [
            `在提供您的解释之后，请严格按照以下格式输出您的最终裁决：`,
            `如果助手 A 的回答基于上述因素更好，则输出 "1"。`,
            `如果助手 B 的回答基于上述因素更好，则输出 "2"。`,
            `如果是平局，则输出 "0"。`,
          ].join(" "),
          parameters: {
            type: "object",
            properties: {
              Preference: {
                type: "integer",
                description: "哪个助手的回答更受青睐？",
              },
            },
          },
        },
      },
    ],
  });

  const { Preference } = z
    .object({ Preference: z.number() })
    .parse(
      JSON.parse(output.choices[0].message.tool_calls[0].function.arguments)
    );

  if (Preference === 1) {
    scores[runA.id] = 1;
    scores[runB.id] = 0;
  } else if (Preference === 2) {
    scores[runA.id] = 0;
    scores[runB.id] = 1;
  } else {
    scores[runA.id] = 0;
    scores[runB.id] = 0;
  }

  return { key: "ranked_preference", scores };
}

await evaluate(["earnest-name-40", "reflecting-pump-91"], {
  evaluators: [rankedPreference],
});
```

:::

## 查看成对实验

从数据集页面导航到“成对实验”标签页：

![成对实验标签页](/langsmith/images/pairwise-from-dataset.png)

点击您想要检查的成对实验，您将被带到比较视图：

![成对比较视图](/langsmith/images/pairwise-comparison-view.png)

您可以通过点击表头中的大拇指向上/向下按钮来筛选第一个实验表现更好的运行，反之亦然：

![成对筛选](/langsmith/images/filter-pairwise.png)
