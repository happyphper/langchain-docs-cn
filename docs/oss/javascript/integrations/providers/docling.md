---
title: Docling
---
> [Docling](https://github.com/DS4SD/docling) 能够将 PDF、DOCX、PPTX、HTML 等格式解析为包含文档布局、表格等信息的丰富统一表示，使其适用于 RAG 等生成式 AI 工作流。
>
> 本集成通过 `DoclingLoader` 文档加载器提供 Docling 的功能。

## 安装与设置

只需通过包管理器（例如 pip）安装 `langchain-docling`：

::: code-group

```bash [pip]
pip install langchain-docling
```

```bash [uv]
uv add langchain-docling
```

:::

## 文档加载器

`langchain-docling` 中的 `DoclingLoader` 类将 Docling 无缝集成到 LangChain 中，使您能够：
- 在 LLM 应用中轻松、快速地使用各种文档类型，并且
- 利用 Docling 的丰富表示进行高级的、文档原生的基础处理。

基本用法如下所示：

```python
from langchain_docling import DoclingLoader

FILE_PATH = ["https://arxiv.org/pdf/2408.09869"]  # Docling 技术报告

loader = DoclingLoader(file_path=FILE_PATH)

docs = loader.load()
```

关于端到端的使用方法，请查看[此示例](/oss/javascript/integrations/document_loaders/docling)。

## 其他资源

- [LangChain Docling 集成 GitHub](https://github.com/DS4SD/docling-langchain)
- [LangChain Docling 集成 PyPI 包](https://pypi.org/project/langchain-docling/)
- [Docling GitHub](https://github.com/DS4SD/docling)
- [Docling 文档](https://ds4sd.github.io/docling/)
