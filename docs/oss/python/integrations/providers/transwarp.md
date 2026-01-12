---
title: 星环
---
>[Transwarp](https://www.transwarp.cn/en/introduction) 致力于构建企业级大数据与人工智能基础设施软件，以塑造数据世界的未来。它为企业提供围绕数据全生命周期的基础设施软件与服务，涵盖集成、存储、治理、建模、分析、挖掘与流通。

`Transwarp` 专注于技术研发，并在以下方面积累了核心技术：分布式计算、SQL 编译、数据库技术、多模型数据管理的统一、基于容器的云计算，以及大数据分析与智能。

## 安装

您需要安装几个 Python 包：

::: code-group

```bash [pip]
pip install -U tiktoken hippo-api
```

```bash [uv]
uv add tiktoken hippo-api
```

:::

并获取连接配置。

## 向量存储

### Hippo

查看[使用示例和安装说明](/oss/python/integrations/vectorstores/hippo)。

```python
from langchain_community.vectorstores.hippo import Hippo
```
