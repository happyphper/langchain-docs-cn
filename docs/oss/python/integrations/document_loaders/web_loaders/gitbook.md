---
title: GitBook
---
本示例演示了如何使用 Cheerio 从任意 GitBook 加载数据。每个页面将创建一个文档。

## 安装

```bash [npm]
npm install @langchain/community @langchain/core cheerio
```

## 从单个 GitBook 页面加载

```typescript
import { GitbookLoader } from "@langchain/community/document_loaders/web/gitbook";

const loader = new GitbookLoader(
  "https://docs.gitbook.com/product-tour/navigation"
);

const docs = await loader.load();
```

## 从给定 GitBook 的所有路径加载

为此，需要将 GitbookLoader 初始化为根路径（本例中为 https://docs.gitbook.com），并将 `shouldLoadAllPaths` 设置为 `true`。

```typescript
import { GitbookLoader } from "@langchain/community/document_loaders/web/gitbook";

const loader = new GitbookLoader("https://docs.gitbook.com", {
  shouldLoadAllPaths: true,
});

const docs = await loader.load();
```
