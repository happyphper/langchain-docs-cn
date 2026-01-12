---
title: DataForSEO
---
>[DataForSeo](https://dataforseo.com/) 通过 API 提供全面的 SEO 和数字营销数据解决方案。

本页提供了如何在 LangChain 中使用 DataForSEO 搜索 API 的说明。

## 安装与设置

获取 [DataForSeo API 访问登录名和密码](https://app.dataforseo.com/register)，并将其设置为环境变量（分别为 `DATAFORSEO_LOGIN` 和 `DATAFORSEO_PASSWORD`）。

```python
import os

os.environ["DATAFORSEO_LOGIN"] = "your_login"
os.environ["DATAFORSEO_PASSWORD"] = "your_password"
```

## 工具类

`DataForSEO` 工具类封装了该 API。要导入此工具类，请使用：

```python
from langchain_community.utilities.dataforseo_api_search import DataForSeoAPIWrapper
```

关于此包装器的详细使用说明，请参阅 [此笔记本](/oss/javascript/integrations/tools/dataforseo)。

## 工具

你也可以将此包装器作为工具加载，以便与智能体（Agent）一起使用：

```python
from langchain_community.agent_toolkits.load_tools import load_tools
tools = load_tools(["dataforseo-api-search"])
```

这将加载以下工具：

```python
from langchain_community.tools import DataForSeoAPISearchRun
from langchain_community.tools import DataForSeoAPISearchResults
```

## 使用示例

```python
dataforseo = DataForSeoAPIWrapper(api_login="your_login", api_password="your_password")
result = dataforseo.run("Bill Gates")
print(result)
```
