---
title: Cassandra 数据库工具包
---
>`Apache Cassandra®` 是一个广泛用于存储事务型应用数据的数据库。大语言模型中函数和工具的出现，为生成式 AI 应用程序中利用现有数据开辟了一些激动人心的用例。

`Cassandra Database` 工具包使 AI 工程师能够高效地将智能体与 Cassandra 数据集成，提供以下功能：

- 通过优化的查询实现快速数据访问。大多数查询应在个位数毫秒或更短时间内运行。
- 模式自省以增强 LLM 的推理能力
- 兼容各种 Cassandra 部署，包括 Apache Cassandra®、DataStax Enterprise™ 和 DataStax Astra™
- 目前，该工具包仅限于 SELECT 查询和模式自省操作。（安全第一）

有关创建 Cassandra DB 智能体的更多信息，请参阅 [CQL 智能体教程](https://github.com/langchain-ai/langchain/blob/v0.3/cookbook/cql_agent.ipynb)。

## 快速开始

- 安装 `cassio` 库
- 设置要连接的 Cassandra 数据库的环境变量
- 初始化 `CassandraDatabase`
- 使用 `toolkit.get_tools()` 将工具传递给您的智能体
- 坐下来，看它为您完成所有工作

## 操作原理

`Cassandra 查询语言 (CQL)` 是与 Cassandra 数据库交互的主要*面向人类*的方式。虽然在生成查询时提供了一定的灵活性，但它需要了解 Cassandra 数据建模的最佳实践。LLM 函数调用赋予智能体推理并选择工具来满足请求的能力。使用 LLM 的智能体在选择适当的工具包或工具包链时，应使用 Cassandra 特定的逻辑进行推理。这减少了当 LLM 被迫提供自上而下的解决方案时引入的随机性。您希望 LLM 拥有完全不受限制的数据库访问权限吗？是的，可能不希望。为了实现这一点，我们提供了一个在构建智能体问题时使用的提示词：

你是一个 Apache Cassandra 专家查询分析机器人，具有以下功能和规则：

- 你将接收最终用户关于在数据库中查找特定数据的问题。
- 你将检查数据库的模式并创建一个查询路径。
- 你将向用户提供正确的查询以找到他们正在寻找的数据，展示查询路径提供的步骤。
- 你将使用最佳实践来查询 Apache Cassandra，利用分区键和聚类列。
- 避免在查询中使用 ALLOW FILTERING。
- 目标是找到一个查询路径，因此可能需要查询其他表才能得到最终答案。

以下是一个 JSON 格式的查询路径示例：

```json
 {
  "query_paths": [
    {
      "description": "Direct query to users table using email",
      "steps": [
        {
          "table": "user_credentials",
          "query":
             "SELECT userid FROM user_credentials WHERE email = 'example@example.com';"
        },
        {
          "table": "users",
          "query": "SELECT * FROM users WHERE userid = ?;"
        }
      ]
    }
  ]
}
```

## 提供的工具

### `cassandra_db_schema`

收集连接数据库或特定模式的所有模式信息。对于智能体确定操作至关重要。

### `cassandra_db_select_table_data`

从特定的键空间和表中选择数据。智能体可以传递谓词参数和返回记录数量的限制。

### `cassandra_db_query`

`cassandra_db_select_table_data` 的实验性替代方案，它接受由智能体完全形成的查询字符串，而不是参数。*警告*：这可能导致不寻常的查询，性能可能不佳（甚至无法工作）。此功能可能在未来的版本中移除。如果它做出了什么很酷的事情，我们也想知道。谁知道呢！

## 环境设置

安装以下 Python 模块：

```bash
pip install ipykernel python-dotenv cassio langchain-openai langchain langchain-community langchainhub
```

### .env 文件

通过 `cassio` 使用 `auto=True` 参数进行连接，并且笔记本使用 OpenAI。您应相应地创建一个 `.env` 文件。

对于 Cassandra，设置：

```bash
CASSANDRA_CONTACT_POINTS
CASSANDRA_USERNAME
CASSANDRA_PASSWORD
CASSANDRA_KEYSPACE
```

对于 Astra，设置：

```bash
ASTRA_DB_APPLICATION_TOKEN
ASTRA_DB_DATABASE_ID
ASTRA_DB_KEYSPACE
```

例如：

```bash
# Connection to Astra:
ASTRA_DB_DATABASE_ID=a1b2c3d4-...
ASTRA_DB_APPLICATION_TOKEN=AstraCS:...
ASTRA_DB_KEYSPACE=notebooks

# Also set
OPENAI_API_KEY=sk-....
```

（您也可以修改下面的代码以直接使用 `cassio` 连接。）

```python
from dotenv import load_dotenv

load_dotenv(override=True)
```

```python
# Import necessary libraries
import os

import cassio
from langchain_classic import hub
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_community.agent_toolkits.cassandra_database.toolkit import (
    CassandraDatabaseToolkit,
)
from langchain_community.tools.cassandra_database.prompt import QUERY_PATH_PROMPT
from langchain_community.utilities.cassandra_database import CassandraDatabase
from langchain_openai import ChatOpenAI
```

## 连接到 Cassandra 数据库

```python
cassio.init(auto=True)
session = cassio.config.resolve_session()
if not session:
    raise Exception(
        "Check environment configuration or manually configure cassio connection parameters"
    )
```

```python
# Test data pep

session = cassio.config.resolve_session()

session.execute("""DROP KEYSPACE IF EXISTS langchain_agent_test; """)

session.execute(
    """
CREATE KEYSPACE if not exists langchain_agent_test
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
"""
)

session.execute(
    """
    CREATE TABLE IF NOT EXISTS langchain_agent_test.user_credentials (
    user_email text PRIMARY KEY,
    user_id UUID,
    password TEXT
);
"""
)

session.execute(
    """
    CREATE TABLE IF NOT EXISTS langchain_agent_test.users (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT
);"""
)

session.execute(
    """
    CREATE TABLE IF NOT EXISTS langchain_agent_test.user_videos (
    user_id UUID,
    video_id UUID,
    title TEXT,
    description TEXT,
    PRIMARY KEY (user_id, video_id)
);
"""
)

user_id = "522b1fe2-2e36-4cef-a667-cd4237d08b89"
video_id = "27066014-bad7-9f58-5a30-f63fe03718f6"

session.execute(
    f"""
    INSERT INTO langchain_agent_test.user_credentials (user_id, user_email)
    VALUES ({user_id}, 'patrick@datastax.com');
"""
)

session.execute(
    f"""
    INSERT INTO langchain_agent_test.users (id, name, email)
    VALUES ({user_id}, 'Patrick McFadin', 'patrick@datastax.com');
"""
)

session.execute(
    f"""
    INSERT INTO langchain_agent_test.user_videos (user_id, video_id, title)
    VALUES ({user_id}, {video_id}, 'Use Langflow to Build a LangChain LLM Application in 5 Minutes');
"""
)

session.set_keyspace("langchain_agent_test")
```

```python
# Create a CassandraDatabase instance
# Uses the cassio session to connect to the database
db = CassandraDatabase()
```

```python
# Choose the LLM that will drive the agent
# Only certain models support this
llm = ChatOpenAI(temperature=0, model="gpt-4-1106-preview")
toolkit = CassandraDatabaseToolkit(db=db)

tools = toolkit.get_tools()

print("Available tools:")
for tool in tools:
    print(tool.name + "\t- " + tool.description)
```

```text
Available tools:
cassandra_db_schema -
    Input to this tool is a keyspace name, output is a table description
    of Apache Cassandra tables.
    If the query is not correct, an error message will be returned.
    If an error is returned, report back to the user that the keyspace
    doesn't exist and stop.

cassandra_db_query -
    Execute a CQL query against the database and get back the result.
    If the query is not correct, an error message will be returned.
    If an error is returned, rewrite the query, check the query, and try again.

cassandra_db_select_table_data -
    Tool for getting data from a table in an Apache Cassandra database.
    Use the WHERE clause to specify the predicate for the query that uses the
    primary key. A blank predicate will return all rows. Avoid this if possible.
    Use the limit to specify the number of rows to return. A blank limit will
    return all rows.
```

```python
prompt = hub.pull("hwchase17/openai-tools-agent")

# Construct the OpenAI Tools agent
agent = create_openai_tools_agent(llm, tools, prompt)
```

```python
input = (
    QUERY_PATH_PROMPT
    + "\n\nHere is your task: Find all the videos that the user with the email address 'patrick@datastax.com' has uploaded to the langchain_agent_test keyspace."
)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

response = agent_executor.invoke({"input": input})

print(response["output"])
```

```text
> Entering new AgentExecutor chain...

Invoking: `cassandra_db_schema` with `{'keyspace': 'langchain_agent_test'}`

Table Name: user_credentials
- Keyspace: langchain_agent_test
- Columns
  - password (text)
  - user_email (text)
  - user_id (uuid)
- Partition Keys: (user_email)
- Clustering Keys:

Table Name: user_videos
- Keyspace: langchain_agent_test
- Columns
  - description (text)
  - title (text)
  - user_id (uuid)
  - video_id (uuid)
- Partition Keys: (user_id)
- Clustering Keys: (video_id asc)

Table Name: users
- Keyspace: langchain_agent_test
- Columns
  - email (text)
  - id (uuid)
  - name (text)
- Partition Keys: (id)
- Clustering Keys:

Invoking: `cassandra_db_select_table_data` with `{'keyspace': 'langchain_agent_test', 'table': 'user_credentials', 'predicate': "user_email = 'patrick@datastax.com'", 'limit': 1}`

Row(user_email='patrick@datastax.com', password=None, user_id=UUID('522b1fe2-2e36-4cef-a667-cd4237d08b89'))
Invoking: `cassandra_db_select_table_data` with `{'keyspace': 'langchain_agent_test', 'table': 'user_videos', 'predicate': 'user_id = 522b1fe2-2e36-4cef-a667-cd4237d08b89', 'limit': 10}`

Row(user_id=UUID('522b1fe2-2e36-4cef-a667-cd4237d08b89'), video_id=UUID('27066014-bad7-9f58-5a30-f63fe03718f6'), description='DataStax Academy is a free resource for learning Apache Cassandra.', title='DataStax Academy')To find all the videos that the user with the email address 'patrick@datastax.com' has uploaded to the `langchain_agent_test` keyspace, we can follow these steps:

1. Query the `user_credentials` table to find the `user_id` associated with the email 'patrick@datastax.com'.
2. Use the `user_id` obtained from the first step to query the `user_videos` table to retrieve all the videos uploaded by the user.

Here is the query path in JSON format:

\`\`\`json
{
  "query_paths": [
    {
      "description": "Find user_id from user_credentials and then query user_videos for all videos uploaded by the user",
      "steps": [
        {
          "table": "user_credentials",
          "query": "SELECT user_id FROM user_credentials WHERE user_email = 'patrick@datastax.com';"
        },
        {
          "table": "user_videos",
          "query": "SELECT * FROM user_videos WHERE user_id = 522b1fe2-2e36-4cef-a667-cd4237d08b89;"
        }
      ]
    }
  ]
}
\`\`\`

Following this query path, we found that the user with the user_id `522b1fe2-2e36-4cef-a667-cd4237d08b89` has uploaded at least one video with the title 'DataStax Academy' and the description 'DataStax Academy is a free resource for learning Apache Cassandra.' The video_id for this video is `27066014-bad7-9f58-5a30-f63fe03718f6`. If there are more videos, the same query can be used to retrieve them, possibly with an increased limit if necessary.

> Finished chain.
To find all the videos that the user with the email address 'patrick@datastax.com' has uploaded to the `langchain_agent_test` keyspace, we can follow these steps:

1. Query the `user_credentials` table to find the `user_id` associated with the email 'patrick@datastax.com'.
2. Use the `user_id` obtained from the first step to query the `user_videos` table to retrieve all the videos uploaded by the user.

Here is the query path in JSON format:

\`\`\`json
{
  "query_paths": [
    {
      "description": "Find user_id from user_credentials and then query user_videos for all videos uploaded by the user",
      "steps": [
        {
          "table": "user_credentials",
          "query": "SELECT user_id FROM user_credentials WHERE user_email = 'patrick@datastax.com';"
        },
        {
          "table": "user_videos",
          "query": "SELECT * FROM user_videos WHERE user_id = 522b1fe2-2e36-4cef-a667-cd4237d08b89;"
        }
      ]
    }
  ]
}
\`\`\`

Following this query path, we found that the user with the user_id `522b1fe2-2e36-4cef-a667-cd4237d08b89` has uploaded at least one video with the title 'DataStax Academy' and the description 'DataStax Academy is a free resource for learning Apache Cassandra.' The video_id for this video is `27066014-bad7-9f58-5a30-f63fe03718f6`. If there are more videos, the same query can be used to retrieve them, possibly with an increased limit if necessary.
```
