---
title: 聊天模型
---
[聊天模型](/oss/langchain/models) 是一种语言模型，它以一系列[消息](/oss/langchain/messages)作为输入，并返回消息作为输出 <Tooltip tip="较旧的模型不遵循聊天模型接口，而是使用一个以字符串为输入并返回字符串为输出的接口。这些模型通常在其名称中不包含前缀 'Chat' 或包含后缀 'LLM'。">（与纯文本相对）</Tooltip>。

## 安装与使用

<Tip>

关于安装 LangChain 包的通用说明，请参阅[此章节](/oss/langchain/install)。

</Tip>

:::: details OpenAI

安装：

::: code-group

```bash [npm]
npm i @langchain/openai
```
```bash [yarn]
yarn add @langchain/openai
```
```bash [pnpm]
pnpm add @langchain/openai
```

:::

添加环境变量：

```bash
OPENAI_API_KEY=your-api-key
```

实例化模型：

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
```
```javascript
await model.invoke("Hello, world!")
```

::::

:::: details Anthropic

安装：

::: code-group

```bash [npm]
npm i @langchain/anthropic
```
```bash [yarn]
yarn add @langchain/anthropic
```
```bash [pnpm]
pnpm add @langchain/anthropic
```

:::

添加环境变量：

```bash
ANTHROPIC_API_KEY=your-api-key
```

实例化模型：

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
model: "claude-3-sonnet-20240620",
temperature: 0
});
```
```javascript
await model.invoke("Hello, world!")
```

::::

:::: details Google Gemini

安装：

::: code-group

```bash [npm]
npm i @langchain/google-genai
```

```bash [yarn]
yarn add @langchain/google-genai
```
```bash [pnpm]
pnpm add @langchain/google-genai
```

:::

添加环境变量：

```bash
GOOGLE_API_KEY=your-api-key
```

实例化模型：

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
modelName: "gemini-2.5-flash-lite",
temperature: 0
});
```
```javascript
await model.invoke("Hello, world!")
```

::::

:::: details Google VertexAI

安装：

::: code-group

```bash [npm]
npm i @langchain/google-vertexai
```

```bash [yarn]
yarn add @langchain/google-vertexai
```

```bash [pnpm]
pnpm add @langchain/google-vertexai
```

:::

添加环境变量：

```bash
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
```

实例化模型：

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const model = new ChatVertexAI({
model: "gemini-2.5-flash",
temperature: 0
});
```
```javascript
await model.invoke("Hello, world!")
```

::::

:::: details MistralAI

安装：

::: code-group

```bash [npm]
npm i @langchain/mistralai
```

```bash [yarn]
yarn add @langchain/mistralai
```

```bash [pnpm]
pnpm add @langchain/mistralai
```

:::

添加环境变量：

```bash
MISTRAL_API_KEY=your-api-key
```

