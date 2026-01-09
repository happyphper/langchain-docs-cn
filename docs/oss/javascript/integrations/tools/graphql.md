---
title: GraphQL
---
>[GraphQL](https://graphql.org/) 是一种用于 API 的查询语言，也是一个用于针对数据执行这些查询的运行时。`GraphQL` 为 API 中的数据提供了完整且易于理解的描述，赋予客户端精确查询所需数据的能力，使 API 的演进变得更加容易，并支持强大的开发者工具。

通过将 `BaseGraphQLTool` 包含在提供给智能体（Agent）的工具列表中，你可以赋予你的智能体从 GraphQL API 查询数据的能力，以满足你的任何需求。

这个 Jupyter Notebook 演示了如何将 `GraphQLAPIWrapper` 组件与智能体一起使用。

在这个例子中，我们将使用公共的 `Star Wars GraphQL API`，其端点如下：[swapi-graphql.netlify.app/graphql](https://swapi-graphql.netlify.app/graphql)。

首先，你需要安装 `httpx` 和 `gql` Python 包。

```python
pip install httpx gql > /dev/null
```

```python
pip install -qU  langchain-community
```

现在，让我们使用指定的星战 API 端点创建一个 BaseGraphQLTool 实例，并用该工具初始化一个智能体。

```python
import os

os.environ["OPENAI_API_KEY"] = ""
```

```python
from langchain_community.agent_toolkits.load_tools import load_tools

tools = load_tools(
    ["graphql"],
    graphql_endpoint="https://swapi-graphql.netlify.app/graphql",
)
```

```python
from langchain.agents import create_agent

agent = create_agent("gpt-4.1-mini", tools)
```

现在，我们可以使用智能体来对星战 GraphQL API 运行查询。让我们要求智能体列出所有星战电影及其上映日期。

```python
graphql_fields = """allFilms {
    films {
      title
      director
      releaseDate
      speciesConnection {
        species {
          name
          classification
          homeworld {
            name
          }
        }
      }
    }
  }

"""

suffix = "Search for the titles of all the stawars films stored in the graphql database that has this schema "

input_message = {
    "role": "user",
    "content": suffix + graphql_fields,
}

for step in agent.stream(
    {"messages": [input_message]},
    stream_mode="values",
):
    step["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

Search for the titles of all the stawars films stored in the graphql database that has this schema allFilms {
    films {
      title
      director
      releaseDate
      speciesConnection {
        species {
          name
          classification
          homeworld {
            name
          }
        }
      }
    }
  }

================================== Ai Message ==================================
Tool Calls:
  query_graphql (call_tN5A0dBbfOMewuw8Yy13bYpW)
 Call ID: call_tN5A0dBbfOMewuw8Yy13bYpW
  Args:
    tool_input: query { allFilms { films { title } } }
================================= Tool Message =================================
Name: query_graphql

"{\n  \"allFilms\": {\n    \"films\": [\n      {\n        \"title\": \"A New Hope\"\n      },\n      {\n        \"title\": \"The Empire Strikes Back\"\n      },\n      {\n        \"title\": \"Return of the Jedi\"\n      },\n      {\n        \"title\": \"The Phantom Menace\"\n      },\n      {\n        \"title\": \"Attack of the Clones\"\n      },\n      {\n        \"title\": \"Revenge of the Sith\"\n      }\n    ]\n  }\n}"
================================== Ai Message ==================================

数据库中存储的所有《星球大战》电影片名如下：
1. A New Hope
2. The Empire Strikes Back
3. Return of the Jedi
4. The Phantom Menace
5. Attack of the Clones
6. Revenge of the Sith

如果您想了解其中任何电影的更多信息，请告诉我！
```

```python

```
