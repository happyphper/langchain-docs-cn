---
title: Neo4j
---
>[Neo4j](https://neo4j.com/docs/getting-started/) 是由 `Neo4j, Inc.` 开发的图数据库管理系统。

>`Neo4j` 存储的数据元素包括节点、连接节点的边以及节点和边的属性。其开发者将其描述为一个符合 ACID 事务特性、具备原生图存储和处理能力的数据库。`Neo4j` 提供非开源的“社区版”，采用修改版的 GNU 通用公共许可证授权；其在线备份和高可用性扩展功能则采用闭源商业许可证授权。Neo 公司也根据闭源商业条款，提供包含这些扩展功能的 `Neo4j` 授权。

>本笔记本展示了如何使用 LLM 为图数据库提供一个自然语言查询接口，您可以使用 `Cypher` 查询语言进行查询。

>[Cypher](https://en.wikipedia.org/wiki/Cypher_(query_language)) 是一种声明式图查询语言，允许在属性图中进行富有表现力和高效的数据查询。

## 环境设置

您需要有一个正在运行的 `Neo4j` 实例。一种选择是在 [Neo4j Aura 云服务中创建一个免费的 Neo4j 数据库实例](https://neo4j.com/cloud/platform/aura-graph-database/)。您也可以使用 [Neo4j Desktop 应用程序](https://neo4j.com/download/) 在本地运行数据库，或者运行一个 Docker 容器。
您可以通过执行以下脚本来运行一个本地 Docker 容器：

```
docker run \
    --name neo4j \
    -p 7474:7474 -p 7687:7687 \
    -d \
    -e NEO4J_AUTH=neo4j/password \
    -e NEO4J_PLUGINS=\[\"apoc\"\]  \
    neo4j:latest
```

如果您使用 Docker 容器，需要等待几秒钟让数据库启动。

```python
from langchain_neo4j import GraphCypherQAChain, Neo4jGraph
from langchain_openai import ChatOpenAI
```

```python
graph = Neo4jGraph(url="bolt://localhost:7687", username="neo4j", password="password")
```

在本指南中，我们默认使用 OpenAI 模型。

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

## 初始化数据库

假设您的数据库是空的，您可以使用 Cypher 查询语言来填充它。以下 Cypher 语句是幂等的，这意味着无论您运行一次还是多次，数据库信息都将保持一致。

```python
graph.query(
    """
MERGE (m:Movie {name:"Top Gun", runtime: 120})
WITH m
UNWIND ["Tom Cruise", "Val Kilmer", "Anthony Edwards", "Meg Ryan"] AS actor
MERGE (a:Actor {name:actor})
MERGE (a)-[:ACTED_IN]->(m)
"""
)
```

```text
[]
```

## 刷新图模式信息

如果数据库的模式发生变化，您可以刷新生成 Cypher 语句所需的模式信息。

```python
graph.refresh_schema()
```

```python
print(graph.schema)
```

```text
节点属性：
Movie {runtime: INTEGER, name: STRING}
Actor {name: STRING}
关系属性：

关系：
(:Actor)-[:ACTED_IN]->(:Movie)
```

## 增强的模式信息

选择增强模式版本后，系统会自动扫描数据库中的示例值并计算一些分布指标。例如，如果一个节点属性具有少于 10 个不同的值，我们会在模式中返回所有可能的值。否则，每个节点和关系属性仅返回一个示例值。

```python
enhanced_graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    enhanced_schema=True,
)
print(enhanced_graph.schema)
```

```text
节点属性：
- **Movie**
  - `runtime`: INTEGER 最小值: 120, 最大值: 120
  - `name`: STRING 可用选项: ['Top Gun']
- **Actor**
  - `name`: STRING 可用选项: ['Tom Cruise', 'Val Kilmer', 'Anthony Edwards', 'Meg Ryan']
关系属性：

关系：
(:Actor)-[:ACTED_IN]->(:Movie)
```

## 查询图

现在我们可以使用图 Cypher QA 链来向图提问。

```python
chain = GraphCypherQAChain.from_llm(
    ChatOpenAI(temperature=0), graph=graph, verbose=True, allow_dangerous_requests=True
)
```

```python
chain.invoke({"query": "Who played in Top Gun?"})
```

```text
> 进入新的 GraphCypherQAChain 链...
生成的 Cypher：
MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
WHERE m.name = 'Top Gun'
RETURN a.name
完整上下文：
[{'a.name': 'Tom Cruise'}, {'a.name': 'Val Kilmer'}, {'a.name': 'Anthony Edwards'}, {'a.name': 'Meg Ryan'}]

> 链结束。
```

```text
{'query': 'Who played in Top Gun?',
 'result': 'Tom Cruise, Val Kilmer, Anthony Edwards, and Meg Ryan played in Top Gun.'}
```

## 限制结果数量

您可以使用 `top_k` 参数来限制 Cypher QA 链返回的结果数量。
默认值为 10。

```python
chain = GraphCypherQAChain.from_llm(
    ChatOpenAI(temperature=0),
    graph=graph,
    verbose=True,
    top_k=2,
    allow_dangerous_requests=True,
)
```

```python
chain.invoke({"query": "Who played in Top Gun?"})
```

```text
> 进入新的 GraphCypherQAChain 链...
生成的 Cypher：
MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
WHERE m.name = 'Top Gun'
RETURN a.name
完整上下文：
[{'a.name': 'Tom Cruise'}, {'a.name': 'Val Kilmer'}]

> 链结束。
```

```text
{'query': 'Who played in Top Gun?',
 'result': 'Tom Cruise, Val Kilmer played in Top Gun.'}
```

## 返回中间步骤

您可以使用 `return_intermediate_steps` 参数从 Cypher QA 链返回中间步骤。

```python
chain = GraphCypherQAChain.from_llm(
    ChatOpenAI(temperature=0),
    graph=graph,
    verbose=True,
    return_intermediate_steps=True,
    allow_dangerous_requests=True,
)
```

```python
result = chain.invoke({"query": "Who played in Top Gun?"})
print(f"中间步骤： {result['intermediate_steps']}")
print(f"最终答案： {result['result']}")
```

```text
> 进入新的 GraphCypherQAChain 链...
生成的 Cypher：
MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
WHERE m.name = 'Top Gun'
RETURN a.name
完整上下文：
[{'a.name': 'Tom Cruise'}, {'a.name': 'Val Kilmer'}, {'a.name': 'Anthony Edwards'}, {'a.name': 'Meg Ryan'}]

> 链结束。
中间步骤： [{'query': "MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)\nWHERE m.name = 'Top Gun'\nRETURN a.name"}, {'context': [{'a.name': 'Tom Cruise'}, {'a.name': 'Val Kilmer'}, {'a.name': 'Anthony Edwards'}, {'a.name': 'Meg Ryan'}]}]
最终答案： Tom Cruise, Val Kilmer, Anthony Edwards, and Meg Ryan played in Top Gun.
```

## 返回直接结果

您可以使用 `return_direct` 参数从 Cypher QA 链返回直接结果。

```python
chain = GraphCypherQAChain.from_llm(
    ChatOpenAI(temperature=0),
    graph=graph,
    verbose=True,
    return_direct=True,
    allow_dangerous_requests=True,
)
```

```python
chain.invoke({"query": "Who played in Top Gun?"})
```

```text
> 进入新的 GraphCypherQAChain 链...
生成的 Cypher：
MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
WHERE m.name = 'Top Gun'
RETURN a.name

> 链结束。
```

```text
{'query': 'Who played in Top Gun?',
 'result': [{'a.name': 'Tom Cruise'},
  {'a.name': 'Val Kilmer'},
  {'a.name': 'Anthony Edwards'},
  {'a.name': 'Meg Ryan'}]}
```

## 在 Cypher 生成提示中添加示例

您可以定义希望 LLM 针对特定问题生成的 Cypher 语句。

```python
from langchain_core.prompts.prompt import PromptTemplate

CYPHER_GENERATION_TEMPLATE = """任务：生成用于查询图数据库的 Cypher 语句。
指令：
仅使用模式中提供的关系类型和属性。
不要使用任何未提供的关系类型或属性。
模式：
{schema}
注意：不要在回答中包含任何解释或道歉。
不要回答任何要求您执行除构造 Cypher 语句之外的其他操作的问题。
除了生成的 Cypher 语句外，不要包含任何其他文本。
示例：以下是一些针对特定问题生成的 Cypher 语句示例：
# 有多少人出演了《壮志凌云》？
MATCH (m:Movie {{name:"Top Gun"}})<-[:ACTED_IN]-()
RETURN count(*) AS numberOfActors

问题是：
{question}"""

CYPHER_GENERATION_PROMPT = PromptTemplate(
    input_variables=["schema", "question"], template=CYPHER_GENERATION_TEMPLATE
)

chain = GraphCypherQAChain.from_llm(
    ChatOpenAI(temperature=0),
    graph=graph,
    verbose=True,
    cypher_prompt=CYPHER_GENERATION_PROMPT,
    allow_dangerous_requests=True,
)
```

```python
chain.invoke({"query": "How many people played in Top Gun?"})
```

```text
> 进入新的 GraphCypherQAChain 链...
生成的 Cypher：
MATCH (m:Movie {name:"Top Gun"})<-[:ACTED_IN]-()
RETURN count(*) AS numberOfActors
完整上下文：
[{'numberOfActors': 4}]

> 链结束。
```

```text
{'query': 'How many people played in Top Gun?',
 'result': 'There were 4 actors in Top Gun.'}
```

## 为 Cypher 和答案生成使用不同的 LLM

您可以使用 `cypher_llm` 和 `qa_llm` 参数来定义不同的 LLM。

```python
chain = GraphCypherQAChain.from_llm(
    graph=graph,
    cypher_llm=ChatOpenAI(temperature=0, model="gpt-3.5-turbo"),
    qa_llm=ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k"),
    verbose=True,
    allow_dangerous_requests=True,
)
```

```python
chain.invoke({"query": "Who played in Top Gun?"})
```

```text
> 进入新的 GraphCypherQAChain 链...
生成的 Cypher：
MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
WHERE m.name = 'Top Gun'
RETURN a.name
完整上下文：
[{'a.name': 'Tom Cruise'}, {'a.name': 'Val Kilmer'}, {'a.name': 'Anthony Edwards'}, {'a.name': 'Meg Ryan'}]

> 链结束。
```

```text
{'query': 'Who played in Top Gun?',
 'result': 'Tom Cruise, Val Kilmer, Anthony Edwards, and Meg Ryan played in Top Gun.'}
```

## 忽略指定的节点和关系类型

您可以使用 `include_types` 或 `exclude_types` 在生成 Cypher 语句时忽略图模式的某些部分。

```python
chain = GraphCypherQAChain.from_llm(
    graph=graph,
    cypher_llm=ChatOpenAI(temperature=0, model="gpt-3.5-turbo"),
    qa_llm=ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k"),
    verbose=True,
    exclude_types=["Movie"],
    allow_dangerous_requests=True,
)
```

```python
# 检查图模式
print(chain.graph_schema)
```

```text
节点属性如下：
Actor {name: STRING}
关系属性如下：

关系如下：
```

## 验证生成的 Cypher 语句

您可以使用 `validate_cypher` 参数来验证和纠正生成的 Cypher 语句中的关系方向。

```python
chain = GraphCypherQAChain.from_llm(
    llm=ChatOpenAI(temperature=0, model="gpt-3.5-turbo"),
    graph=graph,
    verbose=True,
    validate_cypher=True,
    allow_dangerous_requests=True,
)
```

```python
chain.invoke({"query": "Who played in Top Gun?"})
```

```text
> 进入新的 GraphCypherQAChain 链...
生成的 Cypher：
MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
WHERE m.name = 'Top Gun'
RETURN a.name
完整上下文：
[{'a.name': 'Tom Cruise'}, {'a.name': 'Val Kilmer'}, {'a.name': 'Anthony Edwards'}, {'a.name': 'Meg Ryan'}]

> 链结束。
```

```text
{'query': 'Who played in Top Gun?',
 'result': 'Tom Cruise, Val Kilmer, Anthony Edwards, and Meg Ryan played in Top Gun.'}
```

## 将数据库结果作为工具/函数输出提供上下文

您可以使用 `use_function_response` 参数将数据库结果的上下文作为工具/函数输出传递给 LLM。这种方法提高了回答的准确性和相关性，因为 LLM 会更严格地遵循提供的上下文。
_您需要使用支持原生函数调用的 LLM 才能使用此功能_。

```python
chain = GraphCypherQAChain.from_llm(
    llm=ChatOpenAI(temperature=0, model="gpt-3.5-turbo"),
    graph=graph,
    verbose=True,
    use_function_response=True,
    allow_dangerous_requests=True,
)
chain.invoke({"query": "Who played in Top Gun?"})
```

```text
> 进入新的 GraphCypherQAChain 链...
生成的 Cypher：
MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
WHERE m.name = 'Top Gun'
RETURN a.name
完整上下文：
[{'a.name': 'Tom Cruise'}, {'a.name': 'Val Kilmer'}, {'a.name': 'Anthony Edwards'}, {'a.name': 'Meg Ryan'}]

> 链结束。
```

```text
{'query': 'Who played in Top Gun?',
 'result': 'The main actors in Top Gun are Tom Cruise, Val Kilmer, Anthony Edwards, and Meg Ryan.'}
```

您可以通过提供 `function_response_system` 来提供自定义系统消息，以指示模型如何生成答案，从而在使用函数响应功能时进行定制。

_请注意，当使用 `use_function_response` 时，`qa_prompt` 将不起作用。_

```python
chain = GraphCypherQAChain.from_llm(
    llm=ChatOpenAI(temperature=0, model="gpt-3.5-turbo"),
    graph=graph,
    verbose=True,
    use_function_response=True,
    function_response_system="Respond as a pirate!",
    allow_dangerous_requests=True,
)
chain.invoke({"query": "Who played in Top Gun?"})
```

```text
> 进入新的 GraphCypherQAChain 链...
生成的 Cypher：
MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
WHERE m.name = 'Top Gun'
RETURN a.name
完整上下文：
[{'a.name': 'Tom Cruise'}, {'a.name': 'Val Kilmer'}, {'a.name': 'Anthony Edwards'}, {'a.name': 'Meg Ryan'}]

> 链结束。
```

```text
{'query': 'Who played in Top Gun?',
 'result': "Arrr matey! In the film Top Gun, ye be seein' Tom Cruise, Val Kilmer, Anthony Edwards, and Meg Ryan sailin' the high seas of the sky! Aye, they be a fine crew of actors, they be!"}
```
