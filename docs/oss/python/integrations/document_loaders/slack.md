---
title: Slack
---
>[Slack](https://slack.com/) 是一款即时通讯程序。

本笔记本介绍了如何从 `Slack` 导出生成的 Zip 文件中加载文档。

要获取此 `Slack` 导出文件，请按照以下说明操作：

## 🧑 导入您自己数据集的说明

导出您的 Slack 数据。您可以通过访问工作区管理页面并点击导入/导出选项（\{your_slack_domain\}.slack.com/services/export）来完成此操作。然后，选择正确的日期范围并点击 `开始导出`。导出完成后，Slack 会通过电子邮件和私信通知您。

下载完成后，您的下载文件夹（或根据您的操作系统配置，下载文件所在的任何位置）中会生成一个 `.zip` 文件。

复制该 `.zip` 文件的路径，并将其赋值给下面的 `LOCAL_ZIPFILE`。

```python
from langchain_community.document_loaders import SlackDirectoryLoader
```

```python
# 可选：设置您的 Slack URL。这将为文档源提供正确的 URL。
SLACK_WORKSPACE_URL = "https://xxx.slack.com"
LOCAL_ZIPFILE = ""  # 在此处粘贴您的 Slack zip 文件的本地路径。

loader = SlackDirectoryLoader(LOCAL_ZIPFILE, SLACK_WORKSPACE_URL)
```

```python
docs = loader.load()
docs
```
