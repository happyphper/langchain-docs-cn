---
title: Apify 数据集
---
>[Apify Dataset](https://docs.apify.com/platform/storage/dataset) 是一个为存储结构化网络抓取结果（例如产品列表或 Google 搜索结果页面）而构建的可扩展、仅追加存储，支持顺序访问，并可将数据导出为 JSON、CSV 或 Excel 等多种格式。数据集主要用于保存 [Apify Actors](https://apify.com/store) 的结果——这些是无服务器云程序，适用于各种网络抓取、爬取和数据提取用例。

本笔记本展示了如何将 Apify 数据集加载到 LangChain 中。

## 前提条件

您需要在 Apify 平台上拥有一个现有的数据集。本示例展示了如何加载由 [Website Content Crawler](https://apify.com/apify/website-content-crawler) 生成的数据集。

```python
pip install -qU langchain langchain-apify langchain-openai
```

首先，将 `ApifyDatasetLoader` 导入到您的源代码中：

```python
from langchain_apify import ApifyDatasetLoader
from langchain_core.documents import Document
```

找到您的 [Apify API 令牌](https://console.apify.com/account/integrations) 和 [OpenAI API 密钥](https://platform.openai.com/account/api-keys)，并将它们初始化为环境变量：

```python
import os

os.environ["APIFY_API_TOKEN"] = "your-apify-api-token"
os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
```

然后，提供一个函数，将 Apify 数据集记录字段映射到 LangChain <a href="https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 格式。

例如，如果您的数据集项结构如下：

```json
{
    "url": "https://apify.com",
    "text": "Apify is the best web scraping and automation platform."
}
```

下面代码中的映射函数会将它们转换为 LangChain <a href="https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 格式，以便您可以进一步将它们与任何 LLM 模型一起使用（例如用于问答）。

```python
loader = ApifyDatasetLoader(
    dataset_id="your-dataset-id",
    dataset_mapping_function=lambda dataset_item: Document(
        page_content=dataset_item["text"], metadata={"source": dataset_item["url"]}
    ),
)
```

```python
data = loader.load()
```

## 一个问答示例

在这个示例中，我们使用数据集中的数据来回答问题。

```python
from langchain.indexes import VectorstoreIndexCreator
from langchain_apify import ApifyWrapper
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings
```

```python
loader = ApifyDatasetLoader(
    dataset_id="your-dataset-id",
    dataset_mapping_function=lambda item: Document(
        page_content=item["text"] or "", metadata={"source": item["url"]}
    ),
)
```

```python
index = VectorstoreIndexCreator(
    vectorstore_cls=InMemoryVectorStore, embedding=OpenAIEmbeddings()
).from_loaders([loader])
```

```python
llm = ChatOpenAI(model="gpt-4o-mini")
```

```python
query = "What is Apify?"
result = index.query_with_sources(query, llm=llm)
```

```python
print(result["answer"])
print(result["sources"])
```

```text
 Apify is a platform for developing, running, and sharing serverless cloud programs. It enables users to create web scraping and automation tools and publish them on the Apify platform.

https://docs.apify.com/platform/actors, https://docs.apify.com/platform/actors/running/actors-in-store, https://docs.apify.com/platform/security, https://docs.apify.com/platform/actors/examples
```
