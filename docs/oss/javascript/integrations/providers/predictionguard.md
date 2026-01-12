---
title: Prediction Guard
---
本页介绍了如何在 LangChain 中使用 Prediction Guard 生态系统。
内容分为两部分：安装与设置，以及特定 Prediction Guard 封装器的参考。

该集成维护在 [langchain-predictionguard](https://github.com/predictionguard/langchain-predictionguard) 包中。

## 安装与设置

- 安装 Prediction Guard LangChain 合作伙伴包：

::: code-group

```bash [pip]
pip install langchain-predictionguard
```

```bash [uv]
uv add langchain-predictionguard
```

:::

- 获取 Prediction Guard API 密钥（如[此处](https://docs.predictionguard.com/)所述）并将其设置为环境变量 (`PREDICTIONGUARD_API_KEY`)

## Prediction Guard LangChain 集成
|API|描述|端点文档| 导入方式                                                  | 使用示例                                                                 |
|---|---|---|---------------------------------------------------------|-------------------------------------------------------------------------------|
|Chat|构建聊天机器人|[Chat](https://docs.predictionguard.com/api-reference/api-reference/chat-completions)| `from langchain_predictionguard import ChatPredictionGuard` | [ChatPredictionGuard.ipynb](/oss/javascript/integrations/chat/predictionguard)             |
|Completions|生成文本|[Completions](https://docs.predictionguard.com/api-reference/api-reference/completions)| `from langchain_predictionguard import PredictionGuard` | [PredictionGuard.ipynb](/oss/javascript/integrations/llms/predictionguard)                     |
|Text Embedding|将字符串嵌入为向量|[Embeddings](https://docs.predictionguard.com/api-reference/api-reference/embeddings)| `from langchain_predictionguard import PredictionGuardEmbeddings` | [PredictionGuardEmbeddings.ipynb](/oss/javascript/integrations/text_embedding/predictionguard) |

## 快速开始

## 聊天模型

### Prediction Guard Chat

查看[使用示例](/oss/javascript/integrations/chat/predictionguard)

```python
from langchain_predictionguard import ChatPredictionGuard
```

#### 用法

```python
# 如果未传递 predictionguard_api_key，默认行为是使用 `PREDICTIONGUARD_API_KEY` 环境变量。
chat = ChatPredictionGuard(model="Hermes-3-Llama-3.1-8B")

chat.invoke("Tell me a joke")
```

## 嵌入模型

### Prediction Guard Embeddings

查看[使用示例](/oss/javascript/integrations/text_embedding/predictionguard)

```python
from langchain_predictionguard import PredictionGuardEmbeddings
```

#### 用法

```python
# 如果未传递 predictionguard_api_key，默认行为是使用 `PREDICTIONGUARD_API_KEY` 环境变量。
embeddings = PredictionGuardEmbeddings(model="bridgetower-large-itm-mlm-itc")

text = "This is an embedding example."
output = embeddings.embed_query(text)
```

## 大语言模型 (LLMs)

### Prediction Guard LLM

查看[使用示例](/oss/javascript/integrations/llms/predictionguard)

```python
from langchain_predictionguard import PredictionGuard
```

#### 用法

```python
# 如果未传递 predictionguard_api_key，默认行为是使用 `PREDICTIONGUARD_API_KEY` 环境变量。
llm = PredictionGuard(model="Hermes-2-Pro-Llama-3-8B")

llm.invoke("Tell me a joke about bears")
```
