---
title: 记录 LLM 调用
sidebarTitle: Log LLM calls
---
本指南将介绍在使用自定义模型或自定义输入/输出格式时，如何将 LLM 调用记录到 LangSmith。为了充分利用 LangSmith 的 LLM 跟踪处理功能，您应该以指定的格式之一记录您的 LLM 跟踪。

LangSmith 为 LLM 跟踪提供以下优势：
- 消息列表的丰富、结构化渲染
- 每次 LLM 调用、每次跟踪以及跨时间跟踪的令牌和成本追踪

如果您没有以建议的格式记录 LLM 跟踪，您仍然可以将数据记录到 LangSmith，但它可能无法以预期的方式进行处理或渲染。

如果您使用 [LangChain OSS](https://python.langchain.com/docs/tutorials/llm_chain/) 来调用语言模型或 LangSmith 包装器（[OpenAI](/langsmith/trace-openai)、[Anthropic](/langsmith/trace-anthropic)），这些方法将自动以正确的格式记录跟踪。

<Note>

本页示例使用 `traceable` 装饰器/包装器来记录模型运行（这是 Python 和 JS/TS 的推荐方法）。但是，如果您直接使用 [RunTree](/langsmith/annotate-code#use-the-runtree-api) 或 [API](https://api.smith.langchain.com/redoc)，同样的思路也适用。

</Note>

## 消息格式

在跟踪自定义模型或自定义输入/输出格式时，它必须遵循 LangChain 格式、OpenAI 补全格式或 Anthropic 消息格式。更多详细信息，请参阅 [OpenAI Chat Completions](https://platform.openai.com/docs/api-reference/chat/create) 或 [Anthropic Messages](https://platform.claude.com/docs/en/api/messages) 文档。LangChain 格式如下：

<Expandable title="LangChain 格式">

<ParamField path="messages" type="array" required>

包含对话内容的消息列表。

<ParamField path="role" type="string" required>
标识消息类型。取值为：<code>system</code> | <code>reasoning</code> | <code>user</code> | <code>assistant</code> | <code>tool</code>

</ParamField>

<ParamField path="content" type="array" required>

消息内容。类型化字典的列表。

 <Expandable title="内容选项">
<ParamField path="type" type="string" required>
取值为：<code>text</code> | <code>image</code> | <code>file</code> | <code>audio</code> | <code>video</code> | <code>tool_call</code> | <code>server_tool_call</code> | <code>server_tool_result</code>。

</ParamField>

 <Expandable title="text">

<ParamField path="type" type="literal('text')" required />

<ParamField path="text" type="string" required>
文本内容。

</ParamField>

<ParamField path="annotations" type="object[]">

文本的注释列表

</ParamField>

<ParamField path="extras" type="object">

额外的提供商特定数据。

</ParamField>

</Expandable>

 
<Expandable title="reasoning">

<ParamField path="type" type="literal('reasoning')" required />

<ParamField path="text" type="string" required>
文本内容。

</ParamField>

<ParamField path="extras" type="object">

额外的提供商特定数据。

</ParamField>

</Expandable>

 
<Expandable title="image">

<ParamField path="type" type="literal('image')" required />

<ParamField path="url" type="string">
指向图像位置的 URL。

</ParamField>

<ParamField path="base64" type="string" required>

Base64 编码的图像数据。

</ParamField>

<ParamField path="id" type="string">

引用外部存储图像（例如，在提供商的文件系统或存储桶中）的引用 ID。

</ParamField>

<ParamField path="mime_type" type="string">

图像 [MIME 类型](https://www.iana.org/assignments/media-types/media-types.xhtml#image)（例如，`image/jpeg`、`image/png`）。

</ParamField>

</Expandable>

 
<Expandable title="file (例如，PDF)">

<ParamField path="type" type="literal('file')" required />

<ParamField path="url" type="string">
指向文件的 URL。

</ParamField>

<ParamField path="base64" type="string" required>

Base64 编码的文件数据。

</ParamField>

<ParamField path="id" type="string">

引用外部存储文件（例如，在提供商的文件系统或存储桶中）的引用 ID。

</ParamField>

<ParamField path="mime_type" type="string">

文件 [MIME 类型](https://www.iana.org/assignments/media-types/media-types.xhtml#image)（例如，`application/pdf`）。

</ParamField>

</Expandable>

 
<Expandable title="audio">

<ParamField path="type" type="literal('audio')" required />

<ParamField path="url" type="string">
指向音频文件的 URL。

</ParamField>

<ParamField path="base64" type="string" required>

Base64 编码的音频数据。

</ParamField>

<ParamField path="id" type="string">

引用外部存储音频文件（例如，在提供商的文件系统或存储桶中）的引用 ID。

</ParamField>

<ParamField path="mime_type" type="string">

音频 [MIME 类型](https://www.iana.org/assignments/media-types/media-types.xhtml#image)（例如，`audio/mpeg`、`audio/wav`）。

</ParamField>

</Expandable>

 
<Expandable title="video">

<ParamField path="type" type="literal('video')" required />

<ParamField path="url" type="string">
指向视频文件的 URL。

</ParamField>

<ParamField path="base64" type="string" required>

Base64 编码的视频数据。

</ParamField>

<ParamField path="id" type="string">

引用外部存储视频文件（例如，在提供商的文件系统或存储桶中）的引用 ID。

</ParamField>

<ParamField path="mime_type" type="string">

视频 [MIME 类型](https://www.iana.org/assignments/media-types/media-types.xhtml#image)（例如，`video/mp4`、`video/webm`）。

</ParamField>

</Expandable>

 
<Expandable title="tool_call">

<ParamField path="type" type="literal('tool_call')" required />

<ParamField path="name" type="string" />
<ParamField path="args" type="object" required>
传递给工具的参数。

</ParamField>

<ParamField path="id" type="string">

此工具调用的唯一标识符。

</ParamField>

</Expandable>

 
<Expandable title="server_tool_call">

<ParamField path="type" type="literal('server_tool_call')" required />

<ParamField path="id" type="string" required >
此工具调用的唯一标识符。

</ParamField>

<ParamField path="name" type="string" required>

要调用的工具名称。

</ParamField>

<ParamField path="args" type="object" required>

传递给工具的参数。

</ParamField>

</Expandable>

 
<Expandable title="server_tool_result">

<ParamField path="type" type="literal('server_tool_result')" required />

<ParamField path="tool_call_id" type="string" required>
对应服务器工具调用的标识符。

</ParamField>

<ParamField path="id" type="string">

此工具调用的唯一标识符。

</ParamField>

<ParamField path="status" type="string" required>

服务器端工具的执行状态。取值为：<code>success</code> | <code>error</code>。

</ParamField>

<ParamField path="output">

已执行工具的输出。

</ParamField>

</Expandable>

 </Expandable>

</ParamField>

<ParamField path="tool_call_id" type="string">

必须与先前 <code>assistant</code> 消息的 <code>tool_calls[i]</code> 条目的 <code>id</code> 匹配。仅在 <code>role</code> 为 <code>tool</code> 时有效。

</ParamField>

<ParamField path="usage_metadata" type="object">

使用此字段发送模型的令牌计数和/或成本。更多详细信息，请参阅[本指南](/langsmith/log-llm-trace#provide-token-and-cost-information)。

</ParamField>

</ParamField>

</Expandable>

### 示例

::: code-group

```python [文本和推理]
 inputs = {
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Hi, can you tell me the capital of France?"
        }
      ]
    }
  ]
}

outputs = {
  "messages": [
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "The capital of France is Paris."
        },
        {
          "type": "reasoning",
          "text": "The user is asking about..."
        }
      ]
    }
  ]
}
```

```python [工具调用]
input = {
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What's the weather in San Francisco?"
        }
      ]
    }
  ]
}

outputs = {
  "messages": [
    {
      "role": "assistant",
      "content": [{"type": "tool_call", "name": "get_weather", "args": {"city": "San Francisco"}, "id": "call_1"}],
    },
    {
      "role": "tool",
      "tool_call_id": "call_1",
      "content": [
        {
          "type": "text",
          "text": "{\"temperature\": \"18°C\", \"condition\": \"Sunny\"}"
        }
      ]
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "The weather in San Francisco is 18°C and sunny."
        }
      ]
    }
  ]
}
```

```python [多模态]
inputs = {
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What breed is this dog?"
        },
        {
          "type": "image",
          "url": "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
          # 除了 url，您也可以提供 base64 编码的图像
          # "base64": "<base64 encoded image>",
          "mime_type": "image/jpeg",
        }
      ]
    }
  ]
}

outputs = {
  "messages": [
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "This looks like a Black Labrador."
        }
      ]
    }
  ]
}
```

```python [服务器端工具调用]
input = {
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What is the price of AAPL?"
        }
      ]
    }
  ]
}

output = {
  "messages": [
    {
      "role": "assistant",
      "content": [
        {
          "type": "server_tool_call",
          "name": "web_search",
          "args": {
            "query": "price of AAPL",
            "type": "search"
          },
          "id": "call_1"
        },
        {
          "type": "server_tool_result",
          "tool_call_id": "call_1",
          "status": "success"
        },
        {
          "type": "text",
          "text": "The price of AAPL is $150.00"
        }
      ]
    }
  ]
}
```

:::

## 将自定义 I/O 格式转换为 LangSmith 兼容格式

如果您使用自定义输入或输出格式，可以使用 [`@traceable` 装饰器](https://docs.smith.langchain.com/reference/python/run_helpers/langsmith.run_helpers.traceable)（Python）或 [`traceable` 函数](https://docs.smith.langchain.com/reference/js/functions/traceable.traceable)（TS）上的 `process_inputs`/`processInputs` 和 `process_outputs`/`processOutputs` 函数将其转换为 LangSmith 兼容格式。

`process_inputs`/`processInputs` 和 `process_outputs`/`processOutputs` 接受允许您在特定跟踪记录到 LangSmith 之前转换其输入和输出的函数。它们可以访问跟踪的输入和输出，并可以返回包含处理后数据的新字典。

以下是如何使用 `process_inputs` 和 `process_outputs` 将自定义 I/O 格式转换为 LangSmith 兼容格式的模板示例：

<Expandable title="代码">

::: code-group

```python [Python]
class OriginalInputs(BaseModel):
    """您的应用程序的自定义请求形状"""

class OriginalOutputs(BaseModel):
    """您的应用程序的自定义响应形状。"""

class LangSmithInputs(BaseModel):
    """LangSmith 期望的输入格式。"""

class LangSmithOutputs(BaseModel):
    """LangSmith 期望的输出格式。"""

def process_inputs(inputs: dict) -> dict:
    """Dict -> OriginalInputs -> LangSmithInputs -> dict"""

def process_outputs(output: Any) -> dict:
    """OriginalOutputs -> LangSmithOutputs -> dict"""

@traceable(run_type="llm", process_inputs=process_inputs, process_outputs=process_outputs)
def chat_model(inputs: dict) -> dict:
    """
    您的应用程序的模型调用。保持您的自定义 I/O 形状。
    装饰器调用 process_* 来记录 LangSmith 兼容的格式。
    """
```

:::

</Expandable>

## 在跟踪中识别自定义模型

使用自定义模型时，建议同时提供以下 `metadata` 字段，以便在查看跟踪和筛选时识别模型。

* `ls_provider`：模型的提供商，例如 "openai"、"anthropic" 等。
* `ls_model_name`：模型的名称，例如 "gpt-4o-mini"、"claude-3-opus-20240229" 等。

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
    ]
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

// 也可以使用以下格式之一：
// const output = {
//     message: {
//         role: "assistant",
//         content: "Sure, what time would you like to book the table for?"
//     }
// };
//
// const output = {
//     role: "assistant",
//     content: "Sure, what time would you like to book the table for?"
// };
//
// const output = ["assistant", "Sure, what time would you like to book the table for?"];

const chatModel = traceable(
    async ({ messages }: { messages: { role: string; content: string }[] }) => {
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

此代码将记录以下跟踪：

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/chat-model-light.png" alt="LangSmith UI 显示一个名为 ChatOpenAI 的 LLM 调用跟踪，包含系统和人机输入，后跟 AI 输出。" />

<img src="/langsmith/images/chat-model-dark.png" alt="LangSmith UI 显示一个名为 ChatOpenAI 的 LLM 调用跟踪，包含系统和人机输入，后跟 AI 输出。" />

</div>

如果您实现了自定义的流式聊天模型，可以将输出“归约”为非流式版本的相同格式。目前仅 Python 支持此功能。

```python
def _reduce_chunks(chunks: list):
all_text = "".join([chunk["choices"][0]["message"]["content"] for chunk in chunks])
return {"choices": [{"message": {"content": all_text, "role": "assistant"}}]}

@traceable(
run_type="llm",
reduce_fn=_reduce_chunks,
metadata
