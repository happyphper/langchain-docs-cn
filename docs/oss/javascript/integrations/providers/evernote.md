---
title: EverNote
---
>[EverNote](https://evernote.com/) 旨在用于归档和创建笔记，其中可以嵌入照片、音频和保存的网页内容。笔记存储在虚拟的“笔记本”中，可以进行标记、注释、编辑、搜索和导出。

## 安装与设置

首先，你需要安装 `lxml` 和 `html2text` Python 包。

::: code-group

```bash [pip]
pip install lxml
pip install html2text
```

```bash [uv]
uv add lxml
uv add html2text
```

:::

## 文档加载器

查看[使用示例](/oss/javascript/integrations/document_loaders/evernote)。

```python
from langchain_community.document_loaders import EverNoteLoader
```
