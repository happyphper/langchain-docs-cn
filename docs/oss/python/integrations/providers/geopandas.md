---
title: Geopandas
---
>[GeoPandas](https://geopandas.org/) 是一个开源项目，旨在简化 Python 中地理空间数据的处理。`GeoPandas` 扩展了 `pandas` 使用的数据类型，允许对几何类型进行空间操作。几何操作由 `shapely` 执行。

## 安装与设置

我们需要安装几个 Python 包。

::: code-group

```bash [pip]
pip install -U sodapy pandas geopandas
```

```bash [uv]
uv add sodapy pandas geopandas
```

:::

## 文档加载器

查看[使用示例](/oss/python/integrations/document_loaders/geopandas)。

```python
from langchain_community.document_loaders import OpenCityDataLoader
```
