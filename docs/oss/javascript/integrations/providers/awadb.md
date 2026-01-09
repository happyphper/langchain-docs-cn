---
title: AwaDB
---
>[AwaDB](https://github.com/awa-ai/awadb) 是一个 AI 原生数据库，用于 LLM 应用程序中嵌入向量的搜索和存储。

## 安装与设置

```bash
pip install awadb
```

## 向量存储

```python
from langchain_community.vectorstores import AwaDB
```

查看[使用示例](/oss/integrations/vectorstores/awadb)。

## 嵌入模型

```python
from langchain_community.embeddings import AwaEmbeddings
```

查看[使用示例](/oss/integrations/text_embedding/awadb)。
