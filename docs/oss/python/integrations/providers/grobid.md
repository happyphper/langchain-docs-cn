---
title: Grobid
---
GROBID 是一个用于提取、解析和重构原始文档的机器学习库。

它专为解析学术论文而设计，在此类任务上表现尤为出色。

*注意*：如果提供给 Grobid 的文章是大型文档（例如学位论文）且元素数量超过一定限制，可能无法被处理。

本页介绍如何在 LangChain 中使用 Grobid 来解析文章。

## 安装
Grobid 的安装细节在 https://grobid.readthedocs.io/en/latest/Install-Grobid/ 中有详细描述。
不过，通过 Docker 容器运行 Grobid 可能更简单且问题更少，相关文档见[此处](https://grobid.readthedocs.io/en/latest/Grobid-docker/)。

## 在 LangChain 中使用 Grobid

一旦 Grobid 安装完毕并成功运行（你可以通过访问 http://localhost:8070 来检查），就可以开始使用了。

现在你可以使用 GrobidParser 来生成文档：

```python
from langchain_community.document_loaders.parsers import GrobidParser
from langchain_community.document_loaders.generic import GenericLoader

# 从文章段落生成文本块
loader = GenericLoader.from_filesystem(
    "/Users/31treehaus/Desktop/Papers/",
    glob="*",
    suffixes=[".pdf"],
    parser= GrobidParser(segment_sentences=False)
)
docs = loader.load()

# 从文章句子生成文本块
loader = GenericLoader.from_filesystem(
    "/Users/31treehaus/Desktop/Papers/",
    glob="*",
    suffixes=[".pdf"],
    parser= GrobidParser(segment_sentences=True)
)
docs = loader.load()
```
文本块的元数据将包含边界框（Bounding Boxes）。虽然解析这些数据可能有些棘手，但相关说明可以在 https://grobid.readthedocs.io/en/latest/Coordinates-in-PDF/ 找到。
