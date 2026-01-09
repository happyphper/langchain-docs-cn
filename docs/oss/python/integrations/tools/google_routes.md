---
title: Google Routes 工具
---
Google Routes 工具允许您的智能体利用 Google Routes API 来查找两个或多个目的地之间的路线。您可以通过步行、公共交通、汽车、摩托车和自行车获取路线。

## 设置

您需要从 [Google 此处](https://developers.google.com/maps/documentation/places/web-service/overview) 获取一个 API 密钥，并 [启用 Routes API](https://console.cloud.google.com/apis/library/routes.googleapis.com)。然后，将您的 API 密钥设置为 `process.env.GOOGLE_ROUTES_API_KEY` 或作为 `apiKey` 构造函数参数传入。

## 使用方法

<Tip>

有关安装 LangChain 包的通用说明，请参阅 [此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/openai @langchain/community @langchain/core
```

```typescript
import { GoogleRoutesAPI } from "@langchain/community/tools/google_routes";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents";

export async function run() {
  const tools = [new GoogleRoutesAPI()];

  const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo-0125",
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant"],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = await createToolCallingAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  const result = await agentExecutor.invoke({
    input: "How to go from the Eiffel Tower to the Louvre Museum by transit?",
  });

  console.log(result);

  /* {
    input: 'How to go from the Eiffel Tower to the Louvre Museum by transit?',
    output: 'To travel from the Eiffel Tower to the Louvre Museum by transit, here is the route information:\n' +
      '\n' +
      '- Departure: Eiffel Tower\n' +
      '- Arrival: Louvre Museum\n' +
      '- Distance: 4.1 km\n' +
      '- Duration: 18 minutes\n' +
      '- Transit Fare: €2.15\n' +
      '\n' +
      'Travel Instructions:\n' +
      "1. Walk to Pont d'Iéna\n" +
      '2. Take bus 72 towards Gare de Lyon - Maison de La RATP\n' +
      '3. Walk to your destination\n' +
      '\n' +
      'Departure Time: 22:03\n' +
      'Arrival Time: 22:15\n' +
      '\n' +
      'Please follow these instructions to reach the Louvre Museum from the Eiffel Tower.'
  } */
}
```

## 相关链接

- 工具 [概念指南](/oss/langchain/tools)
- 工具 [操作指南](/oss/langchain/tools)
