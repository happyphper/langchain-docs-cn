---
title: 按标记分割
---
语言模型有令牌（token）限制。你不应超过令牌限制。因此，当你[将文本分割](/oss/integrations/splitters/)成块时，计算令牌数量是一个好主意。存在许多分词器（tokenizer）。在计算文本中的令牌时，你应该使用与语言模型相同的分词器。

## js-tiktoken

<Note>

<strong>[js-tiktoken](https://github.com/dqbd/tiktoken) 是 `OpenAI` 创建的 `BPE` 分词器的 JavaScript 版本。</strong>

</Note>

我们可以使用 `tiktoken` 通过 <a href="https://reference.langchain.com/javascript/classes/_langchain_textsplitters.TokenTextSplitter.html" target="_blank" rel="noreferrer" class="link">TokenTextSplitter</a> 来估算使用的令牌数。对于 OpenAI 模型，这可能更准确。

1.  文本如何分割：按传入的字符分割。
2.  块大小如何测量：通过 `tiktoken` 分词器。

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
import { TokenTextSplitter } from "@langchain/textsplitters";
import { readFileSync } from "fs";

// 示例：读取长文档
const stateOfTheUnion = readFileSync("state_of_the_union.txt", "utf8");
```

要使用 <a href="https://reference.langchain.com/javascript/classes/_langchain_textsplitters.TokenTextSplitter.html" target="_blank" rel="noreferrer" class="link">TokenTextSplitter</a> 进行分割，然后使用 `tiktoken` 合并块，请在初始化 <a href="https://reference.langchain.com/javascript/classes/_langchain_textsplitters.TokenTextSplitter.html" target="_blank" rel="noreferrer" class="link">TokenTextSplitter</a> 时传入 `encodingName`（例如 cl100k_base）。请注意，此方法的分割结果可能大于 `tiktoken` 分词器测量的块大小。

```ts
import { TokenTextSplitter } from "@langchain/textsplitters";

// 示例：使用 cl100k_base 编码
const splitter = new TokenTextSplitter({ encodingName: "cl100k_base", chunkSize: 10, chunkOverlap: 0 });

const texts = splitter.splitText(stateOfTheUnion);
console.log(texts[0]);
```

```text
Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.

Last year COVID-19 kept us apart. This year we are finally together again.

Tonight, we meet as Democrats Republicans and Independents. But most importantly as Americans.

With a duty to one another to the American people to the Constitution.
```

