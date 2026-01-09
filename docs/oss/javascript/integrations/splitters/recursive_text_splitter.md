---
title: 递归分割
---
这个[文本分割器](/oss/integrations/splitters/)是处理通用文本时的推荐选择。它通过一个字符列表进行参数化配置。它会尝试按顺序根据这些字符进行分割，直到生成的块足够小。默认列表是 `["\n\n", "\n", " ", ""]`。这样做的效果是尽可能地将所有段落（然后是句子，再是单词）保持在一起，因为这些通常被认为是语义关联最强的文本片段。

1.  文本如何分割：通过字符列表。
2.  块大小如何衡量：通过字符数量。

下面我们展示使用示例。

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

要直接获取字符串内容，请使用 `.splitText`。

要创建 LangChain <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link">Document</a> 对象（例如，用于下游任务），请使用 `.createDocuments`。

```ts
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 0 })
const texts = splitter.createDocuments([{ pageContent: "..." }])
```

```javascript
[
  { pageContent: "...", metadata: {} },
]
```

让我们看看上面为 `RecursiveCharacterTextSplitter` 设置的参数：

- `chunkSize`：块的最大大小，大小由 `lengthFunction` 决定。
- `chunkOverlap`：块之间的目标重叠量。重叠的块有助于减轻上下文在块之间分割时造成的信息丢失。

## 分割没有词边界的语言的文本

一些书写系统没有[词边界](https://en.wikipedia.org/wiki/Category:Writing_systems_without_word_boundaries)，例如中文、日文和泰文。使用默认的分隔符列表 `["\n\n", "\n", " ", ""]` 分割文本可能会导致单词被分割到不同的块中。为了保持单词的完整性，你可以覆盖分隔符列表，加入额外的标点符号：

*   添加 ASCII 句点 "`.`"、[全角](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block))句点 "`．`"（用于中文文本）和[中文句号](https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation) "`。`"（用于日文和中文）。
*   添加泰文、缅甸文、高棉文和日文中使用的[零宽空格](https://en.wikipedia.org/wiki/Zero-width_space)。
*   添加 ASCII 逗号 "`,`"、全角逗号 "`，`" 和中文顿号 "`、`"。

```ts
const splitter = new RecursiveCharacterTextSplitter({
  separators: [
    "\n\n",
    "\n",
    " ",
    ".",
    ",",
    "\u200b",  // 零宽空格
    "\uff0c",  // 全角逗号
    "\u3001",  // 中文顿号
    "\uff0e",  // 全角句点
    "\u3002",  // 中文句号
    "",
  ],
});
```

