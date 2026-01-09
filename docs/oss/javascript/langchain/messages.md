---
title: 消息
---


消息是 LangChain 中模型上下文的基本单元。它们代表模型的输入和输出，承载着与 LLM 交互时表示对话状态所需的内容和元数据。

消息是包含以下内容的对象：

* <Icon icon="user" :size="16" /> [**角色**](#message-types) - 标识消息类型（例如 `system`、`user`）
* <Icon icon="folder-closed" :size="16" /> [**内容**](#message-content) - 表示消息的实际内容（如文本、图像、音频、文档等）
* <Icon icon="tag" :size="16" /> [**元数据**](#message-metadata) - 可选字段，例如响应信息、消息 ID 和令牌使用情况

LangChain 提供了一个适用于所有模型提供商的标准消息类型，确保无论调用哪个模型，行为都保持一致。

## 基本用法

使用消息最简单的方法是创建消息对象，并在[调用](/oss/langchain/models#invocation)模型时将其传递给模型。

```typescript
import { initChatModel, HumanMessage, SystemMessage } from "langchain";

const model = await initChatModel("gpt-5-nano");

const systemMsg = new SystemMessage("You are a helpful assistant.");
const humanMsg = new HumanMessage("Hello, how are you?");

const messages = [systemMsg, humanMsg];
const response = await model.invoke(messages);  // Returns AIMessage
```

### 文本提示

文本提示是字符串 - 非常适合不需要保留对话历史的简单生成任务。

```typescript
const response = await model.invoke("Write a haiku about spring");
```

**在以下情况下使用文本提示：**
* 您有一个单一的、独立的请求
* 您不需要对话历史
* 您希望代码复杂度最低

### 消息提示

或者，您可以通过提供消息对象列表，将消息列表传递给模型。

```typescript
import { SystemMessage, HumanMessage, AIMessage } from "langchain";

const messages = [
  new SystemMessage("You are a poetry expert"),
  new HumanMessage("Write a haiku about spring"),
  new AIMessage("Cherry blossoms bloom..."),
];
const response = await model.invoke(messages);
```

**在以下情况下使用消息提示：**
* 管理多轮对话
* 处理多模态内容（图像、音频、文件）
* 包含系统指令

### 字典格式

您也可以直接以 OpenAI 聊天补全格式指定消息。

```typescript
const messages = [
  { role: "system", content: "You are a poetry expert" },
  { role: "user", content: "Write a haiku about spring" },
  { role: "assistant", content: "Cherry blossoms bloom..." },
];
const response = await model.invoke(messages);
```

## 消息类型

- <Icon icon="gear" :size="16" /> [系统消息](#system-message) - 告诉模型如何行为，并为交互提供上下文
- <Icon icon="user" :size="16" /> [人类消息](#human-message) - 代表用户输入和与模型的交互
- <Icon icon="robot" :size="16" /> [AI 消息](#ai-message) - 模型生成的响应，包括文本内容、工具调用和元数据
- <Icon icon="wrench" :size="16" /> [工具消息](#tool-message) - 代表[工具调用](/oss/langchain/models#tool-calling)的输出

### 系统消息

<a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.SystemMessage.html" target="_blank" rel="noreferrer" class="link"><code>SystemMessage</code></a> 代表一组初始指令，用于引导模型的行为。您可以使用系统消息来设定语气、定义模型的角色，并为响应建立指导原则。

```typescript [Basic instructions]
import { SystemMessage, HumanMessage, AIMessage } from "langchain";

const systemMsg = new SystemMessage("You are a helpful coding assistant.");

const messages = [
  systemMsg,
  new HumanMessage("How do I create a REST API?"),
];
const response = await model.invoke(messages);
```

```typescript [Detailed persona]
import { SystemMessage, HumanMessage } from "langchain";

const systemMsg = new SystemMessage(`
You are a senior TypeScript developer with expertise in web frameworks.
Always provide code examples and explain your reasoning.
Be concise but thorough in your explanations.
`);

const messages = [
  systemMsg,
  new HumanMessage("How do I create a REST API?"),
];
const response = await model.invoke(messages);
```

---

### 人类消息

<a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.HumanMessage.html" target="_blank" rel="noreferrer" class="link"><code>HumanMessage</code></a> 代表用户输入和交互。它们可以包含文本、图像、音频、文件以及任何其他数量的多模态[内容](#message-content)。

#### 文本内容

```typescript [Message object]
const response = await model.invoke([
  new HumanMessage("What is machine learning?"),
]);
```

```typescript [String shortcut]
const response = await model.invoke("What is machine learning?");
```

#### 消息元数据

```typescript [Add metadata]
const humanMsg = new HumanMessage({
  content: "Hello!",
  name: "alice",
  id: "msg_123",
});
```

<Note>

`name` 字段的行为因提供商而异 - 有些将其用于用户识别，有些则忽略它。要检查，请参阅模型提供商的[参考文档](https://reference.langchain.com/python/integrations/)。

</Note>

---

### AI 消息

<a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 代表模型调用的输出。它们可以包含多模态数据、工具调用以及稍后可以访问的特定于提供商的元数据。

```typescript
const response = await model.invoke("Explain AI");
console.log(typeof response);  // AIMessage
```

<a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 对象在调用模型时由模型返回，其中包含响应中的所有关联元数据。

提供商对不同类型消息的权重/上下文处理方式不同，这意味着有时手动创建一个新的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 对象并将其插入到消息历史中，就好像它来自模型一样，会很有帮助。

```typescript
import { AIMessage, SystemMessage, HumanMessage } from "langchain";

const aiMsg = new AIMessage("I'd be happy to help you with that question!");

const messages = [
  new SystemMessage("You are a helpful assistant"),
  new HumanMessage("Can you help me?"),
  aiMsg,  // Insert as if it came from the model
  new HumanMessage("Great! What's 2+2?")
]

const response = await model.invoke(messages);
```

:::: details 属性

<ParamField path="text" type="string">

消息的文本内容。

</ParamField>

<ParamField path="content" type="string | ContentBlock[]">

消息的原始内容。

</ParamField>

<ParamField path="content_blocks" type="ContentBlock.Standard[]">

消息的标准化内容块。（参见[内容](#message-content)）

</ParamField>

<ParamField path="tool_calls" type="ToolCall[] | None">

模型进行的工具调用。

如果未调用任何工具，则为空。

</ParamField>

<ParamField path="id" type="string">

消息的唯一标识符（由 LangChain 自动生成或在提供商响应中返回）

</ParamField>

<ParamField path="usage_metadata" type="UsageMetadata | None">

消息的使用元数据，在可用时可以包含令牌计数。参见 <a href="https://reference.langchain.com/javascript/types/_langchain_core.messages.UsageMetadata.html" target="_blank" rel="noreferrer" class="link"><code>UsageMetadata</code></a>。

</ParamField>

<ParamField path="response_metadata" type="ResponseMetadata | None">

消息的响应元数据。

</ParamField>

::::

#### 工具调用

当模型进行[工具调用](/oss/langchain/models#tool-calling)时，它们会包含在 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 中：

```typescript
const modelWithTools = model.bindTools([getWeather]);
const response = await modelWithTools.invoke("What's the weather in Paris?");

for (const toolCall of response.tool_calls) {
  console.log(`Tool: ${toolCall.name}`);
  console.log(`Args: ${toolCall.args}`);
  console.log(`ID: ${toolCall.id}`);
}
```

其他结构化数据，例如推理或引用，也可能出现在消息[内容](/oss/langchain/messages#message-content)中。

#### 令牌使用情况

<a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 可以在其 <a href="https://reference.langchain.com/javascript/types/_langchain_core.messages.UsageMetadata.html" target="_blank" rel="noreferrer" class="link"><code>usage_metadata</code></a> 字段中保存令牌计数和其他使用元数据：

```typescript
import { initChatModel } from "langchain";

const model = await initChatModel("gpt-5-nano");

const response = await model.invoke("Hello!");
console.log(response.usage_metadata);
```

```json
{
  "output_tokens": 304,
  "input_tokens": 8,
  "total_tokens": 312,
  "input_token_details": {
    "cache_read": 0
  },
  "output_token_details": {
    "reasoning": 256
  }
}
```

详情请参见 <a href="https://reference.langchain.com/javascript/types/_langchain_core.messages.UsageMetadata.html" target="_blank" rel="noreferrer" class="link"><code>UsageMetadata</code></a>。

#### 流式传输和分块

在流式传输期间，您将收到可以组合成完整消息对象的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessageChunk.html" target="_blank" rel="noreferrer" class="link"><code>AIMessageChunk</code></a> 对象：

::: code-group

```typescript
import { AIMessageChunk } from "langchain";

let finalChunk: AIMessageChunk | undefined;
for (const chunk of chunks) {
  finalChunk = finalChunk ? finalChunk.concat(chunk) : chunk;
}
```

:::

<Note>

了解更多：
- [从聊天模型流式传输令牌](/oss/langchain/models#stream)
- [从代理流式传输令牌和/或步骤](/oss/langchain/streaming)

</Note>

---

### 工具消息

对于支持[工具调用](/oss/langchain/models#tool-calling)的模型，AI 消息可以包含工具调用。工具消息用于将单个工具执行的结果传递回模型。

[工具](/oss/langchain/tools)可以直接生成 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a> 对象。下面，我们展示一个简单的例子。更多信息请参阅[工具指南](/oss/langchain/tools)。

```typescript
import { AIMessage, ToolMessage } from "langchain";

const aiMessage = new AIMessage({
  content: [],
  tool_calls: [{
    name: "get_weather",
    args: { location: "San Francisco" },
    id: "call_123"
  }]
});

const toolMessage = new ToolMessage({
  content: "Sunny, 72°F",
  tool_call_id: "call_123"
});

const messages = [
  new HumanMessage("What's the weather in San Francisco?"),
  aiMessage,  // Model's tool call
  toolMessage,  // Tool execution result
];

const response = await model.invoke(messages);  // Model processes the result
```

:::: details 属性

<ParamField path="content" type="string" required>

工具调用的字符串化输出。

</ParamField>

<ParamField path="tool_call_id" type="string" required>

此消息所响应的工具调用的 ID。必须与 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 中工具调用的 ID 匹配。

</ParamField>

<ParamField path="name" type="string" required>

被调用工具的名称。

</ParamField>

<ParamField path="artifact" type="dict">

不会发送给模型但可以通过编程方式访问的附加数据。

</ParamField>

::::

<Note>

`artifact` 字段存储不会发送给模型但可以通过编程方式访问的补充数据。这对于存储原始结果、调试信息或用于下游处理的数据非常有用，而不会使模型的上下文变得混乱。

:::: details 示例：使用 artifact 存储检索元数据

例如，一个[检索](/oss/langchain/retrieval)工具可以检索文档中的一段文本供模型参考。消息 `content` 包含模型将引用的文本，而 `artifact` 可以包含文档标识符或其他应用程序可以使用的元数据（例如，用于渲染页面）。参见下面的示例：

```typescript
import { ToolMessage } from "langchain";

// Artifact available downstream
const artifact = { document_id: "doc_123", page: 0 };

const toolMessage = new ToolMessage({
  content: "It was the best of times, it was the worst of times.",
  tool_call_id: "call_123",
  name: "search_books",
  artifact
});
```

有关使用 LangChain 构建检索[代理](/oss/langchain/agents)的端到端示例，请参阅 [RAG 教程](/oss/langchain/rag)。

::::

</Note>

---

## 消息内容

您可以将消息的内容视为发送给模型的数据负载。消息有一个 `content` 属性，它是松散类型的，支持字符串和无类型对象（例如字典）的列表。这允许在 LangChain 聊天模型中直接支持提供商原生结构，例如[多模态](#multimodal)内容和其他数据。

另外，LangChain 为文本、推理、引用、多模态数据、服务器端工具调用和其他消息内容提供了专用的内容类型。请参见下面的[内容块](#standard-content-blocks)。

LangChain 聊天模型接受 `content` 属性中的消息内容。

这可能包含：

1. 一个字符串
2. 提供商原生格式的内容块列表
3. [LangChain 标准内容块](#standard-content-blocks)列表

请参见下面使用[多模态](#multimodal)输入的示例：

```typescript
import { HumanMessage } from "langchain";

// String content
const humanMessage = new HumanMessage("Hello, how are you?");

// Provider-native format (e.g., OpenAI)
const humanMessage = new HumanMessage({
  content: [
    { type: "text", text: "Hello, how are you?" },
    {
      type: "image_url",
      image_url: { url: "https://example.com/image.jpg" },
    },
  ],
});

// List of standard content blocks
const humanMessage = new HumanMessage({
  contentBlocks: [
    { type: "text", text: "Hello, how are you?" },
    { type: "image", url: "https://example.com/image.jpg" },
  ],
});
```

### 标准内容块

LangChain 提供了一个适用于所有提供商的消息内容标准表示。

消息对象实现了一个 `contentBlocks` 属性，该属性将惰性地将 `content` 属性解析为标准化的、类型安全的表示。例如，从 [`ChatAnthropic`](/oss/integrations/chat/anthropic) 或 [`ChatOpenAI`](/oss/integrations/chat/openai) 生成的消息将包含各自提供商格式的 `thinking` 或 `reasoning` 块，但可以惰性地解析为一致的 [`ReasoningContentBlock`](#content-block-reference) 表示：

<Tabs>

<Tab title="Anthropic">

```typescript
import { AIMessage } from "@langchain/core/messages";

const message = new AIMessage({
  content: [
    {
      "type": "thinking",
      "thinking": "...",
      "signature": "WaUjzkyp...",
    },
    {
      "type":"text",
      "text": "...",
      "id": "msg_abc123",
    },
  ],
  response_metadata: { model_provider: "anthropic" },
});

console.log(message.contentBlocks);
```

</Tab>

<Tab title="OpenAI">

```typescript
import { AIMessage } from "@langchain/core/messages";

const message = new AIMessage({
  content: [
    {
      "type": "reasoning",
      "id": "rs_abc123",
      "summary": [
        {"type": "summary_text", "text": "summary 1"},
        {"type": "summary_text", "text": "summary 2"},
      ],
    },
    {"type": "text", "text": "..."},
  ],
  response_metadata: { model_provider: "openai" },
});

console.log(message.contentBlocks);
```

</Tab>

</Tabs>

请参阅[集成指南](/oss/integrations/providers/overview)以开始使用您选择的推理提供商。

<Note>

<strong>序列化标准内容</strong>

如果 LangChain 之外的应用程序需要访问标准内容块表示，您可以选择将内容块存储在消息内容中。

为此，您可以将 `LC_OUTPUT_VERSION` 环境变量设置为 `v1`。或者，使用 `outputVersion: "v1"` 初始化任何聊天模型：

```typescript
import { initChatModel } from "langchain";

const model = await initChatModel(
  "gpt-5-nano",
  { outputVersion: "v1" }
);
```

</Note>

### 多模态

**多模态**指的是处理不同形式数据的能力，例如文本、音频、图像和视频。LangChain 包含了可用于所有提供商的这些数据的标准类型。

[聊天模型](/oss/langchain/models)可以接受多模态数据作为输入并生成多模态数据作为输出。下面我们展示包含多模态数据的输入消息的简短示例。

<Note>

额外的键可以包含在内容块的顶层或嵌套在 `"extras": {"key": value}` 中。

例如，[OpenAI](/oss/integrations/chat/openai#pdfs) 和 [AWS Bedrock Converse](/oss/integrations/chat/bedrock) 要求 PDF 文件具有文件名。有关详细信息，请参阅您所选模型的[提供商页面](/oss/integrations/providers/overview)。

</Note>

::: code-group

```typescript [Image input]
// From URL
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this image." },
    {
      type: "image",
      source_type: "url",
      url: "https://example.com/path/to/image.jpg"
    },
  ],
});

// From base64 data
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this image." },
    {
      type: "image",
      source_type: "base64",
      data: "AAAAIGZ0eXBtcDQyAAAAAGlzb21tcDQyAAACAGlzb2...",
    },
  ],
});

// From provider-managed File ID
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this image." },
    { type: "image", source_type: "id", id: "file-abc123" },
  ],
});
```

```typescript [PDF document input]
// From URL
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this document." },
    { type: "file", source_type: "url", url: "https://example.com/path/to/document.pdf" },
  ],
});

// From base64 data
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this document." },
    {
      type: "file",
      source_type: "base64",
      data: "AAAAIGZ0eXBtcDQyAAAAAGlzb21tcDQyAAACAGlzb2...",
    },
  ],
});

// From provider-managed File ID
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this document." },
    { type: "file", source_type: "id", id: "file-abc123" },
  ],
});
```

```typescript [Audio input]
// From base64 data
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this audio." },
    {
      type: "audio",
      source_type: "base64",
      data: "AAAAIGZ0eXBtcDQyAAAAAGlzb21tcDQyAAACAGlzb2...",
    },
  ],
});

// From provider-managed File ID
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this audio." },
    { type: "audio", source_type: "id", id: "file-abc123" },
  ],
});
```

```typescript [Video input]
// From base64 data
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this video." },
    {
      type: "video",
      source_type: "base64",
      data: "AAAAIGZ0eXBtcDQyAAAAAGlzb21tcDQyAAACAGlzb2...",
    },
  ],
});

// From provider-managed File ID
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this video." },
    { type: "video", source_type: "id", id: "file-abc123" },
  ],
});
```

:::

<Warning>

并非所有模型都支持所有文件类型。请检查模型提供商的[参考文档](https://reference.langchain.com/python/integrations/)以了解支持的格式和大小限制。

</Warning>

### 内容块参考

内容块（在创建消息或访问 `contentBlocks` 字段时）表示为类型化对象的列表。列表中的每个项目必须遵循以下块类型之一：

:::: details <Icon icon="cube" style="margin-right: 8px; vertical-align: middle;" /> 核心

::: details <Icon icon="text" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Text

<strong>用途：</strong> 标准文本输出

<ParamField body="type" type="string" required>

始终为 `"text"`

</ParamField>

<ParamField body="text" type="string" required>

文本内容

</ParamField>

<ParamField body="annotations" type="Citation[]">

文本的注释列表

</ParamField>

<strong>示例：</strong>

```typescript
{
    type: "text",
    text: "Hello world",
    annotations: []
}
```

:::

::: details <Icon icon="brain" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Reasoning

<strong>用途：</strong> 模型推理步骤

<ParamField body="type" type="string" required>

始终为 `"reasoning"`

</ParamField>

<ParamField body="reasoning" type="string" required>

推理内容

</ParamField>

<strong>示例：</strong>

```typescript
{
    type: "reasoning",
    reasoning: "The user is asking about..."
}
```

:::

::::

:::: details <Icon icon="images" style="margin-right: 8px; vertical-align: middle;" /> 多模态

::: details <Icon icon="image" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Multimodal.Image

<strong>用途：</strong> 图像数据

<ParamField body="type" type="string" required>

始终为 `"image"`

</ParamField>

<ParamField body="url" type="string">

指向图像位置的 URL。

</ParamField>

<ParamField body="data" type="string">

Base64 编码的图像数据。

</ParamField>

<ParamField body="fileId" type="string">

指向外部文件存储系统中图像的引用（例如，OpenAI 或 Anthropic 的 Files API）。

</ParamField>

<ParamField body="mimeType" type="string">

图像 [MIME 类型](https://www.iana.org/assignments/media-types/media-types.xhtml#image)（例如，`image/jpeg`、`image/png`）。对于 base64 数据是必需的。

</ParamField>

:::

::: details <Icon icon="volume-high" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Multimodal.Audio

<strong>用途：</strong> 音频数据

<ParamField body="type" type="string" required>

始终为 `"audio"`

</ParamField>

<ParamField body="url" type="string">

指向音频位置的 URL。

</ParamField>

<ParamField body="data" type="string">

Base64 编码的音频数据。

</ParamField>

<ParamField body="fileId" type="string">

指向外部文件存储系统中音频文件的引用（例如，OpenAI 或 Anthropic 的 Files API）。

</ParamField>

<ParamField body="mimeType" type="string">

音频 [MIME 类型](https://www.iana.org/assignments/media-types/media-types.xhtml#audio)（例如，`audio/mpeg`、`audio/wav`）。对于 base64 数据是必需的。

</ParamField>

:::

::: details <Icon icon="video" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Multimodal.Video

<strong>用途：</strong> 视频数据

<ParamField body="type" type="string" required>

始终为 `"video"`

</ParamField>

<ParamField body="url" type="string">

指向视频位置的 URL。

</ParamField>

<ParamField body="data" type="string">

Base64 编码的视频数据。

</ParamField>

<ParamField body="fileId" type="string">

指向外部文件存储系统（例如，OpenAI 或 Anthropic 的 Files API）中视频文件的引用。

</ParamField>

<ParamField body="mimeType" type="string">

视频 [MIME 类型](https://www.iana.org/assignments/media-types/media-types.xhtml#video)（例如，`video/mp4`、`video/webm`）。对于 base64 数据是必需的。

</ParamField>

:::

::: details <Icon icon="file" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Multimodal.File

<strong>用途：</strong> 通用文件（PDF 等）

<ParamField body="type" type="string" required>

始终为 `"file"`

</ParamField>

<ParamField body="url" type="string">

指向文件位置的 URL。

</ParamField>

<ParamField body="data" type="string">

Base64 编码的文件数据。

</ParamField>

<ParamField body="fileId" type="string">

指向外部文件存储系统（例如，OpenAI 或 Anthropic 的 Files API）中文件的引用。

</ParamField>

<ParamField body="mimeType" type="string">

文件 [MIME 类型](https://www.iana.org/assignments/media-types/media-types.xhtml)（例如，`application/pdf`）。对于 base64 数据是必需的。

</ParamField>

:::

::: details <Icon icon="align-left" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Multimodal.PlainText

<strong>用途：</strong> 文档文本（`.txt`、`.md`）

<ParamField body="type" type="string" required>

始终为 `"text-plain"`

</ParamField>

<ParamField body="text" type="string" required>

文本内容

</ParamField>

<ParamField body="title" type="string">

文本内容的标题

</ParamField>

<ParamField body="mimeType" type="string">

文本的 [MIME 类型](https://www.iana.org/assignments/media-types/media-types.xhtml)（例如，`text/plain`、`text/markdown`）

</ParamField>

:::

::::

:::: details <Icon icon="wrench" style="margin-right: 8px; vertical-align: middle;" /> 工具调用

::: details <Icon icon="function" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Tools.ToolCall

<strong>用途：</strong> 函数调用

<ParamField body="type" type="string" required>

始终为 `"tool_call"`

</ParamField>

<ParamField body="name" type="string" required>

要调用的工具名称

</ParamField>

<ParamField body="args" type="object" required>

传递给工具的参数

</ParamField>

<ParamField body="id" type="string" required>

此工具调用的唯一标识符

</ParamField>

<strong>示例：</strong>

```typescript
{
    type: "tool_call",
    name: "search",
    args: { query: "weather" },
    id: "call_123"
}
```

:::

::: details <Icon icon="puzzle-piece" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Tools.ToolCallChunk

<strong>用途：</strong> 流式工具片段

<ParamField body="type" type="string" required>

始终为 `"tool_call_chunk"`

</ParamField>

<ParamField body="name" type="string">

正在被调用的工具名称

</ParamField>

<ParamField body="args" type="string">

部分工具参数（可能是未完成的 JSON）

</ParamField>

<ParamField body="id" type="string">

工具调用标识符

</ParamField>

<ParamField body="index" type="number | string" required>

此片段在流中的位置

</ParamField>

:::

::: details <Icon icon="triangle-exclamation" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Tools.InvalidToolCall

<strong>用途：</strong> 格式错误的调用

<ParamField body="type" type="string" required>

始终为 `"invalid_tool_call"`

</ParamField>

<ParamField body="name" type="string">

调用失败的工具名称

</ParamField>

<ParamField body="args" type="string">

解析失败的原始参数

</ParamField>

<ParamField body="error" type="string" required>

错误描述

</ParamField>

<strong>常见错误：</strong> 无效的 JSON、缺少必填字段

:::

::::

:::: details <Icon icon="server" style="margin-right: 8px; vertical-align: middle;" /> 服务端工具执行

::: details <Icon icon="wrench" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Tools.ServerToolCall

<strong>用途：</strong> 在服务端执行的工具调用。

<ParamField body="type" type="string" required>

始终为 `"server_tool_call"`

</ParamField>

<ParamField body="id" type="string" required>

与工具调用关联的标识符。

</ParamField>

<ParamField body="name" type="string" required>

要调用的工具名称。

</ParamField>

<ParamField body="args" type="string" required>

部分工具参数（可能是未完成的 JSON）

</ParamField>

:::

::: details <Icon icon="puzzle-piece" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Tools.ServerToolCallChunk

<strong>用途：</strong> 流式服务端工具调用片段

<ParamField body="type" type="string" required>

始终为 `"server_tool_call_chunk"`

</ParamField>

<ParamField body="id" type="string">

与工具调用关联的标识符。

</ParamField>

<ParamField body="name" type="string">

正在被调用的工具名称

</ParamField>

<ParamField body="args" type="string">

部分工具参数（可能是未完成的 JSON）

</ParamField>

<ParamField body="index" type="number | string">

此片段在流中的位置

</ParamField>

:::

::: details <Icon icon="box-open" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.Tools.ServerToolResult

<strong>用途：</strong> 搜索结果

<ParamField body="type" type="string" required>

始终为 `"server_tool_result"`

</ParamField>

<ParamField body="tool_call_id" type="string" required>

对应服务端工具调用的标识符。

</ParamField>

<ParamField body="id" type="string">

与服务端工具结果关联的标识符。

</ParamField>

<ParamField body="status" type="string" required>

服务端工具的执行状态。`"success"` 或 `"error"`。

</ParamField>

<ParamField body="output">

已执行工具的输出。

</ParamField>

:::

::::

:::: details <Icon icon="plug" style="margin-right: 8px; vertical-align: middle;" /> 供应商特定块

::: details <Icon icon="asterisk" style="margin-right: 8px; vertical-align: middle;" /> ContentBlock.NonStandard

<strong>用途：</strong> 供应商特定的逃生舱口

<ParamField body="type" type="string" required>

始终为 `"non_standard"`

</ParamField>

<ParamField body="value" type="object" required>

供应商特定的数据结构

</ParamField>

<strong>用法：</strong> 用于实验性或供应商独有的功能

:::

其他供应商特定的内容类型可以在每个模型提供商的[参考文档](/oss/integrations/providers/overview)中找到。

::::

上述每个内容块在导入 <a href="https://reference.langchain.com/javascript/types/_langchain_core.messages.MessageContent.html" target="_blank" rel="noreferrer" class="link"><code>ContentBlock</code></a> 类型时都可以作为独立的类型进行寻址。

```typescript
import { ContentBlock } from "langchain";

// Text block
const textBlock: ContentBlock.Text = {
    type: "text",
    text: "Hello world",
}

// Image block
const imageBlock: ContentBlock.Multimodal.Image = {
    type: "image",
    url: "https://example.com/image.png",
    mimeType: "image/png",
}
```

<Tip>

请在 <a href="https://reference.langchain.com/javascript/modules/_langchain_core.messages.html" target="_blank" rel="noreferrer" class="link">API 参考</a> 中查看规范的类型定义。

</Tip>

<Info>

内容块是 LangChain v1 中作为消息的新属性引入的，旨在跨供应商标准化内容格式，同时保持与现有代码的向后兼容性。

内容块不是 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.BaseMessage.html#content" target="_blank" rel="noreferrer" class="link"><code>content</code></a> 属性的替代品，而是一个新的属性，可用于以标准化格式访问消息的内容。

</Info>

## 与聊天模型一起使用

[聊天模型](/oss/langchain/models) 接受一系列消息对象作为输入，并返回一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.AIMessage.html" target="_blank" rel="noreferrer" class="link"><code>AIMessage</code></a> 作为输出。交互通常是无状态的，因此一个简单的对话循环涉及使用不断增长的消息列表来调用模型。

请参考以下指南了解更多信息：

- 用于[持久化和管理对话历史记录](/oss/langchain/short-term-memory)的内置功能
- 管理上下文窗口的策略，包括[修剪和总结消息](/oss/langchain/short-term-memory#common-patterns)

