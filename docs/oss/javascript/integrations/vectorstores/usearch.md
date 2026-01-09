---
title: USearch
---

<Tip>

<strong>兼容性说明</strong>

仅在 Node.js 环境中可用。

</Tip>

[USearch](https://github.com/unum-cloud/usearch) 是一个用于高效相似性搜索和稠密向量聚类的库。

## 安装

安装 [usearch](https://github.com/unum-cloud/usearch/tree/main/javascript) 包，它是 [USearch](https://github.com/unum-cloud/usearch) 的 Node.js 绑定。

```bash [npm]
npm install -S usearch
```

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/openai @langchain/community @langchain/core
```

## 使用方法

### 从文本创建新索引

```typescript
import { USearch } from "@langchain/community/vectorstores/usearch";
import { OpenAIEmbeddings } from "@langchain/openai";

const vectorStore = await USearch.fromTexts(
  ["Hello world", "Bye bye", "hello nice world"],
  [{ id: 2 }, { id: 1 }, { id: 3 }],
  new OpenAIEmbeddings()
);

const resultOne = await vectorStore.similaritySearch("hello world", 1);
console.log(resultOne);
```

### 从加载器创建新索引

```typescript
import { USearch } from "@langchain/community/vectorstores/usearch";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";

// 使用加载器创建文档
const loader = new TextLoader("src/document_loaders/example_data/example.txt");
const docs = await loader.load();

// 将文档加载到向量存储中
const vectorStore = await USearch.fromDocuments(docs, new OpenAIEmbeddings());

// 搜索最相似的文档
const resultOne = await vectorStore.similaritySearch("hello world", 1);
console.log(resultOne);
```

## 相关链接

- 向量存储[概念指南](/oss/integrations/vectorstores)
- 向量存储[操作指南](/oss/integrations/vectorstores)
