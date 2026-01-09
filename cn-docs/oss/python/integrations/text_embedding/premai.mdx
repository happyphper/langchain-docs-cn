---
title: PremAI
---
[PremAI](https://premai.io/) 是一个一体化平台，旨在简化由生成式 AI 驱动的、健壮且可用于生产的应用程序的创建过程。通过简化开发流程，PremAI 让您能够专注于提升用户体验并推动应用程序的整体增长。您可以点击[此处](https://docs.premai.io/quick-start)快速开始使用我们的平台。

### 安装与设置

我们首先安装 `langchain` 和 `premai-sdk`。您可以输入以下命令进行安装：

```bash
pip install premai langchain
```

在继续之前，请确保您已在 PremAI 上创建账户并已创建一个项目。如果还没有，请参考[快速入门](https://docs.premai.io/introduction)指南开始使用 PremAI 平台。创建您的第一个项目并获取您的 API 密钥。

## PremEmbeddings

在本节中，我们将讨论如何通过 LangChain 的 `PremEmbeddings` 来使用不同的嵌入模型。让我们从导入模块和设置 API 密钥开始。

```python
# 让我们先导入所需的模块并定义我们的嵌入对象

from langchain_community.embeddings import PremAIEmbeddings
```

导入所需模块后，让我们来设置客户端。目前，我们假设 `project_id` 是 `8`。但请确保使用您自己的项目 ID，否则会报错。

> 注意：与 [ChatPremAI](https://python.langchain.com/v0.1/docs/integrations/chat/premai/) 不同，在 PremAIEmbeddings 中设置 `model_name` 参数是强制性的。

```python
import getpass
import os

if os.environ.get("PREMAI_API_KEY") is None:
    os.environ["PREMAI_API_KEY"] = getpass.getpass("PremAI API Key:")
```

```python
model = "text-embedding-3-large"
embedder = PremAIEmbeddings(project_id=8, model=model)
```

我们支持许多先进的嵌入模型。您可以在此处查看我们支持的 LLM 和嵌入模型[列表](https://docs.premai.io/get-started/supported-models)。在本例中，我们选择 `text-embedding-3-large` 模型。

```python
query = "Hello, this is a test query"
query_result = embedder.embed_query(query)

# 让我们打印查询嵌入向量的前五个元素

print(query_result[:5])
```

```text
[-0.02129288576543331, 0.0008162345038726926, -0.004556538071483374, 0.02918623760342598, -0.02547479420900345]
```

最后，让我们嵌入一个文档

```python
documents = ["This is document1", "This is document2", "This is document3"]

doc_result = embedder.embed_documents(documents)

# 与之前的结果类似，让我们打印第一个文档向量的前五个元素

print(doc_result[0][:5])
```

```text
[-0.0030691148713231087, -0.045334383845329285, -0.0161729846149683, 0.04348714277148247, -0.0036920777056366205]
```
