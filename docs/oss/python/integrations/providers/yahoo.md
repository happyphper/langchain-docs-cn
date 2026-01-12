---
title: 雅虎
---
>[Yahoo (Wikipedia)](https://en.wikipedia.org/wiki/Yahoo) 是一家美国网络服务提供商。
>
> 它提供网络门户、搜索引擎 Yahoo Search 以及相关服务，包括 `My Yahoo`、`Yahoo Mail`、`Yahoo News`、`Yahoo Finance`、`Yahoo Sports` 及其广告平台 `Yahoo Native`。

## 工具

### Yahoo Finance News

我们需要安装一个 Python 包：

::: code-group

```bash [pip]
pip install yfinance
```

```bash [uv]
uv add yfinance
```

:::

查看[使用示例](/oss/python/integrations/tools/yahoo_finance_news)。

```python
from langchain_community.tools import YahooFinanceNewsTool
```
