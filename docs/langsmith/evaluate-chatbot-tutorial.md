---
title: 评估聊天机器人
sidebarTitle: Evaluate a chatbot
---
在本指南中，我们将为聊天机器人设置评估。这些评估允许您衡量应用程序在一组数据上的表现。能够快速可靠地获得这种洞察力，将使您能够自信地进行迭代。

从高层次来看，本教程将涵盖以下内容：

*   *创建初始的黄金数据集以衡量性能*
*   *定义用于衡量性能的指标*
*   *在几个不同的提示或模型上运行评估*
*   *手动比较结果*
*   *随时间跟踪结果*
*   *设置在 CI/CD 中运行的自动化测试*

有关 LangSmith 支持的评估工作流的更多信息，请查看[操作指南](/langsmith/evaluation)，或参阅 [evaluate](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._runner.evaluate) 及其异步对应函数 [aevaluate](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._arunner.aevaluate) 的参考文档。

内容很多，让我们开始吧！

## 设置

首先安装本教程所需的依赖项。我们恰好使用 OpenAI，但 LangSmith 可以与任何模型一起使用：

::: code-group

```bash [pip]
pip install -U langsmith openai
```

```bash [uv]
uv add langsmith openai
```

:::

并设置环境变量以启用 LangSmith 追踪：

```bash
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="<Your LangSmith API key>"
export OPENAI_API_KEY="<Your OpenAI API key>"
```

## 创建数据集

准备测试和评估应用程序的第一步是定义要评估的数据点。这里有几个方面需要考虑：

*   每个数据点的模式应该是什么？
*   我应该收集多少个数据点？
*   我应该如何收集这些数据点？

**模式：** 每个数据点至少应包含应用程序的输入。如果可能，定义预期输出也很有帮助——这些代表了您期望正常运行应用程序输出的内容。通常您无法定义完美的输出——这没关系！评估是一个迭代过程。有时您可能还想为每个示例定义更多信息——例如 RAG 中预期获取的文档，或智能体预期采取的步骤。LangSmith 数据集非常灵活，允许您定义任意模式。

**数量：** 对于应该收集多少个数据点，没有硬性规定。主要是确保您能适当覆盖可能想要防范的边缘情况。即使是 10-50 个示例也能提供很多价值！开始时不必担心数量要大——您可以（也应该）随时添加！

**如何获取：** 这可能是最棘手的部分。一旦您知道要收集数据集……实际上该如何进行呢？对于大多数开始新项目的团队，我们通常看到他们首先手动收集前 10-20 个数据点。从这些数据点开始后，这些数据集通常是*动态*的结构，会随着时间的推移而增长。它们通常在看到真实用户如何使用您的应用程序、发现存在的痛点，然后将其中一些数据点移入此集合后增长。还有一些方法，如合成生成数据，可用于扩充您的数据集。开始时，我们建议不必担心这些，只需手动标注大约 10-20 个示例。

一旦您有了数据集，有几种不同的方法可以将它们上传到 LangSmith。在本教程中，我们将使用客户端，但您也可以通过 UI 上传（甚至可以在 UI 中创建它们）。

在本教程中，我们将创建 5 个数据点进行评估。我们将评估一个问答应用程序。输入将是一个问题，输出将是一个答案。由于这是一个问答应用程序，我们可以定义预期的答案。让我们展示如何创建此数据集并将其上传到 LangSmith！

```python
from langsmith import Client

client = Client()

# Define dataset: these are your test cases
dataset_name = "QA Example Dataset"
dataset = client.create_dataset(dataset_name)

client.create_examples(
    dataset_id=dataset.id,
    examples=[
        {
            "inputs": {"question": "What is LangChain?"},
            "outputs": {"answer": "A framework for building LLM applications"},
        },
        {
            "inputs": {"question": "What is LangSmith?"},
            "outputs": {"answer": "A platform for observing and evaluating LLM applications"},
        },
        {
            "inputs": {"question": "What is OpenAI?"},
            "outputs": {"answer": "A company that creates Large Language Models"},
        },
        {
            "inputs": {"question": "What is Google?"},
            "outputs": {"answer": "A technology company known for search"},
        },
        {
            "inputs": {"question": "What is Mistral?"},
            "outputs": {"answer": "A company that creates Large Language Models"},
        }
    ]
)
```

