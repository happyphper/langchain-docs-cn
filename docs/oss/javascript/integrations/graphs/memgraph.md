---
title: Memgraph
---
Memgraph 是一款开源图数据库，专为动态分析环境优化，并与 Neo4j 兼容。Memgraph 使用 Cypher 来查询数据库，Cypher 是属性图数据库中最广泛采用、完全规范且开放的查询语言。

本笔记本将向您展示如何[使用自然语言查询 Memgraph](#natural-language-querying) 以及如何从非结构化数据中[构建知识图谱](#constructing-knowledge-graph)。

但首先，请确保[完成所有设置](#setting-up)。

## 设置

要完成本指南，您需要安装 [Docker](https://www.docker.com/get-started/) 和 [Python 3.x](https://www.python.org/)。

要首次快速运行 **Memgraph Platform**（Memgraph 数据库 + MAGE 库 + Memgraph Lab），请执行以下操作：

在 Linux/MacOS 上：

```
curl https://install.memgraph.com | sh
```

在 Windows 上：

```
iwr https://windows.memgraph.com | iex
```

这两个命令都会运行一个脚本，该脚本会将一个 Docker Compose 文件下载到您的系统，并在两个独立的容器中构建并启动 `memgraph-mage` 和 `memgraph-lab` Docker 服务。现在您已经启动并运行了 Memgraph！有关安装过程的更多信息，请参阅 [Memgraph 文档](https://memgraph.com/docs/getting-started/install-memgraph)。

要使用 LangChain，请安装并导入所有必要的包。我们将使用包管理器 [pip](https://pip.pypa.io/en/stable/installation/) 以及 `--user` 标志，以确保正确的权限。如果您安装了 Python 3.4 或更高版本，默认会包含 `pip`。您可以使用以下命令安装所有必需的包：

```
pip install langchain langchain-openai langchain-memgraph --user
```

您可以在本笔记本中运行提供的代码块，也可以使用单独的 Python 文件来试验 Memgraph 和 LangChain。

## 自然语言查询

Memgraph 与 LangChain 的集成包括自然语言查询功能。要使用它，首先需要进行所有必要的导入。我们将在代码中遇到它们时进行讨论。

首先，实例化 `MemgraphGraph`。此对象持有与正在运行的 Memgraph 实例的连接。请确保正确设置所有环境变量。

```python
import os

from langchain_core.prompts import PromptTemplate
from langchain_memgraph.chains.graph_qa import MemgraphQAChain
from langchain_memgraph.graphs.memgraph import MemgraphLangChain
from langchain_openai import ChatOpenAI

url = os.environ.get("MEMGRAPH_URI", "bolt://localhost:7687")
username = os.environ.get("MEMGRAPH_USERNAME", "")
password = os.environ.get("MEMGRAPH_PASSWORD", "")

graph = MemgraphLangChain(
    url=url, username=username, password=password, refresh_schema=False
)
```

`refresh_schema` 最初设置为 `False`，因为数据库中还没有数据，我们希望避免不必要的数据库调用。

### 填充数据库

要填充数据库，首先确保它是空的。最有效的方法是切换到内存分析存储模式，删除图，然后返回到内存事务模式。了解更多关于 Memgraph 的[存储模式](https://memgraph.com/docs/fundamentals/storage-memory-usage#storage-modes)。

我们将添加到数据库中的数据是关于不同平台上可用的、与发行商相关的各种类型的视频游戏。

```python
# 删除图
graph.query("STORAGE MODE IN_MEMORY_ANALYTICAL")
graph.query("DROP GRAPH")
graph.query("STORAGE MODE IN_MEMORY_TRANSACTIONAL")

# 创建并执行种子查询
query = """
    MERGE (g:Game {name: "Baldur's Gate 3"})
    WITH g, ["PlayStation 5", "Mac OS", "Windows", "Xbox Series X/S"] AS platforms,
            ["Adventure", "Role-Playing Game", "Strategy"] AS genres
    FOREACH (platform IN platforms |
        MERGE (p:Platform {name: platform})
        MERGE (g)-[:AVAILABLE_ON]->(p)
    )
    FOREACH (genre IN genres |
        MERGE (gn:Genre {name: genre})
        MERGE (g)-[:HAS_GENRE]->(gn)
    )
    MERGE (p:Publisher {name: "Larian Studios"})
    MERGE (g)-[:PUBLISHED_BY]->(p);
"""

graph.query(query)
```

```text
[]
```

请注意 `graph` 对象持有 `query` 方法。该方法在 Memgraph 中执行查询，`MemgraphQAChain` 也使用它来查询数据库。

### 刷新图模式

由于在 Memgraph 中创建了新数据，因此有必要刷新模式。生成的模式将被 `MemgraphQAChain` 用来指导 LLM 更好地生成 Cypher 查询。

```python
graph.refresh_schema()
```

要熟悉数据并验证更新后的图模式，可以使用以下语句打印它：

```python
print(graph.get_schema)
```

```text
节点标签和属性（名称和类型）如下：
- 标签: (:Platform)
  属性:
    - name: string
- 标签: (:Genre)
  属性:
    - name: string
- 标签: (:Game)
  属性:
    - name: string
- 标签: (:Publisher)
  属性:
    - name: string

节点通过以下关系连接：
(:Game)-[:HAS_GENRE]->(:Genre)
(:Game)-[:PUBLISHED_BY]->(:Publisher)
(:Game)-[:AVAILABLE_ON]->(:Platform)
```

### 查询数据库

要与 OpenAI API 交互，您必须将 API 密钥配置为环境变量。这确保了请求的正确授权。您可以在此处找到有关获取 API 密钥的更多信息。要配置 API 密钥，可以使用 Python [os](https://docs.python.org/3/library/os.html) 包：

```
os.environ["OPENAI_API_KEY"] = "your-key-here"
```

如果您在 Jupyter notebook 中运行代码，请运行上述代码片段。

接下来，创建 `MemgraphQAChain`，它将用于基于您的图数据进行问答过程。`temperature` 参数设置为零以确保可预测且一致的答案。您可以将 `verbose` 参数设置为 `True` 以接收有关查询生成的更详细消息。

```python
chain = MemgraphQAChain.from_llm(
    ChatOpenAI(temperature=0),
    graph=graph,
    model_name="gpt-4-turbo",
    allow_dangerous_requests=True,
)
```

现在您可以开始提问了！

```python
response = chain.invoke("Which platforms is Baldur's Gate 3 available on?")
print(response["result"])
```

```text
MATCH (:Game{name: "Baldur's Gate 3"})-[:AVAILABLE_ON]->(platform:Platform)
RETURN platform.name
Baldur's Gate 3 可在 PlayStation 5、Mac OS、Windows 和 Xbox Series X/S 上使用。
```

```python
response = chain.invoke("Is Baldur's Gate 3 available on Windows?")
print(response["result"])
```

```text
MATCH (:Game{name: "Baldur's Gate 3"})-[:AVAILABLE_ON]->(:Platform{name: "Windows"})
RETURN "Yes"
是的，Baldur's Gate 3 可在 Windows 上使用。
```

### 链修饰符

要修改链的行为并获取更多上下文或附加信息，可以修改链的参数。

#### 返回直接查询结果

`return_direct` 修饰符指定是返回执行的 Cypher 查询的直接结果，还是返回处理后的自然语言响应。

```python
# 返回直接查询图的结果
chain = MemgraphQAChain.from_llm(
    ChatOpenAI(temperature=0),
    graph=graph,
    return_direct=True,
    allow_dangerous_requests=True,
    model_name="gpt-4-turbo",
)

response = chain.invoke("Which studio published Baldur's Gate 3?")
print(response["result"])
```

```text
MATCH (g:Game {name: "Baldur's Gate 3"})-[:PUBLISHED_BY]->(p:Publisher)
RETURN p.name
[{'p.name': 'Larian Studios'}]
```

#### 返回查询中间步骤

`return_intermediate_steps` 链修饰符通过包含查询的中间步骤以及初始查询结果来增强返回的响应。

```python
# 返回查询执行的所有中间步骤
chain = MemgraphQAChain.from_llm(
    ChatOpenAI(temperature=0),
    graph=graph,
    allow_dangerous_requests=True,
    return_intermediate_steps=True,
    model_name="gpt-4-turbo",
)

response = chain.invoke("Is Baldur's Gate 3 an Adventure game?")
print(f"Intermediate steps: {response['intermediate_steps']}")
print(f"Final response: {response['result']}")
```

```text
MATCH (:Game {name: "Baldur's Gate 3"})-[:HAS_GENRE]->(:Genre {name: "Adventure"})
RETURN "Yes"
Intermediate steps: [{'query': 'MATCH (:Game {name: "Baldur\'s Gate 3"})-[:HAS_GENRE]->(:Genre {name: "Adventure"})\nRETURN "Yes"'}, {'context': [{'"Yes"': 'Yes'}]}]
Final response: 是的。
```

#### 限制查询结果数量

当您想要限制查询结果的最大数量时，可以使用 `top_k` 修饰符。

```python
# 限制查询返回的最大结果数
chain = MemgraphQAChain.from_llm(
    ChatOpenAI(temperature=0),
    graph=graph,
    top_k=2,
    allow_dangerous_requests=True,
    model_name="gpt-4-turbo",
)

response = chain.invoke("What genres are associated with Baldur's Gate 3?")
print(response["result"])
```

```text
MATCH (:Game {name: "Baldur's Gate 3"})-[:HAS_GENRE]->(g:Genre)
RETURN g.name;
冒险, 角色扮演游戏
```

### 高级查询

随着解决方案复杂性的增长，您可能会遇到需要仔细处理的不同用例。确保应用程序的可扩展性对于维持流畅的用户流程至关重要。

让我们再次实例化我们的链，并尝试提出一些用户可能提出的问题。

```python
chain = MemgraphQAChain.from_llm(
    ChatOpenAI(temperature=0),
    graph=graph,
    model_name="gpt-4-turbo",
    allow_dangerous_requests=True,
)

response = chain.invoke("Is Baldur's Gate 3 available on PS5?")
print(response["result"])
```

```text
MATCH (:Game{name: "Baldur's Gate 3"})-[:AVAILABLE_ON]->(:Platform{name: "PS5"})
RETURN "Yes"
我不知道答案。
```

生成的 Cypher 查询看起来没问题，但我们没有收到任何信息响应。这说明了使用 LLM 时的一个常见挑战——用户表述查询的方式与数据存储方式之间的不匹配。在这种情况下，用户认知与实际数据存储之间的差异可能导致不匹配。提示词优化是解决此问题的有效方法，它通过优化模型的提示词来更好地理解这些差异。通过提示词优化，模型能够更熟练地生成精确且相关的查询，从而成功检索到所需数据。

#### 提示词优化

为了解决这个问题，我们可以调整 QA 链的初始 Cypher 提示词。这包括指导 LLM 用户如何引用特定平台，例如我们案例中的 PS5。我们使用 LangChain 的 PromptTemplate 来实现这一点，创建一个修改后的初始提示词。然后将这个修改后的提示词作为参数提供给我们优化后的 `MemgraphQAChain` 实例。

```python
MEMGRAPH_GENERATION_TEMPLATE = """您的任务是将自然语言查询直接翻译为 Memgraph 数据库的精确且可执行的 Cypher 查询。
您将利用提供的数据库模式来理解 Memgraph 数据库中的结构、节点和关系。
说明：
- 使用模式中提供的节点和关系标签以及属性名称，这些描述了数据库的结构。收到用户问题后，综合模式信息来构建一个精确的 Cypher 查询，该查询直接对应于用户的意图。
- 在 Memgraph 数据库上生成有效的可执行 Cypher 查询。任何不属于 Cypher 查询语法的解释、上下文或附加信息都应完全省略。
- 使用 Memgraph MAGE 过程，而不是 Neo4j APOC 过程。
- 不要在响应中包含任何解释或道歉。
- 除了生成的 Cypher 语句外，不要包含任何文本。
- 对于询问直接生成 Cypher 查询之外的信息或功能的查询，请使用 Cypher 查询格式来传达限制或能力。例如：RETURN "我仅被设计为根据提供的模式生成 Cypher 查询。"
模式：
{schema}

根据以上所有信息和说明，为用户问题生成 Cypher 查询。
如果用户询问 PS5、Play Station 5 或 PS 5，那指的是名为 PlayStation 5 的平台。

问题是：
{question}"""

MEMGRAPH_GENERATION_PROMPT = PromptTemplate(
    input_variables=["schema", "question"], template=MEMGRAPH_GENERATION_TEMPLATE
)

chain = MemgraphQAChain.from_llm(
    ChatOpenAI(temperature=0),
    cypher_prompt=MEMGRAPH_GENERATION_PROMPT,
    graph=graph,
    model_name="gpt-4-turbo",
    allow_dangerous_requests=True,
)

response = chain.invoke("Is Baldur's Gate 3 available on PS5?")
print(response["result"])
```

```text
MATCH (:Game{name: "Baldur's Gate 3"})-[:AVAILABLE_ON]->(:Platform{name: "PlayStation 5"})
RETURN "Yes"
是的，Baldur's Gate 3 可在 PS5 上使用。
```

现在，通过包含平台命名指导的修订版初始 Cypher 提示词，我们获得了更准确、更相关的结果，这些结果更符合用户的查询。

这种方法允许您进一步改进 QA 链。您可以轻松地将额外的提示词优化数据集成到您的链中，从而提升应用程序的整体用户体验。

## 构建知识图谱

将非结构化数据转换为结构化数据并非易事。本指南将展示如何利用 LLM 来帮助我们完成此任务，以及如何在 Memgraph 中构建知识图谱。创建知识图谱后，您可以将其用于 GraphRAG 应用程序。

从文本构建知识图谱的步骤是：

- [从文本中提取结构化信息](#extracting-structured-information-from-text)：使用 LLM 从文本中提取结构化的图信息，形式为节点和关系。
- [存储到 Memgraph](#storing-into-memgraph)：将提取的结构化图信息存储到 Memgraph 中。

### 从文本中提取结构化信息

除了[设置部分](#setting-up)中的所有导入外，导入 `LLMGraphTransformer` 和 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link"><code>Document</code></a>，它们将用于从文本中提取结构化信息。

```python
from langchain_core.documents import Document
from langchain_experimental.graph_transformers import LLMGraphTransformer
```

下面是一个关于查尔斯·达尔文的示例文本（[来源](https://en.wikipedia.org/wiki/Charles_Darwin)），将从中构建知识图谱。

```python
text = """
    Charles Robert Darwin was an English naturalist, geologist, and biologist,
    widely known for his contributions to evolutionary biology. His proposition that
    all species of life have descended from a common ancestor is now generally
    accepted and considered a fundamental scientific concept. In a joint
    publication with Alfred Russel Wallace, he introduced his scientific theory that
    this branching pattern of evolution resulted from a process he called natural
    selection, in which the struggle for existence has a similar effect to the
    artificial selection involved in selective breeding. Darwin has been
    described as one of the most influential figures in human history and was
    honoured by burial in Westminster Abbey.
"""
```

下一步是从所需的 LLM 初始化 `LLMGraphTransformer`，并将文档转换为图结构。

```python
llm = ChatOpenAI(temperature=0, model_name="gpt-4-turbo")
llm_transformer = LLMGraphTransformer(llm=llm)
documents = [Document(page_content=text)]
graph_documents = llm_transformer.convert_to_graph_documents(documents)
```

在底层，LLM 从文本中提取重要实体，并将它们作为节点和关系列表返回。如下所示：

```python
print(graph_documents)
```

```text
[GraphDocument(nodes=[Node(id='Charles Robert Darwin', type='Person', properties={}), Node(id='English', type='Nationality', properties={}), Node(id='Naturalist', type='Profession', properties={}), Node(id='Geologist', type='Profession', properties={}), Node(id='Biologist', type='Profession', properties={}), Node(id='Evolutionary Biology', type='Field', properties={}), Node(id='Common Ancestor', type='Concept', properties={}), Node(id='Scientific Concept', type='Concept', properties={}), Node(id='Alfred Russel Wallace', type='Person', properties={}), Node(id='Natural Selection', type='Concept', properties={}), Node(id='Selective Breeding', type='Concept', properties={}), Node(id='Westminster Abbey', type='Location', properties={})], relationships=[Relationship(source=Node(id='Charles Robert Darwin', type='Person', properties={}), target=Node(id='English', type='Nationality', properties={}), type='NATIONALITY', properties={}), Relationship(source=Node(id='Charles Robert Darwin', type='Person', properties={}), target=Node(id='Naturalist', type='Profession', properties={}), type='PROFESSION', properties={}), Relationship(source=Node(id='Charles Robert Darwin', type='Person', properties={}), target=Node(id='Geologist', type='Profession', properties={}), type='PROFESSION', properties={}), Relationship(source=Node(id='Charles Robert Darwin', type='Person', properties={}), target=Node(id='Biologist', type='Profession', properties={}), type='PROFESSION', properties={}), Relationship(source=Node(id='Charles Robert Darwin', type='Person', properties={}), target=Node(id='Evolutionary Biology', type='Field', properties={}), type='CONTRIBUTION', properties={}), Relationship(source=Node(id='Common Ancestor', type='Concept', properties={}), target=Node(id='Scientific Concept', type='Concept', properties={}), type='BASIS', properties={}), Relationship(source=Node(id='Charles Robert Darwin', type='Person', properties={}), target=Node(id='Alfred Russel Wallace', type='Person', properties={}), type='COLLABORATION', properties={}), Relationship(source=Node(id='Natural Selection', type='Concept', properties={}), target=Node(id='Selective Breeding', type='Concept', properties={}), type='COMPARISON',
