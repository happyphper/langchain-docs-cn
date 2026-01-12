---
title: Docugami
---
>[Docugami](https://docugami.com) 将商业文档转换为文档 XML 知识图谱，生成代表整个文档的 XML 语义树森林。这是一种丰富的表示形式，将文档中各个文本块的语义和结构特征以 XML 树的形式包含在内。

## 安装与设置

::: code-group

```bash [pip]
pip install dgml-utils
pip install docugami-langchain
```

```bash [uv]
uv add dgml-utils
uv add docugami-langchain
```

:::

## 文档加载器

查看[使用示例](/oss/python/integrations/document_loaders/docugami)。

```python
from docugami_langchain.document_loaders import DocugamiLoader
```
