---
title: 字幕
---
本示例演示了如何从字幕文件中加载数据。每个字幕文件将创建一个文档。

## 设置

```bash [npm]
npm install srt-parser-2
```

## 使用方法

```typescript
import { SRTLoader } from "@langchain/community/document_loaders/fs/srt";

const loader = new SRTLoader(
  "src/document_loaders/example_data/Star_Wars_The_Clone_Wars_S06E07_Crisis_at_the_Heart.srt"
);

const docs = await loader.load();
```
