---
title: 使用 HTTP 标头进行运行时配置
sidebarTitle: Configurable headers
---
LangGraph 支持运行时配置，以动态调整智能体（agent）的行为和权限。在使用 [LangSmith 部署](/langsmith/deployment-quickstart) 时，你可以在请求体 (`config`) 或特定的请求头中传递此配置。这使得可以根据用户身份或其他请求进行调整。

出于隐私考虑，你可以通过 [`langgraph.json`](/langsmith/application-structure#configuration-file) 文件中的 `http.configurable_headers` 部分来控制哪些请求头会被传递给运行时配置。

以下是如何自定义包含和排除的请求头：

```json
{
  "http": {
    "configurable_headers": {
      "includes": ["x-user-id", "x-organization-id", "my-prefix-*"],
      "excludes": ["authorization", "x-api-key"]
    }
  }
}
```

`includes` 和 `excludes` 列表接受精确的请求头名称，或使用 `*` 来匹配任意数量字符的模式。为了安全起见，不支持其他正则表达式模式。

## 在图（graph）中使用

你可以在图中任何节点的 `config` 参数中访问已包含的请求头。

```python
def my_node(state, config):
  organization_id = config["configurable"].get("x-organization-id")
  ...
```

或者通过从上下文中获取（这在工具或其他嵌套函数中很有用）。

```python
from langgraph.config import get_config

def search_everything(query: str):
  organization_id = get_config()["configurable"].get("x-organization-id")
  ...
```

你甚至可以用它来动态编译图。

```python
# my_graph.py.
import contextlib

@contextlib.asynccontextmanager
async def generate_agent(config):
  organization_id = config["configurable"].get("x-organization-id")
  if organization_id == "org1":
    graph = ...
    yield graph
  else:
    graph = ...
    yield graph
```

```json
{
  "graphs": {"agent": "my_grph.py:generate_agent"}
}
```

### 选择退出可配置请求头

如果你想选择退出可配置请求头，只需在 `excludes` 列表中设置一个通配符模式：

```json
{
  "http": {
    "configurable_headers": {
      "excludes": ["*"]
    }
  }
}
```

这将排除所有请求头被添加到你的运行配置中。

请注意，排除规则优先于包含规则。
