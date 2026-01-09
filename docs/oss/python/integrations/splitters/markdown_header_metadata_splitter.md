---
title: 拆分 Markdown
---
许多聊天或问答应用在嵌入和向量存储之前，都会涉及对输入文档进行分块处理。

Pinecone 的[这些笔记](https://www.pinecone.io/learn/chunking-strategies/)提供了一些有用的建议：

```wrap
当嵌入整个段落或文档时，嵌入过程会同时考虑整体上下文以及文本内句子和短语之间的关系。这可以产生更全面的向量表示，从而捕捉文本更广泛的含义和主题。
```

如前所述，分块通常旨在将具有共同上下文的文本保持在一起。考虑到这一点，我们可能希望特别尊重文档本身的结构。例如，Markdown 文件是通过标题来组织的。在特定的标题组内创建分块是一个直观的想法。为了解决这个挑战，我们可以使用 [MarkdownHeaderTextSplitter](https://python.langchain.com/api_reference/text_splitters/markdown/langchain_text_splitters.markdown.MarkdownHeaderTextSplitter.html)。这将按照指定的标题集来分割 Markdown 文件。

例如，如果我们想分割这个 Markdown：

```markdown
md = '# Foo\n\n ## Bar\n\nHi this is Jim  \nHi this is Joe\n\n ## Baz\n\n Hi this is Molly'
```

我们可以指定要分割的标题：

```python
[("#", "Header 1"),("##", "Header 2")]
```

内容将按共同的标题进行分组或分割：
```
{'content': 'Hi this is Jim  \nHi this is Joe', 'metadata': {'Header 1': 'Foo', 'Header 2': 'Bar'}}
{'content': 'Hi this is Molly', 'metadata': {'Header 1': 'Foo', 'Header 2': 'Baz'}}
```

让我们看看下面的一些例子。

### 基本用法：

```python
pip install -qU langchain-text-splitters
```

```python
from langchain_text_splitters import MarkdownHeaderTextSplitter
```

```python
markdown_document = "# Foo\n\n    ## Bar\n\nHi this is Jim\n\nHi this is Joe\n\n ### Boo \n\n Hi this is Lance \n\n ## Baz\n\n Hi this is Molly"

headers_to_split_on = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]

markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on)
md_header_splits = markdown_splitter.split_text(markdown_document)
md_header_splits
```

```text
[Document(metadata={'Header 1': 'Foo', 'Header 2': 'Bar'}, page_content='Hi this is Jim  \nHi this is Joe'),
 Document(metadata={'Header 1': 'Foo', 'Header 2': 'Bar', 'Header 3': 'Boo'}, page_content='Hi this is Lance'),
 Document(metadata={'Header 1': 'Foo', 'Header 2': 'Baz'}, page_content='Hi this is Molly')]
```

```python
type(md_header_splits[0])
```

```text
langchain_core.documents.base.Document
```

默认情况下，`MarkdownHeaderTextSplitter` 会从输出分块的内容中移除被分割的标题。可以通过设置 `strip_headers = False` 来禁用此功能。

```python
markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on, strip_headers=False)
md_header_splits = markdown_splitter.split_text(markdown_document)
md_header_splits
```

```text
[Document(metadata={'Header 1': 'Foo', 'Header 2': 'Bar'}, page_content='# Foo  \n## Bar  \nHi this is Jim  \nHi this is Joe'),
 Document(metadata={'Header 1': 'Foo', 'Header 2': 'Bar', 'Header 3': 'Boo'}, page_content='### Boo  \nHi this is Lance'),
 Document(metadata={'Header 1': 'Foo', 'Header 2': 'Baz'}, page_content='## Baz  \nHi this is Molly')]
```

<Note>

<strong>默认的 `MarkdownHeaderTextSplitter` 会去除空格和换行符。要保留 Markdown 文档的原始格式，请查看 [`ExperimentalMarkdownSyntaxTextSplitter`](https://python.langchain.com/api_reference/text_splitters/markdown/langchain_text_splitters.markdown.ExperimentalMarkdownSyntaxTextSplitter.html)。</strong>

</Note>

### 如何将 Markdown 行作为单独的文档返回

默认情况下，`MarkdownHeaderTextSplitter` 会根据 `headers_to_split_on` 中指定的标题聚合行。我们可以通过指定 `return_each_line` 来禁用此功能：

```python
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on,
    return_each_line=True,
)
md_header_splits = markdown_splitter.split_text(markdown_document)
md_header_splits
```

```text
[Document(metadata={'Header 1': 'Foo', 'Header 2': 'Bar'}, page_content='Hi this is Jim'),
 Document(metadata={'Header 1': 'Foo', 'Header 2': 'Bar'}, page_content='Hi this is Joe'),
 Document(metadata={'Header 1': 'Foo', 'Header 2': 'Bar', 'Header 3': 'Boo'}, page_content='Hi this is Lance'),
 Document(metadata={'Header 1': 'Foo', 'Header 2': 'Baz'}, page_content='Hi this is Molly')]
```

请注意，这里每个文档的 `metadata` 中都保留了标题信息。

### 如何限制分块大小：

在每个 Markdown 组内，我们可以应用任何我们想要的文本分割器，例如 `RecursiveCharacterTextSplitter`，它允许进一步控制分块大小。

```python
markdown_document = "# Intro \n\n    ## History \n\n Markdown[9] is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber created Markdown in 2004 as a markup language that is appealing to human readers in its source code form.[9] \n\n Markdown is widely used in blogging, instant messaging, online forums, collaborative software, documentation pages, and readme files. \n\n ## Rise and divergence \n\n As Markdown popularity grew rapidly, many Markdown implementations appeared, driven mostly by the need for \n\n additional features such as tables, footnotes, definition lists,[note 1] and Markdown inside HTML blocks. \n\n #### Standardization \n\n From 2012, a group of people, including Jeff Atwood and John MacFarlane, launched what Atwood characterised as a standardisation effort. \n\n ## Implementations \n\n Implementations of Markdown are available for over a dozen programming languages."

headers_to_split_on = [
    ("#", "Header 1"),
    ("##", "Header 2"),
]

# MD 分割
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=headers_to_split_on, strip_headers=False
)
md_header_splits = markdown_splitter.split_text(markdown_document)

# 字符级分割
from langchain_text_splitters import RecursiveCharacterTextSplitter

chunk_size = 250
chunk_overlap = 30
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=chunk_size, chunk_overlap=chunk_overlap
)

# 分割
splits = text_splitter.split_documents(md_header_splits)
splits
```

```text
[Document(metadata={'Header 1': 'Intro', 'Header 2': 'History'}, page_content='# Intro  \n## History  \nMarkdown[9] is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber created Markdown in 2004 as a markup language that is appealing to human readers in its source code form.[9]'),
 Document(metadata={'Header 1': 'Intro', 'Header 2': 'History'}, page_content='Markdown is widely used in blogging, instant messaging, online forums, collaborative software, documentation pages, and readme files.'),
 Document(metadata={'Header 1': 'Intro', 'Header 2': 'Rise and divergence'}, page_content='## Rise and divergence  \nAs Markdown popularity grew rapidly, many Markdown implementations appeared, driven mostly by the need for  \nadditional features such as tables, footnotes, definition lists,[note 1] and Markdown inside HTML blocks.'),
 Document(metadata={'Header 1': 'Intro', 'Header 2': 'Rise and divergence'}, page_content='#### Standardization  \nFrom 2012, a group of people, including Jeff Atwood and John MacFarlane, launched what Atwood characterised as a standardisation effort.'),
 Document(metadata={'Header 1': 'Intro', 'Header 2': 'Implementations'}, page_content='## Implementations  \nImplementations of Markdown are available for over a dozen programming languages.')]
```

## 故障排除：`chunk_overlap` 似乎不生效

- 在基于标题的分割（例如 `MarkdownHeaderTextSplitter`）之后，使用 **`split_documents(docs)`**（而不是 `split_text`），以便重叠应用在**每个部分内部**，并且每个部分的元数据（标题）在分块上得以保留。
- 重叠仅当**单个部分**超过 `chunk_size` 并被分割成多个分块时才会出现。
- 重叠**不会跨越**部分/文档边界（例如 `# H1` → `## H2`）。
- 如果标题变成了一个很小的第一个分块，考虑将 `strip_headers` 设置为 `True`，这样标题行就不会成为一个独立的分块。
- 如果你的文本缺少换行符/空格，请在 `separators` 中保留一个回退的 `""`，以便分割器仍然可以分割并应用重叠。
