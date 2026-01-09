---
title: 如何评估可运行对象
sidebarTitle: Evaluate a runnable
---

<Info>

* `langchain`: [Python](https://python.langchain.com) 和 [JS/TS](https://js.langchain.com)
* Runnable: [Python](https://python.langchain.com/docs/concepts/runnables/) 和 [JS/TS](https://js.langchain.com/docs/concepts/runnables/)

</Info>

`langchain` 的 [Runnable](https://python.langchain.com/docs/concepts/runnables/) 对象（例如聊天模型、检索器、链等）可以直接传入 `evaluate()` / `aevaluate()` 方法。

## 设置

让我们定义一个简单的链来进行评估。首先，安装所有必需的包：

::: code-group

```bash [Python]
pip install -U langsmith langchain[openai]
```

```bash [TypeScript]
yarn add langsmith @langchain/openai
```

:::

现在定义一个链：

::: code-group

```python [Python]
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

instructions = (
    "请审查下面的用户查询，并判断其是否包含任何形式的毒性行为，例如侮辱、威胁或高度负面的评论。"
    "如果包含，请回复 'Toxic'；如果不包含，请回复 'Not toxic'。"
)

prompt = ChatPromptTemplate(
    [("system", instructions), ("user", "{text}")],
)

model = init_chat_model("gpt-4o")
chain = prompt | model | StrOutputParser()
```

```typescript [TypeScript]
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "请审查下面的用户查询，并判断其是否包含任何形式的毒性行为，例如侮辱、威胁或高度负面的评论。如果包含，请回复 'Toxic'；如果不包含，请回复 'Not toxic'。"],
  ["user", "{text}"]
]);

const chatModel = new ChatOpenAI();
const outputParser = new StringOutputParser();
const chain = prompt.pipe(chatModel).pipe(outputParser);
```

:::

## 评估

要评估我们的链，我们可以直接将其传递给 `evaluate()` / `aevaluate()` 方法。请注意，链的输入变量必须与示例输入的键匹配。在本例中，示例输入应具有 `{"text": "..."}` 的形式。

::: code-group

```python [Python]
from langsmith import aevaluate, Client

client = Client()

# 克隆一个带有毒性标签的文本数据集。
# 每个示例输入都有一个 "text" 键，每个输出都有一个 "label" 键。
dataset = client.clone_public_dataset(
    "https://smith.langchain.com/public/3d6831e6-1680-4c88-94df-618c8e01fc55/d"
)

def correct(outputs: dict, reference_outputs: dict) -> bool:
    # 由于我们的链输出的是字符串而不是字典，这个字符串
    # 会被存储在 outputs 字典的默认 "output" 键下：
    actual = outputs["output"]
    expected = reference_outputs["label"]
    return actual == expected

results = await aevaluate(
    chain,
    data=dataset,
    evaluators=[correct],
    experiment_prefix="gpt-4o, baseline",
)
```

```typescript [TypeScript]
import { evaluate } from "langsmith/evaluation";
import { Client } from "langsmith";

const langsmith = new Client();

const dataset = await client.clonePublicDataset(
  "https://smith.langchain.com/public/3d6831e6-1680-4c88-94df-618c8e01fc55/d"
)

await evaluate(chain, {
  data: dataset.name,
  evaluators: [correct],
  experimentPrefix: "gpt-4o, baseline",
});
```

:::

每个输出都会为 Runnable 进行适当的追踪。

![Runnable 评估](/langsmith/images/runnable-eval.png)

## 相关

* [如何评估 `langgraph` 图](/langsmith/evaluate-on-intermediate-steps)
