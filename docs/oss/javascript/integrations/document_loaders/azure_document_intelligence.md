---
title: Azure AI 文档智能
---
>[Azure AI Document Intelligence](https://aka.ms/doc-intelligence)（原名 `Azure Form Recognizer`）是一项基于机器学习的服务，能够从数字或扫描的 PDF、图像、Office 和 HTML 文件中提取文本（包括手写内容）、表格、文档结构（例如标题、章节标题等）以及键值对。

>Document Intelligence 支持 `PDF`、`JPEG/JPG`、`PNG`、`BMP`、`TIFF`、`HEIF`、`DOCX`、`XLSX`、`PPTX` 和 `HTML` 格式。

当前使用 `Document Intelligence` 实现的加载器可以按页整合内容，并将其转换为 LangChain 文档。默认输出格式为 Markdown，可以轻松与 `MarkdownHeaderTextSplitter` 链式使用，以实现语义文档分块。您也可以使用 `mode="single"` 或 `mode="page"` 来返回单页的纯文本或按页分割的文档。

## 前提条件

需要一个位于以下三个预览区域之一的 Azure AI Document Intelligence 资源：**美国东部**、**美国西部 2**、**西欧** - 如果您还没有，请按照[此文档](https://learn.microsoft.com/azure/ai-services/document-intelligence/create-document-intelligence-resource?view=doc-intel-4.0.0)创建一个。您需要将 `<endpoint>` 和 `<key>` 作为参数传递给加载器。

```python
pip install -qU  langchain langchain-community azure-ai-documentintelligence
```

## 示例 1

第一个示例使用一个本地文件，该文件将被发送到 Azure AI Document Intelligence。

初始化文档分析客户端后，我们可以继续创建 DocumentIntelligenceLoader 的实例：

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

默认输出包含一个 LangChain 文档，其内容为 Markdown 格式：

```python
documents
```

## 示例 2

输入文件也可以是公共 URL 路径。例如，[raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png)。

```python
url_path = "<url>"
loader = AzureAIDocumentIntelligenceLoader(
    api_endpoint=endpoint, api_key=key, url_path=url_path, api_model="prebuilt-layout"
)

documents = loader.load()
```

```python
documents
```

## 示例 3

您也可以指定 `mode="page"` 来按页加载文档。

```python
from langchain_community.document_loaders import AzureAIDocumentIntelligenceLoader

file_path = "<filepath>"
endpoint = "<endpoint>"
key = "<key>"
loader = AzureAIDocumentIntelligenceLoader(
    api_endpoint=endpoint,
    api_key=key,
    file_path=file_path,
    api_model="prebuilt-layout",
    mode="page",
)

documents = loader.load()
```

输出将是列表中的每个页面存储为一个单独的文档：

```python
for document in documents:
    print(f"Page Content: {document.page_content}")
    print(f"Metadata: {document.metadata}")
```

## 示例 4

您还可以指定 `analysis_feature=["ocrHighResolution"]` 来启用附加功能。更多信息，请参阅：[aka.ms/azsdk/python/documentintelligence/analysisfeature](https://aka.ms/azsdk/python/documentintelligence/analysisfeature)。

```python
from langchain_community.document_loaders import AzureAIDocumentIntelligenceLoader

file_path = "<filepath>"
endpoint = "<endpoint>"
key = "<key>"
analysis_features = ["ocrHighResolution"]
loader = AzureAIDocumentIntelligenceLoader(
    api_endpoint=endpoint,
    api_key=key,
    file_path=file_path,
    api_model="prebuilt-layout",
    analysis_features=analysis_features,
)

documents = loader.load()
```

输出包含通过高分辨率附加功能识别的 LangChain 文档：

```python
documents
```
