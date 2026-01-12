---
title: Exa 搜索结果
---
Exa（原名 Metaphor Search）是一个专为 LLM 使用而设计的搜索引擎。它允许使用自然语言查询在互联网上搜索文档，然后从所需文档中检索清理过的 HTML 内容。

与基于关键词的搜索（如 Google）不同，Exa 的神经搜索能力使其能够语义化地理解查询并返回相关文档。例如，我们可以搜索 `"关于猫的有趣文章"`，并比较 Google 和 Exa 的搜索结果。Google 会根据关键词 "fascinating" 返回经过 SEO 优化的列表文章。而 Exa 则能直接给出理想的结果。

本页介绍了如何在 LangChain 中使用 `ExaSearchResults`。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [PY 支持](https://python.langchain.com/docs/integrations/tools/exa_search/) | 版本 |
| :--- | :--- | :---: | :---: | :---: |
| [ExaSearchResults](https://api.js.langchain.com/classes/langchain_exa.ExaSearchResults.html) | [@langchain/exa](https://npmjs.com/package/@langchain/exa) | ❌ | ✅ | ![NPM - Version](https://img.shields.io/npm/v/@langchain/exa?style=flat-square&label=%20&) |

## 设置

该集成位于 `@langchain/exa` 包中。

::: code-group

```bash [npm]
npm install @langchain/exa @langchain/core
```

```bash [yarn]
yarn add @langchain/exa @langchain/core
```

```bash [pnpm]
pnpm add @langchain/exa @langchain/core
```

:::

### 凭证

首先，获取一个 Exa API 密钥并将其添加为环境变量。通过[此处](https://dashboard.exa.ai/login)注册可获得每月 1000 次免费搜索。

```typescript
process.env.EXASEARCH_API_KEY="your-api-key"
```

同时，设置 LangSmith 以获得最佳的观测性体验（非必需，但推荐）：

```typescript
process.env.LANGSMITH_TRACING="true"
process.env.LANGSMITH_API_KEY="your-api-key"
```

## 实例化

这里我们展示如何实例化 `ExaSearchResults` 工具：

```typescript
import { ExaSearchResults } from "@langchain/exa"
import Exa from "exa-js";

// @lc-ts-ignore
const client = new Exa(process.env.EXASEARCH_API_KEY)

const tool = new ExaSearchResults({
  // @lc-ts-ignore
  client,
  searchArgs: {
    numResults: 2,
  }
})
```

## 调用

### [直接使用参数调用](/oss/javascript/langchain/tools)

```typescript
await tool.invoke("what is the weather in wailea?")
```

```json
{"results":[{"score":0.16085544228553772,"title":"Hawaii Weather Forecast","id":"https://www.willyweather.com/hi/hawaii.html","url":"https://www.willyweather.com/hi/hawaii.html","publishedDate":"2023-01-01","author":"","text":"Get an account to remove ads    View More Real-Time Extremes   Nation State County      Hottest 78.8 °FFaleolo Intl / Apia, Samoa, HI    Coldest 51.6 °FBradshaw Army Air Field / Hawaii, HI    Windiest 12.7mphBradshaw Army Air Field / Hawaii, HI    Most Humid 100%Hilo, Hilo International Airport, HI    Least Humid 73.32%Kailua / Kona, Keahole Airport, HI    Highest Pressure 1030.5 hPaBradshaw Army Air Field / Hawaii, HI    Lowest Pressure 1008 hPaFaleolo Intl / Apia, Samoa, HI"},{"score":0.1591680943965912,"title":"The Hawaii Climate To Prepare For Your Maui Wedding","id":"https://mymauiwedding.weebly.com/blog6/the-hawaii-climate-to-prepare-for-your-maui-wedding","url":"https://mymauiwedding.weebly.com/blog6/the-hawaii-climate-to-prepare-for-your-maui-wedding","publishedDate":"2012-04-26","author":"","text":"Since the The hawaiian islands environment is very constant throughout the season with only slight heat range changes, you can travel there any season. While the moisture is very high, the continuous exotic sea breezes keep the circumstances very relaxed throughout the season. During the day you will be relaxed in a T-shirt or an Aloha clothing and a couple of shoes. Once the sun places you will probably want to wear a light coat since the circumstances can fall around ten levels. The protecting impact of the hills and the variations in climate at various levels make a variety of environment areas. The unique micro-climates are specific for the internal valleys, hill hills and seashores in The hawaiian islands. Located at the side of the exotic location and due to year-round heated sea exterior circumstances, which keep the overlying environment heated, The hawaiian islands has only two circumstances, both of them heated and one with a little bit more rain. Hawaii Climate During Summer  Between the several weeks of Apr and Nov the environment is more dry and hotter with the conditions including 75-88. In the summer time the northern eastern business gusts of wind carry most of the rain to the destinations leeward part, which delivers a welcome comfort from the hot and dry climate.The conditions you will encounter will be proportional to where you are on the destinations. If you are on the edges that are protected from the gusts of wind, the the southeast part of and European factors, you will encounters hot and dry circumstances. If you are on the windward factors, northern or eastern, you will obtain the complete power of the gusts of wind and encounter moister and shade circumstances. Go windward for exotic circumstances and leeward for an dry environment. Hawaii Climate During Winter  From Dec to Apr it is just a little bit chilly, with conditions between 68-80 F. Winter season is regarded rain. The biggest down pours come between Oct and Apr (the hoo'ilo season). Though stormy weather may be common, they usually complete through the destinations quickly and without event. There are more dark times to mess up your laying in the sun, but it hardly ever down pours more than 3 times in a row in one identify. Winter is search period, so if you're a search participant, come to the Northern Coast in Explore to get the ideal trend. Also, whale viewing period is at the end of winter, during Jan to Apr, so make sure you are here if you want to see these spectacular creatures! Hawaii Climate is Greatly Influenced by the Mountains  The hills around the destinations are accountable for the large variety of circumstances. As an example, Kauai's Mt. Waialele is one of the rainiest destinations on the world. Mt. Waialele gets over 420 inches large of rainfall each season, but just a few kilometers down the line, Waimea Canyn is absolutely dry and has been nicknamed the \"Grand Canyn of the Pacific\". On Big Isle The hawaiian destinations, Hilo is one of the rainiest places in the nation, with 180 inches large of rainfall a season. But Puako, only 60 kilometers away, gets less than 6 inches large of rainfall. If you choose to discover the organic charm discovered at greater levels such as Mauna Kea, use long jeans and several levels of awesome climate outfits. The heat variety in the greater destinations falls 3.5 levels for every 1,000 toes above sea level.Watching the dawn from Mt Haleakala's peak is a incredible concept, but be sure to package up with neckties and work gloves that will keep you comfortable. The circumstances at the peak can fall to 30 F!. Also know that there is less security from the sun at greater levels so be sure to utilize the sun display liberally and use eyewear and a hat. The environment can modify greatly in just a few time when you are in the hills. The exclusive The hawaiian destinations environment makes it possible to sun shower on the Kona Shore and ski on Mauna Kea in the same day."}],"requestId":"2145d8de65373c70250400c2c9e8eb13"}
```

### [使用 ToolCall 调用](/oss/javascript/langchain/tools)

我们也可以使用模型生成的 `ToolCall` 来调用该工具，在这种情况下，将返回一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.ToolMessage.html" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a>：

```typescript
// 这通常由模型生成，但为了演示目的，我们将直接创建一个工具调用。
const modelGeneratedToolCall = {
  args: {
    input: "what is the weather in wailea"
  },
  id: "1",
  name: tool.name,
  type: "tool_call",
}
await tool.invoke(modelGeneratedToolCall)
```

```text
ToolMessage {
  "content": "{\"results\":[{\"score\":0.12955062091350555,\"title\":\"Urban Dictionary: Waianae\",\"id\":\"https://www.urbandictionary.com/define.php?term=Waianae\",\"url\":\"https://www.urbandictionary.com/define.php?term=Waianae\",\"publishedDate\":\"2006-04-19\",\"author\":\"\",\"text\":\"Hot but good time for go beach ,in this part of Hawaii you HAVE to have respect ,with people and their stuff, but Some people like act dumb and stupid so that’s the only thing that make Waianae look bad , but foreal kine in this part of Hawaii we have respect and if we don’t get that respect you gon expect no respect back .   Get the Waianae mug.    Advertise here for $5/day    Located on the west end of Oahu. Waianae gets a bad reputation for being poor, dirty, scary, etc. Its hot and dry out west and the beaches are super nice. Makaha, Yokes, and Pray for Sex are some great beaches to name a few. Mostly locals and the majority of the homeless live out here. Even though its a little rough, the people have alot of aloha who live out here. Most important thing here is to have respect for other people and their stuff.   Get the WAIANAE mug.    Advertise here for $5/day    When going too the island of Honolulu if you go to an amazing part for the island called Waianae, say ho sole u know where can find 1 top banggahh like get 1 Waianae special. Then say shoots boto  by   August 1, 2021   Get the Waianae special mug.\"},{\"score\":0.12563708424568176,\"title\":\"Mount Waialeale: One of the Wettest Spots on Earth | Hawaii.com\",\"id\":\"https://www.hawaii.com/trip-ideas/mount-waialeale-one-of-the-wettest-spots-on-earth/\",\"url\":\"https://www.hawaii.com/trip-ideas/mount-waialeale-one-of-the-wettest-spots-on-earth/\",\"publishedDate\":\"2022-01-18\",\"author\":\"Matthew Jones\",\"text\":\"Wai’ale’ale, Kauai without much cloud cover. Photo:  WiseTim .   \\nMount Wai‘ale‘ale on the gorgeous island of Kaua‘i is often referred to as the wettest spot on earth. While the more than 5,000-foot tall mountain that’s often enshrouded in clouds does receive a tremendous amount of rainfall each year, it’s more accurately “one of” the wettest spots on earth. The average annual rainfall is around 500 inches but some spots on the planet, such as “Big Bog” on Maui, typically acquire even more moisture.\\nLegend Has It\\n    Road to Waialeale Basin, Kauai. Photo:  Bryce Edwards .  \\nMany legends surround this mystical peak that includes native inhabitants climbing to the top to make offerings to the Hawaiian god, Kane. Remains of a heiau (place of worship constructed from rocks) at the summit confirm that some kind of ancient activity took place here, even though getting to the water-logged location seems nearly impossible.\\nWai‘ale‘ale, which is actually a dormant shield volcano, means “rippling or overflowing water” in Hawaiian. Consider yourself lucky if you capture a glimpse of the top of the sky-high summit during your vacation. The best opportunity is during crisp, early mornings before clouds form. But you also need to be in the proper location – Līhu‘e, Kapa‘a, and Wailua offer some of the best vantage points for Wai‘ale‘ale.\\nAs Seen From Kuilau Ridge\\n    Views of Mount Waialeale from Kuilau Ridge, Kauai. Photo:  Martin Bravenboer .  \\nTo get even closer to the second-highest peak on the island you can traverse the Kuilau Ridge Trail in Wailua, located near the end of Kuamo‘o Road. About midway through the easy 2-mile roundtrip hike is a great spot for viewing the mountain.\\nWeeping Wall\\n    Mount Waialeale “Wall of Tears” from the air. Photo:  FH .  \\nFurther down the road and well beyond the paved portion is another hike that takes daring souls to the basin of Wai‘ale‘ale called the “Weeping Wall” where numerous ribbons of waterfalls cascade from the summit. But don’t even consider this adventure unless you’re accompanied by an experienced local guide, as you can easily get lost since there is no maintained trail and there is always a high risk for flash flooding that creates dangerous encounters with rushing water.\\nViews from the Alakai Swamp Trail\\n    Kilohana Overlook of Hanalei Bay. Photo:  Hawaii Savvy .  \\nThat said, there is another safer way to get close to this magical mountain – via the Alaka‘i Swamp Trail located in Koke‘e State Park. The difficult hike is about 8 miles roundtrip and you must start out extremely early to get to the midway point in time to see the vista before fog settles in. But those who see Wai‘ale‘ale uncovered at this prime vantage point, along with Hanalei Bay below, are in for a tremendous treat.\"}],\"requestId\":\"37fb09f547148c664026aa61f19c27ed\"}",
  "name": "exa_search_results_json",
  "additional_kwargs": {},
  "response_metadata": {},
  "tool_call_id": "1"
}
```

## 链式调用

我们可以通过先将工具绑定到一个[工具调用模型](/oss/javascript/langchain/tools)，然后在链中使用它：

```typescript
// @lc-docs-hide-cell

import { ChatOpenAI } from "@langchain/openai"

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
})
```

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { RunnableConfig } from "@langchain/core/runnables"
import { AIMessage } from "@langchain/core/messages"

const prompt = ChatPromptTemplate.fromMessages(
  [
    ["system", "You are a helpful assistant."],
    ["human", "{user_input}"],
    ["placeholder", "{messages}"],
  ]
)

// 指定 tool_choice 将强制模型调用此工具。
const llmWithTools = llm.bindTools([tool], {
  tool_choice: tool.name
})

const llmChain = prompt.pipe(llmWithTools);

const toolChain = async (userInput: string, config?: RunnableConfig): Promise<AIMessage> => {
  const input_ = { user_input: userInput };
  const aiMsg = await llmChain.invoke(input_, config);
  const toolMsgs = await tool.batch(aiMsg.tool_calls, config);
  return llmChain.invoke({ ...input_, messages: [aiMsg, ...toolMsgs] }, config);
};

const toolChainResult = await toolChain("What is Anthropic's estimated revenue for 2024?");
```

```typescript
const { tool_calls, content } = toolChainResult;

console.log("AIMessage", JSON.stringify({
  tool_calls,
  content
}, null, 2))
```

```text
AIMessage {
  "tool_calls": [
    {
      "name": "exa_search_results_json",
      "args": {
        "input": "Anthropic revenue 2024 projections"
      },
      "type": "tool_call",
      "id": "call_cgC1G9vjXIjHub0TkVfxiDcr"
    }
  ],
  "content": ""
}
```

## 与智能体（Agent）结合使用

我们可以创建使用 `ExaRetriever` 和 `createRetrieverTool` 的 LangChain 工具。利用这些工具，我们可以构建一个能够回答任何主题问题的简单搜索智能体。

我们将使用 LangGraph 来创建智能体。请确保已安装 `@langchain/langgraph`：

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

然后，定义智能体要使用的 LLM：

```typescript
// @lc-docs-hide-cell
import { ChatOpenAI } from "@langchain/openai";

const llmForAgent = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0
})
```

```typescript
import Exa from "exa-js";
import { createRetrieverTool } from "@langchain/classic/tools/retriever";
import { ExaRetriever } from "@langchain/exa";
import { createAgent } from "@langchain/classic";

// @lc-ts-ignore
const agentClient = new Exa(process.env.EXASEARCH_API_KEY);

const exaRetrieverForAgent = new ExaRetriever({
  // @lc-ts-ignore
  client: agentClient,
  searchArgs: {
    numResults: 2,
  },
});

// 将 ExaRetriever 转换为工具
const searchToolForAgent = createRetrieverTool(exaRetrieverForAgent, {
  name: "search",
  description: "根据字符串搜索查询获取网页内容。",
});

const toolsForAgent = [searchToolForAgent];

const agentExecutor = createAgent({
  llm: llmForAgent,
  tools: toolsForAgent,
})
```

```typescript
const exampleQuery = "
