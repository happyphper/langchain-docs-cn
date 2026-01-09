---
title: 如何打印详细日志（Python SDK）
sidebarTitle: Print detailed logs (Python SDK)
---
LangSmith 包使用 Python 内置的日志机制，将其行为日志输出到标准输出。

## 确保日志配置正确

<Note>

默认情况下，Jupyter notebooks 将日志发送到标准错误而非标准输出，这意味着除非您按照以下方式配置日志，否则日志不会显示在 notebook 单元格的输出中。

</Note>

如果您的 Python 环境当前未配置为将日志发送到标准输出，您需要按如下方式显式开启：

```python
import logging
# 注意：这将影响所有使用 Python 内置日志机制的包，
#       因此可能会增加您的日志量。请根据您的使用场景选择合适的日志级别。
logging.basicConfig(level=logging.WARNING)
```

## 提高日志记录的详细程度

在调试问题时，将日志级别提高到更详细的级别有助于输出更多信息到标准输出。Python 日志记录器默认使用 `WARNING` 日志级别，但您可以选择不同的值来获得不同的详细程度。这些值从最不详细到最详细依次是 `ERROR`、`WARNING`、`INFO` 和 `DEBUG`。您可以按如下方式设置：

```python
import langsmith
import logging

# 日志记录器是层次结构的，因此在 "langsmith" 上设置日志级别
# 将同时设置 "langsmith" 包内所有模块的日志级别
langsmith_logger = logging.getLogger("langsmith")
langsmith_logger.setLevel(level=logging.DEBUG)
```
