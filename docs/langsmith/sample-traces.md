---
title: 设置跟踪的采样率
sidebarTitle: Set a sampling rate for traces
---
在处理高流量应用时，你可能不希望将所有追踪记录都发送到 LangSmith。采样率允许你控制记录追踪的百分比，帮助你在可观测性需求和成本考量之间取得平衡。

## 设置全局采样率

<Note>

本节适用于使用 LangSmith SDK 或 LangChain 的用户，不适用于直接通过 LangSmith API 记录日志的情况。

</Note>

默认情况下，所有追踪都会被记录到 LangSmith。要减少记录到 LangSmith 的追踪数量，可以将 `LANGSMITH_TRACING_SAMPLING_RATE` 环境变量设置为 `0`（不记录任何追踪）到 `1`（记录所有追踪）之间的任意浮点数。例如，设置以下环境变量将记录 75% 的追踪。

```bash
export LANGSMITH_TRACING_SAMPLING_RATE=0.75
```

这适用于 `traceable` 装饰器和 `RunTree` 对象。

## 为不同客户端设置不同的采样率

你也可以在特定的 `Client` 实例上设置采样率，并使用 `tracing_context` 上下文管理器：

```python
from langsmith import Client, tracing_context

# 创建具有不同采样率的客户端
client_1 = Client(tracing_sampling_rate=0.5)  # 50% 采样率
client_2 = Client(tracing_sampling_rate=0.25)  # 25% 采样率
client_no_trace = Client(tracing_sampling_rate=0.0)  # 不追踪

# 为不同操作使用不同的采样率
with tracing_context(client=client_1):
    # 你的代码将使用 50% 采样率进行追踪
    agent_1.invoke(...)

with tracing_context(client=client_2):
    # 你的代码将使用 25% 采样率进行追踪
    agent_1.invoke(...)

with tracing_context(client=client_no_trace):
    # 你的代码将不会被追踪
    agent_1.invoke(...)
```

这允许你在操作级别控制采样率。
