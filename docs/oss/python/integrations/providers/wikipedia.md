---
title: 维基百科
---
>[维基百科](https://wikipedia.org/) 是一个多语言的免费在线百科全书，由一群被称为维基人的志愿者通过开放协作，并使用一个基于维基的编辑系统 MediaWiki 编写和维护。`Wikipedia` 是历史上规模最大、阅读量最高的参考工具。

## 安装与设置

::: code-group

```bash [pip]
pip install wikipedia
```

```bash [uv]
uv add wikipedia
```

:::

## 文档加载器

查看[使用示例](/oss/python/integrations/document_loaders/wikipedia)。

```python
from langchain_community.document_loaders import WikipediaLoader
```

## 检索器

查看[使用示例](/oss/python/integrations/retrievers/wikipedia)。

```python
from langchain_classic.retrievers import WikipediaRetriever
```
