---
title: PremAI
---
[PremAI](https://premai.io/) 是一个一体化平台，它简化了由生成式 AI 驱动的、健壮且可用于生产的应用程序的创建过程。通过简化开发流程，PremAI 让您可以专注于提升用户体验并推动应用程序的整体增长。您可以快速开始使用[我们的平台](https://docs.premai.io/quick-start)。

## ChatPremAI

本示例将介绍如何使用 LangChain 通过 `ChatPremAI` 与不同的聊天模型进行交互。

### 安装与设置

我们首先安装 `langchain` 和 `premai-sdk`。您可以输入以下命令进行安装：

::: code-group

```bash [pip]
pip install premai langchain
```

```bash [uv]
uv add premai langchain
```

:::

在继续之前，请确保您已在 PremAI 上创建账户并已创建一个项目。如果还没有，请参考[快速入门](https://docs.premai.io/introduction)指南开始使用 PremAI 平台。创建您的第一个项目并获取您的 API 密钥。

```python
from langchain.messages import HumanMessage, SystemMessage
from langchain_community.chat_models import ChatPremAI
```

### 在 LangChain 中设置 PremAI 客户端

导入所需模块后，让我们来设置客户端。目前假设我们的 `project_id` 是 `8`。但请确保使用您自己的项目 ID，否则会报错。

要在 LangChain 中使用 prem，您无需通过聊天客户端传递任何模型名称或设置任何参数。默认情况下，它将使用 [LaunchPad](https://docs.premai.io/get-started/launchpad) 中使用的模型名称和参数。

> 注意：如果在设置客户端时更改了 `model` 或任何其他参数（如 `temperature` 或 `max_tokens`），它将覆盖 LaunchPad 中使用的现有默认配置。

```python
import os
import getpass

if "PREMAI_API_KEY" not in os.environ:
    os.environ["PREMAI_API_KEY"] = getpass.getpass("PremAI API Key:")

chat = ChatPremAI(project_id=1234, model_name="gpt-4o")
```

### 聊天补全

`ChatPremAI` 支持两种方法：`invoke`（与 `generate` 相同）和 `stream`。

第一种方法会给我们一个静态结果。而第二种方法会逐个令牌地流式传输。以下是生成类似聊天补全的方法。

```python
human_message = HumanMessage(content="Who are you?")

response = chat.invoke([human_message])
print(response.content)
```

您可以像这样提供系统提示：

```python
system_message = SystemMessage(content="You are a friendly assistant.")
human_message = HumanMessage(content="Who are you?")

chat.invoke([system_message, human_message])
```

您也可以在调用模型时更改生成参数。以下是操作方法：

```python
chat.invoke(
    [system_message, human_message],
    temperature = 0.7, max_tokens = 20, top_p = 0.95
)
```

> 如果您在此处放置系统提示，它将覆盖您从平台部署应用程序时设置的固定系统提示。

> 您可以在此处找到所有可选参数[此处](https://docs.premai.io/get-started/sdk#optional-parameters)。除了[这些支持的参数](https://docs.premai.io/get-started/sdk#optional-parameters)之外的任何参数，在调用模型前都会被自动移除。

### 与 prem 存储库的原生 RAG 支持

Prem 存储库允许用户上传文档（.txt、.pdf 等）并将这些存储库连接到 LLM。您可以将 Prem 存储库视为原生 RAG，其中每个存储库都可以看作一个向量数据库。您可以连接多个存储库。您可以在此处了解更多关于存储库的信息[此处](https://docs.premai.io/get-started/repositories)。

Langchain premai 也支持存储库。以下是操作方法。

```python
query = "Which models are used for dense retrieval"
repository_ids = [1985,]
repositories = dict(
    ids=repository_ids,
    similarity_threshold=0.3,
    limit=3
)
```

首先，我们通过定义一些仓库ID来开始设置我们的仓库。请确保这些ID是有效的仓库ID。您可以在此处了解更多关于如何获取仓库ID的信息。

> 请注意：类似于调用 `model_name` 参数时，当您调用 `repositories` 参数时，您可能会覆盖启动台中连接的仓库。

现在，我们将仓库与聊天对象连接，以调用基于RAG的生成。

```python
import json

response = chat.invoke(query, max_tokens=100, repositories=repositories)

print(response.content)
print(json.dumps(response.response_metadata, indent=4))
```

输出示例如下。

```bash
Dense retrieval models typically include:

1. **BERT-based Models**: Such as DPR (Dense Passage Retrieval) which uses BERT for encoding queries and passages.
2. **ColBERT**: A model that combines BERT with late interaction mechanisms.
3. **ANCE (Approximate Nearest Neighbor Negative Contrastive Estimation)**: Uses BERT and focuses on efficient retrieval.
4. **TCT-ColBERT**: A variant of ColBERT that uses a two-tower
{
    "document_chunks": [
        {
            "repository_id": 1985,
            "document_id": 1306,
            "chunk_id": 173899,
            "document_name": "[D] Difference between sparse and dense information\u2026",
            "similarity_score": 0.3209080100059509,
            "content": "with the difference or anywhere\nwhere I can read about it?\n\n\n      17                  9\n\n\n      u/ScotiabankCanada        \u2022  Promoted\n\n\n                       Accelerate your study permit process\n                       with Scotiabank's Student GIC\n                       Program. We're here to help you tur\u2026\n\n\n                       startright.scotiabank.com         Learn More\n\n\n                            Add a Comment\n\n\nSort by:   Best\n\n\n      DinosParkour      \u2022 1y ago\n\n\n     Dense Retrieval (DR) m"
        }
    ]
}
```

因此，这也意味着在使用Prem平台时，您无需构建自己的RAG管道。Prem使用其自身的RAG技术来提供检索增强生成（Retrieval Augmented Generations）的最佳性能。

> 理想情况下，您无需在此处连接仓库ID即可获得检索增强生成。如果您已在Prem平台中连接了仓库，您仍然可以获得相同的结果。

### 流式传输

在本节中，我们将了解如何使用langchain和PremAI进行令牌流式传输。具体操作如下。

```python
import sys

for chunk in chat.stream("hello how are you"):
    sys.stdout.write(chunk.content)
    sys.stdout.flush()
```

与上述类似，如果您想要覆盖系统提示和生成参数，需要添加以下内容：

```python
import sys

for chunk in chat.stream(
    "hello how are you",
    system_prompt = "You are an helpful assistant", temperature = 0.7, max_tokens = 20
):
    sys.stdout.write(chunk.content)
    sys.stdout.flush()
```

这将逐个令牌进行流式传输。

> 请注意：截至目前，暂不支持带RAG的流式传输。但我们仍通过API支持此功能。您可以在此处了解更多信息。

## Prem模板

编写提示模板可能会非常混乱。提示模板通常很长，难以管理，并且需要不断调整以改进并在整个应用程序中保持一致。

使用**Prem**，编写和管理提示可以变得非常简单。启动台内的**_模板_**选项卡帮助您编写所需数量的提示，并在SDK中使用这些提示来运行您的应用程序。您可以在此处阅读更多关于提示模板的信息。

要在 LangChain 中原生使用 Prem 模板，您需要向 `HumanMessage` 传递一个 id。这个 id 应该是您的提示模板变量的名称。`HumanMessage` 中的 `content` 应该是该变量的值。

举个例子，假设您的提示模板是这样的：

```text
Say hello to my name and say a feel-good quote
from my age. My name is: {name} and age is {age}
```

那么现在您的 `human_messages` 应该如下所示：

```python
human_messages = [
    HumanMessage(content="Shawn", id="name"),
    HumanMessage(content="22", id="age")
]
```

将这个 `human_messages` 传递给 ChatPremAI 客户端。请注意：**不要忘记**在调用生成时传递额外的 `template_id` 以使用 Prem 模板。如果您不了解 `template_id`，可以[在我们的文档中](https://docs.premai.io/get-started/prem-templates)了解更多信息。这里有一个示例：

```python
template_id = "78069ce8-xxxxx-xxxxx-xxxx-xxx"
response = chat.invoke([human_message], template_id=template_id)
```

Prem 模板也支持流式传输。

## Prem 嵌入

在本节中，我们将介绍如何通过 LangChain 的 `PremEmbeddings` 使用不同的嵌入模型。让我们从导入模块和设置 API 密钥开始。

```python
import os
import getpass
from langchain_community.embeddings import PremEmbeddings

if os.environ.get("PREMAI_API_KEY") is None:
    os.environ["PREMAI_API_KEY"] = getpass.getpass("PremAI API Key:")
```

我们支持许多先进的嵌入模型。您可以[在此处](https://docs.premai.io/get-started/supported-models)查看我们支持的 LLM 和嵌入模型列表。现在，让我们在这个示例中使用 `text-embedding-3-large` 模型。

```python
model = "text-embedding-3-large"
embedder = PremEmbeddings(project_id=8, model=model)

query = "Hello, this is a test query"
query_result = embedder.embed_query(query)

# 让我们打印查询嵌入向量的前五个元素

print(query_result[:5])
```

<Note>

与聊天功能不同，PremAIEmbeddings 必须设置 `model_name` 参数。

</Note>

最后，让我们嵌入一些示例文档

```python
documents = [
    "This is document1",
    "This is document2",
    "This is document3"
]

doc_result = embedder.embed_documents(documents)

# 与之前的结果类似，让我们打印第一个文档向量的前五个元素

print(doc_result[0][:5])
```

```python
print(f"Dimension of embeddings: {len(query_result)}")
```

嵌入维度：3072

```python
doc_result[:5]
```

>结果：
>
>[-0.02129288576543331,
 0.0008162345038726926,
 -0.004556538071483374,
 0.02918623760342598,
 -0.02547479420900345]

## 工具/函数调用

LangChain PremAI 支持工具/函数调用。工具/函数调用允许模型通过生成符合用户定义模式的输出来响应给定的提示。

- 您可以在[我们的文档中](https://docs.premai.io/get-started/function-calling)详细了解工具调用。
- 您可以在[文档的这一部分](https://python.langchain.com/v0.1/docs/modules/model_io/chat/function_calling)了解更多关于 LangChain 工具调用的信息。

**注意：**

> 当前版本的 LangChain ChatPremAI **不支持**带有流式传输的工具/函数调用。流式传输支持以及函数调用功能将很快推出。

### 向模型传递工具

为了传递工具并让 LLM 选择它需要调用的工具，我们需要传递一个工具模式。工具模式是函数定义，并附有适当的文档字符串，说明函数的作用、函数的每个参数是什么等。以下是一些简单的算术函数及其模式。

**注意：**
> 定义函数/工具模式时，**不要忘记**添加关于函数参数的信息，否则会抛出错误。

```python
from langchain.tools import tool
from pydantic import BaseModel, Field
```

# 定义函数参数的架构
class OperationInput(BaseModel):
a: int = Field(description="第一个数字")
b: int = Field(description="第二个数字")

# 现在定义函数，其参数架构将为 OperationInput
@tool("add", args_schema=OperationInput, return_direct=True)
def add(a: int, b: int) -> int:
"""将 `a` 和 `b` 相加。

Args:
a: 第一个整数
b: 第二个整数
"""
return a + b

@tool("multiply", args_schema=OperationInput, return_direct=True)
def multiply(a: int, b: int) -> int:
"""将 a 和 b 相乘。

Args:
a: 第一个整数
b: 第二个整数
"""
return a * b
```

### 将工具架构与我们的 LLM 绑定

现在我们将使用 `bind_tools` 方法将上述函数转换为“工具”并将其与模型绑定。这意味着每次调用模型时，我们都会传递这些工具信息。

```python
tools = [add, multiply]
llm_with_tools = chat.bind_tools(tools)
```

在此之后，我们从已绑定工具的模型获取响应。

```python
query = "What is 3 * 12? Also, what is 11 + 49?"

messages = [HumanMessage(query)]
ai_msg = llm_with_tools.invoke(messages)
```

如我们所见，当我们的聊天模型绑定工具后，它会根据给定的提示，按顺序调用正确的工具集。

```python
ai_msg.tool_calls
```

**输出**

```python
[{'name': 'multiply',
  'args': {'a': 3, 'b': 12},
  'id': 'call_A9FL20u12lz6TpOLaiS6rFa8'},
 {'name': 'add',
  'args': {'a': 11, 'b': 49},
  'id': 'call_MPKYGLHbf39csJIyb5BZ9xIk'}]
```

我们将上面显示的消息附加到 LLM，这作为上下文，让 LLM 知道它调用了哪些函数。

```python
messages.append(ai_msg)
```

由于工具调用分为两个阶段，其中：

1.  在第一次调用中，我们收集了 LLM 决定使用的所有工具，以便它可以获得结果作为附加上下文，从而提供更准确且无幻觉的结果。
2.  在第二次调用中，我们将解析 LLM 决定的工具集并运行它们（在我们的例子中，这将是我们定义的函数，使用 LLM 提取的参数），然后将此结果传递给 LLM。

```python
from langchain.messages import ToolMessage

for tool_call in ai_msg.tool_calls:
selected_tool = {"add": add, "multiply": multiply}[tool_call["name"].lower()]
tool_output = selected_tool.invoke(tool_call["args"])
messages.append(ToolMessage(tool_output, tool_call_id=tool_call["id"]))
```

最后，我们调用 LLM（已绑定工具），并在其上下文中添加函数响应。

```python
response = llm_with_tools.invoke(messages)
print(response.content)
```

**输出**

```txt
最终答案是：

- 3 * 12 = 36
- 11 + 49 = 60
```

### 定义工具架构：Pydantic 类 `Optional`

上面我们展示了如何使用 `tool` 装饰器定义架构，但我们也可以使用 Pydantic 等效地定义架构。当您的工具输入更复杂时，Pydantic 非常有用：

```python
from langchain_core.output_parsers.openai_tools import PydanticToolsParser

class add(BaseModel):
"""将两个整数相加。"""

a: int = Field(..., description="第一个整数")
b: int = Field(..., description="第二个整数")

class multiply(BaseModel):
"""将两个整数相乘。"""

a: int = Field(..., description="第一个整数")
b: int = Field(..., description="第二个整数")

tools = [add, multiply]
```

现在，我们可以将它们绑定到聊天模型并直接获取结果：

```python
chain = llm_with_tools | PydanticToolsParser(tools=[multiply, add])
chain.invoke(query)
```

**输出**

```txt
[multiply(a=3, b=12), add(a=11, b=49)]
```

现在，如上所述，我们解析这个结果，运行这些函数，并再次调用 LLM 以获取最终结果。
