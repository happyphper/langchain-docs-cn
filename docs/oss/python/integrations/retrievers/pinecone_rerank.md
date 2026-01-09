---
title: Pinecone 重排序
---
> 本笔记本展示了如何使用 **PineconeRerank** 进行两阶段向量检索重排序，它利用了 Pinecone 托管的重新排序 API，具体实现可参考 `langchain_pinecone/libs/pinecone/rerank.py`。

## 环境设置

安装 `langchain-pinecone` 包。

```python
pip install -qU "langchain-pinecone"
```

## 凭证设置

设置您的 Pinecone API 密钥以使用重新排序 API。

```python
import os
from getpass import getpass

os.environ["PINECONE_API_KEY"] = os.getenv("PINECONE_API_KEY") or getpass(
    "Enter your Pinecone API key: "
)
```

## 实例化

使用 `PineconeRerank` 根据查询的相关性对文档列表进行重新排序。

```python
from langchain_core.documents import Document
from langchain_pinecone import PineconeRerank

# 初始化重排序器
reranker = PineconeRerank(model="bge-reranker-v2-m3")

# 示例文档
documents = [
    Document(page_content="Paris is the capital of France."),
    Document(page_content="Berlin is the capital of Germany."),
    Document(page_content="The Eiffel Tower is in Paris."),
]

# 对文档进行重排序
query = "What is the capital of France?"
reranked_docs = reranker.compress_documents(documents, query)

# 打印结果
for doc in reranked_docs:
    score = doc.metadata.get("relevance_score")
    print(f"Score: {score:.4f} | Content: {doc.page_content}")
```

```text
/Users/jakit/customers/aurelio/langchain-pinecone/libs/pinecone/.venv/lib/python3.10/site-packages/tqdm/auto.py:21: TqdmWarning: IProgress not found. Please update jupyter and ipywidgets. See https://ipywidgets.readthedocs.io/en/stable/user_install.html
  from .autonotebook import tqdm as notebook_tqdm
```

```text
Score: 0.9998 | Content: Paris is the capital of France.
Score: 0.1950 | Content: The Eiffel Tower is in Paris.
Score: 0.0042 | Content: Berlin is the capital of Germany.
```

## 使用方法

### 使用 Top-N 进行重排序

指定 `top_n` 参数以限制返回的文档数量。

```python
# 仅返回 top-1 结果
reranker_top1 = PineconeRerank(model="bge-reranker-v2-m3", top_n=1)
top1_docs = reranker_top1.compress_documents(documents, query)
print("Top-1 Result:")
for doc in top1_docs:
    print(f"Score: {doc.metadata['relevance_score']:.4f} | Content: {doc.page_content}")
```

```text
Top-1 Result:
Score: 0.9998 | Content: Paris is the capital of France.
```

### 使用自定义排序字段进行重排序

如果您的文档是字典格式或包含自定义字段，可以使用 `rank_fields` 参数来指定用于排序的字段。

```python
# 包含 'text' 字段的示例字典文档
docs_dict = [
    {
        "id": "doc1",
        "text": "Article about renewable energy.",
        "title": "Renewable Energy",
    },
    {"id": "doc2", "text": "Report on economic growth.", "title": "Economic Growth"},
    {
        "id": "doc3",
        "text": "News on climate policy changes.",
        "title": "Climate Policy",
    },
]

# 使用 rank_fields 初始化重排序器
reranker_text = PineconeRerank(model="bge-reranker-v2-m3", rank_fields=["text"])
climate_docs = reranker_text.rerank(docs_dict, "Latest news on climate change.")

# 显示 ID 和分数
for res in climate_docs:
    print(f"ID: {res['id']} | Score: {res['score']:.4f}")
```

```text
ID: doc3 | Score: 0.9892
ID: doc1 | Score: 0.0006
ID: doc2 | Score: 0.0000
```

我们也可以基于标题字段进行重排序

```python
economic_docs = reranker_text.rerank(docs_dict, "Economic forecast.")

# 显示 ID 和分数
for res in economic_docs:
    print(
        f"ID: {res['id']} | Score: {res['score']:.4f} | Title: {res['document']['title']}"
    )
```

```text
ID: doc2 | Score: 0.8918 | Title: Economic Growth
ID: doc3 | Score: 0.0002 | Title: Climate Policy
ID: doc1 | Score: 0.0000 | Title: Renewable Energy
```

### 使用附加参数进行重排序

您可以将模型特定的参数（例如 `truncate`）直接传递给 `.rerank()` 方法。

如何处理超过模型支持长度的输入。可接受的值：END 或 NONE。
END 会在输入令牌限制处截断输入序列。NONE 会在输入超过输入令牌限制时返回错误。

```python
# 使用自定义 truncate 参数进行重排序
docs_simple = [
    {"id": "docA", "text": "Quantum entanglement is a physical phenomenon..."},
    {"id": "docB", "text": "Classical mechanics describes motion..."},
]

reranked = reranker.rerank(
        documents=docs_simple,
        query="Explain the concept of quantum entanglement.",
        truncate="END",
)
# 打印重排序后的 ID 和分数
for res in reranked:
    print(f"ID: {res['id']} | Score: {res['score']:.4f}")
```

```text
ID: docA | Score: 0.6950
ID: docB | Score: 0.0001
```

---

## API 参考

- `PineconeRerank(model, top_n, rank_fields, return_documents)`
- `.rerank(documents, query, rank_fields=None, model=None, top_n=None, truncate="END")`
- `.compress_documents(documents, query)` (返回带有元数据中 `relevance_score` 的 <a href="https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象)
