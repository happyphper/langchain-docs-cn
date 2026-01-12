---
title: Kinetica
---
[Kinetica](https://www.kinetica.com/) 是一款专为在时序和空间数据上实现分析和生成式 AI 而构建的实时数据库。

## 聊天模型

Kinetica LLM 包装器使用 [Kinetica SqlAssist LLM](https://docs.kinetica.com/7.2/sql-gpt/concepts/)，将自然语言转换为 SQL，以简化数据检索过程。

有关用法，请参阅 [Kinetica 语言转 SQL 聊天模型](/oss/python/integrations/chat/kinetica)。

```python
from langchain_community.chat_models.kinetica import ChatKinetica
```

## 向量存储

Kinetica 向量存储包装器利用了 Kinetica 对[向量相似性搜索](https://docs.kinetica.com/7.2/vector_search/)的原生支持。

有关用法，请参阅 [Kinetica 向量存储 API](/oss/python/integrations/vectorstores/kinetica)。

```python
from langchain_community.vectorstores import Kinetica
```

## 文档加载器

Kinetica 文档加载器可用于从 [Kinetica](https://www.kinetica.com/) 数据库加载 LangChain [文档](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html)。

有关用法，请参阅 [Kinetica 文档加载器](/oss/python/integrations/document_loaders/kinetica)

```python
from langchain_community.document_loaders.kinetica_loader import KineticaLoader
```

## 检索器

Kinetica 检索器可以根据非结构化查询返回文档。

有关用法，请参阅 [基于 Kinetica VectorStore 的检索器](/oss/python/integrations/retrievers/kinetica)
