---
title: 实验配置
sidebarTitle: Experiment configuration
---
LangSmith 为实验提供了多种配置选项：

- [重复次数](#repetitions)
- [并发控制](#concurrency)
- [缓存](#caching)

### 重复次数

_重复次数_ 通过多次运行实验来考量 LLM 输出的变异性。由于 LLM 输出具有非确定性，多次重复能提供更准确的性能评估。

通过向 `evaluate` / `aevaluate` 传递 `num_repetitions` 参数来配置重复次数（[Python](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._runner.evaluate), [TypeScript](https://docs.smith.langchain.com/reference/js/interfaces/evaluation.EvaluateOptions#numrepetitions)）。每次重复都会重新运行目标函数和所有评估器。

了解更多信息，请参阅 [重复次数操作指南](/langsmith/repetition)。

### 并发控制

_并发控制_ 决定了实验期间同时运行的示例数量。通过向 `evaluate` / `aevaluate` 传递 `max_concurrency` 参数来配置它。这两个函数的语义有所不同：

#### `evaluate`

`max_concurrency` 参数指定了运行目标函数和评估器时的最大并发线程数。

#### `aevaluate`

`max_concurrency` 参数使用信号量来限制并发任务数。`aevaluate` 为每个示例创建一个任务，每个任务运行该示例的目标函数和所有评估器。`max_concurrency` 参数指定了要同时处理的最大并发示例数。

### 缓存

_缓存_ 将 API 调用结果存储到磁盘，以加速未来的实验。将 `LANGSMITH_TEST_CACHE` 环境变量设置为一个具有写入权限的有效文件夹路径。未来进行相同 API 调用的实验将重用缓存结果，而不是发起新的请求。
