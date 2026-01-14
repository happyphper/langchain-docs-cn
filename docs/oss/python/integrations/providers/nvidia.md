---
title: 英伟达
---
`langchain-nvidia-ai-endpoints` 软件包包含 LangChain 与由 [NVIDIA AI Foundation Models](https://www.nvidia.com/en-us/ai-data-science/foundation-models/) 提供支持、并托管在 [NVIDIA API Catalog](https://build.nvidia.com/) 上的聊天模型和嵌入模型的集成。

NVIDIA AI Foundation 模型是由社区和 NVIDIA 构建的模型，经过优化可在 NVIDIA 加速基础设施上提供最佳性能。您可以使用 API 查询 NVIDIA API Catalog 上可用的实时端点，以从 DGX 托管的云计算环境快速获取结果；或者，您可以使用包含在 NVIDIA AI Enterprise 许可证中的 NVIDIA NIM，从 NVIDIA 的 API 目录下载模型。在本地运行模型的能力使您的企业能够拥有自定义内容的所有权，并完全控制您的知识产权和 AI 应用程序。

NIM 微服务以每个模型/模型系列为基础打包为容器镜像，并通过 [NVIDIA NGC Catalog](https://catalog.ngc.nvidia.com/) 作为 NGC 容器镜像分发。NIM 微服务的核心是提供交互式 API 以在 AI 模型上运行推理的容器。

请使用本文档学习如何安装 `langchain-nvidia-ai-endpoints` 软件包，并将其用于文本生成和嵌入模型的一些常见功能。

## 安装软件包

```bash
pip install -qU langchain-nvidia-ai-endpoints
```

## 访问 NVIDIA API Catalog

要获取对 NVIDIA API Catalog 的访问权限，请执行以下操作：

1.  在 [NVIDIA API Catalog](https://build.nvidia.com/) 上创建一个免费帐户并登录。
2.  单击您的个人资料图标，然后单击 **API Keys**。**API Keys** 页面将出现。
3.  单击 **Generate API Key**。**Generate API Key** 窗口将出现。
4.  单击 **Generate Key**。您应该会看到 **API Key Granted**，并且您的密钥会出现。
5.  复制密钥并将其保存为 `NVIDIA_API_KEY`。
6.  要验证您的密钥，请使用以下代码。

```python
import getpass
import os

if os.environ.get("NVIDIA_API_KEY", "").startswith("nvapi-"):
    print("Valid NVIDIA_API_KEY already in environment. Delete to reset")
else:
    nvapi_key = getpass.getpass("NVAPI Key (starts with nvapi-): ")
    assert nvapi_key.startswith(
        "nvapi-"
    ), f"{nvapi_key[:5]}... is not a valid key"
    os.environ["NVIDIA_API_KEY"] = nvapi_key
```

现在，您可以使用您的密钥访问 NVIDIA API Catalog 上的端点了。

## 使用 API Catalog

```python
from langchain_nvidia_ai_endpoints import ChatNVIDIA

llm = ChatNVIDIA(model="mistralai/mixtral-8x22b-instruct-v0.1")
result = llm.invoke("Write a ballad about LangChain.")
print(result.content)
```

## 使用 NVIDIA NIM 微服务进行自托管

当您准备好部署 AI 应用程序时，可以使用 NVIDIA NIM 自托管模型。有关更多信息，请参阅 [NVIDIA NIM Microservices](https://www.nvidia.com/en-us/ai-data-science/products/nim-microservices/)。

以下代码连接到本地托管的 NIM 微服务。

```python
from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings, NVIDIARerank

# 连接到运行在 localhost:8000 的聊天 NIM，并指定模型
llm = ChatNVIDIA(base_url="http://localhost:8000/v1", model="meta/llama3-8b-instruct")

# 连接到运行在 localhost:8080 的嵌入 NIM
embedder = NVIDIAEmbeddings(base_url="http://localhost:8080/v1")

# 连接到运行在 localhost:2016 的重新排序 NIM
ranker = NVIDIARerank(base_url="http://localhost:2016/v1")
```

## 相关主题

- [`langchain-nvidia-ai-endpoints` 包 README](https://github.com/langchain-ai/langchain-nvidia/blob/main/libs/ai-endpoints/README.md)
- [NVIDIA NIM 大型语言模型 (LLMs) 概述](https://docs.nvidia.com/nim/large-language-models/latest/introduction.html)
- [NeMo Retriever 嵌入 NIM 概述](https://docs.nvidia.com/nim/nemo-retriever/text-embedding/latest/overview.html)
- [NeMo Retriever 重排序 NIM 概述](https://docs.nvidia.com/nim/nemo-retriever/text-reranking/latest/overview.html)
- [用于 RAG 工作流的 `ChatNVIDIA` 模型](/oss/python/integrations/chat/nvidia_ai_endpoints)
- [用于 RAG 工作流的 `NVIDIAEmbeddings` 模型](/oss/python/integrations/text_embedding/nvidia_ai_endpoints)
