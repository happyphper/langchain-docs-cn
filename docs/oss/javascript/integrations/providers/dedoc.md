---
title: Dedoc
---
>[Dedoc](https://dedoc.readthedocs.io) 是一个[开源](https://github.com/ispras/dedoc)库/服务，用于从多种格式的文件中提取文本、表格、附件以及文档结构（例如标题、列表项等）。

`Dedoc` 支持 `DOCX`、`XLSX`、`PPTX`、`EML`、`HTML`、`PDF`、图像等多种格式。完整的支持格式列表可在[此处](https://dedoc.readthedocs.io/en/latest/#id1)找到。

## 安装与设置

### Dedoc 库

你可以使用 `pip` 安装 `Dedoc`。
在这种情况下，你需要安装相关依赖，请前往[此处](https://dedoc.readthedocs.io/en/latest/getting_started/installation.html)获取更多信息。

::: code-group

```bash [pip]
pip install dedoc
```

```bash [uv]
uv add dedoc
```

:::

### Dedoc API

如果你打算使用 `Dedoc` API，则无需安装 `dedoc` 库。
在这种情况下，你应该运行 `Dedoc` 服务，例如 `Docker` 容器（更多详情请参阅[文档](https://dedoc.readthedocs.io/en/latest/getting_started/installation.html#install-and-run-dedoc-using-docker)）：

```bash
docker pull dedocproject/dedoc
docker run -p 1231:1231
```

## 文档加载器

* 要处理任何格式的文件（由 `Dedoc` 支持），你可以使用 `DedocFileLoader`：

```python
from langchain_community.document_loaders import DedocFileLoader
```

* 要处理 PDF 文件（无论是否包含文本层），你可以使用 `DedocPDFLoader`：

```python
from langchain_community.document_loaders import DedocPDFLoader
```

* 要在不安装库的情况下处理任何格式的文件，你可以使用 `Dedoc API` 配合 `DedocAPIFileLoader`：

```python
from langchain_community.document_loaders import DedocAPIFileLoader
```

更多详情请参阅[使用示例](/oss/integrations/document_loaders/dedoc)。
