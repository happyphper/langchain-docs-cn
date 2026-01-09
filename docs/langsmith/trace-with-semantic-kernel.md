---
title: 使用 Semantic Kernel 进行追踪
sidebarTitle: Semantic Kernel
---
LangSmith 可以通过 OpenInference 的 OpenAI 仪表化功能捕获由 [Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/) 生成的追踪数据。本指南将向您展示如何自动捕获来自 Semantic Kernel 应用程序的追踪数据并将其发送到 LangSmith 进行监控和分析。

## 安装

使用您偏好的包管理器安装所需的包：

::: code-group

```bash [pip]
pip install langsmith semantic-kernel openinference-instrumentation-openai
```

```bash [uv]
uv add langsmith semantic-kernel openinference-instrumentation-openai
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

在您的 Semantic Kernel 应用程序中，导入并配置 LangSmith 的 OpenTelemetry 集成以及 OpenAI 仪表化器：

```python
from langsmith.integrations.otel import configure
from openinference.instrumentation.openai import OpenAIInstrumentor

# 配置 LangSmith 追踪
configure(project_name="semantic-kernel-demo")

# 仪表化 OpenAI 调用
OpenAIInstrumentor().instrument()
```

<Note>

您无需手动设置任何 OpenTelemetry 环境变量或配置导出器——`configure()` 会自动处理所有事情。

</Note>

### 3. 创建并运行您的 Semantic Kernel 应用程序

配置完成后，您的 Semantic Kernel 应用程序将自动向 LangSmith 发送追踪数据：

此示例包含一个最小化的应用程序，它配置了内核（kernel），定义了基于提示的函数，并调用它们以生成被追踪的活动。

```python
import os
import asyncio
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.prompt_template import InputVariable, PromptTemplateConfig
from openinference.instrumentation.openai import OpenAIInstrumentor
from langsmith.integrations.otel import configure
import dotenv

# 加载环境变量
dotenv.load_dotenv(".env.local")

# 配置 LangSmith 追踪
configure(project_name="semantic-kernel-assistant")

# 仪表化 OpenAI 调用
OpenAIInstrumentor().instrument()

# 配置 Semantic Kernel
kernel = Kernel()
kernel.add_service(OpenAIChatCompletion())

# 创建代码分析提示模板
code_analysis_prompt = """
Analyze the following code and provide insights:

Code: {{$code}}

Please provide:
1. A brief summary of what the code does
2. Any potential improvements
3. Code quality assessment
"""

prompt_template_config = PromptTemplateConfig(
    template=code_analysis_prompt,
    name="code_analyzer",
    template_format="semantic-kernel",
    input_variables=[
        InputVariable(name="code", description="The code to analyze", is_required=True),
    ],
)

# 将函数添加到内核
code_analyzer = kernel.add_function(
    function_name="analyzeCode",
    plugin_name="codeAnalysisPlugin",
    prompt_template_config=prompt_template_config,
)

# 创建文档生成器
doc_prompt = """
Generate comprehensive documentation for the following function:

{{$function_code}}

Include:
- Purpose and functionality
- Parameters and return values
- Usage examples
- Any important notes
"""

doc_template_config = PromptTemplateConfig(
    template=doc_prompt,
    name="doc_generator",
    template_format="semantic-kernel",
    input_variables=[
        InputVariable(name="function_code", description="The function code to document", is_required=True),
    ],
)

doc_generator = kernel.add_function(
    function_name="generateDocs",
    plugin_name="documentationPlugin",
    prompt_template_config=doc_template_config,
)

async def main():
    # 要分析的示例代码
    sample_code = """
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
    """

    # 分析代码
    analysis_result = await kernel.invoke(code_analyzer, code=sample_code)
    print("Code Analysis:")
    print(analysis_result)
    print("\n" + "="*50 + "\n")

    # 生成文档
    doc_result = await kernel.invoke(doc_generator, function_code=sample_code)
    print("Generated Documentation:")
    print(doc_result)

    return {"analysis": str(analysis_result), "documentation": str(doc_result)}

if __name__ == "__main__":
    asyncio.run(main())
```

## 高级用法

### 自定义元数据和标签

您可以通过设置跨度（span）属性来向追踪数据添加自定义元数据：

```python
from opentelemetry import trace

# 获取当前的追踪器
tracer = trace.get_tracer(__name__)

async def main():
    with tracer.start_as_current_span("semantic_kernel_workflow") as span:
        # 添加自定义元数据
        span.set_attribute("langsmith.metadata.workflow_type", "code_analysis")
        span.set_attribute("langsmith.metadata.user_id", "developer_123")
        span.set_attribute("langsmith.span.tags", "semantic-kernel,code-analysis")

        # 您的 Semantic Kernel 代码放在这里
        result = await kernel.invoke(code_analyzer, code=sample_code)
        return result
```

### 与其他仪表化器结合使用

您可以将 Semantic Kernel 仪表化与其他仪表化器（例如 DSPy、AutoGen）结合使用，只需将它们添加并初始化为仪表化器即可：

```python
from langsmith.integrations.otel import configure
from openinference.instrumentation.openai import OpenAIInstrumentor
from openinference.instrumentation.dspy import DSPyInstrumentor

# 配置 LangSmith 追踪
configure(project_name="multi-framework-app")

# 初始化多个仪表化器
OpenAIInstrumentor().instrument()
DSPyInstrumentor().instrument()

# 使用多个框架的应用程序代码
```
