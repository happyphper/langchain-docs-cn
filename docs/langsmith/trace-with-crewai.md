---
title: 使用 CrewAI 进行追踪
sidebarTitle: CrewAI
---
LangSmith 可以通过 OpenInference 的 CrewAI 插桩工具捕获 [CrewAI](https://github.com/crewAIInc/crewAI) 生成的追踪信息。本指南将向您展示如何自动捕获来自 CrewAI 多智能体工作流的追踪信息，并将其发送到 LangSmith 进行监控和分析。

## 安装

使用您偏好的包管理器安装所需的包：

::: code-group

```bash [pip]
pip install langsmith crewai openinference-instrumentation-crewai openinference-instrumentation-openai
```

```bash [uv]
uv add langsmith crewai openinference-instrumentation-crewai openinference-instrumentation-openai
```

:::

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

在您的 CrewAI 应用程序中，导入并配置 LangSmith 的 OpenTelemetry 集成，以及 CrewAI 和 OpenAI 的插桩器：

```python
from langsmith.integrations.otel import OtelSpanProcessor
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from openinference.instrumentation.crewai import CrewAIInstrumentor
from openinference.instrumentation.openai import OpenAIInstrumentor

# 获取或创建追踪器提供者
tracer_provider = trace.get_tracer_provider()
if not isinstance(tracer_provider, TracerProvider):
    tracer_provider = TracerProvider()
    trace.set_tracer_provider(tracer_provider)

# 将 OtelSpanProcessor 添加到追踪器提供者
tracer_provider.add_span_processor(OtelSpanProcessor())

# 插桩 CrewAI 和 OpenAI
CrewAIInstrumentor().instrument()
OpenAIInstrumentor().instrument()
```

### 3. 创建并运行您的 CrewAI 应用程序

配置完成后，您的 CrewAI 应用程序将自动向 LangSmith 发送追踪信息：

此示例包含一个最小化的应用程序，它定义了智能体和任务，创建了一个团队（crew）并运行它，以生成可追踪的活动。

```python
from crewai import Agent, Task, Crew
from langsmith.integrations.otel import OtelSpanProcessor
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from openinference.instrumentation.crewai import CrewAIInstrumentor
from openinference.instrumentation.openai import OpenAIInstrumentor
import dotenv

# 加载环境变量
dotenv.load_dotenv(".env.local")

# 配置 OpenTelemetry
tracer_provider = trace.get_tracer_provider()
if not isinstance(tracer_provider, TracerProvider):
    tracer_provider = TracerProvider()
    trace.set_tracer_provider(tracer_provider)

# 将 OtelSpanProcessor 添加到追踪器提供者
tracer_provider.add_span_processor(OtelSpanProcessor())

# 插桩 CrewAI 和 OpenAI
CrewAIInstrumentor().instrument()
OpenAIInstrumentor().instrument()

# 定义您的智能体
market_researcher = Agent(
    role="Senior Market Researcher",
    goal="Analyze market trends and consumer behavior in the tech industry",
    backstory="""You are an experienced market researcher with 10+ years of experience
    analyzing technology markets. You excel at identifying emerging trends and
    understanding consumer needs.""",
    verbose=True,
    allow_delegation=False,
)

content_strategist = Agent(
    role="Content Marketing Strategist",
    goal="Create compelling marketing content based on research insights",
    backstory="""You are a creative content strategist who transforms complex market
    research into engaging marketing materials. You understand how to communicate
    technical concepts to different audiences.""",
    verbose=True,
    allow_delegation=False,
)

data_analyst = Agent(
    role="Data Analyst",
    goal="Provide statistical analysis and data-driven insights",
    backstory="""You are a skilled data analyst who can interpret complex datasets
    and provide actionable insights. You excel at finding patterns and trends
    in data that others might miss.""",
    verbose=True,
    allow_delegation=False,
)

# 定义您的任务
research_task = Task(
    description="""Conduct comprehensive research on the current state of AI adoption
    in small to medium businesses. Focus on:
    1. Current adoption rates and trends
    2. Main barriers to adoption
    3. Most popular AI tools and use cases
    4. ROI and business impact metrics

    Provide a detailed analysis with supporting data and statistics.""",
    agent=market_researcher,
    expected_output="A comprehensive market research report on AI adoption in SMBs with data, trends, and insights.",
)

analysis_task = Task(
    description="""Analyze the research findings and identify key statistical patterns.
    Create data visualizations and provide quantitative insights on:
    1. Adoption rate trends over time
    2. Industry-specific adoption patterns
    3. ROI correlation analysis
    4. Barrier impact assessment

    Present findings in a clear, data-driven format.""",
    agent=data_analyst,
    expected_output="Statistical analysis report with key metrics, trends, and data-driven insights.",
    context=[research_task],
)

content_task = Task(
    description="""Based on the research and analysis, create a compelling marketing
    strategy document that includes:
    1. Executive summary of key findings
    2. Target audience personas based on adoption patterns
    3. Key messaging framework addressing main barriers
    4. Content recommendations for different business segments
    5. Campaign strategy to drive AI adoption

    Make the content actionable and business-focused.""",
    agent=content_strategist,
    expected_output="Complete marketing strategy document with personas, messaging, and campaign recommendations.",
    context=[research_task, analysis_task],
)

# 创建并运行团队
crew = Crew(
    agents=[market_researcher, data_analyst, content_strategist],
    tasks=[research_task, analysis_task, content_task],
    verbose=True,
    process="sequential"  # 任务将按顺序执行
)

def run_market_research_crew():
    """Run the market research crew and return results."""
    result = crew.kickoff()
    return result

if __name__ == "__main__":
    print("Running CrewAI market research process...")
    output = run_market_research_crew()
    print("\n" + "="*50)
    print("CrewAI Process Output:")
    print("="*50)
    print(output)
```

## 高级用法

### 自定义元数据和标签

您可以通过在 CrewAI 应用程序中设置跨度（span）属性来向追踪信息添加自定义元数据：

```python
from opentelemetry import trace

# 获取当前追踪器
tracer = trace.get_tracer(__name__)

def run_market_research_crew():
    with tracer.start_as_current_span("crewai_market_research") as span:
        # 添加自定义元数据
        span.set_attribute("langsmith.metadata.crew_type", "market_research")
        span.set_attribute("langsmith.metadata.agent_count", "3")
        span.set_attribute("langsmith.metadata.task_complexity", "high")
        span.set_attribute("langsmith.span.tags", "crewai,market-research,multi-agent")

        # 运行您的团队
        result = crew.kickoff()
        return result
```

### 与其他插桩器结合使用

您可以通过将其他插桩器添加到您的设置中，将 CrewAI 插桩与其他插桩器结合使用：

```python
from openinference.instrumentation.crewai import CrewAIInstrumentor
from openinference.instrumentation.openai import OpenAIInstrumentor
from openinference.instrumentation.dspy import DSPyInstrumentor

# 初始化多个插桩器
CrewAIInstrumentor().instrument()
OpenAIInstrumentor().instrument()
DSPyInstrumentor().instrument()
```
