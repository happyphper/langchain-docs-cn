---
title: OpenApi 工具包
---

<Warning>

此代理可以向外部 API 发送请求。请谨慎使用，特别是在授予用户访问权限时。

请注意，理论上此代理可能将提供的凭据或其他敏感数据发送到未经验证或可能恶意的 URL——尽管理论上它不应该这样做。

请考虑对代理可以执行的操作、可以访问的 API、可以传递的标头等添加限制。

此外，请考虑实施措施，在发送请求之前验证 URL，并安全地处理和保护敏感数据（如凭据）。

</Warning>

这将帮助您开始使用 [OpenApiToolkit](/oss/javascript/langchain/tools#toolkits)。有关 OpenApiToolkit 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain.agents.OpenApiToolkit.html)。

`OpenAPIToolkit` 可以访问以下工具：

| 名称             | 描述 |
|------------------|-------------|
| `requests_get`   | 通往互联网的门户。当您需要从网站获取特定内容时使用此工具。输入应为一个 URL 字符串（例如 "[www.google.com](https://www.google.com)"）。输出将是 GET 请求的文本响应。 |
| `requests_post`  | 当您想向网站发送 POST 请求时使用此工具。输入应为一个包含两个键的 JSON 字符串："url" 和 "data"。"url" 的值应为字符串，"data" 的值应为您要作为 JSON 请求体 POST 到该 URL 的键值对字典。请注意，在 JSON 字符串中始终对字符串使用双引号。输出将是 POST 请求的文本响应。 |
| `json_explorer`  | 可用于回答有关 API 的 OpenAPI 规范的问题。在尝试发出请求之前，请始终先使用此工具。此工具的示例输入：'GET 请求到 /bar 端点需要哪些必需的查询参数？' 'POST 请求到 /foo 端点需要哪些必需的请求体参数？' 始终向此工具提出具体问题。 |

## 设置

此工具包需要一个 OpenAPI 规范文件。LangChain.js 仓库在 `examples` 目录中有一个 [示例 OpenAPI 规范文件](https://github.com/langchain-ai/langchainjs/blob/cc21aa29102571204f4443a40b53d28581a12e30/examples/openai_openapi.yaml)。您可以使用此文件来测试工具包。

如果您希望从单个工具的运行中获得自动化追踪，您还可以通过取消注释以下内容来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```typescript
process.env.LANGSMITH_TRACING="true"
process.env.LANGSMITH_API_KEY="your-api-key"
```

### 安装

此工具包位于 `langchain` 包中：

::: code-group

```bash [npm]
npm install langchain @langchain/core
```

```bash [yarn]
yarn add langchain @langchain/core
```

```bash [pnpm]
pnpm add langchain @langchain/core
```

:::

## 实例化

现在我们可以实例化我们的工具包。首先，我们需要定义要在工具包中使用的 LLM。

```typescript
// @lc-docs-hide-cell

import { ChatOpenAI } from "@langchain/openai";
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
})
```

```typescript
import { OpenApiToolkit } from "@langchain/classic/agents/toolkits"
import * as fs from "fs";
import * as yaml from "js-yaml";
import { JsonSpec, JsonObject } from "@langchain/classic/tools";

// 加载 OpenAPI 规范并将其从 YAML 转换为 JSON。
const yamlFile = fs.readFileSync("../../../../../examples/openai_openapi.yaml", "utf8");
const data = yaml.load(yamlFile) as JsonObject;
if (!data) {
  throw new Error("Failed to load OpenAPI spec");
}

// 为 API 请求定义标头。
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
};

const toolkit = new OpenApiToolkit(new JsonSpec(data), llm, headers);
```

## 工具

查看可用工具：

```typescript
const tools = toolkit.getTools();

console.log(tools.map((tool) => ({
  name: tool.name,
  description: tool.description,
})))
```

```text
[
  {
    name: 'requests_get',
    description: 'A portal to the internet. Use this when you need to get specific content from a website.\n' +
      '  Input should be a url string (i.e. "https://www.google.com"). The output will be the text response of the GET request.'
  },
  {
    name: 'requests_post',
    description: 'Use this when you want to POST to a website.\n' +
      '  Input should be a json string with two keys: "url" and "data".\n' +
      '  The value of "url" should be a string, and the value of "data" should be a dictionary of\n' +
      '  key-value pairs you want to POST to the url as a JSON body.\n' +
      '  Be careful to always use double quotes for strings in the json string\n' +
      '  The output will be the text response of the POST request.'
  },
  {
    name: 'json_explorer',
    description: '\n' +
      'Can be used to answer questions about the openapi spec for the API. Always use this tool before trying to make a request. \n' +
      'Example inputs to this tool: \n' +
      "    'What are the required query parameters for a GET request to the /bar endpoint?'\n" +
      "    'What are the required parameters in the request body for a POST request to the /foo endpoint?'\n" +
      'Always give this tool a specific question.'
  }
]
```

## 在代理中使用

首先，确保已安装 LangGraph：

::: code-group

```bash [npm]
npm install @langchain/langgraph
```

```bash [yarn]
yarn add @langchain/langgraph
```

```bash [pnpm]
pnpm add @langchain/langgraph
```

:::

```typescript
import { createAgent } from "@langchain/classic"

const agentExecutor = createAgent({ llm, tools });
```

```typescript
const exampleQuery = "Make a POST request to openai /chat/completions. The prompt should be 'tell me a joke.'. Ensure you use the model 'gpt-4o-mini'."

const events = await agentExecutor.stream(
  { messages: [["user", exampleQuery]]},
  { streamMode: "values", }
)

for await (const event of events) {
  const lastMsg = event.messages[event.messages.length - 1];
  if (lastMsg.tool_calls?.length) {
    console.dir(lastMsg.tool_calls, { depth: null });
  } else if (lastMsg.content) {
    console.log(lastMsg.content);
  }
}
```

```json
[
  {
    name: 'requests_post',
    args: {
      input: '{"url":"https://api.openai.com/v1/chat/completions","data":{"model":"gpt-4o-mini","messages":[{"role":"user","content":"tell me a joke."}]}}'
    },
    type: 'tool_call',
    id: 'call_1HqyZrbYgKFwQRfAtsZA2uL5'
  }
]
{
  "id": "chatcmpl-9t36IIuRCs0WGMEy69HUqPcKvOc1w",
  "object": "chat.completion",
  "created": 1722906986,
  "model": "gpt-4o-mini-2024-07-18",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Why don't skeletons fight each other? \n\nThey don't have the guts!"
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 15,
    "total_tokens": 27
  },
  "system_fingerprint": "fp_48196bc67a"
}

Here's a joke for you:

**Why don't skeletons fight each other?**
They don't have the guts!
```

---

## API 参考

有关 OpenApiToolkit 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain.agents.OpenApiToolkit.html)。
