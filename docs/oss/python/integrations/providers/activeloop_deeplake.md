---
title: Activeloop Deep Lake
---
>[Activeloop Deep Lake](https://docs.activeloop.ai/) 是一个面向深度学习应用的数据湖，您也可以将其用作向量存储。

## 为何选择 Deep Lake？

- 不仅仅是一个（多模态）向量存储。您之后还可以使用该数据集来微调您自己的 LLM 模型。
- 不仅存储嵌入向量，还通过自动版本控制存储原始数据。
- 真正的无服务器化。无需其他服务，可与主流云提供商（`AWS S3`、`GCS` 等）配合使用。

## 更多资源

1. [LangChain & Deep Lake 终极指南：构建 ChatGPT 来回答您的财务数据问题](https://www.activeloop.ai/resources/ultimate-guide-to-lang-chain-deeplake-build-chat-gpt-to-answer-questions-on-your-financial-data/)
2. [使用 Deep Lake 分析 Twitter the-algorithm 代码库](https://github.com/langchain-ai/langchain/blob/v0.3/cookbook/twitter-the-algorithm-analysis-deeplake.ipynb)
3. 这是 Deep Lake 的[白皮书](https://www.deeplake.ai/whitepaper)和[学术论文](https://arxiv.org/pdf/2209.10785.pdf)
4. 这里有一组可供查阅的额外资源：[Deep Lake](https://github.com/activeloopai/deeplake)、[快速开始](https://docs.activeloop.ai/getting-started)和[教程](https://docs.activeloop.ai/hub-tutorials)

## 安装与设置

安装 Python 包：

::: code-group

```bash [pip]
pip install deeplake
```

```bash [uv]
uv add deeplake
```

:::

## VectorStore

```python
from langchain_community.vectorstores import DeepLake
```

查看[使用示例](/oss/python/integrations/vectorstores/activeloop_deeplake)。
