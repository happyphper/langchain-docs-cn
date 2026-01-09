---
title: 如何为您的智能体部署添加语义搜索功能
sidebarTitle: Add semantic search to your agent deployment
---
本指南介绍如何为部署的跨线程[存储](/oss/langgraph/persistence#memory-store)添加语义搜索功能，以便您的智能体能够通过语义相似性搜索记忆和其他文档。

## 前提条件

* 一个已部署的应用（参考[如何设置应用以进行部署](/langsmith/setup-app-requirements-txt)）以及[托管选项](/langsmith/platform-setup)的详细信息。
* 您的嵌入提供商的 API 密钥（本例中使用 OpenAI）。
* `langchain >= 0.3.8`（如果您使用下文中的字符串格式指定）。

## 步骤

1. 更新您的 `langgraph.json` 配置文件以包含存储配置：

```json
{
    ...
    "store": {
        "index": {
            "embed": "openai:text-embedding-3-small",
            "dims": 1536,
            "fields": ["$"]
        }
    }
}
```

此配置：

* 使用 OpenAI 的 text-embedding-3-small 模型生成嵌入向量
* 将嵌入维度设置为 1536（与模型的输出匹配）
* 索引存储数据中的所有字段（`["$"]` 表示索引所有内容，或指定特定字段如 `["text", "metadata.title"]`）

1. 要使用上述字符串嵌入格式，请确保您的依赖项包含 `langchain >= 0.3.8`：

```toml
# 在 pyproject.toml 中
[project]
dependencies = [
    "langchain>=0.3.8"
]
```

或者，如果使用 [requirements.txt](/langsmith/setup-app-requirements-txt)：

```
langchain>=0.3.8
```

## 使用方法

配置完成后，您可以在[节点](/oss/langgraph/graph-api#nodes)中使用语义搜索。存储需要一个命名空间元组来组织记忆：

```python
def search_memory(state: State, *, store: BaseStore):
    # 使用语义相似性搜索存储
    # 命名空间元组有助于组织不同类型的记忆
    # 例如，("user_facts", "preferences") 或 ("conversation", "summaries")
    results = store.search(
        namespace=("memory", "facts"),  # 按类型组织记忆
        query="your search query",
        limit=3  # 要返回的结果数量
    )
    return results
```

## 自定义嵌入

如果您想使用自定义嵌入，可以传递自定义嵌入函数的路径：

```json
{
    ...
    "store": {
        "index": {
            "embed": "path/to/embedding_function.py:embed",
            "dims": 1536,
            "fields": ["$"]
        }
    }
}
```

部署将在指定路径中查找该函数。该函数必须是异步的并接受一个字符串列表：

```python
# path/to/embedding_function.py
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def aembed_texts(texts: list[str]) -> list[list[float]]:
    """自定义嵌入函数必须：
    1. 是异步的
    2. 接受一个字符串列表
    3. 返回一个浮点数数组列表（嵌入向量）
    """
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    return [e.embedding for e in response.data]
```

## 通过 API 查询

您也可以使用 LangGraph SDK 查询存储。由于 SDK 使用异步操作：

```python
from langgraph_sdk import get_client

async def search_store():
    client = get_client()
    results = await client.store.search_items(
        ("memory", "facts"),
        query="your search query",
        limit=3  # 要返回的结果数量
    )
    return results

# 在异步上下文中使用
results = await search_store()
```
