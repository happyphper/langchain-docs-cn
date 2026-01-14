---
title: 如何在 UI 中筛选实验
sidebarTitle: Filter experiments in the UI
---
LangSmith 允许您根据反馈分数和元数据筛选之前的实验，从而轻松找到您关心的实验。

## 背景：为实验添加元数据

在 SDK 中运行实验时，您可以附加元数据，以便在 UI 中更容易筛选。如果您知道在运行实验时想要深入分析的维度，这会很有帮助。

在我们的示例中，我们将围绕使用的模型、模型提供者和已知的提示 ID 为实验附加元数据：

```python
models = {
    "openai-gpt-4o": ChatOpenAI(model="gpt-4o", temperature=0),
    "openai-gpt-4o-mini": ChatOpenAI(model="gpt-4o-mini", temperature=0),
    "anthropic-claude-3-sonnet-20240229": ChatAnthropic(temperature=0, model_name="claude-3-sonnet-20240229")
}

prompts = {
    "singleminded": "always answer questions with the word banana.",
    "fruitminded": "always discuss fruit in your answers.",
    "basic": "you are a chatbot."
}

def answer_evaluator(run, example) -> dict:
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    answer_grader = hub.pull("langchain-ai/rag-answer-vs-reference") | llm
    score = answer_grader.invoke(
        {
            "question": example.inputs["question"],
            "correct_answer": example.outputs["answer"],
            "student_answer": run.outputs,
        }
    )
    return {"key": "correctness", "score": score["Score"]}

dataset_name = "Filterable Dataset"

for model_type, model in models.items():
    for prompt_type, prompt in prompts.items():
        def predict(example):
            return model.invoke(
                [("system", prompt), ("user", example["question"])]
            )

        model_provider = model_type.split("-")[0]
        model_name = model_type[len(model_provider) + 1:]

        evaluate(
            predict,
            data=dataset_name,
            evaluators=[answer_evaluator],
            # 在此处添加元数据！！
            metadata={
                "model_provider": model_provider,
                "model_name": model_name,
                "prompt_id": prompt_type
            }
        )
```

## 在 UI 中筛选实验

在 UI 中，默认会看到所有已运行的实验。

![筛选所有实验](/langsmith/images/filter-all-experiments.png)

例如，如果我们偏好 OpenAI 模型，可以轻松筛选并首先查看仅限 OpenAI 模型的分数：

![筛选 OpenAI](/langsmith/images/filter-openai.png)

我们可以叠加筛选器，从而过滤掉正确性分数较低的实验，确保只比较相关的实验：

![筛选反馈](/langsmith/images/filter-feedback.png)

最后，我们可以清除并重置筛选器。例如，如果我们看到 `singleminded` 提示明显胜出，可以更改筛选设置，查看是否有其他模型提供商的模型也能与之良好配合：

![筛选 singleminded](/langsmith/images/filter-singleminded.png)
