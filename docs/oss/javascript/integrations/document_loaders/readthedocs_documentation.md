---
title: ReadTheDocs 文档
---
>[Read the Docs](https://readthedocs.org/) 是一个开源的免费软件文档托管平台。它能够生成由 `Sphinx` 文档生成器编写的文档。

本笔记本介绍了如何从作为 `Read-The-Docs` 构建的一部分而生成的 HTML 中加载内容。

关于此功能在实际中的应用示例，请参见[此处](https://github.com/langchain-ai/chat-langchain)。

这假设 HTML 文件已经被抓取到一个文件夹中。可以通过取消注释并运行以下命令来完成此操作：

```python
pip install -qU  beautifulsoup4
```

```python
#!wget -r -A.html -P rtdocs https://python.langchain.com/en/latest/
```

```python
from langchain_community.document_loaders import ReadTheDocsLoader
```

```python
loader = ReadTheDocsLoader("rtdocs")
```

```python
docs = loader.load()
```
