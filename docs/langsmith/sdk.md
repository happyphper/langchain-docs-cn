---
title: LangGraph SDK
sidebarTitle: LangGraph SDK
---
LangSmith 提供了一个用于与 [Agent Server](/langsmith/agent-server) 交互的 Python SDK。

<Tip>

<strong>Python SDK 参考</strong>

有关 Python SDK 的详细信息，请参阅 [Python SDK 参考文档](/langsmith/langgraph-python-sdk)。

</Tip>

## 安装

您可以使用相应语言的包管理器来安装这些包：

<Tabs>

<Tab title="Python">

```bash
pip install langgraph-sdk
```

</Tab>

<Tab title="JS">

```bash
yarn add @langchain/langgraph-sdk
```

</Tab>

</Tabs>

## Python 同步与异步

Python SDK 提供了同步 (`get_sync_client`) 和异步 (`get_client`) 两种客户端，用于与 Agent Server 交互：

<Tabs>

<Tab title="同步">

```python
from langgraph_sdk import get_sync_client

client = get_sync_client(url=..., api_key=...)
client.assistants.search()
```

</Tab>

<Tab title="异步">

```python
from langgraph_sdk import get_client

client = get_client(url=..., api_key=...)
await client.assistants.search()
```

</Tab>

</Tabs>

## 了解更多

* [Python SDK 参考](/langsmith/langgraph-python-sdk)
* [LangGraph CLI API 参考](/langsmith/cli)
* [JS/TS SDK 参考](/langsmith/langgraph-js-ts-sdk)
