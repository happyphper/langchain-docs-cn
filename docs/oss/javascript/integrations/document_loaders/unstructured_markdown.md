---
title: UnstructuredMarkdownLoader
---
本指南提供了 UnstructuredMarkdown [文档加载器](https://python.langchain.com/docs/concepts/document_loaders) 的快速入门概览。有关所有 __ModuleName__Loader 功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.markdown.UnstructuredMarkdownLoader.html)。

## 概述

### 集成详情

| 类 | 包 | 本地 | 可序列化 | [JS 支持](https://js.langchain.com/docs/integrations/document_loaders/file_loaders/unstructured/)|
| :--- | :--- | :---: | :---: |  :---: |
| [UnstructuredMarkdownLoader](https://python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.markdown.UnstructuredMarkdownLoader.html) | [langchain_community](https://python.langchain.com/api_reference/community/index.html) | ❌ | ❌ | ✅ |

### 加载器特性

| 来源 | 文档惰性加载 | 原生异步支持 |
| :---: | :---: | :---: |
| UnstructuredMarkdownLoader | ✅ | ❌ |

## 设置

要使用 UnstructuredMarkdownLoader 文档加载器，您需要安装 `langchain-community` 集成包和 `unstructured` Python 包。

### 凭证

使用此加载器无需凭证。

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

安装 **langchain_community** 和 **unstructured**

```python
pip install -qU langchain_community unstructured
```

## 初始化

现在我们可以实例化模型对象并加载文档。

您可以在两种模式之一中运行加载器："single" 和 "elements"。如果使用 "single" 模式，文档将作为单个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象返回。如果使用 "elements" 模式，unstructured 库会将文档拆分为诸如 `Title` 和 `NarrativeText` 等元素。您可以在模式参数后传入额外的 `unstructured` 关键字参数以应用不同的 `unstructured` 设置。

```python
from langchain_community.document_loaders import UnstructuredMarkdownLoader

loader = UnstructuredMarkdownLoader(
    "./example_data/example.md",
    mode="single",
    strategy="fast",
)
```

## 加载

```python
docs = loader.load()
docs[0]
```

```text
Document(metadata={'source': './example_data/example.md'}, page_content='Sample Markdown Document\n\nIntroduction\n\nWelcome to this sample Markdown document. Markdown is a lightweight markup language used for formatting text. It\'s widely used for documentation, readme files, and more.\n\nFeatures\n\nHeaders\n\nMarkdown supports multiple levels of headers:\n\nHeader 1: # Header 1\n\nHeader 2: ## Header 2\n\nHeader 3: ### Header 3\n\nLists\n\nUnordered List\n\nItem 1\n\nItem 2\n\nSubitem 2.1\n\nSubitem 2.2\n\nOrdered List\n\nFirst item\n\nSecond item\n\nThird item\n\nLinks\n\nOpenAI is an AI research organization.\n\nImages\n\nHere\'s an example image:\n\nCode\n\nInline Code\n\nUse code for inline code snippets.\n\nCode Block\n\n\`\`\`python def greet(name): return f"Hello, {name}!"\n\nprint(greet("World")) \`\`\`')
```

```python
print(docs[0].metadata)
```

```python
{'source': './example_data/example.md'}
```

## 惰性加载

```python
page = []
for doc in loader.lazy_load():
    page.append(doc)
    if len(page) >= 10:
        # 执行一些分页操作，例如：
        # index.upsert(page)

        page = []
page[0]
```

```text
Document(metadata={'source': './example_data/example.md', 'link_texts': ['OpenAI'], 'link_urls': ['https://www.openai.com'], 'last_modified': '2024-08-14T15:04:18', 'languages': ['eng'], 'parent_id': 'de1f74bf226224377ab4d8b54f215bb9', 'filetype': 'text/markdown', 'file_directory': './example_data', 'filename': 'example.md', 'category': 'NarrativeText', 'element_id': '898a542a261f7dc65e0072d1e847d535'}, page_content='OpenAI is an AI research organization.')
```

## 加载元素

在此示例中，我们将在 `elements` 模式下加载，这将返回 Markdown 文档中不同元素的列表：

```python
from langchain_community.document_loaders import UnstructuredMarkdownLoader

loader = UnstructuredMarkdownLoader(
    "./example_data/example.md",
    mode="elements",
    strategy="fast",
)

docs = loader.load()
len(docs)
```

```text
29
```

如您所见，从 `example.md` 文件中提取了 29 个元素。第一个元素是文档的标题，符合预期：

```python
docs[0].page_content
```

```text
'Sample Markdown Document'
```

---

## API 参考

有关 UnstructuredMarkdownLoader 所有功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.markdown.UnstructuredMarkdownLoader.html](https://python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.markdown.UnstructuredMarkdownLoader.html)
