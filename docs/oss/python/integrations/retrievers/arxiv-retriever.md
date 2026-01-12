---
title: ArxivRetriever
---
`arXiv Retriever` 允许用户查询 arXiv 数据库以获取学术文章。它支持全文检索（PDF 解析）和基于摘要的检索。

有关 ArxivRetriever 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/_langchain_community.retrievers_arxiv.ArxivRetriever.html)

## 功能特性

- **查询灵活性**：支持使用自然语言查询或特定的 arXiv ID 进行搜索。
- **全文检索**：可选择获取并解析 PDF 文件。
- **摘要作为文档**：检索摘要以获得更快的搜索结果。
- **可定制选项**：可配置最大结果数和输出格式。

## 集成详情

| 检索器 | 来源 | 包 |
| ---------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `ArxivRetriever` | 来自 arXiv 的学术文章 | [`@langchain/community`](https://www.npmjs.com/package/@langchain/community) |

## 设置

确保已安装以下依赖项：

- `pdf-parse` 用于解析 PDF
- `fast-xml-parser` 用于解析来自 arXiv API 的 XML 响应

```
npm install pdf-parse fast-xml-parser
```

## 实例化

```typescript
const retriever = new ArxivRetriever({
  getFullDocuments: false, // 设置为 true 以获取完整文档（PDF）
  maxSearchResults: 5, // 要检索的最大结果数
});
```

## 用法

使用 `invoke` 方法在 arXiv 中搜索相关文章。您可以使用自然语言查询或特定的 arXiv ID。

```typescript
const query = "quantum computing";

const documents = await retriever.invoke(query);
documents.forEach((doc) => {
  console.log("Title:", doc.metadata.title);
  console.log("Content:", doc.pageContent); // 解析后的 PDF 内容
});
```

## 在链中使用

与其他检索器一样，`ArxivRetriever` 可以通过链集成到 LLM 应用程序中。以下是在链中使用该检索器的示例：

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { Document } from "@langchain/core/documents";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const prompt = ChatPromptTemplate.fromTemplate(`
Answer the question based only on the context provided.

Context: {context}

Question: {question}`);

const formatDocs = (docs: Document[]) => {
  return docs.map((doc) => doc.pageContent).join("\n\n");
};

const ragChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocs),
    question: new RunnablePassthrough(),
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

await ragChain.invoke("What are the latest advances in quantum computing?");
```

---

## API 参考

有关 ArxivRetriever 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/_langchain_community.retrievers_arxiv.ArxivRetriever.html)

## 相关链接

- [检索指南](/oss/python/langchain/retrieval)
