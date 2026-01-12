---
title: BoxRetriever
---
这将帮助您开始使用 Box [检索器](/oss/javascript/langchain/retrieval)。有关 BoxRetriever 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/box/retrievers/langchain_box.retrievers.box.BoxRetriever.html)。

# 概述

`BoxRetriever` 类帮助您从 Box 获取非结构化内容，并将其转换为 LangChain 的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 格式。您可以通过基于全文搜索文件或使用 Box AI 来检索包含对文件进行 AI 查询结果的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 来实现这一点。这需要包含一个包含 Box 文件 ID 的 `List[str]`，例如 `["12345","67890"]`。

<Info>

Box AI 需要企业增强版许可证。

</Info>

没有文本表示的文件将被跳过。

### 集成详情

1: 自带数据（即索引和搜索自定义文档语料库）：

| 检索器 | 自托管 | 云服务 | 包 |
| :--- | :--- | :---: | :---: |
| [BoxRetriever](https://python.langchain.com/api_reference/box/retrievers/langchain_box.retrievers.box.BoxRetriever.html) | ❌ | ✅ | langchain-box |

## 设置

为了使用 Box 包，您需要准备以下几项：

*   **Box 账户** — 如果您不是当前的 Box 客户，或者想在您的生产 Box 实例之外进行测试，可以使用 [免费开发者账户](https://account.box.com/signup/n/developer#ty9l3)。
*   **[Box 应用](https://developer.box.com/guides/getting-started/first-application/)** — 在 [开发者控制台](https://account.box.com/developers/console) 中配置，对于 Box AI，必须启用 `Manage AI` 范围。在这里您还需要选择身份验证方法。
*   应用必须由 [管理员启用](https://developer.box.com/guides/authorization/custom-app-approval/#manual-approval)。对于免费开发者账户，管理员就是注册该账户的人。

### 凭证

在这些示例中，我们将使用 [令牌身份验证](https://developer.box.com/guides/authentication/tokens/developer-tokens)。这可以与任何 [身份验证方法](https://developer.box.com/guides/authentication/) 一起使用。只需使用任何方法获取令牌即可。如果您想了解更多关于如何在 `langchain-box` 中使用其他身份验证类型的信息，请访问 [Box 提供商](/oss/javascript/integrations/providers/box) 文档。

```python
import getpass
import os

box_developer_token = getpass.getpass("Enter your Box Developer Token: ")
```

如果您希望从单个查询中获得自动化追踪，也可以通过取消下面的注释来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

此检索器位于 `langchain-box` 包中：

```python
pip install -qU langchain-box
```

## 实例化

现在我们可以实例化我们的检索器：

## 搜索

```python
from langchain_box import BoxRetriever

retriever = BoxRetriever(box_developer_token=box_developer_token)
```

为了进行更精细的搜索，我们提供了一系列选项来帮助您筛选结果。这使用 `langchain_box.utilities.SearchOptions` 结合 `langchain_box.utilities.SearchTypeFilter` 和 `langchain_box.utilities.DocumentFiles` 枚举来筛选诸如创建日期、要搜索的文件部分，甚至将搜索范围限制在特定文件夹等条件。

有关更多信息，请查看 [API 参考](https://python.langchain.com/v0.2/api_reference/box/utilities/langchain_box.utilities.box.SearchOptions.html)。

```python
from langchain_box.utilities import BoxSearchOptions, DocumentFiles, SearchTypeFilter

box_folder_id = "260931903795"

box_search_options = BoxSearchOptions(
    ancestor_folder_ids=[box_folder_id],
    search_type_filter=[SearchTypeFilter.FILE_CONTENT],
    created_date_range=["2023-01-01T00:00:00-07:00", "2024-08-01T00:00:00-07:00,"],
    k=200,
    size_range=[1, 1000000],
    updated_data_range=None,
)

retriever = BoxRetriever(
    box_developer_token=box_developer_token, box_search_options=box_search_options
)

retriever.invoke("AstroTech Solutions")
```

```text
[Document(metadata={'source': 'https://dl.boxcloud.com/api/2.0/internal_files/1514555423624/versions/1663171610024/representations/extracted_text/content/', 'title': 'Invoice-A5555_txt'}, page_content='Vendor: AstroTech Solutions\nInvoice Number: A5555\n\nLine Items:\n    - Gravitational Wave Detector Kit: $800\n    - Exoplanet Terrarium: $120\nTotal: $920')]
```

## Box AI

```python
from langchain_box import BoxRetriever

box_file_ids = ["1514555423624", "1514553902288"]

retriever = BoxRetriever(
    box_developer_token=box_developer_token, box_file_ids=box_file_ids
)
```

## 使用

```python
query = "What was the most expensive item purchased"

retriever.invoke(query)
```

```text
[Document(metadata={'source': 'Box AI', 'title': 'Box AI What was the most expensive item purchased'}, page_content='The most expensive item purchased is the **Gravitational Wave Detector Kit** from AstroTech Solutions, which costs **$800**.')]
```

## 引用

使用 Box AI 和 `BoxRetriever`，您可以返回提示的答案、返回 Box 用于获取该答案的引用，或者两者都返回。无论您选择如何使用 Box AI，检索器都会返回一个 `List[Document]` 对象。我们通过两个 `bool` 参数 `answer` 和 `citations` 提供这种灵活性。`answer` 默认为 `True`，`citations` 默认为 `False`，因此如果您只想要答案，可以省略两者。如果您想要两者，只需包含 `citations=True`；如果您只想要引用，则需要包含 `answer=False` 和 `citations=True`。

### 获取两者

```python
retriever = BoxRetriever(
    box_developer_token=box_developer_token, box_file_ids=box_file_ids, citations=True
)

retriever.invoke(query)
```

```text
[Document(metadata={'source': 'Box AI', 'title': 'Box AI What was the most expensive item purchased'}, page_content='The most expensive item purchased is the **Gravitational Wave Detector Kit** from AstroTech Solutions, which costs **$800**.'),
 Document(metadata={'source': 'Box AI What was the most expensive item purchased', 'file_name': 'Invoice-A5555.txt', 'file_id': '1514555423624', 'file_type': 'file'}, page_content='Vendor: AstroTech Solutions\nInvoice Number: A5555\n\nLine Items:\n    - Gravitational Wave Detector Kit: $800\n    - Exoplanet Terrarium: $120\nTotal: $920')]
```

### 仅获取引用

```python
retriever = BoxRetriever(
    box_developer_token=box_developer_token,
    box_file_ids=box_file_ids,
    answer=False,
    citations=True,
)

retriever.invoke(query)
```

```text
[Document(metadata={'source': 'Box AI What was the most expensive item purchased', 'file_name': 'Invoice-A5555.txt', 'file_id': '1514555423624', 'file_type': 'file'}, page_content='Vendor: AstroTech Solutions\nInvoice Number: A5555\n\nLine Items:\n    - Gravitational Wave Detector Kit: $800\n    - Exoplanet Terrarium: $120\nTotal: $920')]
```

## 用作智能体工具

与其他检索器一样，BoxRetriever 也可以作为工具添加到 LangGraph 智能体中。

```python
pip install -U langsmith
```

```python
from langchain_classic import hub
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.tools.retriever import create_retriever_tool
```

```python
box_search_options = BoxSearchOptions(
    ancestor_folder_ids=[box_folder_id],
    search_type_filter=[SearchTypeFilter.FILE_CONTENT],
    created_date_range=["2023-01-01T00:00:00-07:00", "2024-08-01T00:00:00-07:00,"],
    k=200,
    size_range=[1, 1000000],
    updated_data_range=None,
)

retriever = BoxRetriever(
    box_developer_token=box_developer_token, box_search_options=box_search_options
)

box_search_tool = create_retriever_tool(
    retriever,
    "box_search_tool",
    "This tool is used to search Box and retrieve documents that match the search criteria",
)
tools = [box_search_tool]
```

```python
prompt = hub.pull("hwchase17/openai-tools-agent")
prompt.messages

llm = ChatOpenAI(temperature=0, openai_api_key=openai_key)

agent = create_openai_tools_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)
```

```text
/Users/shurrey/local/langchain/.venv/lib/python3.11/site-packages/langsmith/client.py:312: LangSmithMissingAPIKeyWarning: API key must be provided when using hosted LangSmith API
  warnings.warn(
```

```python
result = agent_executor.invoke(
    {
        "input": "list the items I purchased from AstroTech Solutions from most expensive to least expensive"
    }
)
```

```python
print(f"result {result['output']}")
```

```text
result The items you purchased from AstroTech Solutions from most expensive to least expensive are:

1. Gravitational Wave Detector Kit: $800
2. Exoplanet Terrarium: $120

Total: $920
```

## 额外字段

所有 Box 连接器都提供了从 Box `FileFull` 对象中选择额外字段作为自定义 LangChain 元数据返回的能力。每个对象都接受一个名为 `extra_fields` 的可选 `List[str]`，其中包含返回对象中的 JSON 键，例如 `extra_fields=["shared_link"]`。

连接器会将该字段添加到集成功能所需的字段列表中，然后将结果添加到返回的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 或 `Blob` 的元数据中，例如 `"metadata" : { "source" : "source, "shared_link" : "shared_link" }`。如果该字段对该文件不可用，它将作为空字符串返回，例如 `"shared_link" : ""`。

---

## API 参考

有关 BoxRetriever 所有功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/box/retrievers/langchain_box.retrievers.box.BoxRetriever.html)。

## 帮助

如果您有任何问题，可以查看我们的 [开发者文档](https://developer.box.com) 或在我们的 [开发者社区](https://community.box.com) 中联系我们。
