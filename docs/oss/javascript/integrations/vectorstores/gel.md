---
title: Gel
---
> 使用 `gel` 作为后端，实现 LangChain 向量存储抽象。

[Gel](https://www.geldata.com/) 是一个开源的 PostgreSQL 数据层，专为快速从开发到生产周期而优化。它提供了高级的严格类型化图状数据模型、可组合的分层查询语言、完整的 SQL 支持、迁移、认证和 AI 模块。

相关代码位于名为 [langchain-gel](https://github.com/geldata/langchain-gel) 的集成包中。

## 设置

首先安装相关包：

```python
! pip install -qU gel langchain-gel
```

## 初始化

为了将 Gel 用作 `VectorStore` 的后端，你需要一个可运行的 Gel 实例。
幸运的是，除非你愿意，否则这并不需要涉及 Docker 容器或任何复杂的东西！

要设置本地实例，请运行：

```python
! gel project init --non-interactive
```

如果你正在使用 [Gel Cloud](https://cloud.geldata.com/)（你应该使用！），请在该命令中添加一个参数：

```bash
gel project init --server-instance <org-name>/<instance-name>
```

有关运行 Gel 的各种方式的完整列表，请查看参考文档中的 [运行 Gel](https://docs.geldata.com/reference/running) 部分。

### 设置模式

[Gel 模式](https://docs.geldata.com/reference/datamodel) 是对应用程序数据模型的显式高级描述。
除了让你能够精确定义数据的布局方式外，它还驱动着 Gel 的许多强大功能，如链接、访问策略、函数、触发器、约束、索引等。

LangChain 的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.vectorstores.VectorStore.html" target="_blank" rel="noreferrer" class="link"><code>VectorStore</code></a> 期望模式具有以下布局：

```python
schema_content = """
using extension pgvector;

module default {
    scalar type EmbeddingVector extending ext::pgvector::vector<1536>;

    type Record {
        required collection: str;
        text: str;
        embedding: EmbeddingVector;
        external_id: str {
            constraint exclusive;
        };
        metadata: json;

        index ext::pgvector::hnsw_cosine(m := 16, ef_construction := 128)
            on (.embedding)
    }
}
""".strip()

with open("dbschema/default.gel", "w") as f:
    f.write(schema_content)
```

为了将模式更改应用到数据库，请使用 Gel 的 [迁移机制](https://docs.geldata.com/reference/datamodel/migrations) 运行迁移：

```python
! gel migration create --non-interactive
! gel migrate
```

从此时起，`GelVectorStore` 可以作为 LangChain 中任何其他可用向量存储的直接替代品使用。

## 实例化

<EmbeddingTabs/>

```python
# | output: false
# | echo: false
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
```

```python
from langchain_gel import GelVectorStore

vector_store = GelVectorStore(
    embeddings=embeddings,
)
```

## 管理向量存储

### 向向量存储添加项目

请注意，按 ID 添加文档将覆盖任何匹配该 ID 的现有文档。

```python
from langchain_core.documents import Document

docs = [
    Document(
        page_content="池塘里有猫",
        metadata={"id": "1", "location": "pond", "topic": "animals"},
    ),
    Document(
        page_content="池塘里也有鸭子",
        metadata={"id": "2", "location": "pond", "topic": "animals"},
    ),
    Document(
        page_content="市场上有新鲜苹果",
        metadata={"id": "3", "location": "market", "topic": "food"},
    ),
    Document(
        page_content="市场也卖新鲜橙子",
        metadata={"id": "4", "location": "market", "topic": "food"},
    ),
    Document(
        page_content="新的艺术展览很吸引人",
        metadata={"id": "5", "location": "museum", "topic": "art"},
    ),
    Document(
        page_content="博物馆也有雕塑展",
        metadata={"id": "6", "location": "museum", "topic": "art"},
    ),
    Document(
        page_content="主街新开了一家咖啡店",
        metadata={"id": "7", "location": "Main Street", "topic": "food"},
    ),
    Document(
        page_content="读书会在图书馆举行",
        metadata={"id": "8", "location": "library", "topic": "reading"},
    ),
    Document(
        page_content="图书馆每周为孩子们举办故事会",
        metadata={"id": "9", "location": "library", "topic": "reading"},
    ),
    Document(
        page_content="社区中心为初学者提供烹饪课程",
        metadata={"id": "10", "location": "community center", "topic": "classes"},
    ),
]

vector_store.add_documents(docs, ids=[doc.metadata["id"] for doc in docs])
```

### 从向量存储中删除项目

```python
vector_store.delete(ids=["3"])
```

## 查询向量存储

一旦创建了向量存储并添加了相关文档，你很可能会在运行链或代理时希望查询它。

### 过滤支持

向量存储支持一组可以应用于文档元数据字段的过滤器。

| 运算符 | 含义/类别 |
|----------|-------------------------|
| \$eq | 等于 (==) |
| \$ne | 不等于 (!=) |
| \$lt | 小于 (&lt;) |
| \$lte | 小于或等于 (&lt;=) |
| \$gt | 大于 (>) |
| \$gte | 大于或等于 (>=) |
| \$in | 特殊情况 (in) |
| \$nin | 特殊情况 (not in) |
| \$between | 特殊情况 (between) |
| \$like | 文本 (like) |
| \$ilike | 文本 (不区分大小写的 like) |
| \$and | 逻辑 (and) |
| \$or | 逻辑 (or) |

### 直接查询

执行简单的相似性搜索可以按如下方式进行：

```python
results = vector_store.similarity_search(
    "kitty", k=10, filter={"id": {"$in": ["1", "5", "2", "9"]}}
)
for doc in results:
    print(f"* {doc.page_content} [{doc.metadata}]")
```

如果你提供了一个包含多个字段但没有运算符的字典，顶层将被解释为逻辑 **AND** 过滤器。

```python
vector_store.similarity_search(
    "ducks",
    k=10,
    filter={
        "id": {"$in": ["1", "5", "2", "9"]},
        "location": {"$in": ["pond", "market"]},
    },
)
```

```python
vector_store.similarity_search(
    "ducks",
    k=10,
    filter={
        "$and": [
            {"id": {"$in": ["1", "5", "2", "9"]}},
            {"location": {"$in": ["pond", "market"]}},
        ]
    },
)
```

如果你想执行相似性搜索并获取相应的分数，可以运行：

```python
results = vector_store.similarity_search_with_score(query="cats", k=1)
for doc, score in results:
    print(f"* [SIM={score:3f}] {doc.page_content} [{doc.metadata}]")
```

### 转换为检索器进行查询

你也可以将向量存储转换为检索器，以便在链中更轻松地使用。

```python
retriever = vector_store.as_retriever(search_kwargs={"k": 1})
retriever.invoke("kitty")
```

## 用于检索增强生成

有关如何使用此向量存储进行检索增强生成 (RAG) 的指南，请参阅以下部分：

- [使用 LangChain 构建 RAG 应用](/oss/langchain/rag)
- [代理式 RAG](/oss/langgraph/agentic-rag)
- [检索文档](/oss/langchain/retrieval)

---

## API 参考

有关 GelVectorStore 所有功能和配置的详细文档，请前往 API 参考：[python.langchain.com/api_reference/](https://python.langchain.com/api_reference/)
