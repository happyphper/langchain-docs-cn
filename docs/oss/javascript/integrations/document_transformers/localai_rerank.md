---
title: LocalAI 重排序器
---

<Info>

<strong>`langchain-localai` 是一个用于 LocalAI 的第三方集成包。它提供了一种在 LangChain 中使用 LocalAI 服务的简便方式。</strong>

源代码可在 [GitHub](https://github.com/mkhludnev/langchain-localai) 上获取。

</Info>

本笔记本展示了如何使用 [LocalAI 重排序 API](https://localai.io/features/reranker/) 进行文档压缩和检索。

让我们加载 `LocalAIRerank` 类。为了使用 `LocalAIRerank` 类，您需要在某处托管 LocalAI 服务并配置重排序器。请参阅 [localai.io/basics/getting_started/index.html](https://localai.io/basics/getting_started/index.html) 和 [localai.io/features/reranker/index.html](https://localai.io/features/reranker/index.html) 上的文档。

```python
pip install -U langchain-localai
```

```python
import os
from langchain_localai import LocalAIRerank
from langchain_core.documents import Document

# 将您的 LocalAI/OpenAI API 密钥设置为环境变量以确保安全。
# 例如，在您的 shell 中：export OPENAI_API_KEY="your-key-here"
reranker = LocalAIRerank(
    openai_api_key=os.environ.get("OPENAI_API_KEY"),
    model="bge-reranker-v2-m3",
    openai_api_base="http://localhost:8080",
)
reranked_docs = reranker.compress_documents(
    documents=[
        Document(page_content="Green tea is rich in antioxidants and may improve brain function."),
        Document(page_content="Coffee contains caffeine and can increase alertness."),
        Document(page_content="Black tea has a strong flavor and contains various polyphenols."),
    ],
    query="What are the health benefits of green tea?"
)
```
