---
title: SearchApi 工具
---
`SearchApi` 工具可将您的智能体（agents）和链（chains）连接到互联网。

这是一个围绕 Search API 的封装工具。当您需要回答有关当前事件的问题时，此工具非常方便。

## 使用方法

输入应为一个搜索查询。

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor } from "@langchain/classic/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { AgentFinish, AgentAction } from "@langchain/core/agents";
import { BaseMessageChunk } from "@langchain/core/messages";
import { SearchApi } from "@langchain/community/tools/searchapi";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});
const tools = [
  new SearchApi(process.env.SEARCHAPI_API_KEY, {
    engine: "google_news",
  }),
];
const prefix = ChatPromptTemplate.fromMessages([
  [
    "ai",
    "Answer the following questions as best you can. In your final answer, use a bulleted list markdown format.",
  ],
  ["human", "{input}"],
]);
// 请将此替换为您实际的输出解析器。
const customOutputParser = (
  input: BaseMessageChunk
): AgentAction | AgentFinish => ({
  log: "test",
  returnValues: {
    output: input,
  },
});
// 请将此占位符智能体替换为您实际的实现。
const agent = RunnableSequence.from([prefix, model, customOutputParser]);
const executor = AgentExecutor.fromAgentAndTools({
  agent,
  tools,
});
const res = await executor.invoke({
  input: "What's happening in Ukraine today?",
});
console.log(res);
```

## 相关链接

- 工具 [概念指南](/oss/langchain/tools)
- 工具 [操作指南](/oss/langchain/tools)
