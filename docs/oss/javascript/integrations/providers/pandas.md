---
title: Pandas
---
>[pandas](https://pandas.pydata.org) 是一个基于 `Python` 编程语言构建的快速、强大、灵活且易于使用的开源数据分析和处理工具。

## 安装与设置

使用 `pip` 安装 `pandas` 包：

::: code-group

```bash [pip]
pip install pandas
```

```bash [uv]
uv add pandas
```

:::

## 文档加载器

查看[使用示例](/oss/integrations/document_loaders/pandas_dataframe)。

```python
from langchain_community.document_loaders import DataFrameLoader
```

## 工具包

查看[使用示例](/oss/integrations/tools/pandas)。

```python
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
```
