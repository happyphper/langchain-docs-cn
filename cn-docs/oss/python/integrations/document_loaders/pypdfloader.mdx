---
title: PyPDFLoader
---
本笔记本提供了快速入门 `PyPDF` [文档加载器](https://python.langchain.com/docs/concepts/document_loaders) 的概述。有关所有 DocumentLoader 功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.pdf.PyPDFLoader.html)。

## 概述

### 集成详情

| 类 | 包 | 本地 | 可序列化 | JS 支持 |
| :--- | :--- | :---: | :---: | :---: |
| [PyPDFLoader](https://python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.pdf.PyPDFLoader.html) | [langchain-community](https://python.langchain.com/api_reference/community/index.html) | ✅ | ❌ | ❌ |

---------

### 加载器特性

| 源 | 文档惰性加载 | 原生异步支持 | 提取图像 | 提取表格 |
|:-----------:| :---: | :---: | :---: |:---: |
| PyPDFLoader | ✅ | ❌ | ✅ | ❌ |

## 设置

### 凭证

使用 `PyPDFLoader` 不需要任何凭证。

要启用模型调用的自动追踪，请设置您的 [LangSmith](https://docs.smith.langchain.com/) API 密钥：

```python
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
# os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

安装 **langchain-community** 和 **pypdf**。

```python
%pip install -qU langchain-community pypdf
```

```text
Note: you may need to restart the kernel to use updated packages.
```

## 初始化

现在我们可以实例化模型对象并加载文档：

```python
from langchain_community.document_loaders import PyPDFLoader

file_path = "./example_data/layout-parser-paper.pdf"
loader = PyPDFLoader(file_path)
```

## 加载

```python
docs = loader.load()
docs[0]
```

```text
Document(metadata={'producer': 'pdfTeX-1.40.21', 'creator': 'LaTeX with hyperref', 'creationdate': '2021-06-22T01:27:10+00:00', 'author': '', 'keywords': '', 'moddate': '2021-06-22T01:27:10+00:00', 'ptex.fullbanner': 'This is pdfTeX, Version 3.14159265-2.6-1.40.21 (TeX Live 2020) kpathsea version 6.3.2', 'subject': '', 'title': '', 'trapped': '/False', 'source': './example_data/layout-parser-paper.pdf', 'total_pages': 16, 'page': 0, 'page_label': '1'}, page_content='LayoutParser: A Uniﬁed Toolkit for Deep\nLearning Based Document Image Analysis\nZejiang Shen1 (\x00 ), Ruochen Zhang2, Melissa Dell3, Benjamin Charles Germain\nLee4, Jacob Carlson3, and Weining Li5\n1 Allen Institute for AI\nshannons@allenai.org\n2 Brown University\nruochen zhang@brown.edu\n3 Harvard University\n{melissadell,jacob carlson}@fas.harvard.edu\n4 University of Washington\nbcgl@cs.washington.edu\n5 University of Waterloo\nw422li@uwaterloo.ca\nAbstract. Recent advances in document image analysis (DIA) have been\nprimarily driven by the application of neural networks. Ideally, research\noutcomes could be easily deployed in production and extended for further\ninvestigation. However, various factors like loosely organized codebases\nand sophisticated model conﬁgurations complicate the easy reuse of im-\nportant innovations by a wide audience. Though there have been on-going\neﬀorts to improve reusability and simplify deep learning (DL) model\ndevelopment in disciplines like natural language processing and computer\nvision, none of them are optimized for challenges in the domain of DIA.\nThis represents a major gap in the existing toolkit, as DIA is central to\nacademic research across a wide range of disciplines in the social sciences\nand humanities. This paper introduces LayoutParser, an open-source\nlibrary for streamlining the usage of DL in DIA research and applica-\ntions. The core LayoutParser library comes with a set of simple and\nintuitive interfaces for applying and customizing DL models for layout de-\ntection, character recognition, and many other document processing tasks.\nTo promote extensibility, LayoutParser also incorporates a community\nplatform for sharing both pre-trained models and full document digiti-\nzation pipelines. We demonstrate that LayoutParser is helpful for both\nlightweight and large-scale digitization pipelines in real-word use cases.\nThe library is publicly available at https://layout-parser.github.io.\nKeywords: Document Image Analysis · Deep Learning · Layout Analysis\n· Character Recognition · Open Source library · Toolkit.\n1 Introduction\nDeep Learning(DL)-based approaches are the state-of-the-art for a wide range of\ndocument image analysis (DIA) tasks including document image classiﬁcation [11,\narXiv:2103.15348v2  [cs.CV]  21 Jun 2021')
```

```python
import pprint

pprint.pp(docs[0].metadata)
```

```text
{'producer': 'pdfTeX-1.40.21',
 'creator': 'LaTeX with hyperref',
 'creationdate': '2021-06-22T01:27:10+00:00',
 'author': '',
 'keywords': '',
 'moddate': '2021-06-22T01:27:10+00:00',
 'ptex.fullbanner': 'This is pdfTeX, Version 3.14159265-2.6-1.40.21 (TeX Live '
                    '2020) kpathsea version 6.3.2',
 'subject': '',
 'title': '',
 'trapped': '/False',
 'source': './example_data/layout-parser-paper.pdf',
 'total_pages': 16,
 'page': 0,
 'page_label': '1'}
```

## 惰性加载

```python
pages = []
for doc in loader.lazy_load():
    pages.append(doc)
    if len(pages) >= 10:
        # 执行一些分页操作，例如
        # index.upsert(page)

        pages = []
len(pages)
```

```text
6
```

```python
print(pages[0].page_content[:100])
pprint.pp(pages[0].metadata)
```

```text
LayoutParser: A Uniﬁed Toolkit for DL-Based DIA 11
focuses on precision, eﬃciency, and robustness. T
{'producer': 'pdfTeX-1.40.21',
 'creator': 'LaTeX with hyperref',
 'creationdate': '2021-06-22T01:27:10+00:00',
 'author': '',
 'keywords': '',
 'moddate': '2021-06-22T01:27:10+00:00',
 'ptex.fullbanner': 'This is pdfTeX, Version 3.14159265-2.6-1.40.21 (TeX Live '
                    '2020) kpathsea version 6.3.2',
 'subject': '',
 'title': '',
 'trapped': '/False',
 'source': './example_data/layout-parser-paper.pdf',
 'total_pages': 16,
 'page': 10,
 'page_label': '11'}
```

元数据属性至少包含以下键：

- source
- page (如果处于 *page* 模式)
- total_page
- creationdate
- creator
- producer

额外的元数据取决于具体的解析器。
这些信息可能很有用（例如，用于对您的 PDF 进行分类）。

## 分割模式与自定义页面分隔符

加载 PDF 文件时，您可以通过两种不同的方式分割它：

- 按页面
- 作为单个文本流

默认情况下，PyPDFLoader 会将 PDF 作为单个文本流进行分割。

### 按页面提取 PDF。每个页面被提取为一个 langchain Document 对象

```python
loader = PyPDFLoader(
    "./example_data/layout-parser-paper.pdf",
    mode="page",
)
docs = loader.load()
print(len(docs))
pprint.pp(docs[0].metadata)
```

```text
16
{'producer': 'pdfTeX-1.40.21',
 'creator': 'LaTeX with hyperref',
 'creationdate': '2021-06-22T01:27:10+00:00',
 'author': '',
 'keywords': '',
 'moddate': '2021-06-22T01:27:10+00:00',
 'ptex.fullbanner': 'This is pdfTeX, Version 3.14159265-2.6-1.40.21 (TeX Live '
                    '2020) kpathsea version 6.3.2',
 'subject': '',
 'title': '',
 'trapped': '/False',
 'source': './example_data/layout-parser-paper.pdf',
 'total_pages': 16,
 'page': 0,
 'page_label': '1'}
```

在此模式下，PDF 按页面分割，生成的 Document 元数据包含页码。但在某些情况下，我们可能希望将 PDF 作为单个文本流处理（这样就不会将某些段落截断）。在这种情况下，您可以使用 *single* 模式：

### 将整个 PDF 提取为单个 langchain Document 对象

```python
loader = PyPDFLoader(
    "./example_data/layout-parser-paper.pdf",
    mode="single",
)
docs = loader.load()
print(len(docs))
pprint.pp(docs[0].metadata)
```

```text
1
{'producer': 'pdfTeX-1.40.21',
 'creator': 'LaTeX with hyperref',
 'creationdate': '2021-06-22T01:27:10+00:00',
 'author': '',
 'keywords': '',
 'moddate': '2021-06-22T01:27:10+00:00',
 'ptex.fullbanner': 'This is pdfTeX, Version 3.14159265-2.6-1.40.21 (TeX Live '
                    '2020) kpathsea version 6.3.2',
 'subject': '',
 'title': '',
 'trapped': '/False',
 'source': './example_data/layout-parser-paper.pdf',
 'total_pages': 16}
```

逻辑上，在此模式下，'page_number' 元数据会消失。以下是如何在文本流中清晰标识页面结束位置的方法：

### 添加自定义的 *pages_delimiter* 以在 *single* 模式中标识页面结束位置

```python
loader = PyPDFLoader(
    "./example_data/layout-parser-paper.pdf",
    mode="single",
    pages_delimiter="\n-------THIS IS A CUSTOM END OF PAGE-------\n",
)
docs = loader.load()
print(docs[0].page_content[:5780])
```

```text
LayoutParser: A Uniﬁed Toolkit for Deep
Learning Based Document Image Analysis
Zejiang Shen1 (  ), Ruochen Zhang2, Melissa Dell3, Benjamin Charles Germain
Lee4, Jacob Carlson3, and Weining Li5
1 Allen Institute for AI
shannons@allenai.org
2 Brown University
ruochen zhang@brown.edu
3 Harvard University
{melissadell,jacob carlson}@fas.harvard.edu
4 University of Washington
bcgl@cs.washington.edu
5 University of Waterloo
w422li@uwaterloo.ca
Abstract. Recent advances in document image analysis (DIA) have been
primarily driven by the application of neural networks. Ideally, research
outcomes could be easily deployed in production and extended for further
investigation. However, various factors like loosely organized codebases
and sophisticated model conﬁgurations complicate the easy reuse of im-
portant innovations by a wide audience. Though there have been on-going
eﬀorts to improve reusability and simplify deep learning (DL) model
development in disciplines like natural language processing and computer
vision, none of them are optimized for challenges in the domain of DIA.
This represents a major gap in the existing toolkit, as DIA is central to
academic research across a wide range of disciplines in the social sciences
and humanities. This paper introduces LayoutParser, an open-source
library for streamlining the usage of DL in DIA research and applica-
tions. The core LayoutParser library comes with a set of simple and
intuitive interfaces for applying and customizing DL models for layout de-
tection, character recognition, and many other document processing tasks.
To promote extensibility, LayoutParser also incorporates a community
platform for sharing both pre-trained models and full document digiti-
zation pipelines. We demonstrate that LayoutParser is helpful for both
lightweight and large-scale digitization pipelines in real-word use cases.
The library is publicly available at https://layout-parser.github.io.
Keywords: Document Image Analysis · Deep Learning · Layout Analysis
· Character Recognition · Open Source library · Toolkit.
1 Introduction
Deep Learning(DL)-based approaches are the state-of-the-art for a wide range of
document image analysis (DIA) tasks including document image classiﬁcation [11,
arXiv:2103.15348v2  [cs.CV]  21 Jun 2021
-------THIS IS A CUSTOM END OF PAGE-------
2 Z. Shen et al.
37], layout detection [38, 22], table detection [ 26], and scene text detection [ 4].
A generalized learning-based framework dramatically reduces the need for the
manual speciﬁcation of complicated rules, which is the status quo with traditional
methods. DL has the potential to transform DIA pipelines and beneﬁt a broad
spectrum of large-scale document digitization projects.
However, there are several practical diﬃculties for taking advantages of re-
cent advances in DL-based methods: 1) DL models are notoriously convoluted
for reuse and extension. Existing models are developed using distinct frame-
works like TensorFlow [1] or PyTorch [ 24], and the high-level parameters can
be obfuscated by implementation details [ 8]. It can be a time-consuming and
frustrating experience to debug, reproduce, and adapt existing models for DIA,
and many researchers who would beneﬁt the most from using these methods lack
the technical background to implement them from scratch. 2) Document images
contain diverse and disparate patterns across domains, and customized training
is often required to achieve a desirable detection accuracy. Currently there is no
full-ﬂedged infrastructure for easily curating the target document image datasets
and ﬁne-tuning or re-training the models. 3) DIA usually requires a sequence of
models and other processing to obtain the ﬁnal outputs. Often research teams use
DL models and then perform further document analyses in separate processes,
and these pipelines are not documented in any central location (and often not
documented at all). This makes it diﬃcult for research teams to learn about how
full pipelines are implemented and leads them to invest signiﬁcant resources in
reinventing the DIA wheel .
LayoutParser provides a uniﬁed toolkit to support DL-based document image
analysis and processing. To address the aforementioned challenges,LayoutParser
is built with the following components:
1. An oﬀ-the-shelf toolkit for applying DL models for layout detection, character
recognition, and other DIA tasks (Section 3)
2. A rich repository of pre-trained neural network models (Model Zoo) that
underlies the oﬀ-the-shelf usage
3. Comprehensive tools for eﬃcient document image data annotation and model
tuning to support diﬀerent levels of customization
4. A DL model hub and community platform for the easy sharing, distribu-
tion, and discussion of DIA models and pipelines, to promote reusability,
reproducibility, and extensibility (Section 4)
The library implements simple and intuitive Python APIs without sacriﬁcing
generalizability and versatility, and can be easily installed via pip. Its convenient
functions for handling document image data can be seamlessly integrated with
existing DIA pipelines. With detailed documentations and carefully curated
tutorials, we hope this tool will beneﬁt a variety of end-users, and will lead to
advances in applications in both industry and academic research.
LayoutParser is well aligned with recent eﬀorts for improving DL model
reusability in other disciplines like natural language processing [ 8, 34] and com-
puter vision [ 35], but with a focus on unique challenges in DIA. We show
LayoutParser can be applied in sophisticated and large-scale digitization projects
-------THIS IS A CUSTOM END OF PAGE-------
LayoutParser: A Uniﬁed Toolkit for DL-Based DIA 3
that require precision, eﬃciency, and robustness, as well as simple and light
```

分隔符可以简单地是 `\n`，或者 `\f` 来清晰表示页面变更，或者 `<!-- PAGE BREAK -->` 以便在 Markdown 查看器中无缝注入而不产生视觉影响。

# 从 PDF 中提取图像

您可以从 PDF 中提取图像，有三种不同的解决方案可供选择：

- rapidOCR (轻量级光学字符识别工具)
- Tesseract (高精度 OCR 工具)
- 多模态语言模型

您可以调整这些函数，以选择提取图像的输出格式，包括 *html*、*markdown* 或 *text*

结果会插入到页面文本的倒数第二段和最后一段之间。

### 使用 rapidOCR 从 PDF 中提取图像

```python
%pip install -qU rapidocr-onnxruntime
```

```text
Note: you may need to restart the kernel to use updated packages.
```

```python
from langchain_community.document_loaders.parsers import RapidOCRBlobParser

loader = PyPDFLoader(
    "./example_data/layout-parser-paper.pdf",
    mode="page",
    images_inner_format="markdown-img",
    images_parser=RapidOCRBlobParser(),
)
docs = loader.load()

print(docs[5].page_content)
```

```text
6 Z. Shen et al.
Fig. 2: The relationship between the three types of layout data structures.
Coordinate supports three kinds of variation; TextBlock consists of the co-
ordinate information and extra features like block text, types, and reading orders;
a Layout object is a list of all possible layout elements, including other Layout
objects. They all support the same set of transformation and operation APIs for
maximum ﬂexibility.
Shown in Table 1, LayoutParser currently hosts 9 pre-trained models trained
on 5 diﬀerent datasets. Description of the training
