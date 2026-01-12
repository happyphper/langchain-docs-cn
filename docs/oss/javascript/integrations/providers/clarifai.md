---
title: Clarifai
---
>[Clarifai](https://clarifai.com) 是最早的深度学习平台之一，成立于 2013 年。Clarifai 提供了一个涵盖完整 AI 生命周期的 AI 平台，用于围绕图像、视频、文本和音频数据进行数据探索、数据标注、模型训练、评估和推理。在 LangChain 生态系统中，据我们所知，Clarifai 是唯一一个在生产级平台上同时支持 LLMs、嵌入模型和向量存储的提供商，这使其成为将您的 LangChain 实现投入运营的绝佳选择。

> `Clarifai` 为许多不同的用例提供了数千个 AI 模型。您可以[在此处探索它们](https://clarifai.com/explore)，以找到最适合您用例的模型。这些模型包括由其他提供商（如 OpenAI、Anthropic、Cohere、AI21 等）创建的模型，以及来自开源社区的最先进模型（如 Falcon、InstructorXL 等），以便您将最好的 AI 技术融入您的产品中。您会发现这些模型按创建者的 `user_id` 组织，并归入我们称为应用程序（由 `app_id` 标识）的项目中。除了 `model_id` 和可选的 `version_id` 之外，还需要这些 ID，因此一旦找到最适合您用例的模型，请记下所有这些 ID！
>
> 另外请注意，鉴于有许多用于图像、视频、文本和音频理解的模型，您可以构建一些有趣的 AI 智能体，利用各种 AI 模型作为专家来理解这些数据类型。

## 安装与设置
- 安装 Python SDK：

::: code-group

```bash [pip]
pip install clarifai
```

```bash [uv]
uv add clarifai
```

:::

[注册](https://clarifai.com/signup)一个 Clarifai 账户，然后从您的[安全设置](https://clarifai.com/settings/security)获取个人访问令牌以访问 Clarifai API，并将其设置为环境变量 (`CLARIFAI_PAT`)。

## LLMs

要查找 Clarifai 平台中的 LLMs 选择，您可以[在此处](https://clarifai.com/explore/models?filterData=%5B%7B%22field%22%3A%22model_type_id%22%2C%22value%22%3A%5B%22text-to-text%22%5D%7D%5D&page=1&perPage=24)选择文本到文本模型类型。

```python
from langchain_community.llms import Clarifai
llm = Clarifai(pat=CLARIFAI_PAT, user_id=USER_ID, app_id=APP_ID, model_id=MODEL_ID)
```

更多详细信息，Clarifai LLM 包装器的文档提供了[详细演练](/oss/javascript/integrations/llms/clarifai)。

## 嵌入模型

要查找 Clarifai 平台中的嵌入模型选择，您可以[在此处](https://clarifai.com/explore/models?page=1&perPage=24&filterData=%5B%7B%22field%22%3A%22model_type_id%22%2C%22value%22%3A%5B%22text-embedder%22%5D%7D%5D)选择文本到嵌入模型类型。

LangChain 中有一个 Clarifai 嵌入模型，您可以通过以下方式访问：

```python
from langchain_community.embeddings import ClarifaiEmbeddings
embeddings = ClarifaiEmbeddings(pat=CLARIFAI_PAT, user_id=USER_ID, app_id=APP_ID, model_id=MODEL_ID)
```

查看[使用示例](/oss/javascript/integrations/document_loaders/couchbase)。

## 向量存储

Clarifai 的向量数据库于 2016 年推出，并经过优化以支持实时搜索查询。通过 Clarifai 平台中的工作流，您的数据会自动通过嵌入模型（以及可选的其他模型）进行索引，以便在数据库中进行搜索。您不仅可以通过向量查询数据库，还可以通过元数据匹配、其他 AI 预测概念进行过滤，甚至可以进行地理坐标搜索。只需创建一个应用程序，为您的数据类型选择适当的基础工作流，然后上传数据（通过[此处文档](https://docs.clarifai.com/api-guide/data/create-get-update-delete)中的 API 或 clarifai.com 上的 UI）。

您也可以直接从 LangChain 添加数据，自动索引将为您完成。您会注意到，这与其他向量存储略有不同，在其他向量存储中，您需要在它们的构造函数中提供嵌入模型，并由 LangChain 协调从文本获取嵌入并将其写入索引。使用 Clarifai 的分布式云在后台完成所有索引不仅更方便，而且更具可扩展性。

```python
from langchain_community.vectorstores import Clarifai
clarifai_vector_db = Clarifai.from_texts(user_id=USER_ID, app_id=APP_ID, texts=texts, pat=CLARIFAI_PAT, number_of_docs=NUMBER_OF_DOCS, metadatas = metadatas)
```
更多详细信息，Clarifai 向量存储的文档提供了[详细演练](/oss/javascript/integrations/vectorstores/clarifai)。
