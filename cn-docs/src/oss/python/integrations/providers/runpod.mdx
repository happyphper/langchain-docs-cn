---
title: Runpod
---
[RunPod](https://www.runpod.io/) 提供 GPU 云基础设施，包括专为部署和扩展 AI 模型而优化的 Serverless 端点。

本指南介绍如何使用 `langchain-runpod` 集成包，将 LangChain 应用程序连接到托管在 [RunPod Serverless](https://www.runpod.io/serverless-gpu) 上的模型。

该集成提供了标准语言模型（LLMs）和聊天模型两种接口。

## 安装

安装专用的合作伙伴包：

```python
pip install -qU langchain-runpod
```

## 设置

### 1. 在 RunPod 上部署端点

- 访问您的 [RunPod Serverless 控制台](https://www.runpod.io/console/serverless/user/endpoints)。
- 创建一个“新端点”，选择适合您模型和预期输入/输出格式的 GPU 和模板（例如，vLLM、TGI、text-generation-webui）（请参阅组件指南或包的 [README](https://github.com/runpod/langchain-runpod)）。
- 配置设置并部署。
- **关键步骤：部署后，复制端点 ID**。

### 2. 设置 API 凭证

集成需要您的 RunPod API 密钥和端点 ID。将它们设置为环境变量以实现安全访问：

```python
import getpass
import os

os.environ["RUNPOD_API_KEY"] = getpass.getpass("Enter your RunPod API Key: ")
os.environ["RUNPOD_ENDPOINT_ID"] = input("Enter your RunPod Endpoint ID: ")
```

*（可选）* 如果为 LLM 和聊天模型使用不同的端点，您可能需要设置 `RUNPOD_CHAT_ENDPOINT_ID` 或在初始化时直接传递端点 ID。

## 组件

此包提供两个主要组件：

### 1. LLM

用于与标准文本补全模型交互。

详细用法请参阅 [RunPod LLM 集成指南](/oss/integrations/llms/runpod)

```python
from langchain_runpod import RunPod

# 示例初始化（使用环境变量）
llm = RunPod(model_kwargs={"max_new_tokens": 100})  # 在此处添加生成参数

# 示例调用
try:
    response = llm.invoke("Write a short poem about the cloud.")
    print(response)
except Exception as e:
    print(
        f"Error invoking LLM: {e}. Ensure endpoint ID and API key are correct and endpoint is active."
    )
```

### 2. 聊天模型

用于与会话模型交互。

详细用法和功能支持请参阅 [RunPod 聊天模型集成指南](/oss/integrations/chat/runpod)。

```python
from langchain.messages import HumanMessage
from langchain_runpod import ChatRunPod

# 示例初始化（使用环境变量）
chat = ChatRunPod(model_kwargs={"temperature": 0.8})  # 在此处添加生成参数

# 示例调用
try:
    response = chat.invoke(
        [HumanMessage(content="Explain RunPod Serverless in one sentence.")]
    )
    print(response.content)
except Exception as e:
    print(
        f"Error invoking Chat Model: {e}. Ensure endpoint ID and API key are correct and endpoint is active."
    )
```
