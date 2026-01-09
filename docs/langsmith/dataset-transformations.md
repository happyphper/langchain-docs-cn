---
title: 数据集转换
sidebarTitle: Dataset transformations
---
LangSmith 允许您在数据集模式中的字段上附加转换，这些转换会在数据添加到数据集之前应用于数据，无论数据是来自 UI、API 还是运行规则。

结合 [LangSmith 预构建的 JSON 模式类型](/langsmith/dataset-json-types)，这些功能使您能够在将数据保存到数据集之前轻松进行预处理。

## 转换类型

| 转换类型                     | 目标类型                                                                  | 功能说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `remove_system_messages`     | `Array[Message]`                                                           | 过滤消息列表，移除所有系统消息。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `convert_to_openai_message` | Message `Array[Message]`                                                   | 使用 langchain 的 [`convert_to_openai_messages`](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.convert_to_openai_messages.html) 将任何传入数据从 LangChain 的内部序列化格式转换为 OpenAI 的标准消息格式。如果目标字段标记为必需，并且在输入时未找到匹配的消息，它将尝试从几种常见的 LangSmith 追踪格式（例如，任何追踪的 LangChain <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel" target="_blank" rel="noreferrer" class="link"><code>BaseChatModel</code></a> 运行或来自 [LangSmith OpenAI 包装器](/langsmith/annotate-code#wrap-the-openai-client) 的追踪运行）中提取消息（或消息列表），并移除包含该消息的原始键。 |
| `convert_to_openai_tool`    | `Array[Tool]` 仅适用于 inputs 字典中的顶层字段。 | 使用 langchain 的 <a href="https://reference.langchain.com/python/langchain_core/utils/#langchain_core.utils.function_calling.convert_to_openai_tool" target="_blank" rel="noreferrer" class="link"><code>convert_to_openai_tool</code></a> 将任何传入数据转换为 OpenAI 标准工具格式。如果存在 / 在指定键处未找到工具，将从运行的调用参数中提取工具定义。这很有用，因为 LangChain 聊天模型将工具定义追踪到运行的 `extra.invocation_params` 字段，而不是 inputs。                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `remove_extra_fields`        | `Object`                                                                    | 移除此目标对象模式中未定义的任何字段。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## 聊天模型预构建模式

转换的主要用例是简化将生产追踪数据收集到数据集的过程，格式可以跨模型提供商标准化，以便在下游用于评估 / 少样本提示等。

为了简化最终用户的转换设置，LangSmith 提供了一个预定义模式，它将执行以下操作：

* 从您收集的运行中提取消息，并将其转换为 OpenAI 标准格式，这使得它们与所有 LangChain ChatModels 和大多数模型提供商的 SDK 兼容，以便进行下游评估和实验。
* 提取您的 LLM 使用的任何工具，并将其添加到示例的输入中，以便在下游评估中用于可复现性。

<Check>

希望迭代其系统提示的用户在使用我们的聊天模型模式时，通常还会在其输入消息上添加“移除系统消息”转换，这将防止您将系统提示保存到数据集中。

</Check>

### 兼容性

LLM 运行收集模式旨在收集来自 LangChain <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel" target="_blank" rel="noreferrer" class="link"><code>BaseChatModel</code></a> 运行或来自 [LangSmith OpenAI 包装器](/langsmith/annotate-code#wrap-the-openai-client) 的追踪运行的数据。

如果您追踪的 LLM 运行不兼容，请通过 [support.langchain.com](https://support.langchain.com) 联系支持人员，我们可以扩展支持。

如果您想对其他类型的运行应用转换（例如，用消息历史记录表示 LangGraph 状态），请直接定义您的模式并手动添加相关转换。

### 启用

当从追踪项目或标注队列向数据集添加运行时，如果它具有 LLM 运行类型，我们将默认应用聊天模型模式。

关于新数据集的启用，请参阅我们的 [数据集管理操作指南](/langsmith/manage-datasets-in-application)。

### 规范

有关预构建模式的完整 API 规范，请参阅以下部分：

#### 输入模式

```json
{
  "type": "object",
  "properties": {
    "messages": {
      "type": "array",
      "items": {
        "$ref": "https://api.smith.langchain.com/public/schemas/v1/message.json"
      }
    },
    "tools": {
      "type": "array",
      "items": {
        "$ref": "https://api.smith.langchain.com/public/schemas/v1/tooldef.json"
      }
    }
  },
  "required": ["messages"]
}
```

#### 输出模式

```json
{
  "type": "object",
  "properties": {
    "message": {
      "$ref": "https://api.smith.langchain.com/public/schemas/v1/message.json"
    }
  },
  "required": ["message"]
}
```

#### 转换

转换如下所示：

```json
[
  {
    "path": ["inputs"],
    "transformation_type": "remove_extra_fields"
  },
  {
    "path": ["inputs", "messages"],
    "transformation_type": "convert_to_openai_message"
  },
  {
    "path": ["inputs", "tools"],
    "transformation_type": "convert_to_openai_tool"
  },
  {
    "path": ["outputs"],
    "transformation_type": "remove_extra_fields"
  },
  {
    "path": ["outputs", "message"],
    "transformation_type": "convert_to_openai_message"
  }
]
```
