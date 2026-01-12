---
title: 概述
---
与 [Google Cloud Platform](https://cloud.google.com/) 和 [AI Studio](https://aistudio.google.com/) 相关的功能。

## 聊天模型

### Gemini 模型

通过 [`ChatGoogleGenerativeAI`](/oss/javascript/integrations/chat/google_generative_ai) 类访问 Gemini 模型，例如 `gemini-2.5-pro` 和 `gemini-2.0-flex`。如果使用 VertexAI，则通过 [`ChatVertexAI`](/oss/javascript/integrations/chat/google_vertex_ai) 类访问。

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

<Tabs>

<Tab title="GenAI">

```bash [npm]
npm install @langchain/google-genai @langchain/core
```
配置您的 API 密钥。

```
export GOOGLE_API_KEY=your-api-key
```

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  maxOutputTokens: 2048,
});

// 也支持批量处理和流式处理
const res = await model.invoke([
  [
    "human",
    "What would be a good company name for a company that makes colorful socks?",
  ],
]);
```

较新的 Gemini 模型支持图像输入：

```typescript
const visionModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  maxOutputTokens: 2048,
});
const image = fs.readFileSync("./hotdog.jpg").toString("base64");
const input2 = [
  new HumanMessage({
    content: [
      {
        type: "text",
        text: "Describe the following image.",
      },
      {
        type: "image_url",
        image_url: `data:image/png;base64,${image}`,
      },
    ],
  }),
];

const res = await visionModel.invoke(input2);
```

<Tip>

<strong>点击[此处](/oss/javascript/integrations/chat/google_generative_ai)查看 `@langchain/google-genai` 特定的集成文档</strong>

</Tip>

</Tab>

<Tab title="VertexAI">

```bash [npm]
npm install @langchain/google-vertexai @langchain/core
```
然后，您需要添加您的服务账号凭据，可以直接作为 `GOOGLE_VERTEX_AI_WEB_CREDENTIALS` 环境变量：

```
GOOGLE_VERTEX_AI_WEB_CREDENTIALS={"type":"service_account","project_id":"YOUR_PROJECT-12345",...}
```
或者作为文件路径：

```
GOOGLE_VERTEX_AI_WEB_CREDENTIALS_FILE=/path/to/your/credentials.json
```

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";
// 或者，如果使用 web 入口点：
// import { ChatVertexAI } from "@langchain/google-vertexai-web";

const model = new ChatVertexAI({
  model: "gemini-2.5-pro",
  maxOutputTokens: 2048,
});

// 也支持批量处理和流式处理
const res = await model.invoke([
  [
    "human",
    "What would be a good company name for a company that makes colorful socks?",
  ],
]);
```

Gemini 视觉模型在提供单个人类消息时支持图像输入。例如：

```typescript
const visionModel = new ChatVertexAI({
  model: "gemini-pro-vision",
  maxOutputTokens: 2048,
});
const image = fs.readFileSync("./hotdog.png").toString("base64");
const input2 = [
  new HumanMessage({
    content: [
      {
        type: "text",
        text: "Describe the following image.",
      },
      {
        type: "image_url",
        image_url: `data:image/png;base64,${image}`,
      },
    ],
  }),
];

const res = await visionModel.invoke(input2);
```

<Tip>

点击[此处](/oss/javascript/integrations/chat/google_vertex_ai)查看 `@langchain/google-vertexai` 特定的集成文档

</Tip>

</Tab>

</Tabs>

`image_url` 的值必须是 base64 编码的图像（例如，`data:image/png;base64,abcd124`）。

### Gemma

通过 AI Studio 使用 `ChatGoogle` 类访问 `gemma-3-27b-it` 模型。
（此类是 [`ChatVertexAI`](/oss/javascript/integrations/chat/google_vertex_ai) 类的超类，可与 Vertex AI 和 AI Studio API 一起使用。）

<Tip>

<strong>由于 Gemma 是一个开源模型，它也可能在其他平台上可用</strong>，包括 [Ollama](/oss/javascript/integrations/chat/ollama/)。

</Tip>

```bash [npm]
npm install @langchain/google-gauth @langchain/core
```
配置您的 API 密钥。

```
export GOOGLE_API_KEY=your-api-key
```

```typescript
import { ChatGoogle } from "@langchain/google-gauth";

const model = new ChatGoogle({
  model: "gemma-3-27b-it",
});

const res = await model.invoke([
  {
    role: "user",
    content:
      "What would be a good company name for a company that makes colorful socks?",
  },
]);
```

### 第三方模型

有关通过 Vertex AI 设置身份验证以使用这些模型的信息，请参阅上文。

[Anthropic](/oss/javascript/integrations/chat/anthropic) 的 Claude 模型也可以通过 [Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) 平台使用。有关启用模型访问权限和要使用的模型名称的更多信息，请参阅[此处](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude)。

PaLM 模型不再受支持。

## 向量存储

### Vertex AI Vector Search

> [Vertex AI Vector Search](https://cloud.google.com/vertex-ai/docs/matching-engine/overview)（以前称为 Vertex AI Matching Engine）提供了业界领先的高规模、低延迟向量数据库。这些向量数据库通常被称为向量相似性匹配或近似最近邻（ANN）服务。

```typescript
import { MatchingEngine } from "@langchain/community/vectorstores/googlevertexai";
```

### Postgres 向量存储

[`@langchain/google-cloud-sql-pg`](https://www.npmjs.com/package/@langchain/google-cloud-sql-pg) 包中的 [PostgresVectorStore](/oss/javascript/integrations/vectorstores/google_cloudsql_pg) 模块提供了一种使用 CloudSQL for PostgreSQL 通过该类存储向量嵌入的方法。

```bash
$ yarn add @langchain/google-cloud-sql-pg
```

设置您的环境变量：

```bash
PROJECT_ID="your-project-id"
REGION="your-project-region"
INSTANCE_NAME="your-instance"
DB_NAME="your-database-name"
DB_USER="your-database-user"
PASSWORD="your-database-password"
```

通过 PostgresEngine 类创建数据库连接：

```typescript
const engine: PostgresEngine = await PostgresEngine.fromInstance(
  process.env.PROJECT_ID ?? "",
  process.env.REGION ?? "",
  process.env.INSTANCE_NAME ?? "",
  process.env.DB_NAME ?? "",
  peArgs
);
```

初始化向量存储表：

```typescript
await engine.initVectorstoreTable(
  "my_vector_store_table",
  768,
  vectorStoreArgs
);
```

创建向量存储实例：

```typescript
const vectorStore = await PostgresVectorStore.initialize(
  engine,
  embeddingService,
  "my_vector_store_table",
  pvectorArgs
);
```

## 工具

### Google 搜索

- 按照[这些说明](https://stackoverflow.com/questions/37083058/programmatically-searching-google-in-python-using-custom-search)设置自定义搜索引擎。
- 从上一步获取 API 密钥和自定义搜索引擎 ID，并分别将它们设置为环境变量 `GOOGLE_API_KEY` 和 `GOOGLE_CSE_ID`。

存在一个 `GoogleCustomSearch` 工具，它封装了此 API。要导入此工具：

```typescript
import { GoogleCustomSearch } from "@langchain/community/tools/google_custom_search";
```

我们可以轻松地将此包装器作为工具加载（与智能体一起使用）。我们可以这样做：

```typescript
const tools = [new GoogleCustomSearch({})];
// 将此变量传递给您的智能体。
```
