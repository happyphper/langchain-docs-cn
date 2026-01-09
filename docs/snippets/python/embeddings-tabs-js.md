
<Tabs>

<Tab title="OpenAI">

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

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large"
});
```

</Tab>

<Tab title="Azure">

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

```bash
AZURE_OPENAI_API_INSTANCE_NAME=<YOUR_INSTANCE_NAME>
AZURE_OPENAI_API_KEY=<YOUR_KEY>
AZURE_OPENAI_API_VERSION="2024-02-01"
```
```typescript
import { AzureOpenAIEmbeddings } from "@langchain/openai";

const embeddings = new AzureOpenAIEmbeddings({
  azureOpenAIApiEmbeddingsDeploymentName: "text-embedding-ada-002"
});
```

</Tab>

<Tab title="AWS">

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

```bash
BEDROCK_AWS_REGION=your-region
```
```typescript
import { BedrockEmbeddings } from "@langchain/aws";

const embeddings = new BedrockEmbeddings({
  model: "amazon.titan-embed-text-v1"
});
```

</Tab>

<Tab title="VertexAI">

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

```bash
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
```
```typescript
import { VertexAIEmbeddings } from "@langchain/google-vertexai";

const embeddings = new VertexAIEmbeddings({
  model: "gemini-embedding-001"
});
```

</Tab>

<Tab title="MistralAI">

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

```bash
MISTRAL_API_KEY=your-api-key
```
```typescript
import { MistralAIEmbeddings } from "@langchain/mistralai";

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed"
});
```

</Tab>

<Tab title="Cohere">

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

```bash
COHERE_API_KEY=your-api-key
```
```typescript
import { CohereEmbeddings } from "@langchain/cohere";

const embeddings = new CohereEmbeddings({
  model: "embed-english-v3.0"
});
```

</Tab>

</Tabs>

