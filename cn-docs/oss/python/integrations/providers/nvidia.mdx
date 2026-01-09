---
title: 英伟达
---
`langchain-nvidia-ai-endpoints` 包包含了 LangChain 与 NVIDIA NIM 推理微服务上的模型构建应用程序的集成。NIM 支持来自社区和 NVIDIA 的跨领域模型，如聊天、嵌入和重排序模型。这些模型由 NVIDIA 优化，以在 NVIDIA 加速基础设施上提供最佳性能，并部署为 NIM，这是一种易于使用的预构建容器，可在 NVIDIA 加速基础设施上使用单个命令随处部署。

NVIDIA 托管的 NIM 部署可在 [NVIDIA API 目录](https://build.nvidia.com/) 上进行测试。测试后，可以使用 NVIDIA AI Enterprise 许可证从 NVIDIA 的 API 目录导出 NIM，并在本地或云端运行，使企业能够拥有并完全控制其 IP 和 AI 应用程序。

NIM 以每个模型为基础打包为容器镜像，并通过 NVIDIA NGC 目录作为 NGC 容器镜像分发。NIM 的核心是为 AI 模型运行推理提供简单、一致且熟悉的 API。

以下是一个关于如何使用文本生成和嵌入模型常见功能的示例。

## 安装

```python
pip install -qU langchain-nvidia-ai-endpoints
```

## 设置

**开始使用：**

1.  在托管 NVIDIA AI Foundation 模型的 [NVIDIA](https://build.nvidia.com/) 上创建一个免费账户。
2.  点击您选择的模型。
3.  在输入部分选择 Python 标签页，然后点击 `Get API Key`。接着点击 `Generate Key`。
4.  复制并保存生成的密钥为 `NVIDIA_API_KEY`。之后，您应该就能访问这些端点了。

```python
import getpass
import os

if not os.environ.get("NVIDIA_API_KEY", "").startswith("nvapi-"):
    nvidia_api_key = getpass.getpass("Enter your NVIDIA API key: ")
    assert nvidia_api_key.startswith("nvapi-"), f"{nvidia_api_key[:5]}... is not a valid key"
    os.environ["NVIDIA_API_KEY"] = nvidia_api_key
```

## 使用 NVIDIA API 目录

```python
from langchain_nvidia_ai_endpoints import ChatNVIDIA

llm = ChatNVIDIA(model="mistralai/mixtral-8x22b-instruct-v0.1")
result = llm.invoke("写一首关于 LangChain 的民谣。")
print(result.content)
```

使用该 API，您可以查询 NVIDIA API 目录上可用的实时端点，以从 DGX 托管的云计算环境中快速获得结果。所有模型都可以访问源代码，并且可以使用 NVIDIA NIM（NVIDIA AI Enterprise 的一部分）部署在您自己的计算集群上，如下一节 [使用 NVIDIA NIMs](#working-with-nvidia-nims) 所示。

## 使用 NVIDIA NIMs
当准备部署时，您可以使用 NVIDIA NIM（包含在 NVIDIA AI Enterprise 软件许可证中）自托管模型，并在任何地方运行它们，从而拥有您的自定义项并完全控制您的知识产权 (IP) 和 AI 应用程序。

[了解更多关于 NIMs 的信息](https://developer.nvidia.com/blog/nvidia-nim-offers-optimized-inference-microservices-for-deploying-ai-models-at-scale/)

```python
from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings, NVIDIARerank

# 连接到运行在 localhost:8000 的聊天 NIM，指定模型
llm = ChatNVIDIA(base_url="http://localhost:8000/v1", model="meta/llama3-8b-instruct")

# 连接到运行在 localhost:8080 的嵌入 NIM
embedder = NVIDIAEmbeddings(base_url="http://localhost:8080/v1")

# 连接到运行在 localhost:2016 的重排序 NIM
ranker = NVIDIARerank(base_url="http://localhost:2016/v1")
```

## 使用 NVIDIA AI Foundation 端点

LangChain 直接支持一部分 NVIDIA AI Foundation 模型，并提供熟悉的 API。

当前支持的活动模型可以在 [API 目录](https://build.nvidia.com/) 中找到。

**以下示例可能对您入门有所帮助：**
- **[`ChatNVIDIA` 模型](/oss/integrations/chat/nvidia_ai_endpoints)。**
- **[用于 RAG 工作流的 `NVIDIAEmbeddings` 模型](/oss/integrations/text_embedding/nvidia_ai_endpoints)。**
