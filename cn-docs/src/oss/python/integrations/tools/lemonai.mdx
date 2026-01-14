---
title: 柠檬代理
---
>[Lemon Agent](https://github.com/felixbrock/lemon-agent) 帮助您在几分钟内构建强大的 AI 助手并自动化工作流，它支持在 `Airtable`、`Hubspot`、`Discord`、`Notion`、`Slack` 和 `GitHub` 等工具中进行准确可靠的读写操作。

查看[完整文档](https://github.com/felixbrock/lemonai-py-client)。

目前大多数可用的连接器都专注于只读操作，限制了大型语言模型（LLM）的潜力。另一方面，智能体（Agent）由于缺乏上下文或指令，有时会产生幻觉（hallucinate）。

借助 `Lemon AI`，您可以让您的智能体访问定义良好的 API，以执行可靠的读写操作。此外，`Lemon AI` 函数允许您通过静态定义工作流的方式，进一步降低幻觉风险，模型在不确定时可以依赖这些预定义的工作流。

## 快速开始

以下快速入门演示了如何将 Lemon AI 与智能体结合使用，以自动化涉及与内部工具交互的工作流。

### 1. 安装 Lemon AI

需要 Python 3.8.1 或更高版本。

要在您的 Python 项目中使用 Lemon AI，请运行 `pip install lemonai`

这将安装相应的 Lemon AI 客户端，然后您可以将其导入到脚本中。

该工具使用 Python 包 langchain 和 loguru。如果安装 Lemon AI 时出现任何错误，请先安装这两个包，然后再安装 Lemon AI 包。

### 2. 启动服务器

您的智能体与 Lemon AI 提供的所有工具之间的交互由 [Lemon AI 服务器](https://github.com/felixbrock/lemonai-server)处理。要使用 Lemon AI，您需要在本地机器上运行该服务器，以便 Lemon AI Python 客户端可以连接到它。

### 3. 将 Lemon AI 与 LangChain 结合使用

Lemon AI 通过找到相关工具的正确组合来自动解决给定任务，或者使用 Lemon AI 函数作为替代方案。以下示例演示了如何从 Hackernews 检索用户并将其写入 Airtable 的表格中：

#### （可选）定义您的 Lemon AI 函数

与 [OpenAI 函数](https://openai.com/blog/function-calling-and-other-api-updates)类似，Lemon AI 提供了将工作流定义为可重用函数的选项。这些函数可以定义用于那些特别需要尽可能接近确定性行为的用例。特定的工作流可以在单独的 lemonai.json 文件中定义：

```json
[
  {
    "name": "Hackernews Airtable 用户工作流",
    "description": "从 Hackernews 检索用户数据并将其追加到 Airtable 的表格中",
    "tools": ["hackernews-get-user", "airtable-append-data"]
  }
]
```

您的模型将可以访问这些函数，并且在解决给定任务时，会优先使用这些函数而不是自行选择工具。您只需要通过在提示中包含函数名称来让智能体知道它应该使用给定的函数。

#### 在您的 LangChain 项目中引入 Lemon AI

```python
import os

from langchain_openai import OpenAI
from lemonai import execute_workflow
```

#### 加载 API 密钥和访问令牌

要使用需要身份验证的工具，您必须将相应的访问凭据以 `"{工具名称}_{身份验证字符串}"` 的格式存储在环境变量中，其中身份验证字符串对于 API 密钥是 ["API_KEY", "SECRET_KEY", "SUBSCRIPTION_KEY", "ACCESS_KEY"] 之一，对于身份验证令牌是 ["ACCESS_TOKEN", "SECRET_TOKEN"] 之一。例如 "OPENAI_API_KEY"、"BING_SUBSCRIPTION_KEY"、"AIRTABLE_ACCESS_TOKEN"。

```python
""" 将所有相关的 API 密钥和访问令牌加载到您的环境变量中 """
os.environ["OPENAI_API_KEY"] = "*在此处插入 OPENAI API 密钥*"
os.environ["AIRTABLE_ACCESS_TOKEN"] = "*在此处插入 AIRTABLE 令牌*"
```

```python
hackernews_username = "*在此处插入 HACKERNEWS 用户名*"
airtable_base_id = "*在此处插入 BASE ID*"
airtable_table_id = "*在此处插入 TABLE ID*"

""" 定义要提供给您的 LLM 的指令 """
prompt = f"""从 Hackernews 读取用户 {hackernews_username} 的信息，然后将结果写入
Airtable (baseId: {airtable_base_id}, tableId: {airtable_table_id})。只写入 "username"、"karma"
和 "created_at_i" 字段。请确保 Airtable 不会自动转换字段类型。
"""

"""
使用 Lemon AI 的 execute_workflow 包装器
来结合 Lemon AI 运行您的 LangChain 智能体
"""
model = OpenAI(temperature=0)

execute_workflow(llm=model, prompt_string=prompt)
```

### 4. 获取智能体决策过程的透明度

为了了解您的智能体如何与 Lemon AI 工具交互以解决给定任务，所有做出的决策、使用的工具和执行的操作都会被写入本地的 `lemonai.log` 文件。每次您的 LLM 智能体与 Lemon AI 工具栈交互时，都会创建一个相应的日志条目。

```log
2023-06-26T11:50:27.708785+0100 - b5f91c59-8487-45c2-800a-156eac0c7dae - hackernews-get-user
2023-06-26T11:50:39.624035+0100 - b5f91c59-8487-45c2-800a-156eac0c7dae - airtable-append-data
2023-06-26T11:58:32.925228+0100 - 5efe603c-9898-4143-b99a-55b50007ed9d - hackernews-get-user
2023-06-26T11:58:43.988788+0100 - 5efe603c-9898-4143-b99a-55b50007ed9d - airtable-append-data
```

通过使用 [Lemon AI 分析工具](https://github.com/felixbrock/lemon-agent/blob/main/apps/analytics/README.md)，您可以轻松地更好地了解工具的使用频率和顺序。因此，您可以识别智能体决策能力中的薄弱环节，并通过定义 Lemon AI 函数转向更确定性的行为。
