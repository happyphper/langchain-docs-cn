---
title: Arxiv
---
>[arXiv](https://arxiv.org/) 是一个开放获取的学术文献存档库，收录了物理学、数学、计算机科学、定量生物学、定量金融学、统计学、电气工程与系统科学以及经济学领域的 200 万篇学术文章。

## 安装与设置

首先，你需要安装 `arxiv` Python 包。

::: code-group

```bash [pip]
pip install arxiv
```

```bash [uv]
uv add arxiv
```

:::

其次，你需要安装 `PyMuPDF` Python 包，它用于将从 `arxiv.org` 网站下载的 PDF 文件转换为文本格式。

::: code-group

```bash [pip]
pip install pymupdf
```

```bash [uv]
uv add pymupdf
```

:::

## 文档加载器

查看[使用示例](/oss/integrations/document_loaders/arxiv)。

```python
from langchain_community.document_loaders import ArxivLoader
```

## 检索器

查看[使用示例](/oss/integrations/retrievers/arxiv)。

```python
from langchain_community.retrievers import ArxivRetriever
```
