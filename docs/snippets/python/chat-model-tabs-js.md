
<Tabs>

<Tab title="OpenAI">

👉 阅读 [OpenAI 聊天模型集成文档](/oss/javascript/integrations/chat/openai/)

::: code-group

```bash [npm]
npm install @langchain/openai
```
```bash [pnpm]
pnpm install @langchain/openai
```
```bash [yarn]
yarn add @langchain/openai
```
```bash [bun]
bun add @langchain/openai
```

:::

::: code-group

```typescript [initChatModel]
import { initChatModel } from "langchain";

process.env.OPENAI_API_KEY = "your-api-key";

const model = await initChatModel("gpt-4.1");
```
```typescript [Model Class]
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4.1",
  apiKey: "your-api-key"
});
```

:::

</Tab>

<Tab title="Anthropic">

👉 阅读 [Anthropic 聊天模型集成文档](/oss/javascript/integrations/chat/anthropic/)

::: code-group

```bash [npm]
npm install @langchain/anthropic
```
```bash [pnpm]
pnpm install @langchain/anthropic
```
```bash [yarn]
yarn add @langchain/anthropic
```
```bash [pnpm]
pnpm add @langchain/anthropic
```

:::

::: code-group

```typescript [initChatModel]
import { initChatModel } from "langchain";

process.env.ANTHROPIC_API_KEY = "your-api-key";

const model = await initChatModel("claude-sonnet-4-5-20250929");
```
```typescript [Model Class]
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-5-20250929",
  apiKey: "your-api-key"
});
```

:::

</Tab>

<Tab title="Azure">

👉 阅读 [Azure 聊天模型集成文档](/oss/javascript/integrations/chat/azure/)

::: code-group

```bash [npm]
npm install @langchain/azure
```
```bash [pnpm]
pnpm install @langchain/azure
```
```bash [yarn]
yarn add @langchain/azure
```
```bash [bun]
bun add @langchain/azure
```

:::

::: code-group

```typescript [initChatModel]
import { initChatModel } from "langchain";

process.env.AZURE_OPENAI_API_KEY = "your-api-key";
process.env.AZURE_OPENAI_ENDPOINT = "your-endpoint";
process.env.OPENAI_API_VERSION = "your-api-version";

const model = await initChatModel("azure_openai:gpt-4.1");
```
```typescript [Model Class]
import { AzureChatOpenAI } from "@langchain/openai";

const model = new AzureChatOpenAI({
  model: "gpt-4.1",
  azureOpenAIApiKey: "your-api-key",
  azureOpenAIApiEndpoint: "your-endpoint",
  azureOpenAIApiVersion: "your-api-version"
});
```

:::

</Tab>

<Tab title="Google Gemini">

👉 阅读 [Google GenAI 聊天模型集成文档](/oss/javascript/integrations/chat/google_generative_ai/)

::: code-group

```bash [npm]
npm install @langchain/google-genai
```
```bash [pnpm]
pnpm install @langchain/google-genai
```
```bash [yarn]
yarn add @langchain/google-genai
```
```bash [bun]
bun add @langchain/google-genai
```

:::

::: code-group

```typescript [initChatModel]
import { initChatModel } from "langchain";

process.env.GOOGLE_API_KEY = "your-api-key";

const model = await initChatModel("google-genai:gemini-2.5-flash-lite");
```
```typescript [Model Class]
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: "your-api-key"
});
```

:::

</Tab>

<Tab title="Bedrock Converse">

👉 阅读 [AWS Bedrock 聊天模型集成文档](/oss/javascript/integrations/chat/bedrock_converse/)

::: code-group

```bash [npm]
npm install @langchain/aws
```
```bash [pnpm]
pnpm install @langchain/aws
```
```bash [yarn]
yarn add @langchain/aws
```
```bash [bun]
bun add @langchain/aws
```

:::

::: code-group

```typescript [initChatModel]
import { initChatModel } from "langchain";

// 请按照此处的步骤配置您的凭证：
// https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html

const model = await initChatModel("bedrock:gpt-4.1");
```
```typescript [Model Class]
import { ChatBedrockConverse } from "@langchain/aws";

// 请按照此处的步骤配置您的凭证：
// https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html

const model = new ChatBedrockConverse({
  model: "gpt-4.1",
  region: "us-east-2"
});
```

:::

</Tab>

</Tabs>

