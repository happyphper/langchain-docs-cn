---
title: Trubrics
---
>[Trubrics](https://trubrics.com) 是一个 LLM 用户分析平台，可让您收集、分析和管理 AI 模型的用户提示与反馈。
>
>查看 [Trubrics 仓库](https://github.com/trubrics/trubrics-sdk) 以获取有关 `Trubrics` 的更多信息。

## 安装与设置

我们需要安装 `trubrics` Python 包：

::: code-group

```bash [pip]
pip install trubrics
```

```bash [uv]
uv add trubrics
```

:::

## 回调函数

查看 [使用示例](/oss/integrations/callbacks/trubrics)。

```python
from langchain.callbacks import TrubricsCallbackHandler
```
