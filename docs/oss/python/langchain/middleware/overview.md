---
title: 概述
description: 控制和自定义代理执行的每一步
---
中间件提供了一种更精细控制智能体内部行为的方式。中间件在以下场景中非常有用：

- 通过日志记录、分析和调试来追踪智能体行为。
- 转换提示、[工具选择](/oss/python/langchain/middleware/built-in#llm-tool-selector)和输出格式。
- 添加[重试](/oss/python/langchain/middleware/built-in#tool-retry)、[回退](/oss/python/langchain/middleware/built-in#model-fallback)和提前终止逻辑。
- 应用[速率限制](/oss/python/langchain/middleware/built-in#model-call-limit)、护栏和[PII检测](/oss/python/langchain/middleware/built-in#pii-detection)。

通过传递给 <a href="https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent" target="_blank" rel="noreferrer" class="link"><code>create_agent</code></a> 来添加中间件：

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware, HumanInTheLoopMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[...],
    middleware=[
        SummarizationMiddleware(...),
        HumanInTheLoopMiddleware(...)
    ],
)
```

## 智能体循环

核心的智能体循环包括调用模型、让其选择要执行的工具，并在其不再调用工具时结束：

<img src="/oss/images/core_agent_loop.png" alt="核心智能体循环示意图" />

中间件在每个步骤之前和之后暴露了钩子：

<img src="/oss/images/middleware_final.png" alt="中间件流程图" />

## 其他资源

<CardGroup :cols="2">

<Card title="内置中间件" icon="box" href="/oss/langchain/middleware/built-in">

探索常见用例的内置中间件。

</Card>

<Card title="自定义中间件" icon="code" href="/oss/langchain/middleware/custom">

使用钩子和装饰器构建你自己的中间件。

</Card>

<Card title="中间件 API 参考" icon="book" href="https://reference.langchain.com/python/langchain/middleware/">

完整的中间件 API 参考。

</Card>

<Card title="测试智能体" icon="scale-unbalanced" href="/oss/langchain/test">

使用 LangSmith 测试你的智能体。

</Card>

</CardGroup>

