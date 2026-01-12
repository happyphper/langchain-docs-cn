---
title: Zotero
---
[Zotero](https://www.zotero.org/) 是一个开源参考文献管理系统，用于管理书目数据和相关研究材料。您可以通过其 [API](https://www.zotero.org/support/dev/web_api/v3/start) 连接到您的个人图书馆以及共享的群组图书馆。此检索器实现使用 [PyZotero](https://github.com/urschrei/pyzotero) 来访问图书馆。

## 安装

```bash
pip install pyzotero
```

## 检索器

查看 [使用示例](/oss/javascript/integrations/retrievers/zotero)。

```python
from langchain_zotero_retriever.retrievers import ZoteroRetriever
```
