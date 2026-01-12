---
title: 拆分 JSON 数据
---
这个 JSON 分割器在控制分块大小的同时，对 JSON 数据进行[分割](/oss/javascript/integrations/splitters/)。它采用深度优先的方式遍历 JSON 数据并构建更小的 JSON 块。它会尽量保持嵌套的 JSON 对象完整，但如果需要将块大小保持在 `min_chunk_size` 和 `max_chunk_size` 之间，也会对它们进行分割。

如果某个值不是嵌套的 JSON，而是一个非常大的字符串，则该字符串不会被分割。如果你需要对块大小设置硬性上限，可以考虑在这些块上组合使用递归文本分割器。还有一个可选的预处理步骤来分割列表，方法是先将它们转换为 JSON（字典），然后再进行分割。

1.  文本如何分割：按 JSON 值。
2.  块大小如何衡量：按字符数。

```python
pip install -qU langchain-text-splitters
```

首先，我们加载一些 JSON 数据：

```python
import json

import requests

# 这是一个大型嵌套 JSON 对象，将被加载为 Python 字典
json_data = requests.get("https://api.smith.langchain.com/openapi.json").json()
```

## 基本用法

指定 `max_chunk_size` 来限制块大小：

```python
from langchain_text_splitters import RecursiveJsonSplitter

splitter = RecursiveJsonSplitter(max_chunk_size=300)
```

要获取 JSON 块，请使用 `.split_json` 方法：

```python
# 递归分割 JSON 数据 - 如果你需要访问/操作较小的 JSON 块
json_chunks = splitter.split_json(json_data=json_data)

for chunk in json_chunks[:3]:
    print(chunk)
```

```python
{'openapi': '3.1.0', 'info': {'title': 'LangSmith', 'version': '0.1.0'}, 'servers': [{'url': 'https://api.smith.langchain.com', 'description': 'LangSmith API endpoint.'}]}
{'paths': {'/api/v1/sessions/{session_id}': {'get': {'tags': ['tracer-sessions'], 'summary': 'Read Tracer Session', 'description': 'Get a specific session.', 'operationId': 'read_tracer_session_api_v1_sessions__session_id__get'}}}}
{'paths': {'/api/v1/sessions/{session_id}': {'get': {'security': [{'API Key': []}, {'Tenant ID': []}, {'Bearer Auth': []}]}}}}
```
要获取 LangChain [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) 对象，请使用 `.create_documents` 方法：

```python
# 分割器也可以输出文档
docs = splitter.create_documents(texts=[json_data])

for doc in docs[:3]:
    print(doc)
```

```python
page_content='{"openapi": "3.1.0", "info": {"title": "LangSmith", "version": "0.1.0"}, "servers": [{"url": "https://api.smith.langchain.com", "description": "LangSmith API endpoint."}]}'
page_content='{"paths": {"/api/v1/sessions/{session_id}": {"get": {"tags": ["tracer-sessions"], "summary": "Read Tracer Session", "description": "Get a specific session.", "operationId": "read_tracer_session_api_v1_sessions__session_id__get"}}}}'
page_content='{"paths": {"/api/v1/sessions/{session_id}": {"get": {"security": [{"API Key": []}, {"Tenant ID": []}, {"Bearer Auth": []}]}}}}'
```
或者使用 `.split_text` 直接获取字符串内容：

```python
texts = splitter.split_text(json_data=json_data)

print(texts[0])
print(texts[1])
```

```json
{"openapi": "3.1.0", "info": {"title": "LangSmith", "version": "0.1.0"}, "servers": [{"url": "https://api.smith.langchain.com", "description": "LangSmith API endpoint."}]}
{"paths": {"/api/v1/sessions/{session_id}": {"get": {"tags": ["tracer-sessions"], "summary": "Read Tracer Session", "description": "Get a specific session.", "operationId": "read_tracer_session_api_v1_sessions__session_id__get"}}}}
```
## 如何管理列表内容产生的块大小

请注意，此示例中有一个块的大小超过了指定的 `max_chunk_size`（300）。查看其中一个较大的块，我们发现其中有一个列表对象：

```python
print([len(text) for text in texts][:10])
print()
print(texts[3])
```

```json
[171, 231, 126, 469, 210, 213, 237, 271, 191, 232]

{"paths": {"/api/v1/sessions/{session_id}": {"get": {"parameters": [{"name": "session_id", "in": "path", "required": true, "schema": {"type": "string", "format": "uuid", "title": "Session Id"}}, {"name": "include_stats", "in": "query", "required": false, "schema": {"type": "boolean", "default": false, "title": "Include Stats"}}, {"name": "accept", "in": "header", "required": false, "schema": {"anyOf": [{"type": "string"}, {"type": "null"}], "title": "Accept"}}]}}}}
```
JSON 分割器默认不分割列表。

指定 `convert_lists=True` 来预处理 JSON，将列表内容转换为字典，其中 `index:item` 作为 `key:val` 对：

```python
texts = splitter.split_text(json_data=json_data, convert_lists=True)
```

让我们看看块的大小。现在它们都小于最大值：

```python
print([len(text) for text in texts][:10])
```

```text
[176, 236, 141, 203, 212, 221, 210, 213, 242, 291]
```
列表已转换为字典，但即使被分割成许多块，也保留了所有需要的上下文信息：

```python
print(texts[1])
```

```json
{"paths": {"/api/v1/sessions/{session_id}": {"get": {"tags": {"0": "tracer-sessions"}, "summary": "Read Tracer Session", "description": "Get a specific session.", "operationId": "read_tracer_session_api_v1_sessions__session_id__get"}}}}
```

```python
# 我们也可以查看文档
docs[1]
```

```python
Document(page_content='{"paths": {"/api/v1/sessions/{session_id}": {"get": {"tags": ["tracer-sessions"], "summary": "Read Tracer Session", "description": "Get a specific session.", "operationId": "read_tracer_session_api_v1_sessions__session_id__get"}}}}')
```
