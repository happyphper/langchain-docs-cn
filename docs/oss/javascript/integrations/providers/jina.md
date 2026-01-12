---
title: Jina AI
---
>[Jina AI](https://jina.ai/about-us) 是一家搜索 AI 公司。`Jina` 帮助企业和开发者通过更好的搜索解锁多模态数据。

<Warning>

为确保兼容性，请确保您使用的 `openai` SDK 版本为 <strong>0.x</strong>。

</Warning>

## 安装与设置
- 从[此处](https://jina.ai/embeddings/)获取 Jina AI API 令牌，并将其设置为环境变量 (`JINA_API_TOKEN`)

## 聊天模型

```python
from langchain_community.chat_models import JinaChat
```

查看[使用示例](/oss/javascript/integrations/chat/jinachat)。

## 嵌入模型

您可以从[此处](https://jina.ai/embeddings/)查看可用模型列表。

```python
from langchain_community.embeddings import JinaEmbeddings
```

查看[使用示例](/oss/javascript/integrations/text_embedding/jina)。

## 文档转换器

### Jina 重排序

```python
from langchain_community.document_compressors import JinaRerank
```

查看[使用示例](/oss/javascript/integrations/document_transformers/jina_rerank)。
