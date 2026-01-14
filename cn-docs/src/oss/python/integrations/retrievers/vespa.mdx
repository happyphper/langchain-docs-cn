---
title: Vespa
---
>[Vespa](https://vespa.ai/) 是一个功能完备的搜索引擎和向量数据库。它支持向量搜索（近似最近邻搜索）、词法搜索以及在结构化数据中搜索，所有这些都可以在同一个查询中完成。

本笔记本展示了如何将 `Vespa.ai` 用作 LangChain 的检索器。

为了创建检索器，我们使用 [pyvespa](https://pyvespa.readthedocs.io/en/latest/index.html) 来连接一个 `Vespa` 服务。

```python
pip install -qU  pyvespa
```

```python
from vespa.application import Vespa

vespa_app = Vespa(url="https://doc-search.vespa.oath.cloud")
```

这样就创建了一个到 `Vespa` 服务的连接，这里连接的是 Vespa 文档搜索服务。
使用 `pyvespa` 包，你也可以连接到
[Vespa Cloud 实例](https://pyvespa.readthedocs.io/en/latest/deploy-vespa-cloud.html)
或本地的
[Docker 实例](https://pyvespa.readthedocs.io/en/latest/deploy-docker.html)。

连接到服务后，你可以设置检索器：

```python
from langchain_community.retrievers import VespaRetriever

vespa_query_body = {
    "yql": "select content from paragraph where userQuery()",
    "hits": 5,
    "ranking": "documentation",
    "locale": "en-us",
}
vespa_content_field = "content"
retriever = VespaRetriever(vespa_app, vespa_query_body, vespa_content_field)
```

这样就设置了一个 LangChain 检索器，它会从 Vespa 应用程序中获取文档。
这里，从 `paragraph` 文档类型的 `content` 字段中最多检索 5 个结果，
使用 `documentation` 作为排序方法。`userQuery()` 会被 LangChain 传递的实际查询所替换。

更多信息请参考 [pyvespa 文档](https://pyvespa.readthedocs.io/en/latest/getting-started-pyvespa.html#Query)。

现在你可以返回结果，并在 LangChain 中继续使用这些结果。

```python
retriever.invoke("what is vespa?")
```