实例化模型：

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
model: "mistral-large-latest",
temperature: 0
});
```
```javascript
await model.invoke("Hello, world!")
```

::::

:::: details FireworksAI

安装：

::: code-group

```bash [npm]
npm i @langchain/community
```

```bash [yarn]
yarn add @langchain/community
```

```bash [pnpm]
pnpm add @langchain/community
```

:::

添加环境变量：

```bash
FIREWORKS_API_KEY=your-api-key
```

实例化模型：

```typescript
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const model = new ChatFireworks({
model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
temperature: 0
});
```
```javascript
await model.invoke("Hello, world!")
```

::::

:::: details Groq

安装：

::: code-group

```bash [npm]
npm i @langchain/groq
```
```bash [yarn]
yarn add @langchain/groq
```
```bash [pnpm]
pnpm add @langchain/groq
```

:::

添加环境变量：

```bash
GROQ_API_KEY=your-api-key
```

实例化模型：

```typescript
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
model: "llama-3.3-70b-versatile",
temperature: 0
});
```
```javascript
await model.invoke("Hello, world!")
```

::::

## 特色模型

<Info>

<strong>虽然这些 LangChain 类支持所指示的高级功能</strong>，但你可能需要查阅特定提供商的文档，以了解哪些托管模型或后端支持该功能。

</Info>

| 模型 | 流式传输 | [工具调用](/oss/langchain/tools/) | [`withStructuredOutput()`](/oss/langchain/structured-output#the-.withstructuredoutput-method) | [多模态](/oss/langchain/messages#multimodal) |
|-|-|-|-|-|
| [`ChatOpenAI`](/oss/integrations/chat/openai/) | ✅ | ✅ | ✅ | ✅ |
| [`ChatAnthropic`](/oss/integrations/chat/anthropic/) | ✅ | ✅ | ✅ | ✅ |
| [`ChatGoogleGenerativeAI`](/oss/integrations/chat/google_generative_ai/) | ✅ | ✅ | ✅ | ✅ |
| [`ChatVertexAI`](/oss/integrations/chat/google_vertex_ai/) | ✅ | ✅ | ✅ | ✅ |
| [`BedrockChat`](/oss/integrations/chat/bedrock/) | ✅ | 🟡 (仅限 Bedrock Anthropic) | 🟡 (仅限 Bedrock Anthropic) | 🟡 (仅限 Bedrock Anthropic) |
| [`ChatBedrockConverse`](/oss/integrations/chat/bedrock_converse/) | ✅ | ✅ | ✅ | ✅ |
| [`ChatCloudflareWorkersAI`](/oss/integrations/chat/cloudflare_workersai/) | ✅ | ❌ | ❌ | ❌ |
| [`ChatCohere`](/oss/integrations/chat/cohere/) | ✅ | ✅ | ✅ | ✅ |
| [`ChatFireworks`](/oss/integrations/chat/fireworks/) | ✅ | ✅ | ✅ | ✅ |
| [`ChatGroq`](/oss/integrations/chat/groq/) | ✅ | ✅ | ✅ | ✅ |
| [`ChatMistralAI`](/oss/integrations/chat/mistral/) | ✅ | ✅ | ✅ | ✅ |
| [`ChatOllama`](/oss/integrations/chat/ollama/) | ✅ | ✅ | ✅ | ✅ |
| [`ChatTogetherAI`](/oss/integrations/chat/togetherai/) | ✅ | ✅ | ✅ | ✅ |
| [`ChatXAI`](/oss/integrations/chat/xai/) | ✅ | ✅ | ✅ | ❌ |

## 聊天补全 API

某些模型提供商提供与 OpenAI（旧版）[聊天补全 API](https://platform.openai.com/docs/guides/completions) 兼容的端点。在这种情况下，你可以使用带有自定义 `base_url` 的 [`ChatOpenAI`](/oss/integrations/chat/openai) 来连接到这些端点。请注意，基于聊天补全 API 构建的功能可能不被 `ChatOpenAI` 完全支持；在这种情况下，请考虑使用特定于提供商的类（如果可用）。

:::: details 示例：OpenRouter

要使用 OpenRouter，你需要注册一个账户并获取一个 [API 密钥](https://openrouter.ai/docs/api-reference/authentication)。

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
    model: "...", // 指定 OpenRouter 上可用的模型
    configuration: {
    apiKey: "OPENROUTER_API_KEY",
    baseURL: "https://openrouter.ai/api/v1",
    }
});
```

