---
title: 代码分割
---
<a href="https://reference.langchain.com/javascript/classes/_langchain_textsplitters.RecursiveCharacterTextSplitter.html" target="_blank" rel="noreferrer" class="link">RecursiveCharacterTextSplitter</a> 包含预定义的分隔符列表，这些列表对于在特定编程语言中[分割文本](/oss/integrations/splitters/)非常有用。

支持的语言保存在 `SupportedTextSplitterLanguages` 类型中。它们包括：

```
"cpp",
"go",
"java",
"js",
"php",
"proto",
"python",
"rst",
"ruby",
"rust",
"scala",
"swift",
"markdown",
"latex",
"html",
"sol",
```

要查看给定语言的分隔符列表，请将此枚举中的一个值传递给：

```ts
RecursiveCharacterTextSplitter.getSeparatorsForLanguage()
```

要实例化针对特定语言定制的分割器，请将此枚举中的一个值传递给：

```ts
RecursiveCharacterTextSplitter.fromLanguage()
```

下面我们演示各种语言的示例。

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

## Python

以下是使用 Python 文本分割器的示例：

```ts
const pythonSplitter = RecursiveCharacterTextSplitter.fromLanguage(
    "python",
    { chunkSize: 50, chunkOverlap: 0 }
);
const pythonDocs = pythonSplitter.createDocuments([{ pageContent: PYTHON_CODE }]);
console.log(pythonDocs);
```

```javascript
[
    Document { metadata: {}, pageContent: 'def hello_world():\n    print("Hello, World!")' },
    Document { metadata: {}, pageContent: '# Call the function\nhello_world()' }
]
```

## JS

以下是使用 JS 文本分割器的示例：

```ts
const JS_CODE = `
function helloWorld() {
  console.log("Hello, World!");
}

// Call the function
helloWorld();
`;

const jsSplitter = RecursiveCharacterTextSplitter.fromLanguage(
    "js",
    { chunkSize: 60, chunkOverlap: 0 }
);
const jsDocs = jsSplitter.createDocuments([{ pageContent: JS_CODE }]);
console.log(jsDocs);
```

```javascript
[
    Document { metadata: {}, pageContent: 'function helloWorld() {\n  console.log("Hello, World!");\n}' },
    Document { metadata: {}, pageContent: '// Call the function\nhelloWorld()' }
]
```

## TS

以下是使用 TypeScript 文本分割器的示例：

```ts
const TS_CODE = `
function helloWorld(): void {
  console.log("Hello, World!");
}

// Call the function
helloWorld();
`;

const tsSplitter = RecursiveCharacterTextSplitter.fromLanguage(
    "ts",
    { chunkSize: 60, chunkOverlap: 0 }
);
const tsDocs = tsSplitter.createDocuments([{ pageContent: TS_CODE }]);
console.log(tsDocs);
```

```javascript
[
    Document { metadata: {}, pageContent: 'function helloWorld(): void {' },
    Document { metadata: {}, pageContent: 'console.log("Hello, World!");\n}' },
    Document { metadata: {}, pageContent: '// Call the function\nhelloWorld()' }
]
```

## Markdown

以下是使用 Markdown 文本分割器的示例：

```ts
const markdownText = `
# 🦜️🔗 LangChain

⚡ Building applications with LLMs through composability ⚡

## What is LangChain?

# Hopefully this code block isn't split
LangChain is a framework for...

As an open-source project in a rapidly developing field, we are extremely open to contributions.
`;

const mdSplitter = RecursiveCharacterTextSplitter.fromLanguage(
    "markdown",
    { chunkSize: 60, chunkOverlap: 0 }
);
const mdDocs = mdSplitter.createDocuments([{ pageContent: markdownText }]);
console.log(mdDocs);
```

```javascript
[
    Document { metadata: {}, pageContent: '# 🦜️🔗 LangChain' },
    Document { metadata: {}, pageContent: '⚡ Building applications with LLMs through composability ⚡' },
    Document { metadata: {}, pageContent: '## What is LangChain?' },
    Document { metadata: {}, pageContent: "# Hopefully this code block isn't split" },
    Document { metadata: {}, pageContent: 'LangChain is a framework for...' },
    Document { metadata: {}, pageContent: 'As an open-source project in a rapidly developing field, we' },
    Document { metadata: {}, pageContent: 'are extremely open to contributions.' }
]
```

## Latex

以下是关于 Latex 文本的示例：

```ts
const latexText = `
\\documentclass{article}

\\begin{document}

\\maketitle