现在，如果我们转到 LangSmith UI 并在 `Datasets & Testing` 页面中查找 `QA Example Dataset`，当我们点击它时，应该会看到我们有五个新示例。

![测试教程数据集](/langsmith/images/testing-tutorial-dataset.png)

## 定义指标

创建数据集后，我们现在可以定义一些指标来评估我们的响应。由于我们有预期的答案，我们可以将其作为评估的一部分进行比较。但是，我们不期望我们的应用程序输出那些**完全相同的**答案，而是输出类似的内容。这使得我们的评估稍微复杂一些。

除了评估正确性之外，我们还要确保我们的答案简短精炼。这会稍微容易一些——我们可以定义一个简单的 Python 函数来测量响应的长度。

让我们继续定义这两个指标。

对于第一个指标，我们将使用 LLM 来**判断**输出是否正确（相对于预期输出）。这种 **LLM 作为评判者** 的方法在情况过于复杂而无法用简单函数衡量时相对常见。我们可以在这里定义自己的提示词和用于评估的 LLM：

```python
import openai
from langsmith import wrappers

openai_client = wrappers.wrap_openai(openai.OpenAI())

eval_instructions = "You are an expert professor specialized in grading students' answers to questions."

def correctness(inputs: dict, outputs: dict, reference_outputs: dict) -> bool:
    user_content = f"""You are grading the following question:
{inputs['question']}
Here is the real answer:
{reference_outputs['answer']}
You are grading the following predicted answer:
{outputs['response']}
Respond with CORRECT or INCORRECT:
Grade:"""
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        messages=[
            {"role": "system", "content": eval_instructions},
            {"role": "user", "content": user_content},
        ],
    ).choices[0].message.content
    return response == "CORRECT"
```

对于评估响应的长度，这要容易得多！我们可以只定义一个简单的函数，检查实际输出是否小于预期结果长度的 2 倍。

```python
def concision(outputs: dict, reference_outputs: dict) -> bool:
    return int(len(outputs["response"]) < 2 * len(reference_outputs["answer"]))
```

## 运行评估

太好了！那么现在我们如何运行评估呢？现在我们有了数据集和评估器，我们需要的只是我们的应用程序！我们将构建一个简单的应用程序，它只有一个关于如何响应的系统消息指令，然后将其传递给 LLM。我们将直接使用 OpenAI SDK 构建它：

```python
default_instructions = "Respond to the users question in a short, concise manner (one short sentence)."

def my_app(question: str, model: str = "gpt-4o-mini", instructions: str = default_instructions) -> str:
    return openai_client.chat.completions.create(
        model=model,
        temperature=0,
        messages=[
            {"role": "system", "content": instructions},
            {"role": "user", "content": question},
        ],
    ).choices[0].message.content
```

在通过 LangSmith 评估运行此程序之前，我们需要定义一个简单的包装器，将数据集中的输入键映射到我们要调用的函数，然后将函数的输出映射到我们期望的输出键。

```python
def ls_target(inputs: str) -> dict:
    return {"response": my_app(inputs["question"])}
```

很好！现在我们准备好运行评估了。开始吧！

```python
experiment_results = client.evaluate(
    ls_target, # Your AI system
    data=dataset_name, # The data to predict and grade over
    evaluators=[concision, correctness], # The evaluators to score the results
    experiment_prefix="openai-4o-mini", # A prefix for your experiment names to easily identify them
)
```

这将输出一个 URL。如果我们点击它，应该会看到评估结果！

![测试教程运行](/langsmith/images/testing-tutorial-run.png)

如果我们回到数据集页面并选择 `Experiments` 选项卡，现在可以看到我们一次运行的摘要！

![测试教程一次运行](/langsmith/images/testing-tutorial-one-run.png)

现在让我们用不同的模型试试！试试 `gpt-4-turbo`

