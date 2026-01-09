---
title: Rockset
---
⚠️ **弃用通知：Rockset 集成已停用**
>
> 自 2024 年 6 月起，Rockset 已被 [OpenAI 收购](https://openai.com/index/openai-acquires-rockset/)并**关闭了其公共服务**。
>
> Rockset 曾是一个实时分析数据库，以其世界级的索引和检索能力而闻名。现在，其核心团队和技术正在被整合到 OpenAI 的基础设施中，为未来的 AI 产品提供支持。
>
> 此 LangChain 集成已不再可用，现仅**出于归档目的**而保留。

> Rockset 是一个实时分析数据库，它支持对海量半结构化数据进行查询，而无需操作负担。使用 Rockset，摄取的数据可在一秒内被查询，针对该数据的分析查询通常在毫秒级内执行。Rockset 针对计算进行了优化，使其适合服务于 100TB 以下（或通过汇总大于数百 TB）的高并发应用程序。

本笔记本演示了如何在 LangChain 中使用 Rockset 作为文档加载器。要开始使用，请确保您拥有一个 Rockset 账户和一个可用的 API 密钥。

## 设置环境

1.  前往 [Rockset 控制台](https://console.rockset.com/apikeys) 获取 API 密钥。从 [API 参考](https://rockset.com/docs/rest-api/#introduction) 中找到您的 API 区域。在本笔记本中，我们假设您使用的是 `Oregon(us-west-2)` 区域的 Rockset。
2.  设置环境变量 `ROCKSET_API_KEY`。
3.  安装 Rockset Python 客户端，LangChain 将使用它与 Rockset 数据库进行交互。

```python
pip install -qU  rockset
```

# 加载文档

Rockset 与 LangChain 的集成允许您通过 SQL 查询从 Rockset 集合中加载文档。为此，您必须构造一个 `RocksetLoader` 对象。以下是一个初始化 `RocksetLoader` 的示例代码片段。

```python
from langchain_community.document_loaders import RocksetLoader
from rockset import Regions, RocksetClient, models

loader = RocksetLoader(
    RocksetClient(Regions.usw2a1, "<api key>"),
    models.QueryRequestSql(query="SELECT * FROM langchain_demo LIMIT 3"),  # SQL 查询
    ["text"],  # 内容列
    metadata_keys=["id", "date"],  # 元数据列
)
```

这里，您可以看到运行了以下查询：

```sql
SELECT * FROM langchain_demo LIMIT 3
```

集合中的 `text` 列被用作页面内容，记录的 `id` 和 `date` 列被用作元数据（如果您不向 `metadata_keys` 传递任何内容，则整个 Rockset 文档将被用作元数据）。

要执行查询并访问结果 `Document` 的迭代器，请运行：

```python
loader.lazy_load()
```

要执行查询并一次性访问所有结果 `Document`，请运行：

```python
loader.load()
```

以下是 `loader.load()` 的示例响应：

```python
[
    Document(
        page_content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a libero porta, dictum ipsum eget, hendrerit neque. Morbi blandit, ex ut suscipit viverra, enim velit tincidunt tellus, a tempor velit nunc et ex. Proin hendrerit odio nec convallis lobortis. Aenean in purus dolor. Vestibulum orci orci, laoreet eget magna in, commodo euismod justo.",
        metadata={"id": 83209, "date": "2022-11-13T18:26:45.000000Z"}
    ),
    Document(
        page_content="Integer at finibus odio. Nam sit amet enim cursus lacus gravida feugiat vestibulum sed libero. Aenean eleifend est quis elementum tincidunt. Curabitur sit amet ornare erat. Nulla id dolor ut magna volutpat sodales fringilla vel ipsum. Donec ultricies, lacus sed fermentum dignissim, lorem elit aliquam ligula, sed suscipit sapien purus nec ligula.",
        metadata={"id": 89313, "date": "2022-11-13T18:28:53.000000Z"}
    ),
    Document(
        page_content="Morbi tortor enim, commodo id efficitur vitae, fringilla nec mi. Nullam molestie faucibus aliquet. Praesent a est facilisis, condimentum justo sit amet, viverra erat. Fusce volutpat nisi vel purus blandit, et facilisis felis accumsan. Phasellus luctus ligula ultrices tellus tempor hendrerit. Donec at ultricies leo.",
        metadata={"id": 87732, "date": "2022-11-13T18:49:04.000000Z"}
    )
]
```

## 使用多列作为内容

您可以选择使用多列作为内容：

```python
from langchain_community.document_loaders import RocksetLoader
from rockset import Regions, RocksetClient, models

loader = RocksetLoader(
    RocksetClient(Regions.usw2a1, "<api key>"),
    models.QueryRequestSql(query="SELECT * FROM langchain_demo LIMIT 1 WHERE id=38"),
    ["sentence1", "sentence2"],  # 两个内容列
)
```

假设 "sentence1" 字段是 `"This is the first sentence."`，"sentence2" 字段是 `"This is the second sentence."`，那么结果 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 的 `page_content` 将是：

```
This is the first sentence.
This is the second sentence.
```

您可以通过在 `RocksetLoader` 构造函数中设置 `content_columns_joiner` 参数来定义自己的函数来连接内容列。`content_columns_joiner` 是一个方法，它接收一个 `List[Tuple[str, Any]]]` 作为参数，表示一个（列名，列值）的元组列表。默认情况下，这是一个用换行符连接每个列值的方法。

例如，如果您想用空格而不是换行符连接 sentence1 和 sentence2，可以像这样设置 `content_columns_joiner`：

```python
RocksetLoader(
    RocksetClient(Regions.usw2a1, "<api key>"),
    models.QueryRequestSql(query="SELECT * FROM langchain_demo LIMIT 1 WHERE id=38"),
    ["sentence1", "sentence2"],
    content_columns_joiner=lambda docs: " ".join(
        [doc[1] for doc in docs]
    ),  # 用空格连接而不是 /n
)
```

结果 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 的 `page_content` 将是：

```
This is the first sentence. This is the second sentence.
```

通常，您可能希望在 `page_content` 中包含列名。您可以像这样操作：

```python
RocksetLoader(
    RocksetClient(Regions.usw2a1, "<api key>"),
    models.QueryRequestSql(query="SELECT * FROM langchain_demo LIMIT 1 WHERE id=38"),
    ["sentence1", "sentence2"],
    content_columns_joiner=lambda docs: "\n".join(
        [f"{doc[0]}: {doc[1]}" for doc in docs]
    ),
)
```

这将产生以下 `page_content`：

```
sentence1: This is the first sentence.
sentence2: This is the second sentence.
```
