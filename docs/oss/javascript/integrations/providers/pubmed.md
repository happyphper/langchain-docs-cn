---
title: PubMed
---
>[PubMed®](https://pubmed.ncbi.nlm.nih.gov/) 由 `The National Center for Biotechnology Information, National Library of Medicine` 提供
> 包含来自 `MEDLINE`、生命科学期刊和在线书籍的超过 3500 万条生物医学文献引用。
> 引用可能包含指向 `PubMed Central` 和出版商网站全文内容的链接。

## 安装
你需要安装一个 Python 包。

::: code-group

```bash [pip]
pip install xmltodict
```

```bash [uv]
uv add xmltodict
```

:::

### 检索器

查看[使用示例](/oss/integrations/retrievers/pubmed)。

```python
from langchain_classic.retrievers import PubMedRetriever
```

### 文档加载器

查看[使用示例](/oss/integrations/document_loaders/pubmed)。

```python
from langchain_community.document_loaders import PubMedLoader
```
