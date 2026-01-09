---
title: Arize
---
[Arize](https://arize.com) 是一个 AI 可观测性和 LLM 评估平台，它为 LangChain 应用程序提供支持，能够详细追踪输入、嵌入向量、检索、函数和输出消息。

## 安装与设置

首先，你需要安装 `arize` Python 包。

::: code-group

```bash [pip]
pip install arize
```

```bash [uv]
uv add arize
```

:::

其次，你需要设置你的 [Arize 账户](https://app.arize.com/auth/join) 并获取你的 `API_KEY` 或 `SPACE_KEY`。

## 回调处理器

```python
from langchain_community.callbacks import ArizeCallbackHandler
```
