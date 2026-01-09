---
title: 评估复杂智能体
sidebarTitle: 评估复杂智能体
---


<Info>

[智能体评估](/langsmith/evaluation-concepts#agents) | [评估器](/langsmith/evaluation-concepts#evaluators) | [LLM 作为裁判的评估器](/langsmith/evaluation-concepts#llm-as-judge)

</Info>

在本教程中，我们将构建一个帮助用户浏览数字音乐商店的客户支持机器人。然后，我们将介绍对聊天机器人运行的三种最有效的评估类型：

* [最终响应](/langsmith/evaluation-concepts#evaluating-an-agents-final-response)：评估智能体的最终响应。
* [轨迹](/langsmith/evaluation-concepts#evaluating-an-agents-trajectory)：评估智能体是否采取了预期的路径（例如工具调用的路径）来得出最终答案。
* [单步执行](/langsmith/evaluation-concepts#evaluating-a-single-step-of-an-agent)：孤立地评估智能体的任何步骤（例如，它是否为给定步骤选择了合适的首个工具）。

我们将使用 [LangGraph](https://github.com/langchain-ai/langgraph) 构建我们的智能体，但这里所展示的技术和 LangSmith 功能是框架无关的。

## 设置

### 配置环境

让我们安装所需的依赖项：

::: code-group

```bash [pip]
pip install -U langgraph "langchain[openai]"
```

```bash [uv]
uv add langgraph "langchain[openai]"
```

:::

让我们为 OpenAI 和 [LangSmith](https://smith.langchain.com) 设置环境变量：

```python
import getpass
import os

def _set_env(var: str) -> None:
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"Set {var}: ")

os.environ["LANGSMITH_TRACING"] = "true"
_set_env("LANGSMITH_API_KEY")
_set_env("OPENAI_API_KEY")
```

### 下载数据库

我们将为本教程创建一个 SQLite 数据库。SQLite 是一个轻量级数据库，易于设置且方便使用。我们将加载 `chinook` 数据库，这是一个代表数字媒体商店的示例数据库。查看有关数据库的更多信息 [请点击这里](https://www.sqlitetutorial.net/sqlite-sample-database/)。

为了方便起见，我们将数据库托管在一个公共的 GCS 存储桶中：

```python
import requests

url = "https://storage.googleapis.com/benchmarks-artifacts/chinook/Chinook.db"
response = requests.get(url)

if response.status_code == 200:
    # 以二进制写入模式打开本地文件
    with open("chinook.db", "wb") as file:
        # 将响应（文件）的内容写入本地文件
        file.write(response.content)
    print("文件已下载并保存为 Chinook.db")
else:
    print(f"下载文件失败。状态码: {response.status_code}")
```

这是数据库中数据的一个样本：

```python
import sqlite3
# ... 数据库连接和查询代码
```

```
[(1, 'AC/DC'), (2, 'Accept'), (3, 'Aerosmith'), (4, 'Alanis Morissette'), (5, 'Alice In Chains'), (6, 'Antônio Carlos Jobim'), (7, 'Apocalyptica'), (8, 'Audioslave'), (9, 'BackBeat'), (10, 'Billy Cobham')]
```

这是数据库模式图（图片来自 [https://github.com/lerocha/chinook-database](https://github.com/lerocha/chinook-database)）：

![Chinook DB](/langsmith/images/chinook-diagram.png)

### 定义客户支持智能体

我们将创建一个 [LangGraph](https://langchain-ai.github.io/langgraph/) 智能体，它具有对我们数据库的有限访问权限。出于演示目的，我们的智能体将支持两种基本类型的请求：

* 查询：客户可以根据其他识别信息查找歌曲标题、艺术家姓名和专辑。例如：“你们有哪些 Jimi Hendrix 的歌曲？”
* 退款：客户可以要求对他们过去的购买进行退款。例如：“我叫 Claude Shannon，我想对上周购买的内容申请退款，你能帮我吗？”

为了简化这个演示，我们将通过删除相应的数据库记录来实现退款。我们将跳过实现用户身份验证和其他生产安全措施。

智能体的逻辑将被结构化为两个独立的子图（一个用于查询，另一个用于退款），并带有一个将请求路由到适当子图的父图。

#### 退款智能体

让我们构建退款处理智能体。这个智能体需要：

1. 在数据库中查找客户的购买记录
2. 删除相关的 Invoice 和 InvoiceLine 记录以处理退款

我们将创建两个 SQL 辅助函数：

1. 一个通过删除记录来执行退款的函数
2. 一个用于查询客户购买历史记录的函数

为了使测试更容易，我们将为这些函数添加一个“模拟（mock）”模式。当启用模拟模式时，这些函数将模拟数据库操作，而不会实际修改任何数据。

```python
import sqlite3

def _refund(invoice_id: int | None, invoice_line_ids: list[int] | None, mock: bool = False) -> float:
    ...

def _lookup( ...
```

现在让我们定义我们的图。我们将使用一个简单的架构与三条主要路径：

1. 从对话中提取客户和购买信息

2. 将请求路由到三条路径之一：

   * 退款路径：如果我们有足够的购买详情（发票 ID 或发票行 ID）来处理退款
   * 查询路径：如果我们有足够的客户信息（姓名和电话）来搜索他们的购买历史记录
   * 响应路径：如果我们需要更多信息，响应用户请求所需的具体细节

图的状态将追踪：

* 对话历史记录（用户和智能体之间的消息）
* 从对话中提取的所有客户和购买信息
* 发送给用户的下一条消息（后续文本）

```python
from typing import Literal
import json

from langchain.chat_models import init_chat_model
from langchain_core.runnables import RunnableConfig
from langgraph.graph import END, StateGraph
from langgraph.graph.message import AnyMessage, add_messages
from langgraph.types import Command, interrupt
from tabulate import tabulate
from typing_extensions import Annotated, TypedDict

# 图状态。
class State(TypedDict):
    """智能体状态。"""
    messages: Annotated[list[AnyMessage], add_messages]
    followup: str | None

    invoice_id: int | None
    invoice_line_ids: list[int] | None
    customer_first_name: str | None
    customer_last_name: str | None
    customer_phone: str | None
    track_name: str | None
    album_title: str | None
    artist_name: str | None
    purchase_date_iso_8601: str | None

# 从对话中提取用户/购买信息的说明。
gather_info_instructions = """您正在管理一家销售歌曲曲目的在线音乐商店。 \
客户一次可以购买多个曲目，这些购买记录在数据库中，每次购买有一个发票（Invoice）， \
每个购买的曲目有一个关联的发票行（Invoice Line）集合。

您的任务是帮助那些想要对购买的一个或多个曲目要求退款的客户。为了能够给他们退款， \
客户必须指定发票 ID 以对单次交易中购买的所有曲目进行退款，或者指定一个或多个发票行 ID \
如果他们想要对单个曲目进行退款。

通常用户不知道他们想要退款的特定发票 ID 或发票行 ID。在这种情况下， \
您可以通过要求他们指定以下内容来帮助他们查找发票：
- 必填：他们的名字、姓氏和电话号码。
- 选填：曲目名称、艺术家姓名、专辑名称或购买日期。

如果客户还没有指定所需信息（发票/发票行 ID 或名字、姓氏、电话）， \
请要求他们指定。"""

# 提取 schema，反映图的状态。
class PurchaseInformation(TypedDict):
    """有关客户希望退款的发票/发票行的所有已知信息。不要编造内容，如果不知道其值，请将字段留空。"""

    invoice_id: int | None
    invoice_line_ids: list[int] | None
    customer_first_name: str | None
    customer_last_name: str | None
    customer_phone: str | None
    track_name: str | None
    album_title: str | None
    artist_name: str | None
    purchase_date_iso_8601: str | None
    followup: Annotated[
        str | None,
        ...,
        "如果用户还没有足够的识别信息，请告诉他们所需信息是什么并要求他们提供。",
    ]

# 用于执行提取的模型。
info_llm = init_chat_model("gpt-4o-mini").with_structured_output(
    PurchaseInformation, method="json_schema", include_raw=True
)

# 用于提取用户信息并路由到 lookup/refund/END 的图节点。
async def gather_info(state: State) -> Command[Literal["lookup", "refund", END]]:
    info = await info_llm.ainvoke(
        [
            {"role": "system", "content": gather_info_instructions},
            *state["messages"],
        ]
    )
    parsed = info["parsed"]
    if any(parsed[k] for k in ("invoice_id", "invoice_line_ids")):
        goto = "refund"
    elif all(
        parsed[k]
        for k in ("customer_first_name", "customer_last_name", "customer_phone")
    ):
        goto = "lookup"
    else:
        goto = END
    update = {"messages": [info["raw"]], **parsed}
    return Command(update=update, goto=goto)

# 用于执行退款的图节点。
# 请注意，这里我们检查运行时配置中的 "env" 变量。
# 如果 "env" 设置为 "test"，那么我们实际上不会从数据库中删除任何行。
# 这在运行评估时将变得非常重要。
def refund(state: State, config: RunnableConfig) -> dict:
    # 是否模拟删除。如果可配置变量 'env' 设置为 'test'，则为 True。
    mock = config.get("configurable", {}).get("env", "prod") == "test"
    refunded = _refund(
        invoice_id=state["invoice_id"], invoice_line_ids=state["invoice_line_ids"], mock=mock
    )
    response = f"您已获得总计：${refunded:.2f} 的退款。还有什么我可以帮您的吗？"
    return {
        "messages": [{"role": "assistant", "content": response}],
        "followup": response,
    }

# 用于查询用户购买记录的图节点
def lookup(state: State) -> dict:
    args = (
        state[k]
        for k in (
            "customer_first_name",
            "customer_last_name",
            "customer_phone",
            "track_name",
            "album_title",
            "artist_name",
            "purchase_date_iso_8601",
        )
    )
    results = _lookup(*args)
    if not results:
        response = "我们没有找到任何与您提供的信息相关的购买记录。您确定填写的所有信息都正确吗？"
        followup = response
    else:
        response = f"您想对以下哪些购买进行退款？\n\n```json{json.dumps(results, indent=2)}\n```"
        followup = f"您想对以下哪些购买进行退款？\n\n{tabulate(results, headers='keys')}"
    return {
        "messages": [{"role": "assistant", "content": response}],
        "followup": followup,
        "invoice_line_ids": [res["invoice_line_id"] for res in results],
    }

# 构建我们的图
graph_builder = StateGraph(State)

graph_builder.add_node(gather_info)
graph_builder.add_node(refund)
graph_builder.add_node(lookup)

graph_builder.set_entry_point("gather_info")
graph_builder.add_edge("lookup", END)
graph_builder.add_edge("refund", END)

refund_graph = graph_builder.compile()
```

我们可以可视化我们的退款图：

```
# 假设您处于交互式 Python 环境中
from IPython.display import Image, display
# ... 绘图代码
```

![Refund graph](/langsmith/images/refund-graph.png)

#### 查询智能体

对于查询（即问答）智能体，我们将使用简单的 ReACT 架构，并向智能体提供用于根据各种过滤器查询曲目名称、艺术家名称和专辑名称的工具。例如，您可以查询特定艺术家的专辑，或者查找发行了具有特定名称歌曲的艺术家等。

```python
from langchain.embeddings import init_embeddings
from langchain.tools import tool
from langchain_core.vectorstores import InMemoryVectorStore
from langchain.agents import create_agent

# 我们的 SQL 查询只有在按数据库中的准确字符串值进行过滤时才会生效。
# 为了确保这一点，我们将提前为所有艺术家、曲目和专辑创建向量存储索引，并使用这些索引来消除用户输入的歧义。
# 例如，如果用户搜索 "prince" 的歌曲，而我们的数据库中将该艺术家记录为 "Prince"，
# 理想情况下，当我们从艺术家向量存储中查询 "prince" 时，我们会得到结果值 "Prince"，然后我们可以在 SQL 查询中使用它。
def index_fields() -> tuple[InMemoryVectorStore, InMemoryVectorStore, InMemoryVectorStore]: ...

track_store, artist_store, album_store = index_fields()

# 智能体工具
@tool
def lookup_track( ...

@tool
def lookup_album( ...

@tool
def lookup_artist( ...

# 智能体模型
qa_llm = init_chat_model("claude-sonnet-4-5-20250929")
# 预置的 ReACT 智能体仅期望 State 具有 'messages' key，
# 因此我们为退款智能体定义的状态也可以传递给我们的查询智能体。
qa_graph = create_agent(qa_llm, tools=[lookup_track, lookup_artist, lookup_album])
```

```
display(Image(qa_graph.get_graph(xray=True).draw_mermaid_png()))
```

![QA Graph](/langsmith/images/qa-graph.png)

#### 父智能体

现在让我们定义一个父智能体，它结合了我们的两个特定任务的智能体。父智能体的唯一职责是路由到其中一个子智能体（通过对用户当前的意图进行分类），并将输出汇总到后续消息中。

```python
# 用于路由用户意图的 Schema。
# 我们将使用结构化输出来强制模型仅返回
# 所需的输出。
class UserIntent(TypedDict):
    """用户在对话中的当前意图"""

    intent: Literal["refund", "question_answering"]

# 具有结构化输出的路由模型
router_llm = init_chat_model("gpt-4o-mini").with_structured_output(
    UserIntent, method="json_schema", strict=True
)

# 路由说明。
route_instructions = """您正在管理一家销售歌曲曲目的在线音乐商店。 \
您可以通过两种方式帮助客户：(1) 回答有关店里销售的曲目的一般性问题，(2) 帮助他们对在店里进行的购买要求退款。

根据以下对话，确定用户当前是在寻求有关歌曲曲目的一般信息，还是在尝试对特定的购买进行退款。

如果是尝试退款，返回 'refund'；如果是询问一般音乐问题，返回 'question_answering'。 \
请勿返回任何其他内容。请勿尝试回复用户。
"""

# 用于路由的节点。
async def intent_classifier(
    state: State,
) -> Command[Literal["refund_agent", "question_answering_agent"]]:
    response = router_llm.invoke(
        [{"role": "system", "content": route_instructions}, *state["messages"]]
    )
    return Command(goto=response["intent"] + "_agent")

# 用于确保在我们的智能体运行完成之前设置 'followup' key 的节点。
def compile_followup(state: State) -> dict:
    """如果尚未明确设置后续内容，则将后续内容设置为最后一条消息。"""
    if not state.get("followup"):
        return {"followup": state["messages"][-1].content}
    return {}

# 智能体定义
graph_builder = StateGraph(State)
graph_builder.add_node(intent_classifier)
# 由于我们所有的子智能体都具有兼容的状态，
# 我们可以直接将它们添加为节点。
graph_builder.add_node("refund_agent", refund_graph)
graph_builder.add_node("question_answering_agent", qa_graph)
graph_builder.add_node(compile_followup)

graph_builder.set_entry_point("intent_classifier")
graph_builder.add_edge("refund_agent", "compile_followup")
graph_builder.add_edge("question_answering_agent", "compile_followup")
graph_builder.add_edge("compile_followup", END)

graph = graph_builder.compile()
```

我们可以可视化包含其所有子图的已编译父图：

```python
display(Image(graph.get_graph().draw_mermaid_png()))
```

![graph](/langsmith/images/agent-tutorial-graph.png)

#### 试用一下

让我们试用一下我们的自定义支持智能体！

```python
state = await graph.ainvoke(
    {"messages": [{"role": "user", "content": "你们有哪些 James Brown 的词曲？"}]}
)
print(state["followup"])
```
```
我在数据库中找到了 20 首 James Brown 的歌曲，全部来自专辑 "Sex Machine"。它们是：...
```

```python
state = await graph.ainvoke({"messages": [
    {
        "role": "user",
        "content": "我叫 Aaron Mitchell，我的电话是 +1 (204) 452-6452。我买了一些 Led Zeppelin 的歌，我想退款。",
    }
]})
print(state["followup"])
```

```
您想对以下哪些购买进行退款？...
```

## 评估

现在我们已经有了一个可测试版本的智能体，让我们运行一些评估。智能体评估可以专注于至少 3 个方面：

* [最终响应](/langsmith/evaluation-concepts#evaluating-an-agents-final-response)：输入是一个提示语和可选的工具列表。输出是智能体的最终响应。
* [轨迹](/langsmith/evaluation-concepts#evaluating-an-agents-trajectory)：同上。输入是一个提示语和可选的工具列表。输出是工具调用的列表。
* [单步执行](/langsmith/evaluation-concepts#evaluating-a-single-step-of-an-agent)：同上。输入是一个提示语和可选的工具列表。输出是工具调用。

让我们运行每种类型的评估：

### 最终响应评估器

首先，让我们创建一个[数据集](/langsmith/evaluation-concepts#datasets)，用于评估智能体的端到端性能。为了简单起见，我们将对最终响应和轨迹评估使用相同的数据集，因此我们将为每个示例问题添加标准答案（ground-truth）响应和轨迹。我们将在下一节中介绍轨迹部分。

```python
from langsmith import Client

client = Client()

# 创建数据集
examples = [
    {
        "inputs": {
            "question": "你们有多少首 James Brown 的歌？",
        },
        "outputs": {
            "response": "我们有 20 首 James Brown 的歌",
            "trajectory": ["question_answering_agent", "lookup_track"]
        }
    },
    {
        "inputs": {
            "question": "我叫 Aaron Mitchell，我想要退款。",
        },
        "outputs": {
            "response": "我需要更多信息来帮助您处理退款。请提供您的电话号码、发票 ID 或您想要退款的项目的行 ID。",
            "trajectory": ["refund_agent"],
        }
    },
    {
        "inputs": {
            "question": "我叫 Aaron Mitchell，我想要对我购买的 Led Zeppelin 进行退款。我的电话是 +1 (204) 452-6452",
        },
        "outputs": {
            "response": '您想对以下哪些购买进行退款？\n\n  invoice_line_id  track_name                        artist_name    purchase_date          quantity_purchased    price_per_unit\n-----------------  --------------------------------  -------------  -------------------  --------------------  ----------------\n              267  How Many More Times               Led Zeppelin   2009-08-06 00:00:00                     1              0.99\n              268  What Is And What Should Never Be  Led Zeppelin   2009-08-06 00:00:00                     1              0.99',
            "trajectory": ["refund_agent", "lookup"],
        },
    },
    {
        "inputs": {
            "question": "是谁录制了 Wish You Were Here？你们还有他们的哪些其他专辑？",
        },
        "outputs": {
            "response": "Wish You Were Here 是 Pink Floyd 的专辑",
            "trajectory": ["question_answering_agent", "lookup_album"],
        },
    },
    {
        "inputs": {
            "question": "我要发票 237 的全额退款",
        },
        "outputs": {
            "response": "您已获得 $0.99 的退款。",
            "trajectory": ["refund_agent", "refund"],
        }
    },
]

dataset_name = "Chinook Customer Service Bot: E2E"

if not client.has_dataset(dataset_name=dataset_name):
    dataset = client.create_dataset(dataset_name=dataset_name)
    client.create_examples(
        dataset_id=dataset.id,
        examples=examples
    )
```

我们将创建一个自定义的 [LLM 作为裁判](/langsmith/evaluation-concepts#llm-as-judge) 的评估器，它使用另一个模型来比较我们智能体对每个示例的输出与参考响应，并判断它们是否等效：

```python
# LLM 作为裁判的指令
grader_instructions = """您是一位批改测试的老师。

您将获得一个问题（QUESTION）、标准答案（GROUND TRUTH RESPONSE）和学生的回答（STUDENT RESPONSE）。

这里是评分标准：
(1) 仅根据相对于标准答案的事实准确性对学生的回答评分。
(2) 确保学生的回答不包含任何相互矛盾的陈述。
(3) 如果学生的回答包含比标准答案更多的信息，只要它相对于标准答案的事实是准确的，这就是可以接受的。

正确性：
True 意味着学生的回答满足所有标准。
False 意味着学生的回答不满足所有标准。

逐步解释您的推理过程，以确保您的推理和结论是正确的。"""

# LLM 作为裁判输出 schema
class Grade(TypedDict):
    """比较预期答案和实际答案，并对实际答案评分。"""
    reasoning: Annotated[str, ..., "解释您对实际响应是否正确的推理。"]
    is_correct: Annotated[bool, ..., "如果学生的回答基本正确或完全正确，则为 True，否则为 False。"]

# 裁判 LLM
grader_llm = init_chat_model("gpt-4o-mini", temperature=0).with_structured_output(Grade, method="json_schema", strict=True)

# 评估器函数
async def final_answer_correct(inputs: dict, outputs: dict, reference_outputs: dict) -> bool:
    """评估最终响应是否与参考响应等效。"""

    # 请注意，我们假设输出中有一个 'response' 字典。我们需要确保
    # 我们定义的目标函数包含此键。
    user = f"""QUESTION: {inputs['question']}
    GROUND TRUTH RESPONSE: {reference_outputs['response']}
    STUDENT RESPONSE: {outputs['response']}"""

    grade = await grader_llm.ainvoke([{"role": "system", "content": grader_instructions}, {"role": "user", "content": user}])
    return grade["is_correct"]
```

现在我们可以运行评估。我们的评估器假设我们的目标函数返回一个 'response' 键，因此让我们定义一个这样做的目标函数。

还请记住，在我们的退款图中，我们将退款节点设为可配置，这样如果我们指定 `config={"env": "test"}`，我们将模拟退款而实际上不更新数据库。我们将在调用图时，在我们的目标 `run_graph` 方法中使用此可配置变量：

```python
# 目标函数
async def run_graph(inputs: dict) -> dict:
    """运行图并追踪其轨迹以及最终响应。"""
    result = await graph.ainvoke({"messages": [
        { "role": "user", "content": inputs['question']},
    ]}, config={"env": "test"})
    return {"response": result["followup"]}

# 评估作业和结果
experiment_results = await client.aevaluate(
    run_graph,
    data=dataset_name,
    evaluators=[final_answer_correct],
    experiment_prefix="sql-agent-gpt4o-e2e",
    num_repetitions=1,
    max_concurrency=4,
)
experiment_results.to_pandas()
```

您可以在此处查看这些结果的外观：[LangSmith 链接](https://smith.langchain.com/public/708d08f4-300e-4c75-9677-c6b71b0d28c9/d)。

### 轨迹评估器

随着智能体变得更加复杂，潜藏的失败点也会增多。与其使用简单的通过/失败评估，不如使用能够给智能体在采取了一些正确步骤时给予部分积分的评估，即使它没有最终得出正确答案。

这就是轨迹评估的切入点。轨迹评估：

1. 将智能体实际执行的步骤序列与预期序列进行比较
2. 根据完成的预期步骤数量计算得分

在本例中，我们的端到端数据集包含我们期望智能体采取的有序步骤列表。让我们创建一个评估器，检查智能体的实际轨迹是否符合这些预期步骤，并计算完成的百分比：

```python
def trajectory_subsequence(outputs: dict, reference_outputs: dict) -> float:
    """检查智能体执行了多少预期的步骤。"""
    if len(reference_outputs['trajectory']) > len(outputs['trajectory']):
        return False

    i = j = 0
    while i < len(reference_outputs['trajectory']) and j < len(outputs['trajectory']):
        if reference_outputs['trajectory'][i] == outputs['trajectory'][j]:
            i += 1
        j += 1

    return i / len(reference_outputs['trajectory'])
```

现在我们可以运行评估。我们的评估器假设我们的目标函数返回一个 'trajectory' 键，因此让我们定义一个这样做的目标函数。我们需要使用 [LangGraph 的流式处理功能](https://langchain-ai.github.io/langgra/langsmith/observability-concepts/streaming/) 来记录轨迹。

请注意，我们重新使用了与最终响应评估相同的数据集，因此我们可以同时运行两个评估器，并定义一个同时返回 "response" 和 "trajectory" 的目标函数。在实践中，为每种评估类型使用单独的数据集通常非常有用，这就是为什么我们在这里分别展示它们的原因：

```python
async def run_graph(inputs: dict) -> dict:
    """运行图并记录其轨迹以及最终响应。"""
    trajectory = []
    # 设置 subgraph=True 以流式处理来自主图子图的事件：https://langchain-ai.github.io/langgraph/how-tos/streaming-subgraphs/
    # 设置 stream_mode="debug" 以流式处理所有可能发生的事件：https://langchain-ai.github.io/langgra/langsmith/observability-concepts/streaming
    async for namespace, chunk in graph.astream({"messages": [
            {
                "role": "user",
                "content": inputs['question'],
            }
        ]}, subgraphs=True, stream_mode="debug"):
        # 进入节点的事件类型
        if chunk['type'] == 'task':
            # 记录节点名称
            trajectory.append(chunk['payload']['name'])
            # 鉴于我们定义数据集的方式，我们还需要持续记录问答 ReACT 智能体调用的特定工具。
            # 当通过查看输入的最后一条消息的 AIMessage.tool_calls 从而由 ToolsNode（名称为 "tools"）被调用时，可以找到这些工具调用。
            if chunk['payload']['name'] == 'tools' and chunk['type'] == 'task':
                for tc in chunk['payload']['input']['messages'][-1].tool_calls:
                    trajectory.append(tc['name'])
    return {"trajectory": trajectory}

experiment_results = await client.aevaluate(
    run_graph,
    data=dataset_name,
    evaluators=[trajectory_subsequence],
    experiment_prefix="sql-agent-gpt4o-trajectory",
    num_repetitions=1,
    max_concurrency=4,
)
experiment_results.to_pandas()
```

您可以在此处查看这些结果的外观：[LangSmith 链接](https://smith.langchain.com/public/708d08f4-300e-4c75-9677-c6b71b0d28c9/d)。

### 单步评估器

虽然端到端测试可以为您提供有关智能体性能的最全面反馈，但是为了调试和迭代智能体，找出困难的特定步骤并直接对其进行评估也会非常有帮助。

在我们的例子中，智能体的一个关键部分是它是否正确地将用户的意图路由到了“退款”路径或“问答”路径。让我们创建一个数据集并运行一些评估，直接对这一个组件进行压力测试。

```python
# 创建数据集
examples = [
    {
        "inputs": {"messages": [{"role": "user", "content": "我最近买了一些曲目，我很不喜欢"}]},
        "outputs": {"route": "refund_agent"},
    },
    {
        "inputs": {"messages": [{"role": "user", "content": "我正打算买一些 Rolling Stones 的曲目，有什么推荐吗？"}]},
        "outputs": {"route": "question_answering_agent"},
    },
    {
        "inputs": {"messages": [{"role": "user", "content": "我想要对订单 237 退款"}, {"role": "assistant", "content": "我已为您总计退款 $1.98。请问今天还有什么可以帮您？"}, {"role": "user", "content": "Prince 在 2000 年发行过专辑吗？"}]},
        "outputs": {"route": "question_answering_agent"},
    },
    {
        "inputs": {"messages": [{"role": "user", "content": "我最近购买了一个 Yesterday 的翻唱版本，但是我不记得是谁唱的了。你们有哪些版本？"}]},
        "outputs": {"route": "question_answering_agent"},
    },
]

dataset_name = "Chinook Customer Service Bot: Intent Classifier"
if not client.has_dataset(dataset_name=dataset_name):
    dataset = client.create_dataset(dataset_name=dataset_name)
    client.create_examples(
        dataset_id=dataset.id,
        examples=examples
    )

# 评估器
def correct(outputs: dict, reference_outputs: dict) -> bool:
    """检查智能体是否选择了正确的路由。"""
    return outputs["route"] == reference_outputs["route"]

# 用于运行相关步骤的目标函数
async def run_intent_classifier(inputs: dict) -> dict:
    # 请注意，我们可以直接访问并运行图中的 intent_classifier 节点。
    command = await graph.nodes['intent_classifier'].ainvoke(inputs)
    return {"route": command.goto}

# 运行评估
experiment_results = await client.aevaluate(
    run_intent_classifier,
    data=dataset_name,
    evaluators=[correct],
    experiment_prefix="sql-agent-gpt4o-intent-classifier",
    max_concurrency=4,
)
```

您可以在此处查看这些结果的外观：[LangSmith 链接](https://smith.langchain.com/public/f133dae2-8a88-43a0-9bfd-ab45bfa3920b/d)。

## 参考代码

这是一份汇总了上述所有代码的完整脚本：

:::: details 参考代码

```python
import json
import sqlite3
from typing import Literal

from langchain.chat_models import init_chat_model
from langchain.embeddings import init_embeddings
from langchain_core.runnables import RunnableConfig
from langchain.tools import tool
from langchain_core.vectorstores import InMemoryVectorStore
from langgraph.graph import END, StateGraph
from langgraph.graph.message import AnyMessage, add_messages
from langchain.agents import create_agent
from langgraph.types import Command, interrupt
from langsmith import Client
import requests
from tabulate import tabulate
from typing_extensions import Annotated, TypedDict

url = "https://storage.googleapis.com/benchmarks-artifacts/chinook/Chinook.db"

response = requests.get(url)

if response.status_code == 200:
    # 以二进制写入模式打开本地文件
    with open("chinook.db", "wb") as file:
        # 将响应（文件）的内容写入本地文件
        file.write(response.content)
    print("文件已下载并保存为 Chinook.db")
else:
    print(f"下载文件失败。状态码: {response.status_code}")

def _refund(
    invoice_id: int | None, invoice_line_ids: list[int] | None, mock: bool = False
) -> float:
    """Given an Invoice ID and/or Invoice Line IDs, delete the relevant Invoice/InvoiceLine records in the Chinook DB.

    Args:
        invoice_id: The Invoice to delete.
        invoice_line_ids: The Invoice Lines to delete.
        mock: 如果为 True，则不实际删除指定的发票/发票行。用于测试目的。

    返回:
        float: 已删除（或模拟删除）的总金额。
    """

    if invoice_id is None and invoice_line_ids is None:
        return 0.0

    # 连接到 Chinook 数据库
    conn = sqlite3.connect("chinook.db")
    cursor = conn.cursor()

    total_refund = 0.0

    try:
        # 如果提供了 invoice_id，则删除整个发票及其行
        if invoice_id is not None:
            # 首先获取发票的总金额
            cursor.execute(
                """
                SELECT Total
                FROM Invoice
                WHERE InvoiceId = ?
            """,
                (invoice_id,),
            )

            result = cursor.fetchone()
            if result:
                total_refund += result[0]

            # 首先删除发票行（由于外键约束）
            if not mock:
                cursor.execute(
                    """
                    DELETE FROM InvoiceLine
                    WHERE InvoiceId = ?
                """,
                    (invoice_id,),
                )

                # 然后删除发票
                cursor.execute(
                    """
                    DELETE FROM Invoice
                    WHERE InvoiceId = ?
                """,
                    (invoice_id,),
                )

        # 如果提供了特定的发票行 ID
        if invoice_line_ids is not None:
            # 获取指定发票行的总金额
            placeholders = ",".join(["?" for _ in invoice_line_ids])
            cursor.execute(
                f"""
                SELECT SUM(UnitPrice * Quantity)
                FROM InvoiceLine
                WHERE InvoiceLineId IN ({placeholders})
            """,
                invoice_line_ids,
            )

            result = cursor.fetchone()
            if result and result[0]:
                total_refund += result[0]

            if not mock:
                # 删除指定的发票行
                cursor.execute(
                    f"""
                    DELETE FROM InvoiceLine
                    WHERE InvoiceLineId IN ({placeholders})
                """,
                    invoice_line_ids,
                )

        # 提交更改
        conn.commit()

    except sqlite3.Error as e:
        # 发生错误时回滚
        conn.rollback()
        raise e

    finally:
        # 关闭连接
        conn.close()

    return float(total_refund)

def _lookup(
    customer_first_name: str,
    customer_last_name: str,
    customer_phone: str,
    track_name: str | None,
    album_title: str | None,
    artist_name: str | None,
    purchase_date_iso_8601: str | None,
) -> list[dict]:
    """在 Chinook 数据库中根据给定过滤器查找所有的发票行（Invoice Line）ID。

    返回:
        字典列表，包含以下键：{
            'invoice_line_id',
            'track_name',
            'artist_name',
            'purchase_date',
            'quantity_purchased',
            'price_per_unit'
        }
    """

    # 连接到数据库
    conn = sqlite3.connect("chinook.db")
    cursor = conn.cursor()

    # 连接所有必要表的基础查询
    query = """
    SELECT
        il.InvoiceLineId,
        t.Name as track_name,
        art.Name as artist_name,
        i.InvoiceDate as purchase_date,
        il.Quantity as quantity_purchased,
        il.UnitPrice as price_per_unit
    FROM InvoiceLine il
    JOIN Invoice i ON il.InvoiceId = i.InvoiceId
    JOIN Customer c ON i.CustomerId = c.CustomerId
    JOIN Track t ON il.TrackId = t.TrackId
    JOIN Album alb ON t.AlbumId = alb.AlbumId
    JOIN Artist art ON alb.ArtistId = art.ArtistId
    WHERE c.FirstName = ?
    AND c.LastName = ?
    AND c.Phone = ?
    """

    # 查询参数
    params = [customer_first_name, customer_last_name, customer_phone]

    # 添加可选过滤器
    if track_name:
        query += " AND t.Name = ?"
        params.append(track_name)

    if album_title:
        query += " AND alb.Title = ?"
        params.append(album_title)

    if artist_name:
        query += " AND art.Name = ?"
        params.append(artist_name)

    if purchase_date_iso_8601:
        query += " AND date(i.InvoiceDate) = date(?)"
        params.append(purchase_date_iso_8601)

    # 执行查询
    cursor.execute(query, params)

    # 获取结果
    results = cursor.fetchall()

    # 将结果转换为字典列表
    output = []
    for row in results:
        output.append(
            {
                "invoice_line_id": row[0],
                "track_name": row[1],
                "artist_name": row[2],
                "purchase_date": row[3],
                "quantity_purchased": row[4],
                "price_per_unit": row[5],
            }
        )

    # 关闭连接
    conn.close()

    return output

# 图状态。
class State(TypedDict):
    """智能体状态。"""

    messages: Annotated[list[AnyMessage], add_messages]
    followup: str | None

    invoice_id: int | None
    invoice_line_ids: list[int] | None
    customer_first_name: str | None
    customer_last_name: str | None
    customer_phone: str | None
    track_name: str | None
    album_title: str | None
    artist_name: str | None
    purchase_date_iso_8601: str | None

# 从对话中提取用户/购买信息的说明。
gather_info_instructions = """您正在管理一家销售歌曲曲目的在线音乐商店。 \
客户一次可以购买多个曲目，这些购买记录在数据库中，每次购买有一个发票（Invoice）， \
每个购买的曲目有一个关联的发票行（Invoice Line）集合。

您的任务是帮助那些想要对购买的一个或多个曲目要求退款的客户。为了能够给他们退款， \
客户必须指定发票 ID 以对单次交易中购买的所有曲目进行退款，或者指定一个或多个发票行 ID \
如果他们想要对单个曲目进行退款。

通常用户不知道他们想要退款的特定发票 ID 或发票行 ID。在这种情况下， \
您可以通过要求他们指定以下内容来帮助他们查找发票：
- 必填：他们的名字、姓氏和电话号码。
- 选填：曲目名称、艺术家姓名、专辑名称或购买日期。

如果客户还没有指定所需信息（发票/发票行 ID 或名字、姓氏、电话）， \
请要求他们指定。"""

# 提取 schema，反映图的状态。
class PurchaseInformation(TypedDict):
    """有关客户希望退款的发票/发票行的所有已知信息。不要编造内容，如果不知道其值，请将字段留空。"""

    invoice_id: int | None
    invoice_line_ids: list[int] | None
    customer_first_name: str | None
    customer_last_name: str | None
    customer_phone: str | None
    track_name: str | None
    album_title: str | None
    artist_name: str | None
    purchase_date_iso_8601: str | None
    followup: Annotated[
        str | None,
        ...,
        "如果用户还没有足够的识别信息，请告诉他们所需信息是什么并要求他们提供。",
    ]

# 用于执行提取的模型。
info_llm = init_chat_model("gpt-4o-mini").with_structured_output(
    PurchaseInformation, method="json_schema", include_raw=True
)

# 用于提取用户信息并路由到 lookup/refund/END 的图节点。
async def gather_info(state: State) -> Command[Literal["lookup", "refund", END]]:
    info = await info_llm.ainvoke(
        [
            {"role": "system", "content": gather_info_instructions},
            *state["messages"],
        ]
    )
    parsed = info["parsed"]
    if any(parsed[k] for k in ("invoice_id", "invoice_line_ids")):
        goto = "refund"
    elif all(
        parsed[k]
        for k in ("customer_first_name", "customer_last_name", "customer_phone")
    ):
        goto = "lookup"
    else:
        goto = END
    update = {"messages": [info["raw"]], **parsed}
    return Command(update=update, goto=goto)

# 用于执行退款的图节点。
# 请注意，这里我们检查运行时配置中的 "env" 变量。
# 如果 "env" 设置为 "test"，那么我们实际上不会从数据库中删除任何行。
# 这在运行评估时将变得非常重要。
def refund(state: State, config: RunnableConfig) -> dict:
    # 是否模拟删除。如果可配置变量 'env' 设置为 'test'，则为 True。
    mock = config.get("configurable", {}).get("env", "prod") == "test"
    refunded = _refund(
        invoice_id=state["invoice_id"],
        invoice_line_ids=state["invoice_line_ids"],
        mock=mock,
    )
    response = f"您已获得总计：${refunded:.2f} 的退款。还有什么我可以帮您的吗？"
    return {
        "messages": [{"role": "assistant", "content": response}],
        "followup": response,
    }

# 用于查询用户购买记录的图节点
def lookup(state: State) -> dict:
    args = (
        state[k]
        for k in (
            "customer_first_name",
            "customer_last_name",
            "customer_phone",
            "track_name",
            "album_title",
            "artist_name",
            "purchase_date_iso_8601",
        )
    )
    results = _lookup(*args)
    if not results:
        response = "我们没有找到任何与您提供的信息相关的购买记录。您确定填写的所有信息都正确吗？"
        followup = response
    else:
        response = f"您想对以下哪些购买进行退款？\n\n```json{json.dumps(results, indent=2)}\n```"
        followup = f"您想对以下哪些购买进行退款？\n\n{tabulate(results, headers='keys')}"
    return {
        "messages": [{"role": "assistant", "content": response}],
        "followup": followup,
        "invoice_line_ids": [res["invoice_line_id"] for res in results],
    }

# 构建我们的图
graph_builder = StateGraph(State)

graph_builder.add_node(gather_info)
graph_builder.add_node(refund)
graph_builder.add_node(lookup)

graph_builder.set_entry_point("gather_info")
graph_builder.add_edge("lookup", END)
graph_builder.add_edge("refund", END)

refund_graph = graph_builder.compile()

# 我们的 SQL 查询只有在按数据库中的准确字符串值进行过滤时才会生效。
# 为了确保这一点，我们将提前为所有艺术家、曲目和专辑创建向量存储索引，并使用这些索引来消除用户输入的歧义。
# 例如，如果用户搜索 "prince" 的歌曲，而我们的数据库中将该艺术家记录为 "Prince"，
# 理想情况下，当我们从艺术家向量存储中查询 "prince" 时，我们会得到结果值 "Prince"，然后我们可以在 SQL 查询中使用它。
def index_fields() -> (
    tuple[InMemoryVectorStore, InMemoryVectorStore, InMemoryVectorStore]
):
    """为所有艺术家、专辑和歌曲创建索引。"""
    try:
        # 连接到 chinook 数据库
        conn = sqlite3.connect("chinook.db")
        cursor = conn.cursor()

        # 获取所有结果
        tracks = cursor.execute("SELECT Name FROM Track").fetchall()
        artists = cursor.execute("SELECT Name FROM Artist").fetchall()
        albums = cursor.execute("SELECT Title FROM Album").fetchall()
    finally:
        # 关闭连接
        if conn:
            conn.close()

    embeddings = init_embeddings("openai:text-embedding-3-small")

    track_store = InMemoryVectorStore(embeddings)
    artist_store = InMemoryVectorStore(embeddings)
    album_store = InMemoryVectorStore(embeddings)

    track_store.add_texts([t[0] for t in tracks])
    artist_store.add_texts([a[0] for a in artists])
    album_store.add_texts([a[0] for a in albums])
    return track_store, artist_store, album_store

track_store, artist_store, album_store = index_fields()

# Agent tools
@tool
def lookup_track(
    track_name: str | None = None,
    album_title: str | None = None,
    artist_name: str | None = None,
) -> list[dict]:
    """在 Chinook 数据库中查找有关该曲目的识别信息。

    返回:
        每个匹配曲目的字典列表，包含键 {'track_name', 'artist_name', 'album_name'}
    """
    conn = sqlite3.connect("chinook.db")
    cursor = conn.cursor()

    query = """
    SELECT DISTINCT t.Name as track_name, ar.Name as artist_name, al.Title as album_name
    FROM Track t
    JOIN Album al ON t.AlbumId = al.AlbumId
    JOIN Artist ar ON al.ArtistId = ar.ArtistId
    WHERE 1=1
    """
    params = []

    if track_name:
        track_name = track_store.similarity_search(track_name, k=1)[0].page_content
        query += " AND t.Name LIKE ?"
        params.append(f"%{track_name}%")
    if album_title:
        album_title = album_store.similarity_search(album_title, k=1)[0].page_content
        query += " AND al.Title LIKE ?"
        params.append(f"%{album_title}%")
    if artist_name:
        artist_name = artist_store.similarity_search(artist_name, k=1)[0].page_content
        query += " AND ar.Name LIKE ?"
        params.append(f"%{artist_name}%")

    cursor.execute(query, params)
    results = cursor.fetchall()

    tracks = [
        {"track_name": row[0], "artist_name": row[1], "album_name": row[2]}
        for row in results
    ]

    conn.close()
    return tracks

@tool
def lookup_album(
    track_name: str | None = None,
    album_title: str | None = None,
    artist_name: str | None = None,
) -> list[dict]:
    """在 Chinook 数据库中查找有关该专辑的识别信息。

    返回:
        每个匹配专辑的字典列表，包含键 {'album_name', 'artist_name'}
    """
    conn = sqlite3.connect("chinook.db")
    cursor = conn.cursor()

    query = """
    SELECT DISTINCT al.Title as album_name, ar.Name as artist_name
    FROM Album al
    JOIN Artist ar ON al.ArtistId = ar.ArtistId
    LEFT JOIN Track t ON t.AlbumId = al.AlbumId
    WHERE 1=1
    """
    params = []

    if track_name:
        query += " AND t.Name LIKE ?"
        params.append(f"%{track_name}%")
    if album_title:
        query += " AND al.Title LIKE ?"
        params.append(f"%{album_title}%")
    if artist_name:
        query += " AND ar.Name LIKE ?"
        params.append(f"%{artist_name}%")

    cursor.execute(query, params)
    results = cursor.fetchall()

    albums = [{"album_name": row[0], "artist_name": row[1]} for row in results]

    conn.close()
    return albums

@tool
def lookup_artist(
    track_name: str | None = None,
    album_title: str | None = None,
    artist_name: str | None = None,
) -> list[str]:
    """在 Chinook 数据库中查找有关该艺术家的识别信息。

    返回:
        匹配的艺术家姓名列表
    """
    conn = sqlite3.connect("chinook.db")
    cursor = conn.cursor()

    query = """
    SELECT DISTINCT ar.Name as artist_name
    FROM Artist ar
    LEFT JOIN Album al ON al.ArtistId = ar.ArtistId
    LEFT JOIN Track t ON t.AlbumId = al.AlbumId
    WHERE 1=1
    """
    params = []

    if track_name:
        query += " AND t.Name LIKE ?"
        params.append(f"%{track_name}%")
    if album_title:
        query += " AND al.Title LIKE ?"
        params.append(f"%{album_title}%")
    if artist_name:
        query += " AND ar.Name LIKE ?"
        params.append(f"%{artist_name}%")

    cursor.execute(query, params)
    results = cursor.fetchall()

    artists = [row[0] for row in results]

    conn.close()
    return artists

# 智能体模型
qa_llm = init_chat_model("claude-sonnet-4-5-20250929")
# 预置的 ReACT 智能体仅期望 State 具有 'messages' key，
# 因此我们为退款智能体定义的状态也可以传递给我们的查询智能体。
qa_graph = create_agent(qa_llm, [lookup_track, lookup_artist, lookup_album])

# 用于路由用户意图的 Schema。
# 我们将使用结构化输出来强制模型仅返回
# 所需的输出。
class UserIntent(TypedDict):
    """用户在对话中的当前意图"""

    intent: Literal["refund", "question_answering"]

# 具有结构化输出的路由模型
router_llm = init_chat_model("gpt-4o-mini").with_structured_output(
    UserIntent, method="json_schema", strict=True
)

# 路由说明。
route_instructions = """您正在管理一家销售歌曲曲目的在线音乐商店。 \
您可以通过两种方式帮助客户：(1) 回答有关店里销售的曲目的一般性问题，(2) 帮助他们对在店里进行的购买要求退款。

根据以下对话，确定用户当前是在寻求有关歌曲曲目的一般信息，还是在尝试对特定的购买进行退款。

如果是尝试退款，返回 'refund'；如果是询问一般音乐问题，返回 'question_answering'。 \
请勿返回任何其他内容。请勿尝试回复用户。
"""

# 用于路由的节点。
async def intent_classifier(
    state: State,
) -> Command[Literal["refund_agent", "question_answering_agent"]]:
    response = router_llm.invoke(
        [{"role": "system", "content": route_instructions}, *state["messages"]]
    )
    return Command(goto=response["intent"] + "_agent")

# 用于确保在我们的智能体运行完成之前设置 'followup' key 的节点。
def compile_followup(state: State) -> dict:
    """如果尚未明确设置后续内容，则将后续内容设置为最后一条消息。"""
    if not state.get("followup"):
        return {"followup": state["messages"][-1].content}
    return {}

# 智能体定义
graph_builder = StateGraph(State)
graph_builder.add_node(intent_classifier)
# 由于我们所有的子智能体都具有兼容的状态，
# 我们可以直接将它们添加为节点。
graph_builder.add_node("refund_agent", refund_graph)
graph_builder.add_node("question_answering_agent", qa_graph)
graph_builder.add_node(compile_followup)

graph_builder.set_entry_point("intent_classifier")
graph_builder.add_edge("refund_agent", "compile_followup")
graph_builder.add_edge("question_answering_agent", "compile_followup")
graph_builder.add_edge("compile_followup", END)

graph = graph_builder.compile()

client = Client()

# 创建数据集
examples = [
    {
        "inputs": {
            "question": "你们有多少首 James Brown 的歌？"
        },
        "outputs": {
            "response": "我们有 20 首 James Brown 的歌",
            "trajectory": ["question_answering_agent", "lookup_tracks"]
        },
    },
    {
        "inputs": {
            "question": "我叫 Aaron Mitchell，我想要退款。",
        },
        "outputs": {
            "response": "我需要更多信息来帮助您处理退款。请提供您的电话号码、发票 ID 或您想要退款的项目的行 ID。",
            "trajectory": ["refund_agent"],
        }
    },
    {
        "inputs": {
            "question": "我叫 Aaron Mitchell，我想要对我购买的 Led Zeppelin 进行退款。我的电话是 +1 (204) 452-6452",
        },
        "outputs": {
            "response": "您想对以下哪些购买进行退款？\n\n  invoice_line_id  track_name                        artist_name    purchase_date          quantity_purchased    price_per_unit\n-----------------  --------------------------------  -------------  -------------------  --------------------  ----------------\n              267  How Many More Times               Led Zeppelin   2009-08-06 00:00:00                     1              0.99\n              268  What Is And What Should Never Be  Led Zeppelin   2009-08-06 00:00:00                     1              0.99",
            "trajectory": ["refund_agent", "lookup"],
        },
    },
    {
        "inputs": {
            "question": "是谁录制了 Wish You Were Here？你们还有他们的哪些其他专辑？",
        },
        "outputs": {
            "response": "Wish You Were Here 是 Pink Floyd 的专辑",
            "trajectory": ["question_answering_agent", "lookup_album"],
        }
    },
    {
        "inputs": {
            "question": "我要发票 237 的全额退款",
        },
        "outputs": {
            "response": "您已获得 $2.97 的退款。",
            "trajectory": ["refund_agent", "refund"],
        },
    },
]

dataset_name = "Chinook Customer Service Bot: E2E"

if not client.has_dataset(dataset_name=dataset_name):
    dataset = client.create_dataset(dataset_name=dataset_name)
    client.create_examples(
        dataset_id=dataset.id,
        examples=examples
    )

# LLM-as-judge instructions
grader_instructions = """You are a teacher grading a quiz.

您将获得一个问题（QUESTION）、标准答案（GROUND TRUTH RESPONSE）和学生的回答（STUDENT RESPONSE）。

这里是评分标准：
(1) 仅根据相对于标准答案的事实准确性对学生的回答评分。
(2) 确保学生的回答不包含任何相互矛盾的陈述。
(3) 如果学生的回答包含比标准答案更多的信息，只要它相对于标准答案的事实是准确的，这就是可以接受的。

正确性：
True 意味着学生的回答满足所有标准。
False 意味着学生的回答不满足所有标准。

逐步解释您的推理过程，以确保您的推理和结论是正确的。"""

# LLM 作为裁判输出 schema
class Grade(TypedDict):
    """比较预期答案和实际答案，并对实际答案评分。"""

    reasoning: Annotated[
        str,
        ...,
        "解释您对实际响应是否正确的推理。",
    ]
    is_correct: Annotated[
        bool,
        ...,
        "如果学生的回答基本正确或完全正确，则为 True，否则为 False。",
    ]

# 裁判 LLM
grader_llm = init_chat_model("gpt-4o-mini", temperature=0).with_structured_output(
    Grade, method="json_schema", strict=True
)

# 评估器函数
async def final_answer_correct(
    inputs: dict, outputs: dict, reference_outputs: dict
) -> bool:
    """评估最终响应是否与参考响应等效。"""

    # 请注意，我们假设输出中有一个 'response' 字典。我们需要确保
    # 我们定义的目标函数包含此键。
    user = f"""QUESTION: {inputs['question']}
    GROUND TRUTH RESPONSE: {reference_outputs['response']}
    STUDENT RESPONSE: {outputs['response']}"""

    grade = await grader_llm.ainvoke(
        [
            {"role": "system", "content": grader_instructions},
            {"role": "user", "content": user},
        ]
    )
    return grade["is_correct"]

# 目标函数
async def run_graph(inputs: dict) -> dict:
    """运行图并追踪其轨迹以及最终响应。"""
    result = await graph.ainvoke(
        {
            "messages": [
                {"role": "user", "content": inputs["question"]},
            ]
        },
        config={"env": "test"},
    )
    return {"response": result["followup"]}

# 评估作业和结果
experiment_results = await client.aevaluate(
    run_graph,
    data=dataset_name,
    evaluators=[final_answer_correct],
    experiment_prefix="sql-agent-gpt4o-e2e",
    num_repetitions=1,
    max_concurrency=4,
)
experiment_results.to_pandas()

def trajectory_subsequence(outputs: dict, reference_outputs: dict) -> float:
    """检查智能体执行了多少预期的步骤。"""
    if len(reference_outputs["trajectory"]) > len(outputs["trajectory"]):
        return False

    i = j = 0
    while i < len(reference_outputs["trajectory"]) and j < len(outputs["trajectory"]):
        if reference_outputs["trajectory"][i] == outputs["trajectory"][j]:
            i += 1
        j += 1

    return i / len(reference_outputs["trajectory"])

async def run_graph(inputs: dict) -> dict:
    """运行图并记录其轨迹以及最终响应。"""
    trajectory = []
    # 设置 subgraph=True 以流式处理来自主图子图的事件：https://langchain-ai.github.io/langgraph/how-tos/streaming-subgraphs/
    # 设置 stream_mode="debug" 以流式处理所有可能发生的事件：https://langchain-ai.github.io/langgra/langsmith/observability-concepts/streaming
    async for namespace, chunk in graph.astream(
        {
            "messages": [
                {
                    "role": "user",
                    "content": inputs["question"],
                }
            ]
        },
        subgraphs=True,
        stream_mode="debug",
    ):
        # 进入节点的事件类型
        if chunk["type"] == "task":
            # 记录节点名称
            trajectory.append(chunk["payload"]["name"])
            # 鉴于我们定义数据集的方式，我们还需要持续记录问答 ReACT 智能体调用的特定工具。
            # 当通过查看输入的最后一条消息的 AIMessage.tool_calls 从而由 ToolsNode（名称为 "tools"）被调用时，可以找到这些工具调用。
            if chunk["payload"]["name"] == "tools" and chunk["type"] == "task":
                for tc in chunk["payload"]["input"]["messages"][-1].tool_calls:
                    trajectory.append(tc["name"])

    return {"trajectory": trajectory}

experiment_results = await client.aevaluate(
    run_graph,
    data=dataset_name,
    evaluators=[trajectory_subsequence],
    experiment_prefix="sql-agent-gpt4o-trajectory",
    num_repetitions=1,
    max_concurrency=4,
)
experiment_results.to_pandas()

# 创建数据集
examples = [
    {
        "inputs": {
            "messages": [
                {
                    "role": "user",
                    "content": "我最近买了一些曲目，我很不喜欢",
                }
            ],
        },
        "outputs": {"route": "refund_agent"},
    },
    {
        "inputs": {
            "messages": [
                {
                    "role": "user",
                    "content": "我正打算买一些 Rolling Stones 的曲目，有什么推荐吗？",
                }
            ],
        },
        "outputs": {"route": "question_answering_agent"},
    },
    {
        "inputs": {
            "messages": [
                    {"role": "user", "content": "我想要对订单 237 退款"},
                {
                    "role": "assistant",
                    "content": "我已为您总计退款 $1.98。请问今天还有什么可以帮您？",
                },
                {"role": "user", "content": "Prince 在 2000 年发行过专辑吗？"},
            ],
        },
        "outputs": {"route": "question_answering_agent"},
    },
    {
        "inputs": {
            "messages": [
                {
                    "role": "user",
                    "content": "我最近购买了一个 Yesterday 的翻唱版本，但是我不记得是谁唱的了。你们有哪些版本？",
                }
            ],
        },
        "outputs": {"route": "question_answering_agent"},
    },
]

dataset_name = "Chinook Customer Service Bot: Intent Classifier"
if not client.has_dataset(dataset_name=dataset_name):
    dataset = client.create_dataset(dataset_name=dataset_name)
    client.create_examples(
        dataset_id=dataset.id,
        examples=examples,
    )

# 评估器
def correct(outputs: dict, reference_outputs: dict) -> bool:
    """检查智能体是否选择了正确的路由。"""
    return outputs["route"] == reference_outputs["route"]

# 用于运行相关步骤的目标函数
async def run_intent_classifier(inputs: dict) -> dict:
    # 请注意，我们可以直接访问并运行图中的 intent_classifier 节点。
    command = await graph.nodes["intent_classifier"].ainvoke(inputs)
    return {"route": command.goto}

# 运行评估
experiment_results = await client.aevaluate(
    run_intent_classifier,
    data=dataset_name,
    evaluators=[correct],
    experiment_prefix="sql-agent-gpt4o-intent-classifier",
    max_concurrency=4,
)
experiment_results.to_pandas()
```

::::

