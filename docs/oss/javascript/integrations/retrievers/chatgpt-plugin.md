---
title: ChatGPT 插件
---
>[OpenAI 插件](https://platform.openai.com/docs/plugins/introduction) 将 `ChatGPT` 连接到第三方应用程序。这些插件使 `ChatGPT` 能够与开发者定义的 API 进行交互，从而增强 `ChatGPT` 的能力，并允许其执行广泛的操作。

>插件允许 `ChatGPT` 执行诸如：
>
>- 检索实时信息；例如，体育比分、股票价格、最新新闻等。
>- 检索知识库信息；例如，公司文档、个人笔记等。
>- 代表用户执行操作；例如，预订航班、订购食物等。

本笔记本展示了如何在 LangChain 中使用 ChatGPT 检索插件。

```python
# 步骤 1: 加载

# 使用 LangChain 的 DocumentLoaders 加载文档
# 此示例来自 https://langchain.readthedocs.io/en/latest/modules/document_loaders/examples/csv.html

from langchain_community.document_loaders import CSVLoader
from langchain_core.documents import Document

loader = CSVLoader(
    file_path="../../document_loaders/examples/example_data/mlb_teams_2012.csv"
)
data = loader.load()

# 步骤 2: 转换

# 将 Document 转换为 https://github.com/openai/chatgpt-retrieval-plugin 期望的格式
import json
from typing import List

def write_json(path: str, documents: List[Document]) -> None:
    results = [{"text": doc.page_content} for doc in documents]
    with open(path, "w") as f:
        json.dump(results, f, indent=2)

write_json("foo.json", data)

# 步骤 3: 使用

# 像处理 https://github.com/openai/chatgpt-retrieval-plugin/tree/main/scripts/process_json 中的任何其他 json 文件一样摄取此文件
```

## 使用 ChatGPT 检索插件

好的，我们已经创建了 ChatGPT 检索插件，但实际上如何使用它呢？

下面的代码将逐步说明如何操作。

我们希望使用 `ChatGPTPluginRetriever`，因此必须获取 OpenAI API 密钥。

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

```text
OpenAI API Key: ········
```

```python
from langchain_community.retrievers import (
    ChatGPTPluginRetriever,
)
```

```python
retriever = ChatGPTPluginRetriever(url="http://0.0.0.0:8000", bearer_token="foo")
```

```python
retriever.invoke("alice's phone number")
```

```json
[Document(page_content="This is Alice's phone number: 123-456-7890", lookup_str='', metadata={'id': '456_0', 'metadata': {'source': 'email', 'source_id': '567', 'url': None, 'created_at': '1609592400.0', 'author': 'Alice', 'document_id': '456'}, 'embedding': None, 'score': 0.925571561}, lookup_index=0),
 Document(page_content='This is a document about something', lookup_str='', metadata={'id': '123_0', 'metadata': {'source': 'file', 'source_id': 'https://example.com/doc1', 'url': 'https://example.com/doc1', 'created_at': '1609502400.0', 'author': 'Alice', 'document_id': '123'}, 'embedding': None, 'score': 0.6987589}, lookup_index=0),
 Document(page_content='Team: Angels "Payroll (millions)": 154.49 "Wins": 89', lookup_str='', metadata={'id': '59c2c0c1-ae3f-4272-a1da-f44a723ea631_0', 'metadata': {'source': None, 'source_id': None, 'url': None, 'created_at': None, 'author': None, 'document_id': '59c2c0c1-ae3f-4272-a1da-f44a723ea631'}, 'embedding': None, 'score': 0.697888613}, lookup_index=0)]
```

```python

```
