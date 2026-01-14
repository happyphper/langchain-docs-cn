---
title: Huggingface 端点
---
[Hugging Face Hub](https://huggingface.co/docs/hub/index) 是一个平台，拥有超过 12 万个模型、2 万个数据集和 5 万个演示应用（Spaces），所有内容都是开源且公开可用的。它是一个在线平台，人们可以轻松地协作并共同构建机器学习项目。

`Hugging Face Hub` 还提供了各种端点来构建机器学习应用。
本示例展示了如何连接到不同类型的端点。

特别是，文本生成推理由 [Text Generation Inference](https://github.com/huggingface/text-generation-inference) 提供支持：这是一个用 Rust、Python 和 gRPC 构建的自定义服务器，用于实现极速文本生成推理。

```python
from langchain_huggingface import HuggingFaceEndpoint
```

## 安装与设置

要使用此功能，您需要安装 `huggingface_hub` Python [包](https://huggingface.co/docs/huggingface_hub/installation)。

```python
pip install -qU huggingface_hub
```

```python
# 获取令牌：https://huggingface.co/docs/api-inference/quicktour#get-your-api-token

from getpass import getpass

HUGGINGFACEHUB_API_TOKEN = getpass()
```

```python
import os

os.environ["HUGGINGFACEHUB_API_TOKEN"] = HUGGINGFACEHUB_API_TOKEN
```

## 准备示例

```python
from langchain_huggingface import HuggingFaceEndpoint
```

```python
from langchain_classic.chains import LLMChain
from langchain_core.prompts import PromptTemplate
```

```python
question = "Who won the FIFA World Cup in the year 1994? "

template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)
```

## 示例

以下是如何访问无服务器 [Inference Providers](https://huggingface.co/docs/inference-providers) API 的 `HuggingFaceEndpoint` 集成的示例。

```python
repo_id = "deepseek-ai/DeepSeek-R1-0528"

llm = HuggingFaceEndpoint(
    repo_id=repo_id,
    max_length=128,
    temperature=0.5,
    huggingfacehub_api_token=HUGGINGFACEHUB_API_TOKEN,
    provider="auto",  # 在此处设置您的提供商 hf.co/settings/inference-providers
    # provider="hyperbolic",
    # provider="nebius",
    # provider="together",
)
llm_chain = prompt | llm
print(llm_chain.invoke({"question": question}))
```

## 专用端点

免费的无服务器 API 让您可以快速实现解决方案并进行迭代，但对于重度使用场景，它可能会受到速率限制，因为负载是与其他请求共享的。

对于企业级工作负载，最佳选择是使用 [Inference Endpoints - Dedicated](https://huggingface.co/inference-endpoints/dedicated)。
这使您可以访问一个完全托管的基础设施，提供更高的灵活性和速度。这些资源附带持续支持和正常运行时间保证，以及自动扩缩容等选项。

```python
# 在下方设置您的推理端点 URL
your_endpoint_url = "https://fayjubiy2xqn36z0.us-east-1.aws.endpoints.huggingface.cloud"
```

```python
llm = HuggingFaceEndpoint(
    endpoint_url=f"{your_endpoint_url}",
    max_new_tokens=512,
    top_k=10,
    top_p=0.95,
    typical_p=0.95,
    temperature=0.01,
    repetition_penalty=1.03,
)
llm("What did foo say about bar?")
```

### 流式处理

```python
from langchain_core.callbacks import StreamingStdOutCallbackHandler
from langchain_huggingface import HuggingFaceEndpoint

llm = HuggingFaceEndpoint(
    endpoint_url=f"{your_endpoint_url}",
    max_new_tokens=512,
    top_k=10,
    top_p=0.95,
    typical_p=0.95,
    temperature=0.01,
    repetition_penalty=1.03,
    streaming=True,
)
llm("What did foo say about bar?", callbacks=[StreamingStdOutCallbackHandler()])
```

同一个 `HuggingFaceEndpoint` 类也可以与本地运行的、为 LLM 提供服务的 [HuggingFace TGI 实例](https://github.com/huggingface/text-generation-inference/blob/main/docs/source/index.md) 一起使用。有关对各种硬件（GPU、TPU、Gaudi...）支持的详细信息，请查看 TGI [仓库](https://github.com/huggingface/text-generation-inference/tree/main)。
