---
title: LLMonitor
---
>[LLMonitor](https://llmonitor.com?utm_source=langchain&utm_medium=py&utm_campaign=docs) 是一个开源的可观测性平台，提供成本和用量分析、用户追踪、链路追踪和评估工具。

## 安装与设置

在 [llmonitor.com](https://llmonitor.com?utm_source=langchain&utm_medium=py&utm_campaign=docs) 上创建一个账户，然后复制您新应用的 `tracking id`。

获取到该 ID 后，通过运行以下命令将其设置为环境变量：

```bash
export LLMONITOR_APP_ID="..."
```

## 回调函数

查看[使用示例](/oss/python/integrations/callbacks/llmonitor)。

```python
from langchain.callbacks import LLMonitorCallbackHandler
```
