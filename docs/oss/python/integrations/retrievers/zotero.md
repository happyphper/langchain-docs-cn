---
title: Zotero
---
这将帮助您开始使用 Zotero [检索器](/oss/python/langchain/retrieval)。有关 ZoteroRetriever 所有功能和配置的详细文档，请访问 [GitHub 页面](https://github.com/TimBMK/langchain-zotero-retriever)。

### 集成详情

| 检索器 | 来源 | 包 |
| :--- | :--- | :---: |
[ZoteroRetriever](https://github.com/TimBMK/langchain-zotero-retriever) | [Zotero API](https://www.zotero.org/support/dev/web_api/v3/start) | langchain-community |

## 设置

如果您希望从单个查询中获取自动化追踪，也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

此检索器位于 `langchain-zotero-retriever` 包中。我们还需要 `pyzotero` 依赖项：

```python
pip install -qU langchain-zotero-retriever pyzotero
```

## 实例化

`ZoteroRetriever` 参数包括：

- `k`：要包含的结果数量（默认值：50）
- `type`：要执行的搜索类型。"Top" 检索 Zotero 库中的顶级项目，"items" 返回任何 Zotero 库项目。（默认值：top）
- `get_fulltext`：如果库中的项目附有全文，则检索全文。如果为 False 或未附加文本，则返回空字符串作为 page_content。（默认值：True）
- `library_id`：要搜索的 Zotero 库的 ID。连接到库所必需。
- `library_type`：要搜索的库类型。"user" 表示个人库，"group" 表示共享的群组库。（默认值：user）
- `api_key`：如果未设置为环境变量，则为 Zotero API 密钥。可选，访问非公开群组库或个人库所必需。如果作为 ZOTERO_API_KEY 环境变量提供，则会自动获取。

```python
from langchain_zotero_retriever.retrievers import ZoteroRetriever

retriever = ZoteroRetriever(
    k=10,
    library_id="2319375",  # 一个公共群组库，访问不需要 API 密钥
    library_type="group",  # 如果您使用个人库，请将此设置为 "user"。个人库需要 API 密钥
)
```

## 用法

除了 `query` 之外，检索器还提供以下额外的搜索参数：

- `itemType`：要搜索的项目类型（例如 "book" 或 "journalArticle"）
- `tag`：用于搜索附加到库项目的标签（有关组合多个标签的语法，请参阅搜索语法）
- `qmode`：要使用的搜索模式。更改查询搜索的范围。"everything" 包含全文内容。"titleCreatorYear" 则搜索标题、作者和年份。
- `since`：仅返回在指定库版本之后修改的对象。默认为返回所有内容。

有关搜索语法，请参阅 Zotero API 文档：[www.zotero.org/support/dev/web_api/v3/basics#search_syntax](https://www.zotero.org/support/dev/web_api/v3/basics#search_syntax)

有关完整的 API 模式（包括可用的 itemTypes），请参阅：[github.com/zotero/zotero-schema](https://github.com/zotero/zotero-schema)

```python
query = "Zuboff"

retriever.invoke(query)
```

```python
tags = [
    "Surveillance",
    "Digital Capitalism",
]  # 注意，将标签作为列表提供将导致逻辑 AND 操作

retriever.invoke("", tag=tags)
```

## 在链中使用

由于 Zotero API 搜索的运作方式，直接将用户问题传递给 ZoteroRetriever 通常不会返回令人满意的结果。为了在链或智能体框架中使用，建议将 ZoteroRetriever 转换为一个 [工具](/oss/python/langchain/tools)。这样，LLM 可以将用户查询转换为更简洁的 API 搜索查询。此外，这允许 LLM 填充额外的搜索参数，例如标签或项目类型。

```python
from typing import List, Optional, Union

from langchain_core.output_parsers import PydanticToolsParser
from langchain.tools import StructuredTool, tool
from langchain_openai import ChatOpenAI

def retrieve(
    query: str,
    itemType: Optional[str],
    tag: Optional[Union[str, List[str]]],
    qmode: str = "everything",
    since: Optional[int] = None,
):
    retrieved_docs = retriever.invoke(
        query, itemType=itemType, tag=tag, qmode=qmode, since=since
    )
    serialized_docs = "\n\n".join(
        (
            f"Metadata: { {key: doc.metadata[key] for key in doc.metadata if key != 'abstractNote'} }\n"
            f"Abstract: {doc.metadata['abstractNote']}\n"
        )
        for doc in retrieved_docs
    )

    return serialized_docs, retrieved_docs

description = """从 Zotero 库中搜索并返回相关文档。可以使用以下搜索参数：

    参数：
        query: str: 要使用的搜索查询。尽量保持具体和简短，例如特定的主题或作者姓名
        itemType: 可选。要搜索的项目类型（例如 "book" 或 "journalArticle"）。多种类型可以作为字符串传递，用 "||" 分隔，例如 "book || journalArticle"。默认为所有类型。
        tag: 可选。用于搜索附加到库项目的标签。如果要检索带有多个标签的文档，请将它们作为列表传递。如果要检索带有任何标签的文档，请将它们作为字符串传递，用 "||" 分隔，例如 "tag1 || tag2"
        qmode: 要使用的搜索模式。更改查询搜索的范围。"everything" 包含全文内容。"titleCreatorYear" 则搜索标题、作者和年份。默认为 "everything"。
        since: 仅返回在指定库版本之后修改的对象。默认为返回所有内容。
    """

retriever_tool = StructuredTool.from_function(
    func=retrieve,
    name="retrieve",
    description=description,
    return_direct=True,
)

llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18")

llm_with_tools = llm.bind_tools([retrieve])

q = "What journal articles do I have on Surveillance in the zotero library?"

chain = llm_with_tools | PydanticToolsParser(tools=[retrieve])

chain.invoke(q)
```

---

## API 参考

有关 ZoteroRetriever 所有功能和配置的详细文档，请访问 [GitHub 页面](https://github.com/TimBMK/langchain-zotero-retriever)。

有关 Zotero API 的详细文档，请访问 [Zotero API 参考](https://www.zotero.org/support/dev/web_api/v3/start)。
