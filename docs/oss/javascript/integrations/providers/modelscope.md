---
title: 魔搭社区
---
>[ModelScope](https://www.modelscope.cn/home) 是一个大型的模型与数据集仓库。

本页介绍了如何在 LangChain 中使用 modelscope 生态系统。
内容分为两部分：安装与设置，以及对特定 modelscope 封装器的引用。

## 安装

::: code-group

```bash [pip]
pip install -U langchain-modelscope-integration
```

```bash [uv]
uv add langchain-modelscope-integration
```

:::

前往 [ModelScope](https://modelscope.cn/) 注册并生成一个 [SDK 令牌](https://modelscope.cn/my/myaccesstoken)。完成后，请设置 `MODELSCOPE_SDK_TOKEN` 环境变量：

```bash
export MODELSCOPE_SDK_TOKEN=<your_sdk_token>
```

## 聊天模型

`ModelScopeChatEndpoint` 类提供了来自 ModelScope 的聊天模型。可用的模型列表请参见[此处](https://www.modelscope.cn/docs/model-service/API-Inference/intro)。

```python
from langchain_modelscope import ModelScopeChatEndpoint

llm = ModelScopeChatEndpoint(model="Qwen/Qwen2.5-Coder-32B-Instruct")
llm.invoke("Sing a ballad of LangChain.")
```

## 嵌入模型

`ModelScopeEmbeddings` 类提供了来自 ModelScope 的嵌入模型。

```python
from langchain_modelscope import ModelScopeEmbeddings

embeddings = ModelScopeEmbeddings(model_id="damo/nlp_corom_sentence-embedding_english-base")
embeddings.embed_query("What is the meaning of life?")
```

## 大语言模型
`ModelScopeEndpoint` 类提供了来自 ModelScope 的大语言模型。

```python
from langchain_modelscope import ModelScopeEndpoint

llm = ModelScopeEndpoint(model="Qwen/Qwen2.5-Coder-32B-Instruct")
llm.invoke("The meaning of life is")
```
