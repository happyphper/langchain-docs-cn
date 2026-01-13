---
title: 模型
---


[大语言模型（LLMs）](https://en.wikipedia.org/wiki/Large_language_model)是强大的人工智能工具，能够像人类一样理解和生成文本。它们功能多样，足以编写内容、翻译语言、总结信息以及回答问题，而无需为每项任务进行专门训练。

除了文本生成，许多模型还支持：

* <Icon icon="hammer" :size="16" /> [工具调用](#tool-calling) - 调用外部工具（如数据库查询或 API 调用）并在其响应中使用结果。
* <Icon icon="shapes" :size="16" /> [结构化输出](#structured-output) - 模型的响应被约束为遵循定义的格式。
* <Icon icon="image" :size="16" /> [多模态](#multimodal) - 处理和返回文本以外的数据，如图像、音频和视频。
* <Icon icon="brain" :size="16" /> [推理](#reasoning) - 模型执行多步推理以得出结论。

模型是[智能体](/oss/python/langchain/agents)的推理引擎。它们驱动智能体的决策过程，决定调用哪些工具、如何解释结果以及何时提供最终答案。

您选择的模型的质量和能力直接影响智能体的基线可靠性和性能。不同的模型擅长不同的任务——有些更擅长遵循复杂指令，有些在结构化推理方面更出色，还有一些支持更大的上下文窗口以处理更多信息。

LangChain 的标准模型接口让您可以访问许多不同的提供商集成，这使得您可以轻松地试验和切换模型，以找到最适合您用例的模型。

<Info>

有关特定于提供商的集成信息和功能，请参阅提供商的[聊天模型页面](/oss/python/integrations/chat)。

</Info>

## 基本用法

模型可以通过两种方式使用：

1.  **与智能体一起使用** - 在创建[智能体](/oss/python/langchain/agents#model)时可以动态指定模型。
2.  **独立使用** - 模型可以直接调用（在智能体循环之外），用于文本生成、分类或提取等任务，而无需智能体框架。

相同的模型接口在这两种情况下都适用，这为您提供了灵活性，可以从简单开始，并根据需要扩展到更复杂的基于智能体的工作流。

### 初始化模型

在 LangChain 中开始使用独立模型的最简单方法是使用 <a href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model" target="_blank" rel="noreferrer" class="link"><code>init_chat_model</code></a> 从您选择的聊天模型提供商初始化一个模型（示例如下）：

<!--@include: @/snippets/python/chat-model-tabs.md-->

```python
response = model.invoke("为什么鹦鹉会说话？")
```

有关更多详细信息，包括如何传递模型[参数](#parameters)的信息，请参阅 <a href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model" target="_blank" rel="noreferrer" class="link"><code>init_chat_model</code></a>。

### 支持的模型

LangChain 支持所有主要的模型提供商，包括 OpenAI、Anthropic、Google、Azure、AWS Bedrock 等。每个提供商都提供具有不同功能的各种模型。有关 LangChain 中支持模型的完整列表，请参阅[集成页面](/oss/python/integrations/providers/overview)。

### 关键方法

<Card title="Invoke" href="#invoke" icon="paper-plane" arrow="true" horizontal>

模型接收消息作为输入，并在生成完整响应后输出消息。

</Card>

<Card title="Stream" href="#stream" icon="tower-broadcast" arrow="true" horizontal>

调用模型，但实时流式传输生成的输出。

</Card>

<Card title="Batch" href="#batch" icon="grip" arrow="true" horizontal>

批量向模型发送多个请求，以提高处理效率。

</Card>

<Info>

除了聊天模型，LangChain 还支持其他相关技术，例如嵌入模型和向量存储。详情请参阅[集成页面](/oss/python/integrations/providers/overview)。

</Info>

## 参数

聊天模型接受可用于配置其行为的参数。支持的完整参数集因模型和提供商而异，但标准参数包括：

<ParamField body="model" type="string" required>

您希望与提供商一起使用的特定模型的名称或标识符。您也可以使用 '{model_provider}:{model}' 格式在单个参数中同时指定模型及其提供商，例如 'openai:o1'。

</ParamField>

<ParamField body="api_key" type="string">

用于向模型提供商进行身份验证所需的密钥。这通常在您注册访问模型时颁发。通常通过设置<Tooltip tip="一个其值在程序外部设置的变量，通常通过操作系统或微服务的内置功能实现。">环境变量</Tooltip>来访问。

</ParamField>

<ParamField body="temperature" type="number">

控制模型输出的随机性。数值越高，响应越有创意；数值越低，响应越确定。

</ParamField>

<ParamField body="max_tokens" type="number">

限制响应中的<Tooltip tip="模型读取和生成的基本单位。提供商可能以不同方式定义它们，但通常它们可以表示一个完整的词或词的一部分。">令牌</Tooltip>总数，有效控制输出的长度。

</ParamField>

<ParamField body="timeout" type="number">

在取消请求之前等待模型响应的最长时间（以秒为单位）。

</ParamField>

<ParamField body="max_retries" type="number">

如果请求因网络超时或速率限制等问题而失败，系统将尝试重新发送请求的最大次数。

</ParamField>

使用 <a href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model" target="_blank" rel="noreferrer" class="link"><code>init_chat_model</code></a> 时，将这些参数作为内联的<Tooltip tip="任意关键字参数" cta="了解更多" href="https://www.w3schools.com/python/python_args_kwargs.asp">`**kwargs`</Tooltip>传递：

```python [Initialize using model parameters]
model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    # Kwargs passed to the model:
    temperature=0.7,
    timeout=30,
    max_tokens=1000,
)
```

<Info>

每个聊天模型集成可能具有用于控制特定于提供商功能的额外参数。

例如，<a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 具有 `use_responses_api` 参数，用于指示是使用 OpenAI Responses API 还是 Completions API。

要查找给定聊天模型支持的所有参数，请前往[聊天模型集成](/oss/python/integrations/chat)页面。

</Info>

---

## 调用

必须调用聊天模型才能生成输出。有三种主要的调用方法，每种适用于不同的用例。

### Invoke

调用模型最直接的方法是使用 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.invoke" target="_blank" rel="noreferrer" class="link"><code>invoke()</code></a> 并传入单个消息或消息列表。

```python [单条消息]
response = model.invoke("为什么鹦鹉有彩色的羽毛？")
print(response)
```

可以向聊天模型提供消息列表以表示对话历史记录。每条消息都有一个角色，模型使用该角色来指示对话中是谁发送了消息。

有关角色、类型和内容的更多详细信息，请参阅[消息](/oss/python/langchain/messages)指南。

```python [字典格式]
conversation = [
    {"role": "system", "content": "你是一个得力的助手，负责将英文翻译成中文。"},
    {"role": "user", "content": "翻译：I love programming."},
    {"role": "assistant", "content": "我热爱编程。"},
    {"role": "user", "content": "翻译：I love building applications."}
]

response = model.invoke(conversation)
print(response)  # AIMessage("我热爱构建应用程序。")
```

```python [消息对象]
from langchain.messages import HumanMessage, AIMessage, SystemMessage

conversation = [
    SystemMessage("你是一个得力的助手，负责将英文翻译成中文。"),
    HumanMessage("翻译：I love programming."),
    AIMessage("我热爱编程。"),
    HumanMessage("翻译：I love building applications.")
]

response = model.invoke(conversation)
print(response)  # AIMessage("我热爱构建应用程序。")
```

<Info>

如果您的调用返回类型是字符串，请确保您使用的是聊天模型，而不是 LLM。传统的文本补全 LLM 直接返回字符串。LangChain 的聊天模型以 "Chat" 为前缀，例如 <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a>(/oss/integrations/chat/openai)。

</Info>

### Stream

大多数模型可以在生成输出内容时进行流式传输。通过逐步显示输出，流式传输显著改善了用户体验，特别是对于较长的响应。

调用 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.stream" target="_blank" rel="noreferrer" class="link"><code>stream()</code></a> 会返回一个<Tooltip tip="一个逐步提供对集合中每个项目访问的对象，按顺序进行。">迭代器</Tooltip>，该迭代器在生成时产生输出块。您可以使用循环实时处理每个块：

::: code-group

```python [基础文本流]
for chunk in model.stream("为什么鹦鹉有彩色的羽毛？"):
    print(chunk.text, end="|", flush=True)
```

```python [流式传输工具调用、推理及其他内容]
for chunk in model.stream("天空是什么颜色的？"):
    for block in chunk.content_blocks:
        if block["type"] == "reasoning" and (reasoning := block.get("reasoning")):
            print(f"推理：{reasoning}")
        elif block["type"] == "tool_call_chunk":
            print(f"工具调用块：{block}")
        elif block["type"] == "text":
            print(block["text"])
        else:
            ...
```

:::

与返回单个 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a>（在模型完成生成其完整响应后）的 [`invoke()`](#invoke) 不同，`stream()` 返回多个 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessageChunk" target="_blank" rel="noreferrer" class="link"><code>AIMessageChunk</code></a> 对象，每个对象包含输出文本的一部分。重要的是，流中的每个块都设计为可以通过求和聚合成完整的消息：

```python [构建 AIMessage]
full = None  # None | AIMessageChunk
for chunk in model.stream("天空是什么颜色的？"):
    full = chunk if full is None else full + chunk
    print(full.text)

# 天
# 天空
# 天空是
# 天空通常
# 天空通常是蓝色
# ...

print(full.content_blocks)
# [{"type": "text", "text": "天空通常是蓝色的..."}]
```

生成的消息可以像使用 [`invoke()`](#invoke) 生成的消息一样处理——例如，它可以聚合到消息历史记录中，并作为对话上下文传递回模型。

<Warning>

只有当程序中的所有步骤都知道如何处理块流时，流式传输才能正常工作。例如，一个不具备流式处理能力的应用程序需要在处理之前将整个输出存储在内存中。

</Warning>

:::: details 高级流式传输主题

::: details 流式传输事件

LangChain 聊天模型也可以使用 `astream_events()` 流式传输语义事件。

这简化了基于事件类型和其他元数据的过滤，并将在后台聚合完整的消息。请参阅下面的示例。

```python
async for event in model.astream_events("你好"):

    if event["event"] == "on_chat_model_start":
        print(f"输入：{event['data']['input']}")

    elif event["event"] == "on_chat_model_stream":
        print(f"令牌：{event['data']['chunk'].text}")

    elif event["event"] == "on_chat_model_end":
        print(f"全文：{event['data']['output'].text}")
```

```txt
输入：你好
令牌：你
令牌：好
令牌：！
全文：你好！今天有什么我可以帮你的吗？
```

<Tip>

有关事件类型和其他详细信息，请参阅 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.astream_events" target="_blank" rel="noreferrer" class="link"><code>astream_events()</code></a> 参考。

</Tip>

:::

::: details "自动流式传输"聊天模型

LangChain 通过在某些情况下自动启用流式传输模式来简化从聊天模型的流式传输，即使您没有显式调用流式传输方法。当您使用非流式调用的 invoke 方法但仍希望流式传输整个应用程序（包括来自聊天模型的中间结果）时，这特别有用。

例如，在 [LangGraph 智能体](/oss/python/langchain/agents)中，您可以在节点内调用 `model.invoke()`，但如果以流式模式运行，LangChain 将自动委托给流式传输。

#### 工作原理

当您 `invoke()` 一个聊天模型时，如果 LangChain 检测到您正尝试流式传输整个应用程序，它将自动切换到内部流式传输模式。就使用 invoke 的代码而言，调用的结果将是相同的；然而，在聊天模型被流式传输时，LangChain 将负责在 LangChain 的回调系统中调用 <a href="https://reference.langchain.com/python/langchain_core/callbacks/#langchain_core.callbacks.base.AsyncCallbackHandler.on_llm_new_token" target="_blank" rel="noreferrer" class="link"><code>on_llm_new_token</code></a> 事件。

回调事件允许 LangGraph 的 `stream()` 和 `astream_events()` 实时呈现聊天模型的输出。

:::

::::

### Batch

将一组独立的请求批量发送到模型可以显著提高性能并降低成本，因为处理可以并行完成：

```python [批量处理]
responses = model.batch([
    "为什么鹦鹉有彩色的羽毛？",
    "飞机是怎么飞的？",
    "什么是量子计算？"
])
for response in responses:
    print(response)
```

<Note>

本节描述了聊天模型方法 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch" target="_blank" rel="noreferrer" class="link"><code>batch()</code></a>，它在客户端并行化模型调用。

它<strong>不同于</strong>推理提供商支持的批量 API，例如 [OpenAI](https://platform.openai.com/docs/guides/batch) 或 [Anthropic](https://platform.claude.com/docs/en/build-with-claude/batch-processing#message-batches-api)。

</Note>

默认情况下，<a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch" target="_blank" rel="noreferrer" class="link"><code>batch()</code></a> 将仅返回整个批次的最终输出。如果您希望在每个单独输入完成生成时接收其输出，可以使用 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch_as_completed" target="_blank" rel="noreferrer" class="link"><code>batch_as_completed()</code></a> 流式传输结果：

```python [在完成后生成批量响应]
for response in model.batch_as_completed([
    "为什么鹦鹉有彩色的羽毛？",
    "飞机是怎么飞的？",
    "什么是量子计算？"
]):
    print(response)
```

<Note>

使用 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch_as_completed" target="_blank" rel="noreferrer" class="link"><code>batch_as_completed()</code></a> 时，结果可能不按顺序到达。每个结果都包含输入索引，以便在需要时匹配以重建原始顺序。

</Note>

<Tip>

当使用 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch" target="_blank" rel="noreferrer" class="link"><code>batch()</code></a> 或 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch_as_completed" target="_blank" rel="noreferrer" class="link"><code>batch_as_completed()</code></a> 处理大量输入时，您可能希望控制最大并行调用数。这可以通过在 <a href="https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig" target="_blank" rel="noreferrer" class="link"><code>RunnableConfig</code></a> 字典中设置 <a href="https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig.max_concurrency" target="_blank" rel="noreferrer" class="link"><code>max_concurrency</code></a> 属性来实现。

```python [Batch with max concurrency]
model.batch(
    list_of_inputs,
    config={
        'max_concurrency': 5,  # Limit to 5 parallel calls
    }
)
```

有关支持的属性的完整列表，请参阅 <a href="https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig" target="_blank" rel="noreferrer" class="link"><code>RunnableConfig</code></a> 参考。

</Tip>

有关批处理的更多详细信息，请参阅 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch" target="_blank" rel="noreferrer" class="link">参考</a>。

---

## 工具调用

模型可以请求调用工具来执行任务，例如从数据库获取数据、搜索网络或运行代码。工具由以下两部分组成：

1. 一个模式，包括工具名称、描述和/或参数定义（通常是 JSON 模式）
2. 一个用于执行的函数或 <Tooltip tip="一种可以暂停执行并在稍后恢复的方法">协程</Tooltip>。

<Note>

您可能会听到“函数调用”这个术语。我们将其与“工具调用”互换使用。

</Note>

以下是用户和模型之间基本的工具调用流程：

```mermaid
sequenceDiagram
    participant U as User
    participant M as Model
    participant T as Tools

    U->>M: "北京和上海的天气怎么样？"
    M->>M: 分析请求并决定所需的工具

    par 并行工具调用 (Parallel Tool Calls)
        M->>T: get_weather("北京")
        M->>T: get_weather("上海")
    end

    par 工具执行 (Tool Execution)
        T-->>M: 北京天气数据
        T-->>M: 上海天气数据
    end

    M->>M: 处理结果并生成响应
    M->>U: "北京：72°F 晴，上海：68°F 多云"
```

要使您定义的模型能够使用工具，必须使用 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.bind_tools" target="_blank" rel="noreferrer" class="link"><code>bind_tools</code></a> 绑定它们。在后续调用中，模型可以根据需要选择调用任何已绑定的工具。

一些模型提供商提供 <Tooltip tip="在服务器端执行的工具，例如网络搜索和代码解释器">内置工具</Tooltip>，可以通过模型或调用参数启用（例如 [`ChatOpenAI`](/oss/python/integrations/chat/openai)、[`ChatAnthropic`](/oss/python/integrations/chat/anthropic)）。详情请查看相应的 [提供商参考文档](/oss/python/integrations/providers/overview)。

<Tip>

有关创建工具的详细信息和其他选项，请参阅 [工具指南](/oss/python/langchain/tools)。

</Tip>

```python [Binding user tools]
from langchain.tools import tool

@tool
def get_weather(location: str) -> str:
    """获取指定位置的天气。"""
    return f"{location} 的天气晴朗。"

model_with_tools = model.bind_tools([get_weather])  # [!code highlight]

response = model_with_tools.invoke("北京的天气怎么样？")
for tool_call in response.tool_calls:
    # 查看模型发出的工具调用
    print(f"工具：{tool_call['name']}")
    print(f"参数：{tool_call['args']}")
```

绑定用户定义的工具时，模型的响应会包含执行工具的**请求**。当将模型与 [智能体](/oss/python/langchain/agents) 分开使用时，需要您自己执行请求的工具，并将结果返回给模型以供后续推理使用。当使用 [智能体](/oss/python/langchain/agents) 时，智能体循环将为您处理工具执行循环。

下面，我们展示一些使用工具调用的常见方式。

:::: details <Icon icon="arrow-rotate-right" style="margin-right: 8px; vertical-align: middle;" /> 工具执行循环

当模型返回工具调用时，您需要执行这些工具并将结果传回给模型。这就创建了一个对话循环，模型可以利用工具结果生成最终响应。LangChain 包含 [智能体](/oss/python/langchain/agents) 抽象，可为您处理这种编排。

以下是一个简单的示例：

```python [Tool execution loop]
# Bind (potentially multiple) tools to the model
model_with_tools = model.bind_tools([get_weather])

# 步骤 1：模型生成工具调用
messages = [{"role": "user", "content": "北京的天气怎么样？"}]
ai_msg = model_with_tools.invoke(messages)
messages.append(ai_msg)

# 步骤 2：执行工具并收集结果
for tool_call in ai_msg.tool_calls:
    # 使用生成的参数执行工具
    tool_result = get_weather.invoke(tool_call)
    messages.append(tool_result)

# 步骤 3：将结果传回模型以获取最终响应
final_response = model_with_tools.invoke(messages)
print(final_response.text)
# "北京当前的天气是 72°F，晴。"
```

工具返回的每个 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a> 都包含一个与原始工具调用匹配的 `tool_call_id`，帮助模型将结果与请求关联起来。

::::

:::: details <Icon icon="asterisk" style="margin-right: 8px; vertical-align: middle;" /> 强制工具调用

默认情况下，模型可以根据用户输入自由选择使用哪个绑定的工具。但是，您可能希望强制选择工具，确保模型使用特定工具或给定列表中的<strong>任何</strong>工具：

::: code-group

```python [Force use of any tool]
model_with_tools = model.bind_tools([tool_1], tool_choice="any")
```

```python [Force use of specific tools]
model_with_tools = model.bind_tools([tool_1], tool_choice="tool_1")
```

:::

::::

:::: details <Icon icon="layer-group" style="margin-right: 8px; vertical-align: middle;" /> 并行工具调用

许多模型在适当情况下支持并行调用多个工具。这使得模型可以同时从不同来源收集信息。

```python [Parallel tool calls]
model_with_tools = model.bind_tools([get_weather])

response = model_with_tools.invoke(
    "北京和上海的天气怎么样？"
)

# 模型可能会生成多个工具调用
print(response.tool_calls)
# [
#   {'name': 'get_weather', 'args': {'location': '北京'}, 'id': 'call_1'},
#   {'name': 'get_weather', 'args': {'location': '上海'}, 'id': 'call_2'},
# ]

# Execute all tools (can be done in parallel with async)
results = []
for tool_call in response.tool_calls:
    if tool_call['name'] == 'get_weather':
        result = get_weather.invoke(tool_call)
    ...
    results.append(result)
```

模型会根据请求操作的独立性智能地判断何时适合并行执行。

<Tip>

大多数支持工具调用的模型默认启用并行工具调用。一些模型（包括 [OpenAI](/oss/python/integrations/chat/openai) 和 [Anthropic](/oss/python/integrations/chat/anthropic)）允许您禁用此功能。为此，请设置 `parallel_tool_calls=False`：

```python
model.bind_tools([get_weather], parallel_tool_calls=False)
```

</Tip>

::::

:::: details <Icon icon="rss" style="margin-right: 8px; vertical-align: middle;" /> 流式工具调用

在流式传输响应时，工具调用通过 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolCallChunk" target="_blank" rel="noreferrer" class="link"><code>ToolCallChunk</code></a> 逐步构建。这允许您在工具调用生成时就看到它们，而无需等待完整响应。

```python [Streaming tool calls]
for chunk in model_with_tools.stream(
    "北京和上海的天气怎么样？"
):
    # 工具调用块逐步到达
    for tool_chunk in chunk.tool_call_chunks:
        if name := tool_chunk.get("name"):
            print(f"工具：{name}")
        if id_ := tool_chunk.get("id"):
            print(f"ID: {id_}")
        if args := tool_chunk.get("args"):
            print(f"参数：{args}")

# 输出：
# 工具：get_weather
# ID: call_SvMlU1TVIZugrFLckFE2ceRE
# 参数：{"lo
# 参数：catio
# 参数：n": "北
# 参数：京"}
# 工具：get_weather
# ID: call_QMZdy6qInx13oWKE7KhuhOLR
# 参数：{"lo
# 参数：catio
# 参数：n": "上
# 参数：海"}
```

您可以累积块来构建完整的工具调用：

```python [Accumulate tool calls]
gathered = None
for chunk in model_with_tools.stream("北京的天气怎么样？"):
    gathered = chunk if gathered is None else gathered + chunk
    print(gathered.tool_calls)
```

::::

---

## 结构化输出

可以要求模型以符合给定模式的格式提供响应。这对于确保输出易于解析并在后续处理中使用非常有用。LangChain 支持多种模式类型和强制执行结构化输出的方法。

<Tip>

要了解结构化输出，请参阅 [结构化输出](/oss/python/langchain/structured-output)。

</Tip>

<Tabs>

<Tab title="Pydantic">

[Pydantic 模型](https://docs.pydantic.dev/latest/concepts/models/#basic-model-usage) 提供了最丰富的功能集，包括字段验证、描述和嵌套结构。

```python
from pydantic import BaseModel, Field

class Movie(BaseModel):
    """包含详情的电影。"""
    title: str = Field(..., description="电影标题")
    year: int = Field(..., description="发行年份")
    director: str = Field(..., description="导演")
    rating: float = Field(..., description="满分为 10 分的评分")

model_with_structure = model.with_structured_output(Movie)
response = model_with_structure.invoke("提供电影《盗梦空间》的详情")
print(response)  # Movie(title="Inception", year=2010, director="Christopher Nolan", rating=8.8)
```

</Tab>

<Tab title="TypedDict">

Python 的 `TypedDict` 提供了比 Pydantic 模型更简单的替代方案，适用于不需要运行时验证的场景。

```python
from typing_extensions import TypedDict, Annotated

class MovieDict(TypedDict):
    """包含详情的电影。"""
    title: Annotated[str, ..., "电影标题"]
    year: Annotated[int, ..., "发行年份"]
    director: Annotated[str, ..., "导演"]
    rating: Annotated[float, ..., "满分为 10 分的评分"]

model_with_structure = model.with_structured_output(MovieDict)
response = model_with_structure.invoke("提供电影《盗梦空间》的详情")
print(response)  # {'title': 'Inception', 'year': 2010, 'director': 'Christopher Nolan', 'rating': 8.8}
```

</Tab>

<Tab title="JSON 模式">

提供 [JSON 模式](https://json-schema.org/understanding-json-schema/about) 以实现最大程度的控制和互操作性。

```python
import json

json_schema = {
    "title": "Movie",
    "description": "包含详情的电影",
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": "电影标题"
        },
        "year": {
            "type": "integer",
            "description": "发行年份"
        },
        "director": {
            "type": "string",
            "description": "导演"
        },
        "rating": {
            "type": "number",
            "description": "评分"
        }
    },
    "required": ["title", "year", "director", "rating"]
}

model_with_structure = model.with_structured_output(
    json_schema,
    method="json_schema",
)
response = model_with_structure.invoke("提供电影《盗梦空间》的详情")
print(response)  # {'title': 'Inception', 'year': 2010, ...}
```

</Tab>

</Tabs>

<Note>

<strong>结构化输出的关键注意事项</strong>

- <strong>方法参数</strong>：一些提供商支持不同的结构化输出方法：
    - `'json_schema'`：使用提供商提供的专用结构化输出功能。
    - `'function_calling'`：通过强制遵循给定模式的 [工具调用](#tool-calling) 来派生结构化输出。
    - `'json_mode'`：某些提供商提供的 `'json_schema'` 的前身。生成有效的 JSON，但模式必须在提示中描述。
- <strong>包含原始数据</strong>：设置 `include_raw=True` 以同时获取解析后的输出和原始的 AI 消息。
- <strong>验证</strong>：Pydantic 模型提供自动验证。`TypedDict` 和 JSON 模式需要手动验证。

有关支持的方法和配置选项，请参阅您的 [提供商集成页面](/oss/python/integrations/providers/overview)。

</Note>

:::: details 示例：消息输出与解析后的结构一起返回

返回原始的 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 对象以及解析后的表示形式可能很有用，以便访问响应元数据，例如 [令牌计数](#token-usage)。为此，在调用 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.with_structured_output" target="_blank" rel="noreferrer" class="link"><code>with_structured_output</code></a> 时设置 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.with_structured_output(include_raw)" target="_blank" rel="noreferrer" class="link"><code>include_raw=True</code></a>：

```python
from pydantic import BaseModel, Field

class Movie(BaseModel):
    """包含详情的电影。"""
    title: str = Field(..., description="电影标题")
    year: int = Field(..., description="发行年份")
    director: str = Field(..., description="导演")
    rating: float = Field(..., description="满分为 10 分的评分")

model_with_structure = model.with_structured_output(Movie, include_raw=True)  # [!code highlight]
response = model_with_structure.invoke("提供电影《盗梦空间》的详情")
response
# {
#     "raw": AIMessage(...),
#     "parsed": Movie(title=..., year=..., ...),
#     "parsing_error": None,
# }
```

::::

:::: details 示例：嵌套结构

模式可以嵌套：

::: code-group

```python [Pydantic BaseModel]
from pydantic import BaseModel, Field

class Actor(BaseModel):
    name: str
    role: str

class MovieDetails(BaseModel):
    title: str
    year: int
    cast: list[Actor]
    genres: list[str]
    budget: float | None = Field(None, description="以百万美元为单位的预算")

model_with_structure = model.with_structured_output(MovieDetails)
```

```python [TypedDict]
from typing_extensions import Annotated, TypedDict

class Actor(TypedDict):
    name: str
    role: str

class MovieDetails(TypedDict):
    title: str
    year: int
    cast: list[Actor]
    genres: list[str]
    budget: Annotated[float | None, ..., "以百万美元为单位的预算"]

model_with_structure = model.with_structured_output(MovieDetails)
```

:::

::::

---

## 高级主题

### 模型配置文件

<Info>

模型配置文件需要 `langchain>=1.1`。

</Info>

LangChain 聊天模型可以通过 `.profile` 属性公开一个包含支持功能和能力的字典：

```python
model.profile
# {
#   "max_input_tokens": 400000,
#   "image_inputs": True,
#   "reasoning_output": True,
#   "tool_calling": True,
#   ...
# }
```

完整的字段集请参考 [API 参考](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.BaseChatModel.profile)。

模型配置文件数据主要由 [models.dev](https://github.com/sst/models.dev) 项目提供支持，这是一个提供模型能力数据的开源项目。这些数据为了与 LangChain 一起使用而增加了额外的字段。这些增强内容会随着上游项目的发展而保持同步。

模型配置文件数据允许应用程序动态地适应模型能力。例如：

1. [摘要中间件](/oss/python/langchain/middleware/built-in#summarization) 可以根据模型的上下文窗口大小触发摘要。
2. `create_agent` 中的 [结构化输出](/oss/python/langchain/structured-output) 策略可以自动推断（例如，通过检查对原生结构化输出功能的支持）。
3. 可以根据支持的 [模态](#multimodal) 和最大输入令牌数来限制模型输入。

:::: details 更新或覆盖配置文件数据

如果模型配置文件数据缺失、过时或不正确，可以更改。

<strong>选项 1（快速修复）</strong>

您可以使用任何有效的配置文件实例化聊天模型：

```python
custom_profile = {
    "max_input_tokens": 100_000,
    "tool_calling": True,
    "structured_output": True,
    # ...
}
model = init_chat_model("...", profile=custom_profile)
```

`profile` 也是一个常规的 `dict`，可以就地更新。如果模型实例是共享的，请考虑使用 `model_copy` 以避免改变共享状态。

```python
new_profile = model.profile | {"key": "value"}
model.model_copy(update={"profile": new_profile})
```

<strong>选项 2（修复上游数据）</strong>

数据的主要来源是 [models.dev](https://models.dev/) 项目。这些数据与 LangChain [集成包](/oss/python/integrations/providers/overview) 中的额外字段和覆盖项合并，并随这些包一起发布。

可以通过以下过程更新模型配置文件数据：

1. （如果需要）通过向其在 [GitHub 上的仓库](https://github.com/sst/models.dev) 提交拉取请求来更新 [models.dev](https://models.dev/) 的源数据。
2. （如果需要）通过向 LangChain [集成包](/oss/python/integrations/providers/overview) 提交拉取请求来更新 `langchain_<package>/data/profile_augmentations.toml` 中的额外字段和覆盖项。
3. 使用 [`langchain-model-profiles`](https://pypi.org/project/langchain-model-profiles/) CLI 工具从 [models.dev](https://models.dev/) 拉取最新数据，合并增强内容并更新配置文件数据：

```bash
pip install langchain-model-profiles
```

```bash
langchain-profiles refresh --provider <provider> --data-dir <data_dir>
```

此命令：
- 从 models.dev 下载 `<provider>` 的最新数据
- 从 `<data_dir>` 中的 `profile_augmentations.toml` 合并增强内容
- 将合并后的配置文件写入 `<data_dir>` 中的 `profiles.py`

例如：在 [LangChain 单体仓库](https://github.com/langchain-ai/langchain) 的 [`libs/partners/anthropic`](https://github.com/langchain-ai/langchain/tree/master/libs/partners/anthropic) 中：

```bash
uv run --with langchain-model-profiles --provider anthropic --data-dir langchain_anthropic/data
```

::::

<Warning>

模型配置文件是一个测试版功能。配置文件的格式可能会发生变化。

</Warning>

### 多模态

某些模型可以处理和返回非文本数据，例如图像、音频和视频。您可以通过提供 [内容块](/oss/python/langchain/messages#message-content) 将非文本数据传递给模型。

<Tip>

所有具有底层多模态功能的 LangChain 聊天模型都支持：

1. 跨提供商标准格式的数据（请参阅 [我们的消息指南](/oss/python/langchain/messages)）
2. OpenAI [聊天补全](https://platform.openai.com/docs/api-reference/chat) 格式
3. 该特定提供商原生的任何格式（例如，Anthropic 模型接受 Anthropic 原生格式）

</Tip>

详情请参阅消息指南的 [多模态部分](/oss/python/langchain/messages#multimodal)。

<Tooltip tip="并非所有LLM都生而平等！" cta="查看参考" href="https://models.dev/">某些模型</Tooltip>可以在其响应中返回多模态数据。如果被调用执行此操作，生成的 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 将包含具有多模态类型的内容块。

```python [多模态输出]
response = model.invoke("生成一张猫的照片")
print(response.content_blocks)
# [
#     {"type": "text", "text": "这是猫的照片"},
#     {"type": "image", "base64": "...", "mime_type": "image/jpeg"},
# ]
```

有关特定提供商的详细信息，请参阅[集成页面](/oss/python/integrations/providers/overview)。

### 推理

许多模型能够执行多步推理以得出结论。这涉及将复杂问题分解为更小、更易管理的步骤。

**如果底层模型支持，** 您可以展示此推理过程，以更好地理解模型如何得出最终答案。

::: code-group

```python [流式推理输出]
for chunk in model.stream("为什么鹦鹉有彩色的羽毛？"):
    reasoning_steps = [r for r in chunk.content_blocks if r["type"] == "reasoning"]
    print(reasoning_steps if reasoning_steps else chunk.text)
```

```python [完整推理输出]
response = model.invoke("为什么鹦鹉有彩色的羽毛？")
reasoning_steps = [b for b in response.content_blocks if b["type"] == "reasoning"]
print(" ".join(step["reasoning"] for step in reasoning_steps))
```

:::

根据模型的不同，有时您可以指定其在推理上应投入的努力程度。同样，您可以要求模型完全关闭推理。这可能表现为推理的分类"层级"（例如，`'low'` 或 `'high'`）或整数令牌预算。

有关详细信息，请参阅[集成页面](/oss/python/integrations/providers/overview)或您相应聊天模型的[参考文档](https://reference.langchain.com/python/integrations/)。

### 本地模型

LangChain 支持在您自己的硬件上本地运行模型。这在数据隐私至关重要、您希望调用自定义模型或希望避免使用基于云的模型所产生的成本时非常有用。

[Ollama](/oss/python/integrations/chat/ollama) 是在本地运行聊天和嵌入模型的最简单方法之一。

### 提示缓存

许多提供商提供提示缓存功能，以减少重复处理相同令牌时的延迟和成本。这些功能可以是**隐式**或**显式**的：

- **隐式提示缓存：** 如果请求命中缓存，提供商会自动传递成本节省。例如：[OpenAI](/oss/python/integrations/chat/openai) 和 [Gemini](/oss/python/integrations/chat/google_generative_ai)。
- **显式缓存：** 提供商允许您手动指示缓存点，以实现更精细的控制或保证成本节省。例如：
    - <a href="https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a>（通过 `prompt_cache_key`）
    - Anthropic 的 [`AnthropicPromptCachingMiddleware`](/oss/python/integrations/chat/anthropic#prompt-caching)
    - [Gemini](https://python.langchain.com/api_reference/google_genai/chat_models/langchain_google_genai.chat_models.ChatGoogleGenerativeAI.html)。
    - [AWS Bedrock](/oss/python/integrations/chat/bedrock#prompt-caching)

<Warning>

提示缓存通常仅在输入令牌数超过最小阈值时才会启用。有关详细信息，请参阅[提供商页面](/oss/python/integrations/chat)。

</Warning>

缓存使用情况将反映在模型响应的[使用情况元数据](/oss/python/langchain/messages#token-usage)中。

### 服务器端工具使用

一些提供商支持服务器端[工具调用](#tool-calling)循环：模型可以在单个对话轮次中与网络搜索、代码解释器和其他工具交互并分析结果。

如果模型在服务器端调用工具，响应消息的内容将包含表示工具调用和结果的内容。访问响应的[内容块](/oss/python/langchain/messages#standard-content-blocks)将以与提供商无关的格式返回服务器端工具调用和结果：

```python [带有服务器端工具调用的 Invoke]
from langchain.chat_models import init_chat_model

model = init_chat_model("gpt-4.1-mini")

tool = {"type": "web_search"}
model_with_tools = model.bind_tools([tool])

response = model_with_tools.invoke("今天有哪些正能量的新闻？")
response.content_blocks
```

```python [结果展开]
[
    {
        "type": "server_tool_call",
        "name": "web_search",
        "args": {
            "query": "今天的正能量新闻",
            "type": "search"
        },
        "id": "ws_abc123"
    },
    {
        "type": "server_tool_result",
        "tool_call_id": "ws_abc123",
        "status": "success"
    },
    {
        "type": "text",
        "text": "以下是今天的一些正能量新闻...",
        "annotations": [
            {
                "end_index": 410,
                "start_index": 337,
                "title": "文章标题",
                "type": "citation",
                "url": "..."
            }
        ]
    }
]
```

这代表单个对话轮次；没有像客户端[工具调用](#tool-calling)中那样需要传入的关联 [ToolMessage](/oss/python/langchain/messages#tool-message) 对象。

有关可用工具和使用详情，请参阅您给定提供商的[集成页面](/oss/python/integrations/chat)。

### 速率限制

许多聊天模型提供商对给定时间段内可以进行的调用次数施加限制。如果您达到速率限制，通常会收到来自提供商的速率限制错误响应，并且需要等待才能发出更多请求。

为了帮助管理速率限制，聊天模型集成接受一个 `rate_limiter` 参数，可以在初始化时提供以控制请求发出的速率。

:::: details <Icon icon="gauge-high" style="margin-right: 8px; vertical-align: middle;" /> 初始化和使用速率限制器

LangChain 附带（可选的）内置 <a href="https://reference.langchain.com/python/langchain_core/rate_limiters/#langchain_core.rate_limiters.InMemoryRateLimiter" target="_blank" rel="noreferrer" class="link"><code>InMemoryRateLimiter</code></a>。此限制器是线程安全的，可以在同一进程中被多个线程共享。

```python [Define a rate limiter]
from langchain_core.rate_limiters import InMemoryRateLimiter

rate_limiter = InMemoryRateLimiter(
    requests_per_second=0.1,  # 每 10 秒 1 个请求
    check_every_n_seconds=0.1,  # 每 100 毫秒检查一次是否允许发送请求
    max_bucket_size=10,  # 控制最大突发请求量
)

model = init_chat_model(
    model="gpt-5",
    model_provider="openai",
    rate_limiter=rate_limiter  # [!code highlight]
)
```

<Warning>

提供的速率限制器只能限制单位时间内的请求数量。如果您还需要基于请求大小进行限制，它将无法提供帮助。

</Warning>

::::

### 基础URL或代理

对于许多聊天模型集成，您可以配置API请求的基础URL，这允许您使用具有OpenAI兼容API的模型提供商或使用代理服务器。

:::: details <Icon icon="link" style="margin-right: 8px; vertical-align: middle;" /> 基础URL

许多模型提供商提供OpenAI兼容的API（例如，[Together AI](https://www.together.ai/)、[vLLM](https://github.com/vllm-project/vllm)）。您可以通过指定适当的 `base_url` 参数，使用 <a href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model" target="_blank" rel="noreferrer" class="link"><code>init_chat_model</code></a> 与这些提供商：

```python
model = init_chat_model(
    model="MODEL_NAME",
    model_provider="openai",
    base_url="BASE_URL",
    api_key="YOUR_API_KEY",
)
```

<Note>

当使用直接聊天模型类实例化时，参数名称可能因提供商而异。请查看相应的[参考文档](/oss/python/integrations/providers/overview)了解详情。

</Note>

::::

:::: details <Icon icon="shield" style="margin-right: 8px; vertical-align: middle;" /> 代理配置

对于需要HTTP代理的部署，某些模型集成支持代理配置：

```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(
    model="gpt-4o",
    openai_proxy="http://proxy.example.com:8080"
)
```

<Note>

代理支持因集成而异。请查看特定模型提供商的[参考文档](/oss/python/integrations/providers/overview)了解代理配置选项。

</Note>

::::

### 对数概率

某些模型可以通过在初始化模型时设置 `logprobs` 参数来配置为返回令牌级别的对数概率，表示给定令牌的可能性：

```python
model = init_chat_model(
    model="gpt-4o",
    model_provider="openai"
).bind(logprobs=True)

response = model.invoke("为什么鹦鹉会说话？")
print(response.response_metadata["logprobs"])
```

### 令牌使用情况

许多模型提供商将令牌使用情况信息作为调用响应的一部分返回。当可用时，此信息将包含在相应模型生成的 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 对象上。有关更多详细信息，请参阅[消息](/oss/python/langchain/messages)指南。

<Note>

一些提供商API，特别是OpenAI和Azure OpenAI聊天补全，要求用户选择在流式上下文中接收令牌使用情况数据。有关详细信息，请参阅集成指南的[流式使用情况元数据](/oss/python/integrations/chat/openai#streaming-usage-metadata)部分。

</Note>

您可以使用回调或上下文管理器跟踪应用程序中跨模型的聚合令牌计数，如下所示：

<Tabs>

<Tab title="回调处理器">

```python
from langchain.chat_models import init_chat_model
from langchain_core.callbacks import UsageMetadataCallbackHandler

model_1 = init_chat_model(model="gpt-4o-mini")
model_2 = init_chat_model(model="claude-haiku-4-5-20251001")

callback = UsageMetadataCallbackHandler()
result_1 = model_1.invoke("你好", config={"callbacks": [callback]})
result_2 = model_2.invoke("你好", config={"callbacks": [callback]})
callback.usage_metadata
```

```python
{
    'gpt-4o-mini-2024-07-18': {
        'input_tokens': 8,
        'output_tokens': 10,
        'total_tokens': 18,
        'input_token_details': {'audio': 0, 'cache_read': 0},
        'output_token_details': {'audio': 0, 'reasoning': 0}
    },
    'claude-haiku-4-5-20251001': {
        'input_tokens': 8,
        'output_tokens': 21,
        'total_tokens': 29,
        'input_token_details': {'cache_read': 0, 'cache_creation': 0}
    }
}
```

</Tab>

<Tab title="上下文管理器">

```python
from langchain.chat_models import init_chat_model
from langchain_core.callbacks import get_usage_metadata_callback

model_1 = init_chat_model(model="gpt-4o-mini")
model_2 = init_chat_model(model="claude-haiku-4-5-20251001")

with get_usage_metadata_callback() as cb:
    model_1.invoke("你好")
    model_2.invoke("你好")
    print(cb.usage_metadata)
```

```python
{
    'gpt-4o-mini-2024-07-18': {
        'input_tokens': 8,
        'output_tokens': 10,
        'total_tokens': 18,
        'input_token_details': {'audio': 0, 'cache_read': 0},
        'output_token_details': {'audio': 0, 'reasoning': 0}
    },
    'claude-haiku-4-5-20251001': {
        'input_tokens': 8,
        'output_tokens': 21,
        'total_tokens': 29,
        'input_token_details': {'cache_read': 0, 'cache_creation': 0}
    }
}
```

</Tab>

</Tabs>

### 调用配置

调用模型时，您可以通过 `config` 参数使用 <a href="https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig" target="_blank" rel="noreferrer" class="link"><code>RunnableConfig</code></a> 字典传递额外的配置。这提供了对执行行为、回调和元数据跟踪的运行时控制。

常见的配置选项包括：

```python [带有配置的调用]
response = model.invoke(
    "讲个笑话",
    config={
        "run_name": "joke_generation",      # 自定义此次运行的名称
        "tags": ["幽默", "演示"],            # 用于分类的标签
        "metadata": {"user_id": "123"},     # 自定义元数据
        "callbacks": [my_callback_handler], # 回调处理器
    }
)
```

这些配置值在以下情况下特别有用：
- 使用 [LangSmith](https://docs.langchain.com/langsmith/home) 跟踪进行调试
- 实现自定义日志记录或监控
- 控制生产环境中的资源使用
- 跨复杂管道跟踪调用

:::: details 关键配置属性

<ParamField body="run_name" type="string">

在日志和跟踪中标识此特定调用。不被子调用继承。

</ParamField>

<ParamField body="tags" type="string[]">

标签，被所有子调用继承，用于在调试工具中进行过滤和组织。

</ParamField>

<ParamField body="metadata" type="object">

自定义键值对，用于跟踪额外的上下文，被所有子调用继承。

</ParamField>

<ParamField body="max_concurrency" type="number">

控制在使用 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch" target="_blank" rel="noreferrer" class="link"><code>batch()</code></a> 或 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch_as_completed" target="_blank" rel="noreferrer" class="link"><code>batch_as_completed()</code></a> 时的最大并行调用数。

</ParamField>

<ParamField body="callbacks" type="array">

用于在执行期间监控和响应事件的处理程序。

</ParamField>

<ParamField body="recursion_limit" type="number">

链的最大递归深度，以防止复杂管道中的无限循环。

</ParamField>

::::

<Tip>

有关所有支持的属性，请参阅完整的 <a href="https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig" target="_blank" rel="noreferrer" class="link"><code>RunnableConfig</code></a> 参考。

</Tip>

### 可配置模型

您还可以通过指定 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.configurable_fields" target="_blank" rel="noreferrer" class="link"><code>configurable_fields</code></a> 来创建运行时可配置的模型。如果您不指定模型值，则默认情况下 `'model'` 和 `'model_provider'` 将是可配置的。

```python
from langchain.chat_models import init_chat_model

configurable_model = init_chat_model(temperature=0)

configurable_model.invoke(
    "你叫什么名字",
    config={"configurable": {"model": "gpt-5-nano"}},  # 使用 GPT-5-Nano 运行
)
configurable_model.invoke(
    "你叫什么名字",
    config={"configurable": {"model": "claude-sonnet-4-5-20250929"}},  # 使用 Claude 运行
)
```

:::: details 具有默认值的可配置模型

我们可以创建一个具有默认模型值的可配置模型，指定哪些参数是可配置的，并为可配置参数添加前缀：

```python
first_model = init_chat_model(
        model="gpt-4.1-mini",
        temperature=0,
        configurable_fields=("model", "model_provider", "temperature", "max_tokens"),
        config_prefix="first",  # 当您的链中有多个模型时很有用
)

first_model.invoke("你叫什么名字")
```

```python
first_model.invoke(
    "你叫什么名字",
    config={
        "configurable": {
            "first_model": "claude-sonnet-4-5-20250929",
            "first_temperature": 0.5,
            "first_max_tokens": 100,
        }
    },
)
```

有关 `configurable_fields` 和 `config_prefix` 的更多详细信息，请参阅 <a href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model" target="_blank" rel="noreferrer" class="link"><code>init_chat_model</code></a> 参考。

::::

:::: details 以声明方式使用可配置模型

我们可以在可配置模型上调用声明性操作，如 `bind_tools`、`with_structured_output`、`with_configurable` 等，并以与常规实例化的聊天模型对象相同的方式链接可配置模型。

```python
from pydantic import BaseModel, Field

class GetWeather(BaseModel):
    """获取指定位置的当前天气"""

        location: str = Field(..., description="城市和省份，例如：上海市")

class GetPopulation(BaseModel):
    """获取指定位置的当前人口"""

        location: str = Field(..., description="城市和省份，例如：上海市")

model = init_chat_model(temperature=0)
model_with_tools = model.bind_tools([GetWeather, GetPopulation])

model_with_tools.invoke(
    "2024 年北京和上海哪个城市更大", config={"configurable": {"model": "gpt-4.1-mini"}}
).tool_calls
```

```
[
    {
        'name': 'GetPopulation',
        'args': {'location': '北京市'},
        'id': 'call_Ga9m8FAArIyEjItHmztPYA22',
        'type': 'tool_call'
    },
    {
        'name': 'GetPopulation',
        'args': {'location': '上海市'},
        'id': 'call_jh2dEvBaAHRaw5JUDthOs7rt',
        'type': 'tool_call'
    }
]
```

```python
model_with_tools.invoke(
    "2024 年北京和上海哪个城市更大",
    config={"configurable": {"model": "claude-sonnet-4-5-20250929"}},
).tool_calls
```

```
[
    {
        'name': 'GetPopulation',
        'args': {'location': '北京市'},
        'id': 'toolu_01JMufPf4F4t2zLj7miFeqXp',
        'type': 'tool_call'
    },
    {
        'name': 'GetPopulation',
        'args': {'location': '上海市'},
        'id': 'toolu_01RQBHcE8kEEbYTuuS8WqY1u',
        'type': 'tool_call'
    }
]
```

::::

