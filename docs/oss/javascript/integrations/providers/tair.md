---
title: Tair
---
>[阿里云 Tair](https://www.alibabacloud.com/help/en/tair/latest/what-is-tair) 是由 `阿里云` 开发的云原生内存数据库服务。
> 它提供丰富的数据模型和企业级能力，以支持您的实时在线场景，同时保持与开源 `Redis` 的完全兼容。
> `Tair` 还引入了基于新型非易失性内存（NVM）存储介质的持久内存优化实例。

## 安装与设置

安装 Tair Python SDK：

::: code-group

```bash [pip]
pip install tair
```

```bash [uv]
uv add tair
```

:::

## 向量存储

```python
from langchain_community.vectorstores import Tair
```

查看[使用示例](/oss/javascript/integrations/vectorstores/tair)。
