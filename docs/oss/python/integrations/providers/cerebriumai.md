---
title: CerebriumAI
---
>[Cerebrium](https://docs.cerebrium.ai/cerebrium/getting-started/introduction) 是一个无服务器 GPU 基础设施提供商。
> 它提供了对多个 LLM 模型的 API 访问。

请参阅 [CerebriumAI 文档](https://docs.cerebrium.ai/examples/langchain) 中的示例。

## 安装与设置

- 安装 Python 包：

::: code-group

```bash [pip]
pip install cerebrium
```

```bash [uv]
uv add cerebrium
```

:::

- [获取 CerebriumAI API 密钥](https://docs.cerebrium.ai/cerebrium/getting-started/installation) 并将其设置为环境变量 (`CEREBRIUMAI_API_KEY`)

## LLMs

请参阅 [使用示例](/oss/python/integrations/llms/cerebriumai)。

```python
from langchain_community.llms import CerebriumAI
```
