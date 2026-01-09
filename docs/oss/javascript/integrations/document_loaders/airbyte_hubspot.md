---
title: Airbyte Hubspot（已弃用）
---
注意：`AirbyteHubspotLoader` 已弃用。请改用 [`AirbyteLoader`](/oss/integrations/document_loaders/airbyte)。

>[Airbyte](https://github.com/airbytehq/airbyte) 是一个用于 ELT 管道的数据集成平台，可将来自 API、数据库和文件的数据传输到数据仓库和数据湖。它拥有最大的 ELT 连接器目录，支持多种数据仓库和数据库。

此加载器将 Hubspot 连接器公开为文档加载器，允许您将各种 Hubspot 对象作为文档加载。

## 安装

首先，您需要安装 `airbyte-source-hubspot` Python 包。

```python
pip install -qU  airbyte-source-hubspot
```

## 示例

有关如何配置读取器的详细信息，请查看 [Airbyte 文档页面](https://docs.airbyte.com/integrations/sources/hubspot/)。配置对象应遵循的 JSON 模式可以在 GitHub 上找到：[https://github.com/airbytehq/airbyte/blob/master/airbyte-integrations/connectors/source-hubspot/source_hubspot/spec.yaml](https://github.com/airbytehq/airbyte/blob/master/airbyte-integrations/connectors/source-hubspot/source_hubspot/spec.yaml)。

其一般结构如下：

```python
{
  "start_date": "<开始检索记录的日期，ISO 格式，例如 2020-10-20T00:00:00Z>",
  "credentials": {
    "credentials_title": "Private App Credentials",
    "access_token": "<您的私有应用的访问令牌>"
  }
}
```

默认情况下，所有字段都作为元数据存储在文档中，文本内容设置为空字符串。通过转换读取器返回的文档来构建文档的文本内容。

```python
from langchain_community.document_loaders.airbyte import AirbyteHubspotLoader

config = {
    # 您的 hubspot 配置
}

loader = AirbyteHubspotLoader(
    config=config, stream_name="products"
)  # 请查阅上面链接的文档以获取所有流的列表
```

现在您可以像往常一样加载文档

```python
docs = loader.load()
```

由于 `load` 返回一个列表，它将阻塞直到所有文档加载完成。为了更好地控制此过程，您也可以使用 `lazy_load` 方法，它返回一个迭代器：

```python
docs_iterator = loader.lazy_load()
```

请注意，默认情况下页面内容为空，元数据对象包含记录中的所有信息。要处理文档，请创建一个继承自基础加载器的类，并自行实现 `_handle_records` 方法：

```python
from langchain_core.documents import Document

def handle_record(record, id):
    return Document(page_content=record.data["title"], metadata=record.data)

loader = AirbyteHubspotLoader(
    config=config, record_handler=handle_record, stream_name="products"
)
docs = loader.load()
```

## 增量加载

某些流允许增量加载，这意味着源会跟踪已同步的记录，并且不会再次加载它们。这对于数据量大且更新频繁的源非常有用。

要利用此功能，请存储加载器的 `last_state` 属性，并在再次创建加载器时传入。这将确保只加载新记录。

```python
last_state = loader.last_state  # 安全存储

incremental_loader = AirbyteHubspotLoader(
    config=config, stream_name="products", state=last_state
)

new_docs = incremental_loader.load()
```
