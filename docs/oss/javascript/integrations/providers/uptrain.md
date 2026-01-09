---
title: UpTrain
---
>[UpTrain](https://uptrain.ai/) 是一个用于评估和改进生成式 AI 应用的开源统一平台。它提供了 20 多种预配置评估的评分（涵盖语言、代码、嵌入向量等用例），对失败案例进行根因分析，并提供如何解决这些问题的见解。

## 安装与设置

::: code-group

```bash [pip]
pip install uptrain
```

```bash [uv]
uv add uptrain
```

:::

## 回调函数

```python
from langchain_community.callbacks.uptrain_callback import UpTrainCallbackHandler
```

查看一个[示例](/oss/integrations/callbacks/uptrain)。
