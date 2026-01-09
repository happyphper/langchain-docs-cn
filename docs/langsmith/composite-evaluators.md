---
title: 复合评估器
sidebarTitle: Composite evaluators
---
**组合评估器**是一种将多个评估器分数合并为单个[分数](/langsmith/evaluation-concepts#evaluator-outputs)的方法。当您希望评估应用程序的多个方面并将结果合并为单一结果时，这非常有用。

## 使用 UI 创建组合评估器

您可以在[追踪项目](/langsmith/observability-concepts#projects)（用于[在线评估](/langsmith/evaluation-concepts#online-evaluation)）或[数据集](/langsmith/evaluation-concepts#datasets)（用于[离线评估](/langsmith/evaluation-concepts#offline-evaluation)）上创建组合评估器。通过 UI 中的组合评估器，您可以计算多个评估器分数的加权平均值或加权和，并可以配置权重。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/create_composite_evaluator-light.png" alt="LangSmith UI 显示一个名为 ChatOpenAI 的 LLM 调用追踪，包含系统输入、人类输入和 AI 输出。" />

<img src="/langsmith/images/create_composite_evaluator-dark.png" alt="LangSmith UI 显示一个名为 ChatOpenAI 的 LLM 调用追踪，包含系统输入、人类输入和 AI 输出。" />

</div>

### 1. 导航到追踪项目或数据集

要开始配置组合评估器，请导航到 **Tracing Projects** 或 **Dataset & Experiments** 选项卡并选择一个项目或数据集。
- 在追踪项目内：**+ New** > **Evaluator** > **Composite score**
- 在数据集内：**+ Evaluator** > **Composite score**

### 2. 配置组合评估器

1.  为您的评估器命名。
2.  选择聚合方法，**Average** 或 **Sum**。
    - **Average**: ∑(权重*分数) / ∑(权重)。
    - **Sum**: ∑(权重*分数)。
3.  添加您希望包含在组合分数中的反馈键。
4.  为反馈键添加权重。默认情况下，每个反馈键的权重相等。调整权重以增加或减少特定反馈键在最终分数中的重要性。
5.  点击 **Create** 保存评估器。

<Tip>
如果您需要调整组合分数的权重，可以在评估器创建后进行更新。配置了该评估器的所有运行的分数结果都将被更新。 
</Tip>

### 3. 查看组合评估器结果
组合分数会作为**反馈**附加到运行上，类似于单个评估器的反馈。查看方式取决于评估运行的位置：

**在追踪项目上**：
- 组合分数会作为运行上的反馈显示。
- [筛选](/langsmith/filter-traces-in-application)具有组合分数的运行，或组合分数达到特定阈值的运行。
- [创建图表](/langsmith/dashboards#custom-dashboards)以可视化组合分数随时间的变化趋势。

**在数据集上**：
- 在实验选项卡中查看组合分数。您还可以根据运行的平均组合分数来筛选和排序实验。
- 点击进入实验以查看每个运行的组合分数。

<Note>
如果运行中未配置任何组成评估器，则该运行的组合分数将不会被计算。 
</Note>

## 使用 SDK 创建组合反馈

本指南介绍如何设置一个使用多个评估器并通过自定义聚合函数合并其分数的评估。

<Note>
需要 langsmith>=0.4.29 
</Note>

### 1. 在数据集上配置评估器
首先配置您的评估器。在此示例中，应用程序根据博客介绍生成推文，并使用三个评估器——摘要、语气和格式——来评估输出。

如果您已经拥有配置了评估器的数据集，可以跳过此步骤。

:::: details 在数据集上配置评估器。

```python
import os
from dotenv import load_dotenv
from openai import OpenAI
from langsmith import Client
from pydantic import BaseModel
import json

# Load environment variables from .env file
load_dotenv()

# Access environment variables
openai_api_key = os.getenv('OPENAI_API_KEY')
langsmith_api_key = os.getenv('LANGSMITH_API_KEY')
langsmith_project = os.getenv('LANGSMITH_PROJECT', 'default')

# Create a dataset. Only need to do this once.
client = Client()
oai_client = OpenAI()

examples = [
  {
    "inputs": {"blog_intro": "Today we’re excited to announce the general availability of LangSmith — our purpose-built infrastructure and management layer for deploying and scaling long-running, stateful agents. Since our beta last June, nearly 400 companies have used LangSmith to deploy their agents into production. Agent deployment is the next hard hurdle for shipping reliable agents, and LangSmith dramatically lowers this barrier with: 1-click deployment to go live in minutes, 30 API endpoints for designing custom user experiences that fit any interaction pattern, Horizontal scaling to handle bursty, long-running traffic, A persistence layer to support memory, conversational history, and async collaboration with human-in-the-loop or multi-agent workflows, Native Studio, the agent IDE, for easy debugging, visibility, and iteration "},
  },
  {
    "inputs": {"blog_intro": "Klarna has reshaped global commerce with its consumer-centric, AI-powered payment and shopping solutions. With over 85 million active users and 2.5 million daily transactions on its platform, Klarna is a fintech leader that simplifies shopping while empowering consumers with smarter, more flexible financial solutions. Klarna’s flagship AI Assistant is revolutionizing the shopping and payments experience. Built on LangGraph and powered by LangSmith, the AI Assistant handles tasks ranging from customer payments, to refunds, to other payment escalations. With 2.5 million conversations to date, the AI Assistant is more than just a chatbot; it’s a transformative agent that performs the work equivalent of 700 full-time staff, delivering results quickly and improving company efficiency."},
  },
]

dataset = client.create_dataset(dataset_name="Blog Intros")

client.create_examples(
  dataset_id=dataset.id,
  examples=examples,
)

# Define a target function. In this case, we're using a simple function that generates a tweet from a blog intro.
def generate_tweet(inputs: dict) -> dict:
    instructions = (
      "Given the blog introduction, please generate a catchy yet professional tweet that can be used to promote the blog post on social media. Summarize the key point of the blog post in the tweet. Use emojis in a tasteful manner."
    )
    messages = [
        {"role": "system", "content": instructions},
        {"role": "user", "content": inputs["blog_intro"]},
    ]
    result = oai_client.responses.create(
        input=messages, model="gpt-5-nano"
    )
    return {"tweet": result.output_text}

# Define evaluators. In this case, we're using three evaluators: summary, formatting, and tone.
def summary(inputs: dict, outputs: dict) -> bool:
    """Judge whether the tweet is a good summary of the blog intro."""
    instructions = "Given the following text and summary, determine if the summary is a good summary of the text."

    class Response(BaseModel):
        summary: bool

    msg = f"Question: {inputs['blog_intro']}\nAnswer: {outputs['tweet']}"
    response = oai_client.responses.parse(
        model="gpt-5-nano",
        input=[{"role": "system", "content": instructions,}, {"role": "user", "content": msg}],
        text_format=Response
    )

    parsed_response = json.loads(response.output_text)
    return parsed_response["summary"]

def formatting(inputs: dict, outputs: dict) -> bool:
    """Judge whether the tweet is formatted for easy human readability."""
    instructions = "Given the following text, determine if it is formatted well so that a human can easily read it. Pay particular attention to spacing and punctuation."

    class Response(BaseModel):
        formatting: bool

    msg = f"{outputs['tweet']}"
    response = oai_client.responses.parse(
        model="gpt-5-nano",
        input=[{"role": "system", "content": instructions,}, {"role": "user", "content": msg}],
        text_format=Response
    )

    parsed_response = json.loads(response.output_text)
    return parsed_response["formatting"]

def tone(inputs: dict, outputs: dict) -> bool:
    """Judge whether the tweet's tone is informative, friendly, and engaging."""
    instructions = "Given the following text, determine if the tweet is informative, yet friendly and engaging."

    class Response(BaseModel):
        tone: bool

    msg = f"{outputs['tweet']}"
    response = oai_client.responses.parse(
        model="gpt-5-nano",
        input=[{"role": "system", "content": instructions,}, {"role": "user", "content": msg}],
        text_format=Response
    )
    parsed_response = json.loads(response.output_text)
    return parsed_response["tone"]

# Calling evaluate() with the dataset, target function, and evaluators.
results = client.evaluate(
    generate_tweet,
    data=dataset.name,
    evaluators=[summary, tone, formatting],
    experiment_prefix="gpt-5-nano",
)

# Get the experiment name to be used in client.get_experiment_results() in the next section
experiment_name = results.experiment_name
```

::::

### 2. 创建组合反馈

创建组合反馈，使用您的自定义函数聚合各个评估器分数。此示例使用各个评估器分数的加权平均值。

:::: details 创建组合反馈。

```python
from typing import Dict
import math
from langsmith import Client
from dotenv import load_dotenv

load_dotenv()

# TODO: Replace with your experiment name. Can be found in UI or from the above client.evaluate() result
YOUR_EXPERIMENT_NAME = "placeholder_experiment_name"

# Set weights for the individual evaluator scores
DEFAULT_WEIGHTS: Dict[str, float] = {
    "summary": 0.7,
    "tone": 0.2,
    "formatting": 0.1,
}
WEIGHTED_FEEDBACK_NAME = "weighted_summary"

# Pull experiment results
client = Client()
results = client.get_experiment_results(
    name=YOUR_EXPERIMENT_NAME,
)

# Calculate weighted score for each run
def calculate_weighted_score(feedback_stats: dict) -> float:
    if not feedback_stats:
        return float("nan")

    # Check if all required metrics are present and have data
    required_metrics = set(DEFAULT_WEIGHTS.keys())
    available_metrics = set(feedback_stats.keys())

    if not required_metrics.issubset(available_metrics):
        return float("nan")

    # Calculate weighted score
    total_score = 0.0
    for metric, weight in DEFAULT_WEIGHTS.items():
        metric_data = feedback_stats[metric]
        if metric_data.get("n", 0) > 0 and "avg" in metric_data:
            total_score += metric_data["avg"] * weight
        else:
            return float("nan")

    return total_score

# Process each run and write feedback
# Note that experiment results need to finish processing before this should be called.
for example_with_runs in results["examples_with_runs"]:
    for run in example_with_runs.runs:
        if run.feedback_stats:
            score = calculate_weighted_score(run.feedback_stats)
            if not math.isnan(score):
                client.create_feedback(
                    run_id=run.id,
                    key=WEIGHTED_FEEDBACK_NAME,
                    score=float(score)
                )
```

::::

