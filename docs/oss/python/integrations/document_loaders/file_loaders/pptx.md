---
title: PPTX 文件
---
这个示例展示了如何从 PPTX 文件中加载数据。默认情况下，PPTX 文件中的所有页面将被合并为一个文档。

## 安装

```bash [npm]
npm install officeparser
```

## 使用方式：每页一个文档

```typescript
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";

const loader = new PPTXLoader("src/document_loaders/example_data/example.pptx");

const docs = await loader.load();
```
