---
title: LangSmith加载器
---
本指南提供了快速入门 LangSmith [文档加载器](https://python.langchain.com/docs/concepts/document_loaders) 的概述。有关 LangSmithLoader 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/core/document_loaders/langchain_core.document_loaders.langsmith.LangSmithLoader.html)。

## 概述

### 集成详情

| 类 | 包 | 本地化 | 可序列化 | JS 支持 |
| :--- | :--- | :---: | :---: |  :---: |
| [LangSmithLoader](https://python.langchain.com/api_reference/core/document_loaders/langchain_core.document_loaders.langsmith.LangSmithLoader.html) | [langchain-core](https://python.langchain.com/api_reference/core/index.html) | ❌ | ❌ | ❌ |

### 加载器特性

| 来源 | 惰性加载 | 原生异步 |
| :---: | :---: | :---: |
| LangSmithLoader | ✅ | ❌ |

## 设置

要使用 LangSmith 文档加载器，您需要安装 `langchain-core`，创建一个 [LangSmith](https://langsmith.com) 账户并获取 API 密钥。

### 凭证

在 [langsmith.com](https://langsmith.com) 注册并生成一个 API 密钥。完成后，设置 `LANGSMITH_API_KEY` 环境变量：

```python
import getpass
import os

if not os.environ.get("LANGSMITH_API_KEY"):
    os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

如果您希望获得自动化的最佳追踪功能，还可以开启 LangSmith 追踪：

```python
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

安装 `langchain-core`：

```python
pip install -qU langchain-core
```

### 克隆示例数据集

对于此示例，我们将克隆并加载一个公共的 LangSmith 数据集。克隆操作会在我们的个人 LangSmith 账户上创建此数据集的副本。您只能加载您拥有个人副本的数据集。

```python
from langsmith import Client as LangSmithClient

ls_client = LangSmithClient()

dataset_name = "LangSmith Few Shot Datasets Notebook"
dataset_public_url = (
    "https://smith.langchain.com/public/55658626-124a-4223-af45-07fb774a6212/d"
)

ls_client.clone_public_dataset(dataset_public_url)
```

## 初始化

现在我们可以实例化文档加载器并加载文档：

```python
from langchain_core.document_loaders import LangSmithLoader

loader = LangSmithLoader(
    dataset_name=dataset_name,
    content_key="question",
    limit=50,
    # format_content=...,
    # ...
)
```

## 加载

```python
docs = loader.load()
print(docs[0].page_content)
```

```text
Show me an example using Weaviate, but customizing the vectorStoreRetriever to return the top 10 k nearest neighbors.
```

```python
print(docs[0].metadata["inputs"])
```

```python
{'question': 'Show me an example using Weaviate, but customizing the vectorStoreRetriever to return the top 10 k nearest neighbors. '}
```

```python
print(docs[0].metadata["outputs"])
```

```python
{'answer': 'To customize the Weaviate client and return the top 10 k nearest neighbors, you can utilize the `as_retriever` method with the appropriate parameters. Here\'s how you can achieve this:\n\n\`\`\`python\n# Assuming you have imported the necessary modules and classes\n\n# Create the Weaviate client\nclient = weaviate.Client(url=os.environ["WEAVIATE_URL"], ...)\n\n# Initialize the Weaviate wrapper\nweaviate = Weaviate(client, index_name, text_key)\n\n# Customize the client to return top 10 k nearest neighbors using as_retriever\ncustom_retriever = weaviate.as_retriever(\n    search_type="similarity",\n    search_kwargs={\n        \'k\': 10  # Customize the value of k as needed\n    }\n)\n\n# Now you can use the custom_retriever to perform searches\nresults = custom_retriever.search(query, ...)\n\`\`\`'}
```

```python
list(docs[0].metadata.keys())
```

```python
['dataset_id',
 'inputs',
 'outputs',
 'metadata',
 'id',
 'created_at',
 'modified_at',
 'runs',
 'source_run_id']
```

## 惰性加载

```python
page = []
for doc in loader.lazy_load():
    page.append(doc)
    if len(page) >= 10:
        # do some paged operation, e.g.
        # index.upsert(page)
        # page = []
        break
len(page)
```

```text
10
```

---

## API 参考

有关 LangSmithLoader 所有功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/core/document_loaders/langchain_core.document_loaders.langsmith.LangSmithLoader.html](https://python.langchain.com/api_reference/core/document_loaders/langchain_core.document_loaders.langsmith.LangSmithLoader.html)
