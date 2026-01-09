---
title: 代码分割
---
<a href="https://reference.langchain.com/python/langchain_text_splitters/#langchain_text_splitters.RecursiveCharacterTextSplitter" target="_blank" rel="noreferrer" class="link">RecursiveCharacterTextSplitter</a> 包含预定义的分隔符列表，这些列表对于在特定编程语言中[分割文本](/oss/integrations/splitters/)非常有用。

支持的语言存储在 `langchain_text_splitters.Language` 枚举中。它们包括：

```
"cpp",
"go",
"java",
"kotlin",
"js",
"ts",
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
"csharp",
"cobol",
"c",
"lua",
"perl",
"haskell"
```

要查看给定语言的分隔符列表，请将此枚举中的一个值传递给：

```python
RecursiveCharacterTextSplitter.get_separators_for_language
```

要实例化针对特定语言定制的分割器，请将此枚举中的一个值传递给：

```python
RecursiveCharacterTextSplitter.from_language
```

下面我们演示各种语言的示例。

```python
pip install -qU langchain-text-splitters
```

```python
from langchain_text_splitters import (
    Language,
    RecursiveCharacterTextSplitter,
)
```

要查看支持的语言的完整列表：

```python
[e.value for e in Language]
```

```python
['cpp',
 'go',
 'java',
 'kotlin',
 'js',
 'ts',
 'php',
 'proto',
 'python',
 'rst',
 'ruby',
 'rust',
 'scala',
 'swift',
 'markdown',
 'latex',
 'html',
 'sol',
 'csharp',
 'cobol',
 'c',
 'lua',
 'perl',
 'haskell',
 'elixir',
 'powershell',
 'visualbasic6']
```

你也可以查看给定语言使用的分隔符：

```python
RecursiveCharacterTextSplitter.get_separators_for_language(Language.PYTHON)
```

```python
['\nclass ', '\ndef ', '\n\tdef ', '\n\n', '\n', ' ', '']
```

## Python
以下是使用 PythonTextSplitter 的示例：

```python
PYTHON_CODE = """
def hello_world():
    print("Hello, World!")

# Call the function
hello_world()
"""
python_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PYTHON, chunk_size=50, chunk_overlap=0
)
python_docs = python_splitter.create_documents([PYTHON_CODE])
python_docs
```

```text
[Document(metadata={}, page_content='def hello_world():\n    print("Hello, World!")'),
 Document(metadata={}, page_content='# Call the function\nhello_world()')]
```

## JS
以下是使用 JS 文本分割器的示例：

```python
JS_CODE = """
function helloWorld() {
  console.log("Hello, World!");
}

// Call the function
helloWorld();
"""

js_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.JS, chunk_size=60, chunk_overlap=0
)
js_docs = js_splitter.create_documents([JS_CODE])
js_docs
```

```javascript
[Document(metadata={}, page_content='function helloWorld() {\n  console.log("Hello, World!");\n}'),
 Document(metadata={}, page_content='// Call the function\nhelloWorld();')]
```

## TS
以下是使用 TypeScript 文本分割器的示例：

```python
TS_CODE = """
function helloWorld(): void {
  console.log("Hello, World!");
}

// Call the function
helloWorld();
"""

ts_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.TS, chunk_size=60, chunk_overlap=0
)
ts_docs = ts_splitter.create_documents([TS_CODE])
ts_docs
```

```javascript
[Document(metadata={}, page_content='function helloWorld(): void {'),
 Document(metadata={}, page_content='console.log("Hello, World!");\n}'),
 Document(metadata={}, page_content='// Call the function\nhelloWorld();')]
```

## Markdown
以下是使用 Markdown 文本分割器的示例：

```python
markdown_text = """
# 🦜️🔗 LangChain

⚡ Building applications with LLMs through composability ⚡

## What is LangChain?

# Hopefully this code block isn't split
LangChain is a framework for...

As an open-source project in a rapidly developing field, we are extremely open to contributions.
"""
```

```python
md_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.MARKDOWN, chunk_size=60, chunk_overlap=0
)
md_docs = md_splitter.create_documents([markdown_text])
md_docs
```

```text
[Document(metadata={}, page_content='# 🦜️🔗 LangChain'),
 Document(metadata={}, page_content='⚡ Building applications with LLMs through composability ⚡'),
 Document(metadata={}, page_content='## What is LangChain?'),
 Document(metadata={}, page_content="# Hopefully this code block isn't split"),
 Document(metadata={}, page_content='LangChain is a framework for...'),
 Document(metadata={}, page_content='As an open-source project in a rapidly developing field, we'),
 Document(metadata={}, page_content='are extremely open to contributions.')]
```

## Latex
以下是关于 Latex 文本的示例：

```python
latex_text = """
\documentclass{article}

\begin{document}

\maketitle

\section{Introduction}
Large language models (LLMs) are a type of machine learning model that can be trained on vast amounts of text data to generate human-like language. In recent years, LLMs have made significant advances in a variety of natural language processing tasks, including language translation, text generation, and sentiment analysis.

\subsection{History of LLMs}
The earliest LLMs were developed in the 1980s and 1990s, but they were limited by the amount of data that could be processed and the computational power available at the time. In the past decade, however, advances in hardware and software have made it possible to train LLMs on massive datasets, leading to significant improvements in performance.

\subsection{Applications of LLMs}
LLMs have many applications in industry, including chatbots, content creation, and virtual assistants. They can also be used in academia for research in linguistics, psychology, and computational linguistics.

\end{document}
"""
```

```python
latex_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.MARKDOWN, chunk_size=60, chunk_overlap=0
)
latex_docs = latex_splitter.create_documents([latex_text])
latex_docs
```

```text
[Document(metadata={}, page_content='\\documentclass{article}\n\n\x08egin{document}\n\n\\maketitle'),
 Document(metadata={}, page_content='\\section{Introduction}'),
 Document(metadata={}, page_content='Large language models (LLMs) are a type of machine learning'),
 Document(metadata={}, page_content='model that can be trained on vast amounts of text data to'),
 Document(metadata={}, page_content='generate human-like language. In recent years, LLMs have'),
 Document(metadata={}, page_content='made significant advances in a variety of natural language'),
 Document(metadata={}, page_content='processing tasks, including language translation, text'),
 Document(metadata={}, page_content='generation, and sentiment analysis.'),
 Document(metadata={}, page_content='\\subsection{History of LLMs}'),
 Document(metadata={}, page_content='The earliest LLMs were developed in the 1980s and 1990s,'),
 Document(metadata={}, page_content='but they were limited by the amount of data that could be'),
 Document(metadata={}, page_content='processed and the computational power available at the'),
 Document(metadata={}, page_content='time. In the past decade, however, advances in hardware and'),
 Document(metadata={}, page_content='software have made it possible to train LLMs on massive'),
 Document(metadata={}, page_content='datasets, leading to significant improvements in'),
 Document(metadata={}, page_content='performance.'),
 Document(metadata={}, page_content='\\subsection{Applications of LLMs}'),
 Document(metadata={}, page_content='LLMs have many applications in industry, including'),
 Document(metadata={}, page_content='chatbots, content creation, and virtual assistants. They'),
 Document(metadata={}, page_content='can also be used in academia for research in linguistics,'),
 Document(metadata={}, page_content='psychology, and computational linguistics.'),
 Document(metadata={}, page_content='\\end{document}')]
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
