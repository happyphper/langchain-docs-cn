---
title: 嵌入模型
---
## 概述

<Note>

本概述涵盖<strong>基于文本的嵌入模型</strong>。LangChain 目前暂不支持多模态嵌入。

</Note>

嵌入模型将原始文本（例如句子、段落或推文）转换为固定长度的数字向量，该向量捕获了文本的**语义含义**。这些向量使得机器能够基于含义而非精确的词语来比较和搜索文本。

在实践中，这意味着具有相似思想的文本在向量空间中被放置在相近的位置。例如，嵌入不仅可以匹配短语 *"机器学习"*，还可以检索出讨论相关概念的文档，即使这些文档使用了不同的措辞。

### 工作原理

1.  **向量化** — 模型将每个输入字符串编码为一个高维向量。
2.  **相似性评分** — 使用数学度量来比较向量，以衡量底层文本的关联紧密程度。

### 相似性度量

通常使用以下几种度量来比较嵌入：

*   **余弦相似度** — 测量两个向量之间的夹角。
*   **欧几里得距离** — 测量点之间的直线距离。
*   **点积** — 测量一个向量在另一个向量上的投影程度。

## 接口

LangChain 通过 <a href="https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings" target="_blank" rel="noreferrer" class="link">Embeddings</a> 接口为文本嵌入模型（例如 OpenAI、Cohere、Hugging Face）提供了一个标准接口。

主要提供两个方法：

*   `embedDocuments(documents: string[]) → number[][]`：嵌入一个文档列表。
*   `embedQuery(text: string) → number[]`：嵌入单个查询。

<Note>

该接口允许查询和文档使用不同的策略进行嵌入，尽管在实践中大多数提供商以相同的方式处理它们。

</Note>

## 安装与使用

:::: details OpenAI

安装依赖：

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
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large"
});
```

::::

:::: details Azure

安装依赖

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
AZURE_OPENAI_API_INSTANCE_NAME=<YOUR_INSTANCE_NAME>
AZURE_OPENAI_API_KEY=<YOUR_KEY>
AZURE_OPENAI_API_VERSION="2024-02-01"
```

实例化模型：

```typescript
import { AzureOpenAIEmbeddings } from "@langchain/openai";

const embeddings = new AzureOpenAIEmbeddings({
  azureOpenAIApiEmbeddingsDeploymentName: "text-embedding-ada-002"
});
```

::::

:::: details AWS

安装依赖：

::: code-group

```bash [npm]
npm i @langchain/aws
```

```bash [yarn]
yarn add @langchain/aws
```

```bash [pnpm]
pnpm add @langchain/aws
```

:::

添加环境变量：

```bash
BEDROCK_AWS_REGION=your-region
```

实例化模型：

```typescript
import { BedrockEmbeddings } from "@langchain/aws";

const embeddings = new BedrockEmbeddings({
  model: "amazon.titan-embed-text-v1"
});
```

::::

:::: details Google Gemini

安装依赖：

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
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004"
});
```

::::

:::: details Google Vertex

安装依赖：

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
import { VertexAIEmbeddings } from "@langchain/google-vertexai";

const embeddings = new VertexAIEmbeddings({
  model: "gemini-embedding-001"
});
```

::::

:::: details MistralAI

安装依赖：

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
import { MistralAIEmbeddings } from "@langchain/mistralai";

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed"
});
```

::::

:::: details Cohere

安装依赖：

::: code-group

```bash [npm]
npm i @langchain/cohere
```

```bash [yarn]
yarn add @langchain/cohere
```

```bash [pnpm]
pnpm add @langchain/cohere
```

:::

添加环境变量：

```bash
COHERE_API_KEY=your-api-key
```

实例化模型：

```typescript
import { CohereEmbeddings } from "@langchain/cohere";

const embeddings = new CohereEmbeddings({
  model: "embed-english-v3.0"
});
```

::::

:::: details Ollama

安装依赖：

::: code-group

```bash [npm]
npm i @langchain/ollama
```

```bash [yarn]
yarn add @langchain/ollama
```

```bash [pnpm]
pnpm add @langchain/ollama
```

:::

实例化模型：

```typescript
import { OllamaEmbeddings } from "@langchain/ollama";

const embeddings = new OllamaEmbeddings({
  model: "llama2",
  baseUrl: "http://localhost:11434", // 默认值
});
```

::::

## 缓存

嵌入可以被存储或临时缓存，以避免重复计算。

可以使用 `CacheBackedEmbeddings` 来缓存嵌入。这个包装器将嵌入存储在键值存储中，其中文本被哈希处理，哈希值用作缓存中的键。

初始化 `CacheBackedEmbeddings` 的主要支持方式是 `fromBytesStore`。它接受以下参数：

- **underlyingEmbeddings**：用于嵌入的底层嵌入器。
- **documentEmbeddingStore**：用于缓存文档嵌入的任何 [`BaseStore`](/oss/integrations/stores/)。
- **options.namespace**：（可选，默认为 `""`）用于文档缓存的命名空间。有助于避免冲突（例如，将其设置为嵌入模型名称）。

<Important>

- 在使用不同的嵌入模型时，请始终设置 `namespace` 参数以避免冲突。
- `CacheBackedEmbeddings` 默认不缓存查询嵌入。要启用此功能，请指定一个 `query_embedding_store`。

</Important>

```typescript
import { CacheBackedEmbeddings } from "@langchain/classic/embeddings/cache_backed";
import { InMemoryStore } from "@langchain/core/stores";

const underlyingEmbeddings = new OpenAIEmbeddings();

const inMemoryStore = new InMemoryStore();

