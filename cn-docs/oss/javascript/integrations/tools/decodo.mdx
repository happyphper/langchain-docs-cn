---
title: Decodo 工具
---
[@decodo/langchain-ts](https://www.npmjs.com/package/@decodo/langchain-ts) 包使开发者能够在他们的 LangChain 应用程序中使用 Decodo 的 Web Scraper API。

该 Web Scraper API 具有以下特点：

- **便捷的网络数据访问**：简化从网站和在线资源获取信息的过程。
- **地理灵活性**：不受区域限制地访问内容。
- **可靠的抓取**：采用先进技术避免被检测和屏蔽。

## 功能特性

@decodo/langchain-ts 插件提供以下功能：

- **网页抓取**：抓取任何 URL 并获取 Markdown 内容
- **谷歌搜索**：搜索谷歌并获取结构化的结果
- **亚马逊搜索**：搜索亚马逊并获取结构化的产品数据
- **地理位置选择**，用于获取对位置敏感的内容
- **JavaScript 渲染**，用于需要真实浏览器的目标网站
- **Markdown 输出**，以便高效地连接 LLMs

## 安装

```bash
npm install @decodo/langchain-ts
```

## 快速开始

要使用本项目中的工具，你需要一个 [Decodo 高级网页抓取 API](https://help.decodo.com/docs/web-scraping-api-core-and-advanced-plans) 订阅。可以在 [仪表板](https://dashboard.decodo.com/) 上申请免费试用。

## 示例

以下是每个工具的代理（agentic）使用示例。

### 通用工具

```typescript
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "@langchain/agents";
import { DecodoUniversalTool } from "@decodo/langchain-ts";

dotenv.config();

const main = async () => {
  const username = process.env.SCRAPER_API_USERNAME!;
  const password = process.env.SCRAPER_API_PASSWORD!;

  const decodoUniversalTool = new DecodoUniversalTool({ username, password });

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
  });

  const agent = createAgent({
    llm: model,
    tools: [decodoUniversalTool],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content:
          "scrape the wikipedia NBA 2025 season page and tell me who won in 2025?",
      },
    ],
  });

  console.log(result.messages[result.messages.length - 1].content);
};

if (require.main === module) {
  main();
}
```

更多示例，请查看 GitHub 上的 [@decodo/langchain-ts](https://github.com/Decodo/decodo-langchain-ts) 仓库。

## 谷歌搜索

```typescript
const main = async () => {
  const username = process.env.SCRAPER_API_USERNAME!;
  const password = process.env.SCRAPER_API_PASSWORD!;

  const decodoGoogleSearchTool = new DecodoGoogleSearchTool({
    username,
    password,
  });

  const model = new ChatOpenAI({
    model: "gpt-5-mini",
  });

  const agent = createAgent({
    llm: model,
    tools: [decodoGoogleSearchTool],
  });

  const prompt =
    "which mobile service provider appears first on Google in Germany?";

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  console.log(result.messages[result.messages.length - 1].content);
};
```

## 亚马逊搜索

```typescript
const main = async () => {
  const username = process.env.SCRAPER_API_USERNAME!;
  const password = process.env.SCRAPER_API_PASSWORD!;

  const decodoAmazonSearchTool = new DecodoAmazonSearchTool({
    username,
    password,
  });

  const model = new ChatOpenAI({
    model: "gpt-5-mini",
  });

  const agent = createAgent({
    llm: model,
    tools: [decodoAmazonSearchTool],
  });

  const prompt =
    "What is the cheapest laptop with a GeForce RTX 5080 on Amazon in France?";

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  console.log(result.messages[result.messages.length - 1].content);
};
```

## 配置

所有工具都接受一个 `DecodoConfig` 对象：

```typescript
type DecodoConfig = {
  username: string; // 你的 Web Advanced 产品用户名
  password: string; // 你的 Web Advanced 产品密码
};
```

## API 参数

可用参数列表请参阅 [Scraper API 文档](https://help.decodo.com/docs/web-scraping-api-parameters)。

## 许可证

MIT

## 支持

如需支持，请访问 [Decodo 文档](https://help.decodo.com/) 或在 GitHub 上提交问题。
