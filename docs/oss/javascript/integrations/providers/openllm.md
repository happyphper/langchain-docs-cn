---
title: OpenLLM
---
OpenLLM 允许开发者通过 **一条命令** 将任何 **开源大语言模型** 作为 **OpenAI 兼容的 API** 端点运行。

- 🔬 为快速和生产环境使用而构建
- 🚂 支持 llama3、qwen2、gemma 等模型，以及许多 **量化** 版本 [完整列表](https://github.com/bentoml/openllm-models)
- ⛓️ OpenAI 兼容的 API
- 💬 内置类 ChatGPT 的 UI
- 🔥 使用最先进的推理后端加速 LLM 解码
- 🌥️ 为企业级云部署（Kubernetes、Docker 和 BentoCloud）做好准备

## 安装与设置

通过 PyPI 安装 OpenLLM 包：

::: code-group

```bash [pip]
pip install openllm
```

```bash [uv]
uv add openllm
```

:::

## LLM

OpenLLM 支持广泛的开源 LLM，也支持为用户自己微调的 LLM 提供服务。使用 `openllm model` 命令查看所有为 OpenLLM 预先优化的可用模型。

## 包装器

有一个 OpenLLM 包装器，支持与正在运行的 OpenLLM 服务器进行交互：

```python
from langchain_community.llms import OpenLLM
```

### 用于 OpenLLM 服务器的包装器

此包装器支持与 OpenLLM 的 OpenAI 兼容端点进行交互。

要运行一个模型，请执行：

```bash
openllm hello
```

包装器用法：

```python
from langchain_community.llms import OpenLLM

llm = OpenLLM(base_url="http://localhost:3000/v1", api_key="na")

llm("What is the difference between a duck and a goose? And why there are so many Goose in Canada?")
```

### 用法

关于 OpenLLM 包装器的更详细演练，请参阅
[示例笔记本](/oss/javascript/integrations/llms/openllm)
