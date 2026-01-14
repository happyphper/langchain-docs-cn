---
title: Microsoft OneDrive
---
>[Microsoft OneDrive](https://en.wikipedia.org/wiki/OneDrive)（前身为 `SkyDrive`）是由微软运营的文件托管服务。

本笔记本介绍了如何从 `OneDrive` 加载文档。默认情况下，文档加载器会加载 `pdf`、`doc`、`docx` 和 `txt` 文件。您可以通过提供适当的解析器来加载其他文件类型（详见下文）。

## 先决条件

1.  按照 [Microsoft 身份平台](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) 的说明注册一个应用程序。
2.  注册完成后，Azure 门户会显示应用注册的“概述”窗格。您会看到“应用程序(客户端) ID”。也称为 `client ID`，此值在 Microsoft 身份平台中唯一标识您的应用程序。
3.  在遵循 **第 1 项** 中的步骤时，您可以将重定向 URI 设置为 `http://localhost:8000/callback`。
4.  在遵循 **第 1 项** 中的步骤时，在“应用程序密码”部分生成一个新密码 (`client_secret`)。
5.  按照此[文档](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-expose-web-apis#add-a-scope)中的说明，将以下 `SCOPES` (`offline_access` 和 `Files.Read.All`) 添加到您的应用程序。
6.  访问 [Graph Explorer Playground](https://developer.microsoft.com/en-us/graph/graph-explorer) 以获取您的 `OneDrive ID`。第一步是确保您使用与您的 OneDrive 帐户关联的帐户登录。然后，您需要向 `https://graph.microsoft.com/v1.0/me/drive` 发出请求，响应将返回一个包含 `id` 字段的有效负载，该字段保存着您 OneDrive 帐户的 ID。
7.  您需要使用命令 `pip install o365` 安装 o365 包。
8.  完成这些步骤后，您必须拥有以下值：

-   `CLIENT_ID`
-   `CLIENT_SECRET`
-   `DRIVE_ID`

## 🧑 从 OneDrive 摄取文档的说明

### 🔑 身份验证

默认情况下，`OneDriveLoader` 期望 `CLIENT_ID` 和 `CLIENT_SECRET` 的值必须分别存储为名为 `O365_CLIENT_ID` 和 `O365_CLIENT_SECRET` 的环境变量。您可以通过应用程序根目录下的 `.env` 文件传递这些环境变量，或者在脚本中使用以下命令。

```python
os.environ['O365_CLIENT_ID'] = "YOUR CLIENT ID"
os.environ['O365_CLIENT_SECRET'] = "YOUR CLIENT SECRET"
```

此加载器使用一种称为[*代表用户*](https://learn.microsoft.com/en-us/graph/auth-v2-user?context=graph%2Fapi%2F1.0&view=graph-rest-1.0)的身份验证。这是一个需要用户同意的两步身份验证。当您实例化加载器时，它将调用并打印一个 URL，用户必须访问该 URL 以同意应用程序所需的权限。然后用户必须访问此 URL 并同意应用程序的请求。接着，用户必须复制生成的页面 URL 并将其粘贴回控制台。如果登录尝试成功，该方法将返回 True。

```python
from langchain_community.document_loaders.onedrive import OneDriveLoader

loader = OneDriveLoader(drive_id="YOUR DRIVE ID")
```

身份验证完成后，加载器将在 `~/.credentials/` 文件夹中存储一个令牌 (`o365_token.txt`)。此令牌稍后可用于身份验证，而无需之前解释的复制/粘贴步骤。要使用此令牌进行身份验证，您需要在实例化加载器时将 `auth_with_token` 参数更改为 True。

```python
from langchain_community.document_loaders.onedrive import OneDriveLoader

loader = OneDriveLoader(drive_id="YOUR DRIVE ID", auth_with_token=True)
```

### 🗂️ 文档加载器

#### 📑 从 OneDrive 目录加载文档

`OneDriveLoader` 可以从您 OneDrive 中的特定文件夹加载文档。例如，您想加载存储在 OneDrive 中 `Documents/clients` 文件夹内的所有文档。

```python
from langchain_community.document_loaders.onedrive import OneDriveLoader

loader = OneDriveLoader(drive_id="YOUR DRIVE ID", folder_path="Documents/clients", auth_with_token=True)
documents = loader.load()
```

#### 📑 从文档 ID 列表加载文档

另一种可能性是提供您要加载的每个文档的 `object_id` 列表。为此，您需要查询 [Microsoft Graph API](https://developer.microsoft.com/en-us/graph/graph-explorer) 以找到您感兴趣的所有文档 ID。此[链接](https://learn.microsoft.com/en-us/graph/api/resources/onedrive?view=graph-rest-1.0#commonly-accessed-resources)提供了一个端点列表，这些端点将有助于检索文档 ID。

例如，要检索存储在 Documents 文件夹根目录下的所有对象的信息，您需要向以下地址发出请求：`https://graph.microsoft.com/v1.0/drives/{YOUR DRIVE ID}/root/children`。一旦您有了感兴趣的 ID 列表，就可以使用以下参数实例化加载器。

```python
from langchain_community.document_loaders.onedrive import OneDriveLoader

loader = OneDriveLoader(drive_id="YOUR DRIVE ID", object_ids=["ID_1", "ID_2"], auth_with_token=True)
documents = loader.load()
```

#### 📑 选择支持的文件类型和首选解析器

默认情况下，`OneDriveLoader` 使用默认解析器（见下文）加载在 [`document_loaders/parsers/registry`](https://github.com/langchain-ai/langchain/blob/master/libs/community/langchain_community/document_loaders/parsers/registry.py#L10-L22) 中定义的文件类型。

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

您可以通过向 `OneDriveLoader` 传递 `handlers` 参数来覆盖此行为。
传递一个字典，将文件扩展名（如 `"doc"`、`"pdf"` 等）或 MIME 类型（如 `"application/pdf"`、`"text/plain"` 等）映射到解析器。
请注意，您必须**只**使用文件扩展名或 MIME 类型，不能混合使用。

对于文件扩展名，不要包含前导点。

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

loader = OneDriveLoader(document_library_id="...",
                            handlers=handlers # 将 handlers 传递给 OneDriveLoader
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
