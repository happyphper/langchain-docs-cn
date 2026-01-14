---
title: Microsoft SharePoint
---
> [Microsoft SharePoint](https://en.wikipedia.org/wiki/SharePoint) 是一个基于网站的协作系统，它使用工作流应用程序、“列表”数据库以及其他 Web 部件和安全功能，旨在赋能业务团队协同工作，由微软开发。

本笔记本介绍了如何从 [SharePoint 文档库](https://support.microsoft.com/en-us/office/what-is-a-document-library-3b5976dd-65cf-4c9e-bf5a-713c10ca2872) 加载文档。默认情况下，文档加载器会加载 `pdf`、`doc`、`docx` 和 `txt` 文件。您可以通过提供适当的解析器来加载其他文件类型（详见下文）。

## 先决条件

1.  按照 [Microsoft 标识平台](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) 说明注册一个应用程序。
2.  注册完成后，Azure 门户会显示应用注册的“概述”窗格。您会看到“应用程序(客户端) ID”。也称为 `client ID`，此值在 Microsoft 标识平台中唯一标识您的应用程序。
3.  在遵循 **第 1 项** 中的步骤时，您可以将重定向 URI 设置为 `https://login.microsoftonline.com/common/oauth2/nativeclient`。
4.  在遵循 **第 1 项** 中的步骤时，在“应用程序密码”部分生成一个新密码 (`client_secret`)。
5.  按照此[文档](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-expose-web-apis#add-a-scope)中的说明，将以下 `SCOPES` (`offline_access` 和 `Sites.Read.All`) 添加到您的应用程序。
6.  要从您的**文档库**检索文件，您需要其 ID。要获取它，您需要 `Tenant Name`、`Collection ID` 和 `Subsite ID` 的值。
7.  要找到您的 `Tenant Name`，请按照此[文档](https://learn.microsoft.com/en-us/azure/active-directory-b2c/tenant-management-read-tenant-name)中的说明操作。获取后，只需从该值中移除 `.onmicrosoft.com`，剩下的部分就是您的 `Tenant Name`。
8.  要获取您的 `Collection ID` 和 `Subsite ID`，您需要您的 **SharePoint** `site-name`。您的 `SharePoint` 站点 URL 格式如下：`https://<tenant-name>.sharepoint.com/sites/<site-name>`。此 URL 的最后一部分就是 `site-name`。
9.  要获取站点 `Collection ID`，请在浏览器中访问此 URL：`https://<tenant>.sharepoint.com/sites/<site-name>/_api/site/id` 并复制 `Edm.Guid` 属性的值。
10. 要获取 `Subsite ID`（或 web ID），请使用：`https://<tenant>.sharepoint.com/sites/<site-name>/_api/web/id` 并复制 `Edm.Guid` 属性的值。
11. `SharePoint site ID` 的格式如下：`<tenant-name>.sharepoint.com,<Collection ID>,<subsite ID>`。您可以保存此值以备下一步使用。
12. 访问 [Graph Explorer Playground](https://developer.microsoft.com/en-us/graph/graph-explorer) 以获取您的 `Document Library ID`。第一步是确保您使用与您的 **SharePoint** 站点关联的帐户登录。然后您需要向 `https://graph.microsoft.com/v1.0/sites/<SharePoint site ID>/drive` 发出请求，响应将返回一个包含 `id` 字段的有效负载，该字段保存着您的 `Document Library ID`。

## 🧑 从 SharePoint 文档库摄取文档的说明

### 🔑 身份验证

默认情况下，`SharePointLoader` 期望 `CLIENT_ID` 和 `CLIENT_SECRET` 的值必须分别存储为名为 `O365_CLIENT_ID` 和 `O365_CLIENT_SECRET` 的环境变量。您可以通过应用程序根目录下的 `.env` 文件或在脚本中使用以下命令来传递这些环境变量。

```python
os.environ['O365_CLIENT_ID'] = "YOUR CLIENT ID"
os.environ['O365_CLIENT_SECRET'] = "YOUR CLIENT SECRET"
```

此加载器使用一种称为 [*代表用户*](https://learn.microsoft.com/en-us/graph/auth-v2-user?context=graph%2Fapi%2F1.0&view=graph-rest-1.0) 的身份验证方式。这是一个需要用户同意的两步身份验证。当您实例化加载器时，它会打印一个 URL，用户必须访问该 URL 以授予应用程序所需权限的同意。然后用户必须访问此 URL 并同意应用程序的请求。接着，用户必须复制生成的页面 URL 并将其粘贴回控制台。如果登录尝试成功，该方法将返回 True。

```python
from langchain_community.document_loaders.sharepoint import SharePointLoader

loader = SharePointLoader(document_library_id="YOUR DOCUMENT LIBRARY ID")
```

身份验证完成后，加载器将在 `~/.credentials/` 文件夹中存储一个令牌 (`o365_token.txt`)。此令牌稍后可用于身份验证，而无需之前解释的复制/粘贴步骤。要使用此令牌进行身份验证，您需要在实例化加载器时将 `auth_with_token` 参数更改为 True。

```python
from langchain_community.document_loaders.sharepoint import SharePointLoader

loader = SharePointLoader(document_library_id="YOUR DOCUMENT LIBRARY ID", auth_with_token=True)
```

### 🗂️ 文档加载器

#### 📑 从文档库目录加载文档

`SharePointLoader` 可以从文档库内的特定文件夹加载文档。例如，您想加载存储在文档库内 `Documents/marketing` 文件夹中的所有文档。

```python
from langchain_community.document_loaders.sharepoint import SharePointLoader

loader = SharePointLoader(document_library_id="YOUR DOCUMENT LIBRARY ID", folder_path="Documents/marketing", auth_with_token=True)
documents = loader.load()
```

如果您收到错误 `Resource not found for the segment`，请尝试使用 `folder_id` 而不是文件夹路径，该 ID 可以从 [Microsoft Graph API](https://developer.microsoft.com/en-us/graph/graph-explorer) 获取。

```python
loader = SharePointLoader(document_library_id="YOUR DOCUMENT LIBRARY ID", auth_with_token=True
                          folder_id="<folder-id>")
documents = loader.load()
```

如果您希望从根目录加载文档，可以省略 `folder_id`、`folder_path` 和 `documents_ids`，加载器将加载根目录。

```python
# 从根目录加载文档
loader = SharePointLoader(document_library_id="YOUR DOCUMENT LIBRARY ID", auth_with_token=True)
documents = loader.load()
```

结合 `recursive=True`，您可以轻松地从整个 SharePoint 加载所有文档：

```python
# 从根目录加载文档
loader = SharePointLoader(document_library_id="YOUR DOCUMENT LIBRARY ID",
                          recursive=True,
                          auth_with_token=True)
documents = loader.load()
```

#### 📑 从文档 ID 列表加载文档

另一种可能性是提供您要加载的每个文档的 `object_id` 列表。为此，您需要查询 [Microsoft Graph API](https://developer.microsoft.com/en-us/graph/graph-explorer) 以查找您感兴趣的所有文档 ID。此[链接](https://learn.microsoft.com/en-us/graph/api/resources/onedrive?view=graph-rest-1.0#commonly-accessed-resources)提供了一个端点列表，有助于检索文档 ID。

例如，要检索存储在 `data/finance/` 文件夹中的所有对象的信息，您需要向以下地址发出请求：`https://graph.microsoft.com/v1.0/drives/<document-library-id>/root:/data/finance:/children`。一旦您有了感兴趣的 ID 列表，就可以使用以下参数实例化加载器。

```python
from langchain_community.document_loaders.sharepoint import SharePointLoader

loader = SharePointLoader(document_library_id="YOUR DOCUMENT LIBRARY ID", object_ids=["ID_1", "ID_2"], auth_with_token=True)
documents = loader.load()
```

#### 📑 选择支持的文件类型和首选解析器

默认情况下，`SharePointLoader` 使用默认解析器（见下文）加载在 [`document_loaders/parsers/registry`](https://github.com/langchain-ai/langchain/blob/master/libs/community/langchain_community/document_loaders/parsers/registry.py#L10-L22) 中定义的文件类型。

```python
def _get_default_parser() -> BaseBlobParser:
    """Get default mime-type based parser."""
    return MimeTypeBasedParser(
        handlers={
            "application/pdf": PyMuPDFParser(),
            "text/plain": TextParser(),
            "application/msword": MsWordParser(),
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
                MsWordParser()
            ),
        },
        fallback_parser=None,
    )
```

您可以通过向 `SharePointLoader` 传递 `handlers` 参数来覆盖此行为。
传递一个字典，将文件扩展名（如 `"doc"`、`"pdf"` 等）或 MIME 类型（如 `"application/pdf"`、`"text/plain"` 等）映射到解析器。
请注意，您必须**只**使用文件扩展名或 MIME 类型，不能混合使用。

文件扩展名不要包含前导点。

```python
# 使用文件扩展名：
handlers = {
    "doc": MsWordParser(),
    "pdf": PDFMinerParser(),
    "mp3": OpenAIWhisperParser()
}

# 使用 MIME 类型：
handlers = {
    "application/msword": MsWordParser(),
    "application/pdf": PDFMinerParser(),
    "audio/mpeg": OpenAIWhisperParser()
}

loader = SharePointLoader(document_library_id="...",
                            handlers=handlers # 将 handlers 传递给 SharePointLoader
                            )
```

如果多个文件扩展名映射到同一个 MIME 类型，将应用字典中的最后一项。
示例：

```python
# 'jpg' 和 'jpeg' 都映射到 'image/jpeg' MIME 类型。SecondParser() 将用于
# 解析所有 jpg/jpeg 文件。
handlers = {
    "jpg": FirstParser(),
    "jpeg": SecondParser()
}
```
