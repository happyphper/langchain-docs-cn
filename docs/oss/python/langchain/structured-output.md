---
title: 结构化输出 (Structured output)
---

结构化输出（Structured output）允许智能体（agent）以特定、可预测的格式返回数据。你无需解析自然语言响应，而是可以直接获得 JSON 对象、[Pydantic 模型](https://docs.pydantic.dev/latest/concepts/models/#basic-model-usage)或数据类（dataclasses）形式的、可供应用程序直接使用的结构化数据。

LangChain 的 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 会自动处理结构化输出。用户设置他们期望的结构化输出模式（schema），当模型生成结构化数据时，它会被捕获、验证并返回到智能体状态的 `'structured_response'` 键中。

```python
def create_agent(
    ...
    response_format: Union[
        ToolStrategy[StructuredResponseT],
        ProviderStrategy[StructuredResponseT],
        type[StructuredResponseT],
        None,
    ]
```

## 响应格式 (Response format)

使用 `response_format` 来控制智能体如何返回结构化数据：

- **`ToolStrategy[StructuredResponseT]`**：使用工具调用（tool calling）实现结构化输出
- **`ProviderStrategy[StructuredResponseT]`**：使用提供商原生（provider-native）的结构化输出
- **`type[StructuredResponseT]`**：模式类型 - 根据模型能力自动选择最佳策略
- **`None`**：未明确请求结构化输出

当直接提供模式类型时，LangChain 会自动选择：

- 如果所选模型和提供商支持原生结构化输出（例如 [OpenAI](/oss/python/integrations/providers/openai)、[Anthropic (Claude)](/oss/python/integrations/providers/anthropic) 或 [xAI (Grok)](/oss/python/integrations/providers/xai)），则使用 `ProviderStrategy`。
- 对于所有其他模型，使用 `ToolStrategy`。

<Note>

如果使用 `langchain>=1.1`，对原生结构化输出功能的支持会从模型的[配置文件数据](/oss/python/langchain/models#model-profiles)中动态读取。如果数据不可用，请使用其他条件或手动指定：
```python
custom_profile = {
    "structured_output": True,
    # ...
}
model = init_chat_model("...", profile=custom_profile)
```
如果指定了工具，模型必须同时支持工具和结构化输出。

</Note>

结构化响应会返回到智能体最终状态的 `structured_response` 键中。

## 提供商策略 (Provider strategy)

一些模型提供商通过其 API 原生支持结构化输出（例如 OpenAI、xAI (Grok)、Gemini、Anthropic (Claude)）。当可用时，这是最可靠的方法。

要使用此策略，请配置一个 `ProviderStrategy`：

```python
class ProviderStrategy(Generic[SchemaT]):
    schema: type[SchemaT]
    strict: bool | None = None
```

<Info>

`strict` 参数需要 `langchain>=1.2`。

</Info>

<ParamField path="schema" required>

定义结构化输出格式的模式。支持：
    - <strong>Pydantic 模型</strong>：具有字段验证的 `BaseModel` 子类。返回经过验证的 Pydantic 实例。
    - <strong>数据类</strong>：带有类型注解的 Python 数据类。返回字典。
    - <strong>TypedDict</strong>：类型化字典类。返回字典。
    - <strong>JSON 模式</strong>：包含 JSON 模式规范的字典。返回字典。

</ParamField>

<ParamField path="strict">

可选的布尔参数，用于启用严格的模式遵循。某些提供商支持此功能（例如，[OpenAI](/oss/python/integrations/chat/openai) 和 [xAI](/oss/python/integrations/chat/xai)）。默认为 `None`（禁用）。

</ParamField>

当你直接将模式类型传递给 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent(response_format)" target="_blank" rel="noreferrer" class="link"><code>create_agent.response_format</code></a> 并且模型支持原生结构化输出时，LangChain 会自动使用 `ProviderStrategy`：

::: code-group

```python [Pydantic Model]
from pydantic import BaseModel, Field
from langchain.agents import create_agent

class ContactInfo(BaseModel):
    """人员的联系信息。"""
    name: str = Field(description="人员姓名")
    email: str = Field(description="人员的电子邮件地址")
    phone: str = Field(description="人员的电话号码")

agent = create_agent(
    model="gpt-5",
    response_format=ContactInfo  # 自动选择 ProviderStrategy
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "从以下内容提取联系信息：John Doe, john@example.com, (555) 123-4567"}]
})

print(result["structured_response"])
# ContactInfo(name='John Doe', email='john@example.com', phone='(555) 123-4567')
```

```python [Dataclass]
from dataclasses import dataclass
from langchain.agents import create_agent

@dataclass
class ContactInfo:
    """人员的联系信息。"""
    name: str # 人员姓名
    email: str # 人员的电子邮件地址
    phone: str # 人员的电话号码

agent = create_agent(
    model="gpt-5",
    tools=tools,
    response_format=ContactInfo  # 自动选择 ProviderStrategy
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "从以下内容提取联系信息：John Doe, john@example.com, (555) 123-4567"}]
})

result["structured_response"]
# {'name': 'John Doe', 'email': 'john@example.com', 'phone': '(555) 123-4567'}
```

```python [TypedDict]
from typing_extensions import TypedDict
from langchain.agents import create_agent

class ContactInfo(TypedDict):
    """人员的联系信息。"""
    name: str # 人员姓名
    email: str # 人员的电子邮件地址
    phone: str # 人员的电话号码

agent = create_agent(
    model="gpt-5",
    tools=tools,
    response_format=ContactInfo  # 自动选择 ProviderStrategy
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "从以下内容提取联系信息：John Doe, john@example.com, (555) 123-4567"}]
})

result["structured_response"]
# {'name': 'John Doe', 'email': 'john@example.com', 'phone': '(555) 123-4567'}
```

```python [JSON Schema]
from langchain.agents import create_agent

contact_info_schema = {
    "type": "object",
    "description": "人员的联系信息。",
    "properties": {
        "name": {"type": "string", "description": "人员姓名"},
        "email": {"type": "string", "description": "人员的电子邮件地址"},
        "phone": {"type": "string", "description": "人员的电话号码"}
    },
    "required": ["name", "email", "phone"]
}

agent = create_agent(
    model="gpt-5",
    tools=tools,
    response_format=ProviderStrategy(contact_info_schema)
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "从以下内容提取联系信息：John Doe, john@example.com, (555) 123-4567"}]
})

result["structured_response"]
# {'name': 'John Doe', 'email': 'john@example.com', 'phone': '(555) 123-4567'}
```

:::

提供商原生结构化输出提供了高可靠性和严格的验证，因为模型提供商会强制执行模式。在可用时请使用它。

<Note>

如果提供商原生支持你选择的模型的结构化输出，那么写 `response_format=ProductReview` 与写 `response_format=ProviderStrategy(ProductReview)` 在功能上是等效的。

无论哪种情况，如果不支持结构化输出，智能体将回退到工具调用策略。

</Note>

## 工具调用策略 (Tool calling strategy)

对于不支持原生结构化输出的模型，LangChain 使用工具调用来实现相同的结果。这适用于所有支持工具调用的模型（大多数现代模型）。

要使用此策略，请配置一个 `ToolStrategy`：

```python
class ToolStrategy(Generic[SchemaT]):
    schema: type[SchemaT]
    tool_message_content: str | None
    handle_errors: Union[
        bool,
        str,
        type[Exception],
        tuple[type[Exception], ...],
        Callable[[Exception], str],
    ]
```

<ParamField path="schema" required>

定义结构化输出格式的模式。支持：
    - <strong>Pydantic 模型</strong>：具有字段验证的 `BaseModel` 子类。返回经过验证的 Pydantic 实例。
    - <strong>数据类</strong>：带有类型注解的 Python 数据类。返回字典。
    - <strong>TypedDict</strong>：类型化字典类。返回字典。
    - <strong>JSON 模式</strong>：包含 JSON 模式规范的字典。返回字典。
    - <strong>联合类型</strong>：多个模式选项。模型将根据上下文选择最合适的模式。

</ParamField>

<ParamField path="tool_message_content">

生成结构化输出时返回的工具消息的自定义内容。
如果未提供，则默认为显示结构化响应数据的消息。

</ParamField>

<ParamField path="handle_errors">

结构化输出验证失败时的错误处理策略。默认为 `True`。

    - <strong>`True`</strong>：捕获所有错误并使用默认错误模板
    - <strong>`str`</strong>：捕获所有错误并使用此自定义消息
    - <strong>`type[Exception]`</strong>：仅捕获此异常类型并使用默认消息
    - <strong>`tuple[type[Exception], ...]`</strong>：仅捕获这些异常类型并使用默认消息
    - <strong>`Callable[[Exception], str]`</strong>：返回错误消息的自定义函数
    - <strong>`False`</strong>：不重试，让异常传播

</ParamField>

::: code-group

```python [Pydantic Model]
from pydantic import BaseModel, Field
from typing import Literal
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

class ProductReview(BaseModel):
    """产品评论分析。"""
    rating: int | None = Field(description="产品评分", ge=1, le=5)
    sentiment: Literal["positive", "negative"] = Field(description="评论的情感倾向")
    key_points: list[str] = Field(description="评论的要点。小写，每个1-3个词。")

agent = create_agent(
    model="gpt-5",
    tools=tools,
    response_format=ToolStrategy(ProductReview)
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "分析此评论：'很棒的产品：5星。发货快，但价格贵'"}]
})
result["structured_response"]
# ProductReview(rating=5, sentiment='positive', key_points=['fast shipping', 'expensive'])
```

```python [Dataclass]
from dataclasses import dataclass
from typing import Literal
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

@dataclass
class ProductReview:
    """产品评论分析。"""
    rating: int | None  # 产品评分 (1-5)
    sentiment: Literal["positive", "negative"]  # 评论的情感倾向
    key_points: list[str]  # 评论的要点

agent = create_agent(
    model="gpt-5",
    tools=tools,
    response_format=ToolStrategy(ProductReview)
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "分析此评论：'很棒的产品：5星。发货快，但价格贵'"}]
})
result["structured_response"]
# {'rating': 5, 'sentiment': 'positive', 'key_points': ['fast shipping', 'expensive']}
```

```python [TypedDict]
from typing import Literal
from typing_extensions import TypedDict
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

class ProductReview(TypedDict):
    """产品评论分析。"""
    rating: int | None  # 产品评分 (1-5)
    sentiment: Literal["positive", "negative"]  # 评论的情感倾向
    key_points: list[str]  # 评论的要点

agent = create_agent(
    model="gpt-5",
    tools=tools,
    response_format=ToolStrategy(ProductReview)
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "分析此评论：'很棒的产品：5星。发货快，但价格贵'"}]
})
result["structured_response"]
# {'rating': 5, 'sentiment': 'positive', 'key_points': ['fast shipping', 'expensive']}
```

```python [JSON Schema]
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

product_review_schema = {
    "type": "object",
    "description": "产品评论分析。",
    "properties": {
        "rating": {
            "type": ["integer", "null"],
            "description": "产品评分 (1-5)",
            "minimum": 1,
            "maximum": 5
        },
        "sentiment": {
            "type": "string",
            "enum": ["positive", "negative"],
            "description": "评论的情感倾向"
        },
        "key_points": {
            "type": "array",
            "items": {"type": "string"},
            "description": "评论的要点"
        }
    },
    "required": ["sentiment", "key_points"]
}

agent = create_agent(
    model="gpt-5",
    tools=tools,
    response_format=ToolStrategy(product_review_schema)
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "分析此评论：'很棒的产品：5星。发货快，但价格贵'"}]
})
result["structured_response"]
# {'rating': 5, 'sentiment': 'positive', 'key_points': ['fast shipping', 'expensive']}
```

```python [Union Types]
from pydantic import BaseModel, Field
from typing import Literal, Union
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

class ProductReview(BaseModel):
    """产品评论分析。"""
    rating: int | None = Field(description="产品评分", ge=1, le=5)
    sentiment: Literal["positive", "negative"] = Field(description="评论的情感倾向")
    key_points: list[str] = Field(description="评论的要点。小写，每个1-3个词。")

class CustomerComplaint(BaseModel):
    """关于产品或服务的客户投诉。"""
    issue_type: Literal["product", "service", "shipping", "billing"] = Field(description="问题类型")
    severity: Literal["low", "medium", "high"] = Field(description="投诉严重程度")
    description: str = Field(description="投诉的简要说明")

agent = create_agent(
    model="gpt-5",
    tools=tools,
    response_format=ToolStrategy(Union[ProductReview, CustomerComplaint])
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "分析此评论：'很棒的产品：5星。发货快，但价格贵'"}]
})
result["structured_response"]
# ProductReview(rating=5, sentiment='positive', key_points=['fast shipping', 'expensive'])
```

:::

### 自定义工具消息内容 (Custom tool message content)

`tool_message_content` 参数允许你自定义生成结构化输出时出现在对话历史中的消息：

```python
from pydantic import BaseModel, Field
from typing import Literal
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

class MeetingAction(BaseModel):
    """从会议转录中提取的操作项。"""
    task: str = Field(description="要完成的具体任务")
    assignee: str = Field(description="负责该任务的人员")
    priority: Literal["low", "medium", "high"] = Field(description="优先级")

agent = create_agent(
    model="gpt-5",
    tools=[],
    response_format=ToolStrategy(
        schema=MeetingAction,
        tool_message_content="操作项已捕获并添加到会议记录中！"
    )
)

agent.invoke({
    "messages": [{"role": "user", "content": "来自我们的会议：Sarah 需要尽快更新项目时间表"}]
})
```

```
================================ Human Message =================================

来自我们的会议：Sarah 需要尽快更新项目时间表
================================== Ai Message ==================================
Tool Calls:
  MeetingAction (call_1)
 Call ID: call_1
  Args:
    task: 更新项目时间表
    assignee: Sarah
    priority: high
================================= Tool Message =================================
Name: MeetingAction

操作项已捕获并添加到会议记录中！
```

如果没有 `tool_message_content`，我们最终的 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a> 将是：
```
================================= Tool Message =================================
Name: MeetingAction

Returning structured response: {'task': 'update the project timeline', 'assignee': 'Sarah', 'priority': 'high'}
```

## 错误处理 (Error handling)

模型通过工具调用生成结构化输出时可能会出错。LangChain 提供了智能重试机制来自动处理这些错误。

#### 多个结构化输出错误 (Multiple structured outputs error)

当模型错误地调用了多个结构化输出工具时，智能体会提供 <a href="https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage" target="_blank" rel="noreferrer" class="link"><code>ToolMessage</code></a> 形式的错误反馈，并提示模型重试：

```python
from pydantic import BaseModel, Field
from typing import Union
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

class ContactInfo(BaseModel):
    name: str = Field(description="人员姓名")
    email: str = Field(description="电子邮件地址")

class EventDetails(BaseModel):
    event_name: str = Field(description="活动名称")
    date: str = Field(description="活动日期")

agent = create_agent(
    model="gpt-5",
    tools=[],
    response_format=ToolStrategy(Union[ContactInfo, EventDetails])  # 默认：handle_errors=True
)

agent.invoke({
    "messages": [{"role": "user", "content": "提取信息：John Doe (john@email.com) 正在组织 3 月 15 日的技术会议"}]
})
```

```
================================ Human Message =================================

提取信息：John Doe (john@email.com) 正在组织 3 月 15 日的技术会议
None
================================== Ai Message ==================================
Tool Calls:
  ContactInfo (call_1)
 Call ID: call_1
  Args:
    name: John Doe
    email: john@email.com
  EventDetails (call_2)
 Call ID: call_2
  Args:
    event_name: 技术会议
    date: March 15th
================================= Tool Message =================================
Name: ContactInfo

Error: 模型错误地返回了多个结构化响应 (ContactInfo, EventDetails)，而预期只有一个。
 请纠正你的错误。
================================= Tool Message =================================
Name: EventDetails

Error: 模型错误地返回了多个结构化响应 (ContactInfo, EventDetails)，而预期只有一个。
 请纠正你的错误。
================================== Ai Message ==================================
Tool Calls:
  ContactInfo (call_3)
 Call ID: call_3
  Args:
    name: John Doe
    email: john@email.com
================================= Tool Message =================================
Name: ContactInfo

Returning structured response: {'name': 'John Doe', 'email': 'john@email.com'}
```

#### Schema validation error

When structured output doesn't match the expected schema, the agent provides specific error feedback:

```python
from pydantic import BaseModel, Field
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

class ProductRating(BaseModel):
    rating: int | None = Field(description="Rating from 1-5", ge=1, le=5)
    comment: str = Field(description="评论内容")

agent = create_agent(
    model="gpt-5",
    tools=[],
    response_format=ToolStrategy(ProductRating),  # 默认：handle_errors=True
    system_prompt="你是一个帮助解析产品评论的助手。不要编造任何字段或值。"
)

agent.invoke({
    "messages": [{"role": "user", "content": "解析此内容：Amazing product, 10/10!"}]
})
```

```
================================ Human Message =================================

解析此内容：Amazing product, 10/10!
================================== Ai Message ==================================
Tool Calls:
  ProductRating (call_1)
 Call ID: call_1
  Args:
    rating: 10
    comment: Amazing product
================================= Tool Message =================================
Name: ProductRating

Error: 解析工具 'ProductRating' 的结构化输出失败：ProductRating.rating 存在 1 个验证错误
  Input should be less than or equal to 5 [type=less_than_equal, input_value=10, input_type=int]。
 请纠正你的错误。
================================== Ai Message ==================================
Tool Calls:
  ProductRating (call_2)
 Call ID: call_2
  Args:
    rating: 5
    comment: Amazing product
================================= Tool Message =================================
Name: ProductRating

Returning structured response: {'rating': 5, 'comment': 'Amazing product'}
```

#### 错误处理策略 (Error handling strategies)

你可以使用 `handle_errors` 参数自定义错误的处​​理方式：

**自定义错误消息：**

```python
ToolStrategy(
    schema=ProductRating,
    handle_errors="请提供 1-5 之间的有效评分并包含评论。"
)
```
如果 `handle_errors` 是字符串，智能体将*始终*提示模型使用固定的工具消息重试：
```
================================= Tool Message =================================
Name: ProductRating

请提供 1-5 之间的有效评分并包含评论。
```

**仅处理特定异常：**

```python
ToolStrategy(
    schema=ProductRating,
    handle_errors=ValueError  # 仅在发生 ValueError 时重试，抛出其他异常
)
```

如果 `handle_errors` 是异常类型，则仅当抛出的异常是指定类型时，智能体才会重试（使用默认错误消息）。在所有其他情况下，异常将被抛出。

**处理多种异常类型：**

```python
ToolStrategy(
    schema=ProductRating,
    handle_errors=(ValueError, TypeError)  # 在发生 ValueError 和 TypeError 时重试
)
```

如果 `handle_errors` 是异常元组，则仅当抛出的异常是指定类型之一时，智能体才会重试（使用默认错误消息）。在所有其他情况下，异常将被抛出。

**自定义错误处理函数：**

```python

from langchain.agents.structured_output import StructuredOutputValidationError
from langchain.agents.structured_output import MultipleStructuredOutputsError

def custom_error_handler(error: Exception) -> str:
    if isinstance(error, StructuredOutputValidationError):
        return "格式存在问题。请再试一次。"
    elif isinstance(error, MultipleStructuredOutputsError):
        return "返回了多个结构化输出。请选择最相关的一个。"
    else:
        return f"错误：{str(error)}"

agent = create_agent(
    model="gpt-5",
    tools=[],
    response_format=ToolStrategy(
                        schema=Union[ContactInfo, EventDetails],
                        handle_errors=custom_error_handler
                    )  # 默认：handle_errors=True
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "提取信息：John Doe (john@email.com) 正在组织 3 月 15 日的技术会议"}]
})

for msg in result['messages']:
    # 如果消息实际上是 ToolMessage 对象（不是字典），检查其类名
    if type(msg).__name__ == "ToolMessage":
        print(msg.content)
    # 如果消息是字典或你想要备选方案
    elif isinstance(msg, dict) and msg.get('tool_call_id'):
        print(msg['content'])
```

发生 `StructuredOutputValidationError` 时：
```
================================= Tool Message =================================
Name: ToolStrategy

格式存在问题。请再试一次。
```

发生 `MultipleStructuredOutputsError` 时：

```
================================= Tool Message =================================
Name: ToolStrategy

返回了多个结构化输出。请选择最相关的一个。
```

发生其他错误时：

```
================================= Tool Message =================================
Name: ToolStrategy

错误：<错误消息>
```

**无错误处理：**

```python
response_format = ToolStrategy(
    schema=ProductRating,
    handle_errors=False  # 抛出所有错误
)
```

