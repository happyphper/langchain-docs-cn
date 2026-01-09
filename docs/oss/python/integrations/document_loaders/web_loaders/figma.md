---
title: Figma
---
本示例演示如何从 Figma 文件中加载数据。
你需要一个 Figma 访问令牌才能开始。

```typescript
import { FigmaFileLoader } from "@langchain/community/document_loaders/web/figma";

const loader = new FigmaFileLoader({
  accessToken: "FIGMA_ACCESS_TOKEN", // 或从 process.env.FIGMA_ACCESS_TOKEN 加载
  nodeIds: ["id1", "id2", "id3"],
  fileKey: "key",
});
const docs = await loader.load();

console.log({ docs });
```

你可以通过在浏览器中打开 Figma 文件并从 URL 中提取来找到文件的密钥（key）和节点 ID（node ids）：

```
https://www.figma.com/file/<YOUR FILE KEY HERE>/LangChainJS-Test?type=whiteboard&node-id=<YOUR NODE ID HERE>&t=e6lqWkKecuYQRyRg-0
```
