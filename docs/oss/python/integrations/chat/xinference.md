---
title: ChatXinference
---
[Xinference](https://github.com/xorbitsai/inference) 是一个功能强大且用途广泛的库，旨在为大型语言模型（LLM）、语音识别模型和多模态模型提供服务，甚至可以在您的笔记本电脑上运行。它支持多种与 GGML 兼容的模型，例如 chatglm、baichuan、whisper、vicuna、orca 等。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | [JS 支持] | 下载 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| ChatXinference| langchain-xinference | ❌ | ✅ | ✅ | ✅ |

### 模型特性

| [工具调用](/oss/python/langchain/tools/) | [结构化输出](/oss/python/langchain/structured-output) | [图像输入](/oss/python/langchain/messages#multimodal) | 音频输入 | 视频输入 | [令牌级流式传输](/oss/python/langchain/streaming/) | 原生异步 | [令牌使用量](/oss/python/langchain/models#token-usage) | [对数概率](/oss/python/langchain/models#log-probabilities) |
| :---: |:----------------------------------------------------:| :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ |                          ✅                           | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |

## 设置

通过 PyPI 安装 `Xinference`：

```python
pip install -qU  "xinference[all]"
```

### 在本地或分布式集群中部署 Xinference

对于本地部署，运行 `xinference`。

要在集群中部署 Xinference，首先使用 `xinference-supervisor` 启动一个 Xinference 监督器。您也可以使用 `-p` 选项指定端口，使用 `-H` 选项指定主机。默认端口是 8080，默认主机是 0.0.0.0。

然后，在您希望运行模型的每台服务器上，使用 `xinference-worker` 启动 Xinference 工作器。

您可以查阅 [Xinference](https://github.com/xorbitsai/inference) 的 README 文件以获取更多信息。

### 包装器

要在 LangChain 中使用 Xinference，您需要首先启动一个模型。您可以使用命令行界面（CLI）来完成此操作：

```python
%xinference launch -n vicuna-v1.3 -f ggmlv3 -q q4_0
```

```text
Model uid: 7167b2b0-2a04-11ee-83f0-d29396a3f064
```

系统会返回一个模型 UID 供您使用。现在您可以在 LangChain 中使用 Xinference：

## 安装

LangChain Xinference 集成位于 `langchain-xinference` 包中：

```python
pip install -qU langchain-xinference
```

请确保您使用的是最新版本的 Xinference 以获得结构化输出支持。

## 实例化

现在我们可以实例化我们的模型对象并生成聊天补全：

```python
from langchain_xinference.chat_models import ChatXinference

llm = ChatXinference(
    server_url="your_server_url", model_uid="7167b2b0-2a04-11ee-83f0-d29396a3f064"
)

llm.invoke(
    "Q: where can we visit in the capital of France?",
    config={"max_tokens": 1024},
)
```

## 调用

```python
from langchain.messages import HumanMessage, SystemMessage
from langchain_xinference.chat_models import ChatXinference

llm = ChatXinference(
    server_url="your_server_url", model_uid="7167b2b0-2a04-11ee-83f0-d29396a3f064"
)

system_message = "You are a helpful assistant that translates English to French. Translate the user sentence."
human_message = "I love programming."

llm.invoke([HumanMessage(content=human_message), SystemMessage(content=system_message)])
```

---

## API 参考

有关 ChatXinference 所有功能和配置的详细文档，请参阅 API 参考：[github.com/TheSongg/langchain-xinference](https://github.com/TheSongg/langchain-xinference)
