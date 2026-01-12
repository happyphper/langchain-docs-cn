---
title: MyScale
---

<Tip>

<strong>兼容性说明</strong>

仅适用于 Node.js 环境。

</Tip>

[MyScale](https://myscale.com/) 是一个新兴的 AI 数据库，它融合了向量搜索和 SQL 分析的能力，提供托管、高效且响应迅速的使用体验。

## 设置

1.  通过 [MyScale Web 控制台](https://console.myscale.com/) 启动一个集群。更多信息请参阅 [MyScale 官方文档](https://docs.myscale.com/en/quickstart/)。
2.  启动集群后，从集群的 `Actions` 菜单中查看 `Connection Details`。您将需要主机地址、端口、用户名和密码。
3.  在您的工作空间中安装所需的 Node.js 对等依赖项。

<Tip>

有关安装 LangChain 包的通用说明，请参阅 [此章节](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install -S @langchain/openai @clickhouse/client @langchain/community @langchain/core
```

## 索引和查询文档

```typescript
import { MyScaleStore } from "@langchain/community/vectorstores/myscale";
import { OpenAIEmbeddings } from "@langchain/openai";

const vectorStore = await MyScaleStore.fromTexts(
  ["Hello world", "Bye bye", "hello nice world"],
  [
    { id: 2, name: "2" },
    { id: 1, name: "1" },
    { id: 3, name: "3" },
  ],
  new OpenAIEmbeddings(),
  {
    host: process.env.MYSCALE_HOST || "localhost",
    port: process.env.MYSCALE_PORT || "8443",
    username: process.env.MYSCALE_USERNAME || "username",
    password: process.env.MYSCALE_PASSWORD || "password",
    database: "default", // defaults to "default"
    table: "your_table", // defaults to "vector_table"
  }
);

const results = await vectorStore.similaritySearch("hello world", 1);
console.log(results);

const filteredResults = await vectorStore.similaritySearch("hello world", 1, {
  whereStr: "metadata.name = '1'",
});
console.log(filteredResults);
```

## 从现有集合查询文档

```typescript
import { MyScaleStore } from "@langchain/community/vectorstores/myscale";
import { OpenAIEmbeddings } from "@langchain/openai";

const vectorStore = await MyScaleStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  {
    host: process.env.MYSCALE_HOST || "localhost",
    port: process.env.MYSCALE_PORT || "8443",
    username: process.env.MYSCALE_USERNAME || "username",
    password: process.env.MYSCALE_PASSWORD || "password",
    database: "default", // defaults to "default"
    table: "your_table", // defaults to "vector_table"
  }
);

const results = await vectorStore.similaritySearch("hello world", 1);
console.log(results);

const filteredResults = await vectorStore.similaritySearch("hello world", 1, {
  whereStr: "metadata.name = '1'",
});
console.log(filteredResults);
```

## 相关链接

-   向量存储 [概念指南](/oss/javascript/integrations/vectorstores)
-   向量存储 [操作指南](/oss/javascript/integrations/vectorstores)
