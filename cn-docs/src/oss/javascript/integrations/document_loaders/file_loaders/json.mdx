---
title: JSON 文件
---
JSON 加载器使用 [JSON pointer](https://github.com/janl/node-jsonpointer) 来定位 JSON 文件中你想要提取的键。

### 不使用 JSON pointer 的示例

最简单的方式是不指定 JSON pointer。
加载器将加载它在 JSON 对象中找到的所有字符串。

示例 JSON 文件：

```json
{
  "texts": ["This is a sentence.", "This is another sentence."],
  "nestedTexts": {
    "one": "This is a sentence nested in an object.",
    "two": "This is another sentence nested in an object."
  }
}
```

示例代码：

```typescript
import { JSONLoader } from "@langchain/classic/document_loaders/fs/json";

const loader = new JSONLoader("src/document_loaders/example_data/example.json");

const docs = await loader.load();
/*
[
  Document {
    pageContent: 'This is a sentence.',
    metadata: { source: 'example.json', line: 1 }
  },
  Document {
    pageContent: 'This is another sentence.',
    metadata: { source: 'example.json', line: 2 }
  },
  Document {
    pageContent: 'This is a sentence nested in an object.',
    metadata: { source: 'example.json', line: 3 }
  },
  Document {
    pageContent: 'This is another sentence nested in an object.',
    metadata: { source: 'example.json', line: 4 }
  }
]
*/
```

### 使用 JSON pointer 的示例

你可以选择从 JSON 对象中的哪些键提取字符串。

在这个示例中，我们只想从 "from" 和 "surname" 条目中提取信息。

```json
{
  "1": {
    "body": "BD 2023 SUMMER",
    "from": "LinkedIn Job",
    "labels": ["IMPORTANT", "CATEGORY_UPDATES", "INBOX"]
  },
  "2": {
    "body": "Intern, Treasury and other roles are available",
    "from": "LinkedIn Job2",
    "labels": ["IMPORTANT"],
    "other": {
      "name": "plop",
      "surname": "bob"
    }
  }
}
```

示例代码：

```typescript
import { JSONLoader } from "@langchain/classic/document_loaders/fs/json";

const loader = new JSONLoader(
  "src/document_loaders/example_data/example.json",
  ["/from", "/surname"]
);

const docs = await loader.load();
/*
[
  Document {
    pageContent: 'LinkedIn Job',
    metadata: { source: 'example.json', line: 1 }
  },
  Document {
    pageContent: 'LinkedIn Job2',
    metadata: { source: 'example.json', line: 2 }
  },
  Document {
    pageContent: 'bob',
    metadata: { source: 'example.json', line: 3 }
  }
]
```
