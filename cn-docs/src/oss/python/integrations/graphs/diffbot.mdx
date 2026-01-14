---
title: Diffbot
---
>[Diffbot](https://docs.diffbot.com/docs/getting-started-with-diffbot) 是一套基于机器学习的产品，可以轻松地结构化网络数据。

Diffbot 的 [自然语言处理 API](https://www.diffbot.com/products/natural-language/) 允许从非结构化文本数据中提取实体、关系和语义含义。
[![在 Colab 中打开](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/v0.3/docs/docs/integrations/graphs/diffbot.ipynb)

## 使用场景

文本数据通常包含丰富的关系和洞察，可用于各种分析、推荐引擎或知识管理应用。

通过将 `Diffbot 的 NLP API` 与图数据库 `Neo4j` 结合，您可以根据从文本中提取的信息创建强大、动态的图结构。这些图结构完全可查询，并可集成到各种应用中。

这种组合支持以下用例：

* 从文本文档、网站或社交媒体源构建知识图谱（如 [Diffbot 的知识图谱](https://www.diffbot.com/products/knowledge-graph/)）。
* 基于数据中的语义关系生成推荐。
* 创建理解实体间关系的高级搜索功能。
* 构建允许用户探索数据中隐藏关系的分析仪表板。

## 概述

LangChain 提供了与图数据库交互的工具：

1. 使用图转换器和存储集成 `从文本构建知识图谱`
2. 使用链进行查询创建和执行来 `查询图数据库`
3. 使用代理进行稳健且灵活的查询来 `与图数据库交互`

## 设置

首先，获取所需的包并设置环境变量：

```python
pip install -qU  langchain langchain-experimental langchain-openai langchain-neo4j neo4j wikipedia
```

### Diffbot NLP API

`Diffbot 的 NLP API` 是一个用于从非结构化文本数据中提取实体、关系和语义上下文的工具。
提取出的信息可用于构建知识图谱。
要使用该 API，您需要获取一个 [来自 Diffbot 的免费 API 令牌](https://app.diffbot.com/get-started/)。

```python
from langchain_experimental.graph_transformers.diffbot import DiffbotGraphTransformer

diffbot_api_key = "DIFFBOT_KEY"
diffbot_nlp = DiffbotGraphTransformer(diffbot_api_key=diffbot_api_key)
```

这段代码获取关于 "Warren Buffett" 的维基百科文章，然后使用 `DiffbotGraphTransformer` 来提取实体和关系。
`DiffbotGraphTransformer` 输出结构化的数据 `GraphDocument`，可用于填充图数据库。
请注意，由于 Diffbot 的 [每个 API 请求的字符限制](https://docs.diffbot.com/reference/introduction-to-natural-language-api)，应避免文本分块。

```python
from langchain_community.document_loaders import WikipediaLoader

query = "Warren Buffett"
raw_documents = WikipediaLoader(query=query).load()
graph_documents = diffbot_nlp.convert_to_graph_documents(raw_documents)
```

## 将数据加载到知识图谱中

您需要有一个正在运行的 Neo4j 实例。一个选择是在他们的 Aura 云服务中创建一个 [免费的 Neo4j 数据库实例](https://neo4j.com/cloud/platform/aura-graph-database/)。您也可以使用 [Neo4j Desktop 应用程序](https://neo4j.com/download/) 在本地运行数据库，或者运行一个 docker 容器。您可以通过执行以下脚本来运行本地 docker 容器：

```
docker run \
    --name neo4j \
    -p 7474:7474 -p 7687:7687 \
    -d \
    -e NEO4J_AUTH=neo4j/password \
    -e NEO4J_PLUGINS=\[\"apoc\"\]  \
    neo4j:latest
```

如果您使用的是 docker 容器，需要等待几秒钟让数据库启动。

```python
from langchain_neo4j import Neo4jGraph

url = "bolt://localhost:7687"
username = "neo4j"
password = "password"

graph = Neo4jGraph(url=url, username=username, password=password)
```

可以使用 `add_graph_documents` 方法将 `GraphDocuments` 加载到知识图谱中。

```python
graph.add_graph_documents(graph_documents)
```

## 刷新图模式信息

如果数据库的模式发生变化，您可以刷新生成 Cypher 语句所需的模式信息。

```python
graph.refresh_schema()
```

## 查询图

我们现在可以使用图 Cypher QA 链来向图提问。建议使用 **gpt-4** 来构建 Cypher 查询以获得最佳体验。

```python
from langchain_neo4j import GraphCypherQAChain
from langchain_openai import ChatOpenAI

chain = GraphCypherQAChain.from_llm(
    cypher_llm=ChatOpenAI(temperature=0, model_name="gpt-4"),
    qa_llm=ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo"),
    graph=graph,
    verbose=True,
    allow_dangerous_requests=True,
)
```

```python
chain.run("Which university did Warren Buffett attend?")
```

```text
> Entering new GraphCypherQAChain chain...
Generated Cypher:
MATCH (p:Person {name: "Warren Buffett"})-[:EDUCATED_AT]->(o:Organization)
RETURN o.name
Full Context:
[{'o.name': 'New York Institute of Finance'}, {'o.name': 'Alice Deal Junior High School'}, {'o.name': 'Woodrow Wilson High School'}, {'o.name': 'University of Nebraska'}]

> Finished chain.
```

```text
'Warren Buffett attended the University of Nebraska.'
```

```python
chain.run("Who is or was working at Berkshire Hathaway?")
```

```text
> Entering new GraphCypherQAChain chain...
Generated Cypher:
MATCH (p:Person)-[r:EMPLOYEE_OR_MEMBER_OF]->(o:Organization) WHERE o.name = 'Berkshire Hathaway' RETURN p.name
Full Context:
[{'p.name': 'Charlie Munger'}, {'p.name': 'Oliver Chace'}, {'p.name': 'Howard Buffett'}, {'p.name': 'Howard'}, {'p.name': 'Susan Buffett'}, {'p.name': 'Warren Buffett'}]

> Finished chain.
```

```text
'Charlie Munger, Oliver Chace, Howard Buffett, Susan Buffett, and Warren Buffett are or were working at Berkshire Hathaway.'
```

```python

```
