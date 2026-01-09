---
title: 对新版本代理进行回测
sidebarTitle: Run backtests on a new version of an agent
---
部署应用程序只是持续改进过程的开始。将应用部署到生产环境后，您需要通过优化提示词、语言模型、工具和架构来完善系统。回测（Backtesting）涉及使用历史数据评估应用程序的新版本，并将新输出与原始输出进行比较。与使用预生产数据集进行评估相比，回测能更清晰地表明新版本应用程序是否比当前部署版本有所改进。

以下是回测的基本步骤：

1.  从您的生产追踪项目中选择一些运行样本进行测试。
2.  将运行输入转换为数据集，并将运行输出记录为该数据集的初始实验。
3.  在新数据集上执行您的新系统，并比较实验结果。

此过程将为您提供一个具有代表性的输入新数据集，您可以对其进行版本控制并用于模型回测。

<Info>

通常，您可能没有明确的"标准答案"（ground truth）。在这种情况下，您可以手动标注输出，或使用不依赖参考数据的评估器。如果您的应用程序允许捕获标准答案标签（例如允许用户提供反馈），我们强烈建议这样做。

</Info>

## 设置

### 配置环境

安装并设置环境变量。本指南要求 `langsmith>=0.2.4`。

<Info>

为方便起见，本教程将使用 LangChain OSS 框架，但展示的 LangSmith 功能是与框架无关的。

</Info>

::: code-group

```bash [pip]
pip install -U langsmith langchain langchain-anthropic langchainhub emoji
```

```bash [uv]
uv add langsmith langchain langchain-anthropic langchainhub emoji
```

:::

```python
import getpass
import os

# 将项目名称设置为您想要测试的项目
project_name = "Tweet Writing Task"
os.environ["LANGSMITH_PROJECT"] = project_name
os.environ["LANGSMITH_TRACING"] = "true"

if not os.environ.get("LANGSMITH_API_KEY"):
    os.environ["LANGSMITH_API_KEY"] = getpass.getpass("YOUR API KEY")

# 可选。您可以将 OpenAI 替换为任何其他支持工具调用的聊天模型。
os.environ["OPENAI_API_KEY"] = "YOUR OPENAI API KEY"

# 可选。如果愿意，您可以将 Tavily 替换为免费的 DuckDuckGo 搜索工具。
# 获取 Tavily API 密钥：https://tavily.com
os.environ["TAVILY_API_KEY"] = "YOUR TAVILY API KEY"
```

### 定义应用程序

对于此示例，让我们创建一个可以访问互联网搜索工具的简单推文写作应用程序：

```python
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain_community.tools import DuckDuckGoSearchRun, TavilySearchResults
from langchain_core.rate_limiters import InMemoryRateLimiter

# 我们将使用 GPT-3.5 Turbo 作为基线，并与 GPT-4o 进行比较
gpt_3_5_turbo = init_chat_model(
    "gpt-3.5-turbo",
    temperature=1,
    configurable_fields=("model", "model_provider"),
)

# 指令作为系统消息传递给代理
instructions = """You are a tweet writing assistant. Given a topic, do some research and write a relevant and engaging tweet about it.
- Use at least 3 emojis in each tweet
- The tweet should be no longer than 280 characters
- Always use the search tool to gather recent information on the tweet topic
- Write the tweet only based on the search content. Do not rely on your internal knowledge
- When relevant, link to your sources
- Make your tweet as engaging as possible"""

# 定义我们的代理可以使用的工具
# 如果您有更高级别的 Tavily API 计划，可以增加此值
rate_limiter = InMemoryRateLimiter(requests_per_second=0.08)

# 如果您没有 Tavily API 密钥，请使用 DuckDuckGo：
# tools = [DuckDuckGoSearchRun(rate_limiter=rate_limiter)]
tools = [TavilySearchResults(max_results=5, rate_limiter=rate_limiter)]

agent = create_agent(gpt_3_5_turbo, tools=tools, system_prompt=instructions)
```

### 模拟生产数据

现在让我们模拟一些生产数据：

```python
fake_production_inputs = [
    "Alan turing's early childhood",
    "Economic impacts of the European Union",
    "Underrated philosophers",
    "History of the Roxie theater in San Francisco",
    "ELI5: gravitational waves",
    "The arguments for and against a parliamentary system",
    "Pivotal moments in music history",
    "Big ideas in programming languages",
    "Big questions in biology",
    "The relationship between math and reality",
    "What makes someone funny",
]

agent.batch(
    [{"messages": [{"role": "user", "content": content}]} for content in fake_production_inputs],
)
```

## 将生产追踪转换为实验

第一步是基于生产*输入*生成一个数据集。然后复制所有追踪作为基线实验。

### 选择要回测的运行

您可以使用 `list_runs` 的 `filter` 参数来选择要回测的运行。`filter` 参数使用 LangSmith [追踪查询语法](/langsmith/trace-query-syntax) 来选择运行。

```python
from datetime import datetime, timedelta, timezone
from uuid import uuid4
from langsmith import Client
from langsmith.beta import convert_runs_to_test

# 获取我们想要转换为数据集/实验的运行
client = Client()

# 我们如何采样要包含在数据集中的运行
end_time = datetime.now(tz=timezone.utc)
start_time = end_time - timedelta(days=1)
run_filter = f'and(gt(start_time, "{start_time.isoformat()}"), lt(end_time, "{end_time.isoformat()}"))'
prod_runs = list(
    client.list_runs(
        project_name=project_name,
        is_root=True,
        filter=run_filter,
    )
)
```

### 将运行转换为实验

