---
title: Gel
---
[Gel](https://www.geldata.com/) 是一个构建在 PostgreSQL 之上的强大数据平台。

- 以对象和图的方式思考，而非表和 JOIN 操作。
- 使用高级的 Python SDK、集成的 GUI、迁移引擎、认证与 AI 层，以及更多功能。
- 在本地、远程或[完全托管的云环境](https://www.geldata.com/cloud)中运行。

## 安装

::: code-group

```bash [pip]
pip install langchain-gel
```

```bash [uv]
uv add langchain-gel
```

:::

## 设置

1. 运行 `gel project init`
2. 编辑模式。要使用 LangChain 向量存储，你需要以下类型：

```gel
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
```

> 注意：这是最小化设置。你可以根据需要添加任意多的类型、属性和链接！
> 阅读[文档](https://docs.geldata.com/learn/schema)以了解更多关于利用 Gel 模式的信息。

3. 运行迁移：`gel migration create && gel migrate`。

## 用法

```python
from langchain_gel import GelVectorStore

vector_store = GelVectorStore(
    embeddings=embeddings,
)
```

查看完整用法示例[请点击这里](/oss/javascript/integrations/vectorstores/gel)。
