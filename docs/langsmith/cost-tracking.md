---
title: 成本追踪
sidebarTitle: 成本追踪
---

大规模构建智能体（agent）会带来基于使用量的、难以追踪的显著成本。LangSmith 会自动记录主要供应商的 LLM 令牌（token）使用量和成本，并允许您为任何其他组件提交自定义成本数据。

这为您提供了整个应用程序成本的单一统一视图，使您可以轻松监控、理解和调试您的支出。

本指南涵盖：
- [在 LangSmith UI 中查看成本](#viewing-costs-in-the-langsmith-ui)
- [成本追踪的工作原理](#cost-tracking)
- [如何发送自定义成本数据](#send-custom-cost-data)

## 在 LangSmith UI 中查看成本
在 [LangSmith UI](https://smith.langchain.com) 中，您可以通过三种主要方式探索使用量和支出：首先了解令牌和成本是如何分解的，然后在单个追踪（trace）中查看详细信息，最后在项目统计和仪表板中检查聚合指标。

### 令牌和成本分解

令牌使用量和成本被分解为三类：
- **输入（Input）**：发送给模型的提示词（prompt）中的令牌。子类型包括：缓存读取、文本令牌、图像令牌等。
- **输出（Output）**：模型响应中生成的令牌。子类型包括：推理（reasoning）令牌、文本令牌、图像令牌等。
- **其他（Other）**：来自工具调用、检索步骤或任何自定义运行（run）的成本。

您可以通过在 UI 中悬停在成本部分来查看详细分解。在可用情况下，每个部分会进一步按子类型分类。

<img src="/langsmith/images/cost-tooltip-light.png" alt="成本提示" />
<img src="/langsmith/images/cost-tooltip-dark.png" alt="成本提示" />

您可以在整个 LangSmith UI 中检查这些分解，详见下一节。

### 查看令牌和成本分解的位置

:::: details 在追踪树（trace tree）中

追踪树显示了单个追踪最详细的令牌使用量和成本视图。它显示整个追踪的总使用量、每个父级运行的聚合值以及每个子级运行的令牌和成本分解。

在追踪项目中打开任何运行以查看其追踪树。
<img src="/langsmith/images/trace-tree-costs-light.png" alt="成本提示" />
<img src="/langsmith/images/trace-tree-costs-dark.png" alt="成本提示" />

::::

:::: details 在项目统计中

项目统计面板显示项目中所有追踪的总令牌使用量和成本。
<img src="/langsmith/images/stats-pane-cost-tracking-light.png" alt="成本追踪图表" />
<img src="/langsmith/images/stats-pane-cost-tracking-dark.png" alt="成本追踪图表" />

::::

:::: details 在仪表板（dashboards）中

仪表板帮助您探索成本和令牌使用量随时间变化的趋势。追踪项目的[预构建仪表板](/langsmith/dashboards/#prebuilt-dashboards)显示总成本以及按输入和输出令牌分解的成本。

您也可以在[自定义仪表板](https://docs.langchain.com/langsmith/dashboards#custom-dashboards)中配置自定义成本跟踪图表。

<img src="/langsmith/images/cost-tracking-chart-light.png" alt="成本追踪图表" />
<img src="/langsmith/images/cost-tracking-chart-dark.png" alt="成本追踪图表" />

::::

## 成本追踪

您可以采用两种方式跟踪成本：

1. LLM 调用的成本可以**根据令牌计数和模型价格自动推算**。
2. LLM 调用或任何其他运行类型的成本可以**作为运行数据的一部分进行手动指定**。

您采用的方法取决于您跟踪的对象以及您的模型定价结构：

| 方法 | 运行类型：LLM | 运行类型：其他 |
|--------|---------------|-----------------|
| **自动** | <ul><li>使用 [LangChain](/oss/langchain/overview) 调用 LLM</li><li>使用 `@traceable` 追踪符合 OpenAI 格式的 OpenAI、Anthropic 或其他模型的 LLM 调用</li><li> 使用 LangSmith 包装器处理 [OpenAI](/langsmith/trace-openai) 或 [Anthropic](/langsmith/trace-anthropic)</li><li>对于其他模型供应商，请阅读 [令牌和成本信息指南](/langsmith/log-llm-trace#provide-token-and-cost-information)</li></ul> | 不适用。 |
| **手动** | 如果 LLM 调用成本是非线性的（例如遵循自定义成本函数） | 发送任何运行类型的成本，例如工具调用、检索步骤 |

### LLM 调用：根据令牌计数自动跟踪成本

要依据令牌使用量自动计算成本，您需要提供**令牌计数**、**模型和供应商**以及**模型价格**。

<Note>

如果您使用的模型供应商响应模式与 OpenAI 或 Anthropic 不同，请遵循以下说明。

<strong>仅当您没有</strong>执行以下操作时才需要这些步骤：
-  使用 [LangChain](/oss/langchain/overview) 调用 LLM
- 使用 `@traceable` 追踪遵循 OpenAI 格式的 OpenAI、Anthropic 或其他模型的 LLM 调用
- 使用 LangSmith 包装器处理 [OpenAI](/langsmith/trace-openai) 或 [Anthropic](/langsmith/trace-anthropic)。

</Note>

**1. 发送令牌计数**

许多模型在响应中包含令牌计数。您必须提取此信息，并使用以下方法之一将其包含在您的运行中：

在运行的元数据上设置 `usage_metadata` 字段。这种方法的优点是您不需要更改被追踪函数的运行时输出。

::: code-group

```python [Python]
from langsmith import traceable, get_current_run_tree

inputs = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "I'd like to book a table for two."},
]

@traceable(
    run_type="llm",
    metadata={"ls_provider": "my_provider", "ls_model_name": "my_model"}
)
def chat_model(messages: list):
    # 假设这是您应用程序预期的真实模型输出格式
    assistant_message = {
        "role": "assistant",
        "content": "Sure, what time would you like to book the table for?"
    }

    # 您计算或从提供商处收到的令牌使用量
    token_usage = {
        "input_tokens": 27,
        "output_tokens": 13,
        "total_tokens": 40,
        "input_token_details": {"cache_read": 10}
    }

    # 将令牌使用量附加到 LangSmith 运行
    run = get_current_run_tree()
    run.set(usage_metadata=token_usage)

    return assistant_message

chat_model(inputs)
```

```typescript [TypeScript]
import { traceable, getCurrentRunTree } from "langsmith/traceable";

const inputs = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "I'd like to book a table for two." },
];

const chatModel = traceable(
  async ({ messages }) => {
    // 您的应用程序预期的输出
    const assistantMessage = {
      role: "assistant",
      content: "Sure, what time would you like to book the table for?",
    };

    // 您计算或从提供商处收到的令牌使用量
    const tokenUsage = {
      input_tokens: 27,
      output_tokens: 13,
      total_tokens: 40,
      input_token_details: { cache_read: 10 },
    };

    // 将使用量附加到 LangSmith 运行
    const runTree = getCurrentRunTree();
    runTree.metadata.usage_metadata = tokenUsage;

    return assistantMessage;
  },
  {
    run_type: "llm",
    name: "chat_model",
    metadata: {
      ls_provider: "my_provider",
      ls_model_name: "my_model",
    },
  }
);

await chatModel({ messages: inputs });
```

:::

:::: details B. 在追踪函数的输出中返回 `usage_metadata` 字段

直接在追踪函数返回的对象中包含 `usage_metadata` 键。LangSmith 将从输出中提取它。

::: code-group

```python [Python]
from langsmith import traceable

inputs = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "I'd like to book a table for two."},
]
output = {
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "Sure, what time would you like to book the table for?"
            }
        }
    ],
    "usage_metadata": {
        "input_tokens": 27,
        "output_tokens": 13,
        "total_tokens": 40,
        "input_token_details": {"cache_read": 10}
    },
}

@traceable(
    run_type="llm",
    metadata={"ls_provider": "my_provider", "ls_model_name": "my_model"}
)
def chat_model(messages: list):
    return output

chat_model(inputs)
```

```typescript [TypeScript]
import { traceable } from "langsmith/traceable";

const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "I'd like to book a table for two." }
];
const output = {
    choices: [
        {
            message: {
                role: "assistant",
                content: "Sure, what time would you like to book the table for?",
            },
        },
    ],
    usage_metadata: {
        input_tokens: 27,
        output_tokens: 13,
        total_tokens: 40,
    },
};

const chatModel = traceable(
    async ({
        messages,
    }: {
        messages: { role: string; content: string }[];
        model: string;
    }) => {
        return output;
    },
    {
        run_type: "llm",
        name: "chat_model",
        metadata: {
            ls_provider: "my_provider",
            ls_model_name: "my_model"
        }
    }
);

await chatModel({ messages });
```

:::

::::

在任何一种情况下，使用量元数据都应包含以下 LangSmith 识别字段的子集：

:::: details 使用量元数据模式和成本计算

LangSmith 识别 `usage_metadata` 字典中的以下字段。您可以直接查看完整的 [Python 类型](https://github.com/langchain-ai/langsmith-sdk/blob/e705fbd362be69dd70229f94bc09651ef8056a61/python/langsmith/schemas.py#L1196-L1227) 或 [TypeScript 接口](https://github.com/langchain-ai/langsmith-sdk/blob/e705fbd362be69dd70229f94bc09651ef8056a61/js/src/schemas.ts#L637-L689)。

<ParamField path="input_tokens" type="number">

模型输入中使用的令牌数量。所有输入令牌类型的总和。

</ParamField>

<ParamField path="output_tokens" type="number">

模型响应中使用的令牌数量。所有输出令牌类型的总和。

</ParamField>

<ParamField path="total_tokens" type="number">

输入和输出中使用的令牌总数。可选，可以推断。input_tokens + output_tokens 的总和。

</ParamField>

<ParamField path="input_token_details" type="object">

输入令牌类型的详细 breakdown。键是令牌类型字符串，值是计数。例如 `{"cache_read": 5}`。

已知字段包括：`audio`, `text`, `image`, `cache_read`, `cache_creation`。根据模型或提供商的不同，可能会有其他字段。

</ParamField>

<ParamField path="output_token_details" type="object">

输出令牌类型的详细 breakdown。键是令牌类型字符串，值是计数。例如 `{"reasoning": 5}`。

已知字段包括：`audio`, `text`, `image`, `reasoning`。根据模型或提供商的不同，可能会有其他字段。

</ParamField>

<ParamField path="input_cost" type="number">

输入令牌的成本。

</ParamField>

<ParamField path="output_cost" type="number">

输出令牌的成本。

</ParamField>

<ParamField path="total_cost" type="number">

令牌的总成本。可选，可以推断。input_cost + output_cost 的总和。

</ParamField>

<ParamField path="input_cost_details" type="object">

输入成本的详细信息。键是令牌类型字符串，值是成本金额。

</ParamField>

<ParamField path="output_cost_details" type="object">

输出成本的详细信息。键是令牌类型字符串，值是成本金额。

</ParamField>

<strong>成本计算</strong>

运行成本是按令牌类型从具体到笼统贪婪计算的。假设您设置的价格为每 1M 输入令牌 2 美元，其中 `cache_read` 输入令牌的详细价格为每 1M 1 美元，输出令牌为每 1M 3 美元。如果您上传了以下使用量元数据：

```python
{
  "input_tokens": 20,
  "input_token_details": {"cache_read": 5},
  "output_tokens": 10,
  "total_tokens": 30,
}
```

那么，令牌成本将按如下方式计算：

```python
# 注意，LangSmith 首先计算 cache_read 成本，然后对任何
# 剩余的 input_tokens 应用默认的输入价格。
input_cost = 5 * 1e-6 + (20 - 5) * 2e-6  # 3.5e-5
output_cost = 10 * 3e-6  # 3e-5
total_cost = input_cost + output_cost  # 6.5e-5
```

::::

**2. 指定模型名称**

使用自定义模型时，需要在[运行的元数据](/langsmith/add-metadata-tags)中指定以下字段，以便将令牌计数与成本关联起来。提供这些元数据字段对于在查看追踪和过滤时识别模型也很有帮助。

- `ls_provider`：模型供应商，例如 “openai”, “anthropic”
- `ls_model_name`：模型名称，例如 “gpt-4o-mini”, “claude-3-opus-20240229”

**3. 设置模型价格**

模型定价表（pricing map）用于将模型名称映射到每令牌价格，从而根据令牌计数计算成本。为此使用 LangSmith 的[模型价格表](https://smith.langchain.com/settings/workspaces/models)。

<Note>

该表自带了大多数 OpenAI、Anthropic 和 Gemini 模型的价格信息。您可以[为其他模型添加价格](/langsmith/cost-tracking#create-a-new-model-price-entry)，或者在拥有自定义定价时[覆盖默认模型的价格](/langsmith/cost-tracking#update-an-existing-model-price-entry)。

</Note>

对于对不同令牌类型（例如多模态或缓存令牌）有不同定价的模型，您可以指定每种令牌类型的价格明细。悬停在输入/输出价格旁边的 `...` 上会显示按令牌类型分类的价格细节。

<img src="/langsmith/images/model-price-map-light.png" alt="模型价格表" />
<img src="/langsmith/images/model-price-map-dark.png" alt="模型价格表" />

<Note>

对模型价格表的更新不会反映在已经记录的追踪成本中。我们目前不支持回溯（backfilling）模型价格的更改。

</Note>

:::: details 创建新条目或修改现有模型价格条目

要修改默认模型价格，请创建一个具有与默认条目相同的模型、供应商和匹配模式的新条目。

要在模型价格表中创建*新条目*，请单击右上角的 `+ Model` 按钮。

<img src="/langsmith/images/new-price-map-entry-light.png" alt="新价格表条目界面" />
<img src="/langsmith/images/new-price-map-entry.png" alt="新价格表条目界面" />

在这里，您可以指定以下字段：

* <strong>模型名称 (Model Name)</strong>：模型的人类可读名称。
* <strong>输入价格 (Input Price)</strong>：模型每 100 万输入令牌的成本。该数字乘以提示中的令牌数以计算提示成本。
* <strong>输入价格明细 (Input Price Breakdown)</strong>（可选）：每种不同类型输入令牌的价格明细，例如 `cache_read`、`video`、`audio`。
* <strong>输出价格 (Output Price)</strong>：模型每 100 万输出令牌的成本。该数字乘以补全中的令牌数以计算补全成本。
* <strong>输出价格明细 (Output Price Breakdown)</strong>（可选）：每种不同类型输出令牌的价格明细，例如 `reasoning`、`image` 等。
* <strong>模型激活日期 (Model Activation Date)</strong>（可选）：价格适用的起始日期。只有该日期之后的运行才会应用此模型价格。
* <strong>匹配模式 (Match Pattern)</strong>：用于匹配模型名称的正则表达式。这用于匹配运行元数据中 `ls_model_name` 的值。
* <strong>供应商 (Provider)</strong>（可选）：模型供应商。如果指定，将与运行元数据中的 `ls_provider` 进行匹配。

一旦设置好模型价格表，LangSmith 将根据 LLM 调用中提供的令牌计数自动计算并聚合基于令牌的追踪成本。

::::

### LLM 调用：直接发送成本

如果您的模型遵循非线性定价方案，我们建议在客户端计算成本，并将它们作为 `usage_metadata` 发送给 LangSmith。

<Note>

Gemini 3 Pro Preview 和 Gemini 2.5 Pro 遵循具有阶跃式成本函数的定价方案。我们默认支持 Gemini 的这种定价方案。对于任何其他具有非线性定价的模型，您需要按照以下说明计算成本。

</Note>

::: code-group

```python [Python]
from langsmith import traceable, get_current_run_tree

inputs = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "I'd like to book a table for two."},
]

@traceable(
    run_type="llm",
    metadata={"ls_provider": "my_provider", "ls_model_name": "my_model"}
)
def chat_model(messages: list):
    llm_output = {
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": "Sure, what time would you like to book the table for?"
                }
            }
        ],
        "usage_metadata": {
            # 指定输入和输出的价格（以美元为单位）
            "input_cost": 1.1e-6,
            "input_cost_details": {"cache_read": 2.3e-7},
            "output_cost": 5.0e-6,
        },
    }
    run = get_current_run_tree()
    run.set(usage_metadata=llm_output["usage_metadata"])
    return llm_output["choices"][0]["message"]

chat_model(inputs)
```

```typescript [TypeScript]
import { traceable, getCurrentRunTree } from "langsmith/traceable";

const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "I'd like to book a table for two." }
];

const chatModel = traceable(
  async (messages: { role: string; content: string }[]) => {
    const llmOutput = {
      choices: [
        {
          message: {
            role: "assistant",
            content: "Sure, what time would you like to book the table for?",
          },
        },
      ],
      // 指定输入和输出的价格（以美元为单位）
      usage_metadata: {
        input_cost: 1.1e-6,
        input_cost_details: { cache_read: 2.3e-7 },
        output_cost: 5.0e-6,
      },
    };

    // 将使用量元数据附加到运行
    const runTree = getCurrentRunTree();
    runTree.metadata.usage_metadata = llmOutput.usage_metadata;

    // 仅返回助手消息
    return llmOutput.choices[0].message;
  },
  {
    run_type: "llm",
    name: "chat_model",
    metadata: {
      ls_provider: "my_provider",
      ls_model_name: "my_model",
    },
  }
);

await chatModel(messages);
```

:::

### 其他运行：发送成本

您也可以为任何非 LLM 运行发送成本信息，比如工具调用。成本必须在运行的 `usage_metadata` 下的 `total_cost` 字段中指定。

在运行的 `usage_metadata` 上设置 `total_cost` 字段。这种方法的优点是您不需要更改追踪函数的运行时输出。

::: code-group

```python [Python]
from langsmith import traceable, get_current_run_tree

# 示例工具：get_weather
@traceable(run_type="tool", name="get_weather")
def get_weather(city: str):
    # 您的工具逻辑
    result = {
        "temperature_f": 68,
        "condition": "sunny",
        "city": city,
    }

    # 此工具调用的成本（按您喜欢的方式计算）
    tool_cost = 0.0015

    # 将使用量元数据附加到 LangSmith 运行
    run = get_current_run_tree()
    run.set(usage_metadata={"total_cost": tool_cost})

    # 仅返回实际的工具结果（无使用信息）
    return result

tool_response = get_weather("San Francisco")
```

```typescript [TypeScript]
import { traceable, getCurrentRunTree } from "langsmith/traceable";

// 示例工具：get_weather
const getWeather = traceable(
  async ({ city }) => {
    // 您的工具逻辑
    const result = {
      temperature_f: 68,
      condition: "sunny",
      city,
    };

    // 此工具调用的成本（按您喜欢的方式计算）
    const toolCost = 0.0015;

    // 将使用量元数据附加到 LangSmith 运行
    const runTree = getCurrentRunTree();
    runTree.metadata.usage_metadata = {
      total_cost: toolCost,
    };

    // 仅返回实际的工具结果（无使用信息）
    return result;
  },
  {
    run_type: "tool",
    name: "get_weather",
  }
);

const toolResponse = await getWeather({ city: "San Francisco" });
```

:::

:::: details B. 在追踪函数的输出中返回 `total_cost` 字段

直接在追踪函数返回的对象中包含 `usage_metadata` 键。LangSmith 将从输出中提取它。

::: code-group

```python [Python]
from langsmith import traceable

# 示例工具：get_weather
@traceable(run_type="tool", name="get_weather")
def get_weather(city: str):
    # 您的工具逻辑
    result = {
        "temperature_f": 68,
        "condition": "sunny",
        "city": city,
    }

    # 在此处附加工具调用成本
    return {
        **result,
        "usage_metadata": {
            "total_cost": 0.0015,   # <-- 此工具调用的成本
        },
    }

tool_response = get_weather("San Francisco")
```

```typescript [TypeScript]
import { traceable } from "langsmith/traceable";

// 示例工具：get_weather
const getWeather = traceable(
  async ({ city }) => {
    // 您的工具逻辑
    const result = {
      temperature_f: 68,
      condition: "sunny",
      city,
    };

    // 在此处附加工具调用成本
    return {
      ...result,
      usage_metadata: {
        total_cost: 0.0015,  // <-- 此工具调用的成本
      },
    };
  },
  {
    run_type: "tool",
    name: "get_weather",
  }
);

const toolResponse = await getWeather({ city: "San Francisco" });
```

:::

::::

