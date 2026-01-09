---
title: 使用 AutoGen 进行追踪
sidebarTitle: AutoGen
---
LangSmith 可以通过 OpenInference 的 AutoGen 插桩功能捕获由 [AutoGen](https://microsoft.github.io/autogen/stable/) 生成的追踪数据。本指南将向您展示如何自动捕获来自 AutoGen 多智能体对话的追踪数据，并将其发送到 LangSmith 进行监控和分析。

## 安装

使用您偏好的包管理器安装所需的包：

::: code-group

```bash [pip]
pip install langsmith autogen openinference-instrumentation-autogen openinference-instrumentation-openai
```

```bash [uv]
uv add langsmith autogen openinference-instrumentation-autogen openinference-instrumentation-openai
```

:::

<Info>

为了获得最佳的 OpenTelemetry 支持，需要 LangSmith Python SDK 版本 `langsmith>=0.4.26`。

</Info>

## 设置

### 1. 配置环境变量

设置您的 API 密钥和项目名称：

::: code-group

```bash [Shell]
export LANGSMITH_API_KEY=<your_langsmith_api_key>
export LANGSMITH_PROJECT=<your_project_name>
export OPENAI_API_KEY=<your_openai_api_key>
```

:::

### 2. 配置 OpenTelemetry 集成

在您的 AutoGen 应用程序中，导入并配置 LangSmith 的 OpenTelemetry 集成，以及 AutoGen 和 OpenAI 的插桩器：

```python
from langsmith.integrations.otel import configure
from openinference.instrumentation.autogen import AutogenInstrumentor
from openinference.instrumentation.openai import OpenAIInstrumentor

# 配置 LangSmith 追踪
configure(project_name="autogen-demo")

# 插桩 AutoGen 和 OpenAI 调用
AutogenInstrumentor().instrument()
OpenAIInstrumentor().instrument()
```

<Note>

您无需手动设置任何 OpenTelemetry 环境变量或配置导出器——`configure()` 会自动处理所有事情。

</Note>

### 3. 创建并运行您的 AutoGen 应用程序

配置完成后，您的 AutoGen 应用程序将自动向 LangSmith 发送追踪数据：

```python
import autogen
from openinference.instrumentation.autogen import AutogenInstrumentor
from openinference.instrumentation.openai import OpenAIInstrumentor
from langsmith.integrations.otel import configure
import os
import dotenv

# 加载环境变量
dotenv.load_dotenv(".env.local")

# 配置 LangSmith 追踪
configure(project_name="autogen-code-review")

# 插桩 AutoGen 和 OpenAI
AutogenInstrumentor().instrument()
OpenAIInstrumentor().instrument()

# 配置您的智能体
config_list = [
    {
        "model": "gpt-4",
        "api_key": os.getenv("OPENAI_API_KEY"),
    }
]

# 创建代码审查员智能体
code_reviewer = autogen.AssistantAgent(
    name="code_reviewer",
    llm_config={"config_list": config_list},
    system_message="""You are an expert code reviewer. Your role is to:
    1. Review code for bugs, security issues, and best practices
    2. Suggest improvements and optimizations
    3. Provide constructive feedback
    Always be thorough but constructive in your reviews.""",
)

# 创建开发者智能体
developer = autogen.AssistantAgent(
    name="developer",
    llm_config={"config_list": config_list},
    system_message="""You are a senior software developer. Your role is to:
    1. Write clean, efficient code
    2. Address feedback from code reviews
    3. Explain your implementation decisions
    4. Implement requested features and fixes""",
)

# 创建用户代理智能体
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=8,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={"work_dir": "workspace"},
    llm_config={"config_list": config_list},
)

def run_code_review_session(task_description: str):
    """Run a multi-agent code review session."""

    # 使用智能体创建群聊
    groupchat = autogen.GroupChat(
        agents=[user_proxy, developer, code_reviewer],
        messages=[],
        max_round=10
    )

    # 创建群聊管理器
    manager = autogen.GroupChatManager(
        groupchat=groupchat,
        llm_config={"config_list": config_list}
    )

    # 开始对话
    user_proxy.initiate_chat(
        manager,
        message=f"""
        Task: {task_description}

        Developer: Please implement the requested feature.
        Code Reviewer: Please review the implementation and provide feedback.

        Work together to create a high-quality solution.
        """
    )

    return "Code review session completed"

# 示例用法
if __name__ == "__main__":
    task = """
    Create a Python function that implements a binary search algorithm.
    The function should:
    - Take a sorted list and a target value as parameters
    - Return the index of the target if found, or -1 if not found
    - Include proper error handling and documentation
    """

    result = run_code_review_session(task)
    print(f"Result: {result}")
```

## 高级用法

### 自定义元数据和标签

您可以通过在 AutoGen 应用程序中设置跨度（span）属性来为追踪数据添加自定义元数据：

```python
from opentelemetry import trace

# 获取当前的追踪器
tracer = trace.get_tracer(__name__)

def run_code_review_session(task_description: str):
    with tracer.start_as_current_span("autogen_code_review") as span:
        # 添加自定义元数据
        span.set_attribute("langsmith.metadata.session_type", "code_review")
        span.set_attribute("langsmith.metadata.agent_count", "3")
        span.set_attribute("langsmith.metadata.task_complexity", "medium")
        span.set_attribute("langsmith.span.tags", "autogen,code-review,multi-agent")

        # 您的 AutoGen 代码放在这里
        groupchat = autogen.GroupChat(
            agents=[user_proxy, developer, code_reviewer],
            messages=[],
            max_round=10
        )

        manager = autogen.GroupChatManager(
            groupchat=groupchat,
            llm_config={"config_list": config_list}
        )

        user_proxy.initiate_chat(manager, message=task_description)
        return "Session completed"
```

### 与其他插桩器结合使用

您可以将 AutoGen 插桩与其他插桩器（例如 Semantic Kernel、DSPy）结合使用，只需将它们添加并初始化为插桩器即可：

```python
from langsmith.integrations.otel import configure
from openinference.instrumentation.autogen import AutogenInstrumentor
from openinference.instrumentation.openai import OpenAIInstrumentor
from openinference.instrumentation.dspy import DSPyInstrumentor

# 配置 LangSmith 追踪
configure(project_name="multi-framework-app")

# 初始化多个插桩器
AutogenInstrumentor().instrument()
OpenAIInstrumentor().instrument()
DSPyInstrumentor().instrument()

# 您使用多个框架的应用程序代码
```
