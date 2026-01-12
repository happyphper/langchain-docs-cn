---
title: Typesense
---
> [Typesense](https://typesense.org) 是一个开源的内存搜索引擎，你可以选择[自行托管](https://typesense.org/docs/guide/install-typesense.html#option-2-local-machine-self-hosting)或在 [Typesense Cloud](https://cloud.typesense.org/) 上运行。
> `Typesense` 专注于性能，它将整个索引存储在 RAM 中（并在磁盘上备份），同时也专注于提供开箱即用的开发者体验，通过简化可用选项并设置良好的默认值来实现。

## 安装与设置

::: code-group

```bash [pip]
pip install typesense openapi-schema-pydantic
```

```bash [uv]
uv add typesense openapi-schema-pydantic
```

:::

## 向量存储

查看[使用示例](/oss/javascript/integrations/vectorstores/typesense)。

```python
from langchain_community.vectorstores import Typesense
```
