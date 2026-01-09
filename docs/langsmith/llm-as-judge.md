---
title: 如何定义 LLM 即评判者评估器
sidebarTitle: LLM-as-a-judge evaluator
---

<Info>

* [LLM-as-a-judge 评估器](/langsmith/evaluation-concepts#llm-as-judge)

</Info>

LLM 应用程序的评估可能具有挑战性，因为它们通常生成对话式文本，没有唯一正确的答案。

本指南向您展示如何使用 LangSmith SDK 或 UI 为[离线评估](/langsmith/evaluation-concepts#offline-evaluation)定义一个 LLM-as-a-judge 评估器。注意：要在生产环境的追踪记录上实时运行评估，请参阅[设置在线评估](/langsmith/online-evaluations#configure-llm-as-judge-evaluators)。

## SDK

### 预构建评估器

预构建评估器是设置评估的一个有用起点。关于如何在 LangSmith 中使用预构建评估器，请参阅[预构建评估器](/langsmith/prebuilt-evaluators)。

### 创建您自己的 LLM-as-a-judge 评估器

为了完全控制评估器逻辑，您可以创建自己的 LLM-as-a-judge 评估器，并使用 LangSmith SDK ([Python](https://docs.smith.langchain.com/reference/python/reference) / [TypeScript](https://docs.smith.langchain.com/reference/js)) 运行它。

需要 `langsmith>=0.2.0`

```python
from langsmith import evaluate, traceable, wrappers, Client
from openai import OpenAI
# 假设您已安装 pydantic
from pydantic import BaseModel

# 可选：包装 OpenAI 客户端以追踪所有模型调用。
oai_client = wrappers.wrap_openai(OpenAI())

def valid_reasoning(inputs: dict, outputs: dict) -> bool:
    """使用 LLM 判断推理和答案是否一致。"""
    instructions = """
Given the following question, answer, and reasoning, determine if the reasoning
for the answer is logically valid and consistent with the question and the answer."""

    class Response(BaseModel):
        reasoning_is_valid: bool

    msg = f"Question: {inputs['question']}\nAnswer: {outputs['answer']}\nReasoning: {outputs['reasoning']}"
    response = oai_client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[{"role": "system", "content": instructions,}, {"role": "user", "content": msg}],
        response_format=Response
    )
    return response.choices[0].message.parsed.reasoning_is_valid

# 可选：添加 'traceable' 装饰器以追踪此函数的输入/输出。
@traceable
def dummy_app(inputs: dict) -> dict:
    return {"answer": "hmm i'm not sure", "reasoning": "i didn't understand the question"}

ls_client = Client()
dataset = ls_client.create_dataset("big questions")
examples = [
    {"inputs": {"question": "how will the universe end"}},
    {"inputs": {"question": "are we alone"}},
]
ls_client.create_examples(dataset_id=dataset.id, examples=examples)

results = evaluate(
    dummy_app,
    data=dataset,
    evaluators=[valid_reasoning]
)
```

关于如何编写自定义评估器的更多信息，请参阅[此处](/langsmith/code-evaluator)。

## UI

### 预构建评估器

预构建评估器是设置评估的一个有用起点。LangSmith UI 支持以下预构建评估器：

* **幻觉检测**：检测事实错误的输出。需要参考输出。
* **正确性**：检查与参考的语义相似性。
* **简洁性**：评估答案是否是对问题的简洁回应。
* **代码检查器**：验证代码答案的正确性。

您可以在以下场景配置这些评估器：

* 使用[游乐场](/langsmith/observability-concepts#prompt-playground)运行评估时
* 作为数据集的一部分，以便[在实验上自动运行评估](/langsmith/bind-evaluator-to-dataset)
* 运行[在线评估](/langsmith/online-evaluations#configure-llm-as-judge-evaluators)时

## 自定义您的 LLM-as-a-judge 评估器

为您的 LLM-as-a-judge 评估器提示词添加特定指令，并配置应将输入/输出/参考输出的哪些部分传递给评估器。

### 选择/创建评估器

* 在游乐场或从数据集：选择 **+Evaluator** 按钮
* 从追踪项目：选择 **Add rules**，配置您的规则并选择 **Apply evaluator**

选择 **Create your own evaluator option**。或者，您也可以先选择一个预构建的评估器并进行编辑。

### 配置评估器

#### 提示词

创建新提示词，或从[提示词中心](/langsmith/prompt-engineering-quickstart)选择现有提示词。

* **创建您自己的提示词**：内联创建自定义提示词。

* **从提示词中心拉取提示词**：使用 **Select a prompt** 下拉菜单从现有提示词中选择。您不能在提示词编辑器内直接编辑这些提示词，但可以查看提示词及其使用的模式。要进行更改，请在游乐场中编辑提示词并提交版本，然后在评估器中拉入您的新提示词。

#### 模型

从提供的选项中选择所需的模型。

#### 映射变量

使用变量映射来指示从您的运行或示例传递到评估器提示词中的变量。为了帮助进行变量映射，会提供一个示例（或运行）作为参考。单击提示词中的变量，并使用下拉菜单将它们映射到输入、输出或参考输出的相关部分。

要添加提示词变量，如果使用 Mustache 格式（默认），请键入带有双花括号的变量 <code v-pre>{{prompt_var}}</code>；如果使用 f-string 格式，请键入带有单花括号的变量 `{prompt_var}`。

您可以根据需要移除变量。例如，如果您正在评估简洁性等指标，通常不需要参考输出，因此您可以移除该变量。

#### 预览

预览提示词将向您展示使用右侧显示的参考运行和数据集示例格式化后的提示词外观。

#### 通过少样本示例改进您的评估器

为了更好地使 LLM-as-a-judge 评估器与人类偏好对齐，LangSmith 允许您收集评估器分数上的[人工修正](/langsmith/create-few-shot-evaluators#make-corrections)。启用此选项后，修正将自动作为少样本示例插入到您的提示词中。

了解[如何设置少样本示例并进行修正](/langsmith/create-few-shot-evaluators)。

#### 反馈配置

反馈配置是您的 LLM-as-a-judge 评估器将使用的评分标准。可以将其视为您的评估器将依据的评分标准。分数将作为[反馈](/langsmith/observability-concepts#feedback)添加到运行或示例中。为您的评估器定义反馈：

1.  **命名反馈键**：这是在查看评估结果时将显示的名称。名称在实验中应是唯一的。

2.  **添加描述**：描述反馈代表什么。

3.  **选择反馈类型**：

*   **布尔值**：真/假反馈。
*   **分类**：从预定义类别中选择。
*   **连续值**：在指定范围内的数值评分。

在幕后，反馈配置作为[结构化输出](https://python.langchain.com/docs/concepts/structured_outputs/)添加到 LLM-as-a-judge 提示词中。如果您使用的是来自中心的现有提示词，则必须在配置评估器使用它之前向提示词添加输出模式。输出模式中的每个顶级键都将被视为一个独立的反馈项。

### 保存评估器

配置完成后，保存您的更改。
