---
title: OpenWeatherMap
---
>[OpenWeatherMap](https://openweathermap.org/api/) 为特定地点提供所有基本天气数据：
>- 当前天气
>- 1 小时的分钟级预报
>- 48 小时的逐小时预报
>- 8 天的每日预报
>- 国家天气警报
>- 超过 40 年的历史天气数据

本页介绍如何在 LangChain 中使用 `OpenWeatherMap API`。

## 安装与设置

- 使用以下命令安装依赖：

::: code-group

```bash [pip]
pip install pyowm
```

```bash [uv]
uv add pyowm
```

:::

- 前往 OpenWeatherMap 注册账户以获取您的 API 密钥 [此处](https://openweathermap.org/api/)
- 将您的 API 密钥设置为 `OPENWEATHERMAP_API_KEY` 环境变量

## 包装器

### 工具类

存在一个封装此 API 的 OpenWeatherMapAPIWrapper 工具类。导入此工具类：

```python
from langchain_community.utilities.openweathermap import OpenWeatherMapAPIWrapper
```

关于此包装器的更详细教程，请参阅 [此笔记本](/oss/integrations/tools/openweathermap)。

### 工具

您也可以轻松地将此包装器作为工具加载（以便与智能体一起使用）。
您可以通过以下方式实现：

```python
import os
from langchain_community.utilities import OpenWeatherMapAPIWrapper

os.environ["OPENWEATHERMAP_API_KEY"] = ""
weather = OpenWeatherMapAPIWrapper()
tools = [weather.run]
```

有关工具的更多信息，请参阅 [此页面](/oss/integrations/tools)。
