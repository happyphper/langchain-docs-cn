---
title: Oracle 云基础设施 (OCI)
---
与 [Oracle Cloud Infrastructure](https://www.oracle.com/artificial-intelligence/) 相关的 `LangChain` 集成。

## OCI Generative AI
> Oracle Cloud Infrastructure (OCI) [Generative AI](https://docs.oracle.com/en-us/iaas/Content/generative-ai/home.htm) 是一项全托管服务，提供一套最先进的、可定制的大型语言模型 (LLMs)，涵盖广泛的用例，并通过单一 API 提供。
> 使用 OCI Generative AI 服务，您可以访问开箱即用的预训练模型，也可以在专用的 AI 集群上基于您自己的数据创建和托管您自己微调的自定义模型。

要使用此功能，您需要安装最新的 `oci` Python SDK 和 langchain_community 包。

::: code-group

```bash [pip]
pip install -U oci langchain-community
```

```bash [uv]
uv add oci langchain-community
```

:::

查看 [聊天](/oss/integrations/llms/oci_generative_ai)、[补全](/oss/integrations/chat/oci_generative_ai) 和 [嵌入](/oss/integrations/text_embedding/oci_generative_ai) 的使用示例。

```python
from langchain_community.chat_models import ChatOCIGenAI

from langchain_community.llms import OCIGenAI

from langchain_community.embeddings import OCIGenAIEmbeddings
```

## OCI Data Science 模型部署端点

> [OCI Data Science](https://docs.oracle.com/en-us/iaas/data-science/using/home.htm) 是一个面向数据科学团队的全托管、无服务器平台。使用 OCI Data Science 平台，您可以构建、训练和管理机器学习模型，然后使用 [OCI Data Science 模型部署服务](https://docs.oracle.com/en-us/iaas/data-science/using/model-dep-about.htm) 将它们部署为 OCI 模型部署端点。

要使用此功能，您需要安装最新的 `oracle-ads` Python SDK。

::: code-group

```bash [pip]
pip install -U oracle-ads
```

```bash [uv]
uv add oracle-ads
```

:::

查看 [聊天](/oss/integrations/chat/oci_data_science) 和 [补全](/oss/integrations/llms/oci_model_deployment_endpoint) 的使用示例。

```python
from langchain_community.chat_models import ChatOCIModelDeployment

from langchain_community.llms import OCIModelDeploymentLLM
```
