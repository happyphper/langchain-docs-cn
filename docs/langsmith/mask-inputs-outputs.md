---
title: 防止在追踪中记录敏感数据
sidebarTitle: Prevent logging of sensitive data in traces
---
在使用 LangSmith 追踪时，您可能需要防止敏感信息被记录，以维护隐私并满足安全要求。LangSmith 提供了多种方法，在数据发送到后端之前对其进行保护：

- [完全隐藏输入和输出](#隐藏输入和输出)：使用环境变量或 <a href="https://reference.langchain.com/python/langsmith/observability/sdk/client/#langsmith.client.Client" target="_blank" rel="noreferrer" class="link">Client</a> 配置。
- [隐藏元数据](#隐藏元数据)：移除或转换运行元数据。
- [应用基于规则的掩码](#基于规则的输入输出掩码)：使用正则表达式模式或匿名化库选择性地编辑敏感信息。
- [处理单个函数的输入和输出](#处理单个函数的输入和输出)：通过函数级自定义。
- [使用第三方匿名化工具](#示例)：如 Microsoft Presidio 和 Amazon Comprehend，用于高级 PII 检测。

## 隐藏输入和输出

如果您想完全隐藏追踪的输入和输出，可以在运行应用程序时设置以下环境变量：

```bash
LANGSMITH_HIDE_INPUTS=true
LANGSMITH_HIDE_OUTPUTS=true
```

这适用于 LangSmith SDK（Python 和 TypeScript）以及 LangChain。

您也可以为给定的 <a href="https://reference.langchain.com/python/langsmith/observability/sdk/client/#langsmith.client.Client" target="_blank" rel="noreferrer" class="link">Client</a> 实例自定义和覆盖此行为。这可以通过在 <a href="https://reference.langchain.com/python/langsmith/observability/sdk/client/#langsmith.client.Client" target="_blank" rel="noreferrer" class="link">Client</a> 对象上设置 `hide_inputs` 和 `hide_outputs` 参数来实现（在 TypeScript 中为 `hideInputs` 和 `hideOutputs`）。

以下示例为 `hide_inputs` 和 `hide_outputs` 返回一个空对象，但您可以根据需要进行自定义：

::: code-group

```python [Python]
import openai
from langsmith import Client
from langsmith.wrappers import wrap_openai

openai_client = wrap_openai(openai.Client())
langsmith_client = Client(
    hide_inputs=lambda inputs: {}, hide_outputs=lambda outputs: {}
)

# 生成的追踪将包含其元数据，但输入将被隐藏
openai_client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
    ],
    langsmith_extra={"client": langsmith_client},
)

# 生成的追踪将不会隐藏输入和输出
openai_client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
    ],
)
```

```typescript [TypeScript]
import OpenAI from "openai";
import { Client } from "langsmith";
import { wrapOpenAI } from "langsmith/wrappers";

const langsmithClient = new Client({
    hideInputs: (inputs) => ({}),
    hideOutputs: (outputs) => ({}),
});

// 生成的追踪将包含其元数据，但输入将被隐藏
const filteredOAIClient = wrapOpenAI(new OpenAI(), {
    client: langsmithClient,
});
await filteredOAIClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello!" },
    ],
});

const openaiClient = wrapOpenAI(new OpenAI());
// 生成的追踪将不会隐藏输入和输出
await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello!" },
    ],
});
```

:::

## 隐藏元数据

`hide_metadata` 参数允许您在使用 LangSmith Python SDK 进行追踪时控制是否隐藏或转换运行元数据。元数据在创建运行时通过 `extra` 参数传递（例如，`extra={"metadata": {...}}`）。`hide_metadata` 对于移除敏感信息、满足隐私要求或减少发送到 LangSmith 的数据量非常有用。您可以通过两种方式配置元数据隐藏：

- 使用 SDK：

```python
from langsmith import Client

client = Client(hide_metadata=True)
```

- 使用环境变量：

```bash
export LANGSMITH_HIDE_METADATA=true
```

`hide_metadata` 参数接受三种类型的值：

- `True`：完全移除所有元数据（发送空字典）。
- `False` 或 `None`：按原样保留元数据（默认行为）。
- `Callable`：一个自定义函数，用于转换元数据字典。

设置后，此参数会影响 <a href="https://reference.langchain.com/python/langsmith/observability/sdk/client/#langsmith.client.Client" target="_blank" rel="noreferrer" class="link">Client</a> 创建或更新的所有运行的 `extra` 参数中的 `metadata` 字段，包括通过 `@traceable` 装饰器或 LangChain 集成创建的运行。

### 隐藏所有元数据

设置 `hide_metadata=True` 以完全从发送到 LangSmith 的运行中移除所有元数据：

```python
from langsmith import Client

# 完全隐藏所有元数据
client = Client(hide_metadata=True)

# 现在当您创建运行时，元数据将为空
client.create_run(
    "my_run",
    inputs={"question": "What is 2+2?"},
    run_type="llm",
    extra={"metadata": {"user_id": "123", "session": "abc"}}
)
# 发送到 LangSmith 的元数据将是 {} 而不是提供的元数据
```

### 自定义转换

使用可调用函数在元数据发送到 LangSmith 之前选择性地过滤、编辑或修改元数据：

```python
# 移除敏感键
def hide_sensitive_metadata(metadata: dict) -> dict:
    return {k: v for k, v in metadata.items() if not k.startswith("_private")}

client = Client(hide_metadata=hide_sensitive_metadata)

# 编辑特定值
def redact_emails(metadata: dict) -> dict:
    import re
    result = {}
    for k, v in metadata.items():
        if isinstance(v, str) and "@" in v:
            result[k] = "[REDACTED_EMAIL]"
        else:
            result[k] = v
    return result

client = Client(hide_metadata=redact_emails)

# 添加转换标记
def add_marker(metadata: dict) -> dict:
    return {**metadata, "transformed": True}

client = Client(hide_metadata=add_marker)
```

## 基于规则的输入输出掩码

<Info>

此功能在以下 LangSmith SDK 版本中可用：

* Python: 0.1.81 及以上
* TypeScript: 0.1.33 及以上

</Info>

要掩码输入和输出中的特定数据，您可以使用 `create_anonymizer` / `createAnonymizer` 函数，并在实例化 <a href="https://reference.langchain.com/python/langsmith/observability/sdk/client/#langsmith.client.Client" target="_blank" rel="noreferrer" class="link">Client</a> 时传递新创建的匿名化器。匿名化器可以从正则表达式模式列表和替换值构建，也可以从接受并返回字符串值的函数构建。

如果 `LANGSMITH_HIDE_INPUTS = true`，则匿名化器将跳过输入。对于输出，如果 `LANGSMITH_HIDE_OUTPUTS = true`，同样适用。

但是，如果输入或输出要发送到 <a href="https://reference.langchain.com/python/langsmith/observability/sdk/client/#langsmith.client.Client" target="_blank" rel="noreferrer" class="link">Client</a>，则 `anonymizer` 方法将优先于 `hide_inputs` 和 `hide_outputs` 中找到的函数。默认情况下，`create_anonymizer` 最多只查看 10 层嵌套深度，这可以通过 `max_depth` 参数进行配置。

::: code-group

```python [Python]
from langsmith.anonymizer import create_anonymizer
from langsmith import Client, traceable
import re

# 从正则表达式模式列表和替换值创建匿名化器
anonymizer = create_anonymizer([
    { "pattern": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}", "replace": "<email-address>" },
    { "pattern": r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}", "replace": "<UUID>" }
])

# 或从函数创建匿名化器
email_pattern = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}")
uuid_pattern = re.compile(r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")
anonymizer = create_anonymizer(
    lambda text: email_pattern.sub("<email-address>", uuid_pattern.sub("<UUID>", text))
)

client = Client(anonymizer=anonymizer)

@traceable(client=client)
def main(inputs: dict) -> dict:
    ...
```

```typescript [TypeScript]
import { createAnonymizer } from "langsmith/anonymizer"
import { traceable } from "langsmith/traceable"
import { Client } from "langsmith"

// 从正则表达式模式列表和替换值创建匿名化器
const anonymizer = createAnonymizer([
    { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/g, replace: "<email>" },
    { pattern: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, replace: "<uuid>" }
])

// 或从函数创建匿名化器
const anonymizer = createAnonymizer((value) => value.replace("...", "<value>"))

const client = new Client({ anonymizer })

const main = traceable(async (inputs: any) => {
    // ...
}, { client })
```

:::

请注意，使用匿名化器可能会因复杂的正则表达式或大型有效负载而导致性能下降，因为匿名化器在处理之前会将有效负载序列化为 JSON。

<Note>

改进 `anonymizer` API 的性能已在我们的路线图中！如果您遇到性能问题，请通过 [support.langchain.com](https://support.langchain.com) 联系支持。

</Note>

![隐藏输入输出](/langsmith/images/hide-inputs-outputs.png)

旧版本的 LangSmith SDK 可以使用 `hide_inputs` 和 `hide_outputs` 参数来实现相同的效果。您也可以使用这些参数来更高效地处理输入和输出。

::: code-group

```python [Python]
import re
from langsmith import Client, traceable

# 为电子邮件地址和 UUID 定义正则表达式模式
EMAIL_REGEX = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}"
UUID_REGEX = r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"

def replace_sensitive_data(data, depth=10):
    if depth == 0:
        return data
    if isinstance(data, dict):
        return {k: replace_sensitive_data(v, depth-1) for k, v in data.items()}
    elif isinstance(data, list):
        return [replace_sensitive_data(item, depth-1) for item in data]
    elif isinstance(data, str):
        data = re.sub(EMAIL_REGEX, "<email-address>", data)
        data = re.sub(UUID_REGEX, "<UUID>", data)
        return data
    else:
        return data

client = Client(
    hide_inputs=lambda inputs: replace_sensitive_data(inputs),
    hide_outputs=lambda outputs: replace_sensitive_data(outputs)
)

inputs = {"role": "user", "content": "Hello! My email is user@example.com and my ID is 123e4567-e89b-12d3-a456-426614174000."}
outputs = {"role": "assistant", "content": "Hi! I've noted your email as user@example.com and your ID as 123e4567-e89b-12d3-a456-426614174000."}

@traceable(client=client)
def child(inputs: dict) -> dict:
    return outputs

@traceable(client=client)
def parent(inputs: dict) -> dict:
    child_outputs = child(inputs)
    return child_outputs

parent(inputs)
```

```typescript [TypeScript]
import { Client } from "langsmith";
import { traceable } from "langsmith/traceable";

// 为电子邮件地址和 UUID 定义正则表达式模式
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/g;
const UUID_REGEX = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

function replaceSensitiveData(data: any, depth: number = 10): any {
    if (depth === 0) return data;
    if (typeof data === "object" && !Array.isArray(data)) {
        const result: Record<string, any> = {};
        for (const [key, value] of Object.entries(data)) {
            result[key] = replaceSensitiveData(value, depth - 1);
        }
        return result;
    } else if (Array.isArray(data)) {
        return data.map(item => replaceSensitiveData(item, depth - 1));
    } else if (typeof data === "string") {
        return data.replace(EMAIL_REGEX, "<email-address>").replace(UUID_REGEX, "<UUID>");
    } else {
        return data;
    }
}

const langsmithClient = new Client({
    hideInputs: (inputs) => replaceSensitiveData(inputs),
    hideOutputs: (outputs) => replaceSensitiveData(outputs)
});

const inputs = {
    role: "user",
    content: "Hello! My email is user@example.com and my ID is 123e4567-e89b-12d3-a456-426614174000."
};
const outputs = {
    role: "assistant",
    content: "Hi! I've noted your email as <email-address> and your ID as <UUID>."
};

const child = traceable(async (inputs: any) => {
    return outputs;
}, { name: "child", client: langsmithClient });

const parent = traceable(async (inputs: any) => {
    const childOutputs = await child(inputs);
    return childOutputs;
}, { name: "parent", client: langsmithClient });

await parent(inputs);
```

:::

## 处理单个函数的输入和输出

<Info>

`process_outputs` 参数在 LangSmith SDK Python 版本 0.1.98 及以上可用。

</Info>

除了 <a href="https://reference.langchain.com/python/langsmith/observability/sdk/client/#langsmith.client.Client" target="_blank" rel="noreferrer" class="link">Client</a> 级别的输入和输出处理外，LangSmith 还通过 `@traceable` 装饰器的 `process_inputs` 和 `process_outputs` 参数提供函数级别的处理。

这些参数接受函数，允许您在特定函数的输入和输出记录到 LangSmith 之前对其进行转换。这对于减少有效负载大小、移除敏感信息或自定义对象在 LangSmith 中应如何序列化和表示特定函数非常有用。

以下是使用 `process_inputs` 和 `process_outputs` 的示例：

```python
from langsmith import traceable

def process_inputs(inputs: dict) -> dict:
    # inputs 是一个字典，其中键是参数名，值是提供的参数
    # 返回一个包含处理后输入的新字典
    return {
        "processed_key": inputs.get("my_cool_key", "default"),
        "length": len(inputs.get("my_cool_key", ""))
    }

def process_outputs(output: Any) -> dict:
    # output 是函数的直接返回值
    # 将输出转换为字典
    # 在这种情况下，"output" 将是一个整数
    return {"processed_output": str(output)}

@traceable(process_inputs=process_inputs, process_outputs=process_outputs)
def my_function(my_cool_key: str) -> int:
    # 函数实现
    return len(my_cool_key)

result = my_function("example")
```

在此示例中，`process_inputs` 创建一个包含处理后输入数据的新字典，而 `process_outputs` 在记录到 LangSmith 之前将输出转换为特定格式。

<Warning>

建议避免在处理器函数中修改源对象。相反，应创建并返回包含处理后数据的新对象。

</Warning>

对于异步函数，用法类似：

```python
@traceable(process_inputs=process_inputs, process_outputs=process_outputs)
async def async_function(key: str) -> int:
    # 异步实现
    return len(key)
```

当两者都定义时，这些函数级别的处理器优先于 <a href="https://reference.langchain.com/python/langsmith/observability/sdk/client/#langsmith.client.Client" target="_blank" rel="noreferrer" class="link">Client</a> 级别的处理器（`hide_inputs` 和 `hide_outputs`）。

## 示例

您可以将基于规则的掩码与各种匿名化工具结合使用，以清理输入和输出中的敏感信息。以下示例将涵盖使用正则表达式、Microsoft Presidio 和 Amazon Comprehend。

### 正则表达式

<Info>

下面的实现并不详尽，可能会遗漏某些格式或边缘情况。在生产中使用任何实现之前，请彻底测试。

</Info>

您可以使用正则表达式在输入和输出发送到 LangSmith 之前对其进行掩码。下面的实现掩码了电子邮件地址、电话号码、全名、信用卡号码和社会安全号码。

```python
import re
import openai
from langsmith import Client
from langsmith.wrappers import wrap_openai

# 为各种 PII 定义正则表达式模式
SSN_PATTERN = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')
CREDIT_CARD_PATTERN = re.compile(r'\b(?:\d[ -]*?){13,16}\b')
EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
PHONE_PATTERN = re.compile(r'\b(?:\+?1[-.\s]?
