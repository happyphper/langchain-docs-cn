---
title: StochasticAI
---
本页介绍了如何在 LangChain 中使用 StochasticAI 生态系统。
内容分为两部分：安装与设置，以及特定 StochasticAI 封装器的参考。

## 安装与设置
- 使用 `pip install stochasticx` 安装
- 获取 StochasticAI API 密钥，并将其设置为环境变量 (`STOCHASTICAI_API_KEY`)

## 封装器

### LLM

提供了一个 StochasticAI LLM 封装器，您可以通过以下方式访问：

```python
from langchain_community.llms import StochasticAI
```
