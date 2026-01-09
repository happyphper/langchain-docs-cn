---
title: Confluence
---
>[Confluence](https://www.atlassian.com/software/confluence) 是一个 Wiki 协作平台，用于保存和组织所有与项目相关的资料。`Confluence` 是一个主要处理内容管理活动的知识库。

## 安装与设置

::: code-group

```bash [pip]
pip install atlassian-python-api
```

```bash [uv]
uv add atlassian-python-api
```

:::

我们需要设置 `username/api_key` 或 `Oauth2 login`。
请参阅[说明](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)。

## 文档加载器

查看[使用示例](/oss/integrations/document_loaders/confluence)。

```python
from langchain_community.document_loaders import ConfluenceLoader
```
