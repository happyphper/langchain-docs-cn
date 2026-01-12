---
title: Xorbits Inference (Xinference)
---
本页面演示了如何将 [Xinference](https://github.com/xorbitsai/inference) 与 LangChain 结合使用。

`Xinference` 是一个功能强大且用途广泛的库，旨在为大型语言模型（LLM）、语音识别模型和多模态模型提供服务，即使在您的笔记本电脑上也能运行。通过 Xorbits Inference，您只需一条命令即可轻松部署和服务您自己的模型或内置的最先进模型。

## 安装与设置

可以通过 pip 从 PyPI 安装 Xinference：

::: code-group

```bash [pip]
pip install "xinference[all]"
```

```bash [uv]
uv add "xinference[all]"
```

:::

## LLM

Xinference 支持多种与 GGML 兼容的模型，包括 chatglm、baichuan、whisper、vicuna 和 orca。要查看内置模型，请运行以下命令：

```bash
xinference list --all
```

### Xinference 封装器

您可以通过运行以下命令启动一个本地 Xinference 实例：

```bash
xinference
```

您也可以在分布式集群中部署 Xinference。为此，首先在您要运行它的服务器上启动一个 Xinference 监督器（supervisor）：

```bash
xinference-supervisor -H "${supervisor_host}"
```

然后，在您要运行 Xinference 的其他每台服务器上启动 Xinference 工作器（worker）：

```bash
xinference-worker -e "http://${supervisor_host}:9997"
```

您也可以通过运行以下命令启动一个本地 Xinference 实例：

```bash
xinference
```

一旦 Xinference 运行起来，就可以通过 CLI 或 Xinference 客户端访问一个用于模型管理的端点。

对于本地部署，端点将是 http://localhost:9997。

对于集群部署，端点将是 http://$\{supervisor_host\}:9997。

然后，您需要启动一个模型。您可以指定模型名称和其他属性，包括 model_size_in_billions 和 quantization。您可以使用命令行界面（CLI）来完成此操作。例如：

```bash
xinference launch -n orca -s 3 -q q4_0
```

将返回一个模型 uid。

使用示例：

```python
from langchain_community.llms import Xinference

llm = Xinference(
    server_url="http://0.0.0.0:9997",
    model_uid = {model_uid} # 将 model_uid 替换为启动模型时返回的模型 UID
)

llm(
    prompt="Q: where can we visit in the capital of France? A:",
    generate_config={"max_tokens": 1024, "stream": True},
)
```

### 用法

更多信息和详细示例，请参阅 [xinference LLMs 示例](/oss/python/integrations/llms/xinference)。

### 嵌入

Xinference 也支持嵌入查询和文档。更详细的演示请参阅 [xinference embeddings 示例](/oss/python/integrations/text_embedding/xinference)。

### Xinference LangChain 合作伙伴包安装

使用以下命令安装集成包：

::: code-group

```bash [pip]
pip install langchain-xinference
```

```bash [uv]
uv add langchain-xinference
```

:::

## 聊天模型

```python
from langchain_xinference.chat_models import ChatXinference
```

## LLM

```python
from langchain_xinference.llms import Xinference
```
