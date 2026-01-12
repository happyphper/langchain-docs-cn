---
title: Cognee
---
# CogneeRetriever

本文将帮助您开始使用 Cognee [检索器](/oss/python/langchain/retrieval)。有关 CogneeRetriever 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/retrievers/langchain_community.retrievers.cognee.CogneeRetriever.html)。

### 集成详情

自带数据（即索引和搜索自定义文档语料库）：

| 检索器 | 自托管 | 云服务 | 包 |
| :--- | :--- | :---: | :---: |
| [CogneeRetriever](https://python.langchain.com/api_reference/community/retrievers/langchain_community.retrievers.cognee.CogneeRetriever.html) | ✅ | ❌ | langchain-cognee |

## 设置

对于 cognee 的默认设置，您只需要您的 OpenAI API 密钥。

如果您希望从单个查询中获得自动化追踪，您也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

此检索器位于 `langchain-cognee` 包中：

```python
pip install -qU langchain-cognee
```

```python
import nest_asyncio

nest_asyncio.apply()
```

## 实例化

现在我们可以实例化我们的检索器：

```python
from langchain_cognee import CogneeRetriever

retriever = CogneeRetriever(
    llm_api_key="sk-",  # OpenAI API Key
    dataset_name="my_dataset",
    k=3,
)
```

## 使用

添加一些文档，处理它们，然后运行查询。Cognee 会检索与您的查询相关的知识并生成最终答案。

```python
# 添加和处理文档的示例
from langchain_core.documents import Document

docs = [
    Document(page_content="Elon Musk is the CEO of SpaceX."),
    Document(page_content="SpaceX focuses on rockets and space travel."),
]

retriever.add_documents(docs)
retriever.process_data()

# 现在让我们查询检索器
query = "Tell me about Elon Musk"
results = retriever.invoke(query)

for idx, doc in enumerate(results, start=1):
    print(f"Doc {idx}: {doc.page_content}")
```
