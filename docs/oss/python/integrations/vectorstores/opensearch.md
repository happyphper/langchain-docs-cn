---
title: OpenSearch
---
<提示>
**兼容性说明**

仅在 Node.js 环境下可用。
</提示>

[OpenSearch](https://opensearch.org/) 是 [Elasticsearch](https://www.elastic.co/elasticsearch/) 的一个分支，完全兼容 Elasticsearch API。了解更多关于其对近似最近邻（Approximate Nearest Neighbors）的支持，请参阅[此处](https://opensearch.org/docs/latest/search-plugins/knn/approximate-knn/)。

LangChain.js 接受 [@opensearch-project/opensearch](https://opensearch.org/docs/latest/clients/javascript/index/) 作为 OpenSearch 向量存储的客户端。

## 设置

<提示>
关于安装 LangChain 包的通用说明，请参阅[此章节](/oss/langchain/install)。
</提示>

```bash [npm]
npm install -S @langchain/openai @langchain/core @opensearch-project/opensearch
```
您还需要运行一个 OpenSearch 实例。您可以使用[官方 Docker 镜像](https://opensearch.org/docs/latest/opensearch/install/docker/)来开始。您也可以在[这里](https://github.com/langchain-ai/langchainjs/blob/main/examples/src/indexes/vector_stores/opensearch/docker-compose.yml)找到一个示例的 docker-compose 文件。

## 索引文档

```typescript
import { Client } from "@opensearch-project/opensearch";
import { Document } from "@langchain/classic/document";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenSearchVectorStore } from "@langchain/community/vectorstores/opensearch";

const client = new Client({
  nodes: [process.env.OPENSEARCH_URL ?? "http://127.0.0.1:9200"],
});

const docs = [
  new Document({
    metadata: { foo: "bar" },
    pageContent: "opensearch is also a vector db",
  }),
  new Document({
    metadata: { foo: "bar" },
    pageContent: "the quick brown fox jumped over the lazy dog",
  }),
  new Document({
    metadata: { baz: "qux" },
    pageContent: "lorem ipsum dolor sit amet",
  }),
  new Document({
    metadata: { baz: "qux" },
    pageContent:
      "OpenSearch is a scalable, flexible, and extensible open-source software suite for search, analytics, and observability applications",
  }),
];

await OpenSearchVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {
  client,
  indexName: process.env.OPENSEARCH_INDEX, // 默认值为 `documents`
});
```
## 查询文档

```typescript
import { Client } from "@opensearch-project/opensearch";
import { VectorDBQAChain } from "@langchain/classic/chains";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAI } from "@langchain/openai";
import { OpenSearchVectorStore } from "@langchain/community/vectorstores/opensearch";

const client = new Client({
  nodes: [process.env.OPENSEARCH_URL ?? "http://127.0.0.1:9200"],
});

const vectorStore = new OpenSearchVectorStore(new OpenAIEmbeddings(), {
  client,
});

/* 使用元数据过滤器独立搜索向量数据库 */
const results = await vectorStore.similaritySearch("hello world", 1);
console.log(JSON.stringify(results, null, 2));
/* [
    {
      "pageContent": "Hello world",
      "metadata": {
        "id": 2
      }
    }
  ] */

/* 作为链的一部分使用（目前不支持元数据过滤器） */
const model = new OpenAI();
const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
  k: 1,
  returnSourceDocuments: true,
});
const response = await chain.call({ query: "What is opensearch?" });

console.log(JSON.stringify(response, null, 2));
/*
  {
    "text": " Opensearch is a collection of technologies that allow search engines to publish search results in a standard format, making it easier for users to search across multiple sites.",
    "sourceDocuments": [
      {
        "pageContent": "What's this?",
        "metadata": {
          "id": 3
        }
      }
    ]
  }
  */
```

## 相关链接

- 向量存储 [概念指南](/oss/integrations/vectorstores)
- 向量存储 [操作指南](/oss/integrations/vectorstores)
