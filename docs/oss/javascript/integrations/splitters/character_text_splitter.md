---
title: 按字符分割
---
基于字符的分割是文本分割中最简单的方法。它使用指定的字符序列（默认：`"\n\n"`）来划分文本，并通过字符数来衡量块的长度。

**关键点**：
1.  **文本如何分割**：通过给定的字符分隔符。
2.  **块大小如何衡量**：通过字符计数。

您可以选择：
- `.splitText` — 返回纯字符串块。
- `.createDocuments` — 返回 LangChain <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link">Document</a> 对象，当需要为下游任务保留元数据时很有用。

::: code-group

```bash [npm]
npm install @langchain/textsplitters
```

```bash [pnpm]
pnpm install @langchain/textsplitters
```

```bash [yarn]
yarn add @langchain/textsplitters
```

```bash [bun]
bun add @langchain/textsplitters
```

:::

```ts
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { readFileSync } from "fs";

// 示例：读取长文档
const stateOfTheUnion = readFileSync("state_of_the_union.txt", "utf8");

const splitter = new CharacterTextSplitter({
    separator: "\n\n",
    chunkSize: 1000,
    chunkOverlap: 200,
});
const texts = splitter.createDocuments([{ pageContent: stateOfTheUnion }]);
console.log(texts[0]);
```

```javascript
Document {
    pageContent: 'Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.  \n\nLast year COVID-19 kept us apart. This year we are finally together again. \n\nTonight, we meet as Democrats Republicans and Independents. But most importantly as Americans. \n\nWith a duty to one another to the American people to the Constitution. \n\nAnd with an unwavering resolve that freedom will always triumph over tyranny. \n\nSix days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways. But he badly miscalculated. \n\nHe thought he could roll into Ukraine and the world would roll over. Instead he met a wall of strength he never imagined. \n\nHe met the Ukrainian people. \n\nFrom President Zelenskyy to every Ukrainian, their fearlessness, their courage, their determination, inspires the world.'
}
```

使用 `.createDocuments` 将每个文档关联的元数据传播到输出块：

```ts
const metadatas = [{"document": 1}, {"document": 2}]
const documents = splitter.createDocuments(
    [{ pageContent: stateOfTheUnion }, { pageContent: stateOfTheUnion }],
    { metadatas: metadatas }
);
console.log(documents[0]);
```

```javascript
Document {
    pageContent: 'Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.  \n\nLast year COVID-19 kept us apart. This year we are finally together again. \n\nTonight, we meet as Democrats Republicans and Independents. But most importantly as Americans. \n\nWith a duty to one another to the American people to the Constitution. \n\nAnd with an unwavering resolve that freedom will always triumph over tyranny. \n\nSix days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways. But he badly miscalculated. \n\nHe thought he could roll into Ukraine and the world would roll over. Instead he met a wall of strength he never imagined. \n\nHe met the Ukrainian people. \n\nFrom President Zelenskyy to every Ukrainian, their fearlessness, their courage, their determination, inspires the world.',
    metadata: {'document': 1}
}
```

使用 `.splitText` 直接获取字符串内容：

```ts
splitter.splitText(stateOfTheUnion)[0]
```

```text
'Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.  \n\nLast year COVID-19 kept us apart. This year we are finally together again. \n\nTonight, we meet as Democrats Republicans and Independents. But most importantly as Americans. \n\nWith a duty to one another to the American people to the Constitution. \n\nAnd with an unwavering resolve that freedom will always triumph over tyranny. \n\nSix days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways. But he badly miscalculated. \n\nHe thought he could roll into Ukraine and the world would roll over. Instead he met a wall of strength he never imagined. \n\nHe met the Ukrainian people. \n\nFrom President Zelenskyy to every Ukrainian, their fearlessness, their courage, their determination, inspires the world.'
```

