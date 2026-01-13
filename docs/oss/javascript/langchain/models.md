---
title: 模型
---


[大语言模型（LLMs）](https://en.wikipedia.org/wiki/Large_language_model)是强大的人工智能工具，能够像人类一样理解和生成文本。它们功能多样，足以编写内容、翻译语言、总结信息以及回答问题，而无需为每项任务进行专门训练。

除了文本生成，许多模型还支持：

* <Icon icon="hammer" :size="16" /> [工具调用](#tool-calling) - 调用外部工具（如数据库查询或 API 调用）并在其响应中使用结果。
* <Icon icon="shapes" :size="16" /> [结构化输出](#structured-output) - 模型的响应被约束为遵循定义的格式。
* <Icon icon="image" :size="16" /> [多模态](#multimodal) - 处理和返回文本以外的数据，如图像、音频和视频。
* <Icon icon="brain" :size="16" /> [推理](#reasoning) - 模型执行多步推理以得出结论。

模型是[智能体](/oss/javascript/langchain/agents)的推理引擎。它们驱动智能体的决策过程，决定调用哪些工具、如何解释结果以及何时提供最终答案。

您选择的模型的质量和能力直接影响智能体的基线可靠性和性能。不同的模型擅长不同的任务——有些更擅长遵循复杂指令，有些在结构化推理方面更出色，还有一些支持更大的上下文窗口以处理更多信息。

LangChain 的标准模型接口让您可以访问许多不同的提供商集成，这使得您可以轻松地试验和切换模型，以找到最适合您用例的模型。

<Info>

有关特定于提供商的集成信息和功能，请参阅提供商的[聊天模型页面](/oss/javascript/integrations/chat)。

</Info>

## 基本用法

模型可以通过两种方式使用：

1.  **与智能体一起使用** - 在创建[智能体](/oss/javascript/langchain/agents#model)时可以动态指定模型。
2.  **独立使用** - 模型可以直接调用（在智能体循环之外），用于文本生成、分类或提取等任务，而无需智能体框架。

相同的模型接口在这两种情况下都适用，这为您提供了灵活性，可以从简单开始，并根据需要扩展到更复杂的基于智能体的工作流。

### 初始化模型

在 LangChain 中开始使用独立模型的最简单方法是使用 `initChatModel` 从您选择的[聊天模型提供商](/oss/javascript/integrations/chat)初始化一个模型（示例如下）：

<!--@include: @/snippets/javascript/chat-model-tabs-js.md-->

```typescript
const response = await model.invoke("为什么鹦鹉会说话？");
```

有关更多详细信息，包括如何传递模型[参数](#parameters)的信息，请参阅 <a href="https://reference.langchain.com/javascript/functions/langchain.chat_models_universal.initChatModel.html" target="_blank" rel="noreferrer" class="link"><code>initChatModel</code></a>。

### 支持的模型

LangChain 支持所有主要的模型提供商，包括 OpenAI、Anthropic、Google、Azure、AWS Bedrock 等。每个提供商都提供具有不同功能的各种模型。有关 LangChain 中支持模型的完整列表，请参阅[集成页面](/oss/javascript/integrations/providers/overview)。

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

除了聊天模型，LangChain 还支持其他相关技术，例如嵌入模型和向量存储。详情请参阅[集成页面](/oss/javascript/integrations/providers/overview)。

</Info>

## 参数

聊天模型接受可用于配置其行为的参数。支持的完整参数集因模型和提供商而异，但标准参数包括：

<ParamField body="model" type="string" required>

您希望与提供商一起使用的特定模型的名称或标识符。您也可以使用 '{model_provider}:{model}' 格式在单个参数中同时指定模型及其提供商，例如 'openai:o1'。

</ParamField>

<ParamField body="apiKey" type="string">

用于向模型提供商进行身份验证所需的密钥。这通常在您注册访问模型时颁发。通常通过设置<Tooltip tip="一个其值在程序外部设置的变量，通常通过操作系统或微服务的内置功能实现。">环境变量</Tooltip>来访问。

</ParamField>

<ParamField body="temperature" type="number">

控制模型输出的随机性。数值越高，响应越有创意；数值越低，响应越确定。

</ParamField>

<ParamField body="maxTokens" type="number">

限制响应中的<Tooltip tip="模型读取和生成的基本单位。提供商可能以不同方式定义它们，但通常它们可以表示一个完整的词或词的一部分。">令牌</Tooltip>总数，有效控制输出的长度。

</ParamField>

<ParamField body="timeout" type="number">

在取消请求之前等待模型响应的最长时间（以秒为单位）。

</ParamField>

<ParamField body="maxRetries" type="number">

如果请求因网络超时或速率限制等问题而失败，系统将尝试重新发送请求的最大次数。

</ParamField>

使用 `initChatModel` 时，将这些参数作为内联参数传递：

```typescript [Initialize using model parameters]
const model = await initChatModel(
    "claude-sonnet-4-5-20250929",
    { temperature: 0.7, timeout: 30, max_tokens: 1000 }
)
```

<Info>

每个聊天模型集成可能具有用于控制特定于提供商功能的额外参数。

例如，<a href="https://reference.langchain.com/javascript/classes/_langchain_openai.ChatOpenAI.html" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a> 具有 `use_responses_api` 参数，用于指示是使用 OpenAI Responses API 还是 Completions API。

要查找给定聊天模型支持的所有参数，请前往[聊天模型集成](/oss/javascript/integrations/chat)页面。

</Info>

---

## 调用

必须调用聊天模型才能生成输出。有三种主要的调用方法，每种适用于不同的用例。

### Invoke

调用模型最直接的方法是使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_core_language_models_chat_models.BaseChatModel.html#invoke" target="_blank" rel="noreferrer" class="link"><code>invoke()</code></a> 并传入单个消息或消息列表。

```typescript [单条消息]
const response = await model.invoke("为什么鹦鹉有彩色的羽毛？");
console.log(response);
```

可以向聊天模型提供消息列表以表示对话历史记录。每条消息都有一个角色，模型使用该角色来指示对话中是谁发送了消息。

有关角色、类型和内容的更多详细信息，请参阅[消息](/oss/javascript/langchain/messages)指南。

```typescript [对象格式]
const conversation = [
  { role: "system", content: "你是一个得力的助手，负责将英文翻译成中文。" },
  { role: "user", content: "翻译：I love programming." },
  { role: "assistant", content: "我热爱编程。" },
  { role: "user", content: "翻译：I love building applications." },
];

const response = await model.invoke(conversation);
console.log(response);  // AIMessage("我热爱构建应用程序。")
```

```typescript [消息对象]
import { HumanMessage, AIMessage, SystemMessage } from "langchain";

const conversation = [
  new SystemMessage("你是一个得力的助手，负责将英文翻译成中文。"),
  new HumanMessage("翻译：I love programming."),
  new AIMessage("我热爱编程。"),
  new HumanMessage("翻译：I love building applications."),
];

const response = await model.invoke(conversation);
console.log(response);  // AIMessage("我热爱构建应用程序。")
```

<Info>

如果您的调用返回类型是字符串，请确保您使用的是聊天模型，而不是 LLM。传统的文本补全 LLM 直接返回字符串。LangChain 的聊天模型以 "Chat" 为前缀，例如 <a href="https://reference.langchain.com/javascript/classes/_langchain_openai.ChatOpenAI.html" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a>(/oss/integrations/chat/openai)。

</Info>

### Stream

大多数模型可以在生成输出内容时进行流式传输。通过逐步显示输出，流式传输显著改善了用户体验，特别是对于较长的响应。

调用 <a href="https://reference.langchain.com/javascript/classes/_langchain_core_language_models_chat_models.BaseChatModel.html#stream" target="_blank" rel="noreferrer" class="link"><code>stream()</code></a> 会返回一个<Tooltip tip="一个逐步提供对集合中每个项目访问的对象，按顺序进行。">迭代器</Tooltip>，该迭代器在生成时产生输出块。您可以使用循环实时处理每个块：

::: code-group

```typescript [基础文本流]
const stream = await model.stream("为什么鹦鹉有彩色的羽毛？");
for await (const chunk of stream) {
  console.log(chunk.text)
}
```

```typescript [流式传输工具调用、推理及其他内容]
const stream = await model.stream("天空是什么颜色的？");
for await (const chunk of stream) {
  for (const block of chunk.contentBlocks) {
    if (block.type === "reasoning") {
      console.log(`推理：${block.reasoning}`);
    } else if (block.type === "tool_call_chunk") {
      console.log(`工具调用块：${block}`);
    } else if (block.type === "text") {
      console.log(block.text);
    } else {
      ...
    }
  }
}
```

:::

与返回单个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a>（在模型完成生成其完整响应后）的 [`invoke()`](#invoke) 不同，`stream()` 返回多个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessageChunk.html" target="_blank" rel="noreferrer" class="link"><code>AIMessageChunk</code></a> 对象，每个对象包含输出文本的一部分。重要的是，流中的每个块都设计为可以通过求和聚合成完整的消息：

```typescript [构建 AIMessage]
let full: AIMessageChunk | null = null;
for await (const chunk of stream) {
  full = full ? full.concat(chunk) : chunk;
  console.log(full.text);
}

// 天
// 天空
// 天空是
// 天空通常
// 天空通常是蓝色
// ...

console.log(full.contentBlocks);
// [{"type": "text", "text": "天空通常是蓝色的..."}]
```

生成的消息可以像使用 [`invoke()`](#invoke) 生成的消息一样处理——例如，它可以聚合到消息历史记录中，并作为对话上下文传递回模型。

<Warning>

只有当程序中的所有步骤都知道如何处理块流时，流式传输才能正常工作。例如，一个不具备流式处理能力的应用程序需要在处理之前将整个输出存储在内存中。

</Warning>

:::: details 高级流式传输主题

::: details 流式传输事件

LangChain 聊天模型也可以使用
[`streamEvents()`][BaseChatModel.streamEvents] 流式传输语义事件。

这简化了基于事件类型和其他元数据的过滤，并将在后台聚合完整的消息。请参阅下面的示例。

```typescript
const stream = await model.streamEvents("你好");
for await (const event of stream) {
    if (event.event === "on_chat_model_start") {
        console.log(`输入：${event.data.input}`);
    }
    if (event.event === "on_chat_model_stream") {
        console.log(`令牌：${event.data.chunk.text}`);
    }
    if (event.event === "on_chat_model_end") {
        console.log(`全文：${event.data.output.text}`);
    }
}
```

```txt
输入：你好
令牌：你
令牌：好
令牌：！
全文：你好！今天有什么我可以帮你的吗？
```

有关事件类型和其他详细信息，请参阅 <a href="https://reference.langchain.com/javascript/classes/_langchain_core_language_models_chat_models.BaseChatModel.html#streamEvents" target="_blank" rel="noreferrer" class="link"><code>streamEvents()</code></a> 参考。

:::

::: details "自动流式传输"聊天模型

LangChain 通过在某些情况下自动启用流式传输模式来简化从聊天模型的流式传输，即使您没有显式调用流式传输方法。当您使用非流式调用的 invoke 方法但仍希望流式传输整个应用程序（包括来自聊天模型的中间结果）时，这特别有用。

例如，在 [LangGraph 智能体](/oss/javascript/langchain/agents)中，您可以在节点内调用 `model.invoke()`，但如果以流式模式运行，LangChain 将自动委托给流式传输。

#### 工作原理

当您 `invoke()` 一个聊天模型时，如果 LangChain 检测到您正尝试流式传输整个应用程序，它将自动切换到内部流式传输模式。就使用 invoke 的代码而言，调用的结果将是相同的；然而，在聊天模型被流式传输时，LangChain 将负责在 LangChain 的回调系统中调用 <a href="https://reference.langchain.com/javascript/interfaces/_langchain_core.callbacks_base.BaseCallbackHandlerMethods.html#onLlmNewToken" target="_blank" rel="noreferrer" class="link"><code>on_llm_new_token</code></a> 事件。

回调事件允许 LangGraph 的 `stream()` 和 `streamEvents()` 实时呈现聊天模型的输出。

:::

::::

### Batch

将一组独立的请求批量发送到模型可以显著提高性能并降低成本，因为处理可以并行完成：

```typescript [批量处理]
const responses = await model.batch([
  "为什么鹦鹉有彩色的羽毛？",
  "飞机是怎么飞的？",
  "什么是量子计算？",
  "为什么鹦鹉有彩色的羽毛？",
  "飞机是怎么飞的？",
  "什么是量子计算？",
]);
for (const response of responses) {
  console.log(response);
}
```

<Tip>

当使用 `batch()` 处理大量输入时，您可能希望控制最大并行调用数。这可以通过在 <a href="https://reference.langchain.com/javascript/interfaces/_langchain_core.runnables.RunnableConfig.html" target="_blank" rel="noreferrer" class="link"><code>RunnableConfig</code></a> 字典中设置 `maxConcurrency` 属性来实现。

```typescript [Batch with max concurrency]
model.batch(
  listOfInputs,
  {
    maxConcurrency: 5,  // Limit to 5 parallel calls
  }
)
```

有关支持的属性的完整列表，请参阅 <a href="https://reference.langchain.com/javascript/interfaces/_langchain_core.runnables.RunnableConfig.html" target="_blank" rel="noreferrer" class="link"><code>RunnableConfig</code></a> 参考。

</Tip>

有关批处理的更多详细信息，请参阅 <a href="https://reference.langchain.com/javascript/classes/_langchain_core_language_models_chat_models.BaseChatModel.html#batch" target="_blank" rel="noreferrer" class="link">参考</a>。

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
        M->>T: getWeather("北京")
        M->>T: getWeather("上海")
    end

    par 工具执行 (Tool Execution)
        T-->>M: 北京天气数据
        T-->>M: 上海天气数据
    end

    M->>M: 处理结果并生成响应
    M->>U: "北京：72°F 晴，上海：68°F 多云"
```

要使您定义的模型能够使用工具，必须使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_core_language_models_chat_models.BaseChatModel.html#bindTools" target="_blank" rel="noreferrer" class="link"><code>bindTools</code></a> 绑定它们。在后续调用中，模型可以根据需要选择调用任何已绑定的工具。

一些模型提供商提供 <Tooltip tip="在服务器端执行的工具，例如网络搜索和代码解释器">内置工具</Tooltip>，可以通过模型或调用参数启用（例如 [`ChatOpenAI`](/oss/javascript/integrations/chat/openai)、[`ChatAnthropic`](/oss/javascript/integrations/chat/anthropic)）。详情请查看相应的 [提供商参考文档](/oss/javascript/integrations/providers/overview)。

<Tip>

有关创建工具的详细信息和其他选项，请参阅 [工具指南](/oss/javascript/langchain/tools)。

</Tip>

```typescript [Binding user tools]
import { tool } from "langchain";
import * as z from "zod";
import { ChatOpenAI } from "@langchain/openai";

const getWeather = tool(
  (input) => `${input.location} 的天气晴朗。`,
  {
    name: "get_weather",
    description: "获取指定位置的天气。",
    schema: z.object({
      location: z.string().describe("要查询天气的地点"),
    }),
  },
);

const model = new ChatOpenAI({ model: "gpt-4o" });
const modelWithTools = model.bindTools([getWeather]);  // [!code highlight]

const response = await modelWithTools.invoke("北京的天气怎么样？");
const toolCalls = response.tool_calls || [];
for (const tool_call of toolCalls) {
  // 查看模型发出的工具调用
  console.log(`工具：${tool_call.name}`);
  console.log(`参数：${tool_call.args}`);
}
```

绑定用户定义的工具时，模型的响应会包含执行工具的**请求**。当将模型与 [智能体](/oss/javascript/langchain/agents) 分开使用时，需要您自己执行请求的工具，并将结果返回给模型以供后续推理使用。当使用 [智能体](/oss/javascript/langchain/agents) 时，智能体循环将为您处理工具执行循环。

下面，我们展示一些使用工具调用的常见方式。

:::: details <Icon icon="arrow-rotate-right" style="margin-right: 8px; vertical-align: middle;" /> 工具执行循环

当模型返回工具调用时，您需要执行这些工具并将结果传回给模型。这就创建了一个对话循环，模型可以利用工具结果生成最终响应。LangChain 包含 [智能体](/oss/javascript/langchain/agents) 抽象，可为您处理这种编排。

以下是一个简单的示例：

```typescript [Tool execution loop]
// Bind (potentially multiple) tools to the model
const modelWithTools = model.bindTools([get_weather])

// 步骤 1：模型生成工具调用
const messages = [{"role": "user", "content": "北京的天气怎么样？"}]
const ai_msg = await modelWithTools.invoke(messages)
messages.push(ai_msg)

// 步骤 2：执行工具并收集结果
for (const tool_call of ai_msg.tool_calls) {
    // 使用生成的参数执行工具
    const tool_result = await get_weather.invoke(tool_call)
    messages.push(tool_result)
}

// 步骤 3：将结果传回模型以获取最终响应
const final_response = await modelWithTools.invoke(messages)
console.log(final_response.text)
// "北京当前的天气是 72°F，晴。"
```

工具返回的每个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a> 都包含一个与原始工具调用匹配的 `tool_call_id`，帮助模型将结果与请求关联起来。

::::

:::: details <Icon icon="asterisk" style="margin-right: 8px; vertical-align: middle;" /> 强制工具调用

默认情况下，模型可以根据用户输入自由选择使用哪个绑定的工具。但是，您可能希望强制选择工具，确保模型使用特定工具或给定列表中的<strong>任何</strong>工具：

::: code-group

```typescript [Force use of any tool]
const modelWithTools = model.bindTools([tool_1], { toolChoice: "any" })
```

```typescript [Force use of specific tools]
const modelWithTools = model.bindTools([tool_1], { toolChoice: "tool_1" })
```

:::

::::

:::: details <Icon icon="layer-group" style="margin-right: 8px; vertical-align: middle;" /> 并行工具调用

许多模型在适当情况下支持并行调用多个工具。这使得模型可以同时从不同来源收集信息。

```typescript [Parallel tool calls]
const modelWithTools = model.bind_tools([get_weather])

const response = await modelWithTools.invoke(
    "北京和上海的天气怎么样？"
)

// 模型可能会生成多个工具调用
console.log(response.tool_calls)
// [
//   { name: 'get_weather', args: { location: '北京' }, id: 'call_1' },
//   { name: 'get_time', args: { location: '上海' }, id: 'call_2' }
// ]

// Execute all tools (can be done in parallel with async)
const results = []
for (const tool_call of response.tool_calls || []) {
    if (tool_call.name === 'get_weather') {
        const result = await get_weather.invoke(tool_call)
        results.push(result)
    }
}
```

模型会根据请求操作的独立性智能地判断何时适合并行执行。

<Tip>

大多数支持工具调用的模型默认启用并行工具调用。一些模型（包括 [OpenAI](/oss/javascript/integrations/chat/openai) 和 [Anthropic](/oss/javascript/integrations/chat/anthropic)）允许您禁用此功能。为此，请设置 `parallel_tool_calls=False`：

```python
model.bind_tools([get_weather], parallel_tool_calls=False)
```

</Tip>

::::

:::: details <Icon icon="rss" style="margin-right: 8px; vertical-align: middle;" /> 流式工具调用

在流式传输响应时，工具调用通过 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolCallChunk.html" target="_blank" rel="noreferrer" class="link"><code>ToolCallChunk</code></a> 逐步构建。这允许您在工具调用生成时就看到它们，而无需等待完整响应。

```typescript [Streaming tool calls]
const stream = await modelWithTools.stream(
    "北京和上海的天气怎么样？"
)
for await (const chunk of stream) {
    // 工具调用块逐步到达
    if (chunk.tool_call_chunks) {
        for (const tool_chunk of chunk.tool_call_chunks) {
        console.log(`工具：${tool_chunk.get('name', '')}`)
        console.log(`参数：${tool_chunk.get('args', '')}`)
        }
    }
}

// 输出：
// 工具：get_weather
// 参数：
// 工具：
// 参数：{"loc
// 工具：
// 参数：ation": "北京"}
// 工具：get_time
// 参数：
// 工具：
// 参数：{"timezone": "上海"}
```

您可以累积块来构建完整的工具调用：

```typescript [Accumulate tool calls]
let full: AIMessageChunk | null = null
const stream = await modelWithTools.stream("北京的天气怎么样？")
for await (const chunk of stream) {
    full = full ? full.concat(chunk) : chunk
    console.log(full.contentBlocks)
}
```

::::

---

## 结构化输出

可以要求模型以符合给定模式的格式提供响应。这对于确保输出易于解析并在后续处理中使用非常有用。LangChain 支持多种模式类型和强制执行结构化输出的方法。

<Tip>

要了解结构化输出，请参阅 [结构化输出](/oss/javascript/langchain/structured-output)。

</Tip>

<Tabs>

<Tab title="Zod">

[zod 模式](https://zod.dev/) 是定义输出模式的首选方法。请注意，当提供 zod 模式时，模型输出也将使用 zod 的解析方法根据该模式进行验证。

```typescript
import * as z from "zod";

const Movie = z.object({
  title: z.string().describe("电影标题"),
  year: z.number().describe("发行年份"),
  director: z.string().describe("导演"),
  rating: z.number().describe("评分"),
});

const modelWithStructure = model.withStructuredOutput(Movie);

const response = await modelWithStructure.invoke("提供电影《盗梦空间》的详情");
console.log(response);
// {
//   title: "Inception",
//   year: 2010,
//   director: "Christopher Nolan",
//   rating: 8.8,
// }
```

</Tab>

<Tab title="JSON 模式">

为了最大程度的控制或互操作性，您可以提供原始的 JSON 模式。

```typescript
const jsonSchema = {
  "title": "Movie",
  "description": "包含详情的电影",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "电影标题",
    },
    "year": {
      "type": "integer",
      "description": "发行年份",
    },
    "director": {
      "type": "string",
      "description": "导演",
    },
    "rating": {
      "type": "number",
      "description": "评分",
    },
  },
  "required": ["title", "year", "director", "rating"],
}

const modelWithStructure = model.withStructuredOutput(
  jsonSchema,
  { method: "jsonSchema" },
)

const response = await modelWithStructure.invoke("提供电影《盗梦空间》的详情")
console.log(response)  // {'title': 'Inception', 'year': 2010, ...}
```

</Tab>

</Tabs>

<Note>

<strong>结构化输出的关键注意事项：</strong>

- <strong>方法参数</strong>：一些提供商支持不同的方法（`'jsonSchema'`、`'functionCalling'`、`'jsonMode'`）
- <strong>包含原始数据</strong>：使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_core_language_models_chat_models.BaseChatModel.html#withStructuredOutput" target="_blank" rel="noreferrer" class="link"><code>includeRaw: true</code></a> 以同时获取解析后的输出和原始的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a>
- <strong>验证</strong>：Zod 模型提供自动验证，而 JSON 模式需要手动验证

有关支持的方法和配置选项，请参阅您的 [提供商集成页面](/oss/javascript/integrations/providers/overview)。

</Note>

:::: details 示例：消息输出与解析后的结构一起返回

返回原始的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 对象以及解析后的表示形式可能很有用，以便访问响应元数据，例如 [令牌计数](#token-usage)。为此，在调用 <a href="https://reference.langchain.com/javascript/classes/_langchain_core_language_models_chat_models.BaseChatModel.html#withStructuredOutput" target="_blank" rel="noreferrer" class="link"><code>with_structured_output</code></a> 时设置 <a href="https://reference.langchain.com/javascript/classes/_langchain_core_language_models_chat_models.BaseChatModel.html#withStructuredOutput" target="_blank" rel="noreferrer" class="link"><code>include_raw=True</code></a>：

```typescript
import * as z from "zod";

const Movie = z.object({
  title: z.string().describe("电影标题"),
  year: z.number().describe("发行年份"),
  director: z.string().describe("导演"),
  rating: z.number().describe("评分"),
});

const modelWithStructure = model.withStructuredOutput(Movie, { includeRaw: true });

const response = await modelWithStructure.invoke("提供电影《盗梦空间》的详情");
console.log(response);
// {
//   raw: AIMessage { ... },
//   parsed: { title: "Inception", ... }
// }
```

::::

:::: details 示例：嵌套结构

模式可以嵌套：

```typescript
import * as z from "zod";

const Actor = z.object({
  name: str
  role: z.string(),
});

const MovieDetails = z.object({
  title: z.string(),
  year: z.number(),
  cast: z.array(Actor),
  genres: z.array(z.string()),
  budget: z.number().nullable().describe("以百万美元为单位的预算"),
});

const modelWithStructure = model.withStructuredOutput(MovieDetails);
```

::::

---

## 高级主题

### 模型配置文件

<Info>

模型配置文件需要 `langchain>=1.1`。

</Info>

LangChain 聊天模型可以通过 `.profile` 属性公开一个包含支持功能和能力的字典：

```typescript
model.profile;
// {
//   maxInputTokens: 400000,
//   imageInputs: true,
//   reasoningOutput: true,
//   toolCalling: true,
//   ...
// }
```

完整的字段集请参考 [API 参考](https://reference.langchain.com/javascript/interfaces/_langchain_core.language_models_profile.ModelProfile.html)。

模型配置文件数据主要由 [models.dev](https://github.com/sst/models.dev) 项目提供支持，这是一个提供模型能力数据的开源项目。这些数据为了与 LangChain 一起使用而增加了额外的字段。这些增强内容会随着上游项目的发展而保持同步。

模型配置文件数据允许应用程序动态地适应模型能力。例如：

1. [摘要中间件](/oss/javascript/langchain/middleware/built-in#summarization) 可以根据模型的上下文窗口大小触发摘要。
2. `createAgent` 中的 [结构化输出](/oss/javascript/langchain/structured-output) 策略可以自动推断（例如，通过检查对原生结构化输出功能的支持）。
3. 可以根据支持的 [模态](#multimodal) 和最大输入令牌数来限制模型输入。

:::: details 修改配置文件数据

如果模型配置文件数据缺失、过时或不正确，可以更改。

<strong>选项 1（快速修复）</strong>

您可以使用任何有效的配置文件实例化聊天模型：

```typescript
const customProfile = {
maxInputTokens: 100_000,
toolCalling: true,
structuredOutput: true,
// ...
};
const model = initChatModel("...", { profile: customProfile });
```

<strong>选项 2（修复上游数据）</strong>

数据的主要来源是 [models.dev](https://models.dev/) 项目。这些数据与 LangChain [集成包](/oss/javascript/integrations/providers/overview) 中的额外字段和覆盖项合并，并随这些包一起发布。

可以通过以下过程更新模型配置文件数据：

1. （如果需要）通过向其在 [GitHub 上的仓库](https://github.com/sst/models.dev) 提交拉取请求来更新 [models.dev](https://models.dev/) 的源数据。
2. （如果需要）通过向 LangChain [集成包](/oss/javascript/integrations/providers/overview) 提交拉取请求来更新 `langchain-<package>/profiles.toml` 中的额外字段和覆盖项。

::::

<Warning>

模型配置文件是一个测试版功能。配置文件的格式可能会发生变化。

</Warning>

### 多模态

某些模型可以处理和返回非文本数据，例如图像、音频和视频。您可以通过提供 [内容块](/oss/javascript/langchain/messages#message-content) 将非文本数据传递给模型。

<Tip>

所有具有底层多模态功能的 LangChain 聊天模型都支持：

1. 跨提供商标准格式的数据（请参阅 [我们的消息指南](/oss/javascript/langchain/messages)）
2. OpenAI [聊天补全](https://platform.openai.com/docs/api-reference/chat) 格式
3. 该特定提供商原生的任何格式（例如，Anthropic 模型接受 Anthropic 原生格式）

</Tip>

详情请参阅消息指南的 [多模态部分](/oss/javascript/langchain/messages#multimodal)。

<Tooltip tip="并非所有LLM都生而平等！" cta="查看参考" href="https://models.dev/">某些模型</Tooltip>可以在其响应中返回多模态数据。如果被调用执行此操作，生成的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 将包含具有多模态类型的内容块。

```typescript [多模态输出]
const response = await model.invoke("生成一张猫的照片");
console.log(response.contentBlocks);
// [
//   { type: "text", text: "这是猫的照片" },
//   { type: "image", data: "...", mimeType: "image/jpeg" },
// ]
```

有关特定提供商的详细信息，请参阅[集成页面](/oss/javascript/integrations/providers/overview)。

### 推理

许多模型能够执行多步推理以得出结论。这涉及将复杂问题分解为更小、更易管理的步骤。

**如果底层模型支持，** 您可以展示此推理过程，以更好地理解模型如何得出最终答案。

::: code-group

```typescript [流式推理输出]
const stream = model.stream("为什么鹦鹉有彩色的羽毛？");
for await (const chunk of stream) {
    const reasoningSteps = chunk.contentBlocks.filter(b => b.type === "reasoning");
    console.log(reasoningSteps.length > 0 ? reasoningSteps : chunk.text);
}
```

```typescript [完整推理输出]
const response = await model.invoke("为什么鹦鹉有彩色的羽毛？");
const reasoningSteps = response.contentBlocks.filter(b => b.type === "reasoning");
console.log(reasoningSteps.map(step => step.reasoning).join(" "));
```

:::

根据模型的不同，有时您可以指定其在推理上应投入的努力程度。同样，您可以要求模型完全关闭推理。这可能表现为推理的分类"层级"（例如，`'low'` 或 `'high'`）或整数令牌预算。

有关详细信息，请参阅[集成页面](/oss/javascript/integrations/providers/overview)或您相应聊天模型的[参考文档](https://reference.langchain.com/python/integrations/)。

### 本地模型

LangChain 支持在您自己的硬件上本地运行模型。这在数据隐私至关重要、您希望调用自定义模型或希望避免使用基于云的模型所产生的成本时非常有用。

[Ollama](/oss/javascript/integrations/chat/ollama) 是在本地运行聊天和嵌入模型的最简单方法之一。

### 提示缓存

许多提供商提供提示缓存功能，以减少重复处理相同令牌时的延迟和成本。这些功能可以是**隐式**或**显式**的：

- **隐式提示缓存：** 如果请求命中缓存，提供商会自动传递成本节省。例如：[OpenAI](/oss/javascript/integrations/chat/openai) 和 [Gemini](/oss/javascript/integrations/chat/google_generative_ai)。
- **显式缓存：** 提供商允许您手动指示缓存点，以实现更精细的控制或保证成本节省。例如：
    - <a href="https://reference.langchain.com/javascript/classes/_langchain_openai.ChatOpenAI.html" target="_blank" rel="noreferrer" class="link"><code>ChatOpenAI</code></a>（通过 `prompt_cache_key`）
    - Anthropic 的 [`AnthropicPromptCachingMiddleware`](/oss/javascript/integrations/chat/anthropic#prompt-caching)
    - [Gemini](https://python.langchain.com/api_reference/google_genai/chat_models/langchain_google_genai.chat_models.ChatGoogleGenerativeAI.html)。
    - [AWS Bedrock](/oss/javascript/integrations/chat/bedrock#prompt-caching)

<Warning>

提示缓存通常仅在输入令牌数超过最小阈值时才会启用。有关详细信息，请参阅[提供商页面](/oss/javascript/integrations/chat)。

</Warning>

缓存使用情况将反映在模型响应的[使用情况元数据](/oss/javascript/langchain/messages#token-usage)中。

### 服务器端工具使用

一些提供商支持服务器端[工具调用](#tool-calling)循环：模型可以在单个对话轮次中与网络搜索、代码解释器和其他工具交互并分析结果。

如果模型在服务器端调用工具，响应消息的内容将包含表示工具调用和结果的内容。访问响应的[内容块](/oss/javascript/langchain/messages#standard-content-blocks)将以与提供商无关的格式返回服务器端工具调用和结果：

```typescript
import { initChatModel } from "langchain";

const model = await initChatModel("gpt-4.1-mini");
const modelWithTools = model.bindTools([{ type: "web_search" }])

const message = await modelWithTools.invoke("今天有哪些正能量的新闻？");
console.log(message.contentBlocks);
```

这代表单个对话轮次；没有像客户端[工具调用](#tool-calling)中那样需要传入的关联 [ToolMessage](/oss/javascript/langchain/messages#tool-message) 对象。

有关可用工具和使用详情，请参阅您给定提供商的[集成页面](/oss/javascript/integrations/chat)。

### 基础URL或代理

对于许多聊天模型集成，您可以配置API请求的基础URL，这允许您使用具有OpenAI兼容API的模型提供商或使用代理服务器。

:::: details <Icon icon="link" style="margin-right: 8px; vertical-align: middle;" /> 基础URL

许多模型提供商提供OpenAI兼容的API（例如，[Together AI](https://www.together.ai/)、[vLLM](https://github.com/vllm-project/vllm)）。您可以通过指定适当的 `base_url` 参数，使用 `initChatModel` 与这些提供商：

```python
model = initChatModel(
    "MODEL_NAME",
    {
        modelProvider: "openai",
        baseUrl: "BASE_URL",
        apiKey: "YOUR_API_KEY",
    }
)
```

<Note>

当使用直接聊天模型类实例化时，参数名称可能因提供商而异。请查看相应的[参考文档](/oss/javascript/integrations/providers/overview)了解详情。

</Note>

::::

### 对数概率

某些模型可以通过在初始化模型时设置 `logprobs` 参数来配置为返回令牌级别的对数概率，表示给定令牌的可能性：

```typescript
const model = new ChatOpenAI({
    model: "gpt-4o",
    logprobs: true,
});

const responseMessage = await model.invoke("为什么鹦鹉会说话？");

responseMessage.response_metadata.logprobs.content.slice(0, 5);
```

### 令牌使用情况

许多模型提供商将令牌使用情况信息作为调用响应的一部分返回。当可用时，此信息将包含在相应模型生成的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 对象上。有关更多详细信息，请参阅[消息](/oss/javascript/langchain/messages)指南。

<Note>

一些提供商API，特别是OpenAI和Azure OpenAI聊天补全，要求用户选择在流式上下文中接收令牌使用情况数据。有关详细信息，请参阅集成指南的[流式使用情况元数据](/oss/javascript/integrations/chat/openai#streaming-usage-metadata)部分。

</Note>

### 调用配置

调用模型时，您可以通过 `config` 参数使用 <a href="https://reference.langchain.com/javascript/interfaces/_langchain_core.runnables.RunnableConfig.html" target="_blank" rel="noreferrer" class="link"><code>RunnableConfig</code></a> 对象传递额外的配置。这提供了对执行行为、回调和元数据跟踪的运行时控制。

常见的配置选项包括：

```typescript [带有配置的调用]
const response = await model.invoke(
    "讲个笑话",
    {
        runName: "joke_generation",      // 自定义此次运行的名称
        tags: ["幽默", "演示"],            // 用于分类的标签
        metadata: {"user_id": "123"},     // 自定义元数据
        callbacks: [my_callback_handler], // 回调处理器
    }
)
```

这些配置值在以下情况下特别有用：
- 使用 [LangSmith](https://docs.langchain.com/langsmith/home) 跟踪进行调试
- 实现自定义日志记录或监控
- 控制生产环境中的资源使用
- 跨复杂管道跟踪调用

:::: details 关键配置属性

<ParamField body="runName" type="string">

在日志和跟踪中标识此特定调用。不被子调用继承。

</ParamField>

<ParamField body="tags" type="string[]">

标签，被所有子调用继承，用于在调试工具中进行过滤和组织。

</ParamField>

<ParamField body="metadata" type="object">

自定义键值对，用于跟踪额外的上下文，被所有子调用继承。

</ParamField>

<ParamField body="maxConcurrency" type="number">

控制在使用 `batch()` 时的最大并行调用数。

</ParamField>

<ParamField body="callbacks" type="CallbackHandler[]">

用于在执行期间监控和响应事件的处理程序。

</ParamField>

<ParamField body="recursion_limit" type="number">

链的最大递归深度，以防止复杂管道中的无限循环。

</ParamField>

::::

<Tip>

有关所有支持的属性，请参阅完整的 <a href="https://reference.langchain.com/javascript/interfaces/_langchain_core.runnables.RunnableConfig.html" target="_blank" rel="noreferrer" class="link"><code>RunnableConfig</code></a> 参考。

</Tip>

