---
title: 英伟达
---
这将帮助您开始使用 NVIDIA 模型。有关所有 `NVIDIA` 功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/nvidia_ai_endpoints/llms/langchain_nvidia_ai_endpoints.chat_models.NVIDIA.html)。

## 概述

`langchain-nvidia-ai-endpoints` 包包含了用于在 NVIDIA NIM 推理微服务上使用模型构建应用程序的 LangChain 集成。这些模型由 NVIDIA 优化，旨在为 NVIDIA 加速基础设施提供最佳性能，并部署为 NIM（NVIDIA Inference Microservice）。NIM 是易于使用的预构建容器，可在 NVIDIA 加速基础设施上使用单个命令随处部署。

您可以在 [NVIDIA API 目录](https://build.nvidia.com/) 上测试 NVIDIA 托管的 NIM 部署。测试后，可以使用 NVIDIA AI Enterprise 许可证从 NVIDIA 的 API 目录导出 NIM，并在本地或云端运行，使企业能够拥有并完全控制其 IP 和 AI 应用程序。

NIM 按模型打包为容器镜像，并通过 NVIDIA NGC 目录作为 NGC 容器镜像分发。NIM 的核心是为 AI 模型运行推理提供简单、一致且熟悉的 API。

本示例将介绍如何使用 LangChain 通过 `NVIDIA` 类与 NVIDIA 支持的模型进行交互。

有关通过此 API 访问 LLM 模型的更多信息，请查看 [NVIDIA](https://python.langchain.com/docs/integrations/llms/nvidia_ai_endpoints/) 文档。

### 集成详情

| 类 | 包 | 本地 | 可序列化 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: | :---: |
| [NVIDIA](https://python.langchain.com/api_reference/nvidia_ai_endpoints/llms/langchain_nvidia_ai_endpoints.chat_models.ChatNVIDIA.html) | [langchain-nvidia-ai-endpoints](https://python.langchain.com/api_reference/nvidia_ai_endpoints/index.html) | ✅ | beta | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain_nvidia_ai_endpoints?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain_nvidia_ai_endpoints?style=flat-square&label=%20) |

### 模型特性

| [图像输入](/oss/javascript/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/javascript/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/javascript/langchain/models#token-usage) | [对数概率](/oss/javascript/langchain/models#log-probabilities) |
| :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

## 设置

**开始之前：**

1.  在托管 NVIDIA AI Foundation 模型的 [NVIDIA](https://build.nvidia.com/) 上创建一个免费账户。
2.  点击您选择的模型。
3.  在 `Input` 下选择 `Python` 选项卡，然后点击 `Get API Key`。接着点击 `Generate Key`。
4.  复制并保存生成的密钥为 `NVIDIA_API_KEY`。之后，您应该就可以访问端点了。

### 凭据

```python
import getpass
import os

if not os.getenv("NVIDIA_API_KEY"):
    # Note: the API key should start with "nvapi-"
    os.environ["NVIDIA_API_KEY"] = getpass.getpass("Enter your NVIDIA API key: ")
```

### 安装

LangChain NVIDIA AI Endpoints 集成位于 `langchain-nvidia-ai-endpoints` 包中：

```python
pip install -qU langchain-nvidia-ai-endpoints
```

## 实例化

完整功能请参阅 [LLM](/oss/javascript/langchain/models)。

```python
from langchain_nvidia_ai_endpoints import NVIDIA
```

```python
llm = NVIDIA().bind(max_tokens=256)
llm
```

## 调用

```python
prompt = "# Function that does quicksort written in Rust without comments:"
```

```python
print(llm.invoke(prompt))
```

## 流式传输、批处理和异步

这些模型原生支持流式传输，并且与所有 LangChain LLM 一样，它们公开了一个批处理方法来处理并发请求，以及用于 invoke、stream 和 batch 的异步方法。下面是一些示例。

```python
for chunk in llm.stream(prompt):
    print(chunk, end="", flush=True)
```

```python
llm.batch([prompt])
```

```python
await llm.ainvoke(prompt)
```

```python
async for chunk in llm.astream(prompt):
    print(chunk, end="", flush=True)
```

```python
await llm.abatch([prompt])
```

```python
async for chunk in llm.astream_log(prompt):
    print(chunk)
```

```python
response = llm.invoke(
    "X_train, y_train, X_test, y_test = train_test_split(X, y, test_size=0.1) #Train a logistic regression model, predict the labels on the test set and compute the accuracy score"
)
print(response)
```

## 支持的模型

查询 `available_models` 仍将返回您的 API 凭据提供的所有其他模型。

```python
NVIDIA.get_available_models()
# llm.get_available_models()
```

---

## API 参考

有关所有 `NVIDIA` 功能和配置的详细文档，请参阅 API 参考：[python.langchain.com/api_reference/nvidia_ai_endpoints/llms/langchain_nvidia_ai_endpoints.llms.NVIDIA.html](https://python.langchain.com/api_reference/nvidia_ai_endpoints/llms/langchain_nvidia_ai_endpoints.llms.NVIDIA.html)