```python
def ls_target_v2(inputs: str) -> dict:
    return {"response": my_app(inputs["question"], model="gpt-4-turbo")}

experiment_results = client.evaluate(
    ls_target_v2,
    data=dataset_name,
    evaluators=[concision, correctness],
    experiment_prefix="openai-4-turbo",
)
```

现在让我们使用 GPT-4，同时更新提示词，要求答案更简短一些。

```python
instructions_v3 = "Respond to the users question in a short, concise manner (one short sentence). Do NOT use more than ten words."

def ls_target_v3(inputs: str) -> dict:
    response = my_app(
        inputs["question"],
        model="gpt-4-turbo",
        instructions=instructions_v3
    )
    return {"response": response}

experiment_results = client.evaluate(
    ls_target_v3,
    data=dataset_name,
    evaluators=[concision, correctness],
    experiment_prefix="strict-openai-4-turbo",
)
```

如果我们回到数据集页面上的 `Experiments` 选项卡，应该会看到所有三次运行现在都显示出来了！

![测试教程三次运行](/langsmith/images/testing-tutorial-three-runs.png)

## 比较结果

太棒了，我们已经评估了三种不同的运行。但是我们如何比较结果呢？第一种方法是查看 `Experiments` 选项卡中的运行。如果我们这样做，可以看到每次运行指标的高层视图：

![测试教程比较指标](/langsmith/images/testing-tutorial-compare-metrics.png)

很好！所以我们可以看出 GPT-4 在了解公司方面比 GPT-3.5 更好，并且我们可以看到严格的提示词在长度方面有很大帮助。但是如果我们想更详细地探索呢？

为了做到这一点，我们可以选择所有要比较的运行（在本例中是所有三个），并在比较视图中打开它们。我们立即看到所有三个测试并排显示。一些单元格带有颜色编码——这显示了*某个指标*相对于*某个基线*的回归。我们自动为基线和指标选择默认值，但您可以自己更改它们。您还可以使用 `Display` 控件选择要查看的列和指标。您还可以通过点击顶部的图标自动筛选，只查看有改进/回归的运行。

![测试教程比较运行](/langsmith/images/testing-tutorial-compare-runs.png)

如果我们想查看更多信息，还可以将鼠标悬停在一行上时出现的 `Expand` 按钮，以打开一个侧边面板，其中包含更详细的信息：

![测试教程侧边面板](/langsmith/images/testing-tutorial-side-panel.png)

## 设置在 CI/CD 中运行的自动化测试

既然我们已经以一次性方式运行了此测试，我们可以将其设置为以自动化方式运行。我们可以通过将其作为在 CI/CD 中运行的 pytest 文件包含进来，从而轻松实现这一点。作为其中的一部分，我们可以只记录结果，或者设置一些标准来确定它是否通过。例如，如果我想确保我们生成的响应中至少有 80% 通过 `length` 检查，我们可以设置一个像这样的测试：

```python
def test_length_score() -> None:
    """Test that the length score is at least 80%."""
    experiment_results = evaluate(
        ls_target, # Your AI system
        data=dataset_name, # The data to predict and grade over
        evaluators=[concision, correctness], # The evaluators to score the results
    )
    # This will be cleaned up in the next release:
    feedback = client.list_feedback(
        run_ids=[r.id for r in client.list_runs(project_name=experiment_results.experiment_name)],
        feedback_key="concision"
    )
    scores = [f.score for f in feedback]
    assert sum(scores) / len(scores) >= 0.8, "Aggregate score should be at least .8"
```

## 随时间跟踪结果

现在我们已经以自动化方式运行了这些实验，我们希望随时间跟踪这些结果。我们可以从数据集页面的整体 `Experiments` 选项卡中执行此操作。默认情况下，我们显示随时间变化的评估指标（以红色突出显示）。我们还会自动跟踪 git 指标，以便轻松地将其与您的代码分支关联起来（以黄色突出显示）。

![测试教程随时间变化](/langsmith/images/testing-tutorial-over-time.png)

## 结论

本教程到此结束！

