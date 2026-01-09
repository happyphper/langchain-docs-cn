---
title: 构建一个 SQL 代理
sidebarTitle: SQL agent
---


## 概述

在本教程中，您将学习如何使用 LangChain [智能体（agents）](/oss/langchain/agents)构建一个能够回答关于 SQL 数据库问题的智能体。

从高层次来看，该智能体将执行以下步骤：

<Steps>

<Step title="从数据库中获取可用的表和模式（schemas）" />
<Step title="确定哪些表与问题相关" />
<Step title="获取相关表的模式" />
<Step title="根据问题和模式信息生成查询" />
<Step title="使用 LLM 双重检查查询是否存在常见错误" />
<Step title="执行查询并返回结果" />
<Step title="纠正数据库引擎返回的错误，直到查询成功" />
<Step title="根据结果制定响应" />

</Steps>

<Warning>

构建针对 SQL 数据库的问答系统需要执行模型生成的 SQL 查询。这样做存在固有风险。请确保您的数据库连接权限始终根据智能体的需求尽可能缩小范围。这将减轻（尽管不能消除）构建模型驱动系统的风险。

</Warning>

### 概念

我们将涵盖以下概念：

- 用于从 SQL 数据库读取的[工具（Tools）](/oss/langchain/tools)
- LangChain [智能体（agents）](/oss/langchain/agents)
- [人工介入（Human-in-the-loop）](/oss/langchain/human-in-the-loop)流程

## 设置

### 安装

::: code-group

```bash [pip]
pip install langchain  langgraph  langchain-community
```

:::

    
    

