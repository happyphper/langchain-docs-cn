---
title: Unstructured
---
本笔记本介绍了如何使用 `Unstructured` [文档加载器](https://python.langchain.com/docs/concepts/document_loaders) 来加载多种类型的文件。`Unstructured` 目前支持加载文本文件、PowerPoint 演示文稿、HTML、PDF、图像等。

关于在本地设置 Unstructured 的更多说明，包括设置所需的系统依赖项，请参阅[本指南](/oss/javascript/integrations/providers/unstructured)。

## 概述

### 集成详情

| 类 | 包 | 本地 | 可序列化 | [JS 支持](https://js.langchain.com/docs/integrations/document_loaders/file_loaders/unstructured/) |
| :--- | :--- | :---: | :---: | :---: |
| [UnstructuredLoader](https://python.langchain.com/api_reference/unstructured/document_loaders/langchain_unstructured.document_loaders.UnstructuredLoader.html) | [langchain-unstructured](https://python.langchain.com/api_reference/unstructured/index.html) | ✅ | ❌ | ✅ |

### 加载器特性

| 来源 | 文档惰性加载 | 原生异步支持 |
| :---: | :---: | :---: |
| UnstructuredLoader | ✅ | ❌ |

## 设置

### 凭证

默认情况下，`langchain-unstructured` 安装的是一个占用空间较小的版本，需要将分区逻辑卸载到 Unstructured API，这需要一个 API 密钥。如果您使用本地安装，则不需要 API 密钥。要获取您的 API 密钥，请访问[此网站](https://unstructured.io)获取 API 密钥，然后在下面的单元格中设置它：

```python
import getpass
import os

if "UNSTRUCTURED_API_KEY" not in os.environ:
    os.environ["UNSTRUCTURED_API_KEY"] = getpass.getpass(
        "Enter your Unstructured API key: "
    )
```

### 安装

#### 常规安装

运行本笔记本的其余部分需要以下包。

```python
# 安装包，与 API 分区兼容
pip install -qU langchain-unstructured unstructured-client unstructured "unstructured[pdf]" python-magic
```

#### 本地安装

如果您希望在本地运行分区逻辑，则需要安装一系列系统依赖项，如 [Unstructured 文档此处](https://docs.unstructured.io/open-source/installation/full-installation)所述。

例如，在 Mac 上，您可以使用以下命令安装所需的依赖项：

```bash
# 基础依赖项
brew install libmagic poppler tesseract

# 如果解析 xml / html 文档：
brew install libxml2 libxslt
```

您可以使用以下命令安装本地运行所需的 `pip` 依赖项：

```bash
pip install "langchain-unstructured[local]"
```

## 初始化

`UnstructuredLoader` 允许从多种不同的文件类型加载。要了解关于 `unstructured` 包的所有信息，请参阅其[文档](https://docs.unstructured.io/open-source/introduction/overview)。在此示例中，我们展示了从文本文件和 PDF 文件加载。

```python
from langchain_unstructured import UnstructuredLoader

file_paths = [
    "./example_data/layout-parser-paper.pdf",
    "./example_data/state_of_the_union.txt",
]

loader = UnstructuredLoader(file_paths)
```

## 加载

```python
docs = loader.load()

docs[0]
```

```text
INFO: pikepdf C++ to Python logger bridge initialized
```

```text
Document(metadata={'source': './example_data/layout-parser-paper.pdf', 'coordinates': {'points': ((16.34, 213.36), (16.34, 253.36), (36.34, 253.36), (36.34, 213.36)), 'system': 'PixelSpace', 'layout_width': 612, 'layout_height': 792}, 'file_directory': './example_data', 'filename': 'layout-parser-paper.pdf', 'languages': ['eng'], 'last_modified': '2024-02-27T15:49:27', 'page_number': 1, 'filetype': 'application/pdf', 'category': 'UncategorizedText', 'element_id': 'd3ce55f220dfb75891b4394a18bcb973'}, page_content='1 2 0 2')
```

```python
print(docs[0].metadata)
```

```python
{'source': './example_data/layout-parser-paper.pdf', 'coordinates': {'points': ((16.34, 213.36), (16.34, 253.36), (36.34, 253.36), (36.34, 213.36)), 'system': 'PixelSpace', 'layout_width': 612, 'layout_height': 792}, 'file_directory': './example_data', 'filename': 'layout-parser-paper.pdf', 'languages': ['eng'], 'last_modified': '2024-02-27T15:49:27', 'page_number': 1, 'filetype': 'application/pdf', 'category': 'UncategorizedText', 'element_id': 'd3ce55f220dfb75891b4394a18bcb973'}
```

## 惰性加载

```python
pages = []
for doc in loader.lazy_load():
    pages.append(doc)

pages[0]
```

```text
Document(metadata={'source': './example_data/layout-parser-paper.pdf', 'coordinates': {'points': ((16.34, 213.36), (16.34, 253.36), (36.34, 253.36), (36.34, 213.36)), 'system': 'PixelSpace', 'layout_width': 612, 'layout_height': 792}, 'file_directory': './example_data', 'filename': 'layout-parser-paper.pdf', 'languages': ['eng'], 'last_modified': '2024-02-27T15:49:27', 'page_number': 1, 'filetype': 'application/pdf', 'category': 'UncategorizedText', 'element_id': 'd3ce55f220dfb75891b4394a18bcb973'}, page_content='1 2 0 2')
```

## 后处理

如果您需要在提取后对 `unstructured` 元素进行后处理，可以在实例化 `UnstructuredLoader` 时，将一系列 `str` -> `str` 函数传递给 `post_processors` 关键字参数。这也适用于其他 Unstructured 加载器。下面是一个示例。

```python
from langchain_unstructured import UnstructuredLoader
from unstructured.cleaners.core import clean_extra_whitespace

loader = UnstructuredLoader(
    "./example_data/layout-parser-paper.pdf",
    post_processors=[clean_extra_whitespace],
)

docs = loader.load()

docs[5:10]
```

```text
[Document(metadata={'source': './example_data/layout-parser-paper.pdf', 'coordinates': {'points': ((16.34, 393.9), (16.34, 560.0), (36.34, 560.0), (36.34, 393.9)), 'system': 'PixelSpace', 'layout_width': 612, 'layout_height': 792}, 'file_directory': './example_data', 'filename': 'layout-parser-paper.pdf', 'languages': ['eng'], 'last_modified': '2024-02-27T15:49:27', 'page_number': 1, 'parent_id': '89565df026a24279aaea20dc08cedbec', 'filetype': 'application/pdf', 'category': 'UncategorizedText', 'element_id': 'e9fa370aef7ee5c05744eb7bb7d9981b'}, page_content='2 v 8 4 3 5 1 . 3 0 1 2 : v i X r a'),
 Document(metadata={'source': './example_data/layout-parser-paper.pdf', 'coordinates': {'points': ((157.62199999999999, 114.23496279999995), (157.62199999999999, 146.5141628), (457.7358962799999, 146.5141628), (457.7358962799999, 114.23496279999995)), 'system': 'PixelSpace', 'layout_width': 612, 'layout_height': 792}, 'file_directory': './example_data', 'filename': 'layout-parser-paper.pdf', 'languages': ['eng'], 'last_modified': '2024-02-27T15:49:27', 'page_number': 1, 'filetype': 'application/pdf', 'category': 'Title', 'element_id': 'bde0b230a1aa488e3ce837d33015181b'}, page_content='LayoutParser: A Uniﬁed Toolkit for Deep Learning Based Document Image Analysis'),
 Document(metadata={'source': './example_data/layout-parser-paper.pdf', 'coordinates': {'points': ((134.809, 168.64029940800003), (134.809, 192.2517444), (480.5464199080001, 192.2517444), (480.5464199080001, 168.64029940800003)), 'system': 'PixelSpace', 'layout_width': 612, 'layout_height': 792}, 'file_directory': './example_data', 'filename': 'layout-parser-paper.pdf', 'languages': ['eng'], 'last_modified': '2024-02-27T15:49:27', 'page_number': 1, 'parent_id': 'bde0b230a1aa488e3ce837d33015181b', 'filetype': 'application/pdf', 'category': 'UncategorizedText', 'element_id': '54700f902899f0c8c90488fa8d825bce'}, page_content='Zejiang Shen1 ((cid:0)), Ruochen Zhang2, Melissa Dell3, Benjamin Charles Germain Lee4, Jacob Carlson3, and Weining Li5'),
 Document(metadata={'source': './example_data/layout-parser-paper.pdf', 'coordinates': {'points': ((207.23000000000002, 202.57205439999996), (207.23000000000002, 311.8195408), (408.12676, 311.8195408), (408.12676, 202.57205439999996)), 'system': 'PixelSpace', 'layout_width': 612, 'layout_height': 792}, 'file_directory': './example_data', 'filename': 'layout-parser-paper.pdf', 'languages': ['eng'], 'last_modified': '2024-02-27T15:49:27', 'page_number': 1, 'parent_id': 'bde0b230a1aa488e3ce837d33015181b', 'filetype': 'application/pdf', 'category': 'UncategorizedText', 'element_id': 'b650f5867bad9bb4e30384282c79bcfe'}, page_content='1 Allen Institute for AI shannons@allenai.org 2 Brown University ruochen zhang@brown.edu 3 Harvard University {melissadell,jacob carlson}@fas.harvard.edu 4 University of Washington bcgl@cs.washington.edu 5 University of Waterloo w422li@uwaterloo.ca'),
 Document(metadata={'source': './example_data/layout-parser-paper.pdf', 'coordinates': {'points': ((162.779, 338.45008160000003), (162.779, 566.8455408), (454.0372021523199, 566.8455408), (454.0372021523199, 338.45008160000003)), 'system': 'PixelSpace', 'layout_width': 612, 'layout_height': 792}, 'file_directory': './example_data', 'filename': 'layout-parser-paper.pdf', 'languages': ['eng'], 'last_modified': '2024-02-27T15:49:27', 'links': [{'text': ':// layout - parser . github . io', 'url': 'https://layout-parser.github.io', 'start_index': 1477}], 'page_number': 1, 'parent_id': 'bde0b230a1aa488e3ce837d33015181b', 'filetype': 'application/pdf', 'category': 'NarrativeText', 'element_id': 'cfc957c94fe63c8fd7c7f4bcb56e75a7'}, page_content='Abstract. Recent advances in document image analysis (DIA) have been primarily driven by the application of neural networks. Ideally, research outcomes could be easily deployed in production and extended for further investigation. However, various factors like loosely organized codebases and sophisticated model conﬁgurations complicate the easy reuse of im- portant innovations by a wide audience. Though there have been on-going eﬀorts to improve reusability and simplify deep learning (DL) model development in disciplines like natural language processing and computer vision, none of them are optimized for challenges in the domain of DIA. This represents a major gap in the existing toolkit, as DIA is central to academic research across a wide range of disciplines in the social sciences and humanities. This paper introduces LayoutParser, an open-source library for streamlining the usage of DL in DIA research and applica- tions. The core LayoutParser library comes with a set of simple and intuitive interfaces for applying and customizing DL models for layout de- tection, character recognition, and many other document processing tasks. To promote extensibility, LayoutParser also incorporates a community platform for sharing both pre-trained models and full document digiti- zation pipelines. We demonstrate that LayoutParser is helpful for both lightweight and large-scale digitization pipelines in real-word use cases. The library is publicly available at https://layout-parser.github.io.')]
```

## Unstructured API

如果您希望使用较小的包快速上手并获取最新的分区功能，可以 `pip install unstructured-client` 和 `pip install langchain-unstructured`。有关 `UnstructuredLoader` 的更多信息，请参阅 [Unstructured 提供程序页面](https://python.langchain.com/v0.1/docs/integrations/document_loaders/unstructured_file/)。

当您传入 `api_key` 并设置 `partition_via_api=True` 时，加载器将使用托管的 Unstructured 无服务器 API 处理您的文档。您可以在此处生成免费的 Unstructured API 密钥。

如果您希望自托管 Unstructured API 或在本地运行它，请查看此处的说明。

```python
from langchain_unstructured import UnstructuredLoader

loader = UnstructuredLoader(
    file_path="example_data/fake.docx",
    api_key=os.getenv("UNSTRUCTURED_API_KEY"),
    partition_via_api=True,
)

docs = loader.load()
docs[0]
```

```text
INFO: Preparing to split document for partition.
INFO: Given file doesn't have '.pdf' extension, so splitting is not enabled.
INFO: Partitioning without split.
INFO: Successfully partitioned the document.
```

```text
Document(metadata={'source': 'example_data/fake.docx', 'category_depth': 0, 'filename': 'fake.docx', 'languages': ['por', 'cat'], 'filetype': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'category': 'Title', 'element_id': '56d531394823d81787d77a04462ed096'}, page_content='Lorem ipsum dolor sit amet.')
```

您还可以使用 `UnstructuredLoader` 通过单个 API 调用批量处理多个文件。

```python
loader = UnstructuredLoader(
    file_path=["example_data/fake.docx", "example_data/fake-email.eml"],
    api_key=os.getenv("UNSTRUCTURED_API_KEY"),
    partition_via_api=True,
)

docs = loader.load()

print(docs[0].metadata["filename"], ": ", docs[0].page_content[:100])
print(docs[-1].metadata["filename"], ": ", docs[-1].page_content[:100])
```

```text
INFO: Preparing to split document for partition.
INFO: Given file doesn't have '.pdf' extension, so splitting is not enabled.
INFO: Partitioning without split.
INFO: Successfully partitioned the document.
INFO: Preparing to split document for partition.
INFO: Given file doesn't have '.pdf' extension, so splitting is not enabled.
INFO: Partitioning without split.
INFO: Successfully partitioned the document.
```

```text
fake.docx :  Lorem ipsum dolor sit amet.
fake-email.eml :  Violets are blue
```

### Unstructured SDK 客户端

使用 Unstructured API 进行分区依赖于 [Unstructured SDK 客户端](https://docs.unstructured.io/api-reference/api-services/accessing-unstructured-api)。

如果您想自定义客户端，则必须将 `UnstructuredClient` 实例传递给 `UnstructuredLoader`。下面是一个示例，展示了如何自定义客户端的特性，例如使用您自己的 `requests.Session()`、传递替代的 `server_url` 以及自定义 `RetryConfig` 对象。有关自定义客户端或 SDK 客户端接受哪些额外参数的更多信息，请参阅 [Unstructured Python SDK](https://docs.unstructured.io/api-reference/api-services/sdk-python) 文档和 [API 参数](https://docs.unstructured.io/api-reference/api-services/api-parameters) 文档的客户端部分。请注意，所有 API 参数都应传递给 `UnstructuredLoader`。

<div class="alert alert-block alert-warning">
<b>警告：</b>下面的示例可能未使用最新版本的 UnstructuredClient，未来版本中可能会有破坏性更改。有关最新示例，请参阅 <a href="https://docs.unstructured.io/api-reference/api-services/sdk-python">Unstructured Python SDK</a> 文档。
</div>

```python
import requests
from langchain_unstructured import UnstructuredLoader
from unstructured_client import UnstructuredClient
from unstructured_client.utils import BackoffStrategy, RetryConfig

client = UnstructuredClient(
api_key_auth=os.getenv(
"UNSTRUCTURED_API_KEY"
),  # 注意：客户端 API 参数是 "api_key_auth" 而不是 "api_key"
client=requests.Session(),  # 定义您自己的 requests 会话
server_url="https://api.unstructuredapp.io/general/v0/general",  # 定义您自己的 api url
retry_config=RetryConfig(
strategy="backoff",
retry_connection_errors=True,
backoff=BackoffStrategy(
initial_interval=500,
max_interval=60000,
exponent=1.5,
max_elapsed_time=900000,
),
),  # 定义您自己的重试配置
)

