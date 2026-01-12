---
title: Argilla
---
>[Argilla](https://argilla.io/) 是一个用于大语言模型的开源数据管理平台。
> 通过使用 `Argilla`，每个人都可以利用人类和机器的反馈，通过更快的数据管理来构建稳健的语言模型。
> `Argilla` 为 MLOps 周期的每一步提供支持，从数据标注到模型监控。

## 安装与设置

获取你的 [API 密钥](https://platform.openai.com/account/api-keys)。

安装 Python 包：

::: code-group

```bash [pip]
pip install argilla
```

```bash [uv]
uv add argilla
```

:::

## 回调函数

```python
from langchain.callbacks import ArgillaCallbackHandler
```

查看一个[示例](/oss/python/integrations/callbacks/argilla)。
