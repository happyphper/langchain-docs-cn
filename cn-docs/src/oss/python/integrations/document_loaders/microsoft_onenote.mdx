---
title: Microsoft OneNote
---
本笔记本介绍了如何从 `OneNote` 加载文档。

## 先决条件

1.  按照 [Microsoft 身份平台](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) 的说明注册一个应用程序。
2.  注册完成后，Azure 门户会显示应用注册的“概述”窗格。你将看到应用程序（客户端）ID。也称为 `client ID`，此值在 Microsoft 身份平台中唯一标识你的应用程序。
3.  在遵循 **第 1 项** 中的步骤时，你可以将重定向 URI 设置为 `http://localhost:8000/callback`。
4.  在遵循 **第 1 项** 中的步骤时，在“应用程序密码”部分生成一个新密码 (`client_secret`)。
5.  按照此[文档](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-expose-web-apis#add-a-scope)中的说明，将以下 `SCOPES` (`Notes.Read`) 添加到你的应用程序。
6.  你需要使用命令 `pip install msal` 和 `pip install beautifulsoup4` 安装 msal 和 bs4 包。
7.  完成这些步骤后，你必须拥有以下值：

- `CLIENT_ID`
- `CLIENT_SECRET`

## 🧑 从 OneNote 摄取文档的说明

### 🔑 身份验证

默认情况下，`OneNoteLoader` 期望 `CLIENT_ID` 和 `CLIENT_SECRET` 的值必须分别存储为名为 `MS_GRAPH_CLIENT_ID` 和 `MS_GRAPH_CLIENT_SECRET` 的环境变量。你可以通过应用程序根目录下的 `.env` 文件传递这些环境变量，或者在脚本中使用以下命令。

```python
os.environ['MS_GRAPH_CLIENT_ID'] = "YOUR CLIENT ID"
os.environ['MS_GRAPH_CLIENT_SECRET'] = "YOUR CLIENT SECRET"
```

此加载器使用一种称为 [*代表用户*](https://learn.microsoft.com/en-us/graph/auth-v2-user?context=graph%2Fapi%2F1.0&view=graph-rest-1.0) 的身份验证方式。这是一个需要用户同意的两步身份验证。当你实例化加载器时，它会打印一个 URL，用户必须访问该 URL 以同意应用程序所需的权限。然后用户必须访问此 URL 并同意应用程序的请求。接着，用户必须复制结果页面的 URL 并将其粘贴回控制台。如果登录尝试成功，该方法将返回 True。

```python
from langchain_community.document_loaders.onenote import OneNoteLoader

loader = OneNoteLoader(notebook_name="NOTEBOOK NAME", section_name="SECTION NAME", page_title="PAGE TITLE")
```

身份验证完成后，加载器将在 `~/.credentials/` 文件夹中存储一个令牌 (`onenote_graph_token.txt`)。此令牌稍后可用于身份验证，而无需执行前面解释的复制/粘贴步骤。要在实例化加载器时使用此令牌进行身份验证，你需要将 `auth_with_token` 参数更改为 True。

```python
from langchain_community.document_loaders.onenote import OneNoteLoader

loader = OneNoteLoader(notebook_name="NOTEBOOK NAME", section_name="SECTION NAME", page_title="PAGE TITLE", auth_with_token=True)
```

或者，你也可以直接将令牌传递给加载器。当你希望使用由另一个应用程序生成的令牌进行身份验证时，这很有用。例如，你可以使用 [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) 生成一个令牌，然后将其传递给加载器。

```python
from langchain_community.document_loaders.onenote import OneNoteLoader

loader = OneNoteLoader(notebook_name="NOTEBOOK NAME", section_name="SECTION NAME", page_title="PAGE TITLE", access_token="TOKEN")
```

### 🗂️ 文档加载器

#### 📑 从 OneNote 笔记本加载页面

`OneNoteLoader` 可以加载存储在 OneDrive 中的 OneNote 笔记本页面。你可以指定 `notebook_name`、`section_name`、`page_title` 的任意组合，分别筛选特定笔记本下、特定分区下或具有特定标题的页面。例如，你想要加载存储在 OneDrive 中任意笔记本内名为 `Recipes` 的分区下的所有页面。

```python
from langchain_community.document_loaders.onenote import OneNoteLoader

loader = OneNoteLoader(section_name="Recipes", auth_with_token=True)
documents = loader.load()
```

#### 📑 从页面 ID 列表加载页面

另一种可能性是为你想要加载的每个页面提供一个 `object_ids` 列表。为此，你需要查询 [Microsoft Graph API](https://developer.microsoft.com/en-us/graph/graph-explorer) 以找到你感兴趣的所有文档 ID。此[链接](https://learn.microsoft.com/en-us/graph/onenote-get-content#page-collection)提供了一个端点列表，这些端点将有助于检索文档 ID。

例如，要检索存储在笔记本中的所有页面的信息，你需要向以下地址发出请求：`https://graph.microsoft.com/v1.0/me/onenote/pages`。一旦你有了感兴趣的 ID 列表，就可以使用以下参数实例化加载器。

```python
from langchain_community.document_loaders.onenote import OneNoteLoader

loader = OneNoteLoader(object_ids=["ID_1", "ID_2"], auth_with_token=True)
documents = loader.load()
```

```python

```
