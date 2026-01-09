---
title: Quip
---
>[Quip](https://quip.com) 是一款面向移动端和 Web 端的协作生产力软件套件。它允许多人团队共同创建和编辑文档及电子表格，通常用于商业目的。

这是一个用于加载 `Quip` 文档的加载器。

请参考[此处](https://quip.com/dev/automation/documentation/current#section/Authentication/Get-Access-to-Quip's-APIs)了解如何获取个人访问令牌。

指定一个 `folder_ids` 列表和/或 `thread_ids` 列表，以将相应的文档加载到 Document 对象中。如果两者都指定了，加载器将根据 `folder_ids` 获取属于此文件夹的所有 `thread_ids`，并与传入的 `thread_ids` 结合，返回两者的并集。

* 如何知道 folder_id？
  进入 Quip 文件夹，右键单击文件夹并复制链接，从链接中提取后缀作为 folder_id。提示：`https://example.quip.com/<folder_id>`
* 如何知道 thread_id？
  thread_id 就是文档 ID。进入 Quip 文档，右键单击文档并复制链接，从链接中提取后缀作为 thread_id。提示：`https://exmaple.quip.com/<thread_id>`

您还可以将 `include_all_folders` 设置为 `True`，这将获取 group_folder_ids 和...
您还可以指定一个布尔值 `include_attachments` 来包含附件，默认设置为 False。如果设置为 True，所有附件都将被下载，并且 QuipLoader 将从附件中提取文本并将其添加到 Document 对象中。当前支持的附件类型有：`PDF`、`PNG`、`JPEG/JPG`、`SVG`、`Word` 和 `Excel`。此外，您可以指定一个布尔值 `include_comments` 来包含文档中的评论，默认设置为 False。如果设置为 True，将获取文档中的所有评论，并且 QuipLoader 会将它们添加到 Document 对象中。

在使用 QuipLoader 之前，请确保已安装最新版本的 quip-api 包：

```python
pip install -qU  quip-api
```

## 示例

### 个人访问令牌

```python
from langchain_community.document_loaders.quip import QuipLoader

loader = QuipLoader(
    api_url="https://platform.quip.com", access_token="change_me", request_timeout=60
)
documents = loader.load(
    folder_ids={"123", "456"},
    thread_ids={"abc", "efg"},
    include_attachments=False,
    include_comments=False,
)
```
