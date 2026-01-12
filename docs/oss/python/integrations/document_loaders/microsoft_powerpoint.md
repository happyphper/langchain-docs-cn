---
title: Microsoft PowerPoint
---
>[Microsoft PowerPoint](https://en.wikipedia.org/wiki/Microsoft_PowerPoint) 是微软公司的一款演示文稿程序。

本文档介绍如何将 `Microsoft PowerPoint` 文档加载成可供下游使用的文档格式。

关于在本地设置 Unstructured 的更多说明（包括设置所需的系统依赖项），请参阅[本指南](/oss/python/integrations/providers/unstructured/)。

```python
# 安装包
pip install unstructured
pip install python-magic
pip install python-pptx
```

```python
from langchain_community.document_loaders import UnstructuredPowerPointLoader

loader = UnstructuredPowerPointLoader("./example_data/fake-power-point.pptx")

data = loader.load()

data
```

```python
[Document(page_content='Adding a Bullet Slide\n\nFind the bullet slide layout\n\nUse _TextFrame.text for first bullet\n\nUse _TextFrame.add_paragraph() for subsequent bullets\n\nHere is a lot of text!\n\nHere is some text in a text box!', metadata={'source': './example_data/fake-power-point.pptx'})]
```

### 保留元素

在底层，`Unstructured` 会为不同的文本块创建不同的“元素”。默认情况下，我们会将它们合并在一起，但您可以通过指定 `mode="elements"` 轻松地保持这种分离。

```python
loader = UnstructuredPowerPointLoader(
    "./example_data/fake-power-point.pptx", mode="elements"
)

data = loader.load()

data[0]
```

```python
Document(page_content='Adding a Bullet Slide', metadata={'source': './example_data/fake-power-point.pptx', 'category_depth': 0, 'file_directory': './example_data', 'filename': 'fake-power-point.pptx', 'last_modified': '2023-12-19T13:42:18', 'page_number': 1, 'languages': ['eng'], 'filetype': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'category': 'Title'})
```

## 使用 Azure AI Document Intelligence

>[Azure AI Document Intelligence](https://aka.ms/doc-intelligence)（原名 `Azure Form Recognizer`）是一项基于机器学习的服务，可从数字或扫描的 PDF、图像、Office 和 HTML 文件中提取文本（包括手写体）、表格、文档结构（例如标题、章节标题等）以及键值对。
>
>Document Intelligence 支持 `PDF`、`JPEG/JPG`、`PNG`、`BMP`、`TIFF`、`HEIF`、`DOCX`、`XLSX`、`PPTX` 和 `HTML`。

当前使用 `Document Intelligence` 的加载器实现可以按页合并内容并将其转换为 LangChain 文档。默认输出格式为 Markdown，可以轻松地与 `MarkdownHeaderTextSplitter` 链接以实现语义文档分块。您也可以使用 `mode="single"` 或 `mode="page"` 来返回单页的纯文本或按页分割的文档。

## 先决条件

一个位于以下三个预览区域之一的 Azure AI Document Intelligence 资源：**美国东部**、**美国西部 2**、**西欧** - 如果您还没有，请按照[此文档](https://learn.microsoft.com/azure/ai-services/document-intelligence/create-document-intelligence-resource?view=doc-intel-4.0.0)创建一个。您需要将 `<endpoint>` 和 `<key>` 作为参数传递给加载器。

```python
pip install -qU  langchain langchain-community azure-ai-documentintelligence
```

```python
from langchain_community.document_loaders import AzureAIDocumentIntelligenceLoader

file_path = "<filepath>"
endpoint = "<endpoint>"
key = "<key>"
loader = AzureAIDocumentIntelligenceLoader(
    api_endpoint=endpoint, api_key=key, file_path=file_path, api_model="prebuilt-layout"
)

documents = loader.load()
```
