---
title: HTML 转文本
---
>[html2text](https://github.com/Alir3z4/html2text/) 是一个 Python 包，用于将 `HTML` 页面转换为干净、易读的纯 `ASCII 文本`。

该 ASCII 文本也恰好是有效的 `Markdown`（一种文本到 HTML 的格式）。

## 安装与设置

::: code-group

```bash [pip]
pip install html2text
```

```bash [uv]
uv add html2text
```

:::

## 文档转换器

查看[使用示例](/oss/javascript/integrations/document_transformers/html2text)。

```python
from langchain_community.document_loaders import Html2TextTransformer
```
