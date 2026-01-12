---
title: Doctran
---
>[Doctran](https://github.com/psychic-api/doctran) 是一个 Python 包。它利用大语言模型（LLM）和开源的自然语言处理（NLP）库，将原始文本转换为干净、结构化、信息密集的文档，这些文档针对向量空间检索进行了优化。你可以将 `Doctran` 想象成一个黑盒，混乱的字符串进去，漂亮、干净、带有标签的字符串出来。

## 安装与设置

::: code-group

```bash [pip]
pip install doctran
```

```bash [uv]
uv add doctran
```

:::

## 文档转换器

### 文档审问器

查看 [DoctranQATransformer 的使用示例](/oss/python/integrations/document_transformers/doctran_interrogate_document)。

```python
from langchain_community.document_transformers import DoctranQATransformer
```

### 属性提取器

查看 [DoctranPropertyExtractor 的使用示例](/oss/python/integrations/document_transformers/doctran_extract_properties)。

```python
from langchain_community.document_transformers import DoctranPropertyExtractor
```

### 文档翻译器

查看 [DoctranTextTranslator 的使用示例](/oss/python/integrations/document_transformers/doctran_translate_document)。

```python
from langchain_community.document_transformers import DoctranTextTranslator
```
