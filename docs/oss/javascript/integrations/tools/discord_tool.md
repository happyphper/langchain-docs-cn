---
title: Discord 工具
---
Discord 工具赋予您的智能体搜索、读取和向 Discord 频道写入消息的能力。
当您需要与 Discord 频道进行交互时，此工具非常有用。

## 设置

要使用 Discord 工具，您需要安装以下官方对等依赖项：

```bash [npm]
npm install discord.js
```
## 独立使用

```typescript
import {
  DiscordGetMessagesTool,
  DiscordChannelSearchTool,
  DiscordSendMessagesTool,
  DiscordGetGuildsTool,
  DiscordGetTextChannelsTool,
} from "@langchain/community/tools/discord";

// 根据频道 ID 获取频道中的消息
const getMessageTool = new DiscordGetMessagesTool();
const messageResults = await getMessageTool.invoke("1153400523718938780");
console.log(messageResults);

// 获取公会/服务器
const getGuildsTool = new DiscordGetGuildsTool();
const guildResults = await getGuildsTool.invoke("");
console.log(guildResults);

// 在给定频道中搜索（不区分大小写）
const searchTool = new DiscordChannelSearchTool();
const searchResults = await searchTool.invoke("Test");
console.log(searchResults);

// 获取服务器的所有文本频道
const getChannelsTool = new DiscordGetTextChannelsTool();
const channelResults = await getChannelsTool.invoke("1153400523718938775");
console.log(channelResults);

// 发送消息
const sendMessageTool = new DiscordSendMessagesTool();
const sendMessageResults = await sendMessageTool.invoke("test message");
console.log(sendMessageResults);
```

## 在智能体中使用

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "@langchain/classic/agents";
import { DiscordSendMessagesTool } from "@langchain/community/tools/discord";
import { DadJokeAPI } from "@langchain/community/tools/dadjokeapi";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const tools = [new DiscordSendMessagesTool(), new DadJokeAPI()];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "zero-shot-react-description",
  verbose: true,
});

const res = await executor.invoke({
  input: `Tell a joke in the discord channel`,
});

console.log(res.output);
// "What's the best thing about elevator jokes? They work on so many levels."
```

## 相关链接

- 工具 [概念指南](/oss/langchain/tools)
- 工具 [操作指南](/oss/langchain/tools)
