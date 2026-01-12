---
title: Figma
---
>[Figma](https://www.figma.com/) 是一个用于界面设计的协作式 Web 应用程序。

## 安装与设置

Figma API 需要一个 `access token`、`node_ids` 和一个 `file key`。

`file key` 可以从 URL 中提取。URL 格式为：https://www.figma.com/file/\{filekey\}/sampleFilename

`Node IDs` 同样可以在 URL 中找到。点击任意元素，在 URL 中查找 '?node-id=\{node_id\}' 参数。

`Access token` 的[获取说明](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)。

## 文档加载器

查看[使用示例](/oss/javascript/integrations/document_loaders/figma)。

```python
from langchain_community.document_loaders import FigmaFileLoader
```
