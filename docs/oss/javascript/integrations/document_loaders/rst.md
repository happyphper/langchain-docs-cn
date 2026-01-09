---
title: RST
---
[reStructured Text (RST)](https://en.wikipedia.org/wiki/ReStructuredText) 文件是一种文本数据文件格式，主要用于 Python 编程语言社区的技术文档。

## `UnstructuredRSTLoader`

您可以使用 `UnstructuredRSTLoader` 通过以下工作流程从 RST 文件加载数据。

```python
from langchain_community.document_loaders import UnstructuredRSTLoader

loader = UnstructuredRSTLoader(file_path="./example_data/README.rst", mode="elements")
docs = loader.load()

print(docs[0])
```

```python
page_content='Example Docs' metadata={'source': './example_data/README.rst', 'category_depth': 0, 'last_modified': '2023-12-19T13:42:18', 'languages': ['eng'], 'filetype': 'text/x-rst', 'file_directory': './example_data', 'filename': 'README.rst', 'category': 'Title'}
```

```python

```
