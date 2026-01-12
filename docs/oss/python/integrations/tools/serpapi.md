---
title: SerpApi
---
本笔记本将介绍如何使用 [SerpApi](https://serpapi.com/) 组件进行网络搜索。

请在此处[注册](https://serpapi.com/users/sign_up) SerpApi 账户，每月可获得 250 次免费搜索。注册后，您可以在[仪表板](https://serpapi.com/manage-api-key)上找到您的 API 密钥。

然后在环境变量文件 `.env` 中设置 `SERPAPI_API_KEY` 为您的 API 密钥。

```python
import os
os.environ["SERPAPI_API_KEY"] = SERPAPI_API_KEY
```

```python
from langchain_community.utilities import SerpAPIWrapper
```

```python
search = SerpAPIWrapper()
```

```python
search.run("Obama's first name?")
```

```text
'Barack Hussein Obama II'
```

## 自定义参数

您还可以使用任意参数自定义 SerpAPI 包装器。例如，在下面的示例中，我们将使用 `bing` 而不是 `google`。

```python
params = {
    "engine": "bing",
    "gl": "us",
    "hl": "en",
}
search = SerpAPIWrapper(params=params)
```

```python
search.run("Obama's first name?")
```

```text
'Barack Hussein Obama II is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American presi…New content will be added above the current area of focus upon selectionBarack Hussein Obama II is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American president of the United States. He previously served as a U.S. senator from Illinois from 2005 to 2008 and as an Illinois state senator from 1997 to 2004, and previously worked as a civil rights lawyer before entering politics.Wikipediabarackobama.com'
```

```python
from langchain.tools import Tool

# 您可以创建工具以传递给代理
custom_tool = Tool(
    name="web search",
    description="Search the web for information",
    func=search.run,
)
```
