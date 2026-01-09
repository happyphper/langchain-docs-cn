---
title: WRITER PDF 解析器
---
本指南提供了快速入门使用 WRITER `PDFParser` [文档加载器](/oss/integrations/document_loaders/) 的概述。

WRITER 的 [PDF 解析器](https://dev.writer.com/api-guides/api-reference/tool-api/pdf-parser#parse-pdf) 可将 PDF 文档转换为其他格式，如文本或 Markdown。当您需要从 PDF 文件中提取和处理文本内容以进行进一步分析或集成到工作流中时，这尤其有用。在 `langchain-writer` 中，我们将 WRITER 的 PDF 解析器作为 LangChain 文档解析器提供使用。

<Warning>

<strong>弃用通知</strong>：parse PDF 工具已弃用，并将在 <strong>2025 年 12 月 22 日</strong> 移除。

<strong>迁移路径</strong>：我们计划为聊天补全引入一个预构建的 PDF 解析工具，它将提供类似的功能。该工具的工作方式将与其他预构建工具类似。当此替代方案可用时，我们将提供更多详细信息。

</Warning>

## 概述

### 集成详情

| 类                                                                                                                              | 包          | 本地 | 可序列化 | JS 支持 |                                        下载量                                         |                                        版本                                         |
|:-----------------------------------------------------------------------------------------------------------------------------------|:-----------------| :---: | :---: |:----------:|:------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------:|
| [PDFParser](https://github.com/writer/langchain-writer/blob/main/langchain_writer/pdf_parser.py#L55) | [langchain-writer](https://pypi.org/project/langchain-writer/) |      ❌       |                                       ❌                                       | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-writer?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-writer?style=flat-square&label=%20) |

## 设置

`PDFParser` 在 `langchain-writer` 包中可用：

```python
pip install --quiet -U langchain-writer
```

### 凭证

注册 [WRITER AI Studio](https://app.writer.com/aistudio/signup?utm_campaign=devrel) 以生成 API 密钥（您可以按照此 [快速入门](https://dev.writer.com/api-guides/quickstart) 操作）。然后，设置 WRITER_API_KEY 环境变量：

```python
import getpass
import os

if not os.getenv("WRITER_API_KEY"):
    os.environ["WRITER_API_KEY"] = getpass.getpass("Enter your WRITER API key: ")
```

设置 [LangSmith](https://smith.langchain.com/) 以获得一流的可观测性也很有帮助（但不是必需的）。如果您希望这样做，可以设置 `LANGSMITH_TRACING` 和 `LANGSMITH_API_KEY` 环境变量：

```python
os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()
```

### 实例化

接下来，使用所需的输出格式实例化一个 WRITER PDF 解析器：

```python
from langchain_writer.pdf_parser import PDFParser

parser = PDFParser(format="markdown")
```

## 用法

有两种使用 PDF 解析器的方式：同步或异步。无论哪种情况，PDF 解析器都将返回一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象列表，每个对象包含 PDF 文件一页的解析内容。

### 同步使用

要同步调用 PDF 解析器，请将一个引用要解析的 PDF 文件的 `Blob` 对象传递给 `parse` 方法：

```python
from langchain_core.documents.base import Blob

file = Blob.from_path("../example_data/layout-parser-paper.pdf")

parsed_pages = parser.parse(blob=file)
parsed_pages
```

### 异步使用

要异步调用 PDF 解析器，请将一个引用要解析的 PDF 文件的 `Blob` 对象传递给 `aparse` 方法：

```python
parsed_pages_async = await parser.aparse(blob=file)
parsed_pages_async
```

---

## API 参考

有关所有 `PDFParser` 功能和配置的详细文档，请前往 [API 参考](https://python.langchain.com/api_reference/writer/pdf_parser/langchain_writer.pdf_parser.PDFParser.html#langchain_writer.pdf_parser.PDFParser)。

## 其他资源

您可以在 [WRITER 文档](https://dev.writer.com/home) 中找到有关 WRITER 模型（包括成本、上下文窗口和受支持的输入类型）和工具的信息。
