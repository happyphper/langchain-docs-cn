---
title: Confluence
---
[Confluence](https://www.atlassian.com/software/confluence) 是一个维基协作平台，旨在保存和组织所有与项目相关的材料。作为一个知识库，Confluence 主要服务于内容管理活动。

此加载器允许您获取 Confluence 页面并将其处理为 <a href="https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象。

---

## 认证方法

支持以下认证方法：

- `username/api_key`
- `OAuth2 login`
- `cookies`
- 本地部署安装：`token` 认证

---

## 页面选择

您可以使用以下方式指定要加载的页面：

- **page_ids** (*列表*):
  一个 `page_id` 值列表，用于加载相应的页面。

- **space_key** (*字符串*):
  一个 `space_key` 值字符串，用于加载指定 Confluence 空间内的所有页面。

如果同时提供了 `page_ids` 和 `space_key`，加载器将返回两个列表页面的并集。

*提示：* `space_key` 和 `page_id` 都可以在 Confluence 页面的 URL 中找到：
`https://yoursite.atlassian.com/wiki/spaces/{space_key}/pages/{page_id}`

---

## 附件

您可以通过将布尔参数 **include_attachments** 设置为 `True`（默认值：`False`）来在加载的 <a href="https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象中包含附件。启用后，所有附件都会被下载，其文本内容会被提取并添加到 Document 中。

**当前支持的附件类型：**

- PDF (`.pdf`)
- PNG (`.png`)
- JPEG/JPG (`.jpeg`, `.jpg`)
- SVG (`.svg`)
- Word (`.doc`, `.docx`)
- Excel (`.xls`, `.xlsx`)

---

在使用 ConfluenceLoader 之前，请确保已安装最新版本的 atlassian-python-api 包：

```python
pip install -qU  atlassian-python-api
```

## 示例

### 用户名和密码 或 用户名和 API 令牌（仅限 Atlassian Cloud）

此示例使用用户名和密码进行认证，或者，如果您连接到 Atlassian Cloud 托管的 Confluence 版本，则使用用户名和 API 令牌。
您可以在以下地址生成 API 令牌：[id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)。

`limit` 参数指定单次调用将检索多少文档，而不是总共将检索多少文档。
默认情况下，代码将以 50 个文档为一批，最多返回 1000 个文档。要控制文档总数，请使用 `max_pages` 参数。
请注意，atlassian-python-api 包中 `limit` 参数的最大值目前为 100。

```python
from langchain_community.document_loaders import ConfluenceLoader

loader = ConfluenceLoader(
    url="https://yoursite.atlassian.com/wiki",
    username="<your-confluence-username>",
    api_key="<your-api-token>",
    space_key="<your-space-key>",
    include_attachments=True,
    limit=50,
)
documents = loader.load()
```

### 个人访问令牌（仅限 Server/本地部署）

此方法仅对 Data Center/Server 本地部署版本有效。
有关如何生成个人访问令牌 (PAT) 的更多信息，请查看 Confluence 官方文档：[confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html)。
使用 PAT 时，您只需提供令牌值，不能提供用户名。
请注意，ConfluenceLoader 将以生成 PAT 的用户的权限运行，并且只能加载该用户有权访问的文档。

```python
from langchain_community.document_loaders import ConfluenceLoader

loader = ConfluenceLoader(
    url="https://confluence.yoursite.com/",
    token="<your-personal-access-token>",
    space_key="<your-space-key>",
    include_attachments=True,
    limit=50,
    max_pages=50,
)
documents = loader.load()
```
