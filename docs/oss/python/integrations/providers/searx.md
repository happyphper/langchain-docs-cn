---
title: SearxNG 搜索 API
---
本页介绍如何在 LangChain 中使用 SearxNG 搜索 API。
内容分为两部分：安装与设置，以及 SearxNG API 封装器的具体使用说明。

## 安装与设置

虽然可以结合[公共 Searx 实例](https://searx.space/)使用该封装器，但这些实例通常不允许 API 访问（参见下方关于输出格式的说明），并且对请求频率有限制。建议选择自托管实例。

### 自托管实例：

安装说明请参阅[此页面](https://searxng.github.io/searxng/admin/installation.html)。

安装 SearxNG 时，默认情况下唯一激活的输出格式是 HTML 格式。
要使用 API，您需要激活 `json` 格式。可以通过在 `settings.yml` 文件中添加以下行来实现：

```yaml
search:
    formats:
        - html
        - json
```
您可以通过向 API 端点发送 curl 请求来确认 API 是否正常工作：

`curl -kLX GET --data-urlencode q='langchain' -d format=json http://localhost:8888`

这应该返回一个包含结果的 JSON 对象。

## 封装器

### 实用工具

要使用该封装器，我们需要将 SearxNG 实例的主机地址传递给封装器，可以通过以下两种方式之一：
    1. 在创建实例时使用命名参数 `searx_host`。
    2. 导出环境变量 `SEARXNG_HOST`。

您可以使用该封装器从 SearxNG 实例获取结果。

```python
from langchain_community.utilities import SearxSearchWrapper
s = SearxSearchWrapper(searx_host="http://localhost:8888")
s.run("what is a large language model?")
```

### 工具

您也可以将此封装器作为工具加载（以便与智能体（Agent）一起使用）。

您可以这样做：

```python
from langchain_community.agent_toolkits.load_tools import load_tools
tools = load_tools(["searx-search"],
                    searx_host="http://localhost:8888",
                    engines=["github"])
```

请注意，我们可以*选择性地*传递要使用的自定义搜索引擎。

如果您想获取带有元数据的 *json* 格式结果，可以使用：

```python
tools = load_tools(["searx-search-results-json"],
                    searx_host="http://localhost:8888",
                    num_results=5)
```

#### 快速创建工具

此示例展示了从同一封装器快速创建多个工具的方法。

```python
from langchain_community.tools.searx_search.tool import SearxSearchResults

wrapper = SearxSearchWrapper(searx_host="**")
github_tool = SearxSearchResults(name="GitHub", wrapper=wrapper,
                            kwargs = {
                                "engines": ["github"],
                                })

arxiv_tool = SearxSearchResults(name="Arxiv", wrapper=wrapper,
                            kwargs = {
                                "engines": ["arxiv"]
                                })
```

有关工具的更多信息，请参阅[此页面](/oss/python/integrations/tools)。
