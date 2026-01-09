---
title: 使用 Instructor 进行追踪
sidebarTitle: Instructor (Python only)
---
LangSmith 提供了与 [Instructor](https://python.useinstructor.com/) 的便捷集成，这是一个流行的开源库，用于通过 LLM 生成结构化输出。

要使用此功能，首先需要设置您的 LangSmith API 密钥。

```shell
export LANGSMITH_API_KEY=<your-api-key>
# 对于关联了多个工作区的 LangSmith API 密钥，请设置 LANGSMITH_WORKSPACE_ID 环境变量以指定要使用的工作区。
export LANGSMITH_WORKSPACE_ID=<your-workspace-id>
```

接下来，您需要安装 LangSmith SDK：

::: code-group

```bash [pip]
pip install -U langsmith
```

```bash [uv]
uv add langsmith
```

:::

使用 `langsmith.wrappers.wrap_openai` 包装您的 OpenAI 客户端。

```python
from openai import OpenAI
from langsmith import wrappers

client = wrappers.wrap_openai(OpenAI())
```

之后，您可以使用 `instructor` 来修补包装后的 OpenAI 客户端：

```python
import instructor

client = instructor.patch(client)
```

现在，您可以像往常一样使用 `instructor`，但所有操作都会被记录到 LangSmith！

```python
from pydantic import BaseModel

class UserDetail(BaseModel):
    name: str
    age: int

user = client.chat.completions.create(
    model="gpt-4o-mini",
    response_model=UserDetail,
    messages=[
        {"role": "user", "content": "Extract Jason is 25 years old"},
    ]
)
```

通常，您会在其他函数内部使用 `instructor`。
通过使用这个包装后的客户端并用 `@traceable` 装饰这些函数，您可以获得嵌套的追踪记录。
有关如何使用 `@traceable` 装饰器为代码添加追踪注释的更多信息，请参阅[本指南](./annotate-code)。

```python {highlight={2}}
# 您可以使用 `name` 关键字参数自定义运行名称
@traceable(name="Extract User Details")
def my_function(text: str) -> UserDetail:
    return client.chat.completions.create(
        model="gpt-4o-mini",
        response_model=UserDetail,
        messages=[
            {"role": "user", "content": f"Extract {text}"},
        ]
    )

my_function("Jason is 25 years old")
```