我们已经介绍了如何创建初始测试集、定义一些评估指标、运行实验、手动比较它们、设置 CI/CD 以及随时间跟踪结果。希望这能帮助您自信地进行迭代。

这仅仅是个开始。如前所述，评估是一个持续的过程。例如——您想要评估的数据点可能会随着时间的推移而继续变化。您可能希望探索许多类型的评估器。有关此信息，请查看[操作指南](/langsmith/evaluation)。

此外，除了这种“离线”方式之外，还有其他评估数据的方法（例如，您可以评估生产数据）。有关在线评估的更多信息，请查看[本指南](/langsmith/online-evaluations)。

## 参考代码

:::: details 点击查看整合后的代码片段

```python
import openai
from langsmith import Client, wrappers

# Application code
openai_client = wrappers.wrap_openai(openai.OpenAI())

default_instructions = "Respond to the users question in a short, concise manner (one short sentence)."

def my_app(question: str, model: str = "gpt-4o-mini", instructions: str = default_instructions) -> str:
    return openai_client.chat.completions.create(
        model=model,
        temperature=0,
        messages=[
            {"role": "system", "content": instructions},
            {"role": "user", "content": question},
        ],
    ).choices[0].message.content

client = Client()

# Define dataset: these are your test cases
dataset_name = "QA Example Dataset"
dataset = client.create_dataset(dataset_name)

client.create_examples(
    dataset_id=dataset.id,
    examples=[
        {
            "inputs": {"question": "What is LangChain?"},
            "outputs": {"answer": "A framework for building LLM applications"},
        },
        {
            "inputs": {"question": "What is LangSmith?"},
            "outputs": {"answer": "A platform for observing and evaluating LLM applications"},
        },
        {
            "inputs": {"question": "What is OpenAI?"},
            "outputs": {"answer": "A company that creates Large Language Models"},
        },
        {
            "inputs": {"question": "What is Google?"},
            "outputs": {"answer": "A technology company known for search"},
        },
        {
            "inputs": {"question": "What is Mistral?"},
            "outputs": {"answer": "A company that creates Large Language Models"},
        }
    ]
)

# Define evaluators
eval_instructions = "You are an expert professor specialized in grading students' answers to questions."

def correctness(inputs: dict, outputs: dict, reference_outputs: dict) -> bool:
    user_content = f"""You are grading the following question:
{inputs['question']}
Here is the real answer:
{reference_outputs['answer']}
You are grading the following predicted answer:
{outputs['response']}
Respond with CORRECT or INCORRECT:
Grade:"""
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        messages=[
            {"role": "system", "content": eval_instructions},
            {"role": "user", "content": user_content},
        ],
    ).choices[0].message.content
    return response == "CORRECT"

def concision(outputs: dict, reference_outputs: dict) -> bool:
    return int(len(outputs["response"]) < 2 * len(reference_outputs["answer"]))

# Run evaluations
def ls_target(inputs: str) -> dict:
    return {"response": my_app(inputs["question"])}

experiment_results_v1 = client.evaluate(
    ls_target, # Your AI system
    data=dataset_name, # The data to predict and grade over
    evaluators=[concision, correctness], # The evaluators to score the results
    experiment_prefix="openai-4o-mini", # A prefix for your experiment names to easily identify them
)

def ls_target_v2(inputs: str) -> dict:
    return {"response": my_app(inputs["question"], model="gpt-4-turbo")}

experiment_results_v2 = client.evaluate(
    ls_target_v2,
    data=dataset_name,
    evaluators=[concision, correctness],
    experiment_prefix="openai-4-turbo",
)

instructions_v3 = "Respond to the users question in a short, concise manner (one short sentence). Do NOT use more than ten words."

def ls_target_v3(inputs: str) -> dict:
    response = my_app(
        inputs["question"],
        model="gpt-4-turbo",
        instructions=instructions_v3
    )
    return {"response": response}

experiment_results_v3 = client.evaluate(
    ls_target_v3,
    data=dataset_name,
    evaluators=[concision, correctness],
    experiment_prefix="strict-openai-4-turbo",
)
```

::::

