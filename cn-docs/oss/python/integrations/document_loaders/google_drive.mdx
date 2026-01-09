---
title: Google Drive
---
>[Google Drive](https://en.wikipedia.org/wiki/Google_Drive) 是谷歌开发的文件存储和同步服务。

本文档介绍了如何从 `Google Drive` 加载文档。目前仅支持 `Google Docs`。

## 先决条件

1.  创建一个 Google Cloud 项目或使用现有项目。
2.  启用 [Google Drive API](https://console.cloud.google.com/flows/enableapi?apiid=drive.googleapis.com)。
3.  [为桌面应用程序授权凭据](https://developers.google.com/drive/api/quickstart/python#authorize_credentials_for_a_desktop_application)。
4.  `pip install -U google-api-python-client google-auth-httplib2 google-auth-oauthlib`

## 🧑 摄取 Google Docs 数据的指南

将环境变量 `GOOGLE_APPLICATION_CREDENTIALS` 设置为空字符串 (`""`)。

默认情况下，`GoogleDriveLoader` 期望 `credentials.json` 文件位于 `~/.credentials/credentials.json`，但可以使用 `credentials_path` 关键字参数进行配置。`token.json` 同理 - 默认路径：`~/.credentials/token.json`，构造函数参数：`token_path`。

首次使用 `GoogleDriveLoader` 时，浏览器会显示用户认证的同意屏幕。认证后，`token.json` 将在提供的路径或默认路径自动创建。另外，如果该路径下已存在 `token.json`，则不会提示进行认证。

`GoogleDriveLoader` 可以从 Google Docs 文档 ID 列表或文件夹 ID 加载。您可以从 URL 获取文件夹和文档 ID：

*   文件夹：[drive.google.com/drive/u/0/folders/1yucgL9WGgWZdM1TOuKkeghlPizuzMYb5](https://drive.google.com/drive/u/0/folders/1yucgL9WGgWZdM1TOuKkeghlPizuzMYb5) -> 文件夹 ID 是 `"1yucgL9WGgWZdM1TOuKkeghlPizuzMYb5"`
*   文档：[docs.google.com/document/d/1bfaMQ18_i56204VaQDVeAFpqEijJTgvurupdEDiaUQw/edit](https://docs.google.com/document/d/1bfaMQ18_i56204VaQDVeAFpqEijJTgvurupdEDiaUQw/edit) -> 文档 ID 是 `"1bfaMQ18_i56204VaQDVeAFpqEijJTgvurupdEDiaUQw"`

```python
pip install -qU langchain-google-community[drive]
```

```python
from langchain_google_community import GoogleDriveLoader
```

```python
loader = GoogleDriveLoader(
    folder_id="1yucgL9WGgWZdM1TOuKkeghlPizuzMYb5",
    token_path="/path/where/you/want/token/to/be/created/google_token.json",
    # 可选：配置是否从子文件夹递归获取文件。默认为 False。
    recursive=False,
)
```

```python
docs = loader.load()
```

当您传递 `folder_id` 时，默认会加载所有类型为文档、表格和 PDF 的文件。您可以通过传递 `file_types` 参数来修改此行为。

```python
loader = GoogleDriveLoader(
    folder_id="1yucgL9WGgWZdM1TOuKkeghlPizuzMYb5",
    file_types=["document", "sheet"],
    recursive=False,
)
```

## 传入可选的文件加载器

处理 Google Docs 和 Google Sheets 以外的文件时，向 `GoogleDriveLoader` 传递一个可选的文件加载器会很有帮助。如果您传入一个文件加载器，该加载器将用于处理不具有 Google Docs 或 Google Sheets MIME 类型的文档。以下是一个使用文件加载器从 Google Drive 加载 Excel 文档的示例。

```python
from langchain_community.document_loaders import UnstructuredFileIOLoader
from langchain_google_community import GoogleDriveLoader
```

```python
file_id = "1x9WBtFPWMEAdjcJzPScRsjpjQvpSo_kz"
loader = GoogleDriveLoader(
    file_ids=[file_id],
    file_loader_cls=UnstructuredFileIOLoader,
    file_loader_kwargs={"mode": "elements"},
)
```

```python
docs = loader.load()
```

```python
docs[0]
```

您还可以使用以下模式处理包含混合文件和 Google Docs/Sheets 的文件夹：

```python
folder_id = "1asMOHY1BqBS84JcRbOag5LOJac74gpmD"
loader = GoogleDriveLoader(
    folder_id=folder_id,
    file_loader_cls=UnstructuredFileIOLoader,
    file_loader_kwargs={"mode": "elements"},
)
```

```python
docs = loader.load()
```

```python
docs[0]
```

```python
```

## 扩展用法

一个外部（非官方）组件可以管理 Google Drive 的复杂性：`langchain-googledrive`
它与 `langchain_community.document_loaders.GoogleDriveLoader` 兼容，可以替代使用。

为了与容器兼容，认证使用环境变量 `GOOGLE_ACCOUNT_FILE` 来指定凭据文件（用于用户或服务）。

```python
pip install -qU  langchain-googledrive
```

```python
folder_id = "root"
# folder_id='1yucgL9WGgWZdM1TOuKkeghlPizuzMYb5'
```

```python
# 使用高级版本。
from langchain_googledrive.document_loaders import GoogleDriveLoader
```

```python
loader = GoogleDriveLoader(
    folder_id=folder_id,
    recursive=False,
    num_results=2,  # 要加载的最大文件数
)
```

默认情况下，所有具有以下 MIME 类型的文件都可以转换为 `Document`。
* text/text
* text/plain
* text/html
* text/csv
* text/markdown
* image/png
* image/jpeg
* application/epub+zip
* application/pdf
* application/rtf
* application/vnd.google-apps.document (GDoc)
* application/vnd.google-apps.presentation (GSlide)
* application/vnd.google-apps.spreadsheet (GSheet)
* application/vnd.google.colaboratory (Notebook colab)
* application/vnd.openxmlformats-officedocument.presentationml.presentation (PPTX)
* application/vnd.openxmlformats-officedocument.wordprocessingml.document (DOCX)

可以更新或自定义此列表。请参阅 `GDriveLoader` 的文档。

但是，必须安装相应的包。

```python
pip install -qU  unstructured
```

```python
for doc in loader.load():
    print("---")
    print(doc.page_content.strip()[:60] + "...")
```

### 加载授权身份

Google Drive Loader 摄取的每个文件的授权身份可以与每个 Document 的元数据一起加载。

```python
from langchain_google_community import GoogleDriveLoader

loader = GoogleDriveLoader(
    folder_id=folder_id,
    load_auth=True,
    # 可选：配置是否为每个 Document 加载授权身份。
)

doc = loader.load()
```

您可以传递 `load_auth=True`，以将 Google Drive 文档访问身份添加到元数据中。

```python
doc[0].metadata
```

### 加载扩展元数据

还可以在每个 Document 的元数据中获取以下额外字段：

*   `full_path` - 文件在 Google Drive 中的完整路径。
*   `owner` - 文件的所有者。
*   `size` - 文件的大小。

```python
from langchain_google_community import GoogleDriveLoader

loader = GoogleDriveLoader(
    folder_id=folder_id,
    load_extended_matadata=True,
    # 可选：配置是否为每个 Document 加载扩展元数据。
)

doc = loader.load()
```

您可以传递 `load_extended_matadata=True`，以将 Google Drive 文档的扩展详细信息添加到元数据中。

```python
doc[0].metadata
```

### 自定义搜索模式

可以设置所有与 Google [`list()`](https://developers.google.com/drive/api/v3/reference/files/list) API 兼容的参数。

要指定 Google 请求的新模式，您可以使用 `PromptTemplate()`。提示的变量可以通过构造函数中的 `kwargs` 设置。提供了一些预格式化的请求（使用 `{query}`、`{folder_id}` 和/或 `{mime_type}`）：

您可以自定义选择文件的条件。提供了一组预定义的过滤器：

| 模板                               | 描述                                                                 |
| ---------------------------------- | -------------------------------------------------------------------- |
| gdrive-all-in-folder               | 从 `folder_id` 返回所有兼容的文件                                    |
| gdrive-query                       | 在所有驱动器中搜索 `query`                                           |
| gdrive-by-name                     | 按名称 `query` 搜索文件                                              |
| gdrive-query-in-folder             | 在 `folder_id` 中搜索 `query`（如果 `recursive=true` 则包括子文件夹） |
| gdrive-mime-type                   | 搜索特定的 `mime_type`                                               |
| gdrive-mime-type-in-folder         | 在 `folder_id` 中搜索特定的 `mime_type`                              |
| gdrive-query-with-mime-type        | 使用特定的 `mime_type` 搜索 `query`                                  |
| gdrive-query-with-mime-type-and-folder | 使用特定的 `mime_type` 并在 `folder_id` 中搜索 `query`               |

```python
loader = GoogleDriveLoader(
    folder_id=folder_id,
    recursive=False,
    template="gdrive-query",  # 要使用的默认模板
    query="machine learning",
    num_results=2,  # 要加载的最大文件数
    supportsAllDrives=False,  # GDrive `list()` 参数
)
for doc in loader.load():
    print("---")
    print(doc.page_content.strip()[:60] + "...")
```

您可以自定义您的模式。

```python
from langchain_core.prompts.prompt import PromptTemplate

loader = GoogleDriveLoader(
    folder_id=folder_id,
    recursive=False,
    template=PromptTemplate(
        input_variables=["query", "query_name"],
        template="fullText contains '{query}' and name contains '{query_name}' and trashed=false",
    ),  # 要使用的默认模板
    query="machine learning",
    query_name="ML",
    num_results=2,  # 要加载的最大文件数
)
for doc in loader.load():
    print("---")
    print(doc.page_content.strip()[:60] + "...")
```

转换可以处理 Markdown 格式：
*   项目符号
*   链接
*   表格
*   标题

将属性 `return_link` 设置为 `True` 以导出链接。

#### GSlide 和 GSheet 的模式

参数 `mode` 接受不同的值：

*   `"document"`：返回每个文档的正文
*   `"snippets"`：返回每个文件的描述（在 Google Drive 文件的元数据中设置）。

参数 `gslide_mode` 接受不同的值：

*   `"single"`：一个文档，包含 `<PAGE BREAK>`
*   `"slide"`：每个幻灯片一个文档
*   `"elements"`：每个元素一个文档。

```python
loader = GoogleDriveLoader(
    template="gdrive-mime-type",
    mime_type="application/vnd.google-apps.presentation",  # 仅 GSlide 文件
    gslide_mode="slide",
    num_results=2,  # 要加载的最大文件数
)
for doc in loader.load():
    print("---")
    print(doc.page_content.strip()[:60] + "...")
```

参数 `gsheet_mode` 接受不同的值：
*   `"single"`：每行生成一个文档
*   `"elements"`：一个包含 markdown 数组和 `<PAGE BREAK>` 标签的文档。

```python
loader = GoogleDriveLoader(
    template="gdrive-mime-type",
    mime_type="application/vnd.google-apps.spreadsheet",  # 仅 GSheet 文件
    gsheet_mode="elements",
    num_results=2,  # 要加载的最大文件数
)
for doc in loader.load():
    print("---")
    print(doc.page_content.strip()[:60] + "...")
```

### 高级用法

所有 Google 文件在元数据中都有一个“描述”字段。此字段可用于记忆文档的摘要或其他索引标签（参见方法 `lazy_update_description_with_summary()`）。

如果您使用 `mode="snippet"`，则仅描述将用于正文。否则，`metadata['summary']` 包含该字段。

有时，可以使用特定的过滤器从文件名中提取一些信息，以选择具有特定条件的文件。您可以使用过滤器。

有时，会返回许多文档。没有必要同时将所有文档都保存在内存中。您可以使用方法的惰性版本，一次获取一个文档。最好使用复杂的查询来代替递归搜索。对于每个文件夹，如果您激活 `recursive=True`，则必须应用查询。

```python
import os

loader = GoogleDriveLoader(
    gdrive_api_file=os.environ["GOOGLE_ACCOUNT_FILE"],
    num_results=2,
    template="gdrive-query",
    filter=lambda search, file: "#test" not in file.get("description", ""),
    query="machine learning",
    supportsAllDrives=False,
)
for doc in loader.load():
    print("---")
    print(doc.page_content.strip()[:60] + "...")
```
