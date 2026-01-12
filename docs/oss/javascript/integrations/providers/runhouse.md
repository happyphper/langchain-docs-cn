---
title: Runhouse
---
本页介绍如何在 LangChain 中使用 [Runhouse](https://github.com/run-house/runhouse) 生态系统。
内容分为三个部分：安装与设置、LLMs 和 Embeddings。

## 安装与设置
- 使用 `pip install runhouse` 安装 Python SDK
- 如需使用按需集群，请通过 `sky check` 检查您的云凭证

## 自托管 LLMs
对于基本的自托管 LLM，您可以使用 `SelfHostedHuggingFaceLLM` 类。对于更
自定义的 LLMs，您可以使用 `SelfHostedPipeline` 父类。

```python
from langchain_community.llms import SelfHostedPipeline, SelfHostedHuggingFaceLLM
```

有关自托管 LLMs 的详细步骤，请参阅 [此笔记本](/oss/javascript/integrations/llms/runhouse)

## 自托管 Embeddings
通过 Runhouse，有几种方式可以在 LangChain 中使用自托管 Embeddings。

对于来自 Hugging Face Transformers 模型的基本自托管 Embedding，您可以使用
`SelfHostedEmbedding` 类。

```python
from langchain_community.llms import SelfHostedPipeline, SelfHostedHuggingFaceLLM
```

有关自托管 Embeddings 的详细步骤，请参阅 [此笔记本](/oss/javascript/integrations/text_embedding/self-hosted)
