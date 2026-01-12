---
title: Breebs（开放知识）
---
>[Breebs](https://www.breebs.com/) 是一个开放的协作知识平台。
>任何人都可以创建一个 `Breeb`，这是一个基于存储在 Google Drive 文件夹中的 PDF 文件的知识胶囊。
>任何 LLM/聊天机器人 都可以使用 `Breeb` 来提升其专业知识、减少幻觉并提供信息来源。
>在幕后，`Breebs` 实现了多种 `检索增强生成 (RAG)` 模型，
> 以便在每次迭代中无缝提供有用的上下文。

## 检索器

```python
from langchain_classic.retrievers import BreebsRetriever
```

[查看使用示例（检索与 ConversationalRetrievalChain）](/oss/python/integrations/retrievers/breebs)
