---
title: Beautiful Soup
---
>[Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/) 是一个用于解析 HTML 和 XML 文档的 Python 包（包括处理标记格式错误的情况，例如未闭合的标签，因此以“标签汤”命名）。
> 它会为解析后的页面创建一个解析树，可用于从 HTML 中提取数据，[3] 这对于网络爬虫非常有用。

## 安装与设置

::: code-group

```bash [pip]
pip install beautifulsoup4
```

```bash [uv]
uv add beautifulsoup4
```

:::

## 文档转换器

查看[使用示例](/oss/integrations/document_transformers/beautiful_soup)。

```python
from langchain_community.document_loaders import BeautifulSoupTransformer
```
