---
title: Chaindesk 检索器
---
这个示例展示了如何在检索链中使用 Chaindesk 检索器从 Chaindesk.ai 数据存储中检索文档。

## 使用方法

<Tip>

关于安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/community @langchain/core
```

```typescript
import { ChaindeskRetriever } from "@langchain/community/retrievers/chaindesk";

const retriever = new ChaindeskRetriever({
  datastoreId: "DATASTORE_ID",
  apiKey: "CHAINDESK_API_KEY", // 可选：私有数据存储需要
  topK: 8, // 可选：默认值为 3
});

const docs = await retriever.invoke("hello");

console.log(docs);
```

## 相关链接

- [检索指南](/oss/langchain/retrieval)
