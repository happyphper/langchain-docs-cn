---
title: Rockset
---
>[Rockset](https://rockset.com/product/) 是一款实时分析数据库服务，用于大规模提供低延迟、高并发的分析查询。它在结构化和半结构化数据上构建了 Converged Index™，并提供了高效的向量嵌入存储。它支持在无模式数据上运行 SQL，这使其成为运行带有元数据过滤器的向量搜索的绝佳选择。

## 安装与设置

请确保您拥有 Rockset 账户，并前往 Web 控制台获取 API 密钥。详细信息可在[官网](https://rockset.com/docs/rest-api/)找到。

::: code-group

```bash [pip]
pip install rockset
```

```bash [uv]
uv add rockset
```

:::

## 向量存储

查看[使用示例](/oss/integrations/vectorstores/rockset)。

```python
from langchain_community.vectorstores import Rockset
```

## 文档加载器

查看[使用示例](/oss/integrations/document_loaders/rockset)。

```python
from langchain_community.document_loaders import RocksetLoader
```
