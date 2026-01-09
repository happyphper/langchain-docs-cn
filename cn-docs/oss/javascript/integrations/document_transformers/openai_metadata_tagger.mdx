---
title: OpenAI 函数元数据标记器
---
为已摄入的文档添加结构化元数据（如文档标题、语气或长度）通常非常有用，以便后续进行更有针对性的相似性搜索。然而，对于大量文档，手动执行此标记过程可能非常繁琐。

`MetadataTagger` 文档转换器通过根据提供的模式从每个文档中提取元数据来自动化此过程。它在底层使用了可配置的 OpenAI Functions 驱动的链，因此如果您传递自定义的 LLM 实例，它必须是支持 functions 的 OpenAI 模型。

**注意：** 此文档转换器最适合处理完整的文档，因此最好先对整个文档运行它，然后再进行任何其他拆分或处理！

### 使用方法

例如，假设您想要索引一组电影评论。您可以按如下方式初始化文档转换器：

```typescript
import * as z from "zod";
import { createMetadataTaggerFromZod } from "@langchain/classic/document_transformers/openai_functions";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

const zodSchema = z.object({
  movie_title: z.string(),
  critic: z.string(),
  tone: z.enum(["positive", "negative"]),
  rating: z
    .optional(z.number())
    .describe("The number of stars the critic rated the movie"),
});

const metadataTagger = createMetadataTaggerFromZod(zodSchema, {
  llm: new ChatOpenAI({ model: "gpt-3.5-turbo" }),
});

const documents = [
  new Document({
    pageContent:
      "Review of The Bee Movie\nBy Roger Ebert\nThis is the greatest movie ever made. 4 out of 5 stars.",
  }),
  new Document({
    pageContent:
      "Review of The Godfather\nBy Anonymous\n\nThis movie was super boring. 1 out of 5 stars.",
    metadata: { reliable: false },
  }),
];
const taggedDocuments = await metadataTagger.transformDocuments(documents);

console.log(taggedDocuments);

/*
  [
    Document {
      pageContent: 'Review of The Bee Movie\n' +
        'By Roger Ebert\n' +
        'This is the greatest movie ever made. 4 out of 5 stars.',
      metadata: {
        movie_title: 'The Bee Movie',
        critic: 'Roger Ebert',
        tone: 'positive',
        rating: 4
      }
    },
    Document {
      pageContent: 'Review of The Godfather\n' +
        'By Anonymous\n' +
        '\n' +
        'This movie was super boring. 1 out of 5 stars.',
      metadata: {
        movie_title: 'The Godfather',
        critic: 'Anonymous',
        tone: 'negative',
        rating: 1,
        reliable: false
      }
    }
  ]
*/
```

还有一个额外的 `createMetadataTagger` 方法，它也接受有效的 JSON Schema 对象。

### 自定义

您可以在第二个选项参数中向底层的标记链传递标准的 LLMChain 参数。
例如，如果您希望 LLM 关注输入文档中的特定细节，或以某种风格提取元数据，您可以传递一个自定义提示：

```typescript
import * as z from "zod";
import { createMetadataTaggerFromZod } from "@langchain/classic/document_transformers/openai_functions";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { PromptTemplate } from "@langchain/core/prompts";

const taggingChainTemplate = `Extract the desired information from the following passage.
Anonymous critics are actually Roger Ebert.

Passage:
{input}
*/

const zodSchema = z.object({
  movie_title: z.string(),
  critic: z.string(),
  tone: z.enum(["positive", "negative"]),
  rating: z
    .optional(z.number())
    .describe("The number of stars the critic rated the movie"),
});

const metadataTagger = createMetadataTaggerFromZod(zodSchema, {
  llm: new ChatOpenAI({ model: "gpt-3.5-turbo" }),
  prompt: PromptTemplate.fromTemplate(taggingChainTemplate),
});

const documents = [
  new Document({
    pageContent:
      "Review of The Bee Movie\nBy Roger Ebert\nThis is the greatest movie ever made. 4 out of 5 stars.",
  }),
  new Document({
    pageContent:
      "Review of The Godfather\nBy Anonymous\n\nThis movie was super boring. 1 out of 5 stars.",
    metadata: { reliable: false },
  }),
];
const taggedDocuments = await metadataTagger.transformDocuments(documents);

console.log(taggedDocuments);

/*
  [
    Document {
      pageContent: 'Review of The Bee Movie\n' +
        'By Roger Ebert\n' +
        'This is the greatest movie ever made. 4 out of 5 stars.',
      metadata: {
        movie_title: 'The Bee Movie',
        critic: 'Roger Ebert',
        tone: 'positive',
        rating: 4
      }
    },
    Document {
      pageContent: 'Review of The Godfather\n' +
        'By Anonymous\n' +
        '\n' +
        'This movie was super boring. 1 out of 5 stars.',
      metadata: {
        movie_title: 'The Godfather',
        critic: 'Roger Ebert',
        tone: 'negative',
        rating: 1,
        reliable: false
      }
    }
  ]
*/
```
