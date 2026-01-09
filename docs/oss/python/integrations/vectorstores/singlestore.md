---
title: SingleStore
---
[SingleStoreDB](https://singlestore.com/) 是一款强大、高性能的分布式 SQL 数据库解决方案，专为在[云端](https://www.singlestore.com/cloud/)和本地环境中表现出色而设计。它拥有多功能特性集，提供无缝的部署选项，同时提供无与伦比的性能。

SingleStoreDB 的一个突出特点是其对向量存储和操作的高级支持，这使其成为需要复杂 AI 功能（如文本相似性匹配）的应用程序的理想选择。凭借内置的向量函数，如 [dot_product](https://docs.singlestore.com/managed-service/en/reference/sql-reference/vector-functions/dot_product.html) 和 [euclidean_distance](https://docs.singlestore.com/managed-service/en/reference/sql-reference/vector-functions/euclidean_distance.html)，SingleStoreDB 使开发人员能够高效地实现复杂的算法。

对于希望在 SingleStoreDB 中利用向量数据的开发人员，有一份全面的教程可供参考，该教程将指导他们了解[处理向量数据](https://docs.singlestore.com/managed-service/en/developer-resources/functional-extensions/working-with-vector-data.html)的复杂性。本教程深入探讨了 SingleStoreDB 中的向量存储，展示了其基于向量相似性进行搜索的能力。利用向量索引，可以以惊人的速度执行查询，从而实现相关数据的快速检索。

此外，SingleStoreDB 的向量存储与[基于 Lucene 的全文索引](https://docs.singlestore.com/cloud/developer-resources/functional-extensions/working-with-full-text-search/)无缝集成，实现了强大的文本相似性搜索。用户可以根据文档元数据对象的选定字段过滤搜索结果，从而提高查询精度。

SingleStoreDB 的独特之处在于其能够以各种方式结合向量和全文搜索，提供了灵活性和多功能性。无论是通过文本或向量相似性进行预过滤并选择最相关的数据，还是采用加权和方法计算最终的相似性分数，开发人员都有多种选择。

本质上，SingleStoreDB 为管理和查询向量数据提供了一个全面的解决方案，为 AI 驱动的应用程序提供了无与伦比的性能和灵活性。

<Tip>

<strong>兼容性</strong>

仅在 Node.js 上可用。

</Tip>

LangChain.js 需要 `mysql2` 库来创建到 SingleStoreDB 实例的连接。

## 设置

1.  建立 SingleStoreDB 环境。您可以选择[基于云](https://docs.singlestore.com/managed-service/en/getting-started-with-singlestoredb-cloud.html)或[本地](https://docs.singlestore.com/db/v8.1/en/developer-resources/get-started-using-singlestoredb-for-free.html)的版本。
2.  安装 mysql2 JS 客户端

```bash [npm]
npm install -S mysql2
```
## 用法

`SingleStoreVectorStore` 管理一个连接池。建议在终止应用程序之前调用 `await store.end();`，以确保所有连接都正确关闭，并防止任何可能的资源泄漏。

### 标准用法

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/openai @langchain/community @langchain/core
```

```typescript
import { SingleStoreVectorStore } from "@langchain/community/vectorstores/singlestore";
import { OpenAIEmbeddings } from "@langchain/openai";

export const run = async () => {
  const vectorStore = await SingleStoreVectorStore.fromTexts(
    ["Hello world", "Bye bye", "hello nice world"],
    [{ id: 2 }, { id: 1 }, { id: 3 }],
    new OpenAIEmbeddings(),
    {
      connectionOptions: {
        host: process.env.SINGLESTORE_HOST,
        port: Number(process.env.SINGLESTORE_PORT),
        user: process.env.SINGLESTORE_USERNAME,
        password: process.env.SINGLESTORE_PASSWORD,
        database: process.env.SINGLESTORE_DATABASE,
      },
    }
  );

  const resultOne = await vectorStore.similaritySearch("hello world", 1);
  console.log(resultOne);
  await vectorStore.end();
};
```

### 元数据过滤

```typescript
import { SingleStoreVectorStore } from "@langchain/community/vectorstores/singlestore";
import { OpenAIEmbeddings } from "@langchain/openai";

export const run = async () => {
  const vectorStore = await SingleStoreVectorStore.fromTexts(
    ["Good afternoon", "Bye bye", "Boa tarde!", "Até logo!"],
    [
      { id: 1, language: "English" },
      { id: 2, language: "English" },
      { id: 3, language: "Portugese" },
      { id: 4, language: "Portugese" },
    ],
    new OpenAIEmbeddings(),
    {
      connectionOptions: {
        host: process.env.SINGLESTORE_HOST,
        port: Number(process.env.SINGLESTORE_PORT),
        user: process.env.SINGLESTORE_USERNAME,
        password: process.env.SINGLESTORE_PASSWORD,
        database: process.env.SINGLESTORE_DATABASE,
      },
      distanceMetric: "EUCLIDEAN_DISTANCE",
    }
  );

  const resultOne = await vectorStore.similaritySearch("greetings", 1, {
    language: "Portugese",
  });
  console.log(resultOne);
  await vectorStore.end();
};
```

### 向量索引

通过利用 [ANN 向量索引](https://docs.singlestore.com/cloud/reference/sql-reference/vector-functions/vector-indexing/)，使用 SingleStore DB 8.5 或更高版本来提高搜索效率。
通过在创建向量存储对象时设置 `useVectorIndex: true`，您可以激活此功能。
此外，如果您的向量维度与默认的 OpenAI 嵌入大小 1536 不同，请确保相应地指定 `vectorSize` 参数。

### 混合搜索

```typescript
import { SingleStoreVectorStore } from "@langchain/community/vectorstores/singlestore";
import { OpenAIEmbeddings } from "@langchain/openai";

export const run = async () => {
  const vectorStore = await SingleStoreVectorStore.fromTexts(
    [
      "In the parched desert, a sudden rainstorm brought relief, as the droplets danced upon the thirsty earth, rejuvenating the landscape with the sweet scent of petrichor.",
      "Amidst the bustling cityscape, the rain fell relentlessly, creating a symphony of pitter-patter on the pavement, while umbrellas bloomed like colorful flowers in a sea of gray.",
      "High in the mountains, the rain transformed into a delicate mist, enveloping the peaks in a mystical veil, where each droplet seemed to whisper secrets to the ancient rocks below.",
      "Blanketing the countryside in a soft, pristine layer, the snowfall painted a serene tableau, muffling the world in a tranquil hush as delicate flakes settled upon the branches of trees like nature's own lacework.",
      "In the urban landscape, snow descended, transforming bustling streets into a winter wonderland, where the laughter of children echoed amidst the flurry of snowballs and the twinkle of holiday lights.",
      "Atop the rugged peaks, snow fell with an unyielding intensity, sculpting the landscape into a pristine alpine paradise, where the frozen crystals shimmered under the moonlight, casting a spell of enchantment over the wilderness below.",
    ],
    [
      { category: "rain" },
      { category: "rain" },
      { category: "rain" },
      { category: "snow" },
      { category: "snow" },
      { category: "snow" },
    ],
    new OpenAIEmbeddings(),
    {
      connectionOptions: {
        host: process.env.SINGLESTORE_HOST,
        port: Number(process.env.SINGLESTORE_PORT),
        user: process.env.SINGLESTORE_USERNAME,
        password: process.env.SINGLESTORE_PASSWORD,
        database: process.env.SINGLESTORE_DATABASE,
      },
      distanceMetric: "DOT_PRODUCT",
      useVectorIndex: true,
      useFullTextIndex: true,
    }
  );

  const resultOne = await vectorStore.similaritySearch(
    "rainstorm in parched desert, rain",
    1,
    { category: "rain" }
  );
  console.log(resultOne[0].pageContent);

  await vectorStore.setSearchConfig({
    searchStrategy: "TEXT_ONLY",
  });
  const resultTwo = await vectorStore.similaritySearch(
    "rainstorm in parched desert, rain",
    1
  );
  console.log(resultTwo[0].pageContent);

  await vectorStore.setSearchConfig({
    searchStrategy: "FILTER_BY_TEXT",
    filterThreshold: 0.1,
  });
  const resultThree = await vectorStore.similaritySearch(
    "rainstorm in parched desert, rain",
    1
  );
  console.log(resultThree[0].pageContent);

  await vectorStore.setSearchConfig({
    searchStrategy: "FILTER_BY_VECTOR",
    filterThreshold: 0.1,
  });
  const resultFour = await vectorStore.similaritySearch(
    "rainstorm in parched desert, rain",
    1
  );
  console.log(resultFour[0].pageContent);

  await vectorStore.setSearchConfig({
    searchStrategy: "WEIGHTED_SUM",
    textWeight: 0.2,
    vectorWeight: 0.8,
    vectorselectCountMultiplier: 10,
  });
  const resultFive = await vectorStore.similaritySearch(
    "rainstorm in parched desert, rain",
    1
  );
  console.log(resultFive[0].pageContent);

  await vectorStore.end();
};
```

## 相关

- 向量存储[概念指南](/oss/integrations/vectorstores)
- 向量存储[操作指南](/oss/integrations/vectorstores)
