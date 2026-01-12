---
title: Notion 数据库
---
>[Notion](https://www.notion.so/) 是一个支持修改版 Markdown 的协作平台，集成了看板、任务、维基和数据库。它是一个用于笔记记录、知识和数据管理以及项目和任务管理的一体化工作区。

## 安装与设置

所有说明都在下面的示例中。

## 文档加载器

我们有两个不同的加载器：`NotionDirectoryLoader` 和 `NotionDBLoader`。

查看[使用示例](/oss/javascript/integrations/document_loaders/notion)。

```python
from langchain_community.document_loaders import NotionDirectoryLoader, NotionDBLoader
```
