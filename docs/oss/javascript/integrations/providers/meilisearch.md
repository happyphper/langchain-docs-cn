---
title: Meilisearch
---
> [Meilisearch](https://meilisearch.com) 是一个开源、闪电般快速且高度相关的搜索引擎。
> 它提供了出色的默认设置，帮助开发者构建迅捷的搜索体验。
>
> 您可以[自行托管 Meilisearch](https://www.meilisearch.com/docs/learn/getting_started/installation#local-installation)
> 或在 [Meilisearch Cloud](https://www.meilisearch.com/pricing) 上运行。
>
>`Meilisearch v1.3` 支持向量搜索。

## 安装与设置

有关详细配置说明，请参阅[使用示例](/oss/javascript/integrations/vectorstores/meilisearch)。

我们需要安装 `meilisearch` Python 包。

::: code-group

```bash [pip]
pip install meilisearch
```

```bash [uv]
uv add meilisearch
```

:::

## 向量存储

请参阅[使用示例](/oss/javascript/integrations/vectorstores/meilisearch)。

```python
from langchain_community.vectorstores import Meilisearch
```
