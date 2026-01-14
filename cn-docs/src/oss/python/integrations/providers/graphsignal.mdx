---
title: Graphsignal
---
本页介绍如何使用 [Graphsignal](https://app.graphsignal.com) 对 LangChain 进行追踪和监控。Graphsignal 能够为您的应用程序提供完整的可见性。它支持按链和工具进行延迟细分、包含完整上下文的异常信息、数据监控、计算/GPU 利用率分析、OpenAI 成本分析等功能。

## 安装与设置

- 使用 `pip install graphsignal` 安装 Python 库
- 在此处创建免费的 Graphsignal 账户：[https://graphsignal.com](https://graphsignal.com)
- 获取 API 密钥并将其设置为环境变量 (`GRAPHSIGNAL_API_KEY`)

## 追踪与监控

Graphsignal 会自动对链进行插桩并开始追踪和监控。随后，您可以在 [Graphsignal 仪表板](https://app.graphsignal.com) 中查看追踪记录和指标。

通过提供部署名称来初始化追踪器：

```python
import graphsignal

graphsignal.configure(deployment='my-langchain-app-prod')
```

若要额外追踪任何函数或代码，您可以使用装饰器或上下文管理器：

```python
@graphsignal.trace_function
def handle_request():
    chain.run("some initial text")
```

```python
with graphsignal.start_trace('my-chain'):
    chain.run("some initial text")
```

可选地，启用性能分析以记录每个追踪的函数级统计信息。

```python
with graphsignal.start_trace(
        'my-chain', options=graphsignal.TraceOptions(enable_profiling=True)):
    chain.run("some initial text")
```

完整的设置说明请参阅 [快速入门](https://graphsignal.com/docs/guides/quick-start/) 指南。
