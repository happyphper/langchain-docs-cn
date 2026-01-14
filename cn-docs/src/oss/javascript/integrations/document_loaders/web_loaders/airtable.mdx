---
title: AirtableLoader
---
`AirtableLoader` 类提供了从 Airtable 表格加载文档的功能。它支持两种主要方法：

1. `load()`：一次性检索所有记录，适用于中小型数据集。
2. `loadLazy()`：逐个获取记录，对于大型数据集内存效率更高。

## 前提条件

确保您的 Airtable API 令牌已作为环境变量提供：

```typescript
process.env.AIRTABLE_API_TOKEN = "YOUR_AIRTABLE_API_TOKEN";
```

## 使用方法

```typescript
import { AirtableLoader } from "@langchain/community/document_loaders/web/airtable";
import { Document } from "@langchain/core/documents";

// 默认的 Airtable 加载器
const loader = new AirtableLoader({
  tableId: "YOUR_TABLE_ID",
  baseId: "YOUR_BASE_ID",
});

try {
  const documents: Document[] = await loader.load();
  console.log("Loaded documents:", documents);
} catch (error) {
  console.error("Error loading documents:", error);
}

// 惰性加载的 Airtable 加载器
const loaderLazy = new AirtableLoader({
  tableId: "YOUR_TABLE_ID",
  baseId: "YOUR_BASE_ID",
});

try {
  console.log("Lazily loading documents:");
  for await (const document of loader.loadLazy()) {
    console.log("Loaded document:", document);
  }
} catch (error) {
  console.error("Error loading documents lazily:", error);
}

// 指定视图的 Airtable 加载器
const loaderView = new AirtableLoader({
  tableId: "YOUR_TABLE_ID",
  baseId: "YOUR_BASE_ID",
  kwargs: { view: "YOUR_VIEW_NAME" },
});

try {
  const documents: Document[] = await loader.load();
  console.log("Loaded documents with view:", documents);
} catch (error) {
  console.error("Error loading documents with view:", error);
}
```
