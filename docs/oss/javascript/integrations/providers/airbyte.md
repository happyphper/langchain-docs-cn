---
title: Airbyte
---
>[Airbyte](https://github.com/airbytehq/airbyte) 是一个用于 ELT 管道的数据集成平台，可将来自 API、数据库和文件的数据传输到数据仓库和数据湖。它拥有最大的 ELT 连接器目录，支持连接到各种数据仓库和数据库。

## 安装与设置

::: code-group

```bash [pip]
pip install -U langchain-airbyte
```

```bash [uv]
uv add langchain-airbyte
```

:::

<Note>

<strong>目前，`langchain-airbyte` 库不支持 Pydantic v2。</strong>

请降级到 Pydantic v1 以使用此包。

此包目前还需要 Python 3.10+。

</Note>

该集成包不需要设置任何全局环境变量，但某些集成（例如 `source-github`）可能需要传入凭据。

## 文档加载器

### AirbyteLoader

查看[使用示例](/oss/integrations/document_loaders/airbyte)。

```python
from langchain_airbyte import AirbyteLoader
```