`convert_runs_to_test` 是一个函数，它接收一些运行并执行以下操作：

1.  输入（以及可选的输出）作为示例保存到数据集中。
2.  输入和输出存储为一个实验，就像您运行了 `evaluate` 函数并获得了这些输出一样。

```python
# 我们想要创建的数据集名称
dataset_name = f'{project_name}-backtesting {start_time.strftime("%Y-%m-%d")}-{end_time.strftime("%Y-%m-%d")}'
# 我们想要从历史运行中创建的实验名称
baseline_experiment_name = f"prod-baseline-gpt-3.5-turbo-{str(uuid4())[:4]}"

# 这将运行转换为数据集 + 实验
convert_runs_to_test(
    prod_runs,
    # 结果数据集的名称
    dataset_name=dataset_name,
    # 是否将运行输出作为参考/标准答案包含在内
    include_outputs=False,
    # 是否在结果实验中包含完整的追踪
    # （默认只包含根运行）
    load_child_runs=True,
    # 实验的名称，以便之后可以对其应用评估器
    test_project_name=baseline_experiment_name
)
```

此步骤完成后，您应该在 LangSmith 项目中看到一个名为 "Tweet Writing Task-backtesting TODAYS DATE" 的新数据集，其中包含一个实验，如下所示：

![基线实验](/langsmith/images/baseline-experiment.png)

## 对新系统进行基准测试

现在我们可以开始将生产运行与新系统进行基准测试的过程。

### 定义评估器

首先，让我们定义用于比较两个系统的评估器。请注意，我们没有参考输出，因此需要设计仅需要实际输出的评估指标。

```python
import emoji
from pydantic import BaseModel, Field
from langchain_core.messages import convert_to_openai_messages

class Grade(BaseModel):
    """评估响应是否得到某些上下文的支持。"""
    grounded: bool = Field(..., description="响应的大部分内容是否得到检索到的上下文支持？")

grounded_instructions = f"""You have given somebody some contextual information and asked them to write a statement grounded in that context.

Grade whether their response is fully supported by the context you have provided. \
If any meaningful part of their statement is not backed up directly by the context you provided, then their response is not grounded. \
Otherwise it is grounded."""
grounded_model = init_chat_model(model="gpt-4o").with_structured_output(Grade)

def lt_280_chars(outputs: dict) -> bool:
    messages = convert_to_openai_messages(outputs["messages"])
    return len(messages[-1]['content']) <= 280

def gte_3_emojis(outputs: dict) -> bool:
    messages = convert_to_openai_messages(outputs["messages"])
    return len(emoji.emoji_list(messages[-1]['content'])) >= 3

async def is_grounded(outputs: dict) -> bool:
    context = ""
    messages = convert_to_openai_messages(outputs["messages"])
    for message in messages:
        if message["role"] == "tool":
            # 工具消息输出是来自 Tavily/DuckDuckGo 工具返回的结果
            context += "\n\n" + message["content"]
    tweet = messages[-1]["content"]
    user = f"""CONTEXT PROVIDED:
    {context}

    RESPONSE GIVEN:
    {tweet}"""
    grade = await grounded_model.ainvoke([
        {"role": "system", "content": grounded_instructions},
        {"role": "user", "content": user}
    ])
    return grade.grounded
```

### 评估基线

现在，让我们针对基线实验运行我们的评估器。

```python
baseline_results = await client.aevaluate(
    baseline_experiment_name,
    evaluators=[lt_280_chars, gte_3_emojis, is_grounded],
)
# 如果安装了 pandas，可以轻松地将结果作为 DataFrame 查看：
# baseline_results.to_pandas()
```

### 定义并评估新系统

现在，让我们定义并评估我们的新系统。在这个例子中，我们的新系统将与旧系统相同，但将使用 GPT-4o 而不是 GPT-3.5。由于我们已经使模型可配置，我们只需更新传递给代理的默认配置：

```python
candidate_results = await client.aevaluate(
    agent.with_config(model="gpt-4o"),
    data=dataset_name,
    evaluators=[lt_280_chars, gte_3_emojis, is_grounded],
    experiment_prefix="candidate-gpt-4o",
)
# 如果安装了 pandas，可以轻松地将结果作为 DataFrame 查看：
# candidate_results.to_pandas()
```

## 比较结果

运行两个实验后，您可以在数据集中查看它们：

![数据集页面](/langsmith/images/dataset-page.png)

结果揭示了两个模型之间一个有趣的权衡：

1.  GPT-4o 在遵循格式规则方面表现更好，始终包含请求数量的表情符号。
2.  然而，GPT-4o 在严格基于提供的搜索结果方面可靠性较低。

为了说明这个"基于事实"的问题：在[这个示例运行](https://smith.langchain.com/public/be060e19-0bc0-4798-94f5-c3d35719a5f6/r/07d43e7a-8632-479d-ae28-c7eac6e54da4)中，GPT-4o 包含了关于 Abū Bakr Muhammad ibn Zakariyyā al-Rāzī 医学贡献的事实，而这些事实并未出现在搜索结果中。这表明它是在利用其内部知识，而不是严格使用提供的信息。

这次回测练习揭示出，虽然 GPT-4o 通常被认为是一个更强大的模型，但简单地升级到它并不会改善我们的推文写作器。为了有效使用 GPT-4o，我们需要：

*   优化我们的提示词，更加强调仅使用提供的信息。
*   或者修改我们的系统架构，以更好地约束模型的输出。

这个见解展示了回测的价值——它帮助我们在部署前识别了潜在问题。

![教程比较视图](/langsmith/images/tutorial-comparison-view.png)
