---
title: Confident AI
---
>[Confident AI](https://confident-ai.com) 是 `DeepEval` 的创建者。

>[DeepEval](https://github.com/confident-ai/deepeval) 是一个用于对大型语言模型（LLM）进行单元测试的软件包。
> 使用 `DeepEval`，每个人都可以通过更快的迭代，利用单元测试和集成测试来构建健壮的语言模型。`DeepEval` 为从合成数据创建到测试的每个迭代步骤提供支持。

## 安装与设置

你需要获取 [DeepEval API 凭证](https://app.confident-ai.com)。

你需要安装 `DeepEval` Python 包：

::: code-group

```bash [pip]
pip install deepeval
```

```bash [uv]
uv add deepeval
```

:::

## 回调函数

查看一个[示例](/oss/integrations/callbacks/confident)。

```python
from langchain.callbacks.confident_callback import DeepEvalCallbackHandler
```
