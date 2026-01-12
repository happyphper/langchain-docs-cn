---
title: BibTeX
---
>[BibTeX](https://www.ctan.org/pkg/bibtex) 是一种文件格式和参考文献管理系统，通常与 `LaTeX` 排版系统结合使用。它用于组织和存储学术及研究文档的参考文献信息。

## 安装与设置

我们需要安装 `bibtexparser` 和 `pymupdf` 包。

::: code-group

```bash [pip]
pip install bibtexparser pymupdf
```

```bash [uv]
uv add bibtexparser pymupdf
```

:::

## 文档加载器

查看[使用示例](/oss/javascript/integrations/document_loaders/bibtex)。

```python
from langchain_community.document_loaders import BibtexLoader
```