### LangSmith
设置 [LangSmith](https://smith.langchain.com) 以检查您的链或智能体内部发生的情况。然后设置以下环境变量：

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."
```

## 1. 选择 LLM

选择一个支持[工具调用（tool-calling）](/oss/integrations/providers/overview)的模型：

<!--@include: @/snippets/python/chat-model-tabs.md-->

下面示例中显示的输出使用了 OpenAI。

## 2. 配置数据库

您将为本教程创建一个 [SQLite 数据库](https://www.sqlitetutorial.net/sqlite-sample-database/)。SQLite 是一个轻量级数据库，易于设置和使用。我们将加载 `chinook` 数据库，这是一个代表数字媒体商店的示例数据库。

为了方便起见，我们已将数据库 (`Chinook.db`) 托管在一个公共的 GCS 存储桶上。

```python
import requests, pathlib

url = "https://storage.googleapis.com/benchmarks-artifacts/chinook/Chinook.db"
local_path = pathlib.Path("Chinook.db")

if local_path.exists():
    print(f"{local_path} already exists, skipping download.")
else:
    response = requests.get(url)
    if response.status_code == 200:
        local_path.write_bytes(response.content)
        print(f"File downloaded and saved as {local_path}")
    else:
        print(f"Failed to download the file. Status code: {response.status_code}")
```

我们将使用 `langchain_community` 包中一个方便的 SQL 数据库包装器来与数据库交互。该包装器提供了一个简单的接口来执行 SQL 查询和获取结果：

```python
from langchain_community.utilities import SQLDatabase

db = SQLDatabase.from_uri("sqlite:///Chinook.db")

print(f"Dialect: {db.dialect}")
print(f"Available tables: {db.get_usable_table_names()}")
print(f'Sample output: {db.run("SELECT * FROM Artist LIMIT 5;")}')
```
```
Dialect: sqlite
Available tables: ['Album', 'Artist', 'Customer', 'Employee', 'Genre', 'Invoice', 'InvoiceLine', 'MediaType', 'Playlist', 'PlaylistTrack', 'Track']
Sample output: [(1, 'AC/DC'), (2, 'Accept'), (3, 'Aerosmith'), (4, 'Alanis Morissette'), (5, 'Alice In Chains')]
```

## 3. 添加用于数据库交互的工具
使用 `langchain_community` 包中可用的 `SQLDatabase` 包装器来与数据库交互。该包装器提供了一个简单的接口来执行 SQL 查询和获取结果：

```python
from langchain_community.agent_toolkits import SQLDatabaseToolkit

toolkit = SQLDatabaseToolkit(db=db, llm=model)

tools = toolkit.get_tools()

for tool in tools:
    print(f"{tool.name}: {tool.description}\n")
```
```
sql_db_query: 此工具的输入是一个详细且正确的 SQL 查询，输出是数据库的结果。如果查询不正确，将返回错误消息。如果返回错误，请重写查询，检查查询，然后重试。如果遇到“字段列表中的未知列 'xxxx'”问题，请使用 sql_db_schema 查询正确的表字段。

sql_db_schema: 此工具的输入是一个逗号分隔的表名列表，输出是这些表的模式和示例行。请务必先调用 sql_db_list_tables 来确认这些表确实存在！示例输入：table1, table2, table3

sql_db_list_tables: 输入是一个空字符串，输出是数据库中逗号分隔的表名列表。

sql_db_query_checker: 在执行查询之前，使用此工具双重检查您的查询是否正确。在使用 sql_db_query 执行查询之前，请始终使用此工具！
```

## 4. 使用 `create_agent`

使用 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 以最少的代码构建一个 [ReAct 智能体](https://arxiv.org/pdf/2210.03629)。该智能体将解释请求并生成 SQL 命令，然后由工具执行。如果命令有错误，错误消息将返回给模型。然后，模型可以检查原始请求和新的错误消息，并生成一个新的命令。这个过程可以持续进行，直到 LLM 成功生成命令或达到结束计数。这种向模型提供反馈（在本例中是错误消息）的模式非常强大。

使用描述性的系统提示来初始化智能体，以自定义其行为：

```python
system_prompt = """
您是一个设计用于与 SQL 数据库交互的智能体。
给定一个输入问题，创建一个语法正确的 {dialect} 查询来运行，
然后查看查询结果并返回答案。除非用户
指定他们希望获取的具体示例数量，否则始终将您的
查询限制为最多 {top_k} 个结果。

您可以通过相关列对结果进行排序，以返回数据库中
最有趣的示例。永远不要查询特定表的所有列，
只询问给定问题相关的列。

在执行查询之前，您必须双重检查您的查询。如果在执行
查询时遇到错误，请重写查询并重试。

不要对数据库执行任何 DML 语句（INSERT、UPDATE、DELETE、DROP 等）。

开始时，您应该始终查看数据库中的表，以了解可以查询什么。
不要跳过此步骤。

然后，您应该查询最相关表的模式。
""".format(
    dialect=db.dialect,
    top_k=5,
)
```

现在，使用模型、工具和提示创建一个智能体：

```python
from langchain.agents import create_agent

agent = create_agent(
    model,
    tools,
    system_prompt=system_prompt,
)
```

## 5. 运行智能体

在示例查询上运行智能体并观察其行为：

```python
question = "哪个流派的曲目平均长度最长？"

for step in agent.stream(
    {"messages": [{"role": "user", "content": question}]},
    stream_mode="values",
):
    step["messages"][-1].pretty_print()
```

```
================================ Human Message =================================

哪个流派的曲目平均长度最长？
================================== Ai Message ==================================
工具调用：
  sql_db_list_tables (call_BQsWg8P65apHc8BTJ1NPDvnM)
 调用 ID: call_BQsWg8P65apHc8BTJ1NPDvnM
  参数：
================================= Tool Message =================================
名称: sql_db_list_tables

Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, PlaylistTrack, Track
================================== Ai Message ==================================
工具调用：
  sql_db_schema (call_i89tjKECFSeERbuACYm4w0cU)
 调用 ID: call_i89tjKECFSeERbuACYm4w0cU
  参数：
    table_names: Track, Genre
================================= Tool Message =================================
名称: sql_db_schema

CREATE TABLE "Genre" (
	"GenreId" INTEGER NOT NULL,
	"Name" NVARCHAR(120),
	PRIMARY KEY ("GenreId")
)

/*
3 rows from Genre table:
GenreId	Name
1	Rock
2	Jazz
3	Metal
*/

CREATE TABLE "Track" (
	"TrackId" INTEGER NOT NULL,
	"Name" NVARCHAR(200) NOT NULL,
	"AlbumId" INTEGER,
	"MediaTypeId" INTEGER NOT NULL,
	"GenreId" INTEGER,
	"Composer" NVARCHAR(220),
	"Milliseconds" INTEGER NOT NULL,
	"Bytes" INTEGER,
	"UnitPrice" NUMERIC(10, 2) NOT NULL,
	PRIMARY KEY ("TrackId"),
	FOREIGN KEY("MediaTypeId") REFERENCES "MediaType" ("MediaTypeId"),
	FOREIGN KEY("GenreId") REFERENCES "Genre" ("GenreId"),
	FOREIGN KEY("AlbumId") REFERENCES "Album" ("AlbumId")
)

/*
3 rows from Track table:
TrackId	Name	AlbumId	MediaTypeId	GenreId	Composer	Milliseconds	Bytes	UnitPrice
1	For Those About To Rock (We Salute You)	1	1	1	Angus Young, Malcolm Young, Brian Johnson	343719	11170334	0.99
2	Balls to the Wall	2	2	1	U. Dirkschneider, W. Hoffmann, H. Frank, P. Baltes, S. Kaufmann, G. Hoffmann	342562	5510424	0.99
3	Fast As a Shark	3	2	1	F. Baltes, S. Kaufman, U. Dirkscneider & W. Hoffman	230619	3990994	0.99
*/
================================== Ai Message ==================================
工具调用：
  sql_db_query_checker (call_G64yYm6R6UauiVPCXJZMA49b)
 调用 ID: call_G64yYm6R6UauiVPCXJZMA49b
  参数：
    query: SELECT Genre.Name, AVG(Track.Milliseconds) AS AverageLength FROM Track INNER JOIN Genre ON Track.GenreId = Genre.GenreId GROUP BY Genre.Name ORDER BY AverageLength DESC LIMIT 5;
================================= Tool Message =================================
名称: sql_db_query_checker

SELECT Genre.Name, AVG(Track.Milliseconds) AS AverageLength FROM Track INNER JOIN Genre ON Track.GenreId = Genre.GenreId GROUP BY Genre.Name ORDER BY AverageLength DESC LIMIT 5;
================================== Ai Message ==================================
工具调用：
  sql_db_query (call_AnO3SrhD0ODJBxh6dHMwvHwZ)
 调用 ID: call_AnO3SrhD0ODJBxh6dHMwvHwZ
  参数：
    query: SELECT Genre.Name, AVG(Track.Milliseconds) AS AverageLength FROM Track INNER JOIN Genre ON Track.GenreId = Genre.GenreId GROUP BY Genre.Name ORDER BY AverageLength DESC LIMIT 5;
================================= Tool Message =================================
名称: sql_db_query

[('Sci Fi & Fantasy', 2911783.0384615385), ('Science Fiction', 2625549.076923077), ('Drama', 2575283.78125), ('TV Shows', 2145041.0215053763), ('Comedy', 1585263.705882353)]
================================== Ai Message ==================================

平均而言，曲目最长的流派是 "Sci Fi & Fantasy"，平均曲目长度约为 2,911,783 毫秒。其次是 "Science Fiction"、"Drama"、"TV Shows" 和 "Comedy"。
```

智能体正确地编写了查询，检查了查询，并运行它以形成最终响应。

<Note>

您可以在 [LangSmith 追踪记录](https://smith.langchain.com/public/cd2ce887-388a-4bb1-a29d-48208ce50d15/r) 中检查上述运行的各个方面，包括采取的步骤、调用的工具、LLM 看到的提示等。

</Note>

### （可选）使用 Studio

[Studio](/langsmith/studio) 提供了一个“客户端”循环以及记忆功能，因此您可以将其作为聊天界面运行并查询数据库。您可以提出诸如“告诉我数据库的模式”或“显示前 5 位客户的发票”之类的问题。您将看到生成的 SQL 命令以及结果输出。如何开始的详细信息如下。

:::: details 在 Studio 中运行您的智能体

除了前面提到的包之外，您还需要：

```shell
pip install -U langgraph-cli[inmem]>=0.4.0
```

在您将要运行的目录中，您需要一个包含以下内容的 `langgraph.json` 文件：

```json
{
  "dependencies": ["."],
  "graphs": {
      "agent": "./sql_agent.py:agent",
      "graph": "./sql_agent_langgraph.py:graph"
  },
  "env": ".env"
}
```

创建一个文件 `sql_agent.py` 并插入以下内容：

```python
#sql_agent.py for studio
import pathlib

from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_community.utilities import SQLDatabase
import requests

# 初始化 LLM
model = init_chat_model("gpt-4.1")

# 获取数据库，本地存储
url = "https://storage.googleapis.com/benchmarks-artifacts/chinook/Chinook.db"
local_path = pathlib.Path("Chinook.db")

if local_path.exists():
    print(f"{local_path} already exists, skipping download.")
else:
    response = requests.get(url)
    if response.status_code == 200:
        local_path.write_bytes(response.content)
        print(f"File downloaded and saved as {local_path}")
    else:
        print(f"Failed to download the file. Status code: {response.status_code}")

db = SQLDatabase.from_uri("sqlite:///Chinook.db")

# 创建工具
toolkit = SQLDatabaseToolkit(db=db, llm=model)

tools = toolkit.get_tools()

for tool in tools:
    print(f"{tool.name}: {tool.description}\n")

# 使用 create_agent
system_prompt = """
您是一个设计用于与 SQL 数据库交互的智能体。
给定一个输入问题，创建一个语法正确的 {dialect} 查询来运行，
然后查看查询结果并返回答案。除非用户
指定他们希望获取的具体示例数量，否则始终将您的
查询限制为最多 {top_k} 个结果。

您可以通过相关列对结果进行排序，以返回数据库中
最有趣的示例。永远不要查询特定表的所有列，
只询问给定问题相关的列。

在执行查询之前，您必须双重检查您的查询。如果在执行
查询时遇到错误，请重写查询并重试。

不要对数据库执行任何 DML 语句（INSERT、UPDATE、DELETE、DROP 等）。

开始时，您应该始终查看数据库中的表，以了解可以查询什么。
不要跳过此步骤。

然后，您应该查询最相关表的模式。
""".format(
    dialect=db.dialect,
    top_k=5,
)

agent = create_agent(
    model,
    tools,
    system_prompt=system_prompt,
)
```

::::

## 6. 实现人工介入审查

在执行智能体的 SQL 查询之前，检查是否存在任何意外操作或低效之处是审慎的做法。

LangChain 智能体支持内置的[人工介入中间件（human-in-the-loop middleware）](/oss/langchain/human-in-the-loop)，以增加对智能体工具调用的监督。让我们配置智能体，使其在调用 `sql_db_query` 工具时暂停以进行人工审查：

```python
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware # [!
