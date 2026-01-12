---
title: 梯度
---
>[Gradient](https://gradient.ai/) 允许通过简单的 Web API 对 LLM 进行微调并获取补全结果。

## 安装与设置
- 安装 Python SDK：

::: code-group

```bash [pip]
pip install gradientai
```

```bash [uv]
uv add gradientai
```

:::

获取 [Gradient 访问令牌和工作区](https://gradient.ai/)，并将其设置为环境变量 (`Gradient_ACCESS_TOKEN`) 和 (`GRADIENT_WORKSPACE_ID`)

## LLM

存在一个 Gradient LLM 封装器，您可以通过以下方式访问：
查看[使用示例](/oss/python/integrations/llms/gradient)。

```python
from langchain_community.llms import GradientLLM
```

## 文本嵌入模型

存在一个 Gradient 嵌入模型，您可以通过以下方式访问：

```python
from langchain_community.embeddings import GradientEmbeddings
```
关于更详细的步骤说明，请参阅[此笔记本](/oss/python/integrations/text_embedding/gradient)