更多详情请参阅 [OpenRouter 文档](https://openrouter.ai/docs/quickstart)。

::::

## 所有聊天模型

<Columns :cols="3">

<Card
title="Alibaba Tongyi"
icon="link"
href="/oss/integrations/chat/alibaba_tongyi"
arrow="true"
cta="查看指南"
/>
<Card
title="Anthropic"
icon="link"
href="/oss/integrations/chat/anthropic"
arrow="true"
cta="查看指南"
/>
<Card
title="Arcjet Redact"
icon="link"
href="/oss/integrations/chat/arcjet"
arrow="true"
cta="查看指南"
/>
<Card
title="Azure OpenAI"
icon="link"
href="/oss/integrations/chat/azure"
arrow="true"
cta="查看指南"
/>
<Card
title="Baidu Qianfan"
icon="link"
href="/oss/integrations/chat/baidu_qianfan"
arrow="true"
cta="查看指南"
/>
<Card
title="Amazon Bedrock"
icon="link"
href="/oss/integrations/chat/bedrock"
arrow="true"
cta="查看指南"
/>
<Card
title="Amazon Bedrock Converse"
icon="link"
href="/oss/integrations/chat/bedrock_converse"
arrow="true"
cta="查看指南"
/>
<Card
title="Cerebras"
icon="link"
href="/oss/integrations/chat/cerebras"
arrow="true"
cta="查看指南"
/>
<Card
title="Cloudflare Workers AI"
icon="link"
href="/oss/integrations/chat/cloudflare_workersai"
arrow="true"
cta="查看指南"
/>
<Card
title="Cohere"
icon="link"
href="/oss/integrations/chat/cohere"
arrow="true"
cta="查看指南"
/>
<Card
title="Deep Infra"
icon="link"
href="/oss/integrations/chat/deep_infra"
arrow="true"
cta="查看指南"
/>
<Card
title="DeepSeek"
icon="link"
href="/oss/integrations/chat/deepseek"
arrow="true"
cta="查看指南"
/>
<Card
title="Fake LLM"
icon="link"
href="/oss/integrations/chat/fake"
arrow="true"
cta="查看指南"
/>
<Card
title="Fireworks"
icon="link"
href="/oss/integrations/chat/fireworks"
arrow="true"
cta="查看指南"
/>
<Card
title="Friendli"
icon="link"
href="/oss/integrations/chat/friendli"
arrow="true"
cta="查看指南"
/>
<Card
title="Google GenAI"
icon="link"
href="/oss/integrations/chat/google_generative_ai"
arrow="true"
cta="查看指南"
/>
<Card
title="Google Vertex AI"
icon="link"
href="/oss/integrations/chat/google_vertex_ai"
arrow="true"
cta="查看指南"
/>
<Card
title="Groq"
icon="link"
href="/oss/integrations/chat/groq"
arrow="true"
cta="查看指南"
/>
<Card
title="IBM watsonx.ai"
icon="link"
href="/oss/integrations/chat/ibm"
arrow="true"
cta="查看指南"
/>
<Card
title="Llama CPP"
icon="link"
href="/oss/integrations/chat/llama_cpp"
arrow="true"
cta="查看指南"
/>
<Card
title="Minimax"
icon="link"
href="/oss/integrations/chat/minimax"
arrow="true"
cta="查看指南"
/>
<Card
title="MistralAI"
icon="link"
href="/oss/integrations/chat/mistral"
arrow="true"
cta="查看指南"
/>
<Card
title="Moonshot"
icon="link"
href="/oss/integrations/chat/moonshot"
arrow="true"
cta="查看指南"
/>
<Card
title="Novita AI"
icon="link"
href="/oss/integrations/chat/novita"
arrow="true"
cta="查看指南"
/>
<Card
title="Ollama"
icon="link"
href="/oss/integrations/chat/ollama"
arrow="true"
cta="查看指南"
/>
<Card
title="OpenAI"
icon="link"
href="/oss/integrations/chat/openai"
arrow="true"
cta="查看指南"
/>
<Card
title="Perplexity"
icon="link"
href="/oss/integrations/chat/perplexity"
arrow="true"
cta="查看指南"
/>
<Card
title="PremAI"
icon="link"
href="/oss/integrations/chat/premai"
arrow="true"
cta="查看指南"
/>
<Card
title="Tencent Hunyuan"
icon="link"
href="/oss/integrations/chat/tencent_hunyuan"
arrow="true"
cta="查看指南"
/>
<Card
title="Together"
icon="link"
href="/oss/integrations/chat/togetherai"
arrow="true"
cta="查看指南"
/>
<Card
title="WebLLM"
icon="link"
href="/oss/integrations/chat/web_llm"
arrow="true"
cta="查看指南"
/>
<Card
title="xAI"
icon="link"
href="/oss/integrations/chat/xai"
arrow="true"
cta="查看指南"
/>
<Card
title="YandexGPT"
icon="link"
href="/oss/integrations/chat/yandex"
arrow="true"
cta="查看指南"
/>
<Card
title="ZhipuAI"
icon="link"
href="/oss/integrations/chat/zhipuai"
arrow="true"
cta="查看指南"
/>

</Columns>

<Info>

如果你想贡献一个集成，请参阅[贡献集成](/oss/contributing#add-a-new-integration)。

</Info>