\\section{Introduction}
Large language models (LLMs) are a type of machine learning model that can be trained on vast amounts of text data to generate human-like language. In recent years, LLMs have made significant advances in a variety of natural language processing tasks, including language translation, text generation, and sentiment analysis.

\\subsection{History of LLMs}
The earliest LLMs were developed in the 1980s and 1990s, but they were limited by the amount of data that could be processed and the computational power available at the time. In the past decade, however, advances in hardware and software have made it possible to train LLMs on massive datasets, leading to significant improvements in performance.

\\subsection{Applications of LLMs}
LLMs have many applications in industry, including chatbots, content creation, and virtual assistants. They can also be used in academia for research in linguistics, psychology, and computational linguistics.

\\end{document}
`;

const latexSplitter = RecursiveCharacterTextSplitter.fromLanguage(
    "latex",
    { chunkSize: 60, chunkOverlap: 0 }
);
const latexDocs = latexSplitter.createDocuments([{ pageContent: latexText }]);
console.log(latexDocs);
```

```javascript
[
    Document { metadata: {}, pageContent: '\\documentclass{article}\n\n\\begin{document}\n\n\\maketitle' },
    Document { metadata: {}, pageContent: '\\section{Introduction}' },
    Document { metadata: {}, pageContent: 'Large language models (LLMs) are a type of machine learning' },
    Document { metadata: {}, pageContent: 'model that can be trained on vast amounts of text data to' },
    Document { metadata: {}, pageContent: 'generate human-like language. In recent years, LLMs have' },
    Document { metadata: {}, pageContent: 'made significant advances in a variety of natural language' },
    Document { metadata: {}, pageContent: 'processing tasks, including language translation, text' },
    Document { metadata: {}, pageContent: 'generation, and sentiment analysis.' },
    Document { metadata: {}, pageContent: '\\subsection{History of LLMs}' },
    Document { metadata: {}, pageContent: 'The earliest LLMs were developed in the 1980s and 1990s,' },
    Document { metadata: {}, pageContent: 'but they were limited by the amount of data that could be' },
    Document { metadata: {}, pageContent: 'processed and the computational power available at the' },
    Document { metadata: {}, pageContent: 'time. In the past decade, however, advances in hardware and' },
    Document { metadata: {}, pageContent: 'software have made it possible to train LLMs on massive' },
    Document { metadata: {}, pageContent: 'datasets, leading to significant improvements in' },
    Document { metadata: {}, pageContent: 'performance.' },
    Document { metadata: {}, pageContent: '\\subsection{Applications of LLMs}' },
    Document { metadata: {}, pageContent: 'LLMs have many applications in industry, including' },
    Document { metadata: {}, pageContent: 'chatbots, content creation, and virtual assistants. They' },
    Document { metadata: {}, pageContent: 'can also be used in academia for research in linguistics,' },
    Document { metadata: {}, pageContent: 'psychology, and computational linguistics.' },
    Document { metadata: {}, pageContent: '\\end{document}' }
]
```

## HTML
:::python
以下是使用 HTML 文本分割器的示例：

```python
html_text = """
<!DOCTYPE html>
<html>
    <head>
        <title>🦜️🔗 LangChain</title>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            h1 {
                color: darkblue;
            }
        </style>
    </head>
    <body>
        <div>
            <h1>🦜️🔗 LangChain</h1>
            <p>⚡ Building applications with LLMs through composability ⚡</p>
        </div>
        <div>
            As an open-source project in a rapidly developing field, we are extremely open to contributions.
        </div>
    </body>
</html>
"""
```

```python
html_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.HTML, chunk_size=60, chunk_overlap=0
)
html_docs = html_splitter.create_documents([html_text])
html_docs
```

```text
[Document(metadata={}, page_content='<!DOCTYPE html>\n<html>'),
 Document(metadata={}, page_content='<head>\n        <title>🦜️🔗 LangChain</title>'),
 Document(metadata={}, page_content='<style>\n            body {\n                font-family: Aria'),
 Document(metadata={}, page_content='l, sans-serif;\n            }\n            h1 {'),
 Document(metadata={}, page_content='color: darkblue;\n            }\n        </style>\n    </head'),
 Document(metadata={}, page_content='>'),
 Document(metadata={}, page_content='<body>'),
 Document(metadata={}, page_content='<div>\n            <h1>🦜️🔗 LangChain</h1>'),
 Document(metadata={}, page_content='<p>⚡ Building applications with LLMs through composability ⚡'),
 Document(metadata={}, page_content='</p>\n        </div>'),
 Document(metadata={}, page_content='<div
