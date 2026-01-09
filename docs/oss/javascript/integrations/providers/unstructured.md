---
title: Unstructured
---
[Unstructured.IO](https://www.unstructured.io/) 提供的 `unstructured` 包可以从 PDF 和 Word 文档等原始源文件中提取干净的文本。
本页介绍如何在 LangChain 中使用 [`unstructured`](https://github.com/Unstructured-IO/unstructured) 生态系统。

## 安装与设置

如果你使用的加载器在本地运行，请按照以下步骤安装并运行 `unstructured` 及其依赖项。

- 为了获得最小的安装占用空间，并利用开源 `unstructured` 包中不可用的功能，请使用 `pip install unstructured-client` 安装 Python SDK，同时使用 `pip install langchain-unstructured` 来使用 `UnstructuredLoader` 并通过 Unstructured API 进行远程分区。此加载器位于 LangChain 合作伙伴仓库中，而非 `langchain-community` 仓库，并且你需要一个 `api_key`，你可以[在此处](https://unstructured.io/api-key/)生成一个免费密钥。
    - Unstructured 的 SDK 文档可以在这里找到：
https://docs.unstructured.io/api-reference/api-services/sdk

- 要在本地运行所有内容，请使用 `pip install unstructured` 安装开源 Python 包，同时使用 `pip install langchain-community`，并使用上面提到的相同 `UnstructuredLoader`。
    - 你可以通过额外选项安装特定文档类型的依赖项，例如 `pip install "unstructured[docx]"`。了解更多关于额外选项的信息[请点击这里](https://docs.unstructured.io/open-source/installation/full-installation)。
    - 要安装所有文档类型的依赖项，请使用 `pip install "unstructured[all-docs]"`。
- 如果你的系统上尚未安装以下系统依赖项，请使用例如 Mac 上的 `brew install` 进行安装。根据你解析的文档类型，你可能不需要全部安装。
    - `libmagic-dev` (文件类型检测)
    - `poppler-utils` (图像和 PDF)
    - `tesseract-ocr` (图像和 PDF)
    - `qpdf` (PDF)
    - `libreoffice` (MS Office 文档)
    - `pandoc` (EPUB)
- 在本地运行时，Unstructured 还建议使用 Docker，[按照此指南](https://docs.unstructured.io/open-source/installation/docker-installation)操作，以确保所有系统依赖项都正确安装。

Unstructured API 需要 API 密钥才能发出请求。
你可以[在此处](https://unstructured.io/api-key-hosted)申请一个 API 密钥，并立即开始使用！
查看[此处的 README](https://github.com/Unstructured-IO/unstructured-api) 以开始进行 API 调用。
我们很乐意听取你的反馈，请在我们的[社区 Slack](https://join.slack.com/t/unstructuredw-kbe4326/shared_invite/zt-1x7cgo0pg-PTptXWylzPQF9xZolzCnwQ) 中告诉我们进展如何。
请继续关注我们在质量和性能方面的改进！
如果你想自托管 Unstructured API 或在本地运行它，请查看[此处的说明](https://github.com/Unstructured-IO/unstructured-api#dizzy-instructions-for-using-the-docker-image)。

## 数据加载器

`Unstructured` 的主要用途是在数据加载器中。

### UnstructuredLoader

查看[使用示例](/oss/integrations/document_loaders/unstructured_file)，了解如何将此加载器用于本地分区以及通过无服务器 Unstructured API 进行远程分区。

```python
from langchain_unstructured import UnstructuredLoader
```

### UnstructuredCHMLoader

`CHM` 代表 `Microsoft Compiled HTML Help`。

```python
from langchain_community.document_loaders import UnstructuredCHMLoader
```

### UnstructuredCSVLoader

`逗号分隔值` (`CSV`) 文件是一种使用逗号分隔值的分隔文本文件。文件的每一行都是一个数据记录。每个记录由一个或多个字段组成，字段之间用逗号分隔。

查看[使用示例](/oss/integrations/document_loaders/csv#unstructuredcsvloader)。

```python
from langchain_community.document_loaders import UnstructuredCSVLoader
```

### UnstructuredEmailLoader

查看[使用示例](/oss/integrations/document_loaders/email)。

```python
from langchain_community.document_loaders import UnstructuredEmailLoader
```

### UnstructuredEPubLoader

[EPUB](https://en.wikipedia.org/wiki/EPUB) 是一种使用 ".epub" 文件扩展名的 `电子书文件格式`。该术语是 electronic publication 的缩写，有时也写作 `ePub`。`EPUB` 被许多电子阅读器支持，并且兼容的软件可用于大多数智能手机、平板电脑和计算机。

查看[使用示例](/oss/integrations/document_loaders/epub)。

```python
from langchain_community.document_loaders import UnstructuredEPubLoader
```

### UnstructuredExcelLoader

查看[使用示例](/oss/integrations/document_loaders/microsoft_excel)。

```python
from langchain_community.document_loaders import UnstructuredExcelLoader
```

### UnstructuredFileIOLoader

查看[使用示例](/oss/integrations/document_loaders/google_drive#passing-in-optional-file-loaders)。

```python
from langchain_community.document_loaders import UnstructuredFileIOLoader
```

### UnstructuredHTMLLoader

```python
from langchain_community.document_loaders import UnstructuredHTMLLoader
```

### UnstructuredImageLoader

查看[使用示例](/oss/integrations/document_loaders/image)。

```python
from langchain_community.document_loaders import UnstructuredImageLoader
```

### UnstructuredMarkdownLoader

查看[使用示例](/oss/integrations/vectorstores/starrocks)。

```python
from langchain_community.document_loaders import UnstructuredMarkdownLoader
```

### UnstructuredODTLoader

`办公应用程序开放文档格式 (ODF)`，也称为 `OpenDocument`，是一种用于文本文档、电子表格、演示文稿和图形的开放文件格式，使用 ZIP 压缩的 XML 文件。它的开发目的是为办公应用程序提供一个开放的、基于 XML 的文件格式规范。

查看[使用示例](/oss/integrations/document_loaders/odt)。

```python
from langchain_community.document_loaders import UnstructuredODTLoader
```

### UnstructuredOrgModeLoader

[Org Mode](https://en.wikipedia.org/wiki/Org-mode) 文档是一种文档编辑、格式化和组织模式，专为自由软件文本编辑器 Emacs 中的笔记、规划和创作而设计。

查看[使用示例](/oss/integrations/document_loaders/org_mode)。

```python
from langchain_community.document_loaders import UnstructuredOrgModeLoader
```

### UnstructuredPDFLoader

```python
from langchain_community.document_loaders import UnstructuredPDFLoader
```

### UnstructuredPowerPointLoader

查看[使用示例](/oss/integrations/document_loaders/microsoft_powerpoint)。

```python
from langchain_community.document_loaders import UnstructuredPowerPointLoader
```

### UnstructuredRSTLoader

`reStructured Text` (`RST`) 文件是一种文本数据文件格式，主要用于 Python 编程语言社区的技术文档。

查看[使用示例](/oss/integrations/document_loaders/rst)。

```python
from langchain_community.document_loaders import UnstructuredRSTLoader
```

### UnstructuredRTFLoader

查看 API 文档中的使用示例。

```python
from langchain_community.document_loaders import UnstructuredRTFLoader
```

### UnstructuredTSVLoader

`制表符分隔值` (`TSV`) 文件是一种用于存储表格数据的简单、基于文本的文件格式。记录由换行符分隔，记录内的值由制表符分隔。

查看[使用示例](/oss/integrations/document_loaders/tsv)。

```python
from langchain_community.document_loaders import UnstructuredTSVLoader
```

### UnstructuredURLLoader

查看[使用示例](/oss/integrations/document_loaders/url)。

```python
from langchain_community.document_loaders import UnstructuredURLLoader
```

### UnstructuredWordDocumentLoader

查看[使用示例](/oss/integrations/document_loaders/microsoft_word#using-unstructured)。

```python
from langchain_community.document_loaders import UnstructuredWordDocumentLoader
```

### UnstructuredXMLLoader

查看[使用示例](/oss/integrations/document_loaders/xml)。

```python
from langchain_community.document_loaders import UnstructuredXMLLoader
```
