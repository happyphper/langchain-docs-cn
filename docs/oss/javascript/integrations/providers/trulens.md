---
title: TruLens
---
>[TruLens](https://trulens.org) 是一个[开源](https://github.com/truera/trulens)软件包，为基于大语言模型 (LLM) 的应用程序提供插装和评估工具。

本页介绍如何使用 [TruLens](https://trulens.org) 来评估和跟踪基于 LangChain 构建的 LLM 应用。

## 安装与设置

安装 `trulens-eval` Python 包。

::: code-group

```bash [pip]
pip install trulens-eval
```

```bash [uv]
uv add trulens-eval
```

:::

## 快速开始

集成细节请参阅 [TruLens 文档](https://www.trulens.org/trulens_eval/getting_started/quickstarts/langchain_quickstart/)。

### 跟踪

创建好你的 LLM 链后，就可以使用 TruLens 进行评估和跟踪。
TruLens 提供了许多[开箱即用的反馈函数](https://www.trulens.org/trulens_eval/evaluation/feedback_functions/)，同时也是一个可扩展的 LLM 评估框架。

创建反馈函数：

```python
from trulens_eval.feedback import Feedback, Huggingface,

# 初始化基于 HuggingFace 的反馈函数集合类：
hugs = Huggingface()
openai = OpenAI()

# 使用 HuggingFace 定义一个语言匹配反馈函数。
lang_match = Feedback(hugs.language_match).on_input_output()
# 默认情况下，这将检查主应用输入和主应用输出的语言匹配情况。

# 整体问题与答案之间的问答相关性。
qa_relevance = Feedback(openai.relevance).on_input_output()
# 默认情况下，这将在主应用输入和主应用输出上评估反馈。

# 输入的毒性
toxicity = Feedback(openai.toxicity).on_input()
```

### 链

为你的 LLM 设置好反馈函数后，你可以用 TruChain 包装你的应用程序，以获得详细的跟踪、日志记录和 LLM 应用评估。

注意：创建 `chain` 的代码请参见 [TruLens 文档](https://www.trulens.org/trulens_eval/getting_started/quickstarts/langchain_quickstart/)。

```python
from trulens_eval import TruChain

# 用 TruChain 包装你的链
truchain = TruChain(
    chain,
    app_id='Chain1_ChatApplication',
    feedbacks=[lang_match, qa_relevance, toxicity]
)
# 注意：此处指定的任何 `feedbacks` 都将在链被使用时进行评估和记录。
truchain("que hora es?")
```

### 评估

现在你可以探索你的基于 LLM 的应用程序了！

这样做可以帮助你一目了然地了解你的 LLM 应用的表现。当你迭代新版本的 LLM 应用时，你可以比较它们在所有已设置的不同质量指标上的表现。你还将能够在记录级别查看评估，并探索每条记录的链元数据。

```python
from trulens_eval import Tru

tru = Tru()
tru.run_dashboard() # 打开一个 Streamlit 应用进行探索
```

有关 TruLens 的更多信息，请访问 [trulens.org](https://www.trulens.org/)
