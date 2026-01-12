---
title: Label Studio
---
>[Label Studio](https://labelstud.io/guide/get_started) 是一个开源的数据标注平台，它为 LangChain 在为大语言模型（LLMs）微调进行数据标注时提供了灵活性。它还支持准备自定义训练数据，并通过人工反馈来收集和评估响应。

## 安装与设置

有关安装选项，请参阅 [Label Studio 安装指南](https://labelstud.io/guide/install)。

我们需要安装 `label-studio` 和 `label-studio-sdk-python` Python 包：

::: code-group

```bash [pip]
pip install label-studio label-studio-sdk
```

```bash [uv]
uv add label-studio label-studio-sdk
```

:::

## 回调函数

请参阅 [使用示例](/oss/python/integrations/callbacks/labelstudio)。

```python
from langchain.callbacks import LabelStudioCallbackHandler
```
