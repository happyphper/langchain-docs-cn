---
title: 天气
---
>[OpenWeatherMap](https://openweathermap.org/) 是一个开源的天气服务提供商。

## 安装与设置

::: code-group

```bash [pip]
pip install pyowm
```

```bash [uv]
uv add pyowm
```

:::

我们必须设置 `OpenWeatherMap API token`。

## 文档加载器

查看[使用示例](/oss/javascript/integrations/document_loaders/weather)。

```python
from langchain_community.document_loaders import WeatherDataLoader
```