const cacheBackedEmbeddings = CacheBackedEmbeddings.fromBytesStore(
  underlyingEmbeddings,
  inMemoryStore,
  {
    namespace: underlyingEmbeddings.model,
  }
);

// 示例：缓存查询嵌入
const tic = Date.now();
const queryEmbedding = cacheBackedEmbeddings.embedQuery("Hello, world!");
console.log(`First call took: ${Date.now() - tic}ms`);

// 示例：缓存文档嵌入
const tic = Date.now();
const documentEmbedding = cacheBackedEmbeddings.embedDocuments(["Hello, world!"]);
console.log(`Cached creation time: ${Date.now() - tic}ms`);
```

在生产环境中，您通常会使用更健壮的持久化存储，例如数据库或云存储。请参阅[存储集成](/oss/integrations/stores/)了解相关选项。

## 所有集成

<Columns :cols="3">

<Card
title="Alibaba Tongyi"
icon="link"
href="/oss/integrations/text_embedding/alibaba_tongyi"
arrow="true"
cta="查看指南"
/>
<Card
title="Azure OpenAI"
icon="link"
href="/oss/integrations/text_embedding/azure_openai"
arrow="true"
cta="查看指南"
/>
<Card
title="Baidu Qianfan"
icon="link"
href="/oss/integrations/text_embedding/baidu_qianfan"
arrow="true"
cta="查看指南"
/>
<Card
title="Amazon Bedrock"
icon="link"
href="/oss/integrations/text_embedding/bedrock"
arrow="true"
cta="查看指南"
/>
<Card
title="ByteDance Doubao"
icon="link"
href="/oss/integrations/text_embedding/bytedance_doubao"
arrow="true"
cta="查看指南"
/>
<Card
title="Cloudflare Workers AI"
icon="link"
href="/oss/integrations/text_embedding/cloudflare_ai"
arrow="true"
cta="查看指南"
/>
<Card
title="Cohere"
icon="link"
href="/oss/integrations/text_embedding/cohere"
arrow="true"
cta="查看指南"
/>
<Card
title="DeepInfra"
icon="link"
href="/oss/integrations/text_embedding/deepinfra"
arrow="true"
cta="查看指南"
/>
<Card
title="Fireworks"
icon="link"
href="/oss/integrations/text_embedding/fireworks"
arrow="true"
cta="查看指南"
/>
<Card
title="Google Generative AI"
icon="link"
href="/oss/integrations/text_embedding/google_generative_ai"
arrow="true"
cta="查看指南"
/>
<Card
title="Google Vertex AI"
icon="link"
href="/oss/integrations/text_embedding/google_vertex_ai"
arrow="true"
cta="查看指南"
/>
<Card
title="Gradient AI"
icon="link"
href="/oss/integrations/text_embedding/gradient_ai"
arrow="true"
cta="查看指南"
/>
<Card
title="HuggingFace Inference"
icon="link"
href="/oss/integrations/text_embedding/hugging_face_inference"
arrow="true"
cta="查看指南"
/>
<Card
title="IBM watsonx.ai"
icon="link"
href="/oss/integrations/text_embedding/ibm"
arrow="true"
cta="查看指南"
/>
<Card
title="Jina"
icon="link"
href="/oss/integrations/text_embedding/jina"
arrow="true"
cta="查看指南"
/>
<Card
title="Llama CPP"
icon="link"
href="/oss/integrations/text_embedding/llama_cpp"
arrow="true"
cta="查看指南"
/>
<Card
title="Minimax"
icon="link"
href="/oss/integrations/text_embedding/minimax"
arrow="true"
cta="查看指南"
/>
<Card
title="MistralAI"
icon="link"
href="/oss/integrations/text_embedding/mistralai"
arrow="true"
cta="查看指南"
/>
<Card
title="Mixedbread AI"
icon="link"
href="/oss/integrations/text_embedding/mixedbread_ai"
arrow="true"
cta="查看指南"
/>
<Card
title="Nomic"
icon="link"
href="/oss/integrations/text_embedding/nomic"
arrow="true"
cta="查看指南"
/>
<Card
title="Ollama"
icon="link"
href="/oss/integrations/text_embedding/ollama"
arrow="true"
cta="查看指南"
/>
<Card
title="OpenAI"
icon="link"
href="/oss/integrations/text_embedding/openai"
arrow="true"
cta="查看指南"
/>
<Card
title="Pinecone"
icon="link"
href="/oss/integrations/text_embedding/pinecone"
arrow="true"
cta="查看指南"
/>
<Card
title="Prem AI"
icon="link"
href="/oss/integrations/text_embedding/premai"
arrow="true"
cta="查看指南"
/>
<Card
title="Tencent Hunyuan"
icon="link"
href="/oss/integrations/text_embedding/tencent_hunyuan"
arrow="true"
cta="查看指南"
/>
<Card
title="TensorFlow"
icon="link"
href="/oss/integrations/text_embedding/tensorflow"
arrow="true"
cta="查看指南"
/>
<Card
title="TogetherAI"
icon="link"
href="/oss/integrations/text_embedding/togetherai"
arrow="true"
cta="查看指南"
/>
<Card
title="HuggingFace Transformers"
icon="link"
href="/oss/integrations/text_embedding/transformers"
arrow="true"
cta="查看指南"
/>
<Card
title="Voyage AI"
icon="link"
href="/oss/integrations/text_embedding/voyageai"
arrow="true"
cta="查看指南"
/>
<Card
title="ZhipuAI"
icon="link"
href="/oss/integrations/text_embedding/zhipuai"
arrow="true"
cta="查看指南"
/>

</Columns>

